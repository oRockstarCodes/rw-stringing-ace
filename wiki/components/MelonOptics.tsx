import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// An interactive ray diagram for mirrors and thin lenses. A note asks for one with an
// empty div:
//
//   <div class="melon-optics"></div>
//     Pick a concave mirror, convex mirror, converging lens or diverging lens, then move
//     the object (drag it, or use the slider) and change the focal length. The three
//     principal rays, the focal points and the image are redrawn, with q and M from the
//     mirror / thin lens equation and what kind of image it is. data-mode picks the
//     element shown first (concave, convex, converging, diverging).
//
// The script below fills it in on every page load (the text inside the div is only a
// fallback for Obsidian and link previews). Styles are in wiki/custom.scss, shared with
// the op amp diagrams (components/MelonOpAmp.tsx).

const MelonOptics: QuartzComponent = () => null

// A plain string inlined into the page: no backticks or dollar-brace in here.
MelonOptics.afterDOMLoaded = `
(() => {
  // Drawing: the axis is at y = 150, 7 px per cm, and the object is 7 cm tall
  const Y0 = 150
  const S = 7
  const HOBJ = 7
  const MODES = {
    concave: { mirror: true, sign: 1, label: "Concave mirror" },
    convex: { mirror: true, sign: -1, label: "Convex mirror" },
    converging: { mirror: false, sign: 1, label: "Converging lens" },
    diverging: { mirror: false, sign: -1, label: "Diverging lens" },
  }
  const ORDER = ["concave", "convex", "converging", "diverging"]
  let count = 0

  const minus = (s) => String(s).replace(/-/g, "\\u2212")
  const fmt = (x, d) => minus((Math.abs(x) < 0.005 ? 0 : x).toFixed(d))
  const near = (a, b) => Math.abs(a - b) < 0.26
  const pt = (p) => p[0].toFixed(1) + "," + p[1].toFixed(1)
  // A point far along direction d from p (the clip path trims it to the drawing)
  const far = (p, d) => {
    const len = Math.hypot(d[0], d[1]) || 1
    return [p[0] + (d[0] / len) * 2000, p[1] + (d[1] / len) * 2000]
  }

  // A vertical arrow standing on the axis at x, its tip at y
  const arrow = (x, y, cls) => {
    const up = y < Y0 ? 1 : -1
    const tip = Math.abs(y - Y0) < 8 ? Y0 - 8 * up : y
    return (
      '<g class="' + cls + '">' +
      '<line x1="' + x.toFixed(1) + '" y1="' + Y0 + '" x2="' + x.toFixed(1) + '" y2="' + (tip + 6 * up).toFixed(1) + '"/>' +
      '<polygon points="' + pt([x, tip]) + " " + pt([x - 6, tip + 11 * up]) + " " + pt([x + 6, tip + 11 * up]) + '"/>' +
      "</g>"
    )
  }

  // What the image is like, for the info panel
  function situation(mode, p, f) {
    const m = MODES[mode]
    const two = m.mirror ? "C" : "2F"
    if (m.sign < 0)
      return [
        "Any object distance",
        "A " + (m.mirror ? "convex mirror" : "diverging lens") + " always forms a <strong>virtual, upright, reduced</strong> image, inside F " +
          (m.mirror ? "behind the mirror." : "on the same side as the object."),
      ]
    if (near(p, f))
      return ["Object at F", "The rays leave <strong>parallel</strong>, so they never meet: there's no image (it's at infinity)."]
    if (p < f)
      return [
        "Object inside F",
        "The rays spread out after the " + (m.mirror ? "mirror" : "lens") + ", so the image is <strong>virtual, upright and enlarged</strong>, " +
          (m.mirror ? "behind the mirror. This is how a makeup mirror works." : "on the object's side. This is a magnifying glass."),
      ]
    if (near(p, 2 * f))
      return ["Object at " + two, "The image is <strong>real, inverted and the same size</strong>, also at " + two + "."]
    if (p < 2 * f)
      return ["Object between F and " + two, "The image is <strong>real, inverted and enlarged</strong>, beyond " + two + "."]
    return ["Object beyond " + two, "The image is <strong>real, inverted and reduced</strong>, between F and " + two + "."]
  }

  function rayInfo(mode) {
    const m = MODES[mode]
    const conv = m.sign > 0
    if (m.mirror)
      return {
        1: ["Parallel ray", conv
          ? "Comes in parallel to the axis and reflects <strong>through F</strong>."
          : "Comes in parallel to the axis and reflects <strong>as if it came from F</strong> behind the mirror."],
        2: ["Vertex ray", "Hits the centre of the mirror and reflects at the <strong>same angle</strong> on the other side of the axis (the law of reflection)."],
        3: ["Focal ray", conv
          ? "Travels along the line through <strong>F</strong> and reflects <strong>parallel</strong> to the axis."
          : "Heads toward <strong>F behind the mirror</strong> and reflects <strong>parallel</strong> to the axis."],
      }
    return {
      1: ["Parallel ray", conv
        ? "Comes in parallel to the axis and leaves <strong>through F</strong> on the far side."
        : "Comes in parallel to the axis and leaves <strong>as if it came from F</strong> on the object's side."],
      2: ["Central ray", "Goes straight through the <strong>centre</strong> of the lens without bending."],
      3: ["Focal ray", conv
        ? "Travels along the line through <strong>F on the object's side</strong> and leaves <strong>parallel</strong> to the axis."
        : "Heads toward <strong>F on the far side</strong> and leaves <strong>parallel</strong> to the axis."],
    }
  }

  function build(root) {
    const id = "melon-optics-" + ++count
    let mode = MODES[root.dataset.mode] ? root.dataset.mode : "concave"
    root.innerHTML =
      '<div class="op-modes" role="radiogroup" aria-label="Mirror or lens">' +
      ORDER.map((k) => '<button type="button" role="radio" class="oa-chip op-mode" data-mode="' + k + '" aria-checked="false">' + MODES[k].label + "</button>").join("") +
      "</div>" +
      '<svg class="oa-svg op-svg" viewBox="0 0 640 300" role="img" aria-label="Ray diagram">' +
      '<defs><clipPath id="' + id + '"><rect x="0" y="0" width="640" height="300"/></clipPath></defs>' +
      '<line class="op-axis" x1="0" y1="' + Y0 + '" x2="640" y2="' + Y0 + '"/>' +
      '<g class="op-element"></g>' +
      '<g class="op-marks"></g>' +
      '<g clip-path="url(#' + id + ')"><g class="op-rays"></g><g class="op-image"></g></g>' +
      '<g class="op-object"></g>' +
      "</svg>" +
      '<div class="oa-chips">' +
      [1, 2, 3].map((n) => '<button type="button" class="oa-chip op-chip" data-ray="' + n + '" aria-pressed="false"><span class="op-swatch op-swatch-' + n + '"></span><span class="op-chip-label"></span></button>').join("") +
      "</div>" +
      '<div class="oa-info" aria-live="polite"><div class="oa-info-title"></div><div class="oa-info-text"></div></div>' +
      '<div class="oa-controls">' +
      '<label><span>p</span><input type="range" data-k="p" min="2" max="45" step="0.5" value="25" aria-label="Object distance p"><output></output></label>' +
      '<label><span>|f|</span><input type="range" data-k="f" min="5" max="20" step="0.5" value="10" aria-label="Focal length"><output></output></label>' +
      "</div>" +
      '<p class="oa-readout"></p>'

    const svg = root.querySelector("svg")
    const g = (c) => root.querySelector(".op-" + c)
    const input = (k) => root.querySelector('input[data-k="' + k + '"]')
    const modes = Array.from(root.querySelectorAll(".op-mode"))
    const chips = Array.from(root.querySelectorAll(".op-chip"))
    const title = root.querySelector(".oa-info-title")
    const text = root.querySelector(".oa-info-text")
    let pinned = null
    let hovered = null
    let xe = 0

    const showInfo = () => {
      const ray = hovered || pinned
      root.dataset.ray = ray || ""
      chips.forEach((c) => {
        c.classList.toggle("is-active", c.dataset.ray === ray)
        c.setAttribute("aria-pressed", String(c.dataset.ray === pinned))
      })
      const d = ray ? rayInfo(mode)[ray] : situation(mode, +input("p").value, +input("f").value)
      title.innerHTML = d[0]
      text.innerHTML = d[1]
    }

    const update = () => {
      const m = MODES[mode]
      const p = +input("p").value
      const fAbs = +input("f").value
      const f = m.sign * fAbs
      // A mirror sends light back, so it sits further right to leave room in front of it
      xe = m.mirror ? 440 : 330
      const flip = m.mirror ? -1 : 1
      const xT = xe - p * S
      const yT = Y0 - HOBJ * S
      const T = [xT, yT]
      const atF = Math.abs(p - f) < 1e-6
      const q = atF ? Infinity : (p * f) / (p - f)
      const M = -q / p
      // Real images are past a lens but in front of a mirror
      const xI = xe + flip * q * S
      const yI = Y0 - M * HOBJ * S

      // The mirror or lens
      let el = ""
      if (m.mirror) {
        const a = xe - 14 * m.sign
        const b = xe + 14 * m.sign
        el += '<path class="op-mirror" d="M' + a + "," + (Y0 - 115) + " Q" + b + "," + Y0 + " " + a + "," + (Y0 + 115) + '"/>'
        // Hatching on the back of the mirror
        for (let t = 0.04; t < 1; t += 0.08) {
          const x = (1 - t) * (1 - t) * a + 2 * t * (1 - t) * b + t * t * a
          const y = Y0 - 115 + 230 * t
          el += '<line class="op-hatch" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x + 10).toFixed(1) + '" y2="' + (y - 8).toFixed(1) + '"/>'
        }
      } else if (m.sign > 0) {
        el += '<path class="op-lens" d="M' + xe + "," + (Y0 - 115) + " Q" + (xe + 26) + "," + Y0 + " " + xe + "," + (Y0 + 115) + " Q" + (xe - 26) + "," + Y0 + " " + xe + "," + (Y0 - 115) + 'Z"/>'
      } else {
        el += '<path class="op-lens" d="M' + (xe - 14) + "," + (Y0 - 115) + " L" + (xe + 14) + "," + (Y0 - 115) + " Q" + (xe + 2) + "," + Y0 + " " + (xe + 14) + "," + (Y0 + 115) +
          " L" + (xe - 14) + "," + (Y0 + 115) + " Q" + (xe - 2) + "," + Y0 + " " + (xe - 14) + "," + (Y0 - 115) + 'Z"/>'
      }
      g("element").innerHTML = el

      // Focal points (and C for a mirror)
      const marks = m.mirror
        ? [[xe - f * S, "F"], [xe - 2 * f * S, "C"]]
        : [[xe - fAbs * S, "F"], [xe + fAbs * S, "F"], [xe - 2 * fAbs * S, "2F"], [xe + 2 * fAbs * S, "2F"]]
      g("marks").innerHTML = marks
        .filter(([x]) => x > 4 && x < 636)
        .map(([x, l]) =>
          '<circle class="op-dot' + (l === "F" ? "" : " op-dot-faint") + '" cx="' + x.toFixed(1) + '" cy="' + Y0 + '" r="3.5"/>' +
          '<text class="op-mark-label" x="' + x.toFixed(1) + '" y="' + (Y0 + 20) + '" text-anchor="middle">' + l + "</text>")
        .join("")

      // The three principal rays: where each meets the mirror or lens, and which way it leaves
      const rays = []
      rays.push([1, [xe, yT], [flip * fAbs * S, m.sign * (Y0 - yT)]])
      rays.push([2, [xe, Y0], [flip * (xe - xT), Y0 - yT]])
      const fx = xe - f * S
      // (With the object at F the focal ray would run straight down the object, so it's left out)
      if (Math.abs(fx - xT) > 1.5) {
        const y = yT + ((Y0 - yT) * (xe - xT)) / (fx - xT)
        rays.push([3, [xe, y], [flip, 0]])
      }
      let html = ""
      rays.forEach(([n, P, d]) => {
        html += '<polyline class="op-ray op-ray-' + n + '" points="' + pt(T) + " " + pt(P) + " " + pt(far(P, d)) + '"/>'
        // A virtual image: the rays only appear to come from it
        if (!atF && q < 0) html += '<line class="op-ray op-virt op-ray-' + n + '" x1="' + P[0].toFixed(1) + '" y1="' + P[1].toFixed(1) + '" x2="' + xI.toFixed(1) + '" y2="' + yI.toFixed(1) + '"/>'
      })
      g("rays").innerHTML = html
      g("image").innerHTML = atF
        ? ""
        : arrow(xI, yI, "op-img " + (q > 0 ? "is-real" : "is-virtual")) +
          '<text class="op-mark-label" x="' + xI.toFixed(1) + '" y="' + (yI < Y0 ? yI - 12 : yI + 22).toFixed(1) + '" text-anchor="middle">image</text>'

      g("object").innerHTML =
        '<rect class="oa-hit-area" x="' + (xT - 16) + '" y="' + (yT - 26) + '" width="32" height="' + (Y0 - yT + 38) + '"/>' +
        arrow(xT, yT, "op-obj") +
        '<text class="op-mark-label" x="' + xT.toFixed(1) + '" y="' + (yT - 12) + '" text-anchor="middle">object</text>'

      input("p").nextElementSibling.textContent = fmt(p, 1) + " cm"
      input("f").nextElementSibling.textContent = fmt(fAbs, 1) + " cm"

      let out = (m.mirror ? "Mirror" : "Thin lens") + " equation 1/p + 1/q = 1/f, with p = " + fmt(p, 1) + " cm and f = " + fmt(f, 1) + " cm<br>"
      if (atF) {
        out += 'q \\u2192 \\u221e <span class="oa-flag">no image</span>'
      } else {
        const size = Math.abs(Math.abs(M) - 1) < 0.005 ? "same size" : Math.abs(M) > 1 ? "enlarged" : "reduced"
        out +=
          "q = pf / (p \\u2212 f) = " + fmt(q, 1) + " cm \\u00b7 M = \\u2212q/p = " + fmt(M, 2) +
          ' <span class="oa-flag">' + (q > 0 ? "real" : "virtual") + "</span>" +
          ' <span class="oa-flag">' + (M > 0 ? "upright" : "inverted") + "</span>" +
          ' <span class="oa-flag">' + size + "</span>" +
          '<br><span class="oa-note">' +
          (q > 0
            ? m.mirror ? "q > 0: a real image, in front of the mirror." : "q > 0: a real image, past the lens."
            : m.mirror ? "q < 0: a virtual image, behind the mirror." : "q < 0: a virtual image, in front of the lens.") +
          "</span>"
      }
      root.querySelector(".oa-readout").innerHTML = out

      modes.forEach((b) => {
        const on = b.dataset.mode === mode
        b.setAttribute("aria-checked", String(on))
        b.tabIndex = on ? 0 : -1
      })
      chips.forEach((c) => (c.querySelector(".op-chip-label").textContent = rayInfo(mode)[c.dataset.ray][0]))
      showInfo()
    }

    modes.forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.mode
        update()
      }),
    )
    // Arrow keys move between the options, like any radio group
    root.querySelector(".op-modes").addEventListener("keydown", (e) => {
      const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
      if (!step) return
      e.preventDefault()
      mode = ORDER[(ORDER.indexOf(mode) + step + ORDER.length) % ORDER.length]
      update()
      modes[ORDER.indexOf(mode)].focus()
    })

    // Pointing at a ray's button shows what that ray does and fades the other two
    chips.forEach((c) => {
      const n = c.dataset.ray
      c.addEventListener("mouseenter", () => { hovered = n; showInfo() })
      c.addEventListener("mouseleave", () => { hovered = null; showInfo() })
      c.addEventListener("click", () => { pinned = pinned === n ? null : n; showInfo() })
    })

    root.querySelectorAll("input").forEach((i) => i.addEventListener("input", update))

    // Drag the object along the axis
    const obj = g("object")
    const drag = (e) => {
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const at = svg.createSVGPoint()
      at.x = e.clientX
      at.y = e.clientY
      const x = at.matrixTransform(ctm.inverse()).x
      const range = input("p")
      const p = Math.round(((xe - x) / S) * 2) / 2
      range.value = String(Math.max(+range.min, Math.min(+range.max, p)))
      update()
    }
    obj.addEventListener("pointerdown", (e) => {
      obj.setPointerCapture(e.pointerId)
      root.classList.add("is-dragging")
      drag(e)
    })
    obj.addEventListener("pointermove", (e) => {
      if (obj.hasPointerCapture(e.pointerId)) drag(e)
    })
    const end = (e) => {
      if (obj.hasPointerCapture(e.pointerId)) obj.releasePointerCapture(e.pointerId)
      root.classList.remove("is-dragging")
    }
    obj.addEventListener("pointerup", end)
    obj.addEventListener("pointercancel", end)

    update()
  }

  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-optics:not([data-ready])").forEach((root) => {
      root.dataset.ready = "true"
      build(root)
    })
  })
})()
`

export default (() => MelonOptics) satisfies QuartzComponentConstructor
