// Word database with clues
const wordDatabase = [
    { word: "ELEPHANT", clue: "A large mammal with a trunk and tusks" },
    { word: "GUITAR", clue: "A stringed musical instrument" },
    { word: "PYRAMID", clue: "Ancient Egyptian monument with triangular sides" },
    { word: "BUTTERFLY", clue: "A colorful insect with wings that goes through metamorphosis" },
    { word: "VOLCANO", clue: "A mountain that can erupt with lava" },
    { word: "RAINBOW", clue: "Colorful arc in the sky after rain" },
    { word: "CHOCOLATE", clue: "Sweet brown treat made from cocoa" },
    { word: "TELESCOPE", clue: "Instrument used to observe distant objects in space" },
    { word: "PENGUIN", clue: "A flightless bird that lives in cold climates" },
    { word: "KEYBOARD", clue: "Computer input device with letters and numbers" },
    { word: "MOUNTAIN", clue: "A very high natural elevation of earth's surface" },
    { word: "LIBRARY", clue: "A place where books are kept for reading" },
    { word: "DINOSAUR", clue: "Extinct prehistoric reptile" },
    { word: "UMBRELLA", clue: "Device used to protect from rain" },
    { word: "SANDWICH", clue: "Food with filling between two slices of bread" },
    { word: "COMPUTER", clue: "Electronic device for processing data" },
    { word: "AIRPLANE", clue: "Flying vehicle with wings and engines" },
    { word: "HOSPITAL", clue: "Place where sick people receive medical treatment" },
    { word: "CALENDAR", clue: "Chart showing days, weeks, and months of the year" },
    { word: "TREASURE", clue: "Valuable collection of precious items" }
];

// Game state
let currentWord = "";
let currentClue = "";
let displayedWord = [];
let score = 0;
let hintsLeft = 3;
let revealedIndices = new Set();
let usedWords = new Set();

// DOM elements
const wordPuzzle = document.getElementById("word-puzzle");
const clueText = document.getElementById("clue");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const hintBtn = document.getElementById("hint-btn");
const skipBtn = document.getElementById("skip-btn");
const newGameBtn = document.getElementById("new-game-btn");
const scoreDisplay = document.getElementById("score");
const hintsLeftDisplay = document.getElementById("hints-left");
const messageDiv = document.getElementById("message");

// Initialize game
function initGame() {
    score = 0;
    usedWords.clear();
    updateScore();
    loadNewWord();
}

// Load a new word
function loadNewWord() {
    // Reset hints for new word
    hintsLeft = 3;
    revealedIndices.clear();
    updateHintsDisplay();
    
    // Get available words
    const availableWords = wordDatabase.filter(item => !usedWords.has(item.word));
    
    // Check if all words have been used
    if (availableWords.length === 0) {
        showMessage("🎉 Congratulations! You've completed all words! Final Score: " + score, "success");
        disableGameControls();
        return;
    }
    
    // Select random word
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    
    currentWord = selectedWord.word.toUpperCase();
    currentClue = selectedWord.clue;
    usedWords.add(currentWord);
    
    // Create display with first and last letters visible
    displayedWord = [];
    for (let i = 0; i < currentWord.length; i++) {
        if (i === 0 || i === currentWord.length - 1) {
            displayedWord.push(currentWord[i]);
            revealedIndices.add(i);
        } else {
            displayedWord.push("_");
        }
    }
    
    // Update display
    updateWordDisplay();
    clueText.textContent = currentClue;
    guessInput.value = "";
    guessInput.focus();
    clearMessage();
    enableGameControls();
}

// Update word display
function updateWordDisplay() {
    wordPuzzle.innerHTML = displayedWord.map((letter, index) => {
        if (letter === "_") {
            return `<span class="letter underscore">_</span>`;
        } else {
            return `<span class="letter">${letter}</span>`;
        }
    }).join("");
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = score;
}

// Update hints display
function updateHintsDisplay() {
    hintsLeftDisplay.textContent = hintsLeft;
    hintBtn.disabled = hintsLeft === 0;
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

// Clear message
function clearMessage() {
    messageDiv.textContent = "";
    messageDiv.className = "message";
}

// Handle guess submission
function handleGuess() {
    const guess = guessInput.value.trim().toUpperCase();
    
    if (!guess) {
        showMessage("Please enter a guess!", "error");
        return;
    }
    
    if (guess === currentWord) {
        score += 10;
        updateScore();
        showMessage(`🎉 Correct! The word was "${currentWord}". +10 points!`, "success");
        setTimeout(() => {
            loadNewWord();
        }, 2000);
    } else {
        score -= 1;
        updateScore();
        showMessage(`❌ Wrong! Try again. -1 point`, "error");
        guessInput.value = "";
        guessInput.focus();
    }
}

// Handle hint request
function handleHint() {
    if (hintsLeft === 0) {
        showMessage("No hints left for this word!", "error");
        return;
    }
    
    // Find unrevealed indices (excluding first and last)
    const unrevealedIndices = [];
    for (let i = 1; i < currentWord.length - 1; i++) {
        if (!revealedIndices.has(i)) {
            unrevealedIndices.push(i);
        }
    }
    
    if (unrevealedIndices.length === 0) {
        showMessage("All letters are already revealed!", "info");
        return;
    }
    
    // Reveal a random unrevealed letter
    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    displayedWord[randomIndex] = currentWord[randomIndex];
    revealedIndices.add(randomIndex);
    
    hintsLeft--;
    updateHintsDisplay();
    updateWordDisplay();
    
    showMessage(`💡 Hint used! Letter revealed. ${hintsLeft} hints remaining.`, "info");
    guessInput.focus();
}

// Handle skip
function handleSkip() {
    score -= 3;
    updateScore();
    showMessage(`⏭️ Word skipped! The word was "${currentWord}". -3 points`, "info");
    setTimeout(() => {
        loadNewWord();
    }, 2000);
}

// Disable game controls
function disableGameControls() {
    guessInput.disabled = true;
    submitBtn.disabled = true;
    hintBtn.disabled = true;
    skipBtn.disabled = true;
}

// Enable game controls
function enableGameControls() {
    guessInput.disabled = false;
    submitBtn.disabled = false;
    hintBtn.disabled = hintsLeft === 0;
    skipBtn.disabled = false;
}

// Event listeners
submitBtn.addEventListener("click", handleGuess);

guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleGuess();
    }
});

hintBtn.addEventListener("click", handleHint);

skipBtn.addEventListener("click", handleSkip);

newGameBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to start a new game? Your current progress will be lost.")) {
        initGame();
    }
});

// Start the game when page loads
initGame();

// Made with Bob
