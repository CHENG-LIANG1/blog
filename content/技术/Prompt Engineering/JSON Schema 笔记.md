---
tags:
  - 技术
aliases:
  - JSON Schema
---

> 一句话看懂：**JSON Schema 就是给 JSON 数据“立规矩”的蓝图**——它把类型、边界、必填项写死，让模型/接口只能输出你允许的结构。

## 1. 它解决什么问题
当你把 LLM 输出接到代码里（渲染 UI、落库、调用工具）时，最怕两类“不可控”：

- **类型漂移**：`margin` 你想要数字，模型给你 `"16px"`。
- **枚举乱编**：`theme` 你只支持 `light/dark/system`，模型给你 `"pink"`。

JSON Schema 的价值是把“我希望的数据”从自然语言，升级为**机器可校验的契约**（contract）。

## 2. 最小可用心法：Schema 里哪些字段最有杀伤力
- `type`：决定**大类别**（object/array/string/number/boolean）。
- `properties`：object 的字段定义。
- `required`：必填字段清单（不写就意味着“可省略”）。
- `enum`：把可选值锁死，强行减少模型自由发挥空间。
- `items`：限制 array 内每个元素的类型/结构。
- `description`：**写给模型看的提示词**（不要把它当注释，是真正的“导航语”）。

## 3. 示例：用 Schema 约束一个 UI 组件配置对象
**3.1 目标数据（Target Data）**
假设我们希望 AI 吐出这样一段 JSON，用来在 App 中动态渲染一个带按钮的卡片组件：

```json
{
  "componentName": "ProfileCard",
  "isVisible": true,
  "margin": 16,
  "theme": "dark",
  "actions": ["share", "edit"]
}
```

**3.2 对应的 JSON Schema（The Blueprint）**
它像 TypeScript/Dart 的 interface：把类型和边界写清楚，模型才“收得住”。

```json
{
  "name": "ui_component_config",
  "description": "用于定义 UI 组件渲染属性的配置对象",
  "schema": {
    "type": "object",
    "properties": {
      "componentName": {
        "type": "string",
        "description": "UI 组件的唯一名称（例如 ProfileCard、OrderSummary）"
      },
      "isVisible": {
        "type": "boolean",
        "description": "组件当前是否可见"
      },
      "margin": {
        "type": "integer",
        "description": "组件外边距，单位为逻辑像素（只能是整数）"
      },
      "theme": {
        "type": "string",
        "enum": ["light", "dark", "system"],
        "description": "组件主题风格，严格限制在 light/dark/system"
      },
      "actions": {
        "type": "array",
        "description": "组件支持的交互动作列表（字符串数组）",
        "items": { "type": "string" }
      }
    },
    "required": ["componentName", "isVisible", "theme"]
  }
}
```

## 4. 常见坑（很容易让 Schema 失效）
1. **`description` 写成废话**：比如“这是一个字符串”。应该写业务语义与边界，像“用户唯一标识，UUID 格式”。
2. **不敢用 `enum`**：越早锁死枚举，越少在代码里兜底。
3. **把“可选”当“必填”**：当字段允许缺省时，要么不放在 `required`，要么在消费端设置默认值。

## 5. 相关笔记
- [[结构化输出（Structured Output）笔记]]：为什么要把 LLM 输出变成“可解析的确定性数据”。
- [[Function Calling & Tool Use 笔记]]：Tool Schema 本质上就是一类 JSON Schema（决定模型能否正确“填参数”）。
