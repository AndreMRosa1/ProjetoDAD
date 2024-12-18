<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-center">Game History</h1>
    <div>
      <table class="table-auto border-collapse border border-gray-300 w-full text-center mb-6">
        <!-- Added mb-6 for margin-bottom -->
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Type</th>
            <th class="border border-gray-300 px-4 py-2">Board Size</th>
            <th class="border border-gray-300 px-4 py-2">Status</th>
            <th class="border border-gray-300 px-4 py-2">Time</th>
            <th class="border border-gray-300 px-4 py-2">Winner</th>
            <th class="border border-gray-300 px-4 py-2">Began At</th>
            <th class="border border-gray-300 px-4 py-2">Ended At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.id" class="even:bg-gray-50 hover:bg-gray-100">
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

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-15 gap-4"> <!-- Increased mt-4 to mt-6 for more space -->
        <button
          class="whitespace-nowrap px-8 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
          :class="{
            'bg-gray-300': currentPage === 1,
            'bg-gray-200': currentPage !== 1
          }" :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)"
          :style="{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }">
          Previous
        </button>

        <!-- Page Number Input -->
        <div class="flex items-center gap-2">
          <input type="number" v-model="inputPage" min="1" :max="totalPages"
            class="text-center px-1 py-2 border rounded-md w-16" @blur="onPageInputBlur"
            @keydown.enter="handlePageInput" :disabled="games.length === 0" />
          <span class="text-lg">of {{ totalPages }}</span>
        </div>

        <button
          class="whitespace-nowrap px-8 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
          :class="{
            'bg-gray-300': currentPage === totalPages,
            'bg-gray-200': currentPage !== totalPages
          }" :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)"
          :style="{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }">
          Next
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const games = ref([]);
    const currentPage = ref(1); // Track the current page
    const totalPages = ref(1); // Track the total pages
    const inputPage = ref(1); // To bind with input for page change

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
      if (id == null) {
        return 'N/A';
      }

      try {
        const response = await axios.get(`/user/${id}`);
        const fullName = response.data.name;
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0]; // First part
        const lastName = nameParts[nameParts.length - 1]; // Last part
        return `${firstName} ${lastName}`;
      } catch (error) {
        return 'N/A';
      }
    };

    const fetchGameHistory = async (page = 1) => {
      try {
        const response = await axios.get(`/history?page=${page}`);
        const gamesData = await Promise.all(response.data.data.map(async (game) => {
          const winnerName = await fetchUserName(game.winner_user_id);
          return {
            ...game,
            began_at: formatDate(game.began_at),
            ended_at: game.ended_at ? formatDate(game.ended_at) : 'In Progress',
            winner_name: winnerName,
          };
        }));
        games.value = gamesData;
        totalPages.value = response.data.last_page; // Set the total pages
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        inputPage.value = page; // Update input box when page is changed
        fetchGameHistory(page);
      }
    };

    const onPageInputBlur = () => {
      if (inputPage.value < 1 || inputPage.value > totalPages.value) {
        inputPage.value = currentPage.value; // Reset input to the current page if out of bounds
      } else {
        handlePageChange(inputPage.value);
      }
    };

    const handlePageInput = () => {
      if (inputPage.value >= 1 && inputPage.value <= totalPages.value) {
        handlePageChange(inputPage.value);
      } else {
        inputPage.value = currentPage.value; // Reset input if value is invalid
      }
    };

    onMounted(() => {
      fetchGameHistory(currentPage.value);
    });

    return {
      games,
      currentPage,
      totalPages,
      inputPage,
      handlePageChange,
      onPageInputBlur,
      handlePageInput,
    };
  },
};
</script>
