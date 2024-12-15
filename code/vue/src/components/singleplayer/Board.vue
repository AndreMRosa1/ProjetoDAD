<template>
    <div class="memory-game-container flex justify-between p-5 max-w-full mx-auto">
        <div class="game-board grid gap-4 max-w-full max-h-[80vh] w-[70vw] h-[70vh] m-2 overflow-hidden"
            :style="{ gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows }">
            <Cell v-for="(card, idx) in board" :key="card.id" :card="card" :index="idx" @play="playCard" />
        </div>

        <div class="gameButtons flex flex-col justify-start gap-4 ml-5 mt-5 whitespace-nowrap">
            <div class="turn-counter text-lg mb-2">Turns: {{ turnCounter }}</div>
            <div class="timer text-lg mb-2">Pairs: {{ pairCounter }}</div>
            <div class="timer text-lg">Timer: {{ timer }}s</div>
        </div>

        <div v-if="status"
            class="game-over fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-5 bg-white rounded-lg shadow-lg z-50">
            <h2 class="text-2xl">You Won!</h2>
            <button @click="restart" class="mt-4 p-3 bg-green-500 text-white rounded-md hover:bg-green-600">Restart
                Game</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Cell from './Cell.vue';
import { useMemoryGame } from './memorygame.js';

const props = defineProps({
    size: {
        type: Number,
        required: true
    }
});

const {
    status,
    board,
    start,
    play,
    turnCounter,
    pairCounter,
    timer,
    useHint
} = useMemoryGame(props.size);  // Use the size prop dynamically

// Compute gridTemplateColumns and gridTemplateRows dynamically based on size
const gridTemplateColumns = computed(() => {
    if (props.size === 12) return 'repeat(4, 1fr)';  // 3x4 grid
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)';  // 6x6 grid
    return 'repeat(4, 1fr)';
});

const gridTemplateRows = computed(() => {
    if (props.size === 12) return 'repeat(3, 1fr)';  // 3x4 grid
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)';  // 6x6 grid
    return 'repeat(4, 1fr)';
});

const playCard = (index) => {
    play(index);
};

watch(status, (newValue) => {
    if (newValue) {
        console.log('Game status changed:', newValue);
    }
});

const restart = () => {
    start();
};

defineExpose({
    start,
    useHint
});
</script>
