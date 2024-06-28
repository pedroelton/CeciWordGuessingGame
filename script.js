const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters");
const gameContainer = document.getElementById("game-container");
const inputContainer = document.getElementById("input-container");
const startGameButton = document.getElementById("start-game");
const returnButton = document.getElementById("return-button");
const toggleCaseButton = document.getElementById("toggle-case");
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");
const endSound = document.getElementById("end-sound");

let secretWord;
let remainingLetters;
let guessedLetters = new Map(); // Map to store guessed letters and their positions
let letterFrequencies = new Map(); // Map to store letter frequencies
let isUpperCase = false; // Start with lowercase letters

function generateWordDisplay() {
  const displayedWord = secretWord
    .split("")
    .map((letter, index) => {
      if (letter === " ") {
        return " "; // Display actual spaces
      } else if (guessedLetters.has(index)) {
        // Return the guessed letter in the correct case
        return guessedLetters.get(index);
      } else {
        return "_";
      }
    })
    .join("");
  wordContainer.textContent = displayedWord;
}

function handleLetterClick(event) {
  const clickedLetter = event.target.textContent;
  if (clickedLetter !== " ") {
    // Find positions of clicked letter in the secret word
    let found = false;
    secretWord.split("").forEach((letter, index) => {
      if (
        letter.toLowerCase() === clickedLetter.toLowerCase() &&
        !guessedLetters.has(index)
      ) {
        // If the letter appears only once in the word, use the clicked letter's case
        const guessedLetter =
          letterFrequencies.get(letter.toLowerCase()) === 1
            ? clickedLetter
            : letter;
        guessedLetters.set(index, guessedLetter);
        remainingLetters.delete(letter.toLowerCase());
        found = true;
      }
    });

    if (found) {
      // Play sound for correct guess
      correctSound.play();
      const container = document.querySelector(".container");
      container.style.backgroundColor = "#B0CB1F";
      setTimeout(() => {
        container.style.backgroundColor = "transparent";
      }, 1000);
      generateWordDisplay();
      checkWin();
    } else {
      // Play sound for incorrect guess
      incorrectSound.play();
      const container = document.querySelector(".container");
      container.style.backgroundColor = "#990000";
      setTimeout(() => {
        container.style.backgroundColor = "transparent";
      }, 1000);
    }
  }
}

function checkWin() {
  if (remainingLetters.size === 0) {
    setTimeout(() => {
      endSound.play();
      alert("You guessed the word! Congratulations!");
    }, 1000);
  }
}

function createLetterButtons() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  for (let letter of letters) {
    const button = document.createElement("button");
    button.textContent = isUpperCase ? letter.toUpperCase() : letter;
    button.addEventListener("click", handleLetterClick);
    lettersContainer.appendChild(button);
  }
}

function toggleCase() {
  isUpperCase = !isUpperCase;
  const buttons = lettersContainer.querySelectorAll("button");
  buttons.forEach((button) => {
    button.textContent = isUpperCase
      ? button.textContent.toUpperCase()
      : button.textContent.toLowerCase();
  });
}

startGameButton.addEventListener("click", function () {
  secretWord = document.getElementById("secret-word").value;
  if (secretWord.trim() === "") {
    alert("Please enter a word or phrase to start the game!");
  } else {
    // Calculate letter frequencies
    letterFrequencies = new Map();
    secretWord.split("").forEach((letter) => {
      if (letter !== " ") {
        const lowerCaseLetter = letter.toLowerCase();
        letterFrequencies.set(
          lowerCaseLetter,
          (letterFrequencies.get(lowerCaseLetter) || 0) + 1
        );
      }
    });
    remainingLetters = new Set(secretWord.toLowerCase().split(""));
    guessedLetters = new Map();
    gameContainer.style.display = "block";
    inputContainer.style.display = "none";
    generateWordDisplay();
    lettersContainer.innerHTML = ""; // Clear previous buttons
    createLetterButtons();
  }
});

returnButton.addEventListener("click", function () {
  gameContainer.style.display = "none";
  inputContainer.style.display = "block";
  secretWord = "";
  endSound.pause();
  endSound.currentTime = 0;
  remainingLetters = new Set();
  guessedLetters = new Map();
  wordContainer.textContent = "";
  lettersContainer.innerHTML = "";
  document.getElementById("secret-word").value = "";
});

toggleCaseButton.addEventListener("click", toggleCase);

gameContainer.style.display = "none";
