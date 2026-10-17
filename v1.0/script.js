// Tạo số ngẫu nhiên từ 1 đến 100
let secretNumber = Math.floor(Math.random() * 100) + 1;

const userGuessInput = document.getElementById('user-guess');
const guessBtn = document.getElementById('guess-btn');
const messageBox = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

guessBtn.addEventListener('click', checkGuess);
userGuessInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkGuess();
  }
});

function checkGuess() {
  const userVal = Number(userGuessInput.value);

  // Kiểm tra xem người dùng đã nhập số hợp lệ chưa
  if (!userVal || userVal < 1 || userVal > 100) {
    messageBox.style.color = "#c0392b";
    messageBox.textContent = "⚠️ Vui lòng nhập một số từ 1 đến 100!";
    return;
  }

  // So sánh số của người chơi với số bí mật
  if (userVal === secretNumber) {
    messageBox.style.color = "#27ae60";
    messageBox.textContent = `🎉 CHÍNH XÁC! Số bí mật đúng là ${secretNumber}!`;
    endGame();
  } else if (userVal < secretNumber) {
    messageBox.style.color = "#d35400";
    messageBox.textContent = `📈 Số bí mật LỚN HƠN ${userVal}. Thử lại nhé!`;
  } else {
    messageBox.style.color = "#2980b9";
    messageBox.textContent = `📉 Số bí mật NHỎ HƠN ${userVal}. Thử lại nhé!`;
  }

  userGuessInput.value = "";
  userGuessInput.focus();
}

function endGame() {
  guessBtn.classList.add('hidden');
  userGuessInput.disabled = true;
  restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  userGuessInput.disabled = false;
  userGuessInput.value = "";
  messageBox.style.color = "#34495e";
  messageBox.textContent = "Hãy thử nhập một số đi nào!";
  guessBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
});
