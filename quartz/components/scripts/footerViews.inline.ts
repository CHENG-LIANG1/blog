type GoatCounterClient = {
  count?: (data?: { path?: string; title?: string }) => void
  endpoint?: string
  no_onload?: boolean
}

type GoatCounterWindow = Window & {
  goatcounter?: GoatCounterClient
}

const footerSelector = "footer[data-goatcounter-code]"
const scriptSelector = "script[data-footer-goatcounter]"
const goatWindow = window as GoatCounterWindow

let activeCode: string | undefined
let loadingScript: Promise<void> | undefined

const getCode = () => {
  const code = document.querySelector<HTMLElement>(footerSelector)?.dataset.goatcounterCode
  return code && /^[a-z0-9-]+$/.test(code) ? code : undefined
}

const showTotalViews = async (code: string) => {
  const footer = document.querySelector<HTMLElement>(footerSelector)
  const container = document.querySelector<HTMLElement>("[data-site-views]")
  const count = container?.querySelector<HTMLElement>("[data-site-views-count]")
  if (!container || !count) return

  const base = Number.parseInt(footer?.dataset.siteViewsBase ?? "0", 10)
  const safeBase = Number.isSafeInteger(base) && base >= 0 ? base : 0

  try {
    const response = await fetch(`https://${code}.goatcounter.com/counter/TOTAL.json`, {
      credentials: "omit",
      mode: "cors",
    })
    if (!response.ok) return

    const data = (await response.json()) as { count?: unknown }
    const value = typeof data.count === "string" ? data.count.trim() : ""
    if (!/^\d[\d\s,.]*$/.test(value)) return

    const goatCounterViews = Number(value.replace(/[^\d]/g, ""))
    if (!Number.isSafeInteger(goatCounterViews)) return

    count.textContent = (safeBase + goatCounterViews).toLocaleString("en-US")
    container.hidden = false
  } catch {
    // Keep showing the historical baseline when GoatCounter is unavailable or blocked.
  }
}

const loadGoatCounter = (code: string) => {
  if (activeCode === code && goatWindow.goatcounter?.count) {
    return Promise.resolve()
  }

  if (loadingScript) return loadingScript

  const endpoint = `https://${code}.goatcounter.com/count`
  goatWindow.goatcounter = {
    ...goatWindow.goatcounter,
    endpoint,
    no_onload: true,
  }

  loadingScript = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(scriptSelector)
    const goatCounterScript = existing ?? document.createElement("script")

    goatCounterScript.addEventListener(
      "load",
      () => {
        activeCode = code
        if (goatWindow.goatcounter) goatWindow.goatcounter.endpoint = endpoint
        resolve()
      },
      { once: true },
    )
    goatCounterScript.addEventListener(
      "error",
      () => reject(new Error("GoatCounter failed to load")),
      {
        once: true,
      },
    )

    if (!existing) {
      goatCounterScript.src = "https://gc.zgo.at/count.js"
      goatCounterScript.defer = true
      goatCounterScript.dataset.footerGoatcounter = ""
      goatCounterScript.dataset.goatcounter = endpoint
      document.head.appendChild(goatCounterScript)
    }
  }).finally(() => {
    loadingScript = undefined
  })

  return loadingScript
}

document.addEventListener("nav", () => {
  const code = getCode()
  if (!code) return

  void showTotalViews(code)
  void loadGoatCounter(code)
    .then(() => {
      goatWindow.goatcounter?.count?.({ path: location.pathname, title: document.title })
    })
    .catch(() => {
      // Analytics must never interfere with navigation or rendering.
    })
})
