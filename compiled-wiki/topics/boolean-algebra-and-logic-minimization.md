---
topic: Boolean Algebra and Logic Minimization
last_compiled: 2026-10-18
source_count: 3
status: active
---

# Boolean Algebra and Logic Minimization

## Summary [coverage: medium -- 3 sources]

COE 328 Ch 2 introduces gates, Boolean algebra, DeMorgan's theorems, standard forms (SOP/POS, minterms/maxterms) and NAND/NOR logic; Ch 4 turns that into Karnaugh-map minimization with don't cares and POS grouping. This is the core design toolchain: truth table → standard form → minimized expression → gates.

## Key Ideas [coverage: medium -- 3 sources]

- **Basic gates** and active-HIGH/active-LOW conventions; timing diagrams show output waveforms.
- **Boolean OR:** `1 + 1 = 1`.
- **DeMorgan:** break the bar *and* change the operation.
- **Standard forms:** SOP comes from the 1s of a truth table, POS from the 0s; `f = Σm(1-rows) = ΠM(0-rows)`.
- **NAND and NOR are universal;** dual symbols (bubbles) make NAND/NOR diagrams readable.
- **K-maps** work because adjacent cells differ in one variable: `PX + PX̄ = P`.
- **Grouping:** rectangles of 1, 2, 4, 8, 16 cells, with wrap-around; larger groups mean fewer literals.
- **Don't cares** may be used if they enlarge a group, never as a group alone.
- **POS on the map:** group the 0s; the sum-term literal for a 0 is uncomplemented.

## Formulas & Rules [coverage: medium -- 2 sources]

- Rows in a truth table: `N = 2^n`
- `A ⊕ B = AB̄ + ĀB`, XNOR `= AB + ĀB̄`
- `A + AB = A`, `A + ĀB = A + B`, `(A + B)(A + C) = A + BC`
- DeMorgan: `(XY)‾ = X̄ + Ȳ`, `(X + Y)‾ = X̄·Ȳ`
- 2-to-1 mux: `f = s̄x₁ + s x₂`
- K-map cells `= 2^n`; literals in a group's term `= n − log₂(group size)`
- 4-variable minterm number `= 8A + 4B + 2C + D`

## Problem-Solving Patterns [coverage: medium -- 3 sources]

- Circuit → expression → truth table; or truth table → SOP/POS → simplify.
- Expand a nonstandard SOP/POS to standard form by multiplying in missing variables.
- K-map recipe: label rows/columns in Gray order, map the 1s, make the largest groups first, cover each 1, ensure each group has a 1 of its own, read each term by dropping variables that change.
- Design problems (e.g. a majority circuit): write the truth table first.

## Common Mistakes [coverage: high -- 3 sources]

- Treating Boolean `1 + 1` like binary; splitting a bar without changing the operation; dropping parentheses in DeMorgan.
- Mixing SOP (from 1s) and POS (from 0s) rules; giving XOR more than two inputs.
- K-map labels as 00,01,10,11 instead of Gray; diagonal groups or groups of 3/6; forgetting wrap-around; stopping at small groups; redundant groups; groups made only of don't cares.

## Cross-Course Connections [coverage: medium -- 2 sources]

The gates here are built from transistors in [[cmos-and-implementation-technology]]; the CMOS pull-down network is literally DeMorgan applied to hardware. See [[duality-and-complement-thinking]].

## Gaps [coverage: high -- 3 sources]

No coverage yet of Quine-McCluskey / tabular minimization, hazards, or multi-output minimization.

## Sources [coverage: high -- 3 sources]

- [[../../wiki/content/courses/coe-328/index]]
- [[../../wiki/content/courses/coe-328/ch02-intro-to-logic-circuits]]
- [[../../wiki/content/courses/coe-328/ch04-optimization-of-combinational-logic]]
