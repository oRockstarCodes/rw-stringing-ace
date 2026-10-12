import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Page-to-page motion: replays the entrance animation on every (SPA) navigation
// and draws a reading-progress bar along the top of the window.
// The animations themselves live in wiki/custom.scss.
//
// It also carries the list of courses that have labs (data-labs="pcs-224,ele-302"),
// which the sidebar reads to add a "Lab reports" item under those courses
// (see the Explorer mapFn in quartz.layout.ts).

const MelonMotion: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  const coursesWithLabs = allFiles
    .filter((f) => f.melonLabs?.length && /^courses\/[^/]+\/index$/.test(f.slug ?? ""))
    .map((f) => f.slug!.split("/")[1])
  return (
    <div
      class="melon-progress"
      id="melon-data"
      data-labs={coursesWithLabs.join(",")}
      aria-hidden="true"
    ></div>
  )
}

MelonMotion.afterDOMLoaded = `
let firstNav = true
let alt = false
document.addEventListener("nav", () => {
  // The entrance plays on its own on first load. After that, alternating this class
  // swaps to an identical keyframe name, which makes the browser replay it. (State is
  // kept here because the SPA router resets .center's classes on navigation.)
  const center = document.querySelector(".center")
  if (center && !firstNav) {
    alt = !alt
    center.classList.toggle("melon-enter", alt)
  }
  firstNav = false

  const bar = document.querySelector(".melon-progress")
  if (!bar) return
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
