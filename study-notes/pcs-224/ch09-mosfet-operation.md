# PCS 224 Ch 9: MOSFET Operation — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/pcs-224/ch09-mosfet-operation.md` and anything missing (alternate explanations, extra intuition) gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

---

## Concept 1: The substrate (body) — 🟡 in progress

Came up while writing the Theory section of the PCS224 MOSFET lab report (2026-11-19).

### Rocky's questions
- "what is a substrate"
- "so the gate sits ontop os the silicon" → Almost. The gate sits on the **oxide**, and the oxide sits on the silicon. The gate never touches the silicon. Stack from top down: metal gate → SiO₂ → p-type substrate, i.e. Metal-Oxide-Semiconductor, which is literally where "MOS" comes from. (Rocky clarified he meant the silicon dioxide, so he had the stack right: gate on SiO₂.) The oxide is what makes it a capacitor: the gate pushes and pulls charges in the silicon with its electric field, but no current flows from gate into the silicon (that's why the gate draws ~0 current and why dac_vgs needed no op-amp buffer in the lab).

### Explanation given
- The substrate is the **base slab of silicon the whole transistor is built in**. Everything else is added to it: the source and drain are doped pockets dug into its top surface, and the oxide and gate sit on top of it.
- In an **n-channel** MOSFET (2N7000, ZVN2106), the substrate is **p-type**. The source and drain are **n⁺** pockets.
- The **channel isn't a separate part**. It's a thin layer at the top surface of the substrate, just under the gate, which flips from p-type to n-type (inversion) when V_GS > V_T.
- Why p-type: each n⁺ pocket forms a pn junction with the substrate, giving two back-to-back junctions. With no channel, one junction is always reverse biased, so no current flows. That's the "off" state.
- The substrate is also called the **body** (terminal B). In the 2N7000 the body is tied to the source inside the package. That's why it has only 3 pins, and why the schematic shows a diode between drain and source (the body diode).

Picture:

```
         S          G          D
         |      ┌────────┐     |
         |      │  gate  │     |
         |   ═══╧════════╧═══  |   ← SiO₂ oxide
   ┌───[ n⁺ ]~~~~~~~~~~~~~~[ n⁺ ]───┐
   │          ↑ channel forms here  │
   │            (top surface only)  │
   │        p-type substrate        │
   │             (body)             │
   └───────────────┬────────────────┘
                   B  (tied to S inside the 2N7000)
```

### Check question
2N7000 with V_GS = 0 V and V_DS = 5 V. Electrons could try to go source → substrate → drain. Why doesn't any current flow?

**Rocky's answer:** *(pending)*

---

## Concept 2: Gate voltage and the MOS capacitor (accumulation / depletion / inversion) — 🟡 in progress

### Rocky's questions
- "so when a negative voltage is applies to the gate, the holes in the substrate are attracted to the silicon dioxide or the gate?"

### Explanation given
- The holes are attracted **toward the gate** (opposite charges attract), but they **can't get through the oxide**, because it's an insulator. So they pile up in the silicon, right at the silicon/oxide interface, as close to the gate as they can get.
- Capacitor picture: the gate is one plate (holding the negative charge), the oxide is the gap between the plates, and the top layer of silicon is the other plate (holding the attracted holes). Equal and opposite charge sits on each side of the oxide.
- This is **accumulation**: the surface becomes *more* p-type than the rest of the substrate. Still no n-channel, so the MOSFET stays off.

```
   gate (metal)    − − − − − − − −     ← negative charge on the gate
   SiO₂            ═══════════════     ← nothing crosses this
   Si surface      + + + + + + + +     ← holes piled up here (accumulation)
   p-substrate     +   +   +   +
```

- "what does this sentence mean: As the gate voltage increases further, the energy bands near the surface bend so much that the intrinsic level drops below the Fermi level, and the electrons (the minority carriers) start to outnumber the holes near the interface." (sentence from the MOSFET report Theory section)

### Explanation given (inversion, band picture)
Broke the sentence into three pieces:
1. **Two reference lines.** E_F (Fermi level) = how "full" of electrons the material is, the water level. In equilibrium it is **flat**, the same everywhere. E_i (intrinsic level) = the middle of the gap, the point where n = p. Which one is higher tells you the type:
   - E_F below E_i → more holes → p-type
   - E_F above E_i → more electrons → n-type
   - n = n_i·e^((E_F − E_i)/kT), p = n_i·e^((E_i − E_F)/kT)
2. **"Bands bend."** A positive gate lowers the energy of electrons near the surface, so E_c, E_i and E_v all slide **down** near the oxide. Deep in the substrate nothing changes. E_F stays flat. So only the surface bands move relative to E_F.
3. **"E_i drops below E_F."** Push hard enough and, at the surface only, E_i ends up under E_F. By the rule in step 1 that thin surface layer is now n-type: electrons (normally the minority in p-type) outnumber holes. That's **inversion**, and that thin n-layer is the channel. Strong inversion (E_i as far below E_F at the surface as it is above E_F in the bulk, φ_s = 2φ_F) is what defines V_T.

```
  deep in substrate          at the surface (big +V_G)
  (still p-type)             (inverted → n-type)

  E_c ───────                E_c ───────
                             E_F ═══════   ← E_F now ABOVE E_i
  E_i ·······                E_i ·······
  E_F ═══════  ← below E_i
  E_v ───────                E_v ───────
```
(Picture is relative: really E_F is flat and the surface bands slid down past it.)

- "so the surface means near the gate?" → Yes. "Surface" = the top few nanometres of the silicon, right against the SiO₂, directly under the gate. Also called "the interface" (oxide–silicon interface). It's the part of the silicon closest to the gate, so it feels the gate's field the most; the effect fades with depth. That's why band bending, accumulation, depletion and inversion all happen there and the channel is only a thin sheet, not the whole substrate.

- "whats the interferance" → (word is **interface**, not interference; interference is the wave thing.) Interface = the boundary where two materials meet. Here: the plane where the SiO₂ ends and the silicon begins. "At the interface" / "near the surface" both mean the thin slice of silicon touching the oxide.

### Check question
Flip it: put a small **positive** voltage on the gate. What happens to the holes at the surface, and what's left behind there?

**Rocky's answer:** *(pending)*

Second check (bands): at the surface, the gate voltage is exactly big enough that E_i sits right on E_F. What can you say about n vs p there?

**Rocky's answer:** *(pending)*

---

## Concept 3: Why the real I_D vs V_GS curve is straighter than the square law — 🟡 in progress

### Rocky's questions
- "what doe sthis sentence mean: In a real MOSFET at higher currents, the electron mobility drops and the resistance at the source adds a voltage drop, so the curve straightens into a nearly linear section." (sentence from the MOSFET report Theory section)

### Explanation given
- **Ideal:** I_D = K_n(V_GS − V_T)² is a parabola. Its slope (g_fs) keeps getting steeper. Example with K_n = 0.1 A/V², V_T = 2.3 V: V_GS = 3.3 → 100 mA, 4.3 → 400 mA, 5.3 → 900 mA. Each extra volt adds more than the last (+300 mA, then +500 mA).
- **Real:** two effects get stronger as the current grows and hold the current back, so the parabola stops curving up and looks like a straight line:
  1. **Mobility drops.** A bigger V_GS means a stronger field pulling electrons up against the oxide. They scatter off the rough interface and move slower, so μ_n falls. K_n = Wμ_nC_ox/2L contains μ_n, so the "gain" shrinks just when the parabola wants to speed up.
  2. **Source resistance.** The n⁺ source region, contacts and leads have a small resistance R_S. Drain current flows through it, dropping I_D·R_S. The gate is measured against the source pin, but the channel only "feels" V_GS − I_D·R_S. More current → more lost → the effective gate voltage grows more slowly.
- Net effect: equal steps in V_GS give roughly equal steps in I_D, so the curve is nearly linear. That's why the lab's Figure 2 looked straight and gave a single slope (340 mS) for g_fs.

### Check question (Concept 3)
If the source resistance R_S were bigger, would the measured slope of the straight section (g_fs) be bigger or smaller? Why?

**Rocky's answer:** *(pending)*

---

## Concept 4: Why Figure 2 (lab) flattens above V_GS = 4.57 V — 🟡 in progress

### Rocky's questions
- Asked to explain: "Above VGS = 4.57 V, the curve in Figure 2 flattened at about 800 mA. This is not saturation of the channel. Figure 1 shows the 5 V curve only reached a VDS of about 2.9 V at a similar current, so the circuit was most likely unable to hold VDS at 5 V at these currents. The MOSFET is then pushed into its non-saturation region, and the current becomes limited by the supply circuit instead of the gate voltage. Therefore, this section of the curve does not reflect the transconductance of the MOSFET." (from the lab report Discussion)

### Explanation given
1. **What Figure 2 should show.** V_DS held at 5 V, V_GS swept. In saturation I_D = K_n(V_GS − V_T)², so I_D should keep rising as V_GS rises. A flat top is suspicious.
2. **"Not saturation."** The word trips people up. MOSFET saturation means I_D stops changing with **V_DS**. It still grows with **V_GS**. So flattening against V_GS isn't the channel saturating.
3. **Evidence from Figure 1.** The V_GS = 5 V curve stops at V_DS ≈ 2.9 V when the current reaches about 750 mA. The code asked for higher V_DS, but the supply chain (DAC → op-amp → TIP41C BJT → INA219 → MOSFET) loses more voltage as current rises (the BJT's base-emitter drop, the op-amp output not reaching its 5 V rail, the sensor). So in Figure 2 at about 800 mA, the real V_DS was probably about 3 V, not the 5 V the code asked for.
4. **Why that causes "non-saturation."** Saturation needs V_DS ≥ V_GS − V_T. At V_GS = 4.8 V, V_GS − V_T = 2.5 V. With V_DS sagging to about 3 V or less, the MOSFET is at or past the edge, into the non-saturation (ohmic) region. There, the current depends on V_DS as well.
5. **Who limits the current.** Raising V_GS opens the channel wider (lower resistance), but the circuit can't push any more voltage or current through it. Analogy: opening a tap wider doesn't help when the pump is already maxed out.
6. **Why this matters for g_fs.** g_fs = ∂I_D/∂V_GS *with V_DS held constant*. V_DS wasn't constant in that region, so the slope there isn't g_fs. Only the straight section below 4.57 V should be used for the fit.

### Check question
In Figure 2 at V_GS = 3 V the current is only about 130 mA. Was V_DS probably close to the 5 V the code asked for there? Why does that make the low-current part of the curve trustworthy for g_fs?

**Rocky's answer:** *(pending)*

---

### Concept 3 follow-up (2026-11-19)
- Asked to explain: "The resistance of the source region and leads also drops a voltage of I_D·R_S, so the channel only experiences V_GS − I_D·R_S. Heating of the transistor at high currents has a similar effect. All three effects grow with the drain current and straighten the curve, which is why a single slope could be fitted to the linear section of Figure 2. The two graphs are also consistent with each other…" (lab report Discussion)
- Explained:
  - **Source resistance.** V_GS is set between the gate *pin* and the source *pin*, but the drain current has to pass through some resistance (n⁺ source region, bond wire, leg) before it reaches the pin. That loses I_D·R_S volts, so the channel only feels V_GS − I_D·R_S. Made-up R_S = 0.5 Ω: at 100 mA it loses 0.05 V (barely matters); at 800 mA it loses 0.4 V (a lot). The loss grows with the current.
  - **Heating.** More current → more power (P = I_D·V_DS) → hotter → the lattice vibrates more → electrons scatter more → lower mobility → less current. Same idea as in the Hall lab report (heating lowered the measured mobility).
  - **"All three."** Mobility drop (from the previous sentence), source resistance and heating. All three hold the current back more as I_D grows, so the parabola's upward bend gets cancelled and the curve looks straight. That's why one slope fits.
  - **Consistency check.** Figure 2 at V_GS = 3 V and 4 V (V_DS = 5 V) should equal the flat saturation level of the 3 V and 4 V curves in Figure 1. Both give about 130 mA and 490 mA, so two separate measurements agree, which means the data is reliable.
- Check question: at which current would source resistance matter more, 50 mA or 700 mA? Answer pending.
- "do we find gfs in figure 2" → Yes. g_fs = ΔI_D/ΔV_GS with V_DS held constant, which is exactly what Figure 2 plots (V_GS swept, V_DS = 5 V). It's the slope of the straight section (about 2.7 V to 4.57 V): the fitted line 340x − 861 has slope 340 mA/V = 340 mS (1 mA/V = 1 mS). Not from Figure 1: there V_GS is fixed and V_DS changes, so the slope there is ΔI_D/ΔV_DS = 1/R_DS (how resistor-like the channel is), not g_fs. Ignore the flat part below V_T and the flat top above 4.57 V.

---

## Concept 5: Two ways to read V_T off Figure 2 (onset vs extrapolation) — 🟡 in progress

### Rocky's questions
- "what does this sentenc emean: The difference comes from the definition used, as the onset method picks up the first small current, while the extrapolated value ignores the gradual curve near threshold." (lab report Discussion)

### Explanation given
- There are two ways to read V_T off the I_D vs V_GS graph:
  - **Onset:** where the current first leaves zero, so V_T ≈ 2.3 V (used in Results).
  - **Extrapolation:** extend the fitted straight line (340x − 861) down to I_D = 0, so V_T = 861/340 ≈ 2.53 V.
- Near threshold the real curve doesn't switch on sharply. It bends up gradually (a "toe") from about 2.3 V and only becomes straight at about 2.7 V. The straight line skips that toe, so it hits zero to the right of where current actually starts.
- Neither number is wrong; they're two definitions. Datasheets pick one too: the ZVN2106 datasheet defines V_GS(th) as the voltage where I_D = 1 mA (with V_DS = V_GS), which is closer to the onset method.

### Check question
If the toe near threshold were much longer and more gradual, would the gap between the onset and extrapolated V_T get bigger or smaller?

**Rocky's answer:** *(pending)*
