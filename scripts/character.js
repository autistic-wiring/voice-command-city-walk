/**
 * Character Animation Controller
 * Manages the character's animation states
 */

export class Character {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.currentState = 'idle';
    this.previousState = 'idle'; // Remember state before jump
    this.jumpTimeout = null;
    
    // Position and movement (world coordinates)
    this.worldX = 0; // World position (character is always centered on screen)
    this.speed = 0;
    this.direction = 1; // 1 = right, -1 = left
    this.lastFrameTime = 0;
    
    // Animation speeds (pixels per second)
    this.speeds = {
      idle: 0,
      walk: 100,
      run: 300,
      stop: 0,
      jump: 800, // Fast forward leap - covers ~half screen during 1.2s jump
      wave: 0,
      dance: 0
    };
    
    // Valid animation states
    this.states = ['idle', 'walk', 'run', 'stop', 'jump', 'wave', 'dance'];
    
    // States that automatically return to idle after a duration
    this.temporaryStates = {
      jump: 1200  // Jump animation lasts 1200ms (longer for easier obstacle avoidance)
    };

    // Bind update for requestAnimationFrame
    this.update = this.update.bind(this);
    requestAnimationFrame(this.update);
  }

  /**
   * Game loop for updating position (camera follows character)
   */
  update(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp;
    const deltaTime = (timestamp - this.lastFrameTime) / 1000; // in seconds
    this.lastFrameTime = timestamp;

    // Update world position based on speed
    if (this.speed > 0) {
      this.worldX += this.speed * deltaTime;
    }

    // Move scene elements to create parallax/scrolling effect
    // Character stays centered, background moves left
    const ground = document.querySelector('.ground');
    const clouds = document.querySelector('.clouds');
    
    if (ground) {
      // Ground is 300% wide, so we loop every 100vw (1/3 of ground width)
      // This creates seamless infinite scrolling
      const loopWidth = window.innerWidth;
      const offset = this.worldX % loopWidth;
      ground.style.transform = `translateX(${-offset}px)`;
    }
    
    if (clouds) {
      // Clouds move slower for parallax effect (0.2x speed)
      // Clouds are positioned absolutely so just shift them
      const cloudOffset = this.worldX * 0.2;
      clouds.style.transform = `translateX(${-cloudOffset}px)`;
    }

    requestAnimationFrame(this.update);
  }
  
  /**
   * Set the character's animation state
   */
  setState(newState) {
    // Validate state
    if (!this.states.includes(newState)) {
      console.warn(`Invalid state: ${newState}`);
      return false;
    }
    
    // Clear any pending state timeouts
    if (this.jumpTimeout) {
      clearTimeout(this.jumpTimeout);
      this.jumpTimeout = null;
    }
    
    // Save previous state before changing (for jump to return to)
    if (newState === 'jump' && this.currentState !== 'jump') {
      this.previousState = this.currentState;
      // Keep the speed from the previous state during jump
      this.speed = this.speeds[this.previousState] || 0;
    }
    
    // Remove current state class
    this.element.classList.remove(this.currentState);
    
    // Add new state class
    this.element.classList.add(newState);
    this.currentState = newState;
    
    // Update speed based on new state (unless jumping - keep previous speed)
    if (newState !== 'jump') {
      this.speed = this.speeds[newState] || 0;
    }
    
    console.log(`🎭 Character state: ${newState}, Speed: ${this.speed}`);
    
    // Handle temporary states - return to previous state after jump
    if (this.temporaryStates[newState]) {
      this.jumpTimeout = setTimeout(() => {
        // Return to previous state, not idle
        this.setState(this.previousState);
      }, this.temporaryStates[newState]);
    }
    
    return true;
  }
  
  /**
   * Get current animation state
   */
  getState() {
    return this.currentState;
  }
  
  /**
   * Process a voice command
   */
  processCommand(command) {
    switch (command) {
      case 'walk':
        return this.setState('walk');
      case 'run':
      case 'sprint':
        return this.setState('run');
      case 'stop':
      case 'halt':
        return this.setState('stop');
      case 'jump':
        return this.setState('jump');
      case 'wave':
        return this.setState('wave');
      case 'dance':
        return this.setState('dance');
      default:
        console.warn(`Unknown command: ${command}`);
        return false;
    }
  }
}
