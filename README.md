# 梁程的个人博客

基于 [Quartz 4](https://quartz.jzhao.xyz/) 构建的静态个人网站，包含首页、博客、项目、相册和收藏页面。站点内容以 Markdown 保存，构建后输出为纯静态文件，可直接部署到 Vercel 或任意静态托管服务。

线上地址：[chengliang.vercel.app](https://chengliang.vercel.app/)

## 快速启动

### 环境要求

- Git
- Node.js `22.16.0`（仓库中的 `.node-version` 为准）
- npm `10.9.2` 或更高版本

推荐使用 `fnm`、`nvm` 或其他 Node 版本管理器切换版本。项目不需要数据库、后端服务、API Key 或 `.env` 文件。

### 安装并运行

```bash
git clone https://github.com/CHENG-LIANG1/blog.git
cd blog

# 如果使用 fnm 或 nvm，先切换到仓库指定的 Node.js 版本
fnm use --install-if-missing
# 或：nvm install && nvm use

npm ci
npm run dev
```

浏览器打开 [http://localhost:8080](http://localhost:8080)。开发服务器会监听文件变化并自动重新构建、刷新页面。

如果 8080 或 WebSocket 端口被占用，可以直接指定其他端口：

```bash
npx quartz build --serve --watch --port 8081 --wsPort 3002
```

## 常用命令

| 命令             | 用途                                                        |
| ---------------- | ----------------------------------------------------------- |
| `npm ci`         | 按 `package-lock.json` 精确安装依赖，首次启动和 CI 推荐使用 |
| `npm run dev`    | 启动本地开发服务器，默认地址为 `http://localhost:8080`      |
| `npm run build`  | 生成生产静态文件到 `public/`                                |
| `npm run check`  | 检查 TypeScript 类型和 Prettier 格式                        |
| `npm test`       | 运行测试                                                    |
| `npm run format` | 使用 Prettier 格式化仓库文件                                |

提交代码前建议执行：

```bash
npm run check
npm test
npm run build
```

## 项目结构

```text
.
├── content/                 # 网站内容：Markdown、页面资源
│   ├── index.md             # 首页
│   ├── blog.md              # 博客聚合页
│   ├── Projects/            # 项目页面
│   ├── 技术/                # 技术文章
│   └── 英语/                # 英语文章
├── quartz/
│   ├── components/          # 页面组件及组件样式/脚本
│   ├── plugins/             # Markdown 转换器和页面生成插件
│   ├── static/              # 原样复制到构建产物的静态资源
│   └── styles/              # 全局、页面级样式
├── quartz.config.ts         # 站点元信息、主题、插件和域名配置
├── quartz.layout.ts         # 页面布局与组件装配
├── public/                  # 构建产物，不提交到 Git
├── server.cjs               # 生产构建产物的简易本地静态服务器
├── vercel.json              # Vercel 构建配置
└── package.json             # npm 脚本和依赖
```

## 修改内容

### 新增博客文章

在 `content/` 的对应分类下新建 `.md` 文件。推荐使用以下 Front Matter：

```md
---
title: 文章标题
description: 用一句话概括文章内容。
tags:
  - 技术
  - AI
aliases:
  - 可选的旧标题或别名
draft: false
---

# 文章标题

正文内容……
```

说明：

- 文件路径会参与生成 URL，例如 `content/技术/示例.md` 对应 `/技术/示例`。
- `draft: true` 的内容会被构建过滤器排除。
- 支持标准 Markdown、GitHub Flavored Markdown、Obsidian Wiki Link、KaTeX 数学公式和代码高亮。
- 文章日期优先读取 Front Matter，其次读取 Git 历史和文件时间。
- 新增或重命名内容后，应检查站内链接和最终 URL。

### 修改站点

- 站点标题、域名、字体、颜色、Markdown 插件：`quartz.config.ts`
- 顶部导航、文章组件、页脚、特殊页面布局：`quartz.layout.ts`
- 自定义组件：`quartz/components/`
- 全局样式：`quartz/styles/custom.scss`
- 文章页样式：`quartz/styles/pages/_article.scss`

`index`、`blog`、`Projects/index`、`album` 和 `collections` 是特殊聚合页面。修改这些页面的布局逻辑时，请同步检查 `quartz.layout.ts` 中的 `HUB_SLUGS`。

## 生产构建与预览

生成静态站点：

```bash
npm run build
```

构建成功后，所有文件位于 `public/`。可以使用仓库自带的静态服务器预览生产产物：

```bash
node server.cjs
```

打开 [http://localhost:3456](http://localhost:3456)。`server.cjs` 不会自动构建，因此内容修改后需要先重新运行 `npm run build`。

## 部署

### Vercel

仓库已经包含 `vercel.json`：

- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 输出目录：`public`

将仓库导入 Vercel 后即可部署，不需要额外环境变量。更换正式域名时，同时更新 `quartz.config.ts` 中的 `baseUrl`，否则 Sitemap、RSS 和 canonical URL 仍会指向旧域名。

### Docker

```bash
docker build -t liangcheng-blog .
docker run --rm -p 8080:8080 -p 3001:3001 liangcheng-blog
```

然后打开 [http://localhost:8080](http://localhost:8080)。

## CI

GitHub Actions 会在推送到 `main` 或创建针对 `main` 的 Pull Request 时执行：

1. 使用 `.node-version` 中声明的 Node.js 版本；
2. 运行 `npm ci`；
3. 运行 `npm run check`；
4. 运行 `npm run build`。

如果本地能启动但 CI 失败，优先确认 Node.js 版本，并在干净工作区重新执行 `npm ci && npm run check && npm run build`。

## 常见问题

### `npm ci` 提示 Node.js 版本不兼容

项目启用了 `engine-strict=true`。请切换到 `.node-version` 指定的 Node.js 版本后重新安装，不要跳过版本检查。

### 页面修改后没有更新

确认运行的是 `npm run dev`。如果使用 `node server.cjs`，它只提供已有的 `public/` 文件，需要先执行 `npm run build`。

### 新文章没有出现在站点中

检查文件是否位于 `content/`、扩展名是否为 `.md`，以及 Front Matter 中是否设置了 `draft: true`。然后查看构建命令输出是否包含解析错误。

### 改了域名但链接仍指向旧站点

更新 `quartz.config.ts` 的 `baseUrl`，重新构建并部署。
