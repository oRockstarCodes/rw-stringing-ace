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

> [!note] Supply pins are usually left off circuit diagrams, but they're always there and they're why the output saturates.

## Notes

### Open Loop

**Open loop** means the op amp is used on its own, with nothing connecting the output back to either input. The output is just $v_o = A(v_+ - v_-)$.

![[ele-302-opamp-open-loop.svg]]

This isn't very useful as an amplifier, for two reasons:

- **It saturates almost instantly.** $A$ is huge (around $10^5$), so with $\pm 15\ \text{V}$ supplies the output hits a rail once the inputs differ by more than $15 / 10^5 = 0.15\ \text{mV}$. Any real signal is bigger than that, so the output just sits at $+15$ or $-15\ \text{V}$.
- **The gain is unreliable.** $A$ changes a lot between chips, with temperature, and with frequency, so even a tiny signal wouldn't get a predictable gain.

> [!note] Open loop is still useful as a **comparator**: the output tells you which input is bigger (high rail if $v_+ > v_-$, low rail if $v_+ < v_-$).

### Negative Feedback

**Negative feedback** fixes the open-loop problem by connecting the output back to the **inverting input** ($v_-$), either through a resistor or a plain wire, as in the buffer below.

![[ele-302-opamp-feedback-loop.svg]]

**Why it works: the op amp corrects itself**

1. Say $v_o$ is a bit too high.
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
A_{CL} = \frac{A}{1 + A\beta} \approx \frac{1}{\beta} \quad (\text{when } A\beta \gg 1)
$$

- $A_{CL}$: closed-loop gain, $v_o / v_i$ for the whole circuit with feedback connected
- $A$: open-loop gain of the op amp itself
- $\beta$: feedback factor, the fraction of $v_o$ that reaches $v_-$. For a non-inverting amp, $\beta = \frac{R_1}{R_1 + R_f}$

For the non-inverting amp, $\frac{1}{\beta} = \frac{R_1 + R_f}{R_1} = 1 + \frac{R_f}{R_1}$, which is exactly its gain formula. $A$ cancels out, which is the whole point: $A$ varies a lot from chip to chip and with temperature, but resistor values are precise and stable.

**How to tell which kind of feedback a circuit has**

![[ele-302-opamp-feedback-types.svg]]

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


## Key formulas

**General**

$$
v_o = A\,v_d = A\,(v_+ - v_-)
$$

- $v_o$: output voltage
- $A$: open-loop gain (the op amp's built-in gain, with no feedback)
- $v_d$: differential input voltage, $v_+ - v_-$
- $v_+$: voltage at the non-inverting input
- $v_-$: voltage at the inverting input

**Inverting amplifier**

$$
v_o = -\frac{R_f}{R_1}\,v_i
$$

- $v_o$: output voltage
- $v_i$: input voltage, fed through $R_1$ into the inverting input
- $R_1$: input resistor, from $v_i$ to the inverting input
- $R_f$: feedback resistor, from the output back to the inverting input

**Non-inverting amplifier**

$$
v_o = \left(1 + \frac{R_f}{R_1}\right) v_i
$$

- $v_o$: output voltage
- $v_i$: input voltage, applied directly to the non-inverting input
- $R_1$: resistor from the inverting input to ground
- $R_f$: feedback resistor, from the output back to the inverting input

**Voltage follower (buffer)**

$$
v_o = v_i
$$

- $v_o$: output voltage (the output is wired straight to the inverting input)
- $v_i$: input voltage, applied to the non-inverting input

**Summing amplifier** (inverting)

$$
v_o = -\left(\frac{R_f}{R_1}v_1 + \frac{R_f}{R_2}v_2 + \frac{R_f}{R_3}v_3\right)
$$

- $v_o$: output voltage
- $v_1, v_2, v_3$: input voltages being summed
- $R_1, R_2, R_3$: input resistors, one per input, each going to the inverting input
- $R_f$: feedback resistor, from the output back to the inverting input

**Difference amplifier** (with $R_1/R_2 = R_3/R_4$)

$$
v_o = \frac{R_2}{R_1}\,(v_2 - v_1)
$$

- $v_o$: output voltage
- $v_1$: input voltage on the inverting side
- $v_2$: input voltage on the non-inverting side
- $R_1$: input resistor, from $v_1$ to the inverting input
- $R_2$: feedback resistor, from the output back to the inverting input
- $R_3$: input resistor, from $v_2$ to the non-inverting input
- $R_4$: resistor from the non-inverting input to ground

**Cascaded stages**

$$
A_{total} = A_1 \cdot A_2 \cdot A_3 \cdots
$$

- $A_{total}$: overall gain of the chain (final output ÷ first input)
- $A_1, A_2, A_3, \ldots$: closed-loop gain of each individual stage

## Examples

### Example 1: Inverting amp

**Setup:** $R_1 = 10\ \text{k}\Omega$, $R_f = 25\ \text{k}\Omega$, $v_i = 0.5\ \text{V}$

![[ele-302-opamp-ex1-inverting.svg]]

- $v_- = v_+ = 0$, so current through $R_1$: $i = \frac{0.5 - 0}{10\text{k}} = 50\ \mu\text{A}$
- Same current flows through $R_f$: $v_o = 0 - (50\ \mu\text{A})(25\text{k}) = -1.25\ \text{V}$
- Check with formula: $-\frac{25}{10}(0.5) = -1.25\ \text{V}$ ✓

### Example 2: Non-inverting amp with a voltage divider on the input

**Setup:** $v_s = 6\ \text{V}$ goes through a divider ($4\ \text{k}\Omega$ on top, $8\ \text{k}\Omega$ to ground) into $v_+$. $R_1 = 5\ \text{k}\Omega$ from $v_-$ to ground, $R_f = 10\ \text{k}\Omega$ from output to $v_-$. Supplies are $\pm 15\ \text{V}$. Find $v_o$.

![[ele-302-opamp-ex2-noninverting-divider.svg]]

1. **Find $v_+$ first.** No current goes into $v_+$, so the divider is unloaded:
   $$v_+ = 6 \cdot \frac{8}{4 + 8} = 4\ \text{V}$$
2. **Virtual short:** $v_- = v_+ = 4\ \text{V}$
3. **KCL at $v_-$** (current leaving through $R_1$ = current arriving through $R_f$):
   $$\frac{4 - 0}{5\text{k}} = \frac{v_o - 4}{10\text{k}} \quad\Rightarrow\quad 0.8\ \text{mA} = \frac{v_o - 4}{10\text{k}} \quad\Rightarrow\quad v_o = 12\ \text{V}$$
4. **Check:** formula gives $(1 + \frac{10}{5})(4) = 12\ \text{V}$ ✓, and $12 < 15$, so no saturation.

> [!tip] The non-inverting formula only uses the voltage that actually reaches $v_+$ (4 V here), not the source voltage (6 V).

### Example 3: Output current $i_o$

**Setup:** Inverting amp with $R_1 = 10\ \text{k}\Omega$, $R_f = 40\ \text{k}\Omega$, $v_i = -0.5\ \text{V}$, and a load $R_L = 8\ \text{k}\Omega$ from the output to ground. Find $v_o$ and the current $i_o$ coming out of the op amp.

![[ele-302-opamp-ex3-output-current.svg]]

1. **Find $v_o$:** $v_o = -\frac{40}{10}(-0.5) = 2\ \text{V}$
2. **Current through $R_f$** (output → $v_-$, where $v_- = 0$):
   $$i_f = \frac{2 - 0}{40\text{k}} = 50\ \mu\text{A}$$
3. **Current through $R_L$:**
   $$i_L = \frac{2}{8\text{k}} = 250\ \mu\text{A}$$
4. **KCL at the output node.** The op amp supplies both branches:
   $$i_o = i_L + i_f = 250 + 50 = 300\ \mu\text{A}$$

> [!note] KCL at the output is fine **here** because $v_o$ is already known. You just can't use it to *find* $v_o$.

### Example 4: Saturation

**Setup:** Inverting amp with gain $-10$ ($R_1 = 1\ \text{k}\Omega$, $R_f = 10\ \text{k}\Omega$), supplies $\pm 12\ \text{V}$.

![[ele-302-opamp-ex4-saturation.svg]]

**(a) What's the largest $|v_i|$ before the output saturates?**
$$|v_o| \le 12 \quad\Rightarrow\quad 10\,|v_i| \le 12 \quad\Rightarrow\quad |v_i| \le 1.2\ \text{V}$$

**(b) What's $v_o$ when $v_i = 2\ \text{V}$?**
- Ideal answer: $-10(2) = -20\ \text{V}$
- That's past the $-12\ \text{V}$ rail, so the output clips: $v_o = -12\ \text{V}$

### Example 5: Summing amplifier

**Setup:** $R_f = 60\ \text{k}\Omega$, $R_1 = 20\ \text{k}\Omega$, $R_2 = 30\ \text{k}\Omega$, $R_3 = 10\ \text{k}\Omega$. Inputs $v_1 = 1\ \text{V}$, $v_2 = -2\ \text{V}$, $v_3 = 0.5\ \text{V}$. Find $v_o$.

![[ele-302-opamp-ex5-summing.svg]]

1. **Gain on each input:** $\frac{60}{20} = 3$, $\quad\frac{60}{30} = 2$, $\quad\frac{60}{10} = 6$
2. **Plug in:**
   $$v_o = -\big(3(1) + 2(-2) + 6(0.5)\big) = -(3 - 4 + 3) = -2\ \text{V}$$

**Why it works (KCL at $v_-$, with $v_- = 0$):** each input pushes $v_k / R_k$ into the node, and the total has to leave through $R_f$:
$$\frac{v_1}{R_1} + \frac{v_2}{R_2} + \frac{v_3}{R_3} = \frac{0 - v_o}{R_f}$$

### Example 6: Difference amplifier (solved the long way)

**Setup:** $R_1 = R_3 = 10\ \text{k}\Omega$, $R_2 = R_4 = 50\ \text{k}\Omega$, $v_1 = 2\ \text{V}$, $v_2 = 3\ \text{V}$. Find $v_o$.

![[ele-302-opamp-ex6-difference.svg]]

1. **$v_+$ from the divider** ($v_2$ through $R_3$, $R_4$ to ground):
   $$v_+ = 3 \cdot \frac{50}{10 + 50} = 2.5\ \text{V}$$
2. **Virtual short:** $v_- = 2.5\ \text{V}$
3. **KCL at $v_-$:**
   $$\frac{v_1 - v_-}{R_1} = \frac{v_- - v_o}{R_2} \quad\Rightarrow\quad \frac{2 - 2.5}{10\text{k}} = \frac{2.5 - v_o}{50\text{k}}$$
   $$-50\ \mu\text{A} = \frac{2.5 - v_o}{50\text{k}} \quad\Rightarrow\quad 2.5 - v_o = -2.5 \quad\Rightarrow\quad v_o = 5\ \text{V}$$
4. **Check:** $R_1/R_2 = R_3/R_4 = 0.2$, so the shortcut applies: $\frac{50}{10}(3 - 2) = 5\ \text{V}$ ✓

> [!tip] If the resistor ratios **don't** match, the shortcut is wrong, but steps 1–3 still work every time.

### Example 7: Non-ideal op amp (finite gain)

**Setup:** Same inverting amp layout, $R_1 = 10\ \text{k}\Omega$, $R_f = 100\ \text{k}\Omega$, $v_i = 1\ \text{V}$, but now the op amp has a finite gain $A = 10^4$. Assume $R_i = \infty$ and $R_o = 0$. Find $v_o$ and $v_-$.

![[ele-302-opamp-ex7-finite-gain.svg]]

1. **No virtual short this time.** Use the op amp equation instead, with $v_+ = 0$:
   $$v_o = A(v_+ - v_-) = -A\,v_- \quad\Rightarrow\quad v_- = -\frac{v_o}{A}$$
2. **KCL at $v_-$** (still no current into the input, since $R_i = \infty$):
   $$\frac{v_i - v_-}{R_1} = \frac{v_- - v_o}{R_f}$$
3. **Substitute $v_- = -v_o/A$ and solve.** This gives:
   $$\frac{v_o}{v_i} = \frac{-R_f/R_1}{1 + \dfrac{1 + R_f/R_1}{A}} = \frac{-10}{1 + \dfrac{11}{10^4}} = \frac{-10}{1.0011} \approx -9.989$$
4. **Results:** $v_o \approx -9.989\ \text{V}$, and $v_- = -\frac{-9.989}{10^4} \approx 0.999\ \text{mV}$

> [!note] The ideal answer is $-10\ \text{V}$, so the error is about 0.1%. $v_-$ is about 1 mV rather than exactly 0, which is why the virtual short is such a good approximation. As $A \to \infty$, the formula in step 3 turns into $-R_f/R_1$.

## Common mistakes

- Writing KCL at the **output** node instead of the inverting input
- Assuming $v_+ = v_-$ when there's **no negative feedback** (e.g. comparators)
- Forgetting the **minus sign** on inverting and summing amps
- Ignoring **saturation**: a "gain of 100" on 1 V with ±15 V rails gives 15 V, not 100 V
- Mixing up $R_1$ and $R_f$ in the non-inverting gain ($1 + R_f/R_1$, not $R_1/R_f$)