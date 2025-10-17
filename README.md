# Katie Hunt — Frontend Engineer Portfolio

Single-file static portfolio built with HTML, CSS and Vanilla JavaScript. Open the demo: `elite_portfolio draft 4.html`

## Overview
This repository contains a single HTML file that serves as a personal portfolio. It showcases interactive components and small demos embedded directly in the file, including:

- An "Icy Tower" style canvas game
- Particle background and visual effects
- An animated, interactive terminal and activity grid
- Playground tabs with example code snippets
- Contact form and a theme toggle

## Run locally
1. Open `elite_portfolio draft 4.html` in your browser.
2. Or serve the folder with a simple HTTP server for correct relative loading and CORS behavior (recommended):

```powershell
python -m http.server 8000
# then visit: http://localhost:8000/elite_portfolio%20draft%204.html
```

On Windows PowerShell, run the above command from the repository folder (where `elite_portfolio draft 4.html` is located).

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
