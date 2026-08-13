---
title: SSE 是什么：Server-Sent Events 与 AI 流式输出
description: 简明解释 SSE（Server-Sent Events）的单向通信机制，以及它在 ChatGPT 类 AI 应用流式输出中的常见用法。
aliases:
  - Server-Sent Events
  - 流式输出
  - Streaming
tags:
  - 术语库
  - AI
---

**SSE（Server-Sent Events）**：一种服务器向客户端单向持续推送数据的通信方式，常用于大模型 **Streaming（流式输出）**：模型边生成边返回，前端边接收边渲染。

## 为什么常和 LLM 一起出现

- 让用户更快看到“第一点内容”，改善体感（降低 [[TTFT]] 的主观痛感）
- 可以显示“正在思考/正在调用工具/正在生成”等状态，减少等待焦虑
