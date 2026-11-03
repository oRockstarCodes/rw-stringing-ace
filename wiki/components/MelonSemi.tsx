import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Interactive semiconductor diagrams for PCS 224. A note asks for one with an empty div:
//
//   <div class="melon-semi" data-view="hall"></div>
//     The Hall effect (Figure 4.2). Pick p- or n-type and the direction of B. Carriers bend
//     toward one edge, charge piles up, the Hall field E_H grows until F_E balances F_m, and
//     the voltmeter settles on V_H. The force never changes with carrier type, only the sign
//     of the charge on the edge does.
//
//   <div class="melon-semi" data-view="fermi"></div>
//     The Fermi function (Figure 5.3). Slide the temperature and the position of E_F and see
//     states in the bands fill and empty at random with probability f(E), next to the curve.
//
//   <div class="melon-semi" data-view="pn"></div>
//     The p-n junction (Figures 7.1 and 7.2). Slide the bias and the doping: the charge, field
//     and potential profiles and the band diagram all follow, and carriers cross the barrier
//     in forward bias.
//
// The script below fills them in on every page load (the text inside the div is only a
// fallback for Obsidian and link previews). Styles are in wiki/custom.scss, which shares the
// op amp diagrams' oa-* classes and adds the sm-* ones.

const MelonSemi: QuartzComponent = () => null

MelonSemi.afterDOMLoaded = `
(() => {
  const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
  const minus = (s) => String(s).replace(/-/g, "\\u2212")
  const SUP = { "-": "\\u207b", "0": "\\u2070", "1": "\\u00b9", "2": "\\u00b2", "3": "\\u00b3", "4": "\\u2074", "5": "\\u2075", "6": "\\u2076", "7": "\\u2077", "8": "\\u2078", "9": "\\u2079" }
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("")
  // 2.13e-10 -> "2.1x10^-10" with a real superscript; ordinary numbers keep their digits
  const sci = (x, d) => {
    d = d === undefined ? 1 : d
    if (x === 0) return "0"
    if (Math.abs(x) >= 0.01 && Math.abs(x) < 1000) return minus(x.toFixed(Math.abs(x) < 1 ? 3 : 1))
    const [m, e] = x.toExponential(d).split("e")
    return minus(m) + "\\u00d710" + sup(parseInt(e, 10))
  }
  // 0.0312 V -> "31.2 mV"
  const eng = (x, u) => {
    const a = Math.abs(x)
    if (a < 5e-13) return "0 " + u
    let s = x, p = ""
    if (a >= 1) { /* as is */ }
    else if (a >= 1e-3) { s = x * 1e3; p = "m" }
    else if (a >= 1e-6) { s = x * 1e6; p = "\\u00b5" }
    else { s = x * 1e9; p = "n" }
    const d = Math.abs(s) >= 100 ? 0 : Math.abs(s) >= 10 ? 1 : 2
    return minus(s.toFixed(d)) + " " + p + u
  }
  const sub = (base, s) => base + '<tspan class="oa-sub" dy="4">' + s + '</tspan><tspan dy="-4">&#8203;</tspan>'

  const infoPanel = '<div class="oa-info" aria-live="polite"><div class="oa-info-title"></div><div class="oa-info-text"></div></div>'
  const chipRow = (list, label, group) =>
    '<div class="oa-chips" role="group" aria-label="' + label + '">' +
    list.map(([key, text]) => '<button type="button" class="oa-chip" data-group="' + group + '" data-key="' + key + '" aria-pressed="false">' + text + "</button>").join("") +
    "</div>"
  const slider = (key, label, min, max, step, val) =>
    '<label><span>' + label + '</span><input type="range" data-k="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output></output></label>'
  const svgNS = "http://www.w3.org/2000/svg"
  let uid = 0

  // Runs fn(dt) every frame while the diagram is on screen; stops for good once the page
  // swaps it out (Quartz replaces the page body on navigation). The first time the diagram
  // scrolls into view it fires "sm-visible", so a build-up can play when you get to it.
  function animate(root, fn) {
    let visible = typeof IntersectionObserver === "undefined"
    let first = true
    if (!visible) {
      new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting
        if (visible && first) { first = false; root.dispatchEvent(new CustomEvent("sm-visible")) }
      }, { threshold: 0.35 }).observe(root)
    }
    let prev = 0
    const frame = (now) => {
      if (!root.isConnected) return
      requestAnimationFrame(frame)
      if (!visible) { prev = 0; return }
      const dt = prev ? Math.min(0.1, (now - prev) / 1000) : 0
      prev = now
      if (dt > 0) fn(dt)
    }
    requestAnimationFrame(frame)
  }

  // Writes only what changed since the last frame: rewriting an attribute with the same
  // value still costs the page a fresh layout and paint. key is "text", "html",
  // "style.<prop>" or an attribute name.
  const seen = new WeakMap()
  const put = (el, key, v) => {
    v = String(v)
    let m = seen.get(el)
    if (!m) seen.set(el, (m = {}))
    if (m[key] === v) return
    m[key] = v
    if (key === "text") el.textContent = v
    else if (key === "html") el.innerHTML = v
    else if (key.startsWith("style.")) el.style[key.slice(6)] = v
    else el.setAttribute(key, v)
  }
  const mk = (tag, attrs, parent) => {
    const el = document.createElementNS(svgNS, tag)
    for (const k in attrs) el.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(el)
    return el
  }
  // Chips in one group act like radio buttons
  function chipGroup(root, group, onPick) {
    const chips = Array.from(root.querySelectorAll('.oa-chip[data-group="' + group + '"]'))
    const mark = (key) => chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.key === key)))
    chips.forEach((c) => c.addEventListener("click", () => onPick(c.dataset.key, mark)))
    return mark
  }

  // =====================================================================================
  // The Hall effect
  // =====================================================================================

  function buildHall(root) {
    const id = "sm" + ++uid
    const X0 = 60, X1 = 480, Y0 = 80, Y1 = 200, YM = 140
    const I_A = 0.01, D_M = 1e-3, QE = 1.602e-19 // 10 mA through a 1 mm thick strip
    const TAU = 0.7 // how fast the edge charge builds, in seconds

    root.innerHTML =
      '<svg class="oa-svg sm-svg" viewBox="0 0 640 330" role="img" aria-label="A current-carrying strip in a magnetic field, with a voltmeter across its width">' +
      '<defs>' +
      ['m', 'e', 'g'].map((k) => '<marker id="' + id + k + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="sm-ah sm-ah-' + k + '" d="M0 0 L10 5 L0 10 z"/></marker>').join("") +
      '</defs>' +
      '<rect class="sm-strip" x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '"/>' +
      '<g class="sm-bgrid"></g>' +
      '<rect class="sm-edge" data-val="etop" x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="14"/>' +
      '<rect class="sm-edge" data-val="ebot" x="' + X0 + '" y="' + (Y1 - 14) + '" width="' + (X1 - X0) + '" height="14"/>' +
      '<g class="sm-esyms"></g>' +
      '<g class="sm-carriers"></g>' +
      '<g class="sm-eh"></g>' +
      '<text class="oa-label sm-ehlab" data-val="ehlab" x="283" y="145">E<tspan class="oa-sub" dy="4">H</tspan></text>' +
      // current in and out
      '<line class="sm-wire" x1="14" y1="' + YM + '" x2="' + (X0 - 2) + '" y2="' + YM + '" marker-end="url(#' + id + 'g)"/>' +
      '<line class="sm-wire" x1="' + (X1 + 2) + '" y1="' + YM + '" x2="518" y2="' + YM + '" marker-end="url(#' + id + 'g)"/>' +
      '<text class="oa-label" x="36" y="128" text-anchor="middle">I</text>' +
      '<text class="oa-label" data-val="blabel" x="' + X0 + '" y="62"></text>' +
      // voltmeter across the width
      '<polyline class="sm-wire" points="420,' + Y0 + ' 420,50 560,50 560,110"/>' +
      '<polyline class="sm-wire" points="420,' + Y1 + ' 420,230 560,230 560,170"/>' +
      '<circle class="sm-probe" cx="420" cy="' + Y0 + '" r="3.5"/><circle class="sm-probe" cx="420" cy="' + Y1 + '" r="3.5"/>' +
      '<circle class="sm-meter" cx="560" cy="140" r="30"/>' +
      '<text class="oa-sign" x="571" y="106">+</text><text class="oa-sign" x="571" y="184">&minus;</text>' +
      '<text class="oa-label" x="560" y="164" text-anchor="middle">' + sub("V", "H") + '</text>' +
      '<line class="sm-needle" data-val="needle" x1="560" y1="152" x2="560" y2="122"/>' +
      '<circle class="sm-hub" cx="560" cy="152" r="3"/>' +
      '<text class="oa-val sm-vh" data-val="vh" x="560" y="256" text-anchor="middle"></text>' +
      '<text class="oa-caption" x="560" y="276" text-anchor="middle">top &minus; bottom</text>' +
      // free-body diagram of one carrier
      '<text class="oa-caption" x="110" y="222" text-anchor="middle">forces on one carrier</text>' +
      '<line class="sm-force sm-force-m" data-val="fm" x1="92" y1="272" x2="92" y2="272" marker-end="url(#' + id + 'm)"/>' +
      '<line class="sm-force sm-force-e" data-val="fe" x1="128" y1="272" x2="128" y2="272" marker-end="url(#' + id + 'e)"/>' +
      '<circle class="sm-fbd" data-val="fbd" cx="110" cy="272" r="9"/>' +
      '<text class="oa-label sm-lab-m" x="40" y="276" text-anchor="middle">' + sub("F", "m") + '</text>' +
      '<text class="oa-label sm-lab-e" x="180" y="276" text-anchor="middle">' + sub("F", "E") + '</text>' +
      '<text class="oa-small" data-val="balance" x="110" y="312" text-anchor="middle"></text>' +
      // key
      '<circle class="sm-dot sm-hole" cx="290" cy="262" r="5"/><text class="oa-small" x="300" y="266">hole</text>' +
      '<circle class="sm-dot sm-elec" cx="290" cy="284" r="5"/><text class="oa-small" x="300" y="288">electron</text>' +
      '</svg>' +
      chipRow([["p", "p-type (holes)"], ["n", "n-type (electrons)"]], "Carrier type", "type") +
      chipRow([["in", "B into the page"], ["off", "B off"], ["out", "B out of the page"], ["restart", "Replay"]], "Magnetic field", "field") +
      infoPanel +
      '<div class="oa-controls">' +
      slider("b", "B", 0.1, 1, 0.05, 0.5) +
      slider("n", "log n", 14, 17, 0.1, 15) +
      "</div>" +
      '<p class="oa-readout"></p>'

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const bIn = root.querySelector('input[data-k="b"]')
    const nIn = root.querySelector('input[data-k="n"]')
    const outs = root.querySelectorAll("output")
    const carriersG = root.querySelector(".sm-carriers")
    const ehG = root.querySelector(".sm-eh")
    const symsG = root.querySelector(".sm-esyms")
    const bgrid = root.querySelector(".sm-bgrid")
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")

    const st = { type: "p", dir: 1, h: 0 }

    const gridCells = []
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++)
      gridCells.push(mk("text", { class: "sm-b", x: X0 + (c + 0.5) * 60, y: 117 + r * 24, "text-anchor": "middle" }, bgrid))
    const edgeSyms = { top: [], bot: [] }
    for (let k = 0; k < 11; k++) {
      edgeSyms.top.push(mk("text", { class: "sm-sym", x: X0 + (k + 0.5) * ((X1 - X0) / 11), y: Y0 + 12, "text-anchor": "middle" }, symsG))
      edgeSyms.bot.push(mk("text", { class: "sm-sym", x: X0 + (k + 0.5) * ((X1 - X0) / 11), y: Y1 - 2, "text-anchor": "middle" }, symsG))
    }
    // the sideways field E_H: three arrows between the edges
    const ehArrows = [150, 270, 390].map((x) => mk("line", { class: "sm-force sm-force-eh", x1: x, x2: x, y1: YM, y2: YM, "marker-end": "url(#" + id + "e)" }, ehG))

    const N = 28
    const dots = []
    for (let k = 0; k < N; k++) {
      const el = mk("circle", { class: "sm-dot", r: 4.5 }, carriersG)
      dots.push({ el, x: X0 + 6 + (k * (X1 - X0 - 12)) / N, y: Y0 + 22 + Math.random() * (Y1 - Y0 - 44) })
    }

    const typeSign = () => (st.type === "p" ? 1 : -1)
    const target = () => st.dir * (+bIn.value) // + means toward the top edge
    const vh1T = () => I_A / (QE * Math.pow(10, +nIn.value) * 1e6 * D_M) // V_H per tesla, n in m^-3

    const draw = () => {
      const h = st.h, tgt = target(), ts = typeSign()
      const net = tgt - h
      const vNorm = ts * h // + means the top edge is at the higher potential
      dots.forEach((d) => {
        put(d.el, "cx", d.x.toFixed(1))
        put(d.el, "cy", d.y.toFixed(1))
        put(d.el, "class", "sm-dot " + (st.type === "p" ? "sm-hole" : "sm-elec"))
      })
      // the carriers' sign collects on the edge they were pushed to
      const topPos = ts * h >= 0
      const mag = Math.abs(h)
      const topCol = topPos ? "var(--sm-pos)" : "var(--sm-neg)"
      const botCol = topPos ? "var(--sm-neg)" : "var(--sm-pos)"
      put($("etop"), "style.fill", topCol); put($("etop"), "style.opacity", (0.6 * mag).toFixed(2))
      put($("ebot"), "style.fill", botCol); put($("ebot"), "style.opacity", (0.6 * mag).toFixed(2))
      const topCh = topPos ? "+" : "\\u2212", botCh = topPos ? "\\u2212" : "+"
      edgeSyms.top.forEach((s) => { put(s, "text", topCh); put(s, "style.opacity", mag.toFixed(2)); put(s, "style.fill", topCol) })
      edgeSyms.bot.forEach((s) => { put(s, "text", botCh); put(s, "style.opacity", mag.toFixed(2)); put(s, "style.fill", botCol) })
      // E_H runs from the + edge to the - edge
      const down = vNorm > 0 ? 1 : -1
      const half = mag * 34
      ehArrows.forEach((a) => {
        put(a, "y1", (YM - down * half).toFixed(1)); put(a, "y2", (YM + down * half).toFixed(1))
        put(a, "style.opacity", half > 3 ? 1 : 0)
      })
      put($("ehlab"), "style.opacity", half > 3 ? 1 : 0)
      // meter
      put($("needle"), "transform", "rotate(" + (55 * clamp(vNorm, -1, 1)).toFixed(1) + " 560 152)")
      const vh = vNorm * vh1T()
      put($("vh"), "html", sub("V", "H") + " = " + (vh > 0 && Math.abs(vh) > 5e-13 ? "+" : "") + eng(vh, "V"))
      // the forces on one carrier (up is toward the top edge)
      const L = 46
      const arrow = (el, up) => {
        const len = Math.abs(up) * L
        put(el, "y2", (272 - Math.sign(up) * len).toFixed(1))
        put(el, "style.opacity", len > 2 ? 1 : 0)
      }
      arrow($("fm"), tgt); arrow($("fe"), -h)
      put($("fbd"), "class", "sm-fbd " + (st.type === "p" ? "sm-hole" : "sm-elec"))
      const balanced = Math.abs(net) < 0.04
      put($("balance"), "html", balanced ? (tgt === 0 && mag < 0.04 ? "no forces" : sub("F", "E") + " = " + sub("F", "m") + ": balanced") : sub("F", "m") + " &gt; " + sub("F", "E") + ": still bending")
      put($("balance"), "style.fill", balanced && mag >= 0.04 ? "var(--secondary)" : "var(--gray)")
    }

    const info = () => {
      const tgt = target(), h = st.h, net = tgt - h
      const pt = st.type === "p"
      const car = pt ? "holes" : "electrons"
      const edge = st.dir > 0 ? "top" : "bottom"
      if (st.dir === 0 && Math.abs(h) < 0.03)
        return ["No magnetic field, no Hall voltage", "The " + car + " drift straight along the bar. There is no sideways force, so no charge builds up and the voltmeter reads 0. Turn B on to start."]
      if (st.dir === 0)
        return ["Field removed", "The edge charge is still there, so E<sub>H</sub> now pushes the " + car + " back across. The charge drains away and V<sub>H</sub> falls to 0."]
      if (Math.abs(net) > 0.05)
        return ["1\\u20133. The force bends the path and charge piles up", "F<sub>m</sub> points along <b>I &times; B</b> (toward the " + edge + " edge), for holes <em>and</em> electrons. So the " + car + " drift that way. That edge collects " + (pt ? "positive" : "negative") + " charge and the opposite edge is left with " + (pt ? "negative" : "positive") + ". The charge makes E<sub>H</sub>, which pushes back with F<sub>E</sub>. F<sub>E</sub> is still smaller than F<sub>m</sub>, so the path is still curving."]
      return ["4. Balanced: the carriers go straight again", "F<sub>E</sub> = F<sub>m</sub>, so qE<sub>H</sub> = qv<sub>d</sub>B. The " + edge + " edge holds " + (pt ? "+" : "&minus;") + " charge, so it is at " + (pt ? "a higher" : "a lower") + " potential than the other edge, and since the meter reads top &minus; bottom it shows V<sub>H</sub> " + ((pt === (st.dir > 0)) ? "&gt; 0" : "&lt; 0") + ". Swap the carrier type: the forces and the edge don&rsquo;t change, only the sign of the charge on it does."]
    }

    const refresh = () => {
      outs[0].textContent = (+bIn.value).toFixed(2) + " T"
      outs[1].textContent = sci(Math.pow(10, +nIn.value), 1) + " cm\\u207b\\u00b3"
      gridCells.forEach((c) => {
        put(c, "text", st.dir > 0 ? "\\u00d7" : st.dir < 0 ? "\\u2022" : "")
        put(c, "style.opacity", (0.18 + 0.4 * +bIn.value).toFixed(2))
      })
      put($("blabel"), "text", st.dir > 0 ? "B into the page (\\u00d7)" : st.dir < 0 ? "B out of the page (\\u2022)" : "B = 0")
      const B = +bIn.value
      const full = typeSign() * st.dir * vh1T() * B
      readout.innerHTML = st.dir === 0
        ? "V<sub>H</sub> = IB/(qnd) = 0 &nbsp;(B = 0)"
        : "V<sub>H</sub> = IB/(qnd) = (10 mA)(" + B.toFixed(2) + " T) / (q &middot; " + sci(Math.pow(10, +nIn.value), 1) + " cm<sup>&minus;3</sup> &middot; 1 mm) = <b>" + (full > 0 ? "+" : "") + eng(full, "V") + "</b>. More doping (a bigger n) gives a smaller V<sub>H</sub>."
      draw()
    }

    chipGroup(root, "type", (k, mark) => { st.type = k; mark(k); refresh() })
    const markField = chipGroup(root, "field", (k, mark) => {
      if (k === "restart") { st.h = 0; if (calm) st.h = target(); refresh(); return }
      st.dir = k === "in" ? 1 : k === "out" ? -1 : 0
      mark(k)
      if (calm) st.h = target()
      refresh()
    })
    root.querySelector('.oa-chip[data-key="p"]').setAttribute("aria-pressed", "true")
    markField("in")
    ;[bIn, nIn].forEach((s) => s.addEventListener("input", () => { if (calm) st.h = target(); refresh() }))
    root.addEventListener("sm-visible", () => { if (!calm) st.h = 0 })

    if (calm) st.h = target()
    refresh()
    animate(root, (dt) => {
      const tgt = target()
      if (!calm) {
        st.h += (tgt - st.h) * (1 - Math.exp(-dt / TAU))
        if (Math.abs(tgt - st.h) < 5e-4) st.h = tgt
        const net = tgt - st.h
        const vx = (st.type === "p" ? 1 : -1) * 80
        dots.forEach((d) => {
          d.x += vx * dt
          d.y = clamp(d.y - net * 95 * dt, Y0 + 20, Y1 - 20)
          if (d.x > X1 - 5 || d.x < X0 + 5) {
            d.x = vx > 0 ? X0 + 5 : X1 - 5
            d.y = Y0 + 22 + Math.random() * (Y1 - Y0 - 44)
          }
        })
      }
      draw()
      const d = info()
      put(infoTitle, "html", d[0]); put(infoText, "html", d[1])
    })
  }

  // =====================================================================================
  // The Fermi function
  // =====================================================================================

  function buildFermi(root) {
    const KB = 8.617e-5
    const yE = (E) => 170 - E * 118 // E in eV from mid-gap
    const xF = (f) => 330 + f * 280
    const P = { eg: 1.12, ef: 0, T: 300, play: false }
    const view = { eg: 1.12, ef: 0, T: 300 } // what is drawn: eases toward P

    root.innerHTML =
      '<svg class="oa-svg sm-svg" viewBox="0 0 640 340" role="img" aria-label="Band diagram with states filling at random, next to the Fermi function">' +
      '<rect class="sm-band" data-val="cb" x="60" width="190"/>' +
      '<rect class="sm-band" data-val="vb" x="60" width="190"/>' +
      '<g class="sm-slots"></g>' +
      '<line class="sm-guide" data-val="gc" x1="60" x2="610"/><line class="sm-guide" data-val="gv" x1="60" x2="610"/>' +
      '<text class="oa-label" data-val="lc" x="54" text-anchor="end">' + sub("E", "c") + '</text>' +
      '<text class="oa-label" data-val="lv" x="54" text-anchor="end">' + sub("E", "v") + '</text>' +
      '<text class="oa-caption" x="155" y="22" text-anchor="middle">conduction band</text>' +
      '<text class="oa-caption" x="155" y="328" text-anchor="middle">valence band</text>' +
      '<line class="sm-ef-line" data-val="gef" x1="60" x2="610"/>' +
      '<text class="oa-label sm-ef" data-val="lef" x="256">' + sub("E", "F") + '</text>' +
      '<line class="sm-axis" x1="330" y1="30" x2="330" y2="310"/><line class="sm-guide" x1="610" y1="30" x2="610" y2="310"/><line class="sm-guide" x1="470" y1="30" x2="470" y2="310"/>' +
      '<text class="oa-small" x="330" y="326" text-anchor="middle">0</text><text class="oa-small" x="470" y="326" text-anchor="middle">&frac12;</text><text class="oa-small" x="610" y="326" text-anchor="middle">1</text>' +
      '<text class="oa-caption" x="470" y="22" text-anchor="middle">chance a state is filled, f(E)</text>' +
      '<path class="sm-curve" data-val="curve"/>' +
      '<circle class="sm-mark" data-val="mhalf" r="5"/>' +
      '<circle class="sm-mark sm-mark-c" data-val="mc" r="5"/><circle class="sm-mark sm-mark-v" data-val="mv" r="5"/>' +
      '<text class="oa-val" data-val="tc"></text><text class="oa-val" data-val="tv"></text>' +
      '</svg>' +
      chipRow([["0.66", "Ge (0.66 eV)"], ["1.12", "Si (1.12 eV)"], ["1.42", "GaAs (1.42 eV)"], ["play", "Warm up \\u25b6\\ufe0e"]], "Material and animation", "mat") +
      infoPanel +
      '<div class="oa-controls">' +
      slider("t", "T", 0, 900, 10, 300) +
      slider("ef", "E<sub>F</sub>", -0.56, 0.56, 0.01, 0) +
      "</div>" +
      '<p class="oa-readout"></p>'

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const tIn = root.querySelector('input[data-k="t"]')
    const efIn = root.querySelector('input[data-k="ef"]')
    const outs = root.querySelectorAll("output")
    const slotsG = root.querySelector(".sm-slots")
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")
    const playChip = root.querySelector('.oa-chip[data-key="play"]')

    // States: 8 columns by 7 rows above E_c and below E_v. Each has a random number u, and
    // is filled when u < f(E). The numbers drift, so the filled ones flicker like real
    // occupation does.
    const slots = []
    for (let b = 0; b < 2; b++) for (let r = 0; r < 7; r++) for (let c = 0; c < 8; c++) {
      const el = mk("circle", { class: "sm-slot", r: 3.6, cx: 74 + c * 23 }, slotsG)
      slots.push({ el, band: b, off: 0.04 + r * 0.07, u: Math.random() })
    }
    const fOf = (E, T, ef) => {
      const kT = KB * T
      if (kT < 2e-4) return E < ef ? 1 : E > ef ? 0 : 0.5
      const z = (E - ef) / kT
      return z > 700 ? 0 : z < -700 ? 1 : 1 / (1 + Math.exp(z))
    }

    const draw = () => {
      const { eg, ef, T } = view
      const Ec = eg / 2, Ev = -eg / 2
      const yc = yE(Ec), yv = yE(Ev)
      put($("cb"), "y", 30); put($("cb"), "height", Math.max(0, yc - 30).toFixed(1))
      put($("vb"), "y", yv.toFixed(1)); put($("vb"), "height", Math.max(0, 310 - yv).toFixed(1))
      ;[["gc", yc], ["gv", yv]].forEach(([k, y]) => { put($(k), "y1", y.toFixed(1)); put($(k), "y2", y.toFixed(1)) })
      put($("lc"), "y", (yc + 4).toFixed(1)); put($("lv"), "y", (yv + 4).toFixed(1))
      put($("gef"), "y1", yE(ef).toFixed(1)); put($("gef"), "y2", yE(ef).toFixed(1))
      put($("lef"), "y", (yE(ef) - 6).toFixed(1))
      slots.forEach((s) => {
        const E = s.band === 0 ? Ec + s.off : Ev - s.off
        put(s.el, "cy", yE(E).toFixed(1))
        put(s.el, "class", "sm-slot" + (s.u < fOf(E, T, ef) ? " is-full" : ""))
      })
      let d = ""
      for (let k = 0; k <= 90; k++) {
        const E = -1.2 + (2.4 * k) / 90
        d += (k ? "L" : "M") + xF(fOf(E, T, ef)).toFixed(1) + " " + yE(E).toFixed(1)
      }
      put($("curve"), "d", d)
      const fc = fOf(Ec, T, ef), fv = fOf(Ev, T, ef)
      put($("mhalf"), "cx", xF(0.5)); put($("mhalf"), "cy", yE(ef).toFixed(1))
      put($("mc"), "cx", xF(fc).toFixed(1)); put($("mc"), "cy", yc.toFixed(1))
      put($("mv"), "cx", xF(fv).toFixed(1)); put($("mv"), "cy", yv.toFixed(1))
      const tc = $("tc"), tv = $("tv")
      put(tc, "y", (yc - 9).toFixed(1)); put(tc, "html", "f(" + sub("E", "c") + ") = " + sci(fc))
      put(tc, "text-anchor", fc > 0.5 ? "end" : "start"); put(tc, "x", (xF(fc) + (fc > 0.5 ? -10 : 10)).toFixed(1))
      put(tv, "y", (yv + 20).toFixed(1)); put(tv, "html", "f(" + sub("E", "v") + ") = " + sci(fv))
      put(tv, "text-anchor", fv > 0.5 ? "end" : "start"); put(tv, "x", (xF(fv) + (fv > 0.5 ? -10 : 10)).toFixed(1))
    }

    const info = () => {
      const { eg, ef, T } = P
      const kT = KB * T, Ec = eg / 2, Ev = -eg / 2
      if (T < 1) return ["T = 0: a perfect step", "Every state below E<sub>F</sub> is full and every state above is empty. With E<sub>F</sub> in the gap, the valence band is completely filled and the conduction band is empty, so nothing can move. Warm it up."]
      const fc = fOf(Ec, T, ef), pv = 1 - fOf(Ev, T, ef)
      if (ef > Ec - 0.05 || ef < Ev + 0.05)
        return ["E<sub>F</sub> at a band edge", "At E = E<sub>F</sub> the probability is exactly &frac12;, at every temperature. Park E<sub>F</sub> at E<sub>c</sub> and half the states there are filled. That is what a heavily n-type semiconductor looks like."]
      return ["Warming smears the step over a few k<sub>B</sub>T", "Here k<sub>B</sub>T = " + (kT * 1000).toFixed(1) + " meV, tiny next to the gap, so the tails reach the bands with a very small probability: f(E<sub>c</sub>) = " + sci(fc) + " for an electron, and " + sci(pv) + " for a missing electron (a hole) at E<sub>v</sub>. Those few filled and empty states are the carriers. Move E<sub>F</sub> and watch the tail at E<sub>c</sub> grow or shrink."]
    }
    const refresh = () => {
      outs[0].textContent = Math.round(P.T) + " K"
      outs[1].textContent = (P.ef >= 0 ? "+" : "\\u2212") + Math.abs(P.ef).toFixed(2) + " eV"
      const d = info()
      infoTitle.innerHTML = d[0]
      infoText.innerHTML = d[1]
      const kT = KB * P.T
      readout.innerHTML = "k<sub>B</sub>T = " + (kT * 1000).toFixed(1) + " meV &nbsp;&middot;&nbsp; E<sub>c</sub> &minus; E<sub>F</sub> = " + (P.eg / 2 - P.ef).toFixed(2) + " eV = " + (kT > 0 ? ((P.eg / 2 - P.ef) / kT).toFixed(1) : "\\u221e") + " k<sub>B</sub>T &nbsp;&middot;&nbsp; E<sub>F</sub> is measured from mid-gap (E<sub>i</sub>)"
    }

    const setPlay = (on) => { P.play = on; playChip.setAttribute("aria-pressed", String(on)) }
    ;[tIn, efIn].forEach((s) => s.addEventListener("input", () => {
      setPlay(false)
      P.T = +tIn.value; P.ef = +efIn.value
      refresh()
    }))
    const markMat = chipGroup(root, "mat", (k, mark) => {
      if (k === "play") {
        setPlay(!P.play)
        if (P.play && P.T > 850) P.T = 0
        return
      }
      P.eg = +k
      mark(k)
      const lim = P.eg / 2
      efIn.min = -lim; efIn.max = lim
      P.ef = clamp(P.ef, -lim, lim); efIn.value = P.ef
      refresh()
    })
    markMat("1.12")
    playChip.setAttribute("aria-pressed", "false")

    refresh()
    draw()
    let dir = 1
    animate(root, (dt) => {
      if (P.play) {
        P.T = clamp(P.T + dir * 140 * dt, 0, 900)
        if (P.T >= 900) dir = -1
        if (P.T <= 0) dir = 1
        tIn.value = Math.round(P.T / 10) * 10
        refresh()
      }
      const k = calm ? 1 : 1 - Math.exp(-dt * 8)
      view.eg += (P.eg - view.eg) * k
      view.ef += (P.ef - view.ef) * k
      view.T += (P.T - view.T) * k
      if (!calm) slots.forEach((s) => { if (Math.random() < dt * 0.7) s.u = Math.random() })
      draw()
    })
  }

  // =====================================================================================
  // The p-n junction
  // =====================================================================================

  function buildPN(root) {
    const KT = 0.02585, NI = 1e10, ES = 11.7 * 8.854e-14, Q = 1.602e-19, EG = 1.12
    const CX = 190, HALF = 130 // the profile panels run from CX-HALF to CX+HALF
    const BX = 490, EPX = 46 // band diagram: centre, pixels per eV
    const P = { vd: 0, a: 17, b: 16 }
    const view = { vd: 0, a: 17, b: 16 }
    const BASE = [68, 158, 348]

    root.innerHTML =
      '<svg class="oa-svg sm-svg sm-pn" viewBox="0 0 640 380" role="img" aria-label="Charge density, electric field, potential and band diagram of a p-n junction">' +
      ['\\u03c1 (charge density)', 'E (electric field)', '\\u03c6 (potential)'].map((t, i) =>
        '<text class="sm-ptitle" x="60" y="' + [22, 132, 252][i] + '">' + t + '</text>' +
        '<line class="sm-zero" x1="60" x2="320" y1="' + BASE[i] + '" y2="' + BASE[i] + '"/>').join("") +
      ['xp', 'x0', 'xn'].map((k) => '<line class="sm-guide" data-val="v-' + k + '" y1="28" y2="352"/>').join("") +
      '<rect class="sm-rho sm-rho-p" data-val="rhop"/><rect class="sm-rho sm-rho-n" data-val="rhon"/>' +
      '<path class="sm-prof sm-prof-e" data-val="pe"/><path class="sm-prof sm-prof-v" data-val="pv"/>' +
      '<text class="oa-small" data-val="xlab-p" y="368" text-anchor="middle">&minus;x<tspan class="oa-sub" dy="4">p</tspan></text>' +
      '<text class="oa-small" data-val="xlab-0" y="368" text-anchor="middle">0</text>' +
      '<text class="oa-small" data-val="xlab-n" y="368" text-anchor="middle">x<tspan class="oa-sub" dy="4">n</tspan></text>' +
      '<text class="oa-small" x="62" y="58">p</text><text class="oa-small" x="318" y="58" text-anchor="end">n</text>' +
      '<text class="oa-caption" x="' + BX + '" y="22" text-anchor="middle">band diagram</text>' +
      '<path class="sm-bandline" data-val="ec"/><path class="sm-bandline" data-val="ev"/>' +
      '<line class="sm-ef-line" data-val="efp"/><line class="sm-ef-line" data-val="efn"/>' +
      '<line class="sm-evd" data-val="evd"/><text class="oa-label sm-evdlab" data-val="evdlab">' + sub("eV", "D") + '</text>' +
      '<text class="oa-label" x="' + (BX - HALF) + '" data-val="lc">' + sub("E", "c") + '</text>' +
      '<text class="oa-label" x="' + (BX - HALF) + '" data-val="lv">' + sub("E", "v") + '</text>' +
      '<text class="oa-label sm-ef" x="' + (BX - HALF) + '" data-val="lef">' + sub("E", "F") + '</text>' +
      '<g class="sm-flow"></g>' +
      '</svg>' +
      chipRow([["-2", "Reverse \\u22122 V"], ["0", "Equilibrium"], ["0.5", "Forward +0.5 V"]], "Bias presets", "bias") +
      infoPanel +
      '<div class="oa-controls">' +
      slider("vd", "V<sub>D</sub>", -2, 0.7, 0.02, 0) +
      slider("a", "log N<sub>a</sub>", 15, 18, 0.1, 17) +
      slider("b", "log N<sub>d</sub>", 15, 18, 0.1, 16) +
      "</div>" +
      '<p class="oa-readout"></p>'

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const ins = { vd: root.querySelector('input[data-k="vd"]'), a: root.querySelector('input[data-k="a"]'), b: root.querySelector('input[data-k="b"]') }
    const outs = root.querySelectorAll("output")
    const flowG = root.querySelector(".sm-flow")
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")

    // The junction for given doping and bias (cgs: cm, V, V/cm)
    const calc = (a, b, vd) => {
      const Na = Math.pow(10, a), Nd = Math.pow(10, b)
      const vbi = KT * Math.log((Na * Nd) / (NI * NI))
      const v = Math.min(vd, vbi - 0.04)
      const vt = vbi - v
      const widths = (V) => {
        const xn = Math.sqrt((((2 * ES * V) / Q) * (Na / Nd)) / (Na + Nd))
        return { xn, xp: (xn * Nd) / Na }
      }
      const w = widths(vt)
      const ref = widths(vbi + 2)
      return { Na, Nd, vbi, v, vt, xn: w.xn, xp: w.xp, w: w.xn + w.xp, emax: (2 * vt) / (w.xn + w.xp), ref, vtRef: vbi + 2, eRef: (2 * (vbi + 2)) / (ref.xn + ref.xp) }
    }
    const phiAt = (c, x) => {
      if (x <= -c.xp) return 0
      if (x < 0) return ((Q * c.Na) / (2 * ES)) * Math.pow(x + c.xp, 2)
      if (x < c.xn) return c.vt - ((Q * c.Nd) / (2 * ES)) * Math.pow(c.xn - x, 2)
      return c.vt
    }

    // carriers in the band diagram: forward, electrons and holes cross; reverse, a trickle
    const flow = []
    for (let k = 0; k < 16; k++) {
      const hole = k >= 8
      flow.push({ el: mk("circle", { class: "sm-dot " + (hole ? "sm-hole" : "sm-elec"), r: 4 }, flowG), hole, s: (k % 8) / 8 })
    }
    let cur = null // the junction last drawn
    let curSc = 1 // and its pixels per cm

    const draw = () => {
      const c = calc(view.a, view.b, view.vd)
      cur = c
      const span = 1.08 * Math.max(c.ref.xn, c.ref.xp) // fits the widest case, 2 V of reverse bias
      const sc = HALF / span
      curSc = sc
      const X = (x) => CX + x * sc
      const xp = X(-c.xp), x0 = X(0), xn = X(c.xn)
      ;[["xp", xp], ["x0", x0], ["xn", xn]].forEach(([k, x]) => { put($("v-" + k), "x1", x.toFixed(1)); put($("v-" + k), "x2", x.toFixed(1)) })
      put($("xlab-p"), "x", xp.toFixed(1)); put($("xlab-0"), "x", x0.toFixed(1)); put($("xlab-n"), "x", xn.toFixed(1))
      // charge: blocks, heights set by the doping relative to the heavier side (p is negative, so it hangs down)
      const top = Math.max(c.Na, c.Nd)
      const hp = (c.Na / top) * 32, hn = (c.Nd / top) * 32
      put($("rhop"), "x", xp.toFixed(1)); put($("rhop"), "width", (x0 - xp).toFixed(1)); put($("rhop"), "y", 68); put($("rhop"), "height", hp.toFixed(1))
      put($("rhon"), "x", x0.toFixed(1)); put($("rhon"), "width", (xn - x0).toFixed(1)); put($("rhon"), "y", (68 - hn).toFixed(1)); put($("rhon"), "height", hn.toFixed(1))
      // field: a triangle hanging below its baseline (it points toward p, so it is negative)
      const eh = 62 * (c.emax / c.eRef)
      put($("pe"), "d", "M60 158 L" + xp.toFixed(1) + " 158 L" + x0.toFixed(1) + " " + (158 + eh).toFixed(1) + " L" + xn.toFixed(1) + " 158 L320 158")
      // potential, from 0 on the p side to V_total on the n side
      const vs = 70 / c.vtRef
      let d = "M60 348 L" + xp.toFixed(1) + " 348"
      for (let k = 1; k <= 40; k++) { const x = -c.xp + ((c.xp + c.xn) * k) / 40; d += " L" + X(x).toFixed(1) + " " + (348 - phiAt(c, x) * vs).toFixed(1) }
      put($("pv"), "d", d + " L320 " + (348 - c.vt * vs).toFixed(1))
      // bands: E_c(x) = E_c,p - phi(x), with the p side at the top
      const pts = [[BX - HALF, 0]] // E_c(x) samples: [px, phi]
      for (let k = 0; k <= 40; k++) { const x = -c.xp + ((c.xp + c.xn) * k) / 40; pts.push([BX + x * sc, phiAt(c, x)]) }
      pts.push([BX + HALF, c.vt])
      const path = (off) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + (70 + EPX * (p[1] + off)).toFixed(1)).join("")
      put($("ec"), "d", path(0)); put($("ev"), "d", path(EG))
      const dn = Math.max(0.03, KT * Math.log(2.8e19 / c.Nd))
      const dp = Math.max(0.03, EG - c.vbi - dn) // E_F - E_v on the p side
      const yEfp = 70 + EPX * EG - EPX * dp
      const yEfn = yEfp - EPX * c.v // the n side's Fermi level sits eV_D higher in forward bias
      const mid = BX + ((-c.xp + c.xn) / 2) * sc
      put($("efp"), "x1", BX - HALF); put($("efp"), "x2", mid.toFixed(1)); put($("efp"), "y1", yEfp.toFixed(1)); put($("efp"), "y2", yEfp.toFixed(1))
      put($("efn"), "x1", mid.toFixed(1)); put($("efn"), "x2", BX + HALF); put($("efn"), "y1", yEfn.toFixed(1)); put($("efn"), "y2", yEfn.toFixed(1))
      put($("lc"), "y", 62); put($("lv"), "y", (70 + EPX * EG + 16).toFixed(1)); put($("lef"), "y", (yEfp - 6).toFixed(1))
      const showD = Math.abs(c.v) > 0.04
      put($("evd"), "x1", BX + HALF - 6); put($("evd"), "x2", BX + HALF - 6); put($("evd"), "y1", yEfp.toFixed(1)); put($("evd"), "y2", yEfn.toFixed(1)); put($("evd"), "style.opacity", showD ? 1 : 0)
      put($("evdlab"), "x", BX + HALF - 12); put($("evdlab"), "y", ((yEfp + yEfn) / 2 + 4).toFixed(1)); put($("evdlab"), "text-anchor", "end"); put($("evdlab"), "style.opacity", showD ? 1 : 0)
    }

    // where a carrier sits on a band at parameter t (0 = p side, 1 = n side)
    const bandPoint = (t, hole) => {
      const x = BX - HALF + t * 2 * HALF
      const phi = phiAt(cur, (x - BX) / curSc)
      return [x, 70 + EPX * (phi + (hole ? EG : 0)) + (hole ? 7 : -7)]
    }

    const info = () => {
      const c = cur || calc(P.a, P.b, P.vd)
      if (Math.abs(c.v) < 0.03)
        return ["Equilibrium: one Fermi level", "Diffusion pushes carriers across and drift in the junction field pushes the same number back, so the net current is zero. The barrier is eV<sub>bi</sub> and the two sides share one flat E<sub>F</sub>."]
      if (c.v > 0)
        return ["Forward bias: the barrier shrinks", "The applied voltage opposes the built-in one, so V<sub>total</sub> = V<sub>bi</sub> &minus; V<sub>D</sub> falls. The depletion region narrows (w &prop; &radic;V<sub>total</sub>), the peak field drops, and the Fermi levels split by eV<sub>D</sub>. Electrons and holes climb the lowered barrier in large numbers, and the current grows as e<sup>V<sub>D</sub>/V<sub>t</sub></sup>."]
      return ["Reverse bias: the barrier grows", "V<sub>total</sub> = V<sub>bi</sub> + |V<sub>D</sub>| rises, so the depletion region widens and the field peaks higher. The barrier is too tall for the majority carriers. Only a thin trickle of minority carriers slides down the hill, which is why the reverse current saturates at I<sub>s</sub>."]
    }

    const refresh = () => {
      const c = calc(P.a, P.b, P.vd)
      outs[0].textContent = (P.vd > 0 ? "+" : "") + minus(P.vd.toFixed(2)) + " V" + (P.vd > c.vbi - 0.04 ? " (max)" : "")
      outs[1].textContent = sci(c.Na, 1) + " cm\\u207b\\u00b3"
      outs[2].textContent = sci(c.Nd, 1) + " cm\\u207b\\u00b3"
      const d = info()
      infoTitle.innerHTML = d[0]
      infoText.innerHTML = d[1]
      const um = (x) => (x * 1e4).toFixed(x * 1e4 >= 0.1 ? 2 : 3) + " \\u00b5m"
      readout.innerHTML =
        "V<sub>bi</sub> = " + c.vbi.toFixed(3) + " V &nbsp;&middot;&nbsp; V<sub>total</sub> = V<sub>bi</sub> &minus; V<sub>D</sub> = " + c.vt.toFixed(3) + " V<br>" +
        "x<sub>p</sub> = " + um(c.xp) + " &nbsp;&middot;&nbsp; x<sub>n</sub> = " + um(c.xn) + " &nbsp;&middot;&nbsp; w = " + um(c.w) + " &nbsp;&middot;&nbsp; |E<sub>max</sub>| = " + sci(c.emax, 1) + " V/cm<br>" +
        "I/I<sub>s</sub> = e<sup>V<sub>D</sub>/V<sub>t</sub></sup> &minus; 1 = " + sci(Math.exp(c.v / KT) - 1, 1) + " &nbsp;(Si, 300 K, n<sub>i</sub> = 10<sup>10</sup> cm<sup>&minus;3</sup>)"
    }

    const markBias = chipGroup(root, "bias", (k, mark) => { mark(k); P.vd = +k; ins.vd.value = k; refresh() })
    ;["vd", "a", "b"].forEach((k) => ins[k].addEventListener("input", () => {
      P[k] = +ins[k].value
      root.querySelectorAll('.oa-chip[data-group="bias"]').forEach((c) => c.setAttribute("aria-pressed", "false"))
      refresh()
    }))
    markBias("0")

    refresh()
    draw()
    animate(root, (dt) => {
      const k = calm ? 1 : 1 - Math.exp(-dt * 9)
      let moved = false
      for (const key of ["vd", "a", "b"]) {
        const diff = P[key] - view[key]
        if (Math.abs(diff) > 1e-4) { view[key] += diff * k; moved = true } else view[key] = P[key]
      }
      if (moved) draw()
      // carriers
      const c = cur
      const lvl = c.v > 0.03 ? clamp(Math.pow(c.v / (c.vbi - 0.04), 1.4), 0.05, 1) : 0
      const nF = Math.round(lvl * 8)
      const trickle = c.v < -0.1 ? 1 : 0
      flow.forEach((f, i) => {
        const idx = i % 8
        const rev = lvl === 0
        const on = !calm && (rev ? idx < trickle : idx < nF)
        if (!on) { put(f.el, "style.opacity", 0); return }
        // forward: holes go p -> n and electrons n -> p. Reverse: the minority carriers slide downhill the other way.
        const dirn = (f.hole ? 1 : -1) * (rev ? -1 : 1)
        f.s = (f.s + dirn * dt * (rev ? 0.14 : 0.2 + 0.5 * lvl) + 1) % 1
        const [x, y] = bandPoint(f.s, f.hole)
        put(f.el, "cx", x.toFixed(1)); put(f.el, "cy", y.toFixed(1)); put(f.el, "style.opacity", rev ? 0.55 : 1)
      })
      const d = info()
      put(infoTitle, "html", d[0]); put(infoText, "html", d[1])
    })
  }

  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-semi:not([data-ready])").forEach((root) => {
      root.dataset.ready = "true"
      const v = root.dataset.view
      if (v === "fermi") buildFermi(root)
      else if (v === "pn") buildPN(root)
      else buildHall(root)
    })
  })
})()
`

export default (() => MelonSemi) satisfies QuartzComponentConstructor
