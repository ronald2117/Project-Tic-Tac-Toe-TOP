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
  const players = [
    {
      name: p1Name,
      symbol: "X",
      score: 0,
    },
    {
      name: p2Name,
      symbol: "O",
      score: 0,
    },
  ];

  let drawScore = 0;
  let draw = false;
  const board = Gameboard();
  let winner = null;
  let gameOver = false;
  let currentPlayer = players[0];
  let firstPlayer = players[0];

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

  const getDrawScore = () => {
    return drawScore;
  };

  const IsGameOver = () => {
    return gameOver;
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

  const nextTurn = () =>
    (currentPlayer = currentPlayer == players[0] ? players[1] : players[0]);

  const nextRound = () => {
    gameOver = false;
    winner = null;
    firstPlayer = firstPlayer == players[0] ? players[1] : players[0];
  };

  const resetGame = () => {
    players[0].score = 0;
    players[1].score = 0;
    drawScore = 0;
    board.clearBoard();
    gameOver = false;
    winner = null;
    currentPlayer = players[0];
    firstPlayer = players[0];
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
        console.log(winner + " won the game!");
        gameOver = true;
        return true;
      }
    }

    // Check if every item in the array is not null
    const allNotNull = oneDimensionalBoard.every(cell => cell.getSymbol() !== null);

    if (allNotNull) {
      draw = true;
      drawScore++;
      gameOver = true;
      return false;
    }
  }

  function putSymbol(row, column, symbol) {
    board.addSymbol(row, column, symbol);
    checkForWinner();
  }

  return {
    getPlayerOneName,
    getPlayerTwoName,
    getP1Score,
    getP2Score,
    getDrawScore,
    IsGameOver,
    getWinner,
    getCurrentPlayer,
    nextTurn,
    nextRound,
    resetGame,
    getBoard: board.getBoard,
    putSymbol,
    checkForWinner,
    isDraw
  };
}

function ScreenController() {
  const cell = document.querySelectorAll(".cell");
  const p1score = document.querySelector(".p1-score");
  const p2Score = document.querySelector(".p2-score");
  const drawScore = document.querySelector(".draw-score");
  const game = GameController();
  const gameBoardDiv = document.querySelector(".game-board");
  const newGameBtn = document.querySelector(".new-game-btn");
  const playerTurnIndicator = document.querySelector(".player-turn-indicator");
  const winIndicator = document.querySelector(".win-indicator");
  const drawIndicator = document.querySelector(".draw-indicator");

  const updateBoard = () => {
    for (let i = 0; i < gameBoardDiv.children.length; i++) {}
  };

  const addSymbolToCell = (row, column, symbol) => {
    if (game.IsGameOver()) { return };

    game.putSymbol(row, column, game.getCurrentPlayer().symbol);

    if (cell[row * 3 + column].textContent == "") {
      cell[row * 3 + column].textContent = symbol;
    } else {
      return; 
    }
    // Change the color of the symbol based on the player
    if (symbol == "X") {
      cell[row * 3 + column].style.color = "#72CFF9";
    } else if (symbol == "O"){
      cell[row * 3 + column].style.color = "#DCBF3F";
    }

    //Change the player turn indicator div depending on who's turn
    if (game.getCurrentPlayer().symbol == "X") {
      playerTurnIndicator.style.background = "#DCBF3F";
    } else if (game.getCurrentPlayer().symbol == "O") {
      playerTurnIndicator.style.background = "#72CFF9";
    }

    if (game.getCurrentPlayer().name == "Player 1") {
      playerTurnIndicator.innerHTML = "Player 2 turn"
    } else if (game.getCurrentPlayer().name == "Player 2") {
      playerTurnIndicator.innerHTML = "Player 1 turn";
    }

    if (game.IsGameOver()) {
      if (!game.isDraw()) {
        winIndicator.style.display = 'flex';
        winIndicator.innerHTML = game.getWinner() + " won"
      } else {
        drawIndicator.style.display = 'flex';
      }

      playerTurnIndicator.style.display = 'none';
      newGameBtn.style.display = 'flex';

      //update scoreboard
      p1score.textContent = game.getP1Score();
      p2Score.textContent = game.getP2Score();
      drawScore.textContent = game.getDrawScore();
    }

    game.nextTurn();
  };

  const newGameBtnClick = () => {
    game.resetGame();

    cell.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        const row = Math.floor(index / 3);
        const column = index % 3;
        addSymbolToCell(row, column, game.getCurrentPlayer().symbol);
      });
    });

    newGameBtn.style.display = 'none';


    playerTurnIndicator.style.display = 'flex';
  }

  const start = () => {
    newGameBtn.addEventListener("click", newGameBtnClick);

    if (game.getCurrentPlayer().symbol == "X") {
      playerTurnIndicator.style.background = "#72CFF9";
    } else if (game.getCurrentPlayer().symbol == "O") {
      playerTurnIndicator.style.background = "#DCBF3F";
    }

    if (game.getCurrentPlayer().name == "Player 1") {
      playerTurnIndicator.innerHTML = "Player 1 turn"
    } else if (game.getCurrentPlayer().name == "Player 2") {
      playerTurnIndicator.innerHTML = "Player 2 turn";
    }
  }

  return { start };
}

const game = ScreenController();
game.start()
