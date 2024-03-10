const prompt = require("prompt-sync")();

function Cell() {
  let symbol = null;

  const getSymbol = () => symbol;

  const setSymbol = (newSymbol) => {
    symbol = newValue;
  }

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

  const printBoard = () => {
    for (let i = 0; i < board.length; i++) {
      let row = [];
      for (let j = 0; j < board[i].length; j++) {
        row.push(board[i][j].getSymbol());
      }
      console.log(row);
    }
  };

  return { getBoard, putSymbol, printBoard };
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
  }

  function checkForWinner(board) {
    const oneDimensionalBoard = board.flat();
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        oneDimensionalBoard[a].getSymbol() &&
        oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[b].getSymbol() &&
        oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[c].getSymbol()
      ) {
        setWinner(currentPlayer.name);
        gameOver = true;
      }
    }
  }

  const switchPlayerSymbol = () => {
    players[0].symbol = players[0].symbol == "X" ? "O" : "X";
    players[1].symbol = players[1].symbol == "O" ? "X" : "O";
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

  const playOnTheConsole = () => {
    while (!gameOver) {
      console.log(`It's ${currentPlayer.name}'s turn`);
      console.log('His/her symbol is: ', currentPlayer.symbol);
      let row = prompt("Enter row: ");
      let column = prompt("Enter column: ");
      board.putSymbol(row, column, currentPlayer.symbol)
      board.printBoard();
      switchPlayerTurn();
      checkForWinner(board.getBoard());
      numberOfRounds++;
    }
  };

  return {
    getWinner,
    setWinner,
    checkForWinner,
    switchPlayerTurn,
    nextRound,
    createEmptyBoard,
    initializeGame,
    playOnTheConsole,
  };
}

const game = GameController();
game.playOnTheConsole();
