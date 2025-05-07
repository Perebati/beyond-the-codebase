package database

import (
	"github.com/perebati/fc-ms-balances/internal/entity"
	"gorm.io/gorm"
)

type BalanceRepository struct {
	DB *gorm.DB
}

func NewBalanceRepository(db *gorm.DB) *BalanceRepository {
	return &BalanceRepository{
		DB: db,
	}
}

func (r *BalanceRepository) Get(accountID string) (*entity.Balance, error) {
	var balance entity.Balance
	err := r.DB.Where("account_id = ?", accountID).First(&balance).Error
	if err != nil {
		return nil, err
	}
	return &balance, nil
}

func (r *BalanceRepository) Save(balance *entity.Balance) error {
	var existing entity.Balance
	err := r.DB.Where("account_id = ?", balance.AccountID).First(&existing).Error

	if err == gorm.ErrRecordNotFound {
		return r.DB.Create(balance).Error
	}

	// Update existing balance
	return r.DB.Model(&entity.Balance{}).
		Where("account_id = ?", balance.AccountID).
		Updates(map[string]interface{}{
			"amount":     balance.Amount,
			"updated_at": balance.UpdatedAt,
		}).Error
}

func (r *BalanceRepository) FindById(id string) (*entity.Balance, error) {
	var balance entity.Balance
	err := r.DB.Where("id = ?", id).First(&balance).Error
	if err != nil {
		return nil, err
	}
	return &balance, nil
}
