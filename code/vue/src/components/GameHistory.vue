<template>
  <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
      <span class="mr-2">🎮</span> Game History
    </h1>
    <p class="text-center text-gray-600 mb-6">Track your game history</p>

    <!-- Game History Table -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-around bg-green-600 text-white font-semibold rounded-md p-2">
        <span class="flex-1 text-center">Type</span>
        <span class="flex-1 text-center">Board Size</span>
        <span class="flex-1 text-center">Status</span>
        <span class="flex-1 text-center">Time</span>
        <span class="flex-1 text-center">Winner</span>
        <span class="flex-1 text-center">Began At</span>
        <span class="flex-1 text-center">Ended At</span>
      </div>

      <div v-for="(game, index) in games" :key="game.id"
        class="flex justify-around border-b last:border-b-0 hover:bg-green-100 p-2">
        <span class="flex-1 text-center">
          {{ game.type === 'S' ? 'Single Player' : 'Multiplayer' }}
        </span>
        <span class="flex-1 text-center">
          {{ game.board_id === '1' ? '3x4' : game.board_id === '2' ? '4x4' : '6x6' }}
        </span>
        <span class="flex-1 text-center">
          {{ game.status === 'PE' ? 'Pending' : game.status === 'PL' ? 'Playing' : game.status === 'E' ? 'Ended' :
            'Interrupted' }}
        </span>
        <span class="flex-1 text-center">{{ game.total_time }} seconds</span>
        <span class="flex-1 text-center">{{ game.winner_name || 'N/A' }}</span>
        <span class="flex-1 text-center">{{ game.began_at }}</span>
        <span class="flex-1 text-center">{{ game.ended_at }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-6 gap-4">
      <button class="whitespace-nowrap px-8 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': currentPage === 1, 'bg-gray-200': currentPage !== 1 }" :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)" :style="{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }">
        Previous
      </button>

      <!-- Page Number Input -->
      <div class="flex items-center gap-2">
        <input type="number" v-model="inputPage" min="1" :max="totalPages"
          class="text-center px-1 py-2 border rounded-md w-16" @blur="onPageInputBlur" @keydown.enter="handlePageInput"
          :disabled="games.length === 0" />
        <span class="text-lg">of {{ totalPages }}</span>
      </div>

      <button class="whitespace-nowrap px-8 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': currentPage === totalPages, 'bg-gray-200': currentPage !== totalPages }"
        :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)"
        :style="{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }">
        Next
      </button>
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
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
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
