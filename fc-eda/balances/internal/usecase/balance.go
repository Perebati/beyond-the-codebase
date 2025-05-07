package usecase

import (
	"github.com/perebati/fc-ms-balances/internal/entity"
	"github.com/perebati/fc-ms-balances/internal/gateway"
)

type BalanceUseCase struct {
	BalanceGateway gateway.BalanceGateway
}

func NewBalanceUseCase(balanceGateway gateway.BalanceGateway) *BalanceUseCase {
	return &BalanceUseCase{
		BalanceGateway: balanceGateway,
	}
}

func (uc *BalanceUseCase) Get(accountID string) (*entity.Balance, error) {
	return uc.BalanceGateway.Get(accountID)
}

func (uc *BalanceUseCase) Save(balance *entity.Balance) error {
	return uc.BalanceGateway.Save(balance)
}

func (uc *BalanceUseCase) FindById(id string) (*entity.Balance, error) {
	return uc.BalanceGateway.FindById(id)
}
