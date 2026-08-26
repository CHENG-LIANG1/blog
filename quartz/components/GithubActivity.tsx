import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/github.inline"
// @ts-ignore
import styles from "./styles/githubActivity.scss"

interface Options {
  username: string
  title: string
  titleEn: string
}

const defaultOptions: Options = {
  username: "CHENG-LIANG1",
  title: "GitHub 活动",
  titleEn: "GitHub activity",
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const GithubActivity: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <section class={classNames(displayClass, "github-activity")} data-user={opts.username}>
        <div class="gh-head">
          <h2 class="gh-title">
            <span lang="zh">{opts.title}</span>
            <span lang="en">{opts.titleEn}</span>
          </h2>
          <a
            class="gh-profile-link"
            href={`https://github.com/${opts.username}`}
            target="_blank"
            rel="noopener"
          >
            @{opts.username}
          </a>
        </div>
        <a
          class="gh-heatmap"
          href={`https://github.com/${opts.username}`}
          target="_blank"
          rel="noopener"
          aria-label="GitHub contribution graph"
        >
          <div class="gh-heatmap-grid" data-loaded="false">
            <span class="gh-heatmap-loading">加载贡献热力图…</span>
          </div>
        </a>
      </section>
    )
  }

  GithubActivity.afterDOMLoaded = script
  GithubActivity.css = styles
  return GithubActivity
}) satisfies QuartzComponentConstructor
