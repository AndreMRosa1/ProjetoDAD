<template>
    <div class="memory-game-container flex">
        <div class="game-board grid gap-1 overflow-hidden mt-1"
            :style="{ gridTemplateColumns: boardGridTemplateColumns, gridTemplateRows: boardGridTemplateRows }">
            <Cell v-for="(card, idx) in memoryGameStore.board" :key="card.id" :card="card" :index="idx"
                @play="playCard" />
        </div>

        <div class="gameButtons flex flex-col justify-start ml-5 mt-5 whitespace-nowrap w-32">
            <div class="turn-counter text-lg mb-2">Turns: {{ memoryGameStore.turnCounter }}</div>
            <div class="timer text-lg mb-2">Pairs: {{ memoryGameStore.pairCounter }}</div>
            <div class="timer text-lg">Timer: {{ memoryGameStore.timer }}s</div>
        </div>

        <div v-if="memoryGameStore.status"
            class="game-over fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-5 bg-white rounded-lg shadow-lg z-50">
            <h2 class="text-2xl">You Won!</h2>
            <button @click="restart(props.size)"
                class="mt-4 p-3 bg-green-500 text-white rounded-md hover:bg-green-600">Restart
                Game</button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Cell from './Cell.vue';
import { useMemorygameStore } from './memorygame.js';

const props = defineProps({
    size: {
        type: Number,
        required: true
    },
});
const memoryGameStore = useMemorygameStore()

const boardGridTemplateColumns = computed(() => {
    if (props.size === 12) return 'repeat(4, 1fr)';  // 3x4 grid
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)';  // 6x6 grid
    return 'repeat(4, 1fr)';
});

const boardGridTemplateRows = computed(() => {
    if (props.size === 12) return 'repeat(3, 1fr)';  // 3x4 grid
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)';  // 6x6 grid
    return 'repeat(4, 1fr)';
});

const playCard = (index) => {
    memoryGameStore.play(index);
};

const restart = (size) => {
    memoryGameStore.start(size)
}
</script>
