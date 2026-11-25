const sentence = document.querySelector("#sentence");
const userInput = document.querySelector("#userInput");
const time = document.querySelector("#time");
const restartBtn = document.querySelector("#resetbtn");
let timeLeft = 60;
let timer = null;
let correctcharacter = 0;

console.log("test");

async function getRandomParagraph() {
  const response = await fetch(
    "https://en.wikipedia.org/api/rest_v1/page/random/summary",
  );

  const data = await response.json();

  sentence.innerHTML = "";

  data.extract.split("").forEach((character) => {
    const span = document.createElement("span");
    span.textContent = character;
    sentence.appendChild(span);
  });
}

getRandomParagraph();

const checkTyping = () => {
  correctcharacter = 0; // Reset before recounting

  const typedText = userInput.value;
  const characters = sentence.querySelectorAll("span");

  characters.forEach((span, index) => {
    const typedCharacter = typedText[index];

    span.classList.remove("correct", "incorrect", "active");

    if (typedCharacter == null) {
      if (index === typedText.length) {
        span.classList.add("active");
      }
      return;
    }

    if (typedCharacter === span.textContent) {
      span.classList.add("correct");
      correctcharacter++;
    } else {
      span.classList.add("incorrect");
    }
  });
};

userInput.addEventListener("input", checkTyping);

function startTimer() {
  if (timer !== null) return;

  timer = setInterval(() => {
    timeLeft--;

    time.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      userInput.disabled = true;
      console.log("Time's up!");
      const wpm = Math.round(correctcharacter / 5);
      document.querySelector("#wpm").textContent = wpm;
      const totalCharacters = userInput.value.length;

      const accuracy =
        totalCharacters === 0
          ? 0
          : Math.round((correctcharacter / totalCharacters) * 100);

      document.querySelector("#accuracy").textContent = accuracy + "%";
    }
  }, 1000);
}
userInput.addEventListener("input", startTimer);

restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;

  timeLeft = 60;
  time.textContent = timeLeft;

  userInput.value = "";
  userInput.disabled = false;

  correctcharacter = 0;
  getRandomParagraph();
});
