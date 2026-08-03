const tocDesktopMedia = window.matchMedia("(min-width: 1200px)")
const tocPreferenceKey = "floating-toc-collapsed"
const tocPositionKey = "floating-toc-position"
const tocViewportMargin = 8

type TocPosition = {
  left: number
  top: number
}

function setTocCollapsed(button: HTMLElement, content: HTMLElement, collapsed: boolean) {
  button.classList.toggle("collapsed", collapsed)
  button.setAttribute("aria-expanded", collapsed ? "false" : "true")
  content.classList.toggle("collapsed", collapsed)
  content.setAttribute("aria-hidden", collapsed ? "true" : "false")
}

function readTocPreference(): boolean | undefined {
  try {
    const preference = window.localStorage.getItem(tocPreferenceKey)
    if (preference === null) return undefined
    return preference === "true"
  } catch {
    return undefined
  }
}

function writeTocPreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(tocPreferenceKey, String(collapsed))
  } catch {
    // Storage can be unavailable in private browsing. The control still works for this page.
  }
}

function readTocPosition(): TocPosition | undefined {
  try {
    const position = window.localStorage.getItem(tocPositionKey)
    if (position === null) return undefined

    const parsed = JSON.parse(position) as Partial<TocPosition>
    if (!Number.isFinite(parsed.left) || !Number.isFinite(parsed.top)) return undefined
    return { left: parsed.left as number, top: parsed.top as number }
  } catch {
    return undefined
  }
}

function writeTocPosition(position: TocPosition) {
  try {
    window.localStorage.setItem(tocPositionKey, JSON.stringify(position))
  } catch {
    // Storage can be unavailable in private browsing. Dragging still works for this page.
  }
}

function clampTocPosition(toc: HTMLElement, position: TocPosition): TocPosition {
  const rect = toc.getBoundingClientRect()
  return {
    left: Math.min(
      Math.max(tocViewportMargin, position.left),
      Math.max(tocViewportMargin, window.innerWidth - rect.width - tocViewportMargin),
    ),
    top: Math.min(
      Math.max(tocViewportMargin, position.top),
      Math.max(tocViewportMargin, window.innerHeight - rect.height - tocViewportMargin),
    ),
  }
}

function setTocPosition(toc: HTMLElement, position: TocPosition) {
  const clamped = clampTocPosition(toc, position)
  toc.style.left = `${clamped.left}px`
  toc.style.top = `${clamped.top}px`
  toc.style.right = "auto"
  toc.style.bottom = "auto"
  return clamped
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const tocElement = toc as HTMLElement
    const button = toc.querySelector<HTMLElement>(".toc-header")
    const content = toc.querySelector<HTMLElement>(".toc-content")
    const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>(".toc-content a"))
    if (!button || !content) continue

    let suppressToggle = false
    let positionSettleTimer: number | undefined
    let dragState:
      | {
          pointerId: number
          startX: number
          startY: number
          startLeft: number
          startTop: number
          dragging: boolean
        }
      | undefined

    const keepTocOnScreen = () => {
      const inlineLeft = Number.parseFloat(tocElement.style.left)
      const inlineTop = Number.parseFloat(tocElement.style.top)
      if (Number.isFinite(inlineLeft) && Number.isFinite(inlineTop)) {
        setTocPosition(tocElement, { left: inlineLeft, top: inlineTop })
      }
    }

    const settleTocPosition = () => {
      window.requestAnimationFrame(keepTocOnScreen)
      if (positionSettleTimer !== undefined) window.clearTimeout(positionSettleTimer)
      positionSettleTimer = window.setTimeout(keepTocOnScreen, 260)
    }

    const defaultCollapsed = tocElement.dataset.defaultCollapsed === "true"
    const applyResponsiveState = () => {
      if (tocDesktopMedia.matches) {
        setTocCollapsed(button, content, readTocPreference() ?? defaultCollapsed)
      } else {
        setTocCollapsed(button, content, true)
      }
      tocElement.classList.add("toc-ready")
      settleTocPosition()
    }

    const toggleToc = () => {
      if (suppressToggle) {
        suppressToggle = false
        return
      }

      const collapsed = button.getAttribute("aria-expanded") === "true"
      setTocCollapsed(button, content, collapsed)
      if (tocDesktopMedia.matches) writeTocPreference(collapsed)
      settleTocPosition()
    }

    const collapseAfterNavigation = () => {
      if (!tocDesktopMedia.matches) setTocCollapsed(button, content, true)
    }

    const startTocDrag = (event: PointerEvent) => {
      if (event.button !== 0) return

      const rect = tocElement.getBoundingClientRect()
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        dragging: false,
      }
      button.setPointerCapture(event.pointerId)
    }

    const moveToc = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return

      const deltaX = event.clientX - dragState.startX
      const deltaY = event.clientY - dragState.startY
      if (!dragState.dragging && Math.hypot(deltaX, deltaY) < 5) return

      dragState.dragging = true
      tocElement.classList.add("is-dragging")
      event.preventDefault()
      setTocPosition(tocElement, {
        left: dragState.startLeft + deltaX,
        top: dragState.startTop + deltaY,
      })
    }

    const finishTocDrag = (event: PointerEvent) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return

      if (dragState.dragging) {
        const rect = tocElement.getBoundingClientRect()
        writeTocPosition({ left: rect.left, top: rect.top })
        suppressToggle = true
        window.setTimeout(() => {
          suppressToggle = false
        }, 0)
      }

      tocElement.classList.remove("is-dragging")
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId)
      dragState = undefined
    }

    applyResponsiveState()
    const savedPosition = readTocPosition()
    if (savedPosition) window.requestAnimationFrame(() => setTocPosition(tocElement, savedPosition))
    button.addEventListener("click", toggleToc)
    button.addEventListener("pointerdown", startTocDrag)
    button.addEventListener("pointermove", moveToc)
    button.addEventListener("pointerup", finishTocDrag)
    button.addEventListener("pointercancel", finishTocDrag)
    links.forEach((link) => link.addEventListener("click", collapseAfterNavigation))
    tocDesktopMedia.addEventListener("change", applyResponsiveState)
    window.addEventListener("resize", keepTocOnScreen)
    window.addCleanup(() => {
      button.removeEventListener("click", toggleToc)
      button.removeEventListener("pointerdown", startTocDrag)
      button.removeEventListener("pointermove", moveToc)
      button.removeEventListener("pointerup", finishTocDrag)
      button.removeEventListener("pointercancel", finishTocDrag)
      links.forEach((link) => link.removeEventListener("click", collapseAfterNavigation))
      tocDesktopMedia.removeEventListener("change", applyResponsiveState)
      window.removeEventListener("resize", keepTocOnScreen)
      if (positionSettleTimer !== undefined) window.clearTimeout(positionSettleTimer)
    })
  }
}

function updateCurrentTocEntry() {
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  if (headers.length === 0) return

  const offset = 120
  let currentHeader: Element | null = null

  for (const header of headers) {
    const rect = header.getBoundingClientRect()
    if (rect.top <= offset) {
      currentHeader = header
    } else {
      break
    }
  }

  if (!currentHeader && headers.length > 0) {
    currentHeader = headers[0]
  }

  if (!currentHeader) return

  for (const toc of document.querySelectorAll<HTMLElement>(".toc")) {
    const content = toc.querySelector<HTMLElement>(".toc-content")
    const links = Array.from(
      toc.querySelectorAll<HTMLAnchorElement>(".toc-content.overflow > li > a"),
    )
    if (!content || links.length === 0) continue

    let activeIndex = links.findIndex((link) => link.dataset.for === currentHeader.id)
    if (activeIndex < 0) activeIndex = 0

    links.forEach((link, index) => link.classList.toggle("in-view", index === activeIndex))

    const activeLink = links[activeIndex]
    if (toc.dataset.activeSlug === activeLink.dataset.for) continue
    toc.dataset.activeSlug = activeLink.dataset.for ?? ""

    const linkTop = activeLink.offsetTop
    const linkBottom = linkTop + activeLink.offsetHeight
    const visibleTop = content.scrollTop
    const visibleBottom = visibleTop + content.clientHeight
    if (linkTop < visibleTop || linkBottom > visibleBottom) {
      content.scrollTo({
        top: Math.max(0, linkTop - content.clientHeight / 2),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      })
    }
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
