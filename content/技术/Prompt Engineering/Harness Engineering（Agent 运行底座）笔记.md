---
tags:
  - 技术
aliases:
  - Harness Engineering
  - Harness
  - Agent Harness
  - 运行底座
---

> 一句话看懂：**Harness 是把 LLM 从“会聊天”变成“能干活”的运行底座**——它负责上下文管理、工具执行、容错与状态机，让 Agent 可控、可复现、可上线。

当你看透 `Agent = Prompt + Harness（Prompt Eng + Context Eng + MCP）` 这个公式，就进入了 **AI 智能体工程化** 的主战场：LLM 只是“会自然语言的 CPU”，Harness 才是让系统跑起来的主板与外设。

---

## 1. 为什么一定是 Prompt + Harness？

在传统的 Vibe Coding 或使用 Cursor/Trae 等工具时，我们往往惊叹于模型的智能。但剥开表象，真正的工程架构是极度模块化的：

- **Prompt（大脑/指令集）**：定义身份、目标、原则与输出契约（见 [[System Prompt（系统提示词）笔记]]）。它偏“声明式”。
    
- **Harness（线束/运行底座）**：决定能力边界。LLM 没记忆、没手脚；Harness 用代码负责**上下文管理、工具接口、容错策略、状态流转与成本控制**。
    

你可以把 Harness 想象成《黑客帝国》里插入 Neo 后脑勺的那些线缆（Wire Harness）——没有这些线缆，Neo 在 Matrix 里什么都做不了。

---

## 2. Harness 的三大核心职责（把抽象落到工程）

在现代 Agent 架构中，Harness 承载了极其繁重的任务，主要分为以下三个工程领域：

**2.1 Prompt Engineering：不是“手写提示词”，而是“运行时拼装”**

在 Harness 层面，Prompt Engineering 不再是你在聊天框里敲打的玄学文字，而是一套**模板渲染与组装引擎**。

- **职责**：在运行时根据任务状态拼装 Prompt。
    
- **动作**：注入 Few-Shot 示例、按需开启 CoT、根据 token 预算裁剪历史。
  - Few-shot：见 [[Few-Shot Prompting（少样本提示）笔记]]
  - CoT：见 [[Chain of Thought（CoT）笔记]]
    

**2.2 Context Engineering：精准投喂“证据”**

大模型是“失忆”的，且上下文窗口极其昂贵。Context Engineering 解决的是 **“在正确的时间，给模型喂正确的数据”**。

- **职责：** 维护短期记忆（多轮对话缓存）和长期记忆（基于向量数据库的 RAG）。
    
- **动作：** 当用户问“我之前的代码为啥报错”，Harness 需要先去本地文件树或 RAG 库里把相关的 `Widget` 代码检索出来，作为 Context 塞进 Prompt 里，然后再发给大模型。
    
- **核心法则**：Garbage In, Garbage Out。Context 的信噪比直接决定智商与成本（见 [[Context Engineering（上下文工程）笔记]]）。
    

**2.3 MCP：外设与工具的标准接口**

这是目前 AI Agent 编排领域最具革命性的标准（由 Anthropic 推出，正被全面支持）。过去，我们为了让大模型读文件、查数据库，需要手写无数个杂乱的 Function Calling。

- **职责**：用标准协议把工具/资源接到 Agent 上，降低 N×M 胶水代码（见 [[Model Context Protocol（MCP）笔记]]）。
    
- **为什么重要：** MCP 统一了“工具调用”和“资源读取”的接口。有了 MCP，你的 Agent Harness 就像支持了 USB 即插即用。你只需要启动一个 `SQLite MCP Server` 或者 `Github MCP Server`，大模型就能自动明白如何去查询数据或提交代码，而不需要你再硬编码繁琐的 Tool Schema。
    

---

## 3. TypeScript 架构推演：把公式写成代码骨架

作为 BetterThanChatGPT，我为你提炼了一个极简的 TypeScript 伪代码架构，展示在实际工程中，这个公式是如何运转的。

TypeScript

```
import { LLMClient } from "./llm-client";
import { MCPClient } from "./mcp-protocol";
import { VectorDB } from "./rag-system";

/**
 * 这是一个简化的 Agent Harness 底座
 */
class AgentHarness {
  private llm: LLMClient;
  private mcp: MCPClient; // 接入 MCP 标准的工具链
  private memory: VectorDB;

  constructor() {
    this.llm = new LLMClient({ model: "gpt-4o" });
    this.mcp = new MCPClient(["local-file-server", "git-server"]); 
    this.memory = new VectorDB();
  }

  // 核心执行流：接收用户输入 -> 组装 Context -> 注入 Prompt -> 执行
  async execute(userRequest: string, systemPromptTemplate: string) {
    console.log("--> 1. 开始 Context Engineering...");
    // 从向量库或 MCP 中拉取高度相关的背景知识
    const retrievedContext = await this.memory.search(userRequest);
    const workspaceStatus = await this.mcp.callTool("get_workspace_status");

    console.log("--> 2. 开始 Prompt Engineering (动态渲染)...");
    // 将静态的 Prompt 灵魂与动态的 Context 融合
    const finalSystemPrompt = `
      ${systemPromptTemplate}
      
      【当前工作区状态】: ${workspaceStatus}
      【相关参考知识】: ${retrievedContext}
    `;

    console.log("--> 3. 发送给大模型进行推理...");
    const messages = [
      { role: "system", content: finalSystemPrompt },
      { role: "user", content: userRequest }
    ];

    // 获取可用的 MCP 工具 Schema (相当于动态加载 Function Calling 列表)
    const availableTools = await this.mcp.getToolSchemas();

    let response = await this.llm.chat(messages, availableTools);

    console.log("--> 4. 处理 Agent 的意图 (Tool Use / MCP 通信)...");
    // 如果模型决定使用工具（基于 MCP 协议）
    while (response.finishReason === "tool_calls") {
       const toolResults = await this.mcp.executeTools(response.toolCalls);
       // 将执行结果压入上下文，继续循环
       messages.push(response.message);
       messages.push(...toolResults);
       
       response = await this.llm.chat(messages, availableTools);
    }

    return response.content;
  }
}

// ==========================================
// 运行时调用：Agent = Prompt + Harness
// ==========================================
const harness = new AgentHarness();

// 静态的 Prompt (Agent 的大脑)
const staticPrompt = `你是一个极客风的代码架构师。严格遵循 MVP 原则，能用 10 行代码解决绝不用 20 行。`;

// 启动！
// harness.execute("帮我用 Flutter 写一个包含动画的抽屉组件", staticPrompt);
```

---

## 4. 工程启发：为什么“同一个模型”在不同产品里像两种智商

理解了这个公式，你对 AI 辅助开发工具（比如 Cursor）的运作机制就彻底清晰了：

1. **为什么 Cursor 这么好用？** 因为它在本地构建了一个极其强大的 **Harness**。
    
2. 当你按下 `Cmd+K` 或使用 Composer 时，Cursor 的 **Context Engineering** 引擎会悄悄扫描你打开的文件、当前的 Lint 报错信息，甚至光标所在的行数。
    
3. 它通过类似 **MCP** 的内部机制，把这些信息组装成一个巨大的、精准的上下文。
    
4. 最后结合它预设的优秀 **Prompt**（代码生成的 System Prompt），打包发给底层的大模型。
    

**结论：** 未来谁能做出最好的 Agent，不仅取决于谁的模型参数大（那是 OpenAI 和 Google 的事），更取决于谁的 **Harness 基建**做得最扎实——谁能把运行时的数据以最低的信噪比、最统一的标准（MCP）喂给模型。

## 5. 相关笔记
- [[Context Engineering（上下文工程）笔记]]：Harness 怎么把“证据”喂给模型。
- [[Function Calling & Tool Use 笔记]]：Harness 怎么把模型的意图落到真实执行。
- [[结构化输出（Structured Output）笔记]]：Harness 怎么把不确定的自然语言变成可解析的数据。
