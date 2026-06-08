// game.js — 游戏引擎，主循环和状态管理

// ── 单词库 ────────────────────────────────────────

const WORD_POOL = {
  easy: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
         'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
         'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did',
         'let', 'say', 'she', 'too', 'use', 'big', 'end', 'far', 'few', 'got',
         'run', 'set', 'top', 'try', 'ask', 'own', 'put', 'red', 'sit', 'win'],
  medium: ['about', 'after', 'again', 'below', 'could', 'every', 'first',
           'found', 'great', 'house', 'large', 'learn', 'never', 'other',
           'place', 'plant', 'point', 'right', 'small', 'sound', 'spell',
           'still', 'study', 'their', 'there', 'these', 'thing', 'think',
           'three', 'water', 'where', 'which', 'world', 'would', 'write',
           'quick', 'brown', 'fox', 'jump', 'over', 'lazy', 'dog', 'code',
           'power', 'light', 'night', 'music', 'dance', 'flame', 'storm'],
  hard: ['between', 'country', 'through', 'another', 'because', 'thought',
         'different', 'children', 'mountain', 'question', 'together', 'morning',
         'sentence', 'possible', 'practice', 'keyboard', 'training', 'program',
         'language', 'computer', 'download', 'software', 'network', 'history',
         'science', 'problem', 'general', 'example', 'picture', 'surface'],
};

// ── Game 类 ───────────────────────────────────────

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // 屏幕 DOM
    this.$menu   = document.getElementById('menu-screen');
    this.$game   = document.getElementById('game-screen');
    this.$over   = document.getElementById('over-screen');
    this.$score  = document.getElementById('hud-score');
    this.$combo  = document.getElementById('hud-combo');
    this.$level  = document.getElementById('hud-level');
    this.$lives  = document.getElementById('hud-lives');
    this.$inputDisplay  = document.getElementById('input-display');
    this.$inputPrefix   = document.getElementById('input-prefix');

    // 状态
    this.state = 'menu';    // menu | playing | over
    this.mode = 'letter';   // letter | word
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.level = 1;
    this.gameTime = 0;
    this.wordsCompleted = 0;
    this.charsCompleted = 0;
    this.lastSpawn = 0;

    // 实体
    this.targets = [];
    this.lasers = [];
    this.particles = [];
    this.stars = [];
    this.ship = null;

    // 输入
    this.input = new InputHandler(
      (ch)  => this._onLetterHit(ch),
      (ch)  => this._onWordChar(ch),
      ()    => this._onTypo(),
      ()    => {},
    );

    this._animId = null;
    this._lastTime = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());

    this._initMenu();
    this._initStars();
    this._startMenuLoop();
  }

  // ── 菜单 ────────────────────────────────────────

  _initMenu() {
    // 模式选择
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.mode = btn.dataset.mode;
      });
    });

    document.getElementById('btn-start').addEventListener('click', () => this.startGame());
    document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
    document.getElementById('btn-menu').addEventListener('click', () => this.showMenu());

    // Enter 快速开始
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (this.state === 'menu') this.startGame();
        else if (this.state === 'over') this.startGame();
      }
    });
  }

  showMenu() {
    this.state = 'menu';
    this.input.deactivate();
    cancelAnimationFrame(this._animId);
    this.$game.classList.remove('active');
    this.$over.classList.remove('active');
    this.$menu.classList.add('active');
    this._initStars();
    this._startMenuLoop();
  }

  // ── 开始游戏 ────────────────────────────────────

  startGame() {
    this.state = 'playing';
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.level = 1;
    this.gameTime = 0;
    this.wordsCompleted = 0;
    this.charsCompleted = 0;
    this.lastSpawn = 0;
    this.targets = [];
    this.lasers = [];
    this.particles = [];

    this.input.mode = this.mode;
    this.input.reset();
    this.input.activate();

    this._initStars();
    this.ship = new Ship(this.canvas.width / 2 / this.dpr, (this.canvas.height / this.dpr) - 50);

    // 切换画面
    this.$menu.classList.remove('active');
    this.$over.classList.remove('active');
    this.$game.classList.add('active');

    this._updateHUD();
    this._lastTime = performance.now();
    this._animId = requestAnimationFrame((t) => this._loop(t));
  }

  // ── 主循环 ──────────────────────────────────────

  _loop(timestamp) {
    const dt = (timestamp - this._lastTime) / 1000;
    this._lastTime = timestamp;

    if (this.state === 'playing') {
      this.gameTime += dt;
      this._updateDifficulty();
      this._spawnTargets(dt);
      this._update(dt);
    }

    this._draw();

    if (this.state !== 'over' || this.particles.length > 0) {
      this._animId = requestAnimationFrame((t) => this._loop(t));
    }
  }

  // 菜单背景动画循环
  _startMenuLoop() {
    const menuLoop = (t) => {
      if (this.state !== 'menu') return;
      this.stars.forEach(s => s.update());
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(this.dpr, this.dpr);
      this.stars.forEach(s => s.draw(this.ctx));
      this.ctx.restore();
      requestAnimationFrame(menuLoop);
    };
    requestAnimationFrame(menuLoop);
  }

  // ── 更新 ────────────────────────────────────────

  _update(dt) {
    const cw = this.canvas.width / this.dpr;
    const ch = this.canvas.height / this.dpr;

    // 星星
    this.stars.forEach(s => s.update());

    // 飞船
    this.ship.update();

    // 目标下落
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      t.update();

      // 目标落到底部
      if (t.y > ch - 30 && t.alive) {
        t.alive = false;
        this.lives--;
        this.combo = 0;
        SFX.loseLife();
        this._updateHUD();
        this._shake();

        // 释放锁定
        if (this.input.lockedTarget === t) {
          this.input.clearInput();
        }

        this.targets.splice(i, 1);

        if (this.lives <= 0) {
          this._gameOver();
          return;
        }
      }
    }

    // 激光
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      if (!this.lasers[i].update()) {
        this.lasers.splice(i, 1);
      }
    }

    // 粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (!this.particles[i].update()) {
        this.particles.splice(i, 1);
      }
    }

    // 输入显示
    if (this.mode === 'word') {
      if (this.input.typed.length > 0) {
        this.$inputDisplay.classList.add('visible', 'locked');
        this.$inputPrefix.textContent = this.input.typed;
      } else {
        this.$inputDisplay.classList.remove('visible', 'locked');
        this.$inputPrefix.textContent = '';
      }
    } else {
      this.$inputDisplay.classList.remove('visible', 'locked');
      this.$inputPrefix.textContent = '';
    }
  }

  // ── 绘制 ────────────────────────────────────────

  _draw() {
    const ctx = this.ctx;
    const cw = this.canvas.width / this.dpr;
    const ch = this.canvas.height / this.dpr;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 背景
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, cw, ch);

    // 星星
    this.stars.forEach(s => s.draw(ctx));

    if (this.state === 'playing' || this.state === 'over') {
      // 目标
      this.targets.forEach(t => t.draw(ctx));

      // 激光
      this.lasers.forEach(l => l.draw(ctx));

      // 粒子
      this.particles.forEach(p => p.draw(ctx));

      // 飞船
      if (this.ship) this.ship.draw(ctx);
    }

    ctx.restore();
  }

  // ── 目标生成 ────────────────────────────────────

  _spawnTargets(dt) {
    const interval = Math.max(0.6, 2.0 - this.level * 0.12); // 生成间隔随难度降低
    this.lastSpawn += dt;

    if (this.lastSpawn >= interval) {
      this.lastSpawn = 0;
      const cw = this.canvas.width / this.dpr;
      const speed = 0.5 + this.level * 0.15;

      if (this.mode === 'letter') {
        const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const x = 60 + Math.random() * (cw - 120);
        this.targets.push(new Target(letter, x, -20, speed));
      } else {
        const word = this._getRandomWord();
        const x = 80 + Math.random() * (cw - 160);
        this.targets.push(new Target(word, x, -20, speed * 0.7));
      }
    }
  }

  _getRandomWord() {
    let pool;
    if (this.level <= 3) pool = WORD_POOL.easy;
    else if (this.level <= 6) pool = [...WORD_POOL.easy, ...WORD_POOL.medium];
    else pool = [...WORD_POOL.medium, ...WORD_POOL.hard];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── 难度递增 ────────────────────────────────────

  _updateDifficulty() {
    this.level = Math.floor(this.gameTime / 25) + 1;
    this.$level.textContent = `Lv.${this.level}`;
  }

  // ── 输入处理回调 ────────────────────────────────

  _onLetterHit(ch) {
    // 找到最靠近底部的匹配字母
    let best = null;
    for (const t of this.targets) {
      if (t.alive && t.text === ch) {
        if (!best || t.y > best.y) best = t;
      }
    }

    if (best) {
      this.input.correctKeystrokes++;
      this._destroyTarget(best);
    } else {
      this.combo = 0;
      SFX.typeMiss();
      this._updateHUD();
    }
  }

  _onWordChar(ch) {
    const typed = this.input.typed + ch;

    // 如果已经锁定了目标
    if (this.input.lockedTarget) {
      const target = this.input.lockedTarget;
      const expected = target.text[typed.length - 1];
      if (expected === ch) {
        this.input.typed = typed;
        this.input.correctKeystrokes++;
        target.matched = typed.length;
        SFX.typeHit();

        // 完整输入完成
        if (typed.length === target.text.length) {
          this._destroyTarget(target);
          this.input.clearInput();
        }
      } else {
        this.combo = 0;
        SFX.typeMiss();
        this._updateHUD();
      }
      return;
    }

    // 寻找可匹配的目标（以该字母开头的、离底部最近的）
    let best = null;
    for (const t of this.targets) {
      if (t.alive && !t.locked && t.text[0] === ch) {
        if (!best || t.y > best.y) best = t;
      }
    }

    if (best) {
      this.input.typed = typed;
      this.input.lockedTarget = best;
      this.input.correctKeystrokes++;
      best.locked = true;
      best.matched = 1;
      SFX.typeHit();

      // 单字母单词
      if (best.text.length === 1) {
        this._destroyTarget(best);
        this.input.clearInput();
      }
    } else {
      this.combo = 0;
      SFX.typeMiss();
      this._updateHUD();
    }
  }

  _onTypo() {
    this.combo = 0;
    SFX.typeMiss();
    this._updateHUD();
  }

  // ── 摧毁目标 ────────────────────────────────────

  _destroyTarget(target) {
    target.alive = false;

    // 飞船朝目标移动
    this.ship.moveTo(target.x);

    // 激光
    this.lasers.push(new Laser(this.ship.x, this.ship.y - 18, target.x, target.y));

    // 爆炸粒子
    for (let i = 0; i < 15; i++) {
      this.particles.push(new Particle(target.x, target.y));
    }

    // 计分
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    const comboMultiplier = Math.min(this.combo, 10);
    const baseScore = this.mode === 'word' ? target.text.length * 5 : 10;
    this.score += baseScore * comboMultiplier;
    this.charsCompleted += target.text.length;
    this.wordsCompleted++;

    // 音效
    SFX.laser();
    setTimeout(() => SFX.explode(), 80);
    if (this.combo > 1) SFX.combo(this.combo);

    // 连击震动
    if (this.combo >= 3) this._shake();

    // 从列表移除
    const idx = this.targets.indexOf(target);
    if (idx !== -1) this.targets.splice(idx, 1);

    this._updateHUD();
  }

  // ── HUD 更新 ────────────────────────────────────

  _updateHUD() {
    this.$score.textContent = this.score;

    if (this.combo > 1) {
      this.$combo.textContent = `🔥 ${this.combo}x`;
      this.$combo.classList.add('visible');
    } else {
      this.$combo.classList.remove('visible');
    }

    const hearts = '❤️'.repeat(Math.max(0, this.lives));
    const empties = '🖤'.repeat(Math.max(0, 3 - this.lives));
    this.$lives.textContent = hearts + empties;
  }

  // ── 游戏结束 ────────────────────────────────────

  _gameOver() {
    this.state = 'over';
    this.input.deactivate();

    SFX.gameOver();

    // 计算统计
    const minutes = this.gameTime / 60;
    const wpm = minutes > 0 ? Math.round(this.wordsCompleted / minutes) : 0;
    const accuracy = this.input.accuracy;

    document.getElementById('stat-score').textContent = this.score;
    document.getElementById('stat-wpm').textContent = wpm;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
    document.getElementById('stat-combo').textContent = this.maxCombo;

    // 延迟显示结束画面（让最后的动画播完）
    setTimeout(() => {
      this.$over.classList.add('active');
    }, 600);
  }

  // ── 辅助方法 ────────────────────────────────────

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  _initStars() {
    const cw = this.canvas.width / this.dpr;
    const ch = this.canvas.height / this.dpr;
    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push(new Star(cw, ch));
    }
  }

  _shake() {
    this.$game.classList.add('shake');
    setTimeout(() => this.$game.classList.remove('shake'), 150);
  }
}

// ── 启动 ──────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
