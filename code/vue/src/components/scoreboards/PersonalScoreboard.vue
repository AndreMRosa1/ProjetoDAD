<template>
    <div class="scoreboard">
      <h1 class="title-container">
        <span class="icon-person">👤</span> Personal Scoreboard
      </h1>
      <p class="subtitle">Track your performance</p>
  
      <!-- Filtros -->
      <div class="filters-container">
        <div class="filters">
          <!-- Tipo de Jogo -->
          <label>
            <span>Game Type:</span>
            <select v-model="filters.type" @change="applyFilters">
              <option value="">All</option>
              <option value="S">Single-Player</option>
              <option value="M">Multiplayer</option>
            </select>
          </label>
  
          <!-- Tamanho do Tabuleiro -->
          <label>
            <span>Board Size:</span>
            <select v-model="filters.boardSize" @change="applyFilters">
              <option value="">All</option>
              <option value="3x4">3x4</option>
              <option value="4x4">4x4</option>
              <option value="6x6">6x6</option>
            </select>
          </label>
  
          <!-- Ordenação -->
          <label>
            <span>Sort By:</span>
            <select v-model="filters.sortBy" @change="applyFilters">
              <option value="total_time">Time</option>
              <option value="total_turns_winner">Turns</option>
            </select>
          </label>
          <label>
            <span>Order:</span>
            <select v-model="filters.sortOrder" @change="applyFilters">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>
  
      <!-- Loader -->
      <div v-if="isLoading" class="loader">Loading...</div>
  
      <!-- Tabela de Scoreboard -->
      <div v-else-if="personalScoreboard.length > 0" class="scoreboard-table-container">
        <div class="scoreboard-table-header">
          <span class="header-cell">Board</span>
          <span class="header-cell">Type</span>
          <span class="header-cell">Time</span>
          <span class="header-cell">Turns</span>
          <span class="header-cell">Start Date</span>
          <span class="header-cell">End Date</span>
        </div>
        <div v-for="(record, index) in personalScoreboard" :key="index" class="scoreboard-table-row">
          <span class="table-cell">{{ `${record.board.board_cols}x${record.board.board_rows}` }}</span>
          <span class="table-cell">{{ record.type === 'S' ? 'Single-Player' : 'Multiplayer' }}</span>
          <span class="table-cell">{{ record.total_time }}</span>
          <span class="table-cell">{{ record.total_turns_winner }}</span>
          <span class="table-cell">{{ new Date(record.began_at).toLocaleDateString() }}</span>
          <span class="table-cell">{{ new Date(record.ended_at).toLocaleDateString() }}</span>
        </div>
      </div>
  
      <!-- Mensagem de erro -->
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="no-data">No data found.</div>
    </div>
  </template>
  
  <script>
  import { usePersonalScoreboardStore } from "@/stores/personalScoreboardStore";
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
  
  <style scoped>
  /* Estilo do container principal */
  .scoreboard {
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    border-radius: 12px;
    max-width: 900px;
    margin: 30px auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Título */
  .title-container {
    text-align: center;
    font-size: 32px;
    color: #333;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  /* Subtítulo */
  .subtitle {
    text-align: center;
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
  }
  
  /* Filtros */
  .filters-container {
    background: #ffffff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
  }
  
  .filters {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #555;
  }
  
  select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  
  /* Tabela de Scoreboard */
  .scoreboard-table-container {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 10px;
  }
  
  .scoreboard-table-header {
    display: flex;
    justify-content: space-around;
    background-color: #4CAF50;
    color: #ffffff;
    padding: 10px;
    font-weight: bold;
  }
  
  .scoreboard-table-header .header-cell {
    flex: 1;
    text-align: center;
  }
  
  .scoreboard-table-row {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .scoreboard-table-row:hover {
    background-color: #e8f5e9;
  }
  
  .scoreboard-table-row .table-cell {
    flex: 1;
    text-align: center;
  }
  
  /* Carregamento e Mensagens */
  .loader {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #777;
    margin-top: 20px;
  }
  
  .error {
    color: #e74c3c;
    text-align: center;
    margin-top: 10px;
  }
  
  .no-data {
    color: #777;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  