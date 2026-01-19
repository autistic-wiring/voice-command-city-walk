# Voice Command City Walk

An interactive browser-based animation game controlled by voice commands. Watch your character walk, run, jump, and interact with various objects in a dynamic city environment.

## Features

- **Voice Control**: Use your microphone to control the character with voice commands
- **Dynamic World**: Interactive environment with moving objects including:
  - Chasing dog
  - Passing train
  - Flying airplane
  - Waving pedestrians
  - Obstacles to jump over
- **Smooth Animations**: CSS-based character animations for walking, running, jumping, dancing, and tripping
- **Parallax Scrolling**: Multi-layer background with clouds and distant scenery
- **Collision Detection**: Precise foot-to-edge collision system for realistic interactions

## Voice Commands

- **walk** - Character starts walking
- **run** - Character runs faster
- **stop** - Character stops moving
- **jump** - Character jumps (useful for avoiding obstacles)
- **hi / bye** - Character waves
- **dance** - Character performs a dance animation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/autistic-wiring/voice-command-city-walk.git
cd voice-command-city-walk
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local server URL (typically `http://localhost:5173`)

## Technical Details

### Architecture

- **Vanilla JavaScript**: No framework dependencies for lightweight performance
- **Modular Design**: Separate modules for character control, world management, and voice recognition
- **Centralized Spawning System**: Objects spawn and despawn smoothly off-screen
- **Real-time Animation**: Delta-time based animation updates for smooth 60fps performance

### Key Files

- `scripts/main.js` - Game initialization and voice command processing
- `scripts/character.js` - Character state management and animation control
- `scripts/world.js` - World objects, collision detection, and environmental interactions
- `scripts/voice.js` - Voice recognition and command parsing
- `styles/main.css` - All animations and visual styling

### Collision System

The game uses a foot-to-edge collision detection system for realistic interactions:
- Character's right foot position is tracked
- Obstacles check for contact with their left edge
- Collision triggers only when visual contact is made
- Debug logging available for position verification

## Browser Compatibility

- Chrome/Edge (recommended) - Full Web Speech API support
- Firefox - Requires `media.webspeech.recognition.enable` flag
- Safari - Limited support for voice recognition

## Development

### Debug Mode

Access debug commands via browser console:
```javascript
window.game.command("run")  // Inject commands without voice
window.game.debug()         // View current game state
```

### Testing

The project includes Playwright integration for automated testing of collision detection and animations.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
