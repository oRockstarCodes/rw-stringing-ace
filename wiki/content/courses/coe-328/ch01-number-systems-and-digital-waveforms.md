---
title: "Ch 1: Number Systems and Digital Waveforms"
tags:
  - coe328
---
## Overview

> [!info] Readings Lectures: *Introduction to Digital Waveform* and *Lecture 1: Binary Numbering System* · weeks 1–2 · Floyd, *Digital Fundamentals* ch. 1–2

Digital circuits only know two voltage levels, HIGH and LOW, which stand for the bits 1 and 0. This chapter covers how those levels show up as **waveforms** (and how to read them off an oscilloscope), then how numbers are written with bits: **binary**, **hexadecimal**, **BCD**, and the **1's and 2's complements** used for negative numbers.

## Notes

### Logic levels

A digital signal is either **HIGH** or **LOW**. Each level is a *range* of voltages, not one exact value, with a gap in between that's invalid:

|Range (5 V logic)|Meaning|
|---|---|
|$2\ \text{V}$ to $5\ \text{V}$|HIGH, binary **1**|
|$0.8\ \text{V}$ to $2\ \text{V}$|Invalid (only passed through during a transition)|
|$0\ \text{V}$ to $0.8\ \text{V}$|LOW, binary **0**|

A single binary digit is a **bit**. Using HIGH = 1 and LOW = 0 is called **positive logic**, and it's what this course uses.

### Digital waveforms

A **digital waveform** switches back and forth between LOW and HIGH. One trip up and back down is a **pulse**:

- **Positive-going pulse:** normally LOW, goes HIGH, then back to LOW.
- **Negative-going pulse:** normally HIGH, goes LOW, then back to HIGH.
- The first edge of a pulse is the **leading edge**, the second is the **trailing edge**. On a positive-going pulse, the leading edge is the **rising** edge and the trailing edge is the **falling** edge.

A waveform is **periodic** if its pulses repeat at a fixed interval, and **non-periodic** otherwise (like a data signal). A periodic waveform is described by:

![[coe-328-waveform-pulse.svg]]
*Figure 1.1: The parts of a periodic pulse waveform.*

|Quantity|Symbol|Meaning|
|---|---|---|
|Period|$T$|Time for one full cycle (one HIGH part + one LOW part)|
|Frequency|$f$|Cycles per second (Hz). $f = 1/T$|
|Pulse width|$t_W$|Time the pulse spends HIGH|
|Duty cycle|—|Fraction of the period spent HIGH, as a %|
|Amplitude|$A$|Voltage from LOW to HIGH ($V_{pp}$, peak-to-peak)|

A **square wave** is the special case with a 50% duty cycle.

### Waveforms carry binary data

When a waveform carries data, each bit gets an equal slice of time called the **bit time**. The waveform is HIGH during a bit time for a 1 and LOW for a 0. All the waveforms in a system are lined up with a periodic **clock** signal, whose period equals one bit time. To read the bits off a waveform, look at its level during each clock period.

### Reading an oscilloscope

A scope screen is a grid of **divisions**. The two knobs tell you how much each division is worth:

- **Vertical (V/div):** voltage per division. Amplitude = (number of divisions tall) × V/div.
- **Horizontal (time/div):** time per division. Period = (number of divisions per cycle) × time/div.

Going the other way, to sketch a waveform you divide: divisions = value ÷ (value per division).

**Try it:** set a frequency, duty cycle, and amplitude, then change the scope settings and see how many divisions each part takes up.

<div class="melon-logic" data-view="waveform">Interactive oscilloscope (open this page on the site to use it).</div>

### Decimal and binary numbers

Both decimal and binary are **positional** (weighted) number systems: each digit is multiplied by a weight that depends on its position, and the results are added.

- **Decimal** (base 10): weights are powers of 10. $568.23 = 5 \times 10^2 + 6 \times 10^1 + 8 \times 10^0 + 2 \times 10^{-1} + 3 \times 10^{-2}$
- **Binary** (base 2): weights are powers of 2, so each bit is worth double the one to its right.

$$
\ldots\; 2^3 = 8,\;\; 2^2 = 4,\;\; 2^1 = 2,\;\; 2^0 = 1 \;\;.\;\; 2^{-1} = 0.5,\;\; 2^{-2} = 0.25,\;\; 2^{-3} = 0.125\; \ldots
$$

- The rightmost whole-number bit is the **LSB** (least significant bit), weight $2^0 = 1$.
- The leftmost bit is the **MSB** (most significant bit).
- Bits right of the binary point have fractional weights $2^{-1}, 2^{-2}, \ldots$

**Counting in binary:** with $n$ bits you can count from $0$ up to $2^n - 1$ (e.g. 4 bits count 0 to 15).

|Bits $n$|$2^n$ (combinations)|Largest number, $2^n - 1$|
|---|---|---|
|1|2|1|
|2|4|3|
|3|8|7|
|4|16|15|
|5|32|31|
|6|64|63|
|7|128|127|
|8|256|255|
|9|512|511|
|10|1024|1023|

### Converting between binary and decimal

**Binary → decimal:** add up the weights of every bit that's a 1.

$$1101101_2 = 64 + 32 + 8 + 4 + 1 = 109_{10}$$

**Decimal → binary**, two ways:

1. **Sum of weights:** find binary weights that add up to the number, then put a 1 in those positions. $25 = 16 + 8 + 1 \Rightarrow 11001_2$
2. **Repeated division by 2:** keep dividing by 2 until the quotient is 0. The remainders are the bits, **first remainder = LSB**, last remainder = MSB.

|Division|Quotient|Remainder|
|---|---|---|
|$156 \div 2$|78|0 (LSB)|
|$78 \div 2$|39|0|
|$39 \div 2$|19|1|
|$19 \div 2$|9|1|
|$9 \div 2$|4|1|
|$4 \div 2$|2|0|
|$2 \div 2$|1|0|
|$1 \div 2$|0|1 (MSB)|

Reading the remainders bottom to top: $156_{10} = 10011100_2$.

### Binary addition and subtraction

|Addition|Result|Subtraction|Result|
|---|---|---|---|
|$0 + 0$|$0$|$0 - 0$|$0$|
|$0 + 1$|$1$|$1 - 0$|$1$|
|$1 + 0$|$1$|$1 - 1$|$0$|
|$1 + 1$|$10$ (sum 0, **carry 1**)|$10 - 1$|$1$ (0 − 1 with a **borrow**)|
|$1 + 1 + 1$|$11$ (sum 1, carry 1)|||

A borrow is only needed when subtracting a 1 from a 0. It takes 1 from the next column to the left, which is worth 2 in the current column.

### 1's and 2's complement

These are how computers represent **negative numbers** (more on this in [[ch05-number-representation-and-arithmetic|Ch 5]]).

- **1's complement:** flip every bit (0 → 1, 1 → 0). In hardware this is just an inverter on each bit.
- **2's complement:** the 1's complement plus 1.

$$
\begin{aligned}
\text{number:} &\quad 10110010 \\
\text{1's complement:} &\quad 01001101 \\
\text{2's complement:} &\quad 01001110
\end{aligned}
$$

**Shortcut for 2's complement:** starting at the LSB, copy the bits up to and including the **first 1**, then flip all the bits after it.

$$10111\underline{000} \;\rightarrow\; \text{copy } \underline{1000}, \text{ flip } 1011 \;\rightarrow\; 01001000$$

**Why it means negative:** in $n$ bits, the 2's complement of $x$ is $2^n - x$. In 4 bits, $3 = 0011$ and its 2's complement is $1101$, which is 13 as an unsigned number, but $13 = 16 - 3$, so it stands for $-3$.

### Hexadecimal

Hex (base 16) is shorthand for binary: **each hex digit is exactly 4 bits**. Digits are 0–9, then A–F for 10–15.

|Hex|Binary|Decimal|Hex|Binary|Decimal|
|---|---|---|---|---|---|
|0|0000|0|8|1000|8|
|1|0001|1|9|1001|9|
|2|0010|2|A|1010|10|
|3|0011|3|B|1011|11|
|4|0100|4|C|1100|12|
|5|0101|5|D|1101|13|
|6|0110|6|E|1110|14|
|7|0111|7|F|1111|15|

- **Binary → hex:** split into groups of 4 **starting from the right** (pad the leftmost group with 0s), then replace each group. $1001111011110011100 \rightarrow 0100\ 1111\ 0111\ 1001\ 1100 = 4F79C_{16}$
- **Hex → binary:** replace each hex digit with its 4 bits. $6BD3_{16} = 0110\ 1011\ 1101\ 0011$
- **Hex → decimal:** multiply each digit by its weight ($16^0, 16^1, 16^2, \ldots$) and add, or go through binary.
- **Decimal → hex:** go through binary, or divide repeatedly by 16 (remainders are the hex digits, first = least significant).

Counting continues past F the same way as decimal: …, E, F, 10, 11, …, 1F, 20, … Two hex digits reach $FF_{16} = 255$, three reach $FFF_{16} = 4095$, four reach $FFFF_{16} = 65\,535$.

### Binary coded decimal (BCD)

**BCD** (the **8421 code**) writes each *decimal digit* as its own 4-bit group, with weights 8, 4, 2, 1. It's used where people meet hardware: keypads and digital displays.

- **Decimal → BCD:** replace each decimal digit with 4 bits. $2469 = 0010\ 0100\ 0110\ 1001$
- **BCD → decimal:** split into 4-bit groups from the right and read each as a digit. $1000\ 0010\ 0010\ 0111\ 0110 = 82276$
- Only $0000$–$1001$ (0–9) are used. The six codes **$1010$ to $1111$ are invalid** in BCD.

> [!warning] BCD is not the same as binary. $35_{10}$ in binary is $100011$, but in BCD it's $0011\ 0101$.

**Try it:** click the bits to build a number and see it in every form from this chapter. (The signed rows come back in [[ch05-number-representation-and-arithmetic|Ch 5]].)

<div class="melon-logic" data-view="number">Interactive number converter (open this page on the site to use it).</div>

## Key formulas

**Waveforms**

$$
f = \frac{1}{T}, \qquad T = \frac{1}{f} \tag{1.1}
$$

$$
\text{Duty cycle} = \frac{t_W}{T} \times 100\% \tag{1.2}
$$

- $f$: frequency, in hertz (Hz)
- $T$: period, the time for one full cycle, in seconds
- $t_W$: pulse width, the time spent HIGH in each cycle

**Reading a scope**

$$
\text{value} = (\text{number of divisions}) \times (\text{value per division}) \tag{1.3}
$$

- Use V/div for amplitudes and time/div for $T$ and $t_W$.

**Binary numbers**

$$
V = \sum_{i} b_i \, 2^i \tag{1.4}
$$

- $V$: the decimal value
- $b_i$: the bit in position $i$ (0 or 1). $i = 0$ is the LSB, and $i < 0$ are the bits right of the binary point.

$$
\text{Largest } n\text{-bit number} = 2^n - 1, \qquad \text{number of combinations} = 2^n \tag{1.5}
$$

- $n$: number of bits

**Complements** (of an $n$-bit number $P$)

$$
K_1 = (2^n - 1) - P, \qquad K_2 = 2^n - P = K_1 + 1 \tag{1.6}
$$

- $K_1$: 1's complement of $P$ (flip every bit)
- $K_2$: 2's complement of $P$ (flip every bit, then add 1)

## Examples

These follow the lecture examples, with different numbers.

### Example 1: Reading a scope screen

> Like the waveform lecture's scope examples

A square wave on a scope is 4 divisions tall and one cycle spans 5 divisions, of which the HIGH part takes 2. The scope is set to 0.5 V/div and 20 µs/div. Find $V_{pp}$, $T$, $f$, $t_W$, and the duty cycle.

1. **Amplitude:** $V_{pp} = 4 \times 0.5\ \text{V} = 2\ \text{V}$
2. **Period and frequency:**
   $$T = 5 \times 20\ \mu\text{s} = 100\ \mu\text{s}, \qquad f = \frac{1}{100\ \mu\text{s}} = 10\ \text{kHz}$$
3. **Pulse width and duty cycle:**
   $$t_W = 2 \times 20\ \mu\text{s} = 40\ \mu\text{s}, \qquad \text{Duty} = \frac{40}{100} \times 100\% = 40\%$$

> [!note] With a 40% duty cycle this isn't a "square" wave, even though it looks like one. Square means 50%.

### Example 2: Sketching a waveform on a scope

> Like the waveform lecture's sketching examples

Sketch a pulse waveform with $f = 25\ \text{MHz}$, $V_{pp} = 2\ \text{V}$, and a 60% duty cycle, on a scope set to 500 mV/div and 10 ns/div. How many divisions does each part take?

1. **Period:** $T = \frac{1}{25\ \text{MHz}} = 40\ \text{ns}$, so one cycle spans $\frac{40\ \text{ns}}{10\ \text{ns/div}} = 4$ divisions.
2. **Amplitude:** $\frac{2\ \text{V}}{0.5\ \text{V/div}} = 4$ divisions tall.
3. **Pulse width:** $t_W = 0.60 \times 40\ \text{ns} = 24\ \text{ns}$, so the HIGH part spans $\frac{24}{10} = 2.4$ divisions and the LOW part the other 1.6.

Check it with the oscilloscope above: set 25 MHz, 60%, 2 V, 500 mV/div, 10 ns/div.

### Example 3: Range of an $n$-bit number

> Like Lecture 1, counting examples

What range of numbers can 7 bits count? How many bits are needed to count up to 300?

1. **7 bits:** $2^7 - 1 = 127$, so 0 to 127 (128 different values).
2. **Up to 300:** 8 bits only reach $2^8 - 1 = 255$, which is too small. 9 bits reach $2^9 - 1 = 511$, so **9 bits** are needed.

### Example 4: Binary to decimal

> Like Lecture 1, Exercises 4–5

Convert $1011011_2$ and $110.101_2$ to decimal.

1. $1011011_2$: the 1s sit at weights 64, 16, 8, 2, 1.
   $$64 + 16 + 8 + 2 + 1 = 91$$
2. $110.101_2$: the whole part is $4 + 2 = 6$. The fraction has 1s at $2^{-1}$ and $2^{-3}$:
   $$6 + 0.5 + 0.125 = 6.625$$

### Example 5: Decimal to binary

> Like Lecture 1, Exercises 6–7

Convert 74 using sum of weights, and 173 using repeated division by 2.

**Sum of weights:** the largest weight that fits in 74 is 64, leaving 10 = 8 + 2.
$$74 = 64 + 8 + 2 = 2^6 + 2^3 + 2^1 \quad\Rightarrow\quad 1001010_2$$

**Repeated division:**

|Division|Quotient|Remainder|
|---|---|---|
|$173 \div 2$|86|1 (LSB)|
|$86 \div 2$|43|0|
|$43 \div 2$|21|1|
|$21 \div 2$|10|1|
|$10 \div 2$|5|0|
|$5 \div 2$|2|1|
|$2 \div 2$|1|0|
|$1 \div 2$|0|1 (MSB)|

Reading bottom to top: $173 = 10101101_2$. Check: $128 + 32 + 8 + 4 + 1 = 173$ ✓

### Example 6: Binary addition and subtraction

> Like Lecture 1, Example 11

Find (a) $1011 + 0110$ and (b) $1100 - 0101$.

**(a)** Work right to left, carrying when a column adds to 2 or more:

- Column 0: $1 + 0 = 1$
- Column 1: $1 + 1 = 10$, write 0, carry 1
- Column 2: $0 + 1 + 1 = 10$, write 0, carry 1
- Column 3: $1 + 0 + 1 = 10$, write 0, carry 1 into a new column

$$
\begin{array}{r}
1011\\
+\;0110\\ \hline
10001
\end{array}
$$

Check: $11 + 6 = 17 = 10001_2$ ✓

**(b)** Borrow when subtracting 1 from 0:

- Column 0: $0 - 1$ needs a borrow. The column-1 bit is also 0, so the borrow comes from column 2, leaving column 2 = 0 and column 1 = 1. Column 0 becomes $10 - 1 = 1$.
- Column 1: $1 - 0 = 1$
- Column 2: $0 - 1$ needs a borrow from column 3, giving $10 - 1 = 1$ and column 3 = 0.
- Column 3: $0 - 0 = 0$

$$1100 - 0101 = 0111$$

Check: $12 - 5 = 7$ ✓

### Example 7: 1's and 2's complements

> Like Lecture 1, Examples 12–15

Find the 1's and 2's complements of $10110100$.

1. **1's complement:** flip every bit: $01001011$
2. **2's complement:** add 1: $01001011 + 1 = 01001100$
3. **Check with the shortcut:** copy up to the first 1 from the right ($100$), flip the rest ($10110 \rightarrow 01001$): $01001\,100$ ✓

### Example 8: Binary and hexadecimal

> Like Lecture 1, Examples 16–17

Convert $1101011100101_2$ to hex, and $3A7_{16}$ to binary.

1. **Group by 4 from the right**, padding the left group: $0001\ 1010\ 1110\ 0101 = 1AE5_{16}$
2. **Replace each hex digit:** $3A7_{16} = 0011\ 1010\ 0111_2$

### Example 9: Hex and decimal

> Like Lecture 1, Examples 18–19

Convert $2C7_{16}$ to decimal and $500_{10}$ to hex.

1. **Hex → decimal:** $C = 12$, so
   $$2C7_{16} = 2 \times 256 + 12 \times 16 + 7 \times 1 = 512 + 192 + 7 = 711$$
2. **Decimal → hex** by dividing by 16:
   - $500 \div 16 = 31$ remainder $4$
   - $31 \div 16 = 1$ remainder $15 = F$
   - $1 \div 16 = 0$ remainder $1$

   Reading the remainders last to first: $500_{10} = 1F4_{16}$. Check: $256 + 240 + 4 = 500$ ✓

### Example 10: BCD

> Like Lecture 1, Examples 20–22

(a) Write 4073 in BCD. (b) Convert the BCD code $011010010010$ to decimal. (c) Is $0101\ 1011$ a valid BCD number?

1. **(a)** One 4-bit group per digit: $4073 = 0100\ 0000\ 0111\ 0011$
2. **(b)** Group from the right: $0110\ 1001\ 0010 = 692$
3. **(c)** No. $1011$ is 11, which isn't a decimal digit, so it's one of the six invalid codes.

## Common mistakes

- Reading the remainders of repeated division **top to bottom**. The first remainder is the **LSB**.
- Grouping binary into 4s for hex **from the left**. Always group from the right (the binary point) and pad on the left.
- Mixing up **BCD and binary**: BCD encodes each decimal digit separately.
- Forgetting the **+1** for the 2's complement, or doing the shortcut from the wrong end (it starts at the LSB).
- Calling any 0/1 waveform a "square wave". It's only square at a **50%** duty cycle.
- Using the total number of scope divisions instead of the number for **one cycle** when finding $T$.
