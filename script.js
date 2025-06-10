const questionEl = document.getElementById("question");
const newGameBtn = document.getElementById("new-game");
const optionsCont = document.querySelector(".options");
const progress = document.getElementById("progress");
const loadingText = document.querySelector(".loading-text");
const userName = document.getElementById("username");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const startQuiz = document.getElementById("startQuiz");
const showname = document.querySelector(".user-Name");
const quizSetUpbox = document.querySelector(".quiz-setup");
const result = document.querySelector(".result-box");
const quizContainer = document.querySelector(".quiz-container");

let ObjData;
let score = 0;

let rightAnswer = new Audio("./correct-6033.mp3");
let wrongAnswer = new Audio("./wrong-buzzer-6268.mp3");

let QIndex = 0;

async function quizApp() {
  try {
    let res = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category.value}&difficulty=${difficulty.value}&type=multiple`
    );

    if (!res.ok) {
      loadingText.innerText = "❌ Failed to fetch data. Please try again.";
      loadingText.classList.add("error-message");
      return; // stop execution if fetch failed
    }

    let data = await res.json();
    ObjData = data;

    // Hide error if previously shown
    loadingText.innerText = "";
    loadingText.classList.remove("error-message");

    showQuestion(); // Call only if data is successfully fetched
  } catch (error) {
    loadingText.innerText = `❌ ${error.message}`;
    loadingText.classList.add("error-message");
  }
}

function showQuestion() {
  if (ObjData.response_code) return;

  optionsCont.innerHTML = "";
  progress.innerText = `${QIndex + 1} / 10`;
  let answerArray = [];
  let questionArray = ObjData.results[QIndex];
  questionEl.innerHTML = questionArray.question;
  answerArray.push(...questionArray.incorrect_answers);
  let i = Math.floor(Math.random() * 4);
  answerArray.splice(i, 0, questionArray.correct_answer);
  answerArray.forEach((ans) => {
    const button = document.createElement("button");
    button.classList.add("option");
    button.innerHTML = ans;

    button.addEventListener("click", () => {
      if (ans === questionArray.correct_answer) {
        button.classList.add("correct");
        rightAnswer.play();
        score++;
      } else {
        button.classList.add("wrong");
        wrongAnswer.play();
      }

      Array.from(optionsCont.children).forEach((el) => {
        if (el.innerText === questionArray.correct_answer)
          el.classList.add("correct");
        el.disabled = true;
      });
      changeQuestion();
    });

    optionsCont.append(button);
  });
}

function changeQuestion() {
  QIndex++;
  setTimeout(() => {
    if (QIndex < ObjData.results.length) {
      showQuestion();
    } else {
      quizContainer.style.display = "none";
      result.style.display = "block";
      result.querySelector(".score").innerHTML = `${score} / 10`;
    }
  }, 1000);
}

newGameBtn.addEventListener("click", () => {
  location.reload()
});

startQuiz.addEventListener("click", () => {
  quizContainer.style.display = "block";
  showname.innerText = `Hello ${
    userName.value.trim() === "" ? "Guest" : userName.value.trim()
  }`;
  quizSetUpbox.style.display = "none";
  QIndex = 0;
  quizApp();
});
