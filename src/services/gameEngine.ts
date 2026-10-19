// Game Engine & Template Synthesizer for OmniCraft Studio
// Creates complete, self-contained, 60fps playable HTML5 canvas games with Web Audio synth sounds,
// touch/keyboard controls, custom parameters, and continuous update support.

export interface GameSettings {
  playerSpeed: number; // 1 to 5
  difficulty: 'easy' | 'normal' | 'hard' | 'insane';
  soundEnabled: boolean;
  lives: number; // 1 to 10
  gravity: number; // 0.2 to 1.5
  enemySpeed: number; // 1 to 5
  themeColor: string; // hex or color name
  hasBoss?: boolean;
  hasShieldPowerup?: boolean;
  hasTouchControls?: boolean;
}

export function generateSpaceShooterHtml(title: string, settings: GameSettings): string {
  const primaryColor = settings.themeColor || '#6366f1';
  const livesCount = settings.lives || 3;
  const speed = settings.playerSpeed || 3;
  const soundOn = settings.soundEnabled !== false;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; background: #050814; font-family: system-ui, -apple-system, sans-serif; touch-action: none; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; background: radial-gradient(circle at center, #0f172a 0%, #020617 100%); }
    .arcade-font { font-family: monospace; letter-spacing: 1px; }
  </style>
</head>
<body class="relative">
  <!-- HUD Header Overlay -->
  <div class="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none z-10">
    <div class="flex items-center gap-3">
      <div class="bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">Score</span>
        <span id="scoreEl" class="text-xl font-extrabold text-amber-400 arcade-font">0000</span>
      </div>
      <div class="bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">Shield / Lives</span>
        <div id="livesEl" class="flex items-center gap-1 text-red-500 font-bold text-sm mt-0.5">
          ${'❤️'.repeat(livesCount)}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur">
        <span class="text-[10px] text-slate-400 font-bold uppercase block">High Score</span>
        <span id="highScoreEl" class="text-base font-bold text-emerald-400 arcade-font">0000</span>
      </div>
      <button id="pauseBtn" onclick="togglePause()" class="pointer-events-auto bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold border border-slate-600 shadow cursor-pointer">
        ⏸️ Pause
      </button>
    </div>
  </div>

  <!-- Game Canvas -->
  <canvas id="gameCanvas"></canvas>

  <!-- Touch Joystick / Mobile Controls Overlay -->
  <div id="mobileControls" class="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-end pointer-events-none z-20">
    <!-- D-Pad Left/Right -->
    <div class="flex gap-3 pointer-events-auto">
      <button id="btnLeft" class="w-16 h-16 rounded-2xl bg-slate-800/80 active:bg-indigo-600/80 border border-slate-600/80 text-white font-extrabold text-2xl flex items-center justify-center backdrop-blur shadow-2xl">
        ◀
      </button>
      <button id="btnRight" class="w-16 h-16 rounded-2xl bg-slate-800/80 active:bg-indigo-600/80 border border-slate-600/80 text-white font-extrabold text-2xl flex items-center justify-center backdrop-blur shadow-2xl">
        ▶
      </button>
    </div>

    <!-- Fire Button -->
    <div class="pointer-events-auto">
      <button id="btnFire" class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 active:scale-95 border-2 border-white/40 text-white font-extrabold text-xl flex items-center justify-center shadow-2xl shadow-rose-600/50">
        🔥 FIRE
      </button>
    </div>
  </div>

  <!-- Game Over / Victory Modal -->
  <div id="gameOverModal" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-30">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl font-bold">
        💥
      </div>
      <h2 class="text-2xl font-black text-white">GAME OVER</h2>
      <p class="text-xs text-slate-400">Your final score: <span id="finalScore" class="text-amber-400 font-extrabold font-mono text-base">0</span></p>
      <button onclick="restartGame()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 cursor-pointer">
        Play Again (Restart)
      </button>
    </div>
  </div>

  <script>
    // Audio Synthesizer (Zero External File Dependencies)
    const AudioEngine = {
      ctx: null,
      enabled: ${soundOn},
      init() {
        if (!this.ctx && typeof AudioContext !== 'undefined') {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
      },
      playLaser() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      },
      playExplosion() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      },
      playHit() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      }
    };

    // Canvas & Game Variables
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      player.y = height - 100;
    });

    let score = 0;
    let lives = ${livesCount};
    let highScore = parseInt(localStorage.getItem('omni_hiscore') || '0', 10);
    document.getElementById('highScoreEl').innerText = highScore;

    let isPaused = false;
    let isGameOver = false;

    // Player Object
    const player = {
      x: width / 2,
      y: height - 100,
      width: 44,
      height: 48,
      speed: ${speed * 2.2},
      vx: 0,
      color: '${primaryColor}',
      invulnerable: 0
    };

    // Bullets, Enemies, Particles, Stars
    let bullets = [];
    let enemies = [];
    let particles = [];
    let stars = [];

    // Init Starfield
    for (let i = 0; i < 75; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.4 ? '#ffffff' : '#818cf8'
      });
    }

    // Input Keys
    const keys = { left: false, right: false, fire: false };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        shootBullet();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    });

    // Touch Controls
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnFire = document.getElementById('btnFire');

    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
    btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
    btnRight.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
    btnFire.addEventListener('touchstart', (e) => { e.preventDefault(); shootBullet(); });

    btnLeft.addEventListener('mousedown', () => { keys.left = true; });
    btnLeft.addEventListener('mouseup', () => { keys.left = false; });
    btnRight.addEventListener('mousedown', () => { keys.right = true; });
    btnRight.addEventListener('mouseup', () => { keys.right = false; });
    btnFire.addEventListener('mousedown', () => { shootBullet(); });

    let lastShotTime = 0;
    function shootBullet() {
      if (isGameOver || isPaused) return;
      const now = Date.now();
      if (now - lastShotTime < 180) return; // Fire rate limit
      lastShotTime = now;

      AudioEngine.playLaser();
      bullets.push({
        x: player.x,
        y: player.y - player.height / 2,
        radius: 3.5,
        speed: 12,
        color: '#f43f5e'
      });

      // Dual shot upgrade
      bullets.push({
        x: player.x - 14,
        y: player.y - 10,
        radius: 2.5,
        speed: 11,
        color: '#38bdf8'
      });
      bullets.push({
        x: player.x + 14,
        y: player.y - 10,
        radius: 2.5,
        speed: 11,
        color: '#38bdf8'
      });
    }

    // Spawn Enemies
    let enemySpawnCounter = 0;
    const enemySpawnRate = ${settings.difficulty === 'hard' ? 40 : settings.difficulty === 'insane' ? 25 : 60};

    function spawnEnemy() {
      const isBoss = ${settings.hasBoss ? 'Math.random() < 0.08' : 'false'};
      enemies.push({
        x: Math.random() * (width - 80) + 40,
        y: -40,
        width: isBoss ? 70 : 34,
        height: isBoss ? 60 : 32,
        speed: (Math.random() * 1.5 + 1.8) * ${settings.enemySpeed || 2} * 0.7,
        hp: isBoss ? 15 : (Math.random() > 0.7 ? 2 : 1),
        maxHp: isBoss ? 15 : 2,
        color: isBoss ? '#ec4899' : (Math.random() > 0.5 ? '#f59e0b' : '#10b981'),
        isBoss: isBoss
      });
    }

    // Particles for explosions
    function createExplosion(x, y, color) {
      AudioEngine.playExplosion();
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: Math.random() * 3 + 1,
          color: color || '#f59e0b',
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    }

    // Main Game Loop
    function update() {
      if (isPaused || isGameOver) return;

      // 1. Move Player
      if (keys.left) player.x -= player.speed;
      if (keys.right) player.x += player.speed;
      player.x = Math.max(player.width / 2, Math.min(width - player.width / 2, player.x));

      if (player.invulnerable > 0) player.invulnerable--;

      // 2. Stars
      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }
      });

      // 3. Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -10) {
          bullets.splice(i, 1);
        }
      }

      // 4. Enemies
      enemySpawnCounter++;
      if (enemySpawnCounter > enemySpawnRate) {
        spawnEnemy();
        enemySpawnCounter = 0;
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.speed;

        // Player Collision
        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist < (player.width / 2 + e.width / 2) && player.invulnerable === 0) {
          player.invulnerable = 60;
          lives--;
          updateLivesDisplay();
          createExplosion(player.x, player.y, '#ef4444');
          AudioEngine.playHit();
          enemies.splice(i, 1);

          if (lives <= 0) {
            triggerGameOver();
          }
          continue;
        }

        // Bullet Collisions
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const bDist = Math.hypot(b.x - e.x, b.y - e.y);
          if (bDist < (b.radius + e.width / 2)) {
            e.hp--;
            bullets.splice(j, 1);
            if (e.hp <= 0) {
              score += e.isBoss ? 500 : 100;
              document.getElementById('scoreEl').innerText = score.toString().padStart(4, '0');
              if (score > highScore) {
                highScore = score;
                localStorage.setItem('omni_hiscore', highScore.toString());
                document.getElementById('highScoreEl').innerText = highScore.toString().padStart(4, '0');
              }
              createExplosion(e.x, e.y, e.color);
              enemies.splice(i, 1);
            } else {
              AudioEngine.playHit();
            }
            break;
          }
        }

        // Offscreen removal
        if (e && e.y > height + 50) {
          enemies.splice(i, 1);
        }
      }

      // 5. Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    // Render Canvas
    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Stars
      stars.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bullets
      bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Enemies
      enemies.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = e.color;

        // Draw Enemy Spaceship / Asteroid
        ctx.beginPath();
        ctx.moveTo(0, e.height / 2);
        ctx.lineTo(-e.width / 2, -e.height / 2);
        ctx.lineTo(0, -e.height / 4);
        ctx.lineTo(e.width / 2, -e.height / 2);
        ctx.closePath();
        ctx.fill();

        // Eye / Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, e.isBoss ? 8 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Particles
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Player Ship
      if (player.invulnerable % 8 < 4) {
        ctx.save();
        ctx.translate(player.x, player.y);

        // Thruster flame
        ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#e11d48';
        ctx.beginPath();
        ctx.moveTo(-8, player.height / 2);
        ctx.lineTo(0, player.height / 2 + Math.random() * 18 + 8);
        ctx.lineTo(8, player.height / 2);
        ctx.closePath();
        ctx.fill();

        // Ship Hull
        ctx.fillStyle = '${primaryColor}';
        ctx.beginPath();
        ctx.moveTo(0, -player.height / 2);
        ctx.lineTo(-player.width / 2, player.height / 2);
        ctx.lineTo(0, player.height / 3);
        ctx.lineTo(player.width / 2, player.height / 2);
        ctx.closePath();
        ctx.fill();

        // Wings accent
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-6, 12);
        ctx.lineTo(6, 12);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);

    function updateLivesDisplay() {
      document.getElementById('livesEl').innerText = '❤️'.repeat(Math.max(0, lives));
    }

    function togglePause() {
      isPaused = !isPaused;
      document.getElementById('pauseBtn').innerText = isPaused ? '▶️ Resume' : '⏸️ Pause';
    }

    function triggerGameOver() {
      isGameOver = true;
      document.getElementById('finalScore').innerText = score;
      document.getElementById('gameOverModal').classList.remove('hidden');
    }

    function restartGame() {
      score = 0;
      lives = ${livesCount};
      bullets = [];
      enemies = [];
      particles = [];
      isGameOver = false;
      document.getElementById('scoreEl').innerText = '0000';
      updateLivesDisplay();
      document.getElementById('gameOverModal').classList.add('hidden');
    }
  </script>
</body>
</html>`;
}

export function generateCyberRunnerHtml(title: string, settings: GameSettings): string {
  const primaryColor = settings.themeColor || '#10b981';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; background: #09090b; font-family: system-ui, sans-serif; touch-action: none; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; background: #030712; }
  </style>
</head>
<body class="relative">
  <div class="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
    <div class="bg-slate-900/90 border border-emerald-500/40 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
      <div>
        <span class="text-[10px] text-emerald-400 font-bold uppercase block">Cyber Meters</span>
        <span id="distEl" class="text-xl font-black text-white font-mono">0m</span>
      </div>
      <div class="w-px h-6 bg-slate-700"></div>
      <div>
        <span class="text-[10px] text-amber-400 font-bold uppercase block">Credits</span>
        <span id="coinsEl" class="text-xl font-black text-amber-400 font-mono">⚡ 0</span>
      </div>
    </div>
    <button onclick="toggleJump()" class="pointer-events-auto px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700">
      Tap / Space to Jump
    </button>
  </div>

  <canvas id="runnerCanvas"></canvas>

  <div id="runnerModal" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-30">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
      <h2 class="text-2xl font-black text-emerald-400">MISSION TERMINATED</h2>
      <p class="text-xs text-slate-300">Distance Traveled: <span id="finalDist" class="text-white font-bold font-mono">0m</span></p>
      <button onclick="restartRunner()" class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl cursor-pointer">
        Run Again
      </button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('runnerCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      groundY = height - 120;
    });

    let groundY = height - 120;
    let distance = 0;
    let coins = 0;
    let isGameOver = false;

    const player = {
      x: 80,
      y: groundY - 40,
      width: 32,
      height: 44,
      vy: 0,
      jumpForce: -13 * ${settings.playerSpeed || 2} * 0.5,
      gravity: 0.65 * ${settings.gravity || 1},
      isGrounded: true
    };

    let obstacles = [];
    let coinsList = [];
    let speed = 5 * ${settings.playerSpeed || 2} * 0.6;

    function jump() {
      if (isGameOver) return;
      if (player.isGrounded) {
        player.vy = -14;
        player.isGrounded = false;
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jump();
    });
    window.addEventListener('touchstart', (e) => {
      e.preventDefault();
      jump();
    });
    window.toggleJump = jump;

    function spawnObstacle() {
      obstacles.push({
        x: width + 50,
        y: groundY - 36,
        width: 24,
        height: 36,
        color: '#f43f5e'
      });
      if (Math.random() > 0.4) {
        coinsList.push({
          x: width + 100,
          y: groundY - 70,
          radius: 10
        });
      }
    }

    let spawnTimer = 0;
    function update() {
      if (isGameOver) return;

      distance += Math.floor(speed * 0.1);
      document.getElementById('distEl').innerText = distance + 'm';

      // Gravity & Physics
      player.y += player.vy;
      player.vy += player.gravity;

      if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      spawnTimer++;
      if (spawnTimer > 100) {
        spawnObstacle();
        spawnTimer = 0;
      }

      // Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;
        // Collision
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          isGameOver = true;
          document.getElementById('finalDist').innerText = distance + 'm';
          document.getElementById('runnerModal').classList.remove('hidden');
        }
        if (obs.x < -50) obstacles.splice(i, 1);
      }

      // Coins
      for (let i = coinsList.length - 1; i >= 0; i--) {
        const c = coinsList[i];
        c.x -= speed;
        const dist = Math.hypot(player.x + player.width / 2 - c.x, player.y + player.height / 2 - c.y);
        if (dist < player.width / 2 + c.radius) {
          coins++;
          document.getElementById('coinsEl').innerText = '⚡ ' + coins;
          coinsList.splice(i, 1);
        } else if (c.x < -30) {
          coinsList.splice(i, 1);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Neon Grid Ground
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.strokeStyle = '${primaryColor}';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Obstacles
      obstacles.forEach(obs => {
        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.moveTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.lineTo(obs.x, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
      });

      // Coins
      coinsList.forEach(c => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Player
      ctx.fillStyle = '${primaryColor}';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(player.x + 18, player.y + 8, 8, 8); // Visor
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.restartRunner = function() {
      distance = 0;
      coins = 0;
      obstacles = [];
      coinsList = [];
      isGameOver = false;
      document.getElementById('coinsEl').innerText = '⚡ 0';
      document.getElementById('runnerModal').classList.add('hidden');
    };
  </script>
</body>
</html>`;
}

export function generateBrickBreakerHtml(title: string, settings: GameSettings): string {
  const primaryColor = settings.themeColor || '#f59e0b';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; background: #020617; font-family: system-ui, sans-serif; touch-action: none; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; background: radial-gradient(circle at center, #0f172a 0%, #020617 100%); }
  </style>
</head>
<body class="relative">
  <div class="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
    <div class="bg-slate-900/90 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
      <div>
        <span class="text-[10px] text-slate-400 font-bold uppercase block">Breaker Score</span>
        <span id="scoreEl" class="text-xl font-black text-amber-400 font-mono">0</span>
      </div>
      <div class="w-px h-6 bg-slate-700"></div>
      <div>
        <span class="text-[10px] text-slate-400 font-bold uppercase block">Balls Left</span>
        <span id="livesEl" class="text-xl font-black text-rose-500 font-mono">❤️❤️❤️</span>
      </div>
    </div>
    <span class="text-xs text-slate-400 hidden sm:inline">Move mouse or drag finger to slide paddle</span>
  </div>

  <canvas id="breakerCanvas"></canvas>

  <div id="breakerModal" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-30">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
      <h2 id="modalTitle" class="text-2xl font-black text-amber-400">GAME OVER</h2>
      <p class="text-xs text-slate-300">Total Score: <span id="finalScore" class="text-white font-bold font-mono">0</span></p>
      <button onclick="restartBreaker()" class="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl cursor-pointer">
        Play Again
      </button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('breakerCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      paddle.y = height - 60;
    });

    let score = 0;
    let lives = ${settings.lives || 3};
    let isGameOver = false;

    const paddle = {
      width: 130,
      height: 18,
      x: width / 2 - 65,
      y: height - 60,
      color: '${primaryColor}'
    };

    const ball = {
      x: width / 2,
      y: height - 120,
      radius: 8,
      dx: 4 * ${settings.enemySpeed || 2} * 0.6,
      dy: -4 * ${settings.enemySpeed || 2} * 0.6,
      color: '#38bdf8'
    };

    // Brick Grid
    const brickRowCount = 5;
    const brickColumnCount = Math.floor(width / 75);
    const brickWidth = (width - (brickColumnCount + 1) * 10) / brickColumnCount;
    const brickHeight = 22;
    const brickPadding = 10;
    const brickOffsetTop = 80;
    const brickOffsetLeft = 10;

    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#6366f1', '#06b6d4'];
    let bricks = [];
    function initBricks() {
      bricks = [];
      for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r % colors.length] };
        }
      }
    }
    initBricks();

    // Mouse / Touch Dragging Paddle
    function movePaddle(clientX) {
      paddle.x = clientX - paddle.width / 2;
      paddle.x = Math.max(0, Math.min(width - paddle.width, paddle.x));
    }

    window.addEventListener('mousemove', (e) => movePaddle(e.clientX));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) movePaddle(e.touches[0].clientX);
    });

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ball.x > b.x &&
              ball.x < b.x + brickWidth &&
              ball.y > b.y &&
              ball.y < b.y + brickHeight
            ) {
              ball.dy = -ball.dy;
              b.status = 0;
              score += 25;
              document.getElementById('scoreEl').innerText = score;
            }
          }
        }
      }
    }

    function update() {
      if (isGameOver) return;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall bounce
      if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.radius > paddle.y) {
        // Paddle collision
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.dy = -Math.abs(ball.dy);
          // Angle modifier
          const hitOffset = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          ball.dx = hitOffset * 6;
        } else if (ball.y > height) {
          lives--;
          document.getElementById('livesEl').innerText = '❤️'.repeat(Math.max(0, lives));
          if (lives <= 0) {
            isGameOver = true;
            document.getElementById('finalScore').innerText = score;
            document.getElementById('breakerModal').classList.remove('hidden');
          } else {
            ball.x = width / 2;
            ball.y = height - 120;
            ball.dy = -4;
          }
        }
      }

      collisionDetection();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Bricks
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = bricks[c][r].color;
            ctx.shadowColor = bricks[c][r].color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 6);
            ctx.fill();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Ball
      ctx.fillStyle = ball.color;
      ctx.shadowColor = ball.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Paddle
      ctx.fillStyle = paddle.color;
      ctx.shadowColor = paddle.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.restartBreaker = function() {
      score = 0;
      lives = ${settings.lives || 3};
      isGameOver = false;
      document.getElementById('scoreEl').innerText = '0';
      document.getElementById('livesEl').innerText = '❤️'.repeat(lives);
      document.getElementById('breakerModal').classList.add('hidden');
      initBricks();
      ball.x = width / 2;
      ball.y = height - 120;
      ball.dy = -4;
    };
  </script>
</body>
</html>`;
}

export function generateFlappyBirdHtml(title: string, settings: GameSettings): string {
  const primaryColor = settings.themeColor || '#e11d48';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; background: #030712; font-family: system-ui, sans-serif; touch-action: none; user-select: none; }
    canvas { display: block; width: 100vw; height: 100vh; background: linear-gradient(to bottom, #0f172a 0%, #020617 100%); }
  </style>
</head>
<body class="relative">
  <div class="absolute top-6 left-0 right-0 flex justify-center pointer-events-none z-10">
    <div class="bg-slate-900/90 border border-slate-700/80 px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
      <span class="text-xs text-slate-400 font-bold uppercase">Pipes Cleared:</span>
      <span id="flappyScore" class="text-2xl font-black text-rose-500 font-mono">0</span>
    </div>
  </div>

  <canvas id="flappyCanvas"></canvas>

  <div id="flappyModal" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-30">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4">
      <h2 class="text-2xl font-black text-rose-500">YOU CRASHED</h2>
      <p class="text-xs text-slate-300">Pipes Passed: <span id="finalFlappyScore" class="text-white font-bold font-mono">0</span></p>
      <button onclick="restartFlappy()" class="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl cursor-pointer">
        Flap Again
      </button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let score = 0;
    let isGameOver = false;

    const bird = {
      x: 70,
      y: height / 2,
      radius: 16,
      velocity: 0,
      gravity: 0.45 * ${settings.gravity || 1},
      jump: -8.5 * ${settings.playerSpeed || 2} * 0.5
    };

    let pipes = [];
    const pipeWidth = 55;
    const pipeGap = 160;
    let frame = 0;

    function flap() {
      if (isGameOver) return;
      bird.velocity = bird.jump;
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') flap();
    });
    window.addEventListener('touchstart', (e) => {
      e.preventDefault();
      flap();
    });
    window.addEventListener('mousedown', flap);

    function update() {
      if (isGameOver) return;
      frame++;

      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      // Floor / ceiling collision
      if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
        gameOver();
      }

      // Spawn pipes
      if (frame % 90 === 0) {
        const topHeight = Math.random() * (height - pipeGap - 140) + 70;
        pipes.push({
          x: width,
          top: topHeight,
          bottom: height - topHeight - pipeGap,
          passed: false
        });
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 3 * ${settings.enemySpeed || 2} * 0.6;

        // Collision detection
        if (
          bird.x + bird.radius > p.x &&
          bird.x - bird.radius < p.x + pipeWidth &&
          (bird.y - bird.radius < p.top || bird.y + bird.radius > height - p.bottom)
        ) {
          gameOver();
        }

        if (!p.passed && p.x + pipeWidth < bird.x) {
          p.passed = true;
          score++;
          document.getElementById('flappyScore').innerText = score;
        }

        if (p.x < -pipeWidth) pipes.splice(i, 1);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Pipes
      pipes.forEach(p => {
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        // Bottom pipe
        ctx.fillRect(p.x, height - p.bottom, pipeWidth, p.bottom);
      });
      ctx.shadowBlur = 0;

      // Bird
      ctx.fillStyle = '${primaryColor}';
      ctx.shadowColor = '${primaryColor}';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bird.x + 6, bird.y - 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bird.x + 8, bird.y - 4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    function gameOver() {
      isGameOver = true;
      document.getElementById('finalFlappyScore').innerText = score;
      document.getElementById('flappyModal').classList.remove('hidden');
    }

    window.restartFlappy = function() {
      score = 0;
      bird.y = height / 2;
      bird.velocity = 0;
      pipes = [];
      frame = 0;
      isGameOver = false;
      document.getElementById('flappyScore').innerText = '0';
      document.getElementById('flappyModal').classList.add('hidden');
    };
  </script>
</body>
</html>`;
}

export function generateRpgClickerHtml(title: string, settings: GameSettings): string {
  const primaryColor = settings.themeColor || '#8b5cf6';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body, html { margin: 0; padding: 0; min-height: 100vh; background: #05050d; font-family: system-ui, sans-serif; user-select: none; }
  </style>
</head>
<body class="p-4 sm:p-6 text-slate-100 flex flex-col items-center justify-center min-h-screen">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
    <!-- Header Stats -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <h1 class="text-lg font-black text-white">${title}</h1>
        <p class="text-xs text-purple-400 font-bold">Dungeon Level <span id="lvl">1</span></p>
      </div>
      <div class="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
        <span class="text-amber-400 font-bold text-xs">🪙 Gold:</span>
        <span id="gold" class="text-amber-300 font-extrabold font-mono text-sm">0</span>
      </div>
    </div>

    <!-- Monster Arena -->
    <div class="text-center space-y-3 py-4">
      <div id="monsterAvatar" class="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-purple-900/60 to-pink-900/60 border border-purple-500/40 flex items-center justify-center text-6xl shadow-2xl cursor-pointer active:scale-90 transition-transform">
        👾
      </div>
      <h3 id="monsterName" class="text-base font-bold text-white">Shadow Goblin</h3>
      <!-- Health Bar -->
      <div class="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
        <div id="hpBar" class="bg-gradient-to-r from-red-600 to-rose-500 h-full w-full transition-all"></div>
      </div>
      <span id="hpText" class="text-xs text-slate-400 font-mono">100 / 100 HP</span>
    </div>

    <!-- Tap to Attack Button -->
    <button id="attackBtn" class="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 cursor-pointer flex items-center justify-center gap-2">
      ⚔️ TAP TO ATTACK (Damage: <span id="dmgText">10</span>)
    </button>

    <!-- Upgrades Shop -->
    <div class="space-y-2 pt-2 border-t border-slate-800">
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hero Weapon Upgrades:</span>
      <div class="grid grid-cols-2 gap-2">
        <button id="upgradeSwordBtn" onclick="buySword()" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-left transition-all cursor-pointer">
          <span class="text-xs font-bold text-white block">🗡️ Sharp Blade</span>
          <span class="text-[10px] text-amber-400 font-mono block mt-0.5">Cost: <span id="swordCost">50</span> Gold</span>
        </button>
        <button id="autoClickerBtn" onclick="buyAutoCompanion()" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-left transition-all cursor-pointer">
          <span class="text-xs font-bold text-white block">🧙 Wizard Companion</span>
          <span class="text-[10px] text-amber-400 font-mono block mt-0.5">Cost: <span id="compCost">150</span> Gold</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    let level = 1;
    let gold = 0;
    let attackPower = 10;
    let autoDps = 0;
    let maxHp = 100;
    let currentHp = 100;
    let swordCost = 50;
    let compCost = 150;

    const monsters = [
      { name: 'Shadow Goblin', icon: '👾', hp: 100, reward: 20 },
      { name: 'Crypt Skeleton', icon: '💀', hp: 220, reward: 50 },
      { name: 'Fire Elemental', icon: '🔥', hp: 450, reward: 120 },
      { name: 'Corrupted Dragon', icon: '🐲', hp: 1000, reward: 350 },
      { name: 'Void Overlord', icon: '👑', hp: 2500, reward: 1000 }
    ];

    function attackMonster() {
      currentHp -= attackPower;
      if (currentHp <= 0) {
        // Monster Defeated
        const currentMonster = monsters[(level - 1) % monsters.length];
        gold += currentMonster.reward;
        level++;
        document.getElementById('lvl').innerText = level;
        document.getElementById('gold').innerText = gold;

        const nextMonster = monsters[(level - 1) % monsters.length];
        maxHp = nextMonster.hp * Math.floor(1 + level * 0.3);
        currentHp = maxHp;
        document.getElementById('monsterName').innerText = nextMonster.name;
        document.getElementById('monsterAvatar').innerText = nextMonster.icon;
      }
      updateUi();
    }

    document.getElementById('attackBtn').addEventListener('click', attackMonster);
    document.getElementById('monsterAvatar').addEventListener('click', attackMonster);

    function updateUi() {
      const pct = Math.max(0, (currentHp / maxHp) * 100);
      document.getElementById('hpBar').style.width = pct + '%';
      document.getElementById('hpText').innerText = Math.max(0, currentHp) + ' / ' + maxHp + ' HP';
      document.getElementById('dmgText').innerText = attackPower;
      document.getElementById('gold').innerText = gold;
    }

    window.buySword = function() {
      if (gold >= swordCost) {
        gold -= swordCost;
        attackPower += 15;
        swordCost = Math.floor(swordCost * 1.6);
        document.getElementById('swordCost').innerText = swordCost;
        updateUi();
      } else {
        alert('Need more gold! Defeat more monsters.');
      }
    };

    window.buyAutoCompanion = function() {
      if (gold >= compCost) {
        gold -= compCost;
        autoDps += 10;
        compCost = Math.floor(compCost * 1.8);
        document.getElementById('compCost').innerText = compCost;
        updateUi();
      } else {
        alert('Need more gold! Defeat more monsters.');
      }
    };

    // Auto DPS interval
    setInterval(() => {
      if (autoDps > 0) {
        currentHp -= autoDps;
        if (currentHp <= 0) attackMonster();
        else updateUi();
      }
    }, 1000);
  </script>
</body>
</html>`;
}

// =========================================================================
// 6. PUBG Battle Royale Survival Engine (Island, Parachute, Blue Zone, Loot, Bots, Chicken Dinner)
// =========================================================================
export function generatePubgBattleRoyaleHtml(title: string, settings: GameSettings): string {
  const soundOn = settings.soundEnabled !== false;
  const initialBots = settings.difficulty === 'easy' ? 12 : settings.difficulty === 'hard' ? 24 : 18;
  const pSpeed = settings.playerSpeed || 3.2;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    body, html { margin: 0; padding: 0; overflow: hidden; background: #0b0f19; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    canvas { display: block; width: 100vw; height: 100vh; background: #1a3321; transform: translateZ(0); will-change: transform; backface-visibility: hidden; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .hud-glass { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.12); }
  </style>
</head>
<body class="relative text-white select-none">
  <!-- HUD Top Bar -->
  <div class="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between pointer-events-none z-20">
    <!-- Player Stats & Health -->
    <div class="flex items-center gap-3">
      <div class="hud-glass px-3.5 py-2 rounded-2xl flex items-center gap-3 shadow-2xl">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm">
          🪖
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Health</span>
            <span id="hpText" class="text-xs font-mono font-bold text-emerald-400">100 / 100</span>
          </div>
          <div class="w-28 sm:w-40 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-700/80 mt-1">
            <div id="hpBar" class="bg-gradient-to-r from-emerald-500 to-green-400 h-full w-full transition-all duration-150"></div>
          </div>
        </div>
      </div>

      <!-- Armor & Helmet -->
      <div class="hidden sm:flex hud-glass px-3 py-2 rounded-2xl items-center gap-3 shadow-lg">
        <div class="text-[11px] font-bold text-slate-300">
          <div>🛡️ Vest: <span id="vestEl" class="text-amber-400 font-mono">Lvl 2</span></div>
          <div>🪖 Helmet: <span id="helmEl" class="text-cyan-400 font-mono">Lvl 2</span></div>
        </div>
      </div>
    </div>

    <!-- Alive & Kills Counter (PUBG Style) -->
    <div class="flex items-center gap-2">
      <div class="hud-glass px-3.5 py-1.5 rounded-2xl text-center shadow-xl">
        <span class="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Alive</span>
        <span id="aliveCount" class="text-lg sm:text-xl font-black text-amber-400 mono leading-none">${initialBots + 1}</span>
      </div>
      <div class="hud-glass px-3.5 py-1.5 rounded-2xl text-center shadow-xl">
        <span class="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Kills</span>
        <span id="killCount" class="text-lg sm:text-xl font-black text-rose-400 mono leading-none">0</span>
      </div>
      <div class="hud-glass px-3.5 py-1.5 rounded-2xl text-center shadow-xl">
        <span class="text-[9px] text-cyan-400 font-bold uppercase block tracking-wider">Zone</span>
        <span id="zoneTimer" class="text-sm font-black text-cyan-300 mono leading-none">30s</span>
      </div>
    </div>
  </div>

  <!-- Killfeed in top right corner -->
  <div id="killfeed" class="absolute top-20 right-4 space-y-1.5 pointer-events-none z-20 max-w-xs text-right">
    <!-- Populated by JS -->
  </div>

  <!-- Minimap (Top Right below HUD) -->
  <div class="absolute top-20 left-4 pointer-events-none z-20">
    <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden hud-glass relative shadow-2xl border-2 border-indigo-500/40">
      <canvas id="miniCanvas" width="144" height="144" class="w-full h-full block bg-emerald-950"></canvas>
      <div class="absolute bottom-1 left-2 text-[9px] font-bold text-slate-300 tracking-wider">MAP</div>
    </div>
  </div>

  <!-- Zone Warning Banner -->
  <div id="zoneWarning" class="hidden absolute top-28 left-0 right-0 text-center pointer-events-none z-20">
    <span class="hud-glass border border-rose-500/60 text-rose-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl animate-pulse">
      ⚠️ BLUE ZONE IS SHRINKING! MOVE TO SAFE CIRCLE!
    </span>
  </div>

  <!-- Bottom Weapon Bar & Controls -->
  <div class="absolute bottom-4 left-0 right-0 px-4 sm:px-8 flex items-end justify-between pointer-events-none z-20">
    <!-- Active Weapon & Ammo -->
    <div class="pointer-events-auto flex items-center gap-2">
      <!-- Gun 1 -->
      <button onclick="switchWeapon(0)" id="gunSlot0" class="hud-glass p-2.5 sm:p-3 rounded-2xl border-2 border-amber-400/80 text-left cursor-pointer transition-transform active:scale-95 shadow-xl">
        <div class="flex items-center justify-between gap-3">
          <span class="text-xs sm:text-sm font-black text-white">M416 (AR)</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">5.56mm</span>
        </div>
        <div class="flex items-baseline gap-1 mt-1 font-mono">
          <span id="gun0Ammo" class="text-base sm:text-lg font-black text-white">30</span>
          <span class="text-[10px] text-slate-400">/ 120</span>
        </div>
      </button>

      <!-- Gun 2 -->
      <button onclick="switchWeapon(1)" id="gunSlot1" class="hud-glass p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 text-left cursor-pointer transition-transform active:scale-95 shadow-xl opacity-70">
        <div class="flex items-center justify-between gap-3">
          <span class="text-xs sm:text-sm font-black text-white">AWM Sniper</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">.300 Mag</span>
        </div>
        <div class="flex items-baseline gap-1 mt-1 font-mono">
          <span id="gun1Ammo" class="text-base sm:text-lg font-black text-white">5</span>
          <span class="text-[10px] text-slate-400">/ 15</span>
        </div>
      </button>

      <!-- Medkit / Heal Button -->
      <button onclick="useMedkit()" id="medkitBtn" class="hud-glass p-2.5 sm:p-3 rounded-2xl border border-emerald-500/40 text-center cursor-pointer active:scale-95 shadow-xl flex flex-col items-center">
        <span class="text-lg">💉</span>
        <span class="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">Heal (x<span id="medCount">2</span>)</span>
      </button>
    </div>

    <!-- Mobile Virtual Controls -->
    <div class="flex items-center gap-3 pointer-events-auto">
      <!-- Reload Button -->
      <button onclick="reloadActiveWeapon()" class="w-14 h-14 rounded-2xl hud-glass border border-amber-500/40 text-amber-300 font-black text-xs flex flex-col items-center justify-center active:bg-amber-600/30 cursor-pointer shadow-xl">
        <span class="text-sm">🔄</span>
        <span class="text-[9px]">RELOAD</span>
      </button>

      <!-- Loot Button -->
      <button onclick="pickNearbyLoot()" id="lootBtn" class="w-14 h-14 rounded-2xl hud-glass border border-cyan-500/40 text-cyan-300 font-black text-xs flex flex-col items-center justify-center active:bg-cyan-600/30 cursor-pointer shadow-xl">
        <span class="text-sm">🎒</span>
        <span class="text-[9px]">LOOT [E]</span>
      </button>

      <!-- Mobile Fire Button -->
      <button id="mobileFireBtn" class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white font-black text-sm flex flex-col items-center justify-center active:scale-90 border-2 border-white/40 shadow-2xl shadow-rose-600/50 cursor-pointer">
        <span class="text-xl">🔥</span>
        <span class="text-[10px] tracking-wider">FIRE</span>
      </button>
    </div>
  </div>

  <!-- Victory Screen (Winner Winner Chicken Dinner) -->
  <div id="victoryModal" class="hidden absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-40">
    <div class="bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95">
      <div class="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/50 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30">
        🍗
      </div>
      <div>
        <span class="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">#1 VICTORY ROYALE</span>
        <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight">WINNER WINNER<br><span class="text-amber-400">CHICKEN DINNER!</span></h1>
        <p class="text-xs text-slate-300 mt-2">عشاء الدجاج للفائز! لقد تفوقت على جميع اللاعبين وصمدت حتى النهاية.</p>
      </div>

      <div class="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div>
          <span class="text-[10px] text-slate-400 font-bold uppercase block">Kills</span>
          <span id="winKills" class="text-2xl font-black text-amber-400 mono">0</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-bold uppercase block">Rank</span>
          <span class="text-2xl font-black text-emerald-400 mono">#1 / ${initialBots + 1}</span>
        </div>
      </div>

      <button onclick="restartGame()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-amber-500/30 cursor-pointer">
        Play Next Match (العب مباراة جديدة)
      </button>
    </div>
  </div>

  <!-- Game Over Screen -->
  <div id="defeatModal" class="hidden absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-40">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
      <div class="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-4xl shadow-xl">
        💀
      </div>
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">MATCH ENDED</span>
        <h2 class="text-2xl font-black text-white">YOU WERE ELIMINATED</h2>
        <p class="text-xs text-slate-400 mt-1">Better luck next time!</p>
      </div>

      <div class="flex items-center justify-around p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
        <div>
          <span class="text-[10px] text-slate-400 uppercase font-bold block">Final Rank</span>
          <span id="finalRank" class="text-xl font-black text-rose-400 mono">#0</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 uppercase font-bold block">Total Kills</span>
          <span id="defeatKills" class="text-xl font-black text-amber-400 mono">0</span>
        </div>
      </div>

      <button onclick="restartGame()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 cursor-pointer">
        Drop In Again (هبوط من جديد)
      </button>
    </div>
  </div>

  <!-- Game Canvas -->
  <canvas id="gameCanvas"></canvas>

  <script>
    // ==========================================
    // Web Audio Synthesizer (Realistic PUBG Sounds)
    // ==========================================
    const AudioSynth = {
      ctx: null,
      enabled: ${soundOn},
      init() {
        if (!this.ctx && typeof AudioContext !== 'undefined') {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
      },
      playShot(type = 'ar') {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (type === 'sniper') {
          // AWM Heavy Shot
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
          gain.gain.setValueAtTime(0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(now + 0.35);
        } else {
          // M416 / AKM Burst
          osc.type = 'square';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(now + 0.12);
        }
      },
      playReload() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.3);
      },
      playLoot() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.2);
      },
      playChickenDinner() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.14);
          gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.14 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.14);
          osc.stop(this.ctx.currentTime + idx * 0.14 + 0.35);
        });
      }
    };

    // ==========================================
    // Game Canvas, World & State
    // ==========================================
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true }) || canvas.getContext('2d');
    canvas.style.transform = 'translateZ(0)';
    canvas.style.willChange = 'transform';
    const miniCanvas = document.getElementById('miniCanvas');
    const miniCtx = miniCanvas.getContext('2d');

    const WORLD_SIZE = 2400;
    let cameraX = 0;
    let cameraY = 0;
    let gameRunning = true;
    let isVictory = false;

    // Player Object
    const player = {
      x: WORLD_SIZE / 2,
      y: WORLD_SIZE / 2,
      radius: 18,
      speed: ${pSpeed},
      angle: 0,
      hp: 100,
      maxHp: 100,
      vestLvl: 2,
      helmetLvl: 2,
      medkits: 2,
      kills: 0,
      activeWeaponIdx: 0,
      weapons: [
        { name: 'M416 (AR)', type: 'ar', magSize: 30, currentMag: 30, totalAmmo: 120, damage: 28, fireRate: 110, lastFired: 0, range: 600, color: '#f59e0b' },
        { name: 'AWM Sniper', type: 'sniper', magSize: 5, currentMag: 5, totalAmmo: 15, damage: 95, fireRate: 850, lastFired: 0, range: 950, color: '#a855f7' }
      ]
    };

    // Blue Zone & Safe Circle
    let zonePhase = 1;
    let zoneTimer = 30; // seconds
    let blueZoneRadius = WORLD_SIZE * 0.65;
    let blueZoneCenter = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
    let safeZoneRadius = WORLD_SIZE * 0.45;
    let safeZoneCenter = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
    let zoneShrinking = false;

    // World Elements: Trees, Buildings, Loot Crates
    const trees = [];
    for (let i = 0; i < 90; i++) {
      trees.push({
        x: Math.random() * (WORLD_SIZE - 200) + 100,
        y: Math.random() * (WORLD_SIZE - 200) + 100,
        radius: 26 + Math.random() * 20
      });
    }

    const buildings = [
      { x: 400, y: 500, w: 220, h: 160, color: '#334155' },
      { x: 1400, y: 400, w: 280, h: 200, color: '#334155' },
      { x: 800, y: 1300, w: 260, h: 180, color: '#334155' },
      { x: 1600, y: 1500, w: 240, h: 220, color: '#334155' },
      { x: 1100, y: 900, w: 200, h: 140, color: '#1e293b' }
    ];

    // Ground Loot Items
    const lootItems = [];
    const lootTypes = [
      { name: '5.56 Ammo Box', icon: '📦', color: '#10b981', action: () => { player.weapons[0].totalAmmo += 30; } },
      { name: '.300 Mag Ammo', icon: '🎯', color: '#8b5cf6', action: () => { player.weapons[1].totalAmmo += 5; } },
      { name: 'First Aid Kit', icon: '💉', color: '#ef4444', action: () => { player.medkits += 1; } },
      { name: 'Level 3 Vest', icon: '🛡️', color: '#f59e0b', action: () => { player.vestLvl = 3; document.getElementById('vestEl').innerText = 'Lvl 3'; } },
      { name: 'Level 3 Helmet', icon: '🪖', color: '#06b6d4', action: () => { player.helmetLvl = 3; document.getElementById('helmEl').innerText = 'Lvl 3'; } }
    ];

    for (let i = 0; i < 45; i++) {
      const type = lootTypes[Math.floor(Math.random() * lootTypes.length)];
      lootItems.push({
        x: Math.random() * (WORLD_SIZE - 200) + 100,
        y: Math.random() * (WORLD_SIZE - 200) + 100,
        ...type
      });
    }

    // Bots (Enemies)
    const bots = [];
    const botNames = [
      'Player_Shadow', 'Ghost_Rider', 'Viper99', 'Nova_Sniper', 'Tornado_X', 
      'Apex_Predator', 'Iron_Clad', 'Falcon_Eye', 'Raptor_88', 'Silent_Reaper',
      'Desert_Fox', 'Frost_Bite', 'Skull_Crusher', 'Delta_One', 'Thunder_Bolt',
      'Alpha_Wolf', 'Specter_7', 'Night_Stalker', 'Blaze_Fury', 'Zero_Hero'
    ];

    for (let i = 0; i < ${initialBots}; i++) {
      bots.push({
        id: i,
        name: botNames[i % botNames.length] + '_' + Math.floor(Math.random() * 90 + 10),
        x: Math.random() * (WORLD_SIZE - 400) + 200,
        y: Math.random() * (WORLD_SIZE - 400) + 200,
        radius: 18,
        speed: 2.2 + Math.random() * 0.8,
        hp: 100,
        maxHp: 100,
        angle: Math.random() * Math.PI * 2,
        changeDirTimer: Math.random() * 60,
        shootCooldown: Math.random() * 120 + 60,
        alive: true,
        color: '#f43f5e'
      });
    }

    // Bullets Array
    const bullets = [];
    // Particles Array
    const particles = [];

    // Keys State
    const keys = {};
    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isMouseDown = false;

    // Resize Handler
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Event Listeners for Keyboard & Mouse
    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === 'r' || e.key === 'R') reloadActiveWeapon();
      if (e.key === 'e' || e.key === 'E') pickNearbyLoot();
      if (e.key === '1') switchWeapon(0);
      if (e.key === '2') switchWeapon(1);
    });

    window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isMouseDown = true;
        AudioSynth.init();
      }
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    // Touch Support for Mobile
    const mobileFireBtn = document.getElementById('mobileFireBtn');
    mobileFireBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isMouseDown = true;
      AudioSynth.init();
    });
    mobileFireBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      isMouseDown = false;
    });

    // Weapon Switching
    window.switchWeapon = function(idx) {
      player.activeWeaponIdx = idx;
      document.getElementById('gunSlot0').className = idx === 0 
        ? 'hud-glass p-2.5 sm:p-3 rounded-2xl border-2 border-amber-400/80 text-left cursor-pointer shadow-xl' 
        : 'hud-glass p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 text-left cursor-pointer opacity-70';
      document.getElementById('gunSlot1').className = idx === 1 
        ? 'hud-glass p-2.5 sm:p-3 rounded-2xl border-2 border-amber-400/80 text-left cursor-pointer shadow-xl' 
        : 'hud-glass p-2.5 sm:p-3 rounded-2xl border border-slate-700/80 text-left cursor-pointer opacity-70';
      AudioSynth.playReload();
    };

    // Reloading
    window.reloadActiveWeapon = function() {
      const w = player.weapons[player.activeWeaponIdx];
      const needed = w.magSize - w.currentMag;
      if (needed <= 0 || w.totalAmmo <= 0) return;
      const toReload = Math.min(needed, w.totalAmmo);
      w.totalAmmo -= toReload;
      w.currentMag += toReload;
      AudioSynth.playReload();
      updateAmmoUi();
    };

    // Looting
    window.pickNearbyLoot = function() {
      for (let i = lootItems.length - 1; i >= 0; i--) {
        const item = lootItems[i];
        const dist = Math.hypot(player.x - item.x, player.y - item.y);
        if (dist < 60) {
          item.action();
          AudioSynth.playLoot();
          addKillfeed(\`You picked up \${item.name}\`, '#38bdf8');
          lootItems.splice(i, 1);
          updateAmmoUi();
          document.getElementById('medCount').innerText = player.medkits;
          break;
        }
      }
    };

    // Healing
    window.useMedkit = function() {
      if (player.medkits > 0 && player.hp < player.maxHp) {
        player.medkits--;
        player.hp = Math.min(player.maxHp, player.hp + 50);
        document.getElementById('medCount').innerText = player.medkits;
        updateHpUi();
        AudioSynth.playLoot();
        addKillfeed('Used Medkit (+50 HP)', '#10b981');
      }
    };

    function updateAmmoUi() {
      document.getElementById('gun0Ammo').innerText = player.weapons[0].currentMag;
      document.getElementById('gun1Ammo').innerText = player.weapons[1].currentMag;
    }

    function updateHpUi() {
      const pct = Math.max(0, (player.hp / player.maxHp) * 100);
      document.getElementById('hpBar').style.width = pct + '%';
      document.getElementById('hpText').innerText = Math.round(player.hp) + ' / ' + player.maxHp;
      if (pct < 30) {
        document.getElementById('hpBar').className = 'bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all';
      } else {
        document.getElementById('hpBar').className = 'bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all';
      }
    }

    function addKillfeed(text, color = '#f87171') {
      const kf = document.getElementById('killfeed');
      const msg = document.createElement('div');
      msg.className = 'text-xs font-bold px-2.5 py-1 rounded-xl hud-glass shadow transition-opacity';
      msg.style.color = color;
      msg.innerText = text;
      kf.appendChild(msg);
      setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 400);
      }, 3500);
    }

    // Fire bullet
    function shootBullet(shooter, targetAngle, isPlayer = false) {
      const weapon = shooter.weapons ? shooter.weapons[shooter.activeWeaponIdx] : { damage: 18, type: 'ar' };
      if (isPlayer) {
        const now = Date.now();
        if (now - weapon.lastFired < weapon.fireRate) return;
        if (weapon.currentMag <= 0) {
          reloadActiveWeapon();
          return;
        }
        weapon.lastFired = now;
        weapon.currentMag--;
        updateAmmoUi();
        AudioSynth.playShot(weapon.type);
      }

      bullets.push({
        x: shooter.x + Math.cos(targetAngle) * (shooter.radius + 5),
        y: shooter.y + Math.sin(targetAngle) * (shooter.radius + 5),
        vx: Math.cos(targetAngle) * 14,
        vy: Math.sin(targetAngle) * 14,
        damage: weapon.damage,
        isPlayerBullet: isPlayer,
        shooterId: isPlayer ? 'player' : shooter.id,
        life: 55,
        color: isPlayer ? '#fbbf24' : '#f87171'
      });
    }

    // Zone Timer Countdown Loop
    setInterval(() => {
      if (!gameRunning) return;
      zoneTimer--;
      if (zoneTimer <= 0) {
        zoneShrinking = true;
        document.getElementById('zoneWarning').classList.remove('hidden');
        setTimeout(() => document.getElementById('zoneWarning').classList.add('hidden'), 5000);
        zoneTimer = 35;
      }
      document.getElementById('zoneTimer').innerText = zoneTimer + 's';

      // Blue zone damage check
      const distFromCenter = Math.hypot(player.x - blueZoneCenter.x, player.y - blueZoneCenter.y);
      if (distFromCenter > blueZoneRadius) {
        player.hp -= 4; // Zone damage
        updateHpUi();
        if (player.hp <= 0) handlePlayerDefeat();
      }
    }, 1000);

    // Main Game Loop (60 FPS)
    function gameLoop() {
      if (!gameRunning) return;

      // 1. Move Player
      let dx = 0;
      let dy = 0;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      player.x += dx * player.speed;
      player.y += dy * player.speed;

      // Restrict player inside world
      player.x = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(WORLD_SIZE - player.radius, player.y));

      // Calculate Player Angle based on mouse position
      const screenCenterX = canvas.width / 2;
      const screenCenterY = canvas.height / 2;
      player.angle = Math.atan2(mousePos.y - screenCenterY, mousePos.x - screenCenterX);

      // Player Firing
      if (isMouseDown) {
        shootBullet(player, player.angle, true);
      }

      // Camera smoothly tracks player
      cameraX = player.x - screenCenterX;
      cameraY = player.y - screenCenterY;

      // 2. Shrink Blue Zone
      if (zoneShrinking) {
        if (blueZoneRadius > safeZoneRadius) {
          blueZoneRadius -= 0.6;
          blueZoneCenter.x += (safeZoneCenter.x - blueZoneCenter.x) * 0.002;
          blueZoneCenter.y += (safeZoneCenter.y - blueZoneCenter.y) * 0.002;
        } else {
          zoneShrinking = false;
          // Set new safe zone inside the blue zone
          safeZoneRadius *= 0.65;
          safeZoneCenter.x = blueZoneCenter.x + (Math.random() - 0.5) * (blueZoneRadius * 0.4);
          safeZoneCenter.y = blueZoneCenter.y + (Math.random() - 0.5) * (blueZoneRadius * 0.4);
        }
      }

      // 3. Update Bots
      let aliveBotsCount = 0;
      bots.forEach((bot) => {
        if (!bot.alive) return;
        aliveBotsCount++;

        // Bot AI behavior
        bot.changeDirTimer--;
        if (bot.changeDirTimer <= 0) {
          // Check if player is near
          const distToPlayer = Math.hypot(player.x - bot.x, player.y - bot.y);
          if (distToPlayer < 450) {
            // Move toward player & aim
            bot.angle = Math.atan2(player.y - bot.y, player.x - bot.x);
          } else {
            // Wander or head toward safe zone
            const distToSafe = Math.hypot(safeZoneCenter.x - bot.x, safeZoneCenter.y - bot.y);
            if (distToSafe > safeZoneRadius) {
              bot.angle = Math.atan2(safeZoneCenter.y - bot.y, safeZoneCenter.x - bot.x);
            } else {
              bot.angle += (Math.random() - 0.5) * 1.5;
            }
          }
          bot.changeDirTimer = 30 + Math.random() * 50;
        }

        bot.x += Math.cos(bot.angle) * bot.speed;
        bot.y += Math.sin(bot.angle) * bot.speed;
        bot.x = Math.max(bot.radius, Math.min(WORLD_SIZE - bot.radius, bot.x));
        bot.y = Math.max(bot.radius, Math.min(WORLD_SIZE - bot.radius, bot.y));

        // Bot Shooting at Player if in line of sight
        const distToPlayer = Math.hypot(player.x - bot.x, player.y - bot.y);
        if (distToPlayer < 380) {
          bot.shootCooldown--;
          if (bot.shootCooldown <= 0) {
            shootBullet(bot, Math.atan2(player.y - bot.y, player.x - bot.x), false);
            bot.shootCooldown = 60 + Math.random() * 40;
          }
        }
      });

      document.getElementById('aliveCount').innerText = aliveBotsCount + (player.hp > 0 ? 1 : 0);

      // Check Victory Condition
      if (aliveBotsCount === 0 && player.hp > 0 && !isVictory) {
        handlePlayerVictory();
      }

      // 4. Update Bullets & Collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life--;

        // Check collision with trees
        for (const t of trees) {
          if (Math.hypot(b.x - t.x, b.y - t.y) < t.radius) {
            b.life = 0;
            break;
          }
        }

        // Player bullet hitting bots
        if (b.isPlayerBullet) {
          for (const bot of bots) {
            if (bot.alive && Math.hypot(b.x - bot.x, b.y - bot.y) < bot.radius + 4) {
              bot.hp -= b.damage;
              b.life = 0;
              // Spawn hit particles
              for (let p = 0; p < 4; p++) {
                particles.push({
                  x: bot.x, y: bot.y,
                  vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                  life: 15, color: '#ef4444'
                });
              }

              if (bot.hp <= 0) {
                bot.alive = false;
                player.kills++;
                document.getElementById('killCount').innerText = player.kills;
                addKillfeed(\`You eliminated \${bot.name} with \${player.weapons[player.activeWeaponIdx].name}!\`, '#34d399');
                // Drop loot crate
                lootItems.push({
                  x: bot.x, y: bot.y,
                  name: 'Death Crate: Ammo & Medkit',
                  icon: '🎁',
                  color: '#fbbf24',
                  action: () => {
                    player.weapons[0].totalAmmo += 60;
                    player.weapons[1].totalAmmo += 10;
                    player.medkits += 1;
                  }
                });
              }
              break;
            }
          }
        } else {
          // Bot bullet hitting player
          if (Math.hypot(b.x - player.x, b.y - player.y) < player.radius + 4) {
            // Apply vest & helmet reduction
            const damageReduction = player.vestLvl === 3 ? 0.55 : 0.7;
            player.hp -= b.damage * damageReduction;
            b.life = 0;
            updateHpUi();

            if (player.hp <= 0) {
              handlePlayerDefeat();
            }
          }
        }

        if (b.life <= 0) {
          bullets.splice(i, 1);
        }
      }

      // Update Particles
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) particles.splice(p, 1);
      }

      // 5. RENDER CANVAS SCENE
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // Optimized Viewport Culling & Grid Rendering (Zero Lag)
      const vpLeft = cameraX - 80;
      const vpRight = cameraX + canvas.width + 80;
      const vpTop = cameraY - 80;
      const vpBottom = cameraY + canvas.height + 80;

      // Draw Island Grass
      ctx.fillStyle = '#14281a';
      ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

      // Only draw grid lines visible in viewport
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const startGx = Math.max(0, Math.floor(vpLeft / 120) * 120);
      const endGx = Math.min(WORLD_SIZE, Math.ceil(vpRight / 120) * 120);
      for (let gx = startGx; gx <= endGx; gx += 120) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, WORLD_SIZE);
        ctx.stroke();
      }
      const startGy = Math.max(0, Math.floor(vpTop / 120) * 120);
      const endGy = Math.min(WORLD_SIZE, Math.ceil(vpBottom / 120) * 120);
      for (let gy = startGy; gy <= endGy; gy += 120) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(WORLD_SIZE, gy);
        ctx.stroke();
      }

      // Safe Zone (White Dashed Circle)
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(safeZoneCenter.x, safeZoneCenter.y, safeZoneRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Blue Zone (Electric Cyan Circle)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(blueZoneCenter.x, blueZoneCenter.y, blueZoneRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Buildings (with viewport culling)
      buildings.forEach((b) => {
        if (b.x + b.w < vpLeft || b.x > vpRight || b.y + b.h < vpTop || b.y > vpBottom) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      });

      // Draw Ground Loot (with viewport culling)
      lootItems.forEach((item) => {
        if (item.x < vpLeft || item.x > vpRight || item.y < vpTop || item.y > vpBottom) return;
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, item.x, item.y);
      });

      // Draw Bots (with viewport culling)
      bots.forEach((bot) => {
        if (!bot.alive) return;
        if (bot.x < vpLeft || bot.x > vpRight || bot.y < vpTop || bot.y > vpBottom) return;
        ctx.save();
        ctx.translate(bot.x, bot.y);
        ctx.rotate(bot.angle);

        // Body
        ctx.fillStyle = bot.color;
        ctx.beginPath();
        ctx.arc(0, 0, bot.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gun Barrel
        ctx.fillStyle = '#475569';
        ctx.fillRect(bot.radius - 2, -3, 14, 6);
        ctx.restore();

        // Bot Health Bar above head
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(bot.x - 20, bot.y - 30, 40, 5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(bot.x - 20, bot.y - 30, (bot.hp / bot.maxHp) * 40, 5);
      });

      // Draw Player
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Player Body
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Active Weapon Barrel
      const w = player.weapons[player.activeWeaponIdx];
      ctx.fillStyle = w.color;
      ctx.fillRect(player.radius - 2, -4, w.type === 'sniper' ? 24 : 16, 8);
      ctx.restore();

      // Draw Trees (Above entities for canopy cover)
      trees.forEach((t) => {
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Bullets
      bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // 6. RENDER MINIMAP (Throttled to every 3rd frame for zero CPU lag)
      if (++minimapFrameCounter % 3 === 0) {
        renderMinimap();
      }

      requestAnimationFrame(gameLoop);
    }

    let minimapFrameCounter = 0;
    function renderMinimap() {
      const scale = miniCanvas.width / WORLD_SIZE;
      miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
      miniCtx.fillStyle = '#0f291e';
      miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height);

      // Safe Zone on Minimap
      miniCtx.setLineDash([2, 2]);
      miniCtx.strokeStyle = '#ffffff';
      miniCtx.lineWidth = 1.5;
      miniCtx.beginPath();
      miniCtx.arc(safeZoneCenter.x * scale, safeZoneCenter.y * scale, safeZoneRadius * scale, 0, Math.PI * 2);
      miniCtx.stroke();

      // Blue Zone on Minimap
      miniCtx.setLineDash([]);
      miniCtx.strokeStyle = '#06b6d4';
      miniCtx.lineWidth = 2;
      miniCtx.beginPath();
      miniCtx.arc(blueZoneCenter.x * scale, blueZoneCenter.y * scale, blueZoneRadius * scale, 0, Math.PI * 2);
      miniCtx.stroke();

      // Player Blip
      miniCtx.fillStyle = '#60a5fa';
      miniCtx.beginPath();
      miniCtx.arc(player.x * scale, player.y * scale, 3.5, 0, Math.PI * 2);
      miniCtx.fill();

      // Bot Blips (Only if firing or nearby)
      bots.forEach((bot) => {
        if (bot.alive && Math.hypot(player.x - bot.x, player.y - bot.y) < 400) {
          miniCtx.fillStyle = '#f43f5e';
          miniCtx.beginPath();
          miniCtx.arc(bot.x * scale, bot.y * scale, 2, 0, Math.PI * 2);
          miniCtx.fill();
        }
      });
    }

    function handlePlayerVictory() {
      isVictory = true;
      gameRunning = false;
      AudioSynth.playChickenDinner();
      document.getElementById('winKills').innerText = player.kills;
      document.getElementById('victoryModal').classList.remove('hidden');
    }

    function handlePlayerDefeat() {
      gameRunning = false;
      document.getElementById('defeatKills').innerText = player.kills;
      const aliveLeft = bots.filter(b => b.alive).length + 1;
      document.getElementById('finalRank').innerText = '#' + aliveLeft + ' / ${initialBots + 1}';
      document.getElementById('defeatModal').classList.remove('hidden');
    }

    window.restartGame = function() {
      window.location.reload();
    };

    // Start 60 FPS Loop
    requestAnimationFrame(gameLoop);
  </script>
</body>
</html>`;
}

