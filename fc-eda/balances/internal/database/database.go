package database

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/perebati/fc-ms-balances/internal/entity"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	DB         *gorm.DB
	RawDB      *sql.DB
	dsn        string
	driverName string
}

func NewDatabase(driverName, dsn string) (*Database, error) {
	db := &Database{
		dsn:        dsn,
		driverName: driverName,
	}
	var err error
	db.RawDB, err = sql.Open(driverName, dsn)
	if err != nil {
		return nil, err
	}

	db.DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		db.RawDB.Close()
		return nil, err
	}

	return db, nil
}

func (d *Database) Close() error {
	return d.RawDB.Close()
}

func (d *Database) AutoMigrate() error {
	return d.DB.AutoMigrate(&entity.Balance{})
}

func (d *Database) GetDB() *gorm.DB {
	return d.DB
}

func (d *Database) CreateTables() error {
	_, err := d.RawDB.Exec("CREATE TABLE IF NOT EXISTS balances (id varchar(255), account_id varchar(255), amount float, created_at datetime, updated_at datetime, PRIMARY KEY (id));")
	if err != nil {
		return err
	}

	return nil
}

func (d *Database) InsertSampleData() error {
	// Insert sample balances
	samplesQuery := `INSERT IGNORE INTO balances (id, account_id, amount, created_at, updated_at) VALUES 
	("1", "1", 1000, NOW(), NOW()),
	("2", "2", 2000, NOW(), NOW()),
	("3", "3", 3000, NOW(), NOW());`

	_, err := d.RawDB.Exec(samplesQuery)
	if err != nil {
		return err
	}

	fmt.Println("Sample data inserted successfully")
	return nil
}
