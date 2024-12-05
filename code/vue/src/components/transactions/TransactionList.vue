<template>
    <div>
      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Euros</th>
            <th>Brain Coins</th>
            <th>Payment Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.euros }}</td>
            <td>{{ transaction.brain_coins }}</td>
            <td>{{ transaction.payment_type }}</td>
            <td>{{ formatDate(transaction.transaction_datetime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import transactionsAPI from '@/stores/transactions';
  
  export default {
    name: 'TransactionHistory',
    data() {
      return {
        transactions: [],
      };
    },
    async mounted() {
      try {
        // Faz a chamada para buscar as transações
        const response = await transactionsAPI.getTransactions();
        this.transactions = response.data.transactions;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },
    methods: {
      formatDate(datetime) {
        const date = new Date(datetime);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      },
    },
  };
  </script>
  
  <style scoped>
  /* Opcional: Estilo básico para tabela */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  </style>
  