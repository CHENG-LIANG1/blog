const setupHomeLinks = () => {
  if (document.body.dataset.slug !== "index") {
    return
  }

  const links = document.querySelectorAll<HTMLAnchorElement>("a[href]")
  for (const link of links) {
    link.target = "_blank"

    const rel = new Set((link.rel || "").split(/\s+/).filter(Boolean))
    rel.add("noopener")
    rel.add("noreferrer")
    link.rel = Array.from(rel).join(" ")
  }
}

document.addEventListener("nav", setupHomeLinks)
