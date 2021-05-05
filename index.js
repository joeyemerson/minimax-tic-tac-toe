const domBoard = [];

for (let i = 0; i < 9; ++i) {
  domBoard.push(document.getElementById(i.toString()));
}

const board = [
  ['X', '', ''],
  ['X', 'O', 'O'],
  ['X', '', ''],
];

function checkWinner() {
  let diagA = '';
  let diagB = '';

  for (let i = 0; i < 3; ++i) {
    diagA += board[i][i];
    diagB += board[i][2 - i];
    let curRow = '';
    let curCol = '';

    for (let j = 0; j < 3; ++j) {
      curRow += board[i][j];
      curCol += board[j][i];
    }

    if (curRow === 'XXX' || curCol === 'XXX') return 'X';
    if (curRow === 'OOO' || curCol === 'OOO') return 'O';
  }

  if (diagA === 'XXX' || diagB === 'XXX') return 'X';
  if (diagA === 'OOO' || diagB === 'OOO') return 'O';

  return '';
}

function render() {
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      domBoard[i * 3 + j].innerText = board[i][j];
    }
  }
}
