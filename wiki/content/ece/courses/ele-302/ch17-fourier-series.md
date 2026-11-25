---
title: "Ch 17: The Fourier Series"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 17** · Lecture notes: *Notes 7, The Fourier Transform* (despite the title, the notes cover the Fourier **series**, for periodic signals)

So far every AC source has been a pure sinusoid. Real periodic signals usually aren't: square waves from a digital clock, sawtooths from a sweep generator, the chopped-up output of a rectifier. This chapter handles them with one idea:

> **Any periodic signal is a DC level plus a sum of sinusoids whose frequencies are whole-number multiples of the signal's own frequency.**

That sum is the **Fourier series**. It turns a hard problem into many easy ones. A linear circuit can't create new frequencies (see [[ch14-frequency-response#Sine In, Sine Out|Ch 14: Sine In, Sine Out]]), so it treats each sinusoid separately. Solve the circuit once per frequency with ordinary phasors, then add the answers up. That's superposition.

> [!example] The whole chapter in plain words
> - **Fourier series:** a recipe for rebuilding a periodic wave from a DC level and a stack of sinusoids.
> - **Harmonics:** the sinusoids in the stack, at 1, 2, 3, … times the wave's own frequency.
> - **Coefficients:** how much of each harmonic is in the wave. Each is an average over one period.
> - **Symmetry:** an even wave has only cosines, an odd wave only sines. Spot it and half the work disappears.
> - **Circuit response:** solve one phasor problem per harmonic (the impedances change with frequency!), then add the time-domain answers.
> - **Power and rms:** each harmonic contributes its own power. Different harmonics never interact.
>
> [[#Solving the problems]] turns each of these into a recipe.

> [!tip] Background pages
> - [[ch14-frequency-response|Ch 14: Frequency Response]]: a circuit's response at each frequency is $H(j\omega)$. Here you evaluate it at $\omega = \omega_0, 2\omega_0, 3\omega_0, \dots$
> - [[capacitors-and-inductors#Impedance: how they behave at different frequencies|Impedance]]: $j\omega L$ and $\frac{1}{j\omega C}$ change from harmonic to harmonic

> [!note] Worked examples sit right after the concept they use. Try each one on paper before opening the answer. The coefficient integrals almost always need **integration by parts** or the two facts $\sin n\pi = 0$ and $\cos n\pi = (-1)^n$.

## Notes

### The Trigonometric Fourier Series

A function is **periodic** with period $T$ if $f(t + T) = f(t)$ for all $t$. Its **fundamental frequency** is

$$
\omega_0 = \frac{2\pi}{T}
$$

The Fourier series writes $f(t)$ as a DC term plus sinusoids at $\omega_0$, $2\omega_0$, $3\omega_0$, …:

$$
f(t) = a_0 + \sum_{n=1}^{\infty}\left(a_n\cos n\omega_0 t + b_n\sin n\omega_0 t\right) \tag{17.1}
$$

| Term | Name |
|---|---|
| $a_0$ | the **DC component**: the average value of $f(t)$ |
| $n = 1$ | the **fundamental**, at the signal's own frequency $\omega_0$ |
| $n = 2, 3, \dots$ | the **harmonics**, at $n\omega_0$ |

#### Finding the coefficients

$$
a_0 = \frac{1}{T}\int_0^T f(t)\,dt, \qquad a_n = \frac{2}{T}\int_0^T f(t)\cos n\omega_0 t\,dt, \qquad b_n = \frac{2}{T}\int_0^T f(t)\sin n\omega_0 t\,dt \tag{17.2}
$$

Any full period works as the range, $0$ to $T$ or $-\frac{T}{2}$ to $\frac{T}{2}$. Pick whichever makes $f(t)$ easiest to write down.

**Why these formulas work.** Over one full period, the product of two *different* harmonics averages to zero, and so does any sine times any cosine. (Each product is a sum of sinusoids by the product-to-sum identities, and a whole number of cycles of a sinusoid averages to zero.) So when you multiply (17.1) by $\cos n\omega_0 t$ and average over a period, **every term vanishes except the $a_n\cos n\omega_0 t$ term**, which averages to $\frac{a_n}{2}$. The integral "picks out" one coefficient at a time. That's where the 2 in $\frac{2}{T}$ comes from: it undoes the $\frac{1}{2}$.

#### Amplitude-phase form

At each frequency, a cosine plus a sine is a single shifted cosine:

$$
f(t) = a_0 + \sum_{n=1}^{\infty} A_n\cos(n\omega_0 t + \phi_n) \tag{17.3}
$$

$$
A_n = \sqrt{a_n^2 + b_n^2}, \qquad \phi_n = -\tan^{-1}\frac{b_n}{a_n} \tag{17.4}
$$

- The minus sign is easy to drop. It comes from $\cos(x + \phi) = \cos\phi\cos x - \sin\phi\sin x$: matching this to $a_n\cos x + b_n\sin x$ needs $\cos\phi_n = \frac{a_n}{A_n}$ and $\sin\phi_n = -\frac{b_n}{A_n}$.
- **Check the quadrant.** A calculator's $\tan^{-1}$ only returns $-90^\circ$ to $90^\circ$. Use the signs of $a_n$ and $-b_n$ to place $\phi_n$, or think of $\phi_n$ as the angle of the phasor $a_n - jb_n$.

The pair $A_n$, $\phi_n$ against $n\omega_0$ is the signal's **spectrum**: which frequencies it contains, and how much of each.

> [!tip] Two shortcuts that save a lot of conversions
> - $\sin x = \cos(x - 90^\circ)$, so a pure-sine term $b_n\sin n\omega_0 t$ has phasor $b_n\angle -90^\circ$.
> - $-\sin x = \cos(x + 90^\circ)$, so a negative $b_n$ gives $|b_n|\angle +90^\circ$.

#### Example 17.1: Sawtooth wave

Find the Fourier series of the sawtooth in Figure 17.1. It rises linearly from 0 to 10 V over each period of $T = 1$ s, then drops back to 0.

![[ele-302-fourier-sawtooth.svg]]
*Figure 17.1: Sawtooth, period 1 s, peak 10 V.*

**Set up.** $\omega_0 = \frac{2\pi}{T} = 2\pi$, and over one period $v(t) = 10t$ for $0 < t < 1$.

**DC term.** The average of a ramp from 0 to 10 is the halfway value:

$$
a_0 = \frac{1}{1}\int_0^1 10t\,dt = 5
$$

**Cosine terms.** By parts ($u = t$, $dv = \cos 2\pi nt\,dt$):

$$
a_n = 2\int_0^1 10t\cos 2\pi nt\,dt = 20\left[\frac{t\sin 2\pi nt}{2\pi n} + \frac{\cos 2\pi nt}{(2\pi n)^2}\right]_0^1 = 20\left[0 + \frac{1 - 1}{(2\pi n)^2}\right] = 0
$$

**Sine terms.**

$$
b_n = 2\int_0^1 10t\sin 2\pi nt\,dt = 20\left[-\frac{t\cos 2\pi nt}{2\pi n} + \frac{\sin 2\pi nt}{(2\pi n)^2}\right]_0^1 = 20\left(-\frac{1}{2\pi n}\right) = -\frac{10}{n\pi}
$$

**Series.**

$$
v(t) = 5 - \sum_{n=1}^{\infty}\frac{10}{n\pi}\sin 2\pi nt = 5 + \sum_{n=1}^{\infty}\frac{10}{n\pi}\cos(2\pi nt + 90^\circ)\ \text{V}
$$

In amplitude-phase form, $A_n = \frac{10}{n\pi}$ and $\phi_n = +90^\circ$ (since $a_n = 0$ and $b_n < 0$, the phasor $a_n - jb_n$ points straight up).

**Why $a_n = 0$.** Take away the DC level and $v(t) - 5$ runs from $-5$ to $+5$ around each jump. It's **odd** (see the next section), so it has no cosines.

Figure 17.2 shows the series rebuilding the wave. One term gives a sine wave with the right period. Each extra term sharpens the ramp and the drop.

![[ele-302-fourier-partial-sums.svg]]
*Figure 17.2: The first 1, 3 and 15 terms of the series (with $a_0 = 5$), against the sawtooth (dashed). Near each jump the sum overshoots by about 9% however many terms you keep (the Gibbs phenomenon).*

> [!warning] Notes check
> - The notes' figure shows a 10 V peak, but their working uses $f(t) = t$ (a 1 V peak), giving $a_0 = \frac{1}{2}$ and $b_n = -\frac{1}{n\pi}$. Those are this answer divided by 10. The series is linear, so scaling the wave scales every coefficient.
> - The notes write $\theta_n = \tan^{-1}(b_n/a_n)$, which would give $-90^\circ$ here. Their answer of $+90^\circ$ is right; it follows from $\phi_n = -\tan^{-1}(b_n/a_n)$, Eq. (17.4).

### Symmetry

Before integrating, check the wave for symmetry. It can tell you which coefficients are zero.

| Symmetry | Test | Coefficients |
|---|---|---|
| **Even** | $f(-t) = f(t)$: a mirror image across the vertical axis | $b_n = 0$, only cosines. $a_n = \frac{4}{T}\int_0^{T/2} f(t)\cos n\omega_0 t\,dt$ |
| **Odd** | $f(-t) = -f(t)$: flipped across both axes | $a_0 = a_n = 0$, only sines. $b_n = \frac{4}{T}\int_0^{T/2} f(t)\sin n\omega_0 t\,dt$ |

**Why.** Cosine is even and sine is odd. An even wave can't contain any odd ingredient, so it has no sines. An odd wave has no cosines, and its average is zero, so $a_0 = 0$ too. Over a symmetric range, the product of an odd function with an even one integrates to zero, while the remaining integral is twice the integral over half a period. That's why the formulas use $\frac{4}{T}$ and $\int_0^{T/2}$.

> [!tip] Subtract the DC level first
> A wave that's neither even nor odd often becomes odd or even once you remove its average. The sawtooth in Example 17.1 minus 5 is odd. The square wave in Example 17.5 minus 1 is odd. Find $a_0$ first, then check the rest for symmetry.

#### Example 17.2: Odd pulse wave

Find the Fourier series of $f(t)$ in Figure 17.3. Each period of $T = 4$ s has a pulse of $+1$ from $0$ to $1$ and $-1$ from $-1$ to $0$, and is zero otherwise.

![[ele-302-fourier-odd-pulse.svg]]
*Figure 17.3: Odd pulse wave, period 4 s.*

**Symmetry.** Flip the graph across both axes and it lands on itself, so $f$ is **odd**: $a_0 = a_n = 0$.

**Sine terms.** $T = 4$, so $\omega_0 = \frac{\pi}{2}$. On the half period $0$ to $2$, $f = 1$ from 0 to 1 and $f = 0$ from 1 to 2:

$$
b_n = \frac{4}{4}\left[\int_0^1 1\cdot\sin\frac{n\pi t}{2}\,dt + \int_1^2 0\,dt\right] = \left[-\frac{2}{n\pi}\cos\frac{n\pi t}{2}\right]_0^1 = \frac{2}{n\pi}\left(1 - \cos\frac{n\pi}{2}\right)
$$

**Series.**

$$
f(t) = \frac{2}{\pi}\sum_{n=1}^{\infty}\frac{1}{n}\left(1 - \cos\frac{n\pi}{2}\right)\sin\frac{n\pi t}{2}
$$

This is a **Fourier sine series**. The first few terms show the pattern:

| $n$ | $\cos\frac{n\pi}{2}$ | $b_n$ |
|---|---|---|
| 1 | 0 | $\frac{2}{\pi} = 0.637$ |
| 2 | $-1$ | $\frac{2}{\pi} = 0.637$ |
| 3 | 0 | $\frac{2}{3\pi} = 0.212$ |
| 4 | 1 | 0 |
| 5 | 0 | $\frac{2}{5\pi} = 0.127$ |

Every fourth harmonic is missing.

### Circuit Response to a Periodic Source

Replace the periodic source with its Fourier series: a DC source in series with one sinusoidal source per harmonic. The circuit is linear, so **superposition** lets you find the response to each source alone and add.

Steps:

1. **Write the source as a Fourier series.**
2. **Transform the circuit to the frequency domain at $\omega_n = n\omega_0$**, keeping $n$ as a variable: $Z_L = jn\omega_0L$, $Z_C = \frac{1}{jn\omega_0C}$. Work out the response for a general $n$ once (a transfer function, voltage divider, and so on).
3. **Find each component's response.**
   - **DC ($n = 0$):** inductors are shorts, capacitors are opens.
   - **Harmonic $n$:** write the source term as a phasor and multiply by $H(jn\omega_0)$.
4. **Add the responses in the time domain:** $\text{response}(t) = \text{DC response} + \sum_n |\text{phasor}_n|\cos(n\omega_0 t + \angle\text{phasor}_n)$.

> [!important] You can't add the harmonic phasors to each other. They're at different frequencies, so each one only means something with its own $\cos(n\omega_0 t + \dots)$ attached. Convert every harmonic back to the time domain first, then add.

#### Example 17.3: RL circuit with a square-wave source

In Figure 17.4, $R = 5\ \Omega$, $L = 2$ H, and

$$
v_s(t) = \frac{1}{2} + \frac{2}{\pi}\sum_{n\ \text{odd}}\frac{1}{n}\sin n\pi t
$$

(a square wave between 0 and 1 V with period 2 s). Find $v_o(t)$.

![[ele-302-fourier-rl.svg]]
*Figure 17.4: Circuit for Example 17.3. The output is taken across the inductor.*

<span class="answer-starts"></span>

**Predict.** At DC the inductor is a short, so $v_o = 0$. At high frequency it's an open, so $v_o \approx v_s$. This is a **high-pass** filter: it removes the $\frac{1}{2}$ V average and passes the higher harmonics.

**Response for harmonic $n$.** Here $\omega_0 = \pi$, so $\omega_n = n\pi$ and $j\omega_nL = j2n\pi$. Voltage divider:

$$
V_o = \frac{j2n\pi}{5 + j2n\pi}\,V_s
$$

**DC ($n = 0$).** $V_s = \frac{1}{2}$, and $j2n\pi = 0$, so $V_o = 0$, as predicted.

**Harmonic $n$ (odd).** The source term $\frac{2}{n\pi}\sin n\pi t$ has phasor $\frac{2}{n\pi}\angle -90^\circ$. Multiply:

$$
V_o = \frac{2n\pi\angle 90^\circ}{\sqrt{25 + 4n^2\pi^2}\,\angle\tan^{-1}\frac{2n\pi}{5}}\cdot\frac{2}{n\pi}\angle -90^\circ = \frac{4}{\sqrt{25 + 4n^2\pi^2}}\angle -\tan^{-1}\frac{2n\pi}{5}
$$

**Back to time and add.**

$$
v_o(t) = \sum_{n\ \text{odd}}\frac{4}{\sqrt{25 + 4n^2\pi^2}}\cos\left(n\pi t - \tan^{-1}\frac{2n\pi}{5}\right)\ \text{V}
$$

The first three terms ($n = 1, 3, 5$):

$$
v_o(t) = 0.4981\cos(\pi t - 51.49^\circ) + 0.2051\cos(3\pi t - 75.14^\circ) + 0.1257\cos(5\pi t - 80.96^\circ) + \cdots\ \text{V}
$$

As $n$ grows, $\frac{4}{\sqrt{25 + 4n^2\pi^2}} \to \frac{2}{n\pi}$ and the phase $\to -90^\circ$, so the high harmonics come through unchanged: the filter passes the sharp edges and blocks the average.

#### Example 17.4: Current through an inductor

In Figure 17.5, $R_1 = 4\ \Omega$, $L = 2$ H, the right-hand branch ($R_2$ and $R_3$ in series) totals $4\ \Omega$, and

$$
v(t) = 1 + \sum_{n=1}^{\infty}\frac{2(-1)^n}{1 + n^2}\left(\cos nt - n\sin nt\right)
$$

Find $i_o(t)$, the current through the inductor.

![[ele-302-fourier-ex2.svg]]
*Figure 17.5: Circuit for Example 17.4.*

<span class="answer-starts"></span>

**Response for harmonic $n$.** Here $\omega_0 = 1$, so $\omega_n = n$ and $Z_L = j2\omega_n$. The source sees $R_1$ in series with ($L$ parallel to the 4 Ω branch):

$$
Z = 4 + \frac{j2\omega_n \cdot 4}{4 + j2\omega_n} = \frac{8 + j8\omega_n}{2 + j\omega_n}, \qquad I = \frac{V}{Z} = \frac{2 + j\omega_n}{8 + j8\omega_n}V
$$

Current division between the inductor and the 4 Ω branch:

$$
I_o = \frac{4}{4 + j2\omega_n}I = \frac{4(2 + j\omega_n)}{2(2 + j\omega_n)(8 + j8\omega_n)}V = \frac{V}{4 + j4\omega_n} = \frac{V}{4\sqrt{1 + n^2}\,\angle\tan^{-1}n}
$$

**DC ($n = 0$).** $V = 1$ and the inductor is a short (it also shorts out the 4 Ω branch), so $I_o = \frac{1}{4}$ A.

**Harmonic $n$.** The source term is $\frac{2(-1)^n}{1 + n^2}(\cos nt - n\sin nt)$. Since $-\sin x = \cos(x + 90^\circ)$, the bracket has phasor $1 + jn = \sqrt{1 + n^2}\angle\tan^{-1}n$, so

$$
V = \frac{2(-1)^n}{1 + n^2}\sqrt{1 + n^2}\,\angle\tan^{-1}n = \frac{2(-1)^n}{\sqrt{1 + n^2}}\angle\tan^{-1}n
$$

$$
I_o = \frac{2(-1)^n}{\sqrt{1 + n^2}}\angle\tan^{-1}n \cdot \frac{1}{4\sqrt{1 + n^2}\,\angle\tan^{-1}n} = \frac{(-1)^n}{2(1 + n^2)}\angle 0^\circ
$$

The angles cancel exactly.

**Back to time and add.**

$$
i_o(t) = \frac{1}{4} + \sum_{n=1}^{\infty}\frac{(-1)^n}{2(1 + n^2)}\cos nt\ \text{A}
$$

> [!note] The notes don't give $R_2$ and $R_3$ separately. Only their sum matters, and the notes' impedance $4 + j\omega_n 2\,\|\,4$ uses 4 Ω.

### Average Power and RMS

Write the voltage and current of an element in amplitude-phase form:

$$
v(t) = V_{dc} + \sum_{n=1}^{\infty}V_n\cos(n\omega_0 t - \theta_n), \qquad i(t) = I_{dc} + \sum_{m=1}^{\infty}I_m\cos(m\omega_0 t - \phi_m)
$$

The average power is $P = \frac{1}{T}\int_0^T v\,i\,dt$. Multiplying out gives products of every voltage term with every current term. **Every product of two different harmonics averages to zero** (the same fact that made the coefficient formulas work). Only matching pairs survive:

$$
P = V_{dc}I_{dc} + \frac{1}{2}\sum_{n=1}^{\infty}V_nI_n\cos(\theta_n - \phi_n) \tag{17.5}
$$

**The total power is the DC power plus each harmonic's own power.** Harmonics never transfer power with each other.

The same reasoning applied to $v^2$ gives the rms value:

$$
V_{\text{rms}} = \sqrt{V_{dc}^2 + \frac{1}{2}\sum_{n=1}^{\infty}V_n^2} = \sqrt{a_0^2 + \frac{1}{2}\sum_{n=1}^{\infty}\left(a_n^2 + b_n^2\right)} \tag{17.6}
$$

> [!warning] Peak or rms?
> In (17.5) and (17.6), $V_n$ and $I_n$ are **peak** amplitudes; the $\frac{1}{2}$ turns each into rms squared. If you use rms values instead, drop the $\frac{1}{2}$: $P = V_{dc}I_{dc} + \sum V_{n,\text{rms}}I_{n,\text{rms}}\cos(\theta_n - \phi_n)$. The notes' boxed formula keeps the $\frac{1}{2}$ but labels $V_n$ and $I_n$ "RMS phasor values". With the $\frac{1}{2}$, they must be peak.

#### Example 17.5: Power from a square wave

In Figure 17.6, the source is a square wave of $+3$ V for $0 < t < \frac{1}{2}$ and $-1$ V for $\frac{1}{2} < t < 1$ (period $T = 1$ s), and $R = 10\ \Omega$. Find the Fourier series of $v_s(t)$, its rms value, $i(t)$, and the average power delivered to $R$.

![[ele-302-fourier-square-power.svg]]
*Figure 17.6: Square wave source for Example 17.5, driving a 10 Ω resistor.*

**DC term.**

$$
V_{dc} = \frac{1}{1}\left[\int_0^{1/2} 3\,dt + \int_{1/2}^{1}(-1)\,dt\right] = 1.5 - 0.5 = 1\ \text{V}
$$

**Symmetry.** Subtract the DC: $v_s - 1$ is $+2$ then $-2$, an odd square wave. So $a_n = 0$.

**Sine terms.** $\omega_0 = 2\pi$:

$$
b_n = \frac{4}{1}\int_0^{1/2} 2\sin 2\pi nt\,dt = 8\left[-\frac{\cos 2\pi nt}{2\pi n}\right]_0^{1/2} = \frac{4}{n\pi}\left(1 - (-1)^n\right) = \begin{cases}\dfrac{8}{n\pi} & n\ \text{odd}\\ 0 & n\ \text{even}\end{cases}
$$

**Series.**

$$
v_s(t) = 1 + \sum_{n\ \text{odd}}\frac{8}{n\pi}\sin 2\pi nt = 1 + \sum_{n\ \text{odd}}\frac{8}{n\pi}\cos\left(2\pi nt - 90^\circ\right)\ \text{V}
$$

**Current.** The load is a resistor, so every harmonic is just divided by 10:

$$
i(t) = \frac{v_s(t)}{10} = 0.1 + \sum_{n\ \text{odd}}\frac{0.8}{n\pi}\sin 2\pi nt\ \text{A}
$$

**RMS, keeping the first three harmonics** ($n = 1, 3, 5$), from (17.6):

$$
V_{\text{rms}} \approx \sqrt{1^2 + \frac{1}{2}\left(\frac{8}{\pi}\right)^2\left(1 + \frac{1}{9} + \frac{1}{25}\right)} = \sqrt{1 + 3.242 + 0.360 + 0.130} = 2.175\ \text{V}
$$

**Average power.**

$$
P = \frac{V_{\text{rms}}^2}{R} \approx \frac{2.175^2}{10} = 0.473\ \text{W}
$$

**Exact values, for comparison.** The rms of a square wave is easy to find directly: $v_s^2$ is 9 for half the period and 1 for the other half, so

$$
V_{\text{rms}} = \sqrt{\tfrac{1}{2}(9) + \tfrac{1}{2}(1)} = \sqrt{5} = 2.236\ \text{V}, \qquad P = \frac{5}{10} = 0.5\ \text{W}
$$

The three harmonics (plus DC) capture $\frac{0.473}{0.5} = 95\%$ of the power. Each extra harmonic adds a little more, and the infinite series gives exactly 0.5 W.

## Key formulas

**Fourier series**

$$
f(t) = a_0 + \sum_{n=1}^{\infty}\left(a_n\cos n\omega_0 t + b_n\sin n\omega_0 t\right), \qquad \omega_0 = \frac{2\pi}{T} \tag{17.1}
$$

**Coefficients**

$$
a_0 = \frac{1}{T}\int_0^T f\,dt, \qquad a_n = \frac{2}{T}\int_0^T f\cos n\omega_0 t\,dt, \qquad b_n = \frac{2}{T}\int_0^T f\sin n\omega_0 t\,dt \tag{17.2}
$$

**Amplitude-phase form**

$$
f(t) = a_0 + \sum_{n=1}^{\infty}A_n\cos(n\omega_0 t + \phi_n), \qquad A_n = \sqrt{a_n^2 + b_n^2}, \qquad \phi_n = -\tan^{-1}\frac{b_n}{a_n} \tag{17.3–17.4}
$$

- Place $\phi_n$ in the right quadrant: it's the angle of $a_n - jb_n$

**Symmetry**

| | Coefficients |
|---|---|
| Even, $f(-t) = f(t)$ | $b_n = 0$; $a_n = \frac{4}{T}\int_0^{T/2} f\cos n\omega_0 t\,dt$ |
| Odd, $f(-t) = -f(t)$ | $a_0 = a_n = 0$; $b_n = \frac{4}{T}\int_0^{T/2} f\sin n\omega_0 t\,dt$ |

**Useful values** (for integer $n$)

$$
\sin n\pi = 0, \qquad \cos n\pi = (-1)^n, \qquad \cos 2n\pi = 1
$$

**Average power and rms** ($V_n$, $I_n$ peak)

$$
P = V_{dc}I_{dc} + \frac{1}{2}\sum_{n=1}^{\infty}V_nI_n\cos(\theta_n - \phi_n), \qquad V_{\text{rms}} = \sqrt{V_{dc}^2 + \frac{1}{2}\sum_{n=1}^{\infty}V_n^2} \tag{17.5–17.6}
$$

## Solving the problems

| The question asks you to… | Type | Worked in |
|---|---|---|
| find the Fourier series of a waveform | Coefficients | Examples 17.1, 17.2, 17.5 |
| find a circuit's response to a periodic source | Circuit response | Examples 17.3, 17.4 |
| find the rms value or average power | Power and rms | Example 17.5 |

### Coefficients

1. Read $T$ off the graph and compute $\omega_0 = \frac{2\pi}{T}$.
2. Write $f(t)$ piece by piece over one convenient period.
3. **$a_0$ first**: the average value. Often you can see it from the graph (area over one period, divided by $T$).
4. **Check symmetry**, of $f$ itself or of $f - a_0$. Even: skip $b_n$. Odd: skip $a_n$. Use the half-period formulas.
5. Integrate. For $t\sin$ or $t\cos$ use parts. Simplify with $\sin n\pi = 0$ and $\cos n\pi = (-1)^n$.
6. Check which $n$ give zero (often every even $n$), and write the series.
7. If asked for amplitude-phase form: $A_n = \sqrt{a_n^2 + b_n^2}$ and $\phi_n$ = angle of $a_n - jb_n$.

### Circuit response

1. Get the source's Fourier series (given, or from the recipe above). Note $\omega_0$.
2. Redraw the circuit with $jn\omega_0L$ and $\frac{1}{jn\omega_0C}$, and find the output in terms of the input **for a general $n$**.
3. **Predict with DC and high frequency**: shorts and opens tell you the $n = 0$ answer and what happens as $n \to \infty$.
4. DC term: solve with $L$ shorted, $C$ open.
5. Harmonic $n$: convert the source term to a phasor ($\sin \to \angle -90^\circ$), multiply by the circuit's response at $n\omega_0$.
6. Convert each harmonic back to $\cos(n\omega_0 t + \text{angle})$ and add. List the first few terms numerically if asked.

### Power and rms

1. Put the voltage and current in amplitude-phase form, with **peak** amplitudes.
2. $P$: DC power plus $\frac{1}{2}V_nI_n\cos(\theta_n - \phi_n)$ for each harmonic present in **both** $v$ and $i$.
3. $V_{\text{rms}}$: square root of DC squared plus half the sum of the squared amplitudes.
4. For a resistor, $P = V_{\text{rms}}^2/R$. If the wave is simple, check against the time-domain rms.

## Common mistakes

- Forgetting the $\frac{2}{T}$ (or $\frac{4}{T}$ with symmetry) in $a_n$ and $b_n$, or using it in $a_0$, which is $\frac{1}{T}$
- Dropping the minus in $\phi_n = -\tan^{-1}(b_n/a_n)$, or putting $\phi_n$ in the wrong quadrant
- Using the same $Z_L$ or $Z_C$ for every harmonic. They depend on $n\omega_0$
- Adding phasors from different harmonics. Convert each to the time domain, then add
- Forgetting the DC term's response (shorted inductors, open capacitors)
- Writing $\sin n\omega_0 t$ as a phasor with angle $0^\circ$. It's $\angle -90^\circ$
- Mixing peak and rms in the power formula. With the $\frac{1}{2}$, amplitudes are peak
- Ignoring the scale of the wave. Doubling the wave doubles every coefficient
- Assuming a few harmonics give the exact rms. The truncated series always comes out a little low
