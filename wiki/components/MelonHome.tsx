import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, joinSegments, pathToRoot, resolveRelative } from "../../util/path"
import { isChapterOf } from "./MelonFolder"
import { plural } from "./MelonPlate"
import { EDITIONS, editionOf, isCourseIndex } from "./MelonEditions"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The home pages. Each has the band and the stage (the title, the tagline) over a big 3D
// head made from the site icon.
//  - The site's home page (index): a door to each edition (MelonEditions.tsx), over the
//    wire-web head.
//  - An edition's home page (<edition>/): its stamp, if it has one, and its list of
//    courses, built from the notes in <edition>/courses/<code>/. The regular edition has
//    the wire-web head; the ECE Edition, in green, a circuit-board head whose traces carry
//    pulses of current.
// Nothing here needs editing when a course is added: each <edition>/courses/<code>/index.md
// becomes a row, using its `code`, `term`, and `status` properties.

const MelonHome: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const here = fileData.slug! as FullSlug
  const slugs = allFiles.map((f) => f.slug ?? "")
  const edition = editionOf(here)
  const coursesOf = (key: string) =>
    allFiles.filter((f) => (f.slug ?? "").startsWith(`${key}/`) && isCourseIndex(f.slug))

  const courses = (edition ? coursesOf(edition.key) : [])
    .map((f) => {
      const folder = f.slug!.replace(/index$/, "")
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      const title = String(fm.title ?? folder)
      const code = String(fm.code ?? title.split(":")[0])
      return {
        slug: f.slug! as FullSlug,
        code,
        name: title.includes(":") ? title.slice(title.indexOf(":") + 1).trim() : title,
        term: fm.term ? String(fm.term) : undefined,
        status: fm.status ? String(fm.status) : undefined,
        chapters: slugs.filter((s) => isChapterOf(folder, s)).length,
        labs: f.melonLabs?.length ?? 0,
      }
    })
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))

  const icon = edition?.icon ?? "static/icon.png"

  return (
    <section class="melon-home" data-scene={edition?.scene ?? "web"} data-icon={icon}>
      <div class="melon-band melon-ui">
        <span>Course notes</span>
        {/* an edition's home page leads back to the combined one, the door to every edition */}
        {edition ? (
          <span class="melon-band-meta">
            <span>{edition.short}</span>
            <a href={resolveRelative(here, "index" as FullSlug)} class="internal">
              ← All editions
            </a>
          </span>
        ) : (
          <span class="melon-band-meta">Choose an edition</span>
        )}
      </div>

      {/* The backdrop: the edition's icon as a big 3D head behind the whole page (script
          at the bottom of this file; three.js is loaded from static/ on demand). The script
          moves it to the end of <body> so nothing on the page can trap its fixed position.
          Without WebGL the flat print shows there instead. */}
      <div class="melon-bg" aria-hidden="true">
        <img
          class="melon-print"
          src={joinSegments(pathToRoot(here), icon)}
          alt=""
          width="256"
          height="256"
        />
        <canvas class="melon-gl"></canvas>
      </div>

      {/* The stage: the title and the tagline, over the head */}
      <div class="melon-stage">
        <div class="melon-stage-copy">
          <h1 class="melon-title" aria-label="Melon Files">
            {["Melon", "Files"].map((word, w) => (
              <span class="melon-word" aria-hidden="true">
                {word.split("").map((ch, i) => (
                  <span class="melon-letter" style={`--i:${w * 5 + i}`}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p class="melon-tagline">
            Linked notes from every course I take, chapter by chapter: formulas, worked examples,
            and the ideas behind them.
            {!edition && " Pick an edition."}
          </p>
        </div>

        {/* The edition's rubber stamp ("ECE Edition"): text around the ring, a resistor in the
            middle, roughened by an SVG filter to look printed. Styles and the press-in
            animation are in custom.scss. */}
        {edition?.stamp && (
          <span class="melon-stamp" role="img" aria-label={edition.title}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="melon-stamp-ring" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
                <filter id="melon-ink" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
                  <feDisplacementMap in="SourceGraphic" scale="2.4" />
                </filter>
              </defs>
              <g filter="url(#melon-ink)">
                <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-width="3.5" />
                <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" stroke-width="1.6" />
                <text fill="currentColor">
                  <textPath href="#melon-stamp-ring" textLength="268" lengthAdjust="spacing">
                    {`${edition.stamp} • ${edition.stamp} •`}
                  </textPath>
                </text>
                <path
                  d="M37 60 h8 l3.5 -8 l7 16 l7 -16 l7 16 l3.5 -8 h8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.6"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </span>
        )}
      </div>

      {/* The site's home page: a door to each edition, each in its own colors and icon */}
      {!edition && (
        <div class="melon-courses">
          <h2 class="melon-section-title">Editions</h2>
          <ul class="melon-doors melon-ui">
            {EDITIONS.map((e, i) => {
              const n = coursesOf(e.key).length
              return (
                <li class="melon-course melon-door" data-edition={e.key} style={`--i:${i}`}>
                  <a
                    href={resolveRelative(here, `${e.key}/index` as FullSlug)}
                    class="internal melon-door-link"
                  >
                    <img
                      class="melon-door-icon"
                      src={joinSegments(pathToRoot(here), e.icon)}
                      alt=""
                      width="256"
                      height="256"
                    />
                    <span class="melon-door-title">{e.title}</span>
                    <span class="melon-door-blurb">{e.blurb}</span>
                    <span class="melon-door-meta">
                      {n > 0 ? plural(n, "course") : "Coming soon"}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* An edition's course list, on a paper card so it reads clearly over the head */}
      {edition && (
      <div class="melon-courses">
      <h2 class="melon-section-title">Courses</h2>
      {courses.length === 0 && <p class="melon-empty">No courses here yet.</p>}
      {courses.length > 0 && (
      <ul class="melon-contents melon-ui">
        {courses.map((c, i) => (
          <li class="melon-course" data-i={i} style={`--i:${i}`}>
            <a href={resolveRelative(here, c.slug)} class="internal melon-row">
              <span class="melon-row-code">{c.code}</span>
              <span class="melon-row-name">{c.name}</span>
              <span class="melon-row-meta">
                <span>
                  {plural(c.chapters, "chapter")}
                  {c.labs > 0 && `, ${plural(c.labs, "lab")}`}
                </span>
                {c.term && (
                  <span>
                    {c.term}
                    {c.status && `, ${c.status}`}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
      )}
      </div>
      )}
    </section>
  )
}

// The 3D backdrop. This is a plain string that the build inlines into the page, so it avoids
// backticks and dollar-brace, and every top-level name starts with "mh". three.js itself is
// copied to static/ by scripts/build-wiki.sh and imported on first use, like GSAP and Lenis.
// What it draws is described above mhScene, inside the string.
MelonHome.afterDOMLoaded = `
// static/, found from the stylesheet link. Worked out once, as the page first loads: the
// SPA router keeps that link as it was written for the first page (../index.css and so on),
// so read against a page at another depth it would point to the wrong folder.
window.__melonStatic =
  window.__melonStatic ||
  ((sheet) => (sheet ? sheet.href.replace(/index\\.css.*$/, "static/") : "/melon-files/static/"))(
    document.querySelector('link[href*="index.css"]'),
  )
function mhBase() {
  return window.__melonStatic
}

function mhThree() {
  if (!window.__mhThree) window.__mhThree = import(mhBase() + "three.module.min.js")
  return window.__mhThree
}

// An icon (static/icon.png, static/icon-ece.png) as a grid of darkness values
// (0 paper .. 1 black ink)
function mhIcon(file) {
  window.__mhIcons = window.__mhIcons || {}
  if (window.__mhIcons[file]) return window.__mhIcons[file]
  window.__mhIcons[file] = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const n = 192
      const c = document.createElement("canvas")
      c.width = c.height = n
      const g = c.getContext("2d", { willReadFrequently: true })
      g.drawImage(img, 0, 0, n, n)
      const px = g.getImageData(0, 0, n, n).data
      const dark = new Float32Array(n * n)
      for (let i = 0; i < n * n; i++) {
        const lum = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255
        dark[i] = Math.min(1, Math.max(0, (1 - lum - 0.15) / 0.7)) * (px[i * 4 + 3] / 255)
      }
      resolve({ n: n, dark: dark })
    }
    img.onerror = () => resolve(null)
    img.src = mhBase() + file
  })
  return window.__mhIcons[file]
}

document.addEventListener("nav", () => {
  const home = document.querySelector(".melon-home")
  if (!home) return
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Course rows fade up as they come into view (only once this script has hidden them,
  // so without it they are simply there)
  const rows = [...document.querySelectorAll(".melon-course")]
  if (!reduced && "IntersectionObserver" in window) {
    rows.forEach((r) => r.classList.add("melon-pre"))
    const seen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("melon-in")
            seen.unobserve(e.target)
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    )
    rows.forEach((r) => seen.observe(r))
    window.addCleanup(() => seen.disconnect())
  }

  const bg = home.querySelector(".melon-bg")
  const canvas = bg && bg.querySelector(".melon-gl")
  if (!canvas) return

  // Out to the end of <body>, so no transformed ancestor can trap its fixed position;
  // taken away again when the page changes
  document.body.appendChild(bg)
  let dead = false
  let disposeScene = () => {}
  window.addCleanup(() => {
    dead = true
    disposeScene()
    bg.remove()
  })

  // the wire web (mhScene) or, for the ECE Edition, the circuit board (mhPcb)
  const pcb = home.dataset.scene === "pcb"
  const file = (home.dataset.icon || "static/icon.png").replace(/^static\\//, "")
  Promise.all([mhThree(), mhIcon(file), pcb ? null : mhDelaunator()])
    .then((r) => {
      if (dead) return
      disposeScene = pcb
        ? mhPcb(r[0], r[1], bg, canvas, reduced)
        : mhScene(r[0], r[1], r[2], bg, canvas, reduced)
    })
    .catch(() => bg.classList.add("melon-flat"))
})

// Seeded random numbers, so the web is the same every visit
function mhRng(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Delaunator (a small, fast triangulation library) from static/, copied there by
// scripts/build-wiki.sh. It joins thousands of points into triangles in a few milliseconds.
function mhDelaunator() {
  if (!window.__mhDel)
    window.__mhDel = new Promise((resolve, reject) => {
      if (window.Delaunator) return resolve(window.Delaunator)
      const s = document.createElement("script")
      s.src = mhBase() + "delaunator.min.js"
      s.onload = () => resolve(window.Delaunator)
      s.onerror = reject
      document.head.appendChild(s)
    })
  return window.__mhDel
}

// The face both scenes are built on: the icon, blurred a little so the edges come out
// smooth, and the surface the head is shaped to
function mhFace(icon) {
  const sampleDark = (x, y) => {
    if (!icon) return 0
    const n = icon.n
    const i = Math.min(n - 1, Math.max(0, Math.floor((x * 0.5 + 0.5) * n)))
    const j = Math.min(n - 1, Math.max(0, Math.floor((0.5 - y * 0.5) * n)))
    return icon.dark[j * n + i]
  }
  const M = 128
  const field = new Float32Array(M * M)
  const raw = new Float32Array(M * M)
  for (let j = 0; j < M; j++)
    for (let i = 0; i < M; i++) {
      let s = 0
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) s += sampleDark(((i + di) / (M - 1)) * 2 - 1, 1 - ((j + dj) / (M - 1)) * 2)
      // the print has an inked ring around its edge; fade the ink out toward the rim so the
      // web does not trace that ring as a hard bright edge around the face
      const fr = Math.hypot((i / (M - 1)) * 2 - 1, 1 - (j / (M - 1)) * 2)
      raw[j * M + i] = s / 9
      field[j * M + i] = (s / 9) * (1 - Math.min(1, Math.max(0, (fr - 0.74) / 0.16)))
    }
  const sampler = (arr) => (x, y) => {
    const fx = Math.min(M - 1.001, Math.max(0, ((x + 1) / 2) * (M - 1)))
    const fy = Math.min(M - 1.001, Math.max(0, ((1 - y) / 2) * (M - 1)))
    const i = Math.floor(fx), j = Math.floor(fy), u = fx - i, w = fy - j
    const f = (a, b) => arr[b * M + a]
    return (f(i, j) * (1 - u) + f(i + 1, j) * u) * (1 - w) + (f(i, j + 1) * (1 - u) + f(i + 1, j + 1) * u) * w
  }
  const soft = sampler(field)
  // the print as it is, ink right out to the rim (for the circuit board, which draws the
  // logo's two tones)
  const ink = sampler(raw)
  const detail = (x, y) => {
    const e = 0.012
    return Math.abs(soft(x + e, y) - soft(x - e, y)) + Math.abs(soft(x, y + e) - soft(x, y - e))
  }
  // the surface: one smooth bump (no steep sphere edge, so nothing stretches at the rim),
  // with a real face modelled on it where the icon has its features:
  // a brow ridge, sunken eye sockets, a nose running down to its tip, lips, a chin and
  // cheeks. Positions are read off the icon (x right, y up, the face spans -1..1). On top of
  // that, a little of the print itself: light parts raised and the ink sunk in, like a
  // carved block.
  const bump = (r2) => 0.45 * Math.exp(-1.2 * r2)
  const g = (dx, dy, sx, sy) => Math.exp(-((dx * dx) / (2 * sx * sx) + (dy * dy) / (2 * sy * sy)))
  const face = (x, y) =>
    0.07 * g(x - 0.05, y - 0.36, 0.42, 0.07) - // brow ridge
    0.13 * g(x + 0.2, y - 0.12, 0.12, 0.075) - // eye sockets, each with the eyeball
    0.13 * g(x - 0.32, y - 0.08, 0.12, 0.075) + // bulging in it and a lid ridge above
    0.05 * g(x + 0.2, y - 0.11, 0.06, 0.035) +
    0.05 * g(x - 0.32, y - 0.07, 0.06, 0.035) +
    0.03 * g(x + 0.2, y - 0.17, 0.09, 0.02) +
    0.03 * g(x - 0.32, y - 0.13, 0.09, 0.02) +
    0.18 * g(x, y + 0.02, 0.07, 0.17) + // nose bridge
    0.09 * g(x + 0.02, y + 0.2, 0.09, 0.07) - // nose tip
    0.03 * g(x, y + 0.3, 0.06, 0.03) + // under the nose
    0.05 * g(x - 0.02, y + 0.39, 0.18, 0.04) - // upper lip, mouth line, lower lip
    0.035 * g(x - 0.02, y + 0.45, 0.18, 0.02) +
    0.045 * g(x - 0.02, y + 0.51, 0.15, 0.04) -
    0.03 * g(x - 0.03, y + 0.6, 0.15, 0.04) + // chin crease, chin
    0.07 * g(x - 0.05, y + 0.72, 0.18, 0.1) +
    0.05 * g(x + 0.45, y + 0.12, 0.2, 0.2) + // cheeks
    0.05 * g(x - 0.48, y + 0.15, 0.2, 0.2) -
    0.04 * g(Math.abs(x) - 0.7, y - 0.25, 0.12, 0.15) // temples
  // how close a point is to one of the eyes (1 at the centre, falling off around it)
  const eyes = (x, y) => Math.min(1, g(x + 0.2, y - 0.12, 0.13, 0.08) + g(x - 0.32, y - 0.08, 0.13, 0.08))
  const lift = (x, y) => {
    const r2 = x * x + y * y
    return bump(r2) + face(x, y) + (0.5 - soft(x, y)) * 0.05 * (1 - r2 * 0.8)
  }
  return { M, field, soft, ink, detail, bump, eyes, lift }
}

// The scene: the site icon as a big 3D wire-web head, behind the whole home page. It is a
// handful of line meshes and point clouds, so it stays light even at full-window size.
//  - the web: points scattered over the icon (densest along its edges and in its detail),
//    triangulated onto a smooth head shape with a face modelled on it: light parts raised,
//    ink sunk in. Past the face the web carries on, its triangles growing and fading until
//    they run out.
//  - construction lines behind it, like a face-mesh drawing
// It sways on its own, leans toward the pointer and turns a little as the page scrolls.
// Reduced motion: no intro and no loop, one frame drawn again on resize or theme change.
function mhScene(T, icon, Delaunator, bg, canvas, reduced) {
  let renderer
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" })
  } catch (e) {
    bg.classList.add("melon-flat")
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))

  const scene = new T.Scene()
  const camera = new T.PerspectiveCamera(26, 1, 0.1, 100)

  const read = () => {
    // (read off <body>, where an edition sets its own palette)
    const css = getComputedStyle(document.body)
    const get = (name) => new T.Color(css.getPropertyValue(name).trim() || "#888888")
    return { ink: get("--dark"), rose: get("--secondary"), paper: get("--light") }
  }
  let pal = read()
  const isDark = () => pal.paper.r < pal.ink.r
  const dim = () => pal.rose.clone().lerp(pal.paper, isDark() ? 0.6 : 0.5)

  const { M, field, soft, detail, bump, eyes, lift } = mhFace(icon)

  // ----- scatter points. On the face, a fill that gets denser where the woodcut has detail,
  // so the features show by how tight the web is. Past the rim, the web carries on with the
  // points spaced further and further apart, so the triangles grow until they run out. A
  // coarse grid keeps the spacing check fast.
  const rnd = mhRng(11)
  const pts = []
  const RIM = 0.97
  const OUT = 2.5
  // how far the web reaches in each direction: shorter to the left, where the sidebar is,
  // so the explorer sits on clear paper
  const reach = (x, r) => OUT - 0.8 * Math.max(0, -x / Math.max(r, 0.001))
  const CELL = 0.12
  const grid = new Map()
  const cellKey = (x, y) => Math.floor((x + 1) / CELL) * 1000 + Math.floor((y + 1) / CELL)
  const far = (x, y, gap) => {
    const cx = Math.floor((x + 1) / CELL), cy = Math.floor((y + 1) / CELL)
    for (let i = cx - 1; i <= cx + 1; i++)
      for (let j = cy - 1; j <= cy + 1; j++) {
        const list = grid.get(i * 1000 + j)
        if (!list) continue
        for (const p of list) {
          const dx = p[0] - x, dy = p[1] - y
          if (dx * dx + dy * dy < gap * gap) return false
        }
      }
    return true
  }
  const add = (x, y) => {
    const p = [x, y]
    pts.push(p)
    const key = cellKey(x, y)
    if (!grid.has(key)) grid.set(key, [])
    grid.get(key).push(p)
  }
  // points laid along the edges of the ink first, so the triangles line up with the
  // features and they come out crisp instead of as soft dense patches (marching squares
  // on the icon at half ink; no lines are drawn along them). Around the eyes the ink is
  // traced at two more levels and the points sit closer, so the lids and pupils come out
  // sharper than the rest.
  for (const LV of [0.5, 0.32, 0.68])
  for (let j = 0; j < M - 1; j++)
    for (let i = 0; i < M - 1; i++) {
      const fa = field[j * M + i], fb = field[j * M + i + 1], fc = field[(j + 1) * M + i + 1], fd = field[(j + 1) * M + i]
      const gx = (u) => (u / (M - 1)) * 2 - 1
      const gy = (u) => 1 - (u / (M - 1)) * 2
      const cross = []
      if ((fa < LV) !== (fb < LV)) cross.push([gx(i + (LV - fa) / (fb - fa)), gy(j)])
      if ((fb < LV) !== (fc < LV)) cross.push([gx(i + 1), gy(j + (LV - fb) / (fc - fb))])
      if ((fd < LV) !== (fc < LV)) cross.push([gx(i + (LV - fd) / (fc - fd)), gy(j + 1)])
      if ((fa < LV) !== (fd < LV)) cross.push([gx(i), gy(j + (LV - fa) / (fd - fa))])
      cross.forEach((p) => {
        const e = eyes(p[0], p[1])
        if (LV !== 0.5 && e < 0.35) return
        if (Math.hypot(p[0], p[1]) < 0.86 && far(p[0], p[1], 0.024 - 0.009 * e)) add(p[0], p[1])
      })
    }
  let tries = 0
  while (pts.length < 8500 && tries < 380000) {
    tries++
    const x = (rnd() * 2 - 1) * OUT
    const y = (rnd() * 2 - 1) * OUT
    const r = Math.hypot(x, y)
    if (r > reach(x, r)) continue
    if (r >= RIM) {
      // the spacing starts at the face edge spacing and grows with distance from the rim
      const t = (r - RIM) / (reach(x, r) - RIM)
      if (far(x, y, 0.1 + Math.pow(t, 2) * 0.48)) add(x, y)
      continue
    }
    const ink = soft(x, y)
    const d = Math.min(1, detail(x, y) * 3)
    // dense where the woodcut has detail (eyes, nose, mouth), lighter in the big black
    // shadow, and easing off toward the rim
    const core = 1 - Math.min(1, Math.max(0, (r - 0.55) / 0.4))
    const want = Math.min(1, (0.25 * ink + 1.6 * d) * (0.35 + 0.65 * core) + 0.8 * eyes(x, y) * Math.min(1, ink + 2 * d))
    if (rnd() > 0.15 + want) continue
    if (far(x, y, 0.1 - 0.078 * Math.pow(want, 0.7))) add(x, y)
  }
  const dl = Delaunator.from(pts)
  const tri = []
  const len = (p, q) => Math.hypot(pts[p][0] - pts[q][0], pts[p][1] - pts[q][1])
  for (let k = 0; k < dl.triangles.length; k += 3) {
    const a = dl.triangles[k], b = dl.triangles[k + 1], c = dl.triangles[k + 2]
    const cr = Math.hypot((pts[a][0] + pts[b][0] + pts[c][0]) / 3, (pts[a][1] + pts[b][1] + pts[c][1]) / 3)
    // drop the long slivers along the outer hull
    if (cr > 0.9 && Math.max(len(a, b), len(b, c), len(c, a)) > 0.25 + (cr - 0.9) * 0.55) continue
    tri.push([a, b, c])
  }

  // ----- vertices: the face on the bump, and the outer web carrying on down it and curling
  // gently back. The last value is how far the outer web has faded into the page (0 on the
  // face, 1 at the very edge).
  const verts = pts.map((p) => {
    const r = Math.hypot(p[0], p[1])
    if (r < RIM) return [p[0], p[1] * 1.12, lift(p[0], p[1]), soft(p[0], p[1]), 0]
    const t = Math.min(1, (r - RIM) / (reach(p[0], r) - RIM))
    return [p[0], p[1] * 1.12, bump(r * r) - 0.15 * t * t + (rnd() - 0.5) * 0.04 * (1 + 4 * t), 0.18, Math.max(0.001, Math.pow(t, 1.5))]
  })
  const seen = new Set()
  const edges = []
  const addEdge = (a, b, r) => {
    const key = a < b ? a * 65536 + b : b * 65536 + a
    if (!seen.has(key)) {
      seen.add(key)
      edges.push([a, b, r])
    }
  }
  tri.forEach((t) => {
    for (let k = 0; k < 3; k++) {
      const a = t[k], b = t[(k + 1) % 3]
      const r = Math.hypot((pts[a][0] + pts[b][0]) / 2, (pts[a][1] + pts[b][1]) / 2)
      addEdge(a, b, r)
    }
  })
  // grow outward from the middle of the face
  edges.sort((p, q) => p[2] - q[2])

  const segPos = new Float32Array(edges.length * 6)
  edges.forEach((e, k) => {
    const a = verts[e[0]], b = verts[e[1]]
    segPos.set([a[0], a[1], a[2], b[0], b[1], b[2]], k * 6)
  })
  const segCol = new Float32Array(edges.length * 6)
  const lineGeo = new T.BufferGeometry()
  lineGeo.setAttribute("position", new T.BufferAttribute(segPos, 3))
  lineGeo.setAttribute("color", new T.BufferAttribute(segCol, 3))
  // Drift: every point sways in a slow wave and wanders a little on its own, gently on the
  // face and more out in the frayed web. It runs on the graphics card, and since each point moves by its own
  // position, lines that share a point stay joined.
  const uTime = { value: 0 }
  const NL = String.fromCharCode(10)
  const drift = (mat) => {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uTime
      sh.vertexShader =
        "uniform float uTime;" + NL +
        sh.vertexShader.replace(
          "#include <begin_vertex>",
          [
            "#include <begin_vertex>",
            "float rr = length(position.xy);",
            "float amp = 0.012 + 0.11 * smoothstep(0.85, 2.5, rr);",
            "transformed.z += amp * sin(position.x * 5.0 + uTime * 1.1) * cos(position.y * 4.0 - uTime * 0.8);",
            "transformed.xy += amp * 0.6 * vec2(sin(position.y * 3.0 + uTime * 0.7), cos(position.x * 3.0 + uTime * 0.6));",
            // and each point its own wander: a speed, direction and phase hashed from where
            // it sits, so it is random from point to point but the same for every line end
            // at that point
            "float h1 = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);",
            "float h2 = fract(sin(dot(position.xy, vec2(39.3468, 11.135))) * 24634.6345);",
            "float h3 = fract(sin(dot(position.xy, vec2(73.156, 52.235))) * 15731.7431);",
            "float jit = 0.007 + 0.05 * smoothstep(0.85, 2.5, rr);",
            "transformed += jit * vec3(sin(uTime * (0.6 + h1 * 1.4) + h2 * 6.2832), cos(uTime * (0.5 + h2 * 1.3) + h3 * 6.2832), sin(uTime * (0.7 + h3 * 1.2) + h1 * 6.2832));",
          ].join(NL),
        )
    }
  }
  const lineMat = new T.LineBasicMaterial({ vertexColors: true })
  drift(lineMat)
  const web = new T.LineSegments(lineGeo, lineMat)
  web.frustumCulled = false

  // nodes: only where the ink is, like the dots at the joins of the reference drawings
  const nodeIdx = verts.map((v, i) => i).filter((i) => i < pts.length && verts[i][3] > 0.6 && i % 3 === 0)
  nodeIdx.sort((p, q) => Math.hypot(verts[p][0], verts[p][1]) - Math.hypot(verts[q][0], verts[q][1]))
  const dotPos = new Float32Array(nodeIdx.length * 3)
  nodeIdx.forEach((vi, k) => dotPos.set([verts[vi][0], verts[vi][1], verts[vi][2] + 0.004], k * 3))
  const dotGeo = new T.BufferGeometry()
  dotGeo.setAttribute("position", new T.BufferAttribute(dotPos, 3))
  const dotMat = new T.PointsMaterial({ size: 2.4, sizeAttenuation: false, color: pal.ink })
  drift(dotMat)
  const dots = new T.Points(dotGeo, dotMat)
  dots.frustumCulled = false

  const paint = () => {
    const faint = dim()
    const c = new T.Color()
    const put = (arr, at) => {
      arr[at] = c.r
      arr[at + 1] = c.g
      arr[at + 2] = c.b
    }
    edges.forEach((e, k) => {
      for (let end = 0; end < 2; end++) {
        const v = verts[e[end]]
        // brightest in the middle of the face, toned down toward its edge
        const vr = Math.hypot(v[0], v[1] / 1.12)
        const edge = 1 - 0.65 * Math.min(1, Math.max(0, (vr - 0.5) / 0.47))
        c.copy(faint).lerp(pal.ink, Math.min(1, (v[3] < 0.3 ? 0.05 : v[3] > 0.62 ? 1 : 0.05 + ((v[3] - 0.3) / 0.32) * 0.95) * (isDark() ? 1 : 0.85) * edge))
        if (v[4]) c.lerp(pal.paper, v[4])
        put(segCol, k * 6 + end * 3)
      }
    })
    lineGeo.attributes.color.needsUpdate = true
    dotMat.color.copy(pal.ink)
  }
  paint()

  const root = new T.Group()
  const spin = new T.Group()
  root.add(spin)
  scene.add(root)
  spin.add(web, dots)

  // ----- construction lines behind the head, like the guides in a face-mesh drawing
  const guidePts = []
  ;[-0.62, -0.25, 0.12, 0.42, 0.98].forEach((y) => guidePts.push(new T.Vector3(-3.4, y * 1.12, -0.9), new T.Vector3(3.4, y * 1.12, -0.9)))
  // (no vertical guide on the right: it ran down the edge of the window)
  ;[-1.12, 0].forEach((x) => guidePts.push(new T.Vector3(x, -1.7, -0.9), new T.Vector3(x, 1.7, -0.9)))
  const guideMat = new T.LineBasicMaterial({ color: dim() })
  const guideGeo = new T.BufferGeometry().setFromPoints(guidePts)
  root.add(new T.LineSegments(guideGeo, guideMat))

  const retint = () => {
    pal = read()
    paint()
    guideMat.color.copy(dim())
  }

  // ----- sizing: the head nearly fills the window's height. On a wide window it sits to
  // the right of the text column; on a narrow one it is centred, behind everything.
  const fit = () => {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const half = Math.tan((camera.fov * Math.PI) / 360)
    const vis = Math.max(1.18, 1.05 / camera.aspect)
    camera.position.set(0, 0, vis / half)
    camera.lookAt(0, 0, 0)
    root.position.x = camera.aspect > 1.15 ? vis * camera.aspect * 0.52 : 0
  }
  fit()

  // ----- input: lean toward the pointer, turn with the scroll
  let leanX = 0
  let leanY = 0
  let dead = false
  const cleanups = []
  const on = (el, type, fn, opts) => {
    el.addEventListener(type, fn, opts)
    cleanups.push(() => el.removeEventListener(type, fn, opts))
  }
  if (!reduced) {
    on(window, "pointermove", (e) => {
      leanX = (e.clientY / window.innerHeight - 0.5) * 2
      leanY = (e.clientX / window.innerWidth - 0.5) * 2
    }, { passive: true })
  }

  // ----- drawing
  const out4 = (t) => 1 - Math.pow(1 - t, 4)
  const clamp = (v) => Math.min(1, Math.max(0, v))
  let t0 = performance.now()
  let last = t0
  let intro = reduced ? 1 : 0
  let clock = 0
  const nSeg = edges.length

  const draw = (dt) => {
    // the intro: the web grows outward from the middle of the face
    lineGeo.setDrawRange(0, Math.floor(nSeg * out4(clamp(intro / 0.75))) * 2)
    dotGeo.setDrawRange(0, Math.floor(nodeIdx.length * out4(clamp((intro - 0.4) / 0.5))))

    clock += dt
    uTime.value = clock
    const scroll = reduced ? 0 : Math.min(1.5, window.scrollY / Math.max(1, window.innerHeight))
    spin.rotation.y = (reduced ? -0.18 : Math.sin(clock * 0.3) * 0.32 - 0.12) + scroll * 0.5
    root.rotation.x += (leanX * 0.08 + scroll * 0.12 - root.rotation.x) * Math.min(1, dt * 3)
    root.rotation.z += (-leanY * 0.03 - root.rotation.z) * Math.min(1, dt * 3)

    renderer.render(scene, camera)
  }

  let raf = 0
  function frame(now) {
    raf = 0
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (intro < 1) intro = Math.min(1, (now - t0) / 2600)
    draw(dt)
    if (!dead && !document.hidden && !reduced) raf = requestAnimationFrame(frame)
  }
  function again() {
    if (!raf && !dead) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }
  on(document, "visibilitychange", again)
  const ro = new ResizeObserver(() => {
    fit()
    again()
  })
  ro.observe(canvas)
  const themes = new MutationObserver(() => {
    retint()
    again()
  })
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })

  bg.classList.add("melon-3d")
  t0 = performance.now()
  again()

  return () => {
    dead = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    themes.disconnect()
    cleanups.forEach((f) => f())
    ;[lineGeo, dotGeo, guideGeo, lineMat, dotMat, guideMat].forEach((o) => o.dispose())
    renderer.dispose()
    bg.classList.remove("melon-3d")
  }
}

// The ECE Edition's scene: the logo, drawn as a circuit board. Copper traces are routed over
// the face on a fine grid, running straight and turning only by 45 degrees, the way a board
// is laid out. Each one stays inside either the ink or the paper of the print: traces first
// run round the outlines of the ink, then pack it solid, while the paper gets only a few
// faint ones, so the board reads as the logo itself. The longer traces end at vias.
// Past the face the board carries on in longer, sparser runs that fade into the page.
// Pulses of current run along some of the traces, and a via flashes as one arrives.
// Behind it all, a faint grid of holes, like perfboard.
// It leans toward the pointer and turns with the scroll like the wire web, but the board
// itself stays rigid. Reduced motion: no intro and no pulses moving, one frame.
function mhPcb(T, icon, bg, canvas, reduced) {
  let renderer
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" })
  } catch (e) {
    bg.classList.add("melon-flat")
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))

  const scene = new T.Scene()
  const camera = new T.PerspectiveCamera(26, 1, 0.1, 100)

  const read = () => {
    const css = getComputedStyle(document.body)
    const get = (name, fallback) => new T.Color(css.getPropertyValue(name).trim() || fallback)
    return {
      ink: get("--dark", "#1e231d"),
      rose: get("--secondary", "#4a7a2e"),
      paper: get("--light", "#f5f9f1"),
      glow: get("--melon-glow", "#46a11f"),
    }
  }
  let pal = read()
  const isDark = () => pal.paper.r < pal.ink.r
  const dim = () => pal.rose.clone().lerp(pal.paper, isDark() ? 0.6 : 0.5)

  const { ink, bump, lift } = mhFace(icon)
  const rnd = mhRng(23)

  // ----- routing. Grid cells S apart; a trace takes cells one step at a time and keeps a
  // free cell between itself and every other trace (more out past the face), so traces
  // never touch or cross.
  const S = 0.012
  const RIM = 0.97
  const OUT = 2.5
  // shorter to the left, where the sidebar is, as with the wire web
  const reach = (x, r) => OUT - 0.8 * Math.max(0, -x / Math.max(r, 0.001))
  const outer = (x, y) => {
    const r = Math.hypot(x, y)
    return r < RIM ? 0 : Math.min(1, (r - RIM) / (reach(x, r) - RIM))
  }
  const inside = (x, y) => {
    const r = Math.hypot(x, y)
    return r < reach(x, r) - 0.06
  }
  const used = new Map()
  const key = (i, j) => (i + 500) * 1000 + (j + 500)
  const clear = (i, j, id) => {
    const t = outer(i * S, j * S)
    const c = t > 0.3 ? 5 : t > 0 ? 3 : 1
    for (let di = -c; di <= c; di++)
      for (let dj = -c; dj <= c; dj++) {
        const o = used.get(key(i + di, j + dj))
        if (o !== undefined && o !== id) return false
      }
    return true
  }
  // which part of the logo a grid cell is in: 1 the ink of the print, 0 its paper, 2 past
  // the rim. A trace never leaves the part it starts in, so the ink fills in solid with
  // traces and its outline is drawn by where they stop.
  const parts = new Map()
  const part = (i, j) => {
    const k = key(i, j)
    let p = parts.get(k)
    if (p === undefined) {
      const x = i * S
      const y = j * S
      p = Math.hypot(x, y) >= RIM ? 2 : ink(x, y) > 0.45 ? 1 : 0
      parts.set(k, p)
    }
    return p
  }
  // an ink cell on the outline of its shape: some paper (or the rim) within two cells
  const edge = (i, j) => {
    for (let di = -2; di <= 2; di++) for (let dj = -2; dj <= 2; dj++) if (part(i + di, j + dj) !== 1) return true
    return false
  }
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
  const traces = []
  const free = (i, j, zone, id) => inside(i * S, j * S) && part(i, j) === zone && !used.has(key(i, j)) && clear(i, j, id)
  // lay one trace from cell (i, j) heading d: straight on or a 45 degree turn, staying in its
  // own part of the logo (with a little chance, and a small cost for turning; a trace that
  // hugs keeps to the outline of the ink). Kept only if it gets to at least min cells.
  const grow = (i, j, d, zone, max, min, hug) => {
    const id = traces.length
    if (!free(i, j, zone, id)) return
    const cells = [[i, j]]
    used.set(key(i, j), id)
    for (let step = 0; step < max; step++) {
      let best = -1
      let bestScore = 1e9
      for (const turn of [0, 1, -1, 2, -2]) {
        // a right-angle turn only for a trace following the outline round a corner
        if (!hug && Math.abs(turn) > 1) continue
        const nd = (d + turn + 8) % 8
        const ni = i + DIRS[nd][0]
        const nj = j + DIRS[nd][1]
        if (!free(ni, nj, zone, id)) continue
        const score = (turn ? 0.2 * Math.abs(turn) : 0) + rnd() * 0.25 + (hug && !edge(ni, nj) ? 2 : 0)
        if (score < bestScore) {
          bestScore = score
          best = nd
        }
      }
      if (best < 0) break
      d = best
      i += DIRS[d][0]
      j += DIRS[d][1]
      used.set(key(i, j), id)
      cells.push([i, j])
    }
    if (cells.length < min) cells.forEach((c) => used.delete(key(c[0], c[1])))
    else traces.push(cells)
  }
  const R = Math.ceil(RIM / S)
  // first the outlines of the ink, so the shapes of the face are drawn
  for (let j = R; j >= -R; j--)
    for (let i = -R; i <= R; i++) {
      if (part(i, j) !== 1 || used.has(key(i, j)) || !edge(i, j)) continue
      const d0 = Math.floor(rnd() * 8)
      for (let k = 0; k < 8 && !used.has(key(i, j)); k++) grow(i, j, (d0 + k) % 8, 1, 400, 6, true)
    }
  // then long runs over the ink, the paper only here and there, and the board past the rim,
  // thinning out
  let tries = 0
  while (traces.length < 9000 && tries < 240000) {
    tries++
    const onFace = tries % 2 === 0
    const a = rnd() * Math.PI * 2
    const rr = Math.sqrt(rnd()) * RIM
    const x = onFace ? Math.cos(a) * rr : (rnd() * 2 - 1) * OUT
    const y = onFace ? Math.sin(a) * rr : (rnd() * 2 - 1) * OUT
    if (!inside(x, y)) continue
    const t = outer(x, y)
    const i = Math.round(x / S)
    const j = Math.round(y / S)
    const zone = part(i, j)
    const want = zone === 1 ? 1 : zone === 0 ? 0.08 : 0.4 * (1 - t)
    if (rnd() > want) continue
    const max = zone === 1 ? 30 + rnd() * 110 : zone === 0 ? 6 + rnd() * 20 : 14 + rnd() * 80
    grow(i, j, Math.floor(rnd() * 8), zone, max, 5)
  }
  // and every gap left in the ink gets a short trace too, so the ink packs solid and the
  // face reads from across the room
  for (let j = R; j >= -R; j--)
    for (let i = -R; i <= R; i++) {
      if (part(i, j) !== 1 || used.has(key(i, j))) continue
      const d0 = Math.floor(rnd() * 8)
      for (let k = 0; k < 8 && !used.has(key(i, j)); k++) grow(i, j, (d0 + k) % 8, 1, 10 + rnd() * 30, 3)
    }

  // ----- where a grid point sits in 3D: on the face, or down the outer board, curling back
  // a little. The last two values are its ink (for its color) and how far it has faded
  // into the page.
  const place = (i, j) => {
    const x = i * S
    const y = j * S
    const t = outer(x, y)
    if (t === 0) return [x, y * 1.12, lift(x, y), part(i, j) === 1 ? 1 : 0, 0]
    const r = Math.hypot(x, y)
    return [x, y * 1.12, bump(r * r) - 0.15 * t * t, 0.18, Math.max(0.001, Math.pow(t, 1.5))]
  }

  // segments, each with its length along the trace (for the pulses) and its trace's pulse
  // phase (-1 for a trace that carries none)
  const segs = []
  const ends = []
  traces.forEach((cells) => {
    const phase = rnd() < 0.4 ? rnd() : -1
    const pts = cells.map((c) => place(c[0], c[1]))
    let run = 0
    for (let k = 0; k + 1 < pts.length; k++) {
      const a = pts[k]
      const b = pts[k + 1]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
      segs.push([a, b, run, run + len, phase, Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 / 1.12)])
      run += len
    }
    // vias only on the longer traces, so the short ones packing the ink stay clean
    if (cells.length >= 10)
      [[pts[0], 0], [pts[pts.length - 1], run]].forEach((e) => {
        if (e[0][4] < 0.75) ends.push([e[0], e[1], phase])
      })
  })
  // grow outward from the middle of the face
  segs.sort((p, q) => p[5] - q[5])
  ends.sort((p, q) => Math.hypot(p[0][0], p[0][1]) - Math.hypot(q[0][0], q[0][1]))

  const uTime = { value: 0 }
  const uGlow = { value: pal.glow.clone() }
  const NL = String.fromCharCode(10)
  // the pulse: a bright head with a short tail, travelling along the trace and coming round
  // again every 2.4 units of length
  const pulse = "float pulse(float len, float ph) { if (ph < 0.0) return 0.0; float d = mod(uTime * 0.5 - len + ph * 2.4, 2.4); return exp(-d * 13.0); }"

  const segPos = new Float32Array(segs.length * 6)
  const segCol = new Float32Array(segs.length * 6)
  const segLen = new Float32Array(segs.length * 2)
  const segPh = new Float32Array(segs.length * 2)
  segs.forEach((s, k) => {
    segPos.set([s[0][0], s[0][1], s[0][2], s[1][0], s[1][1], s[1][2]], k * 6)
    segLen.set([s[2], s[3]], k * 2)
    segPh.set([s[4], s[4]], k * 2)
  })
  const lineGeo = new T.BufferGeometry()
  lineGeo.setAttribute("position", new T.BufferAttribute(segPos, 3))
  lineGeo.setAttribute("aCol", new T.BufferAttribute(segCol, 3))
  lineGeo.setAttribute("aLen", new T.BufferAttribute(segLen, 1))
  lineGeo.setAttribute("aPh", new T.BufferAttribute(segPh, 1))
  const lineMat = new T.ShaderMaterial({
    uniforms: { uTime, uGlow },
    vertexShader: [
      "attribute vec3 aCol;",
      "attribute float aLen;",
      "attribute float aPh;",
      "varying vec3 vCol;",
      "varying float vLen;",
      "varying float vPh;",
      "void main() {",
      "  vCol = aCol; vLen = aLen; vPh = aPh;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join(NL),
    fragmentShader: [
      "uniform float uTime;",
      "uniform vec3 uGlow;",
      "varying vec3 vCol;",
      "varying float vLen;",
      "varying float vPh;",
      pulse,
      "void main() {",
      "  gl_FragColor = vec4(mix(vCol, uGlow, pulse(vLen, vPh)), 1.0);",
      "  #include <colorspace_fragment>",
      "}",
    ].join(NL),
  })
  const board = new T.LineSegments(lineGeo, lineMat)
  board.frustumCulled = false

  // vias: a ring at each end of a trace, flashing as a pulse reaches it
  const viaPos = new Float32Array(ends.length * 3)
  const viaCol = new Float32Array(ends.length * 3)
  const viaLen = new Float32Array(ends.length)
  const viaPh = new Float32Array(ends.length)
  ends.forEach((e, k) => {
    viaPos.set([e[0][0], e[0][1], e[0][2] + 0.004], k * 3)
    viaLen[k] = e[1]
    viaPh[k] = e[1] > 0 ? e[2] : -1
  })
  const viaGeo = new T.BufferGeometry()
  viaGeo.setAttribute("position", new T.BufferAttribute(viaPos, 3))
  viaGeo.setAttribute("aCol", new T.BufferAttribute(viaCol, 3))
  viaGeo.setAttribute("aLen", new T.BufferAttribute(viaLen, 1))
  viaGeo.setAttribute("aPh", new T.BufferAttribute(viaPh, 1))
  const viaMat = new T.ShaderMaterial({
    uniforms: { uTime, uGlow, uSize: { value: 4.5 * renderer.getPixelRatio() } },
    transparent: true,
    vertexShader: [
      "uniform float uSize;",
      "attribute vec3 aCol;",
      "attribute float aLen;",
      "attribute float aPh;",
      "varying vec3 vCol;",
      "varying float vLen;",
      "varying float vPh;",
      "void main() {",
      "  vCol = aCol; vLen = aLen; vPh = aPh;",
      "  gl_PointSize = uSize;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join(NL),
    fragmentShader: [
      "uniform float uTime;",
      "uniform vec3 uGlow;",
      "varying vec3 vCol;",
      "varying float vLen;",
      "varying float vPh;",
      pulse,
      "void main() {",
      "  float r = length(gl_PointCoord * 2.0 - 1.0);",
      "  if (r > 1.0 || r < 0.42) discard;",
      "  gl_FragColor = vec4(mix(vCol, uGlow, min(1.0, pulse(vLen, vPh) * 1.6)), 1.0);",
      "  #include <colorspace_fragment>",
      "}",
    ].join(NL),
  })
  const vias = new T.Points(viaGeo, viaMat)
  vias.frustumCulled = false

  // ink-dark over the ink of the print, faint over its paper, so the board reads as the
  // logo; toned down a little toward the rim and fading out past it
  const paint = () => {
    const faint = dim()
    const c = new T.Color()
    const tone = (v) => {
      const vr = Math.hypot(v[0], v[1] / 1.12)
      const edge = 1 - 0.25 * Math.min(1, Math.max(0, (vr - 0.6) / 0.37))
      c.copy(faint).lerp(pal.ink, v[3] * (isDark() ? 1 : 0.85) * edge)
      // traces over the paper of the print sink back further, so the ink shows the face
      if (!v[3] && !v[4]) c.lerp(pal.paper, 0.5)
      if (v[4]) c.lerp(pal.paper, v[4])
    }
    segs.forEach((s, k) => {
      for (let end = 0; end < 2; end++) {
        tone(s[end])
        segCol.set([c.r, c.g, c.b], k * 6 + end * 3)
      }
    })
    ends.forEach((e, k) => {
      tone(e[0])
      viaCol.set([c.r, c.g, c.b], k * 3)
    })
    lineGeo.attributes.aCol.needsUpdate = true
    viaGeo.attributes.aCol.needsUpdate = true
    uGlow.value.copy(pal.glow)
  }
  paint()

  const root = new T.Group()
  const spin = new T.Group()
  root.add(spin)
  scene.add(root)
  spin.add(board, vias)

  // ----- perfboard behind the head: a faint grid of holes
  const holes = []
  for (let x = -3.4; x <= 3.4; x += 0.16) for (let y = -1.9; y <= 1.9; y += 0.16) holes.push(new T.Vector3(x, y, -0.9))
  const holeGeo = new T.BufferGeometry().setFromPoints(holes)
  const holeMat = new T.PointsMaterial({ size: 2, sizeAttenuation: false, color: dim() })
  root.add(new T.Points(holeGeo, holeMat))

  const retint = () => {
    pal = read()
    paint()
    holeMat.color.copy(dim())
  }

  // ----- sizing, as with the wire web: the head nearly fills the window's height, to the
  // right of the text on a wide window and centred behind it on a narrow one
  const fit = () => {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const half = Math.tan((camera.fov * Math.PI) / 360)
    const vis = Math.max(1.18, 1.05 / camera.aspect)
    camera.position.set(0, 0, vis / half)
    camera.lookAt(0, 0, 0)
    root.position.x = camera.aspect > 1.15 ? vis * camera.aspect * 0.52 : 0
  }
  fit()

  // ----- input: lean toward the pointer, turn with the scroll
  let leanX = 0
  let leanY = 0
  let dead = false
  const cleanups = []
  const on = (el, type, fn, opts) => {
    el.addEventListener(type, fn, opts)
    cleanups.push(() => el.removeEventListener(type, fn, opts))
  }
  if (!reduced) {
    on(window, "pointermove", (e) => {
      leanX = (e.clientY / window.innerHeight - 0.5) * 2
      leanY = (e.clientX / window.innerWidth - 0.5) * 2
    }, { passive: true })
  }

  // ----- drawing
  const out4 = (t) => 1 - Math.pow(1 - t, 4)
  const clamp = (v) => Math.min(1, Math.max(0, v))
  let t0 = performance.now()
  let last = t0
  let intro = reduced ? 1 : 0
  let clock = reduced ? 1.7 : 0
  const nSeg = segs.length

  const draw = (dt) => {
    // the intro: the board is laid outward from the middle of the face, then the vias
    lineGeo.setDrawRange(0, Math.floor(nSeg * out4(clamp(intro / 0.75))) * 2)
    viaGeo.setDrawRange(0, Math.floor(ends.length * out4(clamp((intro - 0.35) / 0.55))))

    if (!reduced) clock += dt
    // the current only starts flowing once the board is laid
    uTime.value = clock - 2
    const scroll = reduced ? 0 : Math.min(1.5, window.scrollY / Math.max(1, window.innerHeight))
    spin.rotation.y = (reduced ? -0.18 : Math.sin(clock * 0.25) * 0.26 - 0.12) + scroll * 0.5
    root.rotation.x += (leanX * 0.08 + scroll * 0.12 - root.rotation.x) * Math.min(1, dt * 3)
    root.rotation.z += (-leanY * 0.03 - root.rotation.z) * Math.min(1, dt * 3)

    renderer.render(scene, camera)
  }

  let raf = 0
  function frame(now) {
    raf = 0
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (intro < 1) intro = Math.min(1, (now - t0) / 2600)
    draw(dt)
    if (!dead && !document.hidden && !reduced) raf = requestAnimationFrame(frame)
  }
  function again() {
    if (!raf && !dead) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }
  on(document, "visibilitychange", again)
  const ro = new ResizeObserver(() => {
    fit()
    again()
  })
  ro.observe(canvas)
  const themes = new MutationObserver(() => {
    retint()
    again()
  })
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })

  bg.classList.add("melon-3d")
  t0 = performance.now()
  again()

  return () => {
    dead = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    themes.disconnect()
    cleanups.forEach((f) => f())
    ;[lineGeo, viaGeo, holeGeo, lineMat, viaMat, holeMat].forEach((o) => o.dispose())
    renderer.dispose()
    bg.classList.remove("melon-3d")
  }
}
`

export default (() => MelonHome) satisfies QuartzComponentConstructor
