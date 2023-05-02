// Constants to define the size of the game board
const ROWS = 8;
const COLS = 8;
const MINES = 10;

// A 2D array to represent the game board
var board = [];

// An array to keep track of the positions of mines on the board
var mines = [];

// Initialize the board, state, and place mines randomly
for (var row = 0; row < ROWS; row++) {
  board[row] = [];
  for (var col = 0; col < COLS; col++) {
    board[row][col] = 0;
  }
}

for (var i = 0; i < MINES; i++) {
  var row = Math.floor(Math.random() * ROWS);
  var col = Math.floor(Math.random() * COLS);
  if (board[row][col] !== "*") {
    board[row][col] = "*";
    mines.push([row, col]);
  } else {
    i--;
  }
}

// Function to count the number of mines around a cell
function countMines(row, col) {
  var count = 0;
  for (var r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
    for (var c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
      if (board[r][c] === "*") {
        count++;
      }
    }
  }
  return count;
}

// Populate the board with the number of mines around each cell
for (var i = 0; i < mines.length; i++) {
  var row = mines[i][0];
  var col = mines[i][1];
  for (var r = Math.max(0, row - 1); r <= Math.min(row + 1, ROWS - 1); r++) {
    for (var c = Math.max(0, col - 1); c <= Math.min(col + 1, COLS - 1); c++) {
      if (board[r][c] !== "*") {
        board[r][c]++;
      }
    }
  }
}

// Function to display the game board in the console
function displayBoard() {
  console.log("  " + [...Array(COLS).keys()].join(" "));
  for (var row = 0; row < ROWS; row++) {
    console.log(row + " " + board[row].join(" "));
  }
}

// Function to be done
function revealCell(row, col) {}

// Call the displayBoard function to display the initial state of the board
displayBoard();

// Example of the function to be implemented, should return the board updated
revealCell(2, 3);
