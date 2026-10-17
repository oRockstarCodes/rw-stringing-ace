---
title: Transmission Gate
aliases:
  - Transmission Gates
  - Pass Gate
tags:
  - concept
  - coe328
---

**A transmission gate is a switch for signals, built from one NMOS and one PMOS in parallel. When it is ON, whatever is at the input appears at the output, whether it is a 0 or a 1.**

Ordinary CMOS gates connect their output to a **supply** ($V_{DD}$ or GND). A transmission gate connects one **signal** to another, which makes it useful for multiplexers, XOR gates and storage elements.

## Intuition

### Why one transistor isn't enough

Each [[mosfet|MOSFET]] type passes one logic value well and the other poorly:

|Transistor|Passing a 0|Passing a 1|
|---|---|---|
|NMOS|clean 0 V|weak: about $V_{DD} - V_T$|
|PMOS|weak: stops a threshold above 0 V|clean $V_{DD}$|

An NMOS stops conducting as its source rises toward $V_{DD} - V_T$, because the gate-to-source voltage shrinks below the threshold. So a single NMOS can't deliver a full 1. A PMOS has the mirror-image problem with 0s.

### Putting them together

Wire an NMOS and a PMOS **in parallel**, and drive the NMOS gate with $s$ and the PMOS gate with $\overline{s}$ (the opposite):

|$s$|$\overline{s}$|NMOS|PMOS|Result|
|---|---|---|---|---|
|1|0|ON|ON|Output follows the input: $f = x$|
|0|1|OFF|OFF|Output is **disconnected** (floating)|

When $s = 1$:

- If $x = 0$, the **NMOS** passes it cleanly. (The PMOS is bad at this, but it doesn't matter.)
- If $x = 1$, the **PMOS** passes it cleanly. (The NMOS is bad at this, but it doesn't matter.)

Whichever value comes in, one of the two transistors handles it well, so the signal gets through at full strength.

When $s = 0$ the output isn't tied to anything. It is *not* 0, it is just unconnected (high impedance). Something else may drive it.

## Where it's used

- **2-to-1 multiplexer:** two transmission gates driven by $s$ and $\overline{s}$. Exactly one is ON, so the output is either $x_1$ or $x_2$. See [[ch06-combinational-building-blocks|Ch 6]] for the same function built from logic gates.
- **XOR gate:** two inverters and two transmission gates, 8 transistors total instead of 22 using AND/OR/NOT gates. One transmission gate passes $x_2$ when $x_1 = 0$, and the other passes $\overline{x_2}$ when $x_1 = 1$.

Both come from [[ch03-implementation-technology|Ch 3]].

## Common mistakes

- Thinking the OFF state outputs 0. It outputs **nothing** (floating).
- Driving both transistors with the **same** signal. They need **opposite** controls so both turn ON together.
- Using a lone NMOS or PMOS and expecting a full-strength 0 *and* 1.
