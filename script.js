// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    round: 0,
    playerChoice: null,
    computerChoice: null,
    result: null,
    history: [],
    isAutoPlaying: false,
    autoPlayInterval: null
};

// DOM elements
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const playerChoiceIconEl = document.getElementById('player-choice-icon');
const playerChoiceNameEl = document.getElementById('player-choice-name');
const computerChoiceIconEl = document.getElementById('computer-choice-icon');
const computerChoiceNameEl = document.getElementById('computer-choice-name');
const resultTextEl = document.getElementById('result-text');
const choiceButtons = document.querySelectorAll('.btn-choice');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-btn');
const autoPlayBtn = document.getElementById('auto-play-btn');
const winsCountEl = document.getElementById('wins-count');
const lossesCountEl = document.getElementById('losses-count');
const drawsCountEl = document.getElementById('draws-count');
const historyListEl = document.getElementById('history-list');

// Choice icons mapping
const choiceIcons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// Choice names mapping
const choiceNames = {
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors'
};

// Initialize the game
function initGame() {
    updateUI();
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    // Choice buttons
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameState.isAutoPlaying) return;
            
            const choice = button.getAttribute('data-choice');
            setPlayerChoice(choice);
        });
    });

    // Play button
    playBtn.addEventListener('click', playRound);

    // Reset button
    resetBtn.addEventListener('click', resetGame);

    // Auto play button
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
}

// Set player's choice
function setPlayerChoice(choice) {
    gameState.playerChoice = choice;
    
    // Update UI to show selected choice
    choiceButtons.forEach(button => {
        if (button.getAttribute('data-choice') === choice) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    updatePlayerChoiceUI();
}

// Update player choice UI
function updatePlayerChoiceUI() {
    if (gameState.playerChoice) {
        playerChoiceIconEl.textContent = choiceIcons[gameState.playerChoice];
        playerChoiceNameEl.textContent = choiceNames[gameState.playerChoice];
        playerChoiceIconEl.classList.add('pulse');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            playerChoiceIconEl.classList.remove('pulse');
        }, 500);
    }
}

// Generate computer's choice
function generateComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    gameState.computerChoice = choices[randomIndex];
    
    updateComputerChoiceUI();
}

// Update computer choice UI
function updateComputerChoiceUI() {
    if (gameState.computerChoice) {
        computerChoiceIconEl.textContent = choiceIcons[gameState.computerChoice];
        computerChoiceNameEl.textContent = choiceNames[gameState.computerChoice];
        computerChoiceIconEl.classList.add('pulse');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            computerChoiceIconEl.classList.remove('pulse');
        }, 500);
    }
}

// Determine the winner
function determineWinner() {
    const { playerChoice, computerChoice } = gameState;
    
    if (playerChoice === computerChoice) {
        gameState.result = 'draw';
        gameState.draws++;
        return "It's a draw!";
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        gameState.result = 'win';
        gameState.playerScore++;
        gameState.wins++;
        return "You win!";
    } else {
        gameState.result = 'lose';
        gameState.computerScore++;
        gameState.losses++;
        return "Computer wins!";
    }
}

// Play a round
function playRound() {
    if (!gameState.playerChoice) {
        resultTextEl.textContent = "Please select a choice first!";
        resultTextEl.classList.add('shake');
        
        setTimeout(() => {
            resultTextEl.classList.remove('shake');
        }, 500);
        return;
    }
    
    gameState.round++;
    generateComputerChoice();
    const resultMessage = determineWinner();
    
    updateUI();
    updateResultUI(resultMessage);
    addToHistory();
}

// Update result UI
function updateResultUI(message) {
    resultTextEl.textContent = message;
    resultTextEl.className = 'result-text';
    
    if (gameState.result === 'win') {
        resultTextEl.classList.add('win');
    } else if (gameState.result === 'lose') {
        resultTextEl.classList.add('lose');
    } else {
        resultTextEl.classList.add('draw');
    }
}

// Add round to history
function addToHistory() {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${gameState.result}`;
    
    historyItem.innerHTML = `
        <div class="round">Round ${gameState.round}</div>
        <div class="choices">
            <span>${choiceIcons[gameState.playerChoice]} vs ${choiceIcons[gameState.computerChoice]}</span>
        </div>
        <div class="result">${gameState.result.toUpperCase()}</div>
    `;
    
    historyListEl.prepend(historyItem);
    
    // Store in game state
    gameState.history.unshift({
        round: gameState.round,
        playerChoice: gameState.playerChoice,
        computerChoice: gameState.computerChoice,
        result: gameState.result
    });
    
    // Limit history to 10 items
    if (historyListEl.children.length > 10) {
        historyListEl.removeChild(historyListEl.lastChild);
        gameState.history.pop();
    }
}

// Toggle auto play
function toggleAutoPlay() {
    if (gameState.isAutoPlaying) {
        stopAutoPlay();
        autoPlayBtn.textContent = 'Auto Play';
        autoPlayBtn.classList.remove('btn-accent');
        autoPlayBtn.classList.add('btn-secondary');
    } else {
        startAutoPlay();
        autoPlayBtn.textContent = 'Stop Auto Play';
        autoPlayBtn.classList.remove('btn-secondary');
        autoPlayBtn.classList.add('btn-accent');
    }
}

// Start auto play
function startAutoPlay() {
    gameState.isAutoPlaying = true;
    autoPlayBtn.disabled = false;
    
    autoPlayInterval = setInterval(() => {
        const choices = ['rock', 'paper', 'scissors'];
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        setPlayerChoice(randomChoice);
        playRound();
    }, 1500);
}

// Stop auto play
function stopAutoPlay() {
    gameState.isAutoPlaying = false;
    clearInterval(autoPlayInterval);
}

// Reset the game
function resetGame() {
    stopAutoPlay();
    
    // Reset game state
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.wins = 0;
    gameState.losses = 0;
    gameState.draws = 0;
    gameState.round = 0;
    gameState.playerChoice = null;
    gameState.computerChoice = null;
    gameState.result = null;
    gameState.history = [];
    
    // Reset UI
    playerChoiceIconEl.textContent = '✊';
    playerChoiceNameEl.textContent = '-';
    computerChoiceIconEl.textContent = '✊';
    computerChoiceNameEl.textContent = '-';
    resultTextEl.textContent = 'Make your move!';
    resultTextEl.className = 'result-text';
    
    // Clear history
    historyListEl.innerHTML = '';
    
    // Clear active choice buttons
    choiceButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Reset auto play button
    autoPlayBtn.textContent = 'Auto Play';
    autoPlayBtn.classList.remove('btn-accent');
    autoPlayBtn.classList.add('btn-secondary');
    
    updateUI();
}

// Update the UI
function updateUI() {
    playerScoreEl.textContent = gameState.playerScore;
    computerScoreEl.textContent = gameState.computerScore;
    winsCountEl.textContent = gameState.wins;
    lossesCountEl.textContent = gameState.losses;
    drawsCountEl.textContent = gameState.draws;
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);