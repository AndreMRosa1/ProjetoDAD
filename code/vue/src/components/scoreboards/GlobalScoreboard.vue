<template>
  <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
      <span class="mr-2">🌍</span> Global Scoreboard
    </h1>
    <p class="text-center text-gray-600 mb-6">Memorize it fast</p>

    <!-- Filtros -->
    <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
      <div class="flex flex-wrap gap-4 justify-between">
        <!-- Ordenação -->
        <label class="flex flex-col text-sm text-gray-700">
          <span class="mb-1">Order by:</span>
          <select v-model="filters.sortBy" @change="applyFilters" class="px-3 py-2 border rounded-md text-gray-700">
            <option value="time">Lower Time</option>
            <option value="turns">Lower Turns</option>
          </select>
        </label>

        <!-- Tipo de Jogo -->
        <label class="flex flex-col text-sm text-gray-700">
          <span class="mb-1">Game Type:</span>
          <select v-model="filters.type" @change="applyFilters" class="px-3 py-2 border rounded-md text-gray-700">
            <option value="">All</option>
            <option value="S">Single-Player</option>
            <option value="M">Multiplayer</option>
          </select>
        </label>

        <!-- Tamanho do Tabuleiro -->
        <label class="flex flex-col text-sm text-gray-700">
          <span class="mb-1">Board Size:</span>
          <select v-model="filters.boardSize" @change="applyFilters" class="px-3 py-2 border rounded-md text-gray-700">
            <option value="3x4">3x4</option>
            <option value="4x4">4x4</option>
            <option value="6x6">6x6</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="text-center text-gray-500 font-semibold">
      Loading...
    </div>

    <!-- Tabela de Scoreboard -->
    <div v-else-if="globalScoreboard.length > 0" class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-around bg-green-600 text-white font-semibold rounded-md p-2">
        <span class="flex-1 text-center">Rank</span>
        <span class="flex-1 text-center">Player</span>
        <span class="flex-1 text-center">Board</span>
        <span class="flex-1 text-center">Time</span>
        <span class="flex-1 text-center">Turns</span>
      </div>

      <div v-for="(record, index) in globalScoreboard" :key="index"
        class="flex justify-around border-b last:border-b-0 hover:bg-green-100 p-2">
        <span class="flex-1 text-center">{{ index + 1 }}</span>
        <span class="flex-1 text-center">{{ record.creator ? record.creator.nickname : 'Unknown' }}</span>
        <span class="flex-1 text-center">{{ `${record.board.board_cols}x${record.board.board_rows}` }}</span>
        <span class="flex-1 text-center">{{ record.best_time }}</span>
        <span class="flex-1 text-center">{{ record.best_turns }}</span>
      </div>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="error" class="text-center text-red-600 mt-4">
      {{ error }}
    </div>
    <div v-else class="text-center text-gray-500 mt-4">No data found.</div>
  </div>
</template>

<script>
import { useScoreboardStore } from "./globalScoreboardStore";
import { storeToRefs } from "pinia";
import { reactive, onMounted } from "vue";

export default {
  setup() {
    const scoreboardStore = useScoreboardStore();
    const { globalScoreboard, isLoading, error } = storeToRefs(scoreboardStore);

    const filters = reactive({
      sortBy: "time",
      type: "",
      boardSize: "3x4",
    });

    const loadScoreboard = () => {
      scoreboardStore.fetchGlobalScoreboard(filters);
    };

    const applyFilters = () => {
      loadScoreboard();
    };

    onMounted(() => {
      loadScoreboard();
    });

    return {
      globalScoreboard,
      isLoading,
      error,
      filters,
      applyFilters,
    };
  },
};
</script>