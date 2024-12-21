exports.createGameEngine = () => {
    const initGame = (gameFromDB, board) => {
      //console.log("boardrecebido!")
      //console.log(board)
      //board = board.value.sort(() => Math.random() - 0.5);
      gameFromDB.board = board; //esta a funcionar ate aqui
      //console.log("gameFromDB.board!!")
      //console.log(gameFromDB.board);
      //gameFromDB.total_turns_winner = 0;
      gameFromDB.gameStatus = 0; // pending -> game has not started yet
      gameFromDB.currentPlayer = 1; // Player 1 starts
      //gameFromDB.board = shuffleBoard(gameFromDB.board); // Shuffle the tiles on the board
      gameFromDB.discoveredPairs = []; // List of discovered pairs
      gameFromDB.scores = { 1: 0, 2: 0 }; // Players' scores
      gameFromDB.total_time = { 1: 0, 2: 0 }; // Tempo total para cada jogador
      gameFromDB.currentTurnStartTime = null; // Armazena o momento em que o jogador atual começou a jogar
      gameFromDB.total_turns_winner = { 1: 0, 2: 0 }; // Players' scores
      gameFromDB.selectedTiles = []; // Temporarily store selected tiles

      //console.log(gameFromDB)
      return gameFromDB;
    };
  
    // Check if the selected tiles form a pair
    function isPair(game, tile1, tile2) {
      // Compara as propriedades `face` das duas cartas
      const card1 = game.board.find((card) => card.id === tile1);
      const card2 = game.board.find((card) => card.id === tile2);
    
      if (!card1 || !card2) {
        console.error(`Erro: Não foi possível encontrar as cartas com IDs ${tile1} e ${tile2}.`);
        return false;
      }
    
      /*console.log(`Verificando par: 
        Carta 1 - ID: ${tile1}, Face: ${card1.face}
        Carta 2 - ID: ${tile2}, Face: ${card2.face}`);*/
      
      return card1.face === card2.face;
    }    
  

    const gameEnded = (game) => {
      if(game.status === 'E') {
        return true;
      }
      return false;
    };

    // Check if the game is over (all pairs found)
    const isGameOver = (game) => {
      return game.discoveredPairs.length * 2 === game.board.length;
    };
  
    // Change the game status when the game ends
    const changeGameStatus = (game) => {
      if (isGameOver(game)) {
        game.status = 'E';
        game.winner = determineWinner(game);
        game.gameStatus = determineWinner(game);
      } else {
        game.status = 'PL';
      }
    };

    const determineWinner = (game) => {
      if (game.scores[1] > game.scores[2]) {
        return 1; // Player 1 venceu
      } else if (game.scores[2] > game.scores[1]) {
        return 2; // Player 2 venceu
      } else {
        return null; // Empate
      }
    };
    
    
  
    // Handle a player making a move
    const playTurn = (game, card, playerSocketId) => {
      if (game.status !== 'PL') {
        return { errorCode: 11, errorMessage: 'Game is not in playing state!' };
      }
    
      if (playerSocketId !== game[`player${game.currentPlayer}SocketId`]) {
        return { errorCode: 12, errorMessage: 'It is not your turn!' };
      }
    
      if (game.discoveredPairs.flat().includes(card.id)) {
        return { errorCode: 13, errorMessage: 'Tile already discovered!' };
      }
    
      // Calcula o tempo gasto pelo jogador atual
      const now = Date.now();
      if (game.currentTurnStartTime) {
        const timeSpent = Math.floor((now - game.currentTurnStartTime) / 1000); // Tempo em segundos
        game.total_time[game.currentPlayer] += timeSpent;
      }
    
      // Atualiza o início do turno
      game.currentTurnStartTime = now;
    
      // Adiciona o cartão selecionado
      game.selectedTiles.push(card.id);
    
      if (game.selectedTiles.length === 2) {
        const [tile1, tile2] = game.selectedTiles;
    
        // Verifica se o jogador clicou na mesma carta duas vezes
        if (tile1 === tile2) {
          game.selectedTiles = [tile1]; // Mantém apenas a primeira carta selecionada
          return { errorCode: 14, errorMessage: 'You cannot select the same tile twice!' };
        }
    
        if (isPair(game, tile1, tile2)) {
          game.board.find(card => card.id === tile1).state = "paired";
          game.board.find(card => card.id === tile2).state = "paired";
    
          game.discoveredPairs.push([tile1, tile2]);
          game.scores[game.currentPlayer]++;
          game.total_turns_winner[game.currentPlayer]++;
          game.selectedTiles = [];
        } else {
          game.selectedTiles = [];
          game.total_turns_winner[game.currentPlayer]++;
          game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
          game.currentTurnStartTime = null; // Pausa o tempo até o próximo turno
        }
      }
    
      if (isGameOver(game)) {
        console.log("ENTREI NO GAMEOVER");
    
        // Calcula o tempo final do último jogador antes de encerrar o jogo
        if (game.currentTurnStartTime) {
          const timeSpent = Math.floor((Date.now() - game.currentTurnStartTime) / 1000); // Tempo em segundos
          game.total_time[game.currentPlayer] += timeSpent;
          game.currentTurnStartTime = null; // Finaliza o cálculo de tempo
        }
    
        changeGameStatus(game);
        gameEnded(game);
      }
      return true;
    };
    
    
  
    // Handle a player quitting the game
    const quit = (game, playerSocketId) => {
      if ((playerSocketId !== game.player1SocketId) &&
          (playerSocketId !== game.player2SocketId)) {
        return { errorCode: 10, errorMessage: 'You are not playing this game!' };
      }
  
      if (game.status === 'E') {
        return { errorCode: 11, errorMessage: 'Game has already ended!' };
      }
  
      game.status = playerSocketId === game.player1SocketId ? 2 : 1;
      return true;
    };
  
    return {
      initGame,
      playTurn,
      quit,
      gameEnded,
      isGameOver
    };
  };
  