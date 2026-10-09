---
title: "Ch 3: Network Theorems"
tags:
  - smp101
---

## Overview

Shortcuts for circuits too big to solve comfortably with KCL and KVL alone: superposition, Thévenin/Norton equivalents, and maximum power transfer.

## Notes

### Superposition

In a linear circuit with several independent sources, solve with one source on at a time (voltage sources → short, current sources → open), then add the results. Works for voltages and currents, **not** for power.

### Thévenin and Norton equivalents

Any linear two-terminal network can be replaced by one source and one resistor. Full notes, method, and worked example: [[thevenin-equivalent|Thévenin Equivalent]].

### Maximum power transfer

A load draws the most power from a network when its resistance matches the network's Thévenin resistance:

$$
R_L = R_{th}
\qquad\Longrightarrow\qquad
P_{max} = \frac{V_{th}^2}{4R_{th}}
$$

> [!warning] Maximum power ≠ maximum efficiency
> At $R_L = R_{th}$, half the power is lost inside the source. That's what you want for signals, not for power delivery.

## Examples

Using the Thévenin example ($V_{th} = 9$ V, $R_{th} = 3\ \Omega$):

$$
R_L = 3\ \Omega
\qquad
P_{max} = \frac{9^2}{4 \cdot 3} = 6.75\text{ W}
$$

## Common mistakes

- Applying superposition to power directly.
- Forgetting that $R_{th}$ is found with independent sources **off** but dependent sources **on**.
