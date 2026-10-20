---
title: Propagation Delay
aliases:
  - Gate Delay
  - Fan-out
tags:
  - concept
  - coe328
---

**Propagation delay is the time between an input changing and the output of a gate settling at its new value. It exists because every gate output has to charge or discharge a little capacitance through the resistance of its transistors.**

On paper, gates switch instantly. In a real chip they don't, and this delay is what ends up limiting how fast a circuit can run.

## Intuition

Take a CMOS inverter whose input just fell from 1 to 0, so the output should rise from 0 to 1.

1. The PMOS turns ON. It's a switch connecting the output to $V_{DD}$, but an ON transistor still has some **resistance** $R$.
2. The output wire, plus the inputs of every gate it feeds, make up a **capacitance** $C$. A capacitor's voltage can't jump, because charge has to flow in first.
3. So the output voltage climbs gradually, like a bucket filling through a narrow pipe, until it's high enough to count as a 1.

The same thing happens in reverse when the output falls, since the NMOS has to drain the capacitor.

The time this takes grows with the product $R \times C$:

- **More resistance** (a weaker transistor, or several in series) → slower.
- **More capacitance** (longer wires, more gates connected to the output) → slower.

## Fan-out and fan-in

- **Fan-out** is how many gate inputs one output drives. Each one adds its own capacitance $C$, so the total load is $C_n = n\cdot C$ and the delay grows in direct proportion to $n$. Driving 10 gates is roughly 10 times slower than driving 1.
- **Fan-in** is how many inputs a gate has. A 4-input NAND has four NMOS in series in its pull-down network, so the discharge path has four resistances in a row.

See [[ch03-implementation-technology|Ch 3]] for how these show up in CMOS gates.

## Why it matters

Signals pass through lots of gates one after another, and their delays **add up**. The slowest path through a circuit decides how short the clock period can be before the output of that path is still changing when the next clock edge arrives. That's the same reason sequential circuits have setup and hold requirements in Ch 7.

A **buffer** can help when a gate has to drive a big load. It has stronger transistors, so it charges the large capacitance faster than the original gate could.

## Common mistakes

- Thinking delay means the gate is "slow to decide". The logic is correct, the output just takes time to *get* to its final voltage.
- Forgetting that fan-out is about the *load* the output drives and not the number of inputs the gate has (that's fan-in).
