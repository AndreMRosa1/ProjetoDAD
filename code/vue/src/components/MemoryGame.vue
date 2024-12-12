<template>
    <div class="gameButtons">
        <RouterLink to="/dashboard/new-memory-game" class="nav-link">
            <button>Go Back</button>
        </RouterLink>
        <button @click="startGame" v-if="isGameStarted = true">Start Game</button>
        <button class="hint-button" @click="useHint" v-if="authStore.user">Use Hint</button>
    </div>
    <div class="gameButtons" style="margin-top: 1vh;">
        <div class="turn-counter">Turns: {{ turnCounter }}</div>
        <div class="timer">Pairs: {{ pairCounter }}</div>
        <div class="timer">Timer: {{ timer }}s</div>
    </div>
    <div class="game-board grid grid-cols-4 gap-4"
        :style="{ gridTemplateColumns: size === 18 ? 'repeat(6, 1fr)' : 'repeat(4, 1fr)' }">
        <div v-for="card in cards" :key="card.id" class="card" :class="card.state">
            <img v-if="card.state !== 'hidden'" :src="card.face" alt="Card face">
            <img v-else src="../assets/images/semFace.png" alt="Card back" @click="onCardClick(card)">
        </div>
    </div>

    <div v-if="isGameOver" class="game-over">
        <h2>You Won!</h2>
        <button @click="startGame">Restart Game</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import dayjs from 'dayjs';


const authStore = useAuthStore();

const gameStartTime = ref(null);
const gameEndTime = ref(null);

const boardId = size => {
    switch (size) {
        case 6:
            return 1;
        case 8:
            return 2;
        case 18:
            return 3;
        default:
            throw new Error(`Invalid board size: ${size}`);
    }
};

var gameStatus = null;

const route = useRoute();
const size = parseInt(route.query.size || 12);

const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref([]);
const isGameOver = ref(false);
const isGameStarted = ref(false);
const turnCounter = ref(0);
const pairCounter = ref(0);
const timer = ref(0);
let timerInterval = null;

const images = Object.values(import.meta.glob('@/assets/images/*.png', { eager: true })).map(module => module.default).slice(0, size);

const startGame = () => {
    const startedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameStartTime.value = startedAt;

    const pairedCards = [...images, ...images].map((image, index) => ({
        id: index,
        face: image,
        state: 'hidden'
    }));

    cards.value = shuffle(pairedCards);

    flippedCards.value = [];
    matchedCards.value = [];
    turnCounter.value = 0;
    pairCounter.value = 0;
    timer.value = 0;
    isGameOver.value = false;

    startTimer();
    isGameStarted.value = true;
};

const endGame = async () => {
    clearInterval(timerInterval);
    isGameOver.value = true;
    const endedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameEndTime.value = endedAt;
    console.log("endedAT:" + endedAt + "       gameEndTime" + gameEndTime)
    gameStatus = 'E';
    try {
        const response = await axios.post('/games/single-player',
            {
                created_user_id: authStore.user.id,
                winner_user_id: authStore.user.id, type: 'S',
                status: gameStatus,
                board_id: boardId(size),
                total_time: timer.value,
                total_turns_winner: turnCounter.value,
                began_at: gameStartTime.value,
                ended_at: gameEndTime.value,
            });
        console.log('Game saved successfully:', response.data);
    }
    catch (error) {
        console.error('Error saving the game:', error.response?.data || error.message);
    };
};

const useHint = () => {
    const hiddenCards = cards.value.filter(card => card.state === 'hidden');
    const cardGroups = hiddenCards.reduce((groups, card) => {
        if (!groups[card.face]) {
            groups[card.face] = [];
        }
        groups[card.face].push(card);
        return groups;
    }, {});

    const pair = Object.values(cardGroups).find(group => group.length >= 2);

    if (pair) {
        pair[0].state = 'revealed';
        pair[1].state = 'revealed';

        // Ensure the cards remain face up
        cards.value = cards.value.map(card => {
            if (card.id === pair[0].id || card.id === pair[1].id) {
                return { ...card, state: 'revealed' };
            }
            return card;
        });

        // Add the revealed pair to matchedCards
        matchedCards.value.push(pair[0], pair[1]);

        // Increment the pair counter
        pairCounter.value++;

        // Check if the game is won
        if (matchedCards.value.length === cards.value.length) {
            isGameOver.value = true;
            endGame();
        }
    }
};

const startTimer = () => {
    if (isGameStarted.value === true) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer.value++;
        }, 1000);
    }
};

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const onCardClick = (card) => {
    if (isGameOver.value || card.state === 'matched' || flippedCards.value.length === 2) return;

    card.state = 'flipped';
    flippedCards.value.push(card);

    if (flippedCards.value.length === 2) {
        const [firstCard, secondCard] = flippedCards.value;
        turnCounter.value++;
        if (firstCard.face === secondCard.face) {
            firstCard.state = 'matched';
            secondCard.state = 'matched';
            matchedCards.value.push(firstCard, secondCard);
            flippedCards.value = [];
            pairCounter.value++;
        } else {
            setTimeout(() => {
                firstCard.state = 'hidden';
                secondCard.state = 'hidden';
                flippedCards.value = [];
            }, 1000);
        }
    }

    if (matchedCards.value.length === cards.value.length) {
        isGameOver.value = true;
        clearInterval(timerInterval);
        endGame();
    }
};



onMounted(() => {
    startGame();
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
body {
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f4f4;
}

.game-board {
    display: grid;
    gap: 0rem;
    max-width: 100%;
    max-height: 90%;
    width: 90vw;
    height: 80vh;
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
    padding: 10px 20px 10px 20px;
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
