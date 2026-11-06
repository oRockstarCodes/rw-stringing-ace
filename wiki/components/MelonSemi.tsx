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
//   <div class="melon-semi" data-view="carriers"></div>
//     Counting carriers (Figure 6.1). Bands, states g(E), the Fermi function f(E) and the
//     resulting electron and hole distributions share one energy axis. Slide E_F and T and watch
//     n_0 and p_0 trade places while n_0 p_0 stays pinned at n_i^2.
//
//   <div class="melon-semi" data-view="pnform"></div>
//     How a p-n junction forms (Figure 7.1). The physical cross-section and the band diagram
//     share one x-axis. Press play: carriers diffuse across and recombine, fixed ions are
//     exposed, a field builds and pushes back, and the bands bend until E_F is flat. Pick equal
//     or unequal doping, or scrub the time slider.
//
//   <div class="melon-semi" data-view="pn"></div>
//     The p-n junction (Figure 7.2). Slide the bias and the doping: the charge, field
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

  // =====================================================================================
  // How a p-n junction forms
  // =====================================================================================

  function buildPNForm(root) {
    const id = "sm" + ++uid
    const X0 = 60, X1 = 580, JX = 320, SY0 = 30, SY1 = 130 // the slab, in pixels
    const YCN = 262, GAP = 80, BARRIER = 48 // band diagram: n-side E_c, the gap, and eV_bi
    const WMAX = 124 // the final depletion width
    const TOTAL = 10 // seconds for the whole build-up
    const NCAR = 22 // mobile carriers drawn on each side
    const BAR_X = 190, BAR_W = 230
    const RATIO = { eq: 1, p: 4, n: 0.25 } // N_a / N_d
    const RTXT = { eq: "1 : 1", p: "4 : 1", n: "1 : 4" }
    const st = { u: calm ? 1 : 0, play: false, dop: "eq" }
    const view = { s: calm ? 1 : 0, r: 1 }
    // s is how far the junction is toward equilibrium (0 = just touching, 1 = done). Time
    // runs fast at first, when the gradient is steep, and slows as the barrier builds.
    const ease = (u) => 1 - (1 - u) * (1 - u)

    root.innerHTML =
      '<svg class="oa-svg sm-svg" viewBox="0 0 640 442" role="img" aria-label="A p-n junction forming: the physical cross-section with carriers and fixed ions above, and the matching band diagram below">' +
      '<defs><marker id="' + id + 'f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="sm-ah sm-ah-e" d="M0 0 L10 5 L0 10 z"/></marker></defs>' +
      '<text class="oa-caption" x="' + X0 + '" y="16">physical picture</text>' +
      '<circle class="sm-dot sm-hole" cx="372" cy="12" r="4.5"/><text class="oa-small" x="381" y="16">hole</text>' +
      '<circle class="sm-dot sm-elec" cx="424" cy="12" r="4.5"/><text class="oa-small" x="433" y="16">electron</text>' +
      '<rect class="sm-ion sm-ion-n is-on" x="492" y="7" width="10" height="10" rx="2"/><text class="oa-small" x="508" y="16">fixed ion</text>' +
      '<rect class="sm-strip" x="' + X0 + '" y="' + SY0 + '" width="' + (X1 - X0) + '" height="' + (SY1 - SY0) + '"/>' +
      '<rect class="sm-zn sm-zn-p" data-val="zp" y="' + SY0 + '" height="' + (SY1 - SY0) + '"/>' +
      '<rect class="sm-zn sm-zn-n" data-val="zn" y="' + SY0 + '" height="' + (SY1 - SY0) + '"/>' +
      '<g class="sm-ions"></g>' +
      '<line class="sm-guide" data-val="gj" y1="' + SY0 + '" y2="' + SY1 + '"/>' +
      '<line class="sm-guide" data-val="gl" y1="' + SY1 + '" y2="364"/><line class="sm-guide" data-val="gr" y1="' + SY1 + '" y2="364"/>' +
      '<g class="sm-carriers"></g><g class="sm-flashes"></g>' +
      '<text class="oa-label" x="170" y="150" text-anchor="middle">p-type</text><text class="oa-label" x="470" y="150" text-anchor="middle">n-type</text>' +
      '<line class="sm-force sm-force-e" data-val="fe" y1="142" y2="142" marker-end="url(#' + id + 'f)"/>' +
      '<text class="oa-small" data-val="felab" x="' + JX + '" y="166" text-anchor="middle">depletion region, field E</text>' +
      // the band diagram
      '<text class="oa-caption" x="' + X0 + '" y="192">energy picture</text><text class="oa-small" x="' + X1 + '" y="192" text-anchor="end">electron energy increases upward</text>' +
      '<path class="sm-band" data-val="cb"/><path class="sm-band" data-val="vb"/>' +
      '<path class="sm-bandline" data-val="ec"/><path class="sm-bandline" data-val="ev"/>' +
      '<line class="sm-ef-line" data-val="efp" x1="' + X0 + '" x2="' + JX + '"/><line class="sm-ef-line" data-val="efn" x1="' + JX + '" x2="' + X1 + '"/>' +
      '<line class="sm-mis" data-val="mis" x1="' + JX + '" x2="' + JX + '"/>' +
      '<text class="oa-small sm-mislab" data-val="mislab" x="' + (JX + 8) + '">' + sub("E", "F") + ' differ</text>' +
      '<text class="oa-label" x="54" text-anchor="end" data-val="lc">' + sub("E", "c") + '</text>' +
      '<text class="oa-label" x="54" text-anchor="end" data-val="lv">' + sub("E", "v") + '</text>' +
      '<text class="oa-label sm-ef" x="66" data-val="lefp">' + sub("E", "F") + '</text>' +
      '<text class="oa-label sm-ef" x="574" text-anchor="end" data-val="lefn">' + sub("E", "F") + '</text>' +
      '<line class="sm-evd" data-val="bk" x1="592" x2="592"/><line class="sm-evd" data-val="bk1" x1="586" x2="598"/><line class="sm-evd" data-val="bk2" x1="586" x2="598" y1="' + YCN + '" y2="' + YCN + '"/>' +
      '<text class="oa-label sm-evdlab" data-val="bklab" x="600"></text>' +
      '<g class="sm-bcars"></g><g class="sm-bflashes"></g>' +
      // who is winning: diffusion or drift
      '<text class="oa-small" x="' + X0 + '" y="392">diffusion (p &rarr; n)</text><rect class="sm-bar sm-bar-d" data-val="bd" x="' + BAR_X + '" y="384" height="8"/>' +
      '<text class="oa-small" x="' + X0 + '" y="410">drift (n &rarr; p)</text><rect class="sm-bar sm-bar-r" data-val="br" x="' + BAR_X + '" y="402" height="8"/>' +
      '<text class="oa-small" x="' + X0 + '" y="428">net current</text><rect class="sm-bar sm-bar-n" data-val="bn" x="' + BAR_X + '" y="420" height="8"/>' +
      '</svg>' +
      (calm ? "" : chipRow([["play", "Play"], ["replay", "Replay"]], "Animation", "go")) +
      chipRow([["eq", "Equal doping"], ["p", "Heavier p side"], ["n", "Heavier n side"]], "Doping", "dop") +
      infoPanel +
      '<div class="oa-controls">' + slider("u", "Time", 0, 1, 0.005, st.u) + "</div>" +
      '<p class="oa-readout"></p>'

    const el = {}
    root.querySelectorAll("[data-val]").forEach((n) => { el[n.dataset.val] = n })
    const $ = (k) => el[k]
    const uIn = root.querySelector('input[data-k="u"]')
    const out = root.querySelector("output")
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")
    const playChip = root.querySelector('.oa-chip[data-key="play"]')

    // Fixed dopant ions: acceptors (-) on the p side, donors (+) on the n side. They are
    // outlined while a carrier covers them and filled once the carrier is gone.
    const ionsG = root.querySelector(".sm-ions")
    const ions = []
    ;[[0, 48], [13, 80], [0, 112]].forEach(([off, y]) => {
      for (let k = 0; k < (off ? 9 : 10); k++) for (const side of [-1, 1]) {
        const x = (side < 0 ? 74 : 332) + off + 26 * k
        const rect = mk("rect", { class: "sm-ion " + (side < 0 ? "sm-ion-p" : "sm-ion-n"), x: x - 6, y: y - 6, width: 12, height: 12, rx: 2 }, ionsG)
        const sign = mk("text", { class: "sm-ion-sign", x, y: y + 4.5 }, ionsG)
        sign.textContent = side < 0 ? "\\u2212" : "+"
        ions.push({ x, side, rect, sign })
      }
    })

    // Mobile carriers, each drawn twice: as a dot in the slab and as a dot riding its band
    const carG = root.querySelector(".sm-carriers"), bcarG = root.querySelector(".sm-bcars")
    const cars = []
    for (let k = 0; k < NCAR * 2; k++) {
      const hole = k < NCAR
      const cls = "sm-dot " + (hole ? "sm-hole" : "sm-elec")
      cars.push({
        hole, x: 0, y: 0, vx: 0, vy: 0, q: 0, fade: 1, cross: false, depth: 0,
        el: mk("circle", { class: cls, r: 4.5 }, carG), bel: mk("circle", { class: cls, r: 3.8 }, bcarG),
      })
    }
    // Recombination flashes, in both pictures at once
    const flG = root.querySelector(".sm-flashes"), bflG = root.querySelector(".sm-bflashes")
    const flashes = []
    for (let k = 0; k < 12; k++)
      flashes.push({ el: mk("circle", { class: "sm-flash", r: 4 }, flG), bel: mk("circle", { class: "sm-flash", r: 4 }, bflG), t: -1, x: 0, y: 0, by: 0 })

    // Depletion approximation: how far the region reaches into each side (pixels), and the
    // shape of the potential step across it (0 on the p side, 1 on the n side)
    const geom = (s, r) => {
      const w = WMAX * Math.sqrt(s) // w goes as the square root of V_total, which grows as s
      return { xp: w / (1 + r), xn: (w * r) / (1 + r) }
    }
    const phi = (x, g) => {
      const w = g.xp + g.xn
      if (w < 0.5) return x < JX ? 0 : 1
      if (x <= JX - g.xp) return 0
      if (x >= JX + g.xn) return 1
      if (x < JX) return (g.xp / w) * Math.pow((x - (JX - g.xp)) / g.xp, 2)
      return 1 - (g.xn / w) * Math.pow((JX + g.xn - x) / g.xn, 2)
    }
    const ecAt = (x, s, g) => YCN - BARRIER * s * (1 - phi(x, g))
    const bandY = (c, s, g) => { const ec = ecAt(c.x, s, g); return c.hole ? ec + GAP + 5 + c.q * 13 : ec - 5 - c.q * 13 }

    // Put a carrier on its own side: anywhere, or (when it replaces one that recombined)
    // in the far part, and fade it in
    const place = (c, anywhere) => {
      const g = geom(view.s, view.r)
      const lo = c.hole ? X0 + 10 : JX + g.xn + 6
      const hi = c.hole ? JX - g.xp - 6 : X1 - 10
      const span = Math.max(4, hi - lo)
      const f = anywhere ? Math.random() : Math.random() * 0.6
      c.x = c.hole ? lo + f * span : hi - f * span
      c.y = SY0 + 9 + Math.random() * (SY1 - SY0 - 18)
      c.vx = 0; c.vy = 0; c.q = Math.random(); c.cross = false; c.fade = anywhere ? 1 : 0
    }
    const flash = (x, y, by) => {
      const f = flashes.find((q) => q.t < 0)
      if (f) { f.t = 0; f.x = x; f.y = y; f.by = by }
    }
    const die = (c, s, g) => { flash(c.x, c.y, bandY(c, s, g)); place(c, false) }
    const scatter = () => { cars.forEach((c) => place(c, true)); flashes.forEach((f) => { f.t = -1 }) }

    // One time step of the carriers: thermal jostling, a pull toward the junction while the
    // concentration gradient is steep, and a barrier at the edge of the depletion region
    // that fewer and fewer get over
    const step = (dt) => {
      const s = view.s, g = geom(s, view.r)
      const ZL = JX - g.xp, ZR = JX + g.xn
      const sq = Math.sqrt(dt)
      cars.forEach((c) => {
        if (c.fade < 1) c.fade = Math.min(1, c.fade + dt * 2.5)
        const dir = c.hole ? 1 : -1 // toward the junction
        c.vx += -3 * c.vx * dt + 260 * (Math.random() - 0.5) * sq
        c.vy += -3 * c.vy * dt + 260 * (Math.random() - 0.5) * sq
        if (c.cross) c.vx = dir * 90
        else c.vx += dir * 120 * (1 - s) * dt
        c.x += c.vx * dt
        c.y += c.vy * dt
        if (c.y < SY0 + 9) { c.y = SY0 + 9; c.vy = Math.abs(c.vy) }
        else if (c.y > SY1 - 9) { c.y = SY1 - 9; c.vy = -Math.abs(c.vy) }
        if (c.hole && c.x < X0 + 9) { c.x = X0 + 9; c.vx = Math.abs(c.vx) }
        else if (!c.hole && c.x > X1 - 9) { c.x = X1 - 9; c.vx = -Math.abs(c.vx) }
        if (c.cross) {
          // it made it across: it meets a carrier of the other kind and they recombine
          if (c.hole ? c.x >= JX + c.depth : c.x <= JX - c.depth) die(c, s, g)
          return
        }
        const over = c.hole ? c.x - ZL : ZR - c.x // how far into the depletion region
        if (over > 5) { die(c, s, g); return } // the region grew over it
        if (over > 0) {
          if (Math.random() < Math.exp(-4 * s)) { c.cross = true; c.depth = Math.random() * 14 }
          else { c.x = c.hole ? ZL - 1 : ZR + 1; c.vx = -dir * (30 + Math.random() * 30) } // turned back by the field
        }
      })
      flashes.forEach((f) => { if (f.t >= 0) { f.t += dt; if (f.t > 0.6) f.t = -1 } })
    }

    let lastKey = ""
    const draw = () => {
      const s = view.s, g = geom(s, view.r)
      const ZL = JX - g.xp, ZR = JX + g.xn
      put($("zp"), "x", ZL.toFixed(1)); put($("zp"), "width", g.xp.toFixed(1))
      put($("zn"), "x", JX); put($("zn"), "width", g.xn.toFixed(1))
      ;[["gj", JX], ["gl", ZL], ["gr", ZR]].forEach(([k, x]) => { put($(k), "x1", x.toFixed(1)); put($(k), "x2", x.toFixed(1)) })
      put($("gl"), "style.opacity", s > 0.02 ? 1 : 0); put($("gr"), "style.opacity", s > 0.02 ? 1 : 0)
      ions.forEach((i) => {
        const a = clamp(((i.side < 0 ? i.x - ZL : ZR - i.x) / 12) + 0.5, 0, 1)
        const on = a > 0.5 ? " is-on" : ""
        put(i.rect, "class", "sm-ion " + (i.side < 0 ? "sm-ion-p" : "sm-ion-n") + on)
        put(i.sign, "class", "sm-ion-sign" + on)
        put(i.rect, "style.opacity", (0.4 + 0.6 * a).toFixed(2))
        put(i.sign, "style.opacity", (0.4 + 0.6 * a).toFixed(2))
      })
      // the field the exposed ions make, pointing n -> p
      const fo = clamp((s - 0.06) * 4, 0, 1)
      put($("fe"), "x1", (ZR - 4).toFixed(1)); put($("fe"), "x2", (ZL + 4).toFixed(1)); put($("fe"), "style.opacity", fo.toFixed(2))
      put($("felab"), "style.opacity", fo.toFixed(2))
      // carriers
      cars.forEach((c) => {
        put(c.el, "cx", c.x.toFixed(1)); put(c.el, "cy", c.y.toFixed(1)); put(c.el, "style.opacity", c.fade.toFixed(2))
        put(c.bel, "cx", c.x.toFixed(1)); put(c.bel, "cy", bandY(c, s, g).toFixed(1)); put(c.bel, "style.opacity", c.fade.toFixed(2))
      })
      flashes.forEach((f) => {
        const on = f.t >= 0
        const k = on ? f.t / 0.6 : 0
        put(f.el, "cx", f.x.toFixed(1)); put(f.el, "cy", f.y.toFixed(1)); put(f.el, "r", (4 + 16 * k).toFixed(1)); put(f.el, "style.opacity", on ? (1 - k).toFixed(2) : 0)
        put(f.bel, "cx", f.x.toFixed(1)); put(f.bel, "cy", f.by.toFixed(1)); put(f.bel, "r", (4 + 16 * k).toFixed(1)); put(f.bel, "style.opacity", on ? (1 - k).toFixed(2) : 0)
      })
      // bands: the p side rises by s * eV_bi, and the edges bend across the depletion region
      const key = s.toFixed(4) + "|" + view.r.toFixed(3)
      if (key !== lastKey) {
        lastKey = key
        const xs = []
        for (let x = X0; x <= X1; x += 10) xs.push(x)
        xs.push(ZL, JX, ZR)
        xs.sort((a, b) => a - b)
        const line = (off) => xs.map((x, i) => (i ? "L" : "M") + x.toFixed(1) + " " + (ecAt(x, s, g) + off).toFixed(1)).join("")
        const ec = line(0), ev = line(GAP)
        put($("ec"), "d", ec); put($("ev"), "d", ev)
        put($("cb"), "d", ec + "L" + X1 + " 204L" + X0 + " 204Z")
        put($("vb"), "d", ev + "L" + X1 + " 364L" + X0 + " 364Z")
      }
      const ecp = YCN - BARRIER * s
      put($("lc"), "y", (ecp + 4).toFixed(1)); put($("lv"), "y", (ecp + GAP + 4).toFixed(1))
      // Fermi levels: they differ until the bands have shifted by eV_bi
      const yEFn = YCN + 16, yEFp = YCN + GAP - 16 - BARRIER * s
      put($("efp"), "y1", yEFp.toFixed(1)); put($("efp"), "y2", yEFp.toFixed(1))
      put($("efn"), "y1", yEFn); put($("efn"), "y2", yEFn)
      put($("lefp"), "y", (yEFp - 5).toFixed(1)); put($("lefn"), "y", yEFn - 5)
      const mo = clamp((yEFp - yEFn) / 6, 0, 1).toFixed(2)
      put($("mis"), "y1", yEFp.toFixed(1)); put($("mis"), "y2", yEFn); put($("mis"), "style.opacity", mo)
      put($("mislab"), "y", ((yEFp + yEFn) / 2 + 4).toFixed(1)); put($("mislab"), "style.opacity", mo)
      // the barrier, eV
      const bo = BARRIER * s > 5 ? 1 : 0
      put($("bk"), "y1", ecp.toFixed(1)); put($("bk"), "y2", YCN); put($("bk"), "style.opacity", bo)
      put($("bk1"), "y1", ecp.toFixed(1)); put($("bk1"), "y2", ecp.toFixed(1)); put($("bk1"), "style.opacity", bo)
      put($("bk2"), "style.opacity", bo)
      put($("bklab"), "y", ((ecp + YCN) / 2 + 4).toFixed(1)); put($("bklab"), "html", "eV" + (s > 0.97 ? '<tspan class="oa-sub" dy="4">bi</tspan>' : "")); put($("bklab"), "style.opacity", bo)
      // diffusion falls to meet drift, and the net current goes to zero (schematic scale)
      const dv = 1 - 0.8 * s, dr = 0.2 * s
      put($("bd"), "width", (BAR_W * dv).toFixed(1)); put($("br"), "width", (BAR_W * dr).toFixed(1)); put($("bn"), "width", (BAR_W * Math.max(0, dv - dr)).toFixed(1))
      // words
      const d = info(s)
      put(infoTitle, "html", d[0]); put(infoText, "html", d[1])
      out.textContent = Math.round(s * 100) + "% of the way to equilibrium"
      put(readout, "html", "Barrier so far: " + Math.round(s * 100) + "% of eV<sub>bi</sub> &nbsp;&middot;&nbsp; depletion width: " + Math.round(Math.sqrt(s) * 100) + "% of its final size (w &prop; &radic;V<sub>total</sub>) &nbsp;&middot;&nbsp; x<sub>n</sub> : x<sub>p</sub> = N<sub>a</sub> : N<sub>d</sub> = " + RTXT[st.dop])
    }

    function info(s) {
      if (s < 0.02)
        return ["Two pieces, just touching", "The p side is full of holes and the n side is full of electrons. Every mobile carrier is matched by a fixed dopant ion of the opposite charge, so both sides are neutral. The two pieces start with their Fermi levels at different heights (low in p, high in n) and with the bands level with each other. Press play."]
      if (s < 0.55)
        return ["1&ndash;2. Diffusion and recombination", "Holes diffuse right and electrons diffuse left, down their concentration gradients. A carrier that gets across meets one of the other kind and the pair recombine (the flashes). Every carrier that goes leaves its fixed ion <b>uncovered</b>: a &minus; acceptor on the p side and a + donor on the n side. The depletion region starts to grow, and as electrons leave n the bands shift so that the Fermi levels can line up."]
      if (s < 0.97)
        return ["3. The exposed ions build a field", "The uncovered ions make an electric field pointing from n to p. It pushes holes back toward p and electrons back toward n. In the band picture a carrier now has to climb the barrier, so fewer make it across: watch more of them turn back at the edge. The Fermi levels are almost level."]
      const note = st.dop === "eq" ? "" : st.dop === "p" ? " With N<sub>a</sub> &gt; N<sub>d</sub>, the n side gives up more width: N<sub>a</sub>x<sub>p</sub> = N<sub>d</sub>x<sub>n</sub>, so x<sub>n</sub> is the larger one." : " With N<sub>d</sub> &gt; N<sub>a</sub>, the p side gives up more width: N<sub>a</sub>x<sub>p</sub> = N<sub>d</sub>x<sub>n</sub>, so x<sub>p</sub> is the larger one."
      return ["4. Equilibrium", "Diffusion (down the gradient) and drift (the field pushing back) now cancel, so there is no net current. Both are still there: the occasional carrier still makes it over the top, and the same number is pushed back. The depletion region has stopped growing, E<sub>F</sub> is one flat line and the bands are bent by eV<sub>bi</sub>." + note]
    }

    const setPlay = (on) => {
      st.play = on
      if (playChip) { playChip.setAttribute("aria-pressed", String(on)); playChip.textContent = on ? "Pause" : "Play \\u25b6\\ufe0e" }
    }
    const reset = () => { st.u = 0; uIn.value = 0; view.s = 0; scatter() }
    const replay = () => { reset(); setPlay(true) }

    chipGroup(root, "go", (k) => {
      if (k === "replay") { replay(); return }
      if (!st.play && st.u >= 1) reset()
      setPlay(!st.play)
    })
    const markDop = chipGroup(root, "dop", (k, mark) => {
      st.dop = k
      mark(k)
      if (calm) { view.r = RATIO[k]; scatter() }
    })
    uIn.addEventListener("input", () => {
      const before = view.s
      st.u = +uIn.value
      setPlay(false)
      view.s = ease(st.u)
      if (calm || view.s < before - 0.02) scatter()
      draw()
    })
    markDop("eq")
    if (playChip) playChip.setAttribute("aria-pressed", "false")
    if (!calm) {
      root.addEventListener("sm-visible", replay)
      if (typeof IntersectionObserver === "undefined") setPlay(true)
    }

    scatter()
    draw()
    animate(root, (dt) => {
      if (st.play) {
        st.u = Math.min(1, st.u + dt / TOTAL)
        uIn.value = st.u
        if (st.u >= 1) setPlay(false)
      }
      const k = calm ? 1 : 1 - Math.exp(-dt * 9)
      const sT = ease(st.u), rT = RATIO[st.dop]
      view.s = Math.abs(sT - view.s) < 1e-4 ? sT : view.s + (sT - view.s) * k
      view.r = Math.abs(rT - view.r) < 1e-3 ? rT : view.r + (rT - view.r) * k
      if (!calm) step(dt)
      draw()
    })
  }

  // =====================================================================================
  // Counting carriers
  // =====================================================================================

  function buildCarriers(root) {
    const KB = 8.617e-5
    const EG = 1.12, NC0 = 2.8e19, NV0 = 1.04e19 // silicon at 300 K
    const EC = EG / 2, EV = -EG / 2 // energies in eV from mid-gap
    const yE = (E) => 180 - E * 125
    const X_G = 250, W_G = 110, X_F = 400, W_F = 110, X_N = 550, W_N = 150
    const EMAX = 1.2, DMAX = EMAX - EC // how far above E_c (below E_v) the panels reach
    const xBar = (v) => 100 + (clamp(Math.log10(Math.max(v, 1)), 0, 20) / 20) * 560
    const P = { ef: 0, T: 300 }
    const view = { ef: 0, T: 300 }
    const cm3 = "cm\\u207b\\u00b3"

    root.innerHTML =
      '<svg class="oa-svg sm-svg" viewBox="0 0 760 430" role="img" aria-label="Bands, states available, Fermi function and the resulting electron and hole counts on one shared energy axis">' +
      '<rect class="sm-band" data-val="cb" x="60" width="130"/>' +
      '<rect class="sm-band" data-val="vb" x="60" width="130"/>' +
      '<line class="sm-guide" data-val="gc" x1="60" x2="710"/><line class="sm-guide" data-val="gv" x1="60" x2="710"/>' +
      '<line class="sm-ef-line" data-val="gef" x1="60" x2="710"/>' +
      '<text class="oa-label" data-val="lc" x="54" text-anchor="end">' + sub("E", "c") + '</text>' +
      '<text class="oa-label" data-val="lv" x="54" text-anchor="end">' + sub("E", "v") + '</text>' +
      '<text class="oa-label sm-ef" data-val="lef" x="196">' + sub("E", "F") + '</text>' +
      '<text class="oa-caption" x="125" y="18" text-anchor="middle">1 &middot; bands</text>' +
      '<text class="oa-caption" x="' + (X_G + 55) + '" y="18" text-anchor="middle">2 &middot; states, g(E)</text>' +
      '<text class="oa-caption" x="' + (X_F + 55) + '" y="18" text-anchor="middle">3 &middot; chance filled, f(E)</text>' +
      '<text class="oa-caption" x="' + (X_N + 70) + '" y="18" text-anchor="middle">4 &middot; carriers</text>' +
      '<line class="sm-axis" x1="' + X_G + '" y1="30" x2="' + X_G + '" y2="330"/>' +
      '<line class="sm-axis" x1="' + X_F + '" y1="30" x2="' + X_F + '" y2="330"/>' +
      '<line class="sm-guide" x1="' + (X_F + W_F) + '" y1="30" x2="' + (X_F + W_F) + '" y2="330"/>' +
      '<line class="sm-axis" x1="' + X_N + '" y1="30" x2="' + X_N + '" y2="330"/>' +
      '<text class="oa-small" x="' + X_G + '" y="344" text-anchor="middle">0</text>' +
      '<text class="oa-small" x="' + (X_G + W_G / 2) + '" y="344" text-anchor="middle">more states &rarr;</text>' +
      '<text class="oa-small" x="' + X_F + '" y="344" text-anchor="middle">0</text>' +
      '<text class="oa-small" x="' + (X_F + W_F) + '" y="344" text-anchor="middle">1</text>' +
      '<text class="oa-small" x="' + (X_N + W_N / 2) + '" y="344" text-anchor="middle">more carriers &rarr;</text>' +
      '<path class="sm-prof sm-prof-e" data-val="gcurve"/>' +
      '<path class="sm-curve" data-val="fcurve"/>' +
      '<circle class="sm-mark" data-val="mhalf" r="5"/>' +
      '<path class="sm-area sm-area-e" data-val="an"/><path class="sm-area sm-area-h" data-val="ap"/>' +
      '<text class="oa-small" x="' + (X_N + 6) + '" y="44">electrons = g &times; f</text>' +
      '<text class="oa-small" x="' + (X_N + 6) + '" y="322">holes = g &times; (1 &minus; f)</text>' +
      '<text class="oa-caption" x="100" y="368">how many carriers, per ' + cm3 + ' (log scale, 1 to 10<tspan class="oa-sub" dy="-5">20</tspan><tspan dy="5">)</tspan></text>' +
      '<text class="oa-label" x="92" y="387" text-anchor="end">n<tspan class="oa-sub" dy="4">0</tspan></text>' +
      '<text class="oa-label" x="92" y="411" text-anchor="end">p<tspan class="oa-sub" dy="4">0</tspan></text>' +
      '<rect class="sm-area sm-area-e" data-val="rn" x="100" y="376" height="14"/>' +
      '<rect class="sm-area sm-area-h" data-val="rp" x="100" y="400" height="14"/>' +
      '<text class="oa-val" data-val="tn" y="387"></text><text class="oa-val" data-val="tp" y="411"></text>' +
      '<line class="sm-evd" data-val="ni" y1="372" y2="418" style="opacity:1;stroke-dasharray:4 3"/>' +
      '<text class="oa-label" data-val="nilab" y="427" text-anchor="middle">' + sub("n", "i") + '</text>' +
      '</svg>' +
      chipRow([["i", "Intrinsic"], ["n", "n-type"], ["p", "p-type"]], "Preset position of the Fermi level", "pre") +
      infoPanel +
      '<div class="oa-controls">' +
      slider("t", "T", 100, 600, 10, 300) +
      slider("ef", "E<sub>F</sub>", -0.5, 0.5, 0.01, 0) +
      "</div>" +
      '<p class="oa-readout"></p>'

    const $ = (k) => root.querySelector('[data-val="' + k + '"]')
    const tIn = root.querySelector('input[data-k="t"]')
    const efIn = root.querySelector('input[data-k="ef"]')
    const outs = root.querySelectorAll("output")
    const infoTitle = root.querySelector(".oa-info-title")
    const infoText = root.querySelector(".oa-info-text")
    const readout = root.querySelector(".oa-readout")

    const fOf = (E, T, ef) => {
      const z = (E - ef) / (KB * T)
      return z > 700 ? 0 : z < -700 ? 1 : 1 / (1 + Math.exp(z))
    }
    const calc = (T, ef) => {
      const kT = KB * T, s = Math.pow(T / 300, 1.5)
      const Nc = NC0 * s, Nv = NV0 * s
      return {
        kT, Nc, Nv,
        n: Nc * Math.exp(-(EC - ef) / kT),
        p: Nv * Math.exp(-(ef - EV) / kT),
        ni: Math.sqrt(Nc * Nv) * Math.exp(-EG / (2 * kT)),
        ei: (kT / 2) * Math.log(Nv / Nc),
      }
    }

    // Start at the true intrinsic level (a little below mid-gap), so n0 and p0 match at first
    P.ef = view.ef = calc(300, 0).ei
    efIn.value = P.ef

    // g(E) never changes, so draw it once
    let gd = ""
    for (let k = 0; k <= 60; k++) { const d = (DMAX * k) / 60; gd += (k ? "L" : "M") + (X_G + (Math.sqrt(d / DMAX)) * W_G).toFixed(1) + " " + yE(EC + d).toFixed(1) }
    for (let k = 0; k <= 60; k++) { const d = (DMAX * k) / 60; gd += (k ? "L" : "M") + (X_G + (Math.sqrt(d / DMAX)) * W_G).toFixed(1) + " " + yE(EV - d).toFixed(1) }
    $("gcurve").setAttribute("d", gd)

    // Area under g(E)f(E) above E_c (hole = true: g(E)(1-f(E)) below E_v), scaled so the
    // tallest point is W_N wide. Samples bunch up near the band edge, where everything happens.
    const area = (T, ef, hole) => {
      const N = 140, pts = []
      let peak = 0
      for (let k = 0; k <= N; k++) {
        const d = DMAX * Math.pow(k / N, 2)
        const E = hole ? EV - d : EC + d
        const f = fOf(E, T, ef)
        const v = Math.sqrt(d) * (hole ? 1 - f : f)
        pts.push([E, v]); if (v > peak) peak = v
      }
      if (!(peak > 1e-30)) return ""
      let d = "M" + X_N + " " + yE(hole ? EV : EC).toFixed(1)
      pts.forEach(([E, v]) => { d += "L" + (X_N + (v / peak) * W_N).toFixed(1) + " " + yE(E).toFixed(1) })
      return d + "L" + X_N + " " + yE(pts[N][0]).toFixed(1) + "Z"
    }

    const draw = () => {
      const { ef, T } = view
      const c = calc(T, ef)
      const yc = yE(EC), yv = yE(EV)
      put($("cb"), "y", 30); put($("cb"), "height", Math.max(0, yc - 30).toFixed(1))
      put($("vb"), "y", yv.toFixed(1)); put($("vb"), "height", Math.max(0, 330 - yv).toFixed(1))
      ;[["gc", yc], ["gv", yv]].forEach(([k, y]) => { put($(k), "y1", y.toFixed(1)); put($(k), "y2", y.toFixed(1)) })
      put($("lc"), "y", (yc + 4).toFixed(1)); put($("lv"), "y", (yv + 4).toFixed(1))
      put($("gef"), "y1", yE(ef).toFixed(1)); put($("gef"), "y2", yE(ef).toFixed(1))
      put($("lef"), "y", (yE(ef) - 6).toFixed(1))
      let d = ""
      for (let k = 0; k <= 90; k++) {
        const E = -EMAX + ((2 * EMAX) * k) / 90
        d += (k ? "L" : "M") + (X_F + fOf(E, T, ef) * W_F).toFixed(1) + " " + yE(E).toFixed(1)
      }
      put($("fcurve"), "d", d)
      put($("mhalf"), "cx", (X_F + W_F / 2).toFixed(1)); put($("mhalf"), "cy", yE(ef).toFixed(1))
      put($("an"), "d", area(T, ef, false)); put($("ap"), "d", area(T, ef, true))
      const wn = xBar(c.n) - 100, wp = xBar(c.p) - 100
      put($("rn"), "width", Math.max(1, wn).toFixed(1)); put($("rp"), "width", Math.max(1, wp).toFixed(1))
      put($("tn"), "x", (xBar(c.n) + 8).toFixed(1)); put($("tn"), "html", sci(c.n))
      put($("tp"), "x", (xBar(c.p) + 8).toFixed(1)); put($("tp"), "html", sci(c.p))
      const xi = xBar(c.ni)
      put($("ni"), "x1", xi.toFixed(1)); put($("ni"), "x2", xi.toFixed(1)); put($("nilab"), "x", xi.toFixed(1))
    }

    const info = () => {
      const { ef, T } = P
      const c = calc(T, ef)
      const dn = EC - ef, dp = ef - EV
      const edge = dn < 3 * c.kT || dp < 3 * c.kT
      let t, x
      if (Math.abs(ef - c.ei) < 0.03) {
        t = "Intrinsic: E<sub>F</sub> sits about mid-gap"
        x = "Both carrier types have to be thermally generated in pairs, so they match: n<sub>0</sub> &asymp; p<sub>0</sub> &asymp; n<sub>i</sub> = " + sci(c.ni) + " " + cm3 + ". The two bars are the same length."
      } else if (ef > c.ei) {
        t = "n-type: E<sub>F</sub> is closer to E<sub>c</sub>"
        x = "Column 3 is higher at E<sub>c</sub> (a state there is more likely to be filled), so column 4 shows plenty of electrons. At E<sub>v</sub>, E<sub>F</sub> is far away, so the states there are almost all filled and only a few holes appear. The n<sub>0</sub> bar grows by the same factor that the p<sub>0</sub> bar shrinks."
      } else {
        t = "p-type: E<sub>F</sub> is closer to E<sub>v</sub>"
        x = "Now f(E) is lower at E<sub>v</sub>, so more states in the valence band are empty: those empty states are the holes in column 4. Far up at E<sub>c</sub> almost nothing is filled, so electrons are rare. The p<sub>0</sub> bar grows by the same factor that the n<sub>0</sub> bar shrinks."
      }
      if (edge) x += " <em>E<sub>F</sub> is within 3k<sub>B</sub>T of a band edge here, where the simple exponential formulas for n<sub>0</sub> and p<sub>0</sub> start to fail. The curves above still use the full Fermi function.</em>"
      return [t, x]
    }

    const refresh = () => {
      outs[0].textContent = Math.round(P.T) + " K"
      outs[1].textContent = (P.ef >= 0 ? "+" : "\\u2212") + Math.abs(P.ef).toFixed(2) + " eV"
      const d = info()
      infoTitle.innerHTML = d[0]
      infoText.innerHTML = d[1]
      const c = calc(P.T, P.ef)
      readout.innerHTML = "n<sub>0</sub> = " + sci(c.n) + " &nbsp;&middot;&nbsp; p<sub>0</sub> = " + sci(c.p) + " &nbsp;&middot;&nbsp; n<sub>0</sub>p<sub>0</sub> = " + sci(c.n * c.p) + " = n<sub>i</sub><sup>2</sup> &nbsp;&middot;&nbsp; n<sub>i</sub> = " + sci(c.ni) + " " + cm3 + " &nbsp;&middot;&nbsp; E<sub>F</sub> is measured from mid-gap (silicon, E<sub>g</sub> = 1.12 eV)"
    }

    const markPre = chipGroup(root, "pre", (k, mark) => {
      const c = calc(P.T, 0)
      P.ef = k === "n" ? 0.35 : k === "p" ? -0.38 : clamp(c.ei, -0.5, 0.5)
      efIn.value = P.ef
      mark(k)
      refresh()
    })
    ;[tIn, efIn].forEach((s) => s.addEventListener("input", () => {
      P.T = +tIn.value; P.ef = +efIn.value
      markPre("")
      refresh()
    }))

    markPre("")
    refresh()
    draw()
    animate(root, (dt) => {
      const k = calm ? 1 : 1 - Math.exp(-dt * 8)
      view.ef += (P.ef - view.ef) * k
      view.T += (P.T - view.T) * k
      draw()
    })
  }

  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-semi:not([data-ready])").forEach((root) => {
      root.dataset.ready = "true"
      const v = root.dataset.view
      if (v === "carriers") buildCarriers(root)
      else if (v === "fermi") buildFermi(root)
      else if (v === "pn") buildPN(root)
      else if (v === "pnform") buildPNForm(root)
      else buildHall(root)
    })
  })
})()
`

export default (() => MelonSemi) satisfies QuartzComponentConstructor
