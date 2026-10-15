---
title: Second-Order Differential Equations
aliases:
  - Characteristic equation
  - Natural response
  - Forced response
  - Homogeneous equation
tags:
  - concept
  - ele302
---

**A second-order circuit obeys $\frac{d^2x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2 x = f$. Its solution is a natural part, found from the roots of $s^2 + 2\alpha s + \omega_0^2 = 0$, plus a forced part, the value it settles to.**

[[ch08-second-order-circuits|Ch 8]] uses this in Steps 2 and 4 without stopping to explain the maths. This page covers why the method works: where the characteristic equation comes from, why there are three cases, how complex roots turn into a decaying cosine, and how to find the constants (including the phase-angle quadrant trap).

## Intuition

### What the equation says

In standard form,

$$
\frac{d^2 x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2\,x = f
$$

- $x$ is the voltage or current you're solving for.
- $\omega_0^2\,x$ is the "restoring" term: the further $x$ is from 0, the harder it's pulled back, like a spring. On its own (with $\alpha = 0$) it makes $x$ oscillate at $\omega_0$ (see [[lc-oscillation|LC Oscillation]]).
- $2\alpha\frac{dx}{dt}$ is the "damping" term: it resists change, like friction, and comes from the resistance.
- $f$ is the **forcing**: whatever the sources are pushing. It's 0 if there's no source after switching, and a constant for a DC source.

In a real circuit $\alpha$ and $\omega_0^2$ are always positive, which is why every response eventually dies out or settles.

### Natural + forced

The equation is **linear**: $x$ and its derivatives only appear on their own, never squared or multiplied together. That means solutions can be added. So split the answer into two parts:

- The **natural solution** $x_N$ solves the equation with $f = 0$ (the **homogeneous** equation). It's how the circuit behaves on its own, and it contains the two unknown constants.
- The **forced solution** $x_F$ is any one solution of the full equation. For a constant $f$, the simplest one is a constant: where the circuit settles.

Adding them, $x_N + x_F$ still satisfies the full equation (the $x_N$ part contributes 0 to the left side, and the $x_F$ part contributes $f$). The two constants in $x_N$ are then chosen to match the two initial conditions.

### Why try $e^{st}$

We need a function whose second derivative, first derivative and value can add up to zero for all time. The exponential is the natural guess, because differentiating it just multiplies it by a constant:

$$
x = Ae^{st} \quad\Rightarrow\quad \frac{dx}{dt} = sAe^{st}, \qquad \frac{d^2 x}{dt^2} = s^2 Ae^{st}
$$

Substituting into the homogeneous equation, every term has $Ae^{st}$ in common:

$$
(s^2 + 2\alpha s + \omega_0^2)\,Ae^{st} = 0
$$

$Ae^{st}$ is never zero (unless $A = 0$, which would mean no response at all), so the bracket must be zero. That's the **characteristic equation**:

$$
s^2 + 2\alpha s + \omega_0^2 = 0
$$

It turns a calculus problem into a quadratic. Its roots, from the quadratic formula, are

$$
s_{1,2} = \frac{-2\alpha \pm \sqrt{4\alpha^2 - 4\omega_0^2}}{2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2}
$$

The sign of what's under the square root (the **discriminant**) gives the three cases.

![[ele-302-concept-root-locations.svg]]
*Figure 1: Where the roots sit in the complex plane ($\sigma$ is the real part, $j\omega$ the imaginary part) for each case. Roots further left decay faster; roots further from the horizontal axis oscillate faster.*

### Case 1: two real roots (overdamped, $\alpha > \omega_0$)

The square root is real, so $s_1$ and $s_2$ are two different real numbers. Both are negative (since $\sqrt{\alpha^2 - \omega_0^2} < \alpha$), so both exponentials decay. Each root gives a solution, and because the equation is linear their sum is also a solution:

$$
x_N = A_1 e^{s_1 t} + A_2 e^{s_2 t}
$$

The root closer to zero decays more slowly, so it's the one that dominates later on.

### Case 2: one repeated root (critically damped, $\alpha = \omega_0$)

The square root is zero, so both roots equal $-\alpha$. Writing $A_1 e^{-\alpha t} + A_2 e^{-\alpha t}$ doesn't work: that's just $(A_1 + A_2)e^{-\alpha t}$, a single constant, and you need two to match two initial conditions. The second solution turns out to be $te^{-\alpha t}$:

$$
x_N = A_1 e^{-\alpha t} + A_2\,t\,e^{-\alpha t}
$$

You can check that $te^{-\alpha t}$ works. Its derivatives are $(1 - \alpha t)e^{-\alpha t}$ and $(\alpha^2 t - 2\alpha)e^{-\alpha t}$. Substituting with $\omega_0^2 = \alpha^2$:

$$
(\alpha^2 t - 2\alpha) + 2\alpha(1 - \alpha t) + \alpha^2 t = 0 \quad ✓
$$

### Case 3: complex roots (underdamped, $\alpha < \omega_0$)

The square root is of a negative number, so the roots are complex:

$$
s = -\alpha \pm j\omega_d, \qquad \omega_d = \sqrt{\omega_0^2 - \alpha^2}
$$

What does $e^{st}$ mean when $s$ is complex? Split it up and use **Euler's formula**, $e^{j\theta} = \cos\theta + j\sin\theta$:

$$
e^{(-\alpha + j\omega_d)t} = e^{-\alpha t}\,e^{j\omega_d t} = e^{-\alpha t}\left(\cos\omega_d t + j\sin\omega_d t\right)
$$

So the real part of $s$ ($-\alpha$) gives a **decaying envelope**, and the imaginary part ($\omega_d$) gives an **oscillation**. A real voltage or current can't be complex. Combining the two roots (they're a conjugate pair) cancels the imaginary parts and leaves a real decaying sinusoid, which can be written two equivalent ways:

$$
x_N = A\,e^{-\alpha t}\cos(\omega_d t + \theta) = e^{-\alpha t}\left(B_1\cos\omega_d t + B_2\sin\omega_d t\right)
$$

The first form (amplitude $A$ and phase $\theta$) is the one used in Ch 8. The second is the textbook's. Expanding $\cos(\omega_d t + \theta) = \cos\omega_d t\cos\theta - \sin\omega_d t\sin\theta$ shows how they're related:

$$
B_1 = A\cos\theta, \qquad B_2 = -A\sin\theta, \qquad A = \sqrt{B_1^2 + B_2^2}
$$

Note that the oscillation is at $\omega_d$, slightly **slower** than $\omega_0$. Damping slows the swing down as well as shrinking it.

### The forced solution

For a constant forcing $f$ (any DC source), try a constant $x_F$. Its derivatives are 0, so the equation becomes

$$
\omega_0^2\,x_F = f \quad\Rightarrow\quad x_F = \frac{f}{\omega_0^2}
$$

This is the same value you'd get from DC analysis of the circuit as $t \to \infty$ (L shorted, C open), which is usually the easier way to find it. Getting it both ways is a good check.

### Finding the constants

The total solution is $x = x_N + x_F$. You need two equations for the two constants, and they come from $x(0)$ and $\frac{dx}{dt}(0)$. Differentiate each form and set $t = 0$ (where $e^0 = 1$):

|Case|$x(0)$|$\frac{dx}{dt}(0)$|
|---|---|---|
|Overdamped|$A_1 + A_2 + x_F$|$s_1 A_1 + s_2 A_2$|
|Critically damped|$A_1 + x_F$|$-\alpha A_1 + A_2$|
|Underdamped|$A\cos\theta + x_F$|$-\alpha A\cos\theta - \omega_d A\sin\theta$|

For the underdamped row, the derivative comes from the product rule:

$$
\frac{d}{dt}\left[Ae^{-\alpha t}\cos(\omega_d t + \theta)\right] = Ae^{-\alpha t}\left[-\alpha\cos(\omega_d t + \theta) - \omega_d\sin(\omega_d t + \theta)\right]
$$

### Getting $\theta$ in the right quadrant

In the underdamped case you end up knowing $A\cos\theta$ and $A\sin\theta$ (call them $X$ and $Y$). Then $A = \sqrt{X^2 + Y^2}$, and $\theta$ is the angle of the point $(X, Y)$ measured from the positive horizontal axis, in **radians**.

The trap: a calculator's $\tan^{-1}\!\left(\frac{Y}{X}\right)$ only returns angles between $-\frac{\pi}{2}$ and $\frac{\pi}{2}$, because $\frac{Y}{X}$ can't tell $(+,+)$ from $(-,-)$, or $(+,-)$ from $(-,+)$. Fix it using the signs:

|Sign of $X = A\cos\theta$|Sign of $Y = A\sin\theta$|Quadrant|$\theta$|
|---|---|---|---|
|$+$|$+$|1st|$\tan^{-1}\frac{Y}{X}$|
|$+$|$-$|4th|$\tan^{-1}\frac{Y}{X}$|
|$-$|$+$|2nd|$\tan^{-1}\frac{Y}{X} + \pi$|
|$-$|$-$|3rd|$\tan^{-1}\frac{Y}{X} - \pi$|
|$0$|$+$ or $-$|on the vertical axis|$+\frac{\pi}{2}$ or $-\frac{\pi}{2}$|

(Adding or subtracting $2\pi$ gives the same angle, so $+\pi$ and $-\pi$ both work in the 2nd and 3rd quadrants; the table just keeps $\theta$ between $-\pi$ and $\pi$.) Always finish by checking that $A\cos\theta$ and $A\sin\theta$ come back with the right signs.

## Key formulas

**Standard form and characteristic equation**

$$
\frac{d^2 x}{dt^2} + 2\alpha\frac{dx}{dt} + \omega_0^2\,x = f, \qquad s^2 + 2\alpha s + \omega_0^2 = 0, \qquad s_{1,2} = -\alpha \pm \sqrt{\alpha^2 - \omega_0^2}
$$

**Natural solution**

$$
x_N = \begin{cases} A_1 e^{s_1 t} + A_2 e^{s_2 t} & \alpha > \omega_0 \\ (A_1 + A_2 t)\,e^{-\alpha t} & \alpha = \omega_0 \\ A\,e^{-\alpha t}\cos(\omega_d t + \theta) & \alpha < \omega_0 \end{cases} \qquad \omega_d = \sqrt{\omega_0^2 - \alpha^2}
$$

**Forced and total solution** (constant forcing)

$$
x_F = \frac{f}{\omega_0^2}, \qquad x = x_N + x_F
$$

**Converting between the underdamped forms**

$$
B_1 = A\cos\theta, \qquad B_2 = -A\sin\theta, \qquad A = \sqrt{B_1^2 + B_2^2}
$$

- $x$: the voltage or current being solved for; $f$: the forcing (right-hand side)
- $\alpha$: neper frequency (Np/s); $\omega_0$: resonant frequency (rad/s); $\omega_d$: damped frequency (rad/s)
- $s_1, s_2$: roots of the characteristic equation
- $A_1, A_2, A, \theta, B_1, B_2$: constants set by the initial conditions; $\theta$ in radians

## Worked examples

### Example 1: Overdamped with a constant forcing

Solve $\frac{d^2x}{dt^2} + 7\frac{dx}{dt} + 10x = 20$ with $x(0) = 0$ and $\frac{dx}{dt}(0) = 0$.

1. **Roots:** $s^2 + 7s + 10 = 0$ factors as $(s + 2)(s + 5) = 0$, so $s = -2, -5$. Two real roots: overdamped.
2. **Forced:** $x_F = \frac{20}{10} = 2$.
3. **Total:** $x = 2 + A_1 e^{-2t} + A_2 e^{-5t}$.
4. **Constants** (from the table):
   $$x(0) = 2 + A_1 + A_2 = 0, \qquad \frac{dx}{dt}(0) = -2A_1 - 5A_2 = 0$$
   The second gives $A_1 = -2.5A_2$. Substituting: $-1.5A_2 = -2$, so $A_2 = \frac{4}{3}$ and $A_1 = -\frac{10}{3}$.
   $$x(t) = 2 - \tfrac{10}{3}e^{-2t} + \tfrac{4}{3}e^{-5t}$$

### Example 2: Critically damped

Solve $\frac{d^2x}{dt^2} + 4\frac{dx}{dt} + 4x = 0$ with $x(0) = 3$ and $\frac{dx}{dt}(0) = 0$.

1. **Roots:** $s^2 + 4s + 4 = (s + 2)^2 = 0$, so $s = -2$ twice. Critically damped, $\alpha = 2$.
2. **Forced:** $f = 0$, so $x_F = 0$, and $x = (A_1 + A_2 t)e^{-2t}$.
3. **Constants:** $x(0) = A_1 = 3$. $\frac{dx}{dt}(0) = -2A_1 + A_2 = 0$, so $A_2 = 6$.
   $$x(t) = (3 + 6t)\,e^{-2t}$$

### Example 3: Underdamped, with a third-quadrant angle

Solve $\frac{d^2x}{dt^2} + 2\frac{dx}{dt} + 5x = 0$ with $x(0) = -1$ and $\frac{dx}{dt}(0) = 5$.

1. **Roots:** $s = -1 \pm \sqrt{1 - 5} = -1 \pm j2$. Underdamped, $\alpha = 1$, $\omega_d = 2$.
2. **Forced:** $x_F = 0$, so $x = Ae^{-t}\cos(2t + \theta)$.
3. **Constants:**
   - $A\cos\theta = x(0) - x_F = -1$
   - $-\alpha A\cos\theta - \omega_d A\sin\theta = 5$: $\quad -1(-1) - 2A\sin\theta = 5$, so $A\sin\theta = -2$
4. **Amplitude:** $A = \sqrt{(-1)^2 + (-2)^2} = \sqrt{5} = 2.236$
5. **Angle.** Both $X = -1$ and $Y = -2$ are negative: third quadrant. The calculator gives $\tan^{-1}\!\left(\frac{-2}{-1}\right) = \tan^{-1}(2) = 1.107$, which is in the **first** quadrant (both positive), so it's wrong. Subtract $\pi$:
   $$\theta = 1.107 - \pi = -2.034\ \text{rad}$$
   Check: $\sqrt{5}\cos(-2.034) = -1$ ✓ and $\sqrt{5}\sin(-2.034) = -2$ ✓.
   $$x(t) = 2.236\,e^{-t}\cos(2t - 2.034)$$
6. **In the textbook's form:** $B_1 = A\cos\theta = -1$ and $B_2 = -A\sin\theta = 2$, so $x(t) = e^{-t}(-\cos 2t + 2\sin 2t)$. Same function.

## Common mistakes

- Applying the initial conditions to $x_N$ alone and forgetting $x_F$
- Writing $A_1 e^{-\alpha t} + A_2 e^{-\alpha t}$ for a repeated root. The second term needs a $t$
- Using $\omega_0$ instead of $\omega_d$ inside the cosine
- Differentiating $Ae^{-\alpha t}\cos(\omega_d t + \theta)$ without the product rule, and losing the $-\alpha$ term
- Trusting $\tan^{-1}$ when $A\cos\theta$ is negative
- Leaving $\theta$ in degrees while $\omega_d t$ is in radians

## Related

- [[lc-oscillation|LC Oscillation]]: the $\alpha = 0$ case, where the roots are $\pm j\omega_0$
- [[damping-series-vs-parallel|Damping in Series and Parallel RLC]]: what sets $\alpha$ in a circuit
- [[capacitors-and-inductors|Capacitors and Inductors]]: where the initial conditions come from

## Seen in

- [[ch08-second-order-circuits|Ch 8: Second-Order Circuits]]
