---
title: Source Transformation
aliases:
  - Source transformations
  - Thevenin-Norton conversion
tags:
  - concept
  - ele302
---

**A voltage source $V_s$ in series with a resistor $R$ behaves exactly the same, from the outside, as a current source $I_s = \frac{V_s}{R}$ in parallel with the same $R$.**

In [[ch08-second-order-circuits|Ch 8]] this is how a circuit with a current source and a resistor gets turned into a plain series loop (Example 9), or how two resistors next to a source get combined (Example 12). Once a circuit is a pure series or parallel RLC, you can use the standard $\alpha$ formulas or write a single KVL/KCL equation.

## Intuition

### Why the two are equivalent

![[ele-302-concept-source-transformation.svg]]
*Figure 1: A voltage source with a series resistor (left) and a current source with a parallel resistor (right). If $V_s = I_s R$, nothing connected to terminals a and b can tell them apart.*

"Equivalent" means: whatever you connect to terminals a and b, it sees the same voltage and current either way. Check by writing the relation between the terminal voltage $v$ and the current $i$ flowing out of terminal a:

- **Left (voltage source):** the resistor drops $iR$, so $v = V_s - iR$.
- **Right (current source):** of the source's $I_s$, the part $\frac{v}{R}$ goes through the resistor and the rest leaves through a, so $i = I_s - \frac{v}{R}$, or $v = I_s R - iR$.

These are the same line if $V_s = I_s R$. Two quick checks:

- **Open-circuit voltage** ($i = 0$): left gives $V_s$; right gives $I_s R$. Same.
- **Short-circuit current** ($v = 0$): left gives $\frac{V_s}{R}$; right gives $I_s$. Same.

A source and resistor are completely described by these two numbers, so matching them makes the two versions interchangeable. (This is the same idea as Thévenin and Norton equivalents, applied to the smallest possible circuit.)

### Getting the direction right

The current source's arrow points toward the voltage source's **$+$ terminal**. Both push current out of terminal a and into whatever is connected. If you flip the arrow, you've flipped the sign of the source.

### What stays the same and what doesn't

The equivalence is only about what happens **outside** terminals a and b. Inside, things are different. For example, the power in the resistor usually isn't the same in the two versions (see Example 2 below). So:

- Use a source transformation to find voltages and currents in the **rest** of the circuit.
- If the question asks about the transformed resistor or source itself, go back to the original circuit for that part.

### When it can and can't be used

- The resistor must be **directly** in series with the voltage source (nothing branching off between them), or **directly** in parallel with the current source.
- An ideal voltage source with no series resistor, or an ideal current source with no parallel resistor, can't be transformed: $I_s = \frac{V_s}{0}$ is undefined.
- Time-varying sources work the same way. A $12u(t)$ A source with 2 Ω in parallel becomes a $24u(t)$ V source with 2 Ω in series, and it switches on at the same instant.

### Chaining transformations

You can go back and forth to combine resistors. To combine a resistor that's in **series** with a current source's parallel resistor, first turn the current source into a voltage source (now the resistors are in series and simply add), then turn it back if you need a current source again. Example 1 does exactly this.

## Key formulas

$$
V_s = I_s R, \qquad I_s = \frac{V_s}{R}
$$

- $V_s$: voltage source value, with $R$ in **series**
- $I_s$: current source value, with $R$ in **parallel**, arrow pointing toward the $+$ terminal of $V_s$
- $R$: the same resistor value in both versions

## Worked examples

### Example 1: Combining resistors around a current source

A 6 A current source has a 1 Ω resistor in parallel with it, and its output then passes through another 1 Ω in series (the situation in Ch 8 Example 12 after the switch opens). Reduce this to a single current source with a parallel resistor.

1. **6 A with 1 Ω in parallel** → voltage source $V_s = (6)(1) = 6\ \text{V}$, with 1 Ω in series.
2. **Add the next 1 Ω**, now in series: 6 V with $1 + 1 = 2\ \Omega$ in series.
3. **Back to a current source:** $I_s = \frac{6}{2} = 3\ \text{A}$, with 2 Ω in parallel.

Check with the open-circuit voltage and short-circuit current of the original. Open circuit: no current through the series 1 Ω, so all 6 A goes through the parallel 1 Ω, giving 6 V. Short circuit: the 6 A splits between two equal 1 Ω paths, so 3 A flows out. The result (3 A with 2 Ω) gives $3 \times 2 = 6$ V open-circuit and 3 A short-circuit ✓.

### Example 2: The load sees the same thing; the resistor doesn't

A 12 V source with a 4 Ω series resistor drives a 2 Ω load. Find the load current, then repeat with the transformed source, and compare the power in the 4 Ω.

**Original:** one loop, $i = \frac{12}{4 + 2} = 2\ \text{A}$. The 4 Ω burns $(2)^2(4) = 16\ \text{W}$.

**Transformed:** $I_s = \frac{12}{4} = 3\ \text{A}$ with 4 Ω in parallel. The 3 A splits between the 4 Ω and the 2 Ω load (current divider):

$$
i_{load} = 3 \cdot \frac{4}{4 + 2} = 2\ \text{A} \quad ✓
$$

The load voltage is $(2)(2) = 4$ V in both versions. But the 4 Ω now has 4 V across it and burns $\frac{4^2}{4} = 4\ \text{W}$, not 16 W. The load can't tell the difference, but the resistor inside the transformation can.

## Common mistakes

- Pointing the current source's arrow the wrong way. It points toward the voltage source's $+$ terminal
- Transforming a resistor that isn't directly in series (or parallel) with the source
- Using the transformed circuit to find the power in the transformed resistor or source
- Forgetting to carry the $u(t)$ along when transforming a step source

## Related

- [[damping-series-vs-parallel|Damping in Series and Parallel RLC]]: why getting a pure series or parallel circuit helps

## Seen in

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]] (Examples 9 and 12)
