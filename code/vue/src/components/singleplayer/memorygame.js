import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import dayjs from 'dayjs';

export function useMemoryGame(size) {
  const authStore = useAuthStore();
  const status = ref(null);
  const board = ref([]);
  const flippedCards = ref([]);
  const matchedCards = ref([]);
  const turnCounter = ref(0);
  const pairCounter = ref(0);
  const timer = ref(0);
  var gameStatus = ref('')
  let timerInterval = null;
  const gameStartTime = ref(null);
  const gameEndTime = ref(null);

  const initializeBoard = () => {
    const images = Object.values(import.meta.glob('@/assets/images/*.png', { eager: true }))
      .map(module => module.default)
      .slice(0, size / 2);
    const pairedCards = [...images, ...images].map((image, index) => ({
      id: index, 
      face: image, 
      state: 'hidden'
    }));
    board.value = pairedCards.sort(() => Math.random() - 0.5);
    flippedCards.value = [];
    matchedCards.value = [];
    turnCounter.value = 0;
    pairCounter.value = 0;
    timer.value = 0;
    status.value = null;
  };

  const start = () => {
    initializeBoard();
    startTimer();
    gameStatus = 'I';
    const startedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameStartTime.value = startedAt;
  };

  const play = (index) => {
    // Prevent flipping if the game is over or if 2 cards are already flipped
    if (status.value || flippedCards.value.length >= 2 || board.value[index].state === 'flipped') {
      return;
    }
  
    // Flip the selected card
    board.value[index].state = 'flipped';
    flippedCards.value.push(board.value[index]);
  
    // Check for a match once two cards are flipped
    if (flippedCards.value.length === 2) {
      turnCounter.value++;
      if (flippedCards.value[0].face === flippedCards.value[1].face) {
        matchedCards.value.push(...flippedCards.value);
        pairCounter.value++;
        flippedCards.value = [];
        if (matchedCards.value.length === board.value.length) {
          status.value = true;
          endGame();
        }
      } else {
        // If no match, flip them back after 1 second
        setTimeout(() => {
          flippedCards.value.forEach(card => card.state = 'hidden');
          flippedCards.value = [];
        }, 1000);
      }
    }
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => timer.value++, 1000);
  };

  const endGame = async () => {
    clearInterval(timerInterval);
    gameStatus = 'E';
    const endedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameEndTime.value = endedAt;
    try {
      await axios.post('/games/single-player', {
        created_user_id: authStore.user.id,
        winner_user_id: authStore.user.id,
        type: 'S',
        status: gameStatus,
        board_id: getBoardId(size),
        total_time: timer.value,
        total_turns_winner: turnCounter.value,
        began_at: gameStartTime.value,
        ended_at: gameEndTime.value,
      });
    } catch (error) {
      console.error('Error saving game:', error.response?.data || error.message);
    }
  };

  const getBoardId = (size) => {
    const boardIds = { 12: 1, 16: 2, 36: 3 };
    return boardIds[size] || 0;
  };

  const useHint = () => {
  };
  
  onMounted(()=>start())
  onUnmounted (() => timerInterval && clearInterval(timerInterval));

  return { status, board, start, play, turnCounter, pairCounter, timer, useHint };
}
