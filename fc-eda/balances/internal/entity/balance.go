package entity

import (
	"time"
)

type Balance struct {
	ID        string
	AccountID string
	Amount    float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewBalance(id, accountID string, amount float64) *Balance {
	return &Balance{
		ID:        id,
		AccountID: accountID,
		Amount:    amount,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (b *Balance) UpdateAmount(amount float64) {
	b.Amount = amount
	b.UpdatedAt = time.Now()
}
