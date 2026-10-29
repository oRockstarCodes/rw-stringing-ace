---
title: "Ch 2: Methods for Solving Differential Equations"
tags:
  - mth425
---
## Overview

The first-order toolbox: separable, linear, exact, homogeneous and Bernoulli equations, plus the substitutions that turn awkward equations into one of these.

## Notes

### Separable

Separable differential equations are just integrals.

| | |
| --- | --- |
| Form | $\dfrac{dy}{dx} = \dfrac{g(x)}{h(y)}$ |
| Solution | First rearrange: $h(y)\,dy = g(x)\,dx$. Then integrate both sides: $\displaystyle\int h(y)\,dy = \int g(x)\,dx$ |

Rearranging for $y$ gives the explicit solution. If you leave it as is, that is the implicit solution.

You can also use a substitution to get a separable equation.

| | |
| --- | --- |
| Form | $\dfrac{dy}{dx} = f(Ax + By + C)$ |
| Solution | First let $u = Ax + By + C$. Then do some algebra so it becomes separable. |

### Linear

| | |
| --- | --- |
| Form | $\dfrac{dy}{dx} + p(x)\,y = g(x)$ |
| Solution | First determine the integrating factor $\mu(x) = e^{\int p(x)\,dx}$. Then solve $y = \dfrac{1}{\mu}\left(\displaystyle\int \mu\, g(x)\,dx + C\right)$ |

### Exact

| | |
| --- | --- |
| Form | $M(x,y)\,dx + N(x,y)\,dy = 0$ |
| Condition | Exact only if $\dfrac{\partial M}{\partial y} = \dfrac{\partial N}{\partial x}$ |
| Solution | First determine $\dfrac{\partial f}{\partial x} = M$ **or** $\dfrac{\partial f}{\partial y} = N$. Then write $f(x,y) = h(x,y) + g(y)$ **or** $f(x,y) = h(x,y) + g(x)$. Next, integrate $f = \int M\,\partial x = \int N\,\partial y$ to find $g(x)$ or $g(y)$. Finally, $f(x,y) = c$. |

If you have an initial condition $y(x) = k$, then that value $c$ ain't just $c$.

When integrating with $\partial x$ or $dx$, treat $y$ as a constant. When integrating with $\partial y$ or $dy$, treat $x$ as a constant.

### Homogeneous

A function is homogeneous of degree $n$ if you can factor something out of it:

$$
f(tx, ty) = t^{n} f(x, y)
$$

$f(x,y)$ is homogeneous of degree $n$ if all terms in $f(x,y)$ are of the same degree. A term like $xy^{3}$ has degree 4, and a term like $xy$ has degree 2.

A homogeneous differential equation has that same degree condition.

| | |
| --- | --- |
| Form | $M(x,y)\,dx + N(x,y)\,dy = 0$ |
| Condition | Homogeneous only if $M(tx, ty) = t^{n} M(x,y)$ **and** $N(tx, ty) = t^{n} N(x,y)$ |
| Solution | First let $y = ux$, so that $\dfrac{dy}{dx} = u + x\dfrac{du}{dx}$. Then $f(x,y) = \dfrac{dy}{dx} = -\dfrac{M(x,y)}{N(x,y)}$. Finally rearrange to separate $u$ and $x$ and integrate. |

### Bernoulli

Bernoulli equations are basically linear equations, and we do some funny magic to turn them into linear equations.

| | |
| --- | --- |
| Form | $\dfrac{dy}{dx} + p(x)\,y = f(x)\,y^{n}$. If $n = 0$ or $1$, that's just linear. |
| Solution | First let $w = y^{1-n}$, so that $\dfrac{dw}{dx} = (1-n)\,y^{-n}\dfrac{dy}{dx}$, so that $\dfrac{dy}{dx} = \dfrac{y^{n}}{1-n}\dfrac{dw}{dx}$. Then substitute $w$ and get $\dfrac{dw}{dx} + p(x)\,w = g(x)$. Then solve it like a linear differential equation. |

## Key formulas

$$
\mu(x) = e^{\int p(x)\,dx} \qquad y = \frac{1}{\mu}\left(\int \mu\, g(x)\,dx + C\right)
$$

$$
\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x} \quad \text{(exact)}
$$

$$
y = ux \quad \text{(homogeneous)} \qquad w = y^{1-n} \quad \text{(Bernoulli)}
$$

## Examples

Your own examples, not from assignments.

## Common mistakes

- Forgetting that for an exact equation with an initial condition, the constant $c$ has to be solved for, not left as $c$.
- Integrating $\partial x$ terms without treating $y$ as a constant (and the other way round for $\partial y$).
