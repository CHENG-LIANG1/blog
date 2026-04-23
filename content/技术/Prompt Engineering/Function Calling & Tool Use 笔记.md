---
tags:
  - 技术
aliases:
  - Function Calling
  - Tool Use
  - Function Calling & Tool Use
  - 工具调用
  - 工具使用
---

> 一句话看懂：**Function Calling 让模型负责“选工具 + 填参数”，让你的代码负责“真正执行”**——它是把 LLM 接到数据库/API/文件系统上的标准闭环。

## 一、 核心概念：打破“大模型自己会执行代码”的错觉

新手最容易陷入的误区是：“大模型可以直接帮我查数据库、调 API”。

**真相是：大模型被困在服务器的沙盒里，它什么都执行不了。**

Function Calling 的本质是一个**“标准化格式的信差游戏”**：

1. 你告诉大模型：“我这里有一套工具（API），这是它们的说明书。”
    
2. 大模型根据用户的提问，判断需要用哪个工具，然后**生成一段符合该工具参数格式的 JSON** 给你。
    
3. **你（你的代码）**拿到这段 JSON，在本地执行真实的数据库查询或 API 请求。
    
4. 你把执行结果扔回给大模型，大模型基于结果再生成人类能看懂的最终回答。
    

大模型只是做“决策”和“参数提取”，真正的“执行”永远在你的业务代码里。

---

## 二、 Tool Schema 设计：写好工具的“说明书”

我们上一篇学的 [[JSON Schema 笔记]]，在这里迎来了完全体。大模型能否准确调用你的工具，100% 取决于你 Schema 写的质量。

结合我们在 MVP 极速交付中的场景，假设我们需要大模型帮我们查一下用户的 VIP 状态，以决定是否渲染某个高级 UI 组件。

**1) 糟糕的 Tool Schema（大模型容易猜错）**

JSON

```
{
  "name": "check_vip",
  "description": "查用户",
  "parameters": {
    "type": "object",
    "properties": {
      "id": { "type": "string" }
    }
  }
}
```

**2) 工业级的 Tool Schema（精确导航）**

在定义 Tool 时，`description` 就是提示词。不仅要写工具是干嘛的，还要写**参数长什么样、必填项是什么**。

JSON

```
{
  "name": "get_user_vip_status",
  "description": "查询指定用户的会员等级状态。仅当需要判断 UI 界面是否展示付费增值组件时调用此工具。",
  "parameters": {
    "type": "object",
    "properties": {
      "user_id": {
        "type": "string",
        "description": "用户的唯一标识符，通常是 UUID 格式，如 'usr_123abc'"
      },
      "module_name": {
        "type": "string",
        "enum": ["profile", "checkout", "dashboard"],
        "description": "触发查询的 UI 模块名称，用于打点记录"
      }
    },
    "required": ["user_id"]
  }
}
```

**设计法则：**

- **命名表意：** 名字即注释。用 `get_user_vip_status` 而不是 `check`。
    
- **参数枚举：** 用 `enum` 锁死大模型的自由发挥空间。
    
- **说明详尽：** 在 `description` 里告诉它“什么时候该用，什么时候不该用”。
    

---

## 三、 多轮调用链路：Ping-Pong 游戏 (Multi-turn Execution Loop)

这是 Agent 调度的核心。当我们传入了工具后，一次完整的对话不再是“一问一答”，而是多轮的“乒乓球”。

假设用户问：**“查一下用户 usr_999 的会员状态，并决定首页是否展示尊贵标识。”**

下面是底层的交互链路：

**🎯 Turn 1：AI 决定使用工具**

- **你发送给大模型：** User Prompt + Tool Schema (我们上面定义的 `get_user_vip_status`)。
    
- **大模型返回：** 不返回人类语言！它返回一个特定的 `finish_reason: "tool_calls"`，并带上参数：
    
    JSON
    
    ```
    "tool_calls": [
      {
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_user_vip_status",
          "arguments": "{\"user_id\": \"usr_999\", \"module_name\": \"dashboard\"}"
        }
      }
    ]
    ```
    

**🛠️ Turn 2：本地代码接管执行**

- 你的代码检测到了 `tool_calls`。
    
- 你的代码解析 JSON，拿到了 `usr_999`。
    
- 你的代码去请求业务后端/数据库，拿到了真实结果：`{"level": "gold", "expire_date": "2027-01-01"}`。
    

**🔄 Turn 3：将结果喂回给大模型**

- **你发送给大模型：** 这是一个包含“工具执行结果”的特殊消息（通常 role 是 `tool`）。必须带上上一步的 `tool_call_id`。
    
    JSON
    
    ```
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "{\"level\": \"gold\", \"expire_date\": \"2027-01-01\"}"
    }
    ```
    
- **大模型返回最终回答：** AI 结合刚才拿到的真实数据，生成最终文本：
    
    > “用户 usr_999 是黄金会员（有效期至 2027年1月1日）。首页 UI 应该展示尊贵标识。”
    

---

## 四、 高阶进阶：Agent 架构中的落地痛点

在实际玩 Vibe Coding 搭建复杂智能体时，你会遇到以下问题，这些是资深玩家与新手的差距：

**1) 并发调用（Parallel Function Calling）**

- **场景：** 用户问：“查一下北京、上海、广州的天气”。
    
- **机制：** 最新的大模型支持在一次返回中，吐出**多个** `tool_calls`。你的代码需要开多线程同时去查这三个城市的 API，等所有结果都回来后，再一次性把 3 个 tool result 塞给大模型。这极大减少了网络往返的耗时。
    

**2) 工具调用死循环（Loop Failure）**

- **场景：** 大模型因为幻觉，给工具传错了参数 -> 你本地代码报错（比如 404）-> 你把错误信息传给大模型 -> 大模型又瞎猜一个参数接着调 -> 死循环。
    
- **防御手段：** * 在业务代码侧，限制最大工具调用轮次（如 `MAX_TOOL_TURNS = 3`）。
    
    - 当工具报错时，不要只返回 "Error"，要在 `tool` role 的 content 里教它怎么改，例如返回：`{"error": "找不到用户，请检查 user_id 格式是否包含 usr_ 前缀"}`。
        

**3) 工具上下文污染**

当你的 Agent 拥有 20 个工具（读写文件、查数据库、执行终端命令）时，大模型会因为选择太多而变笨。

- **解决思路：** 不要一次性塞入所有工具。可以先让一个 Router (路由) 模型判断意图，只塞入当前上下文相关的 3-5 个工具。
    

---

**总结：**

掌握了 Function Calling，你就不再是在“和 AI 聊天”，而是在**“把 AI 当作大脑，用代码连接现实世界的 API 肌肉”**。理清了这条链路，你就能明白那些强大的开发工具（比如 Cursor 为什么能读取你的本地文件再写代码），底层全都是这场精密的多轮对话游戏。


## 五、附录：面试指南与工程实战

**一、 高频面试题解析：从底层逻辑到容错架构**

面试官在考察 Tool Use 时，通常不会问基础概念，而是专门盯着“非理想状态（Happy Path 之外）”的异常处理和架构设计。

**❓ 面试题 1：“大模型在执行 Function Calling 时，存在明显的时延（Latency）问题，你在前端/客户端是如何优化用户体验的？”**

**💡 考察点：交互设计与并发理解**

**满分回答拆解：**

1. **底层机制：** 解释大模型输出 Tool Call JSON 本身需要推理时间，本地执行 API 需要时间，将结果喂给大模型再生成最终回复又需要时间。这是一个漫长的串行或多轮链路。
    
2. **并发调用优化 (Parallel Calling)：** 在业务层面，如果用户问“南京和东京的天气”，绝不能让模型串行调两次工具。必须开启模型的并发调用能力，让大模型一次性返回一个包含两个 `tool_calls` 的数组。我们在客户端使用 `Future.wait` (Dart) 或 `Promise.all` (JS) 并发发起真实的 HTTP 请求，拿到两个结果后，**一次性**拼接成两条 role 为 `tool` 的 Message 喂回给大模型。
    
3. **UI 降级与流式反馈 (Streaming)：** 在等待大模型思考和执行工具的过程中，前端不能死等。可以通过监听流式输出（SSE），当解析到正在生成 `tool_calls` 时，UI 立即切出“正在查询xxx”的加载态或骨架屏，缓解用户的焦躁感。
    

**❓ 面试题 2：“如果大模型不停地传错参数，或者陷入『调用失败 -> 报错 -> 再调 -> 再报错』的死循环，你怎么在架构层切断？”**

**💡 考察点：防御性编程与 Agent 稳定性**

**满分回答拆解：**

1. **Schema 级防御：** 绝大多数参数错误是因为 Tool Schema 没写好。我会把 Schema 里的 `description` 当作 Prompt 来写，甚至在里面加上 Few-Shot（例如：`参数格式必须严格为 'YYYY-MM-DD'，绝不要输出 '今天'`），并用 `enum` 锁死范围。
    
2. **运行时防御 (Circuit Breaker 熔断)：** 在调度层维护一个 `tool_call_depth` 计数器。严格限制单次对话的工具调用最大轮次（如 Max Turns = 3）。一旦超过，立刻中断请求，并向用户抛出降级文案：“抱歉，系统暂时无法获取该信息”。
    
3. **友好的错误回传：** 当本地工具执行失败（比如参数验证不通过抛出异常）时，**千万不要直接抛崩溃**。捕获异常，并将明确的错误指导（如 `{"error": "找不到该用户，请确认 user_id 是否以 'usr_' 开头"}`）作为 tool 的结果传回给大模型，让它“带伤自愈”。
    

---

**二、 极速 MVP 实战：用 Dart 跑通 Tool Calling 闭环**

为了让你直观感受到这个“乒乓球游戏”的代码结构，我们用一段 Dart 伪代码（贴近实际在 Flutter 业务中的逻辑）来演示如何与大模型 API 交互。

**场景：** 用户想查询某个咖啡门店的库存，系统需要调用 `get_store_inventory` 工具。

**Step 1：定义工具与本地执行函数**

Dart

```
// 1. 本地真正的业务逻辑，供后面调用
Future<Map<String, dynamic>> fetchInventory(String storeId, String product) async {
  print('--> 🛠️ 正在本地执行网络请求: 门店 $storeId, 产品 $product');
  await Future.delayed(const Duration(seconds: 1)); // 模拟网络延迟
  
  if (storeId != 'store_nj_001') {
    return {'error': 'Store not found. Please verify storeId.'}; // 友好的错误回传
  }
  return {'stock': 120, 'status': '充足'};
}

// 2. 扔给大模型的 Tool Schema 说明书
final toolSchema = {
  "type": "function",
  "function": {
    "name": "get_store_inventory",
    "description": "查询指定门店特定饮品的库存状态。必须获取明确的 storeId 才能调用。",
    "parameters": {
      "type": "object",
      "properties": {
        "storeId": {
          "type": "string",
          "description": "门店唯一ID，南京地区通常以 'store_nj_' 开头"
        },
        "productName": {
          "type": "string",
          "enum": ["伯牙绝弦", "寻香山茶"] // 锁死产品枚举
        }
      },
      "required": ["storeId", "productName"]
    }
  }
};
```

**Step 2：核心调度 Loop（The Agent Loop）**

这部分代码是 Agent 框架的灵魂，它负责拦截、解析并中转消息。

Dart

```
import 'dart:convert';

// 维护对话上下文
List<Map<String, dynamic>> chatHistory = [
  {"role": "user", "content": "帮我看看南京001号店（store_nj_001）还有伯牙绝弦吗？"}
];

Future<void> runAgentLoop() async {
  int maxTurns = 3;
  int currentTurn = 0;

  while (currentTurn < maxTurns) {
    currentTurn++;
    print('\n[Turn $currentTurn] 正在请求大模型...');

    // 伪代码：发起网络请求给 OpenAI/Gemini
    final response = await mockLlmApiCall(messages: chatHistory, tools: [toolSchema]);
    final responseMessage = response['message'];
    
    // 1. 将大模型的回复先压入历史记录（即使它是 tool_calls 也必须压入，保证上下文连贯）
    chatHistory.add(responseMessage);

    // 2. 判断是否触发了工具调用 (Finish Reason 检测)
    if (response['finish_reason'] == 'tool_calls') {
      final toolCalls = responseMessage['tool_calls'] as List;
      
      // 3. 并发执行所有工具调用 (Parallel Tool Execution)
      List<Future<void>> executions = toolCalls.map((toolCall) async {
        final functionName = toolCall['function']['name'];
        final args = jsonDecode(toolCall['function']['arguments']);
        
        dynamic rawResult;
        // 路由到具体的本地函数
        if (functionName == 'get_store_inventory') {
          rawResult = await fetchInventory(args['storeId'], args['productName']);
        } else {
          rawResult = {'error': 'Unknown function'};
        }

        // 4. 将执行结果作为 tool 角色塞回给大模型
        chatHistory.add({
          "role": "tool", // 关键：角色必须是 tool
          "tool_call_id": toolCall['id'], // 关键：必须带上模型发出的 ID，一一对应
          "content": jsonEncode(rawResult)
        });
        
        print('<-- 🟢 工具结果已喂回给模型: $rawResult');
      }).toList();

      await Future.wait(executions);
      // 包含 tool 结果后，while 循环会进入下一轮，再次把整个历史记录抛给大模型
      
    } else {
      // 5. 常规文本回复，跳出循环
      print('\n🤖 最终输出：${responseMessage['content']}');
      break;
    }
  }
  
  if (currentTurn >= maxTurns) {
    print('⚠️ 触发熔断：达到最大对话轮次。');
  }
}
```

**💡 核心工程思维总结**

看懂这段代码，你会发现：**大模型根本不关心你的业务逻辑是怎么写的，它只负责“填空”和“阅读理解”。**

- **隔离原则：** LLM 层只处理 Schema 和 JSON，业务层只处理真实的 DB/API。
    
- **状态机：** 上面的 `while` 循环本质上是一个简单的状态机。通过读取 `finish_reason` 来决定状态流转。

## 六、相关笔记
- [[JSON Schema 笔记]]：Tool Schema 的底层语法与约束方式。
- [[Model Context Protocol（MCP）笔记]]：MCP 用标准协议把 Tool Use 工程化/模块化。
- [[Harness Engineering（Agent 运行底座）笔记]]：工具调用的循环、并发、熔断一般都在 Harness 层实现。
- [[结构化输出（Structured Output）笔记]]：工具参数与工具结果都应尽量结构化，降低解析成本。
