---
title: "Ch 6: Combinational Circuit Building Blocks"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§6.1–6.5** · Lecture 7 · week 6

Some combinational circuits show up so often that they're sold as ready-made chips (or used as blocks in CAD tools) so you don't have to build them from gates every time. This chapter covers **comparators**, **decoders** (including the BCD-to-7-segment decoder), **encoders**, **multiplexers**, **demultiplexers**, and **parity** generators/checkers.

## Notes

### Comparators

A comparator tells you how two binary numbers relate.

**Equality.** An **XNOR** gate is a 1-bit comparator, since its output is 1 when the two bits are equal. To compare two multi-bit numbers, XNOR each pair of matching bits and AND the results. The numbers are only equal if every bit pair matches.

![[coe-328-equality-comparator.svg]]
*Figure 6.1: A 2-bit equality comparator.*

**Magnitude (inequality).** A magnitude comparator also has $A > B$ and $A < B$ outputs. To decide, start at the **most significant bit**:

- $A_3 = 1$ and $B_3 = 0$ → $A > B$.
- $A_3 = 0$ and $B_3 = 1$ → $A < B$.
- $A_3 = B_3$ → no decision yet, so move to the next bit down and repeat.

The first bit position where the numbers differ decides the answer. If no position differs, $A = B$.

### Decoders

A **decoder** detects a specific bit combination (code) on its inputs and signals it with an output level. In general it has $n$ inputs and up to $2^n$ outputs.

**Decoding one code.** An AND gate is the basic decoding element because it's 1 only when every input is 1. You invert the inputs that should be 0. For example, to detect $1001$:

$$X = A_3\,\overline{A_2}\,\overline{A_1}\,A_0$$

For an **active-LOW** output, use a NAND gate instead.

**Decoding every code.** A decoder with one output per input combination is called an **$n$-line-to-$2^n$-line** decoder, or a **1-of-$2^n$** decoder since exactly one output is active at a time.

- **4-line-to-16-line (1-of-16):** 4 inputs, 16 outputs, and one AND (or NAND) gate per output.
- **BCD-to-decimal (4-line-to-10-line, 1-of-10):** only the 10 valid BCD codes get an output.
- **2-line-to-4-line:** with inputs $S_1 S_0$, the outputs are $Y_0 = \overline{S_1}\,\overline{S_0}$, $Y_1 = \overline{S_1}S_0$, $Y_2 = S_1\overline{S_0}$, $Y_3 = S_1 S_0$. Each output is one **minterm**.

**BCD-to-7-segment decoder.** This takes a BCD digit and lights the right segments (a–g) of a 7-segment display to show it. Each segment is its own output function of the 4 BCD inputs, simplified with a K-map using the six invalid codes as **don't cares** ([[ch04-optimization-of-combinational-logic|Ch 4]]). For segment $a$, which is lit for digits 0, 2, 3, 5, 6, 7, 8, 9:

$$a = A + C + BD + \overline{B}\,\overline{D}$$

**Try it:** set a BCD code and see which segments light up. Each segment's expression is listed underneath.

<div class="melon-logic" data-view="sevenseg">Interactive BCD-to-7-segment decoder (open this page on the site to use it).</div>

### Encoders

An **encoder** is the reverse of a decoder. It takes an active level on **one** of its inputs (a digit or symbol) and outputs the matching code.

**Decimal-to-BCD encoder** (10-line-to-4-line): ten inputs, one per decimal digit, and four BCD outputs. Each output bit is the OR of the digits whose BCD code has a 1 in that position:

|Output bit|Weight|1 for digits…|Expression|
|---|---|---|---|
|$A_3$|8|8, 9|$A_3 = 8 + 9$|
|$A_2$|4|4, 5, 6, 7|$A_2 = 4 + 5 + 6 + 7$|
|$A_1$|2|2, 3, 6, 7|$A_1 = 2 + 3 + 6 + 7$|
|$A_0$|1|1, 3, 5, 7, 9|$A_0 = 1 + 3 + 5 + 7 + 9$|

(Here "8 + 9" means the OR of input lines 8 and 9.) Input 0 doesn't need a gate, since all the outputs are 0 when nothing else is active.

### Multiplexers (data selectors)

A **multiplexer (MUX)** routes one of several data inputs onto a single output line, and the **data-select** inputs choose which one. With $n$ select lines it can choose among $2^n$ data inputs.

**4-to-1 MUX:** data inputs $D_0$–$D_3$, select inputs $S_1 S_0$:

|$S_1$|$S_0$|$Y$|
|---|---|---|
|0|0|$D_0$|
|0|1|$D_1$|
|1|0|$D_2$|
|1|1|$D_3$|

$$Y = D_0\,\overline{S_1}\,\overline{S_0} + D_1\,\overline{S_1}\,S_0 + D_2\,S_1\overline{S_0} + D_3\,S_1 S_0$$

That's four 3-input ANDs, a 4-input OR, and two inverters for $\overline{S_1}$ and $\overline{S_0}$. Each AND gate is enabled by exactly one select combination (it's a decoder built into the MUX). The 2-to-1 MUX from [[ch02-intro-to-logic-circuits|Ch 2]], $f = \overline{s}\,x_1 + s\,x_2$, is the smallest case.

**Try it:** set the data inputs and the select lines, and the selected path lights up through the MUX.

<div class="melon-logic" data-view="mux">Interactive 4-to-1 multiplexer (open this page on the site to use it).</div>

**A MUX as a logic function generator.** A $2^n$-to-1 MUX can implement **any** function of $n$ variables. Connect the variables to the select lines, and tie each data input to the function's output for that row (HIGH for 1, LOW for 0). The MUX then just looks up the truth table, like an FPGA LUT ([[ch03-implementation-technology|Ch 3]]). This usually replaces several gate chips with one MUX chip.

There's also a smaller trick, where a $2^{n-1}$-to-1 MUX can do an $n$-variable function. Put $n - 1$ variables on the select lines and feed each data input with $0$, $1$, the last variable, or its complement (see Example 5).

### Demultiplexers

A **demultiplexer (DEMUX)** is the reverse of a MUX. It takes data from **one** line and sends it to **one of several** output lines, chosen by the select inputs. It's also called a **data distributor**.

**1-to-4 DEMUX:** the data input goes to all four AND gates, and the select lines enable only one of them:

$$D_0 = \text{Data}\cdot\overline{S_1}\,\overline{S_0}, \quad D_1 = \text{Data}\cdot\overline{S_1}S_0, \quad D_2 = \text{Data}\cdot S_1\overline{S_0}, \quad D_3 = \text{Data}\cdot S_1S_0$$

The unselected outputs stay at 0.

**A decoder is a DEMUX.** A decoder with an enable input already has this structure. Use the decoder inputs as the **select** lines and the **enable** as the data input. For example, a 4-line-to-16-line decoder with two active-LOW chip-select inputs works as a 1-to-16 DEMUX, where one chip select carries the data and the other is held LOW to enable the chip.

### Parity generators and checkers

**Parity** is a simple way to detect a single-bit error. An extra **parity bit** is sent along with the data so the total number of 1s is:

- **Even parity:** even
- **Odd parity:** odd

The key fact is that the XOR (sum without carries) of an **even** number of 1s is **0**, and of an **odd** number of 1s it's **1**. So XORing all the bits together counts the 1s mod 2:

$$X = b_{n-1} \oplus \cdots \oplus b_1 \oplus b_0$$

- **Generator:** XOR the data bits. For **even** parity the parity bit is $X$; for **odd** parity it's $\overline{X}$.
- **Checker:** XOR all the received bits **including the parity bit**. For even parity, $X = 0$ means OK and $X = 1$ means an error (for odd parity it's the other way around).

A single flipped bit always changes the count of 1s by one, so it always gets caught. Two flipped bits cancel out and don't.

## Key formulas

**2-bit equality comparator**

$$
(A = B) = \overline{A_1 \oplus B_1}\;\cdot\;\overline{A_0 \oplus B_0} \tag{6.1}
$$

- $A_1 A_0$, $B_1 B_0$: the two 2-bit numbers being compared

**Decoder outputs**

$$
\text{outputs} \le 2^n \tag{6.2}
$$

- $n$: number of input lines. Each output is one minterm of the inputs.

**4-to-1 multiplexer**

$$
Y = D_0\,\overline{S_1}\,\overline{S_0} + D_1\,\overline{S_1}\,S_0 + D_2\,S_1\overline{S_0} + D_3\,S_1 S_0 \tag{6.3}
$$

- $D_0$–$D_3$: data inputs
- $S_1 S_0$: select inputs; the binary number $S_1S_0$ is the index of the data input passed to $Y$

**1-to-4 demultiplexer**

$$
D_i = \text{Data} \cdot m_i(S_1, S_0) \tag{6.4}
$$

- $m_i$: the minterm of the select lines for output $i$ (e.g. $m_2 = S_1\overline{S_0}$)

**Parity**

$$
X = b_{n-1} \oplus \cdots \oplus b_1 \oplus b_0 \tag{6.5}
$$

- $X = 1$ when the bits contain an odd number of 1s

## Examples

These are based on the lecture examples, with the numbers changed.

### Example 1: Comparing two numbers

> Like Lecture 7, Example 2 and the magnitude-comparator slides

(a) Is $A = 10$ equal to $B = 10$ using a 2-bit equality comparator? (b) Compare $A = 1011$ and $B = 1001$ with a magnitude comparator.

**(a)** Bit 1: $\overline{1 \oplus 1} = 1$. Bit 0: $\overline{0 \oplus 0} = 1$. AND: $1 \cdot 1 = 1$, so **$A = B$**.

**(b)** Start at the MSB:

- $A_3 = B_3 = 1$: no decision
- $A_2 = B_2 = 0$: no decision
- $A_1 = 1$, $B_1 = 0$: **$A > B$** (bit 0 doesn't matter)

Check: $11 > 9$ ✓

### Example 2: Decoding one code

> Like the lecture's "decode 1001" slide

Write the decoding expression for the code $1011$ ($A_3$ is the MSB), with an active-HIGH output and with an active-LOW output.

1. **Invert the inputs that should be 0** (only $A_2$ here):
   $$
   X = A_3\,\overline{A_2}\,A_1\,A_0 \quad (\text{AND gate, active-HIGH})
   $$
2. **Active-LOW:** use a NAND gate instead:
   $$
   \overline{X} = \overline{A_3\,\overline{A_2}\,A_1\,A_0}
   $$

The output is 1 (or 0 for active-LOW) only for $1011$.

### Example 3: Decimal-to-BCD encoder

> Like the decimal-to-BCD encoder slide

Input line 6 of a decimal-to-BCD encoder is HIGH (all others LOW). What are the outputs?

1. **Check which output expressions include input 6.** $A_2 = 4 + 5 + 6 + 7$ and $A_1 = 2 + 3 + 6 + 7$ do, and $A_3$ and $A_0$ don't.
2. **Outputs:** $A_3A_2A_1A_0 = 0110$, which is 6 in BCD ✓

### Example 4: Multiplexer output waveform

> Like Lecture 7, Example 1

A 4-to-1 MUX has $D_0 = 1$, $D_1 = 0$, $D_2 = 1$, $D_3 = 0$ held constant. The select lines step through $S_1S_0 = 00, 01, 10, 11, 10, 00$. What is $Y$ in each interval?

|$S_1S_0$|00|01|10|11|10|00|
|---|---|---|---|---|---|---|
|Selected|$D_0$|$D_1$|$D_2$|$D_3$|$D_2$|$D_0$|
|$Y$|1|0|1|0|1|1|

### Example 5: A MUX as a function generator

> Like Lecture 7, Example 2

Implement $Y = \sum m(0, 3, 5, 6)$ (variables $A$, $B$, $C$; $A$ is the MSB) using (a) an 8-to-1 MUX and (b) a 4-to-1 MUX.

**(a)** Connect $A$, $B$, $C$ to the three select lines. Tie $D_0$, $D_3$, $D_5$, $D_6$ **HIGH** and $D_1$, $D_2$, $D_4$, $D_7$ **LOW**.

**(b)** Connect $A$, $B$ to $S_1$, $S_0$. For each pair of rows with the same $AB$, see how $Y$ depends on $C$:

|$AB$|$Y$ when $C = 0$|$Y$ when $C = 1$|Data input|
|---|---|---|---|
|00|1|0|$D_0 = \overline{C}$|
|01|0|1|$D_1 = C$|
|10|0|1|$D_2 = C$|
|11|1|0|$D_3 = \overline{C}$|

That's one 4-to-1 MUX and one inverter. (This function is $\overline{A \oplus B \oplus C}$, which would otherwise need two XOR-type gates.)

### Example 6: Demultiplexer

> Like Lecture 7, Example 3

Serial data $1, 0, 1, 1$ arrives on the data input of a 1-to-4 DEMUX, one bit per interval, while the select lines go $S_1S_0 = 00, 01, 10, 11$. Where does each bit end up?

|Interval|1|2|3|4|
|---|---|---|---|---|
|$S_1S_0$|00|01|10|11|
|Data in|1|0|1|1|
|$D_0$|**1**|0|0|0|
|$D_1$|0|**0**|0|0|
|$D_2$|0|0|**1**|0|
|$D_3$|0|0|0|**1**|

Each bit only shows up on the selected output during its interval, and the other outputs stay 0.

### Example 7: Parity

> Like the parity-checker slide

(a) Find the even and odd parity bits for the data $1011001$. (b) The byte $1101\,0110$ (7 data bits + even parity bit) is received. Is there an error?

**(a)** The data has four 1s (even), so $X = 1 \oplus 0 \oplus 1 \oplus 1 \oplus 0 \oplus 0 \oplus 1 = 0$.

- Even parity bit: **0** (the total stays at four 1s)
- Odd parity bit: **1** (makes five 1s)

**(b)** The received byte has five 1s, so the checker outputs $X = 1$. With even parity that means **there's an error** (at least one bit flipped).

### Example 8: A 7-segment segment equation

> Like Lecture 3, Example 23

Check that $a = A + C + BD + \overline{B}\,\overline{D}$ lights segment $a$ for digit 5 but not for digit 4.

1. **Digit 5** $= 0101$: $A = 0$, $C = 0$, $BD = 1 \cdot 1 = 1$ → $a = 1$, lit ✓
2. **Digit 4** $= 0100$: $A = 0$, $C = 0$, $BD = 1 \cdot 0 = 0$, $\overline{B}\,\overline{D} = 0 \cdot 1 = 0$ → $a = 0$, off ✓ (a "4" has no top bar)

## Common mistakes

- Comparing magnitudes from the **LSB**. Always start at the MSB, because the first difference decides.
- Mixing up decoders and encoders. A **decoder** turns a code into one active line and an **encoder** turns one active line into a code.
- Reading the select lines in the wrong order. $S_1$ is the MSB, so $S_1S_0 = 10$ selects $D_2$, not $D_1$.
- Thinking unselected DEMUX outputs "hold" their old value. They're 0.
- Tying data inputs to the wrong rows for a MUX function generator (check that the select variables are wired MSB-first, same as the truth table).
- Thinking parity can **correct** errors or catch two-bit errors. It only detects an odd number of flipped bits.
