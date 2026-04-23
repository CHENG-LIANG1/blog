type PreferredLanguage = "zh" | "en"

const STORAGE_KEY = "preferred-language"
const EN_TOC_IDS = new Set(["app-store-apps", "other-projects", "stack", "vibe-coding", "find-me-on"])
const ZH_TOC_IDS = new Set(["app-store-上架应用", "其他项目", "技术栈", "ai-驱动开发", "联系我"])

const isPreferredLanguage = (lang: string | null): lang is PreferredLanguage =>
  lang === "zh" || lang === "en"

const getPreferredLanguage = (): PreferredLanguage => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isPreferredLanguage(stored)) {
    return stored
  }

  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"
}

const toggleTocByLanguage = (lang: PreferredLanguage) => {
  const tocLinks = document.querySelectorAll<HTMLAnchorElement>(".toc-content a[data-for]")
  if (tocLinks.length === 0) {
    return
  }

  for (const link of tocLinks) {
    const targetId = link.dataset.for
    const wrapper = link.closest("li")
    if (!targetId || !wrapper) {
      continue
    }
    const wrapperElement = wrapper as HTMLElement

    if (lang === "en" && ZH_TOC_IDS.has(targetId)) {
      wrapperElement.style.display = "none"
      continue
    }

    if (lang === "zh" && EN_TOC_IDS.has(targetId)) {
      wrapperElement.style.display = "none"
      continue
    }

    wrapperElement.style.display = ""
  }
}

const applyLanguageToIndexContent = (lang: PreferredLanguage) => {
  const article = document.querySelector<HTMLElement>('body[data-slug="index"] article')
  if (!article) {
    return
  }

  const firstSplit = article.querySelector<HTMLElement>('hr[data-lang-split="en-zh"]')
  const secondSplit = article.querySelector<HTMLElement>('hr[data-lang-split="zh-rest"]')
  const thirdSplit = article.querySelector<HTMLElement>('hr[data-lang-split="en-rest-zh-rest"]')
  if (!firstSplit || !secondSplit) {
    return
  }

  const blocks = Array.from(article.children)
  const firstIndex = blocks.indexOf(firstSplit)
  const secondIndex = blocks.indexOf(secondSplit)
  if (firstIndex === -1 || secondIndex === -1 || firstIndex >= secondIndex) {
    return
  }

  // If the third split is not present, fallback to the old 2-zone + shared-content behavior.
  if (!thirdSplit) {
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index] as HTMLElement

      if (index === firstIndex) {
        block.style.display = "none"
        continue
      }

      if (index < firstIndex) {
        block.style.display = lang === "en" ? "" : "none"
        continue
      }

      if (index > firstIndex && index < secondIndex) {
        block.style.display = lang === "zh" ? "" : "none"
        continue
      }

      block.style.display = ""
    }
    return
  }

  const thirdIndex = blocks.indexOf(thirdSplit)
  if (thirdIndex === -1 || secondIndex >= thirdIndex) {
    return
  }

  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index] as HTMLElement

    if (index === firstIndex || index === secondIndex || index === thirdIndex) {
      block.style.display = "none"
      continue
    }

    if (index < firstIndex) {
      block.style.display = lang === "en" ? "" : "none"
      continue
    }

    if (index > firstIndex && index < secondIndex) {
      block.style.display = lang === "zh" ? "" : "none"
      continue
    }

    if (index > secondIndex && index < thirdIndex) {
      block.style.display = lang === "en" ? "" : "none"
      continue
    }

    if (index > thirdIndex) {
      block.style.display = lang === "zh" ? "" : "none"
      continue
    }

    block.style.display = ""
  }
}

const syncLanguageButtons = (lang: PreferredLanguage) => {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>(".lang-toggle-btn")
  for (const button of toggleButtons) {
    const isActive = button.dataset.langTarget === lang
    button.classList.toggle("active", isActive)
  }
}

const applyLanguage = (lang: PreferredLanguage) => {
  document.documentElement.setAttribute("data-language", lang)
  applyLanguageToIndexContent(lang)
  toggleTocByLanguage(lang)
  syncLanguageButtons(lang)
}

applyLanguage(getPreferredLanguage())
document.addEventListener("DOMContentLoaded", () => applyLanguage(getPreferredLanguage()))

document.addEventListener("nav", () => {
  const current = getPreferredLanguage()
  applyLanguage(current)

  const toggleButtons = document.querySelectorAll<HTMLButtonElement>(".lang-toggle-btn")
  if (toggleButtons.length === 0) {
    return
  }

  const onClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const targetLang = button.dataset.langTarget
    if (!isPreferredLanguage(targetLang)) {
      return
    }

    localStorage.setItem(STORAGE_KEY, targetLang)
    applyLanguage(targetLang)
  }

  for (const button of toggleButtons) {
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  }
})
