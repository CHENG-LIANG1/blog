const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      default:
        return "&#39;"
    }
  })

interface RepoRow {
  name: string // owner/repo
  short: string
  head?: string
  branch: string
  date: string
  msg?: string
}

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
    const data = (await res.json()) as { contributions?: Array<{ date: string; count: number; level: number }> }
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
    const list = root.querySelector<HTMLUListElement>(".gh-commits")
    if (!user || !list || list.dataset.loaded === "true") {
      continue
    }

    void renderHeatmap(root, user)

    try {
      const res = await fetch(`https://api.github.com/users/${user}/events/public?per_page=100`)
      if (!res.ok) {
        throw new Error(`GitHub API ${res.status}`)
      }
      const events = (await res.json()) as any[]

      // 收集最近推送过的仓库（去重，按时间倒序）
      const seen = new Set<string>()
      const repos: RepoRow[] = []
      for (const ev of events) {
        if (ev.type !== "PushEvent" || !ev.repo?.name || seen.has(ev.repo.name)) {
          continue
        }
        seen.add(ev.repo.name)
        repos.push({
          name: ev.repo.name,
          short: String(ev.repo.name).split("/").pop() ?? ev.repo.name,
          head: ev.payload?.head,
          branch: String(ev.payload?.ref ?? "").replace("refs/heads/", ""),
          date: ev.created_at,
        })
        if (repos.length >= 5) break
      }

      if (repos.length === 0) {
        root.classList.add("gh-empty")
        list.innerHTML = ""
        continue
      }

      // 尽量补取每个仓库 head 提交的标题（best-effort，失败就退回分支名）
      await Promise.all(
        repos.map(async (r) => {
          if (!r.head) return
          try {
            const cr = await fetch(`https://api.github.com/repos/${r.name}/commits/${r.head}`)
            if (cr.ok) {
              const cj = await cr.json()
              r.msg = String(cj.commit?.message ?? "").split("\n")[0]
            }
          } catch (_e) {
            /* ignore，使用分支名兜底 */
          }
        }),
      )

      list.innerHTML = repos
        .map((r) => {
          const d = new Date(r.date)
          const pad = (n: number) => `${n}`.padStart(2, "0")
          const md = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
          const text = r.msg && r.msg.length > 0 ? r.msg : `更新了 ${r.branch || "main"} 分支`
          const href = r.head
            ? `https://github.com/${r.name}/commit/${r.head}`
            : `https://github.com/${r.name}`
          return `<li class="gh-commit"><a href="${href}" target="_blank" rel="noopener"><span class="gh-commit-repo">${escapeHtml(r.short)}</span><span class="gh-commit-msg">${escapeHtml(text)}</span><span class="gh-commit-date">${md}</span></a></li>`
        })
        .join("")
      list.dataset.loaded = "true"
      root.classList.remove("gh-empty", "gh-error")
    } catch (_e) {
      root.classList.add("gh-error")
      list.innerHTML = `<li class="gh-commit-loading">最近提交暂时加载不出来，<a href="https://github.com/${user}" target="_blank" rel="noopener">去 GitHub 看看 →</a></li>`
    }
  }
}

void loadGithubActivity()
document.addEventListener("nav", () => {
  void loadGithubActivity()
})
