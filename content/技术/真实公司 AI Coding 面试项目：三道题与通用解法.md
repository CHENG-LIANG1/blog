---
title: 真实公司 AI Coding 面试项目：三道题与通用解法
created: 2026-08-26
description: 三道匿名化真实公司 AI Coding 项目的拆解：Computer Use Agent、React Native 行动 Agent 与 Jira 风格系统，以及限时交付的通用方法。
blogSubcategory: 面试
tags:
  - 技术
  - AI
  - AI Coding
  - 面试
  - Agent
aliases:
  - AI Coding 面试项目指南
  - 真实公司 AI Coding 项目
sourceRepo: https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects
sourceCommit: 42915b7f3f499c13f7a6826aabd2d2ff0557c976
sourceUpdated: 2026-08-26
---

AI Coding 面试已经不只是“让 AI 写一个页面”。真正有区分度的项目，会同时检查需求理解、产品取舍、系统设计、AI 协作、工程质量和最终交付。

我把自己遇到的三道真实项目题做了匿名化和结构化整理，放在 GitHub 仓库 [real-company-interview-ai-coding-projects](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects) 中。为保护隐私，仓库不包含公司、面试官或客户信息，题面也不是原始材料的逐字转载。

> [前往 GitHub 查看完整题目、验收清单和通用解法 →](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects)

这篇文章不重复仓库中的全部需求，而是解释三道题背后共同的考察方式，以及它们为什么比表面看起来更难。

## 三道题，三种工程压力

| 项目                                                                                                                                                        | 交付形态                    | 核心闭环                                               | 主要考察                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| [Computer Use Agent Dashboard](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/01-computer-use-agent-dashboard.md) | Web + Agent + 隔离桌面      | Prompt → 模型决策 → Computer / Shell 工具 → 可观测结果 | 真实工具循环、会话隔离、运行时可靠性      |
| [React Native 截图行动 Agent](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/02-react-native-action-agent.md)     | React Native / iOS，48 小时 | 截图 → 结构化 Action → 用户确认 → 原生工具 → Memory    | 多模态理解、Human-in-the-loop、副作用安全 |
| [Jira 风格任务系统](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/03-jira-style-task-system.md)                  | Web，一日 MVP               | 创建任务 → 看板流转 → 搜索筛选 → Timeline → 本地持久化 | 限时取舍、单一数据源、交互和交付完整度    |

三道题的技术栈差异很大，但它们都在问同一件事：候选人能否把一份模糊、庞杂、有时间限制的要求，收敛成一个可运行、可验收、可解释的系统。

## 题目一：Computer Use Agent 难在“真的做了”

表面上，这是一个 Chat 和远程桌面组成的 Dashboard。如果只做 UI，很快就能搭出对话区、桌面区和时间线；真正的难点是让以下链路完整成立：

```text
用户任务
→ 模型基于截图和上下文做决策
→ 调用 Computer / Shell 工具
→ 隔离桌面产生真实变化
→ 返回结构化事件
→ 模型继续决策，直到完成、失败或到达安全上限
```

这道题首先在检查它是否为真正的多步工具循环。最终回答必须来自实际执行结果，工具失败时不能用一段模型文字伪造“已完成”。

其次是状态边界。至少需要分开四种东西：

| 状态            | 负责什么                               |
| --------------- | -------------------------------------- |
| Desktop Runtime | 隔离桌面的创建、就绪、断线、重连和销毁 |
| Conversation    | 消息、模型配置和 Prompt 队列           |
| Agent Run       | 一次执行的等待、运行、完成、失败和取消 |
| Tool Event      | 单次动作的参数、耗时、结果和错误       |

如果把这些状态混在一个前端 Store 里，就很容易出现会话串线、切换对话导致桌面重建、远程桌面断线被误判为 Agent 失败，或者用户连续提交 Prompt 后多个任务同时点击同一台桌面。

所以这道题考的不是“会不会调用模型”，而是能不能把模型、工具、运行时、会话和可观测事件组合成可靠系统。

[查看题目一的完整 P0、验收场景与评分点 →](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/01-computer-use-agent-dashboard.md)

## 题目二：移动 Agent 难在“模型只能提议”

这是一道 48 小时的 React Native / iOS 项目。用户上传聊天截图并补充文字，Agent 识别人物、时间、联系方式和行动意图，然后建议创建会议、创建联系人或更新联系人。

如果实现只做到“上传截图 → 调用视觉模型 → 展示文字”，它仍然只是 API 套壳。真正的 Agent 闭环是：

```text
聊天截图 + 补充文字
→ 结构化 Action
→ Schema 校验和冲突提示
→ 用户编辑、逐张确认
→ 调用 iOS 日历或通讯录工具
→ 返回执行回执
→ 将已确认事实写入 Memory
```

关键原则是：**AI 提议，用户确认，系统执行，结果可追溯。**

这里的难点不只是识别截图，而是处理真实副作用：

- “下周二下午”必须结合设备日期和时区，无法确定时要求用户选择；
- 模型分析不等于写入授权，每张 Action Card 都要独立确认；
- 重试、重复点击或 App 重启不能创建两份日历事件或联系人；
- 只有用户确认且工具执行成功的结果，才能进入长期 Memory；
- 取消、失败或未确认的模型观察，不能伪装成事实。

这道题真正拉开差距的是 Human-in-the-loop、幂等、权限最小化、Memory 事实边界和失败回执，而不是识别出了多少字段。

[查看题目二的完整状态流、隐私要求与验收场景 →](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/02-react-native-action-agent.md)

## 题目三：一日 MVP 难在“知道什么不做”

第三道题没有模型、多模态或隔离运行时，只要求在一天内完成一个 Jira 风格的任务管理系统。但“技术不新”不等于“项目简单”。

它同时包含任务 CRUD、四列看板、跨列拖拽、搜索和筛选、Timeline、中英文、深浅主题与本地持久化。时间有限时，最容易犯的错是把每个功能都做到一半。

更稳定的顺序是：

```text
单一任务数据源
→ CRUD 和看板状态流转
→ 刷新后恢复
→ 搜索和筛选
→ 只读 Timeline
→ 国际化、主题和交付打磨
```

看板和 Timeline 必须共享同一份任务状态，否则拖拽后很容易出现两个页面不一致。拖拽也不能成为唯一的状态修改方式，需要为键盘和小屏用户保留状态选择器。本地存储损坏、日期范围非法、搜索无结果和未排期任务也都是交付范围的一部分。

在一日项目里，完整做好数据正确性、核心交互、边界状态和生产构建，比一开始就做完整甘特图、多项目、权限或协作系统更有价值。

[查看题目三的时间盒、阻塞级缺陷与完整交付清单 →](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/03-jira-style-task-system.md)

## 三道题共同在考什么

不管项目里有没有 Agent，真正的评估维度都很相似。

| 维度     | 弱提交                          | 强提交                                               |
| -------- | ------------------------------- | ---------------------------------------------------- |
| 需求理解 | 一边写一边猜，所有功能同时开工  | 先分 P0、P1 和明确不做，每条 P0 都有验收句           |
| 核心闭环 | 页面很多，但主流程在中间断掉    | 输入、处理、状态、副作用、回执和展示全部连通         |
| 架构边界 | UI、业务状态和外部 SDK 直接耦合 | 数据、状态、工具和运行时责任清楚                     |
| AI 协作  | 把整道题一次性丢给 AI           | 用小任务合同约束范围，逐步 Review 和验证             |
| 失败处理 | 只演示 Happy Path               | 能解释校验、重试、幂等、取消、恢复和凭据边界         |
| 交付证据 | 只有代码和自述                  | 用测试、构建、真实操作、截图、录屏和已知限制证明结果 |

这也是为什么代码量通常不是决定性指标。AI 可以在很短时间里生成大量文件，却不会自动保证需求没有跑偏、数据只有一个事实源、外部写入不重复，或者最终构建真的能交付。

## 一套可复用的 AI Coding 解题流程

仓库里的 [AI Coding 项目通用解法](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects/blob/main/docs/04-ai-coding-playbook.md) 把整个过程拆成了一套可执行流程。我将它压缩成六步。

### 1. 先冻结范围

把题面整理成需求矩阵，明确用户、输入、输出、P0、P1、不做、约束、交付物和验收方式。

不要只写“支持创建会议”，而要改写成可验收句：

> 给定包含明确时间的截图，系统生成可编辑会议卡；用户确认后只创建一个日历事件；执行失败不写入成功 Memory。

### 2. 先审计 Starter，再修改

如果题目提供现有仓库，先记录安装、测试、类型检查、生产构建和主流程的基线。先分清哪些能复用、哪些是真实缺口，再决定是修复、扩展还是局部重写。

### 3. 设计最小闭环和四个边界

先画一条主链路：

```text
输入 → 校验 → 核心处理 → 状态变化
→ 外部副作用 → 回执 → 持久化 → 展示
```

然后分别回答四组问题：数据的事实源在哪里，状态如何合法转移，工具如何校验与返回错误，以及客户端、服务端、设备和隔离环境各自拥有什么。

### 4. 按垂直切片交付

不要按“先写完所有组件，再写完所有接口”拆任务。更有效的四个切片是：

1. 最小 Happy Path；
2. 持久化和恢复；
3. 失败与边界；
4. 搜索、主题、教程等扩展体验。

每个切片都应该能够独立运行、验证和提交。

### 5. 给 AI 明确的任务合同

比起“帮我完成这个功能”，一份有效的 AI 任务应包含：

```text
Context         当前状态和不能破坏的行为
Goal            这一轮只完成什么结果
In Scope        允许修改的文件和必须实现的行为
Out of Scope    明确不做的重构和扩展
Constraints     技术版本、Schema、状态、安全与时间限制
Acceptance      给定什么输入，应观察到什么结果
Required Checks 必须运行的检查、测试和真实流程
```

这不只是 Prompt 技巧，而是用工程任务单控制 AI 的修改边界。

### 6. 用证据验收，在最后阶段冻结新功能

每轮完成后都要看 Diff、跑最小相关测试，再通过浏览器、模拟器或隔离环境执行真实流程。最后的 Gate 至少包含格式、Lint、类型检查、领域测试、关键 E2E、人工验收和生产构建。

时间盒后段应该冻结新功能，把时间留给修复、README、截图、录屏和演示。对限时项目来说，一个有已知限制、但可稳定演示的 P0，比几个无法验证的 P1 更有价值。

## 仓库里还有什么

本文只提炼了共同逻辑。GitHub 仓库中还包含：

- 三道题逐项拆分的 P0、P1 和明确不做；
- 数据、状态、工具、运行时、权限和隐私边界；
- 可直接复用的验收场景、时间盒和交付检查清单；
- 需求矩阵、AI 任务合同和分层验证方法；
- 三道题对应的个人实现仓库。

| 题目                         | 个人实现                                                                 |
| ---------------------------- | ------------------------------------------------------------------------ |
| Computer Use Agent Dashboard | [ai-agent-dashboard](https://github.com/CHENG-LIANG1/ai-agent-dashboard) |
| React Native 截图行动 Agent  | [ContactFlow](https://github.com/CHENG-LIANG1/ContactFlow)               |
| Jira 风格任务系统            | [ForceTrack](https://github.com/CHENG-LIANG1/ForceTrack)                 |

如果你正在准备 AI Coding 笔试、Take-home Assignment 或现场结对开发，建议直接打开仓库：先读三道完整题目，再复制通用解法中的需求矩阵、任务合同和交付检查清单。

> [查看 real-company-interview-ai-coding-projects 完整仓库 →](https://github.com/CHENG-LIANG1/real-company-interview-ai-coding-projects)
>
> 如果这份整理对你有帮助，欢迎在 GitHub 收藏（Star），也可以通过 Issue 补充你遇到的 AI Coding 考察点。
