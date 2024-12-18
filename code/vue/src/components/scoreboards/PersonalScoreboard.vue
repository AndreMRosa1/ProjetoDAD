<template>
  <div class="p-6 bg-white rounded-lg max-w-4xl mx-auto shadow-lg">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
      <span class="mr-2">👤</span> Personal Scoreboard
    </h1>
    <p class="text-center text-gray-600 mb-6">Track your performance</p>

    <!-- Filtros -->
    <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
      <div class="flex flex-wrap gap-4 justify-between">
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
            <option value="">All</option>
            <option value="3x4">3x4</option>
            <option value="4x4">4x4</option>
            <option value="6x6">6x6</option>
          </select>
        </label>

        <!-- Ordenação -->
        <label class="flex flex-col text-sm text-gray-700">
          <span class="mb-1">Sort By:</span>
          <select v-model="filters.sortBy" @change="applyFilters" class="px-3 py-2 border rounded-md text-gray-700">
            <option value="total_time">Time</option>
            <option value="total_turns_winner">Turns</option>
          </select>
        </label>

        <label class="flex flex-col text-sm text-gray-700">
          <span class="mb-1">Order:</span>
          <select v-model="filters.sortOrder" @change="applyFilters" class="px-3 py-2 border rounded-md text-gray-700">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="text-center text-gray-500 font-semibold">
      Loading...
    </div>

    <!-- Tabela de Scoreboard -->
    <div v-else-if="personalScoreboard.length > 0" class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-around bg-green-600 text-white font-semibold rounded-md p-2">
        <span class="flex-1 text-center">Board</span>
        <span class="flex-1 text-center">Type</span>
        <span class="flex-1 text-center">Time</span>
        <span class="flex-1 text-center">Turns</span>
        <span class="flex-1 text-center">Start Date</span>
        <span class="flex-1 text-center">End Date</span>
      </div>

      <div v-for="(record, index) in personalScoreboard" :key="index"
        class="flex justify-around border-b last:border-b-0 hover:bg-green-100 p-2">
        <span class="flex-1 text-center">
          {{ `${record.board.board_cols}x${record.board.board_rows}` }}
        </span>
        <span class="flex-1 text-center">
          {{ record.type === 'S' ? 'Single-Player' : 'Multiplayer' }}
        </span>
        <span class="flex-1 text-center">{{ record.total_time }}</span>
        <span class="flex-1 text-center">{{ record.total_turns_winner }}</span>
        <span class="flex-1 text-center">
          {{ new Date(record.began_at).toLocaleDateString() }}
        </span>
        <span class="flex-1 text-center">
          {{ new Date(record.ended_at).toLocaleDateString() }}
        </span>
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
import { usePersonalScoreboardStore } from "./personalScoreboardStore";
import { storeToRefs } from "pinia";
import { reactive, onMounted } from "vue";

export default {
  setup() {
    const scoreboardStore = usePersonalScoreboardStore();
    const { personalScoreboard, isLoading, error } = storeToRefs(scoreboardStore);

    const filters = reactive({
      type: "", // Todos os tipos de jogo
      boardSize: "", // Todos os tamanhos de tabuleiro
      sortBy: "total_time", // Critério de ordenação (tempo por padrão)
      sortOrder: "asc", // Ordem ascendente por padrão
    });

    const loadScoreboard = () => {
      scoreboardStore.fetchPersonalScoreboard(filters);
    };

    const applyFilters = () => {
      loadScoreboard();
    };

    onMounted(() => {
      loadScoreboard();
    });

    return {
      personalScoreboard,
      isLoading,
      error,
      filters,
      applyFilters,
    };
  },
};
</script>
