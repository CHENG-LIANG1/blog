import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/recentPosts.scss"
import { resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { byDateAndAlphabetical } from "../PageList"
import { getDate } from "../Date"
import { GlobalConfiguration } from "../../cfg"
import { classNames } from "../../util/lang"
import { concatenateResources } from "../../util/resources"

interface AllBlogsContentOptions {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
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

function getPostSegments(slug: string): string[] {
  return slug.split("/").filter((part) => part.length > 0)
}

function getBlogListItem(page: QuartzPluginData) {
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

export default ((opts?: AllBlogsContentOptions) => {
  const AllBlogsContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, fileData, cfg } = props
    const pages = allFiles.filter(isBlogPost)
    const sorter = opts?.sort ?? byDateAndAlphabetical(cfg)
    const items = pages.sort(sorter).map(getBlogListItem)

    return (
      <div class="popover-hint">
        <article>
          <p>共 {items.length} 篇内容。</p>
        </article>
        <div class="page-listing">
          <section class={classNames(undefined, "recent-posts")}>
            <ol class="rp-list">
              {items.map(({ page, category, subcategory }) => {
                const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
                const dateStr = formatDate(cfg, page)
                const description = getDescription(page)

                return (
                  <li class="rp-list-item">
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
        </div>
      </div>
    )
  }

  AllBlogsContent.css = concatenateResources(style)
  return AllBlogsContent
}) satisfies QuartzComponentConstructor
