exports.createLobby = () => {
  const games = new Map();
  let id = 1;

  const addGame = (user, socketId, gridSize) => {
    id++;
    const grid = getBoardIdFromGridSize(gridSize);

    const game = {
      id: id,
      created_at: Date.now(),
      board_id: grid,
      player1: user,
      player1SocketId: socketId,
    };
    games.set(id, game);
    return game;
  };

  const getBoardIdFromGridSize = (gridSize) => {
    switch (gridSize) {
      case '4x4':
        return 2;
      case '6x6':
        return 3;
      default:
        throw new Error(`Tamanho de grid não suportado: ${gridSize}`);
    }
  };

  const removeGame = (id) => {
    games.delete(id);
    return games;
  };

  const existsGame = (id) => {
    return games.has(id);
  };

  const getGame = (id) => {
    return games.get(id);
  };

  const getGames = () => {
    return [...games.values()];
  };

  const leaveLobby = (socketId) => {
    const gamesToDelete = [...games.values()].filter(
      (game) => game.player1SocketId == socketId
    );
    gamesToDelete.forEach((game) => {
      games.delete(game.id);
    });
    return getGames();
  };

  
  return {
    getGames,
    getGame,
    addGame,
    removeGame,
    existsGame,
    leaveLobby,
  };
};
