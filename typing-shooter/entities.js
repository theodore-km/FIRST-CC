// entities.js — 游戏实体类

// ── 背景星星 ──────────────────────────────────────

class Star {
  constructor(canvasW, canvasH) {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.size = Math.random() * 2 + 0.5;
    this.speed = this.size * 0.3 + 0.1;       // 大星星更快（视差）
    this.brightness = Math.random() * 0.5 + 0.3;
    this.canvasW = canvasW;
    this.canvasH = canvasH;
  }

  update() {
    this.y += this.speed;
    if (this.y > this.canvasH) {
      this.y = 0;
      this.x = Math.random() * this.canvasW;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// ── 下落目标 ──────────────────────────────────────

class Target {
  constructor(text, x, y, speed) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.matched = 0;           // 已匹配的字符数（单词模式用）
    this.locked = false;        // 是否被玩家锁定
    this.alive = true;
    this.alpha = 1;
    this.width = 0;             // 在 draw 时计算
    this.height = 0;
    this.glowIntensity = 0;     // 被锁定时的发光
  }

  update() {
    this.y += this.speed;
    // 发光动画
    if (this.locked) {
      this.glowIntensity = Math.min(1, this.glowIntensity + 0.1);
    } else {
      this.glowIntensity = Math.max(0, this.glowIntensity - 0.1);
    }
  }

  draw(ctx) {
    const fontSize = this.text.length === 1 ? 28 : 22;
    ctx.font = `bold ${fontSize}px Consolas, 'Courier New', monospace`;

    // 测量宽度
    this.width = ctx.measureText(this.text).width + 24;
    this.height = fontSize + 16;

    // 背景框
    const rx = this.x - this.width / 2;
    const ry = this.y - this.height / 2;

    // 发光效果
    if (this.glowIntensity > 0) {
      ctx.shadowColor = 'rgba(243, 156, 18, 0.6)';
      ctx.shadowBlur = 16 * this.glowIntensity;
    }

    ctx.fillStyle = this.locked ? 'rgba(243, 156, 18, 0.15)' : 'rgba(30, 30, 60, 0.85)';
    ctx.strokeStyle = this.locked ? '#f39c12' : '#333366';
    ctx.lineWidth = 2;
    this._roundRect(ctx, rx, ry, this.width, this.height, 10);
    ctx.fill();
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // 文字
    if (this.matched > 0) {
      // 已匹配部分（绿色）
      const matchedText = this.text.substring(0, this.matched);
      const remainText = this.text.substring(this.matched);
      const matchedWidth = ctx.measureText(matchedText).width;

      ctx.fillStyle = '#2ecc71';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(matchedText, this.x - ctx.measureText(this.text).width / 2, this.y);

      ctx.fillStyle = '#eaeaea';
      ctx.fillText(remainText, this.x - ctx.measureText(this.text).width / 2 + matchedWidth, this.y);
    } else {
      ctx.fillStyle = '#eaeaea';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

// ── 激光 ──────────────────────────────────────────

class Laser {
  constructor(fromX, fromY, toX, toY) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.life = 1.0;       // 1.0 → 0.0
    this.speed = 0.08;
  }

  update() {
    this.life -= this.speed;
    return this.life > 0;
  }

  draw(ctx) {
    const alpha = this.life;
    // 主光束
    ctx.strokeStyle = `rgba(255, 200, 50, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = `rgba(255, 150, 0, ${alpha * 0.8})`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(this.fromX, this.fromY);
    ctx.lineTo(this.toX, this.toY);
    ctx.stroke();

    // 细光芯
    ctx.strokeStyle = `rgba(255, 255, 200, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.fromX, this.fromY);
    ctx.lineTo(this.toX, this.toY);
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}

// ── 爆炸粒子 ──────────────────────────────────────

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.decay = Math.random() * 0.03 + 0.02;
    this.size = Math.random() * 3 + 1;
    this.color = color || this._randomColor();
  }

  _randomColor() {
    const colors = ['#e74c3c', '#f39c12', '#e67e22', '#f1c40f', '#ff6b6b'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;  // 重力
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

// ── 飞船 ──────────────────────────────────────────

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;      // 平滑移动目标
    this.flamePhase = 0;
  }

  moveTo(x) {
    this.targetX = x;
  }

  update() {
    // 平滑追踪
    this.x += (this.targetX - this.x) * 0.12;
    this.flamePhase += 0.2;
  }

  draw(ctx) {
    const x = this.x;
    const y = this.y;

    // 引擎尾焰
    const flameLen = 12 + Math.sin(this.flamePhase) * 5;
    const flameGrad = ctx.createLinearGradient(x, y + 10, x, y + 10 + flameLen);
    flameGrad.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
    flameGrad.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
    flameGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 10);
    ctx.lineTo(x, y + 10 + flameLen);
    ctx.lineTo(x + 6, y + 10);
    ctx.closePath();
    ctx.fill();

    // 飞船主体
    ctx.fillStyle = '#c0c0d0';
    ctx.beginPath();
    ctx.moveTo(x, y - 18);           // 顶部尖端
    ctx.lineTo(x - 14, y + 10);      // 左下
    ctx.lineTo(x + 14, y + 10);      // 右下
    ctx.closePath();
    ctx.fill();

    // 机翼
    ctx.fillStyle = '#8888aa';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 2);
    ctx.lineTo(x - 20, y + 14);
    ctx.lineTo(x - 6, y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 8, y + 2);
    ctx.lineTo(x + 20, y + 14);
    ctx.lineTo(x + 6, y + 10);
    ctx.closePath();
    ctx.fill();

    // 驾驶舱
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(x, y - 2, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
