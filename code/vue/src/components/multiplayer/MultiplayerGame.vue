<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'

const storeAuth = useAuthStore()
const storeGame = useGameStore()

const newGameName = ref('')

const createGame = () => {
  if (newGameName.value.trim()) {
    storeGame.addGame(newGameName.value)
    newGameName.value = ''
  }
}

const games = computed(() => storeGame.games)
</script>

<template>
  <div class="flex flex-wrap justify-start space-x-4">
    <div v-if="storeAuth.user" class="w-72">
      <form @submit.prevent="createGame" class="mb-4">
        <input v-model="newGameName" type="text" placeholder="Game Name" class="input" />
        <button type="submit" class="btn">Create Game</button>
      </form>
      <Game v-for="game in games" :key="game.id" :game="game" class="mb-2"></Game>
    </div>
    <Games v-if="storeAuth.user" class="flex-1 min-w-96"></Games>
  </div>
</template>
