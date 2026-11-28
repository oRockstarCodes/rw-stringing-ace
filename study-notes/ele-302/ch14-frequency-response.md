# ELE 302 Ch 14: Frequency Response — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/ele-302/ch14-frequency-response.md` and anything missing gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

Format reminder: short chunks, numbered steps, tables and diagrams.

## Concept plan (follows the wiki page)

1. Sine in, sine out: gain |H| and phase ∠H
2. Complex frequency s = σ + jω
3. Impedance in the s-domain (R, sL, 1/sC)
4. Transfer function H(s): zeros and poles, behaviour at ω → 0 and ω → ∞
5. Decibels
6. Bode plots: straight-line factors, standard form, the factor table, procedure
7. Resonance: series (ω₀, bandwidth, Q), parallel, tank circuit
8. Passive filters: low-pass, high-pass, band-pass, band-stop

---

**Chapter status (2026-11-27):** all concepts 1–8 ✅. Possible next: mixed practice set across Ch 14, commit, or back to Ch 12 (paused at Concept 1).

## Concept 8b: Band-pass and band-stop filters — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "One circuit, two outputs" example callout after the H_BP + H_BS tip (summary table, |H| formulas for BS and BP at any ω, this check as a quick example). Rocky said he's comfortable.

### Explanation given
- Band-pass = series RLC, output across R. DC: C blocks; ∞: L blocks; ω₀: L–C cancel → short → H = 1. H = (R/L)s/(s² + (R/L)s + 1/LC). Exactly the resonance curve: centre ω₀, passband ω₁..ω₂, B = R/L.
- Low Q → heavy damping → quadratic splits into two real poles far apart; factor with the quadratic formula, don't assume a double pole at ω₀ (wiki Ex 14.23, poles 0.1 and 19.9).
- Band-stop (notch) = same circuit, output across the L–C pair. DC and ∞: pair is open → H = 1; ω₀: pair is a short → H = 0. H = (s² + 1/LC)/(s² + (R/L)s + 1/LC); zeros at ±jω₀ on the axis.
- H_BP + H_BS = 1 (KVL). Same ω₀, B, Q; the stop band's edges are where the pair's |X| = R → |H| = 0.707.
- |H_BS| = |X|/√(R² + X²), X = ωL − 1/(ωC). Straight-line Bode of the notch is flat 0 dB (±40 asymptotes cancel), the notch only shows in exact values.

### Check question
Series R = 20 Ω, L = 10 mH, C = 1 µF. (1) ω₀, B, Q. (2) Band-pass: |H| at ω₀; exact ω₁, ω₂. (3) Band-stop: |H| at ω = 0, ω₀, ω₁, and at ω = 20 000. (4) At ω₀, H_BP + H_BS = ?
(Expected: (1) 10 000, 2000, 5. (2) 1; √(1000² + 10⁸) = 10 049.9 → 9049.9, 11 049.9. (3) 1, 0, 0.707; at 20 000: X = 200 − 50 = 150 → 150/√(400 + 22 500) ≈ 0.991. (4) 1 + 0 = 1.)
**Rocky (part 1):** 10 000, 2000, 5 ✓. Parts 2–4 pending.
**Rocky (part 2):** 1, 9049.9, 11 049.9 ✓. Parts 3–4 pending.
**Rocky (parts 3–4):** 1, 0, 0.707, 0.991; 1 ✓.
**Status:** all correct first try. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge (8b):* small: one-circuit/two-outputs summary table (output across R vs across L–C pair, values at DC/ω₀/∞), and that the band-stop |H| = |X|/√(R² + X²) works at any ω (page only has it inside Ex 14.24).

---

## Concept 8a: Low-pass and high-pass filters — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Low-pass or high-pass at a glance" tip after the high-pass formula (placement table, ω_c from |Z| = R with units check, R–L output across L, √2 corner, straight vs exact one decade out, phase via top − bottom angle). Rocky said he's comfortable.

### (log)

Concept 8 split into: 8a low-pass/high-pass, 8b band-pass/band-stop.

### Explanation given
- Filter types table by H(0), H(∞), special frequency (0.707 at cutoff for LP/HP; 1 at ω₀ BP; 0 at ω₀ BS). Real filters roll off; edge defined at −3 dB.
- Predict-first method: replace L/C with shorts/opens at DC and ∞, see what the output is connected to.
- RC low-pass (output across C): H = 1/(1 + sRC), ω_c = 1/RC (where |Z_C| = R). One simple pole: 0 dB then −20 dB/dec, −45° at ω_c, output lags.
- RL low-pass (L in series, output across R): H = 1/(1 + sL/R), ω_c = R/L.
- RC high-pass (output across R): H = sRC/(1 + sRC), same ω_c; zero at origin + pole; +20 dB/dec rising to 0 dB at ω_c, then flat; phase +90° → 0°, +45° at ω_c, output leads.
- Rule of thumb: element that's an open at DC in the series path → blocks low (HP); element that shorts the output at high ω → blocks high (LP).

### Check question
(1) RC low-pass R = 2 kΩ, C = 0.5 µF: ω_c, exact |H| and phase at ω_c, straight-line dB at 10ω_c. (2) R = 100 Ω, L = 0.05 H, L in series, output across R: LP or HP, ω_c. (3) Same R–L but output across L: LP or HP, H(s). (4) RC high-pass phase at ω_c, lead or lag?
(Expected: (1) 1000 rad/s, 0.707 at −45°, −20 dB. (2) LP, ω_c = 2000. (3) HP, H = (sL/R)/(1 + sL/R) = sL/(R + sL). (4) +45°, leads.)
**Rocky (part 1):** ω_c = 1k ✓; |H| at ω_c = −6.02 dB ✗ (should be 0.707 = −3.01 dB); −45° ✓; straight line at 10ω_c = −26.02 ✗ (should be −20 dB).
Explanation: **repeat of the Concept 6a slip** (|1 + j| taken as 2 instead of √2). |1 + j| = √(1² + 1²) = √2 → |H| = 0.707 → −3 dB. Also mixed exact with straight line: straight line is 0 dB at ω_c, −20 dB one decade later (no −3 or −6 added; the corner dip only lives near the corner). Exact at 10ω_c is 1/√101 ≈ −20.04 dB. Flag for review: this slip has now happened twice.
- Re-check given: (a) |1 + j| = ? (b) exact |H| at ω_c in number and dB (c) exact and straight-line at 10ω_c. (Expected: √2; 0.707, −3 dB; −20.04 exact / −20 straight.)
**Rocky:** √2; 0.707, −3 dB; −20.04, −20 ✓. Parts 2–4 pending.
**Rocky (part 2):** low-pass ✓; ω_c = 5 ✗ (should be R/L = 100/0.05 = 2000). 5 = R × L (multiplied instead of divided). Explanation: cutoff where |Z_L| = R → ω_c L = R → ω_c = R/L. Units check: Ω/H = 1/s ✓, Ω·H isn't a frequency. Compare RC: |Z_C| = R → 1/(ω_c C) = R → ω_c = 1/(RC).
**Rocky (part 3):** high-pass, sL/(R + sL) ✓. Part 4 pending.
- "How do you solve this?" (part 4, HP phase at ω_c) → Steps: (1) H = jωRC/(1 + jωRC); (2) at ω_c, ωRC = 1 → H = j/(1 + j); (3) angle of a fraction = angle(top) − angle(bottom): ∠j = 90°, ∠(1 + j) = 45° → 45°; (4) positive → output leads by 45°. Same via Bode phase sum: zero at origin +90°, pole −tan⁻¹(ω/ω_c) = −45° → +45°. Magnitude same way: |j|/|1 + j| = 1/√2. Compare LP: 1/(1 + j) → 0 − 45 = −45°, lags.
- Mini check: HP phase at 10ω_c and at ω_c/10. (Expected: 90 − tan⁻¹(10) = 90 − 84.3 = 5.7°; 90 − tan⁻¹(0.1) = 90 − 5.7 = 84.3°.)
**Rocky:** 5.7, 84.3 ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge (8a):* corner slip again (|1 + j| = √2 → −3 dB, not −6; straight line vs exact at 10ω_c: −20 vs −20.04, don't add the dip); ω_c = R/L comes from ω_cL = R (units check Ω/H = 1/s; slip R × L); HP phase at ω_c via j/(1 + j): 90° − 45° = +45°, angle of fraction = top − bottom; quick placement table (C in series path / L across output → HP; C across output / L in series → LP); output across L in RL → HP, sL/(R + sL).

---

## Concept 7d: Resonant design and the tank circuit — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: one-line design recipe tip at the start of Example 14.19 (B first, then ω₀, then check Q). Rest of 7d already well covered on the page. Rocky said he's comfortable.

### (log)

### Explanation given
- Design: start with the B formula (series B = R/L → L = R/B; parallel B = 1/(RC) → C = 1/(RB)), then C or L from ω₀² = 1/(LC); check Q = ω₀/B. Series needs small R, parallel big R, for the same Q.
- Tank (real coil = R in series with L, in parallel with C): not plain parallel RLC, so 1/√(LC) doesn't apply. Add admittances: Y = jωC + (R − jωL)/(R² + ω²L²). Set Im = 0 → R² + ω²L² = L/C → ω₀ = √(1/LC − R²/L²). Z at ω₀ = L/(RC). R → 0 gives back 1/√(LC); negative under the root → no resonance.
- Worked wiki Ex 14.19 (series L = 0.2 H, C = 5 µF; parallel C = 2 µF, L = 0.5 H) and Ex 14.20 (100 Ω, 20 mH, 1 µF → 5000 rad/s vs 7071, Z = 200 Ω).

### Check question
(1) Design series RLC: ω₀ = 2000, B = 100, R = 5 Ω → L, C, Q. (2) Parallel version with R = 20 kΩ → C, L. (3) Tank: coil 50 Ω + 10 mH, in parallel with 2 µF → ω₀ (vs ideal 1/√LC) and Z at ω₀.
(Expected: (1) L = 0.05 H, C = 5 µF, Q = 20. (2) C = 0.5 µF, L = 0.5 H. (3) 1/LC = 5×10⁷, R²/L² = 2.5×10⁷ → ω₀ = 5000 (ideal 7071); Z = L/(RC) = 100 Ω.)
- Rocky asked whether there's a concept after this → Concept 8 (passive filters), then Key formulas / Solving the problems; offered a mixed practice set after.
**Rocky (part 1):** 0.05 H, 5 µF, Q = 20 ✓. Parts 2–3 pending.
**Rocky (part 2):** 0.5 µF, 0.5 H ✓. Part 3 pending.
**Rocky (part 3):** 5000, 7071 ideal, 100 Ω ✓.
**Status:** all correct first try. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge (7d):* none substantial beyond the page (design recipe and tank derivation already there); maybe a one-line "start with the B formula" recipe and the R → 0 / negative-root sanity checks are already in the note. Plan: add a short design-recipe line only.

---

## Concept 7c: Parallel resonance — ✅ merged into wiki
Merged into `ch14-frequency-response.md` after the series/parallel table: "Why series B has only L and parallel B has only C" tip (rate-of-change argument, C moves peak not width) and "Finding branch currents in parallel" warning (don't add magnitudes, current divider orientation, V-first/KCL method, Q·I_s only at ω₀, red flag). Rocky said he's comfortable.

### (log)

### Explanation given
- Parallel RLC driven by a current source = dual of series. Add admittances: Y = 1/R + j(ωC − 1/(ωL)). Same ω₀ = 1/√(LC).
- At ω₀: I_L and I_C equal and opposite, circulating between L and C; L–C pair looks like an open; |Z| max = R; V max = I·R; all source current through R.
- Branch currents I_L = I_C = Q·I (current magnification; dual of V_L = Q·V).
- B = 1/(RC), Q = R/(ω₀L) = ω₀RC = ω₀/B; ω₁,₂ = ∓1/(2RC) + √((1/2RC)² + 1/LC).
- R upside down: series R carries the circulating current (bigger R burns more → lower Q); parallel R sits beside the loop and only leaks (bigger R leaks less → higher Q).
- Series vs parallel table. Worked wiki Ex 14.17 (8 kΩ, 0.2 mH, 8 µF, 1.25 mA): ω₀ = 25k, Q = 1600, B = 15.6, V = 10 V, I_L = 2 A.

### Check question
Parallel: R = 1 kΩ, L = 10 mH, C = 1 µF, current source 2 mA peak. (1) ω₀, Q, B. (2) V at ω₀. (3) |I_L|, |I_C| at ω₀; how many times the source? (4) Double R to 2 kΩ: new Q and B, narrower or wider?
(Expected: (1) 10 000, Q = 1000/100 = 10, B = 1/(10³·10⁻⁶) = 1000. (2) 2 V. (3) 2/100 = 20 mA each = 10× = Q. (4) Q = 20, B = 500, narrower.)

### Rocky's questions
- "Why does B only rely on L in series and C in parallel?" → (1) Half-power is where the net reactance X = ωL − 1/(ωC) reaches ±R. (2) Near ω₀, X changes with ω at rate dX/dω = L + 1/(ω²C); at ω₀, 1/(ω₀²C) = L exactly, so the rate is 2L: L and C contribute equally, and C's share can be written in terms of L. (3) X needs to climb R on each side → Δω ≈ R/(2L) each side → B = R/L (the exact formula gives exactly this). So C is not missing; at resonance C's effect is "the same size as L's". (4) Parallel is the dual: susceptance ωC − 1/(ωL), rate 2C at ω₀, must reach ±1/R → B = 1/(RC). (5) Consequence: in series, changing C moves the peak (ω₀) but keeps its width; Q = ω₀/B changes. Example: R = 10, L = 10 mH: C = 1 µF → ω₀ = 10 000; C = 4 µF → ω₀ = 5000; B = 1000 for both, Q = 10 vs 5. Ch 8 link: B = 2α, α = R/2L in series, 1/(2RC) in parallel.
- "Why does ω₀² = 1/LC?" → Definition of resonance: the two reactances are the same size, ω₀L = 1/(ω₀C). Multiply both sides by ω₀: ω₀²L = 1/C. Divide by L: ω₀² = 1/(LC). Square root: ω₀ = 1/√(LC). Then 1/(ω₀²C) = 1/((1/LC)·C) = L. Ch 8 view: same number is the constant term of s² + (R/L)s + 1/(LC) (series) — the natural swing rate of the LC pair. Check with numbers: L = 10 mH, C = 1 µF → ω₀ = 10 000; ω₀L = 100, 1/(ω₀C) = 100 ✓.
- Mini check: series R = 20 Ω, L = 0.1 H, C changed from 10 µF to 2.5 µF: ω₀ before/after, B before/after, Q before/after. (Expected: 1000 → 2000; B = 200 both; Q = 5 → 10.)
**Rocky:** 1k → 2k, 200 → 200, 5 → 10 ✓. (Said "nevermind" to the ω₀² = 1/LC question; derivation kept in notes.) 7c check still pending.
**Rocky (7c check):** (1) 10k, 10, 1k ✓; (2) 1 V ✗ (should be 2 V); (3) "2×10⁻⁵ mA, 1/100 000 of source" ✗ (should be 20 mA each, 10× = Q); (4) B = 500, Q = 20 ✓ (didn't say narrower).
Explanation: (2) at ω₀ L–C pair is open, all 2 mA through R: V = 2 mA × 1000 Ω = 2 V (maybe halved or used 1 mA). (3) Branch current = V / |Z_branch|: |Z_L| = ω₀L = 100 Ω → I_L = 2/100 = 0.02 A = 20 mA; |Z_C| = 1/(ω₀C) = 100 Ω → same. 20 mA / 2 mA = 10 = Q ✓ (magnification, should come out ≥ 1 when Q > 1, so a tiny fraction is a red flag). The 2×10⁻⁵ likely came from multiplying instead of dividing (e.g. V·ωC·... or I/ω). Check: Q × I_s = 10 × 2 mA = 20 mA.
- "So when dealing with |Z| and adding them up, we can calculate |Z| for each individual and add them together afterwards?" → No. Magnitudes don't add: |Z₁ + Z₂| ≠ |Z₁| + |Z₂| unless they point the same way. Combine the complex Z's (keep the j's) first, then take the magnitude. In the 7c table nothing was added: each branch has the same V, so each branch current is its own V/|Z| (Ohm's law on one element is fine with magnitudes). Rule: one element → its own |Z| is OK; combining elements (series sum, parallel admittance sum) → complex. Counterexample (7b circuit at 9512.5): adding magnitudes 10 + 95.1 + 105.1 = 210 Ω → 0.048 A ✗; correct 10 + j95.1 − j105.1 = 10 − j10 → |Z| = 14.1 → 0.707 A ✓. Same family as the earlier 0.105 A slip.
- "I did current division. Can I do I_s(|Z_x|/|Z_total|) or do I need I_s|Z_x/Z_total|?" → (a) Those two are equal: magnitude of a ratio = ratio of magnitudes (|a/b| = |a|/|b|; multiplying/dividing complex numbers multiplies/divides sizes). Only adding/subtracting needs the complex form. (b) But the ratio is upside down: current divider is I_x = I_s · Z_total / Z_x (= I_s · Y_x / Y_total). Bigger branch impedance → less current. Z_x/Z_total is the series *voltage* divider. (c) Z_total has to be found complex: Y_total = 1/R + j(ωC − 1/(ωL)); at ω₀ = 1/R so Z_total = R = 1000 Ω (not |Z_R| ∥ |Z_L| ∥ |Z_C| with magnitudes, which would give ~47.6 Ω). So I_L = 2 mA × 1000/100 = 20 mA ✓, matches V/|Z_L|. Easiest at resonance: V = I_s R, then each branch V/|Z|.
- Re-check: parallel R = 500 Ω, L = 5 mH, C = 2 µF, 4 mA source: V at ω₀, |I_L|, Q, check I_L = Q·I_s. (Expected: ω₀ = 10 000, V = 2 V, ω₀L = 50 Ω → I_L = 40 mA, Q = 500/50 = 10 → 10 × 4 mA = 40 mA ✓.)
**Rocky:** 2 V, 40 mA, Q = 10, 10 × 4 mA = 40 mA ✓.
- "Is there another way apart from current division?" → Three: (1) Find V, then Ohm's law per branch (V = I_s/Y_total; at ω₀ V = I_s·R; I_L = V/|Z_L|). Works at any ω. (2) Nodal/KCL at the top node: I_s = V/R + V/(jωL) + V·jωC → V = I_s / (1/R + j(ωC − 1/ωL)) — this is method 1 written as KCL; it's what you'd use for messier circuits. (3) Resonance-only shortcut: I_L = I_C = Q·I_s. Worked all three on R = 500, L = 5 mH, C = 2 µF, 4 mA → 40 mA each. Off resonance example (ω = 5000): Y = 0.002 + j(0.01 − 0.04) = 0.002 − j0.03 → |Y| = 0.03007 → V = 0.133 V → I_L = 0.133/25 = 5.3 mA; Q shortcut doesn't apply there.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge (7c):* why B uses only L (series) / only C (parallel) — rate of change of X at ω₀ is 2L, C's share equals L's; changing C in series moves the peak, keeps width; magnitudes don't add (combine complex Z first; one element's own |Z| is fine); current divider I_x = I_s·Z_total/Z_x (Z_x on bottom), |a/b| = |a|/|b|, Z_total via admittances (= R at ω₀, not 47.6 Ω); red flag: branch current must exceed source when Q > 1.

---

## Concept 7b: Bandwidth and Q — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Reading the resonance curve without tripping" warning after the α tip (B full width, current vs power graph, peak height V/R, Q ratio not slope, selective numbers, current at ω₁ by definition with net X, exact vs shortcut only for ω₁/ω₂, ω_d sign trap + sanity check). Rocky said he's comfortable.

### (log)

### Explanation given
- Half-power points ω₁, ω₂: power ½ → I = I_max/√2 → |Z| = √2·R → leftover reactance = ±R.
- ω₁,₂ = ∓R/(2L) + √((R/2L)² + 1/LC) = ∓α + √(α² + ω₀²). B = ω₂ − ω₁ = R/L (= 2α).
- Q = ω₀/B = ω₀L/R = 1/(ω₀CR) = 1/(2ζ). Q = sharpness relative to centre; = |V_L|/V_s at resonance (voltage magnification).
- Energy meaning: high Q stores a lot, loses little per cycle → rings long (Ch 8) and is selective (here).
- ω₀ = √(ω₁ω₂) (geometric mean, symmetric on log axis); shortcut ω₀ ∓ B/2 when Q ≥ 10.
- Worked wiki Ex 14.15 (2 Ω, 1 mH, 0.4 µF, 20 V): ω₀ = 50k, B = 2k, Q = 25, ω₁,₂ = 49.01k, 51.01k, I = 10 A → 7.07 A, V_L = 500 V.

### Check question
Series: R = 10 Ω, L = 10 mH, C = 1 µF, 10 V peak. (1) ω₀, B, Q. (2) ω₁, ω₂ exact and by shortcut. (3) I at ω₀ and at ω₁. (4) |V_L| at ω₀.
(Expected: (1) 10 000 rad/s, 1000 rad/s, 10. (2) R/2L = 500, √(500² + 10⁸) = 10 012.5 → 9512.5, 10 512.5; shortcut 9500, 10 500. (3) 1 A, 0.707 A. (4) Q·V = 100 V (ω₀L = 100 Ω × 1 A).)

### Rocky's questions
- "So B is the width from the peak frequency to the frequency when power is half?" → Almost: B is the **full** width, from the lower half-power point ω₁ to the upper one ω₂, across the peak. There are two half-power frequencies, one each side. Peak to one side is only about B/2 (exactly B/2 only in the high-Q shortcut; for low Q the sides are unequal since ω₀ is the geometric mean). Ex 14.15: ω₁ = 49.01k, ω₀ = 50k, ω₂ = 51.01k → B = 2k, each side ≈ 1k.
- "So that graph is frequency vs the power of the whole circuit?" → Yes: x-axis = source frequency (amplitude held fixed, only ω swept), y-axis = average power delivered by the source. That all goes into R, since L and C absorb zero average power (they store and return). P = I²R, so it's the current curve squared: same ω₀, same ω₁/ω₂; on the current graph those points are at 0.707·I_max, on the power graph at ½·P_max. Wiki Figure 14.11 plots current; both define the same B.
- Mini check: ω₁ = 900, ω₂ = 1100 rad/s: B? ω₀ (exact and shortcut)? Q? (Expected: B = 200, ω₀ = √(990 000) ≈ 995 (shortcut average 1000), Q ≈ 5.)
**Rocky:** 200, 995 and 1000, Q = 5 ✓. 7b check still pending.
- "So Q is the slope of the graph within the bandwidth?" → No. Q isn't a slope (a slope would have units like A per rad/s; Q has no units). Q = ω₀/B = how many bandwidths fit into the centre frequency = narrowness of the peak relative to where it sits. High Q does go with steep sides (narrow peak), but it's measured as a ratio of widths, not as a slope. Comparison: B = 100 at ω₀ = 10 000 → Q = 100 (sharp); B = 100 at ω₀ = 200 → Q = 2 (broad). Same width, very different Q. Also Q = |V_L|/V_s at resonance and = 1/(2ζ).
- Mini check: circuit A ω₀ = 5000, B = 50; circuit B ω₀ = 500, B = 50. Q of each; which is more selective? (Expected: 100 and 10; A.)
- Mini check answer: Q = 100 and 10 ✓; asked "what does selective mean?" (didn't pick which).
- "What does selective mean?" → Selective = responds strongly only to frequencies very close to ω₀ and rejects others, even nearby ones. Numbers (series RLC, |I|/I_max = 1/√(1 + Q²(ω/ω₀ − ω₀/ω)²)): signal 5% above ω₀ → Q = 100 passes ~10% of the peak current, Q = 10 passes ~72%. So A (Q = 100) is more selective. Radio: stations sit close together in frequency; a high-Q tuner passes the one at ω₀ and nearly blocks its neighbours; low Q lets neighbours bleed through.
- "Can you create a visual to show higher Q is narrower, and what 'responds more strongly' means?" → Built an interactive widget (in chat): |I|/I_max vs ω/ω₀ (70–130%) for adjustable Q vs a fixed Q = 2 reference, half-power line at 0.707, and a test-frequency slider showing % of peak current passed. Key points: every curve peaks at 1 (same height, since peak = V/R); higher Q → narrower (B = ω₀/Q, e.g. Q = 10 → 10% of ω₀); "responds more strongly" = a bigger fraction of the peak gets through; for a signal off ω₀, high Q passes much less (Q = 10 at +5%: ~72%; Q = 2: ~98%), so high Q = picky / selective.
- "The peak current is just the maximum current of the circuit, right?" → Yes, in the resonance-curve sense: the largest current amplitude the circuit reaches as you sweep the source frequency with the source amplitude fixed. In series RLC it happens at ω₀: I_max = V/R. Watch the two meanings of "peak": (a) peak of the resonance curve (best frequency, I_max); (b) peak amplitude of a sinusoid vs rms (I_peak = √2·I_rms), which applies at every frequency. A "10 V peak source" uses meaning (b). Wiki Ex 14.16 note about rms vs peak.
- "So capacitors and inductors can only decrease I but never increase I?" → In a series loop with a fixed source: they can never push I above V/R, because |Z| = √(R² + X²) ≥ R; the best they can do (X = 0, resonance) is vanish. But they can increase I relative to each other: an R–C circuit at some ω has X = −1/(ωC); adding the right L cancels that and raises I back up to V/R. Ex: R = 10, X_C = −50, V = 5 → I = 0.098 A; add X_L = +50 → I = 0.5 A. And it's not true everywhere: in a parallel LC, the branch currents can be Q times the source current (current magnification, coming in 7c), the dual of series V_L = Q·V.
- "Is the graph supposed to be power vs frequency or current vs frequency?" → Either; both are used and define the same ω₀, ω₁, ω₂, B. The widget (and wiki Fig 14.11) plots current ÷ peak current, so the cut line is 0.707. A power graph plots P ÷ P_max = (I/I_max)², cut line 0.5; it looks a bit narrower/pointier (squaring shrinks values < 1) but crosses its line at the same two frequencies. The earlier ASCII sketch was labelled Power with ½P_max. Rule: current/voltage → 0.707 (−3 dB); power → ½.
**Rocky (7b check):** (1) 10 000, 1000, 10 ✓; (2) 9500, 10 500 = shortcut only ✓ (exact 9512.5, 10 512.5 not given); (3) 1 A ✓, at ω₁ 0.105 A ✗ (should be 0.707 A); (4) 100 V ✓.
Explanation for (3): ω₁ is *defined* as the half-power point → I = I_max/√2 = 0.707 A, no calculation needed. Check at ω = 9512.5: ωL = 95.1, 1/(ωC) = 105.1, X = −10 = −R, |Z| = 10√2 = 14.1, I = 10/14.1 = 0.707 ✓. 0.105 is likely V/|Z| with |Z| ≈ 95 or 105 (using one reactance instead of X = ωL − 1/ωC). Exact (2): R/2L = 500, √(500² + 10⁸) = 10 012.5 → 9512.5 and 10 512.5; ω₀ = √(ω₁ω₂) ✓.
- Re-check: Q = 4 circuit with ω₀ = 2000, I_max = 3 A. B? Current at ω₂? Exact ω₁, ω₂ using α = B/2: ∓α + √(α² + ω₀²). (Expected: B = 500, 2.12 A, α = 250, √(62 500 + 4 000 000) = 2015.6 → 1765.6, 2265.6.)
- "Is the exact the exact ω₀?" → No. ω₀ = 1/√(LC) is always exact (one formula, no shortcut). "Exact vs shortcut" refers only to ω₁ and ω₂: exact = ∓α + √(α² + ω₀²) (full formula); shortcut = ω₀ ∓ B/2 (approximation, good when Q ≥ 10). The shortcut places ω₁, ω₂ symmetrically around ω₀; really they're symmetric on a log scale (ω₀ = √(ω₁ω₂)), so the exact ones are both shifted slightly up (9512.5 / 10 512.5 vs 9500 / 10 500). Gap B is the same either way.
- "Isn't ω_d also √(α² + ω₀²)?" → No, sign differs. ω_d = √(ω₀² − α²) (MINUS): Ch 8 damped ringing frequency, from the roots −α ± j√(ω₀² − α²); it's below ω₀, only exists when α < ω₀. Half-power formula uses √(α² + ω₀²) (PLUS), always real, above ω₀; it comes from solving ωL − 1/(ωC) = ±R, a different equation. For the 7b circuit (α = 500, ω₀ = 10 000): ω_d = 9987.5, √(α² + ω₀²) = 10 012.5. Mnemonic: damping slows the ringing (minus); the half-power points spread out around ω₀ (plus, then ∓α).
**Rocky (7b re-check):** B = 500 ✓; I at ω₂ = 2.12 A ✓; exact: "320.16 ∓ 250" ✗. √(102 500) = 320.16 → he used 40 000 for ω₀² (= 200²) instead of 2000² = 4 000 000 (dropped two zeros). Correct: √(62 500 + 4 000 000) = √4 062 500 = 2015.6 → ω₁ = 1765.6, ω₂ = 2265.6. Sanity check that would catch it: √(α² + ω₀²) must be a bit bigger than ω₀ (2000), and ω₁ must be positive; 320 − 250 = 70 is way below ω₀. Also √(ω₁ω₂) = √(1765.6 × 2265.6) ≈ 2000 ✓.
- Quick try (ω₀ = 1000, B = 400): **Rocky:** 819.8, 1219.8, √ check gives 1000 ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge (7b):* B = full width ω₁ → ω₂ (peak to one side ≈ B/2); resonance graph can be current (0.707 line) or power (½ line), same ω₁/ω₂; Q is a ratio not a slope (same B, different ω₀ → different Q); peak height = V/R, independent of ω₀ and Q; "selective" with numbers (5% off: Q = 10 → ~72%, Q = 2 → ~98%); current at ω₁/ω₂ is I_max/√2 by definition (use X = ωL − 1/ωC, not one reactance); exact vs shortcut only for ω₁/ω₂; ω_d = √(ω₀² − α²) vs √(α² + ω₀²) sign trap; sanity check √(α² + ω₀²) slightly > ω₀.
- "So at high ω₀ there's more power than low ω₀?" → No. Peak power in series RLC = V²/R (rms; ½V²/R for peak amplitude) because at resonance only R is left. That doesn't depend on ω₀, L, C or Q. ω₀ only says *where* along the axis the peak sits; R and V set *how tall* it is; Q says *how narrow* relative to its position. High Q does give bigger V_L and V_C (Q·V) and more stored energy sloshing between L and C, but that energy isn't consumed, so average power is unchanged. Example: both circuits in the mini check with R = 10 Ω, V = 10 V rms → peak 10 W each.

---

## Concept 7a: Why resonance happens, series resonance — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "What acts inductive or capacitive means" tip (sign of X table, equivalent L/C, why lag/lead, ELI the ICE man, Ex 14.14 at ω = 500) and "At resonance, keep the j's in KVL" warning (phasor table, |V_L| = 5× source, V_R-as-V_L slip), both before Example 14.14. Rocky said he's comfortable.

### (log)

Concept 7 split into: 7a why + series resonance, 7b bandwidth and Q, 7c parallel resonance, 7d tank circuit / design.

### Explanation given
- L and C store energy at opposite times (C at voltage peak, L at current peak). At ω₀ = 1/√(LC) they swap energy with each other fully; the source only replaces what R burns. Explained via reactances (no swing analogy, per Rocky's preference against mechanical analogies).
- Impedance: Z = R + j(ωL − 1/(ωC)). Cancel when ωL = 1/(ωC) → ω₀ = 1/√(LC), f₀ = ω₀/2π.
- Below ω₀: capacitive (current leads). Above: inductive (current lags). At ω₀: purely resistive.
- At resonance: |Z| = R (min), I = V/R (max), in phase; V_L and V_C equal and opposite, each = Q·V can exceed the source.
- Worked wiki Ex 14.14 (20 Ω, 0.1 H, 10 µF, 10 V): ω₀ = 1000, I = 0.5 A, V_L = 50 V; at 500 rad/s I = 0.066 A.

### Check question
R = 10 Ω, L = 0.05 H, C = 20 µF, 5 V peak source, series. (1) ω₀ and f₀. (2) I and |V_L| at ω₀. (3) At ω = 2000: Z, |I|, inductive or capacitive?
(Expected: (1) 1000 rad/s, 159 Hz. (2) ω₀L = 50 Ω → I = 0.5 A, |V_L| = 25 V. (3) ωL = 100, 1/ωC = 25 → Z = 10 + j75, |Z| ≈ 75.7, I ≈ 0.066 A, inductive.)

### Rocky's questions
- "What does it mean when a circuit acts capacitive or inductive?" → Write Z = R + jX (X = net reactance). X > 0 → inductive: at that frequency the whole circuit looks to the source like R in series with one inductor, L_eq = X/ω; ∠Z > 0, current lags voltage. X < 0 → capacitive: looks like R + one capacitor, C_eq = 1/(ω|X|); ∠Z < 0, current leads. X = 0 → resistive (resonance), in phase. Why lag/lead: I = V/Z, so ∠I = ∠V − ∠Z. Pure L: Z = jωL (+90°) → current 90° behind (v = L di/dt: voltage peaks when current is rising fastest, before the current peak). Pure C: −90° → current 90° ahead (i = C dv/dt). Mnemonic ELI the ICE man. Example: Ex 14.14 at ω = 500, Z = 20 − j150 → capacitive, C_eq = 1/(500·150) = 13.3 µF, ∠Z = −82.4°, current leads by 82.4°.
- Mini check: Z = 30 + j40 at ω = 100: inductive or capacitive? Current lead or lag, by how much? L_eq? (Expected: inductive, lags by 53.1°, L_eq = 0.4 H.)
**Rocky:** inductive, lags by 53.1°, 0.4 H ✓. 7a check question still pending.
**Rocky (7a check):** ω₀ = 1000, f₀ = 159.15 ✓; I = 0.5 A ✓; |V_L| = 5 V ✗ (should be 25 V); Z = 10 + j75, I = 0.066 A ✓; didn't say inductive/capacitive (inductive).
Explanation: |V_L| = |Z_L|·I = ω₀L·I = 50 × 0.5 = 25 V. 5 V is the voltage across R (= the whole source at resonance); V_L and V_C are each 25 V but opposite, so they cancel in KVL: 5 = V_R + V_L + V_C = 5 + j25 − j25. That's the "bigger than the source" point (5× here).
- "For fix 1, isn't Z_L j50?" → Yes. Z_L = j50 Ω (phasor); |Z_L| = 50 Ω (size). V_L = Z_L·I = j50 × 0.5∠0° = j25 V = 25∠90° V; |V_L| = 25 V. The j only says "90° ahead of the current"; the magnitude drops the j. Same for C: Z_C = −j50, V_C = −j25 = 25∠−90°.
- Re-check: same circuit at ω₀: |V_C|? And V_R + V_L + V_C as phasors (take I = 0.5∠0°)? Plus inductive/capacitive at 2000. (Expected: |V_C| = 25 V; 5 + j25 − j25 = 5∠0° = source ✓; inductive since X = +75.)
**Rocky:** 25 V; 5 + j25 − j25 = 5 ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge (7a, added):* the KVL phasor table at resonance (V_R = source, V_L = +jQV, V_C = −jQV cancel); |V_L| uses |Z_L| = ω₀L, the j only sets direction; slip: giving V_R (5 V) as V_L.
*Wiki extra to merge (7a):* "acts inductive/capacitive" = sign of net reactance X; equivalent single L or C at that ω; why current lags in L / leads in C (∠I = ∠V − ∠Z; v = L di/dt peaks when i rises fastest); ELI the ICE man.

---

## Concept 6d: Full Bode procedure — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Why they work" paragraph inside the counting-checks tip, and a "Change in dB = slope × decades" warning after it. Rocky said he's comfortable.

### (log)

### Explanation given
- Steps: (1) factor H(s); (2) standard form, K; (3) list corners in order with type; (4) region table left → right: slope changes ±20 per corner, value = previous value + slope × decades; pin with 20 log|K| at ω = 1; (5) phase: start = ∠K ± 90 per origin factor, each corner adds ±90 spread over two decades; (6) checks: low/high counting, ends vs circuit shorts/opens; round corners (−3 dB at simple corners).
- Walked through wiki Ex 14.11 (200s/((s + 2)(s + 10)), K = 10): +20 to 26 dB at 2, flat to 10, −20 after; phase +90 → −90.

### Check question
Sketch H(s) = 1000(s + 1)/(s(s + 100)): K and K_dB; region table (slope; values at ω = 1, 100, 1000); phase start and end; counting checks.
(Expected: K = 10, 20 dB. ω < 1: −20 dB/dec, 20 dB at ω = 1. 1–100: flat, 20 dB at 100. > 100: −20, 0 dB at 1000. Phase −90° → (zero lifts toward 0°, about −11° near ω = 10) → −90°. Low −20 ✓, high 20(1 − 2) = −20 ✓.)
**Rocky:** K = 10, 20 dB ✓; slopes −20, 0, −20 ✓; values ω = 1: 20 dB ✓, ω = 100: 40 dB ✗ (should be 20), ω = 1000: 20 dB ✗ (should be 0, follows from the 100 slip); phase −90 → −90 ✓; counting checks not given.
Explanation: value change = slope × decades. 1 → 100 is 2 decades at slope 0 → change 0, stays 20 dB. Then 100 → 1000 is 1 decade at −20 → 0 dB. Likely added 20 per decade by habit / used the wrong slope for the flat region. His 1000 value correctly applied −20 from his 40.
- Re-check: H = 100(s + 10)/(s(s + 1000)): K, values at ω = 1, 10, 1000, 10000, plus counting checks. (Expected: K = 1, 0 dB; ω = 1: 0 dB, ω = 10: −20 dB, flat to 1000: −20 dB, ω = 10000: −40 dB; low −20, high −20.)
**Rocky:** K = 1, 0 dB; 0, −20, −20, −40; low −20, high −20 ✓ (all correct).
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge (6d):* value change = slope × decades (flat region carries the value across; slip was adding 20 in a flat region); the walk-left-to-right table with the pin at ω = 1.
- "Can you explain the counting checks one more time?" → Low ω: every (1 + jω/z) ≈ 1 → contributes nothing; only bare s factors remain → slope = 20 × (origin zeros − origin poles). High ω: every (1 + jω/z) ≈ jω/z, which behaves like a bare s → every factor counts → slope = 20 × (all zeros − all poles). Shortcut: highest power of s on top minus highest power on bottom (quadratic = s², counts 2). Purpose: the first and last rows of the region table must match these; if not, a corner sign or count is wrong. Worked on 1000(s + 1)/(s(s + 100)) and 200s/((s + 2)(s + 10)).
- Mini check: H = s²/((s + 1)(s² + 2s + 100)): low and high slopes. (Expected: low +40, high 20(2 − 3) = −20.)
**Rocky:** +40, −20 ✓.
*Wiki extra to merge (6d, added):* why the counting checks work (low: (1 + jω/z) ≈ 1 so only bare s counts; high: ≈ jω/z so every factor acts like a bare s) and the top-power-minus-bottom-power shortcut; a mismatch points to a flipped corner, not a full redo.

---

## Concept 6c: The factor table — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Nothing happens at ω = 1" warning after the factor-table bullets (pin point, poles bend down / zeros up, counting checks), and "The quadratic, step by step" tip after the ζ ≥ 1 note (origin from series RLC, why the peak is 1/(2ζ) at −90°, ζ table, 25/(s² + s + 25) example). Rocky said he's comfortable.

### (log)

### Explanation given
- Table: K flat at 20 log|K| (0° or 180°); (jω)^±N: ±20N dB/dec everywhere, 0 dB at ω = 1, ±90N°; simple zero/pole: 0 then ±20 after corner, phase 0 → ±90 over z/10..10z; quadratic: 0 then ±40 after ω_n, 0 → ±180.
- Origin factor has no corner (jω is never ≈ 1 over a range); passes 0 dB at ω = 1 since |j1| = 1.
- Powers multiply slope and phase (double pole: −40, −180°).
- Quadratic 1 + j2ζω/ω_n + (jω/ω_n)²: ω_n from the constant term, ζ from 2ζω_n = middle coefficient. ζ < 1 → resonant peak ≈ −20 log(2ζ) dB at ω_n (|H| ≈ 1/(2ζ)), phase exactly −90° at ω_n. ζ ≥ 1 → real roots, factor into two simple poles.
- Counting checks: low slope = 20 × (origin zeros − origin poles); high slope = 20 × (total zeros − total poles), quadratic counts as 2.

### Check question
(1) 1/(jω): dB at ω = 0.1, 1, 10; phase. (2) (1 + jω/20)⁻²: slope after 20, final phase. (3) H = 400/(s² + 8s + 400): ω_n, ζ, exact |H| (and dB) at ω_n, high-freq slope. (4) H = s(s + 10)/((s + 1)(s + 100)²): low- and high-frequency slopes.
(Expected: (1) +20, 0, −20 dB; −90°. (2) −40 dB/dec, −180°. (3) ω_n = 20, ζ = 8/40 = 0.2, |H| = 400/(j160) → 2.5 = 8 dB, −40 dB/dec. (4) low +20, high 20(2 − 3) = −20 dB/dec.)

### Rocky's questions
- "No zero/pole at origin → slope starts at 0; zero at origin → starts at +20 and crosses ω = 1; pole at origin → −20 and crosses ω = 1?" → Yes on slopes (and ±20N for N of them; matches the low-slope counting rule). Refinement on "crosses": the origin factor *alone* is 0 dB at ω = 1. The *whole* plot at ω = 1 is 20 log|K| (since the origin factor adds 0 dB there and the other factors are still ≈ 0 dB if ω = 1 is below the first corner). So with K = 0.4 (Ex 14.9) the line passes −8 dB at ω = 1, not 0 dB. If the first corner is below 1, extend the low-frequency line to ω = 1 to place it (anchor point), then draw. No origin factor → flat at 20 log|K|, no "crossing" point needed.
- Mini check: H = 10/(jω(1 + jω/100)): low slope, dB at ω = 1, dB at ω = 10. (Expected: −20, 20 dB, 0 dB.)
**Rocky:** −20, 20 dB, 0 dB ✓. Four-part 6c check still pending.
- "So at ω = 1, the slope changes by ±20 depending on zero or pole at origin?" → No. Misconception: treating ω = 1 like a corner. The origin factor's ±20 slope is there at **every** frequency from the far left; nothing happens at ω = 1. ω = 1 is only where that line *passes through* 0 dB (its own value), which is why it's a convenient point to pin the line (whole plot = 20 log|K| there). Slopes change only at corners: z, p, ω_n. Compare: simple pole 1/(1 + jω/p) = flat then bend at p (has a corner); 1/(jω) = one straight line forever (no corner).
- Mini check: H = 1/(jω(1 + jω/10)): slope at ω = 0.1, at ω = 1, at ω = 5, at ω = 100. Where does the slope change? (Expected: −20, −20, −20, −40; only at ω = 10.)
**Rocky:** −20, −20, −20 ✓; ω = 100 → 0 ✗ (should be −40); changes at ω = 10 ✓.
Explanation: a pole's corner always subtracts 20 (−20 + (−20) = −40); only a zero adds +20. Gave 0, i.e. treated the pole at 10 like a zero (or flipped the sign). Counting-rule check: high slope = 20(0 zeros − 2 poles) = −40.
- Re-check: H = (1 + jω/10)/(jω(1 + jω/1000)): slopes in each region? (Expected: <10: −20; 10–1000: 0; >1000: −20. Counting: 20(1 − 2) = −20 ✓.)
**Rocky:** −20, 0, −20; counting −20 ✓. Four-part 6c check still pending.
**Rocky (6c check, parts 1–2):** (1) 20, 0, −20 dB, −90° ✓; (2) −40 dB/dec, −180° ✓. Parts 3–4 pending.
- "Can you explain the third new idea (quadratic pole) in detail?" → Long explanation:
  1. Where it comes from: any 2nd-order circuit (series RLC, output across C → 1/(LCs² + RCs + 1) = ω₀²/(s² + 2αs + ω₀²)). Denominator is Ch 8's characteristic equation.
  2. Standard form: divide by the constant → 1/(1 + 2ζ(s/ω_n) + (s/ω_n)²); ω_n = √c, ζ = b/(2ω_n) = α/ω₀.
  3. Three regions: low ω → 1 → 0 dB, 0°; high ω → (jω/ω_n)² wins = −ω²/ω_n² → −40 dB/dec, −180°; at ω = ω_n: 1 and (j)² = −1 cancel, only j2ζ left → |H| = 1/(2ζ), −90° exactly.
  4. Why the peak: real parts cancel (L and C reactances cancel = resonance), only damping (ζ, i.e. R) limits it. Same circuit rings in Ch 8 when ζ < 1.
  5. ζ table: 0.05 → 10 (20 dB), 0.1 → 5 (14 dB), 0.25 → 2 (6 dB), 0.5 → 1 (0 dB), 0.707 → 0.707 (−3 dB, no peak), ≥ 1 → real roots, factor into two simple poles.
  6. Worked: 25/(s² + s + 25): ω_n = 5, ζ = 1/10 = 0.1, at s = j5: 25/(j5) → 5 = 14 dB, −90°; straight line says 0 dB.
**Rocky (part 3):** ω_n = 20, ζ = 0.2, |H| = 2.5, 7.96 dB, −40 dB/dec ✓. Part 4 pending.
**Rocky (part 4):** +20, −20 ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge (6c, added):* quadratic in detail: where it comes from (series RLC across C → ω₀²/(s² + 2αs + ω₀²)); why 1 and (j)² cancel at ω_n leaving j2ζ → |H| = 1/(2ζ), −90°; ζ → peak table (0.05/0.1/0.25/0.5/0.707); worked 25/(s² + s + 25).
*Wiki extras to merge (6c):* origin factor has its slope at every frequency, nothing happens at ω = 1 (it's only the pin point, where the plot = 20 log|K|); slopes change only at corners; pole corner always −20 (bends down), zero +20 (bends up); run the counting rule every time.

---

## Concept 6b: Standard form — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Finding K fast, and reading the corners" tip after the classic-mistake warning (K formula + H(0) check, K vs K_dB, corner = positive number, why negative K → 180°; trimmed to avoid repeating the existing "negative K is a 180° shift" bullet). Rocky said he's comfortable.

### Explanation given
- Two-lines trick needs every factor = 1 at low ω (contributes 0 dB until its corner). (s + z) isn't: at low ω it's z.
- Rewrite (s + z) = z(1 + s/z); pull all constants into K; set s = jω.
- Then logs add: top factors add dB, bottom subtract; angles add/subtract too.
- K = (constant out front) × (zeros' z values) / (poles' p values). Check: K = H(0) when no s-at-origin factor.
- K in dB = 20 log|K|; negative K → magnitude unchanged, phase starts at ±180°.
- Skipping the step shifts the whole magnitude plot by 20 log z (e.g. 6 dB for z = 2).

### Check question
(1) H(s) = 200(s + 10)/((s + 2)(s + 100)): standard form, K, K in dB, corner frequencies (zero or pole?). Check K against H(0).
(2) H(s) = −(s + 40)/(s + 4): K, K in dB, starting phase.
(Expected: (1) 10(1 + s/10)/((1 + s/2)(1 + s/100)), K = 200·10/(2·100) = 10 = 20 dB; zero at 10, poles at 2 and 100; H(0) = 2000/200 = 10 ✓. (2) K = −40/4 = −10 → 20 dB, phase starts at 180°.)
**Rocky (partial):** standard form 10(1 + s/10)/((1 + s/2)(1 + s/100)) ✓ (K = 10 implied). Rest not answered yet; asked for K in dB, corners, H(0) check and part 2.
**Rocky:** "K = 20" (meant K in dB; K itself is 10) ✓-ish; zero at s = −10, poles at s = −2, −100 ✓; H(0) = 10 = K ✓. Part 2 still unanswered.
Clarified: write K = 10 and K_dB = 20 dB separately. Root s = −10 ↔ corner frequency ω = 10 rad/s (corners on the Bode axis are the positive numbers). Order along ω: pole 2, zero 10, pole 100.
**Rocky (part 2):** K = −10, 20 dB, starts at 180° ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge:* K formula (front constant × zeros' numbers / poles' numbers) with the H(0) = K check; write K and K_dB separately; corner frequency = the positive number (root s = −10 → corner at ω = 10).

### Rocky's questions
- "Why does the phase start at 180?" → (1) −1 as a complex number sits on the negative real axis: magnitude 1, angle 180°, so −10 = 10∠180°. (2) At low ω every (1 + jω/z) factor ≈ 1∠0°, so H ≈ K = 10∠180°. (3) In time: multiplying a sine by −1 flips it upside down, −cos ωt = cos(ωt + 180°); a flip is the same as a half-cycle shift. (4) +180° and −180° are the same point (both on the negative real axis); pick whichever keeps the plot tidy. Example: inverting op-amp (Ch 5) has gain −R_f/R_i → 180° phase.
- Mini check: H = −5 at all ω. Input 2 cos(100t + 30°): output? (Expected: 10 cos(100t + 210°) = 10 cos(100t − 150°).)
**Rocky:** 10 cos(100t + 210°) ✓. (Told him −150° is the same.)
*Wiki extra to merge:* why negative K → 180° (−1 = 1∠180° on the complex plane; other factors are 1∠0° at low ω; time view: flip = half-cycle shift; ±180° same; inverting op-amp link).

---

## Concept 6a: Bode plots — why each factor is two straight lines — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Straight line vs exact at the corner" warning after Example 14.6 (0 dB vs −3 dB, |1 + j| = √2 not 2, octave value −7 dB). Rocky said he's comfortable.

### (log)

Concept 6 split into: 6a straight lines and the corner, 6b standard form, 6c factor table, 6d full procedure / reverse.

### Explanation given
- Bode plot = magnitude (dB) and phase (°) vs log ω. Decade = ×10 in frequency.
- On log-log axes, ω^n → straight line of slope 20n dB/decade.
- Simple pole 1/(1 + jω/p): low ω → 1 wins → 0 dB, 0°. High ω → jω/p wins → p/(jω): ×10 in ω → ÷10 in gain → −20 dB/dec, −90°.
- Corner ω = p: both terms equal, 1/(1 + j) → −3 dB, −45°. Straight-line error worst there (3 dB).
- Phase ramps over two decades: starts at p/10, ends at 10p, −45°/decade. Magnitude bends at one point.
- Zero is the mirror: +20 dB/dec, 0 → +90°.

### Check question
H = 1/(1 + jω/50). (1) Straight-line magnitude at ω = 5, 50, 500, 5000. (2) Exact magnitude at the corner. (3) Straight-line phase at ω = 5, 50, 500. (4) Zero 1 + jω/50 instead: magnitude at 5000 and phase at 500?
(Expected: (1) 0, 0, −20, −40 dB; (2) −3 dB; (3) 0°, −45°, −90°; (4) +40 dB, +90°.)
**Rocky:** (1) 0, −3, −20, −40 — ω = 5, 500, 5000 ✓; at the corner gave −3 (that's the exact value; the straight line is 0 dB there). (2) −6.02 ✗ (exact is −3.01 dB). (3) 0, −45, −90 ✓. (4) 40, 90 ✓.
Explanation: (1) straight-line sketch = the two asymptotes, which meet at 0 dB at the corner; the −3 dB is the real curve. (2) |1 + j| = √(1² + 1²) = √2, so |H| = 1/√2 = 0.707 → 20 log 0.707 = −3.01 dB. −6.02 dB is 20 log(1/2), i.e. treating |1 + j| as 2 (adding the parts instead of √ of the squares), or using 20 log of |H|² = ½ (which would need 10 log).

### Re-check
H = 1/(1 + jω/200). (1) Exact |H| (as a number and in dB) at ω = 200. (2) Exact |H| at ω = 400 (|1 + j2| = ?) and the straight-line value there. (3) Straight-line value at ω = 200.
(Expected: (1) 0.707, −3.01 dB; (2) |1 + j2| = √5 ≈ 2.236 → 0.447 → −6.99 dB; straight line: 400 is log₁₀2 ≈ 0.301 decade above → −6.02 dB; (3) 0 dB.)
**Rocky:** 0.707, −3.01 ✓; 0.447, −6.99 ✓; 0 ✓. (Straight-line value at 400 wasn't asked in the message, so not drilled.)
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge:* at the corner, straight line = 0 dB (asymptotes meet), exact = −3 dB; |1 + j| = √2 not 2 (−6 dB is the slip). One octave above (ω = 2p): exact |1 + j2| = √5 → −7 dB.

---

## Concept 5: Decibels — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "dB without a calculator" tip after Example 14.5 (×10 = 20 dB, ×2 ≈ 6 dB, build from anchors). Rocky said he's comfortable.

### Explanation given
- H_dB = 20 log₁₀|H| (20 because power ∝ V², and the square comes out of the log as ×2; power ratios use 10).
- Anchor table: 10 → 20 dB, 100 → 40, 2 → 6, √2 → 3, 1 → 0, 0.707 → −3, 0.1 → −20, 0.01 → −40. Gain < 1 → negative dB.
- Multiplication → addition: stage gains add in dB. Reverse: |H| = 10^(dB/20).
- −3 dB = 0.707 = half power ((1/√2)² = ½); defines cutoff and bandwidth.
- Trick: build values from anchors, e.g. 20 = 10 × 2 → 20 + 6 = 26 dB; 0.5 = −6 dB.

### Check question
(1) |H| = 1000 and |H| = 0.5 in dB. (2) What |H| is −40 dB? 26 dB? (3) Two stages: 40 dB and −46 dB: total dB and plain ratio.
(Expected: (1) 60 dB, −6 dB; (2) 0.01, 20; (3) −6 dB → 0.5.)
**Rocky:** 60, −6; 0.01, 20; −6 dB, 0.5 ✓ (all correct first try).
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge:* no-calculator trick: ×10 = +20 dB, ×2 ≈ +6 dB, so build values from anchors (20 = 10 × 2 → 26 dB; 0.05 = 0.1 × 0.5 → −26 dB; 26 dB → 20); add 0.5 → −6 dB to the anchor table.

---

## Concept 4: Transfer function H(s) — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Two easy slips" warning after Example 14.4 (open = zero current, low-pass/high-pass ends; α = half the middle coefficient, ζ = α/ω₀ cross-check). Rocky said he's comfortable.

### Explanation given
- H(s) = output/input with R, sL, 1/(sC). Usually V_o/V_i. s = jω gives the gain/phase number from Concept 1.
- Recipe: redraw with impedances → solve (often a divider) → divide → clear nested fractions → polynomial over polynomial.
- Zeros (numerator roots): H = 0, circuit blocks that s. Poles (denominator roots): H → ∞, i.e. output with no input = natural response. Denominator = Ch 8 characteristic equation; poles = s₁, s₂.
- H(0): set s = 0. H(∞): keep highest powers of s.
- Worked RC divider: H = (1/sC)/(R + 1/sC) = 1/(sRC + 1); pole at −1/RC; H(0) = 1 (C open), H(∞) = 0 (C short) matches the extremes table.

### Check question
H(s) = 10s / (s² + 4s + 13). (1) zeros, (2) poles (complex?), (3) H(0) and H(∞), (4) what does the natural response look like (over/under-damped, α, ω₀)?
(Expected: zero s = 0; poles −2 ± j3; H(0) = 0, H(∞) = 0 (10s/s² = 10/s); α = 2, ω₀ = √13 ≈ 3.61, underdamped, natural response A e^(−2t) cos(3t + θ).)

### Rocky's questions
- "Doesn't C being open make it 0?" (about H(0) = 1 for the RC low-pass) → Open means zero **current**, not zero voltage. No current → no drop across R (v_R = R·0) → all of V_i appears across the open gap, so V_o = V_i, H = 1. Short = zero **voltage** → that's the ω → ∞ case, V_o = 0. Same mix-up as Ch 8 Concept 2 ("the zero belongs to the other quantity"). Analogy-free check: a broken wire (open) across a battery still shows the full battery voltage on a voltmeter.
- Quick checks given: (1) output across R instead of C: H(0) and H(∞)? (Expected 0 and 1.) Then answer the original check question.

**Rocky (original check):** zero 0 ✓; poles −2 ± j3, complex ✓; H(0) = 0, H(∞) = 0 ✓; ω₀ = √13 ✓; α = 4/√13 ✗; underdamped ✓. Skipped the output-across-R quick check.
Explanation: the middle coefficient is 2α, so α = 4/2 = 2 (matches the real part of the poles, −2). 4/√13 isn't anything; the nearby quantity is the damping ratio ζ = α/ω₀ = 2/√13 ≈ 0.55. Cross-check: poles = −α ± jω_d, ω_d = √(ω₀² − α²) = √(13 − 4) = 3 ✓.

### Re-check
(1) the skipped output-across-R quick check; (2) H(s) = 5/(s² + 10s + 16): poles, α, ω₀, damping type.
(Expected: (1) H(0) = 0, H(∞) = 1. (2) poles −2, −8; α = 5, ω₀ = 4, overdamped.)
**Rocky:** (1) 0 and 1 ✓; (2) −2, −8, α = 5, ω₀ = 4, overdamped ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge:* (a) open = zero current, not zero voltage: RC low-pass at DC, no current → no drop on R → V_o = V_i (H(0) = 1); output across R flips it (0 at DC, 1 at ∞). (b) reading α from the denominator: middle coefficient is 2α (don't divide by ω₀); cross-check with complex poles −α ± jω_d; α/ω₀ is the damping ratio ζ, not α.

---

## Concept 3: Impedance in the s-domain — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Judge the whole combination" warning after the extremes tip (series: open wins, ∞ at both ends; parallel: short wins, 0 at both ends). Rocky said he's comfortable.

### Explanation given
- d/dt → ×s, ∫ → ÷s. So v = L di/dt → V = sL·I; i = C dv/dt → V = I/(sC).
- Z_R = R, Z_L = sL, Z_C = 1/(sC). With s = jω: jωL, 1/(jωC) = −j/(ωC).
- Calculus → algebra: series/parallel, dividers, KVL/KCL, nodal all work like resistors.
- Frequency dependence: |Z_L| = ωL grows (faster change → bigger induced voltage), |Z_C| = 1/(ωC) shrinks (faster change → more current).
- Extremes table: L short at DC, open at ∞; C open at DC, short at ∞. Use as sanity check for any H(s).

### Check question
R = 100 Ω, L = 0.5 H, C = 10 µF in series, ω = 400 rad/s. Find Z_L, Z_C, total Z (rectangular), and whether it looks inductive or capacitive. Then: what is |Z| as ω → 0 and ω → ∞?
(Expected: Z_L = j200, Z_C = −j250, Z = 100 − j50 Ω, capacitive; |Z| → ∞ at both ends.)
**Rocky:** j200, −j250 ✓; 100 − j50 ✓; capacitive ✓; part 4 "open and short" ✗ (likely read one element's column instead of the whole series chain).
Explanation: in series, one open breaks the whole chain. ω → 0: C is open → whole circuit open, |Z| → ∞. ω → ∞: L is open → whole circuit open, |Z| → ∞. The short elements don't matter once something in series is open. Check with numbers: |Z_C| = 1/(ωC) → ∞ as ω → 0; |Z_L| = ωL → ∞ as ω → ∞.

### Re-check
Same R, L, C but all three in **parallel**. What is |Z| as ω → 0 and ω → ∞? (Hint: in parallel, one short shorts the whole thing.)
(Expected: ω → 0: L short → Z = 0; ω → ∞: C short → Z = 0.)
**Rocky:** short at both ends, |Z| → 0 ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge:* for a whole circuit at the extremes: series → one open opens the chain; parallel → one short shorts it. Series RLC |Z| → ∞ at both ends (dip in the middle), parallel RLC |Z| → 0 at both ends (peak in the middle). Slip: reading one element's state instead of the whole combination.

---

## Concept 2: Complex frequency s = α + jω — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Reading a signal off s" tip after Example 14.2 (recipe, s = 0 is DC, further left decays faster with 1/|α|). Rocky said he's comfortable.

### Explanation given
- e^(st) with s = α + jω → real part A e^(αt) cos(ωt + θ). α (real part) = envelope: < 0 decays, > 0 grows, 0 steady. ω (imag part) = oscillation; ω = 0 means no wiggle.
- Why s: d/dt e^(st) = s e^(st), so derivatives/integrals keep the shape. One symbol covers DC (s = 0), decay, ringing, steady AC.
- Steady AC = imaginary axis, s = jω. Substitute s = jω to get the frequency response.
- Sign clash: here α is the real part (negative = decay); in Ch 8 α = R/2L was a positive decay rate in e^(−αt). Textbook calls the real part σ.
- s-plane map: left half = decays, right half = grows (passive circuits never), imaginary axis = steady sine, real axis = no oscillation.

### Check question
Describe e^(st) in words and write the real signal for: (a) s = −3 + j4, (b) s = j50, (c) s = −10, (d) s = 0. Which one is the steady AC case?
(Expected: (a) e^(−3t) cos 4t decaying oscillation; (b) cos 50t steady sine ← AC case; (c) e^(−10t) pure decay; (d) constant = DC.)
**Rocky:** gave α values (−3, 0, −10, 0) instead of the signals; descriptions (a) decaying oscillation ✓, (b) steady oscillation ✓, (c) purely decaying ✓, (d) "nothing is happening" ✗ partly: e^(0·t) = 1, a constant that doesn't change = DC, not zero. Didn't say which is the AC case.
Explanation: reading the signal off s: α goes in e^(αt), ω goes in cos(ωt). s = 0 is the DC case (constant, not nothing).

### Re-check
Write the signals for (a)–(d), say which is AC. Plus: s = −1 + j6 vs s = −4 + j6, which dies out faster, and do they wiggle at the same rate?
(Expected: signals as above, (b) is AC; −4 + j6 dies faster, same wiggle rate 6 rad/s.)
**Rocky:** e^(−3t)cos 4t, cos 50t, e^(−10t), 1 ✓; (b) is AC ✓; same wiggle rate ✓; "the first one (−1 + j6) dies faster" ✗.
Explanation: more negative α = faster decay. At t = 1 s: e^(−1) ≈ 0.37 vs e^(−4) ≈ 0.018. Time constant 1/|α|: 1 s vs 0.25 s. Further left on the s-plane = dies faster. (Links to Ch 8: 1/α time scale.)

### Re-check 2
Rank by how fast they die out (fastest first): s = −2 + j3, s = −0.5 + j3, s = −8. Which is furthest left on the s-plane?
(Expected: −8, then −2 + j3, then −0.5 + j3; −8 is furthest left.)
**Rocky:** −8, −2 + j3, −0.5 + j3; −8 furthest left ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extras to merge:* s = 0 gives e^0 = 1, a constant (DC), not "nothing"; further left = faster decay, time constant 1/|α| (e.g. −4 + j6 vs −1 + j6: same wiggle, 0.25 s vs 1 s); recipe s = α + jω → e^(αt) cos ωt.

---

## Concept 1: Sine in, sine out — ✅ merged into wiki
Merged into `ch14-frequency-response.md`: "Why a bigger angle means leads" tip after the |H| / ∠H bullets, with the lead/lag slip from the check. Rocky said he's comfortable.

### Explanation given
- R scales a sine, L differentiates it, C integrates it: all give a sine of the same frequency, only shifted/scaled.
- KVL/KCL just add same-frequency sines → still a sine at that frequency. Linear circuits can't create new frequencies.
- So at each ω the circuit is one complex number H = M∠φ: |H| = gain (multiplies amplitude), ∠H = phase shift (adds to the input's phase; + leads, − lags).
- Recipe: output amplitude = input amplitude × |H|; output phase = input phase + ∠H; ω unchanged.

### Check question
At ω = 1000 rad/s, H = 2.5∠45°. Input is 4 sin(1000t − 10°) V. Find v_o(t). Does the output lead or lag the input, and by how much?
(Expected: v_o = 10 sin(1000t + 35°) V; leads by 45°.)
**Rocky:** v_o = 10 sin(1000t + 35°) V ✓; "lags by 45°" ✗ (should be leads).
Explanation: output phase (+35°) is bigger than input phase (−10°), so the output is ahead → leads. ∠H positive = lead, negative = lag. Bigger angle in cos(ωt + φ) means the peak happens earlier (peak at ωt = −φ).

### Re-check
H = 0.8∠−30°, input 5 cos(500t + 50°). Find v_o and say lead/lag. Also: H = 3∠+90°, input cos(ωt), lead or lag?
(Expected: 4 cos(500t + 20°), lags by 30°; second leads by 90°.)
**Rocky:** 4 cos(500t + 20°) V, lags by 30° ✓; second leads by 90° ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
*Wiki extra to merge:* why a bigger phase angle = leads (peak at ωt = −φ, so bigger φ peaks earlier); the input-vs-output phase comparison is a common slip.
