import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error'; // If you want to handle errors in a similar way

export const useTransactionsStore = defineStore('transactions', () => {
  const storeError = useErrorStore();

  const transactions = ref([]); // To store all transactions
  const transaction = ref(null); // To store the newly created transaction or transaction details
  const error = ref(null); // To handle error messages
  const loading = ref(false); // To manage loading state

  // Computed properties (for example, total number of transactions)
  const totalTransactions = computed(() => transactions.value.length);

  // Fetch all transactions
  const getTransactions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/transactions');
      transactions.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch transactions.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Create a new transaction
  const createTransaction = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/transactions', data);
      transaction.value = response.data;
      return response; // Return the response for additional handling if needed
    } catch (err) {
      error.value = 'Failed to create a transaction.';
      console.error(err);
      throw err; // Rethrow error to handle it in the component
    } finally {
      loading.value = false;
    }
  };

  return {
    transactions,
    transaction,
    error,
    loading,
    totalTransactions,
    getTransactions,
    createTransaction,
  };
});
