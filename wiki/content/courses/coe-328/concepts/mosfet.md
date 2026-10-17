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
---

**A MOSFET is a transistor with three terminals (gate, source, drain) where the voltage on the gate decides whether current can flow between the source and the drain. In digital logic we treat it as a voltage-controlled switch.**

MOSFET stands for **M**etal-**O**xide-**S**emiconductor **F**ield-**E**ffect **T**ransistor. Every logic gate in [[ch03-implementation-technology|Ch 3]] is built from them, and a modern chip holds billions.

## Intuition

### The three terminals

|Terminal|Role|
|---|---|
|**Gate (G)**|The control input. It sits on a thin insulating oxide layer, so it draws essentially **no current**. Only its voltage matters.|
|**Source (S)**|One end of the switch. Carriers start here.|
|**Drain (D)**|The other end of the switch. Carriers leave here.|

The switch is the path between **S** and **D**. The gate never touches that path electrically. It controls it through an **electric field** (that's the "field-effect" in the name).

### How the gate turns the switch on

Take an NMOS built on a p-type silicon body.

1. **Gate at 0 V.** There are no free electrons between the source and the drain, so there is no conducting path. The switch is **OFF** (open).
2. **Gate raised to a high voltage.** The positive gate voltage attracts electrons to the surface just under the oxide and pushes holes away. Once the gate voltage passes the **threshold voltage** $V_T$, those electrons form a thin conducting layer called a **channel** that joins the source to the drain. The switch is **ON** (closed).

So the gate acts like one plate of a capacitor, and charging that plate "pulls in" a channel of carriers underneath it.

> [!tip] Water analogy: the gate is a hand on a flexible hose. You don't pump any water yourself. Squeezing (or releasing) the hose changes whether water can flow from one end to the other.

**Try it:** drag the gate voltage, or click the gate terminal, and watch the channel form once the gate passes the threshold. Switch between NMOS and PMOS to see that they respond oppositely.

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

Because a MOSFET behaves as a switch, you can build Boolean functions out of how switches are wired:

- **Series** switches conduct only if all are ON → **AND**
- **Parallel** switches conduct if any is ON → **OR**

The pull-down network of NMOS and the pull-up network of PMOS in a CMOS gate are just these series/parallel arrangements. The gate then outputs the **complement** of what the pull-down network computes, which is why NAND and NOR are the natural gates.

CMOS dominates because in any steady state one network is OFF, so there is no direct path from $V_{DD}$ to GND and almost no static current flows.

## How real it is

The ideal-switch model is enough for logic design, but a real MOSFET has:

- **ON resistance:** a closed switch isn't a perfect wire.
- **Capacitance:** the gate and wiring must be charged and discharged, which is where **propagation delay** comes from (see *Speed of logic gates* in [[ch03-implementation-technology|Ch 3]]).
- **A threshold voltage** $V_T$ below which the channel doesn't form.

For the device physics behind the channel, threshold voltage, and the current equations, see [[ch09-mosfet-operation|PCS 224 Ch 9: MOSFET Operation]].

## Common mistakes

- Mixing up the two types: **NMOS is ON with a 1**, **PMOS is ON with a 0**.
- Thinking the gate conducts current to the output. The gate is insulated. It only controls the channel.
- Thinking an NMOS "makes" 0 V. When ON it gives the output a low-resistance path to ground, nothing more.
