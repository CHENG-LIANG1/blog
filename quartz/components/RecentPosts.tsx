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
  "技术": "技术",
  "英语": "英语",
}

const SUBDIR_LABELS: Record<string, string> = {
  "Prompt-Engineering": "Prompt Engineering",
  "刷题": "刷题",
}

function getCategory(slug: string): string {
  const firstSlash = slug.indexOf("/")
  if (firstSlash === -1) return "其他"
  return slug.slice(0, firstSlash)
}

function getSubDir(slug: string): string {
  const parts = slug.split("/")
  if (parts.length < 3) return ""
  return parts[1]
}

const CATEGORY_ORDER = ["技术", "英语"]
function categorySortKey(cat: string): string {
  const idx = CATEGORY_ORDER.indexOf(cat)
  return idx >= 0 ? `${idx}` : `z${cat}`
}

const SUBDIR_ORDER = ["Prompt-Engineering", "刷题"]
function subDirSortKey(dir: string): string {
  if (dir === "") return "0"
  const idx = SUBDIR_ORDER.indexOf(dir)
  return idx >= 0 ? `${idx + 1}` : `z${dir}`
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 100,
  filter: isBlogPost,
  sort: byDateAndAlphabetical(cfg),
})

type YearGroup = { year: string; posts: QuartzPluginData[] }
type SubDirMap = Map<string, YearGroup[]>
type CategoryMap = Map<string, SubDirMap>

function countPosts(subDirMap: SubDirMap): number {
  let total = 0
  for (const yearGroups of subDirMap.values()) {
    for (const yg of yearGroups) total += yg.posts.length
  }
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

    const categoryMap: CategoryMap = new Map()

    for (const page of pages) {
      const cat = getCategory(page.slug ?? "")
      const subDir = getSubDir(page.slug ?? "")
      const date = getDate(cfg, page)
      const year = date ? `${date.getFullYear()}` : "更早"

      if (!categoryMap.has(cat)) categoryMap.set(cat, new Map())
      const subDirMap = categoryMap.get(cat)!
      if (!subDirMap.has(subDir)) subDirMap.set(subDir, [])
      const yearGroups = subDirMap.get(subDir)!
      let yearGroup = yearGroups.find((g) => g.year === year)
      if (!yearGroup) {
        yearGroup = { year, posts: [] }
        yearGroups.push(yearGroup)
      }
      yearGroup.posts.push(page)
    }

    const sortedCategories = [...categoryMap.keys()].sort(
      (a, b) => categorySortKey(a).localeCompare(categorySortKey(b))
    )

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
    const renderPosts = (posts: QuartzPluginData[]) => (
      <div class="rp-list-view">
        {posts.map((p) => renderListRow(p))}
      </div>
    )

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        {/* 顶部工具栏 */}
        <div class="rp-toolbar">
          {opts.title && <h2 class="rp-title">{opts.title}</h2>}
        </div>

        {/* 分类卡片 */}
        <div class="rp-categories">
          {sortedCategories.map((cat, catIdx) => {
            const subDirMap = categoryMap.get(cat)!
            const sortedSubDirs = [...subDirMap.keys()].sort(
              (a, b) => subDirSortKey(a).localeCompare(subDirSortKey(b))
            )
            const catId = `cat-${catIdx}`

            return (
              <div class="rp-category">
                <div class="rp-category-header" data-rp-toggle={`#${catId}`}>
                  <span class="rp-category-icon">
                    <svg class="rp-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <h3 class="rp-category-name">{CATEGORY_LABELS[cat] ?? cat}</h3>
                  <span class="rp-category-count">{countPosts(subDirMap)}</span>
                </div>
                <div class="rp-category-body" id={catId}>
                  {sortedSubDirs.map((subDir, subIdx) => {
                    const subId = `sub-${catIdx}-${subIdx}`
                    const yearGroups = subDirMap.get(subDir)!
                    const allPosts = yearGroups.flatMap((yg) => yg.posts)

                    if (subDir) {
                      return (
                        <div class="rp-subdir">
                          <div class="rp-subdir-header" data-rp-toggle={`#${subId}`}>
                            <span class="rp-subdir-icon">
                              <svg class="rp-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                            <span class="rp-subdir-name">{SUBDIR_LABELS[subDir] ?? subDir}</span>
                            <span class="rp-subdir-count">{allPosts.length}</span>
                          </div>
                          <div class="rp-subdir-body" id={subId}>
                            {renderPosts(allPosts)}
                          </div>
                        </div>
                      )
                    }

                    // 无子目录的文章直接渲染
                    return (
                      <div class="rp-subdir">
                        <div class="rp-subdir-body">
                          {renderPosts(allPosts)}
                        </div>
                      </div>
                    )
                  })}
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
