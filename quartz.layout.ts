import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/CHENG-LIANG1",
      Blog: "https://chengliang.vercel.app",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Explorer({
      filterFn: (node) => {
        // Only hide tags folder
        if (node.slugSegment === "tags") {
          return false
        }
        return true
      },
      sortFn: (a, b) => {
        // Custom order: 技术 > Projects > 英语 > 生活
        const orderMap: Record<string, number> = {
          "技术": 1,
          "Projects": 2,
          "英语": 3,
          "生活": 4,
        }
        
        const aOrder = orderMap[a.displayName] || 99
        const bOrder = orderMap[b.displayName] || 99
        
        if (aOrder !== 99 || bOrder !== 99) {
          return aOrder - bOrder
        }
        
        // Default alphabetical sort for others
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        
        return a.isFolder ? -1 : 1
      },
    }),
    Component.AllBlogsLink(),
  ],
  right: [
    Component.Darkmode(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks({
      filterFn: (file) => {
        // 隐藏生活文件夹的内容
        return !file.slug?.startsWith("生活/")
      },
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Explorer({
      filterFn: (node) => {
        // Only hide tags folder
        if (node.slugSegment === "tags") {
          return false
        }
        return true
      },
      sortFn: (a, b) => {
        // Custom order: 技术 > Projects > 英语 > 生活
        const orderMap: Record<string, number> = {
          "技术": 1,
          "Projects": 2,
          "英语": 3,
          "生活": 4,
        }
        
        const aOrder = orderMap[a.displayName] || 99
        const bOrder = orderMap[b.displayName] || 99
        
        if (aOrder !== 99 || bOrder !== 99) {
          return aOrder - bOrder
        }
        
        // Default alphabetical sort for others
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }
        
        return a.isFolder ? -1 : 1
      },
    }),
    Component.AllBlogsLink(),
  ],
  right: [
    Component.Darkmode(),
  ],
}
