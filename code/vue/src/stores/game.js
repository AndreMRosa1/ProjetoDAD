import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const games = ref([])

  const addGame = (name) => {
    games.value.push({ id: Date.now(), name })
  }

  return { games, addGame }
})