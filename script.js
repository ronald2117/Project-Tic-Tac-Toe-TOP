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

  return { getSymbol, putSymbol };
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
      board[row][column].putSymbol(playerSymbol);
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

  let drawScore = 0;
  const board = Gameboard();
  let winner = null;
  let gameOver = false;
  let currentPlayer = players[0];
  let firstPlayer = players[0];

  const getPlayerOneName = () => {
    return players[0].name;
  }

  const getPlayerTwoName = () => {
    return players[1].name;
  }

  const getP1Score = () => {
    return players[0].score;
  }

  const getP2Score = () => {
    return players[1].score;
  }

  const getDrawScore = () => {
    return drawScore;
  }

  const IsGameOver = () => {
    return gameOver;
  }

  const getWinner = () => {
    return winner;
  }

  const getCurrentPlayer = () => {
    return currentPlayer;
  }

  const nextTurn = () =>
    (currentPlayer = currentPlayer == players[0] ? players[1] : players[0]);

  const nextRound = () => {
    gameOver = false;
    winner = null;
    firstPlayer = firstPlayer == players[0] ? players[1] : players[0];
  }

  const resetGame = () => {
    players[0].score = 0;
    players[1].score = 0;
    drawScore = 0;
    board.clearBoard();
    gameOver = false;
    winner = null;
    currentPlayer = players[0];
    firstPlayer = players[0];
  }

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
        oneDimensionalBoard[a].getSymbol() && // Check if the symbol at index 'a' is not empty
        oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[b].getSymbol() && // Check if symbols at 'a' and 'b' are equal
        oneDimensionalBoard[a].getSymbol() === oneDimensionalBoard[c].getSymbol() // Check if symbols at 'a' and 'c' are equal
      ) {
        currentPlayer.score++;
        winner = currentPlayer.name;
        gameOver = true;
        return true;
      } else {
        return false;
      }
    }
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
    putSymbol: board.addSymbol,
    checkForWinner
  };
}

function ConsoleController() {
  const prompt = require('prompt');
  
  
  game = GameController();
  
  const printBoard = () => {
    const board = game.getBoard();
    for (let i = 0; i < board.length; i++) {
      let boardRow = "";
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].getSymbol() === null) {
          boardRow += "   ";
        } else {
          boardRow += (" " + board[i][j].getSymbol() + " ");
        }

        if (j < board[i].length - 1) {
          boardRow += "|";
        }
      }
      console.log(boardRow);
      if (i < board.length - 1) {
        console.log("---+---+---");
      }
    }
  };

  const displayMainMenu = () => {
    prompt.start();
    console.log("Welcome to Tic Tac Toe!");
    console.log("1. Start Game");
    console.log("2. Exit");

    prompt.get(["choice"], (err, result) => {
      if (result.choice === "1") {
        displayGame();
      } else if (result.choice === "2") {
        return;
      } else {
        console.log("Invalid choice. Please try again.");
        displayMainMenu();
      }
    });
  }

  const displayGame = () => {
    console.clear();
    
    //print each player score and the draw score
    console.log(game.getPlayerOneName() + " Score: " + game.getP1Score());
    console.log(game.getPlayerTwoName() + " Score: " + game.getP2Score());
    console.log("Draw: " + game.getDrawScore());
    printBoard();

    //display current player's turn
    console.log("\n" +game.getCurrentPlayer().name+ "'s turn " + "(" + game.getCurrentPlayer().symbol + ")");

    //prompt user to enter row and column
    prompt.get(["row", "column"], (err, result) => {
      game.putSymbol(result.row, result.column, game.getCurrentPlayer().symbol);
      game.checkForWinner(game.getBoard());
      if (game.getWinner()) {
        console.log(game.getWinner() + " won the game!");
        game.nextRound();
        game.clearBoard();
        displayGame();
      } else {
        game.nextTurn();
        displayGame();
      }
    });
    
  }

  displayMainMenu();
}

function ScreenController() {
  const cell = document.querySelectorAll(".cell");
  const p1score = document.querySelector(".p1-score");
  const p2Score = document.querySelector(".p2-score");
  const drawScore = document.querySelector(".draw-score");
  const game = GameController();
  const gameBoardDiv = document.querySelector(".game-board");

  const updateBoard = () => {
    for(let i = 0; i < gameBoardDiv.children.length; i++) {
      
  }
  
  const addSymbolToCell = (row, column, symbol) => {
    if (symbol == "X") {
      cell[row * 3 + column].style.color = "#72CFF9";
    } else if (symbol == "O"){
      cell[row * 3 + column].style.color = "#DCBF3F";
    }
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
}

ConsoleController();