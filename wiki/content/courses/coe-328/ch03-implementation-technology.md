---
title: "Ch 3: Implementation Technology"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§3.1–3.3, 3.5–3.6, 3.8.8, 3.9** · Lecture 5 · week 5

How logic gates are actually built. Transistors act as **voltage-controlled switches**: NMOS pulls an output **down** to ground and PMOS pulls it **up** to $V_{DD}$. Arranging them in series and parallel gives NAND, NOR, and more complex gates, and **CMOS** pairs the two types so no current flows when the gate is idle. The second half covers how gates are packaged and sold: **7400-series chips**, then programmable devices (**PLAs, CPLDs, FPGAs**), plus fan-out and transmission gates.

## Notes

### Logic values as voltages

Logic 0 and 1 are **voltage ranges**, with an undefined region in between that signals only pass through during a transition.

|Range ($V_{DD} = 5\ \text{V}$)|Meaning (positive logic)|
|---|---|
|$2\ \text{V}$ to $V_{DD}$|Logic **1** (HIGH)|
|$0.8\ \text{V}$ to $2\ \text{V}$|Undefined|
|$V_{SS} = 0\ \text{V}$ to $0.8\ \text{V}$|Logic **0** (LOW)|

- $V_{SS}$ is ground (0 V). $V_{DD}$ is the positive supply.
- The exact thresholds depend on the technology.

### Transistors as switches

For logic analysis, a MOSFET is treated as an **ideal switch** controlled by its gate voltage. There are two types, and they're **opposite**:

|Transistor|Gate HIGH (1)|Gate LOW (0)|Used to…|
|---|---|---|---|
|**NMOS**|ON (closed)|OFF (open)|**pull down**: connect the output to GND|
|**PMOS** (bubble on its gate)|OFF (open)|ON (closed)|**pull up**: connect the output to $V_{DD}$|

> [!note] "Pull down" doesn't mean the NMOS *makes* 0 V. It means that when it's ON, it gives the output a low-resistance path to ground. Same for PMOS and $V_{DD}$.

### NMOS logic gates

An NMOS gate is a **pull-down network** of NMOS transistors plus a **pull-up resistor** (or pull-up device) to $V_{DD}$. When the pull-down network conducts, the output is LOW; otherwise the resistor holds it HIGH.

|Gate|NMOS arrangement|Output 0 when…|Result|
|---|---|---|---|
|NOT|One NMOS|$x = 1$|$f = \overline{x}$|
|NAND|Two NMOS in **series**|$A = 1$ **and** $B = 1$|$f = \overline{AB}$|
|NOR|Two NMOS in **parallel**|$A = 1$ **or** $B = 1$|$f = \overline{A + B}$|
|AND|NAND followed by NOT|—|$f = AB$|
|OR|NOR followed by NOT|—|$f = A + B$|

- **Series = AND** (current flows only if every switch is closed).
- **Parallel = OR** (current flows if any switch is closed).
- The output is always the **complement** of the pull-down condition, which is why NAND and NOR are the natural gates and AND/OR need an extra inverter.

The drawback: whenever the output is LOW, current flows from $V_{DD}$ through the resistor and the NMOS network to ground, wasting power.

### CMOS logic gates

**CMOS** (complementary MOS) replaces the resistor with a **pull-up network (PUN)** of PMOS transistors. The PUN and the **pull-down network (PDN)** of NMOS transistors are designed so that for every input, **exactly one of them conducts**:

- PUN conducts → output connected to $V_{DD}$ → $f = 1$
- PDN conducts → output connected to GND → $f = 0$

**The duality rule:** the PUN and PDN are duals of each other. Wherever the PDN has NMOS in **series**, the PUN has PMOS in **parallel**, and vice versa.

|Gate|PUN (PMOS)|PDN (NMOS)|Transistors|
|---|---|---|---|
|NOT|1 PMOS|1 NMOS|2|
|NAND|**parallel**|**series**|4|
|NOR|**series**|**parallel**|4|
|AND|NAND + NOT|NAND + NOT|6|
|OR|NOR + NOT|NOR + NOT|6|

**Why the CMOS NAND looks like that.** $f = \overline{AB}$ is 1 when $A = 0$ **or** $B = 0$. PMOS turns on with a 0, and "or" means parallel, so the PUN is two PMOS in parallel. $f$ is 0 when $A = 1$ **and** $B = 1$. NMOS turns on with a 1, and "and" means series, so the PDN is two NMOS in series.

|$A$|$B$|PMOS A|PMOS B|NMOS A|NMOS B|$f$|
|---|---|---|---|---|---|---|
|0|0|ON|ON|OFF|OFF|1|
|0|1|ON|OFF|OFF|ON|1|
|1|0|OFF|ON|ON|OFF|1|
|1|1|OFF|OFF|ON|ON|0|

**The big advantage:** in any steady state one network is OFF, so there's **no direct path from $V_{DD}$ to GND** and essentially no static current. That's the main reason CMOS became the dominant logic technology.

**Try it:** pick a gate and flip the inputs. ON transistors are drawn solid, OFF ones faded, and the network that's connected to the output is highlighted.

<div class="melon-logic" data-view="cmos">Interactive CMOS gates (open this page on the site to use it).</div>

### Designing complex CMOS gates

You don't have to build everything out of NAND/NOR/NOT. Any function of the form $f = \overline{(\ldots)}$ can be built **directly** as one PUN + PDN:

1. Write the condition for $f = 1$ in terms of **complemented** inputs → build the **PUN** (PMOS turn on for 0s). AND → series, OR → parallel.
2. Write the condition for $f = 0$, i.e. $\overline{f}$, in terms of **uncomplemented** inputs → build the **PDN** (NMOS turn on for 1s). AND → series, OR → parallel.
3. Check that the PDN is the dual of the PUN (series ↔ parallel).
4. Connect the PUN to $V_{DD}$, the PDN to GND, and join them at the output.

**Textbook Example 3.1:** $f = \overline{x_1} + \overline{x_2}\,\overline{x_3}$

- **PUN:** $f = 1$ when $x_1 = 0$ OR ($x_2 = 0$ AND $x_3 = 0$) → PMOS $x_1$ **in parallel with** a series pair $x_2$, $x_3$.
- **PDN:** $\overline{f} = x_1(x_2 + x_3)$ → NMOS $x_1$ **in series with** a parallel pair $x_2$, $x_3$.

**Textbook Example 3.2:** $f = \overline{x_1} + (\overline{x_2} + \overline{x_3})\,\overline{x_4}$

- **PUN:** $x_1$ in parallel with [($x_2$ ∥ $x_3$) in series with $x_4$].
- **PDN:** $\overline{f} = x_1(x_2 x_3 + x_4)$ → $x_1$ in series with [($x_2$ series $x_3$) ∥ $x_4$].

This uses fewer transistors than building each AND and OR as a separate gate.

### Speed of logic gates

The ideal-switch model explains **what** a gate does, not **how fast**. In a real circuit:

- An ON transistor has some **resistance**.
- The wires and the transistors' own structure have **capacitance**.
- Changing the output means charging or discharging that capacitance through that resistance, which takes time: the **propagation delay**.

Detailed timing analysis isn't covered in this course, but keep the idea: more load (more capacitance) → slower gate.

**Fan-in and fan-out (§3.8.8)**

- **Fan-in:** the number of inputs a gate has.
- **Fan-out:** the number of other gate inputs that one gate output drives. Each one adds capacitance $C$, so driving $n$ gates is like driving $C_n = n \cdot C$. The propagation delay increases **in direct proportion to $n$**.

### Transmission gates (§3.9)

A **transmission gate** is an NMOS and a PMOS in parallel, driven by complementary control signals $s$ and $\overline{s}$. It's a switch that passes 0s and 1s equally well (NMOS passes 0s well, PMOS passes 1s well):

- $s = 1$ ($\overline{s} = 0$): both transistors ON, so $f = x$.
- $s = 0$: both OFF, so the output is disconnected.

Uses:

- **XOR gate:** built from gates, $x_1 \oplus x_2 = x_1\overline{x_2} + \overline{x_1}x_2$ takes 22 transistors in CMOS (two ANDs and an OR at 6 each, two NOTs at 2 each). With **two transmission gates and two inverters** it takes 8: when $x_1 = 0$ one transmission gate passes $x_2$, and when $x_1 = 1$ the other passes $\overline{x_2}$.
- **2-to-1 multiplexer:** two transmission gates controlled by $s$ and $\overline{s}$. $s = 0$ passes $x_1$, $s = 1$ passes $x_2$.

### Standard chips: the 7400 series (§3.5)

Before programmable logic, circuits were built by wiring together **standard chips**, each with a few fixed gates.

- Packaged in a **dual-inline package (DIP)**: two rows of **pins** (leads), with one pin for $V_{DD}$, one for GND, and the rest wired to the gates inside.
- The part number says what's inside:

|Chip|Contents|
|---|---|
|7404|Six NOT gates|
|7408|Four 2-input AND gates|
|7432|Four 2-input OR gates|
|74244|Eight tri-state buffers (20-pin package)|

- The **suffix letters** give the technology, not the function: 74LS00 is TTL (transistor-transistor logic), 74HC00 is CMOS. Both are quad 2-input NANDs.
- Many manufacturers make the same parts, which keeps them cheap and available.
- Packages shrank over time: the **SOIC** (small-outline IC) is the same idea as a DIP but much smaller.

**Buffers.** A buffer outputs the same logic value it's given ($Y = A$). It doesn't change the logic; it **drives** the signal more strongly (more current), which helps speed when there's a big load. A **tri-state buffer** adds an **enable** input: when enabled, $Y = A$; when disabled, the output is disconnected (high impedance). Buffers are one of the main uses of standard chips today.

**Integration scale**

|Scale|Size|Notes|
|---|---|---|
|**SSI** (small)|A few gates|Early chips, e.g. 7400 series|
|**MSI** (medium)|About 10–100 gates|More circuitry per chip|
|**LSI** (large)|Beyond MSI||
|**VLSI** (very large)|Thousands to billions of transistors|Modern chips|

These labels are less useful now that chips are so large.

### Programmable logic devices (§3.6)

Standard chips have fixed functions and few gates each, so a big circuit needs many chips, many wires, and a lot of board space. A **programmable logic device (PLD)** is one general-purpose chip whose internal connections the designer configures:

$$\text{PLD} = \text{logic elements} + \text{programmable switches}$$

**PLA (programmable logic array):** implements functions in **SOP form**.

1. **Input buffers** provide every input in true and complemented form ($x_i$ and $\overline{x_i}$).
2. A programmable **AND plane** forms product terms $P_1, P_2, \ldots$ from any of those literals.
3. A programmable **OR plane** sums any of the product terms to make each output $f_1, f_2, \ldots$

A product term can be **shared** by several outputs, which saves AND gates.

**CPLD (complex PLD):** several PAL/PLA-like blocks on one chip, with a programmable interconnect between them.

- Programmed **in-system** (ISP) through a **JTAG** port (an IEEE standard using 4 wires), since big chips are too fragile for programming sockets.
- **Nonvolatile:** keeps its configuration with the power off.

**FPGA (field-programmable gate array):** much larger (up to millions of equivalent gates).

- Made of **logic blocks**, **I/O blocks**, and **routing channels** with programmable switches.
- No AND/OR planes. Each logic block uses a **lookup table (LUT)** instead, usually with 4 or 5 inputs, and often a flip-flop for sequential logic.
- **Volatile:** the configuration is lost at power-off and must be reloaded every power-up, usually from a PROM on the board.
- This course's labs use an FPGA board.

**How a LUT works:** a LUT is a tiny memory that stores a truth table. A 2-input LUT has $2^2 = 4$ storage cells, one per row. The inputs $x_1$, $x_2$ drive the select lines of a tree of multiplexers that pick the cell for the current row. So **any** function of 2 variables fits in a 2-input LUT; you only change the stored bits.

## Key formulas

**CMOS duality**

$$
\text{PDN series} \;\leftrightarrow\; \text{PUN parallel}, \qquad \text{PDN parallel} \;\leftrightarrow\; \text{PUN series} \tag{3.1}
$$

**PDN condition**

$$
\text{PDN conducts} \iff \overline{f} = 1 \tag{3.2}
$$

- The PDN realizes $\overline{f}$ with uncomplemented inputs (NMOS on for 1).
- The PUN realizes $f$ with complemented inputs (PMOS on for 0).

**Fan-out load**

$$
C_n = n \cdot C \tag{3.3}
$$

- $C_n$: total load capacitance on the driving gate's output
- $n$: fan-out, the number of gate inputs being driven
- $C$: input capacitance of one driven gate

**LUT size**

$$
\text{storage cells} = 2^k \tag{3.4}
$$

- $k$: number of LUT inputs

## Examples

These follow the lecture's examples and check-your-understanding questions, with different functions.

### Example 1: Reading an NMOS circuit

> Like the lecture's NMOS NAND/NOR slides

An NMOS gate has a pull-up resistor to $V_{DD}$. Its pull-down network is NMOS $A$ in series with NMOS $B$, and that pair is in parallel with NMOS $C$. Find $f$.

1. **When does the PDN conduct?** Series = AND, parallel = OR, so it conducts when $AB + C = 1$.
2. **The output is LOW whenever the PDN conducts,** so it's the complement:
   $$f = \overline{AB + C}$$

### Example 2: Designing a complex CMOS gate

> Like textbook Examples 3.1–3.2

Design a CMOS circuit for $f = \overline{AB + C}$ and count its transistors.

1. **PDN** realizes $\overline{f} = AB + C$: NMOS $A$ and $B$ in **series**, that pair in **parallel** with NMOS $C$.
2. **PUN** is the dual: PMOS $A$ and $B$ in **parallel**, that pair in **series** with PMOS $C$.
3. **Check the PUN directly:** by DeMorgan, $f = \overline{AB}\,\overline{C} = (\overline{A} + \overline{B})\,\overline{C}$. That's ($A = 0$ or $B = 0$) and $C = 0$: PMOS $A$ ∥ $B$, in series with $C$ ✓

![[coe-328-cmos-complex-gate.svg]]
*Figure 3.1: CMOS circuit for $f = \overline{AB + C}$.*

**6 transistors.** Building it as an AND gate (6), a NOR gate (4) would take 10.

### Example 3: CMOS gate from an expression with complemented inputs

> Like the lecture's "Derive a CMOS Network" worked example

Design the CMOS networks for $f = \overline{A}\,\overline{B} + \overline{C}$.

1. **PUN** from $f = 1$: ($A = 0$ AND $B = 0$) OR $C = 0$ → PMOS $A$ **series** $B$, that pair **parallel** with PMOS $C$.
2. **PDN** from $\overline{f}$: by DeMorgan, $\overline{f} = \overline{\overline{A}\,\overline{B}}\;\overline{\overline{C}} = (A + B)\,C$ → NMOS $A$ **parallel** $B$, that pair in **series** with NMOS $C$.
3. **Duality check:** the PUN's series pair ($A$, $B$) is a parallel pair in the PDN, and $C$ swaps from parallel to series ✓

### Example 4: Transistor states in a CMOS NOR

> Like the CMOS NAND truth-table slide

For a 2-input CMOS NOR with $A = 0$, $B = 1$: which transistors are ON, and what is $f$?

1. **PUN** (two PMOS in **series**): PMOS $A$ is ON (gate 0), PMOS $B$ is OFF (gate 1). Series needs both, so the PUN is **off**.
2. **PDN** (two NMOS in **parallel**): NMOS $A$ is OFF, NMOS $B$ is ON. Parallel needs one, so the PDN **conducts**.
3. The output is connected to GND, so $f = 0$. Check: $\overline{0 + 1} = 0$ ✓

### Example 5: Implementing a function with 7400-series chips

> Like the lecture's chip-level implementation of $f = x_1 x_2 + \overline{x_2} x_3$

Implement $f = \overline{x_1}\,x_3 + x_2 x_3$ with 7400-series chips. Which chips are needed, and how many gates are left over?

1. **Operations needed:** one NOT ($\overline{x_1}$), two 2-input ANDs ($\overline{x_1}x_3$ and $x_2x_3$), one 2-input OR.
2. **Chips:** a **7404** for the NOT, a **7408** for the ANDs, a **7432** for the OR, each with power and ground connected.
3. **Spare gates:** 5 NOTs, 2 ANDs, and 3 ORs are unused and available for other logic.

> [!tip] Simplify first: $f = x_3(\overline{x_1} + x_2)$ needs just one NOT, one OR, and one AND. Still three chips, but fewer wires.

### Example 6: XOR transistor count

> Like the §3.9.1 discussion

How many transistors does a CMOS XOR take when built from AND, OR, and NOT gates, versus with transmission gates?

1. **Gates:** $x_1\overline{x_2} + \overline{x_1}x_2$ needs 2 NOTs (2 transistors each), 2 ANDs (6 each), and 1 OR (6):
   $$2(2) + 2(6) + 6 = 22$$
2. **Transmission gates:** 2 inverters (2 each) + 2 transmission gates (2 each) = **8**.

### Example 7: PLA product terms

> Like the lecture's PLA slide

A PLA must implement $f_1 = x_1x_2 + \overline{x_1}\,x_3$ and $f_2 = x_1x_2 + x_3$. How many product terms does the AND plane need?

1. **List the distinct products:** $P_1 = x_1x_2$, $P_2 = \overline{x_1}\,x_3$, $P_3 = x_3$.
2. **OR plane:** $f_1 = P_1 + P_2$, $f_2 = P_1 + P_3$.

**3 product terms**, since $P_1$ is shared by both outputs.

### Example 8: Programming a LUT

> Like the LUT description (Figure 3.36)

What bits are stored in a 2-input LUT to make it an XNOR gate? What would change to make it a NAND?

1. **One cell per truth-table row** ($x_1x_2 = 00, 01, 10, 11$). XNOR is 1 when the inputs match: **1, 0, 0, 1**.
2. **NAND** is 0 only for $11$: **1, 1, 1, 0**. Only the stored bits change; the multiplexer tree stays the same.

## Common mistakes

- Swapping NMOS and PMOS behavior: **NMOS is ON with a 1**, **PMOS is ON with a 0** (the bubble).
- Putting PMOS in the pull-down network or NMOS in the pull-up network.
- Building the PDN for $f$ instead of $\overline{f}$. The PDN conducts when the output should be **0**.
- Forgetting duality: if the PDN is series, the PUN must be parallel (and vice versa).
- Thinking a CMOS AND is "simpler" than a NAND. It's a NAND **plus** an inverter (6 transistors vs 4).
- Confusing which PLDs are volatile: **CPLDs keep** their configuration without power, **FPGAs lose** it.
