# ELE 302 Ch 5: Operational Amplifiers — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/ele-302/ch05-operational-amplifiers.md` and anything missing (alternate explanations, extra intuition) gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

---

## Concept 1: What an op amp is (the black box) — ✅ merged into wiki

Merged: "How it amplifies" subsection + seesaw/sign-rule tip in `ch05-operational-amplifiers.md`; full transistor-level section ("Using a MOSFET as an amplifier") in `coe-328/concepts/mosfet.md` (shared concept page, now also tagged ele302). Rocky confirmed he understands this concept.

### Explanation given
- An op amp is a **difference amplifier with enormous gain**. It looks at two input voltages and outputs a scaled version of their *difference*, not either one alone:
  v_o = A (v+ − v−), with A around 10^5.
- Five pins matter: v+ (non-inverting), v− (inverting), v_out, and the two supplies V_CC+ / V_CC−.
- The supplies are the **power** and also set the **limits**: the output can never go above V_CC+ or below V_CC−. That limit is called **saturation**.
- Mental picture: a seesaw with a hair trigger. If v+ is even slightly bigger than v−, the output swings hard toward the positive rail; slightly smaller, hard toward the negative rail. Only when the two are within about (rail / A) ≈ 0.15 mV of each other does the output sit between the rails.

### Rocky's questions
*(none yet)*

### Check question
Open loop, A = 10^5, rails ±15 V, v+ = 2.00000 V and v− = 2.00010 V. What is v_o?

**Rocky's answer:** "10V?" — right magnitude, dropped the sign.
**Correction:** v_d = v+ − v− = −0.1 mV, so v_o = A·v_d = −10 V (inside the rails, no clipping). The sign comes from which input is bigger: v− bigger → output negative; v+ bigger → output positive.
**Status:** magnitude correct, sign slip; needs one more check on sign/saturation before marking understood.

### Second check
- v+ = 1.00000 V, v− = 0.99990 V → Rocky: 10 V ✓ (v_d = +0.1 mV, +10 V, inside rails)
- v+ = 1.0 V, v− = 0.5 V → Rocky: 15 V ✓ (A·v_d = 50,000 V, clipped to +15 V)
**Status:** both correct, sign handled. Waiting for Rocky to confirm he's comfortable before marking 🟢.

### Rocky's question: "out of curiosity, how does it amplify?"
**Answer given:**
- The input doesn't get made bigger. It *controls* how much of the supply reaches the output. The energy comes from the supply pins (water-valve picture: tiny twist of the handle, big flow from the reservoir).
- Inside: (1) **differential pair** — two matched transistors share one bias current; a difference between v+ and v− steers current toward one side, which is why only v+ − v− matters. (2) **Gain stage(s)** — the current imbalance flows through a high-value load, converting to a large voltage; stacked stages multiply up to A ≈ 10^5. (3) **Output stage** — buffers the result so it can drive a load (small R_o); output transistors can't pull past the rails, which is saturation.
- Inputs are sensed by transistors as voltage-controlled devices, so they draw almost no current. This is the physical reason for the ideal rule i+ = i− = 0.
- A comes from transistor details, so it is large but varies chip-to-chip and with temperature; that sets up why feedback (Concept 2) is needed.

### Extras not in the wiki yet (to merge once understood)
- Where the gain physically comes from: differential pair, gain stage, output stage; energy from supply, input only controls.
- Physical origin of i+ = i− = 0 (input transistors are voltage-sensed, draw ~no current).

---

## Concept 2: Why open loop fails, and negative feedback — ✅ merged into wiki

Merged into `ch05-operational-amplifiers.md`: "safe to say v+ = v−" note, A vs A_CL table, feedback-type-depends-on-output note, i_o ≠ 0 note, "Why R1 is needed" + input resistance paragraph. Rocky confirmed he's comfortable.

### Explanation given
- **Problem 1, saturation:** with A ≈ 10^5 the output only stays between the rails if the inputs are within ~0.15 mV. Real signals are bigger, so the output just sits on a rail.
- **Problem 2, unreliable gain:** A varies chip to chip, with temperature and with frequency.
- **Fix:** wire (some of) the output back to v− . The output corrects itself: if v_o is too high, v− rises, v+ − v− shrinks, v_o is pulled back down. It settles where v− ≈ v+ (the virtual short).
- Buffer derivation: v_o = A(v_i − v_o) → v_o = A/(1+A) · v_i ≈ v_i. Inputs differ by only ~20 µV.
- Gain of the loop: A_CL = A/(1+Aβ) ≈ 1/β when Aβ ≫ 1, so the resistors set the gain, not A.

### Rocky's questions
**Q: "Is the current on v_o also zero?"** (side note)
**A:** No. Only the inputs draw ~0 current (i+ = i− = 0, insulated gates). The output stage sources/sinks whatever the load and feedback path need, drawn from the supply pins (wiki Ex 5.11: i_o = 0.5 mA load + 0.12 mA feedback = 0.62 mA). This is why we don't write KCL at the output node (unknown op-amp current) and use the inverting node instead. Real op amps have a maximum output current (often tens of mA); beyond it the output sags/clips even within the rails.
**Q: "What is v_i?"**
**A:** The external input voltage source driving the circuit. In the buffer it connects to v+ (so v+ = v_i = 5 V), v_o is wired to v− (v− = v_o), so v_d = v_i − v_o.
*Wiki extra to merge once Concept 2 is understood:* a note that i_o ≠ 0, comes from the supplies, and has a rated limit.

### Check question 1
Buffer (output wired to v−), A = 10^5, v_i = 5 V. Find v_o and the voltage difference v+ − v−.
**Rocky:** v_o ≈ 4.99995 V, difference ≈ 50 µV ✓ (exact: 5·A/(1+A) = 4.99995 V; difference = 5/100001 ≈ 50 µV).
Takeaway: gap is a millionth of the signal, which is why v+ = v− is a safe assumption.

### Part B: resistors set the gain
v− = β·v_o → v_o = A(v_i − βv_o) → A_CL = A/(1+Aβ) ≈ 1/β when Aβ ≫ 1. A cancels. Non-inverting: β = R1/(R1+Rf), 1/β = 1 + Rf/R1. Buffer is β = 1.

### Check question 2
Non-inverting amp, R1 = 1 kΩ, Rf = 19 kΩ. (1) β and expected gain 1/β? (2) Exact A_CL for A = 10^5 and A = 10^4; how much did the gain change?
(Expected: β = 0.05, 1/β = 20; A_CL ≈ 19.996 and ≈ 19.96, about 0.2% change.)
**Rocky, part (1):** β = 0.05, gain 20 ✓. Part (2) pending.
**Q: "What is A_CL?"** → Closed-loop gain: v_o/v_i of the whole circuit with feedback connected. Contrast with A (open-loop gain of the bare chip, ~10^5, unreliable). Feedback trades a huge sloppy A for a small precise A_CL set by resistors.
*Wiki extra:* small A vs A_CL table.
**Rocky, part (2):** 19.996 and 19.96 ✓. A dropped 10×, gain moved ~0.2%. Takeaway: even a chip 10× worse gives a circuit within 0.2% of 1/β.
**Status:** all checks correct. Waiting for Rocky to say he's comfortable before marking 🟢 and merging extras.

### Rocky's question: "Would there be a case where v_i goes into v− AND there's negative feedback?"
**A:** Yes — the **inverting amplifier**. v+ grounded; v_i through R1 into v−; Rf from v_o to v−. Output→v− = negative feedback, so virtual short gives v− = 0 (virtual ground). i− = 0, so v_i/R1 = −v_o/Rf → v_o = −(Rf/R1)·v_i. Minus sign: v_i up pushes current into the v− node; output must go down to draw it off through Rf.
Key point: feedback type is decided by where the *output* connects (to v− = negative), not by where the input enters.
Comparison: non-inverting (signal at v+, gain 1+Rf/R1, ≥1) vs inverting (signal at v− via R1, gain −Rf/R1, any magnitude).
*Wiki extra:* "feedback type depends on where the output goes, not the input" sentence + comparison table near the amplifier formulas.
Check: R1 = 10k, Rf = 50k, ±12 V, find v_o for v_i = 1 V and 3 V. (Expected: −5 V; −15 V → clips to −12 V.)
**Rocky:** −5 V and −12 V ✓ (correctly applied saturation).

### Rocky's question: "So there has to be a resistor after v_i for this scenario then?"
**A:** Yes (something between the source and v−). An ideal voltage source wired straight to v− forces v− = v_i, so feedback can't move v− toward v+ = 0; virtual short breaks and the output saturates. R1 isolates the source so v− can move, turns v_i into a current v_i/R1, sets the gain (−Rf/R1) and sets the input resistance seen by the source (= R1, since v− is virtual ground). Non-inverting amp differs: source sees only the gate, so ~infinite input resistance.
Related: Wiki Ex 5.4 puts a *current* source at v− — fine, because it fixes current not voltage, so the loop can still move v−.
Principle: negative feedback works by adjusting v−, so v− must not be rigidly held by something else.
*Wiki extra:* this principle + input-resistance comparison (inverting = R1, non-inverting ≈ ∞).

---

## Concept 3: Positive feedback and the Schmitt trigger — ✅ merged into wiki

Merged into `ch05-operational-amplifiers.md`: active-threshold table, "named by the input level / non-inverting is opposite" warning, three-step trace tip, hysteresis width 2βV_sat. Rocky confirmed he's comfortable.

### Explanation given
- Positive feedback = output wired back to v+. If v_o rises, v+ rises, v+ − v− grows, v_o is pushed up further → runs away to a rail and stays. The output is never in between, so the virtual short does NOT apply.
- Useless for amplifying, good for switching.
- Schmitt trigger (inverting): v_i on v−, R1 (v+ to ground) and R2 (output to v+) divide the output: v+ = β·v_o, β = R1/(R1+R2). Output is ±V_sat so there are two thresholds ±β·V_sat. Hysteresis = gap between them; noise smaller than the gap can't toggle the output.

### Rocky's questions
*(none yet)*

### Check question 1
R1 = 10 kΩ, R2 = 40 kΩ, rails ±12 V. Find β and the two thresholds.
**Rocky:** β = 0.2, thresholds ±2.4 V ✓.
Takeaway: the active threshold depends on the current output; flipping moves the threshold to the other side (that's the memory).

### Rocky's question: "Would the active threshold always be ±2.4 V?"
**A:** Magnitude is fixed at β·V_sat = 2.4 V for this circuit, but the sign follows the current output and only one threshold is active at a time (v_o = +12 → +2.4 active, flips when v_i rises above; v_o = −12 → −2.4 active, flips when v_i falls below). The magnitude changes only if β (R1, R2) or V_sat (rails; real op amps saturate slightly below the rail) changes. Wiki Ex 5.3 designs for ±1.5 V.
*Wiki extra:* small table of active threshold vs current output.

### Check question 2
Same circuit, v_o starts at +12 V, v_i goes 0 → 3 → 1 → −3 V. Give v_o and active threshold at each step.
**Rocky:** 0 → stays +12 ✓; 3 → flips to −12 ✓; 1 → stays −12 ✓; −3 → flips to +12 ✓.
Takeaway: same v_i = 1 V gave +12 V going up and −12 V going down (output depends on history). Hysteresis width = 2.4 − (−2.4) = 4.8 V; noise smaller than that can't toggle the output.
**Status:** all checks correct. Waiting for Rocky to say he's comfortable before merging.

### Rocky's statement (misconception): "upper threshold switches it to the upper saturation, lower threshold to the lower saturation"
**Correction:** true only for a *non-inverting* Schmitt trigger. In this (inverting) circuit v_i is on v−: crossing the **upper** threshold (+2.4 V, rising) switches the output **down** to −V_sat; crossing the **lower** threshold (−2.4 V, falling) switches it **up** to +V_sat. Thresholds are named by the *input* level; the output direction follows the inverting pin.
*Wiki extra:* explicit sentence on which direction each threshold switches, and that a non-inverting Schmitt trigger is the opposite.
Follow-up check: v_i starts at −5 V (so v_o = +12 V, active threshold +2.4 V) and rises slowly. Where does the output change and which way? (Expected: at v_i = +2.4 V it flips down to −12 V.)
**Rocky:** "−2.4 changes it up?" ✗. Mixed up which threshold is active. At v_o = +12 V the active threshold is +2.4 V (v_+ − v_− = 2.4 − v_i hits 0 at v_i = 2.4), so the output flips DOWN at +2.4 V; −2.4 V does nothing because the output is already high.
Method given: (1) find current output, (2) find active threshold, (3) ask which direction v_i must move to cross it.
Retry question: v_o = −12 V, v_i falling from +5 V — where and which way? (Expected: at −2.4 V, flips up to +12 V.)
**Rocky:** "−2.4 flips it up" ✓. Both sweeps now understood: rising → flips down at +2.4 V; falling → flips up at −2.4 V.
**Status:** all checks correct after one correction. Rocky confirmed comfortable → merged (see header).

---

## Concept 4: The ideal op amp model and solving method — ✅ merged into wiki

Merged into `ch05-operational-amplifiers.md`: KCL sign-convention tip (current = higher − lower, direction of flow) plus the input-side sign check. Rocky confirmed he's comfortable.

### Explanation given
- Ideal op amp: A → ∞, R_i → ∞, R_o → 0. Gives two rules: (1) i+ = i− = 0; (2) v+ = v− (virtual short, only with negative feedback).
- Solving method: apply the two rules, then KCL at the inverting node (not the output node, where the op amp injects an unknown current).
- Worked pattern: non-inverting amp. v+ = v_i, so v− = v_i. Current through R1 to ground = v_i/R1. That current must come through Rf (nothing enters the op amp), so (v_o − v−)/Rf = v−/R1 → v_o = (1 + Rf/R1)·v_i.

### Rocky's questions
*(none yet)*

### Check question
Non-inverting amp: v_i = 2 V on v+, R1 = 10 kΩ from v− to ground, Rf = 30 kΩ from v_o to v−. Use KCL at v− to find v_o. (Expected: 8 V.)
**Rocky (attempt 1):** wrote v-/10k = (v- − v_o)/30k ✗. Setup right (KCL at v−, v− = 2 V) but the Rf current has the wrong sign; it flows from v_o toward v−, so it is (v_o − v−)/Rf. His version gives −4 V, which is impossible for a non-inverting amp with positive input.
Sign rule given: current = (higher-voltage end − lower-voltage end)/R, in the direction it actually flows.
**Retry:** v_o = 8 V ✓ (matches 1 + Rf/R1 = 4, 4 × 2 V).
**Status:** correct after one sign correction.

### Second check: inverting amp via KCL (v_i = 1.5 V, R1 = 10k, Rf = 40k, v+ = 0)
Rocky asked for better lesson formatting (short steps, tables, circuit diagram); the question was re-posed that way.
**Rocky:** v− = 0 ✓; i_R1 = 0.15 mA ✓; skipped the Rf-current and KCL equation steps; v_o = 6 V ✗ (sign); said the −Rf/R1 check matches ✗ (that formula gives −6 V).
**Correction:** current through Rf flows from v− toward v_o: (v− − v_o)/Rf = 0.15 mA → (0 − v_o)/40k = 0.15 mA → v_o = −6 V. Same sign slip as before: dropping the minus on inverting circuits.
**Retry:** wrote 0.15 mA = −v_o/40k ✓, solved v_o = −6 V ✓ (matches −Rf/R1 · v_i = −4 × 1.5).
**Status:** all Concept 4 checks correct after sign corrections on both. Rocky confirmed comfortable; merged (see header).

---

## Concept 5: Summing amplifier (and then difference amplifier) — ✅ merged into wiki

Merged into `ch05-operational-amplifiers.md`: why summing inputs don't interfere, KCL in-vs-out direction tip, difference amp solving order, and the "can't divide R1/R2 to ground" warning with the two-end divider form. Rocky wrote the full KCL equation (1 − 1.5)/10k = (1.5 − v_o)/30k, got v_o = 3 V and confirmed he's comfortable.

---

## Concept 6: Cascaded stages, then the non-ideal op amp model — ✅ merged into wiki

Merged into `ch05-operational-amplifiers.md`: "three voltages" note (v_d vs A·v_d vs v_o), R_o/R_L divider with the 4.5 V example and 50 pA input-current point, and a saturation-in-a-cascade warning. Rocky's side questions: "is R_L the resistance in the op amp?" (no: it's the external load) and the v_d / A·v_d / v_o naming (v_d is the input difference, not "the source voltage"). Rocky confirmed he's comfortable.

### Part 1: Cascaded stages
- Each stage's output feeds the next stage's input; overall gain = product of the stage gains (Eq. 5.10).
- Why it works: an ideal op amp output acts like an ideal voltage source (R_o → 0), so the next stage does not load the previous one.
- Solve each stage on its own, in order, using its own gain formula.

### Rocky's questions
*(none yet)*

### Check question
Stage 1: non-inverting, R1 = 10k, Rf = 30k. Stage 2: inverting, R = 10k, Rf = 50k. v_s = 0.2 V, rails ±12 V. Find v1 and v_o. (Expected: gain 4 → v1 = 0.8 V; gain −5 → v_o = −4 V; overall −20.)
**Rocky:** gains 4 and −5 ✓; v1 = 0.8 V, v_o = −4 V ✓; overall −20, no rails hit ✓.
Harder version (v_s = 2.5 V): v1 = 10 V ✓, v_o = −12 V ✓ (stage 2 saturates; the −20 shortcut would wrongly give −50 V).
Takeaways: overall gain holds only while every stage stays inside its rails; check each stage's output in order; a saturated stage breaks the virtual short.
**Status:** part 1 understood; Rocky confirmed comfortable.

### Part 2: Non-ideal op amp model
- Model: R_i between v+ and v−; dependent source A·v_d (v_d = v+ − v−) in series with R_o to the output. Real values: A ~10^5–10^8, R_i ~10^6–10^13 Ω, R_o ~10–100 Ω. Output still limited by the rails.
- R_i explains the tiny input current; R_o forms a divider with the load.
**Check question:** R_i = 1 MΩ, A = 10^5, R_o = 100 Ω, v_d = 50 µV, R_L = 900 Ω. Find input current, A·v_d, v_o.
**Rocky:** 50 pA ✓, 5 V ✓, 4.5 V ✓ (R_o/R_L divider).
**Status:** all correct first try. Waiting for Rocky to say he's comfortable before merging Concept 6.

### Explanation given
- Summing amp = inverting amp with several input resistors all feeding v−. Each input pushes its own current into the v− node; v− = 0 (virtual ground), so the currents don't interact.
- KCL at v−: v1/R1 + v2/R2 + v3/R3 = −v_o/Rf → v_o = −(Rf/R1·v1 + Rf/R2·v2 + Rf/R3·v3).

### Rocky's questions
*(none yet)*

### Check question
v1 = 2 V via R1 = 10k, v2 = −1 V via R2 = 20k, Rf = 40k. Find v_o. (Expected: −(4·2 + 2·(−1)) = −6 V.)
**Rocky:** currents 0.2 mA and −0.05 mA ✓; KCL written as 0.15 mA = −(v− − v_o)/40k ✗ (sign flipped; that equation gives +6 V); v_o = −6 V ✓ (correct, but doesn't follow from his equation); check "yes" ✓.
**Correction:** the Rf current flows v− → v_o, so it is +(v− − v_o)/Rf = −v_o/40k. Equation: 0.15 mA = −v_o/40k → v_o = −6 V.
**Status:** answer right, equation sign slipped again (third time on the Rf current). Asked him to rewrite the equation.
**Rocky's question:** "I thought I could set the direction to whichever I wanted."
**A:** Yes, any direction works as long as the KCL equation matches it. His equation set (current into node) = (current into node), which violates KCL (in = out). Two valid forms: arrow out of v− → in = out: 0.15 mA = (v− − v_o)/Rf; arrow into v− → sum in = 0: 0.15 mA + (v_o − v−)/Rf = 0. Both give −6 V.
*Wiki extra:* the in-vs-out consistency rule (table of the two forms).
**Rocky:** solved the second form, v_o = −6 V ✓. Rocky confirmed comfortable with the summing amp (merge of Concept 5 deferred until the difference amp is also understood).

### Part 2: Difference amplifier
- v1 → R1 → v−, Rf (called R2 in wiki) from v_o to v−; v2 → R3 → v+, R4 from v+ to ground.
- v+ = v2·R4/(R3+R4) (no current into v+, so unloaded divider); v− = v+; KCL at v−.
- Check question: R1 = 10k, R2 = 30k, R3 = 20k, R4 = 60k, v1 = 1 V, v2 = 2 V. (Expected: v+ = 1.5 V, v_o = 3 V; ratios match, so also (R2/R1)(v2 − v1) = 3 V.)
**Rocky:** asked "is the answer 1.5 V" (that was v+ = v−, step 1 ✓, not v_o). Then "is v_o 3 V" ✓ (correct). Did not show the KCL equation yet; asked for it to confirm the setup.
**Rocky's questions:**
- "Does the other side of the divider not do anything?" → The v− side can't change v+ (i+ = 0, so R3/R4 is an unloaded divider). But v+ → v− → KCL → v_o, so v2, R3, R4 all change v_o (e.g. R4 = 20k gives v_o = 1 V instead of 3 V). Superposition view: v1 alone = −3 V, v2 alone = +6 V, sum 3 V.
- "So it doesn't matter what v2, R3, R4 are, v_o is the same?" → No; misread. Showed the R4 change.
- "Can't I just do voltage division on the v− side?" → Yes, but the R1–R2 string runs between v1 and v_o, not ground: v− = v1 + (v_o − v1)·R1/(R1+R2). Gives v_o = 3 V. Breaks if anything else connects to v−.
- "I did voltage division at v− to find v−, then KCL at v− to find v_o. Correct?" → Correct only if the divider was R3/R4 (v+ side). R1/R2 can't give v− without v_o.
**Rocky's realization:** can't divide R1/R2 to find v− because the other end of R2 is at v_o (not ground). ✓
*Wiki extra:* "why you can't divide R1/R2 to ground" note, and v2/R3/R4 → v+ → v− → KCL → v_o chain.

### Session resumed 2026-11-16
Rocky asked to pick up where he left off. Recapped the two ideal rules and the KCL-at-v− method, then re-asked the check question above.
