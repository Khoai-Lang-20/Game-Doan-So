let secretNumber = Math.floor(Math.random() * 100) + 1;
const maxAttempts = 7;
let attemptsLeft = maxAttempts;
let guessHistory = [];

const userGuessInput = document.getElementById('user-guess');
const guessBtn = document.getElementById('guess-btn');
const messageBox = document.getElementById('message');
const attemptsLeftDisplay = document.getElementById('attempts-left');
const historyDisplay = document.getElementById('guess-history');
const restartBtn = document.getElementById('restart-btn');

guessBtn.addEventListener('click', checkGuess);
userGuessInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkGuess();
  }
});

function checkGuess() {
  const userVal = Number(userGuessInput.value);

  // Kiểm tra số hợp lệ
  if (!userVal || userVal < 1 || userVal > 100) {
    messageBox.style.color = "#c0392b";
    messageBox.textContent = "⚠️ Vui lòng nhập số từ 1 đến 100!";
    return;
  }

  // Kiểm tra số đã từng đoán chưa
  if (guessHistory.includes(userVal)) {
    messageBox.style.color = "#d35400";
    messageBox.textContent = `⚠️ Bạn đã đoán số ${userVal} rồi! Thử số khác nhé.`;
    userGuessInput.value = "";
    return;
  }

  // Trừ lượt đi và ghi vào lịch sử
  attemptsLeft--;
  guessHistory.push(userVal);
  updateUI();

  // So sánh kết quả
  if (userVal === secretNumber) {
    messageBox.style.color = "#27ae60";
    messageBox.textContent = `🎉 XUẤT SẮC! Bạn đã đoán đúng số ${secretNumber} sau ${maxAttempts - attemptsLeft} lượt!`;
    endGame();
  } else if (attemptsLeft === 0) {
    messageBox.style.color = "#c0392b";
    messageBox.textContent = `💥 HẾT LƯỢT! Bạn đã thua. Số bí mật là: ${secretNumber}`;
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

function updateUI() {
  attemptsLeftDisplay.textContent = attemptsLeft;
  
  // Hiển thị danh sách số đã đoán dạng nhãn (tags)
  historyDisplay.innerHTML = guessHistory
    .map(num => `<span class="tag">${num}</span>`)
    .join('');
}

function endGame() {
  guessBtn.classList.add('hidden');
  userGuessInput.disabled = true;
  restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = maxAttempts;
  guessHistory = [];

  userGuessInput.disabled = false;
  userGuessInput.value = "";
  attemptsLeftDisplay.textContent = attemptsLeft;
  historyDisplay.textContent = "Chưa có";
  messageBox.style.color = "#34495e";
  messageBox.textContent = "Hãy thử nhập một số đi nào!";
  
  guessBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
});
