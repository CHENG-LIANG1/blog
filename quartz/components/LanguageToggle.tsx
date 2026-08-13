// @ts-ignore
import languageToggleScript from "./scripts/language-toggle.inline"
import styles from "./styles/language-toggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const LanguageToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div
      class={classNames(displayClass, "language-toggle")}
      role="group"
      aria-label="Language switch"
    >
      <button type="button" class="lang-toggle-btn" data-lang-target="zh" aria-pressed="false">
        中文
      </button>
      <span class="lang-toggle-separator" aria-hidden="true">
        /
      </span>
      <button type="button" class="lang-toggle-btn" data-lang-target="en" aria-pressed="false">
        EN
      </button>
    </div>
  )
}

LanguageToggle.beforeDOMLoaded = languageToggleScript
LanguageToggle.css = styles

export default (() => LanguageToggle) satisfies QuartzComponentConstructor
