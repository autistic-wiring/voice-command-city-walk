# 🎮 Voice Command City Walk

<p align="center">
  <strong>AN INTERACTIVE VOICE-CONTROLLED BROWSER GAME</strong>
</p>

<p align="center">
  <a href="https://github.com/autistic-wiring/voice-command-city-walk/actions"><img src="https://img.shields.io/github/actions/workflow/status/autistic-wiring/voice-command-city-walk/deploy.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://autistic-wiring.github.io/voice-command-city-walk/"><img src="https://img.shields.io/badge/Live%20Demo-Play%20Now-green?style=for-the-badge&logo=github" alt="Live Demo"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
  <a href="https://autistic-wiring.github.io/aac-system/donate.html"><img src="https://img.shields.io/badge/Support-Buy%20Me%20A%20Coffee-orange?style=for-the-badge&logo=buy-me-a-coffee" alt="Buy Me A Coffee"></a>
</p>

**Voice Command City Walk** is an interactive browser-based animation game controlled entirely by voice commands. Watch your character walk, run, jump, and interact with various objects in a dynamic city environment — no keyboard or mouse required!

Built for accessibility and fun, this game demonstrates the power of voice control in web applications.

[GitHub](https://github.com/autistic-wiring/voice-command-city-walk) · [Live Demo](https://autistic-wiring.github.io/voice-command-city-walk/) · [Support Us](https://autistic-wiring.github.io/aac-system/donate.html)

---

## 🎤 Voice Commands

| Command | Action |
|---------|--------|
| **walk** | Character starts walking |
| **run** | Character runs faster |
| **stop** | Character stops moving |
| **jump** | Character jumps (avoid obstacles!) |
| **hi / bye** | Character waves at pedestrians |
| **dance** | Character performs a dance animation |

---

## ✨ Features

- **🎙️ Voice Control** — Use your microphone to control the character with natural voice commands
- **🌍 Dynamic World** — Interactive environment with moving objects:
  - 🐕 Chasing dog
  - 🚂 Passing train
  - ✈️ Flying airplane
  - 👋 Waving pedestrians
  - 🚧 Obstacles to jump over
- **🎨 Smooth Animations** — CSS-based character animations for walking, running, jumping, dancing, and tripping
- **☁️ Parallax Scrolling** — Multi-layer background with clouds and distant scenery
- **🎯 Collision Detection** — Precise foot-to-edge collision system for realistic interactions

---

## 🚀 Quick Start

### Play Online
Visit the **[Live Demo](https://autistic-wiring.github.io/voice-command-city-walk/)** — no installation required!

### Local Development

**Runtime:** Node ≥18

```bash
git clone https://github.com/autistic-wiring/voice-command-city-walk.git
cd voice-command-city-walk

npm install

npm run dev
```

Open your browser to `http://localhost:5173`

---

## 🏗️ Technical Details

### Architecture

- **Vanilla JavaScript** — No framework dependencies for lightweight performance
- **Modular Design** — Separate modules for character control, world management, and voice recognition
- **Centralized Spawning System** — Objects spawn and despawn smoothly off-screen
- **Real-time Animation** — Delta-time based animation updates for smooth 60fps performance

### Key Files

| File | Purpose |
|------|---------|
| `scripts/main.js` | Game initialization and voice command processing |
| `scripts/character.js` | Character state management and animation control |
| `scripts/world.js` | World objects, collision detection, and environmental interactions |
| `scripts/voice.js` | Voice recognition and command parsing |
| `styles/main.css` | All animations and visual styling |

### Collision System

The game uses a foot-to-edge collision detection system for realistic interactions:
- Character's right foot position is tracked
- Obstacles check for contact with their left edge
- Collision triggers only when visual contact is made
- Debug logging available for position verification

---

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full Web Speech API support (recommended) |
| Firefox | ⚠️ Requires `media.webspeech.recognition.enable` flag |
| Safari | ⚠️ Limited support for voice recognition |

---

## 🛠️ Development

### Debug Mode

Access debug commands via browser console:

```javascript
window.game.command("run")  // Inject commands without voice
window.game.debug()         // View current game state
```

### Testing

The project includes Playwright integration for automated testing of collision detection and animations.

---

## ❤️ Support Us

This project is part of the **Autistic Wiring** initiative, dedicated to creating free, accessible tools and games for the autistic community.

If you'd like to support ongoing development:

<p align="center">
  <a href="https://autistic-wiring.github.io/aac-system/donate.html" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;">
  </a>
  <a href="https://autistic-wiring.github.io/aac-system/donate.html" target="_blank">
    <img src="https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate with PayPal" style="height: 60px !important;width: 217px !important;">
  </a>
</p>

---

## 📄 License

MIT — Contributions are welcome! Please feel free to submit a Pull Request.
