function setupImgSkeleton() {
  const imgs = document.querySelectorAll<HTMLImageElement>("article img, .collection-tabs img, figure img")

  imgs.forEach((img) => {
    if (img.dataset.skelDone) return
    img.dataset.skelDone = "true"

    if (img.complete && img.naturalWidth > 0) return

    img.classList.add("img-skeleton")

    const onDone = () => {
      img.classList.remove("img-skeleton")
      img.classList.add("img-skeleton-loaded")
      img.removeEventListener("load", onDone)
      img.removeEventListener("error", onDone)
    }

    img.addEventListener("load", onDone)
    img.addEventListener("error", onDone)
  })
}

document.addEventListener("nav", setupImgSkeleton)
