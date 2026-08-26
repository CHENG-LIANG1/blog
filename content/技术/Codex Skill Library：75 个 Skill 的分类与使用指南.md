---
title: Codex Skill Library：75 个 Skill 的分类与使用指南
created: 2026-08-12
description: 我整理了一份可审查、可安装的 Codex Skill Library，并按能力场景解释其中 75 个 Skill 分别解决什么问题、从哪里安装，以及应该如何选择。
blogCategory: 项目/面试
tags:
  - 技术
  - AI
  - Agent
  - Codex
  - Skill
aliases:
  - Codex Skill 分类指南
  - Codex Skill Library
sourceRepo: https://github.com/CHENG-LIANG1/codex-skill-library
sourceCommit: 04c14a522c5686b212ab2d2165fb3b7611de7fed
sourceUpdated: 2026-08-12
---

最近我把自己 Codex 环境中常用的 Skill 整理成了一个公开仓库：[codex-skill-library](https://github.com/CHENG-LIANG1/codex-skill-library)。

它不只是把一批 `SKILL.md` 复制到 GitHub，而是一次对个人 AI 工作环境的盘点：哪些能力可以安全备份，哪些属于 Codex 系统或插件运行时，哪些 Skill 名字相同但实现不同，以及换一台机器时应该怎样恢复。

截至 2026 年 8 月 12 日，这份快照包含：

```text
80 个可用条目
75 个唯一名称
47 个可移植 Skill 目录
33 个由 Codex 系统或插件管理的运行时条目
```

80 和 75 之间的差异来自 5 组重名实现：`imagegen`、`pdf`、`gh-address-comments`、`gh-fix-ci` 和 `yeet`。它们分别存在本地版与系统版或插件版，名字相同，但调用的工具和更新渠道不一定相同。

本文已同步到仓库提交 [`04c14a5`](https://github.com/CHENG-LIANG1/codex-skill-library/commit/04c14a522c5686b212ab2d2165fb3b7611de7fed)。仓库 README 现在提供了按安装来源组织的 [Skill 分类目录](https://github.com/CHENG-LIANG1/codex-skill-library#skill-%E5%88%86%E7%B1%BB%E7%9B%AE%E5%BD%95)；这篇文章在它的基础上，进一步按实际工作场景重新分类，说明这些 Skill 分别适合做什么。

## Skill 到底是什么

可以把 Skill 理解成给 Agent 使用的“专业工作说明书”。

普通 Prompt 只描述这一次要做什么，Skill 则会进一步规定：什么情况下触发、开始前读取哪些资料、优先调用什么工具、按什么顺序执行、遇到风险时怎样停下，以及最终如何验证结果。

例如，让 Agent “部署这个网站”只给出了目标；`cloudflare-deploy`、`netlify-deploy` 和 `render-deploy` 则分别包含对应平台的认证检查、项目识别、部署路径和失败处理。Skill 的价值不是让模型突然知道更多名词，而是让它在一个专业场景里少走弯路，稳定执行已经验证过的流程。

仓库里的名称大致有两种形式：

- `playwright` 这样的普通名称，通常是安装在本地目录中的 Skill，或由 Codex 系统直接提供；
- `figma:figma-use` 这样的带命名空间名称，通常来自某个插件，由插件管理器负责启用和升级。

知道这个区别很重要。仓库是能力地图，也是可移植 Skill 的备份，但不是所有运行时能力的安装包。

## 一、Skill 发现、创建与扩展

这一组解决的是“如何继续扩展 Agent”。它们不直接完成业务任务，而是帮助查文档、找 Skill、制作 Skill 或生成可复用模板。

| Skill | 作用 |
| --- | --- |
| `openai-docs` | 查询 OpenAI 产品与 API 的官方文档，适合处理容易随版本变化的参数、限制和用法。 |
| `find-skills` | 在开放的 Agent Skill 生态中搜索和安装现成能力，适合“有没有一个 Skill 能做这件事”的场景。 |
| `skill-creator` | 创建或改进一个通用 Skill，把领域知识、脚本和验证流程组织成可复用目录。 |
| `skill-installer` | 从官方清单或 GitHub 仓库安装 Skill，负责把能力放到正确位置。 |
| `plugin-creator` | 创建包含 Skill、工具或连接器的 Codex 插件，适合比单个 Skill 更完整的能力封装。 |
| `template-creator:template-creator` | 把反复制作的文档、表格或演示文稿沉淀为个人 Artifact 模板 Skill。 |

如果只是想复用一套做事流程，从 `skill-creator` 开始通常就够了；只有当能力还需要独立工具、连接器或完整分发机制时，才需要升级为插件。

## 二、前端、设计与产品体验

这是整个库中数量最多的一组，覆盖从视觉方向、Figma 设计、设计还原到网站和交互实现。

### 设计判断与前端实现

| Skill | 作用 |
| --- | --- |
| `frontend-design` | 为新页面或现有界面建立明确的审美方向，重点处理字体、层级、色彩、布局和避免模板感。 |
| `visual-design-foundations` | 用排版、色彩理论、间距系统和图标规则建立一致的视觉基础，适合设计 Token 和组件规范。 |
| `ux-heuristics` | 用可用性原则审查导航、表单、反馈、错误恢复和认知负担，并给出按优先级排序的改进建议。 |
| `react-joyride` | 实现和调试 React Joyride v3 引导流程，包括步骤、Tooltip、受控模式和自定义样式。 |
| `develop-web-game` | 以“小步实现—真实操作—截图观察—继续修正”的循环开发 HTML/JavaScript 网页游戏。 |
| `sites:sites-building` | 在 Codex Sites 中创建落地页、作品集、Dashboard、Portal 等完整网站。 |
| `sites:sites-hosting` | 承接 Sites 项目的发布、托管和部署管理，让完成的网站获得可访问地址。 |

这几个 Skill 的分工并不相同：`frontend-design` 偏视觉方向，`visual-design-foundations` 偏基础规则，`ux-heuristics` 偏可用性判断，而 `sites-building` 和 `develop-web-game` 才进入具体产物的构建过程。

### Figma 与 Design to Code

仓库同时记录了两个本地 Figma Skill 和一组 Figma 插件 Skill。前者提供通用 MCP 工作流，后者把 Figma 中更具体的动作拆成专门能力。

| Skill | 作用 |
| --- | --- |
| `figma` | 读取 Figma 节点、截图、变量和素材，并把设计上下文带入代码实现。 |
| `figma-implement-design` | 按设计截图和节点数据进行 1:1 还原，同时把生成结果翻译成当前项目的组件和样式约定。 |
| `figma:figma-use` | 操作 Figma 的基础入口；其他生成或编辑类 Figma Skill 通常建立在它之上。 |
| `figma:figma-design-to-code` | 为从 Figma 获取结构化设计上下文并转成代码提供前置流程。 |
| `figma:figma-create-new-file` | 在 Figma 中创建新文件前需要使用的专门工作流。 |
| `figma:figma-generate-design` | 把应用页面、多区块布局或已有产品结构写入 Figma。 |
| `figma:figma-generate-diagram` | 在 Figma 中生成流程图、架构图和其他结构化图示。 |
| `figma:figma-generate-library` | 从代码库创建或更新 Figma 设计系统，包括变量、Token、组件和组件库。 |
| `figma:figma-code-connect` | 维护 Figma 组件与真实代码组件之间的 Code Connect 映射。 |
| `figma:figma-implement-motion` | 把 Figma 中定义的动效、缓动和时间关系实现到产品代码。 |
| `figma:figma-swiftui` | 在 Figma 与 SwiftUI 之间双向转换，面向 iPhone、iPad 和其他 Apple 平台界面。 |
| `figma:figma-use-figjam` | 在 FigJam 场景中读取和编辑白板内容。 |
| `figma:figma-use-motion` | 在 Figma 内操作关键帧、缓动、持续时间等 Motion 细节。 |
| `figma:figma-use-slides` | 在 Figma Slides 场景中创建或编辑演示内容。 |

这里最容易混淆的是 `figma-implement-design` 和 `figma:figma-design-to-code`。前者是一套完整的生产代码还原方法，后者是插件调用设计上下文前的专用入口。实际任务中它们可能连续出现，不是互相替代。

## 三、浏览器、桌面操作与真实环境验证

这组 Skill 让 Agent 不只读取代码，还能观察一个真实页面或应用的状态。

| Skill | 作用 |
| --- | --- |
| `browser:control-in-app-browser` | 控制 Codex 内置浏览器，完成打开页面、点击、输入、检查元素和截图等本地 Web 调试。 |
| `chrome:control-chrome` | 使用用户现有的 Chrome 状态，适合依赖已登录账号、现有标签页或浏览器扩展的任务。 |
| `computer-use:computer-use` | 操作本地 Mac 应用界面，用于没有合适 API、CLI 或专用连接器的桌面任务。 |
| `playwright` | 从终端驱动真实浏览器，进行页面跳转、表单填写、数据提取、截图和 UI 流程排障。 |
| `screenshot` | 获取全屏、指定窗口或局部区域的系统截图，也可作为其他工具无法截图时的后备方案。 |

选择时可以先看任务依赖什么状态：本地网页优先内置 Browser，可重复的终端自动化优先 Playwright，需要现有登录态时选 Chrome，只有必须操作原生桌面 UI 时再使用 Computer Use。

## 四、GitHub、代码评审与交付

这一组围绕 Pull Request 的后半程：处理 Review、修复 CI、提交发布和操作 GitHub 资源。

| Skill | 作用 |
| --- | --- |
| `gh-address-comments` / `github:gh-address-comments` | 读取 PR 中尚未解决的 Review 评论，修改选定问题并逐条核对。 |
| `gh-fix-ci` / `github:gh-fix-ci` | 定位 GitHub Actions 失败检查与日志，整理根因并按确认后的方案修复。 |
| `yeet` / `github:yeet` | 检查改动范围，按需暂存、提交、推送分支并创建 Draft PR。 |
| `github:github` | 通过 GitHub 插件完成仓库、Issue 和 PR 的查询、分流与一般操作。 |

前三组各有本地版和 GitHub 插件版，因此列表里会看到重名。它们的目标相同，但工具入口不同：本地版主要围绕 `gh` CLI 和脚本工作，插件版则优先使用已连接的 GitHub App。选哪一个取决于当前环境已经完成哪种认证。

## 五、部署与托管

| Skill | 作用 |
| --- | --- |
| `cloudflare-deploy` | 分析项目并部署到 Cloudflare Workers、Pages 或相关平台能力。 |
| `netlify-deploy` | 使用 Netlify CLI 识别、关联并发布站点，支持 Preview 和 Production 部署。 |
| `render-deploy` | 为 Render 分析服务结构、生成 `render.yaml` Blueprint，并提供 Dashboard 操作入口。 |

这三者不是通用的“上传文件脚本”。它们各自理解平台的认证、配置文件和部署模型。选择平台时仍然要先看应用形态：静态站点、边缘函数、常驻 Web Service、后台任务和数据库，对基础设施的要求并不一样。

## 六、图片、音视频、文档与数据

这组 Skill 负责生成或加工非代码产物。它们通常会包含“生成后重新渲染或打开检查”的要求，因为文件成功写出不代表内容和排版正确。

| Skill | 作用 |
| --- | --- |
| `imagegen` | 生成或编辑图片，包括局部重绘、换背景、透明底、产品图、封面和批量变体；存在系统版与本地 API 脚本版。 |
| `speech` | 把文本生成为旁白、无障碍朗读、语音提示或批量音频。 |
| `transcribe` | 将音频或视频中的语音转成文字，可选择说话人区分和已知说话人提示。 |
| `pdf` / `pdf:pdf` | 读取、创建和审查 PDF，并通过页面渲染检查真实布局；分别有本地版与运行时版。 |
| `documents:documents` | 创建、编辑、批注和审阅 Word 文档，并执行渲染校验。 |
| `presentations:Presentations` | 读取、创建或修改 PowerPoint、Google Slides 目标演示文稿。 |
| `spreadsheets:Spreadsheets` | 创建、编辑、分析和验证 `.xlsx`、`.csv`、`.tsv` 等独立表格文件。 |
| `spreadsheets:excel-live-control` | 通过连接会话直接操作当前打开的 Microsoft Excel 工作簿。 |
| `jupyter-notebook` | 用标准模板创建或整理 Jupyter Notebook，适合实验、数据探索和教程。 |
| `visualize:visualize` | 在对话中制作交互式图表、模拟器、地图和可视化工具，帮助解释复杂关系。 |

`spreadsheets:Spreadsheets` 与 `spreadsheets:excel-live-control` 的边界很典型：前者处理工作区中的文件，后者操作用户此刻打开的 Excel。类似地，两个 `pdf` 目标一致，但属于不同的安装和运行环境。

## 七、飞书 / Lark 工作流

仓库实际备份了 26 个 Lark Skill，它们全部安装在 `~/.agents/skills`。这不是一个笼统的“飞书助手”，而是按资源类型拆开的完整办公自动化能力。

### 认证、人员与扩展能力

| Skill | 作用 |
| --- | --- |
| `lark-shared` | 处理 `lark-cli` 初始化、登录、用户或机器人身份切换、权限错误和版本更新，是其他 Lark Skill 的公共基础。 |
| `lark-contact` | 在姓名、邮箱和 `open_id` 之间解析联系人，并查询个人资料、部门和状态。 |
| `lark-openapi-explorer` | 当现有 Skill 或 CLI 命令没有覆盖需求时，从官方文档定位并调用底层飞书 OpenAPI。 |
| `lark-skill-maker` | 把一组飞书 CLI 或 OpenAPI 操作封装成新的可复用 Lark Skill。 |

### 沟通、日程与组织协作

| Skill | 作用 |
| --- | --- |
| `lark-im` | 发送、回复和搜索消息，管理群聊、成员、文件、图片、表情和加急。 |
| `lark-mail` | 搜索、阅读、起草、回复、转发和发送飞书邮件，并管理附件、标签和规则。 |
| `lark-calendar` | 查询、创建和更新日程，管理参会人，查询忙闲并预订会议室。 |
| `lark-task` | 创建和管理任务、子任务、任务清单、负责人、附件和任务智能体。 |
| `lark-okr` | 查看和编辑 OKR 周期、Objective、Key Result、对齐关系、量化指标和进展。 |
| `lark-approval` | 查询和处理飞书审批实例与审批任务。 |
| `lark-attendance` | 查询当前用户的考勤与打卡记录。 |
| `lark-event` | 订阅和消费飞书实时事件，例如消息、Reaction、群成员和文档变更。 |

### 文档、知识与结构化数据

| Skill | 作用 |
| --- | --- |
| `lark-doc` | 创建、读取、总结、改写、翻译和编辑飞书云文档及 Wiki 文档内容。 |
| `lark-drive` | 管理飞书云空间中的文件和文件夹，包括上传、下载、移动、权限、评论和导入。 |
| `lark-wiki` | 管理知识空间、空间成员和文档节点，组织 Wiki 层级、快捷方式和内容位置。 |
| `lark-markdown` | 创建、读取、编辑、局部 Patch 和比较 Markdown 文件，不负责把它导入为在线文档。 |
| `lark-sheets` | 创建和操作电子表格、工作表、单元格、公式、样式、图表、透视表和筛选器。 |
| `lark-base` | 管理多维表格中的数据表、字段、记录、视图、公式、表单、仪表盘、工作流和权限。 |
| `lark-slides` | 创建和编辑飞书幻灯片，读取页面内容并进行页面级或局部替换。 |
| `lark-whiteboard` | 查询、导出和编辑飞书画板，可用 DSL、PlantUML 或 Mermaid 表达流程与架构。 |
| `lark-apps` | 把本地 HTML 或静态 Web Demo 部署到飞书妙搭，生成可分享的公网应用。 |

`lark-drive`、`lark-doc` 和 `lark-wiki` 也很容易被混为一谈。简单说，Drive 管文件，Doc 管文档内容，Wiki 管知识空间和节点结构。操作一个 Wiki 页面时可能会连续用到后两者。

### 会议、音视频与组合工作流

| Skill | 作用 |
| --- | --- |
| `lark-minutes` | 搜索妙记、下载音视频、获取总结与逐字稿，或上传本地音视频生成妙记。 |
| `lark-vc` | 搜索已经结束的视频会议，读取参会人快照、会议纪要、章节、待办和逐字稿。 |
| `lark-vc-agent` | 让机器人加入或离开正在进行的会议，并读取会中发言、聊天、成员和屏幕共享事件。 |
| `lark-workflow-meeting-summary` | 组合会议查询和纪要读取能力，生成指定时间范围的结构化会议周报。 |
| `lark-workflow-standup-report` | 组合日程与未完成任务，生成今天、明天或本周的开工摘要。 |

这组里，`lark-vc` 处理历史会议，`lark-vc-agent` 处理正在进行的会议，`lark-minutes` 更关注录制、转写与妙记产物。两个 `lark-workflow-*` 则不是新的底层资源，而是把多个原子 Skill 编排成可以直接交付的结果。

## 可移植 Skill 和运行时 Skill

从安装方式看，这 80 个条目可以分成两层。

第一层是仓库真正备份的 47 个可移植目录：

```text
codex-skills/   21 个
agent-skills/   26 个
```

运行仓库中的安全安装脚本即可复制到本机：

```bash
gh repo clone CHENG-LIANG1/codex-skill-library
cd codex-skill-library
./scripts/install.sh
```

脚本会把两类 Skill 分别安装到 `~/.codex/skills` 和 `~/.agents/skills`。如果目标位置已经有同名目录，它会跳过而不是覆盖，避免无意中破坏本地修改。安装完成后要新建一个 Codex 任务，让 Skill 清单重新载入。

第二层是 33 个系统或插件运行时条目。它们记录在 [`catalog/runtime-only-skills.md`](https://github.com/CHENG-LIANG1/codex-skill-library/blob/main/catalog/runtime-only-skills.md)，用于说明当前环境有哪些能力，但不应该从缓存目录复制安装。系统 Skill 跟随 Codex 更新，Figma、GitHub、文档和表格等插件 Skill 则交给插件管理器更新。

这也是我没有把 `~/.codex` 整个目录直接打包上传的原因：一个能恢复的工作环境，不只要保存文件，还要保留来源、许可证和正确的更新边界。

## 应该怎样选择 Skill

Skill 不是加载得越多越好。真正有效的选择方法，是先判断任务依赖的资源和验收方式。

我通常按下面的顺序判断：

1. **先看对象。** 是代码仓库、Figma 节点、浏览器页面、PDF 文件，还是飞书日程？对象通常已经决定了第一层 Skill。
2. **再看动作。** 同样是 GitHub，查看仓库用 `github:github`，处理 Review 用 `gh-address-comments`，修 CI 用 `gh-fix-ci`，完整发布才用 `yeet`。
3. **确认状态在哪里。** 操作现有 Chrome 登录态和启动一个全新的 Playwright 浏览器，是两件不同的事；操作磁盘上的 Excel 文件和用户已经打开的工作簿也不同。
4. **优先专用 Skill。** 专用 Skill 已经写清该场景的约束和验证方法，通常比让通用桌面自动化去“看着点”更可靠。
5. **检查写操作边界。** 部署、发消息、入会、提交代码都会改变外部状态。Skill 会提供流程，但是否执行仍然应该以用户授权范围为准。

最理想的状态，不是要求 Agent 记住 75 个名称，而是让正确的 Skill 在正确的场景自动触发。对使用者来说，只需要把目标、资源和验收标准说清楚。

## 为什么要维护自己的 Skill Library

模型会更新，工具会变化，插件也会持续增加。真正值得长期积累的，不是某一次对话，而是那些已经被验证过的工作方法。

一个自己的 Skill Library 至少有四个价值：

- **可恢复：** 换机器或重装环境时，不需要重新寻找每一个 Skill；
- **可审查：** 安装前可以知道脚本会做什么、能力来自哪里；
- **可追溯：** 第三方许可证和上游来源不会随着目录复制而丢失；
- **可迭代：** 每次真实任务中发现的坑，都可以回写成下一次自动遵守的规则。

仓库 README 中的 [Skill 分类目录](https://github.com/CHENG-LIANG1/codex-skill-library#skill-%E5%88%86%E7%B1%BB%E7%9B%AE%E5%BD%95) 适合直接浏览；[`catalog/active-skills.md`](https://github.com/CHENG-LIANG1/codex-skill-library/blob/main/catalog/active-skills.md) 保存了按安装来源整理的完整清单，[`THIRD_PARTY_NOTICES.md`](https://github.com/CHENG-LIANG1/codex-skill-library/blob/main/THIRD_PARTY_NOTICES.md) 记录了上游与许可证。仓库不会自动追踪所有上游更新，因此它更像一个经过审查的环境快照，而不是另一个包管理器。

我会继续维护这份库，但我更希望它提供一种思路：当 Agent 逐渐参与设计、开发、测试、部署和办公协作后，我们应该像管理代码依赖一样，开始管理它做事的方法。
