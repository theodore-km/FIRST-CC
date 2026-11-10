# D ｜ 验金设备/服务 · 前置核实与启动包

> 状态：🟡 有条件探索。三项前置核实完成、且至少拿到一个机构意向前，**不进货**。
> 事实依据：`opportunity-2026-11-10.md` D节 + 两份 research 底稿。

## 1. 前置核实清单（现状）

| # | 事项 | 状态 | 说明 |
|---|---|---|---|
| ① | 缅甸对检测设备（XRF分析仪，HS 9027类）进口有无许可要求 | ⏳ 排期 11-21 后 | WebSearch 配额 11-21 重置。⚠️ 11-10 实测：**贸易门户 myanmartradeportal.gov.mm 已变「建设中」占位页**，原首查路径失效；commerce.gov.mm 首页可达但深层页 403，Tradenet 2.0 为登录制系统。11-21 备选路径：①门户恢复后查 Import Licence Search ②commerce.gov.mm 通知栏（/my/node/32071）翻进口许可类公告 ③ITA/JETRO 缅甸进口制度指南（负面清单框架）④缅甸律所简报 |
| ② | XRF 本地供给与价格（有无在缅经销商、租金水平） | ⏳ 排期 11-21 后 | 首查路径：厂商官网 Myanmar distributor 页（Thermo Fisher/Niton、Evident(原Olympus)、Skyray、Bruker）+ 仰光科学仪器商名录 |
| ③ | 协会/银行/大金店采购意向 | 🔵 **现在就能做**（不需要网络调研，靠走访） | 见 §2 目标清单与话术 |

预算参考框（**待核实**，先做沙盘）：全新手持 XRF 贵金属分析仪约 USD 2万–6万/台（国产 Skyray 类下限、进口 Niton 上限）；翻新机约可省 40%。按 1 台试销计算：到岸+关税+杂费后总投入约 USD 2.5万–7万。

## 2. 走访目标清单（按优先级）

| 目标 | 切入点（对方的需求，不是我们的） | 通道 |
|---|---|---|
| **YGEA**（Shwe Bon Thar 42号） | 协会 2025-02 自己宣布要建「黄金质量标准实验室」至今未落地——设备+运营方案正是他们缺的 | 协会办公室直接拜访；带英文版一页纸 |
| **CB Bank 消费信贷部** | 黄金质押贷款放 70–75% LTV，成色认定是他们的风控痛点（99% vs 掺假无法现场判定） | 银行对公渠道；ICBC 转介绍更佳 |
| **Academy / Aung Thamardi** | 自有精炼厂但门店回购也需快速验金；量大摊薄设备成本最快 | 门店回购柜台切入，找管理层 |
| **当铺集中区**（如 Thein Gyi 市场） | 单笔小但量大，假金受害最直接的群体 | 走访摸底，暂不推销 |
| UAB / KBZ / AYA / MTB | 有保管箱+可能上黄金产品线 | 二级目标，前三个跑通后再碰 |

## 3. 一页纸话术（v0.1，中英对照，走访前再润色）

**中文版（内部用）**

> 手持 XRF 贵金属分析仪：3 秒无损测出金饰/金条成色（K数与纯度%），无需火试金、不损伤货品。
> - 适用：金店回购、银行质押贷款估值、当铺收当、协会质检
> - 我们提供：设备供应 + 缅甸本地操作培训 + 中文/英文/缅文操作卡
> - 试点方案：首月可租后买（月租 USD ___，租金可抵购机款）
> - 参考：YGEA 2025年2月宣布筹建的黄金质量标准实验室同款能力
> 联系：[昆明公司抬头 / 电话 / 微信]

**English version（对外用）**

> Handheld XRF precious-metal analyzer: non-destructive purity & karat results in ~3 seconds — no fire assay, no damage.
> - Use cases: shop buyback, bank gold-loan appraisal, pawn intake, association QC
> - We supply: device + local operator training + trilingual quick cards
> - Pilot: rent-to-own first month (USD ___/mo, creditable against purchase)
> - Same capability as the gold testing lab YGEA announced in Feb 2025
> Contact: [Kunming entity / phone / WeChat]

【待办】缅文版：请母语者翻译，勿机翻直出（涉及商务措辞）。

## 4. 交易与合规设计（先想清楚再谈）

1. **交易结构**：昆明公司（贸易主体）出口设备 → 缅甸买家用 USD 经银行电汇付款（FATF黑名单下必须走银行全链条，合同/发票/物流单三单一致）
2. **不收 Kyat 现金货款**（unless 小额租金试点且有合规入账方案——先问 theo-fin）
3. **不代理不代购黄金本身**——我们只卖仪器，任何「顺便帮忙买金/验金带货」的要求一律拒绝
4. 设备出口侧：中国端 XRF 属普通科学仪器，正常报关出口；如含特定探测器件，报关行确认是否涉两用物项（概率低，走个流程）
5. 售后责任边界写进合同：培训+保修转发厂商，不做检测结论背书（我们不替买家对第三方出具鉴定报告，避免责任上身）
6. **买方 SDN 筛查（11-10 新增）**：签约前买方及最终受益人过一遍 OFAC 制裁搜索（sanctionssearch.ofac.treas.gov），截图入档。已核实（`research/sanctions-ofac-2026-11-10.md`）：缅甸无黄金行业专门点名，但国有矿业/宝石企业（Mining Enterprise 1/2、Myanma Gems/Pearl/Ruby Enterprise）与军企/军头圈共 152 条在册——YGEA、Aung Thamardi、Academy 等民营金商不在名单上。名单月度滚动，**每次签约前重跑**

## 5. 下一步排期

- **本周**：Theo 走访 YGEA + 1 家金店 + CB Bank（用 §3 话术摸意向）；回报意向等级（A有预算/B有兴趣/C无反应）
- **11-21 后**（配额重置）：恢复网络核实 ①②；拿到 ①进口规则 + ②价格 + ③至少一个 A/B 级意向 → 出「首台试销 go/no-go」决定
- **Go 之后**：选 1 台国产中端机（成本可控、断供风险低）→ 报关出口 → 试点租赁
