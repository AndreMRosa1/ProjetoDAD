import { ref, onUnmounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

export const useMemorygameStore = defineStore('memorygame', () => {
  const authStore = useAuthStore();
  const status = ref(null);
  const board = ref([]);
  const flippedCards = ref([]);
  const matchedCards = ref([]);
  const turnCounter = ref(0);
  const pairCounter = ref(0);
  const timer = ref(0);
  const gameStatus = ref('');
  let timerInterval = null;
  const gameStartTime = ref(null);
  const gameEndTime = ref(null);
  const gameId = ref(null);
  const gameSize = ref(0);
  const cardSize = ref(0);

  const initializeBoard = () => {
    const images = Object.values(import.meta.glob('@/assets/images/*.png', { eager: true }))
      .map(module => module.default)
      .slice(0, gameSize.value / 2);
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

  const start = async (size) => {
    gameStatus.value = 'I';
    gameSize.value = size
    initializeBoard();
    startTimer();
    const startedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameStartTime.value = startedAt;

    try {
      const response = await axios.post('/games', {
        created_user_id: authStore.user.id,
        type: 'S',
        status: gameStatus.value,
        board_id: getBoardId(gameSize.value),
        began_at: gameStartTime.value,
      });

      gameId.value = response.data.id;
    } catch (error) {
      console.error('Error saving game:', error.response?.data || error.message);
    }
  };

  const play = (index) => {
    if (status.value || flippedCards.value.length >= 2 || board.value[index].state === 'flipped') {
      return;
    }

    board.value[index].state = 'flipped';
    flippedCards.value.push(board.value[index]);

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
    gameStatus.value = 'E';
    const endedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameEndTime.value = endedAt;
    
    try {
      await axios.patch(`/games/${gameId.value}`, {
        winner_user_id: authStore.user.id,
        status: gameStatus.value,
        total_time: timer.value,
        total_turns_winner: turnCounter.value,
        ended_at: gameEndTime.value,
      });
    } catch (error) {
      console.error('Error updating game:', error.response?.data || error.message);
    }

  };

  const getBoardId = (size) => {
    const boardIds = { 12: 1, 16: 2, 36: 3 };
    return boardIds[size] || 1;
  };

  const useHint = () => {
    console.log(board.value)
    if (!board.value || board.value.length == 0) return 
  
    if (status.value || flippedCards.value.length > 0) {
      console.log('Hint not available: game is over or a turn is in progress.');
      return; // Avoid using hint during an ongoing turn
    }
  
    const unmatchedPairs = board.value.filter(card => card.state === 'hidden');
    console.log('Unmatched pairs:', unmatchedPairs);
  
    if (unmatchedPairs.length < 2) {
      console.log('Not enough unmatched cards for a hint.');
      return; // Not enough cards to hint
    }
  
    const seenFaces = new Map();
    let hintPair = [];
  
    for (const card of unmatchedPairs) {
      if (seenFaces.has(card.face)) {
        hintPair = [seenFaces.get(card.face), card];
        break;
      } else {
        seenFaces.set(card.face, card);
      }
    }
  
    if (hintPair.length === 2) {
      hintPair[0].state = 'revealed';
      hintPair[1].state = 'revealed';
      console.log('Hint pair revealed:', hintPair);

      // Check if this was the last pair
      const remainingHiddenCards = board.value.filter(card => card.state === 'hidden');
      if (remainingHiddenCards.length === 0) {
        console.log('Game over: all pairs matched.');
        status.value = 'gameover';
      }
    }

    pairCounter.value++;
  };

  onUnmounted(() => timerInterval && clearInterval(timerInterval));

  return { status, board, start, play, turnCounter, pairCounter, timer, useHint, gameSize };
})
