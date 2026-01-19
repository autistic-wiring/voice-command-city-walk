/**
 * World Objects Module
 * Manages NPCs and interactive elements in the scene
 */

export class WorldObjects {
  constructor(character) {
    this.character = character;
    this.scene = document.querySelector('.scene');
    this.objects = [];
    this.lastSpawnTime = 0;
    this.spawnInterval = 4000; // Spawn new object every 4 seconds

    // Centralized spawn/despawn system constants
    this.OFFSCREEN_MARGIN = 150; // Pixels off-screen before spawn/despawn
    this.SPAWN_RIGHT = 1;  // Object spawns at right edge (moving left or stationary)
    this.SPAWN_LEFT = -1;  // Object spawns at left edge (moving right)

    // Dog state
    this.dog = null;
    this.dogX = 0;
    this.dogSpeed = 200; // Dog runs at 200px/s (between walk and run)
    this.dogActive = false;
    this.dogCaughtPlayer = false;

    // Waving person state
    this.wavingPerson = null;
    this.wavingPersonX = 0;

    // Stone obstacle state
    this.stone = null;
    this.stoneX = 0;
    this.stoneActive = false;
    this.stoneHit = false;

    // Trip state
    this.isTripped = false;
    this.tripTimeout = null;

    // Airplane state (flies right to left in sky)
    this.airplane = null;
    this.airplaneX = 0;
    this.airplaneSpeed = 250; // pixels per second
    this.airplaneActive = false;
    this.lastAirplaneSpawn = 0;
    this.airplaneSpawnInterval = 15000; // Spawn every 15-25 seconds

    // Train state (goes left to right on tracks)
    this.train = null;
    this.trainX = 0;
    this.trainSpeed = 350; // pixels per second
    this.trainActive = false;
    this.lastTrainSpawn = 0;
    this.trainSpawnInterval = 20000; // Spawn every 20-30 seconds
    
    // Create elements
    this.createDog();
    this.createWavingPerson();
    this.createStone();
    this.createAirplane();
    this.createTrain();
    
    // Start update loop
    this.lastTimestamp = 0;
    this.update = this.update.bind(this);
    requestAnimationFrame(this.update);
  }

  /**
   * Centralized spawn position calculator
   * @param {number} spawnDirection - SPAWN_RIGHT (1) or SPAWN_LEFT (-1)
   * @returns {number} World X position for spawning
   */
  getSpawnPosition(spawnDirection) {
    const playerX = this.character.worldX;
    if (spawnDirection === this.SPAWN_RIGHT) {
      // Spawn off-screen to the right
      return playerX + (window.innerWidth / 2) + this.OFFSCREEN_MARGIN;
    } else {
      // Spawn off-screen to the left
      return playerX - (window.innerWidth / 2) - this.OFFSCREEN_MARGIN;
    }
  }

  /**
   * Check if object is off-screen (should be despawned)
   * @param {number} screenX - Object's screen X position
   * @param {number} objectWidth - Object's width in pixels
   * @returns {boolean} True if completely off-screen
   */
  isOffScreen(screenX, objectWidth = 100) {
    // Check if completely off left or right edge
    return (screenX + objectWidth < -this.OFFSCREEN_MARGIN) ||
           (screenX > window.innerWidth + this.OFFSCREEN_MARGIN);
  }

  /**
   * Create the dog element
   */
  createDog() {
    const dogContainer = document.createElement('div');
    dogContainer.className = 'world-object dog-container';
    dogContainer.innerHTML = `
      <div class="dog">
        <div class="dog-body">
          <div class="dog-head">
            <div class="dog-ear left-ear"></div>
            <div class="dog-ear right-ear"></div>
            <div class="dog-face">
              <div class="dog-eye"></div>
              <div class="dog-nose"></div>
            </div>
          </div>
          <div class="dog-torso"></div>
          <div class="dog-tail"></div>
          <div class="dog-leg front-left"></div>
          <div class="dog-leg front-right"></div>
          <div class="dog-leg back-left"></div>
          <div class="dog-leg back-right"></div>
        </div>
      </div>
    `;
    
    this.scene.appendChild(dogContainer);
    this.dog = dogContainer;
    this.dog.style.display = 'none';
  }
  
  /**
   * Create waving person element
   */
  createWavingPerson() {
    const personContainer = document.createElement('div');
    personContainer.className = 'world-object waving-person-container';
    personContainer.innerHTML = `
      <div class="waving-person">
        <div class="wp-body">
          <div class="wp-head">
            <div class="wp-hair"></div>
            <div class="wp-face">
              <div class="wp-eye"></div>
              <div class="wp-smile"></div>
            </div>
          </div>
          <div class="wp-torso"></div>
          <div class="wp-arm wave-arm"></div>
          <div class="wp-arm still-arm"></div>
          <div class="wp-leg left"></div>
          <div class="wp-leg right"></div>
        </div>
      </div>
    `;
    
    this.scene.appendChild(personContainer);
    this.wavingPerson = personContainer;
    this.wavingPerson.style.display = 'none';
  }
  
  /**
   * Create stone obstacle
   */
  createStone() {
    const stoneContainer = document.createElement('div');
    stoneContainer.className = 'world-object stone-container';
    stoneContainer.innerHTML = `
      <div class="stone">
        <div class="stone-body"></div>
        <div class="stone-shadow"></div>
      </div>
    `;
    
    this.scene.appendChild(stoneContainer);
    this.stone = stoneContainer;
    this.stone.style.display = 'none';
  }
  
  /**
   * Create airplane element
   */
  createAirplane() {
    const airplaneContainer = document.createElement('div');
    airplaneContainer.className = 'sky-object airplane-container';
    airplaneContainer.innerHTML = `
      <div class="airplane">
        <div class="plane-body"></div>
        <div class="plane-wing"></div>
        <div class="plane-tail"></div>
        <div class="plane-windows"></div>
        <div class="plane-trail"></div>
      </div>
    `;
    
    this.scene.appendChild(airplaneContainer);
    this.airplane = airplaneContainer;
    this.airplane.style.display = 'none';
  }
  
  /**
   * Create train element
   */
  createTrain() {
    const trainContainer = document.createElement('div');
    trainContainer.className = 'ground-object train-container';
    trainContainer.innerHTML = `
      <div class="train">
        <div class="train-car car2">
          <div class="car-body"></div>
          <div class="car-wheels"><div class="wheel"></div><div class="wheel"></div></div>
        </div>
        <div class="train-car car1">
          <div class="car-body"></div>
          <div class="car-wheels"><div class="wheel"></div><div class="wheel"></div></div>
        </div>
        <div class="train-engine">
          <div class="engine-body"></div>
          <div class="engine-cabin"></div>
          <div class="engine-chimney"></div>
          <div class="engine-wheels">
            <div class="wheel"></div>
            <div class="wheel"></div>
            <div class="wheel big"></div>
          </div>
        </div>
      </div>
    `;
    
    this.scene.appendChild(trainContainer);
    this.train = trainContainer;
    this.train.style.display = 'none';
  }
  
  /**
   * Spawn airplane (flies right to left)
   */
  spawnAirplane() {
    if (this.airplaneActive) return;

    // Airplane starts off-screen to the right (screen coordinates, not world)
    this.airplaneX = window.innerWidth + this.OFFSCREEN_MARGIN;
    this.airplaneActive = true;
    this.airplane.style.display = 'block';
    this.airplane.classList.add('flying');

    console.log('✈️ Airplane flying overhead!');
  }
  
  /**
   * Hide airplane
   */
  hideAirplane() {
    this.airplaneActive = false;
    this.airplane.style.display = 'none';
    this.airplane.classList.remove('flying');
  }
  
  /**
   * Spawn train (goes left to right)
   */
  spawnTrain() {
    if (this.trainActive) return;
    
    // Train starts off-screen to the left
    this.trainX = -this.OFFSCREEN_MARGIN - 400; // Train is ~400px wide
    this.trainActive = true;
    this.train.style.display = 'block';
    this.train.classList.add('moving');
    
    console.log('🚂 Train coming through!');
  }
  
  /**
   * Hide train
   */
  hideTrain() {
    this.trainActive = false;
    this.train.style.display = 'none';
    this.train.classList.remove('moving');
  }
  
  /**
   * Spawn the dog to chase the player
   */
  spawnDog() {
    if (this.dogActive) return;
    
    // Dog starts off-screen to the left (visible screen edge)
    this.dogX = this.getSpawnPosition(this.SPAWN_LEFT);
    this.dogActive = true;
    this.dogCaughtPlayer = false;
    this.dog.style.display = 'block';
    this.dog.classList.add('running');
    
    console.log('🐕 Dog is chasing from the left!');
  }
  
  /**
   * Hide the dog
   */
  hideDog() {
    this.dogActive = false;
    this.dog.style.display = 'none';
    this.dog.classList.remove('running', 'caught');
  }
  
  /**
   * Spawn waving person ahead of player
   */
  spawnWavingPerson() {
    this.wavingPersonX = this.getSpawnPosition(this.SPAWN_RIGHT);
    this.wavingPerson.style.display = 'block';
    this.wavingPerson.classList.add('waving');
    
    console.log('👋 Someone is waving!');
  }
  
  /**
   * Hide waving person
   */
  hideWavingPerson() {
    this.wavingPerson.style.display = 'none';
    this.wavingPerson.classList.remove('waving');
  }
  
  /**
   * Spawn stone obstacle ahead
   */
  spawnStone() {
    if (this.stoneActive) return;
    
    this.stoneX = this.getSpawnPosition(this.SPAWN_RIGHT);
    this.stoneActive = true;
    this.stoneHit = false;
    this.stone.style.display = 'block';
    
    console.log('🪨 Stone ahead! Jump!');
    this.showFeedback('Stone ahead! JUMP!', 'warning');
  }
  
  /**
   * Hide stone
   */
  hideStone() {
    this.stoneActive = false;
    this.stone.style.display = 'none';
  }
  
  /**
   * Trip the player
   */
  tripPlayer() {
    if (this.isTripped) return;
    
    this.isTripped = true;
    const charElement = document.getElementById('character');
    
    // Save current state to restore later
    const savedState = this.character.currentState;
    
    // Add tripped class for animation
    charElement.classList.add('tripped');
    this.character.speed = 0;
    
    console.log('💥 Tripped on the stone!');
    this.showFeedback('OUCH! Tripped!', 'danger');
    
    // Recover after 1.5 seconds
    this.tripTimeout = setTimeout(() => {
      charElement.classList.remove('tripped');
      this.isTripped = false;
      this.hideFeedback();
      
      // Resume previous action
      this.character.setState(savedState);
      console.log(`🏃 Resuming ${savedState}`);
    }, 1500);
  }
  
  /**
   * Update loop
   */
  update(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    const state = this.character.getState();
    const playerX = this.character.worldX;
    const playerSpeed = this.character.speed;
    const isJumping = state === 'jump';
    
    // Random spawning
    if (timestamp - this.lastSpawnTime > this.spawnInterval) {
      this.lastSpawnTime = timestamp;
      
      const rand = Math.random();
      if (rand < 0.25 && !this.dogActive) {
        this.spawnDog();
      } else if (rand < 0.5 && this.wavingPerson.style.display === 'none') {
        this.spawnWavingPerson();
      } else if (rand < 0.75 && !this.stoneActive) {
        this.spawnStone();
      }
    }
    
    // Update dog position
    if (this.dogActive) {
      this.dogX += this.dogSpeed * deltaTime;
      
      const dogScreenX = this.dogX - playerX + (window.innerWidth / 2) - 100;
      this.dog.style.transform = `translateX(${dogScreenX}px)`;
      
      if (this.dogX >= playerX - 50 && !this.dogCaughtPlayer) {
        if (playerSpeed < this.dogSpeed) {
          this.dogCaughtPlayer = true;
          this.dog.classList.remove('running');
          this.dog.classList.add('caught');
          console.log('🐕 Dog caught you! Run faster!');
          this.showFeedback('Dog caught you! Say "RUN"!', 'danger');
        }
      }
      
      // Despawn dog when completely off-screen to the right
      if (this.isOffScreen(dogScreenX, 100)) {
        console.log('🐕 Dog gave up!');
        this.hideDog();
      }
      
      if (this.dogCaughtPlayer && playerSpeed > this.dogSpeed) {
        this.dogCaughtPlayer = false;
        this.dog.classList.remove('caught');
        this.dog.classList.add('running');
        this.hideFeedback();
      }
    }
    
    // Update waving person position
    if (this.wavingPerson.style.display !== 'none') {
      const personScreenX = this.wavingPersonX - playerX + (window.innerWidth / 2);
      this.wavingPerson.style.transform = `translateX(${personScreenX}px)`;
      
      // Hide when scrolled off left side of screen
      if (this.isOffScreen(personScreenX, 100)) {
        this.hideWavingPerson();
      }
    }
    
    // Update stone position and check collision
    if (this.stoneActive) {
      const stoneScreenX = this.stoneX - playerX + (window.innerWidth / 2);
      this.stone.style.transform = `translateX(${stoneScreenX}px)`;

      // Character walks left to right, so we need to check when character's RIGHT FOOT hits stone's LEFT EDGE
      const charElement = document.getElementById('character');
      const charRect = charElement.getBoundingClientRect();
      const charRightFoot = charRect.right; // Right edge of character (where foot is)
      const stoneLeftEdge = stoneScreenX; // Left edge of stone

      // Collision triggers when character's foot reaches the stone
      // Only trigger when foot actually touches (footToStone <= 0)
      const footToStone = stoneLeftEdge - charRightFoot; // Distance from foot to stone
      if (footToStone <= 0 && footToStone > -25 && !this.stoneHit) {
        if (isJumping) {
          // Successfully jumped over!
          console.log('✅ Jumped over the stone!');
          this.stoneHit = true;
        } else if (!this.isTripped) {
          // Hit the stone - trip!
          // DEBUG: Log actual graphic positions at collision moment
          console.log('💥 COLLISION - Graphics Position Debug:');
          console.log(`  Character RIGHT FOOT: ${charRightFoot.toFixed(1)}px`);
          console.log(`  Stone LEFT EDGE: ${stoneLeftEdge.toFixed(1)}px`);
          console.log(`  Distance (foot to stone): ${footToStone.toFixed(1)}px (threshold: -25 to 0)`);
          console.log(`  Character: left=${charRect.left.toFixed(1)}px, right=${charRect.right.toFixed(1)}px`);
          console.log(`  Stone: left=${stoneScreenX.toFixed(1)}px, right=${(stoneScreenX + 60).toFixed(1)}px`);

          this.stoneHit = true;
          this.tripPlayer();
        }
      }
      
      // Remove stone after passing (when it's off-screen left)
      if (this.isOffScreen(stoneScreenX, 60)) {
        this.hideStone();
      }
    }
    
    // Spawn airplane randomly (max 1 at a time)
    if (!this.airplaneActive && timestamp - this.lastAirplaneSpawn > this.airplaneSpawnInterval + Math.random() * 10000) {
      this.lastAirplaneSpawn = timestamp;
      if (Math.random() < 0.4) {
        this.spawnAirplane();
      }
    }
    
    // Update airplane position (flies right to left)
    if (this.airplaneActive) {
      this.airplaneX -= this.airplaneSpeed * deltaTime;
      this.airplane.style.transform = `translateX(${this.airplaneX}px)`;
      
      // Hide when off-screen to the left
      if (this.isOffScreen(this.airplaneX, 200)) {
        this.hideAirplane();
      }
    }
    
    // Spawn train randomly (max 1 at a time)
    if (!this.trainActive && timestamp - this.lastTrainSpawn > this.trainSpawnInterval + Math.random() * 10000) {
      this.lastTrainSpawn = timestamp;
      if (Math.random() < 0.3) {
        this.spawnTrain();
      }
    }
    
    // Update train position (goes left to right)
    if (this.trainActive) {
      this.trainX += this.trainSpeed * deltaTime;
      this.train.style.transform = `translateX(${this.trainX}px)`;
      
      // Hide when off-screen to the right
      if (this.isOffScreen(this.trainX, 400)) {
        this.hideTrain();
      }
    }
    
    requestAnimationFrame(this.update);
  }
  
  /**
   * Show feedback message
   */
  showFeedback(message, type = 'info') {
    const feedback = document.getElementById('commandFeedback');
    const text = document.getElementById('feedbackText');
    if (feedback && text) {
      text.textContent = message;
      feedback.classList.add('visible');
      
      if (type === 'danger') {
        feedback.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
      } else if (type === 'warning') {
        feedback.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
      } else {
        feedback.style.background = '';
      }
    }
  }
  
  /**
   * Hide feedback message
   */
  hideFeedback() {
    const feedback = document.getElementById('commandFeedback');
    if (feedback) {
      feedback.classList.remove('visible');
      feedback.style.background = '';
    }
  }
}
