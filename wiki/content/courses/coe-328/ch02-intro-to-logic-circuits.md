---
title: "Ch 2: Introduction to Logic Circuits"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§2.1–2.10** · Lectures 2–4 (*Logic Gates*, *Boolean Algebra*, *NAND and NOR Logic Networks*) · weeks 2–4

**Logic gates** are what every digital circuit is built from, and **Boolean algebra** is the math that describes them. This chapter goes through each gate, how to read a circuit as a Boolean expression (and the other way around), the rules for simplifying expressions, the two standard forms (**SOP** and **POS**), how to build anything out of only NAND or only NOR gates, and the basic design process: specification → truth table → expression → circuit.

## Notes

### The basic gates

Every gate has one output and, except for NOT, two or more inputs. A gate with $n$ inputs has $2^n$ input combinations, so its truth table has $2^n$ rows.

|Gate|Expression|Output is 1 when…|
|---|---|---|
|**NOT** (inverter)|$X = \overline{A}$|the input is 0 (it flips the input)|
|**AND**|$X = AB$|**all** inputs are 1|
|**OR**|$X = A + B$|**at least one** input is 1|
|**NAND**|$X = \overline{AB}$|**at least one** input is 0 (AND, then NOT)|
|**NOR**|$X = \overline{A + B}$|**all** inputs are 0 (OR, then NOT)|
|**XOR**|$X = A \oplus B = A\overline{B} + \overline{A}B$|the inputs are **different**|
|**XNOR**|$X = \overline{A \oplus B} = AB + \overline{A}\,\overline{B}$|the inputs are the **same**|

|$A$|$B$|AND|OR|NAND|NOR|XOR|XNOR|
|---|---|---|---|---|---|---|---|
|0|0|0|0|1|1|0|1|
|0|1|0|1|1|0|1|0|
|1|0|0|1|1|0|1|0|
|1|1|1|1|0|0|0|1|

**Try it:** pick a gate, then click the inputs (on the diagram or the buttons) to flip them. The matching row of the truth table lights up.

<div class="melon-logic" data-view="gates">Interactive logic gates (open this page on the site to use it).</div>

**Notes on each gate**

- **NOT:** also called **complementation**. The small circle (**bubble**) on its output is the **negation indicator**, so anywhere a bubble shows up, the signal is inverted.
- **AND:** called **logical multiplication** ($A \cdot B$ or just $AB$). It works as an **enable** gate: with one input at 1 the other input passes through, and with one input at 0 the output is stuck at 0.
- **OR:** called **logical addition**. Unlike binary addition there's **no carry**, so $1 + 1 = 1$.
- **NAND / NOR:** the **universal gates**. Either one alone can build NOT, AND and OR, which means it can build any circuit (see [[#NAND and NOR logic]]).
- **XOR:** exactly two inputs. Its output is the **sum bit** from adding two bits ($1 + 1 = 10$, sum 0), so it's a 1-bit **modulo-2 adder**, and it tells you when two signals **disagree**.
- **XNOR:** the opposite of XOR, so it's a 1-bit **equality detector**.

### Active-HIGH and active-LOW

The bubble also tells you which level is **active** (asserted):

- **No bubble:** the input/output is **active-HIGH**, so it "does its thing" when it's 1.
- **Bubble:** the input/output is **active-LOW**, so it "does its thing" when it's 0.

That gives you a second way to read NAND and NOR gates:

![[coe-328-dual-symbols.svg]]
*Figure 2.1: The NAND gate is also a negative-OR gate, and the NOR gate is also a negative-AND gate.*

- **NAND as negative-OR:** the output is 1 when **$A$ is 0 OR $B$ is 0**. Use this view when you're looking for "any input LOW".
- **NOR as negative-AND:** the output is 1 when **$A$ is 0 AND $B$ is 0**. Use this view when you're looking for "all inputs LOW".

It's the same physical gate either way. DeMorgan's theorems ([[#DeMorgan's theorems]]) prove the two symbols are equal.

### Timing diagrams

In real circuits the inputs are **waveforms**, not fixed levels. A **timing diagram** lines up the waveforms on the same time axis. To find a gate's output waveform:

1. Draw a vertical line at **every edge** of every input.
2. Between the lines the inputs are constant, so just use the truth table for each interval.
3. Draw the output level for each interval.

**Try it:** click any time slot of $A$ or $B$ to flip it and watch the output. Use the buttons to switch gates.

<div class="melon-logic" data-view="timing" data-device="and,or,nand,nor,xor,xnor">Interactive timing diagram (open this page on the site to use it).</div>

### Boolean algebra basics

- A **variable** ($A$, $B$, …) is 0 or 1. Its **complement** $\overline{A}$ ("not A", "A bar", or $A'$) is the opposite value. A variable or its complement is called a **literal**.
- A **sum term** is literals ORed together ($A + \overline{B} + C$). It's **0 only when every literal is 0**.
- A **product term** is literals ANDed together ($A\overline{B}C$). It's **1 only when every literal is 1**.

**Laws**

|Law|Addition (OR)|Multiplication (AND)|
|---|---|---|
|Commutative|$A + B = B + A$|$AB = BA$|
|Associative|$A + (B + C) = (A + B) + C$|$A(BC) = (AB)C$|
|Distributive|$A(B + C) = AB + AC$||

**The 12 rules**

|#|Rule|Why|
|---|---|---|
|1|$A + 0 = A$|OR with 0 passes $A$ through|
|2|$A + 1 = 1$|OR with 1 is always 1|
|3|$A \cdot 0 = 0$|AND with 0 is always 0|
|4|$A \cdot 1 = A$|AND with 1 passes $A$ through|
|5|$A + A = A$|$0 + 0 = 0$, $1 + 1 = 1$|
|6|$A + \overline{A} = 1$|one of them is always 1|
|7|$A \cdot A = A$|$0 \cdot 0 = 0$, $1 \cdot 1 = 1$|
|8|$A \cdot \overline{A} = 0$|one of them is always 0|
|9|$\overline{\overline{A}} = A$|inverting twice gets you back|
|10|$A + AB = A$|$A(1 + B) = A \cdot 1$|
|11|$A + \overline{A}B = A + B$|proved below|
|12|$(A + B)(A + C) = A + BC$|proved below|

Rules 1–9 come straight from the gate truth tables, and Rules 10–12 are derived from them:

$$
\begin{aligned}
A + \overline{A}B &= (A + AB) + \overline{A}B &&\text{Rule 10} \\
&= AA + AB + A\overline{A} + \overline{A}B &&\text{Rules 7, 8} \\
&= (A + \overline{A})(A + B) &&\text{factor} \\
&= A + B &&\text{Rules 6, 4}
\end{aligned}
$$

$$
\begin{aligned}
(A + B)(A + C) &= AA + AC + AB + BC &&\text{distribute} \\
&= A(1 + C + B) + BC &&\text{Rule 7, factor} \\
&= A + BC &&\text{Rules 2, 4}
\end{aligned}
$$

> [!tip] Rule 12 is the distributive law "the other way around". OR distributes over AND too, which ordinary algebra doesn't let you do.

### DeMorgan's theorems

$$
\overline{XY} = \overline{X} + \overline{Y} \qquad\qquad \overline{X + Y} = \overline{X}\,\overline{Y}
$$

In words: **break the bar, change the sign.** Splitting a bar over a product turns the AND into an OR, and splitting a bar over a sum turns the OR into an AND. They work for any number of variables:

$$
\overline{WXYZ} = \overline{W} + \overline{X} + \overline{Y} + \overline{Z} \qquad \overline{W + X + Y + Z} = \overline{W}\,\overline{X}\,\overline{Y}\,\overline{Z}
$$

**Procedure for a big expression** (like $\overline{\overline{A + B\overline{C}} + D(\overline{E + \overline{F}})}$):

1. Treat each term under the longest bar as one variable ($X = \overline{A + B\overline{C}}$, $Y = D(\overline{E + \overline{F}})$).
2. Apply DeMorgan to the longest bar: $\overline{X + Y} = \overline{X}\,\overline{Y}$.
3. Cancel any double bars (Rule 9).
4. Repeat on the bars that are left until every bar sits over a single variable.

$$
\overline{\overline{A + B\overline{C}} + D(\overline{E + \overline{F}})} = (A + B\overline{C})(\overline{D} + E + \overline{F})
$$

### From circuit to expression to truth table

**Circuit → expression:** start at the inputs and write the expression at each gate output as you work toward the final output.

**Expression → truth table:**

1. List all $2^n$ input combinations (count in binary).
2. Find which combinations make the expression 1 (or work out every column in between).
3. Fill in the output column.

For example, $A(B + CD)$ is 1 only when $A = 1$ **and** $B + CD = 1$, so when $A = 1, B = 1$ (any $C, D$), or $A = 1, C = 1, D = 1$ (any $B$).

### Simplifying with Boolean algebra

A simpler expression means **fewer gates** for the same function, so fewer chips, less power, and less material to make them. The usual moves are:

- **Factor** out a common literal: $AB + A\overline{B} = A(B + \overline{B}) = A$
- **Absorb** with Rule 10: $A + AB = A$
- **Remove a complemented literal** with Rule 11: $A + \overline{A}B = A + B$
- **Duplicate a term** you need twice (Rule 5: $X = X + X$)

> [!example] Lecture example: $AB + A(B + C) + B(B + C)$
> $$
> \begin{aligned}
> &= AB + AB + AC + BB + BC &&\text{distribute} \\
> &= AB + AC + B + BC &&\text{Rules 5, 7} \\
> &= AB + AC + B &&\text{Rule 10 } (B + BC = B) \\
> &= B + AC &&\text{Rule 10 } (B + AB = B)
> \end{aligned}
> $$
> Five gates become two (one AND, one OR).

Algebra works, but it's easy to miss a step. [[ch04-optimization-of-combinational-logic|Ch 4]] has a more systematic method (the Karnaugh map).

### Standard forms: SOP and POS

Any expression can be rewritten in one of two standard forms:

|Form|Looks like|Built with|
|---|---|---|
|**Sum of products (SOP)**|$AB + \overline{A}C + B\overline{C}D$|AND gates feeding one OR gate (**AND-OR**)|
|**Product of sums (POS)**|$(A + B)(\overline{A} + C)(B + \overline{C} + D)$|OR gates feeding one AND gate (**OR-AND**)|

In both forms a bar can only cover **one variable**. $\overline{A}\,\overline{B}$ is fine, but $\overline{AB}$ is not.

- To get SOP from a general expression, **distribute**: $A(B + CD) = AB + ACD$.
- The **domain** is the set of all variables in the expression. A **standard** (canonical) SOP or POS has **every variable of the domain in every term**.

**Converting to standard SOP:** multiply each product term by $(X + \overline{X})$ for each missing variable $X$ (that's multiplying by 1) and expand. Every missing variable doubles the number of terms.

$$A\overline{B} \;\text{(domain } A, B, C) = A\overline{B}(C + \overline{C}) = A\overline{B}C + A\overline{B}\,\overline{C}$$

**Converting to standard POS:** add $X\overline{X}$ for each missing variable (that's adding 0), then use Rule 12 to split.

$$A + \overline{B} = A + \overline{B} + C\overline{C} = (A + \overline{B} + C)(A + \overline{B} + \overline{C})$$

### Minterms and maxterms

Each row of a truth table has one standard product term that's 1 **only** on that row, and one standard sum term that's 0 **only** on that row:

- **Minterm $m_i$:** the product term that's 1 only on row $i$. A 1 in the row becomes the variable and a 0 becomes its complement.
- **Maxterm $M_i$:** the sum term that's 0 only on row $i$. A 0 in the row becomes the variable and a 1 becomes its complement.

|Row $i$|$A\,B\,C$|Minterm $m_i$|Maxterm $M_i$|
|---|---|---|---|
|0|0 0 0|$\overline{A}\,\overline{B}\,\overline{C}$|$A + B + C$|
|1|0 0 1|$\overline{A}\,\overline{B}C$|$A + B + \overline{C}$|
|2|0 1 0|$\overline{A}B\overline{C}$|$A + \overline{B} + C$|
|3|0 1 1|$\overline{A}BC$|$A + \overline{B} + \overline{C}$|
|4|1 0 0|$A\overline{B}\,\overline{C}$|$\overline{A} + B + C$|
|5|1 0 1|$A\overline{B}C$|$\overline{A} + B + \overline{C}$|
|6|1 1 0|$AB\overline{C}$|$\overline{A} + \overline{B} + C$|
|7|1 1 1|$ABC$|$\overline{A} + \overline{B} + \overline{C}$|

So from any truth table:

- **Standard SOP** = OR of the minterms for the rows where the output is **1**. Shorthand: $f = \sum m(\ldots)$.
- **Standard POS** = AND of the maxterms for the rows where the output is **0**. Shorthand: $f = \prod M(\ldots)$.

The two lists are complements of each other, so every row number shows up in exactly one of them.

> [!note] The lecture slides (Floyd) call this the "binary value" of a term. $A\overline{B}C\overline{D}$ has binary value 1010 because that's the one input that makes it 1, and $A + \overline{B} + C + \overline{D}$ has binary value 0101 because that's the one input that makes it 0. It's the same idea as $m_{10}$ and $M_5$.

### NAND and NOR logic

NAND and NOR are **universal**, meaning each one alone can make every other gate.

|To get|With NAND only|With NOR only|
|---|---|---|
|NOT|tie the inputs together: $\overline{AA} = \overline{A}$|tie the inputs together: $\overline{A + A} = \overline{A}$|
|AND|NAND, then a NAND inverter|invert both inputs, then NOR: $\overline{\overline{A} + \overline{B}} = AB$|
|OR|invert both inputs, then NAND: $\overline{\overline{A}\,\overline{B}} = A + B$|NOR, then a NOR inverter|
|NOR|OR (above), then a NAND inverter|—|
|NAND|—|AND (above), then a NOR inverter|

**Two-level NAND = SOP.** An AND-OR circuit turns into NAND-NAND when you swap every gate for a NAND, because the bubbles cancel in pairs:

$$
X = \overline{\overline{AB}\;\overline{CD}} = \overline{\overline{AB}} + \overline{\overline{CD}} = AB + CD
$$

**Two-level NOR = POS.** Same idea here, an OR-AND circuit becomes NOR-NOR:

$$
X = \overline{\overline{A + B} + \overline{C + D}} = (A + B)(C + D)
$$

**Dual symbols.** To read a NAND or NOR circuit quickly, redraw it so **every connection is bubble-to-bubble or plain-to-plain**. Bubbles that meet cancel out (it's a double inversion), so you can read the gates as plain AND/OR:

- In NAND logic, draw the gates as **NAND** and **negative-OR** symbols, alternating by level, with the output gate as a negative-OR.
- In NOR logic, draw the gates as **NOR** and **negative-AND** symbols, with the output gate as a negative-AND.
- If a bubble meets a plain input, that variable picks up a bar.

### Design process

The textbook's three steps (§2.8):

1. **Specify** exactly what the circuit should do.
2. **Synthesize:** specification → truth table → Boolean expression → circuit.
3. **Test:** apply every input combination and check the output.

**Design example: three-way light control.** A room has three doors, and each has a switch ($x_1$, $x_2$, $x_3$) for the same light $f$. Flipping **any one** switch has to change the light. Start with the light off when all the switches are open ($000$). Flipping one switch turns it on, flipping a second turns it off, and so on, so the light is on when an **odd number** of switches are closed.

|$x_1\,x_2\,x_3$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$f$|0|1|1|0|1|0|0|1|

$$
f = \sum m(1, 2, 4, 7) = \overline{x_1}\,\overline{x_2}\,x_3 + \overline{x_1}\,x_2\,\overline{x_3} + x_1\,\overline{x_2}\,\overline{x_3} + x_1 x_2 x_3
$$

$$
f = \prod M(0, 3, 5, 6) = (x_1 + x_2 + x_3)(x_1 + \overline{x_2} + \overline{x_3})(\overline{x_1} + x_2 + \overline{x_3})(\overline{x_1} + \overline{x_2} + x_3)
$$

Both are correct (NOT → AND → OR for SOP, NOT → OR → AND for POS). This function is also just $f = x_1 \oplus x_2 \oplus x_3$.

**Design example: 2-to-1 multiplexer.** A **multiplexer (MUX)** is a data selector, where a select input $s$ picks which data input reaches the output. If $s = 0$ then $f = x_1$, and if $s = 1$ then $f = x_2$.

|$s\,x_1\,x_2$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$f$|0|0|1|1|0|1|0|1|

$$
\begin{aligned}
f &= \overline{s}\,x_1\overline{x_2} + \overline{s}\,x_1 x_2 + s\,\overline{x_1}\,x_2 + s\,x_1 x_2 \\
&= \overline{s}\,x_1(\overline{x_2} + x_2) + s\,x_2(\overline{x_1} + x_1) \\
&= \overline{s}\,x_1 + s\,x_2
\end{aligned}
$$

Multiplexers with more inputs are in Ch 6.

## Key formulas

**Number of input combinations**

$$
N = 2^n \tag{2.1}
$$

- $N$: rows in the truth table
- $n$: number of input variables

**XOR and XNOR**

$$
A \oplus B = A\overline{B} + \overline{A}B, \qquad \overline{A \oplus B} = AB + \overline{A}\,\overline{B} \tag{2.2}
$$

**Useful rules**

$$
A + AB = A, \qquad A + \overline{A}B = A + B, \qquad (A + B)(A + C) = A + BC \tag{2.3}
$$

**DeMorgan's theorems**

$$
\overline{XY} = \overline{X} + \overline{Y}, \qquad \overline{X + Y} = \overline{X}\,\overline{Y} \tag{2.4}
$$

- $X$, $Y$: any variables or sub-expressions

**Standard forms from a truth table**

$$
f = \sum m(\text{rows where } f = 1) = \prod M(\text{rows where } f = 0) \tag{2.5}
$$

- $m_i$: minterm, the product term that's 1 only on row $i$
- $M_i$: maxterm, the sum term that's 0 only on row $i$

**2-to-1 multiplexer**

$$
f = \overline{s}\,x_1 + s\,x_2 \tag{2.6}
$$

- $s$: select input
- $x_1$: data input passed through when $s = 0$
- $x_2$: data input passed through when $s = 1$

## Examples

These are based on the lecture examples, with the numbers and circuits changed.

### Example 1: Truth table for a multi-input gate

> Like Lecture 2, Example 2

(a) Write the truth table for a 3-input NOR gate. (b) How many input combinations does a 5-input NAND gate have?

**(a)** A NOR output is 1 only when **all** inputs are 0, so only the first row is 1:

|$A\,B\,C$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$X$|1|0|0|0|0|0|0|0|

**(b)** $N = 2^5 = 32$ combinations.

### Example 2: Choosing a gate from active-LOW sensors

> Like Lecture 2, Examples 10–11 and 14–15

A press has two safety guards. Each guard's sensor outputs **LOW when the guard is closed** and HIGH when it's open. (a) Pick one gate whose output is HIGH (enabling the press) only when **both guards are closed**. (b) Pick one gate whose output is HIGH (a warning light) when **at least one guard is open**.

**(a)** "Both inputs LOW → output HIGH" is a **negative-AND**, which is a **NOR** gate: $X = \overline{A + B} = \overline{A}\,\overline{B}$.

**(b)** "At least one input HIGH → output HIGH" is a plain **OR** gate: $X = A + B$.

> [!tip] When a question has active-LOW inputs, think negative-OR (NAND) and negative-AND (NOR).

### Example 3: DeMorgan with several variables

> Like Lecture 3, Examples 3–5

Apply DeMorgan's theorems to (a) $\overline{(A + \overline{B})C}$ and (b) $\overline{A\overline{B}C + \overline{D}E}$.

**(a)** Treat $A + \overline{B}$ as one variable. The bar is over a product, so it becomes a sum:

$$\overline{(A + \overline{B})C} = \overline{A + \overline{B}} + \overline{C} = \overline{A}B + \overline{C}$$

**(b)** The bar is over a sum, so it becomes a product of the two complemented terms, and then each of those gets split:

$$\overline{A\overline{B}C + \overline{D}E} = (\overline{A\overline{B}C})(\overline{\overline{D}E}) = (\overline{A} + B + \overline{C})(D + \overline{E})$$

### Example 4: Expression with nested bars

> Like Lecture 3, "Applying DeMorgan's Theorems"

Simplify $\overline{(\overline{A} + B)\,\overline{CD}}$ so that bars only sit over single variables.

1. **Longest bar first.** It covers a product of two terms, so it turns into a sum:
   $$\overline{(\overline{A} + B)\,\overline{CD}} = \overline{\overline{A} + B} + \overline{\overline{CD}}$$
2. **Second term:** the double bar cancels, $\overline{\overline{CD}} = CD$.
3. **First term:** DeMorgan again, $\overline{\overline{A} + B} = A\overline{B}$.

$$\Rightarrow\quad A\overline{B} + CD$$

### Example 5: From a circuit to a truth table

> Like Lecture 3, "Boolean Expression for a Logic Circuit"

Find the expression and the truth table for the circuit in Figure 2.2.

![[coe-328-circuit-to-expression.svg]]
*Figure 2.2: Circuit for Example 5.*

1. **G1** is an OR: $A + B$. **G2** is a NOT: $\overline{C}$.
2. **G3** ANDs them: $X = (A + B)\,\overline{C}$
3. **Truth table:** $X = 1$ needs $\overline{C} = 1$ (so $C = 0$) **and** $A + B = 1$ (so $A$ or $B$ is 1).

|$A\,B\,C$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$X$|0|0|1|0|1|0|1|0|

### Example 6: Simplifying with Boolean algebra

> Like Lecture 3, Examples 7–8

Simplify (a) $AB + A\overline{B} + \overline{A}B$ and (b) $ABC + A\overline{B}(\overline{A} + C)$.

**(a)**
$$
\begin{aligned}
AB + A\overline{B} + \overline{A}B &= A(B + \overline{B}) + \overline{A}B &&\text{factor} \\
&= A + \overline{A}B &&\text{Rules 6, 4} \\
&= A + B &&\text{Rule 11}
\end{aligned}
$$

**(b)**
$$
\begin{aligned}
ABC + A\overline{B}(\overline{A} + C) &= ABC + A\overline{A}\,\overline{B} + A\overline{B}C &&\text{distribute} \\
&= ABC + A\overline{B}C &&\text{Rule 8: } A\overline{A} = 0 \\
&= AC(B + \overline{B}) = AC &&\text{factor, Rule 6}
\end{aligned}
$$

### Example 7: Nonstandard SOP to standard SOP

> Like Lecture 3, Examples 10–11 and 14

Convert $X = A\overline{B} + B\overline{C}$ (domain $A, B, C$) to standard SOP, then write its truth table.

1. **Each term is missing one variable,** so multiply by $(\text{missing} + \overline{\text{missing}})$:
   $$A\overline{B}(C + \overline{C}) + B\overline{C}(A + \overline{A}) = A\overline{B}C + A\overline{B}\,\overline{C} + AB\overline{C} + \overline{A}B\overline{C}$$
2. **Binary value of each term** (the input that makes it 1): $101, 100, 110, 010$, i.e. rows 5, 4, 6, 2.
   $$X = \sum m(2, 4, 5, 6)$$
3. **Truth table:** 1 on those rows, 0 everywhere else.

|$A\,B\,C$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$X$|0|0|1|0|1|1|1|0|

### Example 8: Nonstandard POS to standard POS

> Like Lecture 3, Examples 12–13 and 15

Convert $X = (A + \overline{B})(B + C)$ to standard POS and find the rows where it's 0.

1. **Add $C\overline{C}$ to the first term** and **$A\overline{A}$ to the second**, then split with Rule 12:
   $$
   \begin{aligned}
   A + \overline{B} &= (A + \overline{B} + C)(A + \overline{B} + \overline{C}) \\
   B + C &= (A + B + C)(\overline{A} + B + C)
   \end{aligned}
   $$
2. **Binary value of each sum term** (the input that makes it 0): $010, 011, 000, 100$.
   $$X = (A + B + C)(A + \overline{B} + C)(A + \overline{B} + \overline{C})(\overline{A} + B + C) = \prod M(0, 2, 3, 4)$$

So $X = 0$ on rows 0, 2, 3, 4 and $X = 1$ on rows 1, 5, 6, 7.

### Example 9: Truth table to SOP and POS

> Like Lecture 3, Example 16

Write the standard SOP and POS for this truth table.

|$A\,B\,C$|000|001|010|011|100|101|110|111|
|---|---|---|---|---|---|---|---|---|
|$X$|0|1|0|1|0|0|1|1|

**SOP** from the 1s (rows 1, 3, 6, 7). A 0 in the row becomes a complemented variable:

$$X = \overline{A}\,\overline{B}C + \overline{A}BC + AB\overline{C} + ABC = \sum m(1, 3, 6, 7)$$

**POS** from the 0s (rows 0, 2, 4, 5). A 1 in the row becomes a complemented variable:

$$X = (A + B + C)(A + \overline{B} + C)(\overline{A} + B + C)(\overline{A} + B + \overline{C}) = \prod M(0, 2, 4, 5)$$

> [!note] Both describe the same function. The SOP simplifies to $\overline{A}C + AB$, and [[ch04-optimization-of-combinational-logic|Ch 4]] shows how to spot that right away.

### Example 10: NAND logic with dual symbols

> Like Lecture 4, Examples 7–8

Implement $X = A\overline{B} + CD$ using only NAND gates, drawn with dual symbols.

1. **Start from AND-OR:** two ANDs ($A\overline{B}$ and $CD$) feeding an OR.
2. **Swap every gate for a NAND.** The output gate is drawn as a **negative-OR** so its input bubbles meet the bubbles of G2 and G3 and cancel.
3. **$\overline{B}$** needs its own inverter: a NAND with its inputs tied together (G4).

![[coe-328-nand-logic-example.svg]]
*Figure 2.3: NAND-only implementation of $X = A\overline{B} + CD$.*

**Check:**
$$X = \overline{\overline{A\overline{B}}\;\overline{CD}} = \overline{\overline{A\overline{B}}} + \overline{\overline{CD}} = A\overline{B} + CD \;✓$$

### Example 11: NOR logic

> Like Lecture 4, Examples 9–10

Implement $X = (A + B)(\overline{C} + D)$ using only NOR gates.

1. **Start from OR-AND:** ORs for $A + B$ and $\overline{C} + D$, then an AND.
2. **Swap every gate for a NOR.** G2 = NOR($A$, $B$), G3 = NOR($\overline{C}$, $D$), and the output G1 = NOR, drawn as a **negative-AND** so the bubbles cancel.
3. **$\overline{C}$** comes from a NOR with its inputs tied together.

**Check:**
$$X = \overline{\overline{A + B} + \overline{\overline{C} + D}} = \overline{\overline{A + B}}\;\overline{\overline{\overline{C} + D}} = (A + B)(\overline{C} + D) \;✓$$

### Example 12: Output waveform of a circuit

> Like Lecture 4, "Pulse Waveform Operation" and Examples 11–12

The circuit $X = \overline{A(B + C)}$ is an OR gate ($Y = B + C$) feeding a NAND with $A$. The inputs over eight equal time intervals are below. Find $Y$ and $X$.

|Interval|1|2|3|4|5|6|7|8|
|---|---|---|---|---|---|---|---|---|
|$A$|0|1|1|1|1|0|1|1|
|$B$|0|0|1|0|0|1|1|0|
|$C$|1|0|0|1|0|0|1|0|
|$Y = B + C$|1|0|1|1|0|1|1|0|
|$AY$|0|0|1|1|0|0|1|0|
|$X = \overline{AY}$|**1**|**1**|**0**|**0**|**1**|**1**|**0**|**1**|

> [!tip] Work out the in-between waveforms first (here $Y$), one gate at a time. Jumping straight to $X$ is where mistakes happen.

### Example 13: Design a majority circuit

> Like the §2.8 design examples

Design a circuit for three judges ($A$, $B$, $C$) that outputs $f = 1$ when **at least two** judges vote yes (1). Simplify it.

1. **Truth table:** $f = 1$ on rows with two or three 1s: $011, 101, 110, 111$.
2. **Standard SOP:**
   $$f = \sum m(3, 5, 6, 7) = \overline{A}BC + A\overline{B}C + AB\overline{C} + ABC$$
3. **Simplify.** Use Rule 5 to copy $ABC$ twice, so it can pair with each of the others:
   $$
   \begin{aligned}
   f &= (\overline{A}BC + ABC) + (A\overline{B}C + ABC) + (AB\overline{C} + ABC) \\
   &= BC(\overline{A} + A) + AC(\overline{B} + B) + AB(\overline{C} + C) \\
   &= AB + AC + BC
   \end{aligned}
   $$
4. **Circuit:** three 2-input ANDs feeding a 3-input OR (or five NAND gates, by Example 10's method).

## Common mistakes

- Treating Boolean $1 + 1$ like binary. In Boolean algebra (OR), $1 + 1 = 1$, not $10$.
- Splitting a bar without changing the operation. $\overline{AB} \neq \overline{A}\,\overline{B}$, it's $\overline{A} + \overline{B}$.
- Dropping the parentheses when applying DeMorgan. $\overline{A + BC} = \overline{A}\,(\overline{B} + \overline{C})$, not $\overline{A}\,\overline{B} + \overline{C}$.
- Mixing up the two lists. **SOP comes from the 1s** (0 → complemented) and **POS comes from the 0s** (1 → complemented).
- Giving an XOR gate more than two inputs. A multi-input "XOR" is really a chain of 2-input XORs (it's 1 when an odd number of inputs are 1).
- Connecting a bubble output to a plain input in a NAND/NOR diagram and forgetting that variable now has a bar.
