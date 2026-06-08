"""
widgets.py — 番茄钟自定义 UI 组件

包含圆形进度条、时间显示、控制按钮等。
"""

import math
import tkinter as tk
from tkinter import font as tkfont

from . import styles as S
from ..timer import TimerMode


class CircularProgress(tk.Canvas):
    """基于 Canvas 的圆形进度环。"""

    def __init__(self, parent, **kwargs):
        super().__init__(
            parent,
            width=S.RING_SIZE,
            height=S.RING_SIZE,
            bg=S.BG_DARK,
            highlightthickness=0,
            **kwargs,
        )
        self._progress = 1.0  # 0.0 ~ 1.0
        self._color = S.MODE_COLORS[TimerMode.WORK]["ring"]
        self._ring_bg = S.MODE_COLORS[TimerMode.WORK]["ring_bg"]
        self._draw()

    def set_progress(self, progress: float):
        """设置进度 (0.0 ~ 1.0)。"""
        self._progress = max(0.0, min(1.0, progress))
        self._draw()

    def set_color(self, mode: TimerMode):
        """根据模式切换颜色。"""
        colors = S.MODE_COLORS[mode]
        self._color = colors["ring"]
        self._ring_bg = colors["ring_bg"]
        self._draw()

    def _draw(self):
        self.delete("all")
        cx, cy = S.RING_CENTER, S.RING_CENTER
        r = S.RING_RADIUS
        w = S.RING_WIDTH

        # 背景圆环
        self._create_arc(cx, cy, r, w, 360, self._ring_bg)

        # 进度圆环
        angle = self._progress * 360
        if angle > 0:
            self._create_arc(cx, cy, r, w, angle, self._color)

    def _create_arc(self, cx, cy, r, width, angle, color):
        """绘制一段圆弧。"""
        bbox = (cx - r, cy - r, cx + r, cy + r)
        # 从顶部（-90°）开始，顺时针
        self.create_arc(
            bbox,
            start=90,
            extent=-angle,
            style="arc",
            outline=color,
            width=width,
        )


class TimerDisplay(tk.Label):
    """大字体倒计时显示 (MM:SS)。"""

    def __init__(self, parent, **kwargs):
        super().__init__(
            parent,
            text="25:00",
            font=S.TIMER_FONT,
            fg=S.TEXT_PRIMARY,
            bg=S.BG_DARK,
            **kwargs,
        )

    def update_time(self, seconds: int):
        m, s = divmod(seconds, 60)
        self.config(text=f"{m:02d}:{s:02d}")


class ModeSelector(tk.Frame):
    """模式选择按钮组（工作 / 短休息 / 长休息）。"""

    def __init__(self, parent, on_change, **kwargs):
        """
        Args:
            on_change: 模式切换回调 on_change(mode: TimerMode)
        """
        super().__init__(parent, bg=S.BG_DARK, **kwargs)
        self._on_change = on_change
        self._buttons: dict[TimerMode, tk.Button] = {}
        self._current = TimerMode.WORK

        modes = [
            (TimerMode.WORK, "工作"),
            (TimerMode.SHORT_BREAK, "短休息"),
            (TimerMode.LONG_BREAK, "长休息"),
        ]

        for mode, label in modes:
            btn = tk.Button(
                self,
                text=label,
                font=S.MODE_BUTTON_FONT,
                width=8,
                relief="flat",
                cursor="hand2",
                command=lambda m=mode: self._select(m),
            )
            btn.pack(side="left", padx=3)
            self._buttons[mode] = btn

        self._highlight()

    def set_mode(self, mode: TimerMode):
        """外部设置当前模式（不触发回调）。"""
        self._current = mode
        self._highlight()

    def _select(self, mode: TimerMode):
        self._current = mode
        self._highlight()
        self._on_change(mode)

    def _highlight(self):
        for mode, btn in self._buttons.items():
            colors = S.MODE_COLORS[mode]
            if mode == self._current:
                btn.config(bg=colors["bg"], fg=colors["fg"])
            else:
                btn.config(bg=S.BG_CARD, fg=S.TEXT_SECONDARY)


class ControlButtons(tk.Frame):
    """开始/暂停 + 重置按钮组。"""

    def __init__(self, parent, on_start, on_pause, on_reset, **kwargs):
        """
        Args:
            on_start: 开始按钮回调
            on_pause: 暂停按钮回调
            on_reset: 重置按钮回调
        """
        super().__init__(parent, bg=S.BG_DARK, **kwargs)

        self._on_start = on_start
        self._on_pause = on_pause
        self._is_running = False

        # 开始/暂停 按钮（同一位置切换）
        self._btn_toggle = tk.Button(
            self,
            text="开始",
            font=S.BUTTON_FONT,
            width=S.BTN_START_WIDTH,
            bg=S.MODE_COLORS[TimerMode.WORK]["accent"],
            fg="#ffffff",
            activebackground=S.MODE_COLORS[TimerMode.WORK]["bg"],
            activeforeground="#ffffff",
            relief="flat",
            cursor="hand2",
            command=self._toggle,
        )
        self._btn_toggle.pack(side="left", padx=6, pady=S.BTN_PADY)

        # 重置按钮
        self._btn_reset = tk.Button(
            self,
            text="重置",
            font=S.BUTTON_FONT,
            width=S.BTN_RESET_WIDTH,
            bg=S.BG_CARD,
            fg=S.TEXT_SECONDARY,
            activebackground="#2a2a4e",
            activeforeground=S.TEXT_PRIMARY,
            relief="flat",
            cursor="hand2",
            command=on_reset,
        )
        self._btn_reset.pack(side="left", padx=6, pady=S.BTN_PADY)

    def set_running(self, running: bool):
        """更新按钮状态（开始 ↔ 暂停）。"""
        self._is_running = running
        self._btn_toggle.config(text="暂停" if running else "开始")

    def set_color(self, mode: TimerMode):
        """根据模式切换按钮颜色。"""
        colors = S.MODE_COLORS[mode]
        self._btn_toggle.config(
            bg=colors["accent"],
            activebackground=colors["bg"],
        )

    def _toggle(self):
        if self._is_running:
            self._on_pause()
        else:
            self._on_start()


class PomodoroCounter(tk.Label):
    """番茄完成计数显示（🍅 × N）。"""

    def __init__(self, parent, **kwargs):
        super().__init__(
            parent,
            text="",
            font=S.COUNT_FONT,
            fg=S.TEXT_SECONDARY,
            bg=S.BG_DARK,
            **kwargs,
        )

    def update_count(self, count: int):
        if count == 0:
            self.config(text="")
        else:
            tomatoes = "\U0001F345" * min(count, 12)  # 🍅
            suffix = f" +{count - 12}" if count > 12 else ""
            self.config(text=f"{tomatoes}{suffix}")
