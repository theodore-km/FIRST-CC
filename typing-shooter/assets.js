// assets.js — Web Audio API 音效合成

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function playTone(freq, duration, type, volume) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume || 0.15, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) { /* 静默 */ }
  }

  return {
    // 激光发射
    laser() {
      try {
        const c = getCtx();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, c.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.15);
      } catch (e) { /* 静默 */ }
    },

    // 爆炸
    explode() {
      try {
        const c = getCtx();
        // 噪音模拟爆炸
        const bufferSize = c.sampleRate * 0.2;
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const src = c.createBufferSource();
        src.buffer = buffer;
        const gain = c.createGain();
        src.connect(gain);
        gain.connect(c.destination);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
        src.start(c.currentTime);
      } catch (e) { /* 静默 */ }
    },

    // 输入正确字符（短促确认音）
    typeHit() {
      playTone(880, 0.06, 'square', 0.08);
    },

    // 输入错误字符
    typeMiss() {
      playTone(200, 0.15, 'square', 0.1);
    },

    // 连击音（音高随连击数递增）
    combo(count) {
      const freq = 600 + Math.min(count, 10) * 80;
      playTone(freq, 0.1, 'sine', 0.12);
    },

    // 失去一条命
    loseLife() {
      try {
        const c = getCtx();
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, c.currentTime);
        osc.frequency.linearRampToValueAtTime(100, c.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.4);
      } catch (e) { /* 静默 */ }
    },

    // 游戏结束
    gameOver() {
      try {
        const c = getCtx();
        [400, 350, 300, 200].forEach((freq, i) => {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.connect(gain);
          gain.connect(c.destination);
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t = c.currentTime + i * 0.2;
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } catch (e) { /* 静默 */ }
    },
  };
})();
