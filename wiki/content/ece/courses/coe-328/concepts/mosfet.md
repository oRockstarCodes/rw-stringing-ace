---
title: MOSFET
aliases:
  - MOSFETs
  - NMOS
  - PMOS
  - Transistor
tags:
  - concept
  - coe328
  - ele302
---

**A MOSFET is a transistor with three terminals (gate, source, drain), where the voltage on the gate decides how much current can flow between the source and the drain. In digital logic we treat it as a voltage-controlled switch (fully OFF or fully ON). In analog circuits like op amps it's biased in between and used as a voltage-controlled current source, which is how amplification happens.**

MOSFET stands for **M**etal-**O**xide-**S**emiconductor **F**ield-**E**ffect **T**ransistor. Every logic gate in [[ch03-implementation-technology|Ch 3]] is built from them, and a modern chip has billions. Analog uses are covered in [[#Using a MOSFET as an amplifier]], which is what's inside an op amp ([[ch05-operational-amplifiers|ELE 302 Ch 5]]).

## Intuition

### The three terminals

|Terminal|Role|
|---|---|
|**Gate (G)**|The control input. It sits on a thin insulating oxide layer, so it draws basically **no current**. Only its voltage matters.|
|**Source (S)**|One end of the switch. Carriers start here.|
|**Drain (D)**|The other end of the switch. Carriers leave here.|

The switch is the path between **S** and **D**. The gate never touches that path electrically. It controls it through an **electric field**, which is the "field-effect" in the name.

### How the gate turns the switch on

Take an NMOS built on a p-type silicon body.

1. **Gate at 0 V.** There are no free electrons between the source and the drain, so there's no conducting path and the switch is **OFF** (open).
2. **Gate raised to a high voltage.** The positive gate voltage attracts electrons to the surface just under the oxide and pushes holes away. Once the gate voltage passes the **threshold voltage** $V_T$, those electrons form a thin conducting layer called a **channel** that joins the source to the drain. The switch is **ON** (closed).

So the gate acts like one plate of a capacitor, and charging that plate "pulls in" a channel of carriers underneath it.

> [!tip] Water analogy: the gate is a hand on a flexible hose. You don't pump any water yourself. Squeezing or releasing the hose changes whether water can flow from one end to the other.

**Try it:** drag the gate voltage, or click the gate terminal, and watch the channel form once the gate passes the threshold. Switch between NMOS and PMOS to see that they respond in opposite ways.

<div class="melon-logic" data-view="mosfet">Interactive MOSFET (open this page on the site to use it).</div>

### NMOS and PMOS are opposites

||NMOS|PMOS|
|---|---|---|
|Carriers in the channel|Electrons|Holes|
|Channel forms when|Gate is **HIGH** (1)|Gate is **LOW** (0)|
|Symbol|Plain gate|**Bubble** on the gate|
|Good at|Passing **0** (pulling down to GND)|Passing **1** (pulling up to $V_{DD}$)|

The bubble on the PMOS gate means "turns on with a 0", the same bubble you see on an inverter. Pairing an NMOS with a PMOS so that exactly one is ON at a time is the idea behind **CMOS** (complementary MOS).

## Why it matters for digital logic

Because a MOSFET behaves like a switch, you can build Boolean functions just from how the switches are wired:

- **Series** switches only conduct if all of them are ON → **AND**
- **Parallel** switches conduct if any of them is ON → **OR**

The pull-down network of NMOS and the pull-up network of PMOS in a CMOS gate are just these series/parallel arrangements. The gate ends up outputting the **complement** of what the pull-down network computes, which is why NAND and NOR come naturally.

CMOS dominates because in any steady state one network is OFF, so there's no direct path from $V_{DD}$ to GND and almost no static current flows.

## Using a MOSFET as an amplifier

Logic only ever uses the two extremes, OFF and fully ON. An amplifier uses the **middle**: bias the gate so the MOSFET is partly on, and let a small change in gate voltage cause a larger change in output voltage.

### Saturation: the gate sets the current

When $V_{DS}$ is large enough ($V_{DS} \ge V_{GS} - V_T$) the MOSFET is in **saturation**. Here the drain current depends on the gate voltage and hardly at all on the drain voltage, so the transistor acts as a **voltage-controlled current source**:

$$
I_D = \frac{1}{2}\,k_n\,(V_{GS} - V_T)^2 \tag{1}
$$

- $I_D$: drain current
- $k_n$: transconductance parameter, set by the device's size and process ($k_n = \mu_n C_{ox}\,W/L$)
- $V_{GS}$: gate-to-source voltage
- $V_T$: threshold voltage

For a small change $v_{gs}$ around the bias point, the current changes by $i_d = g_m\,v_{gs}$, where the **transconductance** is the slope of Eq. (1):

$$
g_m = \frac{\partial I_D}{\partial V_{GS}} = k_n\,(V_{GS} - V_T) \tag{2}
$$

$g_m$ has units of siemens (A/V), and it's the amplifier's "strength": how many amps of output current you get per volt of input.

### Turning a current change into a voltage change

Current isn't a voltage, so put a resistor $R_D$ between the supply $V_{DD}$ and the drain. This is the **common-source amplifier**:

$$
v_{out} = V_{DD} - I_D R_D \quad\Rightarrow\quad A_v = \frac{v_{out}}{v_{gs}} = -g_m R_D \tag{3}
$$

Read the minus sign as a chain: gate goes up → more current → bigger drop across $R_D$ → drain voltage goes **down**. That's an inverting stage.

> [!tip] Where the extra energy comes from: the gate only steers. The power that appears in the output comes from $V_{DD}$, the same way the supply pins power an op amp. The gate is insulated, so it draws no current and the input source barely has to do any work.

### The differential pair

An op amp's input stage is two matched MOSFETs, M1 and M2, with their sources tied together and fed by one fixed **tail current** $I_{SS}$. Each drain connects to $V_{DD}$ through its own load $R_D$. The inputs go on the gates ($v_+$ on M1, $v_-$ on M2).

1. **Inputs equal:** the tail current splits 50/50, so each side carries $I_{SS}/2$. Nothing changes if both inputs rise together, so a signal common to both inputs is mostly ignored.
2. **$v_+$ slightly higher than $v_-$:** M1 conducts more and M2 less. Since the total is fixed at $I_{SS}$, whatever M1 gains M2 loses:
   $$i_{D1} = \frac{I_{SS}}{2} + \frac{g_m v_d}{2}, \qquad i_{D2} = \frac{I_{SS}}{2} - \frac{g_m v_d}{2}, \qquad v_d = v_+ - v_-$$
3. **Reading the output off M2's drain:** less current through $R_D$ means a smaller drop, so that drain voltage goes **up** when $v_+$ goes up:
   $$\Delta v_{out} = +\frac{g_m R_D}{2}\,v_d \tag{4}$$

That is the reason the pins are called non-inverting ($v_+$ raises the output) and inverting ($v_-$ lowers it), and the reason the op amp responds to **$v_+ - v_-$** and not to either voltage alone.

### From one pair to an op amp

A single pair gives a gain of only tens, nowhere near $10^5$, so an op amp stacks stages. Gains multiply (like the cascade in [[ch05-operational-amplifiers|Ch 5]]):

|Stage|Job|Gain|
|---|---|---|
|1. Differential pair|Takes $v_+ - v_-$ and turns it into a current imbalance, then a voltage|tens to hundreds|
|2. Common-source gain stage|Amplifies the stage-1 output again|tens to hundreds|
|3. Output stage|Buffers the result so it can drive a load (low $R_o$)|about 1|

Real chips replace $R_D$ with transistor **current-source loads**, which behave like a very large resistance and push each stage's gain up to 100 or more. Two such stages multiplied together reach roughly $10^4$ to $10^5$, which is where $A \approx 10^5$ comes from.

#### Worked example: gain of a two-stage amplifier

Stage 1 is a differential pair with $g_m = 2\ \text{mS}$ and $R_D = 20\ \text{k}\Omega$. Stage 2 is a common-source stage with $g_m = 2\ \text{mS}$ and $R_D = 10\ \text{k}\Omega$. Find the overall gain.

- Stage 1, Eq. (4): $\frac{g_m R_D}{2} = \frac{(0.002)(20\,000)}{2} = 20$
- Stage 2, Eq. (3): $-g_m R_D = -(0.002)(10\,000) = -20$
- Overall: $(20)(-20) = -400$

That is a gain of 400 from plain resistor loads. Op amps need about 250 times that, which is why they use current-source loads and more stages. (The overall sign depends on which side of the pair you read.)

### What this explains in ELE 302

- **$v_o = A(v_+ - v_-)$:** only the difference matters because the pair steers a fixed current between two sides.
- **$i_+ = i_- = 0$:** the inputs are insulated MOSFET gates, so they draw almost no current.
- **Saturation at the rails:** the output transistors run out of supply to work with, so $v_o$ can't pass $V_{CC+}$ or $V_{CC-}$.
- **$A$ is huge but unreliable:** $g_m$ and the loads change with temperature and from chip to chip, so the gain wanders. That's why [[ch05-operational-amplifiers#Negative Feedback|negative feedback]] is used to make the gain depend on resistors instead.

> [!note] Many classic op amps (like the 741) use bipolar transistors (BJTs) instead of MOSFETs. The ideas are identical: a differential pair, gain stages, and an output stage. Only the device equations differ.

## How real it is

The ideal-switch model is enough for logic design, but a real MOSFET has:

- **ON resistance:** a closed switch isn't a perfect wire.
- **Capacitance:** the gate and wiring have to be charged and discharged, which is where **propagation delay** comes from (see *Speed of logic gates* in [[ch03-implementation-technology|Ch 3]]).
- **A threshold voltage** $V_T$ below which the channel doesn't form.

For the device physics behind the channel, threshold voltage and the current equations, see PCS 224 Ch 9: MOSFET Operation.

## Common mistakes

- Mixing up the two types. **NMOS is ON with a 1** and **PMOS is ON with a 0**.
- Thinking the gate conducts current to the output. The gate is insulated and only controls the channel.
- Thinking an NMOS "makes" 0 V. When it's ON it just gives the output a low-resistance path to ground.
