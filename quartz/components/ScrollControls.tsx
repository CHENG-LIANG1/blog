// @ts-ignore
import scrollControlsScript from "./scripts/scrollControls.inline"
import styles from "./styles/scrollControls.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ScrollControls: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  const label = cfg.locale.startsWith("zh") ? "返回顶部" : "Back to top"

  return (
    <>
      <div class={classNames(displayClass, "reading-progress")} aria-hidden="true">
        <div class="reading-progress-bar" />
      </div>
      <button class={classNames(displayClass, "back-to-top")} type="button" aria-label={label}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5l-7 7 1.4 1.4L11 8.8V19h2V8.8l4.6 4.6L19 12z" />
        </svg>
      </button>
    </>
  )
}

ScrollControls.afterDOMLoaded = scrollControlsScript
ScrollControls.css = styles

export default (() => ScrollControls) satisfies QuartzComponentConstructor
