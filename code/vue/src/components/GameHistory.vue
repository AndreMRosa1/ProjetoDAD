<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const games = ref([]);

    const fetchGameHistory = async () => {
      try {
        const response = await axios.get('/history');
        console.log(response.data); // Verifica se os dados chegam aqui
        games.value = response.data; // Popula a variável `games`
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };

    onMounted(() => {
      fetchGameHistory();
    });

    return {
      games, // Retorna a variável para que seja acessível no template
    };
  },
};
</script>

<template>
  <div>
    <h1>Game History</h1>
    <table>
      <thead>
        <tr>
          <th>Game ID</th>
          <th>Type</th>
          <th>Board Size</th>
          <th>Status</th>
          <th>Time</th>
          <th>Winner</th>
          <th>Began At</th>
          <th>Ended At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>{{ game.id }}</td>
          <td>{{ game.type === 'S' ? 'Single Player' : 'Multiplayer' }}</td>
          <td>{{ game.board.cols }}x{{ game.board.rows }}</td>
          <td>
            {{ game.status === 'PE' ? 'Pending' :
               game.status === 'PL' ? 'Playing' :
               game.status === 'E' ? 'Ended' :
               'Interrupted' }}
          </td>
          <td>{{ game.total_time }} seconds</td>
          <td>{{ game.winner_user_id || 'N/A' }}</td>
          <td>{{ game.began_at }}</td>
          <td>{{ game.ended_at || 'In Progress' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
tr:hover {
  background-color: #f1f1f1;
}
</style>