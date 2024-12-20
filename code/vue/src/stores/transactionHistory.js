import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionHistoryStore = defineStore('transactionHistory', {
  state: () => ({
    transactions: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchTransactions() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get('/transactions/history');
        this.transactions = response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        this.error = 'Failed to load transaction history.';
      } finally {
        this.isLoading = false;
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
