import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// The 3D scene behind a course page's title (the <canvas class="melon-plate-gl"> that
// CoursePlate in MelonPlate.tsx draws when it is given a scene). Each course gets a small
// line drawing of its subject, in the same ink-and-rose wire style as the head on the
// home page, with one part per chapter:
//
//   class      COE 318  UML class cards, one per chapter, messages running up the
//                       inheritance arrows
//   chip       COE 328  an IC on a board, chapters on the pins in DIP order (pin 1 by
//                       the notch, then counterclockwise), signals running out the traces
//   schematic  ELE 302  a coil on an iron core, chapters on taps along the winding, flux
//                       running round the field loops
//   bohr/band  PCS 224  an atom, one orbit (energy level) per chapter
//   list       anything else: a wire icosahedron, chapters on its corners
//
// On a wide page the header grows into a stage under the title and the chapter links
// (the <nav class="melon-plate-parts"> CoursePlate draws) are pinned to their parts,
// following them as the drawing turns. Pointing at a part or its label stops the turn and
// lights the part up; clicking either opens the chapter. The flat motif below
// (MelonMotif.tsx) is hidden meanwhile. On a narrow page, or without WebGL, the drawing
// sits dimmed behind the title and the motif carries the links as before.
//
// The scene comes from the same table as the motif. three.js is loaded from static/ on
// first use and shared with the home page. The drawing grows in line by line, then
// sways, leans toward the pointer and stops while off screen. Reduced motion draws one
// still frame. Styles are in custom.scss.

const MelonCourse3D: QuartzComponent = () => null

// A plain string inlined into the page: no backticks or dollar-brace in here.
MelonCourse3D.afterDOMLoaded = `
(() => {
  // static/, worked out as the page first loads (see mhBase in MelonHome.tsx: the SPA router
  // keeps the first page's relative stylesheet link, so it can't be read later)
  window.__melonStatic =
    window.__melonStatic ||
    ((sheet) => (sheet ? sheet.href.replace(/index\\.css.*$/, "static/") : "/melon-files/static/"))(
      document.querySelector('link[href*="index.css"]'),
    )
  function mcThree() {
    if (!window.__mhThree) window.__mhThree = import(window.__melonStatic + "three.module.min.js")
    return window.__mhThree
  }

  // Seeded random numbers, so each course looks the same every visit
  function mcRng(seed) {
    let a = seed
    return () => {
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // ----- drawing helpers: every shape is a list of line segments (6 numbers each)
  const seg = (arr, a, b) => arr.push(a[0], a[1], a[2], b[0], b[1], b[2])
  const poly = (arr, pts) => {
    for (let i = 1; i < pts.length; i++) seg(arr, pts[i - 1], pts[i])
  }
  const box = (arr, c, w, h, d) => {
    const p = []
    for (let i = 0; i < 8; i++)
      p.push([c[0] + (i & 1 ? w : -w) / 2, c[1] + (i & 2 ? h : -h) / 2, c[2] + (i & 4 ? d : -d) / 2])
    const e = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]]
    e.forEach((x) => seg(arr, p[x[0]], p[x[1]]))
  }
  // a closed ring of points: centre c, radius r, in the plane spanned by axes u and v
  const ring = (c, r, u, v, n) => {
    const pts = []
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2
      const ca = Math.cos(a) * r
      const sa = Math.sin(a) * r
      pts.push([c[0] + u[0] * ca + v[0] * sa, c[1] + u[1] * ca + v[1] * sa, c[2] + u[2] * ca + v[2] * sa])
    }
    return pts
  }
  const add = (to, from) => {
    for (let i = 0; i < from.length; i++) to.push(from[i])
  }
  const X = [1, 0, 0]
  const Y = [0, 1, 0]
  const Z = [0, 0, 1]

  // ----- the scenes. Each is given the number of chapters and returns:
  //   ink, rose  its line segments
  //   parts      one per chapter: an anchor (where its link is pinned) and its own lines,
  //              drawn over the rest in rose while it is pointed at
  //   paths      the paths the moving dots follow, and dots: which path, speed, phase
  //   size       half the height of the view, in scene units
  //   reach      how far it can stretch sideways as it turns, so it stays in the frame
  //   pad        how far (px) a link sits from its anchor
  //   tilt       lean toward the camera; yaw, sway: its resting turn and how far it swings

  // COE 318: UML class cards hanging in a column, chapter 1 at the top, each pointing up
  // at a parent with a hollow inheritance arrow. Messages run up the arrows.
  function mcClass(n, rnd) {
    const ink = []
    const rose = []
    const paths = []
    const dots = []
    const parts = []
    const k = n > 0 ? Math.min(n, 14) : 6
    const W = 0.4
    const H = 0.26
    const D = 0.07
    const nodes = []
    for (let i = 0; i < k; i++) {
      const a = i * 2.39996
      const r = i === 0 ? 0 : 0.42 + 0.38 * rnd()
      nodes.push([Math.cos(a) * r, k > 1 ? 0.78 - (i / (k - 1)) * 1.56 : 0, Math.sin(a) * r])
    }
    nodes.forEach((c, i) => {
      const card = []
      box(card, c, W, H, D)
      // name, fields and methods compartments, front and back
      for (const z of [-D / 2, D / 2])
        for (const f of [0.34, 0.66]) {
          const y = c[1] + H / 2 - H * f
          seg(card, [c[0] - W / 2, y, c[2] + z], [c[0] + W / 2, y, c[2] + z])
        }
      add(ink, card)
      parts.push({ anchor: c, lines: card })
      if (i === 0) return
      const p = nodes[Math.floor(rnd() * i)]
      const from = [c[0], c[1] + H / 2, c[2]]
      const tip = [p[0], p[1] - H / 2, p[2]]
      const d = [tip[0] - from[0], tip[1] - from[1], tip[2] - from[2]]
      const len = Math.hypot(d[0], d[1], d[2]) || 1
      const u = [d[0] / len, d[1] / len, d[2] / len]
      const base = [tip[0] - u[0] * 0.08, tip[1] - u[1] * 0.08, tip[2] - u[2] * 0.08]
      // a side direction across the arrow (u x z)
      const sl = Math.hypot(u[1], u[0]) || 1
      const s = [(u[1] / sl) * 0.045, (-u[0] / sl) * 0.045, 0]
      seg(rose, from, base)
      poly(rose, [tip, [base[0] + s[0], base[1] + s[1], base[2]], [base[0] - s[0], base[1] - s[1], base[2]], tip])
      paths.push([from, base])
      dots.push({ path: paths.length - 1, speed: 0.3 + 0.25 * rnd(), phase: rnd() })
    })
    return { ink, rose, paths, dots, parts, size: 1.15, reach: 0.95, pad: 30, tilt: 0.12, yaw: 0.2, sway: 0.6 }
  }

  // COE 328: a DIP chip on a board. Gull-wing pins along both sides, a trace from each
  // pin out to a via, and signals running out along them. Chapter k is on pin k.
  function mcChip(n, rnd) {
    const ink = []
    const rose = []
    const paths = []
    const dots = []
    const parts = []
    const total = Math.max(8, n + (n % 2))
    const per = total / 2
    const L = Math.max(1.3, per * 0.17)
    const Wd = 0.62
    const Hb = 0.14
    const board = -0.16
    box(ink, [0, Hb / 2, 0], L, Hb, Wd)
    // the notch and the pin-1 mark on top
    const notch = []
    for (let i = 0; i <= 14; i++) {
      const a = -Math.PI / 2 + (i / 14) * Math.PI
      notch.push([-L / 2 + Math.cos(a) * 0.07, Hb, Math.sin(a) * 0.07])
    }
    poly(ink, notch)
    poly(ink, ring([-L / 2 + 0.17, Hb, Wd / 2 - 0.12], 0.035, X, Z, 12))
    // pins 1..per run left to right along the near side, the rest back along the far side
    for (let p = 0; p < total; p++) {
      const side = p < per ? 1 : -1
      const i = p < per ? p : total - 1 - p
      const x = -L / 2 + (L * (i + 0.5)) / per
      const z0 = (side * Wd) / 2
      const pin = []
      for (const dx of [-0.022, 0.022])
        poly(pin, [
          [x + dx, 0.07, z0],
          [x + dx, 0.07, z0 + side * 0.07],
          [x + dx, board, z0 + side * 0.12],
          [x + dx, board, z0 + side * 0.18],
        ])
      add(ink, pin)
      // the trace: out, a 45 degree jog, out again, then a via
      const a1 = 0.06 + 0.16 * rnd()
      const jog = (rnd() - 0.5) * 0.5
      const a2 = 0.08 + 0.2 * rnd()
      const p0 = [x, board, z0 + side * 0.18]
      const p1 = [x, board, p0[2] + side * a1]
      const p2 = [x + jog, board, p1[2] + side * Math.abs(jog)]
      const p3 = [x + jog, board, p2[2] + side * a2]
      const via = [p3[0], board, p3[2] + side * 0.03]
      const trace = []
      poly(trace, [p0, p1, p2, p3])
      poly(trace, ring(via, 0.03, X, Z, 10))
      add(rose, trace)
      paths.push([p0, p1, p2, p3])
      if (rnd() < 0.7) dots.push({ path: paths.length - 1, speed: 0.4 + 0.4 * rnd(), phase: rnd() })
      if (p < n) {
        add(pin, trace)
        parts.push({ anchor: via, lines: pin })
      }
    }
    // the board's edge, with mounting holes in the corners
    const bx = L / 2 + 0.65
    const bz = 1.22
    poly(ink, [[-bx, board, -bz], [bx, board, -bz], [bx, board, bz], [-bx, board, bz], [-bx, board, -bz]])
    for (const cx of [-1, 1]) for (const cz of [-1, 1]) poly(ink, ring([cx * (bx - 0.12), board, cz * (bz - 0.12)], 0.05, X, Z, 14))
    return { ink, rose, paths, dots, parts, size: 1.12, reach: bx + 0.3, pad: 6, tilt: 0.68, sway: 0.45, yaw: 0.3 }
  }

  // ELE 302: a coil wound on an iron core, with its leads, and the magnetic field loops
  // that thread through it. Each chapter is a tap on top of the winding. Flux runs round
  // the loops, current along the winding.
  function mcCoil(n, rnd) {
    const ink = []
    const rose = []
    const paths = []
    const dots = []
    const parts = []
    const turns = Math.max(6, Math.min(16, n + 2))
    const R = 0.3
    const H = 0.82
    const N = turns * 28
    const at = (s) => {
      const a = s * turns * Math.PI * 2
      return [-H + 2 * H * s, R * Math.cos(a), R * Math.sin(a)]
    }
    const helix = []
    for (let i = 0; i <= N; i++) helix.push(at(i / N))
    // the core: a rod, two end circles joined by a few lines
    const rc = 0.17
    const ends = [-1.02, 1.02]
    ends.forEach((x) => poly(ink, ring([x, 0, 0], rc, Y, Z, 28)))
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      seg(ink, [ends[0], rc * Math.cos(a), rc * Math.sin(a)], [ends[1], rc * Math.cos(a), rc * Math.sin(a)])
    }
    poly(ink, helix)
    // leads down to two terminals
    for (const sx of [-1, 1]) {
      poly(ink, [[sx * H, R, 0], [sx * 1.2, R, 0], [sx * 1.2, -0.62, 0]])
      poly(ink, ring([sx * 1.2, -0.66, 0], 0.04, X, Y, 12))
    }
    // the taps: a short wire up from the top of a turn, ending in a terminal
    for (let j = 0; j < Math.min(n, turns - 1); j++) {
      const t = Math.round(((j + 1) / (n + 1)) * turns)
      const top = at(t / turns)
      const end = [top[0], R + 0.3, 0]
      const tap = []
      seg(tap, top, [top[0], R + 0.26, 0])
      poly(tap, ring(end, 0.04, X, Y, 12))
      add(ink, tap)
      // its turn of the winding lights up with it
      for (let i = 1; i <= 28; i++) seg(tap, at((t - 0.5 + (i - 1) / 28) / turns), at((t - 0.5 + i / 28) / turns))
      parts.push({ anchor: [end[0], end[1] + 0.04, 0], lines: tap })
    }
    paths.push(helix)
    for (let i = 0; i < 4; i++) dots.push({ path: 0, speed: 0.07, phase: i / 4 })
    // field loops in planes through the axis
    for (let k = 0; k < 6; k++) {
      const phi = (k / 6) * Math.PI * 2 + Math.PI / 6
      const loop = []
      for (let i = 0; i <= 72; i++) {
        const s = (i / 72) * Math.PI * 2
        const rr = 0.56 + 0.4 * Math.sin(s)
        loop.push([1.2 * Math.cos(s), rr * Math.cos(phi), rr * Math.sin(phi)])
      }
      poly(rose, loop)
      paths.push(loop)
      for (let j = 0; j < 2; j++) dots.push({ path: paths.length - 1, speed: 0.09, phase: j / 2 + rnd() * 0.1 })
    }
    return { ink, rose, paths, dots, parts, size: 1.25, reach: 1.4, pad: 6, tilt: 0.28, sway: 0.45, yaw: -0.35 }
  }

  // PCS 224: an atom. A little nucleus, then one tilted orbit per chapter (energy level,
  // n = 1 innermost) with an electron on each, the outer ones slower.
  function mcBohr(n, rnd) {
    const ink = []
    const rose = []
    const paths = []
    const dots = []
    const parts = []
    const levels = n > 0 ? Math.min(n, 8) : 4
    for (let i = 0; i < 7; i++) {
      const c = [(rnd() - 0.5) * 0.16, (rnd() - 0.5) * 0.16, (rnd() - 0.5) * 0.16]
      const a = rnd() * Math.PI
      poly(i % 2 ? rose : ink, ring(c, 0.065, [Math.cos(a), Math.sin(a), 0], [0, 0, 1], 12))
    }
    for (let k = 1; k <= levels; k++) {
      const r = levels > 1 ? 0.32 + ((k - 1) * 0.82) / (levels - 1) : 0.7
      const tx = (rnd() - 0.5) * 1.5
      const ty = (rnd() - 0.5) * 2.2
      // axes of the orbit's plane: the plane facing the camera, turned about x by tx, then
      // about y by ty, so no orbit starts out edge-on
      const turn = (p) => {
        const y1 = p[1] * Math.cos(tx) - p[2] * Math.sin(tx)
        const z1 = p[1] * Math.sin(tx) + p[2] * Math.cos(tx)
        return [p[0] * Math.cos(ty) + z1 * Math.sin(ty), y1, -p[0] * Math.sin(ty) + z1 * Math.cos(ty)]
      }
      const u = turn(X)
      const orbit = ring([0, 0, 0], r, u, turn(Y), 96)
      const lines = []
      poly(lines, orbit)
      add(ink, lines)
      paths.push(orbit)
      dots.push({ path: paths.length - 1, speed: (k % 2 ? 1 : -1) * 0.32 / Math.pow(k, 1.1), phase: rnd() })
      // links alternate right and left
      const side = k % 2 ? 1 : -1
      if (k <= n) parts.push({ anchor: [u[0] * r * side, u[1] * r * side, u[2] * r * side], lines })
    }
    return { ink, rose, paths, dots, parts, size: 1.2, reach: 1.2, pad: 6, tilt: 0.1, sway: 0.6 }
  }

  // Any other course: a wire icosahedron with a smaller one inside, chapters on its corners
  function mcPoly(T, n, rnd) {
    const ink = []
    const rose = []
    const paths = []
    const dots = []
    const parts = []
    const edges = (r, out) => {
      const g = new T.EdgesGeometry(new T.IcosahedronGeometry(r, 0))
      const a = Array.from(g.attributes.position.array)
      g.dispose()
      add(out, a)
      return a
    }
    const outer = edges(1, ink)
    edges(0.48, rose)
    const corners = []
    const same = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1e-4
    for (let i = 0; i < outer.length; i += 6) {
      const a = outer.slice(i, i + 3)
      const b = outer.slice(i + 3, i + 6)
      ;[a, b].forEach((v) => {
        if (!corners.some((c) => same(c, v))) corners.push(v)
      })
      if (rnd() < 0.3) {
        paths.push([a, b])
        dots.push({ path: paths.length - 1, speed: 0.3 + 0.3 * rnd(), phase: rnd() })
      }
    }
    corners.slice(0, n).forEach((c) => {
      const lines = []
      for (let i = 0; i < outer.length; i += 6)
        if (same(outer.slice(i, i + 3), c) || same(outer.slice(i + 3, i + 6), c)) add(lines, outer.slice(i, i + 6))
      parts.push({ anchor: c, lines })
    })
    return { ink, rose, paths, dots, parts, size: 1.2, reach: 1.05, pad: 6, tilt: 0.3, sway: 0.7 }
  }

  function mcScene(T, plate, canvas, kind, reduced) {
    let renderer
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" })
    } catch (e) {
      return () => {}
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

    const stage = plate.querySelector(".melon-plate-stage")
    const title = stage.querySelector(".melon-course-title")
    const course = plate.closest(".melon-course")
    const labels = [...stage.querySelectorAll(".melon-plate-link")]

    const scene = new T.Scene()
    const camera = new T.PerspectiveCamera(28, 2, 0.1, 100)
    const read = () => {
      // (read off <body>, where an edition sets its own palette)
      const css = getComputedStyle(document.body)
      const get = (name, fallback) => new T.Color(css.getPropertyValue(name).trim() || fallback)
      return { ink: get("--dark", "#231f20"), rose: get("--secondary", "#8c4a67"), paper: get("--light", "#fbf6f8") }
    }
    let pal = read()
    // lines further back fade into the page
    scene.fog = new T.Fog(pal.paper, 1, 10)

    let seed = 5
    for (let i = 0; i < kind.length; i++) seed = (seed * 31 + kind.charCodeAt(i)) | 0
    const rnd = mcRng(seed + labels.length * 977)
    const count = labels.length
    const art =
      kind === "class" ? mcClass(count, rnd)
      : kind === "chip" ? mcChip(count, rnd)
      : kind === "schematic" ? mcCoil(count, rnd)
      : kind === "bohr" || kind === "band" ? mcBohr(count, rnd)
      : mcPoly(T, count, rnd)
    // chapters that have a part to sit on
    const nParts = Math.min(labels.length, art.parts.length)

    // root: where it sits in the view. lean: follows the pointer. tilt: toward the camera.
    // spin: the scene's own turn.
    const root = new T.Group()
    const lean = new T.Group()
    const tilt = new T.Group()
    const spin = new T.Group()
    scene.add(root)
    root.add(lean)
    lean.add(tilt)
    tilt.add(spin)
    tilt.rotation.x = art.tilt || 0

    const owned = []
    const lines = (arr, mat) => {
      const g = new T.BufferGeometry()
      g.setAttribute("position", new T.Float32BufferAttribute(arr, 3))
      const l = new T.LineSegments(g, mat)
      spin.add(l)
      owned.push(g)
      return { g, l, n: arr.length / 6 }
    }
    const inkMat = new T.LineBasicMaterial({ color: pal.ink, transparent: true, opacity: 0.78 })
    const roseMat = new T.LineBasicMaterial({ color: pal.rose, transparent: true, opacity: 0.9 })
    const hotMat = new T.LineBasicMaterial({ color: pal.rose, transparent: true, opacity: 1, depthTest: false })
    owned.push(inkMat, roseMat, hotMat)
    const inkL = lines(art.ink, inkMat)
    const roseL = lines(art.rose, roseMat)
    // each chapter's part again, drawn on top in rose while it is pointed at
    const hot = art.parts.slice(0, nParts).map((p) => {
      const h = lines(p.lines, hotMat)
      h.l.visible = false
      h.l.renderOrder = 2
      return h.l
    })

    // round dot sprites: the moving signals, and a marker on each chapter's anchor
    const spot = document.createElement("canvas")
    spot.width = spot.height = 32
    const sg = spot.getContext("2d")
    sg.beginPath()
    sg.arc(16, 16, 14, 0, Math.PI * 2)
    sg.fillStyle = "#fff"
    sg.fill()
    const sprite = new T.CanvasTexture(spot)
    const dotMat = (size) =>
      new T.PointsMaterial({ color: pal.rose, size, sizeAttenuation: false, map: sprite, transparent: true, alphaTest: 0.4, depthWrite: false })
    const nd = art.dots.length
    const dotPos = new Float32Array(Math.max(1, nd) * 3)
    const dotGeo = new T.BufferGeometry()
    dotGeo.setAttribute("position", new T.BufferAttribute(dotPos, 3))
    const runMat = dotMat(6)
    spin.add(new T.Points(dotGeo, runMat))

    const anchorGeo = new T.BufferGeometry()
    anchorGeo.setAttribute("position", new T.Float32BufferAttribute(art.parts.slice(0, nParts).flatMap((p) => p.anchor), 3))
    const anchorMat = dotMat(7)
    const anchors = new T.Points(anchorGeo, anchorMat)
    anchors.visible = false
    spin.add(anchors)
    owned.push(dotGeo, runMat, anchorGeo, anchorMat, sprite)

    // arc lengths along each path, so the dots move at an even speed
    const lens = art.paths.map((p) => {
      const c = [0]
      for (let i = 1; i < p.length; i++)
        c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1], p[i][2] - p[i - 1][2]))
      return c
    })
    const place = (k, u, o) => {
      const p = art.paths[k]
      const c = lens[k]
      const s = u * c[c.length - 1]
      let i = 1
      while (i < c.length - 1 && c[i] < s) i++
      const f = (s - c[i - 1]) / (c[i] - c[i - 1] || 1)
      for (let a = 0; a < 3; a++) dotPos[o + a] = p[i - 1][a] + (p[i][a] - p[i - 1][a]) * f
    }

    const retint = () => {
      pal = read()
      inkMat.color.copy(pal.ink)
      roseMat.color.copy(pal.rose)
      hotMat.color.copy(pal.rose)
      runMat.color.copy(pal.rose)
      anchorMat.color.copy(pal.rose)
      scene.fog.color.copy(pal.paper)
    }

    // Linked (a course with chapters): the stage grows under the title and the drawing
    // sits centred in that space, with room either side for the links. On a wide page the
    // links carry the chapter names and the motif below steps aside; on a narrow one
    // (compact) they shrink to numbered badges and the motif stays for the names.
    // Without chapters the drawing sits at the right of the title on a wide header, or
    // centred behind it (dimmed by the stylesheet) on a narrow one.
    let linked = false
    let compact = false
    let baseY = 0
    let cw = 1
    let chh = 1
    const fit = () => {
      linked = nParts > 0
      compact = linked && plate.clientWidth < 640
      plate.classList.toggle("melon-linked", linked)
      plate.classList.toggle("melon-compact", compact)
      if (course) course.classList.toggle("melon-course-linked", linked && !compact)
      anchors.visible = linked
      cw = canvas.clientWidth || 1
      chh = canvas.clientHeight || 1
      renderer.setSize(cw, chh, false)
      camera.aspect = cw / chh
      camera.updateProjectionMatrix()
      let vis = art.size
      if (linked) {
        const top = Math.min(chh * 0.5, title.offsetTop + title.offsetHeight + 12)
        const free = chh - top
        vis = (art.size * 1.1 * chh) / free
        // keep the links' room clear on both sides (a badge needs much less than a name)
        const room = compact ? 44 : 170
        vis = Math.max(vis, (art.reach * (cw / 2)) / (camera.aspect * Math.max(80, cw / 2 - room)))
        root.position.x = 0
        baseY = (0.5 - (top + free / 2) / chh) * 2 * vis
      } else {
        const halfW = vis * camera.aspect
        root.position.x = cw >= 640 && camera.aspect > 1.7 ? Math.min(halfW * 0.56, halfW - art.reach - 0.08) : 0
        baseY = 0
      }
      const d = vis / Math.tan((camera.fov * Math.PI) / 360)
      camera.position.set(0, 0, d)
      camera.lookAt(0, 0, 0)
      scene.fog.near = d - 0.3
      scene.fog.far = d + 2.8
    }
    fit()

    let leanX = 0
    let leanY = 0
    let dead = false
    let visible = true
    const cleanups = []
    const on = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts)
      cleanups.push(() => el.removeEventListener(type, fn, opts))
    }
    if (!reduced)
      on(window, "pointermove", (e) => {
        leanX = (e.clientY / window.innerHeight - 0.5) * 2
        leanY = (e.clientX / window.innerWidth - 0.5) * 2
      }, { passive: true })

    // ----- pointing at chapters: a link, or within reach of its part's anchor
    const screen = new Float32Array(nParts * 2)
    let onLabel = -1
    let near = -1
    let hover = -1
    const setHover = () => {
      const h = onLabel >= 0 ? onLabel : near
      if (h === hover) return
      hover = h
      hot.forEach((l, i) => (l.visible = i === h))
      labels.forEach((el, i) => el.classList.toggle("is-hot", i === h))
      stage.classList.toggle("is-pointing", near >= 0)
      again()
    }
    labels.slice(0, nParts).forEach((el, i) => {
      const enter = () => {
        onLabel = i
        setHover()
      }
      const leave = () => {
        if (onLabel === i) onLabel = -1
        setHover()
      }
      on(el, "pointerenter", enter)
      on(el, "pointerleave", leave)
      on(el, "focus", enter)
      on(el, "blur", leave)
    })
    // the chapter whose anchor is nearest a point on the page, within reach (a finger
    // gets a wider reach than a mouse)
    const nearest = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const reach = e.pointerType === "mouse" ? 36 : 44
      let best = -1
      let bd = reach * reach
      for (let i = 0; i < nParts; i++) {
        const dx = screen[i * 2] - x
        const dy = screen[i * 2 + 1] - y
        if (dx * dx + dy * dy < bd) {
          bd = dx * dx + dy * dy
          best = i
        }
      }
      return best
    }
    on(stage, "pointermove", (e) => {
      // a finger moving is a scroll, not a point
      if (!linked || e.pointerType === "touch") return
      near = nearest(e)
      setHover()
    })
    on(stage, "pointerleave", () => {
      near = -1
      setHover()
    })
    // the tap or click itself decides, so a finger (which never hovers) works too
    on(stage, "click", (e) => {
      if (!linked || e.target.closest("a")) return
      const i = nearest(e)
      if (i >= 0) labels[i].click()
    })

    // pin each link beside its anchor, on the side away from the middle; links on parts
    // turned away from the camera step back. Links on the same side that would overlap
    // are nudged apart vertically.
    const v = new T.Vector3()
    const mid = new T.Vector3()
    const spots = []
    for (let i = 0; i < nParts; i++) spots.push({ i, x: 0, y: 0, left: false, back: false })
    const pin = (show) => {
      mid.set(0, 0, 0)
      spin.localToWorld(mid)
      const midZ = mid.z
      mid.project(camera)
      const mx = ((mid.x + 1) / 2) * cw
      spots.forEach((s) => {
        const a = art.parts[s.i].anchor
        v.set(a[0], a[1], a[2])
        spin.localToWorld(v)
        s.back = v.z < midZ - 0.15
        v.project(camera)
        s.x = ((v.x + 1) / 2) * cw
        s.y = ((1 - v.y) / 2) * chh
        screen[s.i * 2] = s.x
        screen[s.i * 2 + 1] = s.y
        s.left = s.x < mx
      })
      for (const side of [true, false]) {
        const col = spots.filter((s) => s.left === side).sort((a, b) => a.y - b.y)
        const gap = compact ? 34 : 22
        for (let j = 1; j < col.length; j++) col[j].y = Math.max(col[j].y, col[j - 1].y + gap)
      }
      spots.forEach((s) => {
        const el = labels[s.i]
        el.style.transform =
          "translate(" + s.x.toFixed(1) + "px," + s.y.toFixed(1) + "px) translate(" +
          (s.left ? "calc(-100% - " + art.pad + "px)" : art.pad + "px") + ",-50%)"
        el.style.opacity = String(show * (s.back && s.i !== hover ? 0.55 : 1))
        el.style.zIndex = s.back ? "1" : "2"
        el.classList.toggle("is-left", s.left)
      })
    }

    const out3 = (t) => 1 - Math.pow(1 - t, 3)
    const clamp = (v) => Math.min(1, Math.max(0, v))
    let intro = reduced ? 1 : 0
    let clock = reduced ? 3 : 0
    // the turn has its own clock, which slows to a stop while a chapter is pointed at
    let turn = clock
    let pace = 1
    let t0 = performance.now()
    let last = t0

    const draw = (dt) => {
      // grows in: the ink drawing first, then the rose, then the dots and links
      inkL.g.setDrawRange(0, Math.floor(inkL.n * out3(clamp(intro / 0.65))) * 2)
      roseL.g.setDrawRange(0, Math.floor(roseL.n * out3(clamp((intro - 0.3) / 0.6))) * 2)
      dotGeo.setDrawRange(0, intro > 0.8 ? nd : 0)
      anchorGeo.setDrawRange(0, intro > 0.7 ? nParts : 0)

      clock += dt
      pace += ((hover >= 0 ? 0 : 1) - pace) * Math.min(1, dt * 5)
      turn += dt * pace
      art.dots.forEach((dot, i) => {
        const u = (((clock * dot.speed + dot.phase) % 1) + 1) % 1
        place(dot.path, u, i * 3)
      })
      dotGeo.attributes.position.needsUpdate = true

      spin.rotation.y = (art.yaw || 0) + Math.sin(turn * 0.35) * art.sway
      // a little turn-in during the intro
      spin.rotation.y += (1 - out3(clamp(intro))) * -0.9
      const k = Math.min(1, dt * 3)
      lean.rotation.x += (leanX * 0.14 * pace - lean.rotation.x) * k
      lean.rotation.y += (leanY * 0.3 * pace - lean.rotation.y) * k
      root.position.y = baseY + (reduced ? 0 : Math.sin(clock * 0.7) * 0.025)

      renderer.render(scene, camera)
      if (linked) pin(clamp((intro - 0.7) / 0.3))
    }

    let raf = 0
    function frame(now) {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (intro < 1) intro = Math.min(1, (now - t0) / 2200)
      draw(reduced ? 0 : dt)
      if (!dead && visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame)
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
    ro.observe(plate)
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting
      if (visible) again()
    })
    io.observe(canvas)
    const themes = new MutationObserver(() => {
      retint()
      again()
    })
    themes.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })

    plate.classList.add("melon-3d")
    t0 = performance.now()
    again()

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      themes.disconnect()
      cleanups.forEach((f) => f())
      owned.forEach((o) => o.dispose())
      renderer.dispose()
      plate.classList.remove("melon-3d", "melon-linked")
      if (course) course.classList.remove("melon-course-linked")
    }
  }

  document.addEventListener("nav", () => {
    const plate = document.querySelector(".melon-plate[data-scene]")
    const canvas = plate && plate.querySelector(".melon-plate-gl")
    if (!canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let dead = false
    let dispose = () => {}
    window.addCleanup(() => {
      dead = true
      dispose()
    })
    mcThree()
      .then((T) => {
        if (dead) return
        dispose = mcScene(T, plate, canvas, plate.dataset.scene || "list", reduced)
      })
      .catch(() => {})
  })
})()
`

export default (() => MelonCourse3D) satisfies QuartzComponentConstructor
