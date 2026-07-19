import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "./../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentPosts.scss"
import { getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const script = `
document.addEventListener("nav", () => {
  const roots = document.querySelectorAll(".recent-posts")

  roots.forEach((root) => {
    const categoryButtons = root.querySelectorAll("[data-rp-category]")
    const subcategoryButtons = root.querySelectorAll("[data-rp-subcategory]")
    const subcategoryPanel = root.querySelector("[data-rp-subcategory-panel]")
    const items = root.querySelectorAll("[data-rp-item-category]")
    const count = root.querySelector("[data-rp-count]")
    const clearButton = root.querySelector("[data-rp-clear]")

    const getParams = () => {
      const params = new URLSearchParams(window.location.search)
      return {
        category: params.get("category") || "all",
        subcategory: params.get("subcategory") || "",
      }
    }

    const setParams = (category, subcategory) => {
      const params = new URLSearchParams(window.location.search)
      if (category === "all") {
        params.delete("category")
        params.delete("subcategory")
      } else {
        params.set("category", category)
        if (subcategory) {
          params.set("subcategory", subcategory)
        } else {
          params.delete("subcategory")
        }
      }
      const qs = params.toString()
      const url = qs ? window.location.pathname + "?" + qs : window.location.pathname
      window.history.replaceState(null, "", url)
    }

    const applyFilter = (category, subcategory) => {
      let visibleCount = 0

      items.forEach((item) => {
        const itemCategory = item.dataset.rpItemCategory
        const itemSubcategory = item.dataset.rpItemSubcategory || ""
        const matchesCategory = category === "all" || itemCategory === category
        const matchesSubcategory = !subcategory || itemSubcategory === subcategory
        const visible = matchesCategory && matchesSubcategory
        item.hidden = !visible
        if (visible) visibleCount += 1
      })

      categoryButtons.forEach((button) => {
        const isActive = button.dataset.rpCategory === category
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      if (subcategoryPanel) {
        const hasSubcategories = category !== "all" && root.querySelector('[data-rp-subcategory-panel][data-rp-for-category="' + category + '"]')
        subcategoryPanel.hidden = !hasSubcategories
      }

      subcategoryButtons.forEach((button) => {
        const isActive = button.dataset.rpSubcategory === subcategory
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      if (clearButton) {
        clearButton.hidden = category === "all" && !subcategory
      }

      if (count) {
        count.textContent = visibleCount + " 篇"
      }
    }

    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.rpCategory || "all"
        applyFilter(category, "")
        setParams(category, "")
      })
    })

    subcategoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const subcategory = button.dataset.rpSubcategory || ""
        const current = getParams()
        if (current.subcategory === subcategory) {
          applyFilter(current.category, "")
          setParams(current.category, "")
        } else {
          applyFilter(current.category, subcategory)
          setParams(current.category, subcategory)
        }
      })
    })

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        applyFilter("all", "")
        setParams("all", "")
      })
    }

    const initial = getParams()
    applyFilter(initial.category, initial.subcategory)
  })
})
`

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
  其他: "其他",
}

const SUBDIR_LABELS: Record<string, string> = {
  "Prompt Engineering": "Prompt Engineering",
  刷题: "刷题",
}

function formatDirLabel(segment: string): string {
  return CATEGORY_LABELS[segment] ?? SUBDIR_LABELS[segment] ?? segment
}

const CATEGORY_ORDER = ["技术", "英语", "其他"]
function categorySortKey(cat: string): string {
  const idx = CATEGORY_ORDER.indexOf(cat)
  return idx >= 0 ? `${idx}` : `z${cat}`
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 100,
  filter: isBlogPost,
  sort: byDateAndAlphabetical(cfg),
})

type BlogListItem = {
  page: QuartzPluginData
  category: string
  subcategory?: string
}

function getPostSegments(slug: string): string[] {
  return slug.split("/").filter((part) => part.length > 0)
}

function getBlogListItem(page: QuartzPluginData): BlogListItem {
  const segments = getPostSegments(page.slug ?? "")
  return {
    page,
    category: segments.length > 1 ? segments[0] : "其他",
    subcategory: segments.length > 2 ? segments.slice(1, -1).join(" / ") : undefined,
  }
}

function getDescription(page: QuartzPluginData): string {
  const frontmatterDescription = page.frontmatter?.description
  if (typeof frontmatterDescription === "string" && frontmatterDescription.trim().length > 0) {
    return frontmatterDescription.trim()
  }

  const description = page.description
  return typeof description === "string" ? description.trim() : ""
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
    const items = allFiles
      .filter(opts.filter)
      .sort(opts.sort)
      .slice(0, opts.limit)
      .map(getBlogListItem)

    const categoryCounts = new Map<string, number>()
    const subcategoryMap = new Map<string, Map<string, number>>()

    for (const item of items) {
      categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1)
      if (item.subcategory) {
        const subMap = subcategoryMap.get(item.category) ?? new Map<string, number>()
        subMap.set(item.subcategory, (subMap.get(item.subcategory) ?? 0) + 1)
        subcategoryMap.set(item.category, subMap)
      }
    }

    const categories = [...categoryCounts.entries()].sort(([a], [b]) =>
      categorySortKey(a).localeCompare(categorySortKey(b)),
    )

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        <div class="rp-toolbar">
          <div>
            <h2 class="rp-title">文章列表</h2>
          </div>
          <span class="rp-total" data-rp-count>
            {items.length} 篇
          </span>
        </div>

        <div class="rp-filter-panel" aria-label="按目录筛选文章">
          <button
            class="rp-filter is-active"
            type="button"
            data-rp-category="all"
            aria-pressed="true"
          >
            <span>全部</span>
            <strong>{items.length}</strong>
          </button>
          {categories.map(([category, count]) => (
            <button class="rp-filter" type="button" data-rp-category={category} aria-pressed="false">
              <span>{formatDirLabel(category)}</span>
              <strong>{count}</strong>
            </button>
          ))}
          <button class="rp-filter rp-filter-clear" type="button" data-rp-clear hidden>
            <span>清除筛选</span>
          </button>
        </div>

        {categories.map(([category]) => {
          const subMap = subcategoryMap.get(category)
          if (!subMap || subMap.size === 0) return null
          const subcategories = [...subMap.entries()].sort(([a], [b]) => a.localeCompare(b))
          return (
            <div
              class="rp-subcategory-panel"
              data-rp-subcategory-panel
              data-rp-for-category={category}
              hidden
            >
              {subcategories.map(([subcategory, count]) => (
                <button
                  class="rp-filter rp-filter-sub"
                  type="button"
                  data-rp-subcategory={subcategory}
                  aria-pressed="false"
                >
                  <span>└ {formatDirLabel(subcategory)}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
          )
        })}

        <ol class="rp-list">
          {items.map(({ page, category, subcategory }) => {
            const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
            const dateStr = formatDate(cfg, page)
            const description = getDescription(page)

            return (
              <li
                class="rp-list-item"
                data-rp-item-category={category}
                data-rp-item-subcategory={subcategory ?? ""}
              >
                <a class="rp-list-link" href={resolveRelative(fileData.slug!, page.slug!)}>
                  <time class="rp-list-date">{dateStr || "未注明日期"}</time>
                  <div class="rp-list-main">
                    <div class="rp-list-heading">
                      <h3>{title}</h3>
                      <span class="rp-list-arrow" aria-hidden="true">
                        →
                      </span>
                    </div>
                    {description && <p>{description}</p>}
                  </div>
                  <div class="rp-list-tags" aria-label="目录">
                    <span>{formatDirLabel(category)}</span>
                    {subcategory && <span>{formatDirLabel(subcategory)}</span>}
                  </div>
                </a>
              </li>
            )
          })}
        </ol>
      </section>
    )
  }

  RecentPosts.css = style
  RecentPosts.afterDOMLoaded = script
  return RecentPosts
}) satisfies QuartzComponentConstructor
