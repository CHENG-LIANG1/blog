import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import styles from "./styles/topTabs.scss"

type TabKey = "blog" | "projects" | "album" | "collections"

const TABS: Array<{ key: TabKey; label: string; labelEn: string; href: string }> = [
  { key: "blog", label: "博客", labelEn: "Blog", href: "/blog" },
  { key: "projects", label: "项目", labelEn: "Projects", href: "/Projects/" },
  { key: "album", label: "相册", labelEn: "Photos", href: "/album" },
  { key: "collections", label: "收藏", labelEn: "Stuff", href: "/collections" },
]

const SOCIALS: Array<{ label: string; href: string; icon: preact.JSX.Element }> = [
  {
    label: "GitHub",
    href: "https://github.com/CHENG-LIANG1",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5C5.73.5.6 5.63.6 11.9c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55v-2.1c-3.17.69-3.84-1.34-3.84-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.2-1.27-5.2-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.38-2.67 5.35-5.21 5.63.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55 4.51-1.5 7.77-5.76 7.77-10.78C23.4 5.63 18.27.5 12 .5z"
        />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@earthboundmother3",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.7 11.2c-.1 0-.2-.1-.3-.1-.2-3.2-1.9-5-4.8-5-1.7 0-3.2.7-4 2l1.6 1.1c.6-1 1.6-1.2 2.4-1.2 1 0 1.8.3 2.3.9.4.4.6 1 .7 1.7-.8-.1-1.6-.2-2.5-.1-2.6.1-4.2 1.6-4.1 3.7 0 1 .6 1.9 1.5 2.5.8.5 1.7.7 2.8.7 1.4-.1 2.4-.6 3.2-1.5.6-.7 1-1.6 1.1-2.8.7.4 1.2 1 1.5 1.7.5 1.1.5 3-1 4.5-1.3 1.3-2.9 1.9-5.2 1.9-2.6 0-4.5-.8-5.8-2.4C5 17.1 4.4 15 4.3 12.4c.1-2.6.7-4.7 1.9-6.2C7.5 4.6 9.4 3.8 12 3.8c2.6 0 4.5.8 5.9 2.4 1 .9 1.6 2 1.9 3.2l2-.5c-.4-1.6-1.2-3-2.4-4.1C17.6 2.7 15.1 1.8 12 1.8 9 1.8 6.4 2.7 4.7 4.6 3.1 6.4 2.3 8.9 2.3 12v.1c0 3.1.8 5.6 2.4 7.4 1.7 1.9 4.3 2.8 7.3 2.8 2.7 0 4.7-.7 6.4-2.4 2.2-2.2 2.1-5 1.4-6.7-.5-1.2-1.5-2.2-2.8-2.9-.4-.4-.7-.6-.7-.6zm-4.5 5.9c-1.2.1-2.5-.5-2.5-1.5-.1-.8.5-1.6 2.3-1.7h.6c.6 0 1.2.1 1.7.2-.2 2.3-1.3 2.7-2.1 2.8z"
        />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:liangcheng2456@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 6.5h18v11H3zM3.5 7l8.5 6 8.5-6"
        />
      </svg>
    ),
  },
]

const TopTabs: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  let active: TabKey | null = null
  if (slug === "blog") {
    active = "blog"
  } else if (slug === "Projects/index" || slug === "projects" || slug.startsWith("Projects/")) {
    active = "projects"
  } else if (slug === "album") {
    active = "album"
  } else if (slug === "collections") {
    active = "collections"
  } else if (slug !== "index") {
    active = "blog"
  }

  return (
    <nav class={classNames(displayClass, "top-tabs")} aria-label="Primary">
      <a class="top-tabs-brand" href="/" aria-label="梁程 / Liang Cheng">
        <span class="top-tabs-brand-mark" aria-hidden="true">
          LC
        </span>
      </a>
      <div class="top-tabs-links">
        {TABS.map((t) => (
          <a
            class={t.key === active ? "top-tab active" : "top-tab"}
            href={t.href}
            data-tab-key={t.key}
            aria-current={t.key === active ? "page" : undefined}
          >
            <span class="top-tab-label top-tab-label-zh" lang="zh">
              {t.label}
            </span>
            <span class="top-tab-label top-tab-label-en" lang="en">
              {t.labelEn}
            </span>
          </a>
        ))}
      </div>
      <div class="top-tabs-socials">
        {SOCIALS.map((s) => (
          <a
            class="top-tabs-social"
            href={s.href}
            target="_blank"
            rel="noopener"
            aria-label={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </nav>
  )
}

TopTabs.css = styles

export default (() => TopTabs) satisfies QuartzComponentConstructor
