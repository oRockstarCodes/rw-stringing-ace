---
title: "Ch 1: Number Systems and Digital Waveforms"
tags:
  - coe328
---
## Overview

> [!info] Readings Lectures: *Introduction to Digital Waveform* and *Lecture 1: Binary Numbering System* · weeks 1–2 · Floyd, *Digital Fundamentals* ch. 1–2

Why do computers work in binary? Because it's the most reliable way to store and move information through a noisy, imperfect physical world. A wire can easily be "clearly high" or "clearly low" even when its voltage wobbles a bit. Distinguishing ten different voltage levels for the ten decimal digits would be far more fragile.

So everything digital comes down to two levels, HIGH and LOW, standing for 1 and 0. This chapter follows that idea in two directions:

1. **In time:** how a 1 or 0 looks as a voltage on a wire, how a stream of bits becomes a **waveform**, and how to measure one on an oscilloscope.
2. **In meaning:** how a string of bits can represent a number, in **binary**, in its shorthand **hexadecimal**, in **BCD**, and how **1's and 2's complement** let the same bits represent negative numbers.

## Notes

### Logic levels

A digital signal is either **HIGH** or **LOW**. Each level is a **range** of voltages, not one exact value, with an invalid gap in between:

|Range (5 V logic)|Meaning|
|---|---|
|$2\ \text{V}$ to $5\ \text{V}$|HIGH, binary **1**|
|$0.8\ \text{V}$ to $2\ \text{V}$|Invalid (only passed through during a transition)|
|$0\ \text{V}$ to $0.8\ \text{V}$|LOW, binary **0**|

**Why ranges?** Real voltages are never exact. Wires pick up noise, components vary, and a "5 V" output might really be 4.6 V. If 1 meant exactly 5 V, almost nothing would count as a 1. With ranges, a signal can wander around quite a bit and still be read correctly. That robustness is the whole advantage of digital over analog: as long as the noise doesn't push a signal across into the other range, the information arrives perfectly.

**Why the gap?** It's a buffer zone. If 1 and 0 met at a single threshold, a signal sitting right at that threshold could flicker between them with the tiniest bit of noise. The gap means a valid 1 and a valid 0 are always well separated. A signal only passes through the gap briefly while switching.

A single binary digit is a **bit**. Using HIGH = 1 and LOW = 0 is called **positive logic**, which is what this course uses.

### Digital waveforms

A **digital waveform** is a plot of a signal's level over time as it switches between LOW and HIGH. One trip up and back down is a **pulse**:

- **Positive-going pulse:** normally LOW, goes HIGH, then back to LOW.
- **Negative-going pulse:** normally HIGH, goes LOW, then back to HIGH.
- The first edge of a pulse is the **leading edge** and the second is the **trailing edge**. On a positive-going pulse, the leading edge is the **rising** edge and the trailing edge is the **falling** edge.

A waveform is **periodic** if its pulses repeat at a fixed interval (a clock), and **non-periodic** if they don't (a data signal, which follows whatever the data is). A periodic waveform is described by:

![[coe-328-waveform-pulse.svg]]
*Figure 1.1: The parts of a periodic pulse waveform.*

|Quantity|Symbol|Meaning|
|---|---|---|
|Period|$T$|Time for one full cycle (one HIGH part + one LOW part)|
|Frequency|$f$|Cycles per second (Hz). $f = 1/T$|
|Pulse width|$t_W$|Time the pulse spends HIGH|
|Duty cycle|—|Fraction of the period spent HIGH, as a %: $\frac{t_W}{T} \times 100\%$|
|Amplitude|$A$|Voltage from LOW to HIGH ($V_{pp}$, peak-to-peak)|

$f = 1/T$ because frequency counts cycles per second and the period is seconds per cycle. They're the same information turned upside down: a 1 ms period means 1000 cycles fit in a second. A **square wave** is the special case with a 50% duty cycle, HIGH and LOW for equal times.

### Waveforms carry binary data

To send a sequence of bits down one wire, you take turns: each bit gets an equal slice of time called the **bit time**, and during its slice the wire is HIGH for a 1 or LOW for a 0.

But how does the receiver know where one slice ends and the next begins? Two 1s in a row look like one long HIGH. That's what the **clock** is for. Every waveform in the system is synchronized to a periodic clock signal whose period is one bit time, so the clock's ticks mark the slice boundaries. To read the bits off a waveform, check its level once during each clock period. The clock is a shared metronome everyone in the circuit keeps time to.

### Reading an oscilloscope

An oscilloscope draws a voltage against time on a screen marked out in a grid of **divisions**. The grid itself has no units. The two settings tell you what one division is worth:

- **Vertical (V/div):** volts per division. Amplitude = (number of divisions tall) × V/div.
- **Horizontal (time/div):** time per division. Period = (number of divisions per cycle) × time/div.

It's just like the scale on a map: count the squares, multiply by what each square represents. To sketch a waveform on a scope you go the other way and divide: divisions = value ÷ (value per division).

**Try it:** set a frequency, duty cycle and amplitude, then change the scope settings and see how many divisions each part takes up.

<div class="melon-logic" data-view="waveform">Interactive oscilloscope (open this page on the site to use it).</div>

### Decimal and binary numbers

Decimal and binary are both **positional** (weighted) number systems: what a digit is worth depends on *where* it sits. In decimal, the 5 in 568 means 500 because it's in the hundreds place. Each position is worth the **base** times the position to its right:

- **Decimal** (base 10): weights are powers of 10. $568.23 = 5 \times 10^2 + 6 \times 10^1 + 8 \times 10^0 + 2 \times 10^{-1} + 3 \times 10^{-2}$
- **Binary** (base 2): weights are powers of 2, so each bit is worth double the one to its right.

$$
\ldots\; 2^3 = 8,\;\; 2^2 = 4,\;\; 2^1 = 2,\;\; 2^0 = 1 \;\;.\;\; 2^{-1} = 0.5,\;\; 2^{-2} = 0.25,\;\; 2^{-3} = 0.125\; \ldots
$$

Binary uses only the digits 0 and 1 for the same reason decimal uses 0–9: a position "fills up" when it reaches the base. In decimal, 9 + 1 doesn't fit in one place, so it rolls over to 10. In binary that happens already at 1 + 1 = 10.

- The rightmost whole-number bit is the **LSB** (least significant bit), weight $2^0 = 1$. It changes the value the least.
- The leftmost bit is the **MSB** (most significant bit), the one with the biggest weight.
- Bits right of the binary point have fractional weights $2^{-1}, 2^{-2}, \ldots$

**How far $n$ bits can count.** Each bit has 2 choices, so $n$ bits have $2 \times 2 \times \cdots = 2^n$ possible patterns. Starting from 0, those patterns cover $0$ to $2^n - 1$ (the "−1" is because zero uses up one pattern). 4 bits count 0 to 15. Every extra bit doubles the range.

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

**Binary → decimal:** each 1 bit contributes its weight and each 0 contributes nothing, so add up the weights of the 1s.

$$1101101_2 = 64 + 32 + 8 + 4 + 1 = 109_{10}$$

**Decimal → binary**, two ways:

1. **Sum of weights:** find the binary weights that add up to the number, then put a 1 in those positions. Start from the largest weight that fits and work down. $25 = 16 + 8 + 1 \Rightarrow 11001_2$
2. **Repeated division by 2:** keep dividing by 2 until the quotient is 0. The remainders are the bits, with the **first remainder = LSB** and the last remainder = MSB.

**Why repeated division works.** Dividing a binary number by 2 shifts every bit one place right, and the bit that falls off the end is the remainder. So the first division's remainder is the original LSB (it also tells you whether the number is odd). The quotient is the number with that bit removed, and dividing it again peels off the next bit. Each division reveals one more bit, from right to left, which is why the remainders come out LSB first.

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

Binary arithmetic follows exactly the same column-by-column method you learned for decimal. Only the rollover point changes: a column overflows at 2 instead of 10.

|Addition|Result|Subtraction|Result|
|---|---|---|---|
|$0 + 0$|$0$|$0 - 0$|$0$|
|$0 + 1$|$1$|$1 - 0$|$1$|
|$1 + 0$|$1$|$1 - 1$|$0$|
|$1 + 1$|$10$ (sum 0, **carry 1**)|$10 - 1$|$1$ (0 − 1 with a **borrow**)|
|$1 + 1 + 1$|$11$ (sum 1, carry 1)|||

$1 + 1 = 2$, and 2 is written $10$ in binary, so you write 0 and carry 1, just as 7 + 5 = 12 means "write 2, carry 1" in decimal. The $1 + 1 + 1$ row is what happens in a column that also received a carry.

You only need to **borrow** when subtracting a 1 from a 0. It takes 1 from the next column to the left, and since each column is worth twice the one to its right, that borrowed 1 is worth **2** in the current column. Then $2 - 1 = 1$. (In decimal a borrow is worth 10, for the same reason.)

### 1's and 2's complement

These are ways of representing **negative numbers** using only bits, since there's no "−" sign in hardware (more in [[ch05-number-representation-and-arithmetic|Ch 5]]).

- **1's complement:** flip every bit (0 → 1, 1 → 0). In hardware that's just an inverter on each bit.
- **2's complement:** the 1's complement plus 1.

$$
\begin{aligned}
\text{number:} &\quad 10110010 \\
\text{1's complement:} &\quad 01001101 \\
\text{2's complement:} &\quad 01001110
\end{aligned}
$$

**Why 2's complement means "negative".** Picture a car's odometer with only 4 digits. Roll it back one from 0000 and it shows 9999. In that world, 9999 behaves exactly like −1: add 1 and you're back to 0000. Binary registers work the same way. With 4 bits, $1111 + 0001 = 10000$, but there's no room for the fifth bit, so it's lost and the answer is $0000$. So $1111$ acts like $-1$.

In general, the 2's complement of $x$ in $n$ bits is $2^n - x$. Add it to $x$ and you get exactly $2^n$, a 1 followed by $n$ zeros, which wraps around to zero. "The number that adds to $x$ to give zero" is the definition of $-x$. For example, in 4 bits, $3 = 0011$ and its 2's complement is $1101$. As an unsigned number that's 13, but $13 = 16 - 3$, and $0011 + 1101 = 1\,0000 \to 0000$. So $1101$ stands for $-3$.

**Why "flip and add 1" gives $2^n - x$.** Flipping every bit of $x$ gives $(2^n - 1) - x$, because $x$ plus its flipped version is all 1s, which is $2^n - 1$. Adding 1 makes it $2^n - x$.

**Shortcut for 2's complement:** starting at the LSB, copy the bits up to and including the **first 1**, then flip all the bits after it.

$$10111\underline{000} \;\rightarrow\; \text{copy } \underline{1000}, \text{ flip } 1011 \;\rightarrow\; 01001000$$

This works because of what "add 1" does after flipping. The trailing 0s of the original became 1s when flipped, and adding 1 turns them back to 0s with a carry rippling left. The carry stops at the position of the first original 1, which had become 0 and now becomes 1 again. Everything to the left of that stays flipped.

### Hexadecimal

Long binary numbers are hard for people to read and easy to copy wrong. **Hexadecimal** (base 16) is a compact shorthand. Since $16 = 2^4$, **each hex digit stands for exactly 4 bits**, so converting is just grouping, with no arithmetic. The digits are 0–9, then A–F for 10–15.

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
- **Hex → decimal:** multiply each digit by its weight ($16^0, 16^1, 16^2, \ldots$) and add them up, or go through binary.
- **Decimal → hex:** go through binary, or divide by 16 over and over (the remainders are the hex digits, first one = least significant), for the same reason repeated division by 2 works.

Group **from the right** because the right end is where the place values start ($2^0$). Grouping from the left would misalign every group whenever the length isn't a multiple of 4.

Counting keeps going past F like it does in decimal: …, E, F, 10, 11, …, 1F, 20, … Two hex digits (8 bits, one byte) get you to $FF_{16} = 255$, three get you to $FFF_{16} = 4095$, and four get you to $FFFF_{16} = 65\,535$. One byte is always exactly two hex digits, which is why hex is the standard way to show memory contents.

### Binary coded decimal (BCD)

**BCD** (the **8421 code**) takes a different approach: instead of converting the whole number to binary, it writes **each decimal digit separately** as its own 4-bit group, with weights 8, 4, 2, 1.

- **Decimal → BCD:** replace each decimal digit with 4 bits. $2469 = 0010\ 0100\ 0110\ 1001$
- **BCD → decimal:** split into 4-bit groups from the right and read each as a digit. $1000\ 0010\ 0010\ 0111\ 0110 = 82276$
- Only $0000$–$1001$ (0–9) are used. The six codes **$1010$ to $1111$ are invalid** in BCD, since no single decimal digit is bigger than 9.

**Why use it?** Because it keeps the decimal digits separate. A digital clock or calculator display needs to show each decimal digit on its own segment display, and with BCD each 4-bit group drives one digit directly. Converting pure binary to separate decimal digits takes real computation. The cost is wasted space: 4 bits could represent 16 values but BCD only uses 10 of them, so BCD needs more bits than plain binary for the same number.

> [!warning] BCD is not the same as binary. $35_{10}$ in binary is $100011$ (one number), but in BCD it's $0011\ 0101$ (a 3, then a 5).

**Try it:** click the bits to build a number and see it in every form from this chapter. (The signed rows make more sense after [[ch05-number-representation-and-arithmetic|Ch 5]].)

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

These are based on the lecture examples, with the numbers changed.

### Example 1: Reading a scope screen

> Like the waveform lecture's scope examples

A square wave on a scope is 4 divisions tall and one cycle spans 5 divisions, of which the HIGH part takes 2. The scope is set to 0.5 V/div and 20 µs/div. Find $V_{pp}$, $T$, $f$, $t_W$, and the duty cycle.

1. **Amplitude:** $V_{pp} = 4 \times 0.5\ \text{V} = 2\ \text{V}$
2. **Period and frequency:**
   $$T = 5 \times 20\ \mu\text{s} = 100\ \mu\text{s}, \qquad f = \frac{1}{100\ \mu\text{s}} = 10\ \text{kHz}$$
3. **Pulse width and duty cycle:**
   $$t_W = 2 \times 20\ \mu\text{s} = 40\ \mu\text{s}, \qquad \text{Duty} = \frac{40}{100} \times 100\% = 40\%$$

> [!note] A 40% duty cycle means this isn't a "square" wave, even if it looks like one. Square means 50%.

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
2. **Up to 300:** 8 bits only get to $2^8 - 1 = 255$, which isn't enough. 9 bits get to $2^9 - 1 = 511$, so you need **9 bits**.

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
- Mixing up **BCD and binary**. BCD encodes each decimal digit separately.
- Forgetting the **+1** for the 2's complement, or doing the shortcut from the wrong end (it starts at the LSB).
- Calling any 0/1 waveform a "square wave". It's only square at a **50%** duty cycle.
- Using the total number of scope divisions instead of the number for **one cycle** when finding $T$.
