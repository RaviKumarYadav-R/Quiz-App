const questionEl = document.getElementById("question");
const nextBtn = document.getElementById("nextBtn");
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

let ObjData;

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
      } else {
        button.classList.add("wrong");
      }

      Array.from(optionsCont.children).forEach((el) => {
        if (el.innerText === questionArray.correct_answer)
          el.classList.add("correct");
        el.disabled = true;
      });
      nextBtn.style.display = "block";
    });

    optionsCont.append(button);
  });
}

nextBtn.addEventListener("click", () => {
  nextBtn.style.display = "none";
  QIndex++;
  if (QIndex < ObjData.results.length) {
    showQuestion();
  } else {
    newGameBtn.style.display = "block";
  }
});

newGameBtn.addEventListener("click", () => {
  quizSetUpbox.style.display = "block";
  newGameBtn.style.display = "none";
});

startQuiz.addEventListener("click", () => {
  showname.innerText = `Hello ${
    userName.value.trim() === "" ? "Guest" : userName.value.trim()
  }`;
  quizSetUpbox.style.display = "none";
  QIndex = 0;
  quizApp();
});
