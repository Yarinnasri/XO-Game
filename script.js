const infoDisplay = document.getElementById("info");

let gameActive;
let currentPlayer;
let startingPlayer;
let gameState;
let xTotalWins;
let oTotalWins;
let gameLength;
let roundsPlayed;

const currentPlayerTurnMessage = () =>
  `It's <span class="${currentPlayer}">${currentPlayer}</span>'s turn`;
const winningMessage = () =>
  `Player <span class="${currentPlayer}">${currentPlayer}</span> has won this round!`;
const drawMessage = `Round ended in a draw!`;
const grandWinningMessage = () =>
  xTotalWins == oTotalWins
    ? "The game ended in a draw!"
    : `Player <span class="${currentPlayer}">${currentPlayer}</span> has won the game!!!`;

const winningConditions = [
  [0, 1, 2], //Top Row
  [3, 4, 5], //Middle Row
  [6, 7, 8], //Bottom Row
  [0, 3, 6], //Left Column
  [1, 4, 7], //Middle Column
  [2, 5, 8], //Right Column
  [0, 4, 8], //Top Left To Bottom Right Diagonal
  [2, 4, 6], //Top Right To Bottom Left Diagonal
];

function setGameLength() {
  const totalRounds = document.getElementsByName("rounds");
  for (let i = 0; i < totalRounds.length; i++) {
    if (totalRounds[i].checked) {
      gameLength = totalRounds[i].value;
      break;
    }
  }
}

//Set player to be X or O by his own pick or randomly
function setPlayerTurn() {
  //First turn setting
  if (!startingPlayer && !currentPlayer /* empty-empty */) {
    const shapes = document.getElementsByName("shape");
    if (shapes[1].checked || shapes[2].checked) {
      //Player picked a shape
      if (shapes[1].checked) {
        startingPlayer = "X";
      } else if (shapes[2].checked) {
        startingPlayer = "O";
      }
    } else {
      //Random shape
      const randomNum = Math.round(Math.random());
      startingPlayer = shapes[randomNum + 1].value;
    }
    currentPlayer = startingPlayer;
  }
  //Switch starter player
  else if (!!startingPlayer && !currentPlayer /* value-empty */) {
    if (startingPlayer === "X") {
      startingPlayer = "O";
    } else {
      startingPlayer = "X";
    }
    currentPlayer = startingPlayer;
  }
  //Next turn setting
  else {
    if (currentPlayer === "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }
  }
  infoDisplay.innerHTML = currentPlayerTurnMessage();
}

function startGame() {
  //Creating the board
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "flex";
  let cellsContainer = document.getElementById("cells-container");
  for (let i = 0; i < 9; i++) {
    const newCell = document.createElement("div");
    newCell.setAttribute("data-cell-index", `${i}`);
    newCell.classList.add("cell", "empty-cell");
    newCell.addEventListener("click", cellClick);
    cellsContainer.appendChild(newCell);
  }
  //Setting game's values
  xTotalWins = 0;
  oTotalWins = 0;
  roundsPlayed = 0;
  setGameLength();
  document.getElementById(
    "score-board"
  ).innerHTML = `<p><span class="O">O</span> Score: ${oTotalWins} </p>
  <p><span class="X">X</span> Score: ${xTotalWins}</p>`;
  newRound();
}

function newRound() {
  //Clearing board
  const gridCells = document.querySelectorAll(".cell");
  gridCells.forEach((cell) => {
    cell.classList.remove("X-cell", "O-cell");
  });
  gridCells.forEach((cell) => {
    if (!cell.classList.contains("empty-cell")) {
      cell.classList.add("empty-cell");
    }
  });
  gameState = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  roundsPlayed++;
  document.getElementById("rounds-played").innerHTML = `Round ${roundsPlayed}`;
  document.querySelectorAll(".end-button").forEach((btn) => {
    btn.style.display = "none";
  });
  gameActive = true;
  setPlayerTurn();
}

function switchToMenu() {
  document.getElementById("game").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  document.getElementById("cells-container").innerHTML = "";
}

//Check if there is a valid win/draw
function resultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    const a = gameState[winCondition[0]];
    const b = gameState[winCondition[1]];
    const c = gameState[winCondition[2]];
    if (![a, b, c].includes("")) {
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
  }

  function roundOver() {
    //Game is over
    if (
      roundsPlayed == gameLength ||
      Math.ceil(gameLength / 2) == xTotalWins ||
      Math.ceil(gameLength / 2) == oTotalWins
    ) {
      infoDisplay.innerHTML = grandWinningMessage();
      document.getElementById("new-game-button").style.display = "block";
    } else {
      document.getElementById("next-round-button").style.display = "block";
    }
    gameActive = false;
    currentPlayer = "";
  }

  //Round win
  if (roundWon) {
    infoDisplay.innerHTML = winningMessage();
    if (currentPlayer === "X") {
      xTotalWins++;
    } else {
      oTotalWins++;
    }
    document.getElementById(
      "score-board"
    ).innerHTML = `<p><span class="O">O</span> Score: ${oTotalWins} </p>
    <p><span class="X">X</span> Score: ${xTotalWins}</p>`;
    roundOver();
    return;
  }

  //Round draw
  const roundDraw = !gameState.includes("");
  if (roundDraw) {
    infoDisplay.innerHTML = drawMessage;
    roundOver();
    return;
  }

  //Round continue
  setPlayerTurn();
}

//Click on a cell handling
function setCell(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
  clickedCell.classList.remove("empty-cell");
  clickedCell.classList.add(`${currentPlayer}-cell`);
}

function cellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  setCell(clickedCell, clickedCellIndex);
  resultValidation();
}

//Event Listeners
document.getElementById("play-button").addEventListener("click", startGame);
document
  .getElementById("next-round-button")
  .addEventListener("click", newRound);
document
  .getElementById("new-game-button")
  .addEventListener("click", switchToMenu);
