import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const seoTitle =
      fileData.slug === "index"
        ? "梁程 | 梁非凡 Ray | 前端工程师、Flutter / React 开发者"
        : title
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)
    const seoDescription =
      fileData.slug === "index"
        ? "梁程（梁非凡 Ray / Liang Feifan / Liang Cheng）的个人网站与博客，聚焦前端开发、Flutter、React、TypeScript、独立开发、作品集与英语学习。"
        : description
    const keywords =
      fileData.slug === "index"
        ? "梁程, 梁非凡, 梁非凡 Ray, Ray, Liang Cheng, Liang Feifan, 前端开发工程师, Flutter, React, TypeScript, 独立开发, 个人博客"
        : undefined

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" || fileData.slug === "index"
        ? url.toString()
        : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`
    const canonicalUrl = socialUrl.endsWith("/") ? socialUrl.slice(0, -1) : socialUrl
    const structuredData =
      fileData.slug === "index"
        ? [
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://chengliang.vercel.app/#website",
              name: "梁程 | 梁非凡 Ray",
              alternateName: ["梁非凡", "梁非凡 Ray", "Ray", "Liang Cheng", "Liang Feifan"],
              url: "https://chengliang.vercel.app",
              description: seoDescription,
              inLanguage: ["zh-CN", "en"],
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://chengliang.vercel.app/#person",
              name: "梁程",
              givenName: "程",
              familyName: "梁",
              alternateName: [
                "梁非凡",
                "梁程",
                "梁非凡 Ray",
                "Ray",
                "Liang Cheng",
                "Liang Feifan",
                "CHENG-LIANG1",
              ],
              description: seoDescription,
              jobTitle: "Frontend / Flutter Engineer",
              url: "https://chengliang.vercel.app",
              mainEntityOfPage: "https://chengliang.vercel.app",
              sameAs: [
                "https://github.com/CHENG-LIANG1",
                "https://www.threads.com/@earthboundmother3",
                "https://www.xiaoheihe.cn/bbs/user_profile_share?user_id=85696763823c&h_src=heyboxapp",
                "https://xhslink.com/m/9Sb4uJ0KtIk",
              ],
              email: "mailto:liangcheng2456@163.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nanjing",
                addressCountry: "CN",
              },
              worksFor: {
                "@type": "Organization",
                name: "霸王茶姬",
              },
              knowsAbout: [
                "Flutter",
                "React",
                "TypeScript",
                "SwiftUI",
                "AI-powered development",
                "Frontend engineering",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "@id": "https://chengliang.vercel.app/#profile",
              url: "https://chengliang.vercel.app",
              name: seoTitle,
              description: seoDescription,
              isPartOf: {
                "@id": "https://chengliang.vercel.app/#website",
              },
              about: {
                "@id": "https://chengliang.vercel.app/#person",
              },
              mainEntity: {
                "@id": "https://chengliang.vercel.app/#person",
              },
            },
          ]
        : undefined

    return (
      <head>
        <title>{seoTitle}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="梁程 / 梁非凡 Ray" />
        <meta name="creator" content="梁程 / 梁非凡 Ray" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={seoTitle} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image:alt" content={seoDescription} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={seoDescription} />
        <meta name="generator" content="Quartz" />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
