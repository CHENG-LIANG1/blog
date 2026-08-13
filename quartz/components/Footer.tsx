import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    return (
      <footer class={`${displayClass ?? ""}`}>
        <div class="footer-frame">
          <p class="footer-copyright">
            <span class="footer-copyright-meta">2026—PRESENT</span>
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
  return Footer
}) satisfies QuartzComponentConstructor
