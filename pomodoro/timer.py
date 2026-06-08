"""
PomodoroTimer — 番茄钟计时器核心逻辑

使用 time.monotonic() 追踪真实流逝时间，避免 tkinter after() 的累积误差。
通过回调函数通知 UI 更新。
"""

import time
from enum import Enum


class TimerMode(Enum):
    WORK = "work"
    SHORT_BREAK = "short_break"
    LONG_BREAK = "long_break"


# 每种模式的默认时长（秒）
MODE_DURATIONS = {
    TimerMode.WORK: 25 * 60,
    TimerMode.SHORT_BREAK: 5 * 60,
    TimerMode.LONG_BREAK: 15 * 60,
}

# 每隔多少个番茄后进入长休息
LONG_BREAK_INTERVAL = 4

# UI 刷新间隔（毫秒）
TICK_MS = 200


class PomodoroTimer:
    """番茄钟计时器，管理倒计时状态和模式切换。"""

    def __init__(self, on_tick=None, on_complete=None):
        """
        Args:
            on_tick: 每次刷新时调用 on_tick(remaining_seconds, total_seconds)
            on_complete: 倒计时结束时调用 on_complete(mode)
        """
        self._on_tick = on_tick
        self._on_complete = on_complete

        self._mode = TimerMode.WORK
        self._total_seconds = MODE_DURATIONS[self._mode]
        self._remaining_seconds = self._total_seconds

        self._running = False
        self._paused = False
        self._start_monotonic = None  # monotonic 时间戳
        self._remaining_at_start = None  # 开始时剩余秒数

        self._pomodoro_count = 0
        self._after_id = None

    # ── 属性 ──────────────────────────────────────────────

    @property
    def mode(self) -> TimerMode:
        return self._mode

    @property
    def total_seconds(self) -> int:
        return self._total_seconds

    @property
    def remaining_seconds(self) -> int:
        return self._remaining_seconds

    @property
    def running(self) -> bool:
        return self._running and not self._paused

    @property
    def paused(self) -> bool:
        return self._paused

    @property
    def pomodoro_count(self) -> int:
        return self._pomodoro_count

    # ── 公开方法 ──────────────────────────────────────────

    def set_mode(self, mode: TimerMode):
        """切换模式并重置计时器。"""
        self._cancel_tick()
        self._mode = mode
        self._total_seconds = MODE_DURATIONS[mode]
        self._remaining_seconds = self._total_seconds
        self._running = False
        self._paused = False
        self._start_monotonic = None
        self._remaining_at_start = None
        self._notify_tick()

    def start(self, root):
        """开始或恢复倒计时。

        Args:
            root: tkinter 根窗口，用于调度 after()
        """
        if self._running and not self._paused:
            return  # 已经在运行

        self._running = True
        self._paused = False
        self._root = root
        self._start_monotonic = time.monotonic()
        self._remaining_at_start = self._remaining_seconds
        self._schedule_tick()

    def pause(self):
        """暂停倒计时。"""
        if not self._running or self._paused:
            return
        self._paused = True
        self._cancel_tick()
        # 记录暂停时刻的真实剩余时间
        elapsed = time.monotonic() - self._start_monotonic
        self._remaining_seconds = max(
            0, self._remaining_at_start - int(elapsed)
        )

    def reset(self):
        """重置当前模式的倒计时。"""
        self._cancel_tick()
        self._running = False
        self._paused = False
        self._start_monotonic = None
        self._remaining_at_start = None
        self._remaining_seconds = self._total_seconds
        self._notify_tick()

    # ── 内部方法 ──────────────────────────────────────────

    def _schedule_tick(self):
        """调度下一次刷新。"""
        self._after_id = self._root.after(TICK_MS, self._tick)

    def _cancel_tick(self):
        """取消待执行的刷新。"""
        if self._after_id is not None:
            self._root.after_cancel(self._after_id)
            self._after_id = None

    def _tick(self):
        """每次刷新回调：计算真实剩余时间。"""
        elapsed = time.monotonic() - self._start_monotonic
        self._remaining_seconds = max(
            0, self._remaining_at_start - int(elapsed)
        )

        self._notify_tick()

        if self._remaining_seconds <= 0:
            self._on_timer_complete()
            return

        self._schedule_tick()

    def _on_timer_complete(self):
        """倒计时结束处理。"""
        self._running = False
        self._paused = False
        self._cancel_tick()

        if self._mode == TimerMode.WORK:
            self._pomodoro_count += 1

        if self._on_complete:
            self._on_complete(self._mode)

    def _notify_tick(self):
        """通知 UI 刷新。"""
        if self._on_tick:
            self._on_tick(self._remaining_seconds, self._total_seconds)

    def suggested_next_mode(self) -> TimerMode:
        """根据当前状态建议下一个模式。"""
        if self._mode != TimerMode.WORK:
            return TimerMode.WORK
        # 每完成 LONG_BREAK_INTERVAL 个番茄后建议长休息
        if self._pomodoro_count % LONG_BREAK_INTERVAL == 0:
            return TimerMode.LONG_BREAK
        return TimerMode.SHORT_BREAK
