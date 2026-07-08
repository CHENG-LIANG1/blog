import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "./../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentPosts.scss"
// @ts-ignore
import script from "./scripts/recentPosts.inline"
import { getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const isBlogPost = (f: QuartzPluginData): boolean => {
  const slug = f.slug ?? ""
  return (
    slug !== "index" &&
    slug !== "blog" &&
    slug !== "album" &&
    slug !== "collections" &&
    !slug.startsWith("tags/") &&
    !slug.endsWith("/index") &&
    !slug.startsWith("Hobbies/") &&
    !slug.startsWith("Projects/") &&
    !slug.includes("术语库")
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  技术: "技术",
  英语: "英语",
}

const SUBDIR_LABELS: Record<string, string> = {
  "Prompt-Engineering": "Prompt Engineering",
  刷题: "刷题",
}

function formatDirLabel(segment: string): string {
  return CATEGORY_LABELS[segment] ?? SUBDIR_LABELS[segment] ?? segment
}

const CATEGORY_ORDER = ["技术", "英语"]
function categorySortKey(cat: string): string {
  const idx = CATEGORY_ORDER.indexOf(cat)
  return idx >= 0 ? `${idx}` : `z${cat}`
}

const SUBDIR_ORDER = ["Prompt-Engineering", "刷题"]
function dirSortKey(dir: string, depth: number): string {
  if (depth === 0) return categorySortKey(dir)
  const idx = SUBDIR_ORDER.indexOf(dir)
  return idx >= 0 ? `${idx}` : `z${dir}`
}

function sortedChildNodes(node: DirNode, depth: number): DirNode[] {
  return [...node.children.values()].sort((a, b) =>
    dirSortKey(a.segment, depth).localeCompare(dirSortKey(b.segment, depth)),
  )
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 100,
  filter: isBlogPost,
  sort: byDateAndAlphabetical(cfg),
})

type DirNode = {
  segment: string
  children: Map<string, DirNode>
  posts: QuartzPluginData[]
}

function createDirNode(segment: string): DirNode {
  return { segment, children: new Map(), posts: [] }
}

function getPostDirSegments(slug: string): string[] {
  const parts = slug.split("/").filter((part) => part.length > 0)
  if (parts.length <= 1) return ["其他"]
  return parts.slice(0, -1)
}

function insertPost(root: DirNode, page: QuartzPluginData) {
  const segments = getPostDirSegments(page.slug ?? "")
  let node = root

  for (const segment of segments) {
    if (!node.children.has(segment)) node.children.set(segment, createDirNode(segment))
    node = node.children.get(segment)!
  }

  node.posts.push(page)
}

function countPosts(node: DirNode): number {
  let total = node.posts.length
  for (const child of node.children.values()) total += countPosts(child)
  return total
}

function formatDate(cfg: GlobalConfiguration, page: QuartzPluginData): string {
  const date = getDate(cfg, page)
  if (!date) return ""
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`
}

export default ((userOpts?: Partial<Options>) => {
  const RecentPosts: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort).slice(0, opts.limit)

    const rootNode = createDirNode("")

    for (const page of pages) insertPost(rootNode, page)

    const sortedCategories = sortedChildNodes(rootNode, 0)

    // 渲染单个文章列表行
    const renderListRow = (page: QuartzPluginData) => {
      const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
      const dateStr = formatDate(cfg, page)
      return (
        <a class="rp-list-row" href={resolveRelative(fileData.slug!, page.slug!)}>
          <span class="rp-list-title">{title}</span>
          <span class="rp-list-date">{dateStr}</span>
        </a>
      )
    }

    // 渲染文章列表
    const renderPosts = (posts: QuartzPluginData[], depth = 0) => (
      <div class="rp-list-view" style={`--rp-depth: ${depth}`}>
        {posts.map((p) => renderListRow(p))}
      </div>
    )

    const renderDirNode = (node: DirNode, id: string, depth: number) => {
      const children = sortedChildNodes(node, depth)
      const postCount = countPosts(node)

      return (
        <div class="rp-dir-level" style={`--rp-depth: ${depth}`}>
          <div class="rp-dir-header" data-rp-toggle={`#${id}`}>
            <span class="rp-dir-icon">
              <svg class="rp-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="rp-dir-name">{formatDirLabel(node.segment)}</span>
            <span class="rp-dir-count">{postCount}</span>
          </div>
          <div class="rp-dir-body" id={id} style={`--rp-depth: ${depth}`}>
            {children.map((child, childIdx) =>
              renderDirNode(child, `${id}-${childIdx}`, depth + 1),
            )}
            {node.posts.length > 0 && renderPosts(node.posts, depth + 1)}
          </div>
        </div>
      )
    }

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        {/* 顶部工具栏 */}
        <div class="rp-toolbar">{opts.title && <h2 class="rp-title">{opts.title}</h2>}</div>

        {/* 分类卡片 */}
        <div class="rp-categories">
          {sortedCategories.map((cat, catIdx) => {
            const catId = `cat-${catIdx}`
            const children = sortedChildNodes(cat, 1)

            return (
              <div class="rp-category">
                <div class="rp-category-header" data-rp-toggle={`#${catId}`}>
                  <span class="rp-category-icon">
                    <svg class="rp-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6 4l4 4-4 4"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 class="rp-category-name">{formatDirLabel(cat.segment)}</h3>
                  <span class="rp-category-count">{countPosts(cat)}</span>
                </div>
                <div class="rp-category-body" id={catId}>
                  {children.map((child, childIdx) =>
                    renderDirNode(child, `${catId}-${childIdx}`, 1),
                  )}
                  {cat.posts.length > 0 && renderPosts(cat.posts, 1)}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  RecentPosts.css = style
  RecentPosts.afterDOMLoaded = script
  return RecentPosts
}) satisfies QuartzComponentConstructor
