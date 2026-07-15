// Sonam's Student Support Showdown - game.js

// --- AUDIO SYNTHESIS & CONTROL ---
class SoundController {
  constructor() {
    this.ctx = null;
    
    // Main Game Action Theme
    this.music = new Audio();
    this.music.src = 'song/song.mp3';
    this.music.loop = true;
    this.music.preload = 'auto';
    
    // Villain / Menu Theme
    this.villainMusic = new Audio();
    this.villainMusic.src = 'song/song2.mp3';
    this.villainMusic.loop = true;
    this.villainMusic.preload = 'auto';
    
    // Victory Theme
    this.victoryMusic = new Audio();
    this.victoryMusic.src = 'song/song3.mp3';
    this.victoryMusic.loop = true;
    this.victoryMusic.preload = 'auto';
    
    this.isMuted = false;
    this.musicPlaying = false;
    this.activeTrack = null;
  }

  initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playVillainMusic() {
    this.initContext();
    if (this.isMuted) return;
    
    this.music.pause();
    this.victoryMusic.pause();
    this.villainMusic.play()
      .then(() => { 
        this.musicPlaying = true; 
        this.activeTrack = this.villainMusic;
      })
      .catch(e => console.log("Villain theme autoplay prevented. Will play on interaction.", e));
  }

  playGameMusic() {
    this.initContext();
    if (this.isMuted) return;
    
    this.villainMusic.pause();
    this.victoryMusic.pause();
    this.music.play()
      .then(() => { 
        this.musicPlaying = true; 
        this.activeTrack = this.music;
      })
      .catch(e => console.log("Game theme autoplay prevented. Will play on interaction.", e));
  }

  stopMusic() {
    if (this.activeTrack) {
      this.activeTrack.pause();
    }
    this.musicPlaying = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.music.muted = this.isMuted;
    this.villainMusic.muted = this.isMuted;
    this.victoryMusic.muted = this.isMuted;
    
    if (!this.isMuted) {
      if (this.activeTrack) {
        this.activeTrack.play().then(() => { this.musicPlaying = true; });
      } else {
        if (gameState === STATES.PLAYING) this.playGameMusic();
        else this.playVillainMusic();
      }
    } else {
      this.stopMusic();
    }
    return this.isMuted;
  }

  // Synthesize Arcade Jump Sound
  playJumpSound() {
    this.initContext();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Synthesize Collect Sound
  playEatSound() {
    this.initContext();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    
    const playNote = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.08, now + delay);
      gain.gain.linearRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(523.25, 0, 0.08); // C5
    playNote(659.25, 0.06, 0.12); // E5
  }

  // Synthesize Obstacle Hit Sound
  playHitSound() {
    this.initContext();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Synthesize Launch Attack Sound
  playAttackSound() {
    this.initContext();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Synthesize Projectile Hit Sound
  playExplosionSound() {
    this.initContext();
    if (this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Play Fanfare for Victory
  playVictoryMelody() {
    this.initContext();
    if (this.isMuted) return;
    
    this.music.pause();
    this.villainMusic.pause();
    this.victoryMusic.play()
      .then(() => {
        this.musicPlaying = true;
        this.activeTrack = this.victoryMusic;
      })
      .catch(e => console.log("Victory theme play blocked.", e));
  }

  // Play Defeat Tune
  playDefeatMelody() {
    this.initContext();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 293.66, d: 0.25 }, // D4
      { f: 277.18, d: 0.25 }, // C#4
      { f: 261.63, d: 0.25 }, // C4
      { f: 220.00, d: 0.6 }   // A3
    ];
    
    let timeAcc = 0;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, now + timeAcc);
      
      gain.gain.setValueAtTime(0.12, now + timeAcc);
      gain.gain.linearRampToValueAtTime(0.001, now + timeAcc + note.d);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + timeAcc);
      osc.stop(now + timeAcc + note.d);
      timeAcc += note.d * 1.05;
    });
  }
}

const sounds = new SoundController();

// --- GAME LOGIC ENGINE ---

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const STATES = {
  START_MENU: 'START_MENU',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};
let gameState = STATES.START_MENU;

// Load Avatars
const imgSonam = new Image();
imgSonam.src = 'Image/sonam.jpg';

const imgDharmendra = new Image();
imgDharmendra.src = 'Image/dharmendra.jpg';

const imgModi = new Image();
imgModi.src = 'Image/modi.jpg';

// Core Game Parameters
let score = 0;
let distance = 0;
let gameSpeed = 5;
let maxGameSpeed = 12;
let groundY = 410;
let globalTime = 0;
let screenShake = 0;

// Intro cutscene LERP sliding timer
let introTimer = 0;

// Spawning intervals
let spawnTimer = 0;
let spawnInterval = 90;

// Arrays
let collectibles = [];
let obstacles = [];
let projectiles = [];
let particles = [];
let texts = [];

// Simplified & Circular Text Elements
const COLLECTIBLE_TYPES = [
  { text: 'Support', power: 25, hp: 8, color: '#2ecc71' }
];

const OBSTACLE_TYPES = [
  { text: 'NEET Leak', damage: 20, color: '#ff3366' }
];

// Classes
class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 120;
    this.y = groundY - 70;
    this.radius = 35;
    this.vy = 0;
    this.gravity = 0.65;
    this.jumpForce = -13.5;
    this.isJumping = false;
    this.doubleJumpAvailable = true;
    this.isSliding = false;
    this.slideDuration = 0;
    
    this.health = 100;
    this.power = 0;
    this.isAttacking = false;
    this.attackCooldown = 0;
  }

  jump() {
    if (introTimer > 0) return; // Freeze during intro transition
    if (!this.isJumping) {
      this.vy = this.jumpForce;
      this.isJumping = true;
      this.doubleJumpAvailable = true;
      this.isSliding = false;
      sounds.playJumpSound();
    } else if (this.doubleJumpAvailable) {
      this.vy = this.jumpForce * 0.9;
      this.doubleJumpAvailable = false;
      sounds.playJumpSound();
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(this.x, this.y + this.radius, '#00f0ff', -2 + Math.random() * 4, 1 + Math.random() * 3));
      }
    }
  }

  slide() {
    if (introTimer > 0) return;
    if (this.isJumping) {
      this.vy = 12;
    } else {
      this.isSliding = true;
      this.slideDuration = 30;
    }
  }

  update() {
    if (this.isAttacking) {
      this.y += (groundY - 120 - this.y) * 0.1;
      this.vy = 0;
      return;
    }

    // Apply basic physics if not transitioning/attacking
    if (introTimer <= 0 && gameState === STATES.PLAYING) {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y > groundY - this.radius) {
        this.y = groundY - this.radius;
        this.vy = 0;
        this.isJumping = false;
      }

      if (this.isSliding) {
        this.slideDuration--;
        if (this.slideDuration <= 0) {
          this.isSliding = false;
        }
      }
    }
  }

  draw() {
    ctx.save();

    // Draw shadow
    ctx.beginPath();
    ctx.ellipse(this.x, groundY + 5, this.isSliding ? 45 : 30, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Draw circular image avatar
    ctx.beginPath();
    let currentRadius = this.radius;
    let drawY = this.y;
    
    if (this.isSliding) {
      currentRadius = this.radius * 0.8;
      drawY = this.y + this.radius * 0.4;
    }

    ctx.arc(this.x, drawY, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = this.power >= 100 ? '#ff007f' : '#2ecc71';
    ctx.lineWidth = this.power >= 100 ? 5 : 3;
    
    if (this.power >= 100) {
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 15;
    }
    
    ctx.stroke();
    ctx.clip();

    try {
      ctx.drawImage(imgSonam, this.x - currentRadius, drawY - currentRadius, currentRadius * 2, currentRadius * 2);
    } catch(e) {
      ctx.fillStyle = '#2ecc71';
      ctx.fill();
    }

    ctx.restore();
  }
}

class Villain {
  constructor(name, yPos, color, image) {
    this.name = name;
    this.originalY = yPos;
    this.x = 700;
    this.y = yPos;
    this.radius = 45;
    this.color = color;
    this.image = image;
    this.health = 100;
    this.isDefeated = false;
    this.bobOffset = Math.random() * 100;
    this.mood = 'NORMAL';
    this.moodTimer = 0;
  }

  update() {
    if (this.isDefeated) {
      this.x += 10;
      this.y += 10;
      return;
    }

    // Gentle bobbing (only if not transitioning)
    if (introTimer <= 0) {
      this.y = this.originalY + Math.sin((globalTime + this.bobOffset) / 15) * 15;
    }

    if (this.moodTimer > 0) {
      this.moodTimer--;
      if (this.moodTimer <= 0) {
        this.mood = 'NORMAL';
      }
    }
  }

  triggerMood(mood, duration) {
    this.mood = mood;
    this.moodTimer = duration;
  }

  draw() {
    if (this.isDefeated && this.x > 900) return;

    ctx.save();
    
    ctx.beginPath();
    ctx.ellipse(this.x, groundY + 10, 35, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    
    if (this.mood === 'LAUGHING') {
      ctx.shadowColor = '#f1c40f';
      ctx.shadowBlur = 15;
    } else if (this.mood === 'CRYING') {
      ctx.shadowColor = '#e74c3c';
      ctx.shadowBlur = 15;
    }
    
    ctx.stroke();
    ctx.clip();

    try {
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    } catch(e) {
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();

    if (this.mood !== 'NORMAL') {
      ctx.fillStyle = this.mood === 'LAUGHING' ? '#f1c40f' : '#e74c3c';
      ctx.font = 'bold 16px Orbitron';
      ctx.textAlign = 'center';
      
      let txt = '';
      if (this.mood === 'LAUGHING') txt = '😈 HAHA!';
      if (this.mood === 'CRYING') txt = '😭 OUCH!';
      
      ctx.fillText(txt, this.x, this.y - this.radius - 12);
    }
  }
}

class Item {
  constructor(type, isCollectible) {
    this.isCollectible = isCollectible;
    this.text = type.text;
    this.color = type.color;
    this.radius = 35;
    
    this.x = 850;
    const heights = [groundY - 35, groundY - 115, groundY - 195];
    this.y = heights[Math.floor(Math.random() * heights.length)];
    
    this.value = isCollectible ? type.power : type.damage;
    this.hpValue = isCollectible ? type.hp : 0;
    this.angle = 0;
  }

  update() {
    this.x -= gameSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#060714';
    ctx.fill();
    
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = this.text.split(' ');
    if (lines.length === 1) {
      ctx.fillText(lines[0], 0, 0);
    } else if (lines.length === 2) {
      ctx.fillText(lines[0], 0, -8);
      ctx.fillText(lines[1], 0, 8);
    } else {
      ctx.fillText(lines[0], 0, -13);
      ctx.fillText(lines[1], 0, 0);
      ctx.fillText(lines[2], 0, 13);
    }
    
    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, target, emoji) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.emoji = emoji;
    this.speed = 10;
    this.radius = 22; // Bigger radius to fit text
    this.angle = 0;
  }

  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 15) {
      this.target.health -= 10;
      this.target.triggerMood('CRYING', 25);
      sounds.playExplosionSound();
      
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(this.x, this.y, this.target.color, -3 + Math.random() * 6, -3 + Math.random() * 6));
      }
      
      texts.push(new FloatingText('-10 HP', this.target.x, this.target.y - 30, '#ff3366'));
      
      if (this.target.health <= 0) {
        this.target.health = 0;
        this.target.isDefeated = true;
        texts.push(new FloatingText(`${this.target.name.toUpperCase()} DEFEATED!`, this.target.x, this.target.y - 60, '#f1c40f', 24));
      }
      
      return true;
    }

    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
    this.angle += 0.15;
    return false;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#060714';
    ctx.fill();
    
    // Draw green neon outline
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2ecc71';
    ctx.shadowColor = '#2ecc71';
    ctx.shadowBlur = 8;
    ctx.stroke();
    
    // Draw "Support" text inside
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Support', 0, 0);
    
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.alpha = 1;
    this.decay = 0.02 + Math.random() * 0.03;
    this.size = 3 + Math.random() * 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.alpha -= this.decay;
    return this.alpha <= 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingText {
  constructor(text, x, y, color, size = 16) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.vy = -1.2;
    this.life = 40;
  }

  update() {
    this.y += this.vy;
    this.life--;
    return this.life <= 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life / 40;
    ctx.fillStyle = this.color;
    ctx.font = `bold ${this.size}px Orbitron`;
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Initializing Characters
let player = new Player();
let villains = [];

// Initialize game coordinates for menu or intro LERP start
function initGame(forMenu = false) {
  score = 0;
  distance = 0;
  gameSpeed = 5;
  collectibles = [];
  obstacles = [];
  projectiles = [];
  particles = [];
  texts = [];
  spawnTimer = 0;
  
  player.reset();
  
  if (forMenu) {
    // Cinematic surrounded setup on start menu:
    // Sonam in the center, Dharmendra on left, Modi on right
    player.x = 400;
    player.y = groundY - player.radius;
    
    villains = [
      new Villain('Dharmendra', 240, '#e74c3c', imgDharmendra),
      new Villain('Modi', 260, '#9b59b6', imgModi)
    ];
    villains[0].x = 280;
    villains[1].x = 520;
    
    introTimer = 0;
  } else {
    // When "Start Battle" is clicked, they start at their menu coordinates
    // and slide smoothly into their gameplay layout
    player.x = 400;
    player.y = groundY - player.radius;
    
    villains = [
      new Villain('Dharmendra', 240, '#e74c3c', imgDharmendra),
      new Villain('Modi', 260, '#9b59b6', imgModi)
    ];
    villains[0].x = 280;
    villains[0].triggerMood('LAUGHING', 70);
    
    villains[1].x = 520;
    villains[1].triggerMood('LAUGHING', 70);
    
    introTimer = 75; // 75 frames (1.25 seconds) of slide LERP animation
  }
  
  updateHUD();
}

// Spawner logic
function handleSpawning() {
  if (player.isAttacking || introTimer > 0) return;

  spawnTimer++;
  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;
    spawnInterval = 70 + Math.floor(Math.random() * 50);
    
    if (Math.random() < 0.65) {
      const type = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
      collectibles.push(new Item(type, true));
    } else {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      obstacles.push(new Item(type, false));
    }
  }

  // Active villains throw obstacles
  villains.forEach(v => {
    if (!v.isDefeated && Math.random() < 0.0035) {
      v.triggerMood('LAUGHING', 30);
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      let projectileObstacle = new Item(type, false);
      projectileObstacle.x = v.x - 30;
      projectileObstacle.y = v.y;
      obstacles.push(projectileObstacle);
      
      texts.push(new FloatingText("INCOMING!", v.x - 50, v.y - 20, '#ff007f', 12));
    }
  });
}

// Circle-to-Circle collision checking
function checkCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.hypot(dx, dy);
  return distance < (circle1.radius + circle2.radius);
}

// Perform Support Blast!
function triggerVeggieAttack() {
  if (player.power < 100 || player.isAttacking || gameState !== STATES.PLAYING || introTimer > 0) return;
  
  const target = villains.find(v => !v.isDefeated);
  if (!target) return;
  
  player.isAttacking = true;
  player.power = 0;
  updateHUD();
  
  sounds.playAttackSound();
  
  texts.push(new FloatingText("SUPPORT BLAST!!!", 400, 200, '#00f0ff', 36));
  
  let count = 0;
  const barrageInterval = setInterval(() => {
    if (gameState !== STATES.PLAYING) {
      clearInterval(barrageInterval);
      return;
    }
    
    const projTypes = ['🎓', '📚', '🎒', '✏️'];
    const emoji = projTypes[Math.floor(Math.random() * projTypes.length)];
    
    projectiles.push(new Projectile(player.x + 30, player.y, target, emoji));
    
    count++;
    if (count >= 10) {
      clearInterval(barrageInterval);
      setTimeout(() => {
        player.isAttacking = false;
      }, 600);
    }
  }, 120);
}

// Collisions and updates
function updatePhysics() {
  globalTime++;
  
  if (screenShake > 0) screenShake *= 0.9;
  
  // Cutscene intro transition LERP
  if (introTimer > 0) {
    introTimer--;
    
    // Lerp player to left gameplay coordinate (120)
    player.x += (120 - player.x) * 0.08;
    
    // Lerp Dharmendra to float position (700, 170)
    villains[0].x += (700 - villains[0].x) * 0.08;
    villains[0].y += (170 - villains[0].y) * 0.08;
    villains[0].originalY = villains[0].y;
    
    // Lerp Modi to float position (700, 290)
    villains[1].x += (700 - villains[1].x) * 0.08;
    villains[1].y += (290 - villains[1].y) * 0.08;
    villains[1].originalY = villains[1].y;
    
    player.update();
    
    // Transition music to game theme once intro ends
    if (introTimer === 0) {
      sounds.playGameMusic();
    }
    
    return; // Don't run items or spawning physics during intro cutscene
  }
  
  if (!player.isAttacking) {
    distance += Math.floor(gameSpeed / 4);
    if (gameSpeed < maxGameSpeed) {
      gameSpeed += 0.0005;
    }
  }

  player.update();
  villains.forEach(v => v.update());

  // Update Collectibles
  for (let i = collectibles.length - 1; i >= 0; i--) {
    let coll = collectibles[i];
    coll.update();
    
    if (checkCollision(player, coll)) {
      sounds.playEatSound();
      
      score += 15;
      player.health = Math.min(100, player.health + coll.hpValue);
      player.power = Math.min(100, player.power + coll.value);
      
      texts.push(new FloatingText(`+${coll.hpValue} HP`, player.x, player.y - 30, '#2ecc71'));
      
      for (let p = 0; p < 8; p++) {
        particles.push(new Particle(coll.x, coll.y, '#2ecc71', -3 + Math.random() * 6, -3 + Math.random() * 6));
      }
      
      collectibles.splice(i, 1);
      updateHUD();
    } else if (coll.x < -100) {
      villains.forEach(v => {
        if (!v.isDefeated && Math.random() < 0.25) {
          v.triggerMood('LAUGHING', 25);
        }
      });
      collectibles.splice(i, 1);
    }
  }

  // Update Obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();
    
    if (checkCollision(player, obs)) {
      sounds.playHitSound();
      screenShake = 15;
      
      player.health -= obs.value;
      player.power = Math.max(0, player.power - 12);
      
      texts.push(new FloatingText(`-${obs.value} HP`, player.x, player.y - 30, '#ff3366'));
      
      villains.forEach(v => {
        if (!v.isDefeated) {
          v.triggerMood('LAUGHING', 40);
        }
      });
      
      for (let p = 0; p < 12; p++) {
        particles.push(new Particle(obs.x, obs.y, '#ff3366', -4 + Math.random() * 8, -4 + Math.random() * 8));
      }
      
      obstacles.splice(i, 1);
      updateHUD();
      
      if (player.health <= 0) {
        player.health = 0;
        endGame(false);
      }
    } else if (obs.x < -100) {
      obstacles.splice(i, 1);
    }
  }

  // Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let finished = projectiles[i].update();
    if (finished) {
      projectiles.splice(i, 1);
    }
  }

  // Check Win condition
  const allDefeated = villains.every(v => v.isDefeated);
  if (allDefeated && projectiles.length === 0 && !player.isAttacking) {
    endGame(true);
  }

  // Particles & text updates
  for (let i = particles.length - 1; i >= 0; i--) {
    let remove = particles[i].update();
    if (remove) particles.splice(i, 1);
  }

  for (let i = texts.length - 1; i >= 0; i--) {
    let remove = texts[i].update();
    if (remove) texts.splice(i, 1);
  }
}

// --- RENDER GAME SCENE ---
function drawFloor() {
  ctx.save();
  ctx.fillStyle = '#0d0d1e';
  ctx.fillRect(0, groundY, 800, 90);
  
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(800, groundY);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  
  const lineSpacing = 18;
  for (let y = groundY + lineSpacing; y < 500; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  const lineSpeed = (globalTime * gameSpeed) % 40;
  ctx.beginPath();
  for (let x = -100; x < 900; x += 40) {
    ctx.moveTo(x - lineSpeed, groundY);
    ctx.lineTo(x - (lineSpeed * 1.5) - 40, 500);
  }
  ctx.stroke();

  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = '#05050f';
  ctx.fillRect(0, 0, 800, 500);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  const starSpeed = (globalTime * (gameSpeed / 8)) % 800;
  for (let i = 0; i < 25; i++) {
    let x = (i * 73) % 800 - starSpeed;
    if (x < 0) x += 800;
    let y = (i * 37) % (groundY - 100);
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  ctx.fillStyle = '#080816';
  const skylineSpeed = (globalTime * (gameSpeed / 4)) % 800;
  
  ctx.beginPath();
  ctx.moveTo(0 - skylineSpeed, groundY);
  ctx.lineTo(100 - skylineSpeed, groundY - 80);
  ctx.lineTo(180 - skylineSpeed, groundY - 50);
  ctx.lineTo(260 - skylineSpeed, groundY - 120);
  ctx.lineTo(340 - skylineSpeed, groundY - 70);
  ctx.lineTo(420 - skylineSpeed, groundY - 100);
  ctx.lineTo(500 - skylineSpeed, groundY - 40);
  ctx.lineTo(580 - skylineSpeed, groundY - 90);
  ctx.lineTo(660 - skylineSpeed, groundY - 60);
  ctx.lineTo(800 - skylineSpeed, groundY);
  
  ctx.moveTo(800 - skylineSpeed, groundY);
  ctx.lineTo(900 - skylineSpeed, groundY - 80);
  ctx.lineTo(980 - skylineSpeed, groundY - 50);
  ctx.lineTo(1060 - skylineSpeed, groundY - 120);
  ctx.lineTo(1140 - skylineSpeed, groundY - 70);
  ctx.lineTo(1220 - skylineSpeed, groundY - 100);
  ctx.lineTo(1300 - skylineSpeed, groundY - 40);
  ctx.lineTo(1380 - skylineSpeed, groundY - 90);
  ctx.lineTo(1460 - skylineSpeed, groundY - 60);
  ctx.lineTo(1600 - skylineSpeed, groundY);
  
  ctx.lineTo(1600, groundY);
  ctx.lineTo(0, groundY);
  ctx.fill();

  ctx.restore();
}

function drawScene() {
  ctx.save();
  
  if (screenShake > 0.5) {
    const dx = (Math.random() - 0.5) * screenShake;
    const dy = (Math.random() - 0.5) * screenShake;
    ctx.translate(dx, dy);
  }

  drawBackground();
  drawFloor();

  collectibles.forEach(v => v.draw());
  obstacles.forEach(o => o.draw());
  projectiles.forEach(p => p.draw());
  particles.forEach(p => p.draw());
  player.draw();
  villains.forEach(v => v.draw());
  texts.forEach(t => t.draw());

  ctx.restore();
}

// --- HUD & SCREEN MANAGEMENT ---

const domMenu = document.getElementById('menu-screen');
const domGameOver = document.getElementById('gameover-screen');
const domVictory = document.getElementById('victory-screen');
const domHud = document.getElementById('hud-overlay');

const elHp = document.getElementById('health-bar');
const elPower = document.getElementById('power-bar');
const elDharmendraHp = document.getElementById('dharmendra-health');
const elDharmendraRow = document.getElementById('dharmendra-hud-row');
const elModiHp = document.getElementById('modi-health');
const elModiRow = document.getElementById('modi-hud-row');

const elScore = document.getElementById('score-val');
const elDistance = document.getElementById('distance-val');
const elAttackIndicator = document.getElementById('attack-indicator');

const elAudioBtn = document.getElementById('audio-mute-btn');

function updateHUD() {
  elHp.style.width = `${player.health}%`;
  elPower.style.width = `${player.power}%`;
  
  const elMobileBlast = document.getElementById('mobile-btn-blast');
  if (player.power >= 100) {
    elPower.classList.add('charged');
    elAttackIndicator.classList.add('active');
    elAttackIndicator.innerText = "SUPPORT BLAST READY [SPACE]";
    if (elMobileBlast) elMobileBlast.classList.add('active');
  } else {
    elPower.classList.remove('charged');
    elAttackIndicator.classList.remove('active');
    elAttackIndicator.innerText = "COLLECT SUPPORT TO CHARGE";
    if (elMobileBlast) elMobileBlast.classList.remove('active');
  }

  elScore.innerText = score;
  elDistance.innerText = `${distance}m`;

  const v1 = villains.find(v => v.name === 'Dharmendra');
  const v2 = villains.find(v => v.name === 'Modi');

  if (v1) {
    elDharmendraHp.style.width = `${v1.health}%`;
    if (v1.isDefeated) elDharmendraRow.classList.add('villain-defeated');
    else elDharmendraRow.classList.remove('villain-defeated');
  }
  if (v2) {
    elModiHp.style.width = `${v2.health}%`;
    if (v2.isDefeated) elModiRow.classList.add('villain-defeated');
    else elModiRow.classList.remove('villain-defeated');
  }
}

function showScreen(screen) {
  domMenu.classList.add('hidden');
  domGameOver.classList.add('hidden');
  domVictory.classList.add('hidden');
  domHud.style.display = 'none';

  if (screen === STATES.START_MENU) {
    domMenu.classList.remove('hidden');
  } else if (screen === STATES.PLAYING) {
    domHud.style.display = 'flex';
  } else if (screen === STATES.GAME_OVER) {
    domGameOver.classList.remove('hidden');
    document.getElementById('final-score-lose').innerText = score;
    document.getElementById('final-dist-lose').innerText = `${distance}m`;
  } else if (screen === STATES.VICTORY) {
    domVictory.classList.remove('hidden');
    document.getElementById('final-score-win').innerText = score;
    document.getElementById('final-dist-win').innerText = `${distance}m`;
  }
}

function startGame() {
  gameState = STATES.PLAYING;
  initGame(false); // Play game (starts transition from menu positions)
  showScreen(STATES.PLAYING);
  
  // Start with the villain theme song2.mp3 playing during the surrounded intro
  sounds.playVillainMusic();
}

function endGame(isVictory) {
  sounds.stopMusic();
  if (isVictory) {
    gameState = STATES.VICTORY;
    showScreen(STATES.VICTORY);
    sounds.playVictoryMelody();
  } else {
    gameState = STATES.GAME_OVER;
    showScreen(STATES.GAME_OVER);
    sounds.playDefeatMelody();
  }
}

// --- EVENT LISTENERS & LOOP ---

document.getElementById('start-btn').addEventListener('click', () => {
  sounds.initContext();
  startGame();
});

document.querySelectorAll('.restart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    startGame();
  });
});

elAudioBtn.addEventListener('click', () => {
  const muted = sounds.toggleMute();
  elAudioBtn.innerHTML = muted 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
});

elAttackIndicator.addEventListener('click', () => {
  triggerVeggieAttack();
});

window.addEventListener('keydown', e => {
  if (gameState !== STATES.PLAYING) return;

  if (e.code === 'ArrowUp' || e.code === 'KeyW') {
    player.jump();
    e.preventDefault();
  }
  if (e.code === 'ArrowDown' || e.code === 'KeyS') {
    player.slide();
    e.preventDefault();
  }
  if (e.code === 'Space') {
    triggerVeggieAttack();
    e.preventDefault();
  }
});

canvas.addEventListener('touchstart', e => {
  if (gameState !== STATES.PLAYING) return;
  
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const relY = touch.clientY - rect.top;
  
  if (relY < rect.height / 2) {
    player.jump();
  } else {
    player.slide();
  }
  e.preventDefault();
}, { passive: false });

// Interaction listeners will play villain music on first user gesture

function loop() {
  if (gameState === STATES.PLAYING) {
    updatePhysics();
    handleSpawning();
    drawScene();
  } else {
    // Menu or ending screen: Render background & entities at their menu positions
    globalTime++;
    drawBackground();
    drawFloor();
    
    if (gameState === STATES.START_MENU) {
      // Lock them in the surrounding coordinates bobbing in center
      player.x = 400;
      player.y = groundY - player.radius;
      
      // Let villains bob up and down around player
      villains[0].x = 280;
      villains[0].y = 230 + Math.sin(globalTime / 15) * 12;
      
      villains[1].x = 520;
      villains[1].y = 250 + Math.cos(globalTime / 15) * 12;
    }
    
    player.draw();
    villains.forEach(v => v.draw());
    particles.forEach(p => {
      p.update();
      p.draw();
    });
  }
  
  requestAnimationFrame(loop);
}

// Start menu game setup
initGame(true); 
loop();
showScreen(STATES.START_MENU);

// Try playing the villain theme immediately on load
try {
  sounds.playVillainMusic();
} catch (e) {
  console.log("Immediate load autoplay blocked.");
}

// Bypasses browser security: Play villain music on first window gesture (mousedown, click, keydown, touch)
const startAudioEvents = ['click', 'mousedown', 'keydown', 'touchstart'];
const playVillainOnGesture = () => {
  if (gameState === STATES.START_MENU && !sounds.musicPlaying && !sounds.isMuted) {
    sounds.playVillainMusic();
  }
  startAudioEvents.forEach(event => {
    window.removeEventListener(event, playVillainOnGesture);
  });
};
startAudioEvents.forEach(event => {
  window.addEventListener(event, playVillainOnGesture, { once: true });
});

// Setup mobile on-screen touch and click button controls
const bindMobileControl = (id, callback) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  
  // Touch start triggers action immediately
  btn.addEventListener('touchstart', e => {
    callback();
    e.preventDefault();
  }, { passive: false });
  
  // Support desktop emulator mouse clicks
  btn.addEventListener('click', e => {
    callback();
    e.preventDefault();
  });
};

bindMobileControl('mobile-btn-jump', () => player.jump());
bindMobileControl('mobile-btn-slide', () => player.slide());
bindMobileControl('mobile-btn-blast', () => triggerVeggieAttack());

// Audio Gate Screen Handler (Bypasses autoplay blocks by capturing first touch/click)
const elGate = document.getElementById('audio-gate-screen');
if (elGate) {
  const dismissGate = () => {
    sounds.initContext();
    sounds.playVillainMusic();
    elGate.classList.add('hidden');
    setTimeout(() => {
      if (elGate.parentNode) elGate.parentNode.removeChild(elGate);
    }, 450);
  };
  
  elGate.addEventListener('click', e => {
    dismissGate();
    e.preventDefault();
  });
  elGate.addEventListener('touchstart', e => {
    dismissGate();
    e.preventDefault();
  }, { passive: false });
}
