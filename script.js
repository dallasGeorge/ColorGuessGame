const board = document.getElementById('colorBoard');
const showColor = document.getElementById('showColor');
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');
const revealBtn = document.getElementById('revealBtn');

const rows = 15;
const cols = 30;
const maxGuesses = 4;
let guesses = [];
let targetColor = '';
let targetRow = 0;
let targetCol = 0;
let cells = [];
let isColorVisible = false;

function generateColor(row, col) {
  if (row === 0) {
    const lightness = Math.round((col / (cols - 1)) * 100);
    return `hsl(0, 0%, ${lightness}%)`;
  } else {
    const hue = Math.round(col * (360 / cols));
    const lightness = 90 - (row - 1) * 5;
    return `hsl(${hue}, 90%, ${lightness}%)`;
  }
}

function createBoard() {
  board.innerHTML = '';
  cells = [];
  guesses = [];
  message.textContent = '';
  isColorVisible = true; // Make sure color is visible at start
  showColor.style.display = 'block';

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = generateColor(row, col);
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.backgroundColor = color;
      cell.dataset.color = color;
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener('click', () => {
        if (guesses.length >= maxGuesses || guesses.includes(cell)) return;

        cell.classList.add('guess');
        guesses.push(cell);

        if (guesses.length === maxGuesses) evaluateGuesses();
      });

      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

function evaluateGuesses() {
  let found = false;

  guesses.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (
      row >= targetRow - 1 &&
      row <= targetRow + 1 &&
      col >= targetCol - 1 &&
      col <= targetCol + 1
    ) {
      found = true;
    }
  });

  if (found) {
    message.textContent = "✅ Correct! You hit the target zone!";
  } else {
    message.textContent = "❌ No correct guesses in the target area.";
  }

  showColor.style.backgroundColor = targetColor;
  showColor.style.display = 'block';
  isColorVisible = true;

  highlightTargetBox();
}

function highlightTargetBox() {
  for (let row = targetRow - 1; row <= targetRow + 1; row++) {
    for (let col = targetCol - 1; col <= targetCol + 1; col++) {
      if (row < 0 || row > rows || col < 0 || col >= cols) continue;
      const index = row * cols + col;
      cells[index].classList.add('targetBox');
    }
  }
}

const rulesBtn = document.getElementById('rulesBtn');

rulesBtn.onclick = () => {
  alert('Pretty simple... one sees the color and gives 1 or 2 word hints, and the other has 4 tries.');
};

function startGame() {
  createBoard();

  // Hide rules button once game starts
  rulesBtn.style.display = 'none';

  const validStartCells = cells.filter(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    return row > 0 && row < rows && col > 0 && col < cols;
  });

  const randomCell = validStartCells[Math.floor(Math.random() * validStartCells.length)];
  targetColor = randomCell.dataset.color;
  targetRow = parseInt(randomCell.dataset.row);
  targetCol = parseInt(randomCell.dataset.col);
  showColor.style.backgroundColor = targetColor;
  showColor.style.display = 'block';
  isColorVisible = true;

  startBtn.textContent = "Hide and Guess!";
  revealBtn.style.display = 'none';
  message.textContent = '';

  startBtn.onclick = () => {
    showColor.style.display = 'none';
    isColorVisible = false;
    revealBtn.style.display = 'inline-block'; // Show reveal button
    startBtn.textContent = "Restart";
    startBtn.onclick = () => {
      startGame();
      // Show rules button again on restart
      rulesBtn.style.display = 'inline-block';
    };
  };
}



function toggleAnswer() {
  if (isColorVisible) {
    showColor.style.display = 'none';
    revealBtn.textContent = 'Show Answer';
  } else {
    showColor.style.backgroundColor = targetColor;
    showColor.style.display = 'block';
    revealBtn.textContent = 'Hide Answer';
  }
  isColorVisible = !isColorVisible;
}

revealBtn.onclick = toggleAnswer;




//orientation handling

function updateOrientation() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  console.log('Mobile:', isMobile, 'Portrait:', isPortrait);

  if (isMobile && isPortrait) {
    document.body.classList.add('portrait');
  } else {
    document.body.classList.remove('portrait');
  }
}

window.addEventListener('resize', updateOrientation);
window.addEventListener('orientationchange', updateOrientation);


window.onload = () => {
  createBoard();
  startBtn.onclick = startGame;
  rulesBtn.style.display = 'inline-block';
  updateOrientation();
};
