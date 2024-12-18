<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const games = ref([]);

    const formatDate = (isoString) => {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    };

    const fetchUserName = async (id) => {
      try {
        const response = await axios.get(`/user/${id}`);
        return response.data.name;
      } catch (error) {
        console.error('Error fetching username:', error);
        return 'N/A';
      }
    };

    const fetchGameHistory = async () => {
      try {
        const response = await axios.get('/history');
        const gamesData = await Promise.all(response.data.map(async (game) => {
          const winnerName = await fetchUserName(game.winner_user_id);
          return {
            ...game,
            began_at: formatDate(game.began_at),
            ended_at: game.ended_at ? formatDate(game.ended_at) : 'In Progress',
            winner_name: winnerName,  // Store winner's name
          };
        }));
        games.value = gamesData;
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };

    onMounted(() => {
      fetchGameHistory();
    });

    return {
      games,
    };
  },
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Game History</h1>
    <div class="overflow-x-auto">
      <table class="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Game ID</th>
            <th class="border border-gray-300 px-4 py-2">Type</th>
            <th class="border border-gray-300 px-4 py-2">Board Size</th>
            <th class="border border-gray-300 px-4 py-2">Status</th>
            <th class="border border-gray-300 px-4 py-2">Time</th>
            <th class="border border-gray-300 px-4 py-2">Winner</th>
            <th class="border border-gray-300 px-4 py-2">Began At</th>
            <th class="border border-gray-300 px-4 py-2">Ended At</th>
          </tr>
        </thead>
        <tbody class="overflow-y-auto" style="height: 400px;"> <!-- Set a height for scrollable content -->
          <tr v-for="game in games" :key="game.id" class="even:bg-gray-50 hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2">{{ game.id }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ game.type === 'S' ? 'Single Player' : 'Multiplayer' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ game.board_id === '1' ? '3x4' :
                game.status === '2' ? '4x4' :
                  game.status === '3' ? '6x6' : '3x4' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ game.status === 'PE' ? 'Pending' :
                game.status === 'PL' ? 'Playing' :
                  game.status === 'E' ? 'Ended' : 'Interrupted' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ game.total_time }} seconds</td>
            <td class="border border-gray-300 px-4 py-2">{{ game.winner_name || 'N/A' }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ game.began_at }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ game.ended_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
