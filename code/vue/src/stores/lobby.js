import { ref, computed, inject } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axios from "axios";
import { useErrorStore } from "@/stores/error";
import { useAuthStore } from "@/stores/auth";
import { useMemorygameStore } from "@/stores/memorygame";
import dayjs  from 'dayjs';
import { useTransactionsStore } from "./transactions";

export const useLobbyStore = defineStore("lobby", () => {
  const storeAuth = useAuthStore();
  const storeError = useErrorStore();
  const router = useRouter();

  const socket = inject("socket");
  const storeMemorygame = useMemorygameStore();
  const games = ref([]);
  const gameId = ref(null);
  const errorStore = useErrorStore();

  const totalGames = computed(() => games.value.length);

  const webSocketServerResponseHasError = (response) => {
    if (response.errorCode) {
      storeError.setErrorMessages(
        response.errorMessage,
        [],
        response.errorCode
      );
      return true;
    }
    return false;
  };

  socket.on("lobbyChanged", (lobbyGames) => {
    games.value = lobbyGames;
  });

  // fetch lobby games from the Websocket server
  const fetchGames = () => {
    storeError.resetMessages();
    socket.emit("fetchGames", (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
      games.value = response;
    });
  };

  // add a game to the lobby
  const addGame = (gridSize) => {
    storeError.resetMessages();
    if(storeAuth.user.brain_coins_balance < 5){
      errorStore.setErrorMessages('Not enough Brain Coins', 'Not enough Brain Coins', 403, 'Not enough Brain Coins')
      return;
    }
    socket.emit("addGame", gridSize, (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
    });
  };

  // remove a game from the lobby
  const removeGame = (id) => {
    storeError.resetMessages();
    socket.emit("removeGame", id, (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
    });
  };

  // Whether the current user can remove a specific game from the lobby
  const canRemoveGame = (game) => {
    return game.player1.id === storeAuth.user.id;
  };

  // join a game of the lobby
  const joinGame = (id) => {
    storeError.resetMessages();
    socket.emit("joinGame", id, async (response) => {
      // callback executed after the join is complete
      if (webSocketServerResponseHasError(response)) {
        return;
      }
      
      storeMemorygame.startMultiplayer(getGridSize(response.board_id), 'M');
      //const game = storeMemorygame.gameData;
      //gameParaOCriador.value = response;
      const game = response; // Supondo que a resposta contém as informações do jogo
      const boardId = game.board_id; // Ou use game.gridSize para calcular o board_id
      const start_At = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const APIresponse = await axios.post("games", {
        player1_id: response.player1.id,
        player2_id: response.player2.id,
        created_user_id: storeAuth.user.id,
        type: "M",
        status: "PL",
        board_id: boardId,
        began_at: start_At,
        //id: response.id
      });


      const transactionsStore = useTransactionsStore();

      const payload = {
        transaction_datetime: new Date().toISOString(),
        user_id: game.player1.id, 
        game_id: game.id,
        type: 'I',
        brain_coins: 5,
      };
      console.log('Payload' , payload)
      await axios.patch(`/users/${response.player1.id}/reduce-coin`, { value: 5 });
      const response1 = await transactionsStore.createTransaction(payload);

      await storeAuth.updateUser();

      const payload2 = {
        transaction_datetime: new Date().toISOString(),
        user_id: game.player2.id, 
        game_id: game.id,
        type: 'I',
        brain_coins: 5,
      };
      console.log('Payload' , payload2)
      await axios.patch(`/users/${response.player2.id}/reduce-coin`, { value: 5 });
      const response2 = await transactionsStore.createTransaction(payload2);

      await storeAuth.updateUser();



      const newGameOnDB = APIresponse.data;
      gameId.value = newGameOnDB.id;
      newGameOnDB.player1SocketId = response.player1SocketId;
      newGameOnDB.player2SocketId = response.player2SocketId;
      newGameOnDB.player1_id = response.player1.id;
      newGameOnDB.player2_id = response.player2.id;
      newGameOnDB.total_turns_winner = 0;
      // After adding game to the DB emit a message to the server to start the game
      
      socket.emit("startGame", newGameOnDB,  storeMemorygame.board, (startedGame) => {
      });

    
    });
  };

  socket.on("gameStarted", (game) => {
    storeMemorygame.board = game.board;
    router.push({ name: 'gamemultiplayer', query: { size: getGridSize(game.board_id), id: game.id} });
  });

  const getGridSize = (boardId) => {
    switch (boardId) {
      case 2:
        return 16;
      case 3:
        return 36;
      default:
        return 16;
    }
  };

  // Whether the current user can join a specific game from the lobby
  const canJoinGame = (game) => {
    return storeAuth.user && game.player1.id !== storeAuth.user.id;
  };

  return {
    games,
    totalGames,
    gameId,
    fetchGames,
    addGame,
    joinGame,
    canJoinGame,
    removeGame,
    canRemoveGame,
  };
});
