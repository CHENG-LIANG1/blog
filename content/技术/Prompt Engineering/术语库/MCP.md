---
tags:
  - 术语库
aliases:
  - Model Context Protocol
  - 模型上下文协议
---

# MCP

**MCP（Model Context Protocol，模型上下文协议）**：一套让大模型/Agent 以“统一接口”连接外部工具与数据源的协议规范；你可以把它理解为 AI 世界的“USB-C 接口”。

## 缩写 / 全称 / 同义词

- **缩写**：MCP
- **全称**：Model Context Protocol
- **相关说法**：工具接入协议、Agent 工具总线（非官方）

## 定义（更具体一点）

MCP 把“工具/数据源”封装成标准化的 **MCP Server**，客户端（如 Cursor、Claude Desktop、Agent Harness）用一致的方式发现能力、传参调用、读取资源，从而避免为每个模型/每个数据源重复写胶水代码。

## 相关术语

- [[Function Calling]]
- [[Tool Use]]
- [[Context Engineering]]
- [[Harness Engineering]]

## 引用 / 出处（Obsidian 文档引用）

- [[Model Context Protocol（MCP）笔记]]
  - > MCP 是让大模型“即插即用”连接工具与数据源的统一接口标准
