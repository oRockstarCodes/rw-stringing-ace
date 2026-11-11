---
title: "Ch 7 (cont.): Counters"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§7.9, 7.11** · Floyd (Digital Fundamentals) counters · week 9

A **counter** is a group of flip-flops whose outputs step through a fixed sequence of binary values, one step per clock pulse. It's one of the most important uses of flip-flops, since a counter counts pulses, divides a frequency, and generates timing sequences. This chapter picks up from [[ch07-intro-to-sequential-circuits|Ch 7]], where T and D flip-flops were introduced. It covers **asynchronous (ripple)** counters, which are simple but slow, then **synchronous** counters, where every flip-flop shares one clock. It finishes with extra features (**parallel load** and **output carry**) and two special counters: the **BCD counter** and the **Johnson counter**.

## Notes

### Counting with flip-flops

Take two negative edge-triggered J-K flip-flops, both with $J = K = 1$ (so each one **toggles** on every active edge), and start them RESET. Flip-flop A is clocked by $CLK$. Flip-flop B is clocked by $Q_A$.

- A toggles on every falling clock edge, so $Q_A$ changes once per clock pulse.
- B toggles each time $Q_A$ makes a HIGH-to-LOW transition, so $Q_B$ changes once every **two** clock pulses.

Taking $Q_A$ as the least significant bit, the pair $Q_BQ_A$ steps through $00, 01, 10, 11$ and then recycles to $00$. That's a **2-bit binary counter**, and the sequence repeats every 4 clock pulses.

|After clock pulse|0|1|2|3|4|
|---|---|---|---|---|---|
|$Q_A$|0|1|0|1|0|
|$Q_B$|0|0|1|1|0|
|Count|0|1|2|3|0|

This is the key idea of the whole chapter: **each stage divides the frequency of the stage before it by 2**. So $Q_A$ runs at $f/2$, $Q_B$ at $f/4$, and in general an $n$-bit counter's most significant output runs at $f/2^n$.

#### Example 7.13: How many flip-flops?

How many flip-flops are needed to produce a binary sequence for the decimal numbers 0 through 15? For 0 through 99?

- $n$ flip-flops can hold $2^n$ different values, so we need the smallest $n$ with $2^n \ge$ (number of states).
- 0 to 15 is $16$ values, and $2^4 = 16$, so **4** flip-flops.
- 0 to 99 is $100$ values, and $2^6 = 64 < 100 \le 2^7 = 128$, so **7** flip-flops.

A counter with $m$ distinct states is a **modulo-$m$** counter. An $n$-bit binary counter is modulo-$2^n$.

### Asynchronous (ripple) up-counter

![[coe-328-ripple-counter.svg]]
*Figure 7.3: A 3-bit asynchronous up-counter made of positive edge-triggered T flip-flops. Each stage is clocked by the $\overline{Q}$ output of the stage before it.*

The version in Brown & Vranesic (Figure 7.20) uses **positive** edge-triggered T flip-flops:

- Every $T$ input is tied to 1, so a flip-flop **toggles** on each positive edge of its own clock input.
- The first flip-flop is clocked by the primary $Clock$ input.
- The other two are clocked by the $\overline{Q}$ output of the stage in front of them. When that stage goes **$Q = 1 \to Q = 0$**, $\overline{Q}$ rises, which is a positive edge. So a stage toggles each time the previous stage falls.

Reading $Q_2Q_1Q_0$ as the count, it goes $0, 1, 2, 3, 4, 5, 6, 7, 0, 1, \dots$. That's a **modulo-8 up-counter**.

The circuit is called **asynchronous** or a **ripple counter**, because only the first stage is synchronized to the clock. Each later stage changes after the one before it has changed, so the change **ripples** along, like a carry in a ripple-carry adder ([[ch05-number-representation-and-arithmetic|Ch 5]]). Every flip-flop adds its own propagation delay.

#### Example 7.14: The transient states of a ripple counter

A 3-bit ripple up-counter has $Q_2Q_1Q_0 = 011$. What happens at the next clock pulse?

The count should go $3 \to 4$ ($011 \to 100$), and that needs **all three** flip-flops to toggle. They don't toggle together:

|Time|$Q_2Q_1Q_0$|Why|
|---|---|---|
|Before the edge|011|stable count = 3|
|After 1 flip-flop delay|010|$Q_0$ toggled $1 \to 0$; the others haven't reacted yet|
|After 2 delays|000|the falling $Q_0$ made $Q_1$ toggle $1 \to 0$|
|After 3 delays|100|the falling $Q_1$ made $Q_2$ toggle $0 \to 1$ (stable count = 4)|

For a short time the counter shows $010$ and $000$, values that **aren't part of the counting sequence**. If something decodes the count right then, it'll see a glitch. In an $n$-bit ripple counter the settling time grows with $n$, which is the main reason ripple counters are only used where speed doesn't matter.

#### Example 7.15: Waveforms of a 3-bit counter

Three negative edge-triggered J-K flip-flops ($J = K = 1$) are cascaded as in the first figure ($Q_A$ clocks B, $Q_B$ clocks C). Find the binary sequence.

Each output changes on the **falling** edge of the signal that clocks it:

|After clock pulse|0|1|2|3|4|5|6|7|8|
|---|---|---|---|---|---|---|---|---|---|
|$Q_C$ (MSB)|0|0|0|0|1|1|1|1|0|
|$Q_B$|0|0|1|1|0|0|1|1|0|
|$Q_A$ (LSB)|0|1|0|1|0|1|0|1|0|
|Count|0|1|2|3|4|5|6|7|0|

The sequence is $000, 001, 010, 011, 100, 101, 110, 111$ and then back to $000$. $Q_A$ is $f/2$, $Q_B$ is $f/4$, $Q_C$ is $f/8$.

### Asynchronous down-counter

A tiny change to the up-counter gives a down-counter. In Brown & Vranesic Figure 7.21 the clock input of each later stage is driven by the **$Q$** output of the stage before it, instead of by $\overline{Q}$. Now a stage toggles when the previous one **rises** (instead of when it falls), and the count goes

$$0, 7, 6, 5, 4, 3, 2, 1, 0, 7, \dots$$

A counter that can do both is an **up/down counter**.

#### Example 7.16: Up or down?

A 3-bit ripple counter has $Q_2Q_1Q_0 = 000$. What's the count after the next pulse if it is (a) the up-counter, (b) the down-counter?

- **(a)** $001$. Only the first stage toggles. $Q_0$ goes $0 \to 1$, which makes $\overline{Q}_0$ **fall**, and that isn't the edge the next stage waits for.
- **(b)** $111$. $Q_0$ goes $0 \to 1$, which **is** the rising edge the next stage waits for, so $Q_1$ toggles $0 \to 1$. Then $Q_1$ rising makes $Q_2$ toggle $0 \to 1$. All three bits end up 1, which is "0 minus 1" wrapping around to 7.

### Synchronous counters

To avoid the ripple, give **every flip-flop the same clock**. Then all the flip-flops that need to change do so after one propagation delay from the same edge. The question is how each flip-flop knows *when* to change. Look at the count of a 3-bit up-counter:

|Count|$Q_2$|$Q_1$|$Q_0$|
|---|---|---|---|
|0|0|0|0|
|1|0|0|1|
|2|0|1|0|
|3|0|1|1|
|4|1|0|0|
|5|1|0|1|
|6|1|1|0|
|7|1|1|1|

- $Q_0$ changes on **every** clock cycle.
- $Q_1$ changes **only when $Q_0 = 1$**.
- $Q_2$ changes **only when $Q_1 = Q_0 = 1$**.

In general, in an up-counter a given flip-flop changes state only when **all the flip-flops before it are 1**.

#### Synchronous counter with T flip-flops

A T flip-flop toggles when $T = 1$ and holds when $T = 0$, so each $T$ input is just the "all lower bits are 1" condition:

$$T_0 = 1, \quad T_1 = Q_0, \quad T_2 = Q_0Q_1, \quad T_3 = Q_0Q_1Q_2, \quad \dots \quad T_i = Q_0Q_1\cdots Q_{i-1}$$

A 4-bit version (Brown & Vranesic Figure 7.22) uses a **chain** of AND gates, where each gate feeds the next stage and also the next gate. That doesn't slow down the response in terms of the flip-flops, since they all still change after one propagation delay from the same positive edge. But a change in $Q_0$ may have to pass through several AND gates before it reaches the top stage, and that has to finish **within one clock period** (minus the flip-flop setup time).

#### Example 7.17: T inputs in a 4-bit synchronous counter

The counter holds $Q_3Q_2Q_1Q_0 = 0101$. Find $T_3T_2T_1T_0$ and the next count. Repeat for $0111$.

|Count|$T_0$|$T_1 = Q_0$|$T_2 = Q_0Q_1$|$T_3 = Q_0Q_1Q_2$|Toggling|Next count|
|---|---|---|---|---|---|---|
|0101|1|1|0|0|$Q_1,Q_0$|**0110**|
|0111|1|1|1|1|all four|**1000**|

At $0111$ every lower bit is 1, so all four flip-flops toggle at once, with no ripple. This is the same $3 \to 4$ style change that gave the glitch in Example 7.14.

#### Synchronous counter with D flip-flops

A D flip-flop has no toggle mode, so to **toggle** we feed it $D = \overline{Q}$, and to **hold** we feed it $D = Q$. An XOR gate does both: $D = Q \oplus x$ gives $D = Q$ when $x = 0$ (hold) and $D = \overline{Q}$ when $x = 1$ (toggle). That's the same trick as the T flip-flop built from a D flip-flop in [[ch07-intro-to-sequential-circuits|Ch 7]]. So (Brown & Vranesic Figure 7.24, 4 bits with an $Enable$ input):

$$D_0 = Q_0 \oplus Enable$$
$$D_1 = Q_1 \oplus (Enable \cdot Q_0)$$
$$D_2 = Q_2 \oplus (Enable \cdot Q_0 Q_1)$$
$$D_3 = Q_3 \oplus (Enable \cdot Q_0 Q_1 Q_2)$$

The AND-gate chain creates the toggle condition for each stage. When $Enable = 0$ every XOR passes $Q_i$ straight back, so the counter **holds**.

#### Example 7.18: D-flip-flop counter with Enable

A 4-bit counter of this type is at $Q_3Q_2Q_1Q_0 = 0111$. Find the next count with $Enable = 1$ and with $Enable = 0$.

- $Enable = 1$: $D_0 = 1 \oplus 1 = 0$, $D_1 = 1 \oplus (1\cdot 1) = 0$, $D_2 = 1 \oplus (1\cdot 1\cdot 1) = 0$, $D_3 = 0 \oplus (1\cdot1\cdot1\cdot1) = 1$. Next count **1000**.
- $Enable = 0$: every AND output is 0, so $D_i = Q_i \oplus 0 = Q_i$. The count stays **0111**.

#### Timing limit

The slowest path in the counter runs from a flip-flop output, through the AND chain, through an XOR, and into the farthest $D$ input. For the chain in Figure 7.24 with $n$ bits, the clock period has to satisfy

$$T_{clk} \ge t_{cq} + (n-1)\,t_{AND} + t_{XOR} + t_{su}$$

where $t_{cq}$ is the clock-to-$Q$ delay, $t_{AND}$ and $t_{XOR}$ are the gate delays and $t_{su}$ is the flip-flop setup time. So a synchronous counter is much faster than a ripple counter, which needs $n$ **flip-flop** delays after the clock edge, but its speed still drops slowly as $n$ gets bigger.

### Output carry and cascading

The 4-bit counter has one more AND gate that produces an **output carry**:

$$Carry_{out} = Enable \cdot Q_0 Q_1 Q_2 Q_3$$

It's 1 only when counting is enabled **and** the counter is at its maximum count (1111 = 15), so it's about to roll over to 0. Its job is **cascading**: connect it to the $Enable$ of a second 4-bit counter and you get an 8-bit counter.

#### Example 7.19: Cascading two 4-bit counters

Two 4-bit counters make an 8-bit counter. The carry out of the lower one drives the $Enable$ of the upper one. Show what happens from 14 to 16.

|Lower 4 bits|Output carry|Upper 4 bits|Whole 8-bit count|
|---|---|---|---|
|1110|0|0000|14|
|1111|1|0000|15|
|0000|0|0001|16|

When the lower counter hits 1111, its carry goes HIGH and enables the upper counter. At the next clock edge the lower counter rolls over to 0000 and the upper one counts up by 1. The upper counter ticks once every 16 pulses.

### Counters with parallel load

Normally a counter starts at 0. To start at any other value, the counter needs inputs through which an initial count can be **loaded**. Brown & Vranesic Figure 7.25 does this by putting a **2-to-1 multiplexer** in front of every $D$ input:

- **Input 0** of each MUX is the normal counting logic (the XOR output).
- **Input 1** is the external data bit $D_i$.
- The select line is a control input, $Load$.

|$Load$|Mode|What happens at the next rising edge|
|---|---|---|
|0|Count|$Q$ counts up (if $Enable = 1$)|
|1|Parallel load|$Q_3Q_2Q_1Q_0 \leftarrow D_3D_2D_1D_0$|

With $Load = 1$ the counting logic is bypassed completely. With $Load = 0$ the circuit is the normal counter of Figure 7.24 (the equations above still apply).

The main parts are four edge-triggered D flip-flops (they share one clock, so they update together), four 2-to-1 MUXes (the steering switches), the XOR gates (toggle logic) and the AND chain (the carry that moves from the least to the most significant bit).

#### Example 7.20: Load, then count

A 4-bit counter with parallel load has $Enable = 1$ and data inputs $D_3D_2D_1D_0 = 1010$. $Load = 1$ for the first clock edge, then $Load = 0$. Find $Q$ after each of the first 5 edges.

|Edge|$Load$|$Q_3Q_2Q_1Q_0$ after|Note|
|---|---|---|---|
|1|1|1010|loaded (10)|
|2|0|1011|count|
|3|0|1100|count|
|4|0|1101|count|
|5|0|1110|count|

Loading is also how you get a counter that doesn't use the full $2^n$ states, because the counter can be sent back to a chosen start value before it runs out.

### BCD counter

A **BCD** (binary-coded decimal) counter counts $0$ to $9$ and then goes back to $0$. A plain 4-bit counter would keep going to 15, so the trick is to use **parallel load** to cut the count short:

1. The data inputs $D_3D_2D_1D_0$ are wired permanently to **0000**.
2. An AND gate watches $Q_3$ and $Q_0$. The count 9 is $1001$, which is the first count with $Q_3 = Q_0 = 1$, so the gate goes HIGH exactly when the digit reaches 9.
3. That signal goes to $Load$ (through an OR gate, so that an external $Clear$ can also force a load).
4. At the next clock edge the counter loads $0000$ instead of counting to 10.

Brown & Vranesic Figure 7.28 puts two of them together for a **two-digit BCD counter** (00 to 99):

- **Ones digit** ($BCD_0$): $Enable$ is permanently 1, so it counts every clock pulse. It wraps from 9 back to 0 using the method above.
- **Tens digit** ($BCD_1$): its $Enable$ is driven by the **ones digit's** "= 9" AND gate. So it's frozen almost all the time, and only counts when the ones digit is at 9, which is exactly when the ones digit is about to wrap. The ones digit goes $9 \to 0$ and the tens digit goes up by 1 at the same edge.
- **At 99:** a second AND gate checks that both digits are 9, and it loads the tens digit with 0000 too, so the display goes $99 \to 00$.
- **Clear:** a $Clear = 1$ signal goes to the $Load$ pins of both digits, and the next edge forces the display to $00$.

#### Example 7.21: Two-digit BCD counter

Show the count going from 28 to 31, and from 98 to the next valid count.

|Edge|Ones digit|Tens digit|What happened|
|---|---|---|---|
|start|8 (1000)|2 (0010)|tens frozen, ones $\ne 9$|
|1|9 (1001)|2|ones counts; AND gate now HIGH|
|2|0 (0000)|3 (0011)|ones loads 0; tens is enabled, so it counts|
|3|1 (0001)|3|tens frozen again|

From **98**: the ones digit goes to 9 (**99**). Both digits are 9, so both are loaded with 0000 on the next edge, giving **00**. The count never shows 100 and never shows an invalid BCD digit like 1010.

### Johnson counter

A **Johnson counter** (also called a **twisted-ring** or **switch-tail ring** counter) is a **shift register** where the **inverted** output of the last flip-flop is fed back to the data input of the first one:

$$D_0 = \overline{Q}_{n-1}, \qquad D_{i} = Q_{i-1} \; (i \ge 1)$$

An ordinary ring counter would feed $Q_{n-1}$ back instead. The inversion makes the register fill up with 1s one position at a time, and then empty with 0s one position at a time. All flip-flops are reset to 0 at the start.

#### Example 7.22: A 4-bit Johnson counter

Starting from $Q_3Q_2Q_1Q_0 = 0000$, list the states.

|Edge|$D_0 = \overline{Q}_3$|$Q_3Q_2Q_1Q_0$|
|---|---|---|
|start|–|0000|
|1|1|0001|
|2|1|0011|
|3|1|0111|
|4|1|1111|
|5|0|1110|
|6|0|1100|
|7|0|1000|
|8|0|0000|

- $n = 4$ flip-flops give **$2n = 8$** different states (compared to $2^n = 16$ for a binary counter), then the sequence repeats.
- **Only one bit changes** on each clock edge.
- Because of that, each state can be decoded with just a **2-input AND gate** (look at two neighbouring bits), and there are no glitches from several bits changing at once.

Johnson counters are used as hardware **frequency dividers** (prescalers), and as sequence generators, for example to drive a stepper motor.

## Key formulas

**Flip-flops needed for $m$ states**

$$
n = \lceil \log_2 m \rceil \tag{7.7}
$$

- $m$: number of states (the modulus); $n$: number of flip-flops

**Frequency division**

$$
f_{Q_i} = \frac{f_{CLK}}{2^{\,i+1}} \tag{7.8}
$$

- $f_{Q_i}$: frequency of the output of stage $i$ (stage 0 is the LSB)

**Synchronous up-counter, T flip-flops**

$$
T_0 = 1, \qquad T_i = Q_0Q_1\cdots Q_{i-1} \tag{7.9}
$$

**Synchronous up-counter, D flip-flops with enable**

$$
D_i = Q_i \oplus (Enable \cdot Q_0Q_1\cdots Q_{i-1}) \tag{7.10}
$$

**Output carry (4 bits)**

$$
Carry_{out} = Enable \cdot Q_0Q_1Q_2Q_3 \tag{7.11}
$$

**Counter with parallel load**

$$
D_i = \overline{Load}\cdot\big(Q_i \oplus (Enable \cdot Q_0\cdots Q_{i-1})\big) + Load \cdot D_i^{\text{ext}} \tag{7.12}
$$

- $D_i^{\text{ext}}$: the external data bit for stage $i$

**Johnson counter**

$$
D_0 = \overline{Q}_{n-1}, \qquad \text{number of states} = 2n \tag{7.13}
$$

## Common mistakes

- Thinking a ripple counter has the right count the instant after the clock edge. It passes through **transient** counts while the change ripples through the stages.
- Mixing up which output clocks the next stage. With positive edge-triggered flip-flops, $\overline{Q}$ gives an **up**-counter and $Q$ gives a **down**-counter.
- Using the wrong toggle condition in a synchronous counter. Stage $i$ toggles when **all lower bits are 1**, not just the bit right below it ($T_2 = Q_0Q_1$, not $Q_1$).
- Forgetting the XOR in a D flip-flop counter. A D flip-flop can't toggle on its own, so $D = Q \oplus (\text{toggle condition})$.
- Forgetting that $Enable = 0$ makes the counter **hold**, and that the output carry also needs $Enable = 1$.
- Ignoring the timing limit of the AND chain. The whole chain has to settle within one clock period minus the setup time.
- Loading the wrong value in a BCD counter. The data inputs are wired to **0000**, and the load fires at **9**, so the counter never shows 10.
- Feeding $Q_{n-1}$ (not $\overline{Q}_{n-1}$) back in a Johnson counter, which gives a plain ring counter instead.
- Saying an $n$-bit Johnson counter has $2^n$ states. It has $2n$.
