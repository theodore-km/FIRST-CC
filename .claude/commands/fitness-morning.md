---
description: 健身晨间打卡 — 调用 theo-fit 报体重/体脂并对齐今日目标
---

请使用 **theo-fit** agent 执行晨间打卡。

先读 `ai_secretary/aboutme.md` 取身体指标与策略（168 轻断食 + 碳循环），用户报体重 / 体脂后对齐今日目标，给一句话状态评估。打卡数据**追加**到 `ai_secretary/progress/health_data.md`，当日结果存入 `ai_secretary/YYYY-MM-DD/workout.md`。

用户输入：
$ARGUMENTS
