<template>
  <div class="p-8 mx-auto max-w-3xl min-w-96">
    <div class="gameButtons">
      <RouterLink to="/new-memory-game" class="nav-link">
        <button>Go Back</button>
      </RouterLink>
      <button class="hint-button" @click="memoryGame.useHint" v-if="authStore.user">
        Use Hint
      </button>
    </div>

    <!-- Pass the size as a prop here -->
    <Board ref="boardComponent" :size="size" @game-started="gameStarted = true" @game-ended="gameStarted = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Board from './Board.vue';
import { useMemoryGame } from './memorygame';

const authStore = useAuthStore();
const route = useRoute();
const gameStarted = ref(false);
const boardComponent = ref(null);

const size = ref(Number(new URLSearchParams(window.location.search).get('size')));  // This will dynamically pick the size

const memoryGame = useMemoryGame(size);

</script>

<style scoped>
.gameButtons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  /* Ensures the container takes up full width */
}

button {
  padding: 0.5rem 1rem;
  background-color: #38a169;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  /* Make all buttons take equal width */
  text-align: center;
  /* Centers the text */
}

button:hover {
  background-color: #2f855a;
}

.hint-button {
  background-color: #f6ad55;
}

.hint-button:hover {
  background-color: #dd6b20;
}
</style>
