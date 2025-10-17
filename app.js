// Main application JS (extracted from elite_portfolio.html)
document.addEventListener('DOMContentLoaded', () => {
    // ========== ICY TOWER GAME ==========
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Keep canvas size responsive while preserving behavior
    function resizeGameCanvas() {
        // keep logical size from attributes if present
        const attrW = canvas.getAttribute('width');
        const attrH = canvas.getAttribute('height');
        canvas.width = attrW ? parseInt(attrW, 10) : canvas.clientWidth;
        canvas.height = attrH ? parseInt(attrH, 10) : canvas.clientHeight;
    }

    resizeGameCanvas();

    // Game State
    let gameState = 'start';
    let score = 0;
    let highScore = 0;
    let combo = 0;
    let floor = 0;
    let cameraY = 0;

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
    let lastPlatformY = canvas.height - 50;

    // Controls
    const keys = {};

    function initPlatforms() {
        platforms = [];
        lastPlatformY = canvas.height - 50;
        platforms.push({ x: 0, y: canvas.height - 50, width: canvas.width, height: platformHeight, color: '#7b2ff7' });
        for (let i = 0; i < 15; i++) generatePlatform();
    }

    function generatePlatform() {
        const minGap = 60 + Math.floor(score / 500) * 10;
        const maxGap = 100 + Math.floor(score / 500) * 15;
        const gap = Math.random() * (maxGap - minGap) + minGap;
        lastPlatformY -= gap;
        const minWidth = 80;
        const maxWidth = 200;
        const width = Math.random() * (maxWidth - minWidth) + minWidth;
        const x = Math.random() * (canvas.width - width);
        platforms.push({ x, y: lastPlatformY, width, height: platformHeight, color: '#7b2ff7' });
    }

    function resetGame() {
        player.x = 200; player.y = 500; player.vx = 0; player.vy = 0; player.onGround = false;
        score = 0; combo = 0; floor = 0; cameraY = 0; gameState = 'playing'; initPlatforms();
    }

    function update() {
        if (gameState !== 'playing') return;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -player.speed;
        else if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = player.speed;
        else player.vx *= 0.8;
        if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && player.onGround) { player.vy = -player.jumpPower; player.onGround = false; }
        player.x += player.vx; player.y += player.vy; player.vy += player.gravity;
        if (player.x + player.width < 0) player.x = canvas.width; else if (player.x > canvas.width) player.x = -player.width;
        if (player.y < canvas.height / 2) { const diff = canvas.height / 2 - player.y; cameraY += diff * 0.1; player.y += diff * 0.1; platforms.forEach(p => p.y += diff * 0.1); const newFloor = Math.floor(-cameraY / 50); if (newFloor > floor) { const floorsDiff = newFloor - floor; score += floorsDiff * 10 * (combo + 1); floor = newFloor; } }
        player.onGround = false;
        platforms.forEach(platform => { if (player.vy > 0 && player.y + player.height >= platform.y && player.y + player.height <= platform.y + platform.height + 10 && player.x + player.width > platform.x && player.x < platform.x + platform.width) { player.y = platform.y - player.height; player.vy = 0; player.onGround = true; if (platform !== platforms[0]) { combo++; score += combo * 5; } } });
        if (player.onGround && platforms[0] && player.y + player.height >= platforms[0].y) combo = 0;
        if (player.y > canvas.height + 100) { gameState = 'gameOver'; if (score > highScore) highScore = score; }
        if (platforms[platforms.length - 1].y > 0) generatePlatform(); platforms = platforms.filter(platform => platform.y < canvas.height + 100);
    }

    function draw() {
        ctx.fillStyle = '#0a0e27'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (gameState === 'start') { ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px Inter'; ctx.textAlign = 'center'; ctx.fillText('ICY TOWER', canvas.width / 2, 150); ctx.font = '18px Inter'; ctx.fillStyle = '#a0aec0'; ctx.fillText('Press SPACE to Start', canvas.width / 2, 250); ctx.fillText('← → or A D to Move', canvas.width / 2, 300); ctx.fillText('SPACE or W or ↑ to Jump', canvas.width / 2, 330); ctx.fillText('R to Restart', canvas.width / 2, 360); if (highScore > 0) { ctx.font = 'bold 24px Inter'; ctx.fillStyle = '#00d4ff'; ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 450); } return; }
        if (gameState === 'gameOver') { ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#ff006e'; ctx.font = 'bold 48px Inter'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', canvas.width / 2, 200); ctx.fillStyle = '#ffffff'; ctx.font = '24px Inter'; ctx.fillText(`Score: ${score}`, canvas.width / 2, 270); ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 310); ctx.fillStyle = '#a0aec0'; ctx.font = '18px Inter'; ctx.fillText('Press R to Restart', canvas.width / 2, 380); return; }
        platforms.forEach(platform => { ctx.fillStyle = platform.color; ctx.fillRect(platform.x, platform.y, platform.width, platform.height); const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height); gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)'); gradient.addColorStop(1, 'transparent'); ctx.fillStyle = gradient; ctx.fillRect(platform.x, platform.y, platform.width, platform.height); });
        ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.shadowBlur = 20; ctx.shadowColor = player.color; ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'left'; ctx.fillText(`Score: ${score}`, 20, 40); ctx.fillText(`Floor: ${floor}`, 20, 70); if (combo > 0) { ctx.fillStyle = '#00d4ff'; ctx.font = 'bold 28px Inter'; ctx.fillText(`Combo x${combo}!`, 20, 105); } ctx.fillStyle = '#a0aec0'; ctx.font = '16px Inter'; ctx.textAlign = 'right'; ctx.fillText(`High: ${highScore}`, canvas.width - 20, 40);
    }

    function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

    document.addEventListener('keydown', (e) => { keys[e.key] = true; if (gameState === 'start' && e.key === ' ') resetGame(); if (gameState === 'gameOver' && (e.key === 'r' || e.key === 'R')) resetGame(); if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault(); });
    document.addEventListener('keyup', (e) => { keys[e.key] = false; });

    initPlatforms(); gameLoop();

    // ========== END ICY TOWER GAME ==========

    // ========== Particle System ==========
    const particleCanvas = document.getElementById('particleCanvas');
    const particleCtx = particleCanvas.getContext('2d');

    function resizeParticles() { particleCanvas.width = window.innerWidth; particleCanvas.height = window.innerHeight; }
    resizeParticles();

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() { this.x = Math.random() * particleCanvas.width; this.y = Math.random() * particleCanvas.height; this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5; this.radius = Math.random() * 2 + 1; }
        update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1; if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1; }
        draw() { particleCtx.beginPath(); particleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); particleCtx.fillStyle = 'rgba(0, 212, 255, 0.3)'; particleCtx.fill(); }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) { particleCtx.beginPath(); particleCtx.moveTo(particles[i].x, particles[i].y); particleCtx.lineTo(particles[j].x, particles[j].y); particleCtx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 120)})`; particleCtx.lineWidth = 1; particleCtx.stroke(); }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => { resizeParticles(); resizeGameCanvas(); });

    // Playground Tabs
    const playgroundTabs = document.querySelectorAll('.playground-tab');
    const playgroundContents = document.querySelectorAll('.playground-content');
    const runCodeBtn = document.getElementById('runCodeBtn');

    playgroundTabs.forEach(tab => tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab'); playgroundTabs.forEach(t => t.classList.remove('active')); playgroundContents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const content = document.getElementById(`${tabName}-content`); if (content) content.classList.add('active'); runCodeBtn.style.display = tabName === 'game' ? 'none' : 'block';
    }));

    runCodeBtn.addEventListener('click', () => alert('Code executed! Check console for output.'));

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body; let isDark = true;
    themeToggle.addEventListener('click', () => { isDark = !isDark; body.setAttribute('data-theme', isDark ? 'dark' : 'light'); themeToggle.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️'; });

    // Navbar Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => { if (window.scrollY > 100) navbar.classList.add('nav-scroll'); else navbar.classList.remove('nav-scroll'); });

    // Counter animation
    const animateCounter = (element) => { const target = parseInt(element.getAttribute('data-target')); const duration = 2000; const increment = target / (duration / 16); let current = 0; const updateCounter = () => { current += increment; if (current < target) { element.textContent = Math.floor(current) + (target === 98 ? '%' : '+'); requestAnimationFrame(updateCounter); } else { element.textContent = target + (target === 98 ? '%' : '+'); } }; updateCounter(); };

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { const counters = entry.target.querySelectorAll('.stat-number'); counters.forEach(counter => { if (counter.textContent === '0') animateCounter(counter); }); } }); }, observerOptions);
    const heroStats = document.querySelector('.hero-stats'); if (heroStats) observer.observe(heroStats);

    // GitHub activity
    const activityGrid = document.getElementById('activityGrid'); for (let i = 0; i < 365; i++) { const cell = document.createElement('div'); cell.className = 'activity-cell'; const level = Math.floor(Math.random() * 5); if (level > 0) cell.classList.add(`level-${level}`); cell.title = `${Math.floor(Math.random() * 10)} contributions`; activityGrid.appendChild(cell); }

    // Terminal
    const terminalInput = document.getElementById('terminalInput'); terminalInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { const command = terminalInput.value.toLowerCase(); const terminalContent = document.querySelector('.terminal-content'); let response = ''; if (command === 'help') response = '\n$ Available commands: help, skills, contact, clear'; else if (command === 'skills') response = '\n$ Skills: React, TypeScript, Next.js, Node.js, CSS3'; else if (command === 'contact') response = '\n$ Email: katiehunt95@gmail.com'; else if (command === 'clear') { terminalContent.innerHTML = ''; terminalInput.value = ''; return; } else response = `\n$ Command not found: ${command}. Type 'help' for commands.`; const newLine = document.createElement('div'); newLine.className = 'terminal-line'; newLine.style.opacity = '1'; newLine.textContent = response; terminalContent.appendChild(newLine); terminalInput.value = ''; terminalContent.scrollTop = terminalContent.scrollHeight; } });

    // Contact Form (client-side validation + optional mailto fallback)
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) {
            alert('Please fill out all fields before sending.');
            return;
        }

        // Show success message (this is a UI-only fallback)
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    });

    // Performance monitor
    let lastTime = performance.now(); let frames = 0;
    function updateFPS() { frames++; const currentTime = performance.now(); if (currentTime >= lastTime + 1000) { document.getElementById('fps').textContent = frames; frames = 0; lastTime = currentTime; } requestAnimationFrame(updateFPS); }
    updateFPS();

    window.addEventListener('load', () => { const loadTime = performance.now(); document.getElementById('loadTime').textContent = Math.round(loadTime); });

    // Konami
    const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let konamiIndex = 0;
    document.addEventListener('keydown', (e) => { if (e.key === konamiCode[konamiIndex]) { konamiIndex++; if (konamiIndex === konamiCode.length) { document.getElementById('easterEgg').classList.add('active'); document.getElementById('modalBackdrop').classList.add('active'); konamiIndex = 0; } } else konamiIndex = 0; });

    function closeEasterEgg() { document.getElementById('easterEgg').classList.remove('active'); document.getElementById('modalBackdrop').classList.remove('active'); }
    document.getElementById('modalBackdrop').addEventListener('click', closeEasterEgg);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function (e) { e.preventDefault(); const target = document.querySelector(this.getAttribute('href')); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); });
});
