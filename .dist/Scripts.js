const boxes = document.querySelectorAll(".box");
const resetButton = document.querySelector("#reset-button");
const resetScoreButton = document.querySelector("#reset-score-button");
const newGameButton = document.querySelector("#new-button");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const turnIndicator = document.querySelector("#turn-indicator");
const xScoreElement = document.querySelector("#x-score");
const oScoreElement = document.querySelector("#o-score");
const drawScoreElement = document.querySelector("#draw-score");
const gameBoard = document.querySelector(".game");

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const winPatternClasses = winPatterns.map((_, index) => `win-pattern-${index}`);

let board = Array(9).fill("");
let currentPlayer = "X";
let isGameActive = true;
let winningCombo = [];
let scores = {
  X: 0,
  O: 0,
  draws: 0,
};

const updateScoreboard = () => {
  xScoreElement.textContent = scores.X;
  oScoreElement.textContent = scores.O;
  drawScoreElement.textContent = scores.draws;
  [xScoreElement, oScoreElement, drawScoreElement].forEach((score) => {
    score.classList.remove("score-pop");
    void score.offsetWidth;
    score.classList.add("score-pop");
  });
};

const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.textContent = "";
    box.classList.remove("winner", "x-mark", "o-mark");
  });
  gameBoard.classList.remove(...winPatternClasses);
};

const showMessage = (message) => {
  msg.textContent = message;
  msgContainer.classList.remove("hide");
};

const hideMessage = () => {
  msgContainer.classList.add("hide");
};

const highlightWinner = () => {
  winningCombo.forEach((index) => {
    boxes[index].classList.add("winner");
  });
  const patternIndex = winPatterns.findIndex(
    (pattern) => pattern === winningCombo
  );
  gameBoard.classList.add(`win-pattern-${patternIndex}`);
};

const switchTurn = () => {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnIndicator.textContent = `Player ${currentPlayer}`;
};

const resetBoard = () => {
  board = Array(9).fill("");
  currentPlayer = "X";
  isGameActive = true;
  winningCombo = [];
  turnIndicator.textContent = "Player X";
  hideMessage();
  enableBoxes();
};

const resetScores = () => {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  resetBoard();
};

const showWinner = (winner) => {
  scores[winner] += 1;
  updateScoreboard();
  showMessage(`Player ${winner} wins!`);
  highlightWinner();
  disableBoxes();
};

const showDraw = () => {
  scores.draws += 1;
  updateScoreboard();
  showMessage("It's a draw!");
  disableBoxes();
};

const checkWinner = () => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winningCombo = pattern;
      isGameActive = false;
      showWinner(board[a]);
      return;
    }
  }

  if (board.every((cell) => cell !== "")) {
    isGameActive = false;
    showDraw();
  }
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    const boxIndex = Number(box.dataset.index);

    if (!isGameActive || board[boxIndex]) {
      return;
    }

    board[boxIndex] = currentPlayer;
    box.textContent = currentPlayer;
    box.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");
    box.disabled = true;

    checkWinner();

    if (isGameActive) {
      switchTurn();
    }
  });
});

newGameButton.addEventListener("click", resetBoard);
resetButton.addEventListener("click", resetBoard);
resetScoreButton.addEventListener("click", resetScores);

updateScoreboard();
turnIndicator.textContent = "Player X";
