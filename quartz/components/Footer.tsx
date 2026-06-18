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
        <p class="footer-copyright">
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener"
          >
            CC BY-NC-SA 4.0
          </a>{" "}
          2026-PRESENT © 梁非凡 &amp; Tikkuu
        </p>
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
