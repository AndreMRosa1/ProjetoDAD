<template>
  <div class="flex justify-center items-center h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)]">
    <div class="flex gap-8" :class="{ 'mt-40': !authStore.user }">
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
            class="whitespace-nowrap px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
            @click.prevent="showExitModal = true">
            Go Back
          </button>
        </RouterLink>
      </div>

      <!-- Board Container -->
      <div class="flex-grow">
        <Board ref="boardComponent" :size="size" @game-started="gameStarted = true" @game-ended="gameStarted = false" />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showExitModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-8 rounded-lg shadow-lg">
        <h3 class="text-lg mb-4">Are you sure you want to leave the game?</h3>
        <div class="flex gap-4">
          <button class="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            @click="cancelExit">Cancel</button>
          <RouterLink to="/new-memory-game"
            class="whitespace-nowrap px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none">
            Confirm
          </RouterLink>
        </div>
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
const showExitModal = ref(false); // Controls visibility of the modal

const size = ref(Number(new URLSearchParams(window.location.search).get('size')));

const memorygame = useMemorygameStore();

onMounted(() => {
  document.body.style.overflow = 'hidden';
  memorygame.start(size.value);
});

// Cancel exit and close the modal
const cancelExit = () => {
  showExitModal.value = false;
};
</script>
