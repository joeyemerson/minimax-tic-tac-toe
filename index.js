// DOM ELEMENTS
const domBoard = [...document.getElementsByClassName('cell')];
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const ticker = document.getElementById('ticker');
const gameBoard = document.getElementById('board');
const playBtn = document.getElementById('play-button');
const playAgainContainer = document.getElementById('play-again-container');
const playAgainYesBtn = document.getElementById('play-again-yes');
const playAgainNoBtn = document.getElementById('play-again-no');

let menuIsVisible = true;

// EVENT LISTENERS
playBtn.addEventListener('click', e => {
  resetGame();
  toggleMenu();
  aiRandomMove();
  e.preventDefault();
});

playAgainYesBtn.addEventListener('click', e => {
  resetGame();
  aiRandomMove();
  e.preventDefault();
});

playAgainNoBtn.addEventListener('click', e => {
  toggleMenu();
  e.preventDefault();
});

domBoard.forEach((cell, idx) => {
  cell.addEventListener('click', () => {
    const i = Math.floor(idx / BOARD_SIZE);
    const j = idx % BOARD_SIZE;

    if (board[i][j] === '') {
      ++curTurn;
      board[i][j] = HUMAN;
      renderGameBoard();

      const winner = checkWinner();

      if (winner) {
        endGame(winner);
        return;
      }

      const nextMove = bestMove();
      if (nextMove) aiMove(...nextMove);
    }
  });
});

// GAME CONSTANTS
const BOARD_SIZE = 3;
const TURN_LIMIT = BOARD_SIZE * BOARD_SIZE;
const HUMAN = 'O';
const AI = 'X';
const EMPTY = '';
const DEFAULT_FIRST_PLAYER = AI;

const SCORES = { [AI]: 1, [HUMAN]: -1, tie: 0 };

const board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(EMPTY));

// TURN-SPECIFIC VARIABLES
let curPlayer = DEFAULT_FIRST_PLAYER; // not using right now
let humanMoves = 0;

function aiMove(i, j) {
  board[i][j] = AI;

  setTimeout(() => {
    renderGameBoard();
    const winner = checkWinner();
    if (winner) endGame(winner);
  }, 300);
}

function aiRandomMove() {
  const randomI = Math.floor(Math.random() * BOARD_SIZE);
  const randomJ = Math.floor(Math.random() * BOARD_SIZE);

  if (board[randomI][randomJ] === EMPTY) {
    board[randomI][randomJ] = AI;

    setTimeout(() => {
      renderGameBoard();
      const winner = checkWinner();
      if (winner) endGame(winner);
    }, 300);
  } else {
    aiRandomMove();
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      if (board[i][j] === EMPTY) {
        board[i][j] = AI;
        const score = minimax(false, 1);
        board[i][j] = EMPTY;
        if (score > bestScore) {
          bestScore = score;
          bestMove = [i, j];
        }
      }
    }
  }

  return bestMove;
}

function minimax(isMax, depth) {
  const result = checkWinner();
  if (result) return SCORES[result] / depth;

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < BOARD_SIZE; ++i) {
      for (let j = 0; j < BOARD_SIZE; ++j) {
        if (board[i][j] === EMPTY) {
          board[i][j] = AI;
          let curScore = minimax(false, depth + 1);
          board[i][j] = EMPTY;
          bestScore = Math.max(bestScore, curScore);
        }
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < BOARD_SIZE; ++i) {
      for (let j = 0; j < BOARD_SIZE; ++j) {
        if (board[i][j] === EMPTY) {
          board[i][j] = HUMAN;
          let curScore = minimax(true, depth + 1);
          board[i][j] = EMPTY;
          bestScore = Math.min(bestScore, curScore);
        }
      }
    }

    return bestScore;
  }
}

function checkWinner() {
  let filledCells = 0;
  let diagA = '';
  let diagB = '';

  for (let i = 0; i < BOARD_SIZE; ++i) {
    diagA += board[i][i];
    diagB += board[i][2 - i];
    let curRow = '';
    let curCol = '';

    for (let j = 0; j < BOARD_SIZE; ++j) {
      curRow += board[i][j];
      curCol += board[j][i];
      if (board[i][j] !== EMPTY) ++filledCells;
    }

    if (curRow === 'XXX' || curCol === 'XXX') return 'X';
    if (curRow === 'OOO' || curCol === 'OOO') return 'O';
  }

  if (diagA === 'XXX' || diagB === 'XXX') return 'X';
  if (diagA === 'OOO' || diagB === 'OOO') return 'O';

  return filledCells === TURN_LIMIT ? 'tie' : '';
}

function resetGame() {
  curPlayer = DEFAULT_FIRST_PLAYER;
  curTurn = 0;
  humanMoves = 0;
  clearGameBoard();
  renderGameBoard();
  ticker.innerText = 'Good Luck!';
  playAgainContainer.style.display = 'none';
  gameBoard.style.display = 'block';
}

function clearGameBoard() {
  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      board[i][j] = EMPTY;
    }
  }
}

function endGame(winner) {
  setTimeout(() => {
    gameBoard.style.display = 'none';
    ticker.innerText = winner === HUMAN ? 'You Win! 😊' : winner === AI ? 'You Lose... 😭' : 'Tie! 😐';
    playAgainContainer.style.display = 'block';
  }, 300);
}

function toggleMenu() {
  if (menuIsVisible) {
    menu.style.transform = 'translate(-50%, -500%)';
    game.style.transform = 'translate(-50%, -50%)';
  } else {
    game.style.transform = 'translate(-50%, -500%)';
    menu.style.transform = 'translate(-50%, -50%)';
  }
  menuIsVisible = !menuIsVisible;
}

function renderGameBoard() {
  for (let i = 0; i < BOARD_SIZE; ++i) {
    for (let j = 0; j < BOARD_SIZE; ++j) {
      domBoard[i * BOARD_SIZE + j].innerText = board[i][j];
    }
  }
}
