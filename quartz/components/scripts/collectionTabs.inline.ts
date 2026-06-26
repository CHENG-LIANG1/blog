const collectionTabMap = {
  account: "collection-tab-account",
  device: "collection-tab-device",
  game: "collection-tab-game",
  album: "collection-tab-album",
}

function getCollectionTabFromHash(hash: string) {
  const slug = decodeURIComponent(hash.replace(/^#/, ""))
  if (!slug) return undefined

  if (slug === "collection-account" || slug === "account") return "account"
  if (slug === "collection-device" || slug === "device") return "device"
  if (slug === "collection-game" || slug === "game") return "game"
  if (slug === "collection-album" || slug === "album") return "album"

  const target = document.getElementById(slug)
  const panel = target?.closest(".collection-tab-panel")
  if (panel?.classList.contains("collection-tab-panel-account")) return "account"
  if (panel?.classList.contains("collection-tab-panel-device")) return "device"
  if (panel?.classList.contains("collection-tab-panel-game")) return "game"
  if (panel?.classList.contains("collection-tab-panel-album")) return "album"

  return undefined
}

function selectCollectionTab(tab: keyof typeof collectionTabMap) {
  const input = document.getElementById(collectionTabMap[tab])
  if (input instanceof HTMLInputElement) {
    input.checked = true
  }
}

function scrollToCollectionHash(hash: string) {
  const slug = decodeURIComponent(hash.replace(/^#/, ""))
  const target = slug ? document.getElementById(slug) : undefined
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView())
  }
}

function setupCollectionTabs() {
  const root = document.querySelector(".collection-tabs")
  if (!root) return

  const tabFromHash = getCollectionTabFromHash(window.location.hash)
  if (tabFromHash) {
    selectCollectionTab(tabFromHash)
    scrollToCollectionHash(window.location.hash)
  }

  root.querySelectorAll<HTMLLabelElement>(".collection-tab-label[for]").forEach((label) => {
    const inputId = label.getAttribute("for")
    const tab = Object.entries(collectionTabMap).find(([, id]) => id === inputId)?.[0]
    if (!tab) return

    const onClick = () => {
      window.history.replaceState({}, "", `#collection-${tab}`)
    }

    label.addEventListener("click", onClick)
    window.addCleanup(() => {
      label.removeEventListener("click", onClick)
    })
  })
}

window.addEventListener("hashchange", () => {
  const tabFromHash = getCollectionTabFromHash(window.location.hash)
  if (tabFromHash) {
    selectCollectionTab(tabFromHash)
    scrollToCollectionHash(window.location.hash)
  }
})

document.addEventListener("nav", setupCollectionTabs)
