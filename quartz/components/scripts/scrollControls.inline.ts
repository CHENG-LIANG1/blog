document.addEventListener("nav", () => {
  const progressEl = document.querySelector<HTMLElement>(".reading-progress")
  const barEl = document.querySelector<HTMLElement>(".reading-progress-bar")
  const backToTopEl = document.querySelector<HTMLButtonElement>(".back-to-top")
  const articleEl = document.querySelector<HTMLElement>("article")

  if (!progressEl || !barEl || !backToTopEl || !articleEl) return

  const showProgressAfter = 80
  const showBackToTopAfter = 500

  const computeRange = () => {
    const rect = articleEl.getBoundingClientRect()
    const start = rect.top + window.scrollY
    const end = start + articleEl.scrollHeight - window.innerHeight
    return { start, end }
  }

  let raf = 0
  const update = () => {
    raf = 0
    const { start, end } = computeRange()
    const y = window.scrollY

    const denom = end - start
    const raw = denom <= 0 ? 1 : (y - start) / denom
    const progress = Math.max(0, Math.min(1, raw))
    barEl.style.transform = `scaleX(${progress})`

    const showProgress = y > showProgressAfter
    progressEl.classList.toggle("visible", showProgress)

    const showBackToTop = y > showBackToTopAfter
    backToTopEl.classList.toggle("visible", showBackToTop)
  }

  const requestUpdate = () => {
    if (raf) return
    raf = window.requestAnimationFrame(update)
  }

  const onScroll = () => requestUpdate()
  const onResize = () => requestUpdate()

  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize)
  window.addCleanup(() => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onResize)
    if (raf) window.cancelAnimationFrame(raf)
  })

  const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" })
  backToTopEl.addEventListener("click", onClick)
  window.addCleanup(() => backToTopEl.removeEventListener("click", onClick))

  update()
})
