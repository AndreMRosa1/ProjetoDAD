<template>
    <div class="memory-game-container">
        <div class="gameButtons">
            <div class="turn-counter">Turns: {{ turnCounter }}</div>
            <div class="timer">Pairs: {{ pairCounter }}</div>
            <div class="timer">Timer: {{ timer }}s</div>
        </div>

        <div class="game-board"
            :style="{ gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows }">
            <Cell v-for="(card, idx) in board" :key="card.id" :card="card" :index="idx" @play="playCard" />
        </div>

        <div v-if="status" class="game-over">
            <h2>You Won!</h2>
            <button @click="restart">Restart Game</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Cell from './Cell.vue';
import { useMemoryGame } from './memorygame.js';

// Define the prop using defineProps()
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

<style scoped>
.memory-game-container {
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
}

.gameButtons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.game-board {
    display: grid;
    gap: 15px;
    max-width: 100%;
    max-height: 80%;
    width: 90vw;
    height: 70vh;
    margin: 2vh;
    overflow: hidden;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 0%;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card img {
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
}

.game-over {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    width: auto;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.hint-button {
    background-color: #ffee8c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.hint-button:hover {
    background-color: #FFFF00;
}

button:hover {
    background-color: #45a049;
}

.turn-counter {
    font-size: 18px;
    margin-bottom: 10px;
}

.timer {
    font-size: 18px;
    margin-bottom: 10px;
}

.gameButtons {
    display: flex;
    align-items: center;
    gap: 1rem;
}
</style>
