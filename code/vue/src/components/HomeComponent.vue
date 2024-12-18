<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const startGame = (size) => {
  router.push({ name: 'game', query: { size } });
};
</script>

<template>
  <div class="flex flex-col items-center text-center space-y-8 max-h-[calc(100vh-5rem)]">
    <h1 class="text-4xl font-bold">MEMORY GAME</h1>
    <p class="text-lg">Find every pair!</p>

    <button @click="startGame(12)"
      class="bg-green-500 hover:bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300"
      v-if="!authStore.user">
      Play as Anonymous
    </button>

    <img src="/dog.png" alt="Dog" class="object-contain" />
  </div>
</template>
