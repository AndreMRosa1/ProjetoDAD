<script setup>
import { onMounted } from 'vue';
import { useTransactionHistoryStore } from '@/stores/transactionHistory';

const transactionHistoryStore = useTransactionHistoryStore();

onMounted(() => {
  transactionHistoryStore.fetchTransactions();
});
</script>

<template>
  <div>
    <h1>Transaction History</h1>
    <p v-if="transactionHistoryStore.isLoading">Loading...</p>
    <p v-if="transactionHistoryStore.error">{{ transactionHistoryStore.error }}</p>
    <table v-if="!transactionHistoryStore.isLoading && !transactionHistoryStore.error">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Coins</th>
          <th>Game</th>
          <th>Payment Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactionHistoryStore.transactions" :key="transaction.id">
          <td>{{ transactionHistoryStore.formatDate(transaction.transaction_datetime) }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.brain_coins }}</td>
          <td>{{ transaction.game?.id || 'N/A' }}</td>
          <td>{{ transaction.payment_type || 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>