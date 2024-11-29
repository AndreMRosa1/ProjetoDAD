<template>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const size = parseInt(route.query.size || 12);

const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref([]);
const isGameOver = ref(false);

const images = Object.values(import.meta.glob('@/assets/images/*.png', { eager: true })).map(module => module.default).slice(0, size);

const startGame = () => {
    const pairedCards = [...images, ...images].map((image, index) => ({
        id: index,
        face: image,
        state: 'hidden'
    }));

    cards.value = shuffle(pairedCards);

    flippedCards.value = [];
    matchedCards.value = [];
    isGameOver.value = false;
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
        if (firstCard.face === secondCard.face) {
            firstCard.state = 'matched';
            secondCard.state = 'matched';
            matchedCards.value.push(firstCard, secondCard);
            flippedCards.value = [];
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
    }
};

onMounted(() => {
    startGame();
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
    gap: 1rem;
    max-width: 100%;
    max-height: 90%;
    width: 90vw;
    height: 80vh;
    margin: auto;
    overflow: hidden;
}

.card {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 0%;
    background-color: #f3f4f6;
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
    text-align: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 20px;
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
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>
