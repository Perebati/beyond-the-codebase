package event

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/google/uuid"
	"github.com/perebati/fc-ms-balances/internal/entity"
	"github.com/perebati/fc-ms-balances/internal/usecase"
)

type BalanceKafkaConsumer struct {
	ConfigMap      *kafka.ConfigMap
	Topics         []string
	BalanceUseCase *usecase.BalanceUseCase
	messageChannel chan *kafka.Message
}

type TransactionMessage struct {
	ID            string  `json:"id"`
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type BalanceUpdatedMessage struct {
	AccountIDFrom        string  `json:"account_id_from"`
	AccountIDTo          string  `json:"account_id_to"`
	BalanceAccountIDFrom float64 `json:"balance_account_id_from"`
	BalanceAccountIDTo   float64 `json:"balance_account_id_to"`
}

func NewBalanceKafkaConsumer(configMap *kafka.ConfigMap, topics []string, balanceUseCase *usecase.BalanceUseCase) *BalanceKafkaConsumer {
	return &BalanceKafkaConsumer{
		ConfigMap:      configMap,
		Topics:         topics,
		BalanceUseCase: balanceUseCase,
		messageChannel: make(chan *kafka.Message),
	}
}

func (c *BalanceKafkaConsumer) Consume() {
	consumer, err := kafka.NewConsumer(c.ConfigMap)
	if err != nil {
		log.Fatal(err)
	}

	err = consumer.SubscribeTopics(c.Topics, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Kafka consumer started")
	fmt.Println("Listening to topics:", c.Topics)

	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		run := true
		for run {
			select {
			case sig := <-sigchan:
				fmt.Printf("Caught signal %v: terminating\n", sig)
				run = false
			default:
				msg, err := consumer.ReadMessage(-1)
				if err != nil {
					fmt.Printf("Consumer error: %v\n", err)
					continue
				}
				c.messageChannel <- msg
			}
		}
		consumer.Close()
		close(c.messageChannel)
	}()

	// Process messages
	for msg := range c.messageChannel {
		fmt.Printf("Received message: %s\n", string(msg.Value))
		c.processMessage(msg)
	}
}

func (c *BalanceKafkaConsumer) processMessage(msg *kafka.Message) {
	// Parse event
	var eventPayload map[string]interface{}
	err := json.Unmarshal(msg.Value, &eventPayload)
	if err != nil {
		fmt.Printf("Error unmarshalling message: %v\n", err)
		return
	}

	// Check which type of event we received
	if _, ok := eventPayload["name"]; ok {
		// Handle by event name
		eventName, ok := eventPayload["name"].(string)
		if !ok {
			fmt.Println("Error parsing event name")
			return
		}

		// Get payload from the event
		rawPayload, ok := eventPayload["payload"]
		if !ok {
			fmt.Println("Error getting payload from event")
			return
		}

		// Re-marshal the payload to JSON
		payloadJSON, err := json.Marshal(rawPayload)
		if err != nil {
			fmt.Printf("Error marshalling payload: %v\n", err)
			return
		}

		switch eventName {
		case "TransactionCreated":
			var transaction TransactionMessage
			if err := json.Unmarshal(payloadJSON, &transaction); err != nil {
				fmt.Printf("Error parsing transaction: %v\n", err)
				return
			}
			c.handleTransaction(transaction)

		case "BalanceUpdated":
			var balanceUpdate BalanceUpdatedMessage
			if err := json.Unmarshal(payloadJSON, &balanceUpdate); err != nil {
				fmt.Printf("Error parsing balance update: %v\n", err)
				return
			}
			c.handleBalanceUpdate(balanceUpdate)

		default:
			fmt.Printf("Unknown event type: %s\n", eventName)
		}
	} else {
		// Try to parse as direct transaction message
		var transaction TransactionMessage
		if err := json.Unmarshal(msg.Value, &transaction); err != nil {
			fmt.Printf("Error parsing direct transaction message: %v\n", err)
			return
		}
		c.handleTransaction(transaction)
	}
}

func (c *BalanceKafkaConsumer) handleTransaction(transaction TransactionMessage) {
	// Update "from" account balance
	if transaction.AccountIDFrom != "" {
		fromBalance, err := c.BalanceUseCase.Get(transaction.AccountIDFrom)
		if err != nil {
			// Create new balance if it doesn't exist
			newBalance := entity.NewBalance(uuid.New().String(), transaction.AccountIDFrom, -transaction.Amount)
			err = c.BalanceUseCase.Save(newBalance)
			if err != nil {
				fmt.Printf("Error creating from account balance: %v\n", err)
			}
		} else {
			// Update existing balance
			fromBalance.UpdateAmount(fromBalance.Amount - transaction.Amount)
			err = c.BalanceUseCase.Save(fromBalance)
			if err != nil {
				fmt.Printf("Error updating from account balance: %v\n", err)
			}
		}
	}

	// Update "to" account balance
	if transaction.AccountIDTo != "" {
		toBalance, err := c.BalanceUseCase.Get(transaction.AccountIDTo)
		if err != nil {
			// Create new balance if it doesn't exist
			newBalance := entity.NewBalance(uuid.New().String(), transaction.AccountIDTo, transaction.Amount)
			err = c.BalanceUseCase.Save(newBalance)
			if err != nil {
				fmt.Printf("Error creating to account balance: %v\n", err)
			}
		} else {
			// Update existing balance
			toBalance.UpdateAmount(toBalance.Amount + transaction.Amount)
			err = c.BalanceUseCase.Save(toBalance)
			if err != nil {
				fmt.Printf("Error updating to account balance: %v\n", err)
			}
		}
	}
}

func (c *BalanceKafkaConsumer) handleBalanceUpdate(balanceUpdate BalanceUpdatedMessage) {
	// Update "from" account balance using exact balance
	if balanceUpdate.AccountIDFrom != "" {
		fromBalance, err := c.BalanceUseCase.Get(balanceUpdate.AccountIDFrom)
		if err != nil {
			// Create new balance with exact amount
			newBalance := entity.NewBalance(uuid.New().String(), balanceUpdate.AccountIDFrom, balanceUpdate.BalanceAccountIDFrom)
			err = c.BalanceUseCase.Save(newBalance)
			if err != nil {
				fmt.Printf("Error creating from account balance: %v\n", err)
			}
		} else {
			// Update with exact amount
			fromBalance.UpdateAmount(balanceUpdate.BalanceAccountIDFrom)
			err = c.BalanceUseCase.Save(fromBalance)
			if err != nil {
				fmt.Printf("Error updating from account balance: %v\n", err)
			}
		}
	}

	// Update "to" account balance using exact balance
	if balanceUpdate.AccountIDTo != "" {
		toBalance, err := c.BalanceUseCase.Get(balanceUpdate.AccountIDTo)
		if err != nil {
			// Create new balance with exact amount
			newBalance := entity.NewBalance(uuid.New().String(), balanceUpdate.AccountIDTo, balanceUpdate.BalanceAccountIDTo)
			err = c.BalanceUseCase.Save(newBalance)
			if err != nil {
				fmt.Printf("Error creating to account balance: %v\n", err)
			}
		} else {
			// Update with exact amount
			toBalance.UpdateAmount(balanceUpdate.BalanceAccountIDTo)
			err = c.BalanceUseCase.Save(toBalance)
			if err != nil {
				fmt.Printf("Error updating to account balance: %v\n", err)
			}
		}
	}
}
