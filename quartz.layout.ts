import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// hub 页（首页 / 博客 / 项目 / 相册 / 收藏）：自带标题与排版，不显示面包屑、文章标题、元信息
const HUB_SLUGS = new Set(["index", "blog", "Projects/index", "projects", "album", "collections"])
const isHub = (slug: string): boolean => HUB_SLUGS.has(slug)

// 产品落地页自带完整 Hero，不重复显示 Quartz 的文章标题、元信息与标签。
const PRODUCT_LANDING_SLUGS = new Set([
  "Projects/Roam-Focus",
  "Projects/兴曰",
  "Projects/Active-Habits",
  "Projects/GeekBio",
])
const isProductLanding = (slug: string): boolean => PRODUCT_LANDING_SLUGS.has(slug)
const showArticleHeader = (slug: string): boolean => !isHub(slug) && !isProductLanding(slug)

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.TopTabs(), Component.LanguageToggle(), Component.Darkmode()],
  afterBody: [
    Component.PostNavigation(),
    Component.ConditionalRender({
      component: Component.RecentPosts({ limit: 200 }),
      condition: (page) => page.fileData.slug === "blog",
    }),
    Component.ConditionalRender({
      component: Component.RecentPosts({ limit: 5, title: "最近文章", titleEn: "Recent writing" }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeContact(),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  footer: Component.Footer({
    goatCounterCode: "chengliang",
    links: {
      GitHub: "https://github.com/CHENG-LIANG1",
      Threads: "https://www.threads.com/@earthboundmother3",
      Blog: "https://chengliang.vercel.app",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ScrollControls(),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => showArticleHeader(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => showArticleHeader(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => showArticleHeader(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => showArticleHeader(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.ArticleSummary(),
      condition: (page) => showArticleHeader(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.TableOfContents(),
      condition: (page) =>
        !isHub(page.fileData.slug ?? "") &&
        !page.fileData.slug?.startsWith("Projects/") &&
        !page.fileData.slug?.startsWith("Hobbies/"),
    }),
  ],
  left: [],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !isHub(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isHub(page.fileData.slug ?? ""),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isHub(page.fileData.slug ?? ""),
    }),
  ],
  left: [],
  right: [],
}
