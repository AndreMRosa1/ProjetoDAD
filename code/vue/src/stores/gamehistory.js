import { defineStore } from 'pinia';
import axios from 'axios';

export const useGameHistoryStore = defineStore('gameHistory', {
  state: () => ({
    games: [],
    currentPage: 1,
    totalPages: 1,
    inputPage: 1,
  }),

  actions: {
    formatDate(isoString) {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      return date.toLocaleString('pt-PT', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    },

    async fetchUserName(id) {
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
    },

    async fetchGameHistory(page = 1) {
      try {
        const response = await axios.get(`/history?page=${page}`);
        const gamesData = await Promise.all(response.data.data.map(async (game) => {
          const winnerName = await this.fetchUserName(game.winner_user_id);
          return {
            ...game,
            began_at: this.formatDate(game.began_at),
            ended_at: game.ended_at ? this.formatDate(game.ended_at) : 'In Progress',
            winner_name: winnerName,
          };
        }));
        this.games = gamesData;
        this.totalPages = response.data.last_page; // Set the total pages
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    },

    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.inputPage = page; // Update input box when page is changed
        this.fetchGameHistory(page);
      }
    },

    onPageInputBlur() {
      if (this.inputPage < 1 || this.inputPage > this.totalPages) {
        this.inputPage = this.currentPage; // Reset input to the current page if out of bounds
      } else {
        this.handlePageChange(this.inputPage);
      }
    },

    handlePageInput() {
      if (this.inputPage >= 1 && this.inputPage <= this.totalPages) {
        this.handlePageChange(this.inputPage);
      } else {
        this.inputPage = this.currentPage; // Reset input if value is invalid
      }
    },
  },
});
