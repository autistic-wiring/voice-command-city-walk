/**
 * Speech Recognition Module
 * Handles voice input using the Web Speech API
 */

export class SpeechRecognition {
  constructor(onCommand, onStatusChange) {
    this.onCommand = onCommand;
    this.onStatusChange = onStatusChange;
    this.recognition = null;
    this.isListening = false;
    this.isSupported = this.checkSupport();
    
    // Supported commands and their aliases
    this.commands = {
      walk: ['walk', 'walking', 'stroll'],
      run: ['run', 'running', 'sprint', 'fast'],
      stop: ['stop', 'halt', 'freeze', 'stand'],
      jump: ['jump', 'jumping', 'hop', 'leap'],
      wave: ['wave', 'waving', 'hello', 'hi', 'bye'],
      dance: ['dance', 'dancing', 'party', 'groove']
    };
    
    if (this.isSupported) {
      this.init();
    }
  }
  
  /**
   * Check if Web Speech API is supported
   */
  checkSupport() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognitionAPI;
  }
  
  /**
   * Initialize the speech recognition
   */
  init() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();
    
    // Configuration
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 3;
    
    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusChange({ listening: true, error: null });
      console.log('🎤 Speech recognition started');
    };
    
    this.recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      // Auto-restart if we should still be listening
      if (this.isListening) {
        console.log('🔄 Restarting speech recognition...');
        try {
          this.recognition.start();
        } catch (e) {
          console.error('Failed to restart:', e);
        }
      } else {
        this.onStatusChange({ listening: false, error: null });
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      if (event.error === 'not-allowed') {
        this.isListening = false;
        this.onStatusChange({ 
          listening: false, 
          error: 'Microphone access denied. Please allow microphone access.' 
        });
      } else if (event.error === 'no-speech') {
        // This is normal, just means no speech detected for a while
        console.log('No speech detected');
      } else {
        this.onStatusChange({ 
          listening: this.isListening, 
          error: `Error: ${event.error}` 
        });
      }
    };
    
    this.recognition.onresult = (event) => {
      // Get the latest result
      const lastResult = event.results[event.results.length - 1];
      
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        console.log('📝 Heard:', transcript);
        
        // Check for matching command
        const command = this.parseCommand(transcript);
        if (command) {
          console.log('✅ Command recognized:', command);
          this.onCommand(command);
        }
      }
    };
  }
  
  /**
   * Parse transcript for known commands
   */
  parseCommand(transcript) {
    // Check each word in the transcript
    const words = transcript.split(' ');
    
    for (const word of words) {
      for (const [command, aliases] of Object.entries(this.commands)) {
        if (aliases.includes(word)) {
          return command;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Start listening for voice commands
   */
  start() {
    if (!this.isSupported) {
      this.onStatusChange({ 
        listening: false, 
        error: 'Speech recognition is not supported in this browser. Please use Chrome or Edge.' 
      });
      return false;
    }
    
    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.isListening = false;
      return false;
    }
  }
  
  /**
   * Stop listening for voice commands
   */
  stop() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
    this.onStatusChange({ listening: false, error: null });
  }
  
  /**
   * Toggle listening state
   */
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}
