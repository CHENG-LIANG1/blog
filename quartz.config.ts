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
    baseUrl: "www.chengliang.pro",
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
          light: "#fbfbfc",
          lightgray: "#e7e8ec",
          gray: "#737783",
          darkgray: "#444750",
          dark: "#17181c",
          secondary: "#2f865f",
          tertiary: "#24704f",
          highlight: "rgba(47, 134, 95, 0.1)",
          textHighlight: "rgba(47, 134, 95, 0.18)",
        },
        darkMode: {
          light: "#050506",
          lightgray: "#17181d",
          gray: "#7d818c",
          darkgray: "#c2c5ce",
          dark: "#f0f1f5",
          secondary: "#42b883",
          tertiary: "#71d6a7",
          highlight: "rgba(66, 184, 131, 0.1)",
          textHighlight: "rgba(66, 184, 131, 0.18)",
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
