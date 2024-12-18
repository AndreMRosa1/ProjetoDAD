<template>
  <div class="flex justify-center items-center h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)]">
    <div class="flex gap-8">
      <!-- Sidebar -->
      <div class="flex flex-col gap-3 flex-shrink-0">
        <div>
          <div class="text-lg">Turns: {{ memorygame.turnCounter }}</div>
          <div class="text-lg">Pairs: {{ memorygame.pairCounter }}</div>
          <div class="text-lg">Timer: {{ memorygame.timer }}s</div>
        </div>

        <button
          class="whitespace-nowrap px-8 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
          @click="memorygame.useHint" v-if="authStore.user">
          Use Hint
        </button>

        <RouterLink to="/new-memory-game" class="nav-link">
          <button v-if="authStore.user"
            class="whitespace-nowrap px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none">
            Go Back
          </button>
        </RouterLink>
      </div>

      <!-- Board Container -->
      <div class="flex-grow">
        <Board ref="boardComponent" :size="size" @game-started="gameStarted = true" @game-ended="gameStarted = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Board from './Board.vue';
import { useMemorygameStore } from '../../stores/memorygame';

const authStore = useAuthStore();
const gameStarted = ref(false);
const boardComponent = ref(null);

const size = ref(Number(new URLSearchParams(window.location.search).get('size')));

const memorygame = useMemorygameStore();

onMounted(() => {
  document.body.style.overflow = 'hidden';
  memorygame.start(size.value);
});
</script>
