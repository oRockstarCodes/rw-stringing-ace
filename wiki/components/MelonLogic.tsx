import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Interactive digital logic diagrams (COE 328). A note asks for one with an empty div:
//
//   <div class="melon-logic" data-view="gates"></div>
//     Pick a gate and flip its inputs; the truth table row lights up.
//   <div class="melon-logic" data-view="timing" data-device="dff,jkff"></div>
//     Editable timing diagram. Devices: and, or, nand, nor, xor, xnor, srlatch,
//     gsr (gated S-R latch), dlatch, dff, jkff, dffpc (D flip-flop with preset/clear).
//     A comma list shows buttons to switch between them.
//   <div class="melon-logic" data-view="kmap" data-vars="4" data-ones="0,2" data-dc="5" data-mode="sop"></div>
//     Karnaugh map editor that finds the minimum SOP (or POS) and draws the groups.
//   <div class="melon-logic" data-view="number"></div>    8-bit number in every representation
//   <div class="melon-logic" data-view="waveform"></div>  Pulse waveform on an oscilloscope grid
//   <div class="melon-logic" data-view="cmos"></div>      CMOS NOT / NAND / NOR transistor states
//   <div class="melon-logic" data-view="mosfamily"></div> NMOS-only (PDN + resistor) vs PMOS-only (PUN + resistor) vs CMOS (both)
//   <div class="melon-logic" data-view="mosfet"></div>    Single NMOS / PMOS cross-section: the gate voltage forms a channel
//   <div class="melon-logic" data-view="adder"></div>     4-bit ripple-carry adder/subtractor
//   <div class="melon-logic" data-view="mux"></div>       4-to-1 multiplexer
//   <div class="melon-logic" data-view="sevenseg"></div>  BCD-to-7-segment decoder
//
// The script below fills them in on every page load (the text inside the div is only
// a fallback for Obsidian and link previews). Styles are in wiki/custom.scss.
// The script is a plain string, so it avoids backticks and backslashes.

const MelonLogic: QuartzComponent = () => null

MelonLogic.afterDOMLoaded = `
(() => {
  // ---------- Shared helpers ----------

  let uid = 0
  const bar = (s) => '<span class="lg-bar">' + s + "</span>"
  const sbar = (s) => '<tspan text-decoration="overline">' + s + "</tspan>"
  const ssub = (b, s) => b + '<tspan class="lg-sub" dy="4">' + s + '</tspan><tspan dy="-4">&#8203;</tspan>'
  const minus = (n) => (n < 0 ? "−" + Math.abs(n) : String(n))
  const bits = (v, n) => {
    let s = ""
    for (let i = n - 1; i >= 0; i--) s += (v >> i) & 1
    return s
  }
  const pop = (x) => {
    let c = 0
    for (; x; x >>= 1) c += x & 1
    return c
  }
  const range = (n) => Array.from({ length: n }, (_, i) => i)

  // A row of pill buttons. onChips() wires them: clicking one presses it and calls fn.
  const chips = (group, list) =>
    '<div class="lg-chips" data-group="' + group + '">' +
    list.map(([k, label]) => '<button type="button" class="lg-chip" data-k="' + k + '" aria-pressed="false">' + label + "</button>").join("") +
    "</div>"
  function onChips(root, group, initial, fn) {
    const btns = root.querySelectorAll('[data-group="' + group + '"] .lg-chip')
    const press = (k) => btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)))
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        press(b.dataset.k)
        fn(b.dataset.k)
      }),
    )
    press(initial)
  }

  // An input switch showing its name and current bit
  const toggle = (k, label) =>
    '<button type="button" class="lg-toggle" data-k="' + k + '" aria-pressed="false"><span>' + label + "</span><b>0</b></button>"
  const setToggle = (btn, v) => {
    btn.setAttribute("aria-pressed", String(!!v))
    btn.querySelector("b").textContent = v ? "1" : "0"
  }

  // SVG parts with role=button also respond to Enter and Space
  function keyClick(root) {
    root.addEventListener("keydown", (e) => {
      const t = e.target
      if ((e.key === "Enter" || e.key === " ") && t.getAttribute && t.getAttribute("role") === "button") {
        e.preventDefault()
        t.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      }
    })
  }

  // Engineering notation: 0.00000005 -> "50 n"
  function eng(x, unit) {
    if (!isFinite(x)) return "—"
    if (x === 0) return "0 " + unit
    const pre = [[1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"]]
    for (const [m, p] of pre) if (Math.abs(x) >= m * 0.9995) return +(x / m).toPrecision(3) + " " + p + unit
    return +(x / 1e-12).toPrecision(3) + " p" + unit
  }

  // ---------- Logic minimization (shared by the K-map and the 7-segment decoder) ----------

  // Exact minimum cover for up to 4 variables: fewest terms, then fewest literals.
  // A cube is { mask, val }: mask marks the variables that are fixed, val their values.
  function minimize(n, target, dc) {
    if (!target.length) return []
    const size = 1 << n
    const allowed = new Array(size).fill(false)
    target.concat(dc).forEach((m) => (allowed[m] = true))
    const valid = (mask, val) => {
      for (let m = 0; m < size; m++) if ((m & mask) === val && !allowed[m]) return false
      return true
    }
    const primes = []
    for (let mask = 0; mask < size; mask++) {
      for (let val = 0; val < size; val++) {
        if ((val & ~mask) !== 0 || !valid(mask, val)) continue
        let prime = true
        for (let b = 0; b < n && prime; b++) {
          const bit = 1 << b
          if (mask & bit && valid(mask & ~bit, val & ~bit)) prime = false
        }
        const cover = target.filter((m) => (m & mask) === val)
        if (prime && cover.length) primes.push({ mask, val, cover })
      }
    }
    const lits = (list) => list.reduce((s, p) => s + pop(p.mask), 0)
    let best = null
    const search = (chosen, left) => {
      if (!left.length) {
        if (!best || chosen.length < best.length || (chosen.length === best.length && lits(chosen) < lits(best))) best = chosen.slice()
        return
      }
      if (best && chosen.length + 1 > best.length) return
      let options = null
      for (const m of left) {
        const list = primes.filter((p) => p.cover.includes(m))
        if (!options || list.length < options.length) options = list
      }
      options.sort((a, b) => pop(a.mask) - pop(b.mask))
      for (const p of options) {
        chosen.push(p)
        search(chosen, left.filter((m) => !p.cover.includes(m)))
        chosen.pop()
      }
    }
    search([], target.slice())
    return best.sort((a, b) => pop(a.mask) - pop(b.mask) || b.mask - a.mask || b.val - a.val)
  }

  const VARS = ["A", "B", "C", "D"]
  // A cube as a product term (SOP) or a sum term (POS), as HTML
  function termHtml(n, cube, pos) {
    const parts = []
    for (let i = 0; i < n; i++) {
      const bit = 1 << (n - 1 - i)
      if (!(cube.mask & bit)) continue
      const one = (cube.val & bit) !== 0
      parts.push(pos === one ? bar(VARS[i]) : VARS[i])
    }
    if (!parts.length) return pos ? "0" : "1"
    if (!pos) return parts.join("&#8202;")
    return parts.length > 1 ? "(" + parts.join(" + ") + ")" : parts[0]
  }

  // ---------- Logic gates ----------

  const GATES = {
    not: { name: "NOT", n: 1, f: (a) => 1 - a, expr: "X = " + bar("A"), desc: "The output is the <strong>opposite</strong> of the input. The bubble on the output means inversion." },
    and: { name: "AND", n: 2, f: (a, b) => a & b, expr: "X = AB", desc: "The output is 1 only when <strong>all</strong> inputs are 1." },
    or: { name: "OR", n: 2, f: (a, b) => a | b, expr: "X = A + B", desc: "The output is 1 when <strong>at least one</strong> input is 1. No carry: 1 + 1 = 1." },
    nand: { name: "NAND", n: 2, f: (a, b) => 1 - (a & b), expr: "X = " + bar("AB") + " = " + bar("A") + " + " + bar("B"), desc: "AND, then NOT: the output is 0 only when all inputs are 1. Read the other way, it's a <strong>negative-OR</strong>: 1 when any input is 0." },
    nor: { name: "NOR", n: 2, f: (a, b) => 1 - (a | b), expr: "X = " + bar("A + B") + " = " + bar("A") + "&#8202;" + bar("B"), desc: "OR, then NOT: the output is 1 only when all inputs are 0. Read the other way, it's a <strong>negative-AND</strong>." },
    xor: { name: "XOR", n: 2, f: (a, b) => a ^ b, expr: "X = A ⊕ B = A" + bar("B") + " + " + bar("A") + "B", desc: "The output is 1 when the inputs are <strong>different</strong>. It's also the sum bit of A + B." },
    xnor: { name: "XNOR", n: 2, f: (a, b) => 1 - (a ^ b), expr: "X = " + bar("A ⊕ B") + " = AB + " + bar("A") + "&#8202;" + bar("B"), desc: "The output is 1 when the inputs are the <strong>same</strong>: a 1-bit equality detector." },
  }

  function gateShape(type) {
    const AND = '<path class="lg-body" d="M110,40 h40 a40,40 0 0 1 0,80 h-40 z"/>'
    const OR = '<path class="lg-body" d="M110,40 q55,0 85,40 q-30,40 -85,40 q18,-40 0,-80 z"/>'
    const BACK = '<path class="lg-body lg-open" d="M98,40 q18,40 0,80"/>'
    const NOT = '<path class="lg-body" d="M120,50 L120,110 L180,80 Z"/>'
    return {
      not: { body: NOT, tip: 180, bubble: true, inEnd: 120 },
      and: { body: AND, tip: 190, bubble: false, inEnd: 110 },
      nand: { body: AND, tip: 190, bubble: true, inEnd: 110 },
      or: { body: OR, tip: 195, bubble: false, inEnd: 117 },
      nor: { body: OR, tip: 195, bubble: true, inEnd: 117 },
      xor: { body: OR + BACK, tip: 195, bubble: false, inEnd: 105 },
      xnor: { body: OR + BACK, tip: 195, bubble: true, inEnd: 105 },
    }[type]
  }

  function buildGates(root) {
    let g = "and"
    const v = { a: 0, b: 1 }
    root.innerHTML =
      chips("gate", Object.keys(GATES).map((k) => [k, GATES[k].name])) +
      '<div class="lg-split"><svg class="lg-svg lg-gate" viewBox="0 0 320 160" role="img" aria-label="Logic gate with its inputs and output"></svg>' +
      '<table class="lg-tt"></table></div>' +
      '<div class="lg-toggles">' + toggle("a", "A") + toggle("b", "B") + "</div>" +
      '<div class="lg-info" aria-live="polite"><div class="lg-info-title"></div><div class="lg-info-text"></div></div>'
    const svg = root.querySelector(".lg-gate")
    const table = root.querySelector(".lg-tt")
    const wire = (x) => "lg-wire" + (x ? " is-hi" : "")

    const render = () => {
      const G = GATES[g]
      const s = gateShape(g)
      const one = G.n === 1
      const x = one ? G.f(v.a) : G.f(v.a, v.b)
      let h = s.body
      const ins = one ? [["a", 80]] : [["a", 60], ["b", 100]]
      ins.forEach(([k, y]) => {
        h +=
          '<g class="lg-in" data-k="' + k + '" role="button" tabindex="0" aria-label="Flip input ' + k.toUpperCase() + '">' +
          '<line class="lg-hit" x1="24" y1="' + y + '" x2="' + s.inEnd + '" y2="' + y + '"/>' +
          '<line class="' + wire(v[k]) + '" x1="50" y1="' + y + '" x2="' + s.inEnd + '" y2="' + y + '"/>' +
          '<circle class="lg-term' + (v[k] ? " is-hi" : "") + '" cx="50" cy="' + y + '" r="6"/>' +
          '<text class="lg-label" x="36" y="' + (y + 5) + '" text-anchor="end">' + k.toUpperCase() + "</text>" +
          '<text class="lg-val" x="78" y="' + (y - 8) + '" text-anchor="middle">' + v[k] + "</text></g>"
      })
      let ox = s.tip
      if (s.bubble) {
        h += '<circle class="lg-bubble" cx="' + (s.tip + 6) + '" cy="80" r="6"/>'
        ox = s.tip + 12
      }
      h +=
        '<line class="' + wire(x) + '" x1="' + ox + '" y1="80" x2="270" y2="80"/>' +
        '<circle class="lg-term' + (x ? " is-hi" : "") + '" cx="270" cy="80" r="6"/>' +
        '<text class="lg-label" x="284" y="85">X</text>' +
        '<text class="lg-val lg-strong" x="240" y="71" text-anchor="middle">' + x + "</text>"
      svg.innerHTML = h

      const rows = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]
      let t = "<thead><tr><th>A</th>" + (one ? "" : "<th>B</th>") + "<th>X</th></tr></thead><tbody>"
      rows.forEach((r) => {
        const cur = r[0] === v.a && (one || r[1] === v.b)
        t +=
          '<tr data-row="' + r.join("") + '"' + (cur ? ' class="is-cur"' : "") + ">" +
          r.map((b) => "<td>" + b + "</td>").join("") +
          "<td><b>" + (one ? G.f(r[0]) : G.f(r[0], r[1])) + "</b></td></tr>"
      })
      table.innerHTML = t + "</tbody>"

      root.querySelectorAll(".lg-toggle").forEach((b) => setToggle(b, v[b.dataset.k]))
      root.querySelector('.lg-toggle[data-k="b"]').hidden = one
      root.querySelector(".lg-info-title").textContent = G.name + " gate"
      root.querySelector(".lg-info-text").innerHTML = '<span class="lg-expr">' + G.expr + "</span><br>" + G.desc
    }

    onChips(root, "gate", g, (k) => {
      g = k
      render()
    })
    svg.addEventListener("click", (e) => {
      const t = e.target.closest(".lg-in")
      if (!t) return
      v[t.dataset.k] ^= 1
      render()
    })
    table.addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-row]")
      if (!tr) return
      v.a = +tr.dataset.row[0]
      if (tr.dataset.row.length > 1) v.b = +tr.dataset.row[1]
      render()
    })
    root.querySelectorAll(".lg-toggle").forEach((b) =>
      b.addEventListener("click", () => {
        v[b.dataset.k] ^= 1
        render()
      }),
    )
    keyClick(svg)
    render()
  }

  // ---------- Timing diagrams ----------

  const SLOTS = 16
  const GATE_RULE = {
    and: "X = AB: HIGH only while <strong>both</strong> inputs are HIGH.",
    or: "X = A + B: HIGH while <strong>either</strong> input is HIGH.",
    nand: "X = " + bar("AB") + ": LOW only while both inputs are HIGH.",
    nor: "X = " + bar("A + B") + ": HIGH only while both inputs are LOW.",
    xor: "X = A ⊕ B: HIGH while the inputs are <strong>different</strong>.",
    xnor: "X = " + bar("A ⊕ B") + ": HIGH while the inputs are the <strong>same</strong>.",
  }
  const GATE_INPUTS = [["a", "A", "0111100110011100"], ["b", "B", "0001111000111100"]]
  const DEVICES = {
    srlatch: {
      label: "S-R latch",
      inputs: [["s", "S", "0110000000111000"], ["r", "R", "0000011100000110"]],
      kind: "sr",
      qbar: true,
      rule: "S = 1 <strong>sets</strong> Q, R = 1 <strong>resets</strong> it, and S = R = 0 <strong>holds</strong>. S = R = 1 is <strong>invalid</strong> (red): Q and " + bar("Q") + " are both 0, and if both inputs then drop to 0 together, the next state is unknown (hatched).",
    },
    gsr: {
      label: "Gated S-R latch",
      chip: "Gated S-R latch",
      inputs: [["en", "EN", "0011100001111000"], ["s", "S", "0110000000000110"], ["r", "R", "0000001111000000"]],
      kind: "gsr",
      qbar: true,
      shade: "en",
      rule: "The latch only responds while <strong>EN is HIGH</strong> (shaded). Then S = 1 sets it and R = 1 resets it. While EN is LOW, S and R are ignored.",
    },
    dlatch: {
      label: "Gated D latch",
      chip: "Gated D latch",
      inputs: [["en", "EN", "0011100001111000"], ["d", "D", "0101011010110100"]],
      kind: "dlatch",
      shade: "en",
      rule: "While <strong>EN is HIGH</strong> (shaded), Q follows D. When EN goes LOW, Q holds the last value of D.",
    },
    dff: {
      label: "D flip-flop",
      inputs: [["d", "D", "0011011000111001"]],
      kind: "dff",
      clock: true,
      rule: "At each <strong>rising clock edge</strong> (dashed lines), Q takes the value of D, then holds it until the next edge. D changing between edges does nothing.",
    },
    jkff: {
      label: "J-K flip-flop",
      inputs: [["j", "J", "0011110000111100"], ["k", "K", "0000111100001111"]],
      kind: "jk",
      clock: true,
      rule: "At each <strong>rising clock edge</strong>: JK = 00 holds, 10 sets, 01 resets, and 11 <strong>toggles</strong>.",
    },
    dffpc: {
      label: "D flip-flop with preset and clear",
      inputs: [["d", "D", "1110011101100111"], ["pre", sbar("PRE"), "1111111111001111"], ["clr", sbar("CLR"), "1001111111111100"]],
      kind: "dffpc",
      clock: true,
      rule: bar("PRE") + " LOW forces Q = 1 and " + bar("CLR") + " LOW forces Q = 0 <strong>immediately</strong>, without waiting for a clock edge. With both HIGH it's a normal D flip-flop. Both LOW is invalid (red).",
    },
  }
  Object.keys(GATE_RULE).forEach((k) => {
    DEVICES[k] = { label: k.toUpperCase(), inputs: GATE_INPUTS, kind: "gate", gate: k, out: "X", rule: GATE_RULE[k] }
  })
  const GATE_FN = {
    and: (a, b) => a & b,
    or: (a, b) => a | b,
    nand: (a, b) => 1 - (a & b),
    nor: (a, b) => 1 - (a | b),
    xor: (a, b) => a ^ b,
    xnor: (a, b) => 1 - (a ^ b),
  }

  // Time runs in half-slots, so the clock's rising edges can sit in the middle of a slot
  const clkAt = (h) => (h % 4 === 1 || h % 4 === 2 ? 1 : 0)
  function simulate(dev, vals) {
    const H = SLOTS * 2
    const at = (k, h) => +vals[k][Math.floor(h / 2)]
    const q = [], qb = [], inv = []
    let state = 0
    let wasBad = false
    for (let h = 0; h < H; h++) {
      let bad = false
      const edge = dev.clock && h > 0 && clkAt(h) === 1 && clkAt(h - 1) === 0
      if (dev.kind === "gate") state = GATE_FN[dev.gate](at("a", h), at("b", h))
      else if (dev.kind === "sr" || dev.kind === "gsr") {
        const en = dev.kind === "gsr" ? at("en", h) : 1
        const s = at("s", h), r = at("r", h)
        if (en && s && r) bad = true
        else if (en && s) state = 1
        else if (en && r) state = 0
        else if (wasBad) state = -1
      } else if (dev.kind === "dlatch") {
        if (at("en", h)) state = at("d", h)
      } else if (dev.kind === "dff") {
        if (edge) state = at("d", h)
      } else if (dev.kind === "jk") {
        if (edge) {
          const j = at("j", h), k = at("k", h)
          if (j && k) state = state < 0 ? -1 : 1 - state
          else if (j) state = 1
          else if (k) state = 0
        }
      } else if (dev.kind === "dffpc") {
        const pre = at("pre", h), clr = at("clr", h)
        if (!pre && !clr) bad = true
        else if (!pre) state = 1
        else if (!clr) state = 0
        else if (edge) state = at("d", h)
        else if (wasBad) state = -1
      }
      const badQ = dev.kind === "dffpc" ? 1 : 0
      q.push(bad ? badQ : state)
      qb.push(bad ? badQ : state < 0 ? -1 : 1 - state)
      inv.push(bad)
      wasBad = bad
    }
    return { q, qb, inv }
  }

  function buildTiming(root) {
    const list = (root.dataset.device || "dff").split(",").map((s) => s.trim()).filter((k) => DEVICES[k])
    if (!list.length) return
    let key = list[0]
    let vals = {}
    const hatch = "lg-hatch-" + ++uid
    const reset = () => {
      vals = {}
      DEVICES[key].inputs.forEach(([k, , init]) => (vals[k] = init.split("").map(Number)))
    }
    root.innerHTML =
      (list.length > 1 ? chips("dev", list.map((k) => [k, DEVICES[k].chip || DEVICES[k].label])) : "") +
      '<svg class="lg-svg lg-timing" role="img" aria-label="Timing diagram. Click a time slot of an input to flip it."></svg>' +
      '<p class="lg-readout lg-prose"></p>' +
      '<div class="lg-actions"><span class="lg-hint">Click any time slot of an input to flip it.</span><button type="button" class="lg-btn" data-act="reset">Reset inputs</button></div>'
    const svg = root.querySelector(".lg-timing")
    const LW = 64, SW = 28, HS = SW / 2, RH = 44, TOP = 8
    const X0 = LW
    const W = LW + SLOTS * SW + 12

    const render = () => {
      const dev = DEVICES[key]
      const { q, qb, inv } = simulate(dev, vals)
      const rows = dev.inputs.map(([k, label]) => ({ k, label, arr: range(SLOTS * 2).map((h) => vals[k][Math.floor(h / 2)]), edit: true }))
      if (dev.clock) rows.push({ label: "CLK", arr: range(SLOTS * 2).map(clkAt), clock: true })
      rows.push({ label: dev.out || "Q", arr: q, out: true })
      if (dev.qbar) rows.push({ label: sbar("Q"), arr: qb, out: true })
      const Hgt = TOP + rows.length * RH + 6
      svg.setAttribute("viewBox", "0 0 " + W + " " + Hgt)

      let h =
        '<defs><pattern id="' + hatch + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
        '<line class="lg-hatch-line" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>'
      // Shade where the enable is HIGH
      if (dev.shade) {
        vals[dev.shade].forEach((on, i) => {
          if (on) h += '<rect class="lg-shade" x="' + (X0 + i * SW) + '" y="2" width="' + SW + '" height="' + (Hgt - 4) + '"/>'
        })
      }
      // Slot grid
      for (let i = 0; i <= SLOTS; i++) h += '<line class="lg-grid" x1="' + (X0 + i * SW) + '" y1="2" x2="' + (X0 + i * SW) + '" y2="' + (Hgt - 2) + '"/>'
      // Rising clock edges
      if (dev.clock) {
        for (let k = 1; k < SLOTS * 2; k += 4) h += '<line class="lg-edge" x1="' + (X0 + k * HS) + '" y1="2" x2="' + (X0 + k * HS) + '" y2="' + (Hgt - 2) + '"/>'
      }
      rows.forEach((row, r) => {
        const y0 = TOP + r * RH
        const hi = y0 + 8, lo = y0 + 32, mid = (hi + lo) / 2
        const level = (v) => (v < 0 ? mid : v ? hi : lo)
        // Invalid and unknown stretches on output rows
        if (row.out) {
          row.arr.forEach((v, k) => {
            const x = X0 + k * HS
            if (inv[k]) h += '<rect class="lg-invalid" x="' + x + '" y="' + (hi - 4) + '" width="' + HS + '" height="' + (lo - hi + 8) + '"/>'
            if (v < 0) h += '<rect fill="url(#' + hatch + ')" class="lg-unknown" x="' + x + '" y="' + hi + '" width="' + HS + '" height="' + (lo - hi) + '"/>'
          })
        }
        let d = ""
        let prev = null
        row.arr.forEach((v, k) => {
          const x = X0 + k * HS
          if (prev === null) d += "M" + x + "," + level(v)
          else if (v !== prev) d += " L" + x + "," + level(prev) + " L" + x + "," + level(v)
          prev = v
        })
        d += " L" + (X0 + row.arr.length * HS) + "," + level(prev)
        h +=
          '<text class="lg-label' + (row.out ? " lg-out-label" : "") + '" x="' + (LW - 12) + '" y="' + (mid + 5) + '" text-anchor="end">' + row.label + "</text>" +
          '<path class="lg-wave' + (row.out ? " is-out" : row.clock ? " is-clock" : "") + '" d="' + d + '"/>'
        if (row.edit) {
          for (let i = 0; i < SLOTS; i++) {
            h +=
              '<rect class="lg-slot" data-k="' + row.k + '" data-i="' + i + '" role="button" tabindex="0" aria-label="Flip slot ' + (i + 1) + '" x="' + (X0 + i * SW) + '" y="' + (y0 + 2) + '" width="' + SW + '" height="' + (RH - 6) + '"/>'
          }
        }
      })
      svg.innerHTML = h
      root.querySelector(".lg-readout").innerHTML =
        "<strong>" + dev.label + ".</strong> " + dev.rule + (dev.kind === "gate" ? "" : " Starts RESET (Q = 0).")
    }

    if (list.length > 1)
      onChips(root, "dev", key, (k) => {
        key = k
        reset()
        render()
      })
    svg.addEventListener("click", (e) => {
      const s = e.target.closest(".lg-slot")
      if (!s) return
      vals[s.dataset.k][+s.dataset.i] ^= 1
      render()
      const again = svg.querySelector('.lg-slot[data-k="' + s.dataset.k + '"][data-i="' + s.dataset.i + '"]')
      if (again && document.activeElement === document.body) again.focus({ preventScroll: true })
    })
    root.querySelector('[data-act="reset"]').addEventListener("click", () => {
      reset()
      render()
    })
    keyClick(svg)
    reset()
    render()
  }

  // ---------- Karnaugh map ----------

  const GRAY = [0, 1, 3, 2]
  const GROUP_COLORS = ["#e0457b", "#3b82f6", "#16a34a", "#f59e0b", "#8b5cf6", "#0891b2", "#dc2626", "#65a30d"]

  // Contiguous runs of positions (wrap-around pieces stay separate)
  const runs = (list) => {
    const out = []
    list.forEach((p) => {
      const last = out[out.length - 1]
      if (last && p === last[last.length - 1] + 1) last.push(p)
      else out.push([p])
    })
    return out
  }

  function buildKmap(root) {
    const parse = (s) => (s ? s.split(",").map((x) => parseInt(x, 10)).filter((x) => x >= 0) : [])
    const initial = {
      n: root.dataset.vars === "3" ? 3 : 4,
      ones: parse(root.dataset.ones),
      dc: parse(root.dataset.dc),
      mode: root.dataset.mode === "pos" ? "pos" : "sop",
    }
    let n = initial.n
    let mode = initial.mode
    let cells = []
    const load = (ones, dc) => {
      cells = new Array(1 << n).fill(0)
      ones.forEach((m) => m < cells.length && (cells[m] = 1))
      dc.forEach((m) => m < cells.length && (cells[m] = 2))
    }
    load(initial.ones, initial.dc)

    root.innerHTML =
      '<div class="lg-toolbar">' +
      chips("vars", [["3", "3 variables"], ["4", "4 variables"]]) +
      chips("mode", [["sop", "SOP: group the 1s"], ["pos", "POS: group the 0s"]]) +
      "</div>" +
      '<svg class="lg-svg lg-kmap" role="img" aria-label="Karnaugh map. Click a cell to cycle it between 0, 1, and don’t care."></svg>' +
      '<div class="lg-result" aria-live="polite"></div>' +
      '<p class="lg-readout"></p>' +
      '<div class="lg-actions"><span class="lg-hint">Click a cell: 0 → 1 → X → 0</span><button type="button" class="lg-btn" data-act="reset">Reset</button><button type="button" class="lg-btn" data-act="clear">Clear</button></div>'
    const svg = root.querySelector(".lg-kmap")
    const C = 52, L = 66, T = 58

    const render = () => {
      const cols = n === 4 ? 4 : 2
      const W = L + cols * C + 10, H = T + 4 * C + 10
      svg.setAttribute("viewBox", "0 0 " + W + " " + H)
      const cellAt = (r, c) => (n === 4 ? (GRAY[r] << 2) | GRAY[c] : (GRAY[r] << 1) | c)

      const ones = [], dc = [], zeros = []
      cells.forEach((v, m) => (v === 1 ? ones : v === 2 ? dc : zeros).push(m))
      const pos = mode === "pos"
      const cubes = pos ? minimize(n, zeros, dc) : minimize(n, ones, dc)

      let h =
        '<line class="lg-grid" x1="' + (L - 46) + '" y1="' + (T - 46) + '" x2="' + L + '" y2="' + T + '"/>' +
        '<text class="lg-axis" x="' + (L - 36) + '" y="' + (T - 4) + '" text-anchor="middle">AB</text>' +
        '<text class="lg-axis" x="' + (L - 4) + '" y="' + (T - 34) + '" text-anchor="end">' + (n === 4 ? "CD" : "C") + "</text>"
      range(cols).forEach((c) => {
        h += '<text class="lg-axis" x="' + (L + c * C + C / 2) + '" y="' + (T - 10) + '" text-anchor="middle">' + bits(n === 4 ? GRAY[c] : c, n === 4 ? 2 : 1) + "</text>"
      })
      range(4).forEach((r) => {
        h += '<text class="lg-axis" x="' + (L - 10) + '" y="' + (T + r * C + C / 2 + 5) + '" text-anchor="end">' + bits(GRAY[r], 2) + "</text>"
        range(cols).forEach((c) => {
          const m = cellAt(r, c)
          const v = cells[m]
          const x = L + c * C, y = T + r * C
          h +=
            '<g class="lg-cell' + (v === 1 ? " is-one" : v === 2 ? " is-dc" : "") + '" data-m="' + m + '" role="button" tabindex="0" aria-label="Cell ' + m + ", value " + (v === 2 ? "don’t care" : v) + '">' +
            '<rect x="' + x + '" y="' + y + '" width="' + C + '" height="' + C + '"/>' +
            '<text class="lg-cell-m" x="' + (x + 5) + '" y="' + (y + 13) + '">' + m + "</text>" +
            '<text class="lg-cell-v" x="' + (x + C / 2) + '" y="' + (y + C / 2 + 8) + '" text-anchor="middle">' + (v === 2 ? "X" : v) + "</text></g>"
        })
      })
      // Groups, drawn on top (clicks pass through to the cells)
      cubes.forEach((cube, gi) => {
        const inCube = (m) => (m & cube.mask) === cube.val
        const rowsIn = range(4).filter((r) => range(cols).some((c) => inCube(cellAt(r, c))))
        const colsIn = range(cols).filter((c) => range(4).some((r) => inCube(cellAt(r, c))))
        const inset = 5 + (gi % 3) * 4
        const color = GROUP_COLORS[gi % GROUP_COLORS.length]
        runs(rowsIn).forEach((rr) =>
          runs(colsIn).forEach((cc) => {
            h +=
              '<rect class="lg-group" data-g="' + gi + '" style="--g:' + color + '" rx="12" x="' + (L + cc[0] * C + inset) + '" y="' + (T + rr[0] * C + inset) +
              '" width="' + (cc.length * C - 2 * inset) + '" height="' + (rr.length * C - 2 * inset) + '"/>'
          }),
        )
      })
      h += '<rect class="lg-kmap-frame" x="' + L + '" y="' + T + '" width="' + cols * C + '" height="' + 4 * C + '"/>'
      svg.innerHTML = h

      // The expression, one colored chip per group
      let expr
      if (pos) {
        expr = !zeros.length ? "1" : cubes.map((c, gi) => '<span class="lg-term" data-g="' + gi + '" style="--g:' + GROUP_COLORS[gi % 8] + '">' + termHtml(n, c, true) + "</span>").join("")
      } else {
        expr = !ones.length ? "0" : cubes.map((c, gi) => '<span class="lg-term" data-g="' + gi + '" style="--g:' + GROUP_COLORS[gi % 8] + '">' + termHtml(n, c, false) + "</span>").join(" + ")
      }
      root.querySelector(".lg-result").innerHTML =
        '<span class="lg-result-label">Minimum ' + (pos ? "POS" : "SOP") + ":</span> <span class=\\"lg-expr\\">X = " + expr + "</span>"
      const list = (a) => a.join(", ")
      const d = dc.length ? " + d(" + list(dc) + ")" : ""
      root.querySelector(".lg-readout").innerHTML =
        "X = Σm(" + list(ones) + ")" + d + "<br>X = ΠM(" + list(zeros) + ")" + d +
        '<br><span class="lg-note">' + cubes.length + " group" + (cubes.length === 1 ? "" : "s") +
        (dc.length ? ". Don’t cares (X) are used only where they make a group bigger." : ".") + "</span>"
    }

    const highlight = (gi) => {
      svg.querySelectorAll(".lg-group").forEach((g) => g.classList.toggle("is-hot", g.dataset.g === gi))
      root.querySelectorAll(".lg-term").forEach((t) => t.classList.toggle("is-hot", t.dataset.g === gi))
    }
    root.querySelector(".lg-result").addEventListener("mouseover", (e) => {
      const t = e.target.closest(".lg-term")
      highlight(t ? t.dataset.g : null)
    })
    root.querySelector(".lg-result").addEventListener("mouseleave", () => highlight(null))
    svg.addEventListener("click", (e) => {
      const cell = e.target.closest(".lg-cell")
      if (!cell) return
      const m = +cell.dataset.m
      cells[m] = (cells[m] + 1) % 3
      render()
      const again = svg.querySelector('.lg-cell[data-m="' + m + '"]')
      if (again && e.detail === 0) again.focus({ preventScroll: true })
    })
    onChips(root, "vars", String(n), (k) => {
      if (+k === n) return
      n = +k
      load([], [])
      render()
    })
    onChips(root, "mode", mode, (k) => {
      mode = k
      render()
    })
    root.querySelector('[data-act="reset"]').addEventListener("click", () => {
      n = initial.n
      mode = initial.mode
      load(initial.ones, initial.dc)
      root.querySelectorAll('[data-group="vars"] .lg-chip').forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === String(n))))
      root.querySelectorAll('[data-group="mode"] .lg-chip').forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === mode)))
      render()
    })
    root.querySelector('[data-act="clear"]').addEventListener("click", () => {
      load([], [])
      render()
    })
    keyClick(svg)
    render()
  }

  // ---------- Number representations ----------

  function buildNumber(root) {
    let v = 0b10110010
    root.innerHTML =
      '<div class="lg-bits">' +
      range(8).map((j) => {
        const i = 7 - j
        return '<button type="button" class="lg-bitbtn" data-i="' + i + '" aria-pressed="false" aria-label="Bit ' + i + '"><span class="lg-w">' + (1 << i) + "</span><b>0</b><span class=\\"lg-pos\\">b" + i + "</span></button>"
      }).join("") +
      "</div>" +
      '<div class="lg-nibbles"><span></span><span></span></div>' +
      '<div class="lg-actions lg-actions-left">' +
      '<label class="lg-dec">Decimal <input type="number" min="-128" max="255" step="1" inputmode="numeric"></label>' +
      '<button type="button" class="lg-btn" data-act="inv">Flip every bit</button>' +
      '<button type="button" class="lg-btn" data-act="neg">2’s complement</button>' +
      '<button type="button" class="lg-btn" data-act="clr">Clear</button>' +
      "</div>" +
      '<table class="lg-readtable"><tbody></tbody></table>'
    const input = root.querySelector(".lg-dec input")

    const render = (fromInput) => {
      root.querySelectorAll(".lg-bitbtn").forEach((b) => {
        const on = (v >> +b.dataset.i) & 1
        b.setAttribute("aria-pressed", String(!!on))
        b.querySelector("b").textContent = on
      })
      const hi = v >> 4, lo = v & 15
      const nib = root.querySelectorAll(".lg-nibbles span")
      nib[0].textContent = hi.toString(16).toUpperCase()
      nib[1].textContent = lo.toString(16).toUpperCase()
      if (!fromInput) input.value = String(v)

      const weights = range(8).map((j) => 7 - j).filter((i) => (v >> i) & 1)
      const sum = weights.length ? weights.map((i) => 1 << i).join(" + ") + " = " + v : "0"
      const neg = v & 128
      const twos = neg ? v - 256 : v
      const ones = neg ? (v === 255 ? "−0" : minus(-(255 - v))) : String(v)
      const sm = neg ? ((v & 127) === 0 ? "−0" : minus(-(v & 127))) : String(v)
      const twosSum = neg ? "−128" + (weights.length > 1 ? " + " + weights.slice(1).map((i) => 1 << i).join(" + ") : "") + " = " + minus(twos) : String(twos)
      const bcd = hi <= 9 && lo <= 9 ? String(hi * 10 + lo) : '<span class="lg-warn">not valid BCD</span> (' + (hi > 9 ? bits(hi, 4) : bits(lo, 4)) + " is above 1001)"
      const rows = [
        ["Unsigned", sum],
        ["Hexadecimal", (v >> 4).toString(16).toUpperCase() + (v & 15).toString(16).toUpperCase() + "<sub>16</sub>"],
        ["Octal", v.toString(8) + "<sub>8</sub> &nbsp;(" + bits(v >> 6, 2) + " " + bits((v >> 3) & 7, 3) + " " + bits(v & 7, 3) + ")"],
        ["BCD (each 4 bits = one digit)", bcd],
        ["Sign-magnitude", sm + (neg ? ' <span class="lg-note">(sign bit 1, magnitude ' + bits(v & 127, 7) + ")</span>" : "")],
        ["1’s complement", ones],
        ["2’s complement", twosSum],
      ]
      root.querySelector(".lg-readtable tbody").innerHTML = rows.map(([k, x]) => "<tr><th>" + k + "</th><td>" + x + "</td></tr>").join("")
    }

    root.querySelectorAll(".lg-bitbtn").forEach((b) =>
      b.addEventListener("click", () => {
        v ^= 1 << +b.dataset.i
        render()
      }),
    )
    input.addEventListener("input", () => {
      const x = parseInt(input.value, 10)
      if (isNaN(x) || x < -128 || x > 255) return
      v = x < 0 ? x + 256 : x
      render(true)
    })
    root.querySelector('[data-act="inv"]').addEventListener("click", () => {
      v ^= 255
      render()
    })
    root.querySelector('[data-act="neg"]').addEventListener("click", () => {
      v = (256 - v) & 255
      render()
    })
    root.querySelector('[data-act="clr"]').addEventListener("click", () => {
      v = 0
      render()
    })
    render()
  }

  // ---------- Oscilloscope ----------

  function buildWave(root) {
    const TDIV = [[10e-9, "10 ns"], [20e-9, "20 ns"], [50e-9, "50 ns"], [100e-9, "100 ns"], [1e-6, "1 µs"], [10e-6, "10 µs"], [20e-6, "20 µs"], [100e-6, "100 µs"], [1e-3, "1 ms"], [10e-3, "10 ms"], [100e-3, "100 ms"]]
    const VDIV = [[0.05, "50 mV"], [0.1, "100 mV"], [0.25, "250 mV"], [0.5, "500 mV"], [1, "1 V"], [2, "2 V"]]
    const opts = (list, sel) => list.map(([x, t]) => '<option value="' + x + '"' + (x === sel ? " selected" : "") + ">" + t + "</option>").join("")
    root.innerHTML =
      '<svg class="lg-svg lg-scope" viewBox="0 0 420 340" role="img" aria-label="Oscilloscope screen showing the pulse waveform"></svg>' +
      '<div class="lg-controls">' +
      '<label><span>Frequency</span><span class="lg-pair"><input type="number" data-k="f" min="0" step="any" value="20"><select data-k="fu">' +
      '<option value="1">Hz</option><option value="1000">kHz</option><option value="1000000" selected>MHz</option></select></span></label>' +
      '<label><span>Duty cycle</span><span class="lg-pair"><input type="range" data-k="duty" min="5" max="95" step="5" value="50"><output></output></span></label>' +
      '<label><span>Amplitude V<sub>pp</sub></span><span class="lg-pair"><input type="number" data-k="vpp" min="0" step="any" value="1.5"><span class="lg-unit">V</span></span></label>' +
      '<label><span>Volts/div</span><select data-k="vdiv">' + opts(VDIV, 0.25) + "</select></label>" +
      '<label><span>Time/div</span><select data-k="tdiv">' + opts(TDIV, 10e-9) + "</select></label>" +
      "</div>" +
      '<p class="lg-readout"></p>'
    const svg = root.querySelector(".lg-scope")
    const get = (k) => root.querySelector('[data-k="' + k + '"]')
    const DIV = 40, X0 = 10, Y0 = 10, ZERO = Y0 + 6 * DIV

    let grid = '<rect class="lg-screen" x="' + X0 + '" y="' + Y0 + '" width="' + 10 * DIV + '" height="' + 8 * DIV + '" rx="4"/>'
    for (let i = 1; i < 10; i++) grid += '<line class="lg-grid' + (i === 5 ? " lg-axis-line" : "") + '" x1="' + (X0 + i * DIV) + '" y1="' + Y0 + '" x2="' + (X0 + i * DIV) + '" y2="' + (Y0 + 8 * DIV) + '"/>'
    for (let i = 1; i < 8; i++) grid += '<line class="lg-grid' + (i === 4 ? " lg-axis-line" : "") + '" x1="' + X0 + '" y1="' + (Y0 + i * DIV) + '" x2="' + (X0 + 10 * DIV) + '" y2="' + (Y0 + i * DIV) + '"/>'
    grid += '<text class="lg-scope-zero" x="' + (X0 + 4) + '" y="' + (ZERO - 4) + '">0 V</text>'

    const render = () => {
      const f = +get("f").value * +get("fu").value
      const duty = +get("duty").value / 100
      const vpp = Math.max(0, +get("vpp").value)
      const vdiv = +get("vdiv").value
      const tdiv = +get("tdiv").value
      get("duty").nextElementSibling.textContent = Math.round(duty * 100) + "%"
      const T = f > 0 ? 1 / f : Infinity
      const tw = duty * T
      const hiY = Math.max(Y0, ZERO - (vpp / vdiv) * DIV)
      const clipped = ZERO - (vpp / vdiv) * DIV < Y0
      const Tpx = (T / tdiv) * DIV
      const cycles = (10 * DIV) / Tpx
      let h = grid
      let note = ""
      if (!(f > 0)) note = "Enter a frequency above 0."
      else if (cycles > 60) {
        note = "That’s " + Math.round(cycles) + " cycles across the screen, too many to see. Use a smaller time/div."
        h += '<rect class="lg-blur" x="' + X0 + '" y="' + hiY + '" width="' + 10 * DIV + '" height="' + (ZERO - hiY) + '"/>'
      } else {
        let d = "M" + X0 + "," + ZERO
        for (let x = X0; x < X0 + 10 * DIV; x += Tpx) {
          const xr = Math.min(x + duty * Tpx, X0 + 10 * DIV)
          const xe = Math.min(x + Tpx, X0 + 10 * DIV)
          d += " L" + x + "," + hiY + " L" + xr + "," + hiY
          if (xr < X0 + 10 * DIV) d += " L" + xr + "," + ZERO + " L" + xe + "," + ZERO
        }
        h += '<path class="lg-trace" d="' + d + '"/>'
        if (cycles < 1) note = "Less than one full cycle fits on the screen. Use a larger time/div."
      }
      if (clipped) note += (note ? " " : "") + "The waveform is taller than the screen. Use a larger volts/div."
      svg.innerHTML = h
      const dv = (x) => +x.toPrecision(3)
      root.querySelector(".lg-readout").innerHTML =
        "T = 1/f = " + eng(T, "s") + " = " + dv(T / tdiv) + " div × " + eng(tdiv, "s") + "/div" +
        "<br>t<sub>W</sub> = " + Math.round(duty * 100) + "% × T = " + eng(tw, "s") + " = " + dv(tw / tdiv) + " div" +
        "<br>V<sub>pp</sub> = " + eng(vpp, "V") + " = " + dv(vpp / vdiv) + " div × " + eng(vdiv, "V") + "/div" +
        (note ? '<br><span class="lg-warn">' + note + "</span>" : "")
    }
    root.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", render))
    render()
  }

  // ---------- CMOS gates ----------

  // A MOSFET drawn vertically from y1 to y2 at x, with its gate lead to the left
  function mos(x, y1, y2, pmos, label, on) {
    const m = (y1 + y2) / 2
    return (
      '<g class="lg-mos' + (on ? " is-on" : " is-off") + '">' +
      '<line class="lg-chan" x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '"/>' +
      '<line class="lg-wire" x1="' + (x - 9) + '" y1="' + (y1 + 5) + '" x2="' + (x - 9) + '" y2="' + (y2 - 5) + '"/>' +
      '<line class="lg-wire" x1="' + (x - 36) + '" y1="' + m + '" x2="' + (x - (pmos ? 18 : 9)) + '" y2="' + m + '"/>' +
      (pmos ? '<circle class="lg-bubble" cx="' + (x - 13.5) + '" cy="' + m + '" r="4.5"/>' : "") +
      '<text class="lg-label" x="' + (x - 42) + '" y="' + (m + 5) + '" text-anchor="end">' + label + "</text>" +
      '<text class="lg-state" x="' + (x + 7) + '" y="' + (m + 4) + '">' + (on ? "ON" : "OFF") + "</text></g>"
    )
  }
  const seg = (cls, pts) => '<polyline class="lg-wire ' + cls + '" points="' + pts + '"/>'

  // The pull-up (PMOS) half of a NOT / NAND / NOR, from VDD at y=24 down to the output node at y=160
  function drawPun(g, a, b, U) {
    if (g === "not") return seg(U, "180,24 180,60") + mos(180, 60, 110, true, "A", !a) + seg(U, "180,110 180,160")
    if (g === "nand")
      return (
        seg(U, "130,24 130,50") + mos(130, 50, 95, true, "A", !a) + seg(U, "130,95 130,115") +
        seg(U, "230,24 230,50") + mos(230, 50, 95, true, "B", !b) + seg(U, "230,95 230,115") +
        seg(U, "130,115 230,115") + seg(U, "180,115 180,160")
      )
    return seg(U, "180,24 180,40") + mos(180, 40, 80, true, "A", !a) + seg(U, "180,80 180,98") + mos(180, 98, 138, true, "B", !b) + seg(U, "180,138 180,160")
  }
  // The pull-down (NMOS) half, from the output node at y=160 down to GND at y=296
  function drawPdn(g, a, b, D) {
    if (g === "not") return seg(D, "180,160 180,205") + mos(180, 205, 255, false, "A", !!a) + seg(D, "180,255 180,296")
    if (g === "nand")
      return seg(D, "180,160 180,180") + mos(180, 180, 220, false, "A", !!a) + seg(D, "180,220 180,236") + mos(180, 236, 276, false, "B", !!b) + seg(D, "180,276 180,296")
    return (
      seg(D, "180,160 180,185") + seg(D, "130,185 230,185") +
      seg(D, "130,185 130,205") + mos(130, 205, 250, false, "A", !!a) + seg(D, "130,250 130,272") +
      seg(D, "230,185 230,205") + mos(230, 205, 250, false, "B", !!b) + seg(D, "230,250 230,272") +
      seg(D, "130,272 230,272") + seg(D, "180,272 180,296")
    )
  }
  // A resistor standing in for a missing network, drawn on x=180 from y1 to y2
  function drawRes(cls, y1, y2) {
    const m = (y1 + y2) / 2
    let p = "180," + y1 + " 180," + (m - 30)
    for (let i = 0; i < 6; i++) p += " " + (i % 2 ? 190 : 170) + "," + (m - 30 + 5 + i * 10)
    p += " 180," + (m + 30) + " 180," + y2
    return seg(cls, p) + '<text class="lg-label" x="148" y="' + (m + 5) + '" text-anchor="end">R</text>'
  }
  // VDD and GND rails shared by the transistor diagrams
  const RAILS =
    '<line class="lg-rail" x1="90" y1="24" x2="270" y2="24"/><text class="lg-label" x="278" y="29">V' + '<tspan class="lg-sub" dy="4">DD</tspan></text>' +
    '<line class="lg-rail" x1="90" y1="296" x2="270" y2="296"/>' +
    '<line class="lg-wire" x1="166" y1="304" x2="194" y2="304"/><line class="lg-wire" x1="172" y1="310" x2="188" y2="310"/><line class="lg-wire" x1="178" y1="316" x2="182" y2="316"/>' +
    '<line class="lg-wire" x1="180" y1="296" x2="180" y2="304"/><text class="lg-label" x="278" y="301">GND</text>'
  const outNode = (f) =>
    '<line class="lg-wire lg-outwire' + (f ? " is-hi" : "") + '" x1="180" y1="160" x2="315" y2="160"/>' +
    '<circle class="lg-node" cx="180" cy="160" r="4"/>' +
    '<circle class="lg-term' + (f ? " is-hi" : "") + '" cx="315" cy="160" r="6"/>' +
    '<text class="lg-label" x="327" y="165">f</text>' +
    '<text class="lg-val lg-strong" x="290" y="151" text-anchor="middle">' + f + "</text>"

  function buildCmos(root) {
    let g = "nand"
    const v = { a: 0, b: 1 }
    root.innerHTML =
      chips("cgate", [["not", "NOT"], ["nand", "NAND"], ["nor", "NOR"]]) +
      '<div class="lg-split"><svg class="lg-svg lg-cmos" viewBox="0 0 360 320" role="img" aria-label="CMOS transistor circuit"></svg>' +
      '<table class="lg-tt lg-tt-wide"></table></div>' +
      '<div class="lg-toggles">' + toggle("a", "A") + toggle("b", "B") + "</div>" +
      '<p class="lg-readout lg-prose" aria-live="polite"></p>'
    const svg = root.querySelector(".lg-cmos")

    const state = (a, b) => {
      if (g === "not") return { pun: !a, pdn: !!a }
      if (g === "nand") return { pun: !a || !b, pdn: !!(a && b) }
      return { pun: !a && !b, pdn: !!(a || b) }
    }
    const render = () => {
      const { a, b } = v
      const { pun, pdn } = state(a, b)
      const f = pun ? 1 : 0
      const U = "lg-pun" + (pun ? " is-live" : ""), D = "lg-pdn" + (pdn ? " is-live" : "")
      let h = RAILS + drawPun(g, a, b, U) + drawPdn(g, a, b, D) + outNode(f)
      h +=
        '<text class="lg-net" x="270" y="78">PUN</text><text class="lg-net" x="270" y="94">(PMOS)</text>' +
        '<text class="lg-net" x="270" y="232">PDN</text><text class="lg-net" x="270" y="248">(NMOS)</text>'
      svg.innerHTML = h

      const one = g === "not"
      const combos = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]
      let t = "<thead><tr><th>A</th>" + (one ? "" : "<th>B</th>") + "<th>PUN</th><th>PDN</th><th>f</th></tr></thead><tbody>"
      combos.forEach((r) => {
        const s = state(r[0], r[1] || 0)
        const cur = r[0] === a && (one || r[1] === b)
        t +=
          '<tr data-row="' + r.join("") + '"' + (cur ? ' class="is-cur"' : "") + ">" + r.map((x) => "<td>" + x + "</td>").join("") +
          "<td>" + (s.pun ? "on" : "off") + "</td><td>" + (s.pdn ? "on" : "off") + "</td><td><b>" + (s.pun ? 1 : 0) + "</b></td></tr>"
      })
      root.querySelector(".lg-tt").innerHTML = t + "</tbody>"
      root.querySelectorAll(".lg-toggle").forEach((btn) => setToggle(btn, v[btn.dataset.k]))
      root.querySelector('.lg-toggle[data-k="b"]').hidden = one

      const how = {
        not: "one PMOS on top, one NMOS below.",
        nand: "PMOS in <strong>parallel</strong> (either one can pull up), NMOS in <strong>series</strong> (both are needed to pull down).",
        nor: "PMOS in <strong>series</strong> (both are needed to pull up), NMOS in <strong>parallel</strong> (either one can pull down).",
      }[g]
      root.querySelector(".lg-readout").innerHTML =
        "<strong>CMOS " + g.toUpperCase() + ":</strong> " + how + " " +
        (pun
          ? "Right now the <strong>pull-up network</strong> conducts, so f is connected to V<sub>DD</sub>: <strong>f = 1</strong>."
          : "Right now the <strong>pull-down network</strong> conducts, so f is connected to GND: <strong>f = 0</strong>.") +
        " The other network is off, so no current flows from V<sub>DD</sub> to GND."
    }
    onChips(root, "cgate", g, (k) => {
      g = k
      render()
    })
    root.querySelectorAll(".lg-toggle").forEach((btn) =>
      btn.addEventListener("click", () => {
        v[btn.dataset.k] ^= 1
        render()
      }),
    )
    root.querySelector(".lg-tt").addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-row]")
      if (!tr) return
      v.a = +tr.dataset.row[0]
      if (tr.dataset.row.length > 1) v.b = +tr.dataset.row[1]
      render()
    })
    render()
  }

  // ---------- NMOS-only vs PMOS-only vs CMOS ----------

  function buildMosFamily(root) {
    let fam = "nmos"
    let g = "nand"
    const v = { a: 1, b: 1 }
    root.innerHTML =
      chips("mfam", [["nmos", "NMOS logic"], ["pmos", "PMOS logic"], ["cmos", "CMOS"]]) +
      chips("mgate", [["not", "NOT"], ["nand", "NAND"], ["nor", "NOR"]]) +
      '<div class="lg-split"><svg class="lg-svg lg-cmos" viewBox="0 0 360 320" role="img" aria-label="Transistor circuit for the chosen logic family"></svg>' +
      '<table class="lg-tt lg-tt-wide"></table></div>' +
      '<div class="lg-toggles">' + toggle("a", "A") + toggle("b", "B") + "</div>" +
      '<p class="lg-readout lg-prose" aria-live="polite"></p>'
    const svg = root.querySelector(".lg-cmos")

    // Does each transistor network conduct? (the same for every family: PMOS on for 0, NMOS on for 1)
    const nets = (a, b) => {
      if (g === "not") return { pun: !a, pdn: !!a }
      if (g === "nand") return { pun: !a || !b, pdn: !!(a && b) }
      return { pun: !a && !b, pdn: !!(a || b) }
    }
    const out = (a, b) => {
      const { pun, pdn } = nets(a, b)
      if (fam === "nmos") return { f: pdn ? 0 : 1, cur: pdn }
      if (fam === "pmos") return { f: pun ? 1 : 0, cur: pun }
      return { f: pun ? 1 : 0, cur: false }
    }
    const render = () => {
      const { a, b } = v
      const { pun, pdn } = nets(a, b)
      const { f, cur } = out(a, b)
      let h = RAILS
      if (fam === "nmos") {
        h += drawRes(cur ? "lg-cur" : "lg-pun is-live", 24, 160) + drawPdn(g, a, b, cur ? "lg-cur" : "lg-pdn")
      } else if (fam === "pmos") {
        h += drawPun(g, a, b, cur ? "lg-cur" : "lg-pun") + drawRes(cur ? "lg-cur" : "lg-pdn is-live", 160, 296)
      } else {
        h += drawPun(g, a, b, "lg-pun" + (pun ? " is-live" : "")) + drawPdn(g, a, b, "lg-pdn" + (pdn ? " is-live" : ""))
      }
      h += outNode(f)
      h +=
        '<text class="lg-net" x="270" y="78">' + (fam === "nmos" ? "pull-up R" : "PUN") + "</text>" +
        (fam === "nmos" ? "" : '<text class="lg-net" x="270" y="94">(PMOS)</text>') +
        '<text class="lg-net" x="270" y="232">' + (fam === "pmos" ? "pull-down R" : "PDN") + "</text>" +
        (fam === "pmos" ? "" : '<text class="lg-net" x="270" y="248">(NMOS)</text>')
      if (cur) h += '<text class="lg-net lg-warn" x="20" y="165">static current</text>'
      svg.innerHTML = h

      const one = g === "not"
      const combos = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]
      const word = (on) => (on ? "on" : "off")
      let t = "<thead><tr><th>A</th>" + (one ? "" : "<th>B</th>") + "<th>Pull-up</th><th>Pull-down</th><th>f</th><th>I<sub>static</sub></th></tr></thead><tbody>"
      combos.forEach((r) => {
        const n = nets(r[0], r[1] || 0)
        const o = out(r[0], r[1] || 0)
        const here = r[0] === a && (one || r[1] === b)
        t +=
          '<tr data-row="' + r.join("") + '"' + (here ? ' class="is-cur"' : "") + ">" + r.map((x) => "<td>" + x + "</td>").join("") +
          "<td>" + (fam === "nmos" ? "R" : word(n.pun)) + "</td><td>" + (fam === "pmos" ? "R" : word(n.pdn)) + "</td>" +
          "<td><b>" + o.f + "</b></td><td>" + (o.cur ? "yes" : "no") + "</td></tr>"
      })
      root.querySelector(".lg-tt").innerHTML = t + "</tbody>"
      root.querySelectorAll(".lg-toggle").forEach((btn) => setToggle(btn, v[btn.dataset.k]))
      root.querySelector('.lg-toggle[data-k="b"]').hidden = one

      const gate = g.toUpperCase()
      let msg
      if (fam === "nmos") {
        msg =
          "<strong>NMOS " + gate + ":</strong> only a <strong>pull-down network</strong> of NMOS, plus a pull-up resistor R. " +
          (pdn
            ? "The PDN conducts and beats the weak resistor, so <strong>f = 0</strong>. But V<sub>DD</sub> now has a path to GND through R and the PDN, so current flows the whole time the output is low."
            : "The PDN is off, so nothing fights the resistor and it holds <strong>f = 1</strong>. No current flows.")
      } else if (fam === "pmos") {
        msg =
          "<strong>PMOS " + gate + ":</strong> only a <strong>pull-up network</strong> of PMOS, plus a pull-down resistor R. " +
          (pun
            ? "The PUN conducts and beats the weak resistor, so <strong>f = 1</strong>. V<sub>DD</sub> has a path to GND through the PUN and R, so current flows the whole time the output is high."
            : "The PUN is off, so the resistor pulls the output to GND: <strong>f = 0</strong>. No current flows.")
      } else {
        msg =
          "<strong>CMOS " + gate + ":</strong> a PUN <em>and</em> a PDN, no resistor. " +
          (pun
            ? "The <strong>PUN</strong> conducts, the PDN is off: <strong>f = 1</strong>."
            : "The <strong>PDN</strong> conducts, the PUN is off: <strong>f = 0</strong>.") +
          " One network is always off, so there is never a path from V<sub>DD</sub> to GND."
      }
      root.querySelector(".lg-readout").innerHTML = msg
    }
    onChips(root, "mfam", fam, (k) => {
      fam = k
      render()
    })
    onChips(root, "mgate", g, (k) => {
      g = k
      render()
    })
    root.querySelectorAll(".lg-toggle").forEach((btn) =>
      btn.addEventListener("click", () => {
        v[btn.dataset.k] ^= 1
        render()
      }),
    )
    root.querySelector(".lg-tt").addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-row]")
      if (!tr) return
      v.a = +tr.dataset.row[0]
      if (tr.dataset.row.length > 1) v.b = +tr.dataset.row[1]
      render()
    })
    render()
  }

  // ---------- Single MOSFET cross-section ----------

  function buildMosfet(root) {
    const VDD = 5, VT = 1
    let type = "nmos"
    let vg = 5
    root.innerHTML =
      chips("mtype", [["nmos", "NMOS"], ["pmos", "PMOS"]]) +
      '<svg class="lg-svg lg-mosfet" viewBox="0 0 380 250" role="img" aria-label="Cross-section of a MOSFET. Click the gate terminal to flip it."></svg>' +
      '<div class="lg-controls lg-controls-one"><label><span>Gate voltage</span><span class="lg-pair"><input type="range" data-k="vg" min="0" max="5" step="0.5" value="5"><output></output></span></label></div>' +
      '<div class="lg-actions lg-actions-left"><button type="button" class="lg-btn" data-v="0">Gate = 0 (LOW)</button><button type="button" class="lg-btn" data-v="5">Gate = 1 (HIGH)</button></div>' +
      '<p class="lg-readout lg-prose" aria-live="polite"></p>'
    const svg = root.querySelector(".lg-mosfet")
    const slider = root.querySelector('[data-k="vg"]')

    const render = () => {
      const n = type === "nmos"
      // Only the gate-to-source voltage matters. An NMOS source sits at GND, a PMOS source at VDD.
      const vgs = n ? vg : VDD - vg
      const on = vgs > VT
      const thick = on ? 3 + Math.min(4, vgs - VT) * 2.5 : 0
      const cy = 140 + thick / 2
      const xs = 90, xd = 290, xg = 190

      let h =
        '<rect class="lg-subst" x="30" y="140" width="320" height="90" rx="4"/>' +
        '<rect class="lg-diff" x="55" y="140" width="70" height="40"/><rect class="lg-diff" x="255" y="140" width="70" height="40"/>' +
        '<text class="lg-zone" x="90" y="164" text-anchor="middle">' + (n ? "n+" : "p+") + "</text>" +
        '<text class="lg-zone" x="290" y="164" text-anchor="middle">' + (n ? "n+" : "p+") + "</text>" +
        '<text class="lg-zone" x="190" y="214" text-anchor="middle">' + (n ? "p-type" : "n-type") + " body</text>"
      if (on) h += '<rect class="lg-channel" x="125" y="140" width="130" height="' + thick + '"/>'
      h +=
        '<rect class="lg-oxide" x="125" y="128" width="130" height="12"/>' +
        '<rect class="lg-gatemetal" x="125" y="104" width="130" height="24"/>' +
        '<text class="lg-zone" x="190" y="137" text-anchor="middle" font-size="8">oxide (insulator)</text>'
      // Charges: the gate plate and the carriers it pulls into the channel
      if (on) {
        for (let x = 145; x <= 235; x += 22.5) {
          h += '<text class="lg-charge" x="' + x + '" y="121" text-anchor="middle">' + (n ? "+" : "−") + "</text>"
          h += '<circle class="lg-carrier ' + (n ? "lg-e" : "lg-h") + '" cx="' + (x + 4) + '" cy="' + cy + '" r="2.6"/>'
        }
      }
      // Leads and terminals
      const terms = [[xs, 140, "S", n ? "GND" : "V"], [xd, 140, "D", n ? "V" : "GND"], [xg, 104, "G", ""]]
      terms.forEach(([x, y0, name, sup]) => {
        const hi = name === "G" ? vg > 2.5 : false
        h += '<line class="lg-wire" x1="' + x + '" y1="46" x2="' + x + '" y2="' + y0 + '"/>'
        h += '<circle class="lg-term' + (hi ? " is-hi" : "") + '" cx="' + x + '" cy="46" r="6"/>'
        const sub = sup === "V" ? 'V<tspan class="lg-sub" dy="4">DD</tspan>' : sup
        h += '<text class="lg-label" x="' + x + '" y="28" text-anchor="middle">' + name + (sup ? " (" + sub + ")" : "") + "</text>"
      })
      h += '<line class="lg-hit" x1="' + xg + '" y1="40" x2="' + xg + '" y2="104" role="button" tabindex="0" aria-label="Flip gate"/>'
      // Current path when the channel conducts
      if (on) {
        const pts = n
          ? [xd, 46, xd, cy, xs, cy, xs, 46]
          : [xs, 46, xs, cy, xd, cy, xd, 46]
        h += seg("lg-flow is-hi", pts.join(","))
        h += n
          ? '<polygon class="lg-arrow" points="200,' + (cy - 6) + " 186," + cy + " 200," + (cy + 6) + '"/>'
          : '<polygon class="lg-arrow" points="180,' + (cy - 6) + " 194," + cy + " 180," + (cy + 6) + '"/>'
      }
      h +=
        '<text class="lg-val lg-strong" x="' + (xg - 12) + '" y="78" font-size="11" text-anchor="end">V<tspan class="lg-sub" dy="4">G</tspan><tspan dy="-4"> = ' + vg.toFixed(1) + " V</tspan></text>"
      svg.innerHTML = h

      root.querySelector(".lg-pair output").textContent = vg.toFixed(1) + " V"
      const gl = vg === 0 ? "LOW (0)" : vg === VDD ? "HIGH (1)" : null
      const need = n ? "above" : "below"
      root.querySelector(".lg-readout").innerHTML =
        "<strong>" + (n ? "NMOS" : "PMOS") + ".</strong> " +
        (n
          ? "The source is tied to GND, so V<sub>GS</sub> = V<sub>G</sub> = " + vgs.toFixed(1) + " V. "
          : "The source is tied to V<sub>DD</sub> (5 V), so V<sub>SG</sub> = 5 − V<sub>G</sub> = " + vgs.toFixed(1) + " V. ") +
        (on
          ? "That is more than the threshold V<sub>T</sub> = 1 V, so the gate's field pulls " + (n ? "<strong>electrons</strong>" : "<strong>holes</strong>") +
            " up under the oxide. They form a <strong>channel</strong> joining source and drain: the switch is <strong>ON</strong>" +
            (thick > 12 ? " (a strong channel)." : ". Raise the gate " + (n ? "voltage" : "toward 0 V") + " further and the channel gets thicker.")
          : "That is below the threshold V<sub>T</sub> = 1 V, so no channel forms and the body blocks the current: the switch is <strong>OFF</strong>. " +
            "(An " + (n ? "NMOS" : "PMOS") + " needs the gate " + need + " " + (n ? VT : VDD - VT) + " V to turn on.)") +
        (gl ? " <span class='lg-note'>Logic view: gate " + gl + " → " + (on ? "ON" : "OFF") + ".</span>" : "")
    }

    onChips(root, "mtype", type, (k) => {
      type = k
      render()
    })
    slider.addEventListener("input", () => {
      vg = +slider.value
      render()
    })
    root.querySelectorAll("[data-v]").forEach((b) =>
      b.addEventListener("click", () => {
        vg = +b.dataset.v
        slider.value = String(vg)
        render()
      }),
    )
    svg.addEventListener("click", (e) => {
      if (!e.target.closest(".lg-hit")) return
      vg = vg > 2.5 ? 0 : VDD
      slider.value = String(vg)
      render()
    })
    keyClick(svg)
    render()
  }

  // ---------- 4-bit adder/subtractor ----------

  function buildAdder(root) {
    let X = 0b0110, Y = 0b0111, sub = 0
    const bitRow = (name) =>
      '<div class="lg-bitrow"><span class="lg-bitrow-name">' + name + "</span>" +
      [3, 2, 1, 0].map((i) => '<button type="button" class="lg-bitbtn lg-small" data-r="' + name + '" data-i="' + i + '" aria-pressed="false" aria-label="' + name + " bit " + i + '"><b>0</b><span class="lg-pos">' + name.toLowerCase() + i + "</span></button>").join("") +
      '<span class="lg-bitrow-val"></span></div>'
    root.innerHTML =
      chips("op", [["0", "Add: X + Y"], ["1", "Subtract: X − Y"]]) +
      '<div class="lg-bitrows">' + bitRow("X") + bitRow("Y") + "</div>" +
      '<svg class="lg-svg lg-adder" viewBox="0 0 540 236" role="img" aria-label="Four full adders chained by their carries"></svg>' +
      '<p class="lg-readout"></p>'
    const svg = root.querySelector(".lg-adder")

    const render = () => {
      const c = [sub]
      const s = []
      const yy = []
      for (let i = 0; i < 4; i++) {
        const x = (X >> i) & 1
        const y = ((Y >> i) & 1) ^ sub
        yy.push(y)
        s.push(x ^ y ^ c[i])
        c.push((x & y) | (x & c[i]) | (y & c[i]))
      }
      const S = s.reduce((acc, b, i) => acc | (b << i), 0)
      const wire = (b) => "lg-wire" + (b ? " is-hi" : "")
      let h = ""
      for (let i = 0; i < 4; i++) {
        const bx = 40 + (3 - i) * 120
        const x = (X >> i) & 1
        h +=
          '<rect class="lg-block" x="' + bx + '" y="92" width="80" height="58" rx="8"/>' +
          '<text class="lg-block-label" x="' + (bx + 40) + '" y="126" text-anchor="middle">FA' + i + "</text>" +
          '<line class="' + wire(x) + '" x1="' + (bx + 22) + '" y1="46" x2="' + (bx + 22) + '" y2="92"/>' +
          '<line class="' + wire(yy[i]) + '" x1="' + (bx + 58) + '" y1="46" x2="' + (bx + 58) + '" y2="92"/>' +
          '<text class="lg-label lg-small-label" x="' + (bx + 22) + '" y="22" text-anchor="middle">' + ssub("x", i) + "</text>" +
          '<text class="lg-val" x="' + (bx + 22) + '" y="40" text-anchor="middle">' + x + "</text>" +
          '<text class="lg-label lg-small-label" x="' + (bx + 58) + '" y="22" text-anchor="middle">' + (sub ? sbar("y") : "y") + '<tspan class="lg-sub" dy="4">' + i + '</tspan><tspan dy="-4">&#8203;</tspan></text>' +
          '<text class="lg-val" x="' + (bx + 58) + '" y="40" text-anchor="middle">' + yy[i] + "</text>" +
          '<line class="' + wire(s[i]) + '" x1="' + (bx + 40) + '" y1="150" x2="' + (bx + 40) + '" y2="190"/>' +
          '<text class="lg-label lg-small-label" x="' + (bx + 40) + '" y="210" text-anchor="middle">' + ssub("s", i) + " = " + s[i] + "</text>" +
          // carry out of this stage, to the left
          '<line class="' + wire(c[i + 1]) + '" x1="' + bx + '" y1="121" x2="' + (i === 3 ? 12 : bx - 40) + '" y2="121" marker-end="url(#lg-arrow-' + root.dataset.uid + ')"/>' +
          '<text class="lg-val" x="' + (bx - 20) + '" y="113" text-anchor="middle">' + ssub("c", i + 1) + "=" + c[i + 1] + "</text>"
      }
      h =
        '<defs><marker id="lg-arrow-' + root.dataset.uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="lg-arrowhead" d="M0,1 L9,5 L0,9 Z"/></marker></defs>' +
        h +
        '<line class="' + wire(c[0]) + '" x1="532" y1="121" x2="520" y2="121" marker-end="url(#lg-arrow-' + root.dataset.uid + ')"/>' +
        '<text class="lg-val" x="530" y="113" text-anchor="end">' + ssub("c", 0) + "=" + c[0] + "</text>"
      svg.innerHTML = h

      root.querySelectorAll(".lg-bitbtn").forEach((b) => {
        const val = ((b.dataset.r === "X" ? X : Y) >> +b.dataset.i) & 1
        b.setAttribute("aria-pressed", String(!!val))
        b.querySelector("b").textContent = val
      })
      const signed = (n) => (n & 8 ? n - 16 : n)
      const both = (n) => n + " unsigned, " + minus(signed(n)) + " signed"
      root.querySelectorAll(".lg-bitrow-val")[0].textContent = "= " + both(X)
      root.querySelectorAll(".lg-bitrow-val")[1].textContent = "= " + both(Y)

      const ovf = c[4] ^ c[3]
      const trueSigned = sub ? signed(X) - signed(Y) : signed(X) + signed(Y)
      const trueUnsigned = sub ? X - Y : X + Y
      root.querySelector(".lg-readout").innerHTML =
        (sub
          ? "Subtract: the XOR gates invert Y (" + bits(Y, 4) + " → " + bits(Y ^ 15, 4) + ") and c<sub>0</sub> = 1 adds the 1, so the adder computes X + " + bar("Y") + " + 1 = X − Y.<br>"
          : "Add: the XOR gates pass Y through unchanged and c<sub>0</sub> = 0.<br>") +
        "Result: S = <strong>" + bits(S, 4) + "</strong>, c<sub>4</sub> = " + c[4] + "<br>" +
        "Signed (2’s complement): S = " + minus(signed(S)) + (ovf
          ? ' <span class="lg-flag">overflow: c<sub>4</sub> ⊕ c<sub>3</sub> = 1, true answer ' + minus(trueSigned) + " doesn’t fit in −8…+7</span>"
          : ' <span class="lg-note">(no overflow: c<sub>4</sub> ⊕ c<sub>3</sub> = 0)</span>') +
        "<br>Unsigned: " + (sub
          ? "S = " + S + (X < Y ? ' <span class="lg-note">(X &lt; Y, so the unsigned result wrapped around; c<sub>4</sub> = 0 means a borrow)</span>' : ' <span class="lg-note">(c<sub>4</sub> = 1 means no borrow)</span>')
          : "c<sub>4</sub>S = " + (c[4] * 16 + S) + (c[4] ? ' <span class="lg-note">(needs the 5th bit c<sub>4</sub>; ' + trueUnsigned + " doesn’t fit in 4 bits)</span>" : ""))
    }
    root.dataset.uid = String(++uid)
    onChips(root, "op", "0", (k) => {
      sub = +k
      render()
    })
    root.querySelectorAll(".lg-bitbtn").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.r === "X") X ^= 1 << +b.dataset.i
        else Y ^= 1 << +b.dataset.i
        render()
      }),
    )
    render()
  }

  // ---------- 4-to-1 multiplexer ----------

  function buildMux(root) {
    const d = [1, 0, 1, 1]
    const s = { s1: 1, s0: 0 }
    root.innerHTML =
      '<svg class="lg-svg lg-mux" viewBox="0 0 360 300" role="img" aria-label="4-to-1 multiplexer"></svg>' +
      '<div class="lg-toggles">' + toggle("d0", "D<sub>0</sub>") + toggle("d1", "D<sub>1</sub>") + toggle("d2", "D<sub>2</sub>") + toggle("d3", "D<sub>3</sub>") +
      '<span class="lg-sep"></span>' + toggle("s1", "S<sub>1</sub>") + toggle("s0", "S<sub>0</sub>") + "</div>" +
      '<p class="lg-readout lg-expr-line"></p>'
    const svg = root.querySelector(".lg-mux")
    const YS = [60, 105, 150, 195]
    const render = () => {
      const sel = s.s1 * 2 + s.s0
      const y = d[sel]
      const wire = (b, on) => "lg-wire" + (b ? " is-hi" : "") + (on ? " is-sel" : "")
      let h = '<path class="lg-body" d="M140,30 L240,70 L240,190 L140,230 Z"/>'
      d.forEach((v, i) => {
        h +=
          '<g class="lg-in" data-k="d' + i + '" role="button" tabindex="0" aria-label="Flip D' + i + '">' +
          '<line class="lg-hit" x1="34" y1="' + YS[i] + '" x2="140" y2="' + YS[i] + '"/>' +
          '<line class="' + wire(v, i === sel) + '" x1="60" y1="' + YS[i] + '" x2="140" y2="' + YS[i] + '"/>' +
          '<circle class="lg-term' + (v ? " is-hi" : "") + '" cx="60" cy="' + YS[i] + '" r="6"/>' +
          '<text class="lg-label" x="46" y="' + (YS[i] + 5) + '" text-anchor="end">' + ssub("D", i) + "</text>" +
          '<text class="lg-val" x="96" y="' + (YS[i] - 7) + '" text-anchor="middle">' + v + "</text>" +
          '<text class="lg-pin" x="148" y="' + (YS[i] + 4) + '">' + i + "</text></g>"
      })
      h += '<line class="lg-wire is-sel' + (y ? " is-hi" : "") + '" x1="140" y1="' + YS[sel] + '" x2="240" y2="130"/>'
      h +=
        '<line class="' + wire(y, true) + '" x1="240" y1="130" x2="312" y2="130"/>' +
        '<circle class="lg-term' + (y ? " is-hi" : "") + '" cx="312" cy="130" r="6"/>' +
        '<text class="lg-label" x="324" y="135">Y</text>' +
        '<text class="lg-val lg-strong" x="276" y="121" text-anchor="middle">' + y + "</text>"
      ;[["s1", 175, 216], ["s0", 205, 204]].forEach(([k, x, top]) => {
        h +=
          '<g class="lg-in" data-k="' + k + '" role="button" tabindex="0" aria-label="Flip ' + k.toUpperCase() + '">' +
          '<line class="lg-hit" x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="292"/>' +
          '<line class="' + wire(s[k], false) + '" x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="268"/>' +
          '<circle class="lg-term' + (s[k] ? " is-hi" : "") + '" cx="' + x + '" cy="268" r="6"/>' +
          '<text class="lg-label" x="' + x + '" y="292" text-anchor="middle">' + ssub("S", k[1]) + "</text>" +
          '<text class="lg-val" x="' + (x + 10) + '" y="250">' + s[k] + "</text></g>"
      })
      h += '<text class="lg-block-label" x="190" y="134" text-anchor="middle">MUX</text>'
      svg.innerHTML = h
      root.querySelectorAll(".lg-toggle").forEach((b) => {
        const k = b.dataset.k
        setToggle(b, k[0] === "d" ? d[+k[1]] : s[k])
      })
      const terms = [
        "D<sub>0</sub>" + bar("S<sub>1</sub>") + "&#8202;" + bar("S<sub>0</sub>"),
        "D<sub>1</sub>" + bar("S<sub>1</sub>") + "S<sub>0</sub>",
        "D<sub>2</sub>S<sub>1</sub>" + bar("S<sub>0</sub>"),
        "D<sub>3</sub>S<sub>1</sub>S<sub>0</sub>",
      ]
      root.querySelector(".lg-readout").innerHTML =
        'Y = ' + terms.map((t, i) => '<span class="lg-termsel' + (i === sel ? " is-sel" : "") + '">' + t + "</span>").join(" + ") +
        "<br>S<sub>1</sub>S<sub>0</sub> = " + s.s1 + s.s0 + " = " + sel + ", so only the D<sub>" + sel + "</sub> term can be 1: Y = D<sub>" + sel + "</sub> = <strong>" + y + "</strong>"
    }
    const flip = (k) => {
      if (k[0] === "d") d[+k[1]] ^= 1
      else s[k] ^= 1
      render()
    }
    svg.addEventListener("click", (e) => {
      const t = e.target.closest(".lg-in")
      if (t) flip(t.dataset.k)
    })
    root.querySelectorAll(".lg-toggle").forEach((b) => b.addEventListener("click", () => flip(b.dataset.k)))
    keyClick(svg)
    render()
  }

  // ---------- BCD-to-7-segment decoder ----------

  const SEG_ON = ["1111110", "0110000", "1101101", "1111001", "0110011", "1011011", "1011111", "1110000", "1111111", "1111011"]
  const SEG_NAMES = ["a", "b", "c", "d", "e", "f", "g"]
  let segEqs = null
  function buildSevenSeg(root) {
    if (!segEqs) {
      const dcs = [10, 11, 12, 13, 14, 15]
      segEqs = SEG_NAMES.map((_, si) => {
        const ones = range(10).filter((dg) => SEG_ON[dg][si] === "1")
        return minimize(4, ones, dcs).map((c) => termHtml(4, c, false)).join(" + ")
      })
    }
    let v = 5
    const hseg = (cx, cy) => (cx - 29) + "," + cy + " " + (cx - 23) + "," + (cy - 6) + " " + (cx + 23) + "," + (cy - 6) + " " + (cx + 29) + "," + cy + " " + (cx + 23) + "," + (cy + 6) + " " + (cx - 23) + "," + (cy + 6)
    const vseg = (cx, cy) => cx + "," + (cy - 36) + " " + (cx + 6) + "," + (cy - 30) + " " + (cx + 6) + "," + (cy + 30) + " " + cx + "," + (cy + 36) + " " + (cx - 6) + "," + (cy + 30) + " " + (cx - 6) + "," + (cy - 30)
    const shapes = { a: hseg(60, 22), b: vseg(94, 61), c: vseg(94, 139), d: hseg(60, 178), e: vseg(26, 139), f: vseg(26, 61), g: hseg(60, 100) }
    const labels = { a: [60, 12], b: [110, 64], c: [110, 142], d: [60, 198], e: [10, 142], f: [10, 64], g: [60, 90] }
    root.innerHTML =
      '<div class="lg-split lg-split-seg"><svg class="lg-svg lg-seg" viewBox="-6 0 132 206" role="img" aria-label="Seven-segment display"></svg>' +
      '<ul class="lg-seglist"></ul></div>' +
      '<div class="lg-toggles">' + toggle("3", "A") + toggle("2", "B") + toggle("1", "C") + toggle("0", "D") +
      '<button type="button" class="lg-btn" data-act="next">Count up</button></div>' +
      '<p class="lg-readout" aria-live="polite"></p>'
    const svg = root.querySelector(".lg-seg")
    const render = () => {
      const on = v <= 9 ? SEG_ON[v] : "0000000"
      svg.innerHTML = SEG_NAMES.map((n, i) =>
        '<g class="lg-segment' + (on[i] === "1" ? " is-lit" : "") + '" data-s="' + n + '"><polygon points="' + shapes[n] + '"/>' +
        '<text x="' + labels[n][0] + '" y="' + labels[n][1] + '" text-anchor="middle">' + n + "</text></g>").join("")
      root.querySelector(".lg-seglist").innerHTML = SEG_NAMES.map((n, i) =>
        '<li data-s="' + n + '"' + (on[i] === "1" ? ' class="is-lit"' : "") + "><b>" + n + "</b> = " + segEqs[i] + "</li>").join("")
      root.querySelectorAll(".lg-toggle").forEach((b) => setToggle(b, (v >> +b.dataset.k) & 1))
      root.querySelector(".lg-readout").innerHTML =
        "ABCD = " + bits(v, 4) + (v <= 9
          ? " → digit <strong>" + v + "</strong>. Lit: " + SEG_NAMES.filter((_, i) => on[i] === "1").join(", ") + "."
          : ' → <span class="lg-warn">not a BCD digit</span>. These six codes never happen, so they’re don’t cares in every segment’s K-map (shown blank here).')
    }
    root.querySelectorAll(".lg-toggle").forEach((b) =>
      b.addEventListener("click", () => {
        v ^= 1 << +b.dataset.k
        render()
      }),
    )
    root.querySelector('[data-act="next"]').addEventListener("click", () => {
      v = (v + 1) % 16
      render()
    })
    const hot = (s) => {
      svg.querySelectorAll(".lg-segment").forEach((g) => g.classList.toggle("is-hot", g.dataset.s === s))
      root.querySelectorAll(".lg-seglist li").forEach((li) => li.classList.toggle("is-hot", li.dataset.s === s))
    }
    root.querySelector(".lg-split-seg").addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-s]")
      hot(t ? t.dataset.s : null)
    })
    root.querySelector(".lg-split-seg").addEventListener("mouseleave", () => hot(null))
    render()
  }

  // ---------- Wire up every diagram on the page ----------

  const VIEWS = {
    gates: buildGates,
    timing: buildTiming,
    kmap: buildKmap,
    number: buildNumber,
    waveform: buildWave,
    cmos: buildCmos,
    mosfamily: buildMosFamily,
    mosfet: buildMosfet,
    adder: buildAdder,
    mux: buildMux,
    sevenseg: buildSevenSeg,
  }
  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-logic:not([data-ready])").forEach((root) => {
      const build = VIEWS[root.dataset.view]
      if (!build) return
      root.dataset.ready = "true"
      try {
        build(root)
      } catch (err) {
        console.error("melon-logic", root.dataset.view, err)
      }
    })
  })
})()
`

export default (() => MelonLogic) satisfies QuartzComponentConstructor
