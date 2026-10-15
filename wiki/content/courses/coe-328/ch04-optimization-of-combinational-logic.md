---
title: "Ch 4: Optimization of Combinational Logic"
tags:
  - coe328
---
## Overview

> [!info] Readings Brown & Vranesic **§4.2** · Lecture 3 (second half: *Karnaugh Map*) · week 4

A **Karnaugh map (K-map)** is a truth table rearranged so that terms which can be combined sit next to each other. Grouping the 1s gives the **minimum SOP** expression; grouping the 0s gives the **minimum POS**. This chapter covers 3- and 4-variable maps, the grouping rules, "don't care" conditions, and switching between SOP and POS on the map.

## Notes

### Why K-maps work

Simplifying with algebra ([[ch02-intro-to-logic-circuits|Ch 2]]) keeps using one move: two terms that differ in **only one variable** combine, and that variable drops out.

$$AB\overline{C} + ABC = AB(\overline{C} + C) = AB$$

A K-map lays out the cells so that any two **neighboring cells differ in exactly one variable**. Then every pair (or group of 4, 8, …) of neighboring 1s is a term you can combine by eye.

### The map layout

- The number of cells is $2^n$, the same as the rows of the truth table: 8 for 3 variables, 16 for 4.
- Rows are labeled with $AB$ and columns with $C$ (3 variables) or $CD$ (4 variables).
- The labels go in **Gray code order: 00, 01, 11, 10**, *not* 00, 01, 10, 11. That's what makes neighbors differ by one bit.
- Each cell's value is the row label followed by the column label. In a 4-variable map, the top-right cell is $0010$ and the bottom-right cell is $1010$.

**4-variable map, with each cell's minterm number:**

|$AB \backslash CD$|00|01|11|10|
|---|---|---|---|---|
|**00**|0|1|3|2|
|**01**|4|5|7|6|
|**11**|12|13|15|14|
|**10**|8|9|11|10|

**3-variable map:**

|$AB \backslash C$|0|1|
|---|---|---|
|**00**|0|1|
|**01**|2|3|
|**11**|6|7|
|**10**|4|5|

### Cell adjacency

- Cells that share a **side** are adjacent. Cells that only touch at a **corner** (diagonal) are not.
- The map **wraps around**: the top row is adjacent to the bottom row, and the left column to the right column (think of it rolled into a cylinder). So in a 4-variable map, the four **corners** are all adjacent to each other.

For example, in the 3-variable map, cell 010 is adjacent to 000, 011, and 110, but not to 001, 111, 100, or 101.

### Mapping an expression

**Standard SOP:** put a 1 in the cell for each minterm (the input that makes the term 1).

**Nonstandard SOP:** each term with missing variables covers **several** cells. A term missing one variable covers 2 cells, missing two covers 4, and so on. Either expand it to standard form first, or fill in every cell that matches the variables that are there. For example, with domain $A, B, C$:

$$\overline{A} \to 000, 001, 010, 011 \qquad A\overline{B} \to 100, 101 \qquad ABC \to 111$$

**Truth table:** put each output value straight into its cell. Remember the Gray-code order when copying rows 2–3 and 6–7.

### Grouping the 1s (SOP)

The goal is **the biggest groups possible, and as few groups as possible**.

1. A group must contain **1, 2, 4, 8, or 16** cells (a power of 2).
2. A group must be a **rectangle** of adjacent cells (wrap-around counts).
3. Make every group **as large as possible**.
4. **Every 1** must be in at least one group.
5. Groups may **overlap**, but only if each group includes at least one 1 that no other group covers. Don't add a group that's already fully covered.

### Reading the product term from a group

In each group, **keep the variables that don't change**, and drop the ones that appear both complemented and uncomplemented.

|Group size|3-variable map|4-variable map|
|---|---|---|
|1 cell|3 literals|4 literals|
|2 cells|2 literals|3 literals|
|4 cells|1 literal|2 literals|
|8 cells|whole map: $X = 1$|1 literal|
|16 cells|—|whole map: $X = 1$|

Each doubling of the group size removes one variable. The **minimum SOP** is the OR of all the group terms.

**Try it:** click cells to cycle 0 → 1 → X (don't care) → 0. The map finds the minimum expression and draws its groups. Switch to POS to group the 0s instead.

<div class="melon-logic" data-view="kmap" data-vars="4" data-ones="0,2,5,7,8,10,13,15">Interactive Karnaugh map (open this page on the site to use it).</div>

### Textbook terms

Brown & Vranesic name the pieces of this process:

- **Implicant:** any valid group (a product term that's 1 only where $f$ is 1 or don't care).
- **Prime implicant:** a group that can't be made any bigger.
- **Essential prime implicant:** a prime implicant that covers some 1 no other prime implicant covers. It **must** be in the answer.

So the method is: find the essential prime implicants first, then add as few other prime implicants as needed to cover the remaining 1s.

### Don't care conditions

Sometimes certain input combinations **can never happen**, so the output for them doesn't matter. The classic case is BCD: codes $1010$ to $1111$ are never used, so a circuit reading BCD digits doesn't care what it outputs for them.

- Mark these cells with an **X**.
- When grouping, treat an X as a **1 if it makes a group bigger**, and as a **0 otherwise**.
- You never *need* to cover an X. Never make a group of only Xs.

### POS minimization (grouping the 0s)

The same map, used the other way round:

1. Put **0s** in the cells where the output is 0 (for a standard POS expression, the cell for each sum term is the input that makes it 0).
2. **Group the 0s** with exactly the same rules.
3. Each group gives a **sum term**: keep the variables that don't change, writing a variable **uncomplemented if it's 0** in the group and **complemented if it's 1**.
4. The **minimum POS** is the AND of the sum terms.

### Converting between SOP and POS on the map

Every cell that isn't a 1 is a 0, and vice versa. So once a function is on the map:

- Group the **1s** for the minimum SOP.
- Group the **0s** for the minimum POS.

Compare the two and build whichever needs fewer gates.

## Key formulas

**Number of cells**

$$
\text{cells} = 2^n \tag{4.1}
$$

- $n$: number of variables (3 → 8 cells, 4 → 16 cells)

**Literals in a group's term**

$$
\text{literals} = n - \log_2(\text{group size}) \tag{4.2}
$$

- Group sizes are always $1, 2, 4, 8, 16$.

**Combining adjacent terms**

$$
PX + P\overline{X} = P, \qquad (S + X)(S + \overline{X}) = S \tag{4.3}
$$

- $P$: the rest of a product term (SOP)
- $S$: the rest of a sum term (POS)
- $X$: the one variable that differs between the two cells

**Cell numbering** (4 variables, $A$ = MSB)

$$
\text{minterm number} = 8A + 4B + 2C + D \tag{4.4}
$$

## Examples

These follow the lecture's K-map examples, with different functions. Each map is live: click cells to experiment.

### Example 1: Minimize a standard SOP

> Like Lecture 3, Example 21

Minimize $X = \overline{A}\,\overline{B}\,\overline{C} + \overline{A}\,\overline{B}C + A\overline{B}\,\overline{C} + A\overline{B}C + AB\overline{C}$.

1. **Binary values:** $000, 001, 100, 101, 110$ → cells 0, 1, 4, 5, 6.
2. **Group of 4:** cells 0, 1, 4, 5 are rows $00$ and $10$, which are adjacent by wrap-around. $B = 0$ throughout, and $A$, $C$ both change → $\overline{B}$.
3. **Group of 2 for cell 6:** pair it with cell 4 (row $10$, column 0) → $A = 1$, $C = 0$ → $A\overline{C}$.

$$X = \overline{B} + A\overline{C}$$

<div class="melon-logic" data-view="kmap" data-vars="3" data-ones="0,1,4,5,6">Karnaugh map for Example 1 (open this page on the site to use it).</div>

### Example 2: Map a nonstandard SOP

> Like Lecture 3, "Mapping a Nonstandard SOP Expression" and Example 17

Map and minimize $X = \overline{B}\,\overline{C} + AB + A\overline{B}C$ (domain $A, B, C$).

1. **Expand each term:**
   - $\overline{B}\,\overline{C}$ is missing $A$: cells $000$ and $100$ (0, 4)
   - $AB$ is missing $C$: cells $110$ and $111$ (6, 7)
   - $A\overline{B}C$ is standard: cell $101$ (5)
2. **Group of 4:** cells 4, 5, 6, 7 (the whole $A = 1$ half) → $A$.
3. **Cell 0** pairs with cell 4 → $\overline{B}\,\overline{C}$.

$$X = A + \overline{B}\,\overline{C}$$

### Example 3: Wrap-around and corners

> Like Lecture 3, Example 22

Minimize $X = \sum m(0, 2, 5, 7, 8, 10, 13, 15)$.

1. **The four corners** (0, 2, 8, 10) are all adjacent by wrap-around. $B = 0$, $D = 0$ in all of them → $\overline{B}\,\overline{D}$.
2. **The middle square** (5, 7, 13, 15): $B = 1$, $D = 1$ → $BD$.

$$X = BD + \overline{B}\,\overline{D}$$

This is the map loaded in the interactive above. It's also $\overline{B \oplus D}$: the output only depends on whether $B$ and $D$ match.

### Example 4: Overlapping groups

> Like Lecture 3, Examples 19–20

Minimize $X = \sum m(0, 1, 2, 3, 4, 6, 8, 9, 10, 11)$.

1. **Group of 8:** rows $00$ and $10$ (cells 0–3 and 8–11) are adjacent by wrap-around. Only $B = 0$ stays fixed → $\overline{B}$.
2. **Cells 4 and 6** are left. Group them with 0 and 2 (they're the left and right columns of the top two rows, adjacent by wrap-around): $A = 0$, $D = 0$ → $\overline{A}\,\overline{D}$.

$$X = \overline{B} + \overline{A}\,\overline{D}$$

> [!tip] Reusing cells 0 and 2 is allowed because the new group also covers cells (4 and 6) that nothing else covers. A group of 4 beats two separate pairs.

<div class="melon-logic" data-view="kmap" data-vars="4" data-ones="0,1,2,3,4,6,8,9,10,11">Karnaugh map for Example 4 (open this page on the site to use it).</div>

### Example 5: Don't cares with BCD inputs

> Like Lecture 3, Example 23 (7-segment display)

A circuit reads a BCD digit $ABCD$ and outputs $X = 1$ when the digit is **5 or more**. Minimize it, using don't cares for the invalid codes.

1. **1s:** digits 5, 6, 7, 8, 9. **Don't cares:** 10–15 (invalid BCD).
2. **Treat the Xs as 1s where they help:**
   - Cells 8–15 (bottom two rows) are 8, 9 plus six Xs → group of 8 → $A$
   - Cells 5, 7, 13, 15 → $BD$
   - Cells 6, 7, 14, 15 → $BC$

$$X = A + BD + BC$$

**Without** the don't cares, the best you could do is $A\overline{B}\,\overline{C} + \overline{A}BD + \overline{A}BC$: three 3-literal terms instead of one literal and two 2-literal terms.

<div class="melon-logic" data-view="kmap" data-vars="4" data-ones="5,6,7,8,9" data-dc="10,11,12,13,14,15">Karnaugh map for Example 5 (open this page on the site to use it).</div>

### Example 6: POS minimization

> Like Lecture 3, Example 25

Minimize $X = \prod M(0, 2, 4, 5)$ as a POS expression.

1. **0s** go in cells 0, 2, 4, 5.
2. **Group cells 0 and 2** (rows $00$ and $01$, column 0): $A = 0$, $C = 0$. Both are 0, so both stay uncomplemented → $(A + C)$.
3. **Group cells 4 and 5** (row $10$): $A = 1$, $B = 0$ → $(\overline{A} + B)$.

$$X = (A + C)(\overline{A} + B)$$

This is the same function as Example 9 in [[ch02-intro-to-logic-circuits|Ch 2]]. Its minimum SOP, from the 1s, is $\overline{A}C + AB$.

<div class="melon-logic" data-view="kmap" data-vars="3" data-ones="1,3,6,7" data-mode="pos">Karnaugh map for Example 6 (open this page on the site to use it).</div>

### Example 7: 4-variable POS

> Like Lecture 3, Examples 24 and 26

Minimize $X = \prod M(0, 2, 3, 8, 10, 11)$.

1. **The four corners** (0, 2, 8, 10): $B = 0$, $D = 0$ → $(B + D)$.
2. **Cells 2, 3, 10, 11** (columns $11$ and $10$ of rows $00$ and $10$; the rows are adjacent by wrap-around): $B = 0$, $C = 1$ → $(B + \overline{C})$.

$$X = (B + D)(B + \overline{C})$$

### Example 8: SOP and POS from the same map

> Like Lecture 3, Example 27

For the function in Example 7, find the standard SOP and the minimum SOP. Which form is cheaper?

1. **Standard SOP:** every cell that isn't a 0 is a 1:
   $$X = \sum m(1, 4, 5, 6, 7, 9, 12, 13, 14, 15)$$
2. **Group the 1s:**
   - Rows $01$ and $11$ (cells 4–7 and 12–15) → $B$
   - Column $01$ (cells 1, 5, 9, 13) → $\overline{C}D$
3. **Minimum SOP:**
   $$X = B + \overline{C}D$$

The SOP needs one AND and one OR (plus an inverter for $\overline{C}$). The POS from Example 7 needs two ORs and an AND. They're equal: by Rule 12, $(B + D)(B + \overline{C}) = B + \overline{C}D$.

## Common mistakes

- Labeling rows or columns **00, 01, 10, 11**. It must be **00, 01, 11, 10** (Gray code).
- Grouping **diagonal** cells, or a group of 3 or 6. Groups must be rectangles of 1, 2, 4, 8, or 16 cells.
- Forgetting **wrap-around**: the edges (and the four corners) are adjacent.
- Stopping at small groups when a bigger one is possible.
- Adding a group whose cells are **all already covered**. Every group needs at least one 1 of its own.
- Covering a don't care for no reason, or making a group of **only** don't cares.
- In POS, writing the sum-term literals the SOP way. In POS a **0 → uncomplemented**, a **1 → complemented**.
