"""
番茄钟 — 桌面 Pomodoro Timer 应用

使用方法:
    python -m pomodoro.main
    或
    python pomodoro/main.py
"""

import sys
import os
import tkinter as tk
from tkinter import messagebox

# 确保可以 import 上级目录的包
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pomodoro.timer import PomodoroTimer, TimerMode, MODE_DURATIONS
from pomodoro.ui.styles import *
from pomodoro.ui.widgets import (
    CircularProgress,
    TimerDisplay,
    ModeSelector,
    ControlButtons,
    PomodoroCounter,
)


def play_sound():
    """播放提示音（跨平台兼容）。"""
    try:
        import winsound
        # 播放两声短促提示音
        winsound.Beep(800, 300)
        winsound.Beep(1000, 300)
        winsound.Beep(1200, 500)
    except Exception:
        pass  # 非 Windows 或无声卡时静默跳过


class PomodoroApp:
    """番茄钟应用主类。"""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title(WINDOW_TITLE)
        self.root.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        self.root.resizable(WINDOW_RESIZABLE, WINDOW_RESIZABLE)
        self.root.configure(bg=BG_DARK)

        # 居中显示
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() - WINDOW_WIDTH) // 2
        y = (self.root.winfo_screenheight() - WINDOW_HEIGHT) // 2
        self.root.geometry(f"+{x}+{y}")

        # 计时器核心
        self.timer = PomodoroTimer(
            on_tick=self._on_tick,
            on_complete=self._on_complete,
        )

        # 构建 UI
        self._build_ui()

        # 初始刷新
        self._update_ui_colors(self.timer.mode)
        self._on_tick(self.timer.remaining_seconds, self.timer.total_seconds)

    # ── UI 构建 ──────────────────────────────────────────

    def _build_ui(self):
        # 顶部模式选择器
        self.mode_selector = ModeSelector(self.root, on_change=self._on_mode_change)
        self.mode_selector.pack(pady=(20, 10))

        # 圆形进度条（含时间文字叠加）
        ring_frame = tk.Frame(self.root, bg=BG_DARK)
        ring_frame.pack(pady=10)

        self.progress_ring = CircularProgress(ring_frame)
        self.progress_ring.place(x=0, y=0)

        self.time_display = TimerDisplay(ring_frame)
        self.time_display.place(
            relx=0.5, rely=0.5, anchor="center"
        )

        # 状态标签
        self.status_label = tk.Label(
            self.root,
            text="准备开始",
            font=LABEL_FONT,
            fg=TEXT_SECONDARY,
            bg=BG_DARK,
        )
        self.status_label.pack(pady=(5, 15))

        # 控制按钮
        self.controls = ControlButtons(
            self.root,
            on_start=self._on_start,
            on_pause=self._on_pause,
            on_reset=self._on_reset,
        )
        self.controls.pack(pady=5)

        # 番茄计数
        self.counter = PomodoroCounter(self.root)
        self.counter.pack(pady=(20, 5))

    # ── 事件处理 ──────────────────────────────────────────

    def _on_mode_change(self, mode: TimerMode):
        self.timer.set_mode(mode)
        self._update_ui_colors(mode)
        self.status_label.config(text="准备开始")
        self.controls.set_running(False)

    def _on_start(self):
        self.timer.start(self.root)
        self.controls.set_running(True)
        mode_names = {
            TimerMode.WORK: "专注工作中...",
            TimerMode.SHORT_BREAK: "短暂休息中...",
            TimerMode.LONG_BREAK: "长休息中...",
        }
        self.status_label.config(text=mode_names[self.timer.mode])

    def _on_pause(self):
        self.timer.pause()
        self.controls.set_running(False)
        self.status_label.config(text="已暂停")

    def _on_reset(self):
        self.timer.reset()
        self.controls.set_running(False)
        self.status_label.config(text="准备开始")

    def _on_tick(self, remaining: int, total: int):
        progress = remaining / total if total > 0 else 0
        self.progress_ring.set_progress(progress)
        self.time_display.update_time(remaining)
        self.counter.update_count(self.timer.pomodoro_count)

        # 更新窗口标题
        m, s = divmod(remaining, 60)
        mode_label = {
            TimerMode.WORK: "工作",
            TimerMode.SHORT_BREAK: "短休",
            TimerMode.LONG_BREAK: "长休",
        }
        self.root.title(f"🍅 {m:02d}:{s:02d} — {mode_label[self.timer.mode]}")

    def _on_complete(self, mode: TimerMode):
        """倒计时结束回调。"""
        self.controls.set_running(False)

        # 播放提示音
        play_sound()

        # 更新计数
        self.counter.update_count(self.timer.pomodoro_count)

        # 建议下一个模式
        next_mode = self.timer.suggested_next_mode()
        next_names = {
            TimerMode.WORK: "开始工作",
            TimerMode.SHORT_BREAK: "短休息",
            TimerMode.LONG_BREAK: "长休息",
        }

        mode_cn = {
            TimerMode.WORK: "工作",
            TimerMode.SHORT_BREAK: "短休息",
            TimerMode.LONG_BREAK: "长休息",
        }

        self.status_label.config(text=f"{mode_cn[mode]}完成！")

        # 弹窗通知
        msg = f"🍅 {mode_cn[mode]}时间结束！\n\n已完成 {self.timer.pomodoro_count} 个番茄\n\n建议下一步：{next_names[next_mode]}"
        if messagebox.askyesno("番茄钟", msg, parent=self.root):
            self._on_mode_change(next_mode)
        else:
            self._on_reset()

    # ── 辅助方法 ──────────────────────────────────────────

    def _update_ui_colors(self, mode: TimerMode):
        """根据模式更新所有组件颜色。"""
        self.progress_ring.set_color(mode)
        self.controls.set_color(mode)


def main():
    root = tk.Tk()
    app = PomodoroApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
