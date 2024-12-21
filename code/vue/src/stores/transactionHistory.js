import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionHistoryStore = defineStore('transactionHistory', {
  state: () => ({
    transactions: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    inputPage: 1,
  }),

  actions: {
    async fetchTransactions() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('/transactions');
        this.transactions = response.data.map((transaction) => {
            let description = "";
            if (transaction.type === "P") {
              description = "Purchase of brain coins";
            } else if (transaction.type === "H") {
              description = `Used for hint in game #${transaction.transaction_details?.game_id || "N/A"}`;
            } else if (transaction.type === "G") {
              description = `Used in game #${transaction.transaction_details?.game_id || "N/A"} (${transaction.transaction_details?.game_type || "unknown"})`;
            }
            return { ...transaction, description };
          });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        this.error = 'Failed to load transaction history.';
      } finally {
        this.isLoading = false;
      }
    },
    

    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.inputPage = page;
        }
      },
  
      validatePageInput() {
        if (this.inputPage < 1 || this.inputPage > this.totalPages) {
          this.inputPage = this.currentPage;
        } else {
          this.changePage(this.inputPage);
        }
      },

    formatDate(isoString) {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      return date.toLocaleString('pt-PT', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    },
  },
});
