// 博客列表交互：折叠分类 + 子目录
(function () {
  const root = document.querySelector(".recent-posts")
  if (!root) return

  // ── 折叠/展开 ──────────────────────────────
  const toggles = root.querySelectorAll<HTMLElement>("[data-rp-toggle]")
  toggles.forEach((el) => {
    el.addEventListener("click", () => {
      const target = root.querySelector(el.dataset.rpToggle ?? "") as HTMLElement | null
      if (!target) return

      const isCollapsed = target.classList.contains("rp-collapsed")
      const chevron = el.querySelector(".rp-chevron") as HTMLElement | null

      if (isCollapsed) {
        target.classList.remove("rp-collapsed")
        target.style.maxHeight = target.scrollHeight + "px"
        chevron?.classList.remove("rp-chevron-collapsed")
        // 动画结束后移除 maxHeight 限制
        setTimeout(() => {
          target.style.maxHeight = ""
        }, 300)
      } else {
        target.style.maxHeight = target.scrollHeight + "px"
        // 强制回流
        target.offsetHeight
        target.classList.add("rp-collapsed")
        target.style.maxHeight = "0"
        chevron?.classList.add("rp-chevron-collapsed")
      }
    })
  })
})()
