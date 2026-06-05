import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { AllBlogsContent } from "../../components"
import { write } from "./helpers"
import { StaticResources } from "../../util/resources"
import { BuildCtx } from "../../util/ctx"
import { QuartzPluginData, defaultProcessedContent } from "../vfile"

interface AllBlogsPageOptions extends FullPageLayout {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

async function processAllBlogsPage(
  ctx: BuildCtx,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const slug = "all-blogs/index" as FullSlug
  const [tree, file] = defaultProcessedContent({
    slug,
    frontmatter: {
      title: "所有博客 / All blogs",
      tags: [],
    },
  })
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData: file.data,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  const content = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({
    ctx,
    content,
    slug,
    ext: ".html",
  })
}

export const AllBlogsPage: QuartzEmitterPlugin<Partial<AllBlogsPageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: AllBlogsContent({ sort: userOpts?.sort }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "AllBlogsPage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      yield processAllBlogsPage(ctx, allFiles, opts, resources)
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      if (changeEvents.length === 0) return

      const allFiles = content.map((c) => c[1].data)
      yield processAllBlogsPage(ctx, allFiles, opts, resources)
    },
  }
}
