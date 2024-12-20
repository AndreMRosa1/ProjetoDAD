<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Transaction History</h2>
    <div class="overflow-x-auto">
      <table class="table-auto w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-2 border-b border-gray-300">#</th>
            <th class="px-4 py-2 border-b border-gray-300">Type</th>
            <th class="px-4 py-2 border-b border-gray-300">Euros</th>
            <th class="px-4 py-2 border-b border-gray-300">Brain Coins</th>
            <th class="px-4 py-2 border-b border-gray-300">Payment Type</th>
            <th class="px-4 py-2 border-b border-gray-300">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 border-b border-gray-300">{{ transaction.id }}</td>
            <td class="px-4 py-2 border-b border-gray-300">{{ transaction.type }}</td>
            <td class="px-4 py-2 border-b border-gray-300">{{ transaction.euros }}</td>
            <td class="px-4 py-2 border-b border-gray-300">{{ transaction.brain_coins }}</td>
            <td class="px-4 py-2 border-b border-gray-300">{{ transaction.payment_type }}</td>
            <td class="px-4 py-2 border-b border-gray-300">{{ formatDate(transaction.transaction_datetime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import transactionsAPI from '@/stores/transactions';

export default {
  name: 'TransactionHistory',
  setup() {
    const transactions = ref([]);

    const fetchTransactions = async () => {
      try {
        const response = await transactionsAPI.getTransactions();
        transactions.value = response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const formatDate = (datetime) => {
      const date = new Date(datetime);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    onMounted(fetchTransactions);

    return {
      transactions,
      formatDate,
    };
  },
};
</script>