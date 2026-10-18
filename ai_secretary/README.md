# 🤖 AI Secretary — Theo 的个人助理团队

5 个 AI 分身（Sub-Agent），覆盖**财税、英语、健身、新闻、反思**五个领域。
所有产出按日期归档，长期档案累积成长。

## 🧭 触发方式（两种）

### 方式 A：Slash 命令（带参数）
| 命令 | 作用 | 调用 agent |
|------|------|-----------|
| `/finance-review <贴合同/发票>` | 财税风险审查 + 替代条款 | theo-fin |
| `/finance-statement <贴报表>` | 财报透视 + 经营指标预警 | theo-fin |
| `/english-daily` | 每日商务场景练习卡 | theo-eng |
| `/english-check <贴英文/邮件>` | 三层重构（语法→地道→发音） | theo-eng |
| `/english-review` | 晚间打卡复盘 + 次日提示 | theo-eng |
| `/fitness-morning` | 晨间体重/体脂打卡对齐目标 | theo-fit |
| `/fitness-meal <贴菜单/外卖>` | 外卖避坑 + 涮水替换 | theo-fit |
| `/fitness-workout` | 15–30 分钟酒店/居家微训练 | theo-fit |
| `/news-morning` | 今日权威新闻简报 | theo-news |
| `/reflect` | 一轮一问式反思引导 | theo-ref |

### 方式 B：自然语言（直接说）
- 「早安」→ TheoNews 自动开始抓新闻。
- 「今天工作结束了」→ TheoRef 启动反思。
- 也可直接点名：「让 theo-fit 帮我看看今天训练」。

---

## 👥 五位助理

| Agent | 职责 | 关键铁律 |
|-------|------|---------|
| **TheoFin** | 跨国财税、合同/发票/报表审查、跨境结算 | 风险分级 + 必给替代条款；非执业意见 |
| **TheoEng** | 商务英语场景卡、邮件三层重构、错题本 | 场景贴合业务；拒绝枯燥语法 |
| **TheoFit** | 打卡、外卖避坑、微训练 | 严禁极端节食；高性价比优先 |
| **TheoNews** | 每日权威新闻简报（可同步 Notion） | 只采权威来源；不评价不预测 |
| **TheoRef** | 提问式反思引导 | 一轮一问；教练不说教 |

---

## 📂 目录结构

```
ai_secretary/
├── aboutme.md              # ⭐ 核心画像（所有 agent 必读，改这里=改全员认知）
├── README.md               # 本文件
├── think.md                # 原始想法草稿
├── progress/               # 长期累积档案（追加，不覆盖）
│   ├── english_progress.md #   英语错题本（TheoEng）
│   └── health_data.md      #   健身打卡表（TheoFit）
├── templates/              # 输出模板
│   ├── finance_review.md
│   ├── english_card.md
│   ├── workout.md
│   ├── reflect.md
│   └── news.md
├── YYYY-MM-DD/             # 当日产出文件夹（自动建）
│   ├── financial_review.md
│   ├── english_daily.md
│   ├── workout.md
│   ├── 今日新闻.md
│   └── 反思.md
└── archive/                # 旧日期归档
```

> **维护心法**：`aboutme.md` 是唯一需要你手动维护的源——体重变了、公司变了、英语进步了，改这里即可。

---

## 🔌 MCP 配置

### 内置工具（已就绪，无需配置）
- **WebSearch / WebFetch** → TheoNews、TheoFin 使用（搜新闻、查汇率）。
- **Read / Write / Edit / Glob / Grep** → 全员使用（读写档案）。

### Notion MCP（可选，用于新闻同步）
**为什么推荐**：TheoNews 把简报同步到 Notion 后，手机端随时可看、可检索、可与团队分享，比翻本地文件夹方便。

**配置步骤**：
1. 在 Claude Code 里运行：`claude mcp add notion`（或用 `/mcp` 菜单添加）。
2. 官方 Notion MCP 需要 Notion Integration Token：
   - Notion → Settings → Connections → Develop your own integration → 新建 → 复制 `secret_xxx`。
   - 把要同步的 Notion 页面/数据库「连接」到这个 integration（页面右上角 ··· → Connections）。
3. 把 token 配进 MCP（按你平台的 MCP 配置方式写入 env / settings）。
4. 重启 Claude Code，确认 `/mcp` 列表里出现 notion。

> 未配置 Notion 时，TheoNews 会只存本地并提示「未检测到 Notion MCP」，不会报错或假装写入。

---

## 🚀 快速上手
1. 改一下 `aboutme.md` 里被 `[ ]` 占位的具体数字（体重目标等已填，可再核对）。
2. 试跑：输入 `/news-morning` 看新闻简报；或贴一封邮件用 `/english-check`。
3. 每天结束说一句「今天工作结束了」启动反思。
