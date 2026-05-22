
我已经用 Vibe Coding 做了上百款 Demo 网页，有些可能是一句话生成的， 有些费了大功夫，
这个就是一句话生成的 [AI产品进化论](https://eosstkspzhhms.ok.kimi.link)

我还有3个 App Store 上架应用，纯 Vibe Coding 产物，欢迎体验提意见。
Roam Focus: 地图 + 番茄钟
https://apps.apple.com/us/app/roam-focus/id6759795571

GeekBio: 多主题程序员名片
https://apps.apple.com/us/app/geekbio/id6758457562

Active Habits: 习惯打卡
https://apps.apple.com/us/app/active-habits/id6758425099

以下最佳实践，纯手打，来自我这半年的亲身体验。
## UI 怎么做？
1. 不做，让 AI 自己出一版 mvp，你只需要指定风格 (拟物、扁平、Liquid Glass、Fluent UI、Material Design)
2. 在这个网站找好看的网页，让AI 抄 [Awwwards - Website Awards - Best Web Design Trends](https://www.awwwards.com/)，我一般用 https://www.osmo.supply/
3. 用 Google Stitch 画，这个可以在出了 MVP 之后让它进行大胆创作，或者改风格

## 怎么上手？
1. 和 chatbot 沟通需求，任意一个都可以，沟通完了让它输出 prd
2. 把 prd 发给 codex, trae, cursor 什么的，自己挑，前端建议选用 gemini 3.1 pro 模型，我用着没啥问题。
3. 先给个长任务，让它搭一个 MVP 出来，这一步时间可能比较长，这里可以加一个限制，让它写完了自己 build 一下，不要出现报错的情况。
4. 后续自己去用，第一版不可能是完美的，一点点改，明显 bug 改完之后，再考虑新增功能，优化用户体验。
5. 如果是 App，一定不要忘了做 Tutorial，也就是 Onboarding page，这个非常重要。

## 怎么部署？
web:
1. github + vercel，让 AI 自己做，你在该登录的时候登录一下
2. 上面那个不会，直接把文件扔给 kimi，让它部署，比如这个 https://eosstkspzhhms.ok.kimi.link

ios:
1. 申请开发者账号
2. 图标: canva, 生成完的图片修改 [App Icon Generator](https://www.appicon.co/)，获得标准图标，然后直接丢给 AI IDE
3. 上架图: 截几个图，用这个做 [App Store Screenshot Generator | Google Play Preview Maker | ASO Tool](https://appcub.io/)
4. 文案: 用哪个 agent 做，就让哪个 agent 帮忙写，他最懂你的项目
5. 不会填的字段，截图发给 AI
6. 隐私政策&用户协议: Notion 或者 github pages, 让 agent 帮你生成一个单页 Html 部署就行了 比如我这个 https://cheng-liang1.github.io/App-Support/Roam%20Focus/privacy/index.html
   