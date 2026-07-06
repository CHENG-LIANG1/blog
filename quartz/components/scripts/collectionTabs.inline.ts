const collectionTabMap = {
  account: "collection-tab-account",
  device: "collection-tab-device",
  game: "collection-tab-game",
  album: "collection-tab-album",
  vinyl: "collection-tab-vinyl",
}

function getCollectionTabFromHash(hash: string) {
  const slug = decodeURIComponent(hash.replace(/^#/, ""))
  if (!slug) return undefined

  if (slug === "collection-account" || slug === "account") return "account"
  if (slug === "collection-device" || slug === "device") return "device"
  if (slug === "collection-game" || slug === "game") return "game"
  if (slug === "collection-album" || slug === "album") return "album"
  if (slug === "collection-vinyl" || slug === "vinyl") return "vinyl"

  const target = document.getElementById(slug)
  const panel = target?.closest(".collection-tab-panel")
  if (panel?.classList.contains("collection-tab-panel-account")) return "account"
  if (panel?.classList.contains("collection-tab-panel-device")) return "device"
  if (panel?.classList.contains("collection-tab-panel-game")) return "game"
  if (panel?.classList.contains("collection-tab-panel-album")) return "album"
  if (panel?.classList.contains("collection-tab-panel-vinyl")) return "vinyl"

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

function setupCollectionCdWall() {
  const wall = document.querySelector<HTMLElement>(".collection-cd-wall")
  const stage = wall?.querySelector<HTMLElement>(".collection-cd-wall-stage")
  if (!wall || !stage || stage.dataset.ready === "true") return

  const covers = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      ".collection-tab-panel-album .collection-album-grid .collection-album-cover",
    ),
  ).filter((cover) => cover.currentSrc || cover.src)

  if (covers.length < 6) {
    wall.hidden = true
    return
  }

  const rowCount = 3
  const rowSize = Math.min(18, Math.max(12, Math.ceil(covers.length / rowCount)))
  const repeatCount = 2

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = document.createElement("div")
    row.className = "collection-cd-wall-row"
    row.style.setProperty("--wall-row", String(rowIndex))
    row.style.setProperty("--wall-duration", `${42 + rowIndex * 8}s`)

    const track = document.createElement("div")
    track.className = "collection-cd-wall-track"

    const rowCovers = Array.from({ length: rowSize }, (_, coverIndex) => {
      const sourceIndex = (coverIndex * rowCount + rowIndex * 5) % covers.length
      return covers[sourceIndex]
    })

    Array.from({ length: repeatCount }).forEach(() => {
      const segment = document.createElement("div")
      segment.className = "collection-cd-wall-segment"

      rowCovers.forEach((sourceCover) => {
        const item = document.createElement("span")
        item.className = "collection-cd-wall-item"

        const img = document.createElement("img")
        img.className = "collection-cd-wall-cover"
        img.src = sourceCover.getAttribute("src") || sourceCover.currentSrc || sourceCover.src
        img.alt = ""
        img.loading = "eager"
        img.decoding = "async"

        const markLoaded = () => {
          item.classList.add("is-loaded")
        }

        if (img.complete && img.naturalWidth > 0) {
          markLoaded()
        } else {
          img.addEventListener("load", markLoaded, { once: true })
        }

        img.addEventListener(
          "error",
          () => {
            item.remove()
          },
          { once: true },
        )

        item.append(img)
        segment.append(item)
      })

      track.append(segment)
    })

    row.append(track)
    stage.append(row)
  }

  stage.dataset.ready = "true"
}

function setupCollectionTabs() {
  const root = document.querySelector(".collection-tabs")
  if (!root) return

  setupCollectionCdWall()

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
