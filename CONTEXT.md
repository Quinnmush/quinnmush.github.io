# PersonalBlog — 领域词汇表

## 项目结构

```
src/
├── config.ts                 # 站点配置（标题、描述、URL）
├── content/
│   ├── config.ts             # 内容集合 schema
│   └── posts/                # Markdown 文章
├── layouts/
│   ├── BaseLayout.astro      # 全局 HTML 壳（吸顶 nav / footer + 亮暗切换 + 移动端 TOC 下拉）
│   └── PostLayout.astro      # 文章详情布局（正文 + giscus 评论 + 桌面端 TOC 侧栏 + IntersectionObserver 高亮）
├── pages/
│   ├── index.astro           # 首页
│   ├── 404.astro
│   ├── search.astro          # 全文搜索页
│   ├── search-index.json.js  # 搜索索引 JSON 端点
│   ├── rss.xml.js            # RSS Feed
│   ├── posts/[...slug].astro # 文章详情
│   └── tags/
│       ├── index.astro       # 标签云
│       └── [tag].astro       # 标签筛选
├── styles/
│   ├── variables.css         # 设计 Token
│   ├── reset.css             # CSS reset + scroll-padding + smooth scroll
│   ├── home.css              # 首页 & 标签页样式
│   ├── post.css              # 文章详情样式（正文 + giscus + TOC）
│   └── search.css            # 搜索页样式
└── utils/
    └── strip-markdown.ts     # Markdown 转纯文本
```

## 路由

| 路由 | 页面 | 数据来源 |
|------|------|---------|
| `/` | 首页 | getCollection（非草稿，日期降序） |
| `/posts/[...slug]` | 文章详情 | getCollection（含草稿） |
| `/tags` | 标签云 | 聚合非草稿文章标签 |
| `/tags/[tag]` | 标签筛选 | getCollection 按 tag 过滤 |
| `/search` | 搜索 | 客户端 fetch search-index.json |
| `/search-index.json` | 搜索索引 | 构建时生成 |
| `/rss.xml` | RSS Feed | getCollection（非草稿） |
| `/404` | 自定义 404 | 静态 |

## 角色

### 作者 (Author)
博客的唯一写作者。拥有全部管理权限，负责创建、编辑、发布、删除内容。

### 读者 (Reader)
公开互联网访客。无需认证即可阅读已发布内容，无写权限。

## 内容管理

### 内容存储
所有文章以 Markdown 文件形式存储在 Git 仓库中。采用 Git 作为版本管理和发布机制，无 CMS 后台数据库。

### 文章 (Post)
核心内容单元。一篇技术文章，包含标题、正文（Markdown）、发布日期、标签等元数据。

文章文件存放在 `src/content/posts/`，平铺无子目录。通过标签系统实现导航与发现。

### 图片
计划存放在 `src/assets/images/<article-slug>/` 目录，尚未实现。

## 文章元数据 (Frontmatter)

```yaml
---
title: string          # 必须
date: YYYY-MM-DD       # 必须
tags: string[]         # 必须 — 至少一个
description: string    # 推荐 — 列表摘要与 SEO
draft: boolean         # 推荐 — 草稿控制
series: string         # 可选 — 系列分组
---
```

## 功能清单

### 已实现
- 文章列表与正文展示
- 标签聚合与筛选页
- RSS/Atom Feed（`@astrojs/rss`）
- 代码语法高亮（Shiki，github-light / github-dark）
- 手动亮暗切换按钮（localStorage + `data-theme` 属性）
- 系统亮暗偏好自动跟随（`prefers-color-scheme` 降级）
- 自定义 404 页面
- 全客户端全文搜索（MiniSearch，CJK 分词，模糊匹配，键盘导航）
- 搜索索引构建时 JSON 端点（`/search-index.json`）
- GitHub Actions 自动构建部署到 GitHub Pages
- 评论系统（giscus，基于 GitHub Discussions，亮暗主题联动）
- 文章导航目录（TOC）
  - 桌面端（≥1200px）：固定右侧悬浮侧栏，不占用正文宽度。h2 条目加粗深色，h3 条目斜体浅色小号，视觉层级分明。高亮逻辑：始终最多两个标题同时亮起（1 个 h2 + 其下属 1 个 h3），标题滚到视窗偏上部（~120px）时切换。目录列表区域可滚动，"跳转评论"固定在侧栏底部。
  - 移动端（<1200px）：导航栏显示"目录"按钮，点击展开全宽下拉菜单，层级样式同步。点击链接自动关闭。
  - 阅读进度指示器：侧栏左侧竖向进度条 + 移动端导航栏底部横向进度条，反映整体阅读百分比

### 延后实现
- 阅读统计/分析
- 关于页面

## 技术栈

### 框架
**Astro 5** — 静态站点生成器。Markdown 原生支持，零 JS 默认输出。

### 搜索
**MiniSearch** — 客户端全文搜索库（~6KB gzipped）。构建时通过 `strip-markdown.ts` 将文章正文转为纯文本，生成静态 JSON 索引。浏览器端建立索引，支持 CJK unigram+bigram 分词、fuzzy 模糊匹配、prefix 前缀搜索。

### 托管
**GitHub Pages** — Git push 触发 GitHub Actions 构建并部署，域名 `quinnmush.github.io`。

### 样式
纯 CSS / CSS 自定义属性 — 无框架依赖。通过 `variables.css` 定义设计 Token（颜色/字体/间距/布局）。

### 代码高亮
**Shiki**（Astro 内置）— 双主题：`github-light`（日间）/ `github-dark`（夜间）。

## 工作流

### 写作与发布
1. 本地写 `.md` 文件，`draft: true` 标记草稿
2. `npm run dev` 本地预览
3. 发布时改为 `draft: false`
4. Git push 到 `main` 分支 → GitHub Actions 自动构建部署

`main` 分支即发布通道，不设 staging / PR 流程。

## 视觉设计

### 布局
- 单栏布局，内容居中最大宽度 720px
- 无侧边栏，强调阅读体验
- 文章页：宽屏（>1200px）右侧悬浮 TOC 侧栏，不占用正文宽度。TOC 高度限制在视口上半部，"跳转评论"固定底部
- 全局 `scroll-padding-top: 6rem` 配合吸顶导航，锚点跳转不被遮挡

### 亮暗模式
- **策略**：三层降级 — ① 手动切换（localStorage 存储 `theme` 键）→ ② 系统偏好（`prefers-color-scheme`）→ ③ 默认日间
- **切换机制**：`data-theme` 属性设置在 `<html>` 元素上，CSS 通过属性选择器切换变量
- **JavaScript**：BaseLayout 内联 `<script>`，无需外部 JS

### 配色
- 日间：暖白背景 `#faf6f0` + 深色文字 `#2c2c2c`，强调色 `#c0552d`
- 夜间：深灰背景 `#1a1a1e` + 浅色文字 `#e4e4e7`，强调色 `#e88d6a`
- 代码块：默认深色编辑器背景 `#282c34`，Shiki 双主题控制

### 页面结构
- **首页**：最新一篇用特色大卡片（accent 渐变背景 + 白色文字），其余用卡片列表（白底 + border + hover 上浮阴影）
- **文章页**：PostLayout 包裹（标题 + 日期 + 标签 chip + 正文 + giscus 评论区 + 桌面 TOC 侧栏）
- **标签聚合页** `/tags`：列出所有标签及文章数量，按频率降序
- **标签筛选页** `/tags/[tag]`：按标签筛选文章列表
- **搜索页** `/search`：搜索输入框（底部边框 focus-within 过渡）+ 结果列表（关键词高亮 + 标签 chip）
- **404 页面** `/404`：大号 accent 色 404 + 返回首页按钮

### 导航栏
- 站点名称（链接至首页）
- 标签页链接
- 搜索页链接
- 亮暗模式切换按钮（圆形图标，右侧对齐）
- 吸顶效果（`position: sticky`），滚动时不消失
- 文章页窄屏下显示"目录"下拉按钮（<1200px），点击展开章节导航

### 字体
- 正文：Inter（无衬线），行高 1.75
- 代码：JetBrains Mono（等宽）
- 标题行高 1.3
