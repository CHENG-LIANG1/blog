import { byDateAndAlphabetical } from "./PageList"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import style from "./styles/postNavigation.scss"

const isBlogPost = (slug: string): boolean =>
  slug !== "index" &&
  slug !== "blog" &&
  slug !== "album" &&
  slug !== "collections" &&
  !slug.startsWith("Projects/") &&
  !slug.startsWith("Hobbies/") &&
  !slug.startsWith("tags/") &&
  !slug.endsWith("/index") &&
  !slug.includes("术语库")

const PostNavigation: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const currentSlug = fileData.slug
  if (!currentSlug || !isBlogPost(currentSlug)) return null

  const posts = allFiles
    .filter((page) => isBlogPost(page.slug ?? ""))
    .sort(byDateAndAlphabetical(cfg))
  const currentIndex = posts.findIndex((page) => page.slug === currentSlug)
  if (currentIndex < 0) return null

  const newer = currentIndex > 0 ? posts[currentIndex - 1] : undefined
  const older = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined
  if (!newer && !older) return null

  const renderLink = (page: (typeof posts)[number] | undefined, label: string) => {
    if (!page?.slug) return <span class="post-nav-spacer" />
    const title = (page.frontmatter?.title as string | undefined) ?? "无标题"
    return (
      <a class="post-nav-link" href={resolveRelative(currentSlug, page.slug)}>
        <span class="post-nav-label">{label}</span>
        <strong>{title}</strong>
      </a>
    )
  }

  return (
    <nav class="post-navigation" aria-label="相邻文章">
      {renderLink(newer, "上一篇")}
      {renderLink(older, "下一篇")}
    </nav>
  )
}

PostNavigation.css = style

export default (() => PostNavigation) satisfies QuartzComponentConstructor
