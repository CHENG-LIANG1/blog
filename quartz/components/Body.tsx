// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import collectionTabsScript from "./scripts/collectionTabs.inline"
import clipboardStyle from "./styles/clipboard.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = concatenateResources(clipboardScript, collectionTabsScript)
Body.css = clipboardStyle

export default (() => Body) satisfies QuartzComponentConstructor
