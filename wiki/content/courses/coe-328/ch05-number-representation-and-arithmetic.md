---
title: "Ch 5: Number Representation and Arithmetic Circuits"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§5.1–5.3** · Lecture 6 · week 5–6

The same bit pattern can mean different numbers depending on the **representation**. This chapter goes through unsigned numbers (with octal/hex as shorthand), the circuits that add them (**half adder → full adder → ripple-carry adder**), and the three ways to write signed numbers (**sign-magnitude, 1's complement, 2's complement**). It also shows why 2's complement wins, which is that one adder circuit can do both addition and subtraction. It finishes with **overflow**, when a result doesn't fit.

## Notes

### Unsigned numbers

An $n$-bit unsigned number $B = b_{n-1} \ldots b_1 b_0$ uses positional notation (see [[ch01-number-systems-and-digital-waveforms|Ch 1]]):

$$V(B) = b_{n-1} 2^{n-1} + \cdots + b_1 2^1 + b_0 2^0$$

With $n$ bits the range is $0$ to $2^n - 1$ (8 bits: 0 to 255).

> [!warning] Always figure out the representation before you read a bit pattern. $1111\,1011$ is 251 unsigned, $-5$ in 2's complement, $-4$ in 1's complement, and $-123$ in sign-magnitude.

### Octal and hexadecimal

Both are shorthand for long binary numbers:

- **Octal** (base 8): each digit is **3 bits**. Group from the LSB in 3s. $101\ 011\ 010\ 111_2 = 5327_8$
- **Hex** (base 16): each digit is **4 bits**. Group from the LSB in 4s. $11\ 0110\ 1000_2 = 0011\ 0110\ 1000_2 = 368_{16}$
- Pad with 0s on the **left** if the number of bits isn't a multiple of 3 or 4: $10\ 111\ 011_2 = 273_8$

|Binary|Octal|Hex|Decimal|Binary|Octal|Hex|Decimal|
|---|---|---|---|---|---|---|---|
|0000|0|0|0|1000|10|8|8|
|0001|1|1|1|1001|11|9|9|
|0010|2|2|2|1010|12|A|10|
|0011|3|3|3|1011|13|B|11|
|0100|4|4|4|1100|14|C|12|
|0101|5|5|5|1101|15|D|13|
|0110|6|6|6|1110|16|E|14|
|0111|7|7|7|1111|17|F|15|

Hex is the usual way to show values from FPGAs and memory.

### The half adder

Adding two bits $x$ and $y$ gives a **sum** bit $s$ and a **carry** bit $c$:

|$x$|$y$|$c$|$s$|
|---|---|---|---|
|0|0|0|0|
|0|1|0|1|
|1|0|0|1|
|1|1|1|0|

$$s = x \oplus y \qquad c = xy$$

- XOR gives the sum, since it's 1 when **exactly one** input is 1.
- AND gives the carry, since it's 1 only when **both** inputs are 1.
- A half adder has **no carry-in**, so it only works for the least significant bit.

### The full adder

Every other bit position also has to add the carry coming in from the position to its right. A **full adder** adds three bits, $x_i$, $y_i$, and carry-in $c_i$. It is the same carry you write above a column when adding by hand (Figure 5.0). Each column is one full adder: it reads the three digits stacked in that column and writes the sum digit $s_i$ and the carry $c_{i+1}$ for the column on its left.

![[coe-328-column-addition.svg]]
*Figure 5.0: $1011 + 0110$ by columns. The highlighted column is one full adder, with inputs $x_1, y_1, c_1$ and outputs $s_1, c_{2}$.*

|$x_i$|$y_i$|$c_i$|$c_{i+1}$|$s_i$|
|---|---|---|---|---|
|0|0|0|0|0|
|0|0|1|0|1|
|0|1|0|0|1|
|0|1|1|1|0|
|1|0|0|0|1|
|1|0|1|1|0|
|1|1|0|1|0|
|1|1|1|1|1|

$$s_i = x_i \oplus y_i \oplus c_i \qquad c_{i+1} = x_i y_i + x_i c_i + y_i c_i$$

- The sum is 1 when an **odd** number of inputs are 1.
- The carry-out is 1 when **at least two** inputs are 1 (the majority function from [[ch02-intro-to-logic-circuits|Ch 2]]).

A full adder can be built from **two half adders and an OR gate** (Figure 5.1). The first adds $x$ and $y$, the second adds that sum to $c_{in}$, and if either one produces a carry you get a carry-out.

![[coe-328-full-adder.svg]]
*Figure 5.1: A full adder built from two half adders and an OR gate.*

### The ripple-carry adder

To add two $n$-bit numbers, chain $n$ full adders:

- Full adder $i$ adds bits $x_i$ and $y_i$.
- The **carry-out of stage $i$ is the carry-in of stage $i + 1$**.
- For plain unsigned addition, the first carry-in is $c_0 = 0$.
- The last carry-out, $c_n$, is the extra bit of the sum.

**The problem is speed.** A carry made in the lowest bit can change the next stage, which can change the next, all the way up the chain. The result isn't settled until the carry has **rippled** through every stage, so the worst-case delay grows with $n$. Faster adders (carry-lookahead, §5.4) work out the carries in parallel at the cost of more logic, but they're not covered in this course.

### Signed numbers

The **MSB is the sign bit**, with 0 for positive and 1 for negative. Positive numbers look the same in all three systems, and the difference is in how negatives are written.

|Representation|How to negate|8-bit range|Zeros|
|---|---|---|---|
|**Sign-magnitude**|flip the sign bit only|$-127$ to $+127$|two ($+0$ and $-0$)|
|**1's complement**|flip every bit: $K_1 = (2^n - 1) - P$|$-127$ to $+127$|two ($0000\,0000$ and $1111\,1111$)|
|**2's complement**|flip every bit, then add 1: $K_2 = 2^n - P$|$-128$ to $+127$|one|

- In the formulas, $P$ is the **positive number** being negated, and $K_1$, $K_2$ are the bit patterns for $-P$. For example, with $n = 4$ and $P = 5$: $K_1 = 15 - 5 = 10 = 1010$ and $K_2 = 16 - 5 = 11 = 1011$.
- In 4 bits, $+5 = 0101$. Then $-5$ is $1101$ (sign-magnitude), $1010$ (1's complement), or $1011$ (2's complement).
- Since $K_2 = K_1 + 1$, the easy way to get a 2's complement in hardware is to invert and then add 1.
- 2's complement gets one **extra negative number**. It only has one zero, so the pattern $1000\,0000$ that would have been $-0$ is $-128$ instead.

**Reading a 2's complement number:** if the MSB is 0, read it normally. If it's 1, take the 2's complement to find the magnitude and put a minus sign in front ($1111\,0111$ → $0000\,1001 = 9$ → $-9$). Another way is to give the MSB a weight of $-2^{n-1}$ instead of $+2^{n-1}$.

**Try it:** click bits to see the same pattern read four ways, and use the buttons to take complements.

<div class="melon-logic" data-view="number">Interactive number representations (open this page on the site to use it).</div>

### Adding signed numbers

**1's complement addition** sometimes needs a fix. If there's a carry-out of the sign bit, you add it back into the LSB (the **end-around carry**). That second addition can double the time, which is why 1's complement isn't used for arithmetic.

$$
\begin{aligned}
(+5) + (-2): \quad 0101 + 1101 &= 1\,0010 \\
\text{add the carry back:}\quad 0010 + 1 &= 0011 = +3 \;✓
\end{aligned}
$$

**2's complement addition always works directly.** Add the bit patterns with an ordinary adder and **ignore** any carry out of the sign bit. It doesn't matter what the signs of the operands are.

|Sum|Bits|Result|
|---|---|---|
|$(+5) + (+2)$|$0101 + 0010$|$0111 = +7$|
|$(-5) + (+2)$|$1011 + 0010$|$1101 = -3$|
|$(+5) + (-2)$|$0101 + 1110$|$\cancel{1}\,0011 = +3$|
|$(-5) + (-2)$|$1011 + 1110$|$\cancel{1}\,1001 = -7$|

**2's complement subtraction:** negate the subtrahend (take its 2's complement) and add:

$$A - B = A + \overline{B} + 1$$

It helps to picture the **number circle**. In 4 bits the patterns $0000$ to $1111$ go around a circle, with $0111$ (+7) right next to $1000$ (−8). Adding moves you clockwise, subtracting moves you counterclockwise, and crossing the +7/−8 boundary means the answer is wrong (overflow).

### The adder/subtractor unit

This is the logic behind lab 3. One $n$-bit adder can do both operations, controlled by a signal $\overline{\text{Add}}/\text{Sub}$ (0 = add, 1 = subtract; the bar over Add means "add when this is 0"):

- Each bit $y_i$ goes through an **XOR gate** with the control signal. XOR with 0 passes $y_i$ through and XOR with 1 inverts it, so the adder sees $Y$ when adding and $\overline{Y}$ when subtracting.
- The control signal is also the **carry-in** $c_0$. When subtracting, $c_0 = 1$ supplies the "+1" that turns $\overline{Y}$ into the 2's complement.

$$\text{Add } (\text{control} = 0): \; X + Y + 0 \qquad \text{Sub } (\text{control} = 1): \; X + \overline{Y} + 1 = X - Y$$

**Try it:** set $X$ and $Y$, switch between add and subtract, and follow the carries through the four full adders.

<div class="melon-logic" data-view="adder">Interactive 4-bit adder/subtractor (open this page on the site to use it).</div>

### Arithmetic overflow

With $n$ bits, a 2's complement result has to be between $-2^{n-1}$ and $2^{n-1} - 1$ (4 bits: −8 to +7). If the true answer is outside that range, the result is wrong. That's **arithmetic overflow**.

- **It can only happen when adding two numbers with the same sign.** A positive plus a negative always fits.
- **Sign check:** overflow happened if two positives give a negative, or two negatives give a positive.
- **Carry check (what the hardware uses):** overflow = $c_n \oplus c_{n-1}$, the carry **out of** the sign bit XOR the carry **into** it.

|Sum (4-bit)|Bits|$c_4$|$c_3$|Overflow?|
|---|---|---|---|---|
|$(+7) + (+2)$|$0111 + 0010 = 1001$|0|1|**Yes** (got −7, not +9)|
|$(-7) + (+2)$|$1001 + 0010 = 1011$|0|0|No (−5)|
|$(+7) + (-2)$|$0111 + 1110 = 1\,0101$|1|1|No (+5)|
|$(-7) + (-2)$|$1001 + 1110 = 1\,0111$|1|0|**Yes** (got +7, not −9)|

> [!note] For **unsigned** numbers the rule is different. The result is wrong when $c_n = 1$ (the sum needs one more bit).

## Key formulas

**Unsigned value**

$$
V(B) = \sum_{i=0}^{n-1} b_i\,2^i, \qquad 0 \le V \le 2^n - 1 \tag{5.1}
$$

- $b_i$: bit $i$ ($b_0$ is the LSB)
- $n$: number of bits

**Half adder**

$$
s = x \oplus y, \qquad c = xy \tag{5.2}
$$

**Full adder**

$$
s_i = x_i \oplus y_i \oplus c_i, \qquad c_{i+1} = x_i y_i + x_i c_i + y_i c_i \tag{5.3}
$$

- $x_i$, $y_i$: the two operand bits at position $i$
- $c_i$: carry into position $i$
- $s_i$: sum bit at position $i$
- $c_{i+1}$: carry out of position $i$ (into position $i + 1$)

**Complements**

$$
K_1 = (2^n - 1) - P, \qquad K_2 = 2^n - P = K_1 + 1 \tag{5.4}
$$

- $P$: the positive number being negated
- $K_1$, $K_2$: its 1's and 2's complement (the bit patterns for $-P$)

**2's complement subtraction**

$$
X - Y = X + \overline{Y} + 1 \tag{5.5}
$$

- $\overline{Y}$: $Y$ with every bit inverted

**Signed range** ($n$-bit 2's complement)

$$
-2^{n-1} \le V \le 2^{n-1} - 1 \tag{5.6}
$$

**Overflow** (2's complement)

$$
\text{Overflow} = c_n \oplus c_{n-1} \tag{5.7}
$$

- $c_n$: carry out of the sign bit
- $c_{n-1}$: carry into the sign bit

## Examples

These are based on the lecture's worked examples and practice questions, with the numbers changed.

### Example 1: Hex, octal, and decimal

> Like Practice 1

Convert $1011\,0110_2$ to hex, octal, and decimal.

1. **Hex** (groups of 4): $1011\ 0110 = B6_{16}$
2. **Octal** (groups of 3 from the right, pad to $010\ 110\ 110$): $266_8$
3. **Decimal:** $B6_{16} = 11 \times 16 + 6 = 182$. Check in binary: $128 + 32 + 16 + 4 + 2 = 182$ ✓

### Example 2: Full adder outputs

> Like Practice 2–3

Find $s$ and $c_{out}$ for a full adder with $x = 1$, $y = 0$, $c_{in} = 1$, and explain why a half adder couldn't do this.

1. **Sum:** $1 \oplus 0 \oplus 1 = 0$ (an even number of 1s).
2. **Carry:** $xy + xc_{in} + yc_{in} = 0 + 1 + 0 = 1$ (two of the three inputs are 1).

So $1 + 0 + 1 = 10_2$, with $s = 0$ and $c_{out} = 1$. A half adder only has two inputs, so it has nowhere to take the carry-in.

### Example 3: Ripple-carry addition

> Like the lecture's ripple-carry adder slide

Add $X = 0110$ and $Y = 0111$ with a 4-bit ripple-carry adder ($c_0 = 0$). Give every carry.

|Stage $i$|$x_i$|$y_i$|$c_i$|$s_i$|$c_{i+1}$|
|---|---|---|---|---|---|
|0|0|1|0|1|0|
|1|1|1|0|0|1|
|2|1|1|1|1|1|
|3|0|0|1|1|0|

$S = 1101 = 13$ and $c_4 = 0$. Check: $6 + 7 = 13$ ✓

> [!note] Stage 3 can't settle until $c_3$ arrives, which waits on $c_2$, which waits on $c_1$. That chain is what causes the ripple delay.

### Example 4: Subtraction with 2's complement

> Like the lecture's "13 − 5" worked example

Compute $22 - 9$ using 8-bit 2's complement.

1. **Operands:** $22 = 0001\,0110$, $9 = 0000\,1001$
2. **Negate 9:** invert → $1111\,0110$, add 1 → $1111\,0111$
3. **Add:**
   $$0001\,0110 + 1111\,0111 = \cancel{1}\,0000\,1101$$
4. **Drop the carry** out of the 8-bit word: $0000\,1101 = 13$ ✓

### Example 5: A negative result

> Like Practice 4

Compute $14 - 25$ using 8-bit 2's complement.

1. **Operands:** $14 = 0000\,1110$, $25 = 0001\,1001$
2. **Negate 25:** invert → $1110\,0110$, add 1 → $1110\,0111$
3. **Add:** $0000\,1110 + 1110\,0111 = 1111\,0101$ (no carry out)
4. **Read it:** the MSB is 1, so it's negative. Its 2's complement is $0000\,1011 = 11$, so the result is $-11$ ✓

### Example 6: Three signed representations

> Like the lecture's signed-number table

Write $-37$ in 8-bit sign-magnitude, 1's complement, and 2's complement.

1. **Start from $+37$:** $0010\,0101$
2. **Sign-magnitude:** set the sign bit → $1010\,0101$
3. **1's complement:** flip every bit → $1101\,1010$
4. **2's complement:** add 1 → $1101\,1011$

### Example 7: 1's complement addition

> Like Figure 5.9

Add $(-4) + (-2)$ in 4-bit 1's complement.

1. **Operands:** $+4 = 0100 \to -4 = 1011$; $+2 = 0010 \to -2 = 1101$
2. **Add:** $1011 + 1101 = 1\,1000$
3. **End-around carry:** there's a carry out, so add it to the LSB: $1000 + 1 = 1001$
4. **Check:** $+6 = 0110$, so $-6 = 1001$ ✓

### Example 8: Detecting overflow

> Like Figure 5.14 and Practice 5

In 4-bit 2's complement, does (a) $(+5) + (+4)$ or (b) $(-6) + (-3)$ overflow?

**(a)** $0101 + 0100$:

- Bits 0–1 don't produce any carries, bit 2 is $1 + 1 = 10$ so $c_3 = 1$, and bit 3 is $0 + 0 + 1 = 1$ so $c_4 = 0$.
- The result is $1001$ and $c_4 \oplus c_3 = 0 \oplus 1 = 1$, so it's **overflow**. Two positives gave a negative ($-7$), and the true answer $+9$ needs more than 4 bits.

**(b)** $1010 + 1101$:

- Bits 0–2 don't produce any carries ($c_3 = 0$), and bit 3 is $1 + 1 = 10$ so $c_4 = 1$.
- The result is $0111$ and $c_4 \oplus c_3 = 1 \oplus 0 = 1$, so it's **overflow**. Two negatives gave a positive ($+7$), and the true answer $-9$ is below $-8$.

### Example 9: Adder/subtractor unit

> Like Figure 5.13

A 4-bit adder/subtractor has $X = 0110$, $Y = 0011$, and the control set to Sub (1). What does the adder see, and what's the output?

1. **XOR gates** invert each $y_i$: the adder's second input is $\overline{Y} = 1100$.
2. **Carry-in** $c_0 = 1$.
3. **Add:**
   $$0110 + 1100 + 1 = \cancel{1}\,0011$$
4. **Result** $0011 = 3$, and $6 - 3 = 3$ ✓. $c_4 = 1$, $c_3 = 1$, so no overflow.

## Common mistakes

- Reading a bit pattern without settling on the representation first.
- Using a half adder where there's a carry-in. Only bit 0 can use one.
- Forgetting the **+1** when subtracting with 2's complement (in hardware it's the carry-in).
- Keeping the carry out of the sign bit in 2's complement. It gets **ignored** (in 1's complement it's added back).
- Calling it overflow whenever there's a carry-out. For signed numbers, check $c_n \oplus c_{n-1}$ (or the signs) and not just $c_n$.
- Thinking the 8-bit 2's complement range is symmetric. It's **−128 to +127**.
