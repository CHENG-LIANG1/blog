// 博客列表交互：基于 data-rp-toggle 折叠任意目录层级
;(function () {
  const root = document.querySelector(".recent-posts")
  if (!root) return

  const transitionMs = 300

  const setChevronState = (toggle: HTMLElement, isCollapsed: boolean) => {
    const chevron = toggle.querySelector(".rp-chevron") as HTMLElement | null
    chevron?.classList.toggle("rp-chevron-collapsed", isCollapsed)
    toggle.setAttribute("aria-expanded", String(!isCollapsed))
  }

  const syncOpenAncestors = (target: HTMLElement) => {
    let parent = target.parentElement?.closest<HTMLElement>(".rp-category-body, .rp-dir-body")
    while (parent) {
      if (!parent.classList.contains("rp-collapsed")) {
        parent.style.maxHeight = parent.scrollHeight + "px"
      }
      parent = parent.parentElement?.closest<HTMLElement>(".rp-category-body, .rp-dir-body") ?? null
    }
  }

  const toggles = root.querySelectorAll<HTMLElement>("[data-rp-toggle]")
  toggles.forEach((toggle) => {
    const target = root.querySelector(toggle.dataset.rpToggle ?? "") as HTMLElement | null
    if (!target) return

    setChevronState(toggle, target.classList.contains("rp-collapsed"))

    toggle.addEventListener("click", () => {
      const isCollapsed = target.classList.contains("rp-collapsed")

      if (isCollapsed) {
        target.classList.remove("rp-collapsed")
        target.style.maxHeight = target.scrollHeight + "px"
        setChevronState(toggle, false)
        syncOpenAncestors(target)

        window.setTimeout(() => {
          target.style.maxHeight = ""
          syncOpenAncestors(target)
        }, transitionMs)
      } else {
        target.style.maxHeight = target.scrollHeight + "px"
        target.offsetHeight
        target.classList.add("rp-collapsed")
        target.style.maxHeight = "0"
        setChevronState(toggle, true)
        syncOpenAncestors(target)
      }
    })
  })
})()
