---
tags:
  - 技术
aliases:
  - Few-shot
  - Few Shot
  - Few-Shot Prompting
  - 少样本提示
---

> 一句话看懂：**Few-Shot 就是用 1~N 个“输入→输出”范例，让模型在当下对话里学会你想要的模式**（尤其适合格式严格、映射规则隐含的任务）。

## 一、 核心概念：什么是 Few-Shot？

大语言模型（LLM）在预训练时看过了海量数据，具备强大的 Zero-Shot（零样本）泛化能力。但在处理**格式要求苛刻、边界模糊的分类、或特定业务领域的私有术语**时，Zero-Shot 往往会“翻车”。

**Few-Shot (少样本) 的本质，是利用大模型的“模式匹配（Pattern Recognition）”能力。** 你不需要向模型解释长篇大论的规则，只需要直接给它展示 1 个（One-Shot）到多个（Few-Shot）`<输入 -> 输出>` 的成对示例，模型就能在当前的上下文窗口中“顿悟”其中的隐式规律。

---

## 二、 核心场景：什么时候必须用 Few-Shot？

在日常的 Vibe Coding 和 MVP 开发中，遇到以下场景，请果断放弃复杂的 Prompt 指令解释，直接上 Few-Shot：

1. **统一输出格式（Format Enforcement）：** 强迫模型输出可以被正则解析或 JSON 反序列化的特定字符串。
    
2. **特定的业务分类（Custom Classification）：** 例如判断一段用户评论是“产品 Bug”、“功能建议”还是“客服客诉”。
    
3. **私有知识/黑话映射（Domain Jargon）：** 将用户的口语化表达转化为你们系统的私有枚举值。
    

---

## 三、 经典对比案例：NLP 意图提取

假设你需要做一个 Agent，把用户的自然语言转换成系统可识别的排序指令。

**❌ Zero-Shot（零样本）— 容易发散**

> **User:** 提取用户语句中的排序字段和排序方式。输入：“帮我把最贵的排在前面”。
> 
> **AI:** 用户想要按照价格进行排序，排序方式是降序（从高到低）。_(解释性废话太多，代码无法直接解析)_

**✅ Few-Shot（少样本）— 精准控制**

> **User:** > 提取用户语句中的排序字段和排序方式，只返回 JSON，不要任何废话。
> 
> [示例 1]
> 
> 输入：“按时间倒序看”
> 
> 输出：{"field": "createdAt", "order": "desc"}
> 
> [示例 2]
> 
> 输入：“评分最低的放前面”
> 
> 输出：{"field": "rating", "order": "asc"}
> 
> [当前任务]
> 
> 输入：“帮我把最贵的排在前面”
> 
> **AI:** {"field": "price", "order": "desc"}

---

## 四、 高阶工程化：在 TypeScript 中的最佳实践

在真实的 Agent 框架搭建中，我们通常不会把 Few-Shot 写死在一个长长的字符串里，而是**利用 OpenAI API 的消息数组结构（Message Array）来“伪造”历史对话**，这样对大模型的注意力机制最友好。

下面是一段用 **TypeScript** 编写的核心逻辑，演示如何通过历史消息注入 Few-Shot 示例：

TypeScript

```
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({ apiKey: "your-api-key" });

/**
 * 业务场景：将用户口语化的相对时间，解析为标准的相对日期指令
 */
async function parseDateIntent(userInput: string) {
  // 1. 定义 System Prompt
  const systemPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: "你是一个日期解析器。你的任务是将用户输入转换为标准指令（如 TODAY, TOMORROW, NEXT_WEEK）。只返回指令，不要解释。"
  };

  // 2. 构造 Few-Shot 示例（伪造 User 和 Assistant 的一问一答历史记录）
  const fewShotExamples: ChatCompletionMessageParam[] = [
    { role: "user", content: "今天下午" },
    { role: "assistant", content: "TODAY" },
    { role: "user", content: "明儿个" },
    { role: "assistant", content: "TOMORROW" },
    { role: "user", content: "下个礼拜" },
    { role: "assistant", content: "NEXT_WEEK" }
  ];

  // 3. 拼接当前的真实任务
  const currentTask: ChatCompletionMessageParam = {
    role: "user",
    content: userInput
  };

  // 4. 组装并发送请求
  const messages = [systemPrompt, ...fewShotExamples, currentTask];

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // 或你选择的任意先进模型
    messages: messages,
    temperature: 0.1, // 分类和格式化任务，建议调低温度以降低随机性
  });

  return response.choices[0].message.content;
}

// 运行时测试
// parseDateIntent("明天早上的机票").then(console.log); 
// 预期输出: TOMORROW
```

**为什么这种方式更好？**

大模型在底层架构上被训练为预测“下一个 Token”。通过真实的 `role: "user"` 和 `role: "assistant"` 的交替，模型会本能地进入“扮演”状态，严格遵循前面 Assistant 已经表现出的格式惯性。

---

## 五、 Few-Shot 的“避坑”指南 (Anti-Patterns)

面试或高阶实战中，常常会踩以下几个 Few-Shot 的坑：

1. **示例分布不均衡 (Class Imbalance)：** 如果你给的 3 个例子全是 "True"，模型就会产生强烈的偏见，遇到模棱两可的问题也会倾向于回答 "True"。**最佳实践：正例、反例、边界示例都要包含，且比例均衡。**
    
2. **标签随机性 (Label Bias) / 顺序偏差 (Recency Bias)：** 模型往往对放在 Prompt 最末尾的示例印象最深。如果你的最后一个示例输出是 A，模型在回答新问题时也会略微倾向于 A。
    
3. **把 Few-Shot 当万能药 (缺乏逻辑链)：** Few-Shot 只教**“格式和映射”**，不教**“逻辑推导”**。如果任务需要复杂的数学计算，光给 `<题目 -> 答案>` 的 Few-Shot 是没用的，必须结合上一节课的内容，升级为 **Few-Shot CoT（少样本思维链）**，在示例中把推导过程写出来。


---

**一、 Few-Shot vs CoT 核心区别：维度不同（见 [[Chain of Thought（CoT）笔记]]）**

- **Few-Shot（少样本提示）解决的是“样本量”的问题。**
    
    - **核心逻辑：** 给你打个样，你照着学。
        
    - **作用：** 告诉模型“我要什么格式的输入和输出”，帮模型确立**模式 (Pattern)**。
        
- **CoT（思维链）解决的是“思考深度”的问题。**
    
    - **核心逻辑：** 把推导过程写出来。
        
    - **作用：** 强制模型展示中间步骤，帮模型确立**逻辑 (Logic)**。
        

---

**二、 组合矩阵：四大门派**

我们将“是否给例子 (Zero/Few)”和“是否给推导过程 (Standard/CoT)”进行交叉组合，就会得到日常使用的 4 种 Prompt 范式。

为了直观，我们用一个“判断奇偶数相加”的简单任务做对比：

**1) Standard Zero-Shot（零样本标准提示）**

最基础的“直球”，什么都不给，直接问。

> **User:** 一组数里奇数加起来是偶数吗？[15, 32, 5, 13, 82, 7, 1]
> 
> **AI:** 是的。_(模型可能会瞎猜一个)_

**2) Standard Few-Shot（少样本标准提示）**

给了例子，规范了输入输出的**格式**，但**没有中间计算逻辑**。

> **User:**
> 
> 例子 1：[3, 4, 5] -> 奇数相加：3+5=8。8 是偶数。-> 答案：True
> 
> 例子 2：[1, 2, 3, 4] -> 奇数相加：1+3=4。4 是偶数。-> 答案：True
> 
> 问题：[15, 32, 5, 13, 82, 7, 1] 里的奇数加起来是偶数吗？
> 
> **AI:** True。 _(面对长数组，模型因为缺乏推导，依然容易算错)_

**3) Zero-Shot CoT（零样本思维链）**

不给例子，但通过一句“咒语”逼迫模型自己把**过程**写出来。

> **User:** [15, 32, 5, 13, 82, 7, 1] 里的奇数加起来是偶数吗？**请一步一步思考。**
> 
> **AI:** 第一步，找出数组中的奇数：15, 5, 13, 7, 1。
> 
> 第二步，将它们相加：15 + 5 = 20；20 + 13 = 33；33 + 7 = 40；40 + 1 = 41。
> 
> 第三步，判断 41 是否为偶数。41 不能被 2 整除，是奇数。
> 
> 答案：False。

**4) Few-Shot CoT（少样本思维链）—— 🌟 终极杀器**

既给例子规范格式，又在例子中**示范了完整的推导过程**。

> **User:**
> 
> 例子 1：[3, 4, 5]
> 
> 思考过程：奇数有 3, 5。相加得出 3 + 5 = 8。8 是偶数。
> 
> 答案：True
> 
> 问题：[15, 32, 5, 13, 82, 7, 1]
> 
> **AI:** 思考过程：数组中的奇数有 15, 5, 13, 7, 1。相加得出 15 + 5 + 13 + 7 + 1 = 41。41 是奇数。
> 
> 答案：False

---

**三、 总结与实战建议**

|**提示词范式**|**特点**|**适用场景**|
|---|---|---|
|**Zero-Shot**|不给示例，直接问|简单的基础问答、文本翻译、摘要提取。|
|**Few-Shot**|只给输入输出示例|需要模型严格遵守特定 JSON/XML 格式输出，或特定的语气要求时。|
|**Zero-Shot CoT**|加一句 "一步步思考"|遇到复杂逻辑，但你懒得写长篇示例时（性价比最高）。|
|**Few-Shot CoT**|示例 + 完整推导逻辑|高难度的算法推导、极复杂的业务逻辑架构设计、或需要模型学会私有框架规则时。|

**一句话记忆：**

Few-Shot 是给大模型看**“参考答案”**（知道长啥样）；CoT 是给大模型看**“解题步骤”**（知道怎么解）。两者结合 (Few-Shot CoT)，大模型就能变成能举一反三的学霸。

## 相关笔记
- [[Chain of Thought（CoT）笔记]]：当任务需要“推理过程”，Few-Shot 需要升级为 Few-Shot CoT。
- [[结构化输出（Structured Output）笔记]]：Few-Shot 最常见用途之一就是强制稳定输出格式。
- [[System Prompt（系统提示词）笔记]]：Few-Shot 更像“示例数据”，System Prompt 更像“全局规则”，两者可叠加使用。
