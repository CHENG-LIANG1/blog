import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "梁程 | 梁非凡 Ray",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "vercel",
    },
    locale: "zh-CN",
    baseUrl: "chengliang.vercel.app",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: {
          name: "Inter",
          weights: [400, 500, 600, 700],
          includeItalic: false,
        },
        body: {
          name: "Inter",
          weights: [400, 500, 600],
          includeItalic: true,
        },
        code: {
          name: "JetBrains Mono",
          weights: [400, 500, 600],
          includeItalic: true,
        },
      },
      colors: {
        lightMode: {
          light: "#fbfbf9",
          lightgray: "#e4e4de",
          gray: "#74746c",
          darkgray: "#4a4a45",
          dark: "#1a1a18",
          secondary: "#238a61",
          tertiary: "#1d704f",
          highlight: "rgba(35, 138, 97, 0.1)",
          textHighlight: "rgba(35, 138, 97, 0.18)",
        },
        darkMode: {
          light: "#0b0d10",
          lightgray: "#191c21",
          gray: "#7f8896",
          darkgray: "#c7d0da",
          dark: "#f3f6fb",
          secondary: "#42d392",
          tertiary: "#84e1b8",
          highlight: "rgba(66, 211, 146, 0.11)",
          textHighlight: "rgba(66, 211, 146, 0.18)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "tokyo-night",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.LazyImages(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.AllBlogsPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
