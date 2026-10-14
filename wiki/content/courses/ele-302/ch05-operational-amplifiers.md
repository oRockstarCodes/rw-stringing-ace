---
title: "Ch 5: Operational Amplifiers"
tags:
  - ele302
---
## Overview

> [!info] Readings Alexander & Sadiku, **Ch 5**

An **operational amplifier (op amp)** takes the voltage difference between its two inputs, multiplies it by a very large gain, and outputs the result. With external resistors providing **negative feedback**, it becomes a precise building block for amplifiers, summers, buffers, and more.

## Components

|Terminal|Name|What it does|
|---|---|---|
|$V_-$|Inverting input|Signal here is **subtracted**: raising $V_-$ pushes $V_{out}$ down. Usually where feedback connects.|
|$V_+$|Non-inverting input|Signal here is **added**: raising $V_+$ pushes $V_{out}$ up.|
|$V_{CC+}$|Positive supply|Powers the op amp; sets the **upper limit** of $V_{out}$.|
|$V_{CC-}$|Negative supply|Powers the op amp; sets the **lower limit** of $V_{out}$.|
|$V_{out}$|Output|Amplified difference $A(V_+ - V_-)$, clipped between the supply rails.|

**Try it:** pick a terminal to see what it does, then move the sliders. Turn $A$ up to a real op amp's $10^5$ and watch the output hit a rail unless the inputs are almost equal.

<div class="melon-opamp" data-view="pins">Interactive op amp diagram (open this page on the site to use it).</div>

> [!note] Supply pins are usually left off circuit diagrams, but they're always there and they're why the output saturates.

## Notes

### Open Loop

**Open loop** means the op amp is used on its own, with nothing connecting the output back to either input (Figure 5.1). The output is just:

$$
v_o = A\,(v_+ - v_-) \tag{5.1}
$$

![[ele-302-opamp-open-loop.svg]]
*Figure 5.1: An open-loop op amp (left) and its output vs. the input difference (right).*

This isn't very useful as an amplifier, for two reasons:

- **It saturates almost instantly.** $A$ is huge (around $10^5$), so with $\pm 15\ \text{V}$ supplies the output hits a rail once the inputs differ by more than $15 / 10^5 = 0.15\ \text{mV}$. Any real signal is bigger than that, so the output just sits at $+15$ or $-15\ \text{V}$.
- **The gain is unreliable.** $A$ changes a lot between chips, with temperature, and with frequency, so even a tiny signal wouldn't get a predictable gain.

> [!note] Open loop is still useful as a **comparator**: the output tells you which input is bigger (high rail if $v_+ > v_-$, low rail if $v_+ < v_-$).

### Negative Feedback

**Negative feedback** fixes the open-loop problem by connecting the output back to the **inverting input** ($v_-$), either through a resistor or a plain wire, as in the buffer in Figure 5.2.

![[ele-302-opamp-feedback-loop.svg]]
*Figure 5.2: A buffer, the simplest negative feedback circuit. The output is wired straight back to $v_-$.*

**Why it works: the op amp corrects itself**

1. Say $v_o$ is a bit too high which happens where there's a larger difference between $v_+ - v_-$ .
2. Some of $v_o$ is fed back to $v_-$, so $v_-$ rises too.
3. That makes $v_+ - v_-$ smaller, so $A(v_+ - v_-)$ pulls $v_o$ back down.
4. The same thing happens in reverse if $v_o$ is too low.

The output settles at whatever voltage makes $v_-$ almost exactly equal to $v_+$. That's where the **virtual short** ($v_+ = v_-$) comes from.

> [!example] Buffer with $A = 10^5$ and $v_i = 2\ \text{V}$
> The output is wired straight to $v_-$, so $v_- = v_o$:
> $$v_o = A(v_i - v_o) \quad\Rightarrow\quad v_o = \frac{A}{1 + A}\,v_i = \frac{10^5}{100\,001}(2) \approx 1.99998\ \text{V}$$
> The inputs differ by only $2 - 1.99998 = 20\ \mu\text{V}$. In practice that's $v_+ = v_-$.

**The gain is set by the resistors, not by $A$**

If a fraction $\beta$ of the output gets fed back to $v_-$, the gain of the whole circuit is:

$$
A_{CL} = \frac{A}{1 + A\beta} \approx \frac{1}{\beta} \quad (\text{when } A\beta \gg 1) \tag{5.2}
$$

- $A_{CL}$: closed-loop gain, $v_o / v_i$ for the whole circuit with feedback connected
- $A$: open-loop gain of the op amp itself
- $\beta$: feedback factor, the fraction of $v_o$ that reaches $v_-$. For a non-inverting amp, $\beta = \frac{R_1}{R_1 + R_f}$

For the non-inverting amp, $\frac{1}{\beta} = \frac{R_1 + R_f}{R_1} = 1 + \frac{R_f}{R_1}$, which is exactly its gain formula, Eq. (5.5). $A$ cancels out, which is the whole point: $A$ varies a lot from chip to chip and with temperature, but resistor values are precise and stable.

### Positive Feedback

**Positive feedback** connects the output back to the **non-inverting input** ($v_+$) instead. Now the feedback pushes the output the same way it's already going, so instead of correcting itself, the op amp runs away:

1. Say $v_o$ goes up a little.
2. Some of $v_o$ is fed back to $v_+$, so $v_+$ rises too.
3. That makes $v_+ - v_-$ **bigger**, so $A(v_+ - v_-)$ pushes $v_o$ up even more.
4. This repeats until $v_o$ hits the supply rail, and it **stays there**.

So the output is never in between: it's always at $+V_{sat}$ or $-V_{sat}$, and the virtual short ($v_+ = v_-$) **does not apply**. That makes positive feedback useless for amplifying, but useful for **switching** circuits.

**Where it's used: the Schmitt trigger**

A Schmitt trigger is a comparator with positive feedback added. The input goes to $v_-$, and $R_1$ and $R_2$ feed a fraction of the output back to $v_+$ (Figure 5.3):

![[ele-302-opamp-schmitt-trigger.svg]]
*Figure 5.3: An inverting Schmitt trigger (left) and its hysteresis loop (right).*

Because no current flows into $v_+$, $R_1$ and $R_2$ form a voltage divider from the output:

$$
v_+ = \beta\,v_o, \qquad \beta = \frac{R_1}{R_1 + R_2} \tag{5.3}
$$

- $v_+$: voltage at the non-inverting input, which acts as the switching threshold
- $v_o$: output voltage, either $+V_{sat}$ or $-V_{sat}$
- $\beta$: fraction of the output fed back to $v_+$
- $R_1$: resistor from $v_+$ to ground
- $R_2$: feedback resistor, from the output to $v_+$

Since $v_o$ can only be $\pm V_{sat}$, there are two thresholds, $+\beta V_{sat}$ and $-\beta V_{sat}$. With $R_1 = 10\ \text{k}\Omega$, $R_2 = 40\ \text{k}\Omega$ and $\pm 12\ \text{V}$ supplies, $\beta = \frac{10}{50} = 0.2$, so the thresholds are $\pm 2.4\ \text{V}$:

- While $v_o = +12\ \text{V}$, $v_+ = +2.4\ \text{V}$. The output only flips to $-12\ \text{V}$ once $v_i$ rises **above $+2.4\ \text{V}$**.
- While $v_o = -12\ \text{V}$, $v_+ = -2.4\ \text{V}$. The output only flips back once $v_i$ drops **below $-2.4\ \text{V}$**.

This gap between the two thresholds is called **hysteresis** (the loop in Figure 5.3). It's the reason to use one: a noisy signal wobbling around a single threshold would make a plain comparator flip back and forth rapidly, but a Schmitt trigger ignores any wobble smaller than the gap.

### Spotting the Feedback Type

![[ele-302-opamp-feedback-types.svg]]
*Figure 5.4: The three possibilities. The feedback path, if there is one, is highlighted.*

|Output connects back to...|Feedback|What happens|Can you use $v_+ = v_-$?|
|---|---|---|---|
|$v_-$ (inverting input)|Negative|Output settles at a stable value|Yes|
|$v_+$ (non-inverting input)|Positive|Output runs away to a supply rail|No|
|Nothing (open loop)|None|Output saturates (comparator)|No|

> [!warning] Every amplifier circuit in this chapter uses negative feedback. If you can't find a path from the output back to $v_-$, don't assume the virtual short.

### Ideal Op Amp Model

In the ideal world, op amps are a lot easier to work with. This is because you can assume $A \to \infty$, $R_i \to \infty$, $R_o \to 0$. This gives two rules:

1. **No current into the inputs:** $i_+ = i_- = 0$
2. **Inputs are at the same voltage** (virtual short): $v_+ = v_-$ (only valid with negative feedback)

> [!tip] Solving method Apply the two ideal rules, then do **KCL at the inverting node**. Never write KCL at the output node (the op amp sources unknown current there).


### Real Op Amp Model

- Modeled as input resistance $R_i$ between the inputs, and a dependent source $A v_d$ in series with output resistance $R_o$.
- Typical values: $A \approx 10^5$–$10^8$, $R_i \approx 10^6$–$10^{13}\ \Omega$, $R_o \approx 10$–$100\ \Omega$.
- **Saturation:** output can't exceed the supplies, so $V_{CC-} \le v_o \le V_{CC+}$.

**Try it:** pick each part of the model, then switch to the ideal op amp to see where the two ideal rules come from.

<div class="melon-opamp" data-view="model">Interactive op amp model (open this page on the site to use it).</div>


## Key formulas

**General**

$$
v_o = A\,v_d = A\,(v_+ - v_-) \tag{5.1}
$$

- $v_o$: output voltage
- $A$: open-loop gain (the op amp's built-in gain, with no feedback)
- $v_d$: differential input voltage, $v_+ - v_-$
- $v_+$: voltage at the non-inverting input
- $v_-$: voltage at the inverting input

**Inverting amplifier**

$$
v_o = -\frac{R_f}{R_1}\,v_i \tag{5.4}
$$

- $v_o$: output voltage
- $v_i$: input voltage, fed through $R_1$ into the inverting input
- $R_1$: input resistor, from $v_i$ to the inverting input
- $R_f$: feedback resistor, from the output back to the inverting input

**Non-inverting amplifier**

$$
v_o = \left(1 + \frac{R_f}{R_1}\right) v_i \tag{5.5}
$$

- $v_o$: output voltage
- $v_i$: input voltage, applied directly to the non-inverting input
- $R_1$: resistor from the inverting input to ground
- $R_f$: feedback resistor, from the output back to the inverting input

**Voltage follower (buffer)**

$$
v_o = v_i \tag{5.6}
$$

- $v_o$: output voltage (the output is wired straight to the inverting input)
- $v_i$: input voltage, applied to the non-inverting input

**Summing amplifier** (inverting)

$$
v_o = -\left(\frac{R_f}{R_1}v_1 + \frac{R_f}{R_2}v_2 + \frac{R_f}{R_3}v_3\right) \tag{5.7}
$$

- $v_o$: output voltage
- $v_1, v_2, v_3$: input voltages being summed
- $R_1, R_2, R_3$: input resistors, one per input, each going to the inverting input
- $R_f$: feedback resistor, from the output back to the inverting input

**Difference amplifier** (general)

$$
v_o = -\frac{R_2}{R_1}\,v_1 + \frac{R_4}{R_3 + R_4}\left(1 + \frac{R_2}{R_1}\right) v_2 \tag{5.8}
$$

**Difference amplifier** (when $R_1/R_2 = R_3/R_4$)

$$
v_o = \frac{R_2}{R_1}\,(v_2 - v_1) \tag{5.9}
$$

- $v_o$: output voltage
- $v_1$: input voltage on the inverting side
- $v_2$: input voltage on the non-inverting side
- $R_1$: input resistor, from $v_1$ to the inverting input
- $R_2$: feedback resistor, from the output back to the inverting input
- $R_3$: input resistor, from $v_2$ to the non-inverting input
- $R_4$: resistor from the non-inverting input to ground

Eq. (5.8) is just superposition: the $v_1$ term is an inverting amp, and the $v_2$ term is a voltage divider ($R_3$, $R_4$) followed by a non-inverting amp. Eq. (5.9) is the special case where the ratios match.

**Cascaded stages**

$$
A_{total} = A_1 \cdot A_2 \cdot A_3 \cdots \tag{5.10}
$$

- $A_{total}$: overall gain of the chain (final output ÷ first input)
- $A_1, A_2, A_3, \ldots$: closed-loop gain of each individual stage

## Examples

These follow the assigned textbook problems for Chapter 5, with different numbers. Tutorial problems are marked **(T)**; the quiz problems will be similar to those.

### Example 1: Op amp equivalent model

> Like Prob. 5.1

The equivalent model of an op amp is shown in Figure 5.5. Determine (a) the input resistance, (b) the output resistance, and (c) the voltage gain in dB.

![[ele-302-opamp-ex01-model.svg]]
*Figure 5.5: Equivalent model for Example 1.*

Read the model straight off the diagram:

- (a) The resistance between the input terminals: $R_i = 2\ \text{M}\Omega$
- (b) The resistance in series with the output: $R_o = 50\ \Omega$
- (c) The open-loop gain is the number in front of $v_d$, so $A = 2 \times 10^5$. In decibels:
  $$A_{dB} = 20\log_{10}A = 20\log_{10}(2 \times 10^5) = 106.02\ \text{dB}$$

### Example 2: Non-ideal voltage follower

> Like Prob. 5.5

The op amp in Figure 5.6 has an open-loop gain of 50,000, an input resistance of 20 kΩ, and an output resistance of 50 Ω. Find the voltage gain $v_o/v_i$ using the non-ideal model.

![[ele-302-opamp-ex02-buffer.svg]]
*Figure 5.6: Voltage follower for Example 2.*

1. **Replace the op amp with its model.** $R_i$ sits between $v_+ = v_i$ and $v_- = v_o$, and the output is $A v_d$ in series with $R_o$, where
   $$v_d = v_+ - v_- = v_i - v_o$$
2. **KCL at the output node.** The current through $R_i$ (from $v_i$ to $v_o$) plus the current through $R_o$ (from the source to $v_o$) must add to zero, since nothing else is connected:
   $$\frac{v_i - v_o}{R_i} + \frac{A(v_i - v_o) - v_o}{R_o} = 0$$
3. **Multiply through by $R_i R_o$ and solve:**
   $$\frac{v_o}{v_i} = \frac{R_o + A R_i}{R_o + (A + 1)R_i} = \frac{50 + (5 \times 10^4)(20\text{k})}{50 + (50\,001)(20\text{k})} = 0.99998$$

> [!note] The ideal answer is exactly 1. The non-ideal model is only worth the algebra when the question asks for it, as this one does.

### Example 3: Non-ideal inverting amplifier (T)

> Like Prob. 5.7 (T)

The op amp in Figure 5.7 has $R_i = 200\ \text{k}\Omega$, $R_o = 50\ \Omega$, and $A = 200{,}000$. Find the differential voltage $v_d$ and the output voltage $v_o$.

![[ele-302-opamp-ex03-nonideal-inverting.svg]]
*Figure 5.7: Inverting amplifier for Example 3.*

Call the inverting-input node $v_1$. Since $v_+ = 0$, $v_d = v_+ - v_- = -v_1$, and the op amp's output source is $A v_d = -A v_1$.

1. **KCL at $v_1$** (in through 20 kΩ = out through $R_i$ to ground + out through 100 kΩ):
   $$\frac{2\text{m} - v_1}{20\text{k}} = \frac{v_1}{200\text{k}} + \frac{v_1 - v_o}{100\text{k}}$$
   Multiplying by 200k: $\quad 20\text{m} = 13\,v_1 - 2\,v_o$
2. **KCL at $v_o$** (in through 100 kΩ = out through $R_o$ into the source):
   $$\frac{v_1 - v_o}{100\text{k}} = \frac{v_o - (-A v_1)}{50}$$
   Multiplying by 100k: $\quad v_1 - v_o = 2000\,v_o + (4 \times 10^8)\,v_1 \quad\Rightarrow\quad v_1 \approx -5.0025 \times 10^{-6}\,v_o$
3. **Substitute into step 1:**
   $$20\text{m} = 13(-5.0025 \times 10^{-6})\,v_o - 2\,v_o \quad\Rightarrow\quad v_o \approx -9.9997\ \text{mV}$$
4. **Then** $v_1 = (-5.0025 \times 10^{-6})(-9.9997\text{m}) \approx 50.02\ \text{nV}$, so
   $$v_d = -v_1 \approx -50.02\ \text{nV}$$

> [!tip] Check: the ideal answer is $-\frac{100}{20}(2\ \text{mV}) = -10\ \text{mV}$, and $v_d$ is tiny, so the virtual short is a very good approximation.

### Example 4: Sources connected directly to the inputs

> Like Prob. 5.9

Determine $v_o$ in the op amp circuit of Figure 5.8.

![[ele-302-opamp-ex04-sources-on-inputs.svg]]
*Figure 5.8: Circuit for Example 4.*

1. **$v_+$ is fixed by the voltage source:** $v_+ = 3\ \text{V}$, so $v_- = 3\ \text{V}$ too.
2. **No current enters the op amp,** so all 2 mA from the current source has to leave the $v_-$ node through the 5 kΩ resistor:
   $$\frac{v_- - v_o}{5\text{k}} = 2\text{m} \quad\Rightarrow\quad 3 - v_o = 10 \quad\Rightarrow\quad v_o = -7\ \text{V}$$

### Example 5: Find $v_o$ and $i_o$

> Like Probs. 5.13 and 5.29

Find $v_o$ and $i_o$ in the circuit of Figure 5.9.

![[ele-302-opamp-ex05-divider-io.svg]]
*Figure 5.9: Circuit for Example 5.*

1. **$v_+$ from the divider** (no current into $v_+$, so the divider is unloaded):
   $$v_+ = 2 \cdot \frac{30}{20 + 30} = 1.2\ \text{V}$$
2. **Non-inverting gain,** Eq. (5.5):
   $$v_o = \left(1 + \frac{40}{10}\right)(1.2) = 6\ \text{V}$$
3. **$i_o$ is the op amp's output current.** It splits between the 12 kΩ load and the feedback path (40 kΩ then 10 kΩ to ground):
   $$i_o = \frac{6}{12\text{k}} + \frac{6}{40\text{k} + 10\text{k}} = 0.5\ \text{mA} + 0.12\ \text{mA} = 0.62\ \text{mA}$$

> [!tip] The feedback path counts as a load too. Forgetting it is the most common mistake on $i_o$ questions.

### Example 6: T-network in the feedback (T)

> Like Prob. 5.15 (T)

(a) Determine the ratio $v_o/i_s$ for the circuit in Figure 5.10. (b) Evaluate it for $R_1 = 10\ \text{k}\Omega$, $R_2 = 5\ \text{k}\Omega$, $R_3 = 20\ \text{k}\Omega$.

![[ele-302-opamp-ex06-t-network.svg]]
*Figure 5.10: Circuit for Example 6. Call the middle node of the T $v_m$.*

**(a)**

1. **$v_- = v_+ = 0$.** All of $i_s$ flows from the $v_-$ node through $R_1$ to $v_m$:
   $$\frac{0 - v_m}{R_1} = i_s \quad\Rightarrow\quad v_m = -i_s R_1$$
2. **KCL at $v_m$** (in through $R_1$ = out through $R_2$ + out through $R_3$):
   $$i_s = \frac{v_m}{R_2} + \frac{v_m - v_o}{R_3}$$
3. **Solve for $v_o$ and substitute $v_m$:**
   $$v_o = v_m\left(1 + \frac{R_3}{R_2}\right) - R_3\,i_s \quad\Rightarrow\quad \frac{v_o}{i_s} = -\left(R_1 + R_3 + \frac{R_1 R_3}{R_2}\right)$$

**(b)**
$$\frac{v_o}{i_s} = -\left(10\text{k} + 20\text{k} + \frac{(10\text{k})(20\text{k})}{5\text{k}}\right) = -70\ \text{k}\Omega$$

> [!note] The ratio has units of ohms because it's volts out per amp in. The T-network gives a large gain (70 kΩ) without needing any single large resistor.

### Example 7: Find $i_o$ with a resistor network on the input

> Like Prob. 5.19

Determine $i_o$ in the circuit of Figure 5.11.

![[ele-302-opamp-ex07-input-network.svg]]
*Figure 5.11: Circuit for Example 7.*

1. **Replace everything left of the 2 kΩ with its Thévenin equivalent** (1.5 V source, 3 kΩ, 6 kΩ):
   $$V_{th} = 1.5 \cdot \frac{6}{3 + 6} = 1\ \text{V}, \qquad R_{th} = 3\text{k} \parallel 6\text{k} = 2\ \text{k}\Omega$$
2. **Now it's a plain inverting amp** with an input resistance of $R_{th} + 2\text{k} = 4\ \text{k}\Omega$. By Eq. (5.4):
   $$v_o = -\frac{8}{4}(1) = -2\ \text{V}$$
3. **$i_o$ flows down through the 4 kΩ load:**
   $$i_o = \frac{v_o}{4\text{k}} = \frac{-2}{4\text{k}} = -0.5\ \text{mA}$$

So 0.5 mA actually flows *up* through the load, into the op amp's output.

> [!tip] Thévenin works here because the 2 kΩ connects to the virtual ground, so the circuit to its left sees a fixed load. Without Thévenin, you'd do KCL at the 6 kΩ node instead and get the same answer.

### Example 8: Current source on the input, and power

> Like Prob. 5.33

Refer to the op amp circuit in Figure 5.12. Calculate $i_x$ and the power absorbed by the 6 kΩ load.

![[ele-302-opamp-ex08-current-source.svg]]
*Figure 5.12: Circuit for Example 8.*

1. **$v_+$:** no current enters the op amp, so all 1.5 mA flows through the 6 kΩ and 3 kΩ in parallel:
   $$v_+ = (1.5\text{m})(6\text{k} \parallel 3\text{k}) = (1.5\text{m})(2\text{k}) = 3\ \text{V}$$
2. **Non-inverting gain,** Eq. (5.5):
   $$v_o = \left(1 + \frac{4}{2}\right)(3) = 9\ \text{V}$$
3. **Current and power in the load:**
   $$i_x = \frac{9}{6\text{k}} = 1.5\ \text{mA}, \qquad P = v_o\,i_x = (9)(1.5\text{m}) = 13.5\ \text{mW}$$

### Example 9: Summing amplifier, find an unknown input

> Like Prob. 5.39

For the circuit in Figure 5.13, determine the value of $v_2$ that makes $v_o = -9\ \text{V}$.

![[ele-302-opamp-ex09-summing.svg]]
*Figure 5.13: Summing amplifier for Example 9.*

1. **Write Eq. (5.7)** with $R_f = 60\ \text{k}\Omega$:
   $$v_o = -\left(\frac{60}{20}(2) + \frac{60}{30}\,v_2 + \frac{60}{40}(-4)\right) = -(6 + 2v_2 - 6) = -2\,v_2$$
2. **Set it equal to the target:**
   $$-2\,v_2 = -9 \quad\Rightarrow\quad v_2 = 4.5\ \text{V}$$

### Example 10: Design problem

> Like Prob. 5.45

Design an op amp circuit to perform $v_o = 2v_1 - 3v_2$. All resistances must be ≤ 100 kΩ.

1. **Pick the circuit.** One input is subtracted and one is added, so use a difference amplifier. The subtracted input ($v_2$) goes to the inverting side and $v_1$ to the non-inverting side, so $v_1$ and $v_2$ swap places compared with Eq. (5.8).
2. **Match the inverting term** using Eq. (5.8): we need $\frac{R_2}{R_1} = 3$. Choose $R_1 = 20\ \text{k}\Omega$, $R_2 = 60\ \text{k}\Omega$.
3. **Match the non-inverting term.** The non-inverting gain is $1 + \frac{R_2}{R_1} = 4$, but we only want 2, so the divider has to halve $v_1$ first:
   $$\frac{R_4}{R_3 + R_4} \cdot 4 = 2 \quad\Rightarrow\quad \frac{R_4}{R_3 + R_4} = \frac{1}{2} \quad\Rightarrow\quad R_3 = R_4$$
   Choose $R_3 = R_4 = 50\ \text{k}\Omega$.
4. **Check:** $v_o = -\frac{60}{20}v_2 + \frac{50}{100}(4)\,v_1 = 2v_1 - 3v_2$ ✓, and every resistor is ≤ 100 kΩ ✓.

![[ele-302-opamp-ex10-design.svg]]
*Figure 5.14: One possible design for Example 10. Many other resistor values work too.*

> [!tip] Design questions have many right answers. Pick one resistor freely (here $R_1$), then solve for the rest from the gains.

### Example 11: Difference amplifier with mismatched resistors

> Like Prob. 5.47

The circuit in Figure 5.15 is a difference amplifier. Find $v_o$ given $v_1 = 2\ \text{V}$ and $v_2 = 3\ \text{V}$.

![[ele-302-opamp-ex11-difference.svg]]
*Figure 5.15: Difference amplifier for Example 11.*

1. **Check the ratios first:** $R_1/R_2 = 5/20 = 0.25$ but $R_3/R_4 = 10/30 = 0.33$. They don't match, so the shortcut Eq. (5.9) **does not apply**.
2. **$v_+$ from the divider:**
   $$v_+ = 3 \cdot \frac{30}{10 + 30} = 2.25\ \text{V} = v_-$$
3. **KCL at $v_-$:**
   $$\frac{2 - 2.25}{5\text{k}} = \frac{2.25 - v_o}{20\text{k}} \quad\Rightarrow\quad 2.25 - v_o = -1 \quad\Rightarrow\quad v_o = 3.25\ \text{V}$$
4. **Check with Eq. (5.8):** $-\frac{20}{5}(2) + \frac{30}{40}\left(1 + \frac{20}{5}\right)(3) = -8 + 11.25 = 3.25\ \text{V}$ ✓

> [!warning] Using the shortcut here would give $\frac{20}{5}(3 - 2) = 4\ \text{V}$, which is wrong. Always check the ratios.

### Example 12: Cascaded stages (T)

> Like Prob. 5.59 (T)

In the circuit of Figure 5.16, determine the voltage gain $v_o/v_s$. Take $R = 10\ \text{k}\Omega$.

![[ele-302-opamp-ex12-cascaded.svg]]
*Figure 5.16: Two cascaded stages for Example 12.*

1. **Stage 1 is non-inverting** ($v_s$ on $v_+$, $R$ to ground, $3R$ feedback). By Eq. (5.5):
   $$A_1 = \frac{v_1}{v_s} = 1 + \frac{3R}{R} = 4$$
2. **Stage 2 is inverting** ($R$ in, $2R$ feedback). By Eq. (5.4):
   $$A_2 = \frac{v_o}{v_1} = -\frac{2R}{R} = -2$$
3. **Multiply,** Eq. (5.10):
   $$\frac{v_o}{v_s} = A_1 A_2 = (4)(-2) = -8$$

> [!note] $R$ cancels out of every ratio, so its value ($10\ \text{k}\Omega$) doesn't affect the answer. Stage 1's output can feed stage 2 directly because an op amp output acts like an ideal voltage source.

## Common mistakes

- Writing KCL at the **output** node instead of the inverting input
- Assuming $v_+ = v_-$ when there's **no negative feedback** (e.g. comparators)
- Forgetting the **minus sign** on inverting and summing amps
- Ignoring **saturation**: a "gain of 100" on 1 V with ±15 V rails gives 15 V, not 100 V
- Mixing up $R_1$ and $R_f$ in the non-inverting gain ($1 + R_f/R_1$, not $R_1/R_f$)