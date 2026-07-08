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

type BlogCard = {
  page: QuartzPluginData
  category: string
  subcategory?: string
}

function getPostSegments(slug: string): string[] {
  return slug.split("/").filter((part) => part.length > 0)
}

function getBlogCard(page: QuartzPluginData): BlogCard {
  const segments = getPostSegments(page.slug ?? "")
  return {
    page,
    category: segments.length > 1 ? segments[0] : "其他",
    subcategory:
      segments.length > 2 ? segments.slice(1, -1).map(formatDirLabel).join(" / ") : undefined,
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
    const pages = allFiles.filter(opts.filter).sort(opts.sort).slice(0, opts.limit)
    const cards = pages.map(getBlogCard)
    const cardsByCategory = new Map<string, BlogCard[]>()

    for (const card of cards) {
      const existingCards = cardsByCategory.get(card.category) ?? []
      existingCards.push(card)
      cardsByCategory.set(card.category, existingCards)
    }

    const sortedCategories = [...cardsByCategory.entries()].sort(([a], [b]) =>
      categorySortKey(a).localeCompare(categorySortKey(b)),
    )

    const renderCard = ({ page, subcategory }: BlogCard) => {
      const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
      const dateStr = formatDate(cfg, page)
      const description = getDescription(page)

      return (
        <a class="rp-card" href={resolveRelative(fileData.slug!, page.slug!)}>
          <div class="rp-card-meta">
            {subcategory && <span class="rp-card-kicker">{subcategory}</span>}
            {dateStr && <time class="rp-card-date">{dateStr}</time>}
          </div>
          <h3 class="rp-card-title">{title}</h3>
          {description && <p class="rp-card-description">{description}</p>}
          <span class="rp-card-cta" aria-hidden="true">
            阅读文章
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </a>
      )
    }

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        <div class="rp-toolbar">
          <div>
            <p class="rp-eyebrow">All writing</p>
            <h2 class="rp-title">文章归档</h2>
          </div>
          <span class="rp-total">{cards.length} 篇</span>
        </div>

        <div class="rp-category-tabs" aria-label="文章分类">
          {sortedCategories.map(([category, categoryCards]) => (
            <a class="rp-category-tab" href={`#rp-${category}`}>
              <span>{formatDirLabel(category)}</span>
              <strong>{categoryCards.length}</strong>
            </a>
          ))}
        </div>

        <div class="rp-sections">
          {sortedCategories.map(([category, categoryCards]) => (
            <section class="rp-section" id={`rp-${category}`}>
              <div class="rp-section-heading">
                <p class="rp-section-kicker">Category</p>
                <h3>{formatDirLabel(category)}</h3>
              </div>
              <div class="rp-card-grid">{categoryCards.map(renderCard)}</div>
            </section>
          ))}
        </div>
      </section>
    )
  }

  RecentPosts.css = style
  return RecentPosts
}) satisfies QuartzComponentConstructor
