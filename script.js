function Gameboard() {
    const board = [];
    

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    return { getBoard };
}

function Cell() {
    const value = '';

    const getValue = () =>  value;

    const addSymbol = (player) => {
        if (value != '') return;
        value = player;
    };

    return { getValue, addSymbol }
}

function GameController(p1Name = 'Player One', p2Name = 'Player Two') {
    const board = Gameboard();

    function checkForWinner(board) {
      // Define the possible winning combinations
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

      // Loop through each possible winning combination
      for (let i = 0; i < winningCombinations.length; i++) {
        const combination = winningCombinations[i];

        // Check if the combination exists in the board
        const [a, b, c] = combination;
        if (board[a] && board[a][b] && board[a][b] === board[c]) {
          return board[a][b];
        }
      }

      // If no winner, return null
      return null;
    }
   
    const players = [
        {
            name: p1Name,
            symbol: 'X'
        },
        {
            name: p2Name,
            symbol: 'Y'
        }

    ]

    const currentPlayer = p1;
    
    const switchPlayerTurn = () => currentPlayer = currentPlayer == players[0] ? players[1]: players[0];

    const nextRound = () => {
        switchPlayer();
        switchPlayerSymbol();
    }

    return {
        nextRound
    }
}

const board = Gameboard();