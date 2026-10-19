import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Interactive capacitor and inductor diagrams. A note asks for one with an empty div:
//
//   <div class="melon-capind" data-view="cap"></div>
//     A capacitor in an RC circuit. Flip the switch between the source, a short and open,
//     and watch the charge pile up, the field grow, the current flow (and shrink), and
//     v_C and i trace out on a live chart.
//
//   <div class="melon-capind" data-view="ind"></div>
//     The same for an inductor in an RL circuit: the magnetic field follows the current,
//     v_L spikes when the current is forced to change (try "Open").
//
//   <div class="melon-capind" data-view="slope"></div>
//     The element laws as slopes. Pick a waveform for v_C (or i_L), drag along it, and see
//     that i_C = C dv/dt (or v_L = L di/dt) is just the slope.
//
// The script below fills them in on every page load (the text inside the div is only
// a fallback for Obsidian and link previews). Styles are in wiki/custom.scss, which
// shares the op amp diagrams' oa-* classes and adds the ci-* ones.

const MelonCapInd: QuartzComponent = () => null

MelonCapInd.afterDOMLoaded = `
(() => {
  const VS = 5 // source voltage
  const SPARK = 2000 // the "open" switch on the inductor is modelled as a 2 kOhm spark gap
  const WIN = 8 // seconds shown on the strip chart
  const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
  const minus = (s) => String(s).replace(/-/g, "\\u2212")
  const sub = (base, s) => base + '<tspan class="oa-sub" dy="4">' + s + '</tspan><tspan dy="-4">&#8203;</tspan>'

  // 1234 -> "1.23 k", 0.0012 -> "1.20 m", with a unit
  const eng = (x, u) => {
    const a = Math.abs(x)
    if (a < 5e-10) return "0 " + u
    let s = x
    let p = ""
    if (a >= 1e3) { s = x / 1e3; p = "k" }
    else if (a < 1e-3) { s = x * 1e6; p = "\\u00b5" }
    else if (a < 1) { s = x * 1e3; p = "m" }
    const d = Math.abs(s) >= 100 ? 0 : Math.abs(s) >= 10 ? 1 : 2
    return minus(s.toFixed(d)) + " " + p + u
  }

  const infoPanel = '<div class="oa-info" aria-live="polite"><div class="oa-info-title"></div><div class="oa-info-text"></div></div>'
  const chipRow = (list, label) =>
    '<div class="oa-chips" role="group" aria-label="' + label + '">' +
    list.map(([key, text]) => '<button type="button" class="oa-chip" data-key="' + key + '" aria-pressed="false">' + text + "</button>").join("") +
    "</div>"
  const slider = (key, label, min, max, step, val) =>
    '<label><span>' + label + '</span><input type="range" data-k="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output></output></label>'

  // Runs fn(dt) every frame while the diagram is on screen; stops for good once the page
  // swaps it out (Quartz replaces the page body on navigation)
  function animate(root, fn) {
    let visible = typeof IntersectionObserver === "undefined"
    let first = true
    if (!visible) {
      new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting
        if (visible && first) { first = false; root.dispatchEvent(new CustomEvent("ci-visible")) }
      }, { threshold: 0.25 }).observe(root)
    }
    let last = 0
    const frame = (now) => {
      if (!root.isConnected) return
      requestAnimationFrame(frame)
      if (!visible) { last = 0; return }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
      last = now
      if (dt > 0) fn(dt)
    }
    requestAnimationFrame(frame)
  }

  // ---------- Paths for the little current dots ----------

  function makeChain(points, closed) {
    const pts = closed ? points.concat([points[0]]) : points
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    return { pts, cum, len: cum[cum.length - 1] }
  }
  function pointAt(ch, d) {
    d = ((d % ch.len) + ch.len) % ch.len
    let i = 1
    while (i < ch.cum.length - 1 && ch.cum[i] < d) i++
    const f = (d - ch.cum[i - 1]) / (ch.cum[i] - ch.cum[i - 1] || 1)
    return [ch.pts[i - 1][0] + (ch.pts[i][0] - ch.pts[i - 1][0]) * f, ch.pts[i - 1][1] + (ch.pts[i][1] - ch.pts[i - 1][1]) * f]
  }

  // ---------- RC and RL circuits ----------

  function buildCircuit(root, kind) {
    const cap = kind === "cap"
    const RAIL = 250, CT = 145, CB = 205
    const P = cap
      ? { rMin: 100, rMax: 2000, rStep: 100, r0: 1000, eMin: 100, eMax: 2000, eStep: 100, e0: 1000 }
      : { rMin: 1, rMax: 10, rStep: 1, r0: 5, eMin: 0.5, eMax: 5, eStep: 0.5, e0: 2.5 }

    // Each chain is the path conventional current follows in that switch position
    const CHAINS = cap
      ? {
          src: [
            makeChain([[60, 96], [60, 40], [130, 40], [200, 110], [400, 110], [400, CT]], false),
            makeChain([[400, CB], [400, RAIL], [60, RAIL], [60, 112]], false),
          ],
          short: [makeChain([[400, CT], [400, 110], [200, 110], [130, 180], [130, RAIL], [400, RAIL], [400, CB]], false)],
          open: [],
        }
      : {
          src: [makeChain([[60, 96], [60, 40], [130, 40], [200, 110], [400, 110], [400, CT], [400, CB], [400, RAIL], [60, RAIL], [60, 112]], false)],
          short: [makeChain([[400, CT], [400, CB], [400, RAIL], [130, RAIL], [130, 180], [200, 110], [400, 110]], true)],
          open: [],
        }

    const element = cap
      ? '<line class="oa-line" x1="400" y1="110" x2="400" y2="' + CT + '"/>' +
        '<line class="oa-line ci-plate" x1="360" y1="' + CT + '" x2="440" y2="' + CT + '"/>' +
        '<line class="oa-line ci-plate" x1="360" y1="' + CB + '" x2="440" y2="' + CB + '"/>' +
        '<line class="oa-line" x1="400" y1="' + CB + '" x2="400" y2="' + RAIL + '"/>' +
        '<g class="ci-field">' +
        [370, 385, 400, 415, 430].map((x) => '<path class="ci-fieldline" d="M' + x + ' 168 L' + x + ' 184 M' + (x - 4) + ' 178 L' + x + ' 184 L' + (x + 4) + ' 178"/>').join("") +
        "</g>" +
        [0, 1, 2, 3, 4, 5, 6].map((k) => '<text class="ci-charge" data-q="p" x="' + (370 + 10 * k) + '" y="163" text-anchor="middle">+</text>').join("") +
        [0, 1, 2, 3, 4, 5, 6].map((k) => '<text class="ci-charge" data-q="n" x="' + (370 + 10 * k) + '" y="199" text-anchor="middle">&minus;</text>').join("") +
        '<text class="oa-caption" x="470" y="140">electric field E</text>'
      : '<line class="oa-line" x1="400" y1="110" x2="400" y2="' + CT + '"/>' +
        '<g class="ci-halo">' +
        [[36, 12], [60, 24], [86, 34]].map(([w, h]) =>
          '<path class="ci-fieldline" d="M400 131 C' + (400 + w) + ' ' + (131 - h) + ' ' + (400 + w) + ' ' + (219 + h) + ' 400 219"/>' +
          '<path class="ci-fieldline" d="M400 131 C' + (400 - w) + ' ' + (131 - h) + ' ' + (400 - w) + ' ' + (219 + h) + ' 400 219"/>').join("") +
        "</g>" +
        '<path class="oa-line ci-coil" d="M400 ' + CT + ' a14 10 0 0 1 0 20 a14 10 0 0 1 0 20 a14 10 0 0 1 0 20"/>' +
        '<line class="oa-line" x1="400" y1="' + CB + '" x2="400" y2="' + RAIL + '"/>' +
        '<text class="oa-caption" x="470" y="140">magnetic field B</text>'

    root.innerHTML =
      '<svg class="oa-svg ci-circuit" viewBox="0 0 640 275" role="img" aria-label="' +
      (cap ? "A source, a switch, a resistor and a capacitor in a loop" : "A source, a switch, a resistor and an inductor in a loop") + '">' +
      // wires
      '<polyline class="oa-line" points="60,96 60,40 130,40"/>' +
      '<polyline class="oa-line" points="60,112 60,' + RAIL + ' 400,' + RAIL + '"/>' +
      '<line class="oa-line" x1="130" y1="180" x2="130" y2="' + RAIL + '"/>' +
      '<line class="oa-line" x1="200" y1="110" x2="250" y2="110"/>' +
      '<polyline class="oa-line" points="250,110 258,110 264,96 276,124 288,96 300,124 312,96 322,124 328,110 330,110"/>' +
      '<polyline class="oa-line" points="330,110 400,110"/>' +
      // source
      '<line class="oa-line" x1="44" y1="96" x2="76" y2="96"/><line class="oa-line" x1="51" y1="112" x2="69" y2="112"/>' +
      '<text class="oa-sign" x="82" y="94">+</text>' +
      '<text class="oa-label" x="36" y="108" text-anchor="end">5 V</text>' +
      // switch: pivot, two throws, and a lever that swings between them
      '<circle class="oa-term" cx="130" cy="40" r="4.5"/><circle class="oa-term" cx="130" cy="180" r="4.5"/>' +
      '<polyline class="ci-spark" points="101,110 112,92 106,84 122,66 116,58 130,40"/>' +
      '<g class="ci-lever"><line class="oa-line ci-lever-line" x1="200" y1="110" x2="101" y2="110"/></g>' +
      '<circle class="oa-term" cx="200" cy="110" r="4.5"/>' +
      '<text class="oa-caption" x="136" y="30">source</text><text class="oa-caption" x="136" y="204">short</text>' +
      // the element
      element +
      '<text class="oa-label" x="290" y="86" text-anchor="middle" data-val="r"></text>' +
      '<text class="oa-val ci-big" x="290" y="136" text-anchor="middle">' + sub("i", cap ? "C" : "L") + '<tspan data-val="i"></tspan></text>' +
      '<text class="oa-label ci-big" x="470" y="166">' + sub("v", cap ? "C" : "L") + '<tspan data-val="v"></tspan></text>' +
      '<text class="oa-val ci-big" x="470" y="188" data-val="e"></text>' +
      // stored energy
      '<text class="oa-caption" x="599" y="108" text-anchor="middle">energy</text>' +
      '<rect class="ci-bar" x="590" y="120" width="18" height="100" rx="3"/>' +
      '<rect class="ci-bar-fill" x="590" y="220" width="18" height="0" rx="3" data-val="bar"/>' +
      '<text class="oa-val" x="599" y="238" text-anchor="middle" data-val="w"></text>' +
      '<g class="ci-dots"></g>' +
      "</svg>" +
      chipRow(
        cap
          ? [["src", "Charge (source)"], ["short", "Discharge (short)"], ["open", "Open (hold)"], ["restart", "Restart"]]
          : [["src", "Energize (source)"], ["short", "Short (freewheel)"], ["open", "Open (break it!)"], ["restart", "Restart"]],
        "Switch position",
      ) +
      infoPanel +
      '<svg class="oa-svg ci-chart" viewBox="0 0 640 264" role="img" aria-label="Live graph of the voltage and current">' +
      [[30, "a"], [154, "b"]].map(([y0, id]) =>
        '<rect class="ci-frame" x="64" y="' + y0 + '" width="560" height="80"/>' +
        '<line class="ci-zero" data-val="zero-' + id + '" x1="64" x2="624"/>' +
        '<line class="ci-ref" data-val="ref-' + id + '" x1="64" x2="624"/>' +
        '<text class="oa-small ci-tick" x="58" text-anchor="end" data-val="tick0-' + id + '"></text>' +
        '<text class="oa-small ci-tick" x="58" text-anchor="end" data-val="tick1-' + id + '"></text>' +
        '<path class="ci-trace ci-' + id + '" data-val="path-' + id + '"/>' +
        '<text class="oa-label ci-title" x="64" y="' + (y0 - 9) + '">' + "</text>").join("") +
      '<text class="oa-caption" x="624" y="256" text-anchor="end">last 8 seconds, now at the right</text>' +
      "</svg>" +
      '<div class="oa-controls">' +
      slider("r", "R", P.rMin, P.rMax, P.rStep, P.r0) +
      slider("e", cap ? "C" : "L", P.eMin, P.eMax, P.eStep, P.e0) +
      "</div>" +
      '<p class="oa-readout"></p>'

    // The chart titles hold sub/superscripts, so they're filled in here
    const titles = root.querySelectorAll(".ci-title")
    titles[0].innerHTML = cap ? sub("v", "C") + " (can&rsquo;t jump)" : sub("i", "L") + " (can&rsquo;t jump)"
    titles[1].innerHTML = cap ? sub("i", "C") + " (can jump)" : sub("v", "L") + " (can jump)"
    titles[0].classList.add("ci-title-a")
    titles[1].classList.add("ci-title-b")

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const rIn = root.querySelector('input[data-k="r"]')
    const eIn = root.querySelector('input[data-k="e"]')
    const lever = root.querySelector(".ci-lever")
    const spark = root.querySelector(".ci-spark")
    const dotsG = root.querySelector(".ci-dots")
    const field = root.querySelector(".ci-field")
    const halo = root.querySelector(".ci-halo")
    const charges = Array.from(root.querySelectorAll(".ci-charge"))
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")
    const chips = Array.from(root.querySelectorAll(".oa-chip"))

    const st = { mode: "open", x: 0, t: 0, s: 0, spark: 0, spike: 0, readAt: 0 }
    let hist = []
    let dots = []

    const params = () => ({ R: +rIn.value, E: cap ? +eIn.value * 1e-6 : +eIn.value })

    // x is the stored quantity (v_C or i_L), y the one that can jump (i_C or v_L)
    function physics(mode, x, R, E) {
      if (cap) {
        if (mode === "open") return { target: x, tau: 1, y: 0 }
        const tg = mode === "src" ? VS : 0
        return { target: tg, tau: R * E, y: (tg - x) / R }
      }
      if (mode === "open") return { target: 0, tau: E / (R + SPARK), y: -(R + SPARK) * x }
      if (mode === "src") return { target: VS / R, tau: E / R, y: VS - R * x }
      return { target: 0, tau: E / R, y: -R * x }
    }

    const rebuildDots = () => {
      dotsG.innerHTML = ""
      dots = []
      CHAINS[st.mode].forEach((ch) => {
        const n = Math.max(2, Math.round(ch.len / 26))
        for (let k = 0; k < n; k++) {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle")
          c.setAttribute("r", "3")
          c.setAttribute("class", "ci-dot")
          dotsG.appendChild(c)
          dots.push({ el: c, ch, off: (k * ch.len) / n })
        }
      })
    }

    const infoFor = () => {
      const m = st.mode
      if (cap) {
        if (m === "src") return ["Charging", "The source pushes current through R onto the plates. Charge piles up, so v<sub>C</sub> rises, and the current shrinks as v<sub>C</sub> closes in on the source. The current is largest at the start, when the capacitor is empty and acts like a short. No charge crosses the gap: the flow in the wires is the plates filling up."]
        if (m === "short") return ["Discharging", "The switch now closes the loop through R alone. v<sub>C</sub> can&rsquo;t jump, so it starts from where it was and decays. The current <em>does</em> jump: it flips from its charging value to &minus;v<sub>C</sub>/R in an instant, and then fades as the plates empty."]
        return ["Open circuit", "No path for current, so i<sub>C</sub> = 0 and v<sub>C</sub> just holds. An ideal capacitor remembers its charge (and its energy) indefinitely."]
      }
      if (m === "src") return ["Energizing", "At the instant of switch-on the current is 0 and can&rsquo;t jump, so the inductor takes the <em>whole</em> source voltage (it acts like an open circuit). As i<sub>L</sub> builds, R takes a bigger share and v<sub>L</sub> falls to 0. The magnetic field grows with the current, and at steady state the inductor is a short."]
      if (m === "short") return ["Freewheeling", "The switch gives the current a loop through R. i<sub>L</sub> can&rsquo;t jump, so it keeps flowing the same way and decays slowly. The voltage across the coil <em>does</em> jump, and flips sign (v<sub>L</sub> = &minus;Ri<sub>L</sub>): the inductor is pushing the current along and handing its stored energy to R."]
      if (st.spike)
        return ["Open: the current has nowhere to go", "The switch is open, but the inductor insists on keeping its current, so it drives it through a spark across the gap (modelled as 2 k&Omega;). v<sub>L</sub> = L di/dt shoots to <strong>" + eng(st.spike, "V") + "</strong> for a millisecond, far off this chart. That&rsquo;s the spark when you unplug a motor, and why relays and motors have flyback diodes."]
      return ["Open circuit", "No current and no field. Choose <em>Energize</em> to build the field up again."]
    }
    const showInfo = () => {
      const d = infoFor()
      infoTitle.textContent = d[0]
      infoText.innerHTML = d[1] + (calm && st.t === 0 ? " <em>Choose a switch position below to start.</em>" : "")
    }

    const sample = () => {
      const { R, E } = params()
      hist.push([st.t, st.x, physics(st.mode, st.x, R, E).y])
    }

    const setMode = (m) => {
      const { R, E } = params()
      st.spike = !cap && m === "open" && st.x > 0.02 * (VS / R) ? physics("open", st.x, R, E).y : 0
      st.spark = st.spike ? 1 : 0
      st.mode = m
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.key === m)))
      rebuildDots()
      showInfo()
      sample()
    }
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        if (c.dataset.key === "restart") {
          st.x = 0
          hist = []
          st.s = 0
          setMode("src")
        } else setMode(c.dataset.key)
      }),
    )

    const chartPath = (idx, lo, hi, y0, h, scale) => {
      let d = ""
      const t0 = st.t - WIN
      for (let k = 0; k < hist.length; k++) {
        const p = hist[k]
        const px = clamp(64 + ((p[0] - t0) / WIN) * 560, 64, 624)
        const v = clamp(p[idx] * scale, lo, hi)
        d += (k ? "L" : "M") + px.toFixed(1) + " " + (y0 + h * (1 - (v - lo) / (hi - lo))).toFixed(1)
      }
      return d
    }

    const draw = (ph, now) => {
      const { R, E } = params()
      const iRef = VS / R
      const cur = cap ? ph.y : st.x
      const volt = cap ? st.x : ph.y

      // switch lever
      lever.style.transform = "rotate(" + (st.mode === "src" ? 45 : st.mode === "short" ? -45 : 0) + "deg)"
      spark.style.opacity = st.spark

      // current dots: speed follows the current, and they fade out as it dies away
      const flow = Math.abs(cur) / iRef
      dotsG.style.opacity = clamp(flow * 8, 0, 1)
      dots.forEach((d) => {
        const p = pointAt(d.ch, st.s + d.off)
        d.el.setAttribute("cx", p[0].toFixed(1))
        d.el.setAttribute("cy", p[1].toFixed(1))
      })

      // stored energy
      const w = 0.5 * E * st.x * st.x
      const wMax = 0.5 * E * (cap ? VS * VS : iRef * iRef)
      const hBar = clamp((w / wMax) * 100, 0, 100)
      const bar = $("bar")
      bar.setAttribute("height", hBar.toFixed(1))
      bar.setAttribute("y", (220 - hBar).toFixed(1))
      $("w").textContent = eng(w, "J")

      // the field
      if (cap) {
        const f = clamp(st.x / VS, 0, 1)
        field.style.opacity = (0.9 * f).toFixed(3)
        charges.forEach((c, i) => {
          c.style.opacity = clamp(f * 7.4 - (i % 7), 0, 1).toFixed(2)
        })
      } else {
        const f = clamp(st.x / iRef, 0, 1.2)
        const sc = 0.3 + 0.7 * Math.min(f, 1)
        halo.setAttribute("transform", "translate(400 175) scale(" + sc.toFixed(3) + ") translate(-400 -175)")
        halo.style.opacity = clamp(f * 1.1, 0, 1).toFixed(3)
      }

      // labels
      $("r").textContent = "R = " + eng(R, "\\u03a9")
      $("i").textContent = " = " + eng(cur, "A")
      $("v").textContent = " = " + eng(volt, "V")
      $("e").textContent = (cap ? "C = " : "L = ") + eng(E, cap ? "F" : "H")

      // chart ranges
      const loA = cap ? -0.25 : -0.08 * iRef
      const hiA = cap ? VS + 0.25 : 1.12 * iRef
      const refA = cap ? VS : iRef
      const mB = cap ? iRef * 1.12 * 1000 : 6.5
      const refB = cap ? iRef * 1000 : VS
      const sB = cap ? 1000 : 1
      const yOf = (v, lo, hi, y0) => y0 + 80 * (1 - (v - lo) / (hi - lo))
      const line = (k, y) => { $(k).setAttribute("y1", y); $(k).setAttribute("y2", y) }
      line("zero-a", yOf(0, loA, hiA, 30))
      line("ref-a", yOf(refA, loA, hiA, 30))
      line("zero-b", yOf(0, -mB, mB, 154))
      line("ref-b", yOf(refB, -mB, mB, 154))
      const tick = (k, y, text) => { const e = $(k); e.setAttribute("y", y + 4); e.textContent = text }
      tick("tick0-a", yOf(0, loA, hiA, 30), "0")
      tick("tick1-a", yOf(refA, loA, hiA, 30), cap ? "5 V" : eng(iRef, "A"))
      tick("tick0-b", yOf(0, -mB, mB, 154), "0")
      tick("tick1-b", yOf(refB, -mB, mB, 154), cap ? eng(iRef, "A") : "5 V")
      $("path-a").setAttribute("d", chartPath(1, loA, hiA, 30, 80, 1))
      $("path-b").setAttribute("d", chartPath(2, -mB, mB, 154, 80, sB))

      // readout, ten times a second
      if (now - st.readAt > 100) {
        st.readAt = now
        const slope = ph.y / E
        const tau = cap ? R * E : E / R
        readout.innerHTML = cap
          ? "i<sub>C</sub> = C dv<sub>C</sub>/dt = " + eng(E, "F") + " \\u00d7 " + eng(slope, "V/s") + " = " + eng(ph.y, "A") +
            '<br><span class="oa-note">\\u03c4 = RC = ' + eng(tau, "s") + ". After one \\u03c4 the capacitor is 63% of the way to where it&rsquo;s heading. Stored energy \\u00bdCv\\u00b2 = " + eng(w, "J") + ".</span>"
          : "v<sub>L</sub> = L di<sub>L</sub>/dt = " + eng(E, "H") + " \\u00d7 " + eng(slope, "A/s") + " = " + eng(ph.y, "V") +
            '<br><span class="oa-note">\\u03c4 = L/R = ' + eng(tau, "s") + ". After one \\u03c4 the current is 63% of the way to where it&rsquo;s heading. Stored energy \\u00bdLi\\u00b2 = " + eng(w, "J") + ".</span>"
      }
    }

    const sliders = () => {
      const { R, E } = params()
      rIn.nextElementSibling.textContent = eng(R, "\\u03a9")
      eIn.nextElementSibling.textContent = eng(E, cap ? "F" : "H")
    }
    rIn.addEventListener("input", () => { sliders(); sample() })
    eIn.addEventListener("input", () => { sliders(); sample() })
    sliders()

    setMode("open")
    draw(physics("open", 0, params().R, params().E), 0)
    root.addEventListener("ci-visible", () => { if (!calm && st.mode === "open" && st.x === 0) setMode("src") })

    animate(root, (dt) => {
      const { R, E } = params()
      const ph = physics(st.mode, st.x, R, E)
      st.x = ph.target + (st.x - ph.target) * Math.exp(-dt / ph.tau)
      if (st.x < 1e-9) st.x = 0
      st.t += dt
      st.spark = Math.max(0, st.spark - dt / 0.45)
      const ph2 = physics(st.mode, st.x, R, E)
      const flow = Math.abs(cap ? ph2.y : st.x) / (VS / R)
      if (!calm) st.s += clamp(flow, 0, 1) * 170 * dt
      hist.push([st.t, st.x, ph2.y])
      while (hist.length > 2 && hist[1][0] < st.t - WIN - 0.5) hist.shift()
      draw(ph2, performance.now())
    })
  }

  // ---------- The element laws as slopes ----------

  function buildSlope(root) {
    const X0 = 64, CW = 560, T = 4, YA = 28, YB = 204, H = 110
    let kind = "cap", wave = "trap", tc = 0.6, playing = !calm

    // [name, steepest slope, f(u) -> [x, dx/dt]] over one 4 s period
    const WAVES = {
      trap: ["Trapezoid", 4, (u) => (u < 1 ? [-2 + 4 * u, 4] : u < 2 ? [2, 0] : u < 3 ? [2 - 4 * (u - 2), -4] : [-2, 0])],
      tri: ["Triangle", 2, (u) => (u < 2 ? [-2 + 2 * u, 2] : [2 - 2 * (u - 2), -2])],
      sine: ["Sine", Math.PI, (u) => [2 * Math.sin((Math.PI * u) / 2), Math.PI * Math.cos((Math.PI * u) / 2)]],
    }

    root.innerHTML =
      '<div class="oa-toolbar">' +
      '<span class="oa-switch-label" aria-hidden="true">Element</span>' +
      '<div class="oa-switch" role="radiogroup" aria-label="Element">' +
      '<span class="oa-switch-thumb" aria-hidden="true"></span>' +
      '<button type="button" role="radio" class="oa-switch-opt" data-mode="cap" aria-checked="true">Capacitor</button>' +
      '<button type="button" role="radio" class="oa-switch-opt" data-mode="ind" aria-checked="false">Inductor</button>' +
      "</div></div>" +
      '<svg class="oa-svg ci-chart ci-slope" viewBox="0 0 640 352" role="img" aria-label="A waveform and its slope, which is the current through a capacitor or the voltage across an inductor">' +
      '<rect class="ci-frame" x="64" y="' + YA + '" width="560" height="' + H + '"/>' +
      '<rect class="ci-frame" x="64" y="' + YB + '" width="560" height="' + H + '"/>' +
      '<line class="ci-zero" data-val="z1" x1="64" x2="624"/><line class="ci-zero" data-val="z2" x1="64" x2="624"/>' +
      '<text class="oa-label ci-title" x="64" y="' + (YA - 9) + '" data-val="title1"></text>' +
      '<text class="oa-label ci-title" x="64" y="' + (YB - 9) + '" data-val="title2"></text>' +
      '<g data-val="ticks"></g>' +
      '<path class="ci-trace ci-a" data-val="curve1"/><path class="ci-trace ci-b" data-val="curve2"/>' +
      '<line class="ci-cursor" data-val="cursor" y1="' + YA + '" y2="' + (YB + H) + '"/>' +
      '<line class="ci-tangent" data-val="tangent"/>' +
      '<circle class="ci-dot-a" r="5" data-val="dot1"/><circle class="ci-dot-b" r="5" data-val="dot2"/>' +
      '<text class="oa-caption" x="624" y="346" text-anchor="end">drag along the graph</text>' +
      "</svg>" +
      chipRow([["trap", "Trapezoid"], ["tri", "Triangle"], ["sine", "Sine"], ["play", "Pause"]], "Waveform") +
      infoPanel +
      '<div class="oa-controls">' +
      slider("k", "C", 1, 5, 0.5, 2) +
      slider("t", "Time", 0, T, 0.01, tc) +
      "</div>" +
      '<p class="oa-readout"></p>'

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const svg = root.querySelector("svg")
    const kIn = root.querySelector('input[data-k="k"]')
    const tIn = root.querySelector('input[data-k="t"]')
    const chips = Array.from(root.querySelectorAll(".oa-chip"))
    const opts = Array.from(root.querySelectorAll(".oa-switch-opt"))
    const playChip = chips.find((c) => c.dataset.key === "play")

    const tx = (t) => X0 + (t / T) * CW
    const ax = (x) => YA + H * (1 - (x + 2.6) / 5.2)
    const maxY = () => +kIn.value * WAVES[wave][1]
    const by = (y) => YB + H * (1 - (y + maxY() * 1.15) / (2 * maxY() * 1.15))

    const infoFor = () => {
      const cap = kind === "cap"
      const w = {
        trap: cap
          ? "Where v<sub>C</sub> is climbing or falling there is a steady current, and on the flat stretches the current is <strong>zero even though v<sub>C</sub> is &plusmn;2 V</strong>. A capacitor only cares how fast its voltage changes. The current jumps at every corner, but v<sub>C</sub> itself never does."
          : "Where i<sub>L</sub> is climbing or falling there is a steady voltage, and on the flat stretches the voltage is <strong>zero even though i<sub>L</sub> is &plusmn;2 A</strong>. An inductor only cares how fast its current changes. The voltage jumps at every corner, but i<sub>L</sub> itself never does.",
        tri: cap
          ? "A constant slope means a constant current. The slope flips sign at each peak, so i<sub>C</sub> flips between two values, and a steeper triangle (or a bigger C) means a bigger current."
          : "A constant slope means a constant voltage. The slope flips sign at each peak, so v<sub>L</sub> flips between two values, and a steeper triangle (or a bigger L) means a bigger voltage.",
        sine: cap
          ? "The slope of a sine is a cosine, so i<sub>C</sub> peaks a quarter of a cycle <strong>before</strong> v<sub>C</sub> does: the current <strong>leads</strong> the voltage by 90&deg;. At the peaks of v<sub>C</sub> the slope, and so the current, is zero."
          : "The slope of a sine is a cosine, so v<sub>L</sub> peaks a quarter of a cycle <strong>before</strong> i<sub>L</sub> does: the voltage <strong>leads</strong> the current by 90&deg; (equivalently, the current lags). At the peaks of i<sub>L</sub> the slope, and so the voltage, is zero.",
      }[wave]
      return [cap ? "i = C dv/dt" : "v = L di/dt", w]
    }

    const rebuild = () => {
      const cap = kind === "cap"
      root.classList.toggle("is-second", !cap)
      opts.forEach((o) => {
        const on = (o.dataset.mode === "ind") === !cap
        o.setAttribute("aria-checked", String(on))
        o.tabIndex = on ? 0 : -1
      })
      chips.forEach((c) => { if (c.dataset.key !== "play") c.setAttribute("aria-pressed", String(c.dataset.key === wave)) })
      kIn.previousElementSibling.textContent = cap ? "C" : "L"
      kIn.nextElementSibling.textContent = kIn.value + (cap ? " mF" : " H")
      $("title1").innerHTML = cap ? sub("v", "C") + "(t), volts" : sub("i", "L") + "(t), amps"
      $("title2").innerHTML = cap ? sub("i", "C") + " = C dv/dt, milliamps" : sub("v", "L") + " = L di/dt, volts"

      const M = maxY()
      let d1 = ""
      let d2 = ""
      for (let k = 0; k <= 320; k++) {
        const t = (k / 320) * T
        const f = WAVES[wave][2](Math.min(t, T - 1e-6))
        d1 += (k ? "L" : "M") + tx(t).toFixed(1) + " " + ax(f[0]).toFixed(1)
        d2 += (k ? "L" : "M") + tx(t).toFixed(1) + " " + by(+kIn.value * f[1]).toFixed(1)
      }
      $("curve1").setAttribute("d", d1)
      $("curve2").setAttribute("d", d2)
      $("z1").setAttribute("y1", ax(0)); $("z1").setAttribute("y2", ax(0))
      $("z2").setAttribute("y1", by(0)); $("z2").setAttribute("y2", by(0))

      let ticks = ""
      const tk = (y, txt) => '<text class="oa-small ci-tick" x="58" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + txt + "</text>"
      ticks += tk(ax(2), "2") + tk(ax(0), "0") + tk(ax(-2), "\\u22122")
      ticks += tk(by(M), "+" + M.toFixed(M < 10 ? 1 : 0)) + tk(by(0), "0") + tk(by(-M), "\\u2212" + M.toFixed(M < 10 ? 1 : 0))
      for (let s = 0; s <= T; s++) ticks += '<text class="oa-small ci-tick" x="' + tx(s) + '" y="' + (YB + H + 16) + '" text-anchor="middle">' + s + (s === T ? " s" : "") + "</text>"
      $("ticks").innerHTML = ticks

      const d = infoFor()
      root.querySelector(".oa-info-title").textContent = d[0]
      root.querySelector(".oa-info-text").innerHTML = d[1]
      update()
    }

    const update = () => {
      const cap = kind === "cap"
      const k = +kIn.value
      const f = WAVES[wave][2](Math.min(tc, T - 1e-6))
      const y = k * f[1]
      $("cursor").setAttribute("x1", tx(tc)); $("cursor").setAttribute("x2", tx(tc))
      $("dot1").setAttribute("cx", tx(tc)); $("dot1").setAttribute("cy", ax(f[0]))
      $("dot2").setAttribute("cx", tx(tc)); $("dot2").setAttribute("cy", by(y))
      // a short tangent line with the slope the current/voltage is following
      const h = 0.35
      const tg = $("tangent")
      tg.setAttribute("x1", tx(tc - h)); tg.setAttribute("y1", ax(f[0] - f[1] * h))
      tg.setAttribute("x2", tx(tc + h)); tg.setAttribute("y2", ax(f[0] + f[1] * h))
      tIn.value = tc
      tIn.nextElementSibling.textContent = tc.toFixed(2) + " s"
      const flat = Math.abs(f[1]) < 1e-6
      root.querySelector(".oa-readout").innerHTML = cap
        ? "At t = " + tc.toFixed(2) + " s: v<sub>C</sub> = " + minus(f[0].toFixed(2)) + " V, slope dv/dt = " + minus(f[1].toFixed(2)) + " V/s, so i<sub>C</sub> = " + k + " mF \\u00d7 " + minus(f[1].toFixed(2)) + " V/s = " + minus(y.toFixed(1)) + " mA" +
          (flat ? ' <span class="oa-flag">flat: no current</span>' : "")
        : "At t = " + tc.toFixed(2) + " s: i<sub>L</sub> = " + minus(f[0].toFixed(2)) + " A, slope di/dt = " + minus(f[1].toFixed(2)) + " A/s, so v<sub>L</sub> = " + k + " H \\u00d7 " + minus(f[1].toFixed(2)) + " A/s = " + minus(y.toFixed(1)) + " V" +
          (flat ? ' <span class="oa-flag">flat: no voltage</span>' : "")
    }

    const setPlaying = (on) => {
      playing = on
      playChip.textContent = on ? "Pause" : "Play"
    }

    chips.forEach((c) =>
      c.addEventListener("click", () => {
        if (c.dataset.key === "play") setPlaying(!playing)
        else { wave = c.dataset.key; rebuild() }
      }),
    )
    const setKind = (v) => { kind = v; rebuild() }
    opts.forEach((o) => o.addEventListener("click", () => setKind(o.dataset.mode)))
    root.querySelector(".oa-switch").addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
      e.preventDefault()
      const ind = e.key === "ArrowRight" || e.key === "ArrowDown"
      setKind(ind ? "ind" : "cap")
      opts[ind ? 1 : 0].focus()
    })
    kIn.addEventListener("input", rebuild)
    tIn.addEventListener("input", () => { setPlaying(false); tc = +tIn.value; update() })

    // Dragging along the graph moves the cursor
    let dragging = false
    const scrub = (e) => {
      const r = svg.getBoundingClientRect()
      tc = clamp(((((e.clientX - r.left) / r.width) * 640 - X0) / CW) * T, 0, T)
      update()
    }
    svg.addEventListener("pointerdown", (e) => { dragging = true; svg.setPointerCapture(e.pointerId); setPlaying(false); scrub(e) })
    svg.addEventListener("pointermove", (e) => { if (dragging) scrub(e) })
    svg.addEventListener("pointerup", () => { dragging = false })
    svg.addEventListener("pointercancel", () => { dragging = false })

    setPlaying(playing)
    rebuild()
    animate(root, (dt) => {
      if (!playing) return
      tc = (tc + dt * 0.8) % T
      update()
    })
  }

  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-capind:not([data-ready])").forEach((root) => {
      root.dataset.ready = "true"
      if (root.dataset.view === "slope") buildSlope(root)
      else buildCircuit(root, root.dataset.view === "ind" ? "ind" : "cap")
    })
  })
})()
`

export default (() => MelonCapInd) satisfies QuartzComponentConstructor
