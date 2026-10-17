---
title: Lookup Tables
aliases:
  - Lookup Table
  - LUT
  - LUTs
tags:
  - concept
  - coe328
---

**A lookup table (LUT) is a tiny memory that stores a truth table. Instead of working out a function with gates, it looks up the stored answer for the current inputs. Change the stored bits and the same hardware turns into a different function.**

LUTs are what an **FPGA** is built from, and that's the kind of chip the labs run on.

## Intuition

A truth table lists the output for every input combination. A LUT is that exact table, stored in memory:

- A $k$-input LUT has $2^k$ **storage cells**, one per row of the truth table.
- The inputs act as an **address** that selects one cell.
- The selected cell's stored bit is the output.

|$x_1$|$x_2$|Stored bit|
|---|---|---|
|0|0|$b_0$|
|0|1|$b_1$|
|1|0|$b_2$|
|1|1|$b_3$|

To make an AND gate, store $0, 0, 0, 1$. To make an OR gate, store $0, 1, 1, 1$. The wiring stays the same and only the four stored bits change.

## How the lookup works

The selection is done with a tree of **multiplexers** (see Ch 6):

1. The first multiplexer pair, controlled by $x_1$ (or $x_2$), narrows four cells down to two.
2. The last multiplexer, controlled by the other input, picks one of the two.

Each input cuts the number of candidates in half, so $k$ inputs pick one of $2^k$ cells.

## Why FPGAs use them

A fixed gate like AND can only ever be an AND. A LUT can be **any** function of its inputs, so one kind of logic block can be loaded with whatever the design needs:

- A typical FPGA logic block has a LUT with 4 or 5 inputs, often followed by a flip-flop for sequential circuits.
- Bigger functions are built by **connecting several LUTs** through the chip's programmable routing.
- The stored bits get loaded when the chip is configured, which is why an FPGA loses its design when the power goes off and has to be reloaded each time. See the PLD section in [[ch03-implementation-technology|Ch 3]].

## Worked example

Make a 2-input LUT act as an XNOR, which is 1 when the inputs match. The rows $x_1x_2 = 00, 01, 10, 11$ should give $1, 0, 0, 1$, so store **1, 0, 0, 1**. To change it to a NAND, store **1, 1, 1, 0** instead.

## Common mistakes

- Thinking a LUT has separate gates inside. It's stored bits plus a multiplexer tree.
- Forgetting that the size grows fast. A 5-input LUT needs $2^5 = 32$ cells and a 6-input one needs 64.
