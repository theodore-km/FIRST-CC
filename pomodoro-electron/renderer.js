// renderer.js — 番茄钟渲染进程逻辑

// ── 配置 ──────────────────────────────────────────

const MODES = {
  work:  { seconds: 25 * 60, label: '工作' },
  short: { seconds: 5 * 60,  label: '短休息' },
  long:  { seconds: 15 * 60, label: '长休息' },
};

const CIRCUMFERENCE = 2 * Math.PI * 100; // ring radius = 100
const LONG_BREAK_INTERVAL = 4;

// ── 状态 ──────────────────────────────────────────

let currentMode = 'work';
let totalSeconds = MODES.work.seconds;
let remainingSeconds = totalSeconds;
let isRunning = false;
let startTimestamp = null;
let remainingAtStart = null;
let pomodoroCount = 0;
let tickInterval = null;

// ── DOM 元素 ──────────────────────────────────────

const $display   = document.getElementById('timer-display');
const $status    = document.getElementById('status-text');
const $counter   = document.getElementById('counter');
const $startBtn  = document.getElementById('btn-start');
const $resetBtn  = document.getElementById('btn-reset');
const $ringFg    = document.querySelector('.ring-fg');
const $modeBtns  = document.querySelectorAll('.mode-btn');

// ── 初始化 ────────────────────────────────────────

document.body.classList.add('mode-work');
updateDisplay();
updateRing(1);

// 标题栏按钮
document.getElementById('btn-close').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});
document.getElementById('btn-minimize').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

// 模式切换
$modeBtns.forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

// 控制
$startBtn.addEventListener('click', toggleStartPause);
$resetBtn.addEventListener('click', resetTimer);

// ── 核心逻辑 ──────────────────────────────────────

function switchMode(mode) {
  if (isRunning) stop();

  currentMode = mode;
  totalSeconds = MODES[mode].seconds;
  remainingSeconds = totalSeconds;

  // UI 更新
  $modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.body.className = `mode-${mode}`;
  $startBtn.textContent = '开始';
  $startBtn.classList.remove('running');
  $status.textContent = '准备开始';

  updateDisplay();
  updateRing(1);
}

function toggleStartPause() {
  if (isRunning) {
    pause();
  } else {
    start();
  }
}

function start() {
  isRunning = true;
  startTimestamp = Date.now();
  remainingAtStart = remainingSeconds;

  $startBtn.textContent = '暂停';
  $startBtn.classList.add('running');
  $status.textContent = MODES[currentMode].label + '中...';

  tickInterval = setInterval(tick, 200);
}

function pause() {
  isRunning = false;
  clearInterval(tickInterval);
  tickInterval = null;

  // 记录精确剩余时间
  const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
  remainingSeconds = Math.max(0, remainingAtStart - elapsed);

  $startBtn.textContent = '继续';
  $startBtn.classList.remove('running');
  $status.textContent = '已暂停';
}

function stop() {
  isRunning = false;
  clearInterval(tickInterval);
  tickInterval = null;
}

function resetTimer() {
  stop();
  remainingSeconds = totalSeconds;

  $startBtn.textContent = '开始';
  $startBtn.classList.remove('running');
  $status.textContent = '准备开始';

  updateDisplay();
  updateRing(1);
}

function tick() {
  const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
  remainingSeconds = Math.max(0, remainingAtStart - elapsed);

  const progress = remainingSeconds / totalSeconds;
  updateDisplay();
  updateRing(progress);

  if (remainingSeconds <= 0) {
    onTimerComplete();
  }
}

function onTimerComplete() {
  stop();

  // 工作模式完成 → 计数 +1
  if (currentMode === 'work') {
    pomodoroCount++;
    updateCounter();
  }

  // 提示音
  playBeep();

  $status.textContent = MODES[currentMode].label + '完成！';
  $startBtn.textContent = '开始';
  $startBtn.classList.remove('running');

  // 建议下一模式
  const nextMode = suggestNext();
  const nextLabel = MODES[nextMode].label;

  setTimeout(() => {
    const ok = confirm(`🍅 ${MODES[currentMode].label}时间结束！\n\n已完成 ${pomodoroCount} 个番茄\n\n建议下一步：${nextLabel}\n\n点击"确定"切换，"取消"重置`);
    if (ok) {
      switchMode(nextMode);
    } else {
      resetTimer();
    }
  }, 300);
}

function suggestNext() {
  if (currentMode !== 'work') return 'work';
  if (pomodoroCount % LONG_BREAK_INTERVAL === 0) return 'long';
  return 'short';
}

// ── UI 更新 ──────────────────────────────────────

function updateDisplay() {
  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  $display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  document.title = `🍅 ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} — ${MODES[currentMode].label}`;
}

function updateRing(progress) {
  const offset = CIRCUMFERENCE * (1 - progress);
  $ringFg.style.strokeDashoffset = offset;
}

function updateCounter() {
  const tomatos = '🍅'.repeat(Math.min(pomodoroCount, 12));
  const suffix = pomodoroCount > 12 ? ` +${pomodoroCount - 12}` : '';
  $counter.textContent = tomatos + suffix;
}

// ── 音效 ────────────────────────────────────────

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [800, 1000, 1200];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.3 + 0.25);
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.25);
    });
  } catch (e) {
    // 静默失败
  }
}
