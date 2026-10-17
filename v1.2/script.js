// Danh sách lời chúc mừng hài hước khi thắng
const winMessages = [
  "🎉 Ghê đấy! Trí tuệ của bạn vượt tầm vũ trụ rồi!",
  "🏆 Nhà tiên tri đây rồi chứ đâu nữa!",
  "🧠 IQ 300! Máy tính cũng phải ngả nón bái phục!",
  "🎯 Đỉnh của chóp! Quá xuất sắc bạn ơi!",
  "✨ Ăn may hay tài năng thật đây? Bái phục bái phục!"
];

// Danh sách lời chia buồn hài hước khi thua
const loseMessages = [
  "💥 Thua rồi! Lần sau nhớ thắp hương trước khi đoán nhé!",
  "🐔 Gà quá bạn ơi! Máy tính cười khẩy một cái kìa!",
  "🙈 Thôi xong! Số bí mật dễ thế mà cũng đoán trượt!",
  "📉 Hết lượt rồi! Về luyện thêm bí kíp đoán số đi nhé!",
  "⌛ Hết giờ! Não chạy không kịp kim giây rồi!"
];

let secretNumber = 0;
let maxNumber = 100;
let maxAttempts = 7;
let attemptsLeft = 7;
let guessHistory = [];

let timeLimit = 60; // Giây
let timeRemaining = 60;
let timerInterval = null;
let startTime = 0;

// Các phần tử DOM
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const backMenuBtn = document.getElementById('back-menu-btn');
const restartBtn = document.getElementById('restart-btn');

const maxNumberInput = document.getElementById('max-number-input');
const timeLimitSelect = document.getElementById('time-limit-select');
const highScoreDisplay = document.getElementById('high-score-display');

const userGuessInput = document.getElementById('user-guess');
const guessBtn = document.getElementById('guess-btn');
const messageBox = document.getElementById('message');
const attemptsLeftDisplay = document.getElementById('attempts-left');
const historyDisplay = document.getElementById('guess-history');
const timerDisplay = document.getElementById('timer-display');
const gameInstruction = document.getElementById('game-instruction');

// Khởi tạo
loadHighScore();

startBtn.addEventListener('click', startGame);
backMenuBtn.addEventListener('click', backToMenu);
restartBtn.addEventListener('click', startGame);

guessBtn.addEventListener('click', checkGuess);
userGuessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkGuess();
});

function startGame() {
  maxNumber = parseInt(maxNumberInput.value) || 100;
  if (maxNumber < 2) maxNumber = 2;
  if (maxNumber > 10000) maxNumber = 10000;
  maxNumberInput.value = maxNumber;

  timeLimit = parseInt(timeLimitSelect.value);

  // Tự động tính số lượt đoán hợp lý theo thuật toán Binary Search
  maxAttempts = Math.ceil(Math.log2(maxNumber)) + 2;
  attemptsLeft = maxAttempts;
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  guessHistory = [];

  // Reset UI
  gameInstruction.innerHTML = `Máy đã chọn 1 số từ <strong>1 đến ${maxNumber.toLocaleString()}</strong>.`;
  userGuessInput.max = maxNumber;
  userGuessInput.value = "";
  userGuessInput.disabled = false;
  attemptsLeftDisplay.textContent = attemptsLeft;
  historyDisplay.textContent = "Chưa có";
  messageBox.style.color = "#34495e";
  messageBox.textContent = "Hãy thử nhập một số đi nào!";

  guessBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');

  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // Đếm thời gian
  clearInterval(timerInterval);
  startTime = Date.now();

  if (timeLimit > 0) {
    timeRemaining = timeLimit;
    timerDisplay.textContent = `⏳ ${timeRemaining}s`;
    timerInterval = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = `⏳ ${timeRemaining}s`;
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  } else {
    timerDisplay.textContent = `♾️ Không Hạn`;
  }
}

function checkGuess() {
  const userVal = Number(userGuessInput.value);

  if (!userVal || userVal < 1 || userVal > maxNumber) {
    messageBox.style.color = "#c0392b";
    messageBox.textContent = `⚠️ Vui lòng nhập số từ 1 đến ${maxNumber.toLocaleString()}!`;
    return;
  }

  if (guessHistory.includes(userVal)) {
    messageBox.style.color = "#d35400";
    messageBox.textContent = `⚠️ Số ${userVal} bạn đoán rồi! Thử số khác đi.`;
    userGuessInput.value = "";
    return;
  }

  attemptsLeft--;
  guessHistory.push(userVal);
  updateUI();

  if (userVal === secretNumber) {
    clearInterval(timerInterval);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const randomWinMsg = winMessages[Math.floor(Math.random() * winMessages.length)];
    
    messageBox.style.color = "#27ae60";
    messageBox.textContent = `${randomWinMsg} (Số bí mật: ${secretNumber} - Hoàn thành trong ${maxAttempts - attemptsLeft} lượt & ${timeTaken}s)`;
    
    saveHighScore(maxAttempts - attemptsLeft, timeTaken);
    endGame();
  } else if (attemptsLeft === 0) {
    clearInterval(timerInterval);
    const randomLoseMsg = loseMessages[Math.floor(Math.random() * loseMessages.length)];
    messageBox.style.color = "#c0392b";
    messageBox.textContent = `${randomLoseMsg} (Số bí mật chuẩn là: ${secretNumber})`;
    endGame();
  } else if (userVal < secretNumber) {
    messageBox.style.color = "#d35400";
    messageBox.textContent = `📈 Số bí mật LỚN HƠN ${userVal}`;
  } else {
    messageBox.style.color = "#2980b9";
    messageBox.textContent = `📉 Số bí mật NHỎ HƠN ${userVal}`;
  }

  userGuessInput.value = "";
  userGuessInput.focus();
}

function handleTimeout() {
  const randomLoseMsg = loseMessages[Math.floor(Math.random() * loseMessages.length)];
  messageBox.style.color = "#c0392b";
  messageBox.textContent = `⌛ HẾT GIỜ! ${randomLoseMsg} (Số bí mật là: ${secretNumber})`;
  endGame();
}

function updateUI() {
  attemptsLeftDisplay.textContent = attemptsLeft;
  historyDisplay.innerHTML = guessHistory
    .map(num => `<span class="tag">${num}</span>`)
    .join('');
}

function endGame() {
  guessBtn.classList.add('hidden');
  userGuessInput.disabled = true;
  restartBtn.classList.remove('hidden');
}

function backToMenu() {
  clearInterval(timerInterval);
  gameScreen.classList.add('hidden');
  menuScreen.classList.remove('hidden');
  loadHighScore();
}

// Xử lý LocalStorage Kỷ Lục
function saveHighScore(attempts, time) {
  const currentBest = JSON.parse(localStorage.getItem('guessGame_highScore'));
  
  if (!currentBest || attempts < currentBest.attempts || (attempts === currentBest.attempts && time < currentBest.time)) {
    const newRecord = { attempts, time, maxNum: maxNumber };
    localStorage.setItem('guessGame_highScore', JSON.stringify(newRecord));
  }
}

function loadHighScore() {
  const currentBest = JSON.parse(localStorage.getItem('guessGame_highScore'));
  if (currentBest) {
    highScoreDisplay.innerHTML = `🏅 <strong>${currentBest.attempts} lượt</strong> trong <strong>${currentBest.time}s</strong> (Phạm vi 1-${currentBest.maxNum})`;
  } else {
    highScoreDisplay.textContent = "Chưa có kỷ lục nào được ghi nhận!";
  }
}
