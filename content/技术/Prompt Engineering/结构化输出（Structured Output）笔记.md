---
tags:
  - 技术
aliases:
  - Structured Output
  - 结构化输出
---

> 一句话看懂：**结构化输出是把 LLM 的“自由作文”变成“可解析、可校验、可落地”的数据**，让你的代码不再靠猜。

## 1. 为什么需要结构化？

大模型本质上是一个“概率预测复读机”，它的原生输出是**非结构化文本**。

- **痛点：** 如果你让 AI 生成一个用户列表，它可能一会儿给 Markdown 表格，一会儿给一段话。这对于代码逻辑（尤其是你的 Flutter 或 iOS App）来说是无法直接解析的灾难。
    
- **定义：** 结构化输出是指通过特定手段，强制大模型按照预定义的格式（如 **JSON**, **XML**, **YAML**）返回数据，确保输出内容符合编程语言的类型系统（Type System）。
    

---

## 2. 软约束：用 Prompt 建立“格式契约”

这是最快、最直观的方法，适用于快速验证 MVP 想法。

**1) 使用 Markdown 标识符**

在 Prompt 中明确要求输出格式，并提供一个 Empty Template。

**Example:**

> “请分析这段代码的 Bug，并按以下 JSON 格式返回结果：
> 
> {
> 
> "has_bug": boolean,
> 
> "severity": "low" | "medium" | "high",
> 
> "fix_suggestion": "string"
> 
> }
> 
> **注意：只返回 JSON，不要任何开场白。**”

**2) 少样本引导（Few-Shot for Structure）**

通过 1-2 个例子，让模型形成“条件反射”。

**Example:**

> **User:** 提取地址信息。
> 
> 例子：输入“南京市雨花台区软件大道”，输出：{"city": "南京", "district": "雨花台区"}
> 
> 问题：输入“杭州市余杭区文一西路”
> 
> **AI:** {"city": "杭州", "district": "余杭区"}

---

## 3. 硬约束：Schema 约束与校验

当你需要构建生产级别的应用（比如自动化 UI 生成、数据看板）时，简单的 Prompt 约束可能会失效（模型偶尔会多吐一个逗号或一段解释）。

**3.1 JSON Schema：给 AI 戴上“紧箍咒”**

目前主流的 API（如 OpenAI, Gemini）都支持 **JSON Mode** 或 **Response Schema**。你只需要定义一个标准的 JSON Schema，模型就会保证输出绝对合法。
[[JSON Schema 笔记]]
**3.2 XML 标签：长文本的最佳容器**

在处理复杂的长任务（如：生成一整个 Flutter 页面）时，XML 标签比 JSON 更鲁棒，因为 JSON 对嵌套中的特殊字符（如引号、换行）非常敏感。

**Example (推荐写法):**

XML

```
<analysis>
  <summary>性能瓶颈在列表重绘</summary>
  <action_items>
    <item>使用 const 构造函数</item>
    <item>引入 RepaintBoundary</item>
  </action_items>
</analysis>
```

---

## 4. 工程化：类型驱动（Type-Driven）

在实际的业务开发（如你在 Chagee 的组件库维护或个人 iOS 项目）中，手写 JSON Schema 太累了。这时候需要借助**类型定义库**。

**1) Python 阵营：Pydantic + Instructor**

这是目前 AI 工程界最流行的组合。你定义一个类，它自动帮你处理 Prompt 转换和校验失败后的自动重试。

Python

```
from pydantic import BaseModel
import instructor

class AppFeature(BaseModel):
    name: str
    priority: int
    is_mvp_essential: bool

# Instructor 会自动要求模型返回符合 AppFeature 结构的 JSON
```

**2) TypeScript 阵营：Zod + TypeChat**

在前端或 Node.js 环境下，利用 Zod 定义 Schema，可以实现从“大模型输出”到“前端类型安全”的无缝对接。

---

## 5. 实战建议（写给“要上线的人”）

1. **先降级再升级：** 如果模型在复杂的 JSON 上翻车，先尝试让它输出 XML 标签包裹的内容，再在代码里做简单的正则或解析。
    
2. **拒绝“解释性废话”：** 在 System Prompt 中加入 `Ensure the output is a valid JSON. Do not include any markdown formatting or pre/post-text.`。
    
3. **MVP 快速通道：** 在使用 Cursor 时，可以直接在 `.cursorrules` 中规定：“所有 Bug 分析必须以结构化 JSON 注释的形式出现在文件顶部”。
    
4. **容错处理：** 永远假设结构化输出**可能**会失败。在你的 App 代码中，必须包裹 `try-catch` 并设置默认值 (Fallback)，这是软件工程师最后的体面。
    

---

**总结：**

- **Prompt 约束** 是“软约束”（适合快）。
    
- **JSON Schema** 是“硬约束”（适合稳）。
    
- **Type-Driven** 是“工程化约束”（适合大项目）。

## 6. 相关笔记
- [[JSON Schema 笔记]]：最常见的“硬约束”实现方式。
- [[Function Calling & Tool Use 笔记]]：工具调用参数也是结构化输出的一种。
