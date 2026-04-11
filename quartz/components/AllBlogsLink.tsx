import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const AllBlogsLink: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "all-blogs-link")}>
      <a href="/tags/">所有博客 / All blogs →</a>
    </div>
  )
}

export default (() => AllBlogsLink) satisfies QuartzComponentConstructor
