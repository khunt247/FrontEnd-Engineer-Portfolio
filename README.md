# Katie Hunt — Frontend Engineer Portfolio

A comprehensive, interactive portfolio website showcasing frontend engineering expertise, built with modern web technologies and featuring an embedded platformer game.

## 🚀 Live Demo
Open `index.html` in your browser to view the portfolio, or serve locally for optimal performance.

## 📁 Project Structure
```
FrontEnd Engineer Portfolio/
├── index.html              # Main portfolio page
├── about.html              # About page with certifications and experience
├── styles.css              # Comprehensive CSS with dark/light themes
├── script.js               # Interactive JavaScript functionality
├── package.json            # Dependencies (Motion.js)
├── images/                  # Project screenshots and assets
│   ├── Project 1/          # Navigation Options Showcase screenshots
│   ├── Project 2/          # HabitTracker screenshots
│   ├── Project 3/          # CodeVault screenshots
│   ├── Project 4/          # FinTech Dashboard screenshots
│   └── about/              # About page images
└── certifications/         # Professional certifications (PDFs)
    ├── AI & ML Certificates
    ├── Python Programming
    ├── Web Development
    ├── DevOps & GitOps
    └── Data Analysis & SQL
```

## 🎯 Features

### Core Portfolio
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Interactive Terminal**: Command-line interface with `help`, `skills`, `contact`, `clear` commands
- **Theme Toggle**: Dark/light mode with localStorage persistence
- **Particle Background**: Animated particle system using Canvas API
- **Performance Monitor**: Real-time FPS and load time display

### Interactive Game Showcase
- **Platformer Game**: Fully playable "Icy Tower" style game built with vanilla JavaScript
- **Game Controls**:
  - Move: ← → or A / D
  - Jump: Space / W / ↑
  - Restart: R
- **Game Statistics**: High score, levels completed, games played tracking
- **Responsive Canvas**: Optimized for different screen sizes

### Project Showcases
1. **Navigation Options Showcase** - 6 modern navigation patterns with glassmorphism effects
2. **HabitTracker** - Personal habit tracking with GSAP animations and analytics
3. **CodeVault** - Secure code repository with client-side encryption and IndexedDB
4. **FinTech Dashboard** - Real-time financial dashboard with TradingView integration

### About Page Features
- **Professional Certifications**: 13+ certificates in AI/ML, Python, Web Development, DevOps
- **Experience Timeline**: Detailed professional background and achievements
- **Education**: Academic credentials and achievements
- **Interactive Gallery**: Project screenshots with modal viewing

## 🛠️ Technologies Used

### Frontend Stack
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Advanced styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No frameworks, pure JS for optimal performance
- **Canvas API** - Game development and particle effects
- **Motion.js** - Smooth animations and transitions

### Development Tools
- **Cursor** - AI-powered code editor
- **Git & GitHub** - Version control and collaboration
- **Responsive Design** - Mobile-first development approach

## 🚀 Getting Started

### Local Development
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "FrontEnd Engineer Portfolio"
   ```

2. **Open directly in browser**:
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

3. **Serve with HTTP server** (recommended for full functionality):
   ```powershell
   # Windows PowerShell
   python -m http.server 8000
   # Visit: http://localhost:8000/index.html
   ```

   ```bash
   # macOS/Linux
   python3 -m http.server 8000
   # Visit: http://localhost:8000/index.html
   ```

### Dependencies
- **Motion.js**: For smooth animations (included in package.json)
- **No build process required** - Pure static website

## 🎮 Interactive Features

### Terminal Commands
- `help` - Show available commands
- `skills` - Display technical skills
- `contact` - Show contact information
- `clear` - Clear terminal history

### Easter Eggs
- **Konami Code**: ↑ ↑ ↓ ↓ ← → ← → B A (try it!)
- **Performance Monitoring**: Real-time FPS and load time display
- **Theme Persistence**: Remembers your theme preference

## 📱 Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Game controls work on mobile devices
- **Cross-browser**: Compatible with modern browsers
- **Accessibility**: Semantic HTML and ARIA labels

## 🎨 Customization

### Theme Variables
Colors and themes are defined in CSS custom properties:
```css
:root {
  --primary-color: #your-color;
  --background: #your-bg;
  /* ... more variables */
}
```

### Game Parameters
Adjust game difficulty in `script.js`:
- Platform spawn rates
- Player physics
- Scoring system
- Visual effects

## 📊 Performance Features
- **Optimized Rendering**: Efficient canvas animations
- **Lazy Loading**: Images load as needed
- **Memory Management**: Proper cleanup of event listeners
- **Smooth Animations**: 60fps target with requestAnimationFrame

## 🔧 Development Notes

### Key Functions
- **Game Engine**: `resetGame()`, `initPlatforms()`, `generatePlatform()`, `gameLoop()`
- **Particle System**: `animateParticles()`, `createParticle()`
- **UI Components**: Theme toggle, modal management, form handling
- **Performance**: FPS monitoring, load time tracking

### File Organization
- **Modular CSS**: Organized by component sections
- **Event-driven JS**: Clean separation of concerns
- **Asset Management**: Optimized image loading and caching

## 📞 Contact & Links
- **Email**: katiehunt95@gmail.com
- **GitHub**: [@khunt247](https://github.com/khunt247)
- **LinkedIn**: [Katie Hunt](https://www.linkedin.com/in/katie-hunt-/)

## 📄 License
This is a personal portfolio project. All rights reserved.

---

**Built with Excellence by Katie Hunt**  
*Frontend Engineer & UI Architect*
