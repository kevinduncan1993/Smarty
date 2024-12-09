const level1Words = [
  "apple", "banana", "chair", "table", "pencil", 
  "school", "friend", "happy", "orange", "tiger"
];

const level2Words = [
  "elephant", "sunflower", "backpack", "computer", "dinosaur",
  "umbrella", "butterfly", "mountain", "rainbow", "giraffe"
];

let currentWords = []; // Words for the current level
let unusedWords = []; // Words that haven’t been used yet
let currentWord = ""; // The current word being guessed
let scrambledWord = ""; // Scrambled version of the current word
let score = 0;        // User's score
let level = 1;        // Current level
let timer = 10;       // Timer duration
let countdown;        // Countdown interval

// DOM Elements
const wordElement = document.getElementById("word");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start");
const resultModal = new bootstrap.Modal(document.getElementById("resultModal"));
const resultMessage = document.getElementById("resultMessage");

// Shuffle letters in a word
function shuffleWord(word) {
  const letters = word.split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join("");
}

// Start the game
function startGame() {
  level = 1; // Reset to level 1
  score = 0; // Reset score
  currentWords = level1Words; // Start with level 1 words
  unusedWords = [...currentWords]; // Initialize unused words
  scoreElement.textContent = `Score: ${score}`;
  inputElement.value = ""; // Clear input field
  inputElement.focus();
  inputElement.removeAttribute("disabled"); // Ensure input is enabled
  nextWord(); // Load the first word
  startCountdown(); // Start the countdown
}

// Start Level 2
function startLevel2() {
  level = 2;
  score = 0; // Reset score for Level 2
  currentWords = level2Words; // Use Level 2 words
  unusedWords = [...currentWords]; // Initialize unused words
  scoreElement.textContent = `Score: ${score}`;
  inputElement.value = ""; // Clear input field
  inputElement.focus();
  inputElement.removeAttribute("disabled"); // Ensure input is enabled
  nextWord(); // Load the first word
  startCountdown(); // Start the countdown
}

// Load the next word
function nextWord() {
  if (unusedWords.length === 0) {
    unusedWords = [...currentWords]; // Refill unused words if necessary
  }

  // Select a random word from unusedWords
  const randomIndex = Math.floor(Math.random() * unusedWords.length);
  currentWord = unusedWords[randomIndex];
  scrambledWord = shuffleWord(currentWord);

  // Display the scrambled word
  wordElement.textContent = scrambledWord;

  // Temporarily remove the word from unusedWords
  unusedWords.splice(randomIndex, 1);
}

// Start the countdown timer
function startCountdown() {
  timer = 10;
  clearInterval(countdown);
  countdown = setInterval(() => {
    timer--;
    timerElement.textContent = `Time Left: ${timer}`;
    if (timer === 0) {
      clearInterval(countdown);
      endGame(false); // End the game if time runs out
    }
  }, 1000);
}

// Handle end of the game
function endGame(didWin) {
  clearInterval(countdown);
  inputElement.setAttribute("disabled", true);

  if (didWin) {
    if (level === 1) {
      // User completes Level 1 and qualifies for Level 2
      if (score === 10) {
        resultMessage.textContent = "Congratulations! You've completed Level 1! Get ready for Level 2! 🎉";
        resultMessage.style.color = "#28a745"; // Green for success
        resultModal.show();
        setTimeout(() => {
          resultModal.hide(); // Hide the modal after the message
          startLevel2(); // Start Level 2 automatically
        }, 3000);
      }
    } else if (level === 2) {
      // User completes Level 2
      if (score === 10) {
        resultMessage.textContent = "Congratulations! You've completed the game! 🎉";
        resultMessage.style.color = "#28a745"; // Green for success
        resultModal.show();
      }
    }
  } else {
    // If the user loses (timer runs out or doesn't qualify)
    resultMessage.textContent = "You Lose! You are not smarter than an elementary student 😢";
    resultMessage.style.color = "#ff0000"; // Red for failure
    resultModal.show();
  }
}

// Handle user input
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const userGuess = inputElement.value.toLowerCase();
    inputElement.value = ""; // Clear input field

    if (userGuess === currentWord.toLowerCase()) {
      // Correct answer
      score++;
      scoreElement.textContent = `Score: ${score}`;
      
      // Check if the user wins the current level
      if (level === 1 && score === 10) {
        endGame(true); // Trigger Level 1 win condition
        return;
      } else if (level === 2 && score === 10) {
        endGame(true); // Trigger Level 2 win condition
        return;
      }

      nextWord(); // Load the next word
      timer = 10; // Reset timer
    } else {
      // Wrong answer: Re-display the same scrambled word
      wordElement.textContent = scrambledWord; 
    }
  }
});

// Start button click handler
startButton.addEventListener("click", startGame);
