---
title: ToT 是什么：Tree of Thoughts 思维树术语解释
description: 简明解释 ToT（Tree of Thoughts，思维树）的基本思想，以及它与 Chain of Thought 分步推理方法的区别。
aliases:
  - Tree of Thoughts
  - 思维树
tags:
  - 术语库
  - AI
---

**ToT（Tree of Thoughts，思维树）**：把“推理过程”从一条线（Chain）升级为一棵树（Tree）——模型会探索多条候选思路，并对每一步进行评价，必要时回溯/换路。

## 适合的任务类型

- 需要探索多种方案、并在中途判断“走不通就回头”的问题  
  （例如：复杂规划、解谜、多约束架构方案比较）

## 与 CoT 的区别

- **CoT**：强调把一条推理链写清楚（线性）
- **ToT**：强调搜索、分支、评估、回溯（非线性）
