import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "梁非凡's blog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "chengliang.vercel.app",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
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
          lightgray: "#e8e8e4",
          gray: "#9b9b94",
          darkgray: "#4a4a45",
          dark: "#1a1a18",
          secondary: "#42b883",
          tertiary: "#2f9f71",
          highlight: "rgba(66, 184, 131, 0.09)",
          textHighlight: "rgba(66, 184, 131, 0.16)",
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
