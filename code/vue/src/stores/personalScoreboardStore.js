import { defineStore } from "pinia";
import axios from "axios";

export const usePersonalScoreboardStore = defineStore("personalScoreboard", {
  state: () => ({
    personalScoreboard: [], // Lista de scores pessoais
    isLoading: false, // Estado de carregamento
    error: null, // Mensagem de erro
  }),

  actions: {
    // Validação dos filtros para o scoreboard pessoal
    validateFilters({ type, boardSize }) {
      const errors = {};

      if (type && !["S", "M"].includes(type)) {
        errors.type = "O tipo de jogo deve ser 'S' (single-player) ou 'M' (multiplayer).";
      }

      if (boardSize && !/^\d+x\d+$/.test(boardSize)) {
        errors.boardSize = "O tamanho do tabuleiro deve estar no formato 'NxN' (ex: 3x4, 4x4).";
      }

      return errors;
    },

    // Buscar scoreboard pessoal com filtros e ordenação
    async fetchPersonalScoreboard({ type = "", boardSize = "", sortBy = "total_time", sortOrder = "asc" } = {}) {
      this.isLoading = true;
      this.error = null;

      // Validação
      const errors = this.validateFilters({ type, boardSize });
      if (Object.keys(errors).length > 0) {
        this.error = "Parâmetros inválidos.";
        console.error(errors);
        this.isLoading = false;
        return;
      }

      try {
        // Construir a query string com os parâmetros de filtro
        const params = new URLSearchParams({
          type, // "S", "M" ou vazio (todos)
          board_size: boardSize, // "3x4", "4x4", "6x6" ou vazio
          sort_by: sortBy, // Critério de ordenação
          sort_order: sortOrder, // Ordem
        }).toString();

        // Fazer a requisição para a API
        const response = await axios.get(`/scoreboards/personal?${params}`);

        // Atualizar a lista pessoal
        this.personalScoreboard = response.data;
      } catch (err) {
        console.error("Erro ao buscar scoreboard pessoal:", err);
        this.error = "Falha ao buscar a tabela pessoal.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
