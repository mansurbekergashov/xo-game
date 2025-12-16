// PAGE CHECK
const isHomePage = document.getElementById("form");
const isGamePage = document.getElementById("board");
const elModal = document.getElementById("modal");
const elQuit = document.getElementById("quit");
const elPlayAgainBtn = document.getElementById("playAgainBtn");
const elWinnerText = document.getElementById("winnerText");
const elWhoWon = document.getElementById("whoWon");

// HOME PAGE LOGIC
if (isHomePage) {
  const elStartCPU = document.getElementById("startCPU");
  const elStartPlayer = document.getElementById("startPlayer");

  function getSelectedSymbol() {
    return document.querySelector('input[name="symbol"]:checked').value;
  }

  elStartCPU.addEventListener("click", () => {
    localStorage.setItem("symbol", getSelectedSymbol());
    localStorage.setItem("mode", "cpu");
    location.href = "/pages/mainGame.html";
  });

  elStartPlayer.addEventListener("click", () => {
    localStorage.setItem("symbol", getSelectedSymbol());
    localStorage.setItem("mode", "player");
    location.href = "/pages/mainGame.html";
  });
}

// GAME PAGE LOGIC
if (isGamePage) {
  const cells = document.querySelectorAll(".cell");
  const elTurn = document.getElementById("turn");
  const elRestartBtn = document.getElementById("restartBtn");

  const elScoreX = document.getElementById("scoreX");
  const elScoreO = document.getElementById("scoreO");
  const elScoreTies = document.getElementById("scoreTies");

  let board = Array(9).fill(null);
  let gameOver = false;

  let scoreX = 0;
  let scoreO = 0;
  let scoreTies = 0;

  const gameMode = localStorage.getItem("mode");
  const playerSymbol = localStorage.getItem("symbol") || "X";
  const cpuSymbol = playerSymbol === "X" ? "O" : "X";

  let currentTurn = "X";

  updateTurn();

  if (gameMode === "cpu" && playerSymbol === "O") {
    setTimeout(cpuMove, 600);
  }

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const index = cell.dataset.index;

      if (gameOver || board[index]) return;
      if (gameMode === "cpu" && currentTurn !== playerSymbol) return;

      makeMove(index, currentTurn);

      if (checkGameEnd()) return;

      switchTurn();

      if (gameMode === "cpu" && currentTurn === cpuSymbol) {
        setTimeout(cpuMove, 600);
      }
    });
  });

  function makeMove(index, symbol) {
    board[index] = symbol;
    cells[index].innerHTML = `<img src="/images/${symbol === 'X' ? 'X-main' : 'O-main'}.svg" alt="${symbol}">`;
    cells[index].classList.add('disabled');
  }

  function cpuMove() {
    if (gameOver) return;

    const emptyCells = board
      .map((cell, i) => (cell === null ? i : null))
      .filter(i => i !== null);

    const randomIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomIndex, cpuSymbol);

    if (checkGameEnd()) return;

    switchTurn();
  }

  function switchTurn() {
    currentTurn = currentTurn === "X" ? "O" : "X";
    updateTurn();
  }

  function updateTurn() {
    elTurn.textContent = `${currentTurn} TURN`;
  }

  function checkGameEnd() {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const [a,b,c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        gameOver = true;
        handleWin(board[a]);
        return true;
      }
    }

    if (board.every(cell => cell !== null)) {
      gameOver = true;
      handleDraw();
      return true;
    }

    return false;
  }

  function handleWin(winner) {
	elModal.classList.remove("hidden");
	if (winner === "X"){
		scoreX++
		elWinnerText.textContent = `X TAKES THE ROUND`;
		elTurn.textContent = "X won";
		elWhoWon.textContent = "YOU WON!"
		elWinnerText.style.cssText = `
			color: #31C3BD;
	    `
	}
	else if (winner === "O") {
		scoreO++
		elWinnerText.textContent = `O TAKES THE ROUND`;
		elTurn.textContent = "O won";
		elWhoWon.textContent = "OH NO, YOU LOST…"
		elWinnerText.style.cssText = `
			color: #F2B137;
	    `
	}
    elScoreX.textContent = scoreX;
    elScoreO.textContent = scoreO;
  }

  elQuit.addEventListener("click", () => {
		location.href = "/index.html"
	})
	elPlayAgainBtn.addEventListener("click", () => {
	  elModal.classList.add("hidden");
	  elRestartBtn.click();
	})

  function handleDraw() {
	elModal.classList.remove("hidden");
	elWinnerText.textContent = "DRAW";
    scoreTies++;
    elScoreTies.textContent = scoreTies;
	elTurn.textContent = "DRAW";
	elWhoWon.textContent = ""
	elWinnerText.style.cssText = `
		color: #A8BFC9;
	`
  }

  elRestartBtn.addEventListener("click", () => {
    board.fill(null);
    cells.forEach(cell => {
      cell.innerHTML = "";
      cell.classList.remove("disabled", "win");
    });
    gameOver = false;
    currentTurn = "X";
    updateTurn();

    if (gameMode === "cpu" && playerSymbol === "O") {
      setTimeout(cpuMove, 600);
    }

	
	
  });
}

