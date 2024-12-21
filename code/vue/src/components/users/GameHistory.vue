<template>
  <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
      <span class="mr-2">🎮</span> Game History
    </h1>
    <p class="text-center text-gray-600 mb-6">Track your game history</p>

    <!-- Game History Table -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-around bg-green-600 text-white font-semibold rounded-md p-2">
        <span v-if="gameHistoryStore.isAdmin" class="flex-1 text-center">Player</span>
        <span class="flex-1 text-center">Type</span>
        <span class="flex-1 text-center">Board Size</span>
        <span class="flex-1 text-center">Status</span>
        <span class="flex-1 text-center">Time</span>
        <span class="flex-1 text-center">Winner</span>
        <span class="flex-1 text-center">Began At</span>
        <span class="flex-1 text-center">Ended At</span>
      </div>

      <div v-for="(game) in gameHistoryStore.games" :key="game.id"
        class="flex justify-around border-b last:border-b-0 hover:bg-green-100 p-2">
        <span v-if="gameHistoryStore.isAdmin" class="flex-1 text-center">{{ game.player_name || 'N/A' }}</span>
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
        <span class="flex-1 text-center">{{ game.total_time || 'N/A' }} </span>
        <span class="flex-1 text-center">{{ game.winner_name || 'N/A' }}</span>
        <span class="flex-1 text-center">{{ game.began_at }}</span>
        <span class="flex-1 text-center">{{ game.ended_at }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center mt-6 gap-4">
      <button class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': gameHistoryStore.currentPage === 1, 'bg-gray-200': gameHistoryStore.currentPage !== 1 }"
        :disabled="gameHistoryStore.currentPage === 1"
        @click="gameHistoryStore.handlePageChange(gameHistoryStore.currentPage - 1)"
        :style="{ cursor: gameHistoryStore.currentPage === 1 ? 'not-allowed' : 'pointer' }">
        Previous
      </button>

      <!-- Page Number Input -->
      <div class="flex items-center gap-2">
        <input type="number" v-model="gameHistoryStore.inputPage" min="1" :max="gameHistoryStore.totalPages"
          class="text-center px-1 py-2 border rounded-md w-16" @blur="gameHistoryStore.onPageInputBlur"
          @keydown.enter="gameHistoryStore.handlePageInput" :disabled="gameHistoryStore.games.length === 0" />
        <span class="text-lg">of {{ gameHistoryStore.totalPages }}</span>
      </div>

      <button class="whitespace-nowrap px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
        :class="{ 'bg-gray-300': gameHistoryStore.currentPage === gameHistoryStore.totalPages, 'bg-gray-200': gameHistoryStore.currentPage !== gameHistoryStore.totalPages }"
        :disabled="gameHistoryStore.currentPage === gameHistoryStore.totalPages"
        @click="gameHistoryStore.handlePageChange(gameHistoryStore.currentPage + 1)"
        :style="{ cursor: gameHistoryStore.currentPage === gameHistoryStore.totalPages ? 'not-allowed' : 'pointer' }">
        Next
      </button>
    </div>
  </div>
</template>


<script>
import { useGameHistoryStore } from '@/stores/gamehistory';
import { onMounted } from 'vue';

export default {
  setup() {
    const gameHistoryStore = useGameHistoryStore();

    onMounted(() => {
      gameHistoryStore.fetchGameHistory(); // Correct function call
    });

    return {
      gameHistoryStore,
    };
  },
};
</script>
