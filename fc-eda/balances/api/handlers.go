package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/perebati/fc-ms-balances/internal/usecase"
)

type WebHandler struct {
	BalanceUseCase *usecase.BalanceUseCase
}

func NewWebHandler(balanceUseCase *usecase.BalanceUseCase) *WebHandler {
	return &WebHandler{
		BalanceUseCase: balanceUseCase,
	}
}

func (h *WebHandler) GetBalance(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	accountID := vars["account_id"]

	if accountID == "" {
		w.WriteHeader(http.StatusBadRequest)
		error := map[string]interface{}{"error": "account_id is required"}
		json.NewEncoder(w).Encode(error)
		return
	}

	balance, err := h.BalanceUseCase.Get(accountID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		error := map[string]interface{}{"error": "balance not found"}
		json.NewEncoder(w).Encode(error)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(balance)
}

func (h *WebHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"status": true})
}
