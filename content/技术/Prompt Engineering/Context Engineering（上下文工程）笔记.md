---
tags:
  - 技术
aliases:
  - Context Engineering
  - 上下文工程
---

> 一句话看懂：**上下文工程就是在 token 预算内，把“当前任务最相关的信息”精准喂给模型**——它决定了系统的智商下限与成本上限。

## 1. 它解决什么问题：别再把整个项目塞进对话框
在 `Agent = Prompt + Harness` 里，Prompt 更像“指令集”，而 Context 更像“运行内存”。上下文做不好，会出现两类灾难：

1. **成本与延迟爆炸**：上下文越长，越贵、越慢，TTFT 变长，心流崩溃。
2. **Lost in the Middle（中间迷失）**：模型对“开头/结尾”更敏感，对中段信息注意力衰减；你塞越多，核心线索越容易被淹没。

> 经验法则：**你希望模型“看懂什么”，就只给它“必要且足够”的证据。**

## 2. 三种常见流派（从“短期记忆”到“长期记忆”）
**2.1 动态截断与滑动窗口（短期记忆）**
用于多轮对话场景：
- **丢弃不重要历史**：保留关键决策、关键约束、最近的错误与结果。
- **总结压缩**：把“过去 10 轮的聊天”浓缩成 1-3 句可执行结论。

关联：System Prompt 负责“它是谁”，而对话总结负责“刚刚发生了什么”。见 [[System Prompt（系统提示词）笔记]]。

**2.2 RAG（检索增强生成，长期记忆/私有知识库）**
适用于“知识在外部”的任务（文档、代码、规范）：
- **Chunking**：把文档/代码切成可检索的片段。
- **Embedding + Top-K**：把最相关的片段捞出来，放回上下文里作为证据。

**2.3 环境状态注入（IDE 变聪明的秘密）**
适用于“问题发生在工作区”的任务：
- 当前光标位置、函数名、调用链
- Linter/Compiler 最新报错
- 相关文件依赖树（AST/Import graph）
- 运行环境（SDK/OS/版本）

关联：这些信息通常由 [[Harness Engineering（Agent 运行底座）笔记]] 在本地自动采集、整理并注入。

## 3. 代码类检索的关键：Chunking 不能按字数切
按字符截断会把函数拦腰斩断，最优做法是**按结构切**（AST-based chunking）：
- Class 级：类签名 + 属性 + 方法签名
- Method 级：方法体
- 超长 UI（如 1000 行 Widget）：按 `build`、state、事件处理、样式等分块

## 4. 实战：动态组装一个“高信噪比”上下文块
思路：把上下文分为“环境状态 + 检索资料”，并用结构化标签包起来（降低模型认知负担）。

```ts
import { ChatCompletionMessageParam } from "openai/resources";

class WorkspaceContext {
  static async getCurrentFileAST(): Promise<string> {
    return "class ProfileCard extends StatelessWidget { ... }";
  }
  static async getLinterErrors(): Promise<string> {
    return "Error: The argument type 'String?' can't be assigned to the parameter type 'String'.";
  }
  static async queryVectorDB(intent: string): Promise<string> {
    return "Venus UI 规范: 所有卡片组件默认 margin 为 16px，必须处理 Null Safety。";
  }
}

async function buildAgentPayload(userQuery: string): Promise<ChatCompletionMessageParam[]> {
  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: "你是一个注重可维护性与性能的工程助手。"
  };

  const [currentFile, linterError, ragDocs] = await Promise.all([
    WorkspaceContext.getCurrentFileAST(),
    WorkspaceContext.getLinterErrors(),
    WorkspaceContext.queryVectorDB(userQuery)
  ]);

  const contextBlock = `
  <context>
    <workspace_state>
      <current_file>${currentFile}</current_file>
      <active_errors>${linterError}</active_errors>
    </workspace_state>
    <retrieved_docs>
      ${ragDocs}
    </retrieved_docs>
  </context>
  `;

  const finalUserMessage: ChatCompletionMessageParam = {
    role: "user",
    content: `${contextBlock}\n\n【用户指令】${userQuery}`
  };

  return [systemPrompt, finalUserMessage];
}
```

## 5. 三条落地法则（可直接当检查清单）
1. **如无必要，勿增实体**：只喂“与任务直接相关”的证据。
2. **结构化上下文**：用 XML/分段标题包裹不同类型信息（报错、代码、需求、约束）。见 [[结构化输出（Structured Output）笔记]]。
3. **排序决定成败**：把“最关键、最即时”的信息放在最靠近用户问题的位置（通常在末尾）。

## 6. 相关笔记
- [[Harness Engineering（Agent 运行底座）笔记]]：Harness 负责采集/整理/注入上下文，是上下文工程的执行者。
- [[Model Context Protocol（MCP）笔记]]：MCP 让“上下文/工具/资源”接入标准化。
- [[System Prompt（系统提示词）笔记]]：Prompt 负责“原则”，Context 负责“证据”，两者缺一不可。
