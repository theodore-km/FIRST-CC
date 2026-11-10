# 制裁核实：OFAC SDN 缅甸条目（2026-11-10 完成）

> 方法：直接下载 OFAC SDN 名单一手文件 `treasury.gov/ofac/downloads/sdn.xml`（发布日 **2026-11-09**，全表 19,563 条）本地解析。非二手报道，为名单原口径。
> 对应：`opportunity-2026-11-10.md` 前置核实清单第 2 项（OFAC 部分 ✅；UK/EU 部分 ⬜ 见文末）。

## 结论（TL;DR）

1. **OFAC 没有专门针对缅甸「黄金行业」的点名清单**——缅甸关联条目里名称/别名/备注含 "gold" 的仅 1 条，还是 UWSA 系 Hong Pang 电子公司的别名 "Gold Mount Industrial"（SDNTK 毒品计划，与仰光金市无关）
2. 但**国有矿业/宝石条线全部在册**：MINING ENTERPRISE NO 1 / NO 2、MYANMA GEMS ENTERPRISE、MYANMAR PEARL ENTERPRISE、MYANMAR RUBY ENTERPRISE（均为 BURMA-EO14014）→ **任何接触国有矿/宝石实体的上游黄金业务 = 直接踩 SDN**
3. **缅甸军政府生态圈共 152 条**（BURMA-EO14014）：军头个人、33/66/77 轻步兵师、国防部/国防工业局/军需总局、国有银行（MFTB、MICB、AGD/亚洲绿色发展银行）、MEHL/MEC 两大军企、Tay Za 家族+Htoo 集团、Shwe Byain Phyu、Asia Sun（含对俄油运）、Star Sapphire 等寡头集团、边境民兵武装（KNA、DKBA，挂 TCO/CYBER4 诈骗标签）
4. **YGEA / Aung Thamardi / Academy 等民间金商均不在 SDN**——民间黄金零售/品牌条线暂无 OFAC 点名（注意：这只说明不在 SDN，不等于「安全」，见下方解读）

## 对 M-GPM 各线含义

| 线 | 含义 |
|---|---|
| E 监测产品 | ✅ 零接触面。数据源均为媒体/官网，无制裁问题 |
| F 金库对冲 | ✅ 品牌金店不在 SDN；但**单店大额现金交易仍需留凭证链**（FATF 黑名单下银行审查），与原判断一致 |
| D 验金设备 | 🟡 出口对象尽调必须过一遍 SDN 筛查（尤其银行类买家：MFTB/MICB/AGD 系关联一概不碰）；YGEA/协会/民营金店/当铺不在名单上 |
| A/B（已判定不做） | 若重启，缅方合作方须逐个过 SDN；国有矿金来源直接死刑 |

**操作落地**：D 线合同前尽调 SOP 加一条——买方及其最终受益人姓名/实体名跑一遍 OFAC 制裁搜索（sanctionssearch.ofac.treas.gov，免费公开），留存搜索截图入档。设备出口以美元银行结算，天然避开缅甸被制裁国有行（走 ICBC/昆明端收汇）。

## 名单结构性备注

- 193 条缅甸关联 = 152 条 EO14014（军政府生态）+ 41 条仅挂国家字段（多为 SDNTK 1980-90年代禁毒时代的 UWSA/边境集团老条目）
- EO14014 = 2021 政变后行政令；GLOMAG/TCO/CYBER4/DPRK 为叠加标签
- 名单每月滚动更新：任何「一次性核查」都有保质期——**每次签新合同前重跑**，或 11-21 后考虑做月度自动筛查（技术可行：SDN 文件公开下载，可并入 monitor 流程）

## 未完成部分（后续）

- **UK**：OFSI 旧合并 CSV 已下线，改为 UK Sanctions List 单一来源（gov.uk）——11-21 后核实缅甸条目结构。英国缅甸制裁制度与 OFAC 高度同源，预期结论相近
- **EU**：欧盟合并名单 CSV 下载中（webgate.ec.europa.eu/fsd），完成后本地筛缅甸/黄金条目，补记于此
- 本文件只覆盖「点名清单」维度；次级制裁/出口管制（EAR）维度不在本次范围
