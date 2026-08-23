---
title: Click Arena
description: 一个由真人助推决定排名、永久累计成绩的双语作品点击擂台。
tags:
  - Projects
aliases:
  - ClickArena
  - click-arena
---

# Click Arena

Click Arena 是一个永久累计排名的双语作品擂台。真人访客可以反复助推喜欢的作品，每次有效点击都会作为独立事件进入总排行榜。

## Links

- 在线体验：[click-arena.vercel.app](https://click-arena.vercel.app/)
- GitHub：[CHENG-LIANG1/ClickArena](https://github.com/CHENG-LIANG1/ClickArena)

## 项目亮点

1. **永久累计的作品排名**
   排行榜不按周重置，按有效助推总数排名；票数相同时，更早到达该票数的作品优先。
2. **真人助推与异常流量区分**
   允许真实访客反复助推，同时通过幂等互动 ID 和异常爆发识别，避免重放流量影响排名。
3. **链接卡片与独立访问统计**
   支持小红书、X 和通用网站链接，并将作品访问、站点 PV/UV、匿名会话、在线状态与助推分开记录。
4. **双语响应式交互**
   中英文界面覆盖作品浏览、提交、排名变化和点击反馈。

## 技术实现

- 应用框架：Next.js 16 + React 19 + TypeScript
- 数据库：PostgreSQL + Drizzle ORM
- 组件与交互：shadcn/ui + Radix UI + Lucide Icons + Motion
- 链接解析：Cheerio，并包含 DNS 与私有网络访问检查
- 质量保障：Vitest + ESLint + TypeScript
