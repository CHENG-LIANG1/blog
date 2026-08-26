import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "./../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentPosts.scss" // 博客筛选与编辑型文章卡片
import { getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  titleEn?: string
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
    const topicButtons = root.querySelectorAll("[data-rp-topic]")
    const subcategoryPanels = root.querySelectorAll("[data-rp-subcategory-panel]")
    const topicPanels = root.querySelectorAll("[data-rp-topic-panel]")
    const items = root.querySelectorAll("[data-rp-item-category]")
    const groups = root.querySelectorAll("[data-rp-group]")
    const count = root.querySelector("[data-rp-count]")
    const clearButton = root.querySelector("[data-rp-clear]")
    const searchInput = root.querySelector("[data-rp-search]")

    const getParams = () => {
      const params = new URLSearchParams(window.location.search)
      return {
        category: params.get("category") || "all",
        subcategory: params.get("subcategory") || "",
        topic: params.get("topic") || "",
      }
    }

    const setParams = (category, subcategory, topic) => {
      const params = new URLSearchParams(window.location.search)
      if (category === "all") {
        params.delete("category")
        params.delete("subcategory")
        params.delete("topic")
      } else {
        params.set("category", category)
        if (subcategory) {
          params.set("subcategory", subcategory)
        } else {
          params.delete("subcategory")
        }
        if (subcategory && topic) {
          params.set("topic", topic)
        } else {
          params.delete("topic")
        }
      }
      const qs = params.toString()
      const url = qs ? window.location.pathname + "?" + qs : window.location.pathname
      window.history.replaceState(null, "", url)
    }

    const applyFilter = (category, subcategory, topic) => {
      let visibleCount = 0
      const query = (searchInput?.value || "").trim().toLocaleLowerCase()

      items.forEach((item) => {
        const itemCategory = item.dataset.rpItemCategory
        const itemSubcategory = item.dataset.rpItemSubcategory || ""
        const itemTopic = item.dataset.rpItemTopic || ""
        const matchesCategory = category === "all" || itemCategory === category
        const matchesSubcategory = !subcategory || itemSubcategory === subcategory
        const matchesTopic = !topic || itemTopic === topic
        const matchesSearch = !query || item.textContent.toLocaleLowerCase().includes(query)
        const visible = matchesCategory && matchesSubcategory && matchesTopic && matchesSearch
        item.hidden = !visible
        if (visible) visibleCount += 1
      })

      groups.forEach((group) => {
        const visibleItem = Array.from(group.querySelectorAll("[data-rp-item-category]")).some(
          (item) => !item.hidden,
        )
        group.hidden = !visibleItem
      })

      categoryButtons.forEach((button) => {
        const isActive = button.dataset.rpCategory === category
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      subcategoryPanels.forEach((panel) => {
        panel.hidden = category === "all" || panel.dataset.rpForCategory !== category
      })

      subcategoryButtons.forEach((button) => {
        const isActive = button.dataset.rpSubcategory === subcategory
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      topicPanels.forEach((panel) => {
        panel.hidden =
          !subcategory ||
          panel.dataset.rpForCategory !== category ||
          panel.dataset.rpForSubcategory !== subcategory
      })

      topicButtons.forEach((button) => {
        const isActive = button.dataset.rpTopic === topic
        button.classList.toggle("is-active", isActive)
        button.setAttribute("aria-pressed", String(isActive))
      })

      if (clearButton) {
        clearButton.hidden = category === "all" && !subcategory && !topic && !query
      }

      if (count) {
        count.textContent = visibleCount + " 篇"
      }
    }

    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.rpCategory || "all"
        applyFilter(category, "", "")
        setParams(category, "", "")
      })
    })

    subcategoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const subcategory = button.dataset.rpSubcategory || ""
        const current = getParams()
        if (current.subcategory === subcategory) {
          applyFilter(current.category, "", "")
          setParams(current.category, "", "")
        } else {
          applyFilter(current.category, subcategory, "")
          setParams(current.category, subcategory, "")
        }
      })
    })

    topicButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const topic = button.dataset.rpTopic || ""
        const current = getParams()
        if (current.topic === topic) {
          applyFilter(current.category, current.subcategory, "")
          setParams(current.category, current.subcategory, "")
        } else {
          applyFilter(current.category, current.subcategory, topic)
          setParams(current.category, current.subcategory, topic)
        }
      })
    })

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        if (searchInput) searchInput.value = ""
        applyFilter("all", "", "")
        setParams("all", "", "")
      })
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const current = getParams()
        applyFilter(current.category, current.subcategory, current.topic)
      })
    }

    const initial = getParams()
    applyFilter(initial.category, initial.subcategory, initial.topic)
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
  "项目/面试": "项目/面试",
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

const CATEGORY_ORDER = ["技术", "项目/面试", "英语", "其他"]
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
  topic?: string
}

function getPostSegments(slug: string): string[] {
  return slug.split("/").filter((part) => part.length > 0)
}

function getBlogListItem(page: QuartzPluginData): BlogListItem {
  const segments = getPostSegments(page.slug ?? "")
  const frontmatterCategory = page.frontmatter?.blogCategory
  return {
    page,
    category:
      typeof frontmatterCategory === "string" && frontmatterCategory.trim().length > 0
        ? frontmatterCategory.trim()
        : segments.length > 1
          ? segments[0]
          : "其他",
    subcategory: segments.length > 2 ? segments[1] : undefined,
    topic: segments.length > 3 ? segments[2] : undefined,
  }
}

function getDescription(page: QuartzPluginData): string {
  const frontmatterDescription = page.frontmatter?.description
  if (typeof frontmatterDescription === "string" && frontmatterDescription.trim().length > 0) {
    return sanitizeListText(frontmatterDescription)
  }

  const description = page.description
  return typeof description === "string" ? sanitizeListText(description) : ""
}

function sanitizeListText(value: string): string {
  return value.replace(/[→↗]/g, "，").replace(/[└─]/g, "").replace(/\s+/g, " ").trim()
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
    const topicMap = new Map<string, Map<string, number>>()
    const yearGroups = new Map<string, BlogListItem[]>()

    for (const item of items) {
      categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1)
      if (item.subcategory) {
        const subMap = subcategoryMap.get(item.category) ?? new Map<string, number>()
        subMap.set(item.subcategory, (subMap.get(item.subcategory) ?? 0) + 1)
        subcategoryMap.set(item.category, subMap)
      }
      if (item.subcategory && item.topic) {
        const key = `${item.category}\u0000${item.subcategory}`
        const topics = topicMap.get(key) ?? new Map<string, number>()
        topics.set(item.topic, (topics.get(item.topic) ?? 0) + 1)
        topicMap.set(key, topics)
      }

      const date = getDate(cfg, item.page)
      const year = date ? `${date.getFullYear()}` : "未注明"
      const yearItems = yearGroups.get(year) ?? []
      yearItems.push(item)
      yearGroups.set(year, yearItems)
    }

    const categories = [...categoryCounts.entries()].sort(([a], [b]) =>
      categorySortKey(a).localeCompare(categorySortKey(b)),
    )

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        {opts.title && (
          <h2 class="rp-title">
            <span class="rp-title-zh">{opts.title}</span>
            {opts.titleEn && <span class="rp-title-en">{opts.titleEn}</span>}
          </h2>
        )}
        <div class="rp-toolbar">
          <div class="rp-filter-panel" aria-label="按分类筛选文章">
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
              <button
                class="rp-filter"
                type="button"
                data-rp-category={category}
                aria-pressed="false"
              >
                <span>{formatDirLabel(category)}</span>
                <strong>{count}</strong>
              </button>
            ))}
          </div>

          <div class="rp-toolbar-tools">
            <button class="rp-filter rp-filter-clear" type="button" data-rp-clear hidden>
              <span>清除筛选</span>
            </button>
            <label class="rp-search">
              <span class="sr-only">搜索文章</span>
              <input type="search" placeholder="搜索文章" data-rp-search />
            </label>
            <span class="rp-total" data-rp-count>
              {items.length} 篇
            </span>
          </div>
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
                  <span>{formatDirLabel(subcategory)}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
          )
        })}

        {[...topicMap.entries()].map(([key, topicCounts]) => {
          const [category, subcategory] = key.split("\u0000")
          const topics = [...topicCounts.entries()].sort(([a], [b]) => a.localeCompare(b))
          return (
            <div
              class="rp-topic-panel"
              data-rp-topic-panel
              data-rp-for-category={category}
              data-rp-for-subcategory={subcategory}
              hidden
            >
              {topics.map(([topic, count]) => (
                <button
                  class="rp-filter rp-filter-topic"
                  type="button"
                  data-rp-topic={topic}
                  aria-pressed="false"
                >
                  <span>{formatDirLabel(topic)}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
          )
        })}

        <div class="rp-groups">
          {[...yearGroups.entries()].map(([year, yearItems]) => (
            <section class="rp-year-group" data-rp-group aria-labelledby={`rp-year-${year}`}>
              <header class="rp-year-heading">
                <span aria-hidden="true">Year</span>
                <h2 id={`rp-year-${year}`}>{year}</h2>
              </header>
              <ol class="rp-list">
                {yearItems.map(({ page, category, subcategory, topic }) => {
                  const title = sanitizeListText(
                    (page.frontmatter?.title as string | undefined) ?? "无标题",
                  )
                  const dateStr = formatDate(cfg, page)
                  const description = getDescription(page)

                  return (
                    <li
                      class="rp-list-item"
                      data-rp-item-category={category}
                      data-rp-item-subcategory={subcategory ?? ""}
                      data-rp-item-topic={topic ?? ""}
                    >
                      <a class="rp-list-link" href={resolveRelative(fileData.slug!, page.slug!)}>
                        <time class="rp-list-date">{dateStr.slice(5) || "未注明"}</time>
                        <div class="rp-list-main">
                          <div class="rp-list-heading">
                            <h3>{title}</h3>
                          </div>
                          {description && <p>{description}</p>}
                        </div>
                        <div class="rp-list-tags" aria-label="分类">
                          <span>{formatDirLabel(category)}</span>
                          {subcategory && <span>{formatDirLabel(subcategory)}</span>}
                          {topic && <span>{formatDirLabel(topic)}</span>}
                        </div>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </section>
          ))}
        </div>
      </section>
    )
  }

  RecentPosts.css = style
  RecentPosts.afterDOMLoaded = script
  return RecentPosts
}) satisfies QuartzComponentConstructor
