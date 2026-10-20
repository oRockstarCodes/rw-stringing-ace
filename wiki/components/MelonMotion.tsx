import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Page-to-page motion: replays the press-in of the course code (or the home stamp) on
// every (SPA) navigation and draws a reading-progress bar along the top of the window.
// The animations themselves live in wiki/custom.scss.
//
// It also carries the list of courses that have labs (data-labs="ece/courses/pcs-224,ece/courses/ele-302"),
// which the sidebar reads to add a "Lab reports" item under those courses
// (see the Explorer mapFn in quartz.layout.ts).

const MelonMotion: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  const coursesWithLabs = allFiles
    .filter((f) => f.melonLabs?.length && /^[^/]+\/courses\/[^/]+\/index$/.test(f.slug ?? ""))
    .map((f) => f.slug!.replace(/\/index$/, ""))
  return (
    <>
      <div
        class="melon-progress"
        id="melon-data"
        data-labs={coursesWithLabs.join(",")}
        aria-hidden="true"
      ></div>
      {/* The narrow widths of Archivo, for course codes and headings. Quartz's own font
          link (in <head>) only loads its normal width. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap"
      />
      {/* Roughens the edges of large type so it looks carved and printed, like the site
          icon. Used by the home title and the course codes (filter: url(#melon-carve)). */}
      <svg class="melon-defs" aria-hidden="true" focusable="false">
        <filter id="melon-carve" x="-2%" y="-5%" width="104%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
      </svg>
    </>
  )
}

MelonMotion.afterDOMLoaded = `
let firstNav = true
let alt = false

// GSAP is loaded on demand from static/ (copied there by scripts/build-wiki.sh), the same
// way Lenis is. Until it arrives, melonGsap stays null and pages just skip the extra motion.
let melonGsap = null
let melonGsapFirst = true
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const sheet = document.querySelector('link[href*="index.css"]')
  const base = sheet ? sheet.href.split("index.css")[0] + "static/" : "/melon-files/static/"
  const tag = document.createElement("script")
  tag.src = base + "gsap.min.js"
  tag.onload = () => (melonGsap = window.gsap)
  document.head.appendChild(tag)
}

document.addEventListener("nav", () => {
  // Page transition: after the first page, the title and the first screenful of the page
  // body slide up and fade in one after another. (The first load already has the CSS entrance.)
  if (melonGsapFirst) melonGsapFirst = false
  else if (melonGsap && !document.hidden) {
    const blocks = [...document.querySelectorAll(".center .article-title, .center article > *")]
      .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
      .slice(0, 14)
    if (blocks.length)
      melonGsap.fromTo(
        blocks,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.045, clearProps: "opacity,transform", overwrite: "auto" },
      )
  }

  // The entrance plays on its own on first load. After that, alternating this class
  // swaps to an identical keyframe name, which makes the browser replay it. (State is
  // kept here because the SPA router resets .center's classes on navigation.)
  const center = document.querySelector(".center")
  if (center && !firstNav) {
    alt = !alt
    center.classList.toggle("melon-enter", alt)
  }
  firstNav = false

  // The ECE Edition's tab icon is its green print (static/icon-ece.png)
  const fav = document.querySelector('link[rel="icon"]')
  if (fav) {
    // (the full URL, since a relative one would be read against the page navigated to)
    if (!fav.dataset.melon) fav.dataset.melon = fav.href
    const ece = (document.body.dataset.slug || "").startsWith("ece/")
    fav.href = ece ? fav.dataset.melon.replace("icon.png", "icon-ece.png") : fav.dataset.melon
  }

  // Quartz fills the sidebar tree asynchronously and never clears it first, so if its
  // setup ever runs twice for one page (a double nav event, a cached script mixed with
  // fresh HTML), the whole tree shows up several times. Keep only the first copy of each
  // top-level entry, now and whenever the list changes.
  for (const list of document.querySelectorAll(".explorer-ul")) {
    const dedupe = () => {
      const seen = new Set()
      for (const li of list.querySelectorAll(":scope > li")) {
        const key = li.querySelector("[data-folderpath]")?.dataset.folderpath ?? li.querySelector("a")?.dataset.for ?? li.textContent
        if (seen.has(key)) li.remove()
        else seen.add(key)
      }
    }
    dedupe()
    const observer = new MutationObserver(dedupe)
    observer.observe(list, { childList: true })
    window.addCleanup(() => observer.disconnect())
  }

  // The reading bar is filled by CSS where scroll-driven animations exist (custom.scss), so
  // this only scripts it in browsers without them
  const bar = document.querySelector(".melon-progress")
  if (!bar || CSS.supports("animation-timeline: scroll()")) return
  let queued = false
  const update = () => {
    queued = false
    const max = document.documentElement.scrollHeight - window.innerHeight
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")"
  }
  const onScroll = () => {
    if (!queued) {
      queued = true
      requestAnimationFrame(update)
    }
  }
  update()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll)
  window.addCleanup(() => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onScroll)
  })
})
`

export default (() => MelonMotion) satisfies QuartzComponentConstructor
