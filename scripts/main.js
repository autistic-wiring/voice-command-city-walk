/**
 * Voice Animation Game - Main Entry Point
 * A sensory-friendly game for non-verbal autistic users
 */

import { SpeechRecognition } from './speech.js';
import { Character } from './character.js';
import { WorldObjects } from './world.js';

// DOM Elements
const micStatus = document.getElementById('micStatus');
const micIcon = document.getElementById('micIcon');
const micText = document.getElementById('micText');
const commandFeedback = document.getElementById('commandFeedback');
const feedbackText = document.getElementById('feedbackText');
const commandItems = document.querySelectorAll('.command-item');

// Initialize character
const character = new Character('character');

// Initialize world objects (NPCs, obstacles)
const world = new WorldObjects(character);

// Feedback display timeout
let feedbackTimeout = null;

/**
 * Show command feedback
 */
function showFeedback(command) {
  // Clear existing timeout
  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
  }
  
  // Update feedback text
  feedbackText.textContent = command.toUpperCase();
  commandFeedback.classList.add('visible');
  
  // Highlight the matching command item
  commandItems.forEach(item => {
    const word = item.querySelector('.command-word').textContent;
    if (word === command) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Hide feedback after delay
  feedbackTimeout = setTimeout(() => {
    commandFeedback.classList.remove('visible');
  }, 2000);
}

/**
 * Handle recognized voice command
 */
function handleCommand(command) {
  console.log('🎮 Processing command:', command);
  
  // Show visual feedback
  showFeedback(command);
  
  // Update character state
  character.processCommand(command);
  
  // Play audio feedback (optional - subtle sound)
  playFeedbackSound(command);
}

/**
 * Play subtle audio feedback
 */
function playFeedbackSound(command) {
  // Create a simple tone using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Different frequencies for different commands
    const frequencies = {
      walk: 400,
      run: 500,
      stop: 300,
      jump: 600,
      wave: 450,
      dance: 550
    };
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[command] || 400;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Audio not available, that's okay
    console.log('Audio feedback not available');
  }
}

/**
 * Handle speech recognition status changes
 */
function handleStatusChange({ listening, error }) {
  if (error) {
    micText.textContent = 'Error';
    micStatus.classList.remove('listening');
    alert(error);
    return;
  }
  
  if (listening) {
    micStatus.classList.add('listening');
    micText.textContent = 'Listening...';
    micIcon.textContent = '🎤';
  } else {
    micStatus.classList.remove('listening');
    micText.textContent = 'Click to Start';
    micIcon.textContent = '🎤';
  }
}

// Initialize speech recognition
const speech = new SpeechRecognition(handleCommand, handleStatusChange);

// Set up microphone toggle
micStatus.addEventListener('click', () => {
  speech.toggle();
});

// Keyboard shortcut: Space bar to toggle listening
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    speech.toggle();
  }
});

// Initial state
console.log('🎮 Voice Animation Game initialized');
console.log('🎤 Voice recognition will auto-start on first interaction');

// Check for speech recognition support
if (!speech.isSupported) {
  micText.textContent = 'Not Supported';
  alert('Speech recognition is not supported in this browser. Please use Chrome or Edge for the best experience.');
}

// Auto-start speech recognition on first user interaction
let hasAutoStarted = false;
function autoStartSpeech() {
  if (!hasAutoStarted && speech.isSupported) {
    hasAutoStarted = true;
    speech.start();
    // Remove listeners after first interaction
    document.removeEventListener('click', autoStartSpeech);
    document.removeEventListener('keydown', autoStartSpeech);
  }
}

// Listen for first interaction to auto-start
document.addEventListener('click', autoStartSpeech);
document.addEventListener('keydown', autoStartSpeech);

// AUTO-START: Character starts walking immediately!
setTimeout(() => {
  console.log('🚀 Auto-starting game: Character walking!');
  character.processCommand('walk');
}, 500);

// ==========================================
// Debug Hooks
// ==========================================
window.game = {
  // Get current character state
  getState: () => character.getState(),
  
  // Inject a command programmatically
  command: (cmd) => {
    console.log(`🔧 Debug command injected: ${cmd}`);
    handleCommand(cmd);
    return character.getState();
  },
  
  // Access internal instances
  character: character,
  speech: speech,
  
  // Run a quick self-test sequence
  debug: async () => {
    console.group('🔧 Running Self-Test');
    const commands = ['walk', 'run', 'jump', 'wave', 'dance', 'stop'];
    const results = {};
    
    for (const cmd of commands) {
      console.log(`Testing command: ${cmd}...`);
      handleCommand(cmd);
      
      // Wait a bit for state transition
      await new Promise(r => setTimeout(r, 100));
      
      const state = character.getState();
      const passed = state === cmd || (cmd === 'sprint' && state === 'run'); // basic mapping check
      
      results[cmd] = {
        expected: cmd,
        actual: state,
        status: passed ? '✅ PASS' : '❌ FAIL'
      };
      
      // Wait for animation to be visible
      await new Promise(r => setTimeout(r, 800));
    }
    
    console.table(results);
    console.groupEnd();
    return results;
  }
};

console.log('🔧 Debug mode available: Use window.game.command("run") or window.game.debug()');
