# Katie Hunt — Frontend Engineer Portfolio

Single-file static portfolio built with HTML, CSS and Vanilla JavaScript. For development this repo now includes a split version:

- `index.html` — main entry (uses `styles.css` and `app.js`)
- `styles.css` — extracted styles
- `app.js` — extracted JavaScript

Open the demo: `index.html` (or keep the original `elite_portfolio.html` if you prefer the single-file version).

## Overview
This repository contains a single HTML file that serves as a personal portfolio. It showcases interactive components and small demos embedded directly in the file, including:

- An "Icy Tower" style canvas game
- Particle background and visual effects
- An animated, interactive terminal and activity grid
- Playground tabs with example code snippets
- Contact form and a theme toggle

## Run locally
1. Open `index.html` in your browser for a quick preview.
2. Recommended: use the included npm dev script to run a local server (this provides a proper static server and live reload via `live-server`).

```powershell
# install dev dependency
npm install

# start the dev server and open index.html
npm start
```

Or use a Python static server if you prefer:

```powershell
python -m http.server 8000
# then visit: http://localhost:8000/index.html
```

## Controls / Interaction
- Game canvas (`id="gameCanvas"`):
  - Move: ← → or A / D
  - Jump: Space / W / ↑
  - Restart: R
- Terminal input (`id="terminalInput"`): supported commands include `help`, `skills`, `contact`, and `clear`.
- Konami-style easter egg: enter the special key sequence defined in the page to reveal a modal.

## Developer notes
Key script entry points and functions are inside the single HTML file. Look for functions and IDs named similarly to:

- Game lifecycle: `resetGame`, `initPlatforms`, `generatePlatform`, `gameLoop`
- Particle system: `animateParticles`
- UI hooks: contact form submission handler, FPS monitor, theme toggle

Tweak gameplay and visual parameters directly in the script to customize difficulty, speeds, and colors.

## Customization
- Colors and theme variables live in the CSS `:root` and `[data-theme="light"]` sections.
- To change game difficulty, adjust platform spawn rates and player physics in the corresponding functions.

## License & Contact
This is a personal portfolio. Contact: katiehunt95@gmail.com (also shown in the page footer).
