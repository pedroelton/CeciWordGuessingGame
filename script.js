const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters");
const gameContainer = document.getElementById("game-container");
const inputContainer = document.getElementById("input-container");
const startGameButton = document.getElementById("start-game");
const returnButton = document.getElementById("return-button");
const correctSound = document.getElementById("correct-sound");
const incorrectSound = document.getElementById("incorrect-sound");
const endSound = document.getElementById("end-sound");

let secretWord;
let remainingLetters;

function generateWordDisplay() {
  const displayedWord = secretWord
    .split("")
    .map((letter) => {
      if (letter === " ") {
        return " "; // Display actual spaces
      } else {
        return remainingLetters.has(letter) ? "_" : letter;
      }
    })
    .join("");
  wordContainer.textContent = displayedWord;
}

function handleLetterClick(event) {
  const clickedLetter = event.target.textContent;
  if (clickedLetter !== " ") {
    // Ignore clicks on space button
    if (remainingLetters.has(clickedLetter)) {
      remainingLetters.delete(clickedLetter);
      // ** Play sound for correct guess **
      correctSound.play();
      const container = document.querySelector(".container");
      container.style.backgroundColor = "#B0CB1F";
      setTimeout(() => {
        container.style.backgroundColor = "transparent";
      }, 1000);
      generateWordDisplay();
      checkWin();
    } else {
      // ** Play sound for incorrect guess **
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
  if (remainingLetters.size === 0) { // Check if all letters have been guessed

    // Get the secret word without spaces (for comparison)
    const secretWordWithoutSpaces = document.getElementById("secret-word").value.toUpperCase().replace(/\s/g, "");

    // Filter displayed characters (excluding spaces and underscores)
    const displayedLetters = wordContainer.textContent.split("").filter(char => char !== " " && char !== "_");

    // Check if all letters (excluding spaces) have been guessed
    if (displayedLetters.join("") === secretWordWithoutSpaces) {
      setTimeout(() => {
        endSound.play();
        alert("You guessed the word! Congratulations!");
      }, 1000);
    }
  }
}

function createLetterButtons() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Include space as a button
  for (let letter of letters) {
    const button = document.createElement("button");
    button.textContent = letter;
    button.addEventListener("click", handleLetterClick);
    lettersContainer.appendChild(button);
  }
}

startGameButton.addEventListener("click", function () {
  secretWord = document.getElementById("secret-word").value.toUpperCase();
  if (secretWord.trim() === "") {
    // Check for empty or only whitespace
    alert("Please enter a word or phrase to start the game!");
  } else {
    remainingLetters = new Set(secretWord.split(""));
    gameContainer.style.display = "block";
    inputContainer.style.display = "none";
    generateWordDisplay();
    createLetterButtons();
  }
});

returnButton.addEventListener("click", function () {
  gameContainer.style.display = "none";
  inputContainer.style.display = "block";
  // Clear any leftover game state (optional)
  secretWord = "";
  endSound.pause();
  endSound.currentTime = 0;
  remainingLetters = new Set();
  wordContainer.textContent = "";
  lettersContainer.innerHTML = ""; // Remove letter buttons
  document.getElementById("secret-word").value = "";
});

// Initially hide the game elements
gameContainer.style.display = "none";
