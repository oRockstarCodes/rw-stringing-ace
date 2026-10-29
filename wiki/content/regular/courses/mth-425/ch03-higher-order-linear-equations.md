---
title: "Ch 3: Linear Differential Equations"
tags:
  - mth425
---
## Overview

Nth-order linear equations: when solutions are unique, how to tell solutions apart (the Wronskian), and the methods for homogeneous, nonhomogeneous and Cauchy-Euler equations.

## Notes

### Nth-order equations

An nth-order differential equation takes the form below and has a unique solution if the coefficients exist and are continuous on the same interval.

$$
a_n(x)\frac{d^{n}y}{dx^{n}} + a_{n-1}(x)\frac{d^{n-1}y}{dx^{n-1}} + \cdots + a_0(x)\,y = g(x)
$$

It is homogeneous if $g(x) = 0$. Then $y = 0$ is the trivial solution for any homogeneous differential equation.

**Superposition.** The sum of two or more solutions of a homogeneous differential equation is also a solution.

**Wronskian.** Any set of $n$ solutions $y_1, y_2, \dots, y_n$ of a homogeneous differential equation on the same interval is linearly independent if the Wronskian does not equal zero. That set is also a fundamental set of solutions.

$$
W(y_1, y_2, \dots, y_n) =
\begin{vmatrix}
y_1 & y_2 & \cdots & y_n \\
y_1' & y_2' & \cdots & y_n' \\
\vdots & \vdots & & \vdots \\
y_1^{(n-1)} & y_2^{(n-1)} & \cdots & y_n^{(n-1)}
\end{vmatrix} \ne 0
$$

A set of $n$ solutions is linearly independent if they are not multiples of each other. It is linearly dependent if there are constants, not all zero, with

$$
c_1 y_1 + c_2 y_2 + \cdots + c_n y_n = 0
$$

They are also dependent when they are multiples.

Boundary value problems may have several solutions, one unique solution, or none.

**Differential operator.** $D^{n} = \dfrac{d^{n}}{dx^{n}}$, and the nth-order differential operator is

$$
L = a_n(x)D^{n} + a_{n-1}(x)D^{n-1} + \cdots + a_0(x)
$$

### Nth-order homogeneous

These are solved by converting them into polynomials, solving them, and using a general solution formula.

| | |
| --- | --- |
| Form | $a_1 y^{(n)} + a_2 y^{(n-1)} + \cdots + a_n y = 0$ |
| Solution | First convert into $a_1 m^{n} + a_2 m^{n-1} + \cdots + a_n = 0$. Then solve for $m$, as you would solve for $x$ in a polynomial $P(x)$. The general solution is $y = c_1 e^{m_1 x} + c_2 e^{m_2 x} + \cdots + c_n e^{m_n x}$ |
| Repeated root | If $m_1 = m_2$, then $y$ would have repeated terms with different coefficients, which is wrong. The term with the second instance of the root gets an $x$: $y = c_1 e^{m_1 x} + c_2 x e^{m_1 x}$. A third time adds $x^{2}$, and so on: $y = c_1 e^{m_1 x} + c_2 x e^{m_1 x} + c_3 x^{2} e^{m_1 x}$ |
| Complex root | If $m = \alpha \pm \beta i$, the solution becomes $y = e^{\alpha x}\left(c_1 \cos\beta x + c_2 \sin\beta x\right)$ |

### Nth-order nonhomogeneous

Similar, but with an extra term $k(x)$. You find the general solution as before, then find the additional piece that comes from $k(x)$.

| | |
| --- | --- |
| Form | $a_1 y^{(n)} + a_2 y^{(n-1)} + \cdots + a_n y = k(x)$ |
| Solution | First find the complementary solution $y_c$, which is the general solution when $k(x) = 0$. Next find the particular solution $y_p$, the extra piece due to $k(x) \ne 0$, using the guesses below. Determine $y_p$, then $y_p'$, $y_p''$, up to $y_p^{(n)}$. Plug them back into the original expression and solve for the constants. Finally, $y = y_p + y_c$. |

Guess for the particular solution:

| $k(x)$ | $y_p$ |
| --- | --- |
| $a$ | $A$ |
| $a_1 x^{n} + a_2 x^{n-1} + \cdots$ | $A x^{n} + B x^{n-1} + \cdots$ |
| $a\sin(\beta x)$ | $A\cos(\beta x) + B\sin(\beta x)$ |
| $a\cos(\beta x)$ | $A\cos(\beta x) + B\sin(\beta x)$ |
| $a e^{ax}$ | $A e^{ax}$ |
| $k_1(x)\cdot k_2(x)$ | $y_{p1}\cdot y_{p2}$ |

### Variation of parameters

For a whatever-order equation, use determinants (Wronskians) to build the particular solution.

| | |
| --- | --- |
| Form | $a y'' + b y' + c y = g(x)$ |
| Solution | First rearrange: $y'' + \dfrac{b}{a}y' + \dfrac{c}{a}y = \dfrac{g(x)}{a}$. Convert into $P(m)$ and find the complementary solution $y_c = c_1 y_1 + c_2 y_2$ as if $g(x) = 0$. To get the particular solution $y_p$, calculate the Wronskians below. |

$$
W = \begin{vmatrix} y_1 & y_2 \\ y_1' & y_2' \end{vmatrix}
\qquad
W_1 = \begin{vmatrix} 0 & y_2 \\ \frac{g(x)}{a} & y_2' \end{vmatrix}
\qquad
W_2 = \begin{vmatrix} y_1 & 0 \\ y_1' & \frac{g(x)}{a} \end{vmatrix}
$$

$$
V_1 = \int \frac{W_1}{W}\,dx \qquad V_2 = \int \frac{W_2}{W}\,dx
$$

$$
y_p = V_1 y_1 + V_2 y_2 \qquad y = y_c + y_p
$$

For a higher-order equation, find bigger determinants and add a $V_n y_n$ to the particular solution.

### Cauchy-Euler

| | |
| --- | --- |
| Form | $a_1 x^{n} y^{(n)} + a_2 x^{n-1} y^{(n-1)} + \cdots + a_n y = g(x)$ |
| Solution | First let $y = x^{m}$. Calculate the derivatives up to $y^{(n)}$. The complementary solution is $y_c = c_1 x^{m_1} + c_2 x^{m_2} + \cdots + c_n x^{m_n}$ |
| Repeated root | The second instance of the root gets a $\ln x$: $y_c = c_1 x^{m_1} + c_2 (\ln x)\, x^{m_1}$. A third time adds $(\ln x)^{2}$, and so on: $y_c = c_1 x^{m_1} + c_2 (\ln x)\, x^{m_1} + c_3 (\ln x)^{2} x^{m_1}$ |
| Complex root | If $m = \alpha \pm \beta i$, then $y_c = x^{\alpha}\left(c_1 \cos(\beta \ln x) + c_2 \sin(\beta \ln x)\right)$ |
| $g(x) \ne 0$ | Rewrite in the form $y'' + \dfrac{b x y'}{a x^{2}} + \dfrac{c y}{a x^{2}} = \dfrac{g(x)}{a x^{2}}$. Convert to $P(m)$, calculate $y_c$, then calculate the Wronskians and solve like variation of parameters. |

## Key formulas

$$
W(y_1, \dots, y_n) \ne 0 \quad \text{(linearly independent)}
$$

$$
y = c_1 e^{m_1 x} + \cdots + c_n e^{m_n x} \qquad y = e^{\alpha x}\left(c_1 \cos\beta x + c_2 \sin\beta x\right)
$$

$$
y = y_c + y_p \qquad y_p = V_1 y_1 + V_2 y_2
$$

## Examples

Your own examples, not from assignments.

## Common mistakes

- Forgetting the extra $x$ (or $\ln x$ for Cauchy-Euler) on repeated roots.
- Leaving the leading coefficient $a$ in place before running variation of parameters. Divide through so $y''$ has coefficient 1.
