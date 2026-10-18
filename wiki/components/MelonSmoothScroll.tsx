import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Lenis smooth scrolling, the same library the main site uses (src/components/SmoothScroll.tsx).
// Quartz inlines component scripts without bundling them, so the build script copies
// lenis.min.js and lenis.css out of node_modules into the wiki's static/ folder and
// this script loads them from there.

const MelonSmoothScroll: QuartzComponent = () => null

MelonSmoothScroll.afterDOMLoaded = `
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Find static/ from the stylesheet link, which works at any page depth and base path.
  const sheet = document.querySelector('link[href*="index.css"]')
  const base = sheet ? sheet.href.replace(/index\\.css.*$/, "static/") : "/melon-files/static/"
  const css = document.createElement("link")
  css.rel = "stylesheet"
  css.href = base + "lenis.css"
  document.head.appendChild(css)

  const script = document.createElement("script")
  script.src = base + "lenis.min.js"
  script.onload = () => {
    const lenis = new window.Lenis({ autoRaf: true, anchors: true })
    // Quartz's page router jumps to the top on every navigation; do the same in Lenis
    // so it doesn't glide back up from the old position.
    document.addEventListener("nav", () => lenis.scrollTo(0, { immediate: true }))
  }
  document.head.appendChild(script)
}
`

export default (() => MelonSmoothScroll) satisfies QuartzComponentConstructor
