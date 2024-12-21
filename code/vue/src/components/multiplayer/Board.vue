<template>
    <div>
        <div class="grid max-h-full"
            :style="{ gridTemplateColumns: boardGridTemplateColumns, gridTemplateRows: boardGridTemplateRows }"
            style="max-width:fit-content;">
            <Cell v-for="(card, idx) in memoryGameStore.board" :key="card.id" :card="card" :index="idx"
                @play="playCard" />
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
import { useMemorygameStore } from '@/stores/memorygame.js';
//import { useLobbyStore } from '@/stores/lobby';

const props = defineProps({
    size: {
        type: Number,
        required: true
    },
    board: {
        type: Array,
        required: true
    }
});
//const lobbyStore = useLobbyStore()
const memoryGameStore = useMemorygameStore()
//console.log(lobbyStore.games.board)
//console.log('Tamanho do tabuleiro:', props.size);
//console.log('Tabuleiro inicial:', memoryGameStore.board);

console.log(props.size)

const boardGridTemplateColumns = computed(() => {
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)'; // 6x6 grid
    return 'repeat(4, 1fr)';
});

const boardGridTemplateRows = computed(() => {
    if (props.size === 16) return 'repeat(4, 1fr)';  // 4x4 grid
    if (props.size === 36) return 'repeat(6, 1fr)';   // 6x6 grid
    return 'repeat(4, 1fr)';
});

const playCard = (index) => {
    memoryGameStore.play(index);
};

const restart = (size) => {
    memoryGameStore.start(size)
}
</script>
