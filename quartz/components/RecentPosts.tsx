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

// 博客文章：排除首页 / 各 hub 页 / 标签页 / 文件夹首页，以及相册（Hobbies）和项目（Projects）内容
const isBlogPost = (f: QuartzPluginData): boolean => {
  const slug = f.slug ?? ""
  return (
    slug !== "index" &&
    slug !== "blog" &&
    slug !== "album" &&
    slug !== "gear" &&
    !slug.startsWith("tags/") &&
    !slug.endsWith("/index") &&
    !slug.startsWith("Hobbies/") &&
    !slug.startsWith("Projects/") &&
    !slug.includes("术语库")
  )
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 100,
  filter: isBlogPost,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentPosts: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort).slice(0, opts.limit)

    // 按年份分组（保持已排序的倒序）
    const groups: Array<{ year: string; posts: QuartzPluginData[] }> = []
    for (const page of pages) {
      const date = getDate(cfg, page)
      const year = date ? `${date.getFullYear()}` : "更早"
      let group = groups.find((g) => g.year === year)
      if (!group) {
        group = { year, posts: [] }
        groups.push(group)
      }
      group.posts.push(page)
    }

    return (
      <section class={classNames(displayClass, "recent-posts")}>
        {opts.title && <h2 class="recent-posts-title">{opts.title}</h2>}
        {groups.map((group) => (
          <div class="post-year-group">
            <div class="post-year">{group.year}</div>
            <div class="post-year-list">
              {group.posts.map((page) => {
                const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
                const date = getDate(cfg, page)
                const md = date
                  ? `${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`
                  : ""
                return (
                  <a class="post-row" href={resolveRelative(fileData.slug!, page.slug!)}>
                    <span class="post-row-title">{title}</span>
                    <span class="post-row-dots" aria-hidden="true"></span>
                    {md && <span class="post-row-date">{md}</span>}
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    )
  }

  RecentPosts.css = style
  return RecentPosts
}) satisfies QuartzComponentConstructor
