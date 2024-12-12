<template>
    <div class="start-new-game">
        
        <div class="button-container">
            <button @click="startGame(6)">3x4 (12 cards)</button>
            <button @click="startGame(8)">4x4 (16 cards)</button>
            <button @click="startGame(18)">6x6 (36 cards)</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Function to navigate to the MemoryGame component with the selected size
const startGame = (size) => {
    // Navigate to the 'start' route of 'memory-game', passing size as a query parameter
    router.push({ name: 'game', query: { size } });
};
</script>

<style scoped>
.button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>