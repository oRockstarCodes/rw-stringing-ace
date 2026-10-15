import { QuartzComponent, QuartzComponentConstructor } from "../types"

// Copied into quartz/components/custom/ at build time by scripts/build-wiki.sh.
// Interactive op amp diagrams. A note asks for one with an empty div:
//
//   <div class="melon-opamp" data-view="pins"></div>
//     The op amp symbol. Pick a terminal to see what it does, and drive the inputs,
//     the gain, and the supply with sliders to see the output (and when it saturates).
//
//   <div class="melon-opamp" data-view="model"></div>
//     The equivalent model (R_i, A·v_d, R_o). Pick a part to see what it does, and
//     switch to the ideal op amp to see what each part becomes.
//
// The script below fills them in on every page load (the text inside the div is only
// a fallback for Obsidian and link previews). Styles are in wiki/custom.scss.

const MelonOpAmp: QuartzComponent = () => null

MelonOpAmp.afterDOMLoaded = `
(() => {
  // "v" + subscript, as SVG text (dy shifts down, then back up)
  const sub = (base, s) => base + '<tspan class="oa-sub" dy="4">' + s + '</tspan><tspan dy="-4">&#8203;</tspan>'
  const minus = (s) => String(s).replace(/-/g, "\\u2212")
  const SUP = { "-": "\\u207b", 0: "\\u2070", 1: "\\u00b9", 2: "\\u00b2", 3: "\\u00b3", 4: "\\u2074", 5: "\\u2075", 6: "\\u2076", 7: "\\u2077", 8: "\\u2078", 9: "\\u2079" }
  const pow10 = (e) => "10" + String(e).split("").map((c) => SUP[c]).join("")

  // A voltage for display: plain below 10 kV, scientific above
  const volts = (x) => {
    if (Math.abs(x) < 1e-9) return "0 V"
    if (Math.abs(x) < 1e4) return minus(x.toFixed(2)) + " V"
    const e = Math.floor(Math.log10(Math.abs(x)))
    return minus((x / 10 ** e).toFixed(1)) + " \\u00d7 " + pow10(e) + " V"
  }
  const gainText = (a) => (a < 1e4 ? a.toLocaleString("en-US") : pow10(Math.round(Math.log10(a))))

  // Wires up the parts (in the SVG and the chip row) and the info panel.
  // info() returns { key: [title, text] }, so it can change (the model's ideal toggle).
  function selectable(root, info, idle) {
    const parts = root.querySelectorAll("[data-part]")
    const title = root.querySelector(".oa-info-title")
    const text = root.querySelector(".oa-info-text")
    let pinned = null
    let shown = null
    const show = (key) => {
      shown = key
      parts.forEach((p) => {
        p.classList.toggle("is-active", p.dataset.part === key)
        p.classList.toggle("is-pinned", p.dataset.part === pinned)
        if (p.tagName === "BUTTON") p.setAttribute("aria-pressed", String(p.dataset.part === pinned))
      })
      const d = key && info()[key]
      title.innerHTML = d ? d[0] : idle[0]
      text.innerHTML = d ? d[1] : idle[1]
    }
    parts.forEach((p) => {
      const key = p.dataset.part
      p.addEventListener("mouseenter", () => show(key))
      p.addEventListener("mouseleave", () => show(pinned))
      p.addEventListener("click", () => {
        pinned = pinned === key ? null : key
        show(pinned)
      })
    })
    show(null)
    return () => show(shown)
  }

  const chips = (list) =>
    '<div class="oa-chips">' +
    list.map(([key, label]) => '<button type="button" class="oa-chip" data-part="' + key + '" aria-pressed="false">' + label + "</button>").join("") +
    "</div>"

  const infoPanel = '<div class="oa-info" aria-live="polite"><div class="oa-info-title"></div><div class="oa-info-text"></div></div>'

  // ---------- The symbol and its terminals ----------

  function buildPins(root) {
    root.innerHTML =
      '<svg class="oa-svg" viewBox="0 0 520 262" role="img" aria-label="Op amp symbol with its five terminals">' +
      // The triangle is the gain stage. Drawn first so the terminals sit on top of it.
      '<g class="oa-part" data-part="body">' +
      '<polygon class="oa-hit-area" points="180,40 180,220 360,130"/>' +
      '<polygon class="oa-line" points="180,40 180,220 360,130"/>' +
      '<text class="oa-sign" x="198" y="100">\\u2212</text><text class="oa-sign" x="198" y="170">+</text>' +
      '<text class="oa-big" x="246" y="138" text-anchor="middle">A</text>' +
      "</g>" +
      '<g class="oa-part" data-part="vminus">' +
      '<line class="oa-hit" x1="62" y1="95" x2="180" y2="95"/><line class="oa-line" x1="70" y1="95" x2="180" y2="95"/>' +
      '<circle class="oa-term" cx="70" cy="95" r="5"/>' +
      '<text class="oa-label" x="56" y="100" text-anchor="end">' + sub("v", "\\u2212") + "</text>" +
      '<text class="oa-val" x="125" y="85" text-anchor="middle" data-val="vm"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="vplus">' +
      '<line class="oa-hit" x1="62" y1="165" x2="180" y2="165"/><line class="oa-line" x1="70" y1="165" x2="180" y2="165"/>' +
      '<circle class="oa-term" cx="70" cy="165" r="5"/>' +
      '<text class="oa-label" x="56" y="170" text-anchor="end">' + sub("v", "+") + "</text>" +
      '<text class="oa-val" x="125" y="184" text-anchor="middle" data-val="vp"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="vccp">' +
      '<line class="oa-hit" x1="260" y1="20" x2="260" y2="78"/><line class="oa-line" x1="260" y1="28" x2="260" y2="80"/>' +
      '<circle class="oa-term" cx="260" cy="28" r="5"/>' +
      '<text class="oa-label" x="272" y="33">' + sub("V", "CC+") + "</text>" +
      '<text class="oa-val" x="272" y="52" data-val="vccp"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="vccm">' +
      '<line class="oa-hit" x1="260" y1="182" x2="260" y2="240"/><line class="oa-line" x1="260" y1="180" x2="260" y2="232"/>' +
      '<circle class="oa-term" cx="260" cy="232" r="5"/>' +
      '<text class="oa-label" x="272" y="237">' + sub("V", "CC\\u2212") + "</text>" +
      '<text class="oa-val" x="272" y="218" data-val="vccm"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="out">' +
      '<line class="oa-hit" x1="360" y1="130" x2="468" y2="130"/><line class="oa-line" x1="360" y1="130" x2="460" y2="130"/>' +
      '<circle class="oa-term" cx="460" cy="130" r="5"/>' +
      '<text class="oa-label" x="472" y="135">' + sub("v", "o") + "</text>" +
      '<text class="oa-val" x="410" y="120" text-anchor="middle" data-val="vo"></text>' +
      "</g>" +
      "</svg>" +
      chips([
        ["vminus", "v<sub>\\u2212</sub>"],
        ["vplus", "v<sub>+</sub>"],
        ["vccp", "V<sub>CC+</sub>"],
        ["vccm", "V<sub>CC\\u2212</sub>"],
        ["out", "v<sub>o</sub>"],
        ["body", "Gain A"],
      ]) +
      infoPanel +
      '<div class="oa-controls">' +
      '<label><span>v<sub>+</sub></span><input type="range" data-k="vp" min="-5" max="5" step="0.01" value="0.5"><output></output></label>' +
      '<label><span>v<sub>\\u2212</sub></span><input type="range" data-k="vm" min="-5" max="5" step="0.01" value="0.2"><output></output></label>' +
      '<label><span>A</span><input type="range" data-k="a" min="0" max="5" step="1" value="1"><output></output></label>' +
      '<label><span>Supply</span><input type="range" data-k="vcc" min="3" max="18" step="1" value="15"><output></output></label>' +
      "</div>" +
      '<p class="oa-readout"></p>'

    const input = (k) => root.querySelector('input[data-k="' + k + '"]')
    const val = (k) => root.querySelector('[data-val="' + k + '"]')
    const state = {}

    const info = () => ({
      vminus: [
        "Inverting input, v<sub>\\u2212</sub>",
        "Whatever is here is <strong>subtracted</strong>: raising v<sub>\\u2212</sub> pushes v<sub>o</sub> down. Negative feedback connects here. Now at " + volts(state.vm) + ".",
      ],
      vplus: [
        "Non-inverting input, v<sub>+</sub>",
        "Whatever is here is <strong>added</strong>: raising v<sub>+</sub> pushes v<sub>o</sub> up. Now at " + volts(state.vp) + ".",
      ],
      vccp: [
        "Positive supply, V<sub>CC+</sub>",
        "Powers the op amp and sets the <strong>upper limit</strong> of v<sub>o</sub>. Usually left off schematics, but always there." +
          (state.sat > 0 ? " The output is stuck at this rail right now." : ""),
      ],
      vccm: [
        "Negative supply, V<sub>CC\\u2212</sub>",
        "Powers the op amp and sets the <strong>lower limit</strong> of v<sub>o</sub>. Usually left off schematics, but always there." +
          (state.sat < 0 ? " The output is stuck at this rail right now." : ""),
      ],
      out: [
        "Output, v<sub>o</sub>",
        "The amplified difference A(v<sub>+</sub> \\u2212 v<sub>\\u2212</sub>), clipped between the supply rails. Now at " + volts(state.vo) + ".",
      ],
      body: [
        "Gain stage, A",
        "Multiplies the difference between the inputs by the open-loop gain A. A real op amp has A around 10\\u2075 or more, so it saturates unless the inputs are almost equal.",
      ],
    })
    const refresh = selectable(root, info, ["Pick a part", "Hover or tap a terminal (or a button above) to see what it does."])

    const update = () => {
      state.vp = +input("vp").value
      state.vm = +input("vm").value
      state.a = 10 ** +input("a").value
      state.vcc = +input("vcc").value
      const raw = state.a * (state.vp - state.vm)
      state.vo = Math.max(-state.vcc, Math.min(state.vcc, raw))
      state.sat = raw > state.vcc ? 1 : raw < -state.vcc ? -1 : 0

      input("vp").nextElementSibling.textContent = volts(state.vp)
      input("vm").nextElementSibling.textContent = volts(state.vm)
      input("a").nextElementSibling.textContent = gainText(state.a)
      input("vcc").nextElementSibling.textContent = "\\u00b1" + state.vcc + " V"
      val("vp").textContent = volts(state.vp)
      val("vm").textContent = volts(state.vm)
      val("vccp").textContent = "+" + state.vcc + " V"
      val("vccm").textContent = "\\u2212" + state.vcc + " V"
      val("vo").textContent = volts(state.vo)
      root.querySelector('[data-part="vccp"]').classList.toggle("is-rail", state.sat > 0)
      root.querySelector('[data-part="vccm"]').classList.toggle("is-rail", state.sat < 0)
      root.querySelector('[data-part="out"]').classList.toggle("is-rail", state.sat !== 0)

      // The input difference that still keeps the output off the rails
      const range = state.vcc / state.a
      const rangeText = range >= 1 ? minus(+range.toPrecision(3)) + " V" : +(range * 1000).toPrecision(3) + " mV"
      root.querySelector(".oa-readout").innerHTML =
        "v<sub>o</sub> = A(v<sub>+</sub> \\u2212 v<sub>\\u2212</sub>) = " + gainText(state.a) + " \\u00d7 (" +
        minus(state.vp.toFixed(2)) + " \\u2212 " + (state.vm < 0 ? "(" + minus(state.vm.toFixed(2)) + ")" : state.vm.toFixed(2)) +
        ") = " + volts(state.a * (state.vp - state.vm)) +
        (state.sat
          ? ' <span class="oa-flag">saturated at ' + (state.sat > 0 ? "+" : "\\u2212") + state.vcc + " V</span>"
          : "") +
        '<br><span class="oa-note">Stays off the rails only while |v<sub>+</sub> \\u2212 v<sub>\\u2212</sub>| &lt; V<sub>CC</sub>/A = ' + rangeText + ".</span>"
      refresh()
    }
    root.querySelectorAll("input").forEach((i) => i.addEventListener("input", update))
    update()
  }

  // ---------- The equivalent model ----------

  function buildModel(root) {
    root.innerHTML =
      '<div class="oa-toolbar">' +
      '<span class="oa-switch-label" aria-hidden="true">Op amp model</span>' +
      '<div class="oa-switch" role="radiogroup" aria-label="Op amp model">' +
      '<span class="oa-switch-thumb" aria-hidden="true"></span>' +
      '<button type="button" role="radio" class="oa-switch-opt" data-mode="real" aria-checked="true">Real</button>' +
      '<button type="button" role="radio" class="oa-switch-opt" data-mode="ideal" aria-checked="false">Ideal</button>' +
      "</div></div>" +
      '<svg class="oa-svg" viewBox="0 0 520 250" role="img" aria-label="Op amp equivalent model: input resistance, dependent source, output resistance">' +
      '<rect class="oa-box" x="90" y="28" width="330" height="208" rx="12"/>' +
      '<text class="oa-caption" x="102" y="46">inside the op amp</text>' +
      '<g class="oa-part" data-part="vminus">' +
      '<line class="oa-hit" x1="42" y1="70" x2="150" y2="70"/><polyline class="oa-line" points="50,70 150,70 150,95"/>' +
      '<circle class="oa-term" cx="50" cy="70" r="5"/>' +
      '<text class="oa-label" x="38" y="75" text-anchor="end">' + sub("v", "\\u2212") + "</text>" +
      "</g>" +
      '<g class="oa-part" data-part="vplus">' +
      '<line class="oa-hit" x1="42" y1="200" x2="150" y2="200"/><polyline class="oa-line" points="50,200 150,200 150,170"/>' +
      '<circle class="oa-term" cx="50" cy="200" r="5"/>' +
      '<text class="oa-label" x="38" y="205" text-anchor="end">' + sub("v", "+") + "</text>" +
      "</g>" +
      '<g class="oa-part" data-part="vd">' +
      '<rect class="oa-hit-area" x="100" y="92" width="40" height="84"/>' +
      '<text class="oa-sign" x="128" y="108" text-anchor="middle">\\u2212</text>' +
      '<text class="oa-sign" x="128" y="172" text-anchor="middle">+</text>' +
      '<text class="oa-label" x="128" y="140" text-anchor="end">' + sub("v", "d") + "</text>" +
      "</g>" +
      '<g class="oa-part" data-part="ri">' +
      '<rect class="oa-hit-area" x="138" y="92" width="72" height="80"/>' +
      '<polyline class="oa-line oa-real" points="150,95 150,100 158,104 142,112 158,120 142,128 158,136 142,144 158,152 142,160 150,164 150,170"/>' +
      '<line class="oa-line oa-ideal-only oa-open" x1="150" y1="95" x2="150" y2="118"/><line class="oa-line oa-ideal-only oa-open" x1="150" y1="148" x2="150" y2="170"/>' +
      '<text class="oa-label" x="168" y="128">' + sub("R", "i") + "</text>" +
      '<text class="oa-val" x="168" y="148" data-val="ri"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="src">' +
      '<rect class="oa-hit-area" x="270" y="112" width="110" height="66"/>' +
      '<polygon class="oa-line" points="300,121 324,145 300,169 276,145"/>' +
      '<text class="oa-sign oa-small" x="300" y="141" text-anchor="middle">+</text>' +
      '<text class="oa-sign oa-small" x="300" y="162" text-anchor="middle">\\u2212</text>' +
      '<text class="oa-label" x="334" y="150" data-val="src"></text>' +
      '<polyline class="oa-line" points="300,169 300,205"/>' +
      '<line class="oa-line" x1="286" y1="205" x2="314" y2="205"/><line class="oa-line" x1="291" y1="211" x2="309" y2="211"/><line class="oa-line" x1="297" y1="217" x2="303" y2="217"/>' +
      "</g>" +
      '<g class="oa-part" data-part="ro">' +
      '<rect class="oa-hit-area" x="290" y="40" width="112" height="80"/>' +
      '<polyline class="oa-line" points="300,121 300,70 330,70"/>' +
      '<polyline class="oa-line oa-real" points="330,70 334,62 342,78 350,62 358,78 366,62 374,78 382,62 386,70 390,70"/>' +
      '<line class="oa-line oa-ideal-only" x1="330" y1="70" x2="390" y2="70"/>' +
      '<line class="oa-line" x1="390" y1="70" x2="420" y2="70"/>' +
      '<text class="oa-label" x="360" y="50" text-anchor="middle">' + sub("R", "o") + "</text>" +
      '<text class="oa-val" x="360" y="98" text-anchor="middle" data-val="ro"></text>' +
      "</g>" +
      '<g class="oa-part" data-part="out">' +
      '<line class="oa-hit" x1="420" y1="70" x2="478" y2="70"/><line class="oa-line" x1="420" y1="70" x2="470" y2="70"/>' +
      '<circle class="oa-term" cx="470" cy="70" r="5"/>' +
      '<text class="oa-label" x="482" y="75">' + sub("v", "o") + "</text>" +
      "</g>" +
      "</svg>" +
      chips([
        ["vd", "v<sub>d</sub>"],
        ["ri", "R<sub>i</sub>"],
        ["src", "A\\u00b7v<sub>d</sub>"],
        ["ro", "R<sub>o</sub>"],
        ["out", "v<sub>o</sub>"],
      ]) +
      infoPanel

    let ideal = false
    const info = () => ({
      vminus: ["Inverting input, v<sub>\\u2212</sub>", "In the model it's just the top end of R<sub>i</sub>."],
      vplus: ["Non-inverting input, v<sub>+</sub>", "In the model it's just the bottom end of R<sub>i</sub>."],
      vd: [
        "Differential input, v<sub>d</sub> = v<sub>+</sub> \\u2212 v<sub>\\u2212</sub>",
        "The voltage across R<sub>i</sub>. It's the only thing the op amp responds to: the source inside multiplies it by A." +
          (ideal ? " Ideal: with negative feedback it's driven to 0, so v<sub>+</sub> = v<sub>\\u2212</sub> (the virtual short)." : ""),
      ],
      ri: ideal
        ? ["Input resistance, R<sub>i</sub> \\u2192 \\u221e", "An open circuit, so <strong>no current enters the inputs</strong>: i<sub>+</sub> = i<sub>\\u2212</sub> = 0. This is ideal rule 1."]
        : ["Input resistance, R<sub>i</sub>", "Sits between the two inputs, so whatever small current enters one input leaves through the other. Typical: 10\\u2076 to 10\\u00b9\\u00b3 \\u03a9."],
      src: ideal
        ? ["Gain, A \\u2192 \\u221e", "For v<sub>o</sub> to stay finite, v<sub>d</sub> must be (almost) 0. With negative feedback that gives <strong>v<sub>+</sub> = v<sub>\\u2212</sub></strong>, ideal rule 2."]
        : ["Dependent source, A\\u00b7v<sub>d</sub>", "A voltage-controlled voltage source: the gain stage. A is the open-loop gain, typically 10\\u2075 to 10\\u2078."],
      ro: ideal
        ? ["Output resistance, R<sub>o</sub> \\u2192 0", "Just a wire, so the output is an ideal voltage source: v<sub>o</sub> doesn't change with the load."]
        : ["Output resistance, R<sub>o</sub>", "In series with the source, so v<sub>o</sub> drops a little when the output supplies current. Typical: 10 to 100 \\u03a9."],
      out: [
        "Output, v<sub>o</sub>",
        "With no load, no current flows through R<sub>o</sub>, so v<sub>o</sub> = A\\u00b7v<sub>d</sub>. It's still limited by the supply rails (not drawn in the model).",
      ],
    })
    const refresh = selectable(root, info, ["Pick a part", "Hover or tap a part of the model (or a button above) to see what it does."])

    // Real | Ideal switch: both options always visible, the thumb slides to the active one
    const opts = Array.from(root.querySelectorAll(".oa-switch-opt"))
    const apply = () => {
      root.classList.toggle("is-ideal", ideal)
      opts.forEach((o) => {
        const on = (o.dataset.mode === "ideal") === ideal
        o.setAttribute("aria-checked", String(on))
        o.tabIndex = on ? 0 : -1
      })
      root.querySelector('[data-val="ri"]').textContent = ideal ? "\\u221e (open)" : "10\\u2076\\u201310\\u00b9\\u00b3 \\u03a9"
      root.querySelector('[data-val="ro"]').textContent = ideal ? "0 (wire)" : "10\\u2013100 \\u03a9"
      root.querySelector('[data-val="src"]').innerHTML = (ideal ? "A \\u2192 \\u221e" : "A\\u00b7") + (ideal ? "" : sub("v", "d"))
      refresh()
    }
    opts.forEach((o) =>
      o.addEventListener("click", () => {
        ideal = o.dataset.mode === "ideal"
        apply()
      }),
    )
    // Arrow keys move between the two options, like any radio group
    root.querySelector(".oa-switch").addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return
      e.preventDefault()
      ideal = e.key === "ArrowRight" || e.key === "ArrowDown"
      apply()
      opts[ideal ? 1 : 0].focus()
    })
    apply()
  }

  document.addEventListener("nav", () => {
    document.querySelectorAll(".melon-opamp:not([data-ready])").forEach((root) => {
      root.dataset.ready = "true"
      if (root.dataset.view === "model") buildModel(root)
      else buildPins(root)
    })
  })
})()
`

export default (() => MelonOpAmp) satisfies QuartzComponentConstructor
