---
title: Thévenin Equivalent
aliases:
  - Thevenin
  - Norton equivalent
tags:
  - concept
  - smp101
---

> [!note] Sample page
> An example of a finished concept note. Edit it or delete it.

**Any linear two-terminal network can be replaced by a single voltage source $V_{th}$ in series with a single resistance $R_{th}$**, and the load can't tell the difference.

## Intuition

From the load's point of view, the rest of the circuit is a black box. All the load ever "sees" is how terminal voltage changes with the current it draws. For a linear network that relationship is a straight line, and a straight line needs only two numbers: the intercept ($V_{th}$) and the slope ($R_{th}$).

## How to find it

1. Remove the load.
2. $V_{th}$ = the **open-circuit voltage** across the terminals.
3. $R_{th}$ = the resistance seen looking into the terminals with independent sources **turned off** (voltage sources → short, current sources → open).
   - With dependent sources, keep them on and use $R_{th} = V_{oc} / I_{sc}$, or apply a test source.

The **Norton equivalent** is the same thing as a current source: $I_N = V_{th}/R_{th}$ in parallel with $R_N = R_{th}$.

## Worked example

A 12 V source in series with $R_1 = 4\,\Omega$, and $R_2 = 12\,\Omega$ across the output terminals. Find the current in a $6\,\Omega$ load.

$$
V_{th} = 12 \cdot \frac{12}{4 + 12} = 9\text{ V}
\qquad
R_{th} = 4 \parallel 12 = \frac{4 \cdot 12}{4 + 12} = 3\,\Omega
$$

$$
I_{load} = \frac{V_{th}}{R_{th} + R_{load}} = \frac{9}{3 + 6} = 1\text{ A}
$$

## Common mistakes

- Turning off **dependent** sources when finding $R_{th}$. Only independent ones get turned off.
- Finding $V_{th}$ with the load still connected.

## Related

- Superposition: see [[ch03-network-theorems|SMP 101 · Ch 3]]
- Laplace transform (Thévenin works in the s-domain with impedances)

## Seen in

- [[ch03-network-theorems|SMP 101 · Ch 3: Network Theorems]]
