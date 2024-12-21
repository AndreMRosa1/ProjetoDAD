<template>
  <div class="container">
    <h1>Statistics</h1>
    <div class="stats">
      <div class="stat-item">
        <label>Total Number of Players: </label>
        <span>{{ totalPlayers }}</span>
      </div>
      <div class="stat-item">
        <label>Total Games Played: </label>
        <span>{{ totalGames }}</span>
      </div>
      <div class="stat-item">
        <label>Total Transactions: </label>
        <span>{{ totalTransactions }}</span>
      </div>
    </div>
    <div class="chart-container">
      <h2>Games Played</h2>
      <canvas id="gamesPlayedChart"></canvas>
    </div>
    <div class="chart-container">
      <h2>Transactions by Month</h2>
      <canvas id="transactionsChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed, nextTick } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

const totalPlayers = ref(0);
const totalGames = ref(0);
const totalTransactions = ref(0);
const games = ref([]);
const months = Array(12).fill(0);
const transactionsByMonth = ref(Array(12).fill(0));

const fetchUsers = async () => {
  const response = await axios.get('/users');
  totalPlayers.value = response.data.length;
};

const fetchPlayingGames = async () => {
  const response = await axios.get('/admin/games');
  totalGames.value = response.data.total;
  games.value = response.data.data || [];
  
  const monthlyGames = Array(12).fill(0);
  games.value.forEach((game) => {
    if (game.created_at) {
      const month = new Date(game.created_at).getMonth();
      monthlyGames[month]++;
    }
  });
  months.splice(0, 12, ...monthlyGames);

};

const fetchTransactions = async () => {
  const response = await axios.get('/admin/transactions');

  console.log('Transactions Response:', response.data);

  totalTransactions.value = response.data.total;

  // Verifique se transactions existe e é um array antes de processar
  const transactions = response.data.data;
  if (Array.isArray(transactions)) {
    const monthlyTransactions = Array(12).fill(0);
    transactions.forEach((transaction) => {
      if (transaction.transaction_datetime) {
        const month = new Date(transaction.transaction_datetime).getMonth();
        monthlyTransactions[month]++;
      }
    });
    transactionsByMonth.value = monthlyTransactions;

    console.log('Processed Transactions by Month:', transactionsByMonth.value);
  } else {
    console.warn('Transactions data is not an array or is undefined.');
    transactionsByMonth.value = Array(12).fill(0);
  }
};


const gamesPlayedData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'Games Played',
      data: months,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
}));

const transactionsData = computed(() => ({
  labels: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  datasets: [
    {
      label: 'Transactions',
      data: transactionsByMonth.value,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
}));

const initializeGamesPlayedChart = () => {
  const ctx = document.getElementById('gamesPlayedChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: gamesPlayedData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const initializeTransactionsChart = () => {
  const ctx = document.getElementById('transactionsChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: transactionsData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(async () => {
  await fetchUsers();
  await fetchPlayingGames();
  await fetchTransactions();

   // Ensure DOM is fully ready before initializing charts
   await nextTick();
  initializeGamesPlayedChart();
  initializeTransactionsChart();
});
</script>

<style scoped>
.container {
  padding: 20px;
}
.stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.chart-container {
  margin-bottom: 40px;
}
</style>
