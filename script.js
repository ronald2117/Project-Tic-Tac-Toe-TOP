function Cell() {
  let symbol = null;

  const getSymbol = () => symbol;

  const setSymbol = (newSymbol) => {
    symbol = newValue;
  };

  const addSymbol = (newSymbol) => {
    if (symbol === null) {
      symbol = newSymbol;
      return true;
    } else {
      return false;
    }
  };

  return { getSymbol, addSymbol };
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

  const putSymbol = (row, column, playerSymbol) => {
    if (row >= 0 && row < 3 && column >= 0 && column < 3) {
      board[row][column].addSymbol(playerSymbol);
    } else {
      throw new Error("Invalid row or column");
    }
  };

  return { getBoard, putSymbol };
}

function GameController(p1Name = "Player One", p2Name = "Player Two") {
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

  const board = Gameboard();
  let winner = null;
  let gameOver = false;
  let currentPlayer = players[0];
  let numberOfRounds = 1;

  const getWinner = () => {
    return winner;
  };

  const setWinner = (playerName) => {
    winner = playerName;
  };

  const getNumberOfRounds = () => {
    return numberOfRounds;
  };

  function checkForWinner(board) {
    const oneDimensionalBoard = board.flat();
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
      if (
        oneDimensionalBoard[a].getSymbol() &&
        oneDimensionalBoard[a].getSymbol() ===
          oneDimensionalBoard[b].getSymbol() &&
        oneDimensionalBoard[a].getSymbol() ===
          oneDimensionalBoard[c].getSymbol()
      ) {
        setWinner(currentPlayer.name);
        gameOver = true;
      }
    }
  }

  const switchPlayerSymbol = () => {
    players[0].symbol = players[0].symbol == "X" ? "O" : "X";
    players[1].symbol = players[1].symbol == "O" ? "X" : "O";
  };

  const switchPlayerTurn = () =>
    (currentPlayer = currentPlayer == players[0] ? players[1] : players[0]);

  const nextRound = () => {
    switchPlayerTurn();
    switchPlayerSymbol();
  };

  const createEmptyBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].setValue("");
      }
    }
  };

  const initializeGame = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    gameOver = false;
  };

  const putSymbol = (row, column, symbol) => {
    if (gameOver) {
      return;
    }
    board.putSymbol(row, column, symbol);
  };

  return {
    getWinner,
    setWinner,
    checkForWinner,
    switchPlayerTurn,
    nextRound,
    createEmptyBoard,
    initializeGame,
    getBoard: board.getBoard,
    currentPlayer,
    putSymbol,
  };
}

function ScreenController() {
  const cell = document.querySelectorAll(".cell");
  const p1score = docment.querySelector(".p1-score");
  const p2Score = document.querySelector(".p2-score");
  const game = GameController();
  const p1Name = document.querySelector(".player1");
  const p2Name = document.querySelector(".player2");
  const gameBoardDiv = document.querySelector(".game-board-div");

  const clearScreen = () => {
    cell.forEach((cell) => (cell.textContent = ""));
    
  };

  const addSymbolToCell = (row, column, symbol) => {
    cell[row * 3 + column].textContent = symbol;
  };

  cell.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      const row = Math.floor(index / 3);
      const column = index % 3;
      game.putSymbol(row, column, game.currentPlayer.symbol);
      addSymbolToCell(row, column, game.currentPlayer.symbol);
      game.checkForWinner(game.getBoard());
      if (game.getWinner()) {
        alert(`${game.getWinner()} won the game!`);
        game.initializeGame();
        clearScreen();
      } else {
        game.nextRound();
      }
    });
  });
}

const game = GameController();
ScreenController();
