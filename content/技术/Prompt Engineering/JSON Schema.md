### 一、 我们想要的数据格式 (Target Data)

假设我们希望 AI 吐出这样一段 JSON，用来在我们的 App 中动态渲染一个带按钮的卡片组件：

JSON

```
{
  "componentName": "ProfileCard",
  "isVisible": true,
  "margin": 16,
  "theme": "dark",
  "actions": ["share", "edit"]
}
```

### 二、 约束它的 JSON Schema (The Blueprint)

为了保证 AI **绝对不会**把 `margin` 输出成字符串 `"16px"`，或者在 `theme` 里瞎编一个 `"pink"`，我们需要给 API 喂下面这段 JSON Schema。

它就像 TypeScript 或 Dart 中的 interface，清晰地定义了类型和边界：

JSON

```
{
  "name": "ui_component_config",
  "description": "用于定义 UI 组件渲染属性的配置对象",
  "schema": {
    "type": "object",
    "properties": {
      "componentName": {
        "type": "string",
        "description": "UI 组件的唯一名称"
      },
      "isVisible": {
        "type": "boolean",
        "description": "组件当前是否可见"
      },
      "margin": {
        "type": "integer",
        "description": "组件的外边距大小，单位为逻辑像素"
      },
      "theme": {
        "type": "string",
        "enum": ["light", "dark", "system"], 
        "description": "组件的主题风格，严格限制在这三个选项内"
      },
      "actions": {
        "type": "array",
        "description": "组件支持的交互动作列表",
        "items": {
          "type": "string"
        }
      }
    },
    "required": ["componentName", "isVisible", "theme"] 
  }
}
```

### 三、 JSON Schema 核心关键点解析

在这个 Schema 中，有几个大模型最吃这一套的“强力约束”属性：

1. `type`: 定义数据类型（`string`, `integer`, `boolean`, `array`, `object`）。这直接干掉了模型胡乱发挥数据类型的毛病。
    
2. `description`: **极其重要！** 这是写给大模型看的。AI 会根据你的 description 去推断这个字段到底该填什么业务数据。
    
3. `enum`: 枚举值。这是防御性编程的利器。一旦设定了 `["light", "dark", "system"]`，模型就绝对不可能输出 `"blue"`。
    
4. `required`: 必填字段数组。在这里指定后，AI 生成的 JSON 就绝对不会漏掉 `componentName`、`isVisible` 和 `theme`，其余的（如 `margin` 和 `actions`）则视为可选。
    
5. `items`: 专门用来限制数组 (`array`) 内部元素的类型。
    