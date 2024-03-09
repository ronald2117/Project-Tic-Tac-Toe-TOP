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

  return { getBoard };
}

function Cell() {
  let value = "";

  const getValue = () => value;

  const addSymbol = (playerSymbol) => {
    if (playerSymbol != "") return;
    value = playerSymbol;
  };

  return { getValue, addSymbol };
}

function GameController(p1Name = "Player One", p2Name = "Player Two") {
  const board = Gameboard();
  let winner = null;
  let gameOver = false;
  let currentPlayer = players[0];


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
        return true;
      }
    }
    return null;
  }

  const players = [
    {
      name: p1Name,
      symbol: "X",
    },
    {
      name: p2Name,
      symbol: "O",
    },
  ];


  const switchPlayerTurn = () =>
    (currentPlayer = currentPlayer == players[0] ? players[1] : players[0]);

  const nextRound = () => {
    switchPlayer();
    switchPlayerSymbol();
  };

  const createEmptyBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j];
      }
    }
  };

  const getWinner = () => {
    return winner;
  };

  const setWinner = (playerName) => {
    winner = playerName;
  };

  const initializeGame = () => {
    setBoard(createEmptyBoard());
    setWinner(null);
    setGameOver(false);
  };

  const playRound = (column, row) => {
    board.putSymbol(row, column, currentPlayer.symbol);
  }

  return {
    playRound
  };
}

function HandleDisplay() {
  
}

const game = Gameboard();
