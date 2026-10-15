---
title: "Ch 8: Second-Order Circuits"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 8** (§8.1–8.7)

A **second-order circuit** has two energy-storage elements, usually an [[capacitors-and-inductors|inductor and a capacitor]], that can't be combined into one. They can't be merged because they relate voltage and current in opposite ways: an inductor's voltage depends on the **derivative** of its current, while a capacitor's voltage depends on the **integral** of its current. Having both in one circuit makes it obey a second-order differential equation, so its response needs **two** initial conditions instead of one. Depending on how much resistance there is, the response either dies away smoothly or rings (oscillates) as energy sloshes back and forth between the L and the C.

Every problem in this chapter is solved with basically the same four steps:

1. **Write the differential equation** for the circuit after the switch moves, using KVL and/or KCL.
2. **Find the natural solution** from the homogeneous equation and its characteristic equation.
3. **Find the initial conditions** from the circuit before and just after switching.
4. **Write the total solution** (natural + forced) and use the initial conditions to find the constants.

> [!tip] Background pages
> This chapter sticks to the method for solving second-order circuits. These pages explain the ideas behind it in more detail:
> - [[capacitors-and-inductors|Capacitors and Inductors]]: the element laws, stored energy, and why $v_C$ and $i_L$ can't jump
> - [[lc-oscillation|LC Oscillation]]: why energy swings back and forth between L and C
> - [[damping-series-vs-parallel|Damping in Series and Parallel RLC]]: why $R$ does opposite things in series and parallel
> - [[second-order-differential-equations|Second-Order Differential Equations]]: why the method works, the three cases, and finding the constants
> - [[source-transformation|Source Transformation]]: simplifying a circuit before solving it

## Notes

### Key Concept: Energy Can't Change Instantly

Everything in this chapter rests on one physical fact: **the energy stored in an inductor or a capacitor can't change instantaneously.** Here's why, and what it means.

> [!tip] Need a refresher on the elements themselves? [[capacitors-and-inductors|Capacitors and Inductors]] covers how each one is built, where its element law comes from, series and parallel combinations, and worked examples.

**Inductor.** The voltage across an inductor depends on how fast its current changes. **Capacitor.** The current into a capacitor depends on how fast its voltage changes:

$$
v_L = L\frac{di_L}{dt}, \qquad i_C = C\frac{dv_C}{dt} \tag{8.1}
$$

Suppose the inductor current jumped from one value to another in zero time. Then $\frac{di_L}{dt} = \frac{\Delta i}{\Delta t}$ with $\Delta t \to 0$ would be infinite, so $v_L$ would be infinite. No real circuit can supply an infinite voltage, so **inductor current can't jump**. The same argument with $i_C = C\frac{dv_C}{dt}$ shows that **capacitor voltage can't jump** (it would need infinite current).

The same idea in terms of energy: integrating power $p = vi$ over time gives the stored energy

$$
w_L = \tfrac{1}{2} L\,i_L^2, \qquad w_C = \tfrac{1}{2} C\,v_C^2 \tag{8.2}
$$

Changing that energy in zero time would need infinite power. Since $w_L$ depends only on $i_L$ and $w_C$ only on $v_C$, those are the two quantities that must be continuous at a switching instant:

$$
i_L(0^+) = i_L(0^-), \qquad v_C(0^+) = v_C(0^-) \tag{8.3}
$$

Here $0^-$ means "just before the switch moves" and $0^+$ means "just after". Nothing else is protected: resistor voltages, the capacitor's *current* and the inductor's *voltage* are all allowed to jump.

> [!note] Integral forms
> Rearranging Eq. (8.1) and integrating from 0 to $t$ gives each element's value at any time, starting from its initial value ([[capacitors-and-inductors#Integral form|more on the integral form]]). You'll use these in Step 1 to write KVL/KCL with only one unknown:
> $$i_L(t) = \frac{1}{L}\int_0^t v_L\,dt + i_L(0), \qquad v_C(t) = \frac{1}{C}\int_0^t i_C\,dt + v_C(0)$$

**At DC steady state** (a circuit that has been switched on for a long time, or $t \to \infty$), nothing is changing anymore, so every derivative is zero:

- $v_L = L \cdot 0 = 0$: the inductor has no voltage across it, so it acts like a **short circuit**.
- $i_C = C \cdot 0 = 0$: the capacitor passes no current, so it acts like an **open circuit**.

You can also see this from impedance. DC means $\omega = 0$, so $Z_L = j\omega L = 0$ (a short) and $Z_C = \frac{1}{j\omega C} \to \infty$ (an open). See [[capacitors-and-inductors#DC steady state|DC steady state]] for the matching rules at the instant a source switches on.

![[ele-302-rlc-dc-equivalents.svg]]
*Figure 8.1: At DC steady state, an inductor acts like a short and a capacitor acts like an open.*

### Why Energy Swings Between L and C

A capacitor stores energy in its voltage ($\frac{1}{2}Cv^2$) and an inductor in its current ($\frac{1}{2}Li^2$). Connected together, they keep handing that energy to each other: the capacitor discharges into the inductor, and the inductor's current (which can't stop instantly) carries on and charges the capacitor the other way. So the voltage and current **oscillate**, like a mass bouncing on a spring. A resistor acts like friction, turning a little energy into heat on every swing, so the oscillation dies out. That's the damping that decides which of the three cases in Step 2 you get.

> [!note] The full story, with a graph of one cycle, the mass-on-a-spring analogy and a worked example, is in [[lc-oscillation|LC Oscillation]].

### Step 1: Write the Differential Equation

Use the circuit **after** the switch moves ($t > 0$). Pick the variable you're solving for, write KVL and/or KCL, then turn everything into that one variable:

1. Write KVL (around a loop) or KCL (at a node).
2. Replace each element's voltage or current using Eq. (8.1), or the integral forms above, so the only unknown is your chosen variable.
3. If there's an integral, differentiate the whole equation once to get rid of it. Any constant (like a DC source, or $v_C(0)$) differentiates to 0.
4. Divide by the coefficient of the highest derivative, so the equation is in standard form. 

**Example: series RLC.** In Figure 8.2, the same current $i$ flows through every element. KVL around the loop, with a source $V_s$ if there is one:

![[ele-302-rlc-series.svg]]
*Figure 8.2: A series RLC circuit driven by a source $V_s$. All four elements carry the same current $i$. For a source-free circuit, $V_s = 0$.*

$$
Ri + L\frac{di}{dt} + \underbrace{\frac{1}{C}\int_0^t i\,dt + v_C(0)}_{v_C} = V_s
$$

Differentiate once (the integral becomes $i$; the constants $v_C(0)$ and DC $V_s$ become 0), then divide by $L$:

$$
\frac{d^2 i}{dt^2} + \frac{R}{L}\frac{di}{dt} + \frac{1}{LC}\,i = 0 \tag{8.4}
$$

**Example: parallel RLC.** In Figure 8.3, every element has the same voltage $v$. KCL at the top node, with a source current $I_s$ if there is one:

![[ele-302-rlc-parallel.svg]]
*Figure 8.3: A parallel RLC circuit driven by a source $I_s$. All four elements share the same voltage $v$. For a source-free circuit, $I_s = 0$.*

$$
\frac{v}{R} + \underbrace{\frac{1}{L}\int_0^t v\,dt + i_L(0)}_{i_L} + C\frac{dv}{dt} = I_s
$$

Differentiate once, then divide by $C$:

$$
\frac{d^2 v}{dt^2} + \frac{1}{RC}\frac{dv}{dt} + \frac{1}{LC}\,v = 0 \tag{8.5}
$$

**Standard form.** Every second-order circuit ends up looking like this, where $x$ is whichever voltage or current you chose and $f$ is whatever's left on the right (often 0 or a constant):

$$
\frac{d^2 x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2\,x = f \tag{8.6}
$$

Matching Eqs. (8.4) and (8.5) against Eq. (8.6) gives two numbers that describe the circuit:

$$
\alpha = \frac{R}{2L} \quad \text{(series)} \tag{8.7}
$$

$$
\alpha = \frac{1}{2RC} \quad \text{(parallel)} \tag{8.8}
$$

$$
\omega_0 = \frac{1}{\sqrt{LC}} \quad \text{(both)} \tag{8.9}
$$

$\alpha$ (the **neper frequency**, in Np/s) measures how fast resistance drains energy out of the circuit. $\omega_0$ (the **resonant frequency**, in rad/s) measures how fast energy wants to swing between L and C.

**$R$ does opposite things in series and parallel.** In a series circuit the oscillating current flows *through* the resistor, so a bigger $R$ burns more energy and means **more** damping. In a parallel circuit the resistor sits *beside* L and C and only the current leaking through it is lost, so a bigger $R$ means **less** damping. That's why Eq. (8.7) grows with $R$ and Eq. (8.8) shrinks. The power argument, a comparison table and the critical resistance are in [[damping-series-vs-parallel|Damping in Series and Parallel RLC]].

> [!warning] Eqs. (8.7) and (8.8) only apply to a **pure** series or **pure** parallel RLC, and many circuits are neither (Example 11 is one). When in doubt, derive the circuit's own differential equation with KVL/KCL, put it in standard form, and read $\alpha$ off the middle coefficient, which is $2\alpha$. That always works.

> [!tip] A source transformation often turns a messier circuit into a plain series or parallel RLC: a current source with a resistor in parallel can be swapped for a voltage source with the same resistor in series ($V = IR$), and the other way round. See [[source-transformation|Source Transformation]].

### Step 2: Find the Natural Solution

The **natural solution** $x_N$ is how the circuit behaves on its own, with no source pushing it. Get it from the **homogeneous equation**: set the right-hand side of Eq. (8.6) to 0.

$$
\frac{d^2 x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2\,x = 0
$$

**How to solve it.** Try $x = Ae^{st}$. Every derivative of $e^{st}$ is just $s$ times itself ($\frac{d}{dt}Ae^{st} = sAe^{st}$, $\frac{d^2}{dt^2}Ae^{st} = s^2Ae^{st}$), so substituting gives

$$
(s^2 + 2\alpha s + \omega_0^2)\,Ae^{st} = 0
$$

$Ae^{st}$ is never zero (unless the whole response is zero), so the bracket must be. That's the **characteristic equation**:

$$
s^2 + 2\alpha s + \omega_0^2 = 0 \tag{8.10}
$$

It's a quadratic, so the quadratic formula gives its two roots:

$$
s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2} \tag{8.11}
$$

What's under the square root decides which of three cases you're in:

|Case|Condition|Roots|Natural solution|
|---|---|---|---|
|Overdamped|$\alpha > \omega_0$|Two different real numbers|Eq. (8.12): decays, no oscillation|
|Critically damped|$\alpha = \omega_0$|One repeated real number, $s = -\alpha$|Eq. (8.13): fastest decay without oscillating|
|Underdamped|$\alpha < \omega_0$|Complex pair, $s = -\alpha \pm j\omega_d$|Eq. (8.14): oscillates inside a decaying envelope|

![[ele-302-rlc-damping.svg]]
*Figure 8.4: The three cases, all starting from the same value with zero initial slope.*

$$
x_N = A_1 e^{s_1 t} + A_2 e^{s_2 t} \tag{8.12}
$$

$$
x_N = A_1 e^{-\alpha t} + A_2\,t\,e^{-\alpha t} \tag{8.13}
$$

$$
x_N = A\,e^{-\alpha t}\cos(\omega_d t + \theta) \tag{8.14}
$$

$$
\omega_d = \sqrt{\omega_0^2 - \alpha^2} \tag{8.15}
$$

- In the underdamped case, $e^{-\alpha t}$ is the shrinking envelope, $\omega_d$ is how fast it oscillates, and $\theta$ is a phase shift.
- The constants ($A_1$, $A_2$, or $A$ and $\theta$) are unknown until Step 4.
- The textbook writes the underdamped case as $e^{-\alpha t}(B_1\cos\omega_d t + B_2\sin\omega_d t)$. It's the same function, and either form gets full marks.

> [!note] Why the repeated root needs the extra $t$, how complex roots turn into a decaying cosine (Euler's formula), and how to convert between the two underdamped forms are covered in [[second-order-differential-equations|Second-Order Differential Equations]].

### Step 3: Find the Initial Conditions

A second-order equation needs **two** initial conditions: the starting value $x(0)$ and the starting slope $\frac{dx}{dt}(0)$, for the variable you chose in Step 1.

**Before switching ($t = 0^-$).** If the circuit has been in this state for a long time, it's at DC steady state. Redraw it with every inductor as a **short** and every capacitor as an **open** (Figure 8.1), then use ordinary DC analysis to find $i_L(0^-)$ and $v_C(0^-)$.

**After switching ($t = 0^+$).** Redraw the circuit with the switch in its new position. By Eq. (8.3), the inductor still carries $i_L(0^-)$ and the capacitor still holds $v_C(0^-)$, so treat them as a current source and a voltage source with those values. Then use KVL/KCL on this circuit to find whatever else you need, especially the inductor voltage or capacitor current, which give the slopes (measure them with the [[capacitors-and-inductors#Passive sign convention|passive sign convention]], or the slope's sign flips):

$$
\frac{di_L}{dt}(0^+) = \frac{v_L(0^+)}{L}, \qquad \frac{dv_C}{dt}(0^+) = \frac{i_C(0^+)}{C} \tag{8.16}
$$

> [!tip] If your Step 1 variable isn't $i_L$ or $v_C$ (say, a resistor current), find its value and slope from the $0^+$ circuit too. Only $i_L$ and $v_C$ are guaranteed to carry over from $0^-$.

### Step 4: Write the Total Solution

The **forced solution** $x_F$ is where the circuit ends up as $t \to \infty$, once all the transients have died out. With DC sources, that's another DC steady state: redraw the final circuit with L shorted and C open and solve it. (You can also get it from Eq. (8.6) by setting the derivatives to 0: $\omega_0^2\,x_F = f$.)

The **total solution** is the two added together:

$$
x_T = x_N + x_F \tag{8.17}
$$

Now use the two initial conditions from Step 3 on the **total** solution $x_T$ (not on $x_N$ alone) to get two equations for the two unknown constants.

For the **underdamped** form, the derivative at $t = 0$ is the part that trips people up. Differentiating with the product rule:

$$
\frac{d}{dt}\left[A e^{-\alpha t}\cos(\omega_d t + \theta)\right] = A e^{-\alpha t}\left[-\alpha\cos(\omega_d t + \theta) - \omega_d\sin(\omega_d t + \theta)\right]
$$

At $t = 0$, $e^0 = 1$, so the two conditions become:

$$
A\cos\theta = x(0) - x_F, \qquad -\alpha A\cos\theta - \omega_d A\sin\theta = \frac{dx}{dt}(0) \tag{8.18}
$$

Solve the first for $A\cos\theta$, then the second for $A\sin\theta$. Then:

- $A = \sqrt{(A\cos\theta)^2 + (A\sin\theta)^2}$
- $\theta$ is the angle whose cosine and sine have those **signs**. Picture the point $(A\cos\theta,\ A\sin\theta)$ on a graph and take its angle from the positive horizontal axis, in **radians**.

> [!warning] A calculator's $\tan^{-1}$ only returns angles between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$. If $A\cos\theta$ is **negative**, the real angle is in the second or third quadrant, so add $\pi$ to the calculator's answer. Always check that $\cos\theta$ and $\sin\theta$ come out with the right signs. [[second-order-differential-equations|Second-Order Differential Equations]] has a table for all four quadrants and a third-quadrant example.

## Key formulas

**Element laws** and **stored energy**

$$
v_L = L\frac{di_L}{dt}, \qquad i_C = C\frac{dv_C}{dt} \tag{8.1}
$$

$$
w_L = \tfrac{1}{2} L\,i_L^2, \qquad w_C = \tfrac{1}{2} C\,v_C^2 \tag{8.2}
$$

- $v_L$, $i_L$: inductor voltage and current
- $v_C$, $i_C$: capacitor voltage and current
- $L$: inductance (H); $C$: capacitance (F)
- $w_L$, $w_C$: energy stored (J)

**Continuity at a switching instant**

$$
i_L(0^+) = i_L(0^-), \qquad v_C(0^+) = v_C(0^-) \tag{8.3}
$$

- $0^-$, $0^+$: just before and just after the switch moves

**Standard form of the differential equation**

$$
\frac{d^2 x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2\,x = f \tag{8.6}
$$

- $x$: the voltage or current being solved for
- $f$: whatever is left on the right-hand side (0 if there's no source after switching)

**Neper frequency and resonant frequency**

$$
\alpha = \frac{R}{2L} \quad \text{(series)} \tag{8.7}
$$

$$
\alpha = \frac{1}{2RC} \quad \text{(parallel)} \tag{8.8}
$$

$$
\omega_0 = \frac{1}{\sqrt{LC}} \tag{8.9}
$$

- $\alpha$: how fast the response decays (Np/s)
- $\omega_0$: undamped natural frequency (rad/s)
- $R$: the resistance in the series or parallel RLC, with the sources turned off

**Characteristic equation and roots**

$$
s^2 + 2\alpha s + \omega_0^2 = 0 \tag{8.10}
$$

$$
s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2} \tag{8.11}
$$

- $s_1, s_2$: natural frequencies of the circuit (s⁻¹)

**Natural solution**

$$
x_N = A_1 e^{s_1 t} + A_2 e^{s_2 t} \quad (\alpha > \omega_0) \tag{8.12}
$$

$$
x_N = A_1 e^{-\alpha t} + A_2\,t\,e^{-\alpha t} \quad (\alpha = \omega_0) \tag{8.13}
$$

$$
x_N = A\,e^{-\alpha t}\cos(\omega_d t + \theta) \quad (\alpha < \omega_0) \tag{8.14}
$$

$$
\omega_d = \sqrt{\omega_0^2 - \alpha^2} \tag{8.15}
$$

- $A_1$, $A_2$, $A$: constants found in Step 4
- $\theta$: phase angle, in radians
- $\omega_d$: damped natural frequency, the actual frequency of the oscillation (rad/s)

**Initial slopes**

$$
\frac{di_L}{dt}(0^+) = \frac{v_L(0^+)}{L}, \qquad \frac{dv_C}{dt}(0^+) = \frac{i_C(0^+)}{C} \tag{8.16}
$$

**Total solution**

$$
x_T = x_N + x_F \tag{8.17}
$$

$$
A\cos\theta = x(0) - x_F, \qquad -\alpha A\cos\theta - \omega_d A\sin\theta = \frac{dx}{dt}(0) \tag{8.18}
$$

- $x_T$: total solution, the final answer
- $x_F$: forced solution, the value as $t \to \infty$ (DC analysis with L shorted and C open)
- Eq. (8.18) is for the underdamped case only

## Examples

These follow the assigned textbook problems for Chapter 8, with different numbers. Tutorial problems are marked **(T)**; the quiz problems will be similar to those.

### Example 1: Initial and final values

> Like Prob. 8.1

The switch in Figure 8.5 has been closed for a long time and opens at $t = 0$. Find (a) $i(0^+)$ and $v(0^+)$, (b) $\frac{di}{dt}(0^+)$ and $\frac{dv}{dt}(0^+)$, (c) $i(\infty)$ and $v(\infty)$.

![[ele-302-rlc-ex01-initial-values.svg]]
*Figure 8.5: Circuit for Example 1.*

**(a) Before switching.** The switch has been closed for a long time, so the circuit is at DC steady state: replace the inductor with a short and the capacitor with an open (Figure 8.6).

![[ele-302-rlc-ex01-initial-values-before.svg]]
*Figure 8.6: Example 1 at $t = 0^-$. The inductor is a short and the capacitor is an open.*

- **Inductor branch:** with the inductor shorted, the 10 V source sees only the 4 Ω, so $i(0^-) = \frac{10}{4} = 2.5\ \text{A}$.
- **Capacitor branch:** the open capacitor blocks current, so nothing flows through the 6 Ω and it drops 0 V. The capacitor therefore sees the full source voltage: $v(0^-) = 10\ \text{V}$.

By Eq. (8.3), inductor current and capacitor voltage don't jump:

$$
i(0^+) = 2.5\ \text{A}, \qquad v(0^+) = 10\ \text{V}
$$

**(b) After switching.** The switch is now open, so the source is disconnected. Redraw the circuit with the inductor carrying 2.5 A and the capacitor holding 10 V (Figure 8.7).

![[ele-302-rlc-ex01-initial-values-after.svg]]
*Figure 8.7: Example 1 at $t = 0^+$. The source is cut off and the two branches form one loop.*

- **Capacitor slope.** The two branches now form a single loop. The 2.5 A flowing *down* the inductor branch has nowhere to go except back *up* the capacitor branch, so the capacitor current (measured downward, into its $+$ terminal) is $i_C = -2.5\ \text{A}$. By Eq. (8.16):
  $$\frac{dv}{dt}(0^+) = \frac{i_C}{C} = \frac{-2.5}{0.5} = -5\ \text{V/s}$$
- **Inductor slope.** We need $v_L$. Both branches connect the same top node to the same bottom rail, so they have the same voltage across them. Going down the capacitor branch: $6\,i_C + v = 6(-2.5) + 10 = -5\ \text{V}$. Going down the inductor branch: $4i + v_L$. Setting them equal:
  $$4(2.5) + v_L = -5 \quad\Rightarrow\quad v_L = -15\ \text{V} \quad\Rightarrow\quad \frac{di}{dt}(0^+) = \frac{v_L}{L} = \frac{-15}{1} = -15\ \text{A/s}$$

**(c) Final values.** There's no source left after $t = 0$, so the resistors eventually turn all the stored energy into heat:

$$
i(\infty) = 0, \qquad v(\infty) = 0
$$

### Example 2: Initial values with a step source

> Like Prob. 8.3

For the circuit in Figure 8.8, find (a) $i_L(0^+)$, $v_C(0^+)$ and $v_R(0^+)$, (b) $\frac{di_L}{dt}(0^+)$, $\frac{dv_C}{dt}(0^+)$ and $\frac{dv_R}{dt}(0^+)$, (c) $i_L(\infty)$, $v_C(\infty)$ and $v_R(\infty)$.

![[ele-302-rlc-ex02-step-initial.svg]]
*Figure 8.8: Circuit for Example 2.*

**(a) Before switching.** $u(t)$ is the unit step: 0 for $t < 0$ and 1 for $t > 0$. So before $t = 0$ the source is 0 A, there's no other source, and nothing in the circuit has ever been charged:

$$
i_L(0^-) = 0, \qquad v_C(0^-) = 0
$$

By Eq. (8.3) these carry over: $i_L(0^+) = 0$ and $v_C(0^+) = 0$. The 4 Ω is connected directly across the capacitor, so it has the same voltage: $v_R(0^+) = 0$.

**(b) After switching.** At $t = 0^+$ the source switches on to 2 A, but the capacitor still holds 0 V and the inductor still carries 0 A (Figure 8.9).

![[ele-302-rlc-ex02-step-initial-after.svg]]
*Figure 8.9: Example 2 at $t = 0^+$.*

- The 4 Ω has 0 V across it, so it takes $\frac{0}{4} = 0$ A.
- The inductor branch carries 0 A.
- KCL at the top node: the 2 A from the source has to go somewhere, and the only place left is the capacitor, so $i_C = 2\ \text{A}$.

By Eq. (8.16):

$$
\frac{dv_C}{dt}(0^+) = \frac{i_C}{C} = \frac{2}{1/4} = 8\ \text{V/s}, \qquad \frac{dv_R}{dt}(0^+) = 8\ \text{V/s} \quad (\text{same voltage as the capacitor})
$$

For the inductor, KVL around the right-hand loop gives $v_L = v_C - 2\,i_L = 0 - 0 = 0$, so $\frac{di_L}{dt}(0^+) = \frac{0}{1/2} = 0$.

**(c) Final values.** As $t \to \infty$ the circuit reaches DC steady state again with the source at 2 A. Short the inductor and open the capacitor (Figure 8.10).

![[ele-302-rlc-ex02-step-initial-final.svg]]
*Figure 8.10: Example 2 as $t \to \infty$.*

The 2 A now splits between the 4 Ω and the 2 Ω (whose bottom is shorted to the rail by the inductor). They're in parallel, $4 \parallel 2 = \frac{4 \cdot 2}{4 + 2} = \frac{4}{3}\ \Omega$:

$$
v_C(\infty) = v_R(\infty) = (2)\left(\tfrac{4}{3}\right) = 2.67\ \text{V}, \qquad i_L(\infty) = \frac{2.67}{2} = 1.33\ \text{A}
$$

> [!note] With a step source and nothing stored beforehand, every initial *value* is 0, but the initial *slopes* usually aren't. The source's current has to go somewhere the instant it turns on.

### Example 3: Type of damping

> Like Prob. 8.7

A series RLC circuit has $R = 50\ \Omega$, $L = 10\ \text{mH}$ and $C = 1\ \mu\text{F}$. What type of damping does it have? What value of $R$ would make it critically damped?

The type of damping depends only on how $\alpha$ compares with $\omega_0$ (Step 2), so find both.

1. **Neper frequency**, series circuit, Eq. (8.7):
   $$\alpha = \frac{R}{2L} = \frac{50}{2(0.01)} = 2500\ \text{Np/s}$$
2. **Resonant frequency**, Eq. (8.9):
   $$\omega_0 = \frac{1}{\sqrt{LC}} = \frac{1}{\sqrt{(0.01)(10^{-6})}} = \frac{1}{10^{-4}} = 10\,000\ \text{rad/s}$$
3. **Compare.** $\alpha = 2500 < \omega_0 = 10\,000$, so the circuit is **underdamped**: it will oscillate as it decays, at $\omega_d = \sqrt{10\,000^2 - 2500^2} = 9682\ \text{rad/s}$ (Eq. 8.15).
4. **Critical damping** needs $\alpha = \omega_0$:
   $$\frac{R}{2L} = \frac{1}{\sqrt{LC}} \quad\Rightarrow\quad R = 2\sqrt{\frac{L}{C}} = 2\sqrt{\frac{0.01}{10^{-6}}} = 2(100) = 200\ \Omega$$
   Any $R$ above 200 Ω makes it overdamped.

### Example 4: Source-free series RLC (T)

> Like Prob. 8.16 (T)

The switch in Figure 8.11 has been closed for a long time and opens at $t = 0$. Find $i(t)$ for $t > 0$.

![[ele-302-rlc-ex04-series-underdamped.svg]]
*Figure 8.11: Circuit for Example 4.*

**Step 1: Differential equation.** Once the switch opens, the 18 V source and the 3 Ω are cut off. What's left is one loop: the 6 Ω shunt, the 6 Ω, the capacitor and the inductor, all carrying the same current $i$. Take $i$ flowing down the right-hand branch (into the capacitor's $+$ terminal) and back up through the 6 Ω shunt. KVL around that loop, with no source:

$$
6i + v_C + L\frac{di}{dt} + 6i = 0, \qquad \text{where } v_C = \frac{1}{C}\int_0^t i\,dt + v_C(0)
$$

Combine the two resistors and substitute $v_C$:

$$
12i + L\frac{di}{dt} + \frac{1}{C}\int_0^t i\,dt + v_C(0) = 0
$$

Differentiate once ($v_C(0)$ is a constant, so it becomes 0) and divide by $L = 1$, with $\frac{1}{C} = \frac{1}{0.01} = 100$:

$$
\frac{d^2 i}{dt^2} + 12\frac{di}{dt} + 100\,i = 0
$$

**Step 2: Natural solution.** The characteristic equation (Eq. 8.10) is

$$
s^2 + 12s + 100 = 0 \quad\Rightarrow\quad s = \frac{-12 \pm \sqrt{12^2 - 4(100)}}{2} = -6 \pm \sqrt{36 - 100} = -6 \pm j8
$$

The roots are complex, so it's **underdamped** with $\alpha = 6$ and $\omega_d = 8$:

$$
i_N = A\,e^{-6t}\cos(8t + \theta)
$$

**Step 3: Initial conditions.**

*Before switching:* the switch has been closed for a long time, so short the inductor and open the capacitor (Figure 8.12).

![[ele-302-rlc-ex04-series-underdamped-before.svg]]
*Figure 8.12: Example 4 at $t = 0^-$.*

- The open capacitor blocks the right-hand branch, so $i(0^-) = 0$.
- With no current in that branch, the 6 Ω in it drops nothing and the inductor (a short) drops nothing, so the capacitor has the same voltage as the 6 Ω shunt. That's a voltage divider of the 18 V source:
  $$v_C(0^-) = 18 \cdot \frac{6}{3 + 6} = 12\ \text{V} \quad (+\text{ at the top})$$

By Eq. (8.3): $i(0^+) = 0$ and $v_C(0^+) = 12\ \text{V}$.

*After switching:* the switch is open, the capacitor holds 12 V and the loop current starts at 0 (Figure 8.13).

![[ele-302-rlc-ex04-series-underdamped-after.svg]]
*Figure 8.13: Example 4 at $t = 0^+$.*

Use the Step 1 KVL at $t = 0^+$. With $i = 0$ the resistors drop nothing, so $v_C + v_L = 0$:

$$
12 + v_L(0^+) = 0 \quad\Rightarrow\quad v_L(0^+) = -12\ \text{V} \quad\Rightarrow\quad \frac{di}{dt}(0^+) = \frac{v_L}{L} = -12\ \text{A/s}
$$

**Step 4: Total solution.** With no source in the loop, all the energy is eventually lost in the resistors, so $i_F = 0$ and

$$
i_T = A\,e^{-6t}\cos(8t + \theta)
$$

Apply the initial conditions with Eq. (8.18), using $\alpha = 6$, $\omega_d = 8$:

- $A\cos\theta = i(0) - i_F = 0$
- $-6(0) - 8A\sin\theta = -12$, so $A\sin\theta = 1.5$

The point $(0,\ 1.5)$ is straight up the vertical axis, so $\theta = \frac{\pi}{2}$ and $A = \sqrt{0^2 + 1.5^2} = 1.5$:

$$
i(t) = 1.5\,e^{-6t}\cos\!\left(8t + \tfrac{\pi}{2}\right)\ \text{A}
$$

Since $\cos(x + \frac{\pi}{2}) = -\sin x$, this is the same as $-1.5\,e^{-6t}\sin 8t$ A. The minus sign means the current first flows **up** the branch, as the capacitor discharges out of its $+$ terminal.

### Example 5: Switch from A to B, overdamped

> Like Prob. 8.17

In Figure 8.14, the switch has been at A for a long time and moves to B at $t = 0$ (a make-before-break switch, so the inductor current is never interrupted). Find $v(t)$ for $t \geq 0$.

![[ele-302-rlc-ex05-series-overdamped.svg]]
*Figure 8.14: Circuit for Example 5.*

**Step 1: Differential equation.** At B, the current source and 6 Ω are disconnected. The 5 Ω, the 1 H and the ¼ F form one series loop with no source. We want $v$, the capacitor voltage. Take the loop current $i$ flowing through the inductor toward the capacitor's $+$ terminal; then $i = C\frac{dv}{dt}$. KVL around the loop:

$$
5i + L\frac{di}{dt} + v = 0
$$

Substitute $i = C\frac{dv}{dt}$, so $\frac{di}{dt} = C\frac{d^2 v}{dt^2}$:

$$
5C\frac{dv}{dt} + LC\frac{d^2 v}{dt^2} + v = 0
$$

Divide by $LC = (1)(\frac{1}{4}) = \frac{1}{4}$:

$$
\frac{d^2 v}{dt^2} + 5\frac{dv}{dt} + 4v = 0
$$

**Step 2: Natural solution.**

$$
s^2 + 5s + 4 = 0 \quad\Rightarrow\quad s = \frac{-5 \pm \sqrt{25 - 16}}{2} = \frac{-5 \pm 3}{2} = -1,\ -4
$$

Two different real roots, so it's **overdamped** (Eq. 8.12):

$$
v_N = A_1 e^{-t} + A_2 e^{-4t}
$$

**Step 3: Initial conditions.**

*Before switching:* at A for a long time, so short the inductor and open the capacitor (Figure 8.15).

![[ele-302-rlc-ex05-series-overdamped-before.svg]]
*Figure 8.15: Example 5 at $t = 0^-$, with the switch at A.*

- The open capacitor blocks the inductor–capacitor branch, so $i_L(0^-) = 0$.
- All 3 A therefore flows through the 6 Ω, giving a node voltage of $(3)(6) = 18$ V. The inductor (a short) drops nothing, so the capacitor has that voltage: $v(0^-) = 18\ \text{V}$.

*After switching:* at B, the capacitor holds 18 V and the inductor carries 0 A (Figure 8.16).

![[ele-302-rlc-ex05-series-overdamped-after.svg]]
*Figure 8.16: Example 5 at $t = 0^+$, with the switch at B.*

The capacitor is in series with the inductor, so its current is the inductor current, $i_C(0^+) = 0$. By Eq. (8.16), $\frac{dv}{dt}(0^+) = \frac{0}{C} = 0$.

**Step 4: Total solution.** No source is left in the loop, so $v_F = 0$ and $v_T = A_1 e^{-t} + A_2 e^{-4t}$. Apply the two initial conditions:

- $v(0) = 18$: $\quad A_1 + A_2 = 18$
- $\frac{dv}{dt}(0) = 0$: differentiating gives $-A_1 e^{-t} - 4A_2 e^{-4t}$, so at $t = 0$, $\quad -A_1 - 4A_2 = 0$

The second equation gives $A_1 = -4A_2$. Substituting into the first: $-4A_2 + A_2 = 18$, so $A_2 = -6$ and $A_1 = 24$:

$$
v(t) = \begin{cases} 18\ \text{V}, & t < 0 \\ 24e^{-t} - 6e^{-4t}\ \text{V}, & t \geq 0 \end{cases}
$$

### Example 6: Source-free parallel RLC (T)

> Like Prob. 8.18 (T)

The switch in Figure 8.17 has been closed for a long time and opens at $t = 0$. Find $v(t)$ for $t > 0$.

![[ele-302-rlc-ex06-parallel-source-free.svg]]
*Figure 8.17: Circuit for Example 6.*

**Step 1: Differential equation.** After the switch opens, the source side is cut off and the 1 Ω, 0.32 H and ⅛ F are left in parallel, all with the same voltage $v$. KCL at the top node, with every current measured downward:

$$
\frac{v}{R} + i_L + C\frac{dv}{dt} = 0, \qquad \text{where } i_L = \frac{1}{L}\int_0^t v\,dt + i_L(0)
$$

Substitute $i_L$, differentiate once ($i_L(0)$ becomes 0), and divide by $C$:

$$
\frac{d^2 v}{dt^2} + \frac{1}{RC}\frac{dv}{dt} + \frac{1}{LC}\,v = 0 \quad\Rightarrow\quad \frac{d^2 v}{dt^2} + 8\frac{dv}{dt} + 25v = 0
$$

using $\frac{1}{RC} = \frac{1}{(1)(1/8)} = 8$ and $\frac{1}{LC} = \frac{1}{(0.32)(1/8)} = 25$.

**Step 2: Natural solution.**

$$
s^2 + 8s + 25 = 0 \quad\Rightarrow\quad s = -4 \pm \sqrt{16 - 25} = -4 \pm j3
$$

**Underdamped**, with $\alpha = 4$ and $\omega_d = 3$:

$$
v_N = A\,e^{-4t}\cos(3t + \theta)
$$

**Step 3: Initial conditions.**

*Before switching:* short the inductor and open the capacitor (Figure 8.18).

![[ele-302-rlc-ex06-parallel-source-free-before.svg]]
*Figure 8.18: Example 6 at $t = 0^-$.*

- The shorted inductor sits directly across the 1 Ω and the capacitor, so they all have 0 V: $v(0^-) = 0$.
- The source sees only the 4 Ω before the short, so all of its current goes through the inductor: $i_L(0^-) = \frac{20}{4} = 5\ \text{A}$.

*After switching:* the capacitor still has 0 V and the inductor still carries 5 A downward (Figure 8.19).

![[ele-302-rlc-ex06-parallel-source-free-after.svg]]
*Figure 8.19: Example 6 at $t = 0^+$.*

KCL from Step 1 at $t = 0^+$:

$$
\frac{0}{1} + 5 + \frac{1}{8}\frac{dv}{dt}(0^+) = 0 \quad\Rightarrow\quad \frac{dv}{dt}(0^+) = -40\ \text{V/s}
$$

The inductor's 5 A has to keep flowing, and the only place it can come from is the capacitor, which drives the voltage negative.

**Step 4: Total solution.** No source, so $v_F = 0$. Eq. (8.18) with $\alpha = 4$, $\omega_d = 3$:

- $A\cos\theta = 0 - 0 = 0$
- $-4(0) - 3A\sin\theta = -40$, so $A\sin\theta = 13.33$

The point $(0,\ 13.33)$ gives $\theta = \frac{\pi}{2}$ and $A = 13.33$:

$$
v(t) = 13.33\,e^{-4t}\cos\!\left(3t + \tfrac{\pi}{2}\right)\ \text{V} \quad \left(= -13.33\,e^{-4t}\sin 3t\right)
$$

### Example 7: Choose C for a given $\alpha$

> Like Prob. 8.23

For the network in Figure 8.20, what value of $C$ makes the response underdamped with $\alpha = 2\ \text{Np/s}$?

![[ele-302-rlc-ex07-find-c.svg]]
*Figure 8.20: Parallel network for Example 7.*

1. **Simplify.** Every element is connected between the same two rails, so this is a parallel RLC. [[capacitors-and-inductors#Series and parallel|Capacitors in parallel add]], so the two capacitors act as one: $C_{eq} = C + 0.02$.
2. **Use the parallel $\alpha$**, Eq. (8.8), and solve for $C_{eq}$:
   $$\alpha = \frac{1}{2RC_{eq}} = 2 \quad\Rightarrow\quad C_{eq} = \frac{1}{2(5)(2)} = 0.05\ \text{F}$$
   $$C = C_{eq} - 0.02 = 0.05 - 0.02 = 30\ \text{mF}$$
3. **Check it's underdamped.** That needs $\alpha < \omega_0$. By Eq. (8.9), $\omega_0 = \frac{1}{\sqrt{(0.1)(0.05)}} = 14.14\ \text{rad/s}$, which is bigger than $\alpha = 2$ ✓. It oscillates at $\omega_d = \sqrt{200 - 4} = 14\ \text{rad/s}$.

### Example 8: Solving a step-response equation

> Like Prob. 8.27

A branch voltage in an RLC circuit is described by
$$\frac{d^2 v}{dt^2} + 6\frac{dv}{dt} + 25v = 50$$
If $v(0) = 0$ and $\frac{dv}{dt}(0) = 0$, find $v(t)$.

**Step 1: Differential equation.** It's given, already in standard form. Comparing with Eq. (8.6): $2\alpha = 6$, so $\alpha = 3$, and $\omega_0^2 = 25$, so $\omega_0 = 5$.

**Step 2: Natural solution.** Set the right-hand side to 0. The characteristic equation is

$$
s^2 + 6s + 25 = 0 \quad\Rightarrow\quad s = -3 \pm \sqrt{9 - 25} = -3 \pm j4
$$

**Underdamped**, with $\alpha = 3$ and $\omega_d = 4$:

$$
v_N = A\,e^{-3t}\cos(4t + \theta)
$$

**Step 3: Initial conditions.** Given: $v(0) = 0$ and $\frac{dv}{dt}(0) = 0$.

**Step 4: Total solution.** The forced solution is where $v$ settles. Once it settles, it stops changing, so both derivatives are 0 and the equation becomes $25\,v_F = 50$, giving $v_F = 2\ \text{V}$:

$$
v_T = 2 + A\,e^{-3t}\cos(4t + \theta)
$$

Eq. (8.18) with $\alpha = 3$, $\omega_d = 4$:

- $A\cos\theta = v(0) - v_F = 0 - 2 = -2$
- $-3(-2) - 4A\sin\theta = 0$, so $A\sin\theta = 1.5$

So $A = \sqrt{(-2)^2 + 1.5^2} = \sqrt{6.25} = 2.5$. For $\theta$: the cosine is **negative** and the sine is **positive**, so the angle is in the **second quadrant**. A calculator gives $\tan^{-1}\!\left(\frac{1.5}{-2}\right) = -0.6435$, which is in the fourth quadrant (wrong signs), so add $\pi$:

$$
\theta = -0.6435 + \pi = 2.498\ \text{rad}
$$

Check: $2.5\cos(2.498) = -2$ ✓ and $2.5\sin(2.498) = 1.5$ ✓.

$$
v(t) = 2 + 2.5\,e^{-3t}\cos(4t + 2.498)\ \text{V}
$$

### Example 9: General circuit with two sources

> Like Prob. 8.41

For the circuit in Figure 8.21, find $i(t)$ and $v(t)$ for $t > 0$.

![[ele-302-rlc-ex09-general.svg]]
*Figure 8.21: Circuit for Example 9. The capacitor voltage $v$ is $+$ on the right.*

**Step 1: Differential equation.** First, simplify with a [[source-transformation|source transformation]]: the $12u(t)$ A source with 2 Ω in parallel becomes a $(12u(t))(2) = 24u(t)$ V source with 2 Ω in series. Now everything is in one series loop: $R = 2 + 4 = 6\ \Omega$, $L = 1\ \text{H}$, $C = 0.04\ \text{F}$, plus two sources.

Go around the loop clockwise, in the direction of $i$: a rise of $24u(t)$ through the transformed source, then drops across the 6 Ω, the inductor, the 10 V source (entering its $+$ side) and the capacitor (entering its $+$ side, on the right):

$$
24u(t) - 6i - L\frac{di}{dt} - 10 - v = 0
$$

For $t > 0$, $u(t) = 1$. Substitute $v = \frac{1}{C}\int_0^t i\,dt + v(0)$ and rearrange:

$$
6i + L\frac{di}{dt} + \frac{1}{C}\int_0^t i\,dt + v(0) = 14
$$

Differentiate once (14 and $v(0)$ are constants, so they become 0), with $L = 1$ and $\frac{1}{C} = 25$:

$$
\frac{d^2 i}{dt^2} + 6\frac{di}{dt} + 25\,i = 0
$$

For $v$ instead, substitute $i = C\frac{dv}{dt}$ into the KVL and divide by $LC = 0.04$:

$$
\frac{d^2 v}{dt^2} + 6\frac{dv}{dt} + 25\,v = 350
$$

Same left-hand side, so the same natural solution. Only the right-hand side, and so the forced solution, is different.

**Step 2: Natural solution.**

$$
s^2 + 6s + 25 = 0 \quad\Rightarrow\quad s = -3 \pm j4
$$

**Underdamped** with $\alpha = 3$, $\omega_d = 4$. Both $i$ and $v$ have the form $A\,e^{-3t}\cos(4t + \theta)$, each with its own $A$ and $\theta$.

**Step 3: Initial conditions.**

*Before switching:* $u(t) = 0$, so the current source is off (0 A), but the 10 V source is still there. Short the inductor and open the capacitor (Figure 8.22).

![[ele-302-rlc-ex09-general-before.svg]]
*Figure 8.22: Example 9 at $t = 0^-$. The step source is off.*

- The open capacitor breaks the loop, so $i(0^-) = 0$.
- With no current, every resistor and inductor drop is 0, so KVL around the loop reduces to $0 - 10 - v = 0$, giving $v(0^-) = -10\ \text{V}$. (The capacitor is charged "backwards" by the 10 V source.)

*After switching:* the step source turns on (12 A, or 24 V after the transformation), and $i$ and $v$ keep their values (Figure 8.23).

![[ele-302-rlc-ex09-general-after.svg]]
*Figure 8.23: Example 9 at $t = 0^+$. The step source is on.*

From the KVL in Step 1 at $t = 0^+$, with $i = 0$ and $v = -10$:

$$
24 - 0 - v_L - 10 - (-10) = 0 \quad\Rightarrow\quad v_L(0^+) = 24\ \text{V} \quad\Rightarrow\quad \frac{di}{dt}(0^+) = \frac{24}{1} = 24\ \text{A/s}
$$

$$
\frac{dv}{dt}(0^+) = \frac{i(0^+)}{C} = 0
$$

**Step 4: Total solution.** As $t \to \infty$ the capacitor is open again, so $i_F = 0$, and KVL with no current gives $24 - 10 - v_F = 0$, so $v_F = 14\ \text{V}$. (Check with the $v$ equation: $25\,v_F = 350$ gives 14 ✓.)

*For $i$:* Eq. (8.18) with $\alpha = 3$, $\omega_d = 4$:

- $A\cos\theta = 0 - 0 = 0$
- $-3(0) - 4A\sin\theta = 24$, so $A\sin\theta = -6$

The point $(0, -6)$ is straight down, so $\theta = -\frac{\pi}{2}$ and $A = 6$:

$$
i(t) = 6\,e^{-3t}\cos\!\left(4t - \tfrac{\pi}{2}\right)\ \text{A} \quad \left(= 6\,e^{-3t}\sin 4t\right)
$$

*For $v$:*

- $A\cos\theta = -10 - 14 = -24$
- $-3(-24) - 4A\sin\theta = 0$, so $A\sin\theta = 18$

$A = \sqrt{24^2 + 18^2} = 30$. Cosine negative, sine positive, so second quadrant: $\theta = \tan^{-1}\!\left(\frac{18}{-24}\right) + \pi = -0.6435 + \pi = 2.498\ \text{rad}$:

$$
v(t) = 14 + 30\,e^{-3t}\cos(4t + 2.498)\ \text{V}
$$

> [!tip] Check: $i = C\frac{dv}{dt}$ should hold. Differentiating $v(t)$ and multiplying by 0.04 gives exactly $6e^{-3t}\sin 4t$ ✓.

### Example 10: Choose R and C for a given $\alpha$ and $\omega_d$

> Like Prob. 8.43

The switch in Figure 8.24 is opened at $t = 0$ after the circuit has reached steady state. (a) Choose $R$ and $C$ so that $\alpha = 10\ \text{Np/s}$ and $\omega_d = 20\ \text{rad/s}$. (b) With those values, find $i(t)$ for $t > 0$.

![[ele-302-rlc-ex10-choose-rc.svg]]
*Figure 8.24: Circuit for Example 10.*

**(a)** After the switch opens, the source and 4 Ω are cut off, and L, R and C form one series loop. So use the series formulas.

- From Eq. (8.7), $\alpha = \frac{R}{2L}$, so $R = 2\alpha L = 2(10)(0.25) = 5\ \Omega$.
- From Eq. (8.15), $\omega_d^2 = \omega_0^2 - \alpha^2$, so $\omega_0^2 = \omega_d^2 + \alpha^2 = 400 + 100 = 500$.
- From Eq. (8.9), $\omega_0^2 = \frac{1}{LC}$, so $C = \frac{1}{\omega_0^2 L} = \frac{1}{(500)(0.25)} = 8\ \text{mF}$.

**(b)**

**Step 1: Differential equation.** Take $i$ flowing down through the inductor. In the loop it comes back up through the R–C branch. The inductor and the R–C branch are connected across the same two nodes, so they have the same voltage. Measuring top-to-bottom, the R–C branch carries $-i$ downward:

$$
L\frac{di}{dt} = R(-i) + v_C, \qquad \text{where } v_C = \frac{1}{C}\int_0^t (-i)\,dt + v_C(0)
$$

Move everything to one side, differentiate once and divide by $L$:

$$
\frac{d^2 i}{dt^2} + \frac{R}{L}\frac{di}{dt} + \frac{1}{LC}\,i = 0 \quad\Rightarrow\quad \frac{d^2 i}{dt^2} + 20\frac{di}{dt} + 500\,i = 0
$$

**Step 2: Natural solution.**

$$
s^2 + 20s + 500 = 0 \quad\Rightarrow\quad s = -10 \pm \sqrt{100 - 500} = -10 \pm j20
$$

Exactly the $\alpha$ and $\omega_d$ we designed for:

$$
i_N = A\,e^{-10t}\cos(20t + \theta)
$$

**Step 3: Initial conditions.**

*Before switching:* short the inductor and open the capacitor (Figure 8.25).

![[ele-302-rlc-ex10-choose-rc-before.svg]]
*Figure 8.25: Example 10 at $t = 0^-$.*

- The source sees only the 4 Ω before the short, so $i(0^-) = \frac{12}{4} = 3\ \text{A}$.
- The R–C branch is connected across the shorted inductor, so it has 0 V across it, and with no current through R, $v_C(0^-) = 0$.

*After switching:* the inductor carries 3 A and the capacitor holds 0 V (Figure 8.26).

![[ele-302-rlc-ex10-choose-rc-after.svg]]
*Figure 8.26: Example 10 at $t = 0^+$.*

From the Step 1 relation at $t = 0^+$:

$$
v_L(0^+) = R(-3) + 0 = -15\ \text{V} \quad\Rightarrow\quad \frac{di}{dt}(0^+) = \frac{-15}{0.25} = -60\ \text{A/s}
$$

**Step 4: Total solution.** No source, so $i_F = 0$. Eq. (8.18) with $\alpha = 10$, $\omega_d = 20$:

- $A\cos\theta = 3 - 0 = 3$
- $-10(3) - 20A\sin\theta = -60$, so $A\sin\theta = 1.5$

$A = \sqrt{3^2 + 1.5^2} = 3.354$. Both are positive, so $\theta$ is in the first quadrant and the calculator answer is right: $\theta = \tan^{-1}\!\left(\frac{1.5}{3}\right) = 0.4636\ \text{rad}$.

$$
i(t) = 3.354\,e^{-10t}\cos(20t + 0.4636)\ \text{A}
$$

### Example 11: Step response with L in parallel with C (T)

> Like Prob. 8.46 (T)

In Figure 8.27, no energy is stored at $t = 0^-$. Find $i(t)$ for $t > 0$.

![[ele-302-rlc-ex11-lc-step.svg]]
*Figure 8.27: Circuit for Example 11.*

$i$ isn't an inductor current or a capacitor voltage, so it's easier to solve for one that is ($i_L$) and convert at the end.

**Step 1: Differential equation.** Let $v_x$ be the voltage across the L‖C pair, which is also the capacitor voltage. Three relations describe the circuit for $t > 0$:

- KVL around the outer loop: $\quad 12 = v_x + 2i$
- KCL at the L‖C pair: $\quad i = i_L + C\frac{dv_x}{dt}$
- Inductor law, Eq. (8.1): $\quad v_x = L\frac{di_L}{dt}$

Substitute the last into the middle to get $i = i_L + LC\frac{d^2 i_L}{dt^2}$, then put both into the KVL:

$$
12 = L\frac{di_L}{dt} + 2\left(i_L + LC\frac{d^2 i_L}{dt^2}\right)
$$

Divide by $2LC = 2(2.5)(0.1) = 0.5$:

$$
\frac{d^2 i_L}{dt^2} + 5\frac{di_L}{dt} + 4\,i_L = 24
$$

**Step 2: Natural solution.**

$$
s^2 + 5s + 4 = 0 \quad\Rightarrow\quad s = \frac{-5 \pm \sqrt{25 - 16}}{2} = -1,\ -4
$$

**Overdamped**: $\quad i_{L,N} = A_1 e^{-t} + A_2 e^{-4t}$

**Step 3: Initial conditions.** No energy is stored, so $i_L(0) = 0$ and $v_x(0) = 0$. From the inductor law, $\frac{di_L}{dt}(0) = \frac{v_x(0)}{L} = 0$.

**Step 4: Total solution.** Forced solution: as $t \to \infty$ the inductor is a short, so the source sees just the 2 Ω and $i_{L,F} = \frac{12}{2} = 6\ \text{A}$. (Check with the equation: $4\,i_{L,F} = 24$ ✓.)

$$
i_L = 6 + A_1 e^{-t} + A_2 e^{-4t}
$$

- $i_L(0) = 0$: $\quad 6 + A_1 + A_2 = 0$, so $A_1 + A_2 = -6$
- $\frac{di_L}{dt}(0) = 0$: $\quad -A_1 - 4A_2 = 0$, so $A_1 = -4A_2$

Then $-4A_2 + A_2 = -6$, so $A_2 = 2$ and $A_1 = -8$:

$$
i_L(t) = 6 - 8e^{-t} + 2e^{-4t}\ \text{A}
$$

**Convert back to $i$.** First $v_x = L\frac{di_L}{dt} = 2.5(8e^{-t} - 8e^{-4t}) = 20(e^{-t} - e^{-4t})$. Then from the KVL, $i = \frac{12 - v_x}{2}$:

$$
i(t) = 6 - 10e^{-t} + 10e^{-4t}\ \text{A}
$$

> [!note] $i(0^+) = 6\ \text{A}$ even though $i(0^-) = 0$. That's allowed, because $i$ isn't an inductor current. At the first instant the uncharged capacitor acts like a short across the inductor, so the source sees just the 2 Ω.

### Example 12: Step response of a parallel RLC

> Like Prob. 8.47

The switch in Figure 8.28 has been closed for a long time and opens at $t = 0$. Find $v_o(t)$ for $t > 0$.

![[ele-302-rlc-ex12-parallel-step.svg]]
*Figure 8.28: Circuit for Example 12. The switch shorts out the series 1 Ω until $t = 0$.*

**Step 1: Differential equation.** For $t > 0$ the switch is open, so the series 1 Ω is back in the circuit. Simplify the source side with [[source-transformation|source transformations]]:

- 6 A with 1 Ω in parallel becomes $6 \times 1 = 6$ V with 1 Ω in series.
- Add the series 1 Ω: 6 V with 2 Ω in series.
- Convert back: $\frac{6}{2} = 3$ A with 2 Ω in parallel.

So the circuit is a parallel RLC (2 Ω, 1.25 H, 50 mF) driven by 3 A. KCL at the top node, every current measured downward:

$$
3 = \frac{v_o}{2} + i_L + 0.05\frac{dv_o}{dt}, \qquad \text{where } i_L = \frac{1}{1.25}\int_0^t v_o\,dt + i_L(0)
$$

Substitute $i_L$, differentiate once (3 and $i_L(0)$ become 0), and divide by $C = 0.05$:

$$
\frac{d^2 v_o}{dt^2} + 10\frac{dv_o}{dt} + 16\,v_o = 0
$$

**Step 2: Natural solution.**

$$
s^2 + 10s + 16 = 0 \quad\Rightarrow\quad s = \frac{-10 \pm \sqrt{100 - 64}}{2} = \frac{-10 \pm 6}{2} = -2,\ -8
$$

**Overdamped**: $\quad v_N = A_1 e^{-2t} + A_2 e^{-8t}$

**Step 3: Initial conditions.**

*Before switching:* the switch is closed (shorting the series 1 Ω), and the inductor is a short (Figure 8.29).

![[ele-302-rlc-ex12-parallel-step-before.svg]]
*Figure 8.29: Example 12 at $t = 0^-$.*

- The shorted inductor is directly across the output, so $v_o(0^-) = 0$.
- With the switch and the inductor both shorts, the source's top node is shorted straight to the bottom rail. The 1 Ω across the source has 0 V and takes no current, so all 6 A goes through the inductor: $i_L(0^-) = 6\ \text{A}$.

*After switching:* the inductor still carries 6 A and the capacitor still has 0 V (Figure 8.30).

![[ele-302-rlc-ex12-parallel-step-after.svg]]
*Figure 8.30: Example 12 at $t = 0^+$.*

KCL from Step 1 at $t = 0^+$:

$$
3 = \frac{0}{2} + 6 + 0.05\frac{dv_o}{dt}(0^+) \quad\Rightarrow\quad \frac{dv_o}{dt}(0^+) = -60\ \text{V/s}
$$

**Step 4: Total solution.** As $t \to \infty$ the inductor is a short across the output, so $v_F = 0$ (and the inductor current settles at 3 A).

- $v_o(0) = 0$: $\quad A_1 + A_2 = 0$
- $\frac{dv_o}{dt}(0) = -60$: $\quad -2A_1 - 8A_2 = -60$

From the first, $A_1 = -A_2$. Substituting: $2A_2 - 8A_2 = -60$, so $A_2 = 10$ and $A_1 = -10$:

$$
v_o(t) = -10e^{-2t} + 10e^{-8t}\ \text{V}
$$

## Common mistakes

- Using the **series** $\alpha = R/2L$ on a **parallel** circuit, or the other way round. If unsure, derive the equation with KVL/KCL
- Forgetting to differentiate away the integral (and constants like $v_C(0)$) when writing the differential equation
- Applying the initial conditions to $x_N$ only and forgetting $x_F$ in Eq. (8.17)
- Assuming $i_C$ or $v_L$ can't jump at $t = 0$. Only $v_C$ and $i_L$ are continuous
- Getting the sign of $\frac{dx}{dt}(0^+)$ wrong. Mark the reference directions on the circuit before writing KCL/KVL
- Using $\omega_0$ instead of $\omega_d$ inside the cosine of an underdamped answer
- Trusting the calculator's $\tan^{-1}$ when $A\cos\theta$ is negative (add $\pi$), or leaving $\theta$ in degrees instead of radians
- Finding $\alpha$ and $\omega_0$ with the sources still on. The natural solution is for the circuit with the sources turned off
