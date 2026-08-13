---
title: Vibe Coding 从 0 基础到 App Store 上架
description: 面向零编程基础读者的 Vibe Coding 实战教程：从想法、PRD、MVP 和 AI 编程工具选择，一路完成测试、部署与 App Store 上架。
tags:
  - 技术
  - AI
  - Vibe Coding
  - 独立开发
---

我这个教程面向无编程背景，无超能力的读者。

我已经用 Vibe Coding 做了上百款 Demo 网页，有些可能是一句话生成的， 有些费了大功夫，
这个就是一句话生成的 [AI产品进化论](https://eosstkspzhhms.ok.kimi.link)

我还有 4 个由 Vibe Coding 完成并上架 App Store 的应用，欢迎体验：

- [Roam Focus：地图旅程与番茄钟](https://apps.apple.com/us/app/roam-focus/id6759795571)
- [GeekBio：多主题程序员名片](https://apps.apple.com/us/app/geekbio/id6758457562)
- [Active Habits：习惯记录与热力图](https://apps.apple.com/us/app/active-habits/id6758425099)
- [兴曰：王兴饭否语录沉浸式阅读](https://apps.apple.com/us/app/%E5%85%B4%E6%9B%B0/id6792046505)

以下最佳实践，纯手打，来自我这半年的亲身体验。

## 需要理解的概念

- PRD: Product Requirement Doc, 需求文档
- MVP: Minimum Viable Product, 最小可行方案，也就是初版
- 部署: 网页上线
- Chatbot: AI 聊天网站，如 ChatGPT, DeepSeek, Kimi, 豆包
- AI IDE: AI 编程工具，如 Trae, Cursor, Codex。其实这里还分 IDE 模式和任务模式(专注任务，看不到文件目录)，但这里不区分讲
- Landing Page: 应用落地页。如果你上架了想要宣传，这个必不可少，因为很多人都会问你「这个干啥的？」，例如 [Roam Focus 产品页](https://www.chengliang.pro/Projects/Roam-Focus)
- Onboarding Page: 应用内教程，首次打开应用，教学用户如何使用 App

## 需要准备什么？

1. 随便哪个 chatbot，只要支持问答聊天就行，国内外都可以
2. 随便哪个 AI IDE 或者 VS Code AI 插件，只要能打开文件夹，能对话就行，有能力的可以订阅一个月试水
3. 一台电脑，mac 优先，windows 也可以
4. 一个想法，随便什么想法都可以，哪怕是重复的

## 怎么上手？

0. 有一个想法
1. 和 chatbot 沟通需求，沟通完了让它输出 prd
2. 把 prd 发给 codex, trae, cursor 什么的，自己挑，前端建议选用 gemini 3.1 pro 模型，我用着没啥问题。
3. 先给个长任务，让它搭一个 MVP 出来，这一步时间可能比较长，这里可以加一个限制，让它写完了自己 build 一下，不要出现报错的情况。
4. 后续自己去用，第一版不可能是完美的，一点点改，明显 bug 改完之后，再考虑新增功能，优化用户体验。
5. 如果是 App，一定不要忘了做 Tutorial，也就是 Onboarding page，这个非常重要。

## UI 怎么做？

1. 不做，让 AI 自己出一版 mvp，你只需要指定风格 (拟物、扁平、Liquid Glass、Fluent UI、Material Design)
2. 在设计网站找参考，例如 [Awwwards](https://www.awwwards.com/) 和 [Osmo](https://www.osmo.supply/)，让 AI 分析它的布局、层级和交互，而不是机械复制
3. 用 Google Stitch 画，这个可以在出了 MVP 之后让它进行大胆创作，或者改风格

## 怎么部署？

web:

1. github + vercel，让 AI 自己做，你在该登录的时候登录一下
2. 如果不会使用部署平台，也可以把文件交给支持部署的 AI 工具，例如前面的 [AI 产品进化论 Demo](https://eosstkspzhhms.ok.kimi.link)

ios:

1. 申请开发者账号
2. 图标: canva, 生成完的图片修改 [App Icon Generator](https://www.appicon.co/)，获得标准图标，然后直接丢给 AI IDE
3. 上架图: 截几个图，用这个做 [App Store Screenshot Generator | Google Play Preview Maker | ASO Tool](https://appcub.io/)
4. 文案: 用哪个 agent 做，就让哪个 agent 帮忙写，他最懂你的项目
5. 不会填的字段，截图发给 AI
6. 隐私政策与用户协议：可以使用 Notion 或 GitHub Pages，让 Agent 帮你生成并部署单页 HTML，例如 [Roam Focus 隐私政策](https://cheng-liang1.github.io/App-Support/Roam%20Focus/privacy/index.html)

## 延伸阅读

- [Vibe Coding 指南：独立开发者的一周交付手册](/技术/Vibe-Coding-指南)
- [从 0 到工程级项目：可维护、可验证的 Vibe Coding 方法](/技术/从-0-到工程级项目：我们的-Vibe-Coding-工作方法)
