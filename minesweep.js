const readline = require("readline");

// Constants to define the size of the game board
const ROWS = 10;
const COLS = 10;
const MINES = 5;

// Creates an interface to read data from console (user input)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Creates an asynchronous function to read data from the console
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// IMPROVEMENT: Row template to initialize the board with
var rowTemplate = Array(COLS).fill(0);

// IMPROVEMENT: A 2D array to represent the game board
var board = Array.from(Array(ROWS), () => [...rowTemplate]);

// An array to keep track of the positions of mines on the board
var mines = [];

// An array to keep track if the position is visible
var fog = Array.from(Array(ROWS), () => [...rowTemplate]);

// Variable to count number of plays
var playCount = 0;

// Places mines randomly on the board
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

/**
 * Prints out the board
 */
function displayBoard() {
  console.log(`Play count: ${[playCount]}`);
  console.log(" ");

  console.log("  " + [...Array(COLS).keys()].join(" "));
  for (var row = 0; row < ROWS; row++) {
    let output = `${row} `;
    for (var col = 0; col < COLS; col++) {
      if (fog[row][col] === 1) {
        output += board[row][col] + " ";
      } else {
        output += "# ";
      }
    }
    console.log(output);
  }
}

/**
 * Reveals the cell the player played.
 * @param {int} row
 * @param {int} col
 */
function revealCell(row, col) {
  // Keeps track of play count
  playCount++;
  fog[row][col] = 1;

  // If the cell played is a mine, player loses
  if (board[row][col] === "*") {
    displayBoard();
    playerLoses();
  }
  // If the cell played is empty, reveal adjacent cells
  else if (board[row][col] === 0) {
    revealAdjacentCells(row, col);
  }

  displayBoard();

  // Check if player is a winner
  if (isWinner()) {
    playerWins();
  }
}

/**
 * Reveals adjacent cells
 * @param {int} row
 * @param {int} col
 */
function revealAdjacentCells(row, col) {
  for (var i = -1; i <= 1; i++) {
    var rowAdjacent = Math.max(0, Math.min(row + i, ROWS - 1));
    var colAdjacent = Math.max(0, Math.min(col + i, COLS - 1));

    if (fog[rowAdjacent][col] === 0) {
      fog[rowAdjacent][col] = 1;

      if (board[rowAdjacent][col] === 0) {
        revealAdjacentCells(rowAdjacent, col);
      }
    }

    if (fog[row][colAdjacent] === 0) {
      fog[row][colAdjacent] = 1;

      if (board[row][colAdjacent] === 0) {
        revealAdjacentCells(row, colAdjacent);
      }
    }
  }
}

/**
 * Checks if player is a winner.
 * @returns true if player is a winner, false otherwise
 */
function isWinner() {
  var countFog = 0;
  for (var i = 0; i < ROWS; i++) {
    for (var j = 0; j < COLS; j++) {
      if (fog[i][j] === 0) {
        countFog++;
      }
    }
  }

  if (countFog === MINES) {
    return true;
  }

  return false;
}

/**
 * Prints out a losing message and exit program.
 */
function playerLoses() {
  console.log(" ");
  console.log(" ------------------");
  console.log("| SORRY, YOU LOSE! |");
  console.log(" ------------------");
  rl.close();
}

/**
 * Prints out a winning message and exit program.
 */
function playerWins() {
  console.log(" ");
  console.log(" --------------------");
  console.log("| WHOO-HOO, YOU WIN! |");
  console.log(" --------------------");
  rl.close();
}

/**
 * Prompts the user for input to play next round. Input
 * takes two integers, ROW and COL.
 */
async function promptInput() {
  try {
    console.log(" ");
    let positionPrompt = await prompt(
      "What position to play (separated by space): "
    );
    const position = positionPrompt.trim().split(" ");
    console.log(" ");

    if (isNaN(position[0]) || isNaN(position[1])) {
      throw Error("position is not a number.");
    } else if (position[0] >= ROWS || position[1] >= COLS) {
      throw Error("position is not valid.");
    }

    revealCell(parseInt(position[0]), parseInt(position[1]));
    promptInput();
  } catch (e) {
    console.error(e);
    rl.close();
  }
}

// Call the displayBoard function to display the initial state of the board
displayBoard();

// Call for user input to play next round
promptInput();

// When done reading prompt, exit program
rl.on("close", () => process.exit(0));
