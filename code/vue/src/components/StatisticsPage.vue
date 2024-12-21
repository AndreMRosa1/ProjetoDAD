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
        <span>{{ totalGamesPlayed }}</span>
      </div>
      <div class="chart-container">
        <h2>Games Played</h2>
        <canvas id="gamesPlayedChart"></canvas>
      </div>
      <div class="chart-container">
        <h2>Total Purchases</h2>
        <canvas id="totalPurchasesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';

const totalPlayers = ref(0);
const totalGamesPlayed = ref(0);
const storeError = useErrorStore();

const fetchUsers = async () => {
  const response = await axios.get('/users');
  totalPlayers.value = response.data.length;
};

const fetchPlayingGames = async () => {
  const response = await axios.get('/admin/games');
  totalGamesPlayed.value = response.data.length;

};

onMounted(async () => {
  await fetchUsers();
  await fetchPlayingGames();

  await nextTick();

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

  const totalPurchasesCtx = document.getElementById('totalPurchasesChart').getContext('2d');
  new Chart(totalPurchasesCtx, {
    type: 'bar',
    data: totalPurchasesData,
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

.stats {
  /* existing styles */
}
</style>
