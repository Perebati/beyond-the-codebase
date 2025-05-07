package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/gorilla/mux"
	"github.com/perebati/fc-ms-balances/api"
	"github.com/perebati/fc-ms-balances/internal/database"
	"github.com/perebati/fc-ms-balances/internal/event"
	"github.com/perebati/fc-ms-balances/internal/usecase"
)

func main() {
	// Database connection
	db, err := database.NewDatabase(
		"mysql",
		"root:root@tcp(balances-mysql:3306)/balances?parseTime=true",
	)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Wait for mysql to be ready
	time.Sleep(10 * time.Second)

	// Create tables and migrations
	err = db.CreateTables()
	if err != nil {
		log.Printf("Error creating tables: %v", err)
	}

	// Insert sample data
	err = db.InsertSampleData()
	if err != nil {
		log.Printf("Error inserting sample data: %v", err)
	}

	// Create balance repository
	balanceRepo := database.NewBalanceRepository(db.GetDB())

	// Create balance use case
	balanceUseCase := usecase.NewBalanceUseCase(balanceRepo)

	// Create web handler
	webHandler := api.NewWebHandler(balanceUseCase)

	// Start Kafka consumer
	configMap := &kafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "balances-consumer",
		"auto.offset.reset": "earliest",
	}

	// Start Kafka consumer for both transactions and balance-updates topics
	topics := []string{"transactions"}
	kafkaConsumer := event.NewBalanceKafkaConsumer(configMap, topics, balanceUseCase)
	go kafkaConsumer.Consume()

	// Create router
	router := mux.NewRouter()
	router.HandleFunc("/balances/{account_id}", webHandler.GetBalance).Methods("GET")
	router.HandleFunc("/health", webHandler.HealthCheck).Methods("GET")

	// Start server
	port := "3003"
	fmt.Printf("Balances service is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), router))
}
