// ====== DOM Elements ======
const container = document.querySelector('.container');
const quizContainer = document.querySelector('.quizcontainer');
const resultContainer = document.querySelector('.resultcontainer');
const startBtn = document.querySelector('.start');
const tryAgainBtn = document.querySelector('.tryagain');
const cateBtns = document.querySelectorAll('.category-options .cate-option');
const quesBtns = document.querySelectorAll('.question-option .cate-option');

const timerElem = document.querySelector('.timeduration');
const questionElem = document.querySelector('.quizcontent h1');
const optionsList = document.querySelector('.options-list');
const nextBtn = document.querySelector('.next-btn');
const questionStatus = document.querySelector('.questionstatus');
const resultMsg = document.querySelector('.resultmsg');

// ====== State ======
let chosenCategory = null;
let chosenNumQuestions = null;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer = 15;
let timerInterval = null;
let selected = false;

// ====== Category Select ======
cateBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    cateBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    chosenCategory = btn.textContent.toLowerCase();
  });
});

// ====== Number of Questions Select ======
quesBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    quesBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    chosenNumQuestions = Number(btn.textContent);
  });
});

// ====== Start Quiz ======
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
  if (!chosenCategory || !chosenNumQuestions) {
    alert('Please select a category and number of questions!');
    return;
  }
  currentIndex = 0;
  score = 0;
  selected = false;

  // Find the selected category array
  const catObj = questions.find(q => q.category === chosenCategory);
  if (!catObj) {
    alert('Invalid category!');
    return;
  }

  // Shuffle, slice questions according to chosenNumQuestions
  currentQuestions = shuffleArray([...catObj.questions]).slice(0, chosenNumQuestions);

  // Hide home, show quiz
  container.style.display = 'none';
  resultContainer.style.display = 'none';
  quizContainer.style.display = 'block';

  showQuestion();
}

// ====== Show Question ======
function showQuestion() {
  clearInterval(timerInterval);
  const total = currentQuestions.length;
  const currQ = currentQuestions[currentIndex];

  questionElem.textContent = currQ.question;
  optionsList.innerHTML = '';
  currQ.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.textContent = opt;
    li.className = 'option';
    li.dataset.idx = i;
    li.addEventListener('click', optionClicked);
    optionsList.appendChild(li);
  });

  questionStatus.textContent = `${currentIndex + 1} of ${total} question${total > 1 ? 's' : ''}`;
  timer = 15;
  timerElem.textContent = timer + 's';
  startTimer();

  nextBtn.disabled = true;
  nextBtn.style.opacity = 0.6;
  selected = false;
}

// ====== Timer ======
function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    timerElem.textContent = timer + 's';
    if (timer <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  if (selected) return;
  selected = true;
  Array.from(optionsList.children).forEach((li, i) => {
    li.classList.add('disabled');
    if (i == currentQuestions[currentIndex].correctAnswer) {
      li.classList.add('correct');
    }
  });
  nextBtn.disabled = false;
  nextBtn.style.opacity = 1;
}

// ====== Option Click ======
function optionClicked(e) {
  if (selected) return;
  selected = true;
  clearInterval(timerInterval);

  const chosenIdx = Number(e.currentTarget.dataset.idx);
  const isCorrect = chosenIdx === currentQuestions[currentIndex].correctAnswer;
  if (isCorrect) {
    score++;
    e.currentTarget.classList.add('correct');
  } else {
    e.currentTarget.classList.add('wrong');
    optionsList.children[currentQuestions[currentIndex].correctAnswer].classList.add('correct');
  }
  Array.from(optionsList.children).forEach(li => li.classList.add('disabled'));
  nextBtn.disabled = false;
  nextBtn.style.opacity = 1;
}

// ====== Next Button ======
nextBtn.addEventListener('click', () => {
  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

// ====== Show Result ======
function showResult() {
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  let msg;
  if (score === currentQuestions.length) {
    msg = `Perfect! You answered all ${currentQuestions.length} questions correctly! 🎉`;
  } else if (score >= Math.ceil(currentQuestions.length * 0.7)) {
    msg = `Well done! You answered ${score} out of ${currentQuestions.length} correctly.`;
  } else if (score >= Math.ceil(currentQuestions.length * 0.4)) {
    msg = `You answered ${score} out of ${currentQuestions.length} correctly. Great effort!`;
  } else {
    msg = `You answered ${score} out of ${currentQuestions.length}. Keep practicing!`;
  }
  resultMsg.textContent = msg;
}

// ====== Try Again ======
tryAgainBtn.addEventListener('click', () => {
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'none';
  container.style.display = 'block';
  cateBtns.forEach(b => b.classList.remove('selected'));
  quesBtns.forEach(b => b.classList.remove('selected'));
  chosenCategory = null;
  chosenNumQuestions = null;
});

// ====== Shuffle Array ======
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ====== Startup State ======
container.style.display = 'block';
quizContainer.style.display = 'none';
resultContainer.style.display = 'none';
nextBtn.disabled = true;
nextBtn.style.opacity = 0.6;
