import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ArticleSummary: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const description = fileData.frontmatter?.description
  const slug = fileData.slug ?? ""

  if (
    typeof description !== "string" ||
    description.trim().length === 0 ||
    slug.startsWith("Projects/") ||
    slug.startsWith("Hobbies/")
  ) {
    return null
  }

  return <p class="article-deck">{description.trim()}</p>
}

ArticleSummary.css = `
.article-deck {
  margin: 1rem 0 1.35rem;
  max-width: 62ch;
  color: var(--darkgray);
  font-size: 1.02rem;
  line-height: 1.75;
}
`

export default (() => ArticleSummary) satisfies QuartzComponentConstructor
