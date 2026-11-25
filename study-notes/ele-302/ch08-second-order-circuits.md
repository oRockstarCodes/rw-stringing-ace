# ELE 302 Ch 8: Second-Order Circuits — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/ele-302/ch08-second-order-circuits.md` and anything missing (alternate explanations, extra intuition) gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

Format reminder: Rocky wants short chunks, numbered steps, tables and diagrams (see Ch 5 sessions).

## Concept plan (follows the wiki page)

1. Energy can't change instantly (continuity of v_C and i_L)
2. DC steady state: L = short, C = open (see `dc-steady-state-explained.md`)
3. Why energy swings between L and C
4. Step 1: writing the differential equation (series and parallel RLC), α and ω₀
5. Step 2: the characteristic equation and the three damping cases
6. Step 3: initial conditions (0⁻, 0⁺ and the slopes)
7. Step 4: total solution (natural + forced, solving for the constants)

---

## Concept 7: The total solution (Step 4) — ✅ merged into wiki

Recipe: x_F (derivatives → 0, ω₀²·x_F = f, or DC steady state), x_N from the roots, x_T = x_N + x_F, apply x(0) and x'(0) to x_T, solve for the constants, then verify.
Rocky worked x'' + 6x' + 8x = 16, x(0) = x'(0) = 0 step by step: x_F = 2 ✓ (asked how to find it), roots −2, −4 overdamped ✓, x_T = 2 + A₁e^(−2t) + A₂e^(−4t) ✓, 2 + A₁ + A₂ = 0 ✓, −2A₁ − 4A₂ = 0 ✓, A₁ = −4, A₂ = 2 ✓, verification x(0) = 0, x'(0) = 0, x(∞) = 2 ✓. Final: x(t) = 2 − 4e^(−2t) + 2e^(−4t).
Critical and underdamped totals were previewed (A, θ via Eq. 8.18) but only the overdamped one was drilled.
Merged into `ch08-second-order-circuits.md`: tip after the Step 4 intro (x_F disappears from the slope equation; verify against x(0), x'(0), x(∞); this example as a quick check). Rocky confirmed he's comfortable.

---

## Concept 6: Initial conditions (Step 3) — ✅ merged into wiki

Circuit used: 12 V source, switch, branch A (3 Ω + 2 H), branch B (6 Ω + 0.5 F); switch opens at t = 0 after a long time.
Rocky: i_L(0⁺) = 4 A ✓, v_C(0⁺) = 12 V ✓; asked "when the switch happens, does current instantly flow through the capacitor?" (yes, i_C can jump; only v_C is continuous); asked how to know the direction (KCL at the top node: inductor's 4 A leaves down branch A, so it returns up branch B, out of the capacitor's + terminal, so i_C = −4 A); dv_C/dt(0⁺) = −8 V/s ✓; top-to-bottom voltage through branch B = −12 V ✓; v_L(0⁺) = −24 V ✓ (so di_L/dt(0⁺) = −12 A/s).
Merged into `ch08-second-order-circuits.md`: KCL direction method, into/out-of-+ sign table, same-voltage-branch trick for v_L, and this circuit as a worked example (before Example 8.5). Rocky said he understands.

---

## Concept 5: Characteristic equation and the three cases — ✅ merged into wiki

Explained: guess x = Ae^(st), plug in, get s² + 2αs + ω₀² = 0, roots s = −α ± √(α² − ω₀²); three forms (overdamped, critical, underdamped). What α (decay rate, 1/α time scale) and ω₀ (natural swing, 2π/ω₀ per cycle) mean; x_N vs x_F vs x_T.
Rocky's checks: α < ω₀ → underdamped, α = ω₀ → critical, α > ω₀ → over (his own recall ✓). For x'' + 2x' + 5x = 0: α = 1 ✓, ω₀ = 2.24 ✓, underdamped ✓, roots −1 ± j2 ✓, x_N = A e^(−t) cos(2t + θ) ✓. Questions: "what are α and ω?", "what do they represent?", "what is x_N?", "how do you find A and θ?" (previewed Step 4 with x(0) = 2, x'(0) = 0 → A = √5, θ = −0.4636 rad).
Overdamped and critical forms were explained but not drilled.
Merged into `ch08-second-order-circuits.md`: time-scale meaning of α and ω₀ (1/α, 2π/ω₀; which is bigger decides ringing). Rocky said he understands.

---

## Concept 4: Writing the differential equation (series and parallel) — ✅ merged into wiki

Series check (R = 8, L = 2, C = 0.125): d²i/dt² + 4 di/dt + 4i = 0 ✓, α = 2 ✓, ω₀ = 2 ✓, critically damped with roots −2, −2 ✓. (Mis-matched answer list at first; resolved by confirming 1/LC is the last coefficient and ω₀ = 1/√(LC).)
Parallel check (R = 2, L = 0.5, C = 0.25): Rocky asked for a diagram and whether to use KCL (yes, KCL at the top node). First answer v'' + 4v' + 8v = 0 ✗ (doubled the middle coefficient; 1/(RC) is already 2α). Corrected: v'' + 2v' + 8v = 0 ✓, α = 1 ✓, ω₀ = 2.83 ✓, underdamped ✓ (ω_d = √7 ≈ 2.65).
Side questions: what critically damped means (boundary, fastest no-overshoot settling, R = 2√(L/C) in series); what the graph's y-axis is (generic response, starts at 1, settles to 0); whether underdamped goes negative (yes if source-free, it alternates; with a source it swings around x_F); that energy moves between L and C with R taking some each swing; which voltage is "v" (series: voltage across each element, total across chain 0; parallel: the common voltage); what v(0) / v_o means (initial value of the labeled variable; read the + / − marks).
Merged into `ch08-second-order-circuits.md`: series-vs-parallel comparison table plus source-free note (before Example 8.2), and an "what underdamped looks like / critical damping is the boundary" note (before Example 8.3). Rocky said he understands and moved on.

---

## Concept 3: Why energy swings between L and C — ✅ merged into wiki

Check 1 (1 mF at 10 V into 0.1 H, no resistance): start energy 0.05 J ✓, all of it in L when v_C = 0 ✓, i = 1 A ✓.
Check 2 (v_C = 5 V): w_C = 0.0125 J ✓, w_L = 0.0375 J ✓, current smaller ✓ (i = 0.866 A; same as wiki Example 1(d) method).
Merged into `lc-oscillation.md`: four-stage table (v_C, i_L, where the energy is) and a note on why the current keeps flowing (shrinking field induces a voltage that opposes the fall). The page still has a mass-on-a-spring analogy; asked Rocky whether to keep it. Rocky confirmed he's comfortable.

---

## Concept 2: DC steady state — ✅ merged into wiki

Check 1 (series R, L, C, 12 V, 4 Ω): i = 0, v_C = 12 V ✓ (skipped saying what L and C act like).
Check 2 (12 V, branch A: 3 Ω + L; branch B: 6 Ω + C): answered i_L = 0, v_C = 0 ✗. Correct: i_L = 4 A (L is a short, only the 3 Ω limits it), v_C = 12 V (C is open, so no drop across the 6 Ω). Mix-up: setting each element's *own* state quantity to zero instead of the other one.
Retry (10 V, 5 Ω + L, 4 Ω + C): i_L = 2 A, v_C = 10 V ✓.
Merged into `ch08-second-order-circuits.md`: warning under Figure 8.1 ("the zero belongs to the other quantity", with the 4 A / 12 V examples). Rocky confirmed he's comfortable.

---

## Concept 1: Energy can't change instantly — ✅ merged into wiki

Merged into `ch08-second-order-circuits.md`: the field-and-induced-voltage chain, in a tip after the continuity rule. (An earlier flywheel analogy was removed at Rocky's request; he dislikes it. The concept page `capacitors-and-inductors.md` intuition section was rewritten to use fields and induced voltage instead.) Extra questions covered: "how does the inductor work physically?" and "does the field oppose the current?" (no; the *changing* field induces a voltage that opposes the *change* in current, in either direction). Rocky confirmed he's comfortable.

### Explanation given
- Inductor: v_L = L di/dt. If i jumped, di/dt would be infinite, so v_L would be infinite. So **i_L can't jump**.
- Capacitor: i_C = C dv/dt. If v jumped, i_C would be infinite. So **v_C can't jump**.
- Same idea with energy: w = ½Li², ½Cv². Changing energy in zero time needs infinite power.
- At a switch: i_L(0⁺) = i_L(0⁻), v_C(0⁺) = v_C(0⁻). Everything else (resistor voltages, i_C, v_L) is allowed to jump.
- Worked pattern (wiki Ex 8.1): 12 V, 4 Ω, 2 H series, switch closes at t = 0: i = 0 → 0 → 3 A; v_L = 0 → 12 V → 0; v_R = 0 → 0 → 12 V.

### Rocky's questions
- "Why does v_L become 0 at infinity?" → v_L = L di/dt and i levels off (di/dt = 0); also KVL: v_R = 12 V uses the whole source, nothing left for L.
- "Can you explain why, from an intuition standpoint?" → Flywheel analogy: current = wheel speed, v_L = push needed to change the speed, L = weight of the wheel, resistor = friction. A wheel at constant speed needs no push; only changing the speed does. It also can't jump to full speed (infinite push), which is why i_L is continuous while v_L can jump.
*Wiki extra:* intuition paragraph for why v_L → 0 and why i_L can't jump (written with the field-and-induced-voltage explanation; flywheel dropped).

### Check question
12 V → R = 5 Ω → L = 4 H in series, switch closes at t = 0 with no stored energy. Find i, v_R and v_L at 0⁻, 0⁺ and ∞. (Expected: i 0, 0, 2.4 A; v_R 0, 0, 12 V; v_L 0, 12 V, 0.)
**Rocky:** 0⁻ column ✓ (0, 0, 0); 0⁺: i = 0, v_R = 0, v_L = 12 V ✓; ∞: i = 2.4 A, v_R = 12 V, v_L = 0 ✓. Starting slope di/dt(0⁺) = v_L/L = 12/4 = 3 A/s ✓.
**Status:** all correct. Waiting for Rocky to say he's comfortable before merging.
