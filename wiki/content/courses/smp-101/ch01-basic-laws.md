---
title: "Ch 1: Basic Laws"
tags:
  - smp101
---

## Overview

The quantities every circuit is described with, and the three laws that relate them: Ohm's law, KCL, and KVL.

## Notes

### Quantities

| Quantity | Symbol | Unit | Meaning |
| --- | --- | --- | --- |
| Current | $I$ | ampere (A) | Rate of charge flow, $I = \dfrac{dq}{dt}$ |
| Voltage | $V$ | volt (V) | Energy per unit charge between two points |
| Resistance | $R$ | ohm ($\Omega$) | Opposition to current |
| Power | $P$ | watt (W) | Rate of energy transfer, $P = VI$ |

### Ohm's law

$$
V = IR
$$

Combining with $P = VI$ gives two more forms that come up constantly:

$$
P = I^2 R = \frac{V^2}{R}
$$

### Kirchhoff's laws

- **KCL (current law):** the currents entering a node sum to the currents leaving it. Charge doesn't pile up.
  $$\sum I_{in} = \sum I_{out}$$
- **KVL (voltage law):** the voltages around any closed loop sum to zero. Energy is conserved.
  $$\sum_{\text{loop}} V = 0$$

> [!tip] Passive sign convention
> Draw the current arrow so it enters the **+** terminal of each resistor. Then $P = VI$ is positive when the element absorbs power, and negative when it supplies it.

## Examples

A 9 V battery across a 3 kΩ resistor:

$$
I = \frac{V}{R} = \frac{9}{3000} = 3\text{ mA}
\qquad
P = VI = 9 \times 0.003 = 27\text{ mW}
$$

## Common mistakes

- Mixing kΩ and Ω (or mA and A) in the same equation. Convert first.
- Getting signs wrong in KVL by switching direction partway around the loop. Pick a direction and stick to it.
