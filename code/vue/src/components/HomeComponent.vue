<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Function to navigate to the MemoryGame component with the selected size
const startGame = (size) => {
    // Navigate to the 'start' route of 'memory-game', passing size as a query parameter
    router.push({ name: 'game', query: { size } });
};
</script>

<template>
  <div class="flex flex-col items-center text-center space-y-8 py-12">
    <h1>MEMORY GAME</h1>
    <button @click="startGame(6)" class="bg-green-500 text-white px-4 py-2 rounded" >
    Play as Anonymous</button> 
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3b82f6;
}
</style>