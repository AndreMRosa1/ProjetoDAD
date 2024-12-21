<script setup>
import { onMounted } from 'vue';
import { useTransactionHistoryStore } from '@/stores/transactionHistory';

const transactionHistoryStore = useTransactionHistoryStore();

onMounted(() => {
  transactionHistoryStore.fetchTransactions();
});
</script>

<template>
    <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
      <h1 class="text-3xl font-semibold text-center text-gray-800 mb-4">
        Transaction History
      </h1>
  
      <!-- Loading and Error Messages -->
      <p v-if="transactionHistoryStore.isLoading" class="text-center text-gray-600">Loading...</p>
      <p v-if="transactionHistoryStore.error" class="text-center text-red-600">{{ transactionHistoryStore.error }}</p>
  
      <!-- Transaction Table -->
      <div v-if="!transactionHistoryStore.isLoading && !transactionHistoryStore.error">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-around bg-green-600 text-white font-semibold rounded-md p-2">
            <span class="flex-1 text-center">Date</span>
            <span class="flex-1 text-center">Type</span>
            <span class="flex-1 text-center">Details</span>
            <span class="flex-1 text-center">Coins</span>
            <span class="flex-1 text-center">Game</span>
          </div>
  
          <div
            v-for="transaction in transactionHistoryStore.paginatedTransactions"
            :key="transaction.id"
            class="flex justify-around border-b last:border-b-0 hover:bg-green-100 p-2"
          >
            <span class="flex-1 text-center">
              {{ transactionHistoryStore.formatDate(transaction.transaction_datetime) }}
            </span>
            <span class="flex-1 text-center">{{ transaction.type }}</span>
            <span class="flex-1 text-center">{{ transaction.description }}</span>
            <span class="flex-1 text-center">{{ transaction.brain_coins || 'N/A' }}</span>
            <span class="flex-1 text-center">{{ transaction.game?.id || 'N/A' }}</span>
          </div>
        </div>
  
        <!-- Pagination -->
        <div class="flex justify-center items-center mt-6 gap-4">
          <button
            class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
            :class="{ 'bg-gray-300': transactionHistoryStore.currentPage === 1 }"
            :disabled="transactionHistoryStore.currentPage === 1"
            @click="transactionHistoryStore.changePage(transactionHistoryStore.currentPage - 1)"
          >
            Previous
          </button>
  
          <!-- Page Number Input -->
          <div class="flex items-center gap-2">
            <input
              type="number"
              v-model="transactionHistoryStore.inputPage"
              min="1"
              :max="transactionHistoryStore.totalPages"
              class="text-center px-1 py-2 border rounded-md w-16"
              @blur="transactionHistoryStore.validatePageInput"
              @keydown.enter="transactionHistoryStore.validatePageInput"
            />
            <span class="text-lg">of {{ transactionHistoryStore.totalPages }}</span>
          </div>
  
          <button
            class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
            :class="{ 'bg-gray-300': transactionHistoryStore.currentPage === transactionHistoryStore.totalPages }"
            :disabled="transactionHistoryStore.currentPage === transactionHistoryStore.totalPages"
            @click="transactionHistoryStore.changePage(transactionHistoryStore.currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </template>