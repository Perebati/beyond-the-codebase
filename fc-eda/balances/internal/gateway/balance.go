package gateway

import "github.com/perebati/fc-ms-balances/internal/entity"

type BalanceGateway interface {
	Get(accountID string) (*entity.Balance, error)
	Save(balance *entity.Balance) error
	FindById(id string) (*entity.Balance, error)
}
