---
topic: Second-Order Circuits
last_compiled: 2026-10-18
source_count: 7
status: active
---

# Second-Order Circuits

## Summary [coverage: high -- 7 sources]

ELE 302 Ch 8 and five supporting concept notes cover RLC circuits: stored energy in capacitors and inductors, source transformation, LC oscillation, the second-order differential equation and its three damping cases, and how damping differs for series vs parallel RLC. Method: write the ODE, find the natural solution from α and ω₀, find the initial conditions, add the forced solution, and fit the constants. Quiz 2 (second order) was Oct 13; the midterm is Oct 27.

## Key Ideas [coverage: high -- 7 sources]

- **Energy can't change instantly:** only `v_C` and `i_L` are continuous at a switch; `i_C` and `v_L` may jump.
- **LC oscillation:** energy swings between E-field (C) and B-field (L); current peaks when `v_C` crosses zero; resistance makes the oscillation decay.
- **Damping:** overdamped (α > ω₀), critically damped (α = ω₀), underdamped (α < ω₀).
- **Series vs parallel:** the resistor sits in the current path in series (more R = more damping) and beside the oscillation in parallel (more R = less damping).
- **Source transformation** swaps a voltage source + series R with a current source + parallel R; the load sees the same thing, the resistor does not.
- A capacitor at DC steady state is an open circuit (zero current, but it can hold a voltage); an inductor is a short.

## Formulas & Rules [coverage: high -- 4 sources]

- `v_L = L di/dt`, `i_C = C dv/dt`; `w_L = ½ L i²`, `w_C = ½ C v²`
- Standard form: `x'' + 2αx' + ω₀²x = f`; roots `s = −α ± √(α² − ω₀²)`
- α: `R/2L` (series), `1/2RC` (parallel); `ω₀ = 1/√(LC)`; `ω_d = √(ω₀² − α²)`
- Natural solution: `A₁e^{s₁t} + A₂e^{s₂t}`; `(A₁ + A₂t)e^{−αt}`; `Ae^{−αt}cos(ω_d t + θ)`
- Forced (constant source): `x_F = f/ω₀²`; total `x = x_N + x_F`
- Critical resistance: `R_c = 2√(L/C)` (series), `½√(L/C)` (parallel)
- Underdamped form conversion: `B₁ = A cos θ`, `B₂ = −A sin θ`, `A = √(B₁² + B₂²)`

## Problem-Solving Patterns [coverage: high -- 3 sources]

1. Find initial and final values (capacitor open, inductor short at DC).
2. Turn the sources off, write KVL/KCL, differentiate away integrals, and reach standard form.
3. Compute α and ω₀, classify the damping.
4. Apply initial conditions to the **total** solution x_N + x_F (use `x(0⁺)` and `x'(0⁺)`).
5. Choose R, C to hit a target α or ω_d by solving the formulas backward.
6. Put θ in the correct quadrant and use radians.

## Common Mistakes [coverage: high -- 7 sources]

- Series α on a parallel circuit, or vice versa; deriving the ODE is the safe fallback.
- Forgetting the forced part when applying initial conditions; forgetting the `t` in the repeated-root term.
- Using ω₀ instead of ω_d inside the cosine; degrees vs radians; wrong quadrant from tan⁻¹.
- Assuming `i_C` or `v_L` is continuous; wrong sign on `dx/dt(0⁺)` from mislabelled reference directions.
- Computing α with sources still on; assuming more resistance always means more damping.
- Pointing the transformed current source the wrong way; using the transformed circuit for power in the transformed elements; dropping `u(t)`.
- Treating a DC capacitor as zero voltage; thinking big voltage implies big current.

## Cross-Course Connections [coverage: medium -- 2 sources]

The resistive-vs-reactive choice of formula is an instance of [[rule-applied-outside-its-domain]]; the series/parallel pair is a case of [[duality-and-complement-thinking]]. The same L/C energy exchange returns in the ELE 302 Laplace chapters and frequency response (not yet written), and capacitance/MOS structure appears in PCS 224 and [[cmos-and-implementation-technology]].

## Gaps [coverage: high -- 7 sources]

Laplace-domain solution of the same circuits (Ch 15–16) is not written; so there is no s-domain cross-check. Examples marked (T) are tutorial problems.

## Sources [coverage: high -- 7 sources]

- [[../../wiki/content/courses/ele-302/index]]
- [[../../wiki/content/courses/ele-302/ch08-second-order-circuits]]
- [[../../wiki/content/courses/ele-302/concepts/capacitors-and-inductors]]
- [[../../wiki/content/courses/ele-302/concepts/damping-series-vs-parallel]]
- [[../../wiki/content/courses/ele-302/concepts/lc-oscillation]]
- [[../../wiki/content/courses/ele-302/concepts/second-order-differential-equations]]
- [[../../wiki/content/courses/ele-302/concepts/source-transformation]]
