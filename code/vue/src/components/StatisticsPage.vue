<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Statistics</h1>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-bold text-gray-700 mb-4">Game Types: Single vs Multiplayer</h2>
        <canvas id="gameTypeChart"></canvas>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-bold text-gray-700 mb-4">Transactions by Month</h2>
        <canvas id="transactionsChart"></canvas>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-bold text-gray-700 mb-4">New Users by Month</h2>
        <canvas id="usersChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

const totalPlayers = ref(0);
const totalGames = ref(0);
const totalTransactions = ref(0);
const singlePlayerCount = ref(0);
const multiplayerCount = ref(0);
const transactionsByMonth = ref(Array(12).fill(0));
const usersByMonth = ref(Array(12).fill(0));

// Fetch total players and new users by month
const fetchUsers = async () => {
  const response = await axios.get('/users/all');
  totalPlayers.value = response.data.length;

  const users = response.data || [];
  const monthlyUsers = Array(12).fill(0);
  users.forEach((user) => {
    if (user.created_at) {
      const month = new Date(user.created_at).getMonth();
      monthlyUsers[month]++;
    }
  });
  usersByMonth.value = monthlyUsers;
};

// Fetch total games and game types
const fetchGames = async () => {
  const response = await axios.get('/games/all');
  totalGames.value = response.data.total;

  const games = response.data.data || [];
  singlePlayerCount.value = games.filter((game) => game.type === 'S').length;
  multiplayerCount.value = games.filter((game) => game.type === 'M').length;
};

// Fetch total transactions and transactions by month
const fetchTransactions = async () => {
  const response = await axios.get('/transactions');
  totalTransactions.value = response.data.total;

  const transactions = response.data.data || [];
  const monthlyTransactions = Array(12).fill(0);
  transactions.forEach((transaction) => {
    if (transaction.transaction_datetime) {
      const month = new Date(transaction.transaction_datetime).getMonth();
      monthlyTransactions[month]++;
    }
  });
  transactionsByMonth.value = monthlyTransactions;
};

// Doughnut chart data for game types
const gameTypeData = computed(() => ({
  labels: ['Single-player Games', 'Multiplayer Games'],
  datasets: [
    {
      data: [singlePlayerCount.value, multiplayerCount.value],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    },
  ],
}));

// Line chart data for transactions by month
const transactionsData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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

// Line chart data for new users by month
const usersData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
    {
      label: 'New Users',
      data: usersByMonth.value,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
}));

// Initialize the doughnut chart for game types
const initializeGameTypeChart = () => {
  const ctx = document.getElementById('gameTypeChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: gameTypeData.value,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
};

// Initialize the line chart for transactions
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

// Initialize the line chart for new users
const initializeUsersChart = () => {
  const ctx = document.getElementById('usersChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: usersData.value,
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

// Fetch data and initialize charts
onMounted(async () => {
  await fetchUsers();
  await fetchGames();
  await fetchTransactions();

  // Ensure DOM is fully ready before initializing charts
  await nextTick();
  initializeGameTypeChart();
  initializeTransactionsChart();
  initializeUsersChart();
});
</script>
