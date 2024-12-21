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
        <span>{{ games }}</span>
      </div>
      <div class="stat-item">
        <label>Total Games Played: </label>
        <span>{{ totalTransactions }}</span>
      </div>
      <div class="stat-item">
        <label>Games Played in January: </label>
        <span>{{months}}</span>
      </div>
    </div>
    <div class="chart-container">
      <h2>Games Played</h2>
      <canvas id="gamesPlayedChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

const totalPlayers = ref(0);
const totalTransactions = ref(0);
const games = ref([]);
const months = Array(12).fill(0);

const fetchUsers = async () => {
  const response = await axios.get('/users');
  totalPlayers.value = response.data.length;
};

const fetchPlayingGames = async () => {
  const response = await axios.get('/admin/games');
  games.value = response.data.total;
};

const fetchTransactions = async () => {
  const response = await axios.get('/admin/transactions');
  totalTransactions.value = response.data.total;
};

const gamesByMonth = computed(() => {
  
  games.value.forEach((game) => {
    const month = new Date(game.created_at).getMonth();
    months[month]++;
    console.log(months);
  });
  return months;
});

const gamesPlayedData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [{
    label: 'Games Played',
    data: gamesByMonth.value,
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }]
}));

onMounted(async () => {
  await fetchUsers();
  await fetchPlayingGames();
  await fetchTransactions();

  const gamesPlayedCtx = document.getElementById('gamesPlayedChart').getContext('2d');
  new Chart(gamesPlayedCtx, {
    type: 'bar',
    data: gamesPlayedData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
