# ELE 302 Ch 12: Three-Phase Circuits — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/ele-302/ch12-three-phase-circuits.md` and anything missing gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

Format reminder: short chunks, numbered steps, tables and diagrams.

## Concept plan (follows the wiki page)

1. Balanced three-phase voltages and sequence (abc vs acb), why they sum to zero
2. Y and Δ connections: phase vs line quantities
3. Y line voltage: √3 bigger, 30° ahead
4. Δ line current: √3 bigger, 30° behind; Δ→Y conversion (Z_Y = Z_Δ/3)
5. Balanced Y-Y and the per-phase equivalent
6. Power in a balanced system (constant power, P = √3 V_L I_L cos θ, sign convention)
7. Y-Δ, Δ-Δ, Δ-Y (all via convert-to-Y)
8. Unbalanced systems (nodal analysis)

---

## Concept 1: Balanced voltages and sequence — 🟡 in progress (paused 2026-11-25: Rocky switched to Ch 14 before answering the check)

### Explanation given
- Three-phase = three sinusoidal sources, same frequency. **Balanced** = same magnitude V_p and 120° apart.
- Positive (abc): V_an = V_p∠0°, V_bn = V_p∠−120°, V_cn = V_p∠+120°. Negative (acb): b and c swap.
- Sequence = the order the peaks arrive. Set by the spin direction; decides motor direction; swapping any two wires reverses it.
- Balanced set sums to zero: 1 + (−½ − j√3/2) + (−½ + j√3/2) = 0. Real parts: 1 − ½ − ½ = 0; imaginary parts cancel.

### Check question
V_an = 120∠30° V, positive sequence, balanced. Find V_bn and V_cn. Then: what is V_bn if the sequence is negative?
(Expected: abc → V_bn = 120∠−90°, V_cn = 120∠150°; acb → V_bn = 120∠150°.)
