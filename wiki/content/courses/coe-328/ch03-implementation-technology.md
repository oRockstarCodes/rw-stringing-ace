---
title: "Ch 3: Implementation Technology"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§3.1–3.3, 3.5–3.6, 3.8.8, 3.9** · Lecture 5 · week 5

This chapter is about how logic gates are actually built. Transistors work as **voltage-controlled switches**, where NMOS pulls an output **down** to ground and PMOS pulls it **up** to $V_{DD}$. Wiring them in series and parallel gives you NAND, NOR and more complex gates, and **CMOS** uses both types together so no current flows when the gate is idle. The second half is about how gates get packaged and sold: **7400-series chips**, then programmable devices (**PLAs, CPLDs, FPGAs**), along with fan-out and transmission gates.

## Notes

### Logic values as voltages

Logic 0 and 1 are **voltage ranges**, and there's an undefined region in between that signals only pass through while switching.

|Range ($V_{DD} = 5\ \text{V}$)|Meaning (positive logic)|
|---|---|
|$2\ \text{V}$ to $V_{DD}$|Logic **1** (HIGH)|
|$0.8\ \text{V}$ to $2\ \text{V}$|Undefined|
|$V_{SS} = 0\ \text{V}$ to $0.8\ \text{V}$|Logic **0** (LOW)|

- $V_{SS}$ is ground (0 V). $V_{DD}$ is the positive supply.
- The exact thresholds depend on the technology.

### Transistors as switches

**What a gate has to do.** The output of a gate is just a wire, and a wire only has a voltage if something connects it to a power source. We only care about two voltages:

- **$V_{DD}$**: the high supply (say 5 V). Connect the output here and it reads **1**.
- **GND**: ground (0 V). Connect the output here and it reads **0**.

So the whole job of a gate is to connect the output to $V_{DD}$ or to GND, depending on the inputs. Transistors are the switches that make those connections.

For logic analysis, a [[mosfet|MOSFET]] is treated as an **ideal switch** that's flipped by **voltage** (on its **gate**) instead of a finger. There are two types, and they're **opposites**:

|Transistor|Gate HIGH (1)|Gate LOW (0)|Placed between…|Job|
|---|---|---|---|---|
|**NMOS**|ON (closed)|OFF (open)|the output and **GND**|**pull down**: make the output 0|
|**PMOS** (bubble on its gate)|OFF (open)|ON (closed)|**$V_{DD}$** and the output|**pull up**: make the output 1|

- **Pull down** = "when I'm ON, I connect the output to ground, so it becomes 0."
- **Pull up** = "when I'm ON, I connect the output to $V_{DD}$, so it becomes 1."

> [!note] "Pull down" doesn't mean the NMOS *makes* 0 V. It means that when it's ON, it gives the output a low-resistance path to ground. PMOS does the same thing with $V_{DD}$.

> [!tip] Picture the output as a bucket of water, with the water level as the output voltage. A pipe from a **high tank** ($V_{DD}$) runs to the bucket with a valve: that's the **PMOS**, and opening it *fills* the bucket (output 1). A pipe from the bucket to a **drain** (GND) has a valve too: that's the **NMOS**, and opening it *empties* the bucket (output 0).

**Why each type goes where it does.** Each type is only good at passing one value. An NMOS connected to ground can pull the output all the way down to a clean 0 V, but it would only give a weak 1 if you used it to reach $V_{DD}$. A PMOS is the mirror image, with clean 1s and weak 0s. That's why NMOS goes to ground and PMOS goes to $V_{DD}$.

### Networks: series and parallel

One transistor is only enough for a NOT gate. For anything else, the output should only connect to a supply for *certain input combinations*, so we wire several transistors together. Two rules decide how:

- **Series** (end to end, like a chain): current only gets through if **every** switch is ON → behaves like **AND**.
- **Parallel** (side by side, like separate lanes): current gets through if **any** switch is ON → behaves like **OR**.

A group of transistors wired this way is a **network**. Every gate uses one or both of these:

|Name|Made of|Connects the output to…|Makes the output…|
|---|---|---|---|
|**PDN** (pull-down network)|NMOS transistors|GND|**0**|
|**PUN** (pull-up network)|PMOS transistors|$V_{DD}$|**1**|

### NMOS logic gates

The older style uses **only a PDN**. A PDN can pull the output to 0, but when it's OFF the output isn't connected to *anything*, and a floating wire isn't a reliable 1. The fix is a **pull-up resistor** (or pull-up device) from $V_{DD}$ to the output that weakly holds it high:

- PDN **OFF** → the resistor wins → output **HIGH**.
- PDN **ON** → it beats the resistor → output **LOW**.

|Gate|NMOS arrangement|Output 0 when…|Result|
|---|---|---|---|
|NOT|One NMOS|$x = 1$|$f = \overline{x}$|
|NAND|Two NMOS in **series**|$A = 1$ **and** $B = 1$|$f = \overline{AB}$|
|NOR|Two NMOS in **parallel**|$A = 1$ **or** $B = 1$|$f = \overline{A + B}$|
|AND|NAND followed by NOT|—|$f = AB$|
|OR|NOR followed by NOT|—|$f = A + B$|

- **Series = AND**, **parallel = OR**, exactly as above.
- The output is always the **complement** of the pull-down condition, which is why NAND and NOR come naturally and AND/OR need an extra inverter.

**The drawback:** whenever the output is LOW, current flows from $V_{DD}$ through the resistor and the NMOS network to ground the whole time. That wastes power and makes heat, and CMOS fixes it.

### CMOS logic gates

**CMOS** stands for **complementary** MOS. It replaces the resistor with a **pull-up network (PUN)** of PMOS transistors, so it uses *both* kinds of transistor as a matched pair of networks. The PUN sits between $V_{DD}$ and the output, the PDN sits between the output and GND, and they're built so that for *every* input combination **exactly one of them conducts**:

|Situation|PUN|PDN|Output|
|---|---|---|---|
|Output should be 1|ON|OFF|Connected to $V_{DD}$ → $f = 1$|
|Output should be 0|OFF|ON|Connected to GND → $f = 0$|

**The big advantage:** in any steady state one network is OFF, so there's **no direct path from $V_{DD}$ to GND** and basically no static current. That's the main reason CMOS ended up as the dominant logic technology.

**The duality rule:** the PUN and PDN are duals of each other. Wherever the PDN has NMOS in **series**, the PUN has PMOS in **parallel**, and the other way around.

|Gate|PUN (PMOS)|PDN (NMOS)|Transistors|
|---|---|---|---|
|NOT|1 PMOS|1 NMOS|2|
|NAND|**parallel**|**series**|4|
|NOR|**series**|**parallel**|4|
|AND|NAND + NOT|NAND + NOT|6|
|OR|NOR + NOT|NOR + NOT|6|

**Walk-through: the NOT gate.** One PMOS on top, one NMOS below, both controlled by the same input $x$, with the output between them.

|$x$|PMOS (top)|NMOS (bottom)|Output connected to|$f$|
|---|---|---|---|---|
|0|ON (gate is 0)|OFF|$V_{DD}$|**1**|
|1|OFF|ON (gate is 1)|GND|**0**|

Input 0 turns on the top valve and fills the bucket → output 1. Input 1 turns on the bottom valve and drains it → output 0.

**Walk-through: the NAND, $f = \overline{AB}$.** Work out each network from the function:

- **PUN:** $f$ is 1 when $A = 0$ **or** $B = 0$. PMOS turns on with a 0 and "or" means parallel, so the PUN is two PMOS **in parallel**.
- **PDN:** $f$ is 0 when $A = 1$ **and** $B = 1$. NMOS turns on with a 1 and "and" means series, so the PDN is two NMOS **in series**.

|$A$|$B$|PMOS A|PMOS B|NMOS A|NMOS B|$f$|
|---|---|---|---|---|---|---|
|0|0|ON|ON|OFF|OFF|1|
|0|1|ON|OFF|OFF|ON|1|
|1|0|OFF|ON|ON|OFF|1|
|1|1|OFF|OFF|ON|ON|0|

If either input is 0, at least one PMOS is ON and fills the output to 1. Only when both are 1 do both NMOS turn on and drain it to 0.

> [!note] To remember: **NMOS** = ON with a 1, on the bottom, pulls **down**. **PMOS** = ON with a 0, on top, pulls **up**. **PDN** = the NMOS network, **PUN** = the PMOS network. **CMOS** = both together, always exactly one ON.

**Try it:** pick a gate and flip the inputs. ON transistors are drawn solid, OFF ones faded, and the network that's connected to the output is highlighted.

<div class="melon-logic" data-view="cmos">Interactive CMOS gates (open this page on the site to use it).</div>

### Designing complex CMOS gates

You don't have to build everything out of NAND/NOR/NOT. Any function that's a **single inverting expression**, $f = \overline{(\ldots)}$, can be built **directly** as one PUN + PDN. This works because a CMOS gate is naturally **inverting**. A 1 on the inputs turns NMOS on and pulls the output *down*, so more 1s tend to give a 0. That's why NAND and NOR are easy, while AND and OR (which aren't inverting) cost an extra inverter.

The recipe is to describe *when the output is 1* for the PUN and *when it's 0* for the PDN, remembering that PMOS turns on with a **0** and NMOS turns on with a **1**:

1. **PUN:** write the condition for $f = 1$ in terms of **complemented** inputs ("$x = 0$"). AND → series, OR → parallel.
2. **PDN:** write the condition for $f = 0$, i.e. $\overline{f}$, in terms of **uncomplemented** inputs ("$x = 1$"). AND → series, OR → parallel. Use [[ch02-intro-to-logic-circuits|DeMorgan's theorems]] to get $\overline{f}$ into that form.
3. **Check duality:** every series in the PUN should be a parallel in the PDN and vice versa. If it isn't, something's wrong.
4. Connect the PUN to $V_{DD}$, the PDN to GND, and join them at the output.

**Worked through: Textbook Example 3.1,** $f = \overline{x_1} + \overline{x_2}\,\overline{x_3}$

1. **PUN, reading $f$ directly.** $f$ is already written with complemented inputs. A product ($\overline{x_2}\,\overline{x_3}$) means "$x_2 = 0$ **and** $x_3 = 0$", so those two PMOS go in **series**. The $+$ means "$x_1 = 0$ **or** that", so $x_1$'s PMOS goes **in parallel** with the series pair.
2. **PDN, from $\overline{f}$.** Apply DeMorgan: $\overline{f} = x_1\,\overline{(\overline{x_2}\,\overline{x_3})} = x_1(x_2 + x_3)$. Now every input is uncomplemented. The product means NMOS $x_1$ **in series** with the sum, and the sum $x_2 + x_3$ is a **parallel** pair.
3. **Duality check:** the PUN is "$x_1$ ∥ ($x_2$ series $x_3$)", the PDN is "$x_1$ series ($x_2$ ∥ $x_3$)". Series and parallel swapped ✓. That's 6 transistors.

**Textbook Example 3.2:** $f = \overline{x_1} + (\overline{x_2} + \overline{x_3})\,\overline{x_4}$

- **PUN:** $x_1$ in parallel with [($x_2$ ∥ $x_3$) in series with $x_4$].
- **PDN:** $\overline{f} = x_1(x_2 x_3 + x_4)$ → $x_1$ in series with [($x_2$ series $x_3$) ∥ $x_4$].

That uses fewer transistors than building each AND and OR as its own gate.

> [!tip] To sanity check a design, pick one input combination and trace it. Does exactly one network conduct? If both do, you've made a short from $V_{DD}$ to GND, and if neither does, the output floats.

### Speed of logic gates

The ideal-switch model tells you **what** a gate does, but not **how fast**. In a real circuit:

- An ON transistor has some **resistance**.
- The wires and the transistors themselves have **capacitance**. Each gate input is like a tiny bucket that has to be filled or emptied before its voltage changes.
- Changing the output means charging or discharging that capacitance through that resistance, and that takes time. This is the **propagation delay**.

Back to the bucket picture. Opening the fill valve doesn't make the level jump to the top, because the water has to flow in through a narrow pipe (the resistance), and a bigger bucket (more capacitance) takes longer to fill. It's also why a gate output is never a perfect square edge. See [[propagation-delay|Propagation Delay]] for the picture and how it limits clock speed.

Detailed timing analysis isn't covered in this course, but remember the idea: more load (more capacitance) means a slower gate.

**Fan-in and fan-out (§3.8.8)**

- **Fan-in:** the number of inputs a gate has.
- **Fan-out:** the number of other gate inputs that one gate output drives. Each one adds capacitance $C$, so driving $n$ gates is like driving $C_n = n \cdot C$. The propagation delay goes up **in direct proportion to $n$**.

Fan-in matters too. A 4-input NAND has four NMOS in **series** in its PDN, so the path to ground adds up four resistances and is slower than a 2-input NAND. That's why big gates often get split into smaller ones.

### Transmission gates (§3.9)

Everything so far connected the output to a **supply** ($V_{DD}$ or GND). A **transmission gate** connects one **signal** to another instead, like a door that either lets a signal $x$ through or blocks it.

Why not just use a single transistor? One transistor only passes one value well. An NMOS passes clean 0s but a weak 1, and a PMOS is the opposite. So a **transmission gate** puts an NMOS and a PMOS **in parallel**, driven by complementary control signals $s$ and $\overline{s}$. Whatever the signal is, one of the two transistors passes it cleanly:

- $s = 1$ ($\overline{s} = 0$): both transistors ON, so $f = x$.
- $s = 0$: both OFF, so the output is disconnected (it just floats, it isn't 0).

See [[transmission-gate|Transmission Gate]] for a step-by-step look at how a 0 and a 1 each pass through.

Uses:

- **XOR gate:** built from gates, $x_1 \oplus x_2 = x_1\overline{x_2} + \overline{x_1}x_2$ takes 22 transistors in CMOS (two ANDs and an OR at 6 each, two NOTs at 2 each). With **two transmission gates and two inverters** it only takes 8. When $x_1 = 0$ one transmission gate passes $x_2$, and when $x_1 = 1$ the other passes $\overline{x_2}$.
- **2-to-1 multiplexer:** two transmission gates controlled by $s$ and $\overline{s}$. $s = 0$ passes $x_1$ and $s = 1$ passes $x_2$. It's the same function as the [[ch06-combinational-building-blocks|multiplexers in Ch 6]], just built at the transistor level.

### Standard chips: the 7400 series (§3.5)

Before programmable logic, circuits were built by wiring together **standard chips**, each with a few fixed gates.

- They come in a **dual-inline package (DIP)**, with two rows of **pins** (leads). One pin is for $V_{DD}$, one is for GND, and the rest are wired to the gates inside.
- The part number tells you what's inside:

|Chip|Contents|
|---|---|
|7404|Six NOT gates|
|7408|Four 2-input AND gates|
|7432|Four 2-input OR gates|
|74244|Eight tri-state buffers (20-pin package)|

- The **suffix letters** tell you the technology, not the function. 74LS00 is TTL (transistor-transistor logic) and 74HC00 is CMOS, but both are quad 2-input NANDs.
- Lots of manufacturers make the same parts, which keeps them cheap and easy to get.
- Packages got smaller over time. The **SOIC** (small-outline IC) is the same idea as a DIP but much smaller.

**Buffers.** A buffer outputs the same logic value it's given ($Y = A$). It doesn't change the logic, it just **drives** the signal harder (more current), which helps with speed when there's a big load. A **tri-state buffer** adds an **enable** input. When enabled, $Y = A$, and when disabled the output is disconnected (**high impedance**, written Z).

|Enable|$A$|$Y$|
|---|---|---|
|0|0|Z|
|0|1|Z|
|1|0|0|
|1|1|1|

"Tri-state" means the output has **three** states: 0, 1, and *not driving anything*. Z isn't a third voltage. It means the output is unplugged, like a transmission gate that's OFF. This lets **many devices share one wire** (a bus), since only one buffer is enabled at a time and they never fight over the wire's value. Buffers are one of the main things standard chips are still used for today.

**Integration scale**

|Scale|Size|Notes|
|---|---|---|
|**SSI** (small)|A few gates|Early chips, e.g. 7400 series|
|**MSI** (medium)|About 10–100 gates|More circuitry per chip|
|**LSI** (large)|Beyond MSI||
|**VLSI** (very large)|Thousands to billions of transistors|Modern chips|

These labels don't mean much anymore now that chips are so big.

### Programmable logic devices (§3.6)

Standard chips have fixed functions and only a few gates each, so a big circuit needs lots of chips, lots of wires, and a lot of board space. A **programmable logic device (PLD)** is one general-purpose chip where the designer sets up the internal connections:

$$\text{PLD} = \text{logic elements} + \text{programmable switches}$$

**PLA (programmable logic array):** implements functions in **SOP form**.

1. **Input buffers** provide every input in true and complemented form ($x_i$ and $\overline{x_i}$).
2. A programmable **AND plane** forms product terms $P_1, P_2, \ldots$ from any of those literals.
3. A programmable **OR plane** sums any of the product terms to make each output $f_1, f_2, \ldots$

A product term can be **shared** by several outputs, which saves AND gates.

*Why SOP?* Any function can be written as a sum of products (see [[ch02-intro-to-logic-circuits|Ch 2]]), so a PLA that can make **any** product and sum **any** products can implement any function that fits in its size. Simplifying with [[ch04-optimization-of-combinational-logic|K-maps (Ch 4)]] gives fewer product terms and a smaller PLA.

**CPLD (complex PLD):** several PAL/PLA-like blocks on one chip, with a programmable interconnect between them.

- It's programmed **in-system** (ISP) through a **JTAG** port (an IEEE standard that uses 4 wires), because big chips are too fragile for programming sockets.
- **Nonvolatile:** it keeps its configuration with the power off.

**FPGA (field-programmable gate array):** much bigger, up to millions of equivalent gates.

- It's made of **logic blocks**, **I/O blocks**, and **routing channels** with programmable switches.
- There are no AND/OR planes. Each logic block uses a **lookup table (LUT)** instead, usually with 4 or 5 inputs, and often a flip-flop for sequential logic.
- **Volatile:** the configuration is lost when the power goes off and has to be reloaded every power-up, usually from a PROM on the board.
- The labs in this course use an FPGA board.

**How a LUT works:** a LUT is a tiny memory that stores a truth table. A 2-input LUT has $2^2 = 4$ storage cells, one per row. The inputs $x_1$, $x_2$ drive the select lines of a tree of multiplexers that pick the cell for the current row. So **any** function of 2 variables fits in a 2-input LUT, and you only change the stored bits.

Think of it as a **cheat sheet** instead of a circuit. Rather than building gates that compute the answer, the LUT just *looks up* the answer for the current inputs. The multiplexers in it are the ones from [[ch06-combinational-building-blocks|Ch 6]]. See [[lookup-table|Lookup Tables]] for a worked example and how bigger functions are built from lots of LUTs.

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

These are based on the lecture's examples and check-your-understanding questions, with different functions.

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

**6 transistors.** Building it from an AND gate (6) and a NOR gate (4) would take 10.

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

> [!tip] Simplify first. $f = x_3(\overline{x_1} + x_2)$ only needs one NOT, one OR and one AND. That's still three chips, but fewer wires.

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
2. **NAND** is 0 only for $11$: **1, 1, 1, 0**. Only the stored bits change, and the multiplexer tree stays the same.

## Common mistakes

- Swapping NMOS and PMOS behavior. **NMOS is ON with a 1** and **PMOS is ON with a 0** (the bubble).
- Putting PMOS in the pull-down network or NMOS in the pull-up network.
- Building the PDN for $f$ instead of $\overline{f}$. The PDN conducts when the output should be **0**.
- Forgetting duality. If the PDN is series, the PUN has to be parallel (and the other way around).
- Thinking a CMOS AND is "simpler" than a NAND. It's a NAND **plus** an inverter (6 transistors vs 4).
- Mixing up which PLDs are volatile. **CPLDs keep** their configuration without power and **FPGAs lose** it.
