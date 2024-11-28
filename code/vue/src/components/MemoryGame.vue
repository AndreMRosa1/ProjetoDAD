<template>
    <div class="game-board grid grid-cols-4 gap-4">
        <div v-for="card in cards" :key="card.id" class="card" :class="card.state" @click="onCardClick(card)">
            <img v-if="card.state !== 'hidden'" :src="card.face" alt="Card face">
            <img v-else src="../assets/images/semFace.png" alt="Card back">
        </div>
    </div>

    <!-- Game Over Message with Restart Button -->
    <div v-if="isGameOver" class="game-over">
        <h2>You Won</h2>
        <button @click="startGame">Restart Game</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // Access the route to get the size
const size = parseInt(route.query.size || 12); // Default to 12 if no size is selected

// Card state management
const cards = ref([]);
const flippedCards = ref([]); // To store the two flipped cards
const matchedCards = ref([]); // To store matched pairs
const isGameOver = ref(false);

// Dynamically import images using Vite's import.meta.glob
const images = Object.values(import.meta.glob('@/assets/images/*.png', { eager: true })).map(module => module.default).slice(0, size);

console.log(size); // Check if images are loaded

// Function to initialize the game
const startGame = () => {
    // Create paired cards array with hidden state and the image as face
    const pairedCards = [...images, ...images].map((image, index) => ({
        id: index,
        face: image,  // Set the image as the face of the card
        state: 'hidden'  // Initial state of the card
    }));

    cards.value = shuffle(pairedCards); // Shuffle the cards to randomize the order

    flippedCards.value = [];
    matchedCards.value = [];
    isGameOver.value = false;
};


// Shuffle function to randomize card order
const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// Function to handle card click
const onCardClick = (card) => {
    // Do nothing if the game is over or the card is already matched
    if (isGameOver.value || card.state === 'matched' || flippedCards.value.length === 2) return;

    // Flip the card
    card.state = 'flipped';
    flippedCards.value.push(card);

    // Check if two cards are flipped
    if (flippedCards.value.length === 2) {
        // Check if the cards match
        const [firstCard, secondCard] = flippedCards.value;
        if (firstCard.face === secondCard.face) {
            firstCard.state = 'matched';
            secondCard.state = 'matched';
            matchedCards.value.push(firstCard, secondCard);
            flippedCards.value = [];
        } else {
            // If not matched, flip the cards back after a delay
            setTimeout(() => {
                firstCard.state = 'hidden';
                secondCard.state = 'hidden';
                flippedCards.value = [];
            }, 1000); // You can increase the delay for more time to view the cards
        }
    }

    // Check if all cards are matched (game over)
    if (matchedCards.value.length === cards.value.length) {
        isGameOver.value = true;
    }
};

// Start the game when the component is mounted
onMounted(() => {
    startGame();
});
</script>

<style scoped>
.game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4 columns */
    gap: 1rem;
    max-width: 80%;
    margin: 4rem auto;
}

.card {
    position: relative;
    width: 100%;
    padding-top: 0%;
    /* Maintain a square aspect ratio */
    background-color: #f3f4f6;
    /* Ensure that the cards are visible */
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card img {
    max-width: 100%;
    max-height: 100%;
}

.game-over {
    text-align: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 20px;
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
