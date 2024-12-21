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
      <div class="stat-item">
        <label>Total Games Played: </label>
        <span>{{ totalTransactions }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';

const totalPlayers = ref(0);
const totalGamesPlayed = ref(0);
const totalTransactions = ref(0);

const fetchUsers = async () => {
  const response = await axios.get('/users');
  totalPlayers.value = response.data.length;
};

const fetchPlayingGames = async () => {
  const response = await axios.get('/admin/games');
  totalGamesPlayed.value = response.data.length;
};

const fetchTransactions = async () => {
  const response = await axios.get('/admin/transactions');
  totalTransactions.value = response.data.length;
};

onMounted(async () => {
  await fetchUsers();
  await fetchPlayingGames();
  await fetchTransactions();

  await nextTick();

  
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

</style>
