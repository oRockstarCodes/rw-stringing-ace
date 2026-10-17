---
title: LC Oscillation
aliases:
  - LC circuit
  - LC oscillator
  - Natural oscillation
tags:
  - concept
  - ele302
---

**When an inductor and a capacitor are connected together, energy passes back and forth between them, so the voltage and current oscillate as sine waves at $\omega_0 = \frac{1}{\sqrt{LC}}$.**

This is why second-order circuits can ring instead of just decaying. In [[ch08-second-order-circuits|Ch 8]] the oscillation always comes with some resistance, which makes it die out. This page looks at the pure LC case first so you can see what the resistance is fighting against. It builds on the element laws in [[capacitors-and-inductors|Capacitors and Inductors]].

## Intuition

### Two kinds of stored energy

The two elements store energy in different forms:

- A **capacitor** stores energy in its electric field, $w_C = \frac{1}{2}Cv^2$. That energy depends on its **voltage**.
- An **inductor** stores energy in its magnetic field, $w_L = \frac{1}{2}Li^2$. That energy depends on its **current**.

Neither can hold onto its energy once the other is connected across it. A charged capacitor wants to push current, and an inductor carrying current wants to keep pushing it. Put them together and each one keeps handing its energy to the other.

![[ele-302-concept-lc-circuit.svg]]
*Figure 1: An LC circuit. The current $i$ flows out of the capacitor's $+$ terminal and through the inductor.*

### Following one cycle

Start with the capacitor charged to $+V_m$ and no current flowing, then let the circuit go. The numbers below match the circled numbers in Figure 2.

1. **Start.** The capacitor is fully charged and the current is 0. All the energy is in the capacitor.
2. **The capacitor discharges.** Its voltage pushes current through the inductor. The inductor resists sudden changes in current ($v = L\frac{di}{dt}$), so the current builds up gradually instead of all at once. As charge leaves the capacitor its voltage falls while the current rises, so energy moves from the electric field into the magnetic field. A quarter of the way through, the capacitor voltage reaches **0** and the current is at its **maximum**. All the energy is now in the inductor.
3. **The inductor keeps the current going.** An inductor can't stop its current instantly (its current is continuous), so the current keeps flowing the same way even though nothing is pushing it anymore. That current piles charge onto the capacitor the *other* way around, so the capacitor voltage goes **negative**. Halfway through, the current has dropped to 0 and the capacitor is charged to $-V_m$. All the energy is back in the capacitor, just with the opposite polarity.
4. **The whole thing runs in reverse.** The capacitor now discharges the other way, and the current flows backwards and reaches its most negative value when $v_C$ passes through 0 again.
5. **Back to the start.** After one full period the capacitor is at $+V_m$ again with no current, exactly like step 1, and the cycle repeats forever.

![[ele-302-concept-lc-oscillation.svg]]
*Figure 2: Capacitor voltage (gold) and current (gray) over one period. The circled numbers are the stages in the list above.*

Notice that the voltage and current are a **quarter cycle (90°) apart**. The current is at its peak exactly when the voltage passes through zero, and the current is zero exactly when the voltage is at a peak. That's the energy changing hands, because when one element holds all of it the other holds none.

### Energy is conserved

With no resistor, nothing turns the energy into heat, so the total never changes:

$$
\tfrac{1}{2}Cv^2 + \tfrac{1}{2}Li^2 = \text{constant}
$$

That gives you a useful link between the peak voltage and the peak current. At stage 1 all the energy is in the capacitor ($\frac{1}{2}CV_m^2$), and at the quarter-cycle point all of it is in the inductor ($\frac{1}{2}LI_m^2$). Setting them equal:

$$
\tfrac{1}{2}CV_m^2 = \tfrac{1}{2}LI_m^2 \quad\Rightarrow\quad I_m = V_m\sqrt{\frac{C}{L}}
$$

### The mass-on-a-spring analogy

A mass on a spring does exactly the same thing. Stretch the spring and let go, and the mass speeds up as the spring relaxes, shoots past the middle because of its inertia, stretches the spring the other way, stops, and comes back. The two systems match up term by term:

|LC circuit|Mass on a spring|
|---|---|
|Charge on the capacitor, $q$|Position of the mass, $x$|
|Current, $i = \frac{dq}{dt}$|Velocity, $\frac{dx}{dt}$|
|Capacitor, energy $\frac{1}{2}Cv^2$|Spring, energy $\frac{1}{2}kx^2$|
|Inductor, energy $\frac{1}{2}Li^2$, resists changes in current|Mass, energy $\frac{1}{2}mv^2$, resists changes in velocity (inertia)|
|$L$|Mass $m$|
|$\frac{1}{C}$|Spring stiffness $k$|
|$\omega_0 = \frac{1}{\sqrt{LC}}$|$\omega_0 = \sqrt{\frac{k}{m}}$|
|Resistor|Friction|

The inductor's "inertia" is what makes the circuit overshoot past 0 V instead of just settling there. Without an inductor (an RC circuit) the voltage just decays to zero and never goes negative, like a spring in thick honey with no mass to carry it past the middle.

The frequency formula makes sense through the analogy too. A heavier mass (bigger $L$) or a softer spring (bigger $C$, since $k \leftrightarrow \frac{1}{C}$) swings more slowly.

### Where the sine wave comes from

You can get the oscillation straight from the element laws. In Figure 1, the current flows **out** of the capacitor's $+$ terminal, so by the [[capacitors-and-inductors#Passive sign convention|passive sign convention]] $i = -C\frac{dv}{dt}$. The inductor is connected directly across the capacitor, so it has the same voltage, $v = L\frac{di}{dt}$. Substituting the first into the second:

$$
v = L\frac{d}{dt}\left(-C\frac{dv}{dt}\right) = -LC\frac{d^2 v}{dt^2} \quad\Rightarrow\quad \frac{d^2 v}{dt^2} + \frac{1}{LC}\,v = 0
$$

This is the Ch 8 standard form with $\alpha = 0$ (no resistance) and $\omega_0^2 = \frac{1}{LC}$. Its characteristic equation $s^2 + \omega_0^2 = 0$ has roots $s = \pm j\omega_0$, which are purely imaginary, so the response is a sine wave that **never decays** (see [[second-order-differential-equations|Second-Order Differential Equations]]). With $v(0) = V_m$ and $i(0) = 0$:

$$
v(t) = V_m\cos\omega_0 t, \qquad i(t) = -C\frac{dv}{dt} = V_m\sqrt{\frac{C}{L}}\,\sin\omega_0 t
$$

### Adding resistance

Real circuits always have some resistance, and a resistor acts like friction. On every swing it turns some of the energy into heat, so each swing is smaller than the last. How fast that happens is the **damping**, $\alpha$:

- **A little resistance** ($\alpha < \omega_0$): it still oscillates, but inside a shrinking envelope. That's the **underdamped** case.
- **A lot of resistance** ($\alpha > \omega_0$): the energy gets drained before it can swing even once, so it just creeps to zero. That's the **overdamped** case, like a spring in honey.
- **Exactly enough** ($\alpha = \omega_0$): the fastest return to zero without overshooting. That's **critically damped**.

![[ele-302-rlc-damping.svg]]
*Figure 3: Adding resistance to an LC circuit. The pure LC case would keep oscillating at full size forever.*

Whether more resistance means more or less damping depends on where it's connected. See [[damping-series-vs-parallel|Damping in Series and Parallel RLC]].

## Key formulas

**Resonant frequency, period and frequency in hertz**

$$
\omega_0 = \frac{1}{\sqrt{LC}}, \qquad T = \frac{2\pi}{\omega_0}, \qquad f_0 = \frac{\omega_0}{2\pi}
$$

**Energy conservation and peak values** (no resistance)

$$
\tfrac{1}{2}Cv^2 + \tfrac{1}{2}Li^2 = \tfrac{1}{2}CV_m^2, \qquad I_m = V_m\sqrt{\frac{C}{L}}
$$

**Pure LC response**, starting from $v(0) = V_m$, $i(0) = 0$ (current direction as in Figure 1)

$$
v(t) = V_m\cos\omega_0 t, \qquad i(t) = I_m\sin\omega_0 t
$$

- $\omega_0$: resonant (natural) frequency, rad/s
- $T$: period, s; $f_0$: frequency, Hz
- $V_m$: peak capacitor voltage; $I_m$: peak current
- $L$: inductance (H); $C$: capacitance (F)

## Worked example

### Example 1: A capacitor discharging into an inductor

A $10\ \mu\text{F}$ capacitor charged to $5\ \text{V}$ is connected to a $25\ \text{mH}$ inductor at $t = 0$. There's no resistance. Find (a) the frequency and period of the oscillation, (b) the stored energy and the peak current, (c) $v(t)$ and $i(t)$, and (d) the current at the moment the capacitor voltage is 3 V.

**(a)**
$$
\omega_0 = \frac{1}{\sqrt{(25 \times 10^{-3})(10 \times 10^{-6})}} = \frac{1}{\sqrt{2.5 \times 10^{-7}}} = 2000\ \text{rad/s}
$$
$$
f_0 = \frac{2000}{2\pi} = 318.3\ \text{Hz}, \qquad T = \frac{2\pi}{2000} = 3.14\ \text{ms}
$$

**(b)** All the energy starts in the capacitor:
$$
w = \tfrac{1}{2}(10 \times 10^{-6})(5)^2 = 125\ \mu\text{J}
$$
At the peak current all of it is in the inductor:
$$
I_m = V_m\sqrt{\frac{C}{L}} = 5\sqrt{\frac{10 \times 10^{-6}}{25 \times 10^{-3}}} = 5(0.02) = 0.1\ \text{A}
$$
Check: $\frac{1}{2}(25 \times 10^{-3})(0.1)^2 = 125\ \mu\text{J}$ ✓

**(c)**
$$
v(t) = 5\cos 2000t\ \text{V}, \qquad i(t) = 0.1\sin 2000t\ \text{A}
$$

**(d)** At $v = 3\ \text{V}$ the capacitor holds $\frac{1}{2}(10 \times 10^{-6})(3)^2 = 45\ \mu\text{J}$. The rest, $125 - 45 = 80\ \mu\text{J}$, is in the inductor:
$$
\tfrac{1}{2}(25 \times 10^{-3})\,i^2 = 80 \times 10^{-6} \quad\Rightarrow\quad i = \sqrt{\frac{2(80 \times 10^{-6})}{25 \times 10^{-3}}} = 0.08\ \text{A}
$$

> [!tip] Part (d) didn't need $v(t)$ or $i(t)$ at all. Energy conservation is often the quickest way to relate voltage and current in an LC circuit.

## Common mistakes

- Thinking the current is largest when the capacitor voltage is largest. It's the opposite, and the current peaks when $v_C$ passes through **zero**
- Expecting the capacitor to just discharge to 0 V and stop. The inductor's current carries it past zero and charges it the other way
- Mixing up $\omega_0$ (rad/s) and $f_0$ (Hz). They differ by a factor of $2\pi$
- Forgetting that a real circuit's resistance makes the oscillation decay, so a pure LC answer that never dies out only applies when $R = 0$

## Related

- [[capacitors-and-inductors|Capacitors and Inductors]]: the element laws and stored energy
- [[damping-series-vs-parallel|Damping in Series and Parallel RLC]]: what resistance does to the oscillation
- [[second-order-differential-equations|Second-Order Differential Equations]]: solving the equation in general

## Seen in

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]
