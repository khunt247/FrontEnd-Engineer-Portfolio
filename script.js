// ========== GAME SHOWCASE INTERACTIVE FEATURES ==========

// Game Statistics
let gameStats = {
    highScore: 0,
    levelsCompleted: 0,
    gamesPlayed: 0,
    currentStreak: 0
};

// Load stats from localStorage
function loadGameStats() {
    const saved = localStorage.getItem('jumpGameStats');
    if (saved) {
        gameStats = { ...gameStats, ...JSON.parse(saved) };
    }
    updateStatsDisplay();
}

// Save stats to localStorage
function saveGameStats() {
    localStorage.setItem('jumpGameStats', JSON.stringify(gameStats));
}

// Update statistics display
function updateStatsDisplay() {
    const elements = {
        highScoreDisplay: gameStats.highScore,
        levelsCompleted: gameStats.levelsCompleted,
        gamesPlayed: gameStats.gamesPlayed,
        currentStreak: gameStats.currentStreak
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
}



// Initialize all interactive features
function initGameShowcase() {
    loadGameStats();
}

// ========== ICY TOWER GAME ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Game State
let gameState = 'start'; // start, playing, gameOver, levelComplete, levelTransition
let score = 0;
let highScore = 0;
let combo = 0;
let floor = 0;
let cameraY = 0;

// Level System
let currentLevel = 1;
let maxLevel = 3;
let levelProgress = 0;
let levelCompleteThreshold = 1000;
let levelMultiplier = 1;
let topPlatformY = 0; // Track the highest platform Y-coordinate
let targetTopPlatformY = 0; // Fixed target for level completion
let maxPlatformsPerLevel = 20; // Maximum platforms to generate per level
let platformCount = 0; // Track number of platforms generated
let levelCompleteTriggered = false; // Flag to ensure level completion triggers only once

// Player
const player = {
    x: 200,
    y: 500,
    width: 30,
    height: 40,
    vx: 0,
    vy: 0,
    speed: 5,
    jumpPower: 15,
    gravity: 0.6,
    onGround: false,
    color: '#00d4ff'
};

// Platforms
let platforms = [];
const platformHeight = 15;
let lastPlatformY = canvas ? canvas.height - 50 : 0;

// Controls
const keys = {};

// Level Configurations
const levelConfigs = {
    1: {
        name: "The Beginning",
        minGap: 60,
        maxGap: 100,
        minWidth: 80,
        maxWidth: 200,
        color: '#7b2ff7',
        multiplier: 1
    },
    2: {
        name: "Rising Challenge", 
        minGap: 80,
        maxGap: 120,
        minWidth: 60,
        maxWidth: 150,
        color: '#ff006e',
        multiplier: 1.5
    },
    3: {
        name: "Expert Heights",
        minGap: 100,
        maxGap: 150,
        minWidth: 50,
        maxWidth: 120,
        color: '#00d4ff',
        multiplier: 2
    }
};

// Initialize platforms
function initPlatforms() {
    platforms = [];
    lastPlatformY = canvas.height - 50;
    topPlatformY = canvas.height - 50; // Initialize with starting platform
    platformCount = 0; // Reset platform count
    
    // Starting platform
    platforms.push({
        x: 0,
        y: canvas.height - 50,
        width: canvas.width,
        height: platformHeight,
        color: '#7b2ff7'
    });

    // Generate initial platforms
    for (let i = 0; i < maxPlatformsPerLevel; i++) {
        generatePlatform();
    }
    
    // Set the fixed target for level completion (the topmost platform)
    targetTopPlatformY = topPlatformY;
}

// Generate new platform
function generatePlatform() {
    const config = levelConfigs[currentLevel];
    const minGap = config.minGap + Math.floor(score / 500) * 5;
    const maxGap = config.maxGap + Math.floor(score / 500) * 8;
    const gap = Math.random() * (maxGap - minGap) + minGap;
    
    lastPlatformY -= gap;
    
    const width = Math.random() * (config.maxWidth - config.minWidth) + config.minWidth;
    const x = Math.random() * (canvas.width - width);
    
    const newPlatform = {
        x: x,
        y: lastPlatformY,
        width: width,
        height: platformHeight,
        color: config.color
    };
    
    platforms.push(newPlatform);
    platformCount++;
    
    // Update top platform tracking
    if (lastPlatformY < topPlatformY) {
        topPlatformY = lastPlatformY;
    }
}

// Reset game
function resetGame() {
    player.x = 200;
    player.y = 500;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    score = 0;
    combo = 0;
    floor = 0;
    cameraY = 0;
    currentLevel = 1;
    levelProgress = 0;
    levelCompleteThreshold = 1000;
    levelMultiplier = 1;
    topPlatformY = canvas.height - 50; // Reset top platform tracking
    platformCount = 0; // Reset platform count
    levelCompleteTriggered = false; // Reset level completion flag
    gameState = 'playing';
    initPlatforms();

    // Track game start
    gameStats.gamesPlayed++;
    gameStats.currentStreak++;
    saveGameStats();
    updateStatsDisplay();
}

// Check level completion
function checkLevelComplete() {
    // Only check if we haven't already triggered level completion
    if (levelCompleteTriggered) return;

    // Check if player reached the top platform
    if (gameState === 'playing' && currentLevel < maxLevel) {
        // Find the actual top platform (excluding the starting platform at the bottom)
        const topPlatform = platforms.reduce((highest, platform) => {
            // Exclude the starting platform (the wide one at the bottom)
            if (platform.width === canvas.width) return highest;
            return platform.y < highest.y ? platform : highest;
        }, platforms[1] || platforms[0]);

        // Player must be STANDING ON the top platform (landed on it)
        // Check if player's bottom is touching the platform's top
        const isOnTopPlatform = player.onGround &&
                                Math.abs(player.y + player.height - topPlatform.y) < 5 &&
                                player.x + player.width > topPlatform.x &&
                                player.x < topPlatform.x + topPlatform.width;

        if (isOnTopPlatform) {
            gameState = 'levelComplete';
            levelProgress = 100;
            levelCompleteTriggered = true;
        }
    }
}

// Advance to next level
function advanceLevel() {
    if (currentLevel < maxLevel) {
        currentLevel++;
        levelProgress = 0;
        levelCompleteThreshold = currentLevel * 1000;
        levelMultiplier = levelConfigs[currentLevel].multiplier;
        gameState = 'levelTransition';
        levelCompleteTriggered = false; // Reset the flag for the new level

        // Track level completion
        gameStats.levelsCompleted = Math.max(gameStats.levelsCompleted, currentLevel - 1);
        saveGameStats();
        updateStatsDisplay();

        // Reset player position and physics for new level
        player.x = 200;
        player.y = 500;
        player.vx = 0;
        player.vy = 0;
        player.onGround = false;
        floor = 0;
        cameraY = 0;
        combo = 0;
        score = 0; // Reset score for new level
        topPlatformY = canvas.height - 50; // Reset top platform tracking
        platformCount = 0; // Reset platform count

        // Reset platforms for new level
        initPlatforms();

        // Brief transition before continuing
        setTimeout(() => {
            gameState = 'playing';
        }, 2000);
    } else {
        // Game completed
        gameState = 'gameComplete';
        gameStats.levelsCompleted = Math.max(gameStats.levelsCompleted, currentLevel);
        saveGameStats();
        updateStatsDisplay();
    }
}

// Update game
function update() {
    if (gameState !== 'playing') return;

    // Player movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.vx = -player.speed;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.vx = player.speed;
    } else {
        player.vx *= 0.8; // Friction
    }

    // Jumping
    if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && player.onGround) {
        player.vy = -player.jumpPower;
        player.onGround = false;
    }

    // Apply physics
    player.x += player.vx;
    player.y += player.vy;
    player.vy += player.gravity;

    // Wrap around screen horizontally
    if (player.x + player.width < 0) {
        player.x = canvas.width;
    } else if (player.x > canvas.width) {
        player.x = -player.width;
    }

    // Camera follow
    if (player.y < canvas.height / 2) {
        const diff = canvas.height / 2 - player.y;
        cameraY += diff * 0.1;
        player.y += diff * 0.1;
        
        // Move platforms down
        platforms.forEach(platform => {
            platform.y += diff * 0.1;
        });
        
        // Update score based on height
        const newFloor = Math.floor(-cameraY / 50);
        if (newFloor > floor) {
            const floorsDiff = newFloor - floor;
            score += floorsDiff * 10 * (combo + 1) * levelMultiplier;
            floor = newFloor;

            // Update level progress based on height (how close to top platform)
            // Find the current top platform
            if (platforms.length > 0) {
                const currentTopPlatform = platforms.reduce((highest, platform) => {
                    return platform.y < highest.y ? platform : highest;
                }, platforms[0]);

                const totalHeight = canvas.height - 50 - currentTopPlatform.y;
                const currentHeight = canvas.height - 50 - player.y;
                levelProgress = Math.min(Math.max((currentHeight / totalHeight) * 100, 0), 100);
            }
        }
    }

    // Platform collision
    player.onGround = false;
    platforms.forEach(platform => {
        if (player.vy > 0 &&
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height + 10 &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
            
            player.y = platform.y - player.height;
            player.vy = 0;
            player.onGround = true;
            
            // Combo system with level multiplier
            if (platform !== platforms[0]) { // Not the ground
                combo++;
                score += combo * 5 * levelMultiplier;
            }
        }
    });

    // Reset combo if on ground
    if (player.onGround && platforms[0] && 
        player.y + player.height >= platforms[0].y) {
        combo = 0;
    }

    // Check level completion
    checkLevelComplete();

    // Game over if fell off screen
    if (player.y > canvas.height + 100) {
        gameState = 'gameOver';
        if (score > highScore) {
            highScore = score;
        }
        
        // Track high score and reset streak
        if (score > gameStats.highScore) {
            gameStats.highScore = score;
        }
        gameStats.currentStreak = 0;
        saveGameStats();
        updateStatsDisplay();
    }

    // Generate new platforms only if we haven't reached the limit
    if (platforms[platforms.length - 1].y > 0 && platformCount < maxPlatformsPerLevel) {
        generatePlatform();
    }

    // Remove off-screen platforms
    platforms = platforms.filter(platform => platform.y < canvas.height + 100);
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw start screen
    if (gameState === 'start') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('JUMP', canvas.width / 2, 150);
        
        ctx.font = '18px Inter';
        ctx.fillStyle = '#a0aec0';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, 250);
        
        ctx.fillText('← → or A D to Move', canvas.width / 2, 300);
        ctx.fillText('SPACE or W or ↑ to Jump', canvas.width / 2, 330);
        ctx.fillText('R to Restart', canvas.width / 2, 360);
        
        if (highScore > 0) {
            ctx.font = 'bold 24px Inter';
            ctx.fillStyle = '#00d4ff';
            ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 450);
        }
        return;
    }

    // Draw level complete screen
    if (gameState === 'levelComplete') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#27c93f';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, 200);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Inter';
        ctx.fillText(`Level ${currentLevel} Complete`, canvas.width / 2, 270);
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 310);
        
        ctx.fillStyle = '#a0aec0';
        ctx.font = '18px Inter';
        ctx.fillText('Press SPACE to Continue', canvas.width / 2, 380);
        return;
    }

    // Draw level transition screen
    if (gameState === 'levelTransition') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const config = levelConfigs[currentLevel];
        ctx.fillStyle = config.color;
        ctx.font = 'bold 36px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${currentLevel}`, canvas.width / 2, 200);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Inter';
        ctx.fillText(config.name, canvas.width / 2, 250);
        
        ctx.fillStyle = '#a0aec0';
        ctx.font = '18px Inter';
        ctx.fillText('Get Ready...', canvas.width / 2, 300);
        return;
    }

    // Draw game complete screen
    if (gameState === 'gameComplete') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('GAME COMPLETE!', canvas.width / 2, 200);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Inter';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, 270);
        ctx.fillText('Congratulations!', canvas.width / 2, 310);
        
        ctx.fillStyle = '#a0aec0';
        ctx.font = '18px Inter';
        ctx.fillText('Press R to Play Again', canvas.width / 2, 380);
        return;
    }

    // Draw game over screen
    if (gameState === 'gameOver') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff006e';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 200);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Inter';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 270);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 310);
        
        ctx.fillStyle = '#a0aec0';
        ctx.font = '18px Inter';
        ctx.fillText('Press R to Restart', canvas.width / 2, 380);
        return;
    }

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Platform shine effect
        const gradient = ctx.createLinearGradient(platform.x, platform.y, 
            platform.x, platform.y + platform.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Floor: ${floor}`, 20, 70);
    
    if (combo > 0) {
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 28px Inter';
        ctx.fillText(`Combo x${combo}!`, 20, 105);
    }
    
    // Level UI
    const config = levelConfigs[currentLevel];
    ctx.fillStyle = config.color;
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`Level ${currentLevel}: ${config.name}`, canvas.width - 20, 40);
    
    // Level progress bar
    const progressWidth = 200;
    const progressHeight = 8;
    const progressX = canvas.width - progressWidth - 20;
    const progressY = 60;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
    
    ctx.fillStyle = config.color;
    ctx.fillRect(progressX, progressY, (levelProgress / 100) * progressWidth, progressHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(levelProgress)}%`, canvas.width - 20, progressY + 20);
    
    ctx.fillStyle = '#a0aec0';
    ctx.font = '16px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(`High: ${highScore}`, canvas.width - 20, 100);
}

// Game loop
function gameLoop() {
    if (!canvas || !ctx) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Start game
    if (gameState === 'start' && e.key === ' ') {
        resetGame();
    }
    
    // Level complete - continue to next level
    if (gameState === 'levelComplete' && e.key === ' ') {
        advanceLevel();
    }
    
    // Restart game
    if (gameState === 'gameOver' && (e.key === 'r' || e.key === 'R')) {
        resetGame();
    }
    
    // Game complete - restart
    if (gameState === 'gameComplete' && (e.key === 'r' || e.key === 'R')) {
        resetGame();
    }
    
    // Prevent scrolling ONLY when not in input fields
    if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        // Check if user is typing in an input/textarea
        const activeElement = document.activeElement;
        const isTyping = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA';
        
        if (!isTyping) {
        e.preventDefault();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize and start game loop
if (canvas && ctx) {
    initPlatforms();
    gameLoop();
}

// Initialize game showcase features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGameShowcase();
    initEmailModal();
    initProjects();
});

// ========== EMAIL MODAL ==========
function initEmailModal() {
    const emailModal = document.getElementById('emailModal');
    const emailModalBackdrop = document.getElementById('emailModalBackdrop');
    const emailModalClose = document.getElementById('emailModalClose');
    const emailModalTriggers = document.querySelectorAll('.email-modal-trigger');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copySuccess = document.getElementById('copySuccess');
    const emailDisplay = document.getElementById('emailDisplay');

    // Open modal when clicking @ buttons
    emailModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openEmailModal();
        });
    });

    // Close modal when clicking close button - button needs stopPropagation only
    if (emailModalClose) {
        emailModalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeEmailModal();
        });
    }

    // Close modal when clicking backdrop element
    if (emailModalBackdrop) {
        emailModalBackdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            closeEmailModal();
        });
    }

    // Close modal when clicking the modal container itself (not content)
    if (emailModal) {
        emailModal.addEventListener('click', (e) => {
            if (e.target === emailModal) {
                closeEmailModal();
            }
        });
    }

    // Close modal with Escape key
    const handleEmailEscape = (e) => {
        if (e.key === 'Escape' && emailModal.classList.contains('active')) {
            e.preventDefault();
            closeEmailModal();
        }
    };
    document.addEventListener('keydown', handleEmailEscape);

    // Copy email to clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
        try {
            const email = emailDisplay.textContent;
            await navigator.clipboard.writeText(email);
            
            // Show success feedback
            copySuccess.classList.add('show');
            
            // Close modal immediately after copy (as requested)
            setTimeout(() => {
                closeEmailModal();
            }, 100);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = emailDisplay.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            copySuccess.classList.add('show');
            
            // Close modal immediately after copy
            setTimeout(() => {
                closeEmailModal();
            }, 100);
        }
        });
    }

    function openEmailModal() {
        emailModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        copySuccess.classList.remove('show'); // Reset success message
    }

    function closeEmailModal() {
        emailModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        copySuccess.classList.remove('show'); // Reset success message
    }
}

// ========== END ICY TOWER GAME ==========

// Particle System
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
    }

    draw() {
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Theme-aware particle colors - darker for light theme for visibility
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        particleCtx.fillStyle = isDarkTheme 
            ? 'rgba(0, 212, 255, 0.3)' 
            : 'rgba(30, 58, 138, 0.4)'; // Darker navy blue for light theme
        particleCtx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Connect nearby particles
    // Theme-aware line colors
    const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                particleCtx.beginPath();
                particleCtx.moveTo(particles[i].x, particles[i].y);
                particleCtx.lineTo(particles[j].x, particles[j].y);
                const baseOpacity = isDarkTheme ? 0.2 : 0.25;
                particleCtx.strokeStyle = isDarkTheme 
                    ? `rgba(0, 212, 255, ${baseOpacity * (1 - distance / 120)})`
                    : `rgba(30, 58, 138, ${baseOpacity * (1 - distance / 120)})`; // Darker navy for light theme
                particleCtx.lineWidth = isDarkTheme ? 1 : 1.5;
                particleCtx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    resizeParticleCanvas();
});

// Playground Tab Switching - Simplified for single game tab
const playgroundTabs = document.querySelectorAll('.playground-tab');
const playgroundContents = document.querySelectorAll('.playground-content');

// Since there's only one tab now, we can simplify or remove this logic
playgroundTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        playgroundTabs.forEach(t => t.classList.remove('active'));
        playgroundContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding content
        const content = document.getElementById(`${tabName}-content`);
        if (content) {
            content.classList.add('active');
        }
    });
});

// Enhanced Theme Toggle with System Detection
const themeToggle = document.getElementById('themeToggle');
const bodyEl = document.body;
let isDark = true;

// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    isDark = savedTheme === 'dark';
} else {
    isDark = prefersDark;
}

// Apply initial theme
bodyEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!savedTheme) {
        isDark = e.matches;
        bodyEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
    }
});

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    bodyEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        margin-left: -10px;
        margin-top: -10px;
    `;
    
    themeToggle.style.position = 'relative';
    themeToggle.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('nav-scroll');
    } else {
        navbar.classList.remove('nav-scroll');
    }
});

// Enhanced Scroll Animations
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (target === 100 ? '%' : '+');
        }
    };

    updateCounter();
};

// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Counter animation for hero stats
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            
            // Add animation classes for scroll-triggered elements
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const elementsToAnimate = document.querySelectorAll('.hero-stats, .skill-card, .project-card, .section-title, .section-subtitle, .quote-card');
elementsToAnimate.forEach(element => {
    observer.observe(element);
});

// Add CSS classes for scroll animations
const style = document.createElement('style');
style.textContent = `
    .skill-card, .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .skill-card.animate-in, .project-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-card:nth-child(1) { transition-delay: 0.1s; }
    .skill-card:nth-child(2) { transition-delay: 0.2s; }
    .skill-card:nth-child(3) { transition-delay: 0.3s; }
    .skill-card:nth-child(4) { transition-delay: 0.4s; }
    .skill-card:nth-child(5) { transition-delay: 0.5s; }
    .skill-card:nth-child(6) { transition-delay: 0.6s; }
`;
document.head.appendChild(style);

// GitHub Activity Grid
const activityGrid = document.getElementById('activityGrid');
if (activityGrid) {
    for (let i = 0; i < 365; i++) {
        const cell = document.createElement('div');
        cell.className = 'activity-cell';
        const level = Math.floor(Math.random() * 5);
        if (level > 0) cell.classList.add(`level-${level}`);
        cell.title = `${Math.floor(Math.random() * 10)} contributions`;
        activityGrid.appendChild(cell);
    }
}

// Interactive Terminal
const terminalInput = document.getElementById('terminalInput');
if (terminalInput) {
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.toLowerCase();
            const terminalContent = document.querySelector('.terminal-content');

            let response = '';
            if (command === 'help') {
                response = '\n$ Available commands: help, skills, contact, clear';
            } else if (command === 'skills') {
                response = '\n$ Skills: React, TypeScript, Next.js, Node.js, CSS3';
            } else if (command === 'contact') {
                response = '\n$ Email: katiehunt95@gmail.com';
            } else if (command === 'clear') {
                terminalContent.innerHTML = '';
                terminalInput.value = '';
                return;
            } else {
                response = `\n$ Command not found: ${command}. Type 'help' for commands.`;
            }

            const newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.style.opacity = '1';
            newLine.textContent = response;
            terminalContent.appendChild(newLine);
            terminalInput.value = '';

            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    });
}


// Performance Monitor
let lastTime = performance.now();
let frames = 0;

function updateFPS() {
    frames++;
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
        document.getElementById('fps').textContent = frames;
        frames = 0;
        lastTime = currentTime;
    }
    requestAnimationFrame(updateFPS);
}

updateFPS();

window.addEventListener('load', () => {
    const loadTime = performance.now();
    document.getElementById('loadTime').textContent = Math.round(loadTime);
});

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.getElementById('easterEgg').classList.add('active');
            document.getElementById('modalBackdrop').classList.add('active');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function closeEasterEgg() {
    const easterEgg = document.getElementById('easterEgg');
    const backdrop = document.getElementById('modalBackdrop');
    easterEgg.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Initialize Easter Egg Modal listeners
function initEasterEggModal() {
    const easterEgg = document.getElementById('easterEgg');
    const easterEggBackdrop = document.getElementById('modalBackdrop');

    if (!easterEgg || !easterEggBackdrop) return;

    // Backdrop click
    easterEggBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeEasterEgg();
    });

    // Close modal when clicking outside the easter egg content
    easterEgg.addEventListener('click', (e) => {
        if (e.target === easterEgg) {
            closeEasterEgg();
        }
    });

    // Add Escape key handler for Easter Egg modal
    const handleEasterEggEscape = (e) => {
        if (e.key === 'Escape' && easterEgg.classList.contains('active')) {
            e.preventDefault();
            closeEasterEgg();
        }
    };
    document.addEventListener('keydown', handleEasterEggEscape);
}

// Initialize Easter Egg modal
initEasterEggModal();

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== PROJECT CARDS FUNCTIONALITY ==========

// Initialize project cards functionality
function initProjectCards() {
    // Handle expand/collapse for project details
    const expandButtons = document.querySelectorAll('.expand-details-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-card');
            const detailsSection = projectCard.querySelector('.project-details-expanded');
            const isActive = detailsSection.classList.contains('active');
            
            // Close all other expanded sections
            document.querySelectorAll('.project-details-expanded.active').forEach(section => {
                section.classList.remove('active');
            });
            
            // Toggle current section
            if (!isActive) {
                detailsSection.classList.add('active');
                button.textContent = 'Hide Details';
            } else {
                detailsSection.classList.remove('active');
                button.textContent = 'View Details';
            }
        });
    });

    // Handle screenshot modal
    const screenshotButtons = document.querySelectorAll('.screenshot-btn');
    screenshotButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-project');
            openScreenshotModal(projectId);
        });
    });
}

// Project screenshots mapping
const projectScreenshots = {
    project1: {
        images: [
            'images/project1-1.png',
            'images/project1-2.png',
            'images/project1-3.png',
            'images/project1-4.png',
            'images/project1-5.png',
            'images/project1-6.png',
            'images/project1-7.png',
            'images/project1-8.png',
            'images/project1-9.png',
            'images/project1-10.png',
            'images/project1-11.png',
            'images/project1-12.png',
            'images/project1-13.png',
            'images/project1-14.png',
            'images/project1-15.png',
            'images/project1-16.png',
            'images/project1-17.png',
            'images/project1-18.png',
            'images/project1-19.png'
        ],
        captions: [
            'Floating Dock - Interactive Dashboard Navigation',
            'Floating Dock - Analytics View with Quick Access',
            'Floating Dock - User Management Interface',
            'Floating Dock - Data Management Controls',
            'Floating Dock - Settings Configuration',
            'Morphing Header - Adaptive Navigation Dashboard',
            'Morphing Header - Performance Analytics',
            'Morphing Header - User Access Control',
            'Morphing Header - Data Infrastructure',
            'Morphing Header - System Configuration',
            'Radial Menu - Touch-Optimized Circular Navigation',
            'Command Bar - Keyboard Shortcut Power User Interface',
            'Slide-out Panel - Space-Efficient Side Navigation',
            'Slide-out Panel - Extended Menu with File Management',
            'Tabbed Interface - Multi-Section Dashboard',
            'Tabbed Interface - Analytics Section View',
            'Tabbed Interface - User Management Tab',
            'Tabbed Interface - Data Management Tab',
            'Tabbed Interface - Settings Configuration Tab'
        ],
        currentIndex: 0
    },
    project2: {
        images: [
            'images/project2-1.png',
            'images/project2-2.png',
            'images/project2-3.png',
            'images/project2-4.png',
            'images/project2-5.png',
            'images/project2-6.png',
            'images/project2-7.png',
            'images/project2-8.png',
            'images/project2-9.png',
            'images/project2-10.png',
            'images/project2-11.png',
            'images/project2-12.png',
            'images/project2-13.png',
            'images/project2-14.png',
            'images/project2-15.png'
        ],
        captions: [
            'Home - Dark Theme with Animated Hero Section',
            'Home - Light Theme with Clean Interface',
            'Features - Dark Theme Showing Key Functionality',
            'Features - Light Theme with Feature Cards',
            'Benefits - Dark Theme with Visual Analytics',
            'Benefits - Light Theme Highlighting Advantages',
            'Contact - Dark Theme with Glassmorphism Form',
            'Contact - Light Theme with Minimalist Design',
            'Sign In - Authentication Interface',
            'Sign In - Alternative Layout with Gradient Background',
            'Sign In - Premium Design with Floating Elements',
            'Sign In - Light Theme Authentication',
            'Create New Habit - Dark Theme Habit Builder',
            'Create New Habit - Light Theme Form Interface',
            'My Habits - Dashboard with Progress Tracking'
        ],
        currentIndex: 0
    },
    project3: {
        images: [
            'images/project3-1.png',
            'images/project3-2.png',
            'images/project3-3.png',
            'images/project3-4.png',
            'images/project3-5.png',
            'images/project3-6.png',
            'images/project3-7.png',
            'images/project3-8.png',
            'images/project3-9.png'
        ],
        captions: [
            'Lock Screen - Master Password Authentication with Secure Vault Access',
            'Dashboard - Real-time KPI Analytics with Recent Snippets and Security Status',
            'Code Snippet - Create and Edit Code with Syntax Highlighting and Metadata',
            'Snippets Folder - Advanced Filtering by Language, Project, and Tags',
            'Code Repository - File Tree Navigation with Syntax Highlighting',
            'Settings - Security Configuration with Encryption and Auto-lock Options',
            'Settings - Appearance Customization with Theme and Layout Preferences',
            'Settings - Editor Preferences with Syntax Highlighting Configuration',
            'Settings - Data Management with Backup, Export, and Retention Policies'
        ],
        currentIndex: 0
    },
    project4: {
        images: [
            'images/Project 4/Dashboard.png',
            'images/Project 4/API Settings.png',
            'images/Project 4/Logout.png'
        ],
        captions: [
            'Dashboard - Real-Time Multi-Source Financial Data Visualization',
            'API Settings - Secure API Key Management and Configuration',
            'Logout - Secure Authentication Session Management'
        ],
        currentIndex: 0
    },
    project5: {
        images: [
            'images/Project 5/Vault.png',
            'images/Project 5/Add Password.png',
            'images/Project 5/Settings.png'
        ],
        captions: [
            'Vault - Password Dashboard with Category Organization and Real-Time Search',
            'Add Password - Secure Credential Entry with Category Assignment and Validation',
            'Settings - Theme Customization and Data Management Configuration'
        ],
        currentIndex: 0
    },
    project6: {
        images: [
            'images/Project 6/1.png',
            'images/Project 6/2.png',
            'images/Project 6/3.png',
            'images/Project 6/4.png',
            'images/Project 6/5.png',
            'images/Project 6/6.png',
            'images/Project 6/7.png',
            'images/Project 6/8.png',
            'images/Project 6/9.png',
            'images/Project 6/10.png'
        ],
        captions: [
            'Homepage - Hero Section with Mission Statement and Role Tags',
            'About Section - Brief Introduction with Quote Card',
            'About Section - Feature Cards (Inclusive Accessibility, Data-Driven Design, Scalable Systems)',
            'Portfolio Section - Teaching Artifacts & Projects with Category Filters',
            'Portfolio Section - Python Programming Projects Grid',
            'Portfolio Section - Physical Education Curriculum Projects',
            'Portfolio Section - Learning Methodology and Professional Development Artifacts',
            'Skills Section - Technical Skills & Competencies Grid',
            'Skills Section - LMS Platforms, Design Tools, and Productivity Skills',
            'Footer Section - Contact Information and Navigation'
        ],
        currentIndex: 0
    },
    project7: {
        images: [
            'images/Project 7/1.png',
            'images/Project 7/2.png',
            'images/Project 7/3.png',
            'images/Project 7/4.png',
            'images/Project 7/5.png',
            'images/Project 7/6.png'
        ],
        captions: [
            'Library Dashboard - Main Prompt Library with KPI Dashboard, Category Filters, and Prompt Cards',
            'Create New Prompt - Modal Interface for Prompt Creation with Category Selection and Tag Management',
            'Favorites Page - Favorited Prompts with Search Functionality and Usage Statistics',
            'AI Insights Dashboard - Usage Analytics, Top Prompts, Usage Patterns, and AI-Generated Suggestions',
            'Settings Page - General Settings, Sync & Backup Configuration, and Data Management Options',
            'Settings Page - Data Management, Notifications, Privacy & Security, and Application Information'
        ],
        currentIndex: 0
    },
    project8: {
        images: [
            'images/Project 8/1 lock screen.png',
            'images/Project 8/2 dashboard.png',
            'images/Project 8/3 + New Play 1.png',
            'images/Project 8/3 + New Play 2.png',
            'images/Project 8/3 + New Play 3.png',
            'images/Project 8/4 settings 1.png',
            'images/Project 8/4 settings 2.png',
            'images/Project 8/keyboard shortcuts.png',
            'images/Project 8/Pin RESET.png'
        ],
        captions: [
            'Lock Screen - PIN Authentication with Secure Access and Animations',
            'Dashboard - Trading Playbook Library with Stats Grid, Search, Filtering, and Grid/List View Modes',
            'New Play Editor - Trade Rules Form with Entry Confirmations, Stop Loss, and Take Profit Rules',
            'New Play Editor - Trade Rules Form with Trade Logic, Conditions, and Risk Parameters',
            'New Play Editor - Confluence Factors, Tags & Organization, and Chart Screenshots Upload',
            'Settings Page - Appearance Theme Selection, Risk Models, and Take Profit Models Management',
            'Settings Page - Data & Export Options, Security Settings with PIN Change and Recovery Phrase',
            'Keyboard Shortcuts Modal - Navigation, Search, and Play Editor Keyboard Shortcuts Reference',
            'Reset PIN Modal - Recovery Phrase Entry Interface for PIN Reset Functionality'
        ],
        currentIndex: 0
    }
};

let currentProject = null;

// Helper function to check if a file is a video
function isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// Open screenshot modal
function openScreenshotModal(projectId) {
    const modal = document.getElementById('screenshotModal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalCaption = document.getElementById('modalCaption');
    
    currentProject = projectId;
    const projectData = projectScreenshots[projectId];
    
    if (projectData) {
        projectData.currentIndex = 0;
        const firstMedia = projectData.images[0] || projectData.media[0];
        const isVideo = isVideoFile(firstMedia);
        
        if (isVideo) {
            modalImage.style.display = 'none';
            modalVideo.style.display = 'block';
            // Clear existing sources
            modalVideo.innerHTML = '';
            // Add source element
            const source = document.createElement('source');
            source.src = firstMedia;
            // Detect video type from extension
            if (firstMedia.toLowerCase().endsWith('.webm')) {
                source.type = 'video/webm';
            } else if (firstMedia.toLowerCase().endsWith('.ogg') || firstMedia.toLowerCase().endsWith('.ogv')) {
                source.type = 'video/ogg';
            } else {
                source.type = 'video/mp4';
            }
            modalVideo.appendChild(source);
            modalVideo.load();
        } else {
            modalVideo.style.display = 'none';
            modalImage.style.display = 'block';
            modalImage.src = firstMedia;
            modalImage.alt = projectData.captions[0];
        }
        modalCaption.textContent = projectData.captions[0];
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Navigate screenshots
function navigateScreenshot(direction) {
    if (!currentProject) return;
    
    const projectData = projectScreenshots[currentProject];
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalCaption = document.getElementById('modalCaption');
    
    // Pause video if playing
    if (!modalVideo.paused) {
        modalVideo.pause();
    }
    
    const mediaArray = projectData.images || projectData.media || [];
    
    if (direction === 'next') {
        projectData.currentIndex = (projectData.currentIndex + 1) % mediaArray.length;
    } else {
        projectData.currentIndex = (projectData.currentIndex - 1 + mediaArray.length) % mediaArray.length;
    }
    
    const currentMedia = mediaArray[projectData.currentIndex];
    const isVideo = isVideoFile(currentMedia);
    
    if (isVideo) {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        // Clear existing sources
        modalVideo.innerHTML = '';
        // Add source element
        const source = document.createElement('source');
        source.src = currentMedia;
        // Detect video type from extension
        if (currentMedia.toLowerCase().endsWith('.webm')) {
            source.type = 'video/webm';
        } else if (currentMedia.toLowerCase().endsWith('.ogg') || currentMedia.toLowerCase().endsWith('.ogv')) {
            source.type = 'video/ogg';
        } else {
            source.type = 'video/mp4';
        }
        modalVideo.appendChild(source);
        modalVideo.load();
    } else {
        modalVideo.style.display = 'none';
        modalImage.style.display = 'block';
        modalImage.src = currentMedia;
        modalImage.alt = projectData.captions[projectData.currentIndex];
    }
    modalCaption.textContent = projectData.captions[projectData.currentIndex];
}

// Close screenshot modal
function closeScreenshotModal() {
    const modal = document.getElementById('screenshotModal');
    const modalVideo = document.getElementById('modalVideo');
    
    // Pause video if playing
    if (modalVideo && !modalVideo.paused) {
        modalVideo.pause();
    }
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProject = null; // Reset current project
}

// Initialize screenshot modal event listeners
function initScreenshotModal() {
    const modal = document.getElementById('screenshotModal');
    const closeButton = document.getElementById('screenshotModalClose');
    const backdrop = document.getElementById('screenshotModalBackdrop');
    const prevButton = document.getElementById('screenshotNavPrev');
    const nextButton = document.getElementById('screenshotNavNext');
    const modalContent = document.querySelector('.screenshot-modal-content');

    // Add null checks before attaching listeners
    if (!modal || !closeButton || !backdrop || !prevButton || !nextButton) {
        console.error('Screenshot modal elements not found:', {
            modal: !!modal,
            closeButton: !!closeButton,
            backdrop: !!backdrop,
            prevButton: !!prevButton,
            nextButton: !!nextButton
        });
        return;
    }

    console.log('Screenshot modal elements found, attaching listeners');

    // Close button - only stopPropagation, no preventDefault
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Close button clicked');
        closeScreenshotModal();
    });

    // Backdrop click
    backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Backdrop clicked');
        closeScreenshotModal();
    });

    // Close modal when clicking modal container directly (not content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('Modal container clicked');
            closeScreenshotModal();
        }
    });

    // Navigation buttons
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateScreenshot('prev');
    });
    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateScreenshot('next');
    });

    // Keyboard navigation - use a unique handler to avoid conflicts
    const handleScreenshotKeydown = (e) => {
        if (modal.classList.contains('active')) {
            console.log('Key pressed in screenshot modal:', e.key);
            if (e.key === 'Escape') {
                e.preventDefault();
                console.log('Escape key pressed, closing modal');
                closeScreenshotModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateScreenshot('prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateScreenshot('next');
            }
        }
    };

    document.addEventListener('keydown', handleScreenshotKeydown);
}

// Initialize all project functionality
function initProjects() {
    initProjectCards();
    initScreenshotModal();
    initImageModal();
}

// ========== CERTIFICATE MODAL FUNCTIONALITY ==========

// Certificate data array - Make it global and define immediately
window.certificates = [
    {
        title: "Developing Machine Learning Solutions Using AI",
        file: "certifications/Hunt FGCU Developing Machine Learning Solutions Using AI Training.pdf"
    },
    {
        title: "Coding with Artificial Intelligence Training",
        file: "certifications/Hunt Coding with Artificial Intelligence Training.pdf"
    },
    {
        title: "Fleet Certified GitOps Administrator",
        file: "certifications/Fleet Certified GitOps Administator.pdf"
    },
    {
        title: "Programming with Python - Level 1",
        file: "certifications/TTN Programming with Python – Level 1.pdf"
    },
    {
        title: "12 Week Python Certificate",
        file: "certifications/QS 12 Week Python Certificate.pdf"
    },
    {
        title: "Programming Foundations with Python",
        file: "certifications/From Logic to Code_ Programming Foundations with Python.pdf"
    },
    {
        title: "TTN Web Development - Level 1",
        file: "certifications/TTN Web Development level1 Certificate.pdf"
    },
    {
        title: "TTN+Cognizant Data Management Workshop",
        file: "certifications/TTN+Cognizant Data Management workshop Certificate.pdf"
    },
    {
        title: "Algorithmic Trading with Python",
        file: "certifications/Algorithimic Trading with Python.pdf"
    },
    {
        title: "Data Analysis via Python",
        file: "certifications/Data Analysis via Python.pdf"
    },
    {
        title: "Sanfoundry Python Certificate",
        file: "certifications/Sanfoundry Python Certificate.pdf"
    },
    {
        title: "SQL Beginner to Intermediate Query Writing",
        file: "certifications/SQL Beginner to Intermediate Query Writing Certificate of Completion.pdf"
    },
    {
        title: "TTN DevOps Level 1",
        file: "certifications/TTN DevOps level 1 Certificate.pdf"
    }
];

// Show certificate modal - Define as regular function for global scope
function showCert(index) {
    console.log('showCert called with index:', index);
    console.log('window.certificates exists?', typeof window.certificates !== 'undefined');
    console.log('window.certificates length:', typeof window.certificates !== 'undefined' ? window.certificates.length : 'undefined');

    if (typeof window.certificates === 'undefined' || index < 0 || index >= window.certificates.length) {
        console.error('Certificate not found at index:', index);
        return;
    }

    var cert = window.certificates[index];
    var modal = document.getElementById('certModal');
    var modalTitle = document.getElementById('certModalTitle');
    var certIframe = document.getElementById('certIframe');

    if (!modal || !modalTitle || !certIframe) {
        alert('Modal elements not found! Please refresh the page.');
        return;
    }

    // Set certificate data
    modalTitle.innerHTML = '<b>' + cert.title + '</b>';
    certIframe.src = cert.file;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Also expose it on window for inline onclick handlers
window.showCert = showCert;

// Close certificate modal
function closeCertModal() {
    var modal = document.getElementById('certModal');
    var certIframe = document.getElementById('certIframe');

    if (modal && certIframe) {
        modal.classList.remove('active');
        certIframe.src = '';
        document.body.style.overflow = '';
    }
}

// Initialize certificate modal event listeners
function initCertModal() {
    var modal = document.getElementById('certModal');
    var closeButton = document.getElementById('certModalClose');
    var backdrop = document.getElementById('certModalBackdrop');

    if (!modal || !closeButton || !backdrop) {
        return;
    }

    // Close button
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCertModal();
    });

    // Backdrop click
    backdrop.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCertModal();
    });

    // Close modal when clicking modal container directly (not content)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCertModal();
        }
    });

    // Keyboard navigation - ESC to close
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            e.preventDefault();
            closeCertModal();
        }
    });
}

// Initialize certificate modal on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCertModal);
} else {
    initCertModal();
}

// ========== IMAGE MODAL FUNCTIONALITY ==========

// Open image modal
function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modalImage.src = imageSrc;
    modalImage.alt = caption;
    modalCaption.textContent = caption;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize image modal event listeners
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const closeButton = document.getElementById('imageModalClose');
    const backdrop = document.getElementById('imageModalBackdrop');
    const modalContent = document.querySelector('.image-modal-content');

    if (!modal || !closeButton || !backdrop) return;

    // Close button - only stopPropagation, no preventDefault
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeImageModal();
    });

    // Backdrop click
    backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeImageModal();
    });

    // Close modal when clicking modal container directly (not content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Keyboard navigation
    const handleImageEscape = (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeImageModal();
            }
        }
    };
    document.addEventListener('keydown', handleImageEscape);
}
