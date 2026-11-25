---
title: "Ch 12: Three-Phase Circuits"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 12** · Lecture notes: *Notes 6, Three Phase Circuits*

Almost all electric power is generated and delivered as **three-phase** AC: three sinusoidal voltages of the same size and frequency, each shifted by $120^\circ$ from the next. A generator makes them with three coils spaced $120^\circ$ apart around the stator, so the spinning magnet sweeps past each coil in turn.

Why three instead of one?

- **The total power is constant.** One phase delivers power in pulses at twice the line frequency. Three phases add up to a steady flow, so motors run smoothly without vibrating.
- **Less copper.** In a balanced system the three return currents add to zero, so the neutral wire carries little or nothing. Three wires deliver three times the power of a single-phase pair.

The analysis is phasor circuit analysis (ELE 202) with one shortcut: **in a balanced system you solve one phase and get the other two by shifting $\pm 120^\circ$.** The chapter is about when that shortcut works, how the Y and Δ connections change the voltages and currents, and what to do when the system isn't balanced.

> [!example] The whole chapter in plain words
> - **Balanced:** three equal voltages, $120^\circ$ apart. They add to zero at every instant.
> - **Sequence:** the order the peaks arrive in. abc is positive, acb is negative.
> - **Y vs Δ:** two ways to join three sources or three loads. Y has a common point (the neutral); Δ is a ring.
> - **Line vs phase:** a *phase* quantity belongs to one source or load element; a *line* quantity is on the wires between them. Y multiplies voltage by $\sqrt{3}$ between phase and line; Δ does the same to current.
> - **Per-phase equivalent:** convert everything to Y, solve phase a alone, and shift the answer by $\pm 120^\circ$ for b and c.
> - **Power:** constant in time, $P = \sqrt{3}V_LI_L\cos\theta$.
> - **Unbalanced:** the shortcut is gone. Solve all three phases with nodal analysis.
>
> [[#Solving the problems]] turns each of these into a recipe.

> [!tip] Background
> This chapter leans on ELE 202's phasor tools: impedance, complex power $S = VI^* = P + jQ$, and rms values. Every voltage and current in this chapter is an **rms phasor** unless it says otherwise.

> [!note] Worked examples sit right after the concept they use. Try each one on paper before opening the answer. Every three-phase example ends with a **power balance**: the power absorbed by the source, the lines and the load must add to zero. It takes one line and catches most mistakes.

## Notes

### Balanced Three-Phase Voltages

A three-phase source is three sinusoidal sources with a common frequency. It's **balanced** when:

1. all three have the **same magnitude** $V_p$, and
2. they're **$120^\circ$ apart** in phase.

For the **positive (abc) sequence**:

$$
V_{an} = V_p\angle 0^\circ, \qquad V_{bn} = V_p\angle -120^\circ, \qquad V_{cn} = V_p\angle -240^\circ = V_p\angle 120^\circ \tag{12.1}
$$

For the **negative (acb) sequence**, b and c swap places: $V_{cn} = V_p\angle -120^\circ$ and $V_{bn} = V_p\angle 120^\circ$.

![[ele-302-3ph-sequences.svg]]
*Figure 12.1: Phasor diagrams. The phasors rotate counter-clockwise at $\omega$, so in the positive sequence they pass a fixed point in the order a, b, c.*

**The sequence is just the order the peaks arrive in.** In the positive sequence $v_b$ peaks a third of a cycle after $v_a$, and $v_c$ a third of a cycle after that. It's set by which way the generator spins, and it decides which way a three-phase motor turns. Swapping any two wires reverses it.

**Balanced voltages add to zero:**

$$
V_{an} + V_{bn} + V_{cn} = V_p\left[1 + \left(-\tfrac{1}{2} - j\tfrac{\sqrt{3}}{2}\right) + \left(-\tfrac{1}{2} + j\tfrac{\sqrt{3}}{2}\right)\right] = 0 \tag{12.2}
$$

On the phasor diagram, three equal arrows $120^\circ$ apart close into a triangle. This one fact is behind every shortcut in the chapter.

### Y and Δ Connections

Three sources (or three loads) can be joined in two ways:

| | **Y (wye, star)** | **Δ (delta)** |
|---|---|---|
| How it's joined | One end of each element goes to a common point, the **neutral** $n$ | The elements form a ring, end to end |
| Phase voltage | $V_{an}$: from a line to the neutral | $V_{ab}$: across one element, between two lines |
| Line voltage | $V_{ab} = V_{an} - V_{bn}$: between two lines | the same as the phase voltage |
| Line current | the same as the phase current | $I_a = I_{AB} - I_{CA}$: two phase currents meet at each corner |
| Neutral wire? | possible (4-wire system) | none (3-wire only) |

A **balanced load** has three equal impedances: $Z_Y$ in each arm of a Y, or $Z_\Delta$ in each side of a Δ.

#### Line voltage in a Y: $\sqrt{3}$ bigger, $30^\circ$ ahead

The line voltage is the difference of two phase voltages. For the positive sequence:

$$
V_{ab} = V_{an} - V_{bn} = V_p\angle 0^\circ - V_p\angle -120^\circ = V_p\left(1 + \tfrac{1}{2} + j\tfrac{\sqrt{3}}{2}\right) = \sqrt{3}\,V_p\angle 30^\circ \tag{12.3}
$$

The same happens for $V_{bc}$ and $V_{ca}$, each $120^\circ$ further on. So in a Y:

$$
V_L = \sqrt{3}\,V_p, \qquad \text{line voltage leads its phase voltage by } 30^\circ
$$

That's why a 120 V household phase gives $\sqrt{3} \times 120 = 208$ V between two phases.

#### Line current in a Δ: $\sqrt{3}$ bigger, $30^\circ$ behind

At corner A of a Δ load, the line current splits into the two phase currents. KCL gives

$$
I_a = I_{AB} - I_{CA} = I_{AB}\angle 0^\circ - I_{AB}\angle 120^\circ = I_{AB}\left(\tfrac{3}{2} - j\tfrac{\sqrt{3}}{2}\right) = \sqrt{3}\,I_{AB}\angle -30^\circ \tag{12.4}
$$

It's the mirror image of (12.3). So in a Δ:

$$
I_L = \sqrt{3}\,I_p, \qquad \text{line current lags its phase current by } 30^\circ
$$

> [!important] The two $\sqrt{3}$ rules in one table
> | Connection | Voltage | Current |
> |---|---|---|
> | **Y** | $V_L = \sqrt{3}V_p\angle +30^\circ$ | $I_L = I_p$ |
> | **Δ** | $V_L = V_p$ | $I_L = \sqrt{3}I_p\angle -30^\circ$ |
>
> The angles are for the positive sequence. For the negative sequence, flip the sign of the $30^\circ$.

#### Converting a balanced Δ to a Y

Three equal impedances in a Δ behave, from the outside, exactly like three impedances of a third the size in a Y:

$$
Z_Y = \frac{Z_\Delta}{3} \tag{12.5}
$$

A balanced Δ **source** can also be replaced by a Y source with $V_{an} = \frac{V_{ab}}{\sqrt{3}}\angle -30^\circ$ (undoing (12.3)). Together these let you turn any balanced circuit into Y-Y.

### Balanced Y-Y: The Per-Phase Equivalent

![[ele-302-3ph-yy.svg]]
*Figure 12.2: Balanced Y-Y system with line impedances $Z_\ell$. Each phase sees $Z_Y = Z_\ell + Z_L$ in total (plus any source impedance).*

**Why the neutrals sit at the same voltage.** Leave the neutral wire out and write KCL at the load's neutral $N$, with $n$ as the reference ($V_n = 0$):

$$
\frac{V_{an} - V_N}{Z_Y} + \frac{V_{bn} - V_N}{Z_Y} + \frac{V_{cn} - V_N}{Z_Y} = 0 \ \Rightarrow\ \frac{(V_{an} + V_{bn} + V_{cn}) - 3V_N}{Z_Y} = 0
$$

The three voltages add to zero (12.2), so $V_N = 0$. **The load's neutral is at the same voltage as the source's**, whether or not a wire joins them. So:

- A neutral wire would carry $I_a + I_b + I_c = 0$. It changes nothing, so you can add it or remove it freely.
- With $n$ and $N$ joined, each phase is a separate loop: $V_{an}$ pushing $I_a$ through $Z_Y$.

That gives the **per-phase (single-phase) equivalent**:

![[ele-302-3ph-single-phase.svg]]
*Figure 12.3: Single-phase equivalent of phase a.*

$$
I_a = \frac{V_{an}}{Z_Y}, \qquad I_b = I_a\angle -120^\circ, \qquad I_c = I_a\angle 120^\circ \tag{12.6}
$$

> [!important] The per-phase equivalent only works when the system is **balanced**. If the loads differ, $V_N \ne 0$ and each phase affects the others (see [[#Unbalanced Systems]]).

### Power in a Balanced System

#### Instantaneous power is constant

Take a balanced Y load with $Z_Y = Z\angle\theta$. With rms $V_p$ and $I_p$, the phase voltages and currents are

$$
v_{AN} = \sqrt{2}V_p\cos\omega t, \qquad i_a = \sqrt{2}I_p\cos(\omega t - \theta), \qquad \text{and the same shifted by } \mp 120^\circ \text{ for b and c}
$$

(the $\sqrt{2}$ turns rms into peak). The total instantaneous power is

$$
p = v_{AN}i_a + v_{BN}i_b + v_{CN}i_c
$$

Each product splits with $\cos A\cos B = \frac{1}{2}[\cos(A - B) + \cos(A + B)]$ into a constant part, $V_pI_p\cos\theta$, and a part at twice the frequency. The three double-frequency parts are $\cos(2\omega t - \theta)$, $\cos(2\omega t - \theta - 240^\circ)$ and $\cos(2\omega t - \theta + 240^\circ)$: three equal sinusoids $120^\circ$ apart, which **add to zero** by (12.2). What's left is

$$
p = 3V_pI_p\cos\theta \tag{12.7}
$$

**The total power doesn't change with time**, even though each phase's power pulses. This holds for Y and Δ loads alike, and it's why three-phase motors run smoothly.

#### Per phase and total

Per phase ($V_p$, $I_p$ rms; $\theta$ = angle of the phase impedance, the angle by which $I_p$ lags $V_p$):

$$
P_p = V_pI_p\cos\theta, \qquad Q_p = V_pI_p\sin\theta, \qquad S_p = V_pI_p^* = P_p + jQ_p \tag{12.8}
$$

The total is three times one phase. Written with line quantities, it's the same for Y and Δ, because in both cases $3V_pI_p = \sqrt{3}V_LI_L$:

$$
P = 3V_pI_p\cos\theta = \sqrt{3}V_LI_L\cos\theta, \qquad Q = \sqrt{3}V_LI_L\sin\theta \tag{12.9}
$$

$$
S = 3S_p = 3V_pI_p^* = 3|I_p|^2Z_p = \frac{3|V_p|^2}{Z_p^*} \tag{12.10}
$$

> [!warning] $\theta$ is the angle between a **phase** voltage and its **phase** current (the load impedance angle), even in the $\sqrt{3}V_LI_L$ form. It is **not** the angle between $V_L$ and $I_L$, which are $30^\circ$ further apart.

#### The sign convention in these notes

The notes find two powers for every example:

- **Absorbed by the load**, $S_L = 3|I_p|^2Z_L$. Positive real part: the load uses power.
- **Absorbed by the source**, $S_s = -3V_pI_p^*$. The minus sign is there because the current **leaves** the source's $+$ terminal. The real part comes out negative, meaning the source **delivers** that much.

Conservation of energy then says everything absorbed adds to zero:

$$
S_s + S_{\text{lines}} + S_L = 0 \tag{12.11}
$$

That's the check used in every example below.

#### Example 12.1: Balanced Y-Y with line impedance

In Figure 12.2, $V_{an} = 110\angle 0^\circ$ V rms (positive sequence), each line has $Z_\ell = 5 - j2\ \Omega$, and each load arm is $Z_L = 10 + j8\ \Omega$. Find the line currents, the line voltage, and the complex power absorbed by the source, the lines and the load.

**Total impedance per phase.** $Z_Y = Z_\ell + Z_L = 15 + j6 = 16.16\angle 21.8^\circ\ \Omega$.

**Currents.** From the single-phase equivalent:

$$
I_a = \frac{110\angle 0^\circ}{16.16\angle 21.8^\circ} = 6.81\angle -21.8^\circ\ \text{A}, \quad I_b = 6.81\angle -141.8^\circ\ \text{A}, \quad I_c = 6.81\angle 98.2^\circ\ \text{A}
$$

**Line voltage at the source.** $V_{ab} = \sqrt{3}(110)\angle 30^\circ = 190.5\angle 30^\circ$ V.

**Powers.** $|I_a|^2 = 46.36$.

| Absorbed by | Per phase | Total ($\times 3$) |
|---|---|---|
| Source, $-V_{an}I_a^*$ | $-(695.4 + j278.2)$ | $-2086 - j834.5$ VA |
| Lines, $\lvert I_a\rvert^2Z_\ell$ | $231.8 - j92.7$ | $695.4 - j278.2$ VA |
| Load, $\lvert I_a\rvert^2Z_L$ | $463.6 + j370.9$ | $1391 + j1113$ VA |

**Check (12.11):** $(-2086 + 695 + 1391) + j(-834.5 - 278.2 + 1113) \approx 0$ ✓. The source delivers 2086 W; the lines waste 695 W of it and the load gets 1391 W.

> [!warning] Notes check
> The notes write $S_s = -3(2087 + j834.6)$ and $S_L = 3(1392 + j1113)$ VA. The numbers in the brackets are already the **three-phase totals**, so the extra factor of 3 makes both answers three times too big. Both are off by the same factor, so the power balance can't catch this one. An independent check does: $P = 3|I_a|^2\,\text{Re}(Z_Y) = 3(46.36)(15) = 2086$ W, or $P = \sqrt{3}V_LI_L\cos\theta = \sqrt{3}(190.5)(6.81)\cos 21.8^\circ = 2086$ W, not 6261 W. Per phase, the brackets should be $695.4 + j278.2$ and $463.6 + j370.9$.

### Balanced Y-Δ

![[ele-302-3ph-y-delta.svg]]
*Figure 12.4: Balanced Y source feeding a balanced Δ load.*

The load elements sit **between lines**, so each one gets a line voltage:

$$
V_{AB} = \sqrt{3}V_p\angle 30^\circ, \quad V_{BC} = \sqrt{3}V_p\angle -90^\circ, \quad V_{CA} = \sqrt{3}V_p\angle 150^\circ
$$

**Two ways to solve it:**

1. **Directly.** Phase currents $I_{AB} = \frac{V_{AB}}{Z_\Delta}$ (and so on), then line currents from (12.4): $I_a = \sqrt{3}I_{AB}\angle -30^\circ$.
2. **Convert to Y-Y.** Replace the Δ with $Z_Y = \frac{Z_\Delta}{3}$ and use the single-phase equivalent: $I_a = \frac{V_{an}}{Z_\Delta/3}$. This is the only option when the lines have impedance.

#### Example 12.2: Balanced Y-Δ

In Figure 12.4, $V_{an} = 100\angle 10^\circ$ V rms (positive sequence) and $Z_\Delta = 8 + j4\ \Omega$. Find the line currents, the phase currents in the load, and the complex power absorbed by the source and by the load.

**Line currents** (convert to Y):

$$
I_a = \frac{V_{an}}{Z_\Delta/3} = \frac{100\angle 10^\circ}{2.98\angle 26.57^\circ} = 33.54\angle -16.57^\circ\ \text{A}, \quad I_b = 33.54\angle -136.57^\circ\ \text{A}, \quad I_c = 33.54\angle 103.43^\circ\ \text{A}
$$

**Phase currents** (undo (12.4)):

$$
I_{AB} = \frac{I_a}{\sqrt{3}\angle -30^\circ} = 19.36\angle 13.43^\circ\ \text{A}
$$

Check it directly: $V_{AB} = \sqrt{3}(100)\angle 40^\circ = 173.2\angle 40^\circ$, and $\frac{173.2\angle 40^\circ}{8.94\angle 26.57^\circ} = 19.36\angle 13.43^\circ$ ✓.

**Powers.**

$$
S_s = -3V_{an}I_a^* = -3(100\angle 10^\circ)(33.54\angle 16.57^\circ) = -3(3000 + j1500) = -9000 - j4500\ \text{VA}
$$

$$
S_L = 3|I_{AB}|^2Z_\Delta = 3(19.36)^2(8 + j4) = 9000 + j4500\ \text{VA}
$$

**Check:** no line impedance, so $S_s + S_L = 0$ ✓.

> [!warning] Notes check
> The notes write $S_L = 3|I_p|^2Z_L = 3(33.541)^2(8 + j4) = 3(9000 + j4500)$. That uses the **line** current $33.54$ A with the **Δ** impedance. In a Δ the current through $Z_\Delta$ is the phase current $I_{AB} = 19.36$ A. (Or use the line current with $Z_Y = Z_\Delta/3$.) Either way the total is $9000 + j4500$ VA, a third of the notes' value, and it now balances the source.

### Balanced Δ-Δ

![[ele-302-3ph-delta-delta.svg]]
*Figure 12.5: Balanced Δ source feeding a balanced Δ load.*

Both source and load are rings, so with no line impedance **each load element sits directly across one source**:

$$
V_{AB} = V_{ab}, \qquad I_{AB} = \frac{V_{ab}}{Z_\Delta}, \qquad I_a = \sqrt{3}\,I_{AB}\angle -30^\circ \tag{12.12}
$$

The phase voltages *are* the line voltages, and only the currents need the $\sqrt{3}$.

#### Example 12.3: Balanced Δ-Δ

In Figure 12.5, $V_{ab} = 330\angle 0^\circ$ V rms (positive sequence) and $Z_\Delta = 20 - j15 = 25\angle -36.87^\circ\ \Omega$. Find the phase and line currents and the complex power absorbed by the source and by the load.

**Phase current.**

$$
I_{AB} = \frac{330\angle 0^\circ}{25\angle -36.87^\circ} = 13.2\angle 36.87^\circ\ \text{A}
$$

**Line currents.**

$$
I_a = \sqrt{3}(13.2)\angle(36.87^\circ - 30^\circ) = 22.86\angle 6.87^\circ\ \text{A}, \quad I_b = 22.86\angle -113.13^\circ\ \text{A}, \quad I_c = 22.86\angle 126.87^\circ\ \text{A}
$$

**Powers.** Use phase quantities: each source phase is $V_{ab}$ and carries $I_{AB}$.

$$
S_L = 3|I_{AB}|^2Z_\Delta = 3(174.24)(20 - j15) = 10\,454 - j7841\ \text{VA}
$$

$$
S_s = -3V_{ab}I_{AB}^* = -3(330)(13.2\angle -36.87^\circ) = -10\,454 + j7841\ \text{VA}
$$

**Check:** $S_s + S_L = 0$ ✓. The load is capacitive ($Q < 0$), so it supplies reactive power, and the source absorbs it.

> [!warning] Notes check
> - $S_s$: the notes multiply the **line** voltage $330\angle 0^\circ$ by the **line** current $22.86\angle 6.87^\circ$. In a Δ these don't belong to the same element, and the result, $3(-7491 + j900.9)$, doesn't balance the load. Use the phase pair $V_{ab}$ and $I_{AB}$ (or the Y-equivalent pair $V_{an}$ and $I_a$).
> - $S_L$: the notes' bracket $10\,454.85 - j7841$ is already the total (it's $|I_a|^2Z_\Delta$, and $|I_a|^2 = 3|I_{AB}|^2$), so the extra factor of 3 makes it three times too big.
> - The notes write $I_a = \frac{V_{an}}{Z_\Delta/3}$ as the formula but then (correctly) use $I_{AB} = \frac{V_{ab}}{Z_\Delta}$. There's no $V_{an}$ in a Δ source unless you first convert it to a Y.

### Balanced Δ-Y

![[ele-302-3ph-delta-y.svg]]
*Figure 12.6: Balanced Δ source feeding a balanced Y load.*

Convert the source to Y: $V_{an} = \frac{V_{ab}}{\sqrt{3}}\angle -30^\circ$. Then the single-phase equivalent gives

$$
I_a = \frac{V_{an}}{Z_Y} = \frac{V_{ab}\angle -30^\circ}{\sqrt{3}\,Z_Y} \tag{12.13}
$$

The notes reach the same result with KVL around the loop through two load arms: $Z_Y(I_a - I_b) = V_{ab}$, and $I_a - I_b = I_a(1 - 1\angle -120^\circ) = \sqrt{3}I_a\angle 30^\circ$.

#### Example 12.4: Balanced Δ-Y

In Figure 12.6, $V_{ab} = 210\angle 0^\circ$ V rms (positive sequence) and $Z_Y = 40 + j25 = 47.17\angle 32.01^\circ\ \Omega$. Find the line currents and the complex power absorbed by the source and by the load.

**Line currents.**

$$
I_a = \frac{210\angle -30^\circ}{\sqrt{3}(47.17\angle 32.01^\circ)} = 2.57\angle -62.01^\circ\ \text{A}, \quad I_b = 2.57\angle 177.99^\circ\ \text{A}, \quad I_c = 2.57\angle 57.99^\circ\ \text{A}
$$

**Powers.** The Y-equivalent source phase is $V_{an} = \frac{210}{\sqrt{3}}\angle -30^\circ = 121.2\angle -30^\circ$ V.

$$
S_L = 3|I_a|^2Z_Y = 3(6.606)(40 + j25) = 3(264.2 + j165.2) = 792.8 + j495.5\ \text{VA}
$$

$$
S_s = -3V_{an}I_a^* = -3(121.2\angle -30^\circ)(2.57\angle 62.01^\circ) = -792.8 - j495.5\ \text{VA}
$$

**Check:** $S_s + S_L = 0$ ✓.

> [!warning] Notes check
> - The notes' formula reads $I_a = \frac{V_{ab}}{Z_Y/\sqrt{3}}\angle -30^\circ$, but their number, $2.57$ A, comes from $\frac{V_{ab}}{\sqrt{3}Z_Y}$. Dividing by $Z_Y/\sqrt{3}$ would give 7.71 A.
> - $I_b = I_a\angle -120^\circ$ is at $-182^\circ$, which is $+178^\circ$, not $-178^\circ$.
> - The notes' $S_s = 3(-254.1 - j476.7)$ doesn't balance the load. With the Y-equivalent phase voltage it's $-3(264.2 + j165.2)$. The load power, $3(264.68 + j165.42)$, is right.

### Unbalanced Systems

A system is **unbalanced** when the source voltages differ, or (more often) when the three load impedances aren't equal. Then the sum in the neutral KCL no longer cancels:

$$
\frac{V_{an} - V_N}{Z_A} + \frac{V_{bn} - V_N}{Z_B} + \frac{V_{cn} - V_N}{Z_C} = 0 \tag{12.14}
$$

and $V_N \ne 0$. The load's neutral **floats** away from the source's, the phases interact, and the per-phase shortcut is gone. Solve (12.14) for $V_N$ (it's one nodal equation), then each line current is $I_a = \frac{V_{an} - V_N}{Z_A}$, and so on.

![[ele-302-3ph-unbalanced.svg]]
*Figure 12.7: Unbalanced Y load with no neutral wire. Without a wire to pin it, $V_N$ settles wherever KCL puts it.*

> [!note] With a neutral wire (and no impedance in it), $V_N = 0$ is forced, each phase is its own loop again ($I_a = V_{an}/Z_A$), and the neutral carries $I_a + I_b + I_c \ne 0$. The examples below have no neutral wire, which is the harder case.

#### Example 12.5: Unbalanced load, three wires

In Figure 12.7, $V_{an} = 100\angle 0^\circ$, $V_{bn} = 100\angle -120^\circ$, $V_{cn} = 100\angle 120^\circ$ V rms, and the load is $Z_A = 8\ \Omega$, $Z_B = j6\ \Omega$, $Z_C = -j6\ \Omega$. Find $V_N$, the line currents, and the power absorbed by the load.

**Neutral voltage.** Solve (12.14):

$$
\frac{100 - V_N}{8} + \frac{100\angle -120^\circ - V_N}{j6} + \frac{100\angle 120^\circ - V_N}{-j6} = 0 \ \Rightarrow\ V_N = -130.9\ \text{V}
$$

(The $\frac{V_N}{j6}$ and $\frac{V_N}{-j6}$ terms cancel, so $V_N$ is real here.)

**Line currents.**

$$
I_a = \frac{100 + 130.9}{8} = 28.87\angle 0^\circ\ \text{A}, \quad I_b = \frac{100\angle -120^\circ + 130.9}{j6} = 19.76\angle -136.9^\circ\ \text{A}, \quad I_c = 19.76\angle 136.9^\circ\ \text{A}
$$

Check KCL: $28.87 + 2(19.76\cos 136.9^\circ) = 28.87 - 28.87 = 0$ ✓.

**Load power.** Only $Z_A$ absorbs real power: $P = 28.87^2 \times 8 = 6667$ W. The inductor and capacitor carry equal currents, so their reactive powers ($+j2343$ and $-j2343$) cancel: $S_L = 6667$ VA.

> [!note] The notes stop at $V_N = -130.94$ V. The currents and power above finish the problem.

#### Example 12.6: Unbalanced load with source and load power

Same circuit, now with $V_{an} = 120\angle 0^\circ$, $V_{bn} = 120\angle -120^\circ$, $V_{cn} = 120\angle 120^\circ$ V rms, and $Z_A = j5\ \Omega$, $Z_B = 10\ \Omega$, $Z_C = -j10\ \Omega$. Find $V_N$, the line currents, and the complex power absorbed by each source phase and each load arm.

**Neutral voltage** from (12.14): $V_N = 120 - j283.9 = 308.2\angle -67.1^\circ$ V.

**Line currents.**

$$
I_a = \frac{V_{an} - V_N}{j5} = 56.78\ \text{A}, \quad I_b = \frac{V_{bn} - V_N}{10} = -18 + j18\ \text{A}, \quad I_c = \frac{V_{cn} - V_N}{-j10} = -38.78 - j18\ \text{A}
$$

**Powers.**

| Phase | Absorbed by the source, $-V_{xn}I_x^*$ | Absorbed by the load, $\lvert I_x\rvert^2Z_x$ |
|---|---|---|
| a | $-6814$ VA | $j16\,122$ VA |
| b | $791 - j2951$ VA | $6480$ VA |
| c | $-456 + j5111$ VA | $-j18\,282$ VA |
| **Total** | $-6480 + j2160$ VA | $6480 - j2160$ VA |

**Check:** the two totals add to zero ✓. Notice phase b's source absorbs real power (+791 W) while phases a and c deliver. In an unbalanced system the individual phases can do very different things.

> [!note] The notes' $-j18\,276$ and $\pm j2156$ differ from these in the last digits because of rounding. Their last line says "absorbed by the three-phase source" above the **load** total.

## Key formulas

**Balanced voltages (positive sequence, rms)**

$$
V_{an} = V_p\angle 0^\circ, \quad V_{bn} = V_p\angle -120^\circ, \quad V_{cn} = V_p\angle 120^\circ, \qquad V_{an} + V_{bn} + V_{cn} = 0 \tag{12.1–12.2}
$$

**Line vs phase**

| | Voltage | Current |
|---|---|---|
| Y | $V_L = \sqrt{3}V_p\angle +30^\circ$ | $I_L = I_p$ |
| Δ | $V_L = V_p$ | $I_L = \sqrt{3}I_p\angle -30^\circ$ |

**Conversions**

$$
Z_Y = \frac{Z_\Delta}{3}, \qquad V_{an} = \frac{V_{ab}}{\sqrt{3}}\angle -30^\circ \tag{12.5}
$$

**Per-phase equivalent (balanced only)**

$$
I_a = \frac{V_{an}}{Z_Y}, \qquad I_b = I_a\angle -120^\circ, \qquad I_c = I_a\angle 120^\circ \tag{12.6}
$$

**Power (balanced)**

$$
P = 3V_pI_p\cos\theta = \sqrt{3}V_LI_L\cos\theta, \qquad Q = \sqrt{3}V_LI_L\sin\theta, \qquad S = 3V_pI_p^* = 3|I_p|^2Z_p \tag{12.9–12.10}
$$

- $\theta$ = load impedance angle (phase voltage to phase current)
- All values rms

**Power check**

$$
S_{\text{source}} + S_{\text{lines}} + S_{\text{load}} = 0, \qquad S_{\text{source}} = -3V_pI_p^* \tag{12.11}
$$

**Unbalanced Y load, no neutral wire**

$$
\frac{V_{an} - V_N}{Z_A} + \frac{V_{bn} - V_N}{Z_B} + \frac{V_{cn} - V_N}{Z_C} = 0, \qquad I_a = \frac{V_{an} - V_N}{Z_A} \tag{12.14}
$$

## Solving the problems

| The question asks you to… | Type | Worked in |
|---|---|---|
| find line or phase currents in a balanced system | Balanced system | Examples 12.1–12.4 |
| find total, per-phase or line power | Balanced power | Examples 12.1–12.4 |
| solve a system with unequal loads | Unbalanced | Examples 12.5, 12.6 |

### Balanced system

1. **Identify the connections**: Y or Δ source, Y or Δ load. Note whether you're given phase or line voltages.
2. **Convert to Y-Y.** Δ load: $Z_Y = Z_\Delta/3$. Δ source: $V_{an} = \frac{V_{ab}}{\sqrt{3}}\angle -30^\circ$.
3. **Single-phase equivalent:** $I_a = \frac{V_{an}}{Z_Y + Z_\ell}$.
4. **Shift** for b and c: $-120^\circ$ and $+120^\circ$ (positive sequence).
5. **Go back to the real load** if it's a Δ: $I_{AB} = \frac{I_a}{\sqrt{3}}\angle 30^\circ$, and $V_{AB} = \sqrt{3}V_{AN}\angle 30^\circ$.
6. If there's no line impedance and the load is a Δ, you can skip the conversion: $I_{AB} = V_{AB}/Z_\Delta$ directly.

### Balanced power

1. Pick **one element** and use its own voltage and current: $S_p = V_pI_p^* = |I_p|^2Z_p$.
2. Multiply by 3 **once**. If a number is already a total, don't multiply it again.
3. Or use $P = \sqrt{3}V_LI_L\cos\theta$, with $\theta$ the load impedance angle.
4. **Balance check:** source $+$ lines $+$ load $= 0$.

### Unbalanced

1. Write (12.14), the one nodal equation at the load neutral (with a neutral wire, $V_N = 0$ and you can skip this step).
2. Solve for $V_N$. A calculator with complex mode saves a lot of time.
3. $I_x = \frac{V_{xn} - V_N}{Z_x}$ for each phase. Check that they add to zero.
4. Power per arm: $|I_x|^2Z_x$. Add the three; there's no $\times 3$ shortcut.

## Common mistakes

- Multiplying by 3 a number that's already a three-phase total
- Using the **line** current through a **Δ** impedance. Inside a Δ the current is $I_p = I_L/\sqrt{3}$
- Multiplying a line voltage by a line current in $S = VI^*$. Each product needs one element's own voltage and current
- Mixing up which connection gets the $\sqrt{3}$ on voltage (Y) and which on current (Δ)
- Getting the $30^\circ$ backwards: Y line voltage **leads**, Δ line current **lags** (positive sequence)
- Using $Z_\Delta$ instead of $Z_\Delta/3$ in the per-phase equivalent
- Taking $\theta$ in $\sqrt{3}V_LI_L\cos\theta$ as the angle between line voltage and line current
- Using the per-phase shortcut on an **unbalanced** load. Solve for $V_N$ first
- Mixing rms and peak. Everything in this chapter is rms unless it's written as $\sqrt{2}V_p\cos\omega t$
- Rounding an angle like $-182^\circ$ to $-178^\circ$. Add or subtract $360^\circ$ to tidy an angle ($-182^\circ = 178^\circ$)
