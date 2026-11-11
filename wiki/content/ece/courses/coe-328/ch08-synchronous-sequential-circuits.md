---
title: "Ch 8: Synchronous Sequential Circuits"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§8.1, 8.3, 8.7** · weeks 10–11

[[ch07-intro-to-sequential-circuits|Ch 7]] gave us the storage elements and [[ch07b-counters|counters]] showed one useful circuit built from them. This chapter turns that into a general method. A **finite state machine (FSM)** is a sequential circuit described by a **finite number of states**. The design process takes a written specification, turns it into a **state diagram** and a **state table**, assigns binary codes to the states, and then derives the logic for the flip-flops. It covers the two kinds of machine, **Moore** (output depends on the state only) and **Mealy** (output depends on the state and the input), and finishes by designing a modulo-8 counter with this method, once with D flip-flops and once with J-K flip-flops.

## Notes

### Sequential circuits and memory

|Circuit|Output depends on…|Example|
|---|---|---|
|**Combinational**|the present inputs only|decoder, adder|
|**Storage**|the previous state, not the present inputs|flip-flop|
|**Sequential**|the present inputs **and** stored information (the previous state)|counter, sequence detector|

The key idea is that **a sequential circuit has memory**. The **state** records whatever is relevant about the input history, and the circuit updates the state at specified clock edges.

There are two types:

- **Synchronous:** a clock signal controls the operation.
- **Asynchronous:** no clock is used (that's Ch 9).

A **synchronous sequential circuit** is built from flip-flops and combinational logic. Its parts:

- **Primary inputs** ($w$): the inputs to the circuit.
- **Flip-flops** ($y$): store the **present state**.
- **Next-state logic:** a combinational circuit that uses the present state and the inputs to work out the next state ($Y$).
- **Output logic:** a combinational circuit that produces the outputs ($z$).

How it runs, over and over:

1. The flip-flops hold the present state $y$.
2. The next-state logic uses $y$ and $w$ to compute the next state $Y$.
3. At the active clock edge, the flip-flops load $Y$.
4. The circuit is now in the new state.

Because the flip-flops are edge-triggered, only **one** state transition can happen per clock cycle. Another name for a synchronous sequential circuit is a **finite state machine (FSM)**.

> [!note] Notation: lowercase $y$ is the **present** state (the flip-flop outputs) and uppercase $Y$ is the **next** state (the values that will be loaded at the next edge). For a D flip-flop, $D = Y$.

### Basic design steps (the sequence detector)

The running example for §8.1 is a **sequence detector**.

> **Specification:** one input $w$ and one output $z$. All state changes happen on the rising clock edge. $z = 1$ when $w$ was 1 during the two immediately preceding clock cycles, and $z = 0$ otherwise. So the circuit detects two or more consecutive 1s.

#### Why memory is needed

The same present input can need different outputs depending on what happened earlier:

|Previous $w$|Present $w$|Required $z$|
|---|---|---|
|0|0|0|
|1|0|0|
|0|1|0|
|1|1|1|

Look at the rows with present $w = 1$: one needs $z = 0$ and the other needs $z = 1$. So $z$ can't be found from $w$ alone. The circuit must **remember** whether a 1 was seen in the previous clock cycle, and that stored information is the **state**.

### State diagram

A **state diagram** shows the behaviour of the circuit graphically:

- **Circles (nodes)** are states.
- **Directed arrows (arcs)** are transitions between states.
- **Labels on the arrows** give the input condition for that transition.

Read an arrow as: if the machine is in the state at the tail of the arrow and the input condition is true at the active clock edge, it moves to the state at the head.

The detector needs three states:

|State|Remembered information|$z$|
|---|---|---|
|A|no consecutive 1s detected yet (also the **reset** state)|0|
|B|one 1 has been detected|0|
|C|two or more consecutive 1s have been detected|1|

![[coe-328-moore-detector.svg]]
*Figure 8.1: State diagram of the Moore sequence detector. The output $z$ is written inside each state.*

Transitions:

- **A:** $w = 0$, stay in A. $w = 1$, go to B.
- **B:** $w = 0$, back to A. $w = 1$, go to C.
- **C:** $w = 1$, stay in C. $w = 0$, back to A.

The output is shown **inside the state circles** because it depends only on the present state. A machine like that is a **Moore** machine.

### State table

The **state table** lists the next state and output for **every** present state and every input value.

|Present state|Next state ($w = 0$)|Next state ($w = 1$)|Output $z$|
|---|---|---|---|
|A|A|B|0|
|B|A|C|0|
|C|A|C|1|

Notes on the design:

- **State A** is the starting state, and the machine stays in A while $w = 0$.
- **State B** records the first 1. The output stays 0.
- **State C** means two or more consecutive 1s have been detected, so $z = 1$.
- **Reset** forces the machine to the starting state A from any state. In hardware it's implemented by an input on the flip-flops that clears all of them to 0. It's shown separately instead of drawing a Reset arrow out of every state, so the diagram stays readable.

#### Example 8.1: Tracing the Moore detector

The machine starts in A (after Reset). The input $w$ at six successive rising edges is $1, 1, 1, 0, 1, 0$. Find the state and output after each edge.

|Edge|$w$|State after|$z$ after|
|---|---|---|---|
|start|–|A|0|
|1|1|B|0|
|2|1|C|1|
|3|1|C|1|
|4|0|A|0|
|5|1|B|0|
|6|0|A|0|

$z$ only becomes 1 **after** the edge at which the second 1 is sampled, because $z$ depends on the state and the state only changes at the edge.

### State assignment

Flip-flops store 0s and 1s, so the symbolic states A, B, C have to be given **binary codes**. Each bit of the code is a **state variable**, and each state variable is one flip-flop.

$n$ flip-flops can encode $2^n$ states, so the number of flip-flops is

$$n = \lceil \log_2 (\text{number of states}) \rceil$$

#### Example 8.2: How many state variables?

How many flip-flops are needed for (a) the 3-state detector, (b) an 8-state counter, (c) a 5-state machine?

- **(a)** $2^1 = 2 < 3 \le 2^2 = 4$, so **2** flip-flops.
- **(b)** $2^3 = 8$, so **3** flip-flops.
- **(c)** $2^2 = 4 < 5 \le 2^3 = 8$, so **3** flip-flops.

For the detector, use two variables $y_2y_1$:

|$y_2y_1$|State|
|---|---|
|00|A|
|01|B|
|10|C|
|11|unused|

The unused code 11 can be treated as a **don't-care** when simplifying, which lets the K-map groups get bigger.

The **state-assigned table** shows next-state variables $Y_2Y_1$ and the output $z$. For a Moore machine, $z$ is a function of the present state only.

|Present state $y_2y_1$|$w = 0$: $Y_2Y_1$|$w = 1$: $Y_2Y_1$|$z$|
|---|---|---|---|
|00 (A)|00|01|0|
|01 (B)|00|10|0|
|10 (C)|00|10|1|
|11|dd|dd|d|

Here $d$ means don't-care. This table is a **truth table** for three functions: $Y_1$, $Y_2$ and $z$.

### Choosing flip-flops and deriving the logic

With **D flip-flops** the design is straightforward, because the next-state functions connect straight to the $D$ inputs:

$$D_1 = Y_1, \qquad D_2 = Y_2$$

Read the functions from the state-assigned table and simplify with K-maps (using 11 as don't-care):

- $Y_1 = 1$ only for $y_2y_1 = 00$ with $w = 1$, so $Y_1 = w\,\overline{y}_1\overline{y}_2$.
- $Y_2 = 1$ for $y_2y_1 = 01$ or $10$ with $w = 1$. With the don't-care at 11, the groups grow to $Y_2 = w\,y_1 + w\,y_2$.
- $z = y_2$, since $z = 1$ only in state C ($y_2y_1 = 10$) and 11 is a don't-care.

$$
Y_1 = w\,\overline{y}_1\overline{y}_2, \qquad Y_2 = w\,y_1 + w\,y_2, \qquad z = y_2 \tag{8.1}
$$

#### Example 8.3: Timing of the circuit

Use equations (8.1) to follow the circuit from $y_2y_1 = 00$ for $w = 1, 1, 1, 0$.

|Edge|$w$|$Y_1 = w\overline{y}_1\overline{y}_2$|$Y_2 = wy_1 + wy_2$|New $y_2y_1$|$z = y_2$|
|---|---|---|---|---|---|
|1|1|1|0|01 (B)|0|
|2|1|0|1|10 (C)|1|
|3|1|0|1|10 (C)|1|
|4|0|0|0|00 (A)|0|

This matches Example 8.1, so the circuit really implements the state table.

### The full design procedure

|Step|Design activity|Main result|
|---|---|---|
|1|Read and clarify the specification|inputs, outputs, timing requirements|
|2|Identify the states and transitions|state diagram|
|3|Record the transitions for every input case|state table|
|4|Minimize the number of states if possible|reduced state table|
|5|Choose state variables and assign codes|state-assigned table|
|6|Choose the flip-flop type, derive next-state and output logic|Boolean equations|
|7|Implement and verify the circuit|gate-level circuit and timing check|

Always check that **every** state/input combination has a defined next state.

### Mealy state model

In a **Moore** machine the output depends only on the present state, $z = f(y)$, and it's drawn **inside** the state circle. In a **Mealy** machine the output depends on the present state **and** the present input, $z = f(y, w)$, and it's drawn **on the arrows** as `input / output`.

|Moore|Mealy|
|---|---|
|$z = f(y)$|$z = f(y, w)$|
|output shown in the state circle|output shown on the transition arrow|
|output changes only after the clock edge|output can change as soon as the input changes|

Mealy machines can often use **fewer states**, and respond to an input without waiting for another state transition.

#### The same detector as a Mealy machine

New specification: $z$ becomes 1 during the **same** clock cycle in which the second consecutive 1 is present on $w$. That can be done with only **two** states:

- **A:** the last input was not a 1 (or reset).
- **B:** the last input was a 1.

![[coe-328-mealy-detector.svg]]
*Figure 8.2: State diagram of the Mealy sequence detector. Each arrow is labelled input / output.*

|Present state|Next state ($w = 0$)|Next state ($w = 1$)|Output $z$|
|---|---|---|---|
|A|A|B|0|
|B|A|B|$z = w$|

In B with $w = 1$ the second consecutive 1 is present right now, so $z = 1$ in the same cycle. In B with $w = 0$ the output is 0.

Let $y$ be the single state bit, with $A = 0$ and $B = 1$:

- From either state, $w = 0$ goes to A (next state 0) and $w = 1$ goes to B (next state 1). So $Y = w$, and with a D flip-flop $D = Y = w$.
- In state A the output is always 0. In state B the output is 1 only when $w = 1$. So $z = w\,y$.

$$
D = Y = w, \qquad z = w\,y \tag{8.2}
$$

Compare this with the Moore version: three states, two flip-flops and equations (8.1), against two states, **one** flip-flop and two simple equations.

#### Example 8.4: Moore vs Mealy output timing

Both detectors are reset to A. The input is $w = 0, 1, 1, 1, 0, 0$ in clock cycles 1 to 6. Find $z$ for each.

|Cycle|1|2|3|4|5|6|
|---|---|---|---|---|---|---|
|$w$|0|1|1|1|0|0|
|Moore state (during the cycle)|A|A|B|C|C|A|
|**Moore $z$**|0|0|0|**1**|**1**|0|
|Mealy state (during the cycle)|A|A|B|B|B|A|
|**Mealy $z$**|0|0|**1**|**1**|0|0|

- Moore: $z$ rises in cycle 4, one cycle after the second 1 is applied (cycle 3). It also stays 1 for one cycle after $w$ falls.
- Mealy: $z$ rises in cycle 3, the cycle in which the second 1 is on $w$. It also falls in cycle 5 as soon as $w$ is 0.

So the **Mealy output is one clock cycle earlier**. The price is that a Mealy output depends on the input, so if $w$ changes in the middle of a clock cycle, $z$ can change in the middle of the cycle too.

### Design of a counter: the sequential-circuit approach

In [[ch07b-counters|the counters chapter]] counters were built from cascaded stages with some gating logic. A counter is also just a synchronous FSM, so we can design one with the same steps. The specification:

- The count sequence is $0, 1, 2, \dots, 6, 7, 0, 1, \dots$
- There's an input $w$, looked at in each clock cycle. If $w = 0$ the count stays the same. If $w = 1$ the count goes up by 1.

#### State diagram and state table for a modulo-8 counter

There is one state for each count: A is count 0, B is count 1, and so on up to H for count 7. The output is the count itself and depends only on the state, so this is a Moore machine.

|Present state|Next ($w = 0$)|Next ($w = 1$)|Output (count)|
|---|---|---|---|
|A|A|B|0|
|B|B|C|1|
|C|C|D|2|
|D|D|E|3|
|E|E|F|4|
|F|F|G|5|
|G|G|H|6|
|H|H|A|7|

#### State assignment

Eight states need **three** state variables $y_2y_1y_0$. The simplest assignment is to **encode each state with the number the counter should output** in that state. Then the output signals $z_2z_1z_0$ are the same as the state variables, and no output logic is needed.

|State|Present $y_2y_1y_0$|Next ($w = 0$) $Y_2Y_1Y_0$|Next ($w = 1$) $Y_2Y_1Y_0$|Count $z_2z_1z_0$|
|---|---|---|---|---|
|A|000|000|001|000|
|B|001|001|010|001|
|C|010|010|011|010|
|D|011|011|100|011|
|E|100|100|101|100|
|F|101|101|110|101|
|G|110|110|111|110|
|H|111|111|000|111|

Next we pick the flip-flop type. They must be **edge-triggered**, so that only one transition happens per clock cycle.

#### Implementation using D flip-flops

Each next-state function $Y_i$ goes to the $D$ input of flip-flop $y_i$. K-maps of the table above give

$$
\begin{aligned}
D_0 = Y_0 &= \overline{w}\,y_0 + w\,\overline{y}_0 \\
D_1 = Y_1 &= \overline{w}\,y_1 + y_1\overline{y}_0 + w\,y_0\overline{y}_1 \\
D_2 = Y_2 &= \overline{w}\,y_2 + \overline{y}_0\,y_2 + \overline{y}_1\,y_2 + w\,y_0y_1\overline{y}_2
\end{aligned} \tag{8.3}
$$

The first one is just $D_0 = w \oplus y_0$. Each equation is of the form "hold ($\overline{w}\,y_i$, or $y_i$ with some lower bit 0) or toggle (all lower bits and $w$ are 1)", which is the same toggle idea as the synchronous counters.

#### Example 8.5: Checking the D-flip-flop equations

Find the next state from $y_2y_1y_0 = 011$ with $w = 1$, and from $001$ with $w = 1$.

- From $011$, $w = 1$: $D_0 = 1\oplus 1 = 0$. $D_1 = 0 + y_1\overline{y}_0 + wy_0\overline{y}_1 = (1\cdot 0) + (1\cdot1\cdot0) = 0$. $D_2 = 0 + \overline{y}_0y_2 + \overline{y}_1y_2 + wy_0y_1\overline{y}_2 = 0 + 0 + 0 + (1\cdot1\cdot1\cdot1) = 1$. Next state **100**. ✓
- From $001$, $w = 1$: $D_0 = 1\oplus 1 = 0$. $D_1 = 0 + (0\cdot 0) + (1\cdot1\cdot1) = 1$. $D_2 = 0$. Next state **010**. ✓

#### Implementation using J-K flip-flops

J-K flip-flops are an attractive alternative, but now each flip-flop needs a $J$ and a $K$ function. What the inputs must be depends on the required transition, and one of the two inputs is often a **don't-care** $d$ (it can be 0 or 1 and the transition is the same):

|Flip-flop must go|$J$|$K$|Why|
|---|---|---|---|
|$0 \to 0$ (stay 0)|0|$d$|not set; reset or hold both keep 0|
|$0 \to 1$ (set)|1|$d$|set or toggle both give 1|
|$1 \to 1$ (stay 1)|$d$|0|not reset; set or hold both keep 1|
|$1 \to 0$ (reset)|$d$|1|reset or toggle both give 0|

Applying this to every row gives the **excitation table** for the counter. As an example, take the first row ($y_2y_1y_0 = 000$): with $w = 0$ the next state is also 000, so every flip-flop stays 0, giving $J = 0$, $K = d$ for all three. With $w = 1$ the next state is 001, so flip-flops $y_2$ and $y_1$ still stay at 0 ($J = 0$, $K = d$) but $y_0$ goes $0 \to 1$, so $J_0 = 1$, $K_0 = d$.

|Present $y_2y_1y_0$|$w=0$: $J_2K_2$, $J_1K_1$, $J_0K_0$|$w=1$: next state|$w=1$: $J_2K_2$, $J_1K_1$, $J_0K_0$|
|---|---|---|---|
|000|0d, 0d, 0d|001|0d, 0d, 1d|
|001|0d, 0d, d0|010|0d, 1d, d1|
|010|0d, d0, 0d|011|0d, d0, 1d|
|011|0d, d0, d0|100|1d, d1, d1|
|100|d0, 0d, 0d|101|d0, 0d, 1d|
|101|d0, 0d, d0|110|d0, 1d, d1|
|110|d0, d0, 0d|111|d0, d0, 1d|
|111|d0, d0, d0|000|d1, d1, d1|

(For $w = 0$ the next state is always the present state, so only the J-K inputs are shown.)

This is a truth table with inputs $y_2, y_1, y_0, w$ and outputs $J_2, K_2, J_1, K_1, J_0, K_0$. K-maps with the don't-cares give

$$
J_0 = K_0 = w, \qquad J_1 = K_1 = w\,y_0, \qquad J_2 = K_2 = w\,y_0y_1 \tag{8.4}
$$

Every $J$ equals its $K$, so each flip-flop is acting as a **T flip-flop** with a toggle condition of "$w$ and all the lower bits are 1". The circuit needs just two AND gates in total, and it extends to larger counters easily (stage $i$ gets one more AND input), while the D version needs bigger and bigger sum-of-products logic.

#### Example 8.6: Checking the J-K equations

Find the next state from $y_2y_1y_0 = 011$ with $w = 1$, and from $110$ with $w = 0$.

- From $011$, $w = 1$: $J_0 = K_0 = 1$, $J_1 = K_1 = wy_0 = 1$, $J_2 = K_2 = wy_0y_1 = 1$. All three toggle, so $011 \to$ **100**. ✓
- From $110$, $w = 0$: every $J = K = 0$, so all three hold, and the state stays **110**. ✓

## Key formulas

**Moore and Mealy outputs**

$$
\text{Moore: } z = f(y), \qquad \text{Mealy: } z = f(y, w) \tag{8.5}
$$

- $y$: present state (flip-flop outputs); $w$: present input

**Number of state variables**

$$
n = \lceil \log_2 (\text{number of states}) \rceil \tag{8.6}
$$

**Next state with D flip-flops**

$$
D_i = Y_i \tag{8.7}
$$

- $Y_i$: next-state function of state variable $i$

**J-K excitation**

$$
0\to0: (J,K) = (0,d); \quad 0\to1: (1,d); \quad 1\to1: (d,0); \quad 1\to0: (d,1) \tag{8.8}
$$

**Moore 2-ones detector** (states $y_2y_1$: A = 00, B = 01, C = 10)

$$
Y_1 = w\,\overline{y}_1\overline{y}_2, \quad Y_2 = w\,y_1 + w\,y_2, \quad z = y_2 \qquad (\text{see 8.1})
$$

**Mealy 2-ones detector** ($A = 0$, $B = 1$)

$$
D = w, \quad z = w\,y \qquad (\text{see 8.2})
$$

**Modulo-8 counter with enable $w$, J-K flip-flops**

$$
J_i = K_i = w\,y_0y_1\cdots y_{i-1} \qquad (\text{see 8.4})
$$

## Common mistakes

- Putting the output on the wrong place in the diagram. A Moore output goes **inside the state**; a Mealy output goes **on the arrow** as `input / output`.
- Forgetting that a Moore output changes **after** the clock edge, so it comes one cycle later than the Mealy output for the same input.
- Mixing up $y$ (present state) and $Y$ (next state). The next-state logic takes $y$ and $w$ in and puts $Y$ out to the $D$ inputs.
- Leaving a state/input combination undefined. Every state has to have a next state for **every** input value.
- Forgetting the Reset. Without it the flip-flops power up in an unknown state, and the machine might start in the unused code (like 11).
- Using the minimum number of flip-flops but not treating the **unused** codes as don't-cares, which makes the logic bigger than it needs to be.
- Using $d$ in the wrong J-K input. When a flip-flop is going $0 \to 0$ or $0 \to 1$ it's $K$ that's free; when going $1 \to 1$ or $1 \to 0$ it's $J$.
- Using level-sensitive latches for the state. The state needs **edge-triggered** flip-flops so that only one transition happens per clock cycle.
