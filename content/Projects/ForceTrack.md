---
title: ForceTrack
description: 一个本地优先、无需登录的 Jira 风格项目管理工作台，支持多项目、Backlog、Sprint、看板、项目概览与时间线。
tags:
  - Projects
aliases:
  - force-track
  - forcetrack
---

# ForceTrack

ForceTrack 是一个本地优先的轻量项目管理 Web 应用。它把需求规划、Sprint 执行、看板流转、项目健康度与时间线放进同一个桌面工作台，无需账号或后端即可使用。

## Links

- 在线体验：[force-track.vercel.app](https://force-track.vercel.app/)
- GitHub：[CHENG-LIANG1/ForceTrack](https://github.com/CHENG-LIANG1/ForceTrack)

## 项目亮点

1. **完整的项目工作流**  
   从 Backlog 中创建和排序工作项，规划并启动 Sprint，再通过 Board 推进状态，最后在 Summary 和 Timeline 中复盘项目进展。
2. **多项目管理**  
   支持创建、切换、编辑和删除项目，并可从最近项目中快速恢复工作上下文。Summary、Backlog、Board 与 Timeline 都按项目隔离。
3. **可操作的 Sprint 与看板**  
   支持 Sprint 的创建、编辑、启动、完成和删除；看板提供四个状态列、任务计数、同列排序和跨列拖拽，同时兼容指针与键盘操作。
4. **本地优先的数据模型**  
   项目、任务和偏好设置都保存在浏览器本地。数据结构带版本迁移与损坏数据备份机制，在没有后端的情况下仍兼顾可恢复性。
5. **清晰的筛选与项目视图**  
   Backlog 支持搜索，以及按负责人、工作类型、状态和优先级组合筛选；Summary 提供项目健康指标，Timeline 展示已排期与未排期工作。
6. **双语与主题切换**  
   支持中文 / 英文界面与亮色 / 暗色主题，语言和主题偏好会在本地持久化。

## 技术实现

- 前端框架：React 19 + TypeScript + Vite
- 样式与组件：Tailwind CSS 4 + shadcn/ui + Radix UI
- 拖拽交互：dnd-kit
- 路由与国际化：React Router + i18next
- 数据持久化：版本化的 LocalStorage workspace 与迁移恢复机制
- 质量保障：Vitest + Testing Library + Playwright

## 当前阶段

当前版本是桌面优先的本地单机 MVP，重点验证从需求池到 Sprint 执行与复盘的完整流程。暂不包含账号、权限、邀请、多人实时协作或服务端同步。
