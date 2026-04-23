---
tags:
  - 术语库
---

# Obsidian 术语库使用说明

目标：把常见缩写（TTFT、RAG、ToT…）做成独立页面，配合 Obsidian 的 **Page preview（页面预览）**，实现“鼠标悬浮就显示解释”。

## 1) 打开 Page preview

在 Obsidian：Settings → Core plugins → 打开 **Page preview**。

## 2) 怎么写才会悬浮显示

把术语写成内部链接：

- `[[TTFT]]`
- `[[RAG]]`
- `[[ToT]]`

悬浮到链接上就会显示该术语页面的预览。

## 3) 建议做法（降低改文成本）

- 常见缩写全部做成术语页（在 `术语库/` 目录）
- 在原笔记页面 frontmatter 里加 `aliases`（比如 CoT、MCP、System Prompt），这样你写 `[[CoT]]` 就能跳到对应笔记并悬浮预览

入口页：[[术语库索引]]

