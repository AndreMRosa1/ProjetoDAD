<template>
  <div class="p-8 mx-auto max-w-3xl min-w-96">
    <div class="game-container flex gap-8 justify-center h-screen">
      <!-- Buttons container on the left -->
      <div class="gameButtons flex flex-col gap-4 w-38 mt-10">
        <RouterLink to="/new-memory-game" class="nav-link">
          <button class="btn-primary w-full whitespace-nowrap px-8">Go Back</button>
        </RouterLink>
        <button class="hint-button bg-orange-400 hover:bg-orange-600 w-full whitespace-nowrap px-8"
          @click="useMemoryGame.useHint" v-if="authStore.user">
          Use Hint
        </button>
      </div>

      <!-- Board component on the right, takes the remaining space -->
      <Board ref="boardComponent" :size="size" @game-started="gameStarted = true" @game-ended="gameStarted = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Board from './Board.vue';
import { useMemoryGame } from './memorygame';

const authStore = useAuthStore();
const route = useRoute();
const gameStarted = ref(false);
const boardComponent = ref(null);

const size = ref(Number(new URLSearchParams(window.location.search).get('size')));  // This will dynamically pick the size

onMounted(() => {
  document.body.classList.add('overflow-hidden');
});

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden');
});
</script>
