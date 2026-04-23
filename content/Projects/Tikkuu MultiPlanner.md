---
title: MultiPlanner
description: 一个多标签项目规划工具，支持看板拖拽排序、子任务、截止日期与重复任务自动重置。
tags:
  - Projects
aliases:
  - Multi Planner
  - multiplanner
---

# MultiPlanner

MultiPlanner 是一个面向「多项目并行」场景的任务规划工具。  
它把项目侧边栏、标签页工作区和 Kanban 看板结合在一起，适合在同一个界面里管理多个项目流。

## Links

- 在线体验: [multi-planner-theta.vercel.app](https://multi-planner-theta.vercel.app/)
- GitHub: [CHENG-LIANG1/MultiPlanner](https://github.com/CHENG-LIANG1/MultiPlanner)

## 项目亮点

1. 多项目 + 多标签页工作流
   左侧项目列表支持新建、编辑、删除项目，并实时显示每个项目的任务进度。
   点击项目会在上方以标签页形式打开，便于快速在不同项目间切换。
2. Kanban 看板拖拽交互
   每个项目都有 `待办 / 进行中 / 已完成` 三列。
   任务支持同列内排序，也支持跨列拖拽改状态，并有明确的拖拽高亮反馈。
3. 任务模型更完整
   单任务支持标题、描述、截止日期、重复规则、子任务。
   卡片上可直接查看剩余天数、逾期状态、重复规则和子任务完成进度。
4. 重复任务自动重置
   支持 `每日 / 工作日 / 每周 / 每月 / 每年` 规则。
   系统会按周期自动把上一周期已完成的重复任务重置为待办，避免手动重复建任务。
5. 规则约束清晰
   为减少复杂冲突，重复任务与 `截止日期/子任务` 做了互斥约束，交互层会给出明确提示。

## 技术实现

- 前端框架: React 18 + TypeScript + Vite
- 状态管理: Zustand（数据状态与标签页状态解耦）
- UI: Tailwind CSS + shadcn/ui
- 日期能力: date-fns + react-day-picker
- 交互重点: 原生拖拽 + 列级与插入位反馈

## 架构说明（简版）

1. `dataStore` 维护项目与任务数据（CRUD、状态流转、重复任务重置）。
2. `tabManagerStore` 维护项目标签页（打开、激活、关闭、标题同步）。
3. `DesktopEnvironment` 负责整体桌面布局与周期重置调度。
4. `ProjectBoard` 负责项目看板与拖拽投放逻辑。
5. `TaskCard` 负责卡片交互（编辑、子任务勾选、状态推进、删除）。

## 当前阶段

当前版本以单机前端交互为主，重点验证多项目并行管理体验与任务流转模型。  
后续可以继续扩展为云端同步、团队协作与统计分析能力。
