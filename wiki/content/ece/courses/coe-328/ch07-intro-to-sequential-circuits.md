---
title: "Ch 7: Introduction to Sequential Circuits"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§7.1–7.3, 7.4.2, 7.5, 7.8** · Lecture 8 · weeks 7–8

Everything up to now has been **combinational**, meaning the output only depends on the inputs right now. A **sequential** circuit also depends on what happened before, because it **stores** a bit. This chapter covers the two basic storage elements, **latches** (level-sensitive) and **flip-flops** (edge-triggered), in the S-R, D, J-K and T varieties, plus the asynchronous preset and clear inputs. It ends with **registers**, which are just several flip-flops sharing one clock, and the **shift register**.

## Notes

### Latches vs flip-flops

Both are **bistable**, meaning they have two stable states (storing a 0 or a 1) and stay in one until told to change. Both get this from **feedback**, where each gate's output is wired back into the input of the other gate.

The difference is **when** they're allowed to change:

|Device|Changes state…|Sensitive to|
|---|---|---|
|**Latch**|any time its inputs (and enable) say so|the **level** of the enable|
|**Flip-flop**|only at a **clock edge**|the **edge** (transition) of the clock|

The outputs are always $Q$ and $\overline{Q}$, which are normally complements of each other. **SET** means $Q = 1$; **RESET** (clear) means $Q = 0$.

### The S-R latch

**Active-HIGH S-R latch: two cross-coupled NOR gates.**

![[coe-328-sr-latch-nor.svg]]
*Figure 7.1: An active-HIGH S-R latch made of cross-coupled NOR gates.*

|$S$|$R$|$Q$|$\overline{Q}$|Mode|
|---|---|---|---|---|
|0|0|$Q$|$\overline{Q}$|**No change** (holds the stored bit)|
|1|0|1|0|**Set**|
|0|1|0|1|**Reset**|
|1|1|0|0|**Invalid** ($Q = \overline{Q}$)|

Why it holds: with $S = R = 0$, each NOR acts as an inverter of the other gate's output, so $Q$ keeps feeding back $\overline{Q}$ and the other way around. Whichever state it's in reinforces itself.

Why $S = R = 1$ is invalid: both NOR outputs are forced to 0, so $Q$ and $\overline{Q}$ aren't complements anymore. Even worse, if both inputs then go back to 0 at the same time, the latch ends up in an unpredictable state.

**Active-LOW $\overline{S}$-$\overline{R}$ latch: two cross-coupled NAND gates.** Same idea, but the inputs are active-LOW. A **0** sets or resets it, $\overline{S} = \overline{R} = 1$ holds, and $\overline{S} = \overline{R} = 0$ is invalid (both outputs go to 1).

|$\overline{S}$|$\overline{R}$|$Q$|Mode|
|---|---|---|---|
|1|1|$Q$|No change|
|0|1|1|Set|
|1|0|0|Reset|
|0|0|1 (and $\overline{Q} = 1$)|Invalid|

**Try it:** click time slots of $S$ and $R$ to change them. The latch starts RESET, and red marks the invalid state.

<div class="melon-logic" data-view="timing" data-device="srlatch">Interactive S-R latch (open this page on the site to use it).</div>

### Gated latches

A **gated latch** adds an **enable** input ($EN$, sometimes $G$). The latch only responds to its other inputs while $EN$ is HIGH. It's **level-sensitive**, so for the whole time $EN = 1$ the output follows the inputs.

**Gated S-R latch.** Two AND (or NAND) gates pass $S$ and $R$ through only when $EN = 1$:

- $EN = 0$: no change, whatever $S$ and $R$ do.
- $EN = 1$: behaves like a normal S-R latch ($S = R = 1$ is still invalid).

**Gated D latch.** This gets rid of the invalid state by having just **one** data input $D$, with $S = D$ and $R = \overline{D}$ inside:

|$EN$|$D$|$Q$|Mode|
|---|---|---|---|
|0|X|$Q$|No change|
|1|0|0|Reset|
|1|1|1|Set|

In short: **while $EN = 1$, $Q$ follows $D$. When $EN$ goes to 0, $Q$ holds the last value of $D$.**

**Try it:** switch between the gated S-R and D latch, and edit the inputs. The shaded columns are where $EN$ is HIGH, and those are the only places $Q$ can change.

<div class="melon-logic" data-view="timing" data-device="gsr,dlatch">Interactive gated latches (open this page on the site to use it).</div>

### Edge-triggered flip-flops

A **flip-flop** only changes state at one instant, the **triggering edge** of the clock ($CLK$, or control input $C$). Everywhere else, its inputs are ignored.

- **Positive edge-triggered:** changes on the **rising** edge (0 → 1). The symbol has no bubble on $C$.
- **Negative edge-triggered:** changes on the **falling** edge (1 → 0). The symbol has a bubble on $C$.
- The small **triangle** at the $C$ input (the **dynamic input indicator**) is how you tell a flip-flop from a latch on a schematic.

The data inputs ($D$, or $J$ and $K$) are called **synchronous** inputs because their effect is synchronized with the clock.

### D flip-flop

On the triggering edge, **$Q$ takes the value of $D$**. Between edges, $D$ can change freely without affecting $Q$, except for a very short window right around the edge where it has to be stable.

|$D$|$CLK$|$Q$|Mode|
|---|---|---|---|
|1|↑|1|Set (stores 1)|
|0|↑|0|Reset (stores 0)|

So **$Q$ follows $D$ at the clock edge**, and holds that value until the next edge.

### Master-slave D flip-flop

One way to build an edge-triggered flip-flop is from **two gated D latches** in a row, with the clock inverted for the second one (Brown & Vranesic Figure 7.10):

- The **master** latch is enabled while $Clock = 1$. Its output $Q_m$ follows $D$ the whole time the clock is HIGH.
- The **slave** latch is enabled while $Clock = 0$. It copies $Q_m$ to the output $Q = Q_s$.

The two are never transparent at the same time, which is the trick:

- **Clock HIGH:** the master tracks $D$, and the slave holds, so $Q$ doesn't change.
- **Clock goes 1 → 0:** the master freezes on whatever $D$ was at that instant, and the slave passes that value to $Q$.
- **Clock LOW:** $Q_m$ can't change, so the slave can change **at most once** per clock cycle.

From outside, the circuit changes state only at the **negative (falling) edge** of the clock. However many times $D$ changes during a cycle, $Q$ only shows the value $D$ had at the falling edge. Its symbol has the triangle with a bubble on the clock input.

### J-K flip-flop

It's like an S-R flip-flop ($J$ = set, $K$ = reset), except $J = K = 1$ is useful instead of invalid, because it **toggles** the output.

|$J$|$K$|$CLK$|$Q$ after the edge|Mode|
|---|---|---|---|---|
|0|0|↑|$Q$|No change|
|0|1|↑|0|Reset|
|1|0|↑|1|Set|
|1|1|↑|$\overline{Q}$|**Toggle**|

**Try it:** switch between the D and J-K flip-flops. The clock is fixed, and the dashed lines mark its rising edges, which are the only instants $Q$ can change.

<div class="melon-logic" data-view="timing" data-device="dff,jkff">Interactive flip-flops (open this page on the site to use it).</div>

### Asynchronous preset and clear

Most flip-flop chips also have **asynchronous** inputs that act **right away, no matter what the clock is doing**:

- **Preset** ($PRE$, or direct set $S_D$): forces $Q = 1$.
- **Clear** ($CLR$, or direct reset $R_D$): forces $Q = 0$.

They're usually **active-LOW** (bubbles on the symbol):

|$\overline{PRE}$|$\overline{CLR}$|Effect|
|---|---|---|
|1|1|Normal clocked operation|
|0|1|$Q = 1$ right away|
|1|0|$Q = 0$ right away|
|0|0|Not used (invalid)|

For normal synchronous operation, keep both HIGH. They're mostly used to put the flip-flop in a known state at power-up.

**Try it:** pull $\overline{PRE}$ or $\overline{CLR}$ LOW and watch $Q$ change right away instead of at the next edge.

<div class="melon-logic" data-view="timing" data-device="dffpc">Interactive D flip-flop with preset and clear (open this page on the site to use it).</div>

### T flip-flop

A D flip-flop can be made to act like a different kind of storage element by putting a little logic in front of $D$. Feeding $Q$ back through a 2-to-1 multiplexer controlled by $T$ (Brown & Vranesic Figure 7.16) gives

$$D = T\,\overline{Q} + \overline{T}\,Q = T \oplus Q$$

- $T = 0$: $D = Q$, so the next edge stores the same value. **Hold.**
- $T = 1$: $D = \overline{Q}$, so the next edge flips the output. **Toggle.**

|$T$|$Q(t+1)$|Mode|
|---|---|---|
|0|$Q(t)$|No change|
|1|$\overline{Q}(t)$|Toggle|

$Q(t)$ is the state before the edge and $Q(t + 1)$ is the state right after it. A J-K flip-flop with $J = K = T$ does the same thing.

### Configurable flip-flops

For some circuits one flip-flop type gives a cheaper implementation than another. General-purpose chips like **PLDs** (see [[ch03-implementation-technology|Ch 3]]) often have **configurable** flip-flops that can be set up as D, T, or another type.

### Registers

A flip-flop holds **one bit**. A **register** is a group of flip-flops side by side that holds a multi-bit value (a number, an address, an instruction): 4 flip-flops make a 4-bit register, 8 make an 8-bit register, and so on. All of them share the **same clock**, so every bit updates on the same edge and the group acts as one unit.

### Shift registers

A **shift register** can move its contents one bit position on each clock edge. In a 4-bit right-shift register (Figure 7.2), each D flip-flop's $Q$ feeds the next one's $D$:

![[coe-328-shift-register.svg]]
*Figure 7.2: A 4-bit shift register. On each rising edge, $In \to Q_1 \to Q_2 \to Q_3 \to Q_4 = Out$.*

- Data comes in **serially**, one bit per clock cycle, on $In$.
- At every rising edge, each flip-flop takes the old value of the one to its left.
- After 4 edges, the first bit that went in comes out at $Out$.

> [!warning] A shift register needs **edge-triggered** (or master-slave) flip-flops. With gated latches, while the clock is HIGH every latch is transparent, so a change on $In$ would race through several stages in one cycle instead of moving one place.

## Key formulas

**S-R latch (active-HIGH)**

$$
S = 1, R = 0 \Rightarrow Q = 1; \quad S = 0, R = 1 \Rightarrow Q = 0; \quad S = R = 0 \Rightarrow \text{hold}; \quad S = R = 1 \text{ invalid} \tag{7.1}
$$

**Gated D latch**

$$
Q = \begin{cases} D & EN = 1 \\ Q_{\text{previous}} & EN = 0 \end{cases} \tag{7.2}
$$

**D flip-flop**

$$
Q_{\text{next}} = D \quad (\text{at the triggering edge}) \tag{7.3}
$$

- $Q_{\text{next}}$: the output right after the clock edge
- $D$: the data input just before the edge

**J-K flip-flop**

$$
Q_{\text{next}} = J\,\overline{Q} + \overline{K}\,Q \quad (\text{at the triggering edge}) \tag{7.4}
$$

- $Q$: the output before the edge
- $J$: set input; $K$: reset input. $J = K = 1$ toggles.

Check: $J = K = 0$ gives $Q$ (hold), $J = K = 1$ gives $\overline{Q}$ (toggle).

**T flip-flop**

$$
Q(t+1) = T \oplus Q(t) = T\,\overline{Q}(t) + \overline{T}\,Q(t) \tag{7.5}
$$

- $Q(t)$: the output before the edge
- $T$: toggle input. $T = 0$ holds, $T = 1$ toggles.

**Shift register** (right shift, $n$ stages)

$$
Q_1(t+1) = In, \qquad Q_{i+1}(t+1) = Q_i(t) \tag{7.6}
$$

- $Q_i$: output of stage $i$ ($Q_n = Out$)

## Examples

These are based on the Lecture 8 examples, with different input sequences written as tables (each column is one time interval).

### Example 1: S-R latch

> Like the S-R latch slides

An active-HIGH S-R latch starts RESET ($Q = 0$). Find $Q$ for this input sequence.

|Interval|1|2|3|4|5|6|
|---|---|---|---|---|---|---|
|$S$|1|0|0|0|1|0|
|$R$|0|0|1|0|0|0|
|$Q$|**1**|**1**|**0**|**0**|**1**|**1**|

- Interval 1: set. Interval 2: hold (stays 1). Interval 3: reset. Interval 4: hold (stays 0). Interval 5: set. Interval 6: hold.

### Example 2: Active-LOW latch

> Like the NAND latch slide

A NAND $\overline{S}$-$\overline{R}$ latch starts SET ($Q = 1$). Find $Q$ for $\overline{S}\,\overline{R} = 11, 10, 11, 01, 11$.

|$\overline{S}$|1|1|1|0|1|
|---|---|---|---|---|---|
|$\overline{R}$|1|0|1|1|1|
|$Q$|**1**|**0**|**0**|**1**|**1**|

- $11$: hold. $10$: $\overline{R}$ is LOW, so reset. $11$: hold. $01$: $\overline{S}$ is LOW, so set. $11$: hold.

### Example 3: Gated S-R latch

> Like Lecture 8, Example 1

A gated S-R latch starts RESET. Find $Q$.

|Interval|1|2|3|4|5|6|7|
|---|---|---|---|---|---|---|---|
|$EN$|0|1|0|1|1|0|1|
|$S$|1|1|0|0|0|1|0|
|$R$|0|0|0|1|0|0|0|
|$Q$|**0**|**1**|**1**|**0**|**0**|**0**|**0**|

- Interval 1: $S = 1$ but $EN = 0$, so nothing happens.
- Interval 2: $EN = 1$, $S = 1$ → set.
- Interval 4: $EN = 1$, $R = 1$ → reset.
- Interval 6: $S = 1$ again, but $EN = 0$, so it stays 0. Interval 7: $EN = 1$ but $S = R = 0$ → hold.

### Example 4: Gated D latch

> Like Lecture 8, Example 2

A gated D latch starts RESET. Find $Q$.

|Interval|1|2|3|4|5|6|7|8|
|---|---|---|---|---|---|---|---|---|
|$EN$|1|1|0|0|1|1|0|0|
|$D$|1|0|1|0|1|1|0|1|
|$Q$|**1**|**0**|**0**|**0**|**1**|**1**|**1**|**1**|

While $EN = 1$, $Q$ copies $D$ (intervals 1–2 and 5–6). While $EN = 0$, $Q$ keeps whatever $D$ was when $EN$ fell, no matter what $D$ does after that.

### Example 5: D flip-flop

> Like Lecture 8, "D Flip-Flop" example

A positive edge-triggered D flip-flop starts RESET. The value of $D$ at each of five rising clock edges is $1, 1, 0, 1, 0$. Find $Q$ after each edge.

|Rising edge|1|2|3|4|5|
|---|---|---|---|---|---|
|$D$ at the edge|1|1|0|1|0|
|$Q$ after|**1**|**1**|**0**|**1**|**0**|

$\overline{Q}$ is always the opposite: $0, 0, 1, 0, 1$. Changes in $D$ **between** edges have no effect.

### Example 6: J-K flip-flop

> Like Lecture 8, Example 4

A positive edge-triggered J-K flip-flop starts RESET. Find $Q$ after each edge.

|Rising edge|1|2|3|4|5|6|
|---|---|---|---|---|---|---|
|$J$|1|0|1|1|0|1|
|$K$|0|0|1|1|1|1|
|Mode|set|hold|toggle|toggle|reset|toggle|
|$Q$ after|**1**|**1**|**0**|**1**|**0**|**1**|

### Example 7: Latch vs flip-flop on the same inputs

> Ties together Examples 4 and 5

$D$ and a control signal are fed to both a gated D latch (control = $EN$) and a positive edge-triggered D flip-flop (control = $CLK$). Both start RESET. The control goes HIGH during interval 2 and stays HIGH through interval 4, and $D$ goes $0, 1, 0, 1, 0$ across intervals 1–5. Compare $Q$.

|Interval|1|2|3|4|5|
|---|---|---|---|---|---|
|Control|0|1|1|1|0|
|$D$|0|1|0|1|0|
|$Q$ (D latch)|0|**1**|**0**|**1**|1|
|$Q$ (D flip-flop)|0|**1**|1|1|1|

- The **latch** is transparent the whole time the control is HIGH, so it copies every change of $D$ in intervals 2–4 and then holds the last value (1).
- The **flip-flop** only looks at $D$ at the single rising edge (the start of interval 2), where $D = 1$, and ignores everything else.

### Example 8: Asynchronous preset and clear

> Like Lecture 8, Example 5

A positive edge-triggered D flip-flop with active-LOW $\overline{PRE}$ and $\overline{CLR}$ starts with $Q = 0$, and $D = 1$ the whole time. Find $Q$.

|Interval|1|2|3|4|5|6|
|---|---|---|---|---|---|---|
|Rising edge at start?|no|yes|no|yes|no|yes|
|$\overline{PRE}$|1|1|1|1|0|1|
|$\overline{CLR}$|0|0|1|1|1|0|
|$Q$|**0**|**0**|**0**|**1**|**1**|**0**|

- Intervals 1–2: $\overline{CLR}$ is LOW, so $Q$ is held at 0 even though there's an edge with $D = 1$ in interval 2.
- Interval 4: both inputs are HIGH, so the edge clocks in $D = 1$.
- Interval 5: $\overline{PRE}$ LOW forces $Q = 1$ (it already is).
- Interval 6: $\overline{CLR}$ LOW forces $Q = 0$ right away, overriding the clock edge.

### Example 9: Master-slave D flip-flop

> Like Figure 7.10

A master-slave D flip-flop starts with $Q = 0$. Each clock cycle is split into a HIGH half and a LOW half, and $D$ is given at the start and end of each HIGH half. Find $Q_m$ and $Q$.

|Clock cycle|1|2|3|
|---|---|---|---|
|$D$ during the HIGH half|$0 \to 1$|$1 \to 0 \to 1$|$1 \to 0$|
|$Q_m$ at the falling edge|1|1|0|
|$Q$ after the falling edge|**1**|**1**|**0**|

- While the clock is HIGH, $Q_m$ follows every change of $D$, but $Q$ doesn't move.
- At each falling edge the slave copies $Q_m$, so $Q$ only ever shows the value $D$ had at that instant. The extra changes of $D$ in cycle 2 never reach $Q$.

### Example 10: T flip-flop

> Like Figure 7.16

A positive edge-triggered T flip-flop starts RESET. The value of $T$ at six rising edges is $1, 0, 1, 1, 0, 1$. Find $Q$ after each edge.

|Rising edge|1|2|3|4|5|6|
|---|---|---|---|---|---|---|
|$T$|1|0|1|1|0|1|
|Mode|toggle|hold|toggle|toggle|hold|toggle|
|$Q$ after|**1**|**1**|**0**|**1**|**1**|**0**|

With $T$ held at 1, the output would toggle on every edge, giving a square wave at **half** the clock frequency. That's the basic idea behind counters (Ch 8).

### Example 11: Shift register

> Like Figure 7.18

A 4-bit right-shift register starts at $Q_1Q_2Q_3Q_4 = 0000$. The bits on $In$ before six rising edges are $1, 1, 0, 1, 0, 0$. Find the contents after each edge.

|After edge|$In$|$Q_1$|$Q_2$|$Q_3$|$Q_4 = Out$|
|---|---|---|---|---|---|
|start|–|0|0|0|0|
|1|1|1|0|0|0|
|2|1|1|1|0|0|
|3|0|0|1|1|0|
|4|1|1|0|1|1|
|5|0|0|1|0|1|
|6|0|0|0|1|0|

Each row is the row above shifted one place right, with the new $In$ bit entering at $Q_1$. The first bit in (1, at edge 1) reaches $Out$ at edge 4.

## Common mistakes

- Treating a gated latch like a flip-flop. A latch follows its inputs for the **whole time** $EN$ is HIGH, not just at the edge.
- Forgetting that the NAND latch is **active-LOW**. $\overline{S} = 0$ sets it, and $11$ is the hold state.
- Using $S = R = 1$ on an S-R latch. It's invalid, and the J-K flip-flop is the version where $1, 1$ is allowed (toggle).
- Letting $Q$ change between clock edges on a flip-flop. Only the edge (and the asynchronous inputs) can change it.
- Reading $D$ **after** the edge instead of just before it.
- Waiting for a clock edge to apply $\overline{PRE}$ or $\overline{CLR}$. They're **asynchronous**, so they act right away.
- Thinking a master-slave flip-flop changes on the rising edge. The master loads while the clock is HIGH, but $Q$ only changes at the **falling** edge.
- Writing $D = Q$ for $T = 1$ in the T flip-flop circuit. It's $D = \overline{Q}$; $D = Q$ is the hold case ($T = 0$).
- Building a shift register out of gated latches. While the clock is HIGH the bit would race through more than one stage.
