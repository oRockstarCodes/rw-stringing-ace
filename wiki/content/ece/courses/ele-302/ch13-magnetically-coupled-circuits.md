---
title: "Ch 13: Magnetically Coupled Circuits"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 13** · Lecture notes: *Notes 5, Mutual Inductance*

Until now, two circuits were connected only if a wire joined them. This chapter adds a second way. **Two coils placed close together share a magnetic field**, so a changing current in one coil induces a voltage in the other, with no wire between them. The pair is **magnetically coupled**, and the link is measured by the **mutual inductance** $M$.

A transformer is exactly this: two coils on a shared core. Transformers step the grid's voltage up and down, isolate one circuit from another, and match a load to a source. To analyse them you need three things:

1. **Where the induced voltage comes from**, and how big it is ($M$, and the coupling coefficient $k$).
2. **Which way it points.** The physical winding direction is hidden, so circuit diagrams use **dots** to show it. Getting the sign of every mutual term right is most of the work.
3. **Two models.** The *linear transformer* (finite $L_1$, $L_2$, $M$: write two KVL equations) and the *ideal transformer* (just a turns ratio).

> [!example] The whole chapter in plain words
> - **Self-inductance:** a coil's current makes a magnetic field, and when that field changes it induces a voltage in the same coil that opposes the change.
> - **Mutual inductance:** the same field also passes through a neighbouring coil and induces a voltage there.
> - **Dots:** a label that saves you from knowing which way each coil is wound. Current into a dot makes the other coil's dot positive.
> - **Energy:** the field stores $\frac{1}{2}L_1i_1^2 + \frac{1}{2}L_2i_2^2 \pm Mi_1i_2$. The cross term is why $M$ can never exceed $\sqrt{L_1L_2}$.
> - **Reflected impedance:** the secondary loop shows up in the primary loop as an extra impedance.
> - **Ideal transformer:** perfect coupling. Voltage scales by the turns ratio, current by its inverse, and impedance by its square.
>
> [[#Solving the problems]] turns each of these into a recipe.

> [!tip] Background pages
> - [[capacitors-and-inductors#The inductor|Capacitors and Inductors: the inductor]]: current builds a field, and a changing field induces a voltage that opposes the change
> - [[capacitors-and-inductors#Stored energy|Stored energy]]: $\frac{1}{2}Li^2$, which this chapter extends to two coils
> - [[capacitors-and-inductors#Impedance: how they behave at different frequencies|Impedance]]: every example here is solved with phasors, using $j\omega L$ and $\frac{1}{j\omega C}$

> [!note] Worked examples sit right after the concept they use. Try each one on paper before opening the answer. In every coupled-coil example the first step is the same: **look at the dots and the current arrows, and decide the sign of each mutual term before writing anything else.**

## Notes

### Self-Inductance

Start with one coil of $N$ turns carrying current $i$. The chain of cause and effect:

1. The current, flowing around $N$ turns, pushes flux $\phi$ around the core. The push is $Ni$ (ampere-turns), and the core resists it with its **reluctance** $\mathcal{R}$ (a magnetic "resistance" set by the core's material and shape):

$$
\phi = \frac{Ni}{\mathcal{R}} \tag{13.1}
$$

2. If $i$ changes, $\phi$ changes. **Faraday's law:** a changing flux through a coil induces a voltage in every turn, so in all $N$ turns

$$
v = N\frac{d\phi}{dt} \tag{13.2}
$$

3. Put (13.1) into (13.2):

$$
v = N\frac{d}{dt}\left(\frac{Ni}{\mathcal{R}}\right) = \frac{N^2}{\mathcal{R}}\frac{di}{dt} = L\frac{di}{dt}, \qquad L = \frac{N^2}{\mathcal{R}} \tag{13.3}
$$

So inductance is not a separate mystery quantity. It's the turns squared over the reluctance: **double the turns and $L$ goes up four times** (twice the flux, linked by twice the turns). The induced voltage opposes the change in current (Lenz's law), which is why an inductor resists sudden changes.

### Mutual Inductance

Now put a second coil ($N_2$ turns) on the same core and leave it open. Current $i_1$ in coil 1 creates flux $\phi_{12} = \frac{N_1 i_1}{\mathcal{R}}$, and some or all of it **also passes through coil 2**. When $i_1$ changes, that shared flux changes, and Faraday's law induces a voltage in coil 2:

$$
v_2 = N_2\frac{d\phi_{12}}{dt} = \frac{N_1N_2}{\mathcal{R}}\frac{di_1}{dt} = M_{21}\frac{di_1}{dt} \tag{13.4}
$$

$M_{21}$ is the **mutual inductance** of coil 2 with respect to coil 1, in henries. It works the other way round too: current $i_2$ in coil 2 induces $v_1 = M_{12}\frac{di_2}{dt}$ in coil 1. The energy argument below shows the two are always equal, so we just write

$$
M_{12} = M_{21} = M
$$

Each coil therefore has two voltages across it: its **self** voltage from its own current, and a **mutual** voltage from the other coil's current.

$$
v_1 = L_1\frac{di_1}{dt} \pm M\frac{di_2}{dt}, \qquad v_2 = \pm M\frac{di_1}{dt} + L_2\frac{di_2}{dt} \tag{13.5}
$$

In phasor form, $\frac{d}{dt} \to j\omega$, so the mutual term is just another reactance, $X_M = \omega M$:

$$
V_1 = j\omega L_1 I_1 \pm j\omega M I_2, \qquad V_2 = \pm j\omega M I_1 + j\omega L_2 I_2 \tag{13.6}
$$

The $\pm$ is the whole difficulty of this chapter, and the next section settles it.

#### The coupling coefficient

Not all of coil 1's flux reaches coil 2. Some leaks out into the air. The **coupling coefficient** $k$ measures how much is shared:

$$
M = k\sqrt{L_1L_2}, \qquad 0 \le k \le 1 \tag{13.7}
$$

| $k$ | Meaning |
|---|---|
| $0$ | No shared flux: the coils don't affect each other |
| $< 0.5$ | Loosely coupled (coils far apart, or air core) |
| $> 0.5$ | Tightly coupled (shared iron core) |
| $1$ | Perfect coupling: every line of flux passes through both coils. The ideal transformer |

Where does the $\sqrt{L_1L_2}$ come from? With all the flux shared ($k = 1$), $M = \frac{N_1N_2}{\mathcal{R}}$ and $L_1L_2 = \frac{N_1^2}{\mathcal{R}}\cdot\frac{N_2^2}{\mathcal{R}}$, so $M^2 = L_1L_2$ exactly. Leakage can only make $M$ smaller.

#### Example 13.1: Finding $M$ from $k$

Two coils have $L_1 = 5$ H and $L_2 = 4$ H with coupling coefficient $k = 0.56$. Find $M$, and the largest $M$ these coils could ever have.

$$
M = k\sqrt{L_1L_2} = 0.56\sqrt{5 \times 4} = 0.56 \times 4.47 = 2.5\ \text{H}
$$

The largest possible is $k = 1$: $M_{\max} = \sqrt{20} = 4.47$ H. This is the coil pair used in Example 13.2.

### The Dot Convention

The sign of the mutual voltage depends on **which way each coil is wound** around the core, which a circuit symbol doesn't show. Instead, one end of each coil gets a **dot**. The dots are placed so that this rule always works:

> [!important] Dot rule
> - Current **entering** the dotted end of one coil induces a voltage in the other coil that is **positive at its dotted end**.
> - Current **leaving** the dotted end of one coil induces a voltage in the other coil that is **negative at its dotted end**.

![[ele-302-coupled-dot-rule.svg]]
*Figure 13.1: The dot rule. Only the current's direction relative to its own dot matters, not where the dots sit on the page.*

For KVL around a loop, this boils down to one comparison per pair of coils:

| The two coil currents… | Mutual term in KVL |
|---|---|
| both **enter** their dots, or both **leave** them | $+\,j\omega M \times$ (other coil's current) |
| one enters its dot and the other leaves | $-\,j\omega M \times$ (other coil's current) |

> [!tip] How to apply it without errors
> 1. For each coil, write down the current **through that coil**, in the direction you're walking around the loop. For a coil in a shared branch, that's a difference like $I_1 - I_2$.
> 2. Mark whether that current enters or leaves the coil's dot.
> 3. Same for both coils (enter/enter or leave/leave): mutual terms are $+$. Different: $-$.
> 4. The self term ($j\omega L I$) is always $+$, exactly like an ordinary inductor.

#### Series coils

Two coupled coils in series carry the same current, so the rule gives one of two answers:

$$
L_{\text{eq}} = L_1 + L_2 + 2M \ \ \text{(series aiding: current enters both dots)}, \qquad L_{\text{eq}} = L_1 + L_2 - 2M \ \ \text{(series opposing)} \tag{13.8}
$$

The $2M$ appears because each coil induces $M\frac{di}{dt}$ in the other, so there are two mutual terms. Example 13.4 has a pair like this hiding inside it.

### Energy in Coupled Coils

The notes build the stored energy in two steps, raising one current at a time.

**Step 1.** Raise $i_1$ from 0 to $I_1$ with $i_2 = 0$. Only coil 1's self-inductance is involved, so it stores the familiar

$$
w_1 = \int_0^{I_1} L_1 i_1\,di_1 = \tfrac{1}{2}L_1I_1^2
$$

**Step 2.** Hold $i_1 = I_1$ and raise $i_2$ from 0 to $I_2$. Coil 2 stores its own $\frac{1}{2}L_2I_2^2$. But $i_2$ is changing, so it induces $M\frac{di_2}{dt}$ in coil 1, and the source holding $I_1$ constant has to push against that. The extra work is

$$
\int_0^{I_2} M I_1\,di_2 = MI_1I_2
$$

**Total:**

$$
w = \tfrac{1}{2}L_1i_1^2 + \tfrac{1}{2}L_2i_2^2 \pm M\,i_1i_2 \tag{13.9}
$$

- Use $+M$ when both currents enter (or both leave) their dots, $-M$ otherwise. It's the same comparison as for KVL.
- If you'd raised $i_2$ first, you'd get $M_{21}I_1I_2$ instead of $M_{12}I_1I_2$. The final energy can't depend on the order you switched things on, so **$M_{12} = M_{21}$**.
- Eq. (13.9) holds at every instant, so use **instantaneous** currents $i_1(t)$ and $i_2(t)$, not phasors.

**Why $M \le \sqrt{L_1L_2}$.** Take the minus sign. Stored energy can never be negative, so $\frac{1}{2}L_1i_1^2 + \frac{1}{2}L_2i_2^2 - Mi_1i_2 \ge 0$ for every pair of currents. The worst case gives exactly $M \le \sqrt{L_1L_2}$, which is $k \le 1$.

### Linear Transformers

A **linear transformer** is two coupled coils with finite $L_1$, $L_2$ and $M$ (often air-cored). The coil connected to the source is the **primary**, the one connected to the load is the **secondary**.

**Method.** Write a mesh equation for each side, then eliminate $I_2$:

$$
\text{Loop 1: } (Z_1 + j\omega L_1)I_1 \pm j\omega M I_2 = V, \qquad \text{Loop 2: } \pm j\omega M I_1 + (j\omega L_2 + Z_L)I_2 = 0
$$

where $Z_1$ is everything else in the primary loop and $Z_L$ everything else in the secondary loop. Solving loop 2 for $I_2$ and substituting:

$$
Z_{\text{in}} = \frac{V}{I_1} = Z_1 + j\omega L_1 + \underbrace{\frac{\omega^2M^2}{j\omega L_2 + Z_L}}_{Z_R} \tag{13.10}
$$

$Z_R$ is the **reflected impedance**: the secondary loop, as the primary sees it. Two things to notice:

- **It depends on $M^2$**, so the dots don't change it. The dots only decide the sign of $I_2$.
- The notes write it as $-\frac{X_M \cdot X_M}{R + X_{L2}}$ with $X_M = j\omega M$. That's the same thing, since $(j\omega M)^2 = -\omega^2M^2$.

#### Example 13.2: Coupled coils, both dots on top

In Figure 13.2, $R = 12\ \Omega$, $C = \frac{1}{48}$ F, $L_1 = 5$ H, $L_2 = 4$ H, $M = 2.5$ H, and $V = 100\angle 0^\circ$ V at $\omega = 4$ rad/s. Find $I_1$ and $I_2$, then the energy stored in the coils at $t = \frac{\pi}{8}$ s.

![[ele-302-coupled-ex1.svg]]
*Figure 13.2: Circuit for Example 13.2.*

**Impedances at $\omega = 4$.**

| Element | Impedance |
|---|---|
| $L_1 = 5$ H | $j20\ \Omega$ |
| $L_2 = 4$ H | $j16\ \Omega$ |
| $M = 2.5$ H | $j10\ \Omega$ |
| $C = \frac{1}{48}$ F | $\frac{1}{j4/48} = -j12\ \Omega$ |
| $R$ | $12\ \Omega$ |

**Signs.** $I_1$ enters the dot of $L_1$. $I_2$ flows up through $L_2$ and out of its top, so it **leaves** the dot. One enters, one leaves, so the mutual terms are **negative**.

$$
\text{Loop 1: } (-j12 + j20)I_1 - j10\,I_2 = 100
$$

$$
\text{Loop 2: } -j10\,I_1 + (12 + j16)I_2 = 0 \ \Rightarrow\ I_2 = \frac{j10}{12 + j16}\,I_1
$$

**Input impedance.** Substitute, or use (13.10) directly:

$$
Z_R = \frac{\omega^2M^2}{12 + j16} = \frac{100}{12 + j16} = 3 - j4\ \Omega, \qquad Z_{\text{in}} = j8 + 3 - j4 = 3 + j4 = 5\angle 53.13^\circ\ \Omega
$$

**Currents.**

$$
I_1 = \frac{100}{3 + j4} = 12 - j16 = 20\angle -53.13^\circ\ \text{A}, \qquad I_2 = \frac{j10}{12 + j16}(12 - j16) = 9.6 - j2.8 = 10\angle -16.26^\circ\ \text{A}
$$

**Energy at $t = \frac{\pi}{8}$.** Energy needs instantaneous values. Convert back to time and substitute ($4t = 90^\circ$ at this instant):

$$
i_1 = 20\cos(4t - 53.13^\circ) = 20\cos 36.87^\circ = 16\ \text{A}, \qquad i_2 = 10\cos(4t - 16.26^\circ) = 10\cos 73.74^\circ = 2.8\ \text{A}
$$

The sign comparison is the same as for KVL (one enters, one leaves), so the cross term is $-M$:

$$
w = \tfrac{1}{2}(5)(16)^2 + \tfrac{1}{2}(4)(2.8)^2 - (2.5)(16)(2.8) = 640 + 15.68 - 112 = 543.68\ \text{J}
$$

> [!note] The notes write the phases in radians: $20\cos(4t - 0.9273)$ and $10\cos(4t - 0.2838)$. Those are the same as $-53.13^\circ$ and $-16.26^\circ$. Whichever you use, set your calculator to match.

#### Example 13.3: Secondary dot at the bottom

In Figure 13.3, $R = 8\ \Omega$, $C = \frac{1}{24}$ F, $L_1 = L_2 = 4$ H, $M = 2.5$ H, and $V = 100\angle 0^\circ$ V at $\omega = 4$ rad/s. Find $I_1$, $I_2$ and the stored energy at $t = \frac{\pi}{8}$ s.

![[ele-302-coupled-ex2.svg]]
*Figure 13.3: Circuit for Example 13.3. The dot on $L_2$ is now at the bottom.*

**Impedances.** $j\omega L_1 = j\omega L_2 = j16$, $j\omega M = j10$, $\frac{1}{j\omega C} = -j6$.

**Signs.** $I_1$ enters the dot of $L_1$ (top). $I_2$ goes clockwise: down through $C$, back along the bottom wire, and **up into the bottom of $L_2$, which is its dot**. Both enter, so the mutual terms are **positive**.

$$
\text{Loop 1: } (8 + j16)I_1 + j10\,I_2 = 100
$$

$$
\text{Loop 2: } j10\,I_1 + (j16 - j6)I_2 = 0 \ \Rightarrow\ j10\,I_1 + j10\,I_2 = 0 \ \Rightarrow\ I_2 = -I_1
$$

**Solve.** Put $I_2 = -I_1$ into loop 1:

$$
(8 + j16 - j10)I_1 = 100 \ \Rightarrow\ I_1 = \frac{100}{8 + j6} = 8 - j6 = 10\angle -36.87^\circ\ \text{A}, \qquad I_2 = -8 + j6 = 10\angle 143.13^\circ\ \text{A}
$$

**Energy at $t = \frac{\pi}{8}$** ($4t = 90^\circ$):

$$
i_1 = 10\cos(90^\circ - 36.87^\circ) = 6\ \text{A}, \qquad i_2 = 10\cos(90^\circ + 143.13^\circ) = -6\ \text{A}
$$

Both currents enter their dots, so the cross term is $+M$:

$$
w = \tfrac{1}{2}(4)(6)^2 + \tfrac{1}{2}(4)(-6)^2 + (2.5)(6)(-6) = 72 + 72 - 90 = 54\ \text{J}
$$

> [!warning] Notes check
> The notes' final answer of 54 J is right, but the instantaneous currents written above it ($-9.77$ and $+9.77$ A) aren't. At $t = \pi/8$ they're $6$ and $-6$ A, which is what actually gives 54 J. The notes also round the angle to $-36.6^\circ$; it's $-36.87^\circ$. Their first line for loop 1 says $+X_M I_2$ and a later line says $-10j\,I_2$. $+$ is correct for these dots, and it's what produces their (correct) currents.

#### Example 13.4: One coil in a shared branch

In Figure 13.4, $R_1 = 0.5\ \Omega$, $R_2 = 20\ \Omega$, $C = \frac{1}{3}$ F, $L_1 = L_2 = 4$ H, $M = 1$ H, and $V = 100\angle 0^\circ$ V at $\omega = 2$ rad/s. Find $I_1$, $I_2$ and the stored energy at $t = 0$.

![[ele-302-coupled-ex3.svg]]
*Figure 13.4: Circuit for Example 13.4. $L_1$ is shared by both meshes; $L_2$'s dot is at its right end.*

**Impedances.** $j\omega L_1 = j\omega L_2 = j8$, $j\omega M = j2$, $\frac{1}{j\omega C} = -j1.5$.

**Loop 1** (source, $R_1$, $C$, down through $L_1$). Walking down $L_1$, its current is $I_1 - I_2$, which **enters** its dot. $L_2$'s current $I_2$ flows left to right, **out of** its dot. Different, so the mutual term is $-$:

$$
(0.5 - j1.5)I_1 + j8(I_1 - I_2) - j2\,I_2 = 100 \ \Rightarrow\ (0.5 + j6.5)I_1 - j10\,I_2 = 100
$$

**Loop 2** (up through $L_1$, through $L_2$, down through $R_2$), term by term in the direction of $I_2$:

| Element | Current in the walking direction | Self term | Mutual term |
|---|---|---|---|
| $L_2$ | $I_2$, leaves its dot | $j8\,I_2$ | $L_1$'s current $(I_1 - I_2)$ enters its dot: different, so $-j2(I_1 - I_2)$ |
| $R_2$ | $I_2$ | $20\,I_2$ | none |
| $L_1$ (going up) | $I_2 - I_1$, leaves its dot | $j8(I_2 - I_1)$ | $L_2$'s $I_2$ leaves its dot: same, so $+j2\,I_2$ |

Add them and set the total to zero:

$$
(20 + j8 + j8 + j2 + j2)I_2 - (j8 + j2)I_1 = 0 \ \Rightarrow\ (20 + j20)I_2 = j10\,I_1
$$

The $j8 + j8 + 2(j2)$ is the series-aiding pattern from (13.8): seen by $I_2$ alone, it leaves both dots.

**Solve.**

$$
Z_{\text{in}} = (0.5 + j6.5) - j10\cdot\frac{j10}{20 + j20} = 3 + j4\ \Omega
$$

$$
I_1 = \frac{100}{3 + j4} = 12 - j16 = 20\angle -53.13^\circ\ \text{A}, \qquad I_2 = \frac{j10}{20 + j20}I_1 = 7 - j1 = 7.07\angle -8.13^\circ\ \text{A}
$$

**Energy at $t = 0$.** At $t = 0$ each current is its phasor's real part: $i_1 = 12$ A and $i_2 = 7$ A, so $L_1$ carries $i_1 - i_2 = 5$ A. $L_1$'s current enters its dot and $L_2$'s leaves, so the cross term is $-M$:

$$
w = \tfrac{1}{2}(4)(5)^2 + \tfrac{1}{2}(4)(7)^2 - (1)(5)(7) = 50 + 98 - 35 = 113\ \text{J}
$$

> [!warning] Notes check
> The notes list the givens as $t = 0$ but label the final values "where $t = 1$ sec". The numbers (12 A, 7 A, 113 J) are the $t = 0$ values. At $t = 1$ s they'd be different.

### The T-Equivalent

A linear transformer whose two coils share a common bottom terminal can be replaced by **three uncoupled inductors in a T**. That's useful because it gets rid of the dots altogether: after the swap, it's ordinary mesh or nodal analysis.

**Why it works.** With both dots at the top and both port currents entering the top terminals, the coils obey

$$
\begin{bmatrix} V_1 \\ V_2 \end{bmatrix} = \begin{bmatrix} j\omega L_1 & j\omega M \\ j\omega M & j\omega L_2 \end{bmatrix}\begin{bmatrix} I_1 \\ I_2 \end{bmatrix}
$$

A T of three inductors $L_a$, $L_b$, $L_c$ gives

$$
\begin{bmatrix} V_1 \\ V_2 \end{bmatrix} = \begin{bmatrix} j\omega(L_a + L_c) & j\omega L_c \\ j\omega L_c & j\omega(L_b + L_c) \end{bmatrix}\begin{bmatrix} I_1 \\ I_2 \end{bmatrix}
$$

Match the entries:

$$
L_c = M, \qquad L_a = L_1 - M, \qquad L_b = L_2 - M \tag{13.11}
$$

![[ele-302-coupled-t-model.svg]]
*Figure 13.5: T-equivalent of a linear transformer, for dots on the same end of both coils.*

> [!important] If the dots are on **opposite** ends, replace $M$ with $-M$ in (13.11): $L_c = -M$, $L_a = L_1 + M$, $L_b = L_2 + M$. A negative inductance is fine on paper; it's just a reactance of $-j\omega M$.

#### Example 13.5: Linear transformer, two ways

In Figure 13.6, $R_1 = 6\ \Omega$, $R_2 = 12\ \Omega$, $L_1 = L_2 = 8$ H, $M = 5$ H, and $V = 30\angle 0^\circ$ V at $\omega = 2$ rad/s. Find $I_1$ and $I_2$ (a) directly and (b) with the T-equivalent.

![[ele-302-coupled-ex4.svg]]
*Figure 13.6: Circuit for Example 13.5. $L_2$'s dot is at the bottom.*

**Impedances.** $j\omega L_1 = j\omega L_2 = j16$, $j\omega M = j10$.

**(a) Directly.** $I_1$ enters $L_1$'s dot; clockwise $I_2$ enters $L_2$ at the bottom, its dot. Both enter: $+$.

$$
\text{Loop 1: } (6 + j16)I_1 + j10\,I_2 = 30, \qquad \text{Loop 2: } j10\,I_1 + (12 + j16)I_2 = 0
$$

$$
Z_R = \frac{100}{12 + j16} = 3 - j4, \qquad Z_{\text{in}} = 6 + j16 + 3 - j4 = 9 + j12 = 15\angle 53.13^\circ\ \Omega
$$

$$
I_1 = \frac{30}{9 + j12} = 1.2 - j1.6 = 2\angle -53.13^\circ\ \text{A}, \qquad I_2 = \frac{-j10}{12 + j16}I_1 = -0.96 + j0.28 = 1\angle 163.74^\circ\ \text{A}
$$

**(b) T-equivalent.** The dots are on opposite ends, so use $-M$:

$$
X_c = -j10, \qquad X_a = j16 + j10 = j26, \qquad X_b = j26
$$

The shunt branch carries $I_1 - I_2$:

$$
\text{Loop 1: } (6 + j26)I_1 - j10(I_1 - I_2) = 30 \ \Rightarrow\ (6 + j16)I_1 + j10\,I_2 = 30
$$

$$
\text{Loop 2: } (12 + j26)I_2 - j10(I_2 - I_1) = 0 \ \Rightarrow\ j10\,I_1 + (12 + j16)I_2 = 0
$$

These are exactly the equations from (a), so the answers match: $I_1 = 2\angle -53.13^\circ$ A and $I_2 = 1\angle 163.74^\circ$ A.

> [!warning] Notes check
> - The notes give $I_2 = 2\angle 163.74^\circ$ A. The rectangular form next to it, $-0.96 + j0.28$, is right, and its magnitude is **1**, not 2.
> - The notes' T-model uses $X_c = +j10$ and $X_a = X_b = j6$ ($+M$) even though $L_2$'s dot is at the bottom. That gives the right $Z_{\text{in}} = 9 + j12$ (reflected impedance only depends on $M^2$), but their own T equations give $I_2 = \frac{j10\,I_1}{12 + j16} = +0.96 - j0.28$: the right size, the wrong sign. The $-0.96 + j0.28$ listed under the T-model is copied from the direct method, not produced by it. Using $-M$, as above, makes the T-model give the same $I_2$ as part (a).

### Ideal Transformers

An **ideal transformer** is the limit of a linear transformer with:

1. **Perfect coupling**, $k = 1$: every bit of flux links both coils.
2. **Zero core reluctance**, so $L_1$ and $L_2$ are effectively infinite. Their ratio stays fixed: $\frac{L_1}{L_2} = \frac{N_1^2/\mathcal{R}}{N_2^2/\mathcal{R}} = \frac{N_1^2}{N_2^2}$.
3. **No losses** in the windings or core.

Real iron-core power transformers come close. In the limit, $L_1$, $L_2$ and $M$ all drop out and only the **turns ratio** is left.

#### Voltage: the turns ratio

Same flux, different number of turns. Both coils see the same $\frac{d\phi}{dt}$, so by Faraday's law each turn has the same voltage:

$$
\frac{V_1}{N_1} = \frac{V_2}{N_2} \ \Rightarrow\ \frac{V_2}{V_1} = \frac{N_2}{N_1} = n \tag{13.12}
$$

The notes reach the same result from the KVL equations. With $k = 1$, $X_M^2 = X_1X_2$, and the $I_1$ terms cancel, leaving $V_1 = V_2\sqrt{X_1/X_2} = V_2\frac{N_1}{N_2}$.

#### Current: ampere-turns balance

The flux in the core is $\phi = \frac{N_1i_1 - N_2i_2}{\mathcal{R}}$ (with $i_2$ leaving the dot). As $\mathcal{R} \to 0$, the flux stays finite only if the top is zero:

$$
N_1I_1 = N_2I_2 \ \Rightarrow\ \frac{I_2}{I_1} = \frac{N_1}{N_2} = \frac{1}{n} \tag{13.13}
$$

The same result follows from conservation of power. An ideal transformer stores nothing and loses nothing, so $V_1I_1^* = V_2I_2^*$. If the voltage goes up by $n$, the current must go down by $n$.

> [!note] The notes say that for $k = 1$ "flux equals zero". More precisely, the *ampere-turns* $N_1i_1 - N_2i_2$ are zero, and dividing that by zero reluctance gives an indeterminate (finite) flux. The flux is still there; it's whatever the applied voltage demands.

#### Signs for an ideal transformer

(13.12) and (13.13) are magnitudes. The signs come from the dots:

| Quantity | Use $+$ when… | Otherwise |
|---|---|---|
| $\dfrac{V_2}{V_1} = \pm\dfrac{N_2}{N_1}$ | $V_1$ and $V_2$ are **both** $+$ at the dotted ends (or both at the undotted ends) | $-$ |
| $\dfrac{I_2}{I_1} = \pm\dfrac{N_1}{N_2}$ | one current **enters** its dot and the other **leaves** its dot | $-$ (both enter or both leave) |

The current rule is the opposite of the voltage rule. Physically: current into the primary's dot drives current **out of** the secondary's dot.

#### Impedance transfer

Put a load $Z_L$ on the secondary. Then $V_2 = I_2Z_L$, and substituting $V_2 = nV_1$ and $I_2 = I_1/n$:

$$
Z_{\text{in}} = \frac{V_1}{I_1} = \frac{Z_L}{n^2} = \left(\frac{N_1}{N_2}\right)^2 Z_L \tag{13.14}
$$

The primary sees the load **scaled by the turns ratio squared**. A step-up transformer ($n > 1$) makes the load look smaller; a step-down makes it look bigger. This is how transformers match a load to a source. Signs don't matter here, because the two sign flips cancel in the ratio.

#### Example 13.6: Ideal transformer with a reflected load

In Figure 13.7, $R_1 = 3\ \Omega$, $C = \frac{1}{24}$ F, $R_2 = 20\ \Omega$, $N_1 : N_2 = 1 : 2$, and $V = 100\angle 0^\circ$ V at $\omega = 4$ rad/s. Find $I_1$, $I_2$ and the complex power supplied by the source.

![[ele-302-coupled-ideal-ex1.svg]]
*Figure 13.7: Circuit for Example 13.6. The double line marks an iron core (an ideal transformer). $I_2$ is drawn entering the secondary's dot.*

**Reflect the load.** $\frac{1}{j\omega C} = -j6$, and $R_2$ looks like $\left(\frac{1}{2}\right)^2(20) = 5\ \Omega$ from the primary:

$$
Z_{\text{in}} = 3 - j6 + 5 = 8 - j6\ \Omega, \qquad I_1 = \frac{100}{8 - j6} = 8 + j6 = 10\angle 36.87^\circ\ \text{A}
$$

**Secondary current.** Both $I_1$ and $I_2$ enter their dots, so the sign is $-$:

$$
I_2 = -\frac{N_1}{N_2}I_1 = -\tfrac{1}{2}(8 + j6) = -4 - j3\ \text{A}
$$

**Source power.**

$$
S = VI_1^* = 100(8 - j6) = 800 - j600\ \text{VA}
$$

**Check.** $R_1$ uses $|I_1|^2(3) = 300$ W. $R_2$ uses $|I_2|^2(20) = 25 \times 20 = 500$ W. Total 800 W ✓. The capacitor's reactive power is $|I_1|^2(-6) = -600$ VAR ✓.

The notes also show where (13.14) comes from: solve this circuit as a linear transformer, then let $X_{L1}, X_{L2} \to \infty$ with $\frac{X_{L1}}{X_{L2}} = \left(\frac{N_1}{N_2}\right)^2$. The reflected term $\frac{X_M^2}{R_2 + X_{L2}}$ turns into $R_2\frac{X_{L1}}{X_{L2}} = R_2\left(\frac{N_1}{N_2}\right)^2$.

> [!warning] Notes check
> The notes write $-I_2 = \frac{N_1}{N_2}I_1 = 4 - j3$ A. Half of $8 + j6$ is $4 + j3$, so $-I_2 = 4 + j3$ and $I_2 = -4 - j3$ A.

#### Example 13.7: Ideal transformer with a shared resistor

In Figure 13.8, $R_1 = 20\ \Omega$, $R_2 = 10\ \Omega$, $R_3 = 30\ \Omega$, $N_1 : N_2 = 2 : 1$, and $V = 120\angle 0^\circ$ V. The secondary's dot is at the bottom, and $R_3$ is shared by both sides. Find $I_1$, $I_2$, $V_1$ and $V_2$.

![[ele-302-coupled-ideal-ex2.svg]]
*Figure 13.8: Circuit for Example 13.7.*

A shared resistor means you can't just reflect the load. Keep $V_1$ and $V_2$ as unknowns and use the transformer equations alongside KVL.

**Transformer equations.** $V_1$ is $+$ at its dot; $V_2$ is $+$ at its undotted end. Different, so

$$
\frac{V_2}{V_1} = -\frac{N_2}{N_1} = -\frac{1}{2} \ \Rightarrow\ V_2 = -0.5\,V_1
$$

$I_1$ enters the primary's dot. $I_2$ flows out of the top of the secondary, so inside the coil it goes from bottom to top: it **enters** the secondary's dot. Both enter:

$$
\frac{I_2}{I_1} = -\frac{N_1}{N_2} = -2 \ \Rightarrow\ I_2 = -2I_1
$$

**KVL.** $R_3$ carries $I_1 - I_2 = 3I_1$ downward.

$$
\text{Loop 1: } 120 = 20I_1 + V_1 + 30(I_1 - I_2) = 110I_1 + V_1
$$

$$
\text{Loop 2: } V_2 = 10I_2 + 30(I_2 - I_1) = -20I_1 - 90I_1 = -110I_1
$$

**Solve.** Loop 2 with $V_2 = -0.5V_1$ gives $V_1 = 220I_1$. Then loop 1: $120 = 330I_1$.

$$
I_1 = \frac{4}{11} = 0.364\ \text{A}, \quad I_2 = -\frac{8}{11} = -0.727\ \text{A}, \quad V_1 = 80\ \text{V}, \quad V_2 = -40\ \text{V}
$$

**Check with power.** The source delivers $120 \times \frac{4}{11} = 43.6$ W. The resistors use $20\left(\frac{4}{11}\right)^2 + 10\left(\frac{8}{11}\right)^2 + 30\left(\frac{12}{11}\right)^2 = 2.6 + 5.3 + 35.7 = 43.6$ W ✓. The transformer only passes power through: $V_1I_1 = 80 \times \frac{4}{11} = 29.1$ W goes into the primary, and $V_2I_2 = (-40)\left(-\frac{8}{11}\right) = 29.1$ W comes out of the secondary.

## Key formulas

**Self and mutual inductance**

$$
L = \frac{N^2}{\mathcal{R}}, \qquad M = \frac{N_1N_2}{\mathcal{R}}\ \ (k = 1), \qquad M = k\sqrt{L_1L_2},\ \ 0 \le k \le 1 \tag{13.3, 13.7}
$$

**Coupled-coil equations (phasor)**

$$
V_1 = j\omega L_1I_1 \pm j\omega MI_2, \qquad V_2 = \pm j\omega MI_1 + j\omega L_2I_2 \tag{13.6}
$$

- $+$ if both currents enter (or both leave) their dots, $-$ otherwise

**Series coupled coils**

$$
L_{\text{eq}} = L_1 + L_2 \pm 2M \tag{13.8}
$$

**Stored energy** (instantaneous currents, same sign rule)

$$
w = \tfrac{1}{2}L_1i_1^2 + \tfrac{1}{2}L_2i_2^2 \pm Mi_1i_2 \tag{13.9}
$$

**Linear transformer: reflected impedance**

$$
Z_{\text{in}} = Z_1 + j\omega L_1 + \frac{\omega^2M^2}{j\omega L_2 + Z_L} \tag{13.10}
$$

**T-equivalent** (dots on the same end; use $-M$ if they're on opposite ends)

$$
L_a = L_1 - M, \qquad L_b = L_2 - M, \qquad L_c = M \tag{13.11}
$$

**Ideal transformer**

$$
\frac{V_2}{V_1} = \pm\frac{N_2}{N_1} = \pm n, \qquad \frac{I_2}{I_1} = \pm\frac{N_1}{N_2} = \pm\frac{1}{n}, \qquad Z_{\text{in}} = \frac{Z_L}{n^2} \tag{13.12–13.14}
$$

- Voltage $+$ when both voltages are $+$ at the dots
- Current $+$ when one current enters its dot and the other leaves

## Solving the problems

| The question asks you to… | Type | Worked in |
|---|---|---|
| find $M$, $k$, or the largest possible $M$ | Coupling | Example 13.1 |
| find currents in a circuit with coupled coils | Coupled-coil mesh analysis | Examples 13.2–13.5 |
| find the energy stored in coupled coils | Energy | Examples 13.2–13.4 |
| replace coupled coils with a T | T-equivalent | Example 13.5 |
| find currents or power with an ideal transformer | Ideal transformer | Examples 13.6, 13.7 |

### Coupled-coil mesh analysis

1. Convert to phasors: $j\omega L_1$, $j\omega L_2$, $j\omega M$, $\frac{1}{j\omega C}$.
2. Draw mesh currents (clockwise is easiest) and write down the current **through each coil**.
3. **Signs first.** For each coil, does its current enter or leave its dot? Same for both: mutual terms $+$. Different: $-$.
4. Write each loop's KVL: the ordinary terms, plus $\pm j\omega M \times$ (the other coil's current) for each coupled coil in the loop.
5. For a plain primary/secondary circuit, solve loop 2 for $I_2$ and substitute, or go straight to (13.10).
6. Convert back to time if asked: $I = |I|\angle\theta \to |I|\cos(\omega t + \theta)$.

### Energy

1. Find the phasor currents (above).
2. Convert to instantaneous values **at the given time**. Watch degrees vs radians.
3. Use (13.9) with the coil currents (for a shared coil, the difference current). The $\pm M$ follows the same enter/leave comparison as KVL.

### T-equivalent

1. Check the coils share a common terminal (both bottoms joined).
2. Same-end dots: $L_c = M$, $L_a = L_1 - M$, $L_b = L_2 - M$. Opposite-end dots: flip the sign of $M$.
3. Solve the uncoupled circuit as usual. No dots, no mutual terms.

### Ideal transformer

1. **Simple load on the secondary:** reflect it, $Z_{\text{in}} = (N_1/N_2)^2Z_L$, solve the primary, then get $I_2$ and $V_2$ from the turns ratio.
2. **Anything shared between the two sides** (a resistor across both coils, a common ground through an element): keep $V_1$, $V_2$, $I_1$, $I_2$ as unknowns. Write the two transformer equations with signs from the dots, and two KVL equations. Solve the four together.
3. Check with power: what the source delivers equals what the resistors use.

## Common mistakes

- Deciding the mutual sign from where the dots **are on the page** instead of whether each current **enters or leaves** its dot
- For a coil in a shared branch, forgetting that its current is the difference $I_1 - I_2$, not $I_1$
- Mixing the KVL sign rule and the ideal-transformer **current** rule. For $\frac{I_2}{I_1}$, "both enter" means **minus**
- Using phasor magnitudes in $w = \frac{1}{2}L_1i_1^2 + \dots$. Energy at an instant needs the instantaneous values
- Converting $\cos(\omega t + \theta)$ with the calculator in the wrong mode. The notes mix radians and degrees
- Assuming the dots change $Z_{\text{in}}$. Reflected impedance uses $M^2$; the dots only flip the sign of $I_2$
- Using $L_c = +M$ in the T-equivalent when the dots are on opposite ends
- Reflecting an ideal-transformer load when an element is shared by both sides. Use the four equations instead
- Inverting the turns ratio: $Z_{\text{in}} = (N_1/N_2)^2Z_L$ is the primary looking at the secondary
