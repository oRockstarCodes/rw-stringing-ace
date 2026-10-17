---
title: Damping in Series and Parallel RLC
aliases:
  - Damping
  - Neper frequency
  - Series vs parallel damping
tags:
  - concept
  - ele302
---

**Damping is how quickly a resistor drains away the energy swinging between L and C. In a series RLC a bigger $R$ means more damping, and in a parallel RLC a bigger $R$ means less.**

In [[ch08-second-order-circuits|Ch 8]] this shows up as two different formulas for the neper frequency $\alpha$, $\frac{R}{2L}$ for series and $\frac{1}{2RC}$ for parallel, and they go in opposite directions as $R$ changes. This page explains why, so the formulas aren't just something to memorize.

## Intuition

### What damping measures

Without resistance, an L and a C pass energy back and forth forever (see [[lc-oscillation|LC Oscillation]]). A resistor turns some of that energy into heat on every swing. The **neper frequency** $\alpha$ (in Np/s) measures how fast that happens, and comparing it with the resonant frequency $\omega_0 = \frac{1}{\sqrt{LC}}$ decides the shape of the response:

|Comparison|Case|What it looks like|
|---|---|---|
|$\alpha < \omega_0$|Underdamped|Oscillates inside a decaying envelope|
|$\alpha = \omega_0$|Critically damped|Fastest return to zero without overshooting|
|$\alpha > \omega_0$|Overdamped|Creeps back to zero, no oscillation|

So "more damping" means a bigger $\alpha$, which pushes the circuit toward overdamped. The real question is how $R$ affects $\alpha$, and that depends on **how much power the resistor burns**, which depends on how it's connected.

### Series: the resistor is in the path of the current

![[ele-302-rlc-series.svg]]
*Figure 1: Series RLC. The current swinging between L and C has to pass through R.*

In a series circuit, the current sloshing between L and C has to flow **through** the resistor. The power it burns is

$$
P = i^2 R
$$

For the same current, a bigger $R$ burns more power, so the energy drains away faster and the oscillation dies sooner. Look at the two extremes:

- **$R = 0$:** the resistor is just a wire. Nothing is burned, and the circuit rings forever (pure LC).
- **$R$ very large:** the resistor chokes the current so much that the capacitor can barely discharge, let alone swing past zero. It's heavily overdamped.

That's why the series formula **grows** with $R$:

$$
\alpha = \frac{R}{2L}
$$

The $L$ underneath makes sense too. A bigger inductor has more "inertia" (it stores more energy for the same current), so the same resistor takes longer to drain it.

### Parallel: the resistor sits beside the oscillation

![[ele-302-rlc-parallel.svg]]
*Figure 2: Parallel RLC. R has the same voltage as L and C, and only the current that leaks through it is lost.*

In a parallel circuit, the energy swings between L and C directly, and the resistor sits **beside** them with the same voltage $v$. Only the current that leaks through it, $i_R = \frac{v}{R}$, is lost. The power it burns is

$$
P = \frac{v^2}{R}
$$

Now a bigger $R$ lets **less** current leak away, so less energy is burned and the oscillation lasts **longer**. The extremes are flipped:

- **$R \to \infty$:** the resistor is an open circuit, as if it weren't there. Nothing leaks, and the circuit rings forever.
- **$R$ very small:** the resistor is nearly a short across the LC, which kills the voltage almost right away. It's heavily overdamped.

That's why the parallel formula **shrinks** as $R$ grows:

$$
\alpha = \frac{1}{2RC}
$$

### Same parts, connected both ways

Take $L = 1\ \text{H}$ and $C = \frac{1}{4}\ \text{F}$, so $\omega_0 = \frac{1}{\sqrt{1/4}} = 2$ rad/s, and try two resistors:

||$R = 1\ \Omega$|$R = 10\ \Omega$|
|---|---|---|
|Series, $\alpha = \frac{R}{2L}$|$\alpha = 0.5$: underdamped|$\alpha = 5$: overdamped|
|Parallel, $\alpha = \frac{1}{2RC}$|$\alpha = 2$: critically damped|$\alpha = 0.2$: underdamped|

Going from 1 Ω to 10 Ω pushes the series circuit **toward** overdamped and the parallel circuit **away** from it.

### The critical resistance

Setting $\alpha = \omega_0$ gives the resistance that makes each circuit exactly critically damped:

$$
\text{Series: } \frac{R}{2L} = \frac{1}{\sqrt{LC}} \;\Rightarrow\; R_c = 2\sqrt{\frac{L}{C}}, \qquad \text{Parallel: } \frac{1}{2RC} = \frac{1}{\sqrt{LC}} \;\Rightarrow\; R_c = \frac{1}{2}\sqrt{\frac{L}{C}}
$$

With the parts above, $\sqrt{L/C} = 2$, so $R_c = 4\ \Omega$ in series and $1\ \Omega$ in parallel (which is why the parallel 1 Ω entry in the table is critically damped). Then:

|Circuit|Underdamped|Critically damped|Overdamped|
|---|---|---|---|
|Series|$R < R_c$|$R = R_c$|$R > R_c$|
|Parallel|$R > R_c$|$R = R_c$|$R < R_c$|

### Circuits that are neither

The two formulas only work for a **pure** series or **pure** parallel RLC, which means one R, one L and one C, all in series or all in parallel (after turning off the sources). Plenty of circuits are neither. In Ch 8 Example 11, for instance, L is in parallel with C and the resistor is in series with that pair, so neither formula obviously fits.

When that happens, don't guess. Derive the circuit's own differential equation with KVL/KCL, put it in standard form, and read $\alpha$ off it:

$$
\frac{d^2 x}{dt^2} + \underbrace{2\alpha}_{\text{read }\alpha\text{ here}}\frac{dx}{dt} + \omega_0^2\,x = f
$$

In Example 11 that gives $\alpha = \frac{1}{2RC}$, which is the **parallel** formula even though the resistor is in series. Only the derivation tells you that. (It makes sense physically, since the L and C swap energy directly with each other and the resistor only sees the current going in and out of the pair.)

> [!tip] A source transformation can often turn an awkward circuit into a pure series or parallel one first. See [[source-transformation|Source Transformation]].

## Key formulas

**Neper frequency**

$$
\alpha = \frac{R}{2L} \quad \text{(series)}, \qquad \alpha = \frac{1}{2RC} \quad \text{(parallel)}
$$

**Resonant frequency** (same for both)

$$
\omega_0 = \frac{1}{\sqrt{LC}}
$$

**Critical resistance**

$$
R_c = 2\sqrt{\frac{L}{C}} \quad \text{(series)}, \qquad R_c = \frac{1}{2}\sqrt{\frac{L}{C}} \quad \text{(parallel)}
$$

**Power burned in the resistor**

$$
P = i^2 R \quad \text{(series: same current as L and C)}, \qquad P = \frac{v^2}{R} \quad \text{(parallel: same voltage as L and C)}
$$

- $\alpha$: neper frequency, how fast the response decays (Np/s)
- $\omega_0$: resonant frequency (rad/s)
- $R_c$: the resistance that makes the circuit critically damped
- $R$, $L$, $C$: the resistance, inductance and capacitance with the sources turned off

## Worked example

### Example 1: Same parts, two connections

An inductor $L = 0.5\ \text{H}$ and a capacitor $C = 2\ \text{mF}$ are connected with a resistor $R$. (a) Find the critical resistance for a series connection and for a parallel connection. (b) Classify the response for $R = 20\ \Omega$ and $R = 5\ \Omega$, both ways.

**(a)** First $\omega_0 = \frac{1}{\sqrt{(0.5)(0.002)}} = \frac{1}{\sqrt{0.001}} = 31.62\ \text{rad/s}$, and $\sqrt{L/C} = \sqrt{250} = 15.81$.

- Series: $R_c = 2(15.81) = 31.62\ \Omega$
- Parallel: $R_c = \frac{1}{2}(15.81) = 7.91\ \Omega$

**(b)**

|$R$|Series $\alpha = \frac{R}{2L}$|Result|Parallel $\alpha = \frac{1}{2RC}$|Result|
|---|---|---|---|---|
|20 Ω|$\frac{20}{1} = 20$|$20 < 31.62$: underdamped|$\frac{1}{2(20)(0.002)} = 12.5$|$12.5 < 31.62$: underdamped|
|5 Ω|$\frac{5}{1} = 5$|$5 < 31.62$: underdamped|$\frac{1}{2(5)(0.002)} = 50$|$50 > 31.62$: overdamped|

Shrinking $R$ from 20 Ω to 5 Ω made the series circuit **less** damped ($\alpha$ fell from 20 to 5) but the parallel circuit **more** damped ($\alpha$ rose from 12.5 to 50), enough to tip it into overdamped. You can see the same thing in part (a). 5 Ω is below the parallel $R_c$ of 7.91 Ω, and in parallel a resistance *below* $R_c$ means overdamped.

## Common mistakes

- Using $\alpha = \frac{R}{2L}$ on a parallel circuit, or $\frac{1}{2RC}$ on a series one
- Assuming "more resistance always means more damping". That's only true in series
- Forcing one of the two formulas onto a circuit that's neither pure series nor pure parallel, instead of deriving its equation
- Finding $R$ with the sources still connected. $\alpha$ comes from the circuit with the independent sources turned off

## Related

- [[lc-oscillation|LC Oscillation]]: the undamped oscillation that resistance damps
- [[second-order-differential-equations|Second-Order Differential Equations]]: reading $\alpha$ and $\omega_0$ off any equation
- [[source-transformation|Source Transformation]]: simplifying a circuit into series or parallel form

## Seen in

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]
