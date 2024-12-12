<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const games = ref([]);

const fetchGameHistory = async () => {
  try {
    const response = await axios.get('games');
    console.log(response);
    games.value = response.data.data
  } catch (error) {
    console.error('Error fetching game history:', error);
  }
};

onMounted(() => {
  fetchGameHistory();
});
</script>

<template>
  <div>
    <h1>Game History</h1>
    <table>
      <thead>
        <tr>
          <th>Game ID</th>
          <th>Type</th>
          
          <th>Time</th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.id }}</td>
          <td>{{ game.type === 'S' ? 'Single Player' : 'Multiplayer' }}</td>
          
          <td>{{ game.total_time }} seconds</td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>