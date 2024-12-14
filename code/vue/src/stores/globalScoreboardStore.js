import { defineStore } from "pinia";
import axios from "axios";

export const useScoreboardStore = defineStore("scoreboard", {
  state: () => ({
    globalScoreboard: [], // Lista de scores globais
    personalScoreboard: [], // Lista de scores pessoais
    isLoading: false, // Estado de carregamento
    error: null, // Mensagem de erro
  }),

  actions: {
    // Validação dos filtros para o scoreboard global
    validateFilters({ sortBy, type, boardSize }) {
      const errors = {};

      if (!["time", "turns"].includes(sortBy)) {
        errors.sortBy = "O parâmetro de ordenação é inválido.";
      }

      if (type && !["S", "M"].includes(type)) {
        errors.type = "O tipo de jogo deve ser 'S' (single-player) ou 'M' (multiplayer).";
      }

      if (boardSize && !/^\d+x\d+$/.test(boardSize)) {
        errors.boardSize = "O tamanho do tabuleiro deve estar no formato 'NxN' (ex: 3x4, 4x4).";
      }

      return errors;
    },

    // Buscar scoreboard global com filtros
    async fetchGlobalScoreboard({ sortBy = "time", type = "", boardSize = "" } = {}) {
      this.isLoading = true;
      this.error = null;

      // Validação
      const errors = this.validateFilters({ sortBy, type, boardSize });
      if (Object.keys(errors).length > 0) {
        this.error = "Parâmetros inválidos.";
        console.error(errors);
        this.isLoading = false;
        return;
      }

      try {
        // Construir a query string com os parâmetros de filtro
        const params = new URLSearchParams({
          sort_by: sortBy, // "time" ou "turns"
          type: type, // "S", "M" ou vazio (todos)
          board_size: boardSize, // "3x4", "4x4", "6x6" ou vazio
        }).toString();

        // Fazer a requisição para a API
        const response = await axios.get(`/scoreboards/global?${params}`);

        // Atualizar a lista global
        this.globalScoreboard = response.data;
      } catch (err) {
        console.error("Erro ao buscar scoreboard:", err);
        this.error = "Falha ao buscar a tabela global.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
