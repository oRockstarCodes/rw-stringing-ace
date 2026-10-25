---
title: "Ch 14: Frequency Response"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 14** (§14.1–14.7)

Feed a sine wave into a circuit made of R, L and C, and what comes out is **another sine wave at the same frequency**. The only things the circuit can change are how big it is and how far it's shifted in time. That's not obvious, and it's the foundation of this whole chapter (the first section below explains why it's true).

So for each frequency $\omega$, a circuit is described by just two numbers: a **gain** (how much it scales the sine) and a **phase shift** (how much it delays it). The **frequency response** is those two numbers as functions of $\omega$. It's the circuit's complete "personality". Once you know it, you know what the circuit does to any signal, because any signal can be built out of sines (that's Fourier series, Ch 17).

The reason the gain changes with frequency at all is that inductors and capacitors resist current differently at different frequencies. An inductor fights fast changes and a capacitor blocks slow ones. Put them together with resistors and you can build circuits that pass bass but block treble, or pick one radio station out of thousands. Everything in this chapter is a way of predicting, describing or designing that behaviour:

1. **The transfer function** $H(s)$: a formula for the gain and phase at every frequency.
2. **Bode plots**: a way to sketch that formula quickly by adding up straight lines.
3. **Resonance**: the special frequency where L and C cancel each other out.
4. **Filters**: circuits designed to pass some frequencies and block others.

> [!tip] Background pages
> - [[capacitors-and-inductors#Impedance: how they behave at different frequencies|Capacitors and Inductors: impedance]]: why $Z_L$ grows with frequency and $Z_C$ shrinks
> - [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]: $\omega_0 = 1/\sqrt{LC}$ and $\alpha = R/2L$ come back here, along with the idea of damping
> - [[lc-oscillation|LC Oscillation]]: the energy swap between L and C that makes resonance happen
> - [[damping-series-vs-parallel|Damping in Series and Parallel RLC]]: why series and parallel circuits have flipped formulas
> - [[ch05-operational-amplifiers|Ch 5: Operational Amplifiers]]: for the op-amp example

## Notes

### Sine In, Sine Out

Why can't an RLC circuit turn a sine into some other shape? Look at what the elements do to a sine:

- A resistor multiplies it by a constant: $v = Ri$.
- An inductor takes its derivative: $v = L\frac{di}{dt}$. The derivative of a sine is a cosine, which is the same wave shifted by a quarter cycle.
- A capacitor integrates it, and the integral of a sine is also a shifted sine.

KVL and KCL then only add these together, and adding sines of the same frequency always gives another sine of that frequency (with some new amplitude and phase). So every voltage and current in the circuit ends up being a sine at the source's frequency. **Linear circuits can't create new frequencies.** They can only scale and shift the ones they're given.

That's why one complex number per frequency is enough to describe a circuit. If the input is $\cos\omega t$ and the output is $M\cos(\omega t + \phi)$, the circuit at that frequency is completely described by $M$ and $\phi$. Packed into one complex number $H = M\angle\phi$:

- $|H|$ is the **gain**: how much the amplitude is multiplied by.
- $\angle H$ is the **phase shift**: how far the output leads ($+$) or lags ($-$) the input.

The rest of the chapter is about how $H$ changes as you sweep $\omega$.

### Complex Frequency

Sines aren't the only signals with this "shape doesn't change" property. Ch 8's natural responses were all $e^{st}$, and they have it too. Write $s$ as a real part and an imaginary part:

$$
s = \alpha + j\omega \tag{14.1}
$$

The real part of $e^{st}$ is a cosine inside an exponential envelope:

$$
x(t) = A\,e^{\alpha t}\cos(\omega t + \theta) \tag{14.2}
$$

- $\alpha$ (the **real part**, in Np/s) sets the envelope. $\alpha < 0$ decays, $\alpha > 0$ grows, and $\alpha = 0$ stays the same size.
- $\omega$ (the **imaginary part**, in rad/s) sets the oscillation. $\omega = 0$ means it doesn't oscillate at all.

![[ele-302-freq-s-plane.svg]]
*Figure 14.1: The complex plane. Each point is one value of $s$; the little graph beside it is the signal $e^{\alpha t}\cos\omega t$ that point stands for.*

Why bother with this more general $s$? Because **$e^{st}$ is the one function whose derivative is just itself times a number**: $\frac{d}{dt}e^{st} = s\,e^{st}$. Differentiating or integrating it never changes its shape, only its size and phase. So a single symbol covers DC ($s = 0$), exponential decay ($\omega = 0$), ringing (Ch 8's underdamped case) and steady AC, and they're all handled by the same algebra.

**Steady-state AC is the case on the imaginary axis, $s = j\omega$.** Everything you work out with $s$ becomes a frequency response when you substitute $s = j\omega$.

> [!note] Watch the two $\alpha$'s. Here $\alpha$ is the real part of $s$, so it's negative when something decays. In Ch 8, $\alpha = R/2L$ was a positive decay rate inside $e^{-\alpha t}$. They describe the same thing with opposite signs. From the resonance section on, $\alpha$ means $R/2L$ again. (The textbook avoids the clash by calling the real part $\sigma$.)

### Impedance in the s-Domain

Because $\frac{d}{dt}e^{st} = s\,e^{st}$, **differentiating turns into multiplying by $s$**, and integrating turns into dividing by $s$. Apply that to the element laws:

- **Inductor:** $v = L\frac{di}{dt}$ becomes $V = sL \cdot I$
- **Capacitor:** $i = C\frac{dv}{dt}$ becomes $I = sC \cdot V$, so $V = \frac{1}{sC}\,I$

Each element now acts like Ohm's law with a frequency-dependent "resistance", the **impedance**:

$$
Z_R = R, \qquad Z_L = sL, \qquad Z_C = \frac{1}{sC} \tag{14.3}
$$

For sinusoids, $s = j\omega$ gives the phasor impedances $j\omega L$ and $\frac{1}{j\omega C}$.

That's the big payoff: **calculus becomes algebra**. Voltage dividers, series and parallel combinations, KVL, KCL and nodal analysis all work exactly as they did with resistors. You just use $sL$ and $\frac{1}{sC}$ in place of resistances.

**Why the sizes depend on frequency.** An inductor's voltage depends on how fast its current changes. At a higher frequency the current changes faster, so the inductor pushes back harder: $|Z_L| = \omega L$ grows with $\omega$. A capacitor's current depends on how fast its voltage changes, so at higher frequency it passes more current for the same voltage: $|Z_C| = \frac{1}{\omega C}$ shrinks. The two extremes are worth memorizing, because they predict how any circuit behaves at the ends of the frequency range:

|Element|$\omega \to 0$ (DC)|$\omega \to \infty$|
|---|---|---|
|Inductor, $Z_L = j\omega L$|$0$, a **short**|$\infty$, an **open**|
|Capacitor, $Z_C = \frac{1}{j\omega C}$|$\infty$, an **open**|$0$, a **short**|

> [!tip] This table is the fastest sanity check in the chapter. Before trusting any $H(s)$, redraw the circuit with the shorts and opens for $\omega \to 0$ and $\omega \to \infty$, find the output by inspection, and make sure your formula agrees.

### Transfer Function

The **transfer function** is the output divided by the input, with every element written as an impedance:

$$
H(s) = \frac{Y(s)}{X(s)} = \frac{\text{output}}{\text{input}} \tag{14.4}
$$

It's usually a voltage gain $V_o/V_i$, but it can be any ratio of output to input (a current gain, or a transfer impedance $V_o/I_i$, for example). Setting $s = j\omega$ gives the complex number $H$ from the first section, for every frequency at once.

**To find $H(s)$:** redraw the circuit with $R$, $sL$ and $\frac{1}{sC}$, solve for the output in terms of the input (often it's just a voltage divider), divide, and clear the fractions-inside-fractions so you end up with one polynomial over another.

The roots of those polynomials have physical meanings:

- **Zeros** (roots of the numerator) are frequencies the circuit **completely blocks**: $H = 0$. Usually it's because some element becomes a perfect short or open there. In a band-stop filter, for example, a series L–C pair has zero impedance at one frequency and shorts the output.
- **Poles** (roots of the denominator) are where $H \to \infty$: a finite input would give an infinite output. Turn that around and it means **the circuit can produce an output with no input at all**. That's a natural response, so the poles are exactly the natural frequencies $s_1, s_2$ from Ch 8. The denominator of $H(s)$ *is* the characteristic equation.

That last point ties the two chapters together. The same numbers that decide how a circuit rings after a switch flips (Ch 8) also decide how it responds to sines at different frequencies (this chapter). A circuit that rings at some frequency will also respond strongly when you drive it near that frequency.

### Decibels

Gains in real circuits range from millions down to millionths, so they're measured on a log scale. The **decibel** comes from power ratios: $G_{\text{dB}} = 10\log_{10}\frac{P_2}{P_1}$. Power goes with voltage squared ($P = V^2/R$), and the square comes out of the log as a factor of 2. That's why voltage and current gain use **20**:

$$
H_{\text{dB}} = 20\log_{10}|H| \tag{14.5}
$$

|$\lvert H\rvert$|$H_{\text{dB}}$|
|---|---|
|100|40 dB|
|10|20 dB|
|2|6 dB|
|$\sqrt{2}$|3 dB|
|1|0 dB|
|$1/\sqrt{2} = 0.707$|−3 dB|
|0.1|−20 dB|
|0.01|−40 dB|

The log scale earns its place for one reason: **it turns multiplication into addition**. $20\log|H_1H_2| = 20\log|H_1| + 20\log|H_2|$. Transfer functions are products of simple factors, so on a dB scale they become sums of simple shapes, and sums are easy to sketch by hand.

> [!tip] A gain of $1/\sqrt{2}$ means the output power is cut in half, since power goes with $|H|^2$ and $(1/\sqrt{2})^2 = \frac{1}{2}$. So "−3 dB", "half power" and "0.707" all mean the same thing. That's the standard place to say a signal is "getting through" or "being blocked", and it defines every bandwidth and cutoff in this chapter.

### Bode Plots

A **Bode plot** is two graphs with a log-scale frequency axis: **magnitude** ($H_{\text{dB}}$ against $\log\omega$) and **phase** ($\phi$ in degrees against $\log\omega$).

**Why put frequency on a log scale?** Two reasons. Frequencies of interest span many powers of ten (bass at 50 Hz, treble at 10 kHz). And on log–log axes, anything that goes like $\omega^n$ becomes a **straight line** with slope $20n$ dB per decade (a **decade** is a factor of 10 in frequency). Since every factor in a transfer function acts like a power of $\omega$ at low and high frequency, every factor becomes a pair of straight lines.

#### Why every factor is two straight lines

Take a simple pole, $\frac{1}{1 + j\omega/p}$. The bottom is the sum of two terms, $1$ and $j\omega/p$, and at any frequency one of them is much bigger than the other:

- **Low frequency** ($\omega \ll p$): the $1$ wins, so the factor is about $1$. That's **0 dB** and **0°**, and the factor does nothing.
- **High frequency** ($\omega \gg p$): the $j\omega/p$ wins, so the factor is about $\frac{p}{j\omega}$. Multiply $\omega$ by 10 and it drops by 10: that's **−20 dB/decade**, at an angle of **−90°**.

The **corner frequency** $\omega = p$ is where the two terms are the same size. The two straight lines meet there, and the real curve rounds off the corner. At $\omega = p$ the factor is exactly $\frac{1}{1 + j}$, which has magnitude $\frac{1}{\sqrt{2}}$ (−3 dB) and angle $-45^\circ$, halfway between the low and high behaviours.

![[ele-302-freq-bode-simple-pole.svg]]
*Figure 14.2: A simple pole $1/(1 + j\omega/p)$. Gold is the exact curve and dashed grey is the straight-line approximation. The worst error is 3 dB at the corner, where the phase is exactly $-45^\circ$. A simple zero is the same picture flipped upside down.*

**Why the phase change is spread out.** The angle is $-\tan^{-1}(\omega/p)$. Arctan changes slowly: it's about $-6^\circ$ a decade below the corner and $-84^\circ$ a decade above. So the phase straight-line rule is "start bending at $p/10$, reach the final angle at $10p$", a ramp of $45^\circ$ per decade across two decades. The magnitude turns at one point; the phase turns over a range.

#### Standard form

The two-lines trick only works if every factor **equals 1 at low frequency**, so that it contributes 0 dB until its corner. That's why you rewrite each factor before plotting: $(s + z) = z\left(1 + \frac{s}{z}\right)$. Pull every constant out like this, collect them into a single gain $K$, and set $s = j\omega$:

$$
H(j\omega) = \frac{K\,(j\omega)^{\pm N}\left(1 + \frac{j\omega}{z_1}\right)\cdots}{\left(1 + \frac{j\omega}{p_1}\right)\cdots\left[1 + j2\zeta\frac{\omega}{\omega_n} + \left(\frac{j\omega}{\omega_n}\right)^2\right]\cdots} \tag{14.6}
$$

Now logs turn the product into a sum. Factors on top add, factors on the bottom subtract:

$$
H_{\text{dB}} = 20\log_{10}|K| \pm 20N\log_{10}\omega + 20\log_{10}\left|1 + \tfrac{j\omega}{z_1}\right| - 20\log_{10}\left|1 + \tfrac{j\omega}{p_1}\right| - \cdots \tag{14.7}
$$

Angles of multiplied complex numbers add too, so the phase is a sum as well:

$$
\phi = \angle K \pm N\cdot 90^\circ + \tan^{-1}\frac{\omega}{z_1} - \tan^{-1}\frac{\omega}{p_1} - \tan^{-1}\frac{2\zeta\omega/\omega_n}{1 - \omega^2/\omega_n^2} - \cdots \tag{14.8}
$$

> [!warning] Skipping the $(s + z) \to z(1 + s/z)$ step is the classic mistake. If you plot $(s + 2)$ as though it were $(1 + s/2)$, the whole magnitude plot is off by $20\log 2 = 6$ dB, because that 2 belongs in $K$.

#### The factors

Every factor follows the same low/high reasoning. Here are the straight-line rules:

|Factor|Magnitude|Phase|
|---|---|---|
|Constant $K$|Flat at $20\log_{10}\lvert K\rvert$|$0^\circ$ if $K > 0$, $\pm 180^\circ$ if $K < 0$|
|Zero at the origin, $(j\omega)^N$|$+20N$ dB/decade at all frequencies, through 0 dB at $\omega = 1$|$+90N^\circ$|
|Pole at the origin, $(j\omega)^{-N}$|$-20N$ dB/decade at all frequencies, through 0 dB at $\omega = 1$|$-90N^\circ$|
|Simple zero, $\left(1 + \frac{j\omega}{z}\right)$|0 dB, then $+20$ dB/decade after $z$|$0^\circ \to +90^\circ$ between $z/10$ and $10z$|
|Simple pole, $\left(1 + \frac{j\omega}{p}\right)^{-1}$|0 dB, then $-20$ dB/decade after $p$|$0^\circ \to -90^\circ$ between $p/10$ and $10p$|
|Quadratic zero|0 dB, then $+40$ dB/decade after $\omega_n$|$0^\circ \to +180^\circ$ between $\omega_n/10$ and $10\omega_n$|
|Quadratic pole|0 dB, then $-40$ dB/decade after $\omega_n$|$0^\circ \to -180^\circ$ between $\omega_n/10$ and $10\omega_n$|

Some reasons behind the table:

- **A factor at the origin has no corner.** $j\omega$ is never "about 1" over any range, so it's a single straight line everywhere, and it's 0 dB at $\omega = 1$ because $|j1| = 1$.
- **A negative $K$ is a $180^\circ$ shift.** Multiplying a sine by $-1$ flips it upside down, which is the same as shifting it half a cycle. That's why every inverting amplifier adds $180^\circ$.
- **Powers multiply everything.** A factor squared has double the slope and double the phase. A double pole falls at $-40$ dB/decade and its phase goes to $-180^\circ$.
- **A quadratic is "two poles at once".** At high frequency the $(j\omega/\omega_n)^2$ term wins, so it's $\omega^2$: $-40$ dB/decade and $-180^\circ$.

**What $\zeta$ does to a quadratic.** The **damping ratio** $\zeta$ is the same idea as in Ch 8 ($\zeta = \alpha/\omega_0$, and $\zeta < 1$ means underdamped). A lightly damped circuit *wants* to ring at $\omega_n$, so when you drive it at $\omega_n$ it responds much more strongly than either asymptote predicts. The plot gets a **resonant peak** about $-20\log_{10}(2\zeta)$ dB tall. At $\zeta = 0.05$ that's 20 dB, ten times the gain the straight lines suggest (Figure 14.3). Less damping also makes the phase flip from $0^\circ$ to $-180^\circ$ more abruptly.

![[ele-302-freq-bode-quadratic-pole.svg]]
*Figure 14.3: A quadratic pole for four damping ratios. They share the same asymptotes, but the lightly damped ones peak near $\omega_n$, where the circuit resonates.*

> [!note] If $\zeta \geq 1$, the quadratic has real roots, the same test as overdamped vs. underdamped in Ch 8. Then it's really two simple poles in disguise, so factor it and use the simple-pole rules (Examples 1 and 11). Only a genuinely underdamped quadratic needs the peak treatment.

#### Procedure

1. **Find $H(s)$** and factor the top and bottom.
2. **Rewrite in standard form** (Eq. 14.6) so every factor starts at 1, collect the constants in $K$, and set $s = j\omega$.
3. **Write $H_{\text{dB}}$ and $\phi$ as sums** (Eqs. 14.7 and 14.8).
4. **Mark the corners** on a log axis. Start at the far left with the slope from $K$ and any factors at the origin, then move right. At each corner the slope changes by that factor's amount.
5. **Round the corners** using the exact values (3 dB at each simple corner), and check one or two points by plugging in a number.

> [!tip] Two checks that catch most mistakes:
> - **Low-frequency slope** $= 20 \times$ (zeros at the origin $-$ poles at the origin) dB/decade.
> - **High-frequency slope** $= 20 \times$ (total zeros $-$ total poles) dB/decade, with a quadratic counting as two.
>
> These come straight from which terms win at each end. They should agree with the short/open picture of the circuit at $\omega \to 0$ and $\omega \to \infty$.

### Resonance

#### Why it happens

An inductor and a capacitor both store energy, but at **opposite times** in each cycle. The capacitor's energy peaks when the voltage peaks; the inductor's peaks when the current peaks, a quarter cycle later. Connected together, they hand energy back and forth, the [[lc-oscillation|LC oscillation]] from Ch 8, at their own natural rate $\omega_0 = \frac{1}{\sqrt{LC}}$.

Drive the circuit at exactly that frequency and the L and C supply each other's energy needs perfectly. The source doesn't have to help with that swap at all; it only replaces what the resistor burns as heat. From the source's point of view, the L and C have vanished and only R is left. That's **resonance**. It's like pushing a swing in time with its natural rhythm: small pushes at the right frequency build a big motion, and the only limit is friction (R).

In impedance terms, $Z_L = j\omega L$ and $Z_C = \frac{-j}{\omega C}$ point in opposite directions, so they cancel when they're the same size.

#### Series resonance

![[ele-302-rlc-series.svg]]
*Figure 14.4: A series RLC circuit. At resonance the L and C voltages cancel, so all of $V_s$ appears across $R$.*

$$
Z(j\omega) = R + j\left(\omega L - \frac{1}{\omega C}\right) \tag{14.9}
$$

The reactances cancel when $\omega L = \frac{1}{\omega C}$:

$$
\omega_0 = \frac{1}{\sqrt{LC}}\ \text{rad/s}, \qquad f_0 = \frac{1}{2\pi\sqrt{LC}}\ \text{Hz} \tag{14.10}
$$

Below $\omega_0$ the capacitor's reactance is bigger and the circuit acts capacitive (current leads). Above $\omega_0$ the inductor's wins and it acts inductive (current lags). At $\omega_0$ it's purely resistive. So at resonance:

- $|Z| = R$, its **smallest** value, so the current is **largest**, $I = V_m/R$, and in phase with the source.
- $\mathbf{V}_L$ and $\mathbf{V}_C$ are equal and opposite. They cancel each other in KVL, so the whole source voltage lands on R.
- But each one on its own can be **much bigger than the source**: $|V_L| = |V_C| = Q\,V_m$. The energy sloshing between L and C builds up large voltages that cancel out in the loop. Example 5 gets 500 V across the inductor from a 20 V source.

#### Bandwidth: how wide the peak is

Away from $\omega_0$ the reactances stop cancelling, $|Z|$ grows and the current falls (Figure 14.5). To measure how quickly, use the half-power points from the decibel section: the frequencies $\omega_1$ and $\omega_2$ where the power has dropped to half. Power goes with $|I|^2$, so that's where the current is $I_{\max}/\sqrt{2}$, which means $|Z| = \sqrt{2}R$. That happens when the leftover reactance is exactly as big as R:

$$
\omega L - \frac{1}{\omega C} = \pm R \quad\Rightarrow\quad LC\,\omega^2 \mp RC\,\omega - 1 = 0
$$

Solving each quadratic and keeping the positive root:

$$
\omega_{1,2} = \mp\frac{R}{2L} + \sqrt{\left(\frac{R}{2L}\right)^2 + \frac{1}{LC}} \tag{14.11}
$$

![[ele-302-freq-resonance-curve.svg]]
*Figure 14.5: Current amplitude against frequency for a series RLC. The bandwidth $B$ is the width of the peak at 0.707 of its height. More resistance means a lower $Q$ and a wider, flatter peak.*

The **bandwidth** is the gap between them. Subtracting the two halves of Eq. (14.11), the square roots cancel:

$$
B = \omega_2 - \omega_1 = \frac{R}{L} \tag{14.12}
$$

This makes sense: R is the only thing that limits the peak, so more R means a wider, lower peak, and with no R at all the peak would be an infinitely tall spike.

#### Quality factor: how sharp the peak is

A 100 rad/s wide peak is very sharp at $\omega_0 = 10^6$ rad/s but very broad at $\omega_0 = 200$. The **quality factor** measures sharpness relative to where the peak is:

$$
Q = \frac{\omega_0}{B} = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 C R} \tag{14.13}
$$

What $Q$ really measures is energy: $Q = 2\pi \times \frac{\text{energy stored}}{\text{energy lost per cycle}}$. A high-$Q$ circuit stores a lot of energy and loses very little each cycle. That gives it two linked properties:

- **In time** (Ch 8): it rings for many cycles before dying out.
- **In frequency** (this chapter): it responds strongly only very close to $\omega_0$, so it's **selective**.

These are the same fact seen two ways. In Ch 8 terms, $Q = \frac{\omega_0}{2\alpha} = \frac{1}{2\zeta}$: high $Q$ means lightly damped. A radio tuner needs high $Q$ to pick out one station from its neighbours.

#### Where the peak sits

$$
\omega_0 = \sqrt{\omega_1\omega_2}, \qquad \omega_{1,2} \approx \omega_0 \mp \frac{B}{2} \quad (\text{when } Q \geq 10) \tag{14.14}
$$

$\omega_0$ is the **geometric** mean of the half-power frequencies, not the average. That's because the curve is symmetric on a **log** axis, not a linear one (the same ratio above and below). When $Q$ is high, the peak is so narrow that log and linear look the same, and $\omega_0 \mp \frac{B}{2}$ is a good shortcut. When $Q$ is low, it isn't (Example 8).

> [!tip] $\frac{R}{2L}$ in Eq. (14.11) is Ch 8's series $\alpha$. So $\omega_{1,2} = \mp\alpha + \sqrt{\alpha^2 + \omega_0^2}$ and $B = 2\alpha$. The damping that made Ch 8's response decay is the same thing that sets the bandwidth here.

#### Parallel resonance

![[ele-302-rlc-parallel.svg]]
*Figure 14.6: A parallel RLC circuit. At resonance the L and C currents cancel, so all of $I_s$ flows through $R$.*

A parallel RLC driven by a current source is the **mirror image** (the dual) of the series one. Elements in parallel share a voltage and add currents, so it's natural to add **admittances**, $Y = 1/Z$:

$$
Y(j\omega) = \frac{1}{R} + j\left(\omega C - \frac{1}{\omega L}\right) \tag{14.15}
$$

The imaginary parts cancel at the same $\omega_0 = 1/\sqrt{LC}$, but everything else flips:

- At resonance the L and C branches carry equal and opposite currents. They form a loop of circulating current that the source never has to supply. From outside, the L–C pair looks like an **open circuit**.
- So $|Z|$ is at its **maximum** ($Z = R$), and with a current source driving it, the **voltage** peaks at $V = I_m R$.
- Each branch current is $Q$ times the source current (Example 7 gets 2 A circulating from a 1.25 mA source).

Running the half-power argument with admittances, $\frac{1}{RC}$ takes the place of $\frac{R}{L}$:

$$
\omega_{1,2} = \mp\frac{1}{2RC} + \sqrt{\left(\frac{1}{2RC}\right)^2 + \frac{1}{LC}} \tag{14.16}
$$

$$
B = \frac{1}{RC} \tag{14.17}
$$

$$
Q = \frac{R}{\omega_0 L} = \omega_0 R C = \frac{\omega_0}{B} \tag{14.18}
$$

Eq. (14.14) still holds.

**Why R is upside down here.** In series, the circulating current flows *through* R, so a bigger R burns more energy per cycle and lowers $Q$. In parallel, R sits *beside* the L–C loop and only the current that leaks out through R is lost, so a bigger R leaks *less* and **raises** $Q$. It's the same story as damping in Ch 8 ([[damping-series-vs-parallel|full explanation]]). If you remember that, you never have to memorize which formula has R on top.

|  |Series RLC|Parallel RLC|
|---|---|---|
|Resonant frequency|$\frac{1}{\sqrt{LC}}$|$\frac{1}{\sqrt{LC}}$|
|At resonance, the L–C pair acts like|a short|an open|
|At resonance|$\lvert Z\rvert$ minimum, current maximum|$\lvert Z\rvert$ maximum, voltage maximum|
|Equal and opposite|$\mathbf{V}_L$ and $\mathbf{V}_C$|$\mathbf{I}_L$ and $\mathbf{I}_C$|
|Quality factor|$\frac{\omega_0 L}{R} = \frac{1}{\omega_0 RC}$|$\frac{R}{\omega_0 L} = \omega_0 RC$|
|Bandwidth|$\frac{R}{L}$|$\frac{1}{RC}$|
|Bigger $R$ gives|lower $Q$, wider band|higher $Q$, narrower band|

### Passive Filters

A **filter** passes the frequencies you want and blocks the rest. A passive filter uses only R, L and C (active filters add op amps, §14.8). You can work out what any of them does from the short/open table, before writing a single equation: ask what the L and C look like at very low and very high frequency, and see what the output is connected to.

|Type|$H(0)$|$H(\infty)$|At its special frequency|
|---|---|---|---|
|Low-pass|1|0|$0.707$ at the cutoff $\omega_c$|
|High-pass|0|1|$0.707$ at the cutoff $\omega_c$|
|Band-pass|0|0|1 at the centre $\omega_0$|
|Band-stop|1|1|0 at the centre $\omega_0$|

![[ele-302-freq-filter-shapes.svg]]
*Figure 14.7: The four filter types. Dashed grey is the ideal brick-wall response; gold is what a real RLC circuit does. Real filters can't switch instantly from pass to block, so the edge of the band is defined at $\lvert H\rvert = 0.707$ (−3 dB).*

#### Low-pass

![[ele-302-freq-lowpass-rc.svg]]
*Figure 14.8: RC low-pass filter, with the output across the capacitor.*

**Predict it first.** At DC the capacitor is an open, so no current flows, R drops nothing, and the output equals the input: $H(0) = 1$. At very high frequency the capacitor is a short across the output: $H(\infty) = 0$. So it passes low frequencies.

**Then the formula.** It's a voltage divider:

$$
H(s) = \frac{1/sC}{R + 1/sC} = \frac{1}{1 + sRC}, \qquad \omega_c = \frac{1}{RC} \tag{14.19}
$$

The **cutoff frequency** is where the capacitor's impedance is the same size as R ($\frac{1}{\omega_c C} = R$). That's the crossover between "capacitor barely matters" and "capacitor shorts everything", and it's where $|H| = \frac{1}{\sqrt{2}}$. On a Bode plot it's one simple pole (Example 9).

> [!note] An inductor does the same job from the other side. Put L in series and take the output across R: at DC the inductor is a short (everything passes) and at high frequency it's an open (nothing does). $H = \frac{1}{1 + sL/R}$, so $\omega_c = R/L$. The op-amp circuit in Example 4 uses this idea.

#### High-pass

![[ele-302-freq-highpass-rc.svg]]
*Figure 14.9: RC high-pass filter, with the output across the resistor.*

Swap R and C. Now the capacitor is in the signal's path: at DC it's an open and blocks everything ($H(0) = 0$), and at high frequency it's a short and lets everything through to R ($H(\infty) = 1$).

$$
H(s) = \frac{R}{R + 1/sC} = \frac{sRC}{1 + sRC}, \qquad \omega_c = \frac{1}{RC} \tag{14.20}
$$

The $s$ on top is a zero at the origin, which is the "blocks DC completely" behaviour written as algebra (Example 10).

#### Band-pass

![[ele-302-freq-bandpass.svg]]
*Figure 14.10: Series RLC band-pass filter, with the output across R.*

Put L and C in series with the signal and take the output across R. At DC the capacitor blocks; at high frequency the inductor blocks. Only near $\omega_0$, where L and C cancel and look like a short, does the signal reach R in full:

$$
H(s) = \frac{R}{R + sL + \frac{1}{sC}} = \frac{\frac{R}{L}\,s}{s^2 + \frac{R}{L}s + \frac{1}{LC}} \tag{14.21}
$$

This is **series resonance viewed from the output**. The output voltage is $R$ times the loop current, so $|H|$ has exactly the shape of the resonance curve in Figure 14.5. The centre is $\omega_0$, the passband is $\omega_1 < \omega < \omega_2$, and its width is $B = R/L$.

#### Band-stop

![[ele-302-freq-bandstop.svg]]
*Figure 14.11: Series RLC band-stop (notch) filter, with the output across the L–C pair.*

Same three parts, but take the output across the L–C pair. At DC the capacitor is open, and at high frequency the inductor is open, so either way the pair is an open circuit and gets the whole input: $H(0) = H(\infty) = 1$. At $\omega_0$ the pair cancels to a short, so the output is zero:

$$
H(s) = \frac{sL + \frac{1}{sC}}{R + sL + \frac{1}{sC}} = \frac{s^2 + \frac{1}{LC}}{s^2 + \frac{R}{L}s + \frac{1}{LC}} \tag{14.22}
$$

The zeros at $s = \pm j\omega_0$ sit right on the frequency axis. That's the algebra saying "this exact frequency is completely blocked".

> [!tip] Band-pass and band-stop are two halves of one circuit. By KVL, the voltage across R plus the voltage across the L–C pair equals the input, so $H_{BP} + H_{BS} = 1$. Whatever one passes, the other rejects.

Both filters fit the standard form with a quadratic: dividing top and bottom by $\omega_0^2$ and writing $\frac{R}{L} = 2\alpha$ gives a quadratic factor with $\omega_n = \omega_0$ and $\zeta = \frac{\alpha}{\omega_0} = \frac{1}{2Q}$. So the filter's sharpness, its $Q$, and its damping are all the same number seen three ways.

## Key formulas

**Complex frequency**

$$
s = \alpha + j\omega, \qquad x(t) = A\,e^{\alpha t}\cos(\omega t + \theta) \tag{14.1–14.2}
$$

- $\alpha$: decay ($< 0$) or growth ($> 0$) rate (Np/s)
- $\omega$: oscillation frequency (rad/s); steady-state AC is $s = j\omega$

**Impedances**

$$
Z_R = R, \qquad Z_L = sL, \qquad Z_C = \frac{1}{sC} \tag{14.3}
$$

**Transfer function and decibels**

$$
H(s) = \frac{\text{output}}{\text{input}}, \qquad H_{\text{dB}} = 20\log_{10}|H| \tag{14.4–14.5}
$$

- Zeros: roots of the numerator (frequencies that are blocked)
- Poles: roots of the denominator (the circuit's natural frequencies)
- $1/\sqrt{2} = -3$ dB = half power

**Bode plot: standard form and sums**

$$
H(j\omega) = \frac{K\,(j\omega)^{\pm N}\left(1 + \frac{j\omega}{z_1}\right)\cdots}{\left(1 + \frac{j\omega}{p_1}\right)\cdots\left[1 + j2\zeta\frac{\omega}{\omega_n} + \left(\frac{j\omega}{\omega_n}\right)^2\right]\cdots} \tag{14.6}
$$

$$
H_{\text{dB}} = \sum (\text{dB of top factors}) - \sum (\text{dB of bottom factors}), \qquad \phi = \sum (\text{top angles}) - \sum (\text{bottom angles}) \tag{14.7–14.8}
$$

- $z$, $p$, $\omega_n$: corner frequencies
- Simple factor: $\pm 20$ dB/decade after its corner; phase $\pm 90^\circ$ spread from $\frac{1}{10}$ to $10\times$ the corner
- Quadratic factor: $\pm 40$ dB/decade; phase $\pm 180^\circ$
- At the origin: $\pm 20N$ dB/decade through 0 dB at $\omega = 1$; phase $\pm 90N^\circ$

**Series resonance**

$$
Z = R + j\left(\omega L - \frac{1}{\omega C}\right), \qquad \omega_0 = \frac{1}{\sqrt{LC}} \tag{14.9–14.10}
$$

$$
\omega_{1,2} = \mp\frac{R}{2L} + \sqrt{\left(\frac{R}{2L}\right)^2 + \frac{1}{LC}} \tag{14.11}
$$

$$
B = \frac{R}{L}, \qquad Q = \frac{\omega_0}{B} = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 CR} \tag{14.12–14.13}
$$

**Both series and parallel**

$$
\omega_0 = \sqrt{\omega_1\omega_2}, \qquad \omega_{1,2} \approx \omega_0 \mp \frac{B}{2}\ \ (Q \geq 10) \tag{14.14}
$$

**Parallel resonance**

$$
Y = \frac{1}{R} + j\left(\omega C - \frac{1}{\omega L}\right), \qquad \omega_0 = \frac{1}{\sqrt{LC}} \tag{14.15}
$$

$$
\omega_{1,2} = \mp\frac{1}{2RC} + \sqrt{\left(\frac{1}{2RC}\right)^2 + \frac{1}{LC}} \tag{14.16}
$$

$$
B = \frac{1}{RC}, \qquad Q = \frac{R}{\omega_0 L} = \omega_0 RC = \frac{\omega_0}{B} \tag{14.17–14.18}
$$

- $\omega_0$: resonant frequency (rad/s); $f_0 = \omega_0/2\pi$ (Hz)
- $\omega_1$, $\omega_2$: lower and upper half-power frequencies (rad/s)
- $B$: bandwidth (rad/s); $Q$: quality factor (no units)

**Passive filters**

$$
H_{LP} = \frac{1}{1 + sRC}, \qquad H_{HP} = \frac{sRC}{1 + sRC}, \qquad \omega_c = \frac{1}{RC} \tag{14.19–14.20}
$$

$$
H_{BP} = \frac{\frac{R}{L}s}{s^2 + \frac{R}{L}s + \frac{1}{LC}}, \qquad H_{BS} = \frac{s^2 + \frac{1}{LC}}{s^2 + \frac{R}{L}s + \frac{1}{LC}} \tag{14.21–14.22}
$$

- $\omega_c$: cutoff frequency, where $|H| = 0.707$
- Band-pass and band-stop share $\omega_0$, $B = R/L$ and $Q$ with series resonance

## Examples

Each example starts by predicting the answer from the circuit (shorts and opens, which factor wins where), then confirms it with the math. That habit catches most mistakes before they happen.

### Example 1: Transfer function from a circuit, then its Bode plot

In Figure 14.12, $L = 1$ H, $C = \frac{1}{20}$ F, $R = 12\ \Omega$, and the block multiplies its input by $K = \frac{200}{12}$. Find $H(s) = V_o/V_i$ and sketch its Bode plot.

![[ele-302-freq-ex01-circuit.svg]]
*Figure 14.12: Circuit for Example 1.*

**Predict.** At DC the capacitor blocks the loop current, so $V_R = 0$. At high frequency the inductor blocks it. Only in between, where L and C cancel, does current flow. So expect a **band-pass** shape that's zero at both ends.

**Transfer function.** L, C and R are in series and share the current $I$:

$$
V_i = \left(sL + \frac{1}{sC} + R\right)I, \qquad V_o = K V_R = KRI
$$

$$
H(s) = \frac{KR}{sL + \frac{1}{sC} + R} = \frac{200}{s + \frac{20}{s} + 12} = \frac{200s}{s^2 + 12s + 20} = \frac{200s}{(s + 2)(s + 10)}
$$

using $KR = 200$, $L = 1$ and $\frac{1}{C} = 20$, then multiplying top and bottom by $s$. The $s$ on top (zero at the origin) is the "capacitor blocks DC" prediction showing up in the algebra.

**Standard form.** Pull a 2 and a 10 out of the bottom: $K = \frac{200}{2 \cdot 10} = 10$.

$$
H(j\omega) = \frac{10\,j\omega}{\left(1 + \frac{j\omega}{2}\right)\left(1 + \frac{j\omega}{10}\right)}
$$

$$
H_{\text{dB}} = 20\log_{10}10 + 20\log_{10}\omega - 20\log_{10}\left|1 + \tfrac{j\omega}{2}\right| - 20\log_{10}\left|1 + \tfrac{j\omega}{10}\right|, \qquad \phi = 90^\circ - \tan^{-1}\frac{\omega}{2} - \tan^{-1}\frac{\omega}{10}
$$

**Build the sketch, left to right.**

|Range|Active terms|Slope|Value|
|---|---|---|---|
|$\omega < 2$|$K$ (+20 dB) and the zero at the origin|$+20$ dB/decade|20 dB at $\omega = 1$, 26 dB at $\omega = 2$|
|$2 < \omega < 10$|add the pole at 2|$+20 - 20 = 0$|flat at 26 dB|
|$\omega > 10$|add the pole at 10|$-20$ dB/decade|6 dB at $\omega = 100$|

The phase starts at $+90^\circ$ (the zero at the origin), and each pole pulls it down $90^\circ$, ending at $-90^\circ$ (Figure 14.13). Check: one zero and two poles gives a high-frequency slope of $(1 - 2) \times 20 = -20$ dB/decade ✓.

![[ele-302-freq-ex01-bode.svg]]
*Figure 14.13: Bode plot for Example 1. Gold is exact and dashed grey is the straight-line sketch.*

> [!note] The prediction was right: it's a band-pass. The true peak is at resonance, $\omega_0 = \frac{1}{\sqrt{LC}} = \sqrt{20} = 4.47$ rad/s, where L and C cancel, the whole input lands on R, and $V_o = KV_i$. So $|H| = K = 16.7$ (24.4 dB) and $\phi = 0^\circ$ there. The denominator split into real roots because $\zeta = \frac{12}{2\sqrt{20}} = 1.34 > 1$ (overdamped), which is why the plot has a flat top instead of a sharp peak.

### Example 2: Zero, pole at the origin and a simple pole

Sketch the Bode plot of $H(s) = \dfrac{5(s + 2)}{s(s + 10)}$.

**Standard form.** Pull a 2 out of $(s + 2)$ and a 10 out of $(s + 10)$: $K = \frac{5 \cdot 2}{10} = 1$, which is 0 dB.

$$
H(j\omega) = \frac{1 + \frac{j\omega}{2}}{j\omega\left(1 + \frac{j\omega}{10}\right)}, \qquad \phi = -90^\circ + \tan^{-1}\frac{\omega}{2} - \tan^{-1}\frac{\omega}{10}
$$

**Build the sketch.**

|Range|Active terms|Slope|Value|
|---|---|---|---|
|$\omega < 2$|the pole at the origin|$-20$ dB/decade|0 dB at $\omega = 1$, −6 dB at $\omega = 2$|
|$2 < \omega < 10$|add the zero at 2|$-20 + 20 = 0$|flat at −6 dB|
|$\omega > 10$|add the pole at 10|$-20$ dB/decade|−26 dB at $\omega = 100$|

**Phase.** The pole at the origin holds it at $-90^\circ$. The zero at 2 tries to raise it by $90^\circ$, but before it finishes, the pole at 10 starts pulling it back down. So it only bumps up to about $-48^\circ$, near $\omega = \sqrt{2 \cdot 10} = 4.5$ rad/s (on a log axis, the point midway between the corners), before returning to $-90^\circ$ (Figure 14.14). If the corners were further apart, the bump would come closer to $0^\circ$.

![[ele-302-freq-ex02-bode.svg]]
*Figure 14.14: Bode plot for Example 2.*

### Example 3: A double pole

Sketch the Bode plot of $H(s) = \dfrac{s + 10}{s(s + 5)^2}$.

**Standard form.** Pull a 10 out of the zero and $5^2 = 25$ out of the double pole: $K = \frac{10}{25} = 0.4$, which is $20\log 0.4 = -8$ dB.

$$
H(j\omega) = \frac{0.4\left(1 + \frac{j\omega}{10}\right)}{j\omega\left(1 + \frac{j\omega}{5}\right)^2}
$$

$$
H_{\text{dB}} = -8 + 20\log_{10}\left|1 + \tfrac{j\omega}{10}\right| - 20\log_{10}\omega - 40\log_{10}\left|1 + \tfrac{j\omega}{5}\right|, \qquad \phi = \tan^{-1}\frac{\omega}{10} - 90^\circ - 2\tan^{-1}\frac{\omega}{5}
$$

The squared factor counts twice: **40** log and **2** tan⁻¹.

**Build the sketch.**

|Range|Active terms|Slope|Value|
|---|---|---|---|
|$\omega < 5$|$K$ and the pole at the origin|$-20$ dB/decade|−8 dB at $\omega = 1$, −22 dB at $\omega = 5$|
|$5 < \omega < 10$|add the double pole|$-20 - 40 = -60$ dB/decade|−40 dB at $\omega = 10$|
|$\omega > 10$|add the zero|$-60 + 20 = -40$ dB/decade|−80 dB at $\omega = 100$|

**Phase:** from $-90^\circ$ to $-90^\circ + 90^\circ - 180^\circ = -180^\circ$. Check with the counting rule: 1 zero and 3 poles at high frequency gives $-40$ dB/decade and $-180^\circ$ ✓.

![[ele-302-freq-ex03-bode.svg]]
*Figure 14.15: Bode plot for Example 3.*

### Example 4: Op-amp circuit

In Figure 14.16, $R = 1\ \Omega$ and $L = 0.1$ H. Find $H(s) = V_o/V_i$ and sketch its Bode plot.

![[ele-302-freq-ex04-opamp.svg]]
*Figure 14.16: Inverting amplifier with an R–L input branch, for Example 4.*

**Predict.** It's an inverting amplifier with gain $-\frac{Z_f}{Z_{in}}$. At low frequency the inductor is a short, so $Z_{in} = R$ and the gain is $-10$. At high frequency the inductor is an open, so no input current flows and the output goes to 0. So expect an **inverting low-pass** with a gain of 10.

**Transfer function.** The $+$ input is grounded, so negative feedback holds $v_1 = 0$. KCL at $v_1$:

$$
\frac{V_i - 0}{R + sL} + \frac{V_o - 0}{10R} = 0 \quad\Rightarrow\quad H(s) = -\frac{10R}{R + sL} = -\frac{10}{1 + \frac{s}{R/L}} = -\frac{10}{1 + \frac{s}{10}}
$$

since $R/L = 10$ rad/s. The corner is where $\omega L = R$, the inductor's impedance matching the resistor.

**Magnitude.** The minus sign doesn't change the size, so $20\log 10 = 20$ dB, flat up to $\omega = 10$, then $-20$ dB/decade, crossing 0 dB at $\omega = 100$.

**Phase.** The minus sign flips the output upside down, which is a $180^\circ$ shift, and the pole subtracts up to $90^\circ$ more:

$$
\phi = 180^\circ - \tan^{-1}\frac{\omega}{10}
$$

It goes from $180^\circ$ to $90^\circ$, passing $135^\circ$ at the corner (Figure 14.17). Writing it as $-180^\circ \to -270^\circ$ describes the same angles.

![[ele-302-freq-ex04-bode.svg]]
*Figure 14.17: Bode plot for Example 4.*

> [!warning] A common slip is to drop the minus sign from $K$ and draw the phase going from $0^\circ$ to $-90^\circ$. The magnitude plot can't show the sign, but the phase plot must: an inverting amplifier always contributes $180^\circ$.

### Example 5: Series resonance (high Q)

A series RLC has $R = 2\ \Omega$, $L = 1$ mH and $C = 0.4\ \mu$F, driven by a sinusoid of amplitude $V_m = 20$ V. Find (a) $\omega_0$, (b) $\omega_1$ and $\omega_2$, (c) $B$, (d) $Q$, (e) the current amplitude at $\omega_0$, $\omega_1$ and $\omega_2$, and (f) the inductor voltage at resonance.

**(a)** Eq. (14.10):

$$
\omega_0 = \frac{1}{\sqrt{(10^{-3})(0.4 \times 10^{-6})}} = \frac{1}{2 \times 10^{-5}} = 50\ \text{krad/s}
$$

**(b)** $\frac{R}{2L} = \frac{2}{2 \times 10^{-3}} = 1000$ rad/s. Then Eq. (14.11):

$$
\omega_{1,2} = \mp 1000 + \sqrt{1000^2 + (50\,000)^2} = \mp 1000 + 50\,010 \quad\Rightarrow\quad \omega_1 = 49.01\ \text{krad/s}, \quad \omega_2 = 51.01\ \text{krad/s}
$$

**(c)** $B = \frac{R}{L} = 2000$ rad/s $= 2$ krad/s, matching $\omega_2 - \omega_1$ ✓.

**(d)** $Q = \frac{\omega_0}{B} = \frac{50}{2} = 25$. The peak is only 4% as wide as its centre frequency, so it's sharp. That's why the shortcut $\omega_0 \mp \frac{B}{2} = 49, 51$ krad/s works so well here.

**(e)** At $\omega_0$ only R is left, so $I = \frac{V_m}{R} = \frac{20}{2} = 10$ A. At $\omega_1$ and $\omega_2$, $|Z| = \sqrt{2}R$, so $I = \frac{10}{\sqrt{2}} = 7.07$ A.

**(f)** The inductor's impedance at resonance is $\omega_0 L = (50\,000)(10^{-3}) = 50\ \Omega$, so

$$
|V_L| = \omega_0 L \cdot I = 50 \times 10 = 500\ \text{V} = Q\,V_m
$$

The capacitor has the same 500 V, opposite in phase. A 20 V source produces 500 V across each of L and C. They cancel each other around the loop, so KVL is fine, but the parts themselves have to survive 500 V. This "voltage magnification" is what high $Q$ means physically: lots of energy sloshing between L and C, very little lost per cycle.

### Example 6: Series resonance (low Q)

A series RLC has $R = 5\ \Omega$, $L = 10$ H, $C = 0.1$ F and a 10 V (rms) source. Find $\omega_0$, $\omega_1$, $\omega_2$ and $B$. At resonance, find $I$, $V_R$, $V_L$, $V_C$ and the power. Also find the power and current at the half-power frequencies.

1. **Resonant frequency:** $\omega_0 = \frac{1}{\sqrt{(10)(0.1)}} = 1$ rad/s.
2. **Half-power frequencies:** $\frac{R}{2L} = 0.25$, so $\omega_{1,2} = \mp 0.25 + \sqrt{0.0625 + 1} = 0.781,\ 1.281$ rad/s.
3. **Bandwidth:** $B = \frac{R}{L} = 0.5$ rad/s, so $Q = \frac{1}{0.5} = 2$. That's a broad peak, half as wide as its centre frequency.
4. **Current at resonance.** The reactances are $j\omega_0 L = j10$ and $\frac{-j}{\omega_0 C} = -j10$. They cancel exactly, which is the definition of resonance:
   $$\mathbf{I} = \frac{10\angle 0^\circ}{5 + j10 - j10} = 2\angle 0^\circ\ \text{A}$$
5. **Power at resonance:** $P = |I|^2R = (4)(5) = 20$ W.
6. **At the half-power frequencies** the power is half, 10 W, so $|I| = \sqrt{10/5} = \sqrt{2}$ A. Check it directly: at $\omega_1$ the leftover reactance is $7.81 - 12.81 = -5\ \Omega$, the same size as R, so $|Z| = \sqrt{5^2 + 5^2} = 5\sqrt{2}$ and $|I| = \frac{10}{5\sqrt{2}} = \sqrt{2}$ A ✓.
7. **Element voltages at resonance:**
   $$\mathbf{V}_R = 10\ \text{V}, \qquad \mathbf{V}_L = (j10)(2) = j20\ \text{V}, \qquad \mathbf{V}_C = (-j10)(2) = -j20\ \text{V}$$
   $\mathbf{V}_L + \mathbf{V}_C = 0$, so the whole 10 V sits on R. Each reactive voltage is $Q = 2$ times the source, which is much less dramatic than Example 5's $Q = 25$.

> [!note] $P = |I|^2R$ is for rms values. If the 10 V were a peak amplitude, average power would be $\frac{1}{2}|I|^2R$: 10 W at resonance and 5 W at the half-power points. Always check which one a question gives you.

### Example 7: Parallel resonance (high Q)

A parallel RLC has $R = 8$ kΩ, $L = 0.2$ mH and $C = 8\ \mu$F, driven by a current source of amplitude $I_m = 1.25$ mA. Find (a) $\omega_0$, (b) $Q$, (c) $B$, (d) $\omega_1$ and $\omega_2$, and (e) the voltage and power at $\omega_0$, $\omega_1$ and $\omega_2$.

**(a)**
$$
\omega_0 = \frac{1}{\sqrt{(0.2 \times 10^{-3})(8 \times 10^{-6})}} = \frac{1}{4 \times 10^{-5}} = 25\ \text{krad/s}
$$

**(b)** It's parallel, so R goes on **top** (a big parallel R leaks little energy):
$$
Q = \frac{R}{\omega_0 L} = \frac{8000}{(25\,000)(0.2 \times 10^{-3})} = \frac{8000}{5} = 1600
$$

**(c)** $B = \frac{\omega_0}{Q} = \frac{25\,000}{1600} = 15.6$ rad/s. (Check: $\frac{1}{RC} = \frac{1}{(8000)(8 \times 10^{-6})} = 15.6$ ✓.)

**(d)** With $Q = 1600$ the peak is extremely narrow, so the shortcut is essentially exact:
$$
\omega_{1,2} = \omega_0 \mp \frac{B}{2} = 25\,000 \mp 7.8 = 24\,992,\ 25\,008\ \text{rad/s}
$$

**(e)** At $\omega_0$ the L–C pair looks like an open, so the whole source current goes through R:
$$
V = I_m R = (1.25 \times 10^{-3})(8000) = 10\ \text{V}, \qquad P = \tfrac{1}{2}I_m^2R = \tfrac{1}{2}(1.25 \times 10^{-3})^2(8000) = 6.25\ \text{mW}
$$
At $\omega_1$ and $\omega_2$, $V = \frac{10}{\sqrt{2}} = 7.07$ V and the power halves to 3.125 mW.

**The circulating current.** The inductor carries $\frac{V}{\omega_0 L} = \frac{10}{5} = 2$ A, and the capacitor carries 2 A the opposite way. That's $Q \times I_m = 1600 \times 1.25$ mA. A 1.25 mA source keeps 2 A circulating around the L–C loop, because almost none of the energy is lost each cycle. It's the parallel version of Example 5's voltage magnification.

### Example 8: Parallel resonance (low Q)

A parallel RLC has $R = 5\ \Omega$, $L = 10$ H and $C = 0.1$ F, driven by a 10 A (rms) source. Find $\omega_0$, $Q$, $B$, $\omega_1$, $\omega_2$, $V(\omega_0)$, $I_R$, $I_L$, $I_C$ and the power at $\omega_0$.

1. **Resonant frequency:** $\omega_0 = \frac{1}{\sqrt{(10)(0.1)}} = 1$ rad/s.
2. **Quality factor:** $Q = \frac{R}{\omega_0 L} = \frac{5}{10} = 0.5$. A small parallel R leaks a lot of current, so $Q$ is low.
3. **Bandwidth:** $B = \frac{\omega_0}{Q} = 2$ rad/s (check: $\frac{1}{RC} = 2$ ✓). That's **twice** the centre frequency.
4. **Half-power frequencies**, Eq. (14.16), with $\frac{1}{2RC} = 1$:
   $$\omega_{1,2} = \mp 1 + \sqrt{1 + 1} = \sqrt{2} \mp 1 = 0.414,\ 2.414\ \text{rad/s}$$
5. **Voltage:** at resonance the L–C pair is an open, so all 10 A goes through R: $V = 50$ V and $I_R = 10$ A.
6. **Branch currents:**
   $$\mathbf{I}_L = \frac{50}{j10} = -j5\ \text{A}, \qquad \mathbf{I}_C = 50\,(j0.1) = +j5\ \text{A}$$
   They cancel, so the source only sees R. Each is $Q \times 10 = 5$ A.
7. **Power:** $P = I^2R = (100)(5) = 500$ W, and 250 W at $\omega_1$ and $\omega_2$.

> [!warning] With $Q = 0.5$, the shortcut $\omega_0 \mp \frac{B}{2}$ gives 0 and 2 rad/s, which is badly wrong. The peak is so wide that it's visibly lopsided on a linear axis: $\omega_2$ is 1.4 rad/s above $\omega_0$ but $\omega_1$ is only 0.6 below. On a log axis it's symmetric, which is why the exact rule is the geometric mean: $\sqrt{(0.414)(2.414)} = 1$ ✓.

### Example 9: RC low-pass filter

For the low-pass filter in Figure 14.8 with $R = 8\ \Omega$ and $C = 4$ F, find $H(s)$ and the cutoff frequency, and sketch the Bode plot.

**Predict.** Capacitor across the output: an open at DC ($H = 1$) and a short at high frequency ($H = 0$). Low-pass, with the crossover where $\frac{1}{\omega C} = R$.

**Transfer function.** $RC = 32$ s, so

$$
H(s) = \frac{1}{1 + 32s}, \qquad \omega_c = \frac{1}{32} = 0.031\ \text{rad/s}
$$

**Bode plot** (Figure 14.18): one simple pole. 0 dB up to 0.031 rad/s, then $-20$ dB/decade (−20 dB at 0.31 rad/s). Exactly at the corner, $\frac{1}{|1 + j|} = 0.707$, which is −3 dB. The phase $-\tan^{-1}(32\omega)$ goes from $0^\circ$ to $-90^\circ$, passing $-45^\circ$ at $\omega_c$. The output lags because the capacitor takes time to charge.

![[ele-302-freq-ex09-bode.svg]]
*Figure 14.18: Bode plot for Example 9.*

Huge component values like these give a cutoff of only 0.005 Hz. Practical filters use µF and kΩ, but the shape is identical. Only the position of the corner moves.

### Example 10: RC high-pass filter

For the high-pass filter in Figure 14.9 with $R = 8\ \Omega$ and $C = 4$ F, find $H(s)$ and sketch the Bode plot.

**Predict.** Capacitor in the signal path: an open at DC ($H = 0$) and a short at high frequency ($H = 1$). High-pass, same corner as Example 9.

**Transfer function.** $RC = 32$:

$$
H(s) = \frac{sRC}{1 + sRC} = \frac{32s}{1 + 32s}, \qquad \omega_c = 0.031\ \text{rad/s}
$$

**Bode plot.** In standard form it's $K = 32$ (30.1 dB), a zero at the origin, and a pole at $\frac{1}{32}$:

- **Below $\omega_c$:** $30.1 + 20\log\omega$ rises at $+20$ dB/decade. At $\omega = \frac{1}{32}$ it's $30.1 - 30.1 = 0$ dB, so the rising line arrives at 0 dB exactly at the corner. That isn't a coincidence: $K$ is always $1/\omega_c$ for this filter.
- **Above $\omega_c$:** the pole cancels the rise, leaving **0 dB**, matching $H(\infty) = 1$.
- **Phase:** $90^\circ - \tan^{-1}(32\omega)$, from $+90^\circ$ (output leads) to $0^\circ$, passing $45^\circ$ at $\omega_c$.

It's Example 9 mirrored across the corner (Figure 14.19).

![[ele-302-freq-ex10-bode.svg]]
*Figure 14.19: Bode plot for Example 10.*

### Example 11: Series RLC band-pass filter

For the band-pass filter in Figure 14.10 with $R = 5\ \Omega$, $L = 0.25$ H and $C = 2$ F, find $H(s)$, $\omega_0$, $B$ and $Q$, and sketch the Bode plot.

**Transfer function.** Eq. (14.21), with $\frac{R}{L} = 20$ and $\frac{1}{LC} = 2$:

$$
H(s) = \frac{20s}{s^2 + 20s + 2}
$$

**Resonance numbers:**

$$
\omega_0 = \frac{1}{\sqrt{0.5}} = 1.414\ \text{rad/s}, \qquad B = \frac{R}{L} = 20\ \text{rad/s}, \qquad Q = \frac{1.414}{20} = 0.071
$$

The band is 14 times wider than its centre frequency, so this is a **very** broad band-pass. Eq. (14.11) gives $\omega_{1,2} = \mp 10 + \sqrt{102}$, so $\omega_1 = 0.0995$ and $\omega_2 = 20.1$ rad/s.

**Standard form.** Low $Q$ means heavy damping: $\zeta = \frac{1}{2Q} = 7.1$. That's far above 1, so the quadratic splits into two real poles:

$$
s = -10 \pm \sqrt{100 - 2} = -0.1005,\ -19.90 \quad\Rightarrow\quad H(j\omega) = \frac{10\,j\omega}{\left(1 + \frac{j\omega}{0.1005}\right)\left(1 + \frac{j\omega}{19.90}\right)}
$$

(The constant is $\frac{20}{(0.1005)(19.90)} = \frac{20}{2} = 10$, because the product of the roots equals the constant term, 2.)

**Bode plot** (Figure 14.20). Below 0.1 rad/s, $20\log 10 + 20\log\omega$ rises at $+20$ dB/decade and reaches 0 dB at $\omega = 0.1$. It's flat at **0 dB** from 0.1 to 19.9 (the passband), then falls at $-20$ dB/decade. The exact curve touches 0 dB at $\omega_0 = 1.414$, where L and C cancel and $H = 1$. The phase goes from $+90^\circ$ through $0^\circ$ at $\omega_0$ to $-90^\circ$.

![[ele-302-freq-ex11-bode.svg]]
*Figure 14.20: Bode plot for Example 11.*

> [!warning] It's tempting to treat $s^2 + 20s + 2$ as a double pole at $\omega_0 = \sqrt{2}$, i.e. $2(1 + s/\sqrt{2})^2$. But that expands to $s^2 + 2.83s + 2$. A double pole at $\omega_0$ only happens at critical damping ($\zeta = 1$). Here the heavy damping pushes the two poles far apart, to 0.1 and 19.9, and the passband is the flat stretch between them. Always factor with the quadratic formula.

### Example 12: Band-stop (notch) filter

For the band-stop filter in Figure 14.11 with $R = 100\ \Omega$, $L = 0.1$ H and $C = 10\ \mu$F, find $\omega_0$, $B$, $Q$ and the rejected band. Then find $|H|$ at $\omega = 0$, $\omega_0$, $\omega_1$ and $2000$ rad/s.

1. **Transfer function**, Eq. (14.22), with $\frac{R}{L} = 1000$ and $\frac{1}{LC} = 10^6$:
   $$H(s) = \frac{s^2 + 10^6}{s^2 + 1000s + 10^6}$$
2. **Centre frequency:** $\omega_0 = \frac{1}{\sqrt{10^{-6}}} = 1000$ rad/s ($f_0 = 159$ Hz).
3. **Bandwidth and Q:** $B = \frac{R}{L} = 1000$ rad/s, so $Q = 1$.
4. **Edges of the rejected band**, Eq. (14.11), with $\frac{R}{2L} = 500$:
   $$\omega_{1,2} = \mp 500 + \sqrt{500^2 + 10^6} = 618,\ 1618\ \text{rad/s}$$
   Check: $\sqrt{(618)(1618)} = 1000$ ✓, and $1618 - 618 = 1000$ ✓.
5. **Values of $|H|$.** Let $X = \omega L - \frac{1}{\omega C}$ be the L–C pair's net reactance. The output is the pair's share of a divider, $|H| = \frac{|X|}{\sqrt{R^2 + X^2}}$:
   - $\omega = 0$: C is open, so the pair gets everything: $|H| = 1$.
   - $\omega = \omega_0$: $X = 100 - 100 = 0$. The pair is a short: $|H| = 0$.
   - $\omega = 618$: $X = 61.8 - 161.8 = -100$, the same size as R, so $|H| = \frac{100}{\sqrt{2}\cdot 100} = 0.707$ ✓. That's why it's the band edge.
   - $\omega = 2000$: $X = 200 - 50 = 150$, so $|H| = \frac{150}{\sqrt{100^2 + 150^2}} = 0.832$. Recovering, but not fully passed yet.

**Bode plot.** In standard form it's a quadratic zero ($\zeta = 0$) over a quadratic pole ($\zeta = \frac{1}{2Q} = 0.5$), both at $\omega_0$. Their $+40$ and $-40$ dB/decade asymptotes cancel exactly, so **the straight-line sketch is a flat 0 dB line that misses the notch completely**. The notch only shows up in the exact values. The phase dips toward $-90^\circ$ below $\omega_0$, flips by $180^\circ$ at the notch (the output passes through zero and changes sign), and settles back from $+90^\circ$ (Figure 14.21).

![[ele-302-freq-ex12-bode.svg]]
*Figure 14.21: Exact Bode plot for Example 12. The gain drops to zero ($-\infty$ dB) at $\omega_0 = 1000$ rad/s.*

## Common mistakes

- Plotting $(s + z)$ as if it were $(1 + s/z)$. The factor $z$ belongs in $K$
- Using **10** log instead of **20** log for a voltage or current ratio
- Dropping the $180^\circ$ from a negative $K$, as in every inverting amplifier
- Counting a squared factor once. A double pole is $-40$ dB/decade and $-180^\circ$
- Bending the phase only at the corner. It changes over two decades, from $\frac{1}{10}$ to $10\times$ the corner
- Using the series $B = R/L$ and $Q = \omega_0 L/R$ for a **parallel** circuit. Think about where R sits: in parallel it's $B = \frac{1}{RC}$ and $Q = \frac{R}{\omega_0 L}$
- Using $\omega_0 \mp \frac{B}{2}$ when $Q$ is low. It's only accurate for $Q \geq 10$
- Taking $\omega_0$ as the average of $\omega_1$ and $\omega_2$. It's the geometric mean
- Mixing rad/s and Hz. $1/\sqrt{LC}$ is in rad/s
- Mixing peak and rms in power: $\frac{1}{2}I_m^2R$ vs. $I_{\text{rms}}^2R$
- Trusting the straight lines near a lightly damped quadratic or a notch. That's exactly where they're furthest off
- Skipping the shorts-and-opens prediction. It takes ten seconds and catches most algebra errors
