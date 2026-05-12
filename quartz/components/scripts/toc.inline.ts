function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

// 只高亮当前正在阅读的标题（最靠近视口顶部偏移线的标题）
function updateCurrentTocEntry() {
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  const tocLinks = document.querySelectorAll(".toc-content.overflow > li > a")

  // 清除所有 in-view
  tocLinks.forEach((link) => link.classList.remove("in-view"))

  if (headers.length === 0) return

  const offset = 120 // 视口顶部往下 120px 作为当前阅读位置线

  let currentHeader: Element | null = null

  // 找到最后一个在 offset 线之上的标题（即最接近当前阅读位置的）
  for (const header of headers) {
    const rect = header.getBoundingClientRect()
    if (rect.top <= offset) {
      currentHeader = header
    } else {
      break
    }
  }

  // 如果没有任何标题滚到 offset 线之上，默认取第一个
  if (!currentHeader && headers.length > 0) {
    currentHeader = headers[0]
  }

  if (currentHeader) {
    const slug = currentHeader.id
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    tocEntryElements.forEach((el) => el.classList.add("in-view"))
  }
}

let ticking = false
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateCurrentTocEntry()
      ticking = false
    })
    ticking = true
  }
}

document.addEventListener("nav", () => {
  setupToc()
  updateCurrentTocEntry()

  window.addEventListener("scroll", onScroll)
  window.addCleanup(() => window.removeEventListener("scroll", onScroll))
})
