// 主题自适应热力图：拉取贡献数据，用 CSS 变量上色（跟随明暗主题）
const renderHeatmap = async (root: HTMLElement, user: string) => {
  const grid = root.querySelector<HTMLElement>(".gh-heatmap-grid")
  if (!grid || grid.dataset.loaded === "true") {
    return
  }

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
    if (!res.ok) {
      throw new Error(`contrib ${res.status}`)
    }
    const data = (await res.json()) as {
      contributions?: Array<{ date: string; count: number; level: number }>
    }
    const days = Array.isArray(data.contributions) ? data.contributions : []
    if (days.length === 0) {
      throw new Error("contrib empty")
    }

    // 只保留最近约 53 周
    const recent = days.slice(-371)
    const firstWeekday = new Date(`${recent[0].date}T00:00:00Z`).getUTCDay()

    let html = ""
    for (let i = 0; i < firstWeekday; i++) {
      html += `<span class="gh-cell gh-cell-empty"></span>`
    }
    for (const d of recent) {
      const lvl = Number(d.level) || 0
      html += `<span class="gh-cell" data-level="${lvl}" title="${d.date}：${d.count} 次贡献"></span>`
    }

    grid.innerHTML = html
    grid.dataset.loaded = "true"
  } catch (_e) {
    // 兜底：退回 ghchart 图片（非主题自适应，但至少能显示）
    grid.innerHTML = `<img class="gh-heatmap-fallback" src="https://ghchart.rshah.org/6aab8a/${user}" alt="${user} 的 GitHub 贡献热力图" loading="lazy" />`
    grid.dataset.loaded = "true"
  }
}

const loadGithubActivity = async () => {
  const roots = document.querySelectorAll<HTMLElement>(".github-activity")
  for (const root of Array.from(roots)) {
    const user = root.dataset.user
    const grid = root.querySelector<HTMLElement>(".gh-heatmap-grid")
    if (!user || !grid) {
      continue
    }

    if (grid.dataset.loaded !== "true") {
      await renderHeatmap(root, user)
    }
  }
}

void loadGithubActivity()
document.addEventListener("nav", () => {
  void loadGithubActivity()
})
