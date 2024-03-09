const prompt = require("prompt-sync")();

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
    board[row][column].addSymbol(playerSymbol);
  };

  const printBoard = () => {
    for (let i = 0; i < board.length; i++) {
      let row = "";
      for (let j = 0; j < board[i].length; j++) {
        row += board[i][j].getValue() + " ";
      }
      console.log(row);
    }
  };

  return { getBoard, putSymbol, printBoard };
}

function Cell() {
  let value = "";

  const getValue = () => value;

  const setValue = (newValue) => {
    value = newValue;
  }

  const addSymbol = (playerSymbol) => {
    if (playerSymbol != "") return;
    value = playerSymbol;
  };

  return { getValue, addSymbol };
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
  let numberOfRounds = 0;

  const getWinner = () => {
    return winner;
  };

  const setWinner = (playerName) => {
    winner = playerName;
  };

  const getNumberOfRounds = () => {
    return numberOfRounds;
  }

  function checkForWinner(board) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const combination = winningCombinations[i];

      const [a, b, c] = combination;
      if (board[a] == board[c] && board[a] == board[b]) {
        setWinner(currentPlayer.name);
        currentPlayer.score++;
        return true;
      }
    }
    return null;
  }

  const switchPlayerTurn = () =>
    (currentPlayer = currentPlayer == players[0] ? players[1] : players[0]);

  const nextRound = () => {
    switchPlayer();
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

  const playRound = (column, row) => {
    board.putSymbol(row, column, currentPlayer.symbol);
  };

  const playOnTheConsole = () => {
    while (!gameOver) {
      console.log(`It's ${currentPlayer.name}'s turn`);
      let row = prompt("Enter row: ");
      let column = prompt("Enter column: ");
      playRound(row, column);
      board.printBoard();
      checkForWinner(board.getBoard());
      switchPlayerTurn();
      numberOfRounds++;
    }
  };

  return {
    getWinner,
    setWinner,
    checkForWinner,
    playRound,
    switchPlayerTurn,
    nextRound,
    createEmptyBoard,
    initializeGame,
    playOnTheConsole,
  };
}

const game = GameController();
game.playOnTheConsole();
