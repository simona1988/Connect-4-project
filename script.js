const totalRows = 6, totalColumns = 7;
let currentPlayer = 1, isGameOver = false;
const gameBoard = Array.from({ length: totalRows }, () => Array(totalColumns).fill(null));
const gameBoardElement = document.getElementById('board');
const statusMessageElement = document.getElementById('message');
const resetGameButton = document.getElementById('resetBtn');

function createGameBoard() {
  gameBoardElement.innerHTML = '';
  for (let row = 0; row < totalRows; ++row) {
    for (let col = 0; col < totalColumns; ++col) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.row = row;
      cellElement.dataset.col = col;
      cellElement.addEventListener('click', handlePlayerMove);
      gameBoardElement.appendChild(cellElement);
    }
  }
}

function handlePlayerMove(event) {
  if (isGameOver) {
    return;
  }
  const column = parseInt(event.target.dataset.col, 10);
  const availableRow = findAvailableRowInColumn(column);
  if (availableRow === -1) {
    return; 
  }
  gameBoard[availableRow][column] = currentPlayer;
  updateGameBoardDisplay();
  if (checkForWinner(availableRow, column)) {
    isGameOver = true;
    statusMessageElement.textContent = `Player ${currentPlayer} has won!`;
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  statusMessageElement.textContent = `Player ${currentPlayer}'s turn`;
}

function findAvailableRowInColumn(column) {
  for (let row = totalRows - 1; row >= 0; --row) {
    if (gameBoard[row][column] === null) {
      return row;
    }
  }
  return -1;
}

function updateGameBoardDisplay() {
  const cells = gameBoardElement.querySelectorAll('.cell');
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row, 10);
    const column = parseInt(cell.dataset.col, 10);
    if (gameBoard[row][column] === 1) {
      cell.classList.add('player1');
      cell.classList.remove('player2');
    } else if (gameBoard[row][column] === 2) {
      cell.classList.add('player2');
      cell.classList.remove('player1');
    } else {
      cell.classList.remove('player1', 'player2');
    }
  });
}

function checkForWinner(row, column) {
  return (
    checkDirectionForWin(row, column, 1, 0) || 
    checkDirectionForWin(row, column, 0, 1) || 
    checkDirectionForWin(row, column, 1, 1) || 
    checkDirectionForWin(row, column, 1, -1));
}

function checkDirectionForWin(row, column, rowDirection, columnDirection) {
  let consecutiveCount = 1;
  let nextRow = row + rowDirection;
  let nextColumn = column + columnDirection;
  while (isValidCell(nextRow, nextColumn) && gameBoard[nextRow][nextColumn] === currentPlayer) {
    ++consecutiveCount;
    nextRow += rowDirection;
    nextColumn += columnDirection;
  }
  nextRow = row - rowDirection;
  nextColumn = column - columnDirection;
  while (isValidCell(nextRow, nextColumn) && gameBoard[nextRow][nextColumn] === currentPlayer) {
    ++consecutiveCount;
    nextRow -= rowDirection;
    nextColumn -= columnDirection;
  }
  return consecutiveCount >= 4;
}

function isValidCell(row, column) {
  return row >= 0 && row < totalRows && column >= 0 && column < totalColumns;
}

resetGameButton.addEventListener('click', () => {
  gameBoard.forEach(row => row.fill(null));
  isGameOver = false;
  currentPlayer = 1;
  statusMessageElement.textContent = `Player ${currentPlayer}'s turn`;
  updateGameBoardDisplay();
});

createGameBoard();