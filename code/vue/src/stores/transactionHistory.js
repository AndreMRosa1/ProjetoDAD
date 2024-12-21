import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';

export const useTransactionHistoryStore = defineStore('transactionHistory', {
  state: () => ({
    transactions: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    inputPage: 1,
    totalPages: 1, // Add totalPages for pagination
  }),

  actions: {
    async fetchTransactions() {
      this.isLoading = true;
      this.error = null;

      const errorStore = useErrorStore();

      try {
        const response = await axios.get('/transactions', {
          params: { page: this.currentPage, per_page: this.itemsPerPage },
        });

        this.transactions = response.data.data.map((transaction) => {
          let description = "";
          if (transaction.type === "P") {
            description = "Purchases";
          } else if (transaction.type === "I") {
            description = `Internal spendings/earnings related to a game`;
          } else if (transaction.type === "B") {
            description = `Bonus`;
          }
          return { ...transaction, description };
        });

        // Calculate total pages based on the response data
        this.totalPages = Math.ceil(response.data.total / this.itemsPerPage);
      } catch (error) {
        errorStore.setErrorMessages('Error fetching transactions', 'Error fetching transactions', 404, 'Error fetching transactions')
      } finally {
        this.isLoading = false;
      }
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.inputPage = page;
        this.fetchTransactions(); // Fetch new data when the page changes
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
