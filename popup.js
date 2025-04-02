//console.log('This is a popup!');
/*
document.addEventListener("DOMContentLoaded", () => {
    let seconds = 0, minutes = 0;
    let timeRef = document.querySelector(".timer-display");
    let int = null;

    console.log("Timer script loaded"); // Debugging log
    console.log(timeRef); // Ensure element exists

    document.getElementById("start-timer").addEventListener("click", () => {
        if (int !== null) {
            clearInterval(int);
        }
        int = setInterval(displayTimer, 1000);
    });

    document.getElementById("pause-timer").addEventListener("click", () => {
        clearInterval(int);
    });

    document.getElementById("reset-timer").addEventListener("click", () => {
        clearInterval(int);
        int = null;
        seconds = 0;
        minutes = 0;
        timeRef.innerHTML = "00:00";
    });

    function displayTimer() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;
        timeRef.innerHTML = `${m}:${s}`;
    }

    console.log("this is the clock");
});
*/
// DOM Elements
const timeDisplay = document.querySelector('.time');
const statusText = document.querySelector('.status');
const playPauseBtn = document.getElementById('playPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsDropdown = document.getElementById('settingsDropdown');
const focusTimeInput = document.getElementById('focusTime');
const breakTimeInput = document.getElementById('breakTime');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressFill = document.querySelector('.progress-fill');

// Timer variables
let timerInterval;
let isRunning = false;
let isPaused = false;
let isBreak = false;
let minutes = parseInt(focusTimeInput.value);
let seconds = 0;
let totalSeconds = minutes * 60;
let currentSeconds = totalSeconds;

// Initialize timer display
updateTimerDisplay();

// Event listeners
playPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', toggleSettingsDropdown);
focusTimeInput.addEventListener('change', updateTimerSettings);
breakTimeInput.addEventListener('change', updateTimerSettings);

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
    settingsDropdown.classList.remove('active');
  }
});

// Functions
function toggleTimer() {
  if (!isRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    
    // Update button appearance
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    
    timerInterval = setInterval(() => {
      if (currentSeconds > 0) {
        currentSeconds--;
        updateTimerDisplay();
        updateProgress();
      } else {
        // Timer has finished
        clearInterval(timerInterval);
        playSound();
        
        // Toggle between focus and break
        isBreak = !isBreak;
        
        if (isBreak) {
          totalSeconds = parseInt(breakTimeInput.value) * 60;
          statusText.textContent = 'Break Time';
          document.body.style.backgroundColor = '#e8f5e9';
        } else {
          totalSeconds = parseInt(focusTimeInput.value) * 60;
          statusText.textContent = 'Focus Time';
          document.body.style.backgroundColor = '#f8f9fa';
        }
        
        currentSeconds = totalSeconds;
        updateTimerDisplay();
        updateProgress();
        
        // Auto-start next timer
        startTimer();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = true;
  
  // Update button appearance
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;
  isBreak = false;
  
  // Reset to focus time
  totalSeconds = parseInt(focusTimeInput.value) * 60;
  currentSeconds = totalSeconds;
  
  // Update display
  statusText.textContent = 'Focus Time';
  document.body.style.backgroundColor = '#f8f9fa';
  
  // Update button appearance
  playIcon.style.display = 'block';
  pauseIcon.style.display = 'none';
  
  updateTimerDisplay();
  updateProgress();
}

function updateTimerDisplay() {
  minutes = Math.floor(currentSeconds / 60);
  seconds = currentSeconds % 60;
  
  timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const progressPercentage = (1 - currentSeconds / totalSeconds) * 360;
  progressFill.style.transform = `rotate(${progressPercentage}deg)`;
  
  // Change progress color based on mode
  progressFill.style.backgroundColor = isBreak ? '#66bb6a' : '#4caf50';
}

function toggleSettingsDropdown() {
  settingsDropdown.classList.toggle('active');
}

function updateTimerSettings() {
  // Only update if timer is not running
  if (!isRunning) {
    resetTimer();
  }
}

function playSound() {
  // Create a subtle notification sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(830, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}