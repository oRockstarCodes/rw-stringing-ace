---
title: "Ch 4: The Laplace Transform"
tags:
  - mth425
---
## Overview

The Laplace transform, the table of common transforms, the inverse, solving differential equations and systems with it, and the translation theorems with the unit step function.

## Notes

### Definition

The Laplace transform is a type of integral. $f(t)$ must converge, so that limit has to exist.

$$
\mathcal{L}\{f(t)\} = \int_0^{\infty} e^{-st} f(t)\,dt = F(s)
$$

Applying this integral to a bunch of functions gives the Laplace table:

| $f(t)$ | $F(s)$ |
| :---: | :---: |
| $t^{n}$ | $\dfrac{n!}{s^{n+1}}$ |
| $e^{at}$ | $\dfrac{1}{s-a}$ |
| $e^{at}f(t)$ | $F(s-a)$ |
| $\sin(kt)$ | $\dfrac{k}{s^{2}+k^{2}}$ |
| $\cos(kt)$ | $\dfrac{s}{s^{2}+k^{2}}$ |
| $\sinh(kt)$ | $\dfrac{k}{s^{2}-k^{2}}$ |
| $\cosh(kt)$ | $\dfrac{s}{s^{2}-k^{2}}$ |

### Inverse Laplace

Exactly what it sounds like: take $F(s)$ and get $f(t)$ back by recognizing which transformation was done.

$$
f(t) = \mathcal{L}^{-1}\{F(s)\}
$$

### Solving differential equations

Write $\mathcal{L}\{y\} = Y$ and $\mathcal{L}\{x\} = X$. Transforming a derivative pulls in the initial conditions:

$$
\mathcal{L}\{y^{(n)}\} = s^{n}Y - s^{n-1}y(0) - s^{n-2}y'(0) - \cdots - y^{(n-1)}(0)
$$

$$
\mathcal{L}\{x^{(n)}\} = s^{n}X - s^{n-1}x(0) - s^{n-2}x'(0) - \cdots - x^{(n-1)}(0)
$$

| | |
| --- | --- |
| Form | $a_1 y^{(n)} + a_2 y^{(n-1)} + \cdots + a_n y = g(t)$, given initial conditions $y(0), y'(0), \dots, y^{(n-1)}(0)$ |
| Solution | First take the Laplace transform of both sides, using the derivative formula above and $\mathcal{L}\{g(t)\} = G(s)$. Then isolate $Y$ to get $Y = H(s)$. Then take the inverse Laplace transform for the solution: $y = \mathcal{L}^{-1}\{Y\} = h(t)$ |

### Systems of equations

A system has both $y'$ and $x'$ and so on.

| | |
| --- | --- |
| Form | $a_1 y^{(n)} + \cdots + a_n y = g(t)$ with initial conditions for $y$, and $b_1 x^{(n)} + \cdots + b_n x = f(t)$ with initial conditions for $x$ |
| Solution | First take the Laplace transform of both equations and write them as $c_1(s)X + c_2(s)Y = H(s)$ and $d_1(s)X + d_2(s)Y = I(s)$. Then use Cramer's rule to solve for $X$ or $Y$. Find the determinant $A$, then replace the first column (the $X$ column) with the right-hand sides for $A_X$, or the second column (the $Y$ column) for $A_Y$. Finally take the inverse Laplace transform to find $x$ or $y$. |

$$
A = \begin{vmatrix} c_1(s) & c_2(s) \\ d_1(s) & d_2(s) \end{vmatrix}
\quad
A_X = \begin{vmatrix} H(s) & c_2(s) \\ I(s) & d_2(s) \end{vmatrix}
\quad
A_Y = \begin{vmatrix} c_1(s) & H(s) \\ d_1(s) & I(s) \end{vmatrix}
$$

$$
X = \frac{A_X}{A} \qquad Y = \frac{A_Y}{A}
$$

### Translations

These work like translations of functions. The $s$-axis translation:

$$
\mathcal{L}\{e^{at}f(t)\} = F(s-a)
$$

The **unit step function** works like an on/off switch. When whatever is in the brackets is negative the function equals 0, and when it is positive the function equals 1:

$$
U(t-a) = \begin{cases} 0 & 0 \le t < a \\ 1 & t \ge a \end{cases}
$$

It is used to solve piecewise functions, by making parts of the function turn off and on across intervals.

The $t$-axis translation uses the unit step function:

$$
\mathcal{L}\{f(t-a)\,U(t-a)\} = e^{-as}F(s)
$$

$$
\mathcal{L}\{f(t)\,U(t-a)\} = e^{-as}\,\mathcal{L}\{f(t+a)\}
$$

## Key formulas

$$
\mathcal{L}\{f(t)\} = \int_0^{\infty} e^{-st} f(t)\,dt = F(s)
$$

$$
\mathcal{L}\{y^{(n)}\} = s^{n}Y - s^{n-1}y(0) - \cdots - y^{(n-1)}(0)
$$

$$
\mathcal{L}\{e^{at}f(t)\} = F(s-a) \qquad \mathcal{L}\{f(t-a)\,U(t-a)\} = e^{-as}F(s)
$$

## Examples

Your own examples, not from assignments.

## Common mistakes

- Dropping the initial conditions when transforming a derivative.
- Mixing up the denominators: $\sin$ and $\cos$ use $s^{2}+k^{2}$, while $\sinh$ and $\cosh$ use $s^{2}-k^{2}$.
- Forgetting that the second $t$-axis formula needs $f(t+a)$, not $f(t)$, inside the transform.
