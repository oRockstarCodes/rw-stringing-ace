---
title: Capacitors and Inductors
aliases:
  - Capacitor
  - Inductor
  - Capacitors
  - Inductors
tags:
  - concept
  - ele302
---

**Capacitors and inductors are the two energy-storage elements. A capacitor stores energy in an electric field set up by its voltage, and an inductor stores energy in a magnetic field set up by its current.**

Resistors only turn energy into heat. Capacitors and inductors store it and give it back later, which is why circuits with them have to now deal with a time element even with DC circuits, where what they do now depends on what happened before. Everything in [[ch08-second-order-circuits|Ch 8]] comes from the two element laws on this page.

## Intuition

### The capacitor

A capacitor is two conductors (plates) separated by an insulator called the **dielectric** (Figure 1, left). Push current into one terminal and charge $+q$ builds up on that plate, while the same amount leaves the other plate and leaves it at $-q$. No charge actually crosses the gap. The separated charge sets up an electric field $E$ between the plates, and that field is where the energy is stored.

The more charge on the plates, the bigger the voltage between them. The ratio is the **capacitance**:

$$
q = C\,v, \qquad C = \frac{\varepsilon A}{d}
$$

- $q$: charge on the plates (C)
- $C$: capacitance, in farads (F)
- $\varepsilon$: permittivity of the dielectric
- $A$: plate area; $d$: gap between the plates

Bigger plates or a smaller gap hold more charge per volt. Real values range from picofarads (pF) to millifarads (mF), and 1 F is huge.

**Where $i = C\frac{dv}{dt}$ comes from.** Current is the rate charge arrives, $i = \frac{dq}{dt}$. Differentiate $q = Cv$:

$$
i_C = C\frac{dv_C}{dt}
$$

So a capacitor's current depends on how fast its **voltage changes**, not on the voltage itself. A capacitor sitting at a steady 100 V carries no current at all. To change its voltage quickly you need a large current, and to change it *instantly* you'd need an infinite one.

> [!tip] Water analogy: a capacitor is like a tank with a stretchy rubber membrane across the middle. Water (charge) pushed in one side bulges the membrane and pushes the same amount out the other side, so it looks like water flows "through" even though none actually crosses. The bulge (voltage) builds up gradually and pushes back.

Try it below. Charge the capacitor through a resistor, then discharge it, or open the switch. Watch the plates fill up and the current die away as $v_C$ catches up.

<div class="melon-capind" data-view="cap">Interactive capacitor diagram (open this page on the site to use it).</div>

### The inductor

An inductor is a coil of wire (Figure 1, right). Current through the coil sets up a magnetic field $B$ through its middle, and that field is where the energy is stored. The total magnetic flux linking the coil, $\lambda$, is proportional to the current, and the ratio is the **inductance**:

$$
\lambda = L\,i, \qquad L = \frac{N^2 \mu A}{\ell}
$$

- $\lambda$: flux linkage (Wb·turns)
- $L$: inductance, in henries (H)
- $N$: number of turns; $\mu$: permeability of the core
- $A$: cross-sectional area of the coil; $\ell$: its length

More turns, a bigger coil or an iron core all give more inductance. Real values range from microhenries (µH) to a few henries.

**Where $v = L\frac{di}{dt}$ comes from.** Faraday's law says a *changing* flux induces a voltage, $v = \frac{d\lambda}{dt}$. Differentiate $\lambda = Li$:

$$
v_L = L\frac{di_L}{dt}
$$

So an inductor's voltage depends on how fast its **current changes**. A steady current, however large, produces no voltage. By Lenz's law the induced voltage always **opposes the change** that caused it. Try to speed the current up and the inductor pushes back, and try to stop it and the inductor pushes forward to keep it going. That's the inductor's "inertia", and it's the reason an LC circuit overshoots and rings.

![[ele-302-cap-ind-structure.svg]]
*Figure 1: A capacitor stores energy in the electric field between its plates (left). An inductor stores energy in the magnetic field through its coil (right).*

Here's the same circuit with an inductor. The field grows with the current, and the voltage is what jumps. Try opening the switch while the coil is energized.

<div class="melon-capind" data-view="ind">Interactive inductor diagram (open this page on the site to use it).</div>

### Passive sign convention

Both laws assume the **passive sign convention**, where the current arrow points **into the $+$ terminal** of the voltage. If your current arrow points into the $-$ terminal instead, put a minus sign in front: $i_C = -C\frac{dv_C}{dt}$, $v_L = -L\frac{di_L}{dt}$.

> [!warning] Most sign errors in the Ch 8 slopes come from this. Before writing $\frac{dv_C}{dt} = \frac{i_C}{C}$, check that $i_C$ is the current flowing into the capacitor's $+$ terminal.

### The two elements are mirror images

Swap $v \leftrightarrow i$ and $C \leftrightarrow L$ and every capacitor result turns into an inductor result. This is called **duality**, and it means you really only have to learn one of them:

| |Capacitor|Inductor|
|---|---|---|
|Physical form|Two plates and an insulator|A coil of wire|
|Stores energy in|Electric field|Magnetic field|
|Defining relation|$q = Cv$|$\lambda = Li$|
|Element law|$i = C\frac{dv}{dt}$|$v = L\frac{di}{dt}$|
|Integral form|$v(t) = \frac{1}{C}\int_{t_0}^{t} i\,dt + v(t_0)$|$i(t) = \frac{1}{L}\int_{t_0}^{t} v\,dt + i(t_0)$|
|Stored energy|$w = \frac{1}{2}Cv^2$|$w = \frac{1}{2}Li^2$|
|Can't jump|Voltage $v_C$|Current $i_L$|
|Can jump|Current $i_C$|Voltage $v_L$|
|At DC steady state|Open circuit ($i = 0$)|Short circuit ($v = 0$)|
|In series|$\frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2} + \cdots$|$L_{eq} = L_1 + L_2 + \cdots$|
|In parallel|$C_{eq} = C_1 + C_2 + \cdots$|$\frac{1}{L_{eq}} = \frac{1}{L_1} + \frac{1}{L_2} + \cdots$|
|Impedance|$Z_C = \frac{1}{j\omega C}$|$Z_L = j\omega L$|
|Mechanical analogy|Spring|Mass|

The rest of this page goes through each row.

### Integral form

Integrating the element law from a starting time $t_0$ gives the value at any later time:

$$
v_C(t) = \frac{1}{C}\int_{t_0}^{t} i_C\,dt + v_C(t_0), \qquad i_L(t) = \frac{1}{L}\int_{t_0}^{t} v_L\,dt + i_L(t_0)
$$

The integral adds up everything that's happened since $t_0$, and the last term is where it started. That's the "memory". A capacitor's voltage now depends on all the current that has ever flowed into it, not just the current right now. It's also why you need **initial conditions** to solve any circuit with a C or L in it.

### Stored energy

The power into any element is $p = vi$. For a capacitor, substitute $i = C\frac{dv}{dt}$ and integrate from an uncharged state ($v = 0$):

$$
w_C = \int p\,dt = \int C v \frac{dv}{dt}\,dt = \int_0^{v} C v\,dv = \tfrac{1}{2}C v^2
$$

The inductor works the same way with $v = L\frac{di}{dt}$:

$$
w_L = \int L i \frac{di}{dt}\,dt = \int_0^{i} L i\,di = \tfrac{1}{2}L i^2
$$

Three things follow from these:

- **The energy is never negative** (it's a square), so an ideal C or L can only give back energy it took in earlier. It can't generate any.
- **Ideal capacitors and inductors don't dissipate.** If $p$ is positive the element is absorbing and storing energy, and if it's negative the element is releasing what it stored. Over a full cycle of a steady AC signal, they absorb and release the same amount.
- **The energy only depends on $v_C$ (or $i_L$).** That's the link to continuity, coming up next.

### Why $v_C$ and $i_L$ can't jump

Say a capacitor's voltage jumped from $v_1$ to $v_2$ in zero time. Then:

- $\frac{dv}{dt} = \frac{v_2 - v_1}{0}$ is infinite, so $i_C = C\frac{dv}{dt}$ would be infinite.
- Equivalently, the stored energy would change from $\frac{1}{2}Cv_1^2$ to $\frac{1}{2}Cv_2^2$ in zero time, which needs infinite power.

Neither is possible in a real circuit, so **capacitor voltage is continuous**. The same argument with $v_L = L\frac{di}{dt}$ shows **inductor current is continuous**. At a switching instant $t = 0$:

$$
v_C(0^+) = v_C(0^-), \qquad i_L(0^+) = i_L(0^-)
$$

The *other* variable has no such protection. A capacitor's current can jump instantly (it only sets the *slope* of the voltage), and so can an inductor's voltage. On a graph, a jump in $i_C$ shows up as a sudden **change of slope** (a corner) in $v_C$, never a step (see Example 1 below).

> [!note] At $t = 0^+$ you can replace a capacitor with a voltage source of value $v_C(0^-)$, and an inductor with a current source of value $i_L(0^-)$. Ch 8 Step 3 uses exactly this.

The easiest way to see all of this is as slopes. Drag along the graph: the current through a capacitor (or the voltage across an inductor) is just the slope of the curve above it, scaled by $C$ (or $L$).

<div class="melon-capind" data-view="slope">Interactive slope diagram (open this page on the site to use it).</div>

### DC steady state

When a DC circuit has been on for a long time, every voltage and current has stopped changing, so every derivative is 0:

- Capacitor: $i_C = C \cdot 0 = 0$. No current flows, so it acts like an **open circuit**. It still holds whatever voltage it charged to.
- Inductor: $v_L = L \cdot 0 = 0$. There's no voltage across it, so it acts like a **short circuit**. It still carries whatever current is flowing.

These are the two rules for finding initial values (the circuit before switching) and final values (as $t \to \infty$) in Ch 8.

There's also a matching pair of rules for the instant a source is first switched on, if nothing was stored beforehand. An **uncharged capacitor** ($v_C = 0$) acts like a **short** at that instant, and an inductor with **no current** ($i_L = 0$) acts like an **open**. They then gradually change toward their DC steady-state behaviour.

### Series and parallel

Capacitors combine like resistors **the other way around**, and inductors combine **exactly like resistors**.

**Capacitors in parallel add.** Every capacitor has the same voltage $v$, and the currents add:

$$
i = C_1\frac{dv}{dt} + C_2\frac{dv}{dt} + \cdots = (C_1 + C_2 + \cdots)\frac{dv}{dt} \quad\Rightarrow\quad C_{eq} = C_1 + C_2 + \cdots
$$

Physically, parallel capacitors are like one capacitor with a bigger plate area.

**Capacitors in series combine like parallel resistors.** They all carry the same current, so they all gain the same charge, and the voltages add: $v = \frac{q}{C_1} + \frac{q}{C_2} + \cdots$, which gives $\frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2} + \cdots$. For two, $C_{eq} = \frac{C_1 C_2}{C_1 + C_2}$. Physically, it's like one capacitor with a wider gap.

**Inductors in series add**, because they carry the same current and their voltages add: $v = (L_1 + L_2 + \cdots)\frac{di}{dt}$. **Inductors in parallel** combine like parallel resistors.

> [!tip] Memory aid: $L$ behaves like $R$. $C$ behaves like $\frac{1}{R}$ (a conductance), so it flips.

### Impedance: how they behave at different frequencies

For a sinusoid at angular frequency $\omega$, $\frac{d}{dt}$ becomes multiplication by $j\omega$, so each element acts like a frequency-dependent resistance called **impedance**:

$$
Z_C = \frac{1}{j\omega C}, \qquad Z_L = j\omega L
$$

|Frequency|Capacitor|Inductor|
|---|---|---|
|DC ($\omega = 0$)|$Z_C \to \infty$: open|$Z_L = 0$: short|
|Very high ($\omega \to \infty$)|$Z_C \to 0$: short|$Z_L \to \infty$: open|

This matches the DC steady-state rules above, and it's also why a sudden change (which has very high frequencies in it) gets through a capacitor but is blocked by an inductor. It's the basis of filters in [[ch14-frequency-response|Ch 14]].

### Mechanical analogy

|Electrical|Mechanical|Why|
|---|---|---|
|Capacitor|Spring|Stores energy in how far it's "stretched" (its voltage)|
|Inductor|Mass|Stores energy in how fast it's "moving" (its current), and resists changes in it (inertia)|
|Resistor|Friction|Turns energy into heat|

A charged capacitor connected to an inductor behaves like a stretched spring with a mass on it, and it oscillates at $\omega_0 = \frac{1}{\sqrt{LC}}$. Adding resistance (friction) makes the oscillation die out. That's the whole story of [[ch08-second-order-circuits|Ch 8]].

### Real components

Real parts are close to ideal, but not quite:

- **Capacitors** leak a little, since a very large resistance in parallel lets the charge slowly drain away. They also have a small series resistance (ESR) and a **maximum voltage rating**, and going over it breaks down the dielectric. Electrolytic capacitors are **polarized** and have to be connected the right way around.
- **Inductors** are made of wire, so they have a **winding resistance** in series. At DC a real inductor is a small resistor, not a perfect short. Inductors with iron cores also **saturate** at high current, and then $L$ drops.

In ELE 302 problems, assume ideal elements unless the question says otherwise.

## Key formulas

**Capacitor**

$$
q = Cv, \qquad i_C = C\frac{dv_C}{dt}, \qquad v_C(t) = \frac{1}{C}\int_{t_0}^{t} i_C\,dt + v_C(t_0), \qquad w_C = \tfrac{1}{2}Cv_C^2
$$

**Inductor**

$$
\lambda = Li, \qquad v_L = L\frac{di_L}{dt}, \qquad i_L(t) = \frac{1}{L}\int_{t_0}^{t} v_L\,dt + i_L(t_0), \qquad w_L = \tfrac{1}{2}Li_L^2
$$

**Continuity**

$$
v_C(0^+) = v_C(0^-), \qquad i_L(0^+) = i_L(0^-)
$$

**Combinations**

$$
C_{\parallel} = C_1 + C_2, \qquad C_{\text{series}} = \frac{C_1 C_2}{C_1 + C_2}, \qquad L_{\text{series}} = L_1 + L_2, \qquad L_{\parallel} = \frac{L_1 L_2}{L_1 + L_2}
$$

**Impedance**

$$
Z_C = \frac{1}{j\omega C}, \qquad Z_L = j\omega L
$$

- $v_C$, $i_C$: capacitor voltage and current; $v_L$, $i_L$: inductor voltage and current (passive sign convention)
- $C$: capacitance (F); $L$: inductance (H)
- $w_C$, $w_L$: stored energy (J)
- $t_0$: the time you start integrating from, usually 0

## Worked example

### Example 1: Capacitor voltage from its current

A $0.5\ \text{F}$ capacitor starts at $v(0) = 2\ \text{V}$. Its current is $1\ \text{A}$ for $0 < t < 2\ \text{s}$, then $-0.5\ \text{A}$ for $2 < t < 4\ \text{s}$, then 0. Find $v(t)$ and the stored energy at $t = 0$, 2 and 4 s.

1. **$0 < t < 2$:** integral form, with $\frac{1}{C} = 2$:
   $$v(t) = 2\int_0^t 1\,dt + 2 = 2 + 2t \quad\Rightarrow\quad v(2) = 6\ \text{V}$$
2. **$2 < t < 4$:** start from $v(2) = 6$ (the voltage can't jump, even though the current does):
   $$v(t) = 2\int_2^t (-0.5)\,dt + 6 = 6 - (t - 2) \quad\Rightarrow\quad v(4) = 4\ \text{V}$$
3. **$t > 4$:** no current, so the voltage just holds: $v = 4\ \text{V}$.
4. **Energy**, $w = \frac{1}{2}Cv^2 = \frac{1}{4}v^2$:
   $$w(0) = 1\ \text{J}, \qquad w(2) = 9\ \text{J}, \qquad w(4) = 4\ \text{J}$$

![[ele-302-cap-ind-ex1-waveforms.svg]]
*Figure 2: Example 1. The current jumps at $t = 2$ and $t = 4$, but the voltage only changes slope.*

From 0 to 2 s the capacitor absorbs $9 - 1 = 8\ \text{J}$. From 2 to 4 s the current reverses and it gives $9 - 4 = 5\ \text{J}$ back to the circuit. After 4 s it holds onto the remaining 4 J indefinitely (an ideal capacitor doesn't leak).

### Example 2: Inductor voltage from its current

The current in a $0.2\ \text{H}$ inductor is 0 for $t < 0$ and $i(t) = 5(1 - e^{-10t})\ \text{A}$ for $t \geq 0$. Find $v(t)$, and the energy stored as $t \to \infty$.

1. **Check continuity:** $i(0^+) = 5(1 - 1) = 0 = i(0^-)$ ✓
2. **Element law:**
   $$v(t) = L\frac{di}{dt} = 0.2 \cdot 5 \cdot 10\,e^{-10t} = 10\,e^{-10t}\ \text{V} \quad (t > 0)$$
   The voltage jumps from 0 to 10 V at $t = 0$. That's fine, since only the inductor's *current* has to be continuous.
3. **As $t \to \infty$:** $v \to 0$ (the inductor becomes a short, as at DC steady state) and $i \to 5\ \text{A}$, so
   $$w_L = \tfrac{1}{2}(0.2)(5)^2 = 2.5\ \text{J}$$

### Example 3: Combining elements

(a) A $6\ \mu\text{F}$ and a $3\ \mu\text{F}$ capacitor in series, with that pair in parallel with a $4\ \mu\text{F}$. (b) A $4\ \text{H}$ and a $12\ \text{H}$ inductor in parallel, with that pair in series with a $2\ \text{H}$.

**(a)** Series first: $\frac{6 \cdot 3}{6 + 3} = 2\ \mu\text{F}$. Then parallel adds: $C_{eq} = 2 + 4 = 6\ \mu\text{F}$.

**(b)** Parallel first: $\frac{4 \cdot 12}{4 + 12} = 3\ \text{H}$. Then series adds: $L_{eq} = 3 + 2 = 5\ \text{H}$.

## Common mistakes

- Thinking capacitor **current** or inductor **voltage** has to be continuous. Only $v_C$ and $i_L$ are
- Mixing up the combination rules. Capacitors in **parallel** add and inductors in **series** add
- Forgetting the initial value ($v_C(t_0)$ or $i_L(t_0)$) when using the integral form
- Ignoring the passive sign convention, which flips the sign of $i = C\frac{dv}{dt}$ or $v = L\frac{di}{dt}$
- Treating a capacitor at DC steady state as having **zero voltage**. It has zero *current*, but it can still hold a voltage
- Thinking a large voltage on a capacitor means a large current. The current depends on how fast the voltage **changes**

## Related

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]: an L and a C together
- [[ch14-frequency-response|Ch 14: Frequency Response]]: impedance and filters

## Seen in

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]
