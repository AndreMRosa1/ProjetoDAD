import { ref, computed, inject } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "@/stores/error";
import { useAuthStore } from "@/stores/auth";
import { useMemorygameStore } from "@/stores/memorygame";
import { useToast } from "@/components/ui/toast/use-toast";
import dayjs from "dayjs";

export const useGamesStore = defineStore("games", () => {
  const storeAuth = useAuthStore();
  const storeError = useErrorStore();
  const storememoryGame = useMemorygameStore();
  const { toast } = useToast();
  const socket = inject("socket");

  const games = ref([]);

  const totalGames = computed(() => games.value.length);

  // Use this function to update the game object in the games array
  const updateGame = (game) => {
    const gameIndex = games.value.findIndex((g) => g.id === game.id);
    if (gameIndex !== -1) {
      games.value[gameIndex] = { ...game }; // shallow copy
    }
  };

  const playerNumberOfCurrentUser = (game) => {
    if (game.player1_id === storeAuth.user.id) {
      return 1;
    }
    if (game.player2_id === storeAuth.user.id) {
      return 2;
    }
    return null;
  };

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

  const removeGameFromList = (game) => {
    const gameIndex = games.value.findIndex((g) => g.id === game.id);
    if (gameIndex >= 0) {
      games.value.splice(gameIndex, 1);
    }
  };
  // fetch playing games from the Websocket server
  const fetchPlayingGames = () => {
    storeError.resetMessages();
    socket.emit("fetchPlayingGames", (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
      games.value = response;
    });
  };

  
  const play = (card, idx, board, gameId) => {
    storeError.resetMessages();
    socket.emit("play", idx, card, board, gameId,(response) => {
        if (webSocketServerResponseHasError(response)) {
          return;
        }
        storememoryGame.play(idx);
        updateGame(response);
      }
    );
  };


  const quit = (game) => {
    storeError.resetMessages();
    socket.emit("quitGame", game.id, (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
      removeGameFromList(game);
    });
  };
  const close = (game) => {
    storeError.resetMessages();
    socket.emit("closeGame", game.id, (response) => {
      if (webSocketServerResponseHasError(response)) {
        return;
      }
      removeGameFromList(game);
    });
  };
  socket.on("gameStarted", async (game) => {
    //console.log("game::::::", game)
    if (game.player1_id === storeAuth.user.id) {
      console.log("CHEGUEI AQUI!")
      console.log(storeAuth.user.id)
      toast({
        title: "Game Started",
        description: `Game #${game.id} has started!`,
      });
    }
    fetchPlayingGames();
  });
  socket.on("gameEnded", async (game) => {
    //updateGame(game);
    console.log("Game has ended: ", game);
    // Player that created the game is responsible for updating on the database
    if (playerNumberOfCurrentUser(game) === 1) {
      console.log({
        total_turns_winner: game.total_turns_winner,
        winner_user_id: game.winner,
      });      
      const APIresponse = await axios.patch("games/" + game.id, {
        status: "E",
        ended_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        //total_time: game.total_time,
        total_turns_winner:
          game.gameStatus === 1
            ? game.total_turns_winner[1]
            : game.gameStatus === 2
            ? game.total_turns_winner[2]
            : null,
        
        total_time:
          game.gameStatus === 1
            ? game.total_time[1]
            : game.gameStatus === 2
            ? game.total_time[2]
            : null,

        winner_user_id:
          game.gameStatus === 1
            ? game.player1_id
            : game.gameStatus === 2
            ? game.player2_id
            : null,
        
      });
      const updatedGameOnDB = APIresponse.data;
      console.log(
        "Game has ended and updated on the database: ",
        updatedGameOnDB
      );
    }
  });


  socket.on('gameUpdated', (updatedGame) => {
    // Atualizar o estado do jogo no cliente
    storememoryGame.board = updatedGame.board;
    storememoryGame.scores = updatedGame.scores;
    storememoryGame.currentPlayer = updatedGame.currentPlayer;
    storememoryGame.discoveredPairs = updatedGame.discoveredPairs;
  });

  socket.on("gameChanged", (game) => {
    //updateGame(game);
    //storememoryGame.board = game.board;
  });


  socket.on("gameQuitted", async (payload) => {
    if (payload.userQuit.id != storeAuth.user.id) {
      toast({
        title: "Game Quit",
        description: `${payload.userQuit.name} has quitted game #${payload.game.id}, giving you the win!`,
      });
    }
    updateGame(payload.game);
  });
  socket.on("gameInterrupted", async (game) => {
    //updateGame(game);
    toast({
      title: "Game Interruption",
      description: `Game #${game.id} was interrupted because your opponent has gone offline!`,
      variant: "destructive",
    });
    const APIresponse = await axios.patch("games/" + game.id, {
      status: "I",
     
    });
    const updatedGameOnDB = APIresponse.data;
    console.log(
      "Game was interrupted and updated on the database: ",
      updatedGameOnDB
    );
  });
  return {
    games,
    totalGames,
    playerNumberOfCurrentUser,
    fetchPlayingGames,
    play,
    quit,
    close,
  };
});
