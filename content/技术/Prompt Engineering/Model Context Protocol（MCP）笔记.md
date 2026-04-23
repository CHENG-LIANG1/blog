---
tags:
  - 技术
aliases:
  - MCP
  - Model Context Protocol
---

> 一句话看懂：**MCP 是让大模型“即插即用”连接工具与数据源的统一接口标准**，用协议终结为每个模型/每个外设都手写胶水代码的 N×M 灾难。

在掌握了 Function Calling 和 Context Engineering 之后，你会发现一个巨大的工程痛点：如果我想让大模型查 SQLite 数据库，我得写一套 Tool Schema；换成读 Github 仓库，我又得写一套；如果你切换了底层基座（从 OpenAI 换到 Gemini），代码甚至还要大改。这被称为 AI 基础设施的 **N x M 灾难**。

**MCP (Model Context Protocol)** 就是为了终结这个痛点而诞生的。由 Anthropic 主导开源，它正在迅速成为 AI 智能体开发领域的绝对行业标准。

---

## 一、 核心概念：什么是 MCP？

你可以把 MCP 完美类比为硬件领域的 **USB-C 接口**。

- **没有 MCP 的时代：** 大模型就像早期没有统一接口的电脑，想要连接打印机、鼠标、U 盘，必须为每一个外设单独安装一套复杂的私有驱动（硬编码的 Function Calling）。
    
- **有 MCP 的时代：** 它定义了一套标准的 JSON-RPC 通信协议。无论你的数据源是本地文件、企业级 Notion、还是内部的组件库，只要套上 MCP Server 的“转换头”，任何支持 MCP 的客户端（如 Cursor、Claude Desktop、Trae）插上就能用。
    

---

## 二、 MCP 架构的三层结构 (The Architecture)

MCP 系统极其优雅，它将职责严格分离：

1. **MCP Host (宿主环境)：** 发起请求的应用程序界面。比如你每天高频使用的 Cursor IDE 或 Claude Desktop。
    
2. **MCP Client (协议客户端)：** 运行在 Host 内部，负责与大模型（LLM）通信，并将大模型的意图翻译成 MCP 协议格式。
    
3. **MCP Server (协议服务端)：** 运行在本地或远程的独立进程。它直接连接你的真实物理世界（数据库、Git 仓库、文件系统）。
    

**工作流极简推演：**

Cursor (Host) -> 拦截到用户要查代码 -> 询问 MCP Client 当前连接了哪些外设 -> Client 询问 MCP Server -> Server 暴露自己的工具列表 -> 大模型决定调用 -> Server 执行本地文件读取并返回。

---

## 三、 MCP Server 的三大核心能力 (Core Primitives)

一个标准化的 MCP Server 会向大模型暴露三种“武器”：

1. **Resources (资源 - 只读)：**
    
    - **概念：** 就像给大模型挂载了一个网盘。用来暴露静态的、有特定 URI 格式的数据。
        
    - **场景：** 让大模型直接读取你的 Flutter 项目的 `pubspec.yaml` 或者内部 API 文档（如 `file:///Users/project/docs`）。
        
2. **Prompts (提示词模板 - 动态)：**
    
    - **概念：** Server 端预定义好的、带有参数的 Prompt 模板。
        
    - **场景：** 将复杂的业务背景（如“如何编写符合代码规范的 StatelessWidget”）封装在 Server 端，客户端通过简单的指令即可调用，降低通信 Token 消耗。
        
3. **Tools (工具 - 可执行)：**
    
    - **概念：** 也就是我们之前学的 Function Calling 的标准化封装。允许模型对物理世界产生副作用。
        
    - **场景：** 运行 `git commit`、执行一条 SQL 写入数据库、或是触发一次远程 CI/CD 构建。
        

---

## 四、 TypeScript 实战：手写一个极简 MCP Server

在追求 MVP 极速交付的开发中，我们经常需要让 AI 知道当前工程依赖了什么库。我们用 TypeScript 写一个名为 `DependencyInspector` 的 MCP Server，让它暴露一个读取 `package.json` 的 Tool。

TypeScript

```
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// 1. 初始化 MCP Server
const server = new Server(
  { name: "dependency-inspector", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 2. 注册工具列表 (List Tools) - 这就是标准的 Tool Schema
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_dependencies",
        description: "读取项目目录下的 package.json 或 pubspec.yaml 来检查依赖版本",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: { type: "string", description: "项目根目录的绝对路径" },
          },
          required: ["projectPath"],
        },
      },
    ],
  };
});

// 3. 实现工具的执行逻辑 (Call Tool)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "check_dependencies") {
    const { projectPath } = request.params.arguments as { projectPath: string };
    
    try {
      // 这里可以替换为查找 pubspec.yaml 的逻辑
      const filePath = path.join(projectPath, "package.json");
      const fileContent = await fs.readFile(filePath, "utf-8");
      
      return {
        content: [{ type: "text", text: `依赖信息如下：\n${fileContent}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `读取失败: ${String(error)}` }],
        isError: true, // 优雅的错误回传机制
      };
    }
  }
  throw new Error("Tool not found");
});

// 4. 启动服务器 (基于标准输入输出，Cursor 最喜欢这种方式)
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server 'DependencyInspector' is running on stdio");
}

run().catch(console.error);
```

---

## 五、 Vibe Coding 视角的工程启发

为什么 MCP 对日常 Vibe Coding 意义重大？

1. **零胶水代码：** 以前你要自己写一个 Python/Node.js 脚本作为中间件来转发大模型的 HTTP 请求。现在，你只需要写一个标准的 MCP Server，然后在 Cursor 的设置界面里加一行启动命令（如 `node path/to/mcp/server.js`），Cursor 就会**自动**学会如何调用你写的代码。
    
2. **绝对解耦：** 你的业务逻辑（查库、读文件）被彻底封存在 MCP Server 里。无论大模型基座怎么换，你的 Server 代码一行都不用改。
    
3. **强大的开源生态：** 社区目前已经有几百个现成的 MCP Server（如 GitHub MCP, SQLite MCP, PostgreSQL MCP）。你的 Agent 只需要像搭积木一样把它们拼装起来，就能瞬间获得上帝视角的超能力。

## 附录：高频实用的 MCP Server 生态清单

当你需要在 Cursor、Claude Desktop 或是自建的 Agent Harness 中快速接入外设能力时，可以直接拉取以下开源生态，极大缩短 MVP 交付周期。

**一、 官方直营（Anthropic 官方维护）**

这些是极其稳定、开箱即用的基础基建，非常适合作为底座接入：

- **[官方 Servers 核心仓库 (modelcontextprotocol/servers)](https://github.com/modelcontextprotocol/servers)** 包含了以下极其常用的核心 Server：
    
    - **`sqlite` / `postgres`**: 直接让 AI 连接你的本地或测试环境数据库进行 SQL 查询和数据分析。
        
    - **`github` / `gitlab`**: 赋予 AI 读取仓库代码、提 PR、查阅 Issue 的能力。
        
    - **`filesystem`**: 给 AI 划定一个安全的本地沙盒目录，允许它自由读写文件。
        
    - **`puppeteer`**: 让 AI 能够静默启动浏览器，进行自动化抓取、UI 测试甚至操作 Web 页面。
        
    - **`memory`**: 一个极其轻量级的基于知识图谱的长期记忆存储。
        

**二、 极客与社区自制（高分开源项目）**

社区的迭代速度极快，许多专门针对垂直场景的 Server 非常适合直接复用。你可以通过第三方注册中心（如 `smithery.ai` 或 `glama.ai/mcp/servers`）快速发现它们，这里精选几个高优项目：

- **[Awesome MCP Servers (合集)](https://github.com/punkpeye/awesome-mcp-servers)**
    
    社区维护的最全列表，如果你需要接飞书、Notion、Jira、甚至各种云服务的 API，来这里搜。
    
- **搜索类 Server (如 Brave Search / Tavily MCP)**
    
    专为大模型打造的联网检索引擎。接入后，Agent 就能实时联网检索当前报错的最新 StackOverflow 讨论或官方 API 文档变更。
    
- **Docker / Kubernetes MCP**
    
    允许你的 AI 直接监控容器状态、拉取镜像、甚至排查 K8s 的 Pod 崩溃日志。适合 DevOps 自动化场景。
    
- **[Vercel v0 MCP](https://www.google.com/search?q=https://github.com/vercel/v0)** _(概念示范)_
    
    部分极客自制的桥接 Server，允许你的本地 IDE 通过 MCP 直接调用 Vercel 的能力来渲染或生成 UI 组件代码。
    

**💡 极速接入技巧 (Cursor 视角)：**

在 Cursor 的 `Settings -> Features -> MCP` 中，只需点击 `+ Add new MCP server`，输入类型为 `command`，然后填入类似 `npx -y @modelcontextprotocol/server-sqlite --db /path/to/your/db.sqlite`，即可瞬间完成外设挂载，开启 Vibe Coding。

## 相关笔记
- [[Function Calling & Tool Use 笔记]]：工具调用的“思想前身”，MCP 把它标准化、模块化。
- [[Harness Engineering（Agent 运行底座）笔记]]：Harness 负责调度，MCP 负责标准接入外设。
- [[Context Engineering（上下文工程）笔记]]：通过 MCP 读取资源/调用工具，本质上也是在注入高信噪比上下文。
