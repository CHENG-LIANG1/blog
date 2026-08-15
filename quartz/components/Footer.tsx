import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
// @ts-ignore
import script from "./scripts/footerViews.inline"

interface Options {
  goatCounterCode?: string
  siteViewsBase?: number
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const goatCounterCode = opts?.goatCounterCode?.trim().toLowerCase()
  const showSiteViews = goatCounterCode !== undefined && /^[a-z0-9-]+$/.test(goatCounterCode)
  const siteViewsBase =
    Number.isSafeInteger(opts?.siteViewsBase) && (opts?.siteViewsBase ?? 0) >= 0
      ? (opts?.siteViewsBase ?? 0)
      : 0

  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    return (
      <footer
        class={`${displayClass ?? ""}`}
        data-goatcounter-code={showSiteViews ? goatCounterCode : undefined}
        data-site-views-base={showSiteViews ? siteViewsBase : undefined}
      >
        <div class="footer-frame">
          <p class="footer-copyright">
            <span class="footer-copyright-meta">2026—PRESENT</span>
            {showSiteViews && (
              <>
                <span class="footer-copyright-divider" aria-hidden="true">
                  ·
                </span>
                <span class="footer-site-views" data-site-views aria-live="polite">
                  <span data-site-views-count>{siteViewsBase.toLocaleString("en-US")}</span> VIEWS
                </span>
              </>
            )}
          </p>
          <a class="footer-signature" href="/" aria-label="Liang Cheng, Nanjing, China">
            <span class="footer-signature-mark" aria-hidden="true">
              LC
            </span>
            <span class="footer-signature-copy">
              <strong>Liang Cheng</strong>
              <small>Nanjing · CN</small>
            </span>
          </a>
        </div>
        <ul>
          {Object.entries(links).map(([name, href]) => (
            <li>
              <a href={href} target="_blank" rel="noopener">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  Footer.afterDOMLoaded = script
  return Footer
}) satisfies QuartzComponentConstructor
