"""
styles.py — 番茄钟 UI 样式常量

配色方案：工作(红色系) / 短休息(绿色系) / 长休息(蓝色系)
"""

from ..timer import TimerMode

# ── 窗口 ──────────────────────────────────────────────
WINDOW_TITLE = "🍅 番茄钟"
WINDOW_WIDTH = 360
WINDOW_HEIGHT = 500
WINDOW_RESIZABLE = False

# ── 配色 ──────────────────────────────────────────────
BG_DARK = "#1a1a2e"
BG_CARD = "#16213e"
TEXT_PRIMARY = "#eaeaea"
TEXT_SECONDARY = "#a0a0b0"

MODE_COLORS = {
    TimerMode.WORK: {
        "bg": "#c0392b",
        "fg": "#ffffff",
        "accent": "#e74c3c",
        "ring": "#e74c3c",
        "ring_bg": "#5a1a15",
    },
    TimerMode.SHORT_BREAK: {
        "bg": "#27ae60",
        "fg": "#ffffff",
        "accent": "#2ecc71",
        "ring": "#2ecc71",
        "ring_bg": "#1a5c35",
    },
    TimerMode.LONG_BREAK: {
        "bg": "#2980b9",
        "fg": "#ffffff",
        "accent": "#3498db",
        "ring": "#3498db",
        "ring_bg": "#14406e",
    },
}

# ── 字体 ──────────────────────────────────────────────
TIMER_FONT = ("Consolas", 48, "bold")
LABEL_FONT = ("Microsoft YaHei UI", 12)
BUTTON_FONT = ("Microsoft YaHei UI", 11)
MODE_BUTTON_FONT = ("Microsoft YaHei UI", 10)
COUNT_FONT = ("Microsoft YaHei UI", 14)

# ── 圆形进度条 ────────────────────────────────────────
RING_SIZE = 220          # 画布大小
RING_WIDTH = 10          # 圆环粗细
RING_CENTER = RING_SIZE // 2
RING_RADIUS = (RING_SIZE // 2) - RING_WIDTH - 5

# ── 按钮 ──────────────────────────────────────────────
BTN_START_WIDTH = 10
BTN_RESET_WIDTH = 8
BTN_PADY = 4
