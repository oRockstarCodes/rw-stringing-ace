import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// A figure panel for the right sidebar (used on concept pages, in place of the graph;
// see quartz.layout.ts). It shows the figure that the text you're reading refers to,
// and changes as you scroll. The figures also stay where they are in the text.
//
// It works from the usual way figures are written in a note:
//   ![[some-diagram.svg]]
//   *Figure 2: What the figure shows.*
// The panel follows whichever came last above the reading line (about a third of the
// way down the window): a "Figure 2" mentioned in the text, or Figure 2 itself.
// Styles are in wiki/custom.scss.

const MelonFigures: QuartzComponent = () => (
  <div class="melon-figures" hidden>
    <div class="melon-figures-head">
      <h3>Figures</h3>
      <div class="melon-figures-nav">
        <button type="button" class="melon-figures-prev" aria-label="Previous figure">
          ‹
        </button>
        <span class="melon-figures-count" aria-live="polite"></span>
        <button type="button" class="melon-figures-next" aria-label="Next figure">
          ›
        </button>
      </div>
    </div>
    <button type="button" class="melon-figures-view" title="Show this figure in the text">
      <img alt="" />
    </button>
    <p class="melon-figures-caption"></p>
  </div>
)

MelonFigures.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const panel = document.querySelector(".melon-figures")
  const article = document.querySelector("article")
  if (!panel || !article) return

  // The figures: each embedded image, its caption (the italic line right after it),
  // and its number from the caption ("Figure 2: ...")
  const figures = [...article.querySelectorAll("img")]
    .filter((img) => !img.closest(".melon-opamp"))
    .map((img, i) => {
      const caption = img.parentElement && img.parentElement.querySelector(":scope > em")
      const m = caption && caption.textContent.match(/^\\s*Figure\\s+(\\d+)/i)
      return { img, caption, n: m ? Number(m[1]) : i + 1 }
    })
  if (figures.length === 0) return
  panel.hidden = false

  // Reading markers, in page order: the figure itself, or text that mentions "Figure N"
  const markers = []
  const captions = new Set(figures.map((f) => f.caption))
  article.querySelectorAll("p, li, td, h2, h3, h4, img").forEach((el) => {
    if (el.tagName === "IMG") {
      const index = figures.findIndex((f) => f.img === el)
      if (index >= 0) markers.push({ el, index })
      return
    }
    // Only the element's own text: a list item's nested list is checked on its own
    const own = [...el.childNodes]
      .filter((c) => !(c.nodeType === 1 && /^(UL|OL|P)$/.test(c.tagName)) && !captions.has(c))
      .map((c) => c.textContent)
      .join(" ")
    const mentions = [...own.matchAll(/Figure\\s+(\\d+)/gi)]
    if (mentions.length === 0) return
    const n = Number(mentions[mentions.length - 1][1])
    const index = figures.findIndex((f) => f.n === n)
    if (index >= 0) markers.push({ el, index })
  })

  const view = panel.querySelector(".melon-figures-view")
  const img = view.querySelector("img")
  const caption = panel.querySelector(".melon-figures-caption")
  const count = panel.querySelector(".melon-figures-count")
  let shown = -1
  // Set when the reader steps through with the arrows; scrolling again hands control back
  let manualUntilScroll = false

  const show = (index) => {
    if (index === shown) return
    shown = index
    const f = figures[index]
    panel.classList.remove("is-swapping")
    void panel.offsetWidth // restart the fade
    panel.classList.add("is-swapping")
    img.src = f.img.currentSrc || f.img.src
    img.alt = f.img.alt || ""
    caption.innerHTML = f.caption ? f.caption.innerHTML : ""
    count.textContent = index + 1 + " / " + figures.length
  }

  let queued = false
  const update = () => {
    queued = false
    if (manualUntilScroll) return
    const line = window.innerHeight * 0.35
    let index = markers.length ? markers[0].index : 0
    for (const m of markers) {
      if (m.el.getBoundingClientRect().top > line) break
      index = m.index
    }
    show(index)
  }
  const onScroll = () => {
    manualUntilScroll = false
    if (!queued) {
      queued = true
      requestAnimationFrame(update)
    }
  }

  const step = (by) => {
    manualUntilScroll = true
    show((shown + by + figures.length) % figures.length)
  }
  const prev = panel.querySelector(".melon-figures-prev")
  const next = panel.querySelector(".melon-figures-next")
  const onPrev = () => step(-1)
  const onNext = () => step(1)
  // Clicking the figure jumps to it in the text
  const onView = () => {
    const target = figures[shown].img
    target.scrollIntoView({ behavior: "smooth", block: "center" })
    target.closest("p")?.classList.add("melon-figure-flash")
    setTimeout(() => target.closest("p")?.classList.remove("melon-figure-flash"), 1200)
  }

  update()
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll)
  prev.addEventListener("click", onPrev)
  next.addEventListener("click", onNext)
  view.addEventListener("click", onView)
  window.addCleanup(() => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onScroll)
    prev.removeEventListener("click", onPrev)
    next.removeEventListener("click", onNext)
    view.removeEventListener("click", onView)
  })
})
`

export default (() => MelonFigures) satisfies QuartzComponentConstructor
