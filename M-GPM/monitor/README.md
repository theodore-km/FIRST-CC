# M-GPM 金市监测（Yangon Gold Monitor）

> E 产品线的运行手册。每期产出一份带来源的行情与政策简报，存于本目录 `issue-NNN-YYYY-MM-DD.md`。
> 设计原则：只报事实、每个数字带来源和日期、算不清就标「数据缺失」，绝不硬凑。

## 指标体系（每期必填）

| # | 指标 | 定义 | 数据源 |
|---|---|---|---|
| 1 | 国际现货金 | USD/oz，标注报价时间 | goldprice.org / 媒体报道 |
| 2 | Kyat 平行汇率 | USD/MMK 黑市价 | Irrawaddy / DVB 周报 |
| 3 | 仰光市场金价 | 24K，Kyat/tical，**媒体报道口径** | Irrawaddy / DVB / Myanmar Now / 金店公开页 |
| 4 | 官方参考价 | Kyat/tical，委员会/YGEA 口径 | GNLM / CSO |
| 5 | 双轨价差 | (市场价 − 参考价) ÷ 市场价 ×100% | 计算 |
| 6 | 隐含汇率 | 市场价 ÷ 0.5251 ÷ 国际金价 → Kyat/USD；与#2对比得溢价/折价% | 计算 |
| 7 | 每tical美元值 | 市场价 ÷ 平行汇率 | 计算 |
| 8 | 政策/执法动态 | 本期新发生的 2–4 条，各附来源 | 权威媒体 |
| 9 | 触发条件看板 | J 清单5项状态（见下） | 累积监测 |

## 常量

- 1 tical = 16.329325 g = **0.5251 金衡盎司**
- 隐含汇率 = 市场价(Kyat/tical) ÷ 0.5251 ÷ 国际金价(USD/oz)

## 触发条件看板（J 改革期权，任一触发即重评 A/B 方向）

1. [ ] 官方参考价与市场价并轨（价差 <5%）
2. [ ] 黄金进出口对非特许主体开放
3. [ ] 缅甸 FATF 除名
4. [ ] 制裁实质性放松
5. [ ] 线上售金解禁

## 信源白名单（Theo 已批准，2026-11-10）

只从下列来源取数，白名单外来源须先报备：
- **行情/媒体**：The Irrawaddy、DVB、Myanmar Now、Frontier Myanmar、Eleven Media、Reuters
- **官方**：GNLM（官媒）、CSO 统计（注意：疑为参考价口径）、缅甸央行/贸易门户公告
- **国际**：goldprice.org（现货金）、世界银行 Myanmar Economic Monitor
- **行业**：YGEA/委员会公告、Aung Thamardi 官网（JS 动态加载，常抓取失败，见下方数据坑）

## 每期流程（SOP）

1. 派数据员抓 5 组数据（国际金/平行汇率/市场金价/参考价/一周政策动态），要求逐项带[来源, 日期]
2. 按指标表计算 #5 #6 #7
3. 填入期号模板（下方），保存 `issue-NNN-YYYY-MM-DD.md`
4. 数据缺失项如实标「缺失/滞后（xx日期口径）」
5. 末尾更新触发条件看板勾选状态
6. 读者版摘要（3-5行）发给 Theo；需转发版本另行排版

## 期号模板

```markdown
# 金市监测 #NNN ｜ YYYY-MM-DD

## 行情仪表盘
| 指标 | 数值 | 日期 | 来源 |
|---|---|---|---|
| 国际现货金 | $X,XXX/oz | … | … |
| 平行汇率 | X,XXX Kyat/USD | … | … |
| 仰光市场价 | X,XXX万 Kyat/tical | … | … |
| 官方参考价 | XXX万 Kyat/tical | … | … |
| 双轨价差 | XX% | 计算 | — |
| 隐含汇率 vs 平行 | X,XXX vs X,XXX（±X%） | 计算 | — |

## 本周动态
- …

## 触发看板
- [ ] 1 并轨 …（当前价差XX%）

## 一句话
> ……
```

## 已知数据坑（重要）

- **11-10 实测**：myanmartradeportal.gov.mm 变「建设中」占位页；commerce.gov.mm 首页可达、深层页 403（反爬）；Eleven 连接失败；mmtimes 域名停摆；GNLM/Shan/Frontier/Irrawaddy/Mizzima 主站 403。**可靠通路：各站 RSS/官网直抓 + DVB 缅文版 burmese.dvb.no**。Google News RSS 仅作发现层（11-10 起已移出 WebFetch 自动放行名单，逐次审批），命中条目后应转抓出版社原域名核实。Facebook 行情图帖始终不可读
- WebSearch 与 webReader MCP 月配额 11-21 重置；期间直抓一律走内置 WebFetch + curl

- Aung Thamardi 官网价格为 JS 动态加载，抓取常失败 → 依赖媒体转述口径
- CSO 官方统计疑为**参考价口径**（2026-11实测705万 vs 市场>1,000万），引用时必须注明口径
- 平行汇率媒体周报有 3–7 天滞后，隐含汇率对比时注意时间错位
- 媒体金价报道常滞后数天——所有数字以「数据对应日期」为准，不以发稿日为准
