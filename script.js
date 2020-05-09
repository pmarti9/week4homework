const startEl = document.querySelector('#beginQuiz');
const questionsTitleEl = document.querySelector('#question-title');
const choicesEl = document.querySelector('#choices');
const startScreenEl = document.querySelector('#start-screen');
const questionsEl = document.querySelector('#questions');
const timerEl = document.querySelector('#timer')
const feedbackEl = document.querySelector('#feedback');
const endScreenEl = document.querySelector('#end-screen');
const finalScoreEl = document.querySelector('#final-score');
const initialsEl = document.querySelector('#initials');
const submitBtn = document.querySelector('#submit');
const highscoreEl = document.querySelector('#highscore-screen');
const restartEl = document.querySelector('#restart');

let currentQuestionIndex = 0;
let time = 120;
const questions = [
  {
    question: 'How many planets are there in the solar system',
    choices: [6,7,8,9],
    answer: 8
  },
  {
    question: 'What conference do the Utes play in?',
    choices: ['Pac-12', 'Mountain West', 'Big 12', 'WAC'],
    answer: 'Pac-12'
  },
  {
    question: 'What year was Mountain dew introduced?',
    choices: ['1940', '1948', '1964', '1992'],
    answer: '1940'
  },
]

let timerId;


const getQuestion = () => {
  let currentQuestion = questions[currentQuestionIndex]

  questionsTitleEl.textContent = currentQuestion.question;
  choicesEl.innerHTML = '';
  
  currentQuestion.choices.forEach(choice => {
    let choiceButton = document.createElement('button');
    choiceButton.setAttribute('value', choice);
    choiceButton.textContent = choice;
    choiceButton.addEventListener('click', answerCheck);
    choicesEl.appendChild(choiceButton);

  })
}

const answerCheck = (event) => {
  if(event.target.value !== questions[currentQuestionIndex].answer){
    time -= 15;

    if(time < 0) {
      time=0;
    }
    feedbackEl.textContent = 'Wrong!'
  } else {
    feedbackEl.textContent = 'Correct!'
  } 

  feedbackEl.removeAttribute('class');
  setTimeout(() => {
    feedbackEl.setAttribute('class', 'hide');
  }, 2000)

  currentQuestionIndex++;

  if(currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
};

const clockTick = () => {
  time--;
  timerEl.textContent = time;

  if(time <=0) {
    quizEnd();
  }
};

const saveHighScore = (event)=>{
  event.preventDefault();
  let initials = initialsEl.value.trim();

  if(initials !== ""){
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

    let newScore = {
      score: time,
      initials: initials
    };

    highscores.push(newScore);
    localStorage.setItem('highscores', JSON.stringify(highscores));

    printHighScore();
    // window.location.href = 'highscores.html';
  } 
};

const printHighScore = () => {
  endScreenEl.setAttribute('class','hide')
  

  let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

  highscores.sort((a, b) => b.score - a.score)

  highscores.forEach(score => {
    let liTag = document.createElement('li')
    liTag.textContent = `${score.initials} - ${score.score}`;

    const olEl = document.querySelector('#highscores');
    olEl.appendChild(liTag);

  })
  highscoreEl.removeAttribute('class')
}
const quizEnd = () => {
  clearInterval(timerId);

  endScreenEl.removeAttribute('class');

  finalScoreEl.textContent = time;

  questionsEl.setAttribute('class','hide');
};

const startQuiz = ()=>{
  currentQuestionIndex = 0;
  time = 120;
  highscoreEl.setAttribute('class','hide')

  startScreenEl.setAttribute('class', 'hide')
  questionsEl.removeAttribute('class')

  timerId = setInterval(clockTick, 1000)


  getQuestion();

};

const checkForEnter = event => {
  if(event.key === 'Enter'){
    saveHighScore();
  }
};

submitBtn.addEventListener('click', saveHighScore)
restartEl.addEventListener('click', startQuiz);
startEl.addEventListener('click', startQuiz);