import { ref, onUnmounted, useTransitionState } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { useErrorStore } from '@/stores/error'
import router from '@/router';
import { useTransactionsStore } from './transactions';

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
  const gameType = ref('');
  const gameData = ref([]);
  const errorStore = useErrorStore()

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

  const start = async (size, type) => {
    if (size == 90) {
      gameSize.value = 12;
      initializeBoard();
      startTimer();
      return;
    }
    if(size !=12 && authStore.user.brain_coins_balance < 1) {
      errorStore.setErrorMessages('Not enough Brain Coins')
      router.push('/new-memory-game')
      return
    }
    if (size != 12) {
      await axios.patch('/users/me/reduce-coin', { value: 1 });
      await authStore.updateUser();
    }
    gameStatus.value = 'I';
    gameSize.value = size
    gameType.value = type
    initializeBoard();
    startTimer();
    const startedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    gameStartTime.value = startedAt;

    try {
      const response = await axios.post('/games', {
        created_user_id: authStore.user.id,
        type: type,
        status: gameStatus.value,
        board_id: getBoardId(gameSize.value),
        began_at: gameStartTime.value,
      });
      console.log("ISTO É A RESPOSTA DA API")
      console.log(response.data);
      gameId.value = response.data.id;

      gameData.value = response.data;
      //console.log("GAME DATAAAAAAAAAA") //ate aqui tem dados
      //console.log(gameData.value)
      handlePurchase();
    } catch (error) {
      console.error('Error saving game:', error.response?.data || error.message);
    }
  };

  const startMultiplayer = async (size, type) => {
    gameStatus.value = 'I';
    gameSize.value = size
    gameType.value = type
    initializeBoard();
    startTimer();
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
  
        setTimeout(() => {
          flippedCards.value.forEach(card => {
            card.state = 'invisible'; 
          });
          flippedCards.value = []; 
  
          if (matchedCards.value.length === board.value.length) {
            status.value = true;
            endGame();
          }
        }, 1000);
      } else {
        setTimeout(() => {
          flippedCards.value.forEach(card => card.state = 'hidden');
          flippedCards.value = [];
        }, 1000);  // Flip the cards back after 1 second if no match
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

  const useHint = async () => {

    if( authStore.user.brain_coins_balance < 1) {
      errorStore.setErrorMessages('Not enough Brain Coins')
      return
    }
  
    if (!board.value || board.value.length === 0) return;
  
    // Check if the game is over or a turn is in progress
    if (status.value || flippedCards.value.length > 0) {
      console.log('Hint not available: game is over or a turn is in progress.');
      return;
    }
  
    // Filter out cards that are already revealed
    const hiddenCards = board.value.filter(card => card.state === 'hidden');
  
    if (hiddenCards.length < 2) {
      console.log('Not enough hidden cards for a hint.');
      return;
    }
  
    // Randomly select two hidden cards
    const randomIndexes = [];
    while (randomIndexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * hiddenCards.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }
  
    const hintPair = [hiddenCards[randomIndexes[0]], hiddenCards[randomIndexes[1]]];
  
    // Flip the selected cards
    hintPair.forEach(card => {
      card.state = 'revealed';
    });
  
    // Wait 1.5 seconds before flipping them back
    setTimeout(() => {
      hintPair.forEach(card => {
        card.state = 'hidden';
      });
    }, 1500);
  
    // Deduct coins only after revealing the hint
    try {
      await axios.patch('/users/me/reduce-coin', { value: 1 }); // API call to reduce coins
      handlePurchase();
      await authStore.updateUser(); // Update user data to refresh coin balance
    } catch (error) {
      errorStore.setErrorMessages('Not enough Brain Coins')
    }
  };

const handlePurchase = async () => {
  try {
    const payload = {
      transaction_datetime: new Date().toISOString(), // Current datetime
      user_id: authStore.user.id, // Replace with actual user ID if available
      game_id: gameId.value,
      type: 'I',
      brain_coins: 1,
    };
  
    const transactionsStore = useTransactionsStore();
  
    // Call the transactions store's createTransaction method
    const response = await transactionsStore.createTransaction(payload);
  } catch (error) {
    errorStore.setErrorMessages('Error storing transaction');
  }
};

  onUnmounted(() => timerInterval && clearInterval(timerInterval));
  return { status, board, start, startMultiplayer, play, turnCounter, pairCounter, timer, useHint, gameData, handlePurchase, gameSize }; //aqui tinha gameId

  //return { status, board, start, play, turnCounter, pairCounter, timer, useHint, gameSize, handlePurchase };
})
