import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { concatenateResources } from "../../util/resources"

interface AllBlogsContentOptions {
  sort?: SortFn
}

export default ((opts?: AllBlogsContentOptions) => {
  const AllBlogsContent: QuartzComponent = (props: QuartzComponentProps) => {
    const pages = props.allFiles.filter((file) => {
      const slug = file.slug
      return slug && slug !== "index" && !slug.startsWith("tags/") && !slug.endsWith("/index")
    })

    const listProps = {
      ...props,
      allFiles: pages,
    }

    return (
      <div class="popover-hint">
        <article>
          <p>共 {pages.length} 篇内容。</p>
        </article>
        <div class="page-listing">
          <PageList {...listProps} sort={opts?.sort} />
        </div>
      </div>
    )
  }

  AllBlogsContent.css = concatenateResources(style, PageList.css)
  return AllBlogsContent
}) satisfies QuartzComponentConstructor
