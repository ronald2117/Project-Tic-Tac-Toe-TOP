function Cell() {
  let symbol = null;

  const getSymbol = () => symbol;

  const putSymbol = (newSymbol) => {
    if (symbol === null) {
      symbol = newSymbol;
      return true;
    } else {
      return false;
    }
  };

  const removeSymbol = () => {
    symbol = null;
  };

  return { getSymbol, putSymbol, removeSymbol };
}

function Gameboard() {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const addSymbol = (row, column, playerSymbol) => {
    if (row >= 0 && row < 3 && column >= 0 && column < 3) {
      return board[row][column].putSymbol(playerSymbol);
    } else {
      throw new Error("Invalid row or column");
    }
  };

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].removeSymbol();
      }
    }
  };

  return { getBoard, addSymbol, clearBoard };
}

function GameController(p1Name = "Player 1", p2Name = "Player 2") {
  const blue = "#72CFF9";
  const yellow = "#DCBF3F";

  const players = [
    {
      name: p1Name,
      symbol: "X",
      score: 0,
      color: blue
    },
    {
      name: p2Name,
      symbol: "O",
      score: 0,
      color: yellow
    },
  ];

  let round = 1;
  let drawScore = 0;
  let draw = false;
  const board = Gameboard();
  let winner = null;
  let gameOver = true;
  let currentPlayer = players[0];
  let nextPlayer = players[1];
  let firstPlayer = players[0];

  const getRound = () => {
    return round;
  }
  const getPlayerOneName = () => {
    return players[0].name;
  };

  const getPlayerTwoName = () => {
    return players[1].name;
  };

  const getP1Score = () => {
    return players[0].score;
  };

  const getP2Score = () => {
    return players[1].score;
  };

  const getP1Color = () => {
    return players[0].color;
  }

  const getP2Color = () => {
    return players[1].color;
  }

  const getFirstPlayer = () => {
    return firstPlayer;
  }

  const setFirstPlayer = (player) => {
    firstPlayer = player;
  }

  const getDrawScore = () => {
    return drawScore;
  };

  const IsGameOver = () => {
    return gameOver;
  };

  const setGameOver = (status) => {
    gameOver = status;
  };

  const isDraw = () => {
    return draw;
  }

  const getWinner = () => {
    return winner;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const getNextPlayer = () => {
    return nextPlayer;
  }

  const nextTurn = () => {
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
    nextPlayer = nextPlayer == players[0] ? players[1] : players[0];
  }

  const nextRound = () => {
    draw = false;
    board.clearBoard();
    gameOver = false;
    winner = null;
    firstPlayer = firstPlayer == players[0] ? players[1] : players[0];
    currentPlayer = firstPlayer == players[0] ? players[1] : players[0];
    nextPlayer = firstPlayer == players[0] ? players[0] : players[1];
  };

  const resetGame = () => {
    players[0].score = 0;
    players[1].score = 0;
    drawScore = 0;
    round = 1;
    board.clearBoard();
    gameOver = true;
    winner = null;
    firstPlayer = players[0];
    currentPlayer = players[0];
  };

  function checkForWinner() {
    const oneDimensionalBoard = board.getBoard().flat();
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < winningCombinations.length; i++) { 
      const [a, b, c] = winningCombinations[i];
      const hasWinner = oneDimensionalBoard[a].getSymbol() && oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[b].getSymbol() && oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[c].getSymbol();

      if (hasWinner) {
        currentPlayer.score++;
        winner = currentPlayer.name;
        gameOver = true;
        round++;
        return true;
      }
    }

    // Check if every item in the array is not null else, draw
    const allNotNull = oneDimensionalBoard.every(cell => cell.getSymbol() !== null);

    if (allNotNull) {
      draw = true;
      drawScore++;
      round++;
      gameOver = true;
      return false;
    }
  }

  function putSymbol(row, column, symbol) {
    board.addSymbol(row, column, symbol);
    checkForWinner();
  }

  return {
    getRound,
    getPlayerOneName,
    getPlayerTwoName,
    getP1Score,
    getP2Score,
    getP1Color,
    getP2Color,
    getDrawScore,
    getFirstPlayer,
    setFirstPlayer,
    IsGameOver,
    setGameOver,
    getWinner,
    getCurrentPlayer,
    getNextPlayer,
    nextTurn,
    nextRound,
    resetGame,
    getBoard: board.getBoard,
    putSymbol,
    checkForWinner,
    isDraw,
    blue,
    yellow
  };
}

function ScreenController() {
  const cell = document.querySelectorAll(".cell");
  const p1score = document.querySelector(".p1-score");
  const p2Score = document.querySelector(".p2-score");
  const drawScore = document.querySelector(".draw-score");
  const game = GameController();
  const newGameBtn = document.querySelector(".new-game-btn");
  const restartBtn = document.querySelector(".restart-btn")
  const playerTurnIndicator = document.querySelector(".turn-indicator");
  const winIndicator = document.querySelector(".win-indicator");
  const drawIndicator = document.querySelector(".draw-indicator");

  const addSymbolToCell = (row, column, symbol) => {
    if (game.IsGameOver() || game.getBoard()[row][column].getSymbol() != null) { return }; 
    
    game.putSymbol(row, column, symbol);
    updateBoardDisplay();

    // if (game.getCurrentPlayer().name == "Player 1") {
      playerTurnIndicator.innerHTML = game.getNextPlayer().name + " Turn"
      console.log(game.getCurrentPlayer().name + ", " + game.getNextPlayer().name);
      playerTurnIndicator.style.background = game.getNextPlayer().color;
    // } else if (game.getCurrentPlayer().name == "Player 2") {
    //   playerTurnIndicator.innerHTML = "Player 1 turn";
    //   playerTurnIndicator.style.background = game.getP1Color();
    // }



    if (game.IsGameOver()) {
      if (!game.isDraw()) {
        winIndicator.style.display = 'flex';
        winIndicator.innerHTML = game.getWinner() + " Won"
      } else {
        drawIndicator.style.display = 'flex';
      }

      playerTurnIndicator.style.display = 'none';
      newGameBtn.style.display = 'flex';
      
      updateScoreBoardDisplay();
    }

    game.nextTurn();
  };

  const updateScoreBoardDisplay = () => {
    p1score.textContent = game.getP1Score();
    p2Score.textContent = game.getP2Score();
    drawScore.textContent = game.getDrawScore();
  }

  const updateBoardDisplay = () => {
    oneDimensionalBoard = game.getBoard().flat();

    for (let i = 0; i < oneDimensionalBoard.length; i++) {
      const cellSymbol = oneDimensionalBoard[i].getSymbol()
      cell[i].textContent = cellSymbol;

      //Change color of X and O
      if(cellSymbol == "X") {
        cell[i].style.color = game.blue;
      } else {
        cell[i].style.color = game.yellow;
      }
    }
  }

  const handleCellClick = (index) => {
    return () => {
      const row = Math.floor(index / 3);
      const column = index % 3;
      addSymbolToCell(row, column, game.getCurrentPlayer().symbol);
    }
  }

  const enableCellClick = () => {
    cell.forEach((cell, index) => {
      const handler = handleCellClick(index);
      cell.addEventListener("click", handler, { once: true });
      });
  }

  const newGameBtnClick = () => {
    enableCellClick();
    game.setGameOver(false);

    newGameBtn.style.display = 'none';
    playerTurnIndicator.style.display = 'flex';
    playerTurnIndicator.style.background = game.getFirstPlayer().color;
    playerTurnIndicator.textContent = game.getFirstPlayer().name + " turn";
    winIndicator.style.display = 'none';
    drawIndicator.style.display = 'none';
    game.nextRound();

    updateBoardDisplay();
  }

  const restartBtnClick = () => {
    game.resetGame();
    game.setGameOver(true);
    
    winIndicator.style.display = 'none';
    drawIndicator.style.display = 'none';
    playerTurnIndicator.style.display = 'none';
    newGameBtn.style.display = 'flex';
    
    updateBoardDisplay();
    updateScoreBoardDisplay();
  }

  const start = () => {
    newGameBtn.addEventListener("click", newGameBtnClick);
    restartBtn.addEventListener("click", restartBtnClick);

    //Change initial backround color and text of player indicator depending on the first player
    // playerTurnIndicator.style.background = game.getFirstPlayer().color;
    // playerTurnIndicator.textContent = game.getFirstPlayer().name + " turn";
  }

  return { start };
}

const game = ScreenController();
game.start()
