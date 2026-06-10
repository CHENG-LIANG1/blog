// @ts-ignore
import darkmodeScript from "./scripts/darkmode.inline"
import styles from "./styles/darkmode.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

const Darkmode: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "darkmode")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="dayIcon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-label={i18n(cfg.locale).components.themeToggle.darkMode}
      >
        <title>{i18n(cfg.locale).components.themeToggle.darkMode}</title>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="nightIcon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-label={i18n(cfg.locale).components.themeToggle.lightMode}
      >
        <title>{i18n(cfg.locale).components.themeToggle.lightMode}</title>
        <path d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  )
}

Darkmode.beforeDOMLoaded = darkmodeScript
Darkmode.css = styles

export default (() => Darkmode) satisfies QuartzComponentConstructor
