// @ts-ignore
import languageToggleScript from "./scripts/language-toggle.inline"
import styles from "./styles/language-toggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const LanguageToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "language-toggle")} role="group" aria-label="Language switch">
      <button type="button" class="lang-toggle-btn" data-lang-target="zh">
        中文
      </button>
      <button type="button" class="lang-toggle-btn" data-lang-target="en">
        English
      </button>
    </div>
  )
}

LanguageToggle.beforeDOMLoaded = languageToggleScript
LanguageToggle.css = styles

export default (() => LanguageToggle) satisfies QuartzComponentConstructor
