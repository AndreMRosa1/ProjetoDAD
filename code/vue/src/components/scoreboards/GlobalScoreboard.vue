<template>
  <div class="scoreboard">
    <h1 class="title-container">
      <span class="icon-world rotating-icon">🌍</span> Global Scoreboard
    </h1>
    <p class="subtitle">memorize it fast</p>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="filters">
        <!-- Ordenação -->
        <label>
          <span>Order by:</span>
          <select v-model="filters.sortBy" @change="applyFilters">
            <option value="time">Lower Time</option>
            <option value="turns">Lower Turns</option>
          </select>
        </label>

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
            <option value="3x4">3x4</option>
            <option value="4x4">4x4</option>
            <option value="6x6">6x6</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="loader">Loading...</div>

    <!-- Tabela de Scoreboard -->
    <div v-else-if="globalScoreboard.length > 0" class="scoreboard-table-container">
      <div class="scoreboard-table-header">
        <span class="header-cell">Rank</span>
        <span class="header-cell">Player</span>
        <span class="header-cell">Board</span>
        <span class="header-cell">Time</span>
        <span class="header-cell">Turns</span>
      </div>
      <div v-for="(record, index) in globalScoreboard" :key="index" class="scoreboard-table-row">
        <span class="table-cell">{{ index + 1 }}</span> <!-- Rank -->
        <span class="table-cell">{{ record.creator.nickname }}</span>
        <span class="table-cell">{{ `${record.board.board_cols}x${record.board.board_rows}` }}</span>
        <span class="table-cell">{{ record.best_time }}</span>
        <span class="table-cell">{{ record.best_turns }}</span>
      </div>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="no-data">No data found.</div>
  </div>
</template>

<script>
import { useScoreboardStore } from "@/stores/globalScoreboardStore";
import { storeToRefs } from "pinia";
import { reactive, onMounted } from "vue";

export default {
  setup() {
    const scoreboardStore = useScoreboardStore();

    const { globalScoreboard, isLoading, error } = storeToRefs(scoreboardStore);
    const filters = reactive({
      sortBy: "time",
      type: "",
      boardSize: "3x4", // Definindo o valor inicial do filtro como "3x4"
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

<style scoped>
/* Container principal */
.scoreboard {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 900px;
  margin: 30px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Contêiner do título */
.title-container {
  text-align: center;
  font-size: 32px;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  margin-bottom: 10px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra no título */
}

/* Ícone de mundo com rotação */
.icon-world.rotating-icon {
  font-size: 30px;
  margin-right: 10px;
  color: #4CAF50;
  vertical-align: middle;
  display: inline-block;
  animation: rotate 5s linear infinite;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Sombra no ícone */
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  box-shadow: none;
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
  margin-bottom: 10px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: border 0.3s;
}

select:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Contêiner da tabela */
.scoreboard-table-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Cabeçalho da tabela */
.scoreboard-table-header {
  display: flex;
  justify-content: space-around;
  background-color: #4CAF50; /* Verde */
  color: #ffffff;
  padding: 10px;
  border-bottom: 1px solid #333;
  font-weight: bold;
}

.scoreboard-table-header .header-cell {
  flex: 1;
  text-align: center;
}

/* Linhas da tabela */
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
