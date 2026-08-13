type PreferredLanguage = "zh" | "en"

const LANG_STORAGE_KEY = "preferred-language"
const LANGUAGE_FEEDBACK_CLASS = "is-language-switching"
let languageFeedbackTimer: number | undefined
const EN_TOC_IDS = new Set([
  "app-store-apps",
  "other-projects",
  "stack",
  "vibe-coding",
  "find-me-on",
])
const ZH_TOC_IDS = new Set(["app-store-上架应用", "其他项目", "技术栈", "ai-驱动开发", "联系我"])

const isPreferredLanguage = (lang: string | null | undefined): lang is PreferredLanguage =>
  lang === "zh" || lang === "en"

const getPreferredLanguage = (): PreferredLanguage => {
  const stored = localStorage.getItem(LANG_STORAGE_KEY)
  if (isPreferredLanguage(stored)) {
    return stored
  }

  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"
}

// 在 DOM 构建前尽早设置 data-language，配合 CSS 隐藏对应语言内容，避免 CLS
const setDocumentLanguage = (lang: PreferredLanguage) => {
  document.documentElement.setAttribute("data-language", lang)
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en"
}

const initialLang = getPreferredLanguage()
setDocumentLanguage(initialLang)

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

const applyLanguageToSplitContent = (lang: PreferredLanguage) => {
  const article = document.querySelector<HTMLElement>("article")
  if (!article) {
    return
  }

  const firstSplit = article.querySelector<HTMLElement>('hr[data-lang-split="en-zh"]')
  const secondSplit = article.querySelector<HTMLElement>('hr[data-lang-split="zh-rest"]')
  const thirdSplit = article.querySelector<HTMLElement>('hr[data-lang-split="en-rest-zh-rest"]')
  if (!firstSplit) {
    return
  }

  const blocks = Array.from(article.children)
  const firstIndex = blocks.indexOf(firstSplit)
  if (firstIndex === -1) {
    return
  }

  if (!secondSplit) {
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

      block.style.display = lang === "zh" ? "" : "none"
    }
    return
  }

  const secondIndex = blocks.indexOf(secondSplit)
  if (secondIndex === -1 || firstIndex >= secondIndex) {
    return
  }

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
    button.setAttribute("aria-pressed", String(isActive))
  }
}

const triggerLanguageFeedback = () => {
  const root = document.documentElement
  root.classList.remove(LANGUAGE_FEEDBACK_CLASS)
  void root.offsetWidth
  root.classList.add(LANGUAGE_FEEDBACK_CLASS)

  if (languageFeedbackTimer !== undefined) {
    window.clearTimeout(languageFeedbackTimer)
  }

  languageFeedbackTimer = window.setTimeout(() => {
    root.classList.remove(LANGUAGE_FEEDBACK_CLASS)
    languageFeedbackTimer = undefined
  }, 240)
}

const applyLanguage = (lang: PreferredLanguage) => {
  setDocumentLanguage(lang)
  applyLanguageToSplitContent(lang)
  toggleTocByLanguage(lang)
  syncLanguageButtons(lang)
}

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

    if (document.documentElement.getAttribute("data-language") === targetLang) {
      return
    }

    localStorage.setItem(LANG_STORAGE_KEY, targetLang)
    applyLanguage(targetLang)
    triggerLanguageFeedback()
  }

  for (const button of toggleButtons) {
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  }
})
