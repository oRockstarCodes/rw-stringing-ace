# COE 328 Ch 6: Combinational Circuit Building Blocks — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/coe-328/ch06-combinational-building-blocks.md` and anything missing gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

## Roadmap

1 Comparators (equality, magnitude) · 2 Decoders (incl. BCD to 7-segment) · 3 Encoders · 4 Multiplexers · 5 Demultiplexers · 6 Parity generators and checkers

---

## Concept 1: Comparators — ✅ merged into wiki

Merged: the "why MSB first" reasoning (a higher 1 outweighs all lower bits, 1000 > 0111) added to the Magnitude part of the Comparators section in `ch06-combinational-building-blocks.md`. The rest (XNOR + AND equality, MSB-first scan, compare-by-eye analogy) was already on the page. Rocky confirmed he understands this concept.

### Explanation given
- A **comparator** is a combinational circuit that tells you how two binary numbers relate: equal, greater, or less.
- **Start with 1 bit.** XNOR outputs 1 when its two inputs match (00 or 11), so an XNOR gate is a 1-bit equality comparator.
- **Equality for n bits:** XNOR each matching pair of bits, then AND all the results. One mismatched pair makes its XNOR 0, which makes the AND 0. So "equal" means *every* bit pair matches.
- **Magnitude (A > B, A < B):** scan from the **most significant bit** down. The first position where the bits differ decides it (A has the 1 → A > B; B has the 1 → A < B). If the bits are the same, move one bit down. If no position differs, A = B. Same as comparing 4821 and 4793 by eye.
- Why MSB first: a 1 in a higher position is worth more than every lower bit combined (e.g. 1000 = 8 > 0111 = 7).

### Rocky's questions
*(none yet)*

### Check question
(a) Using the equality method, are A = 1101 and B = 1100 equal? Show the XNOR of each bit pair. (b) Which is larger, A = 0110 or B = 0101, and at which bit does the comparator decide?

**Rocky's answer:** "A and B are not equal. A is bigger than B and is decided at the 3rd bit."
**Feedback:**
- (a) Not equal ✓. XNORs were not shown: bits 3..0 give 1, 1, 1, 0 (last pair 1 vs 0 differs), AND = 0.
- (b) A = 0110 > B = 0101 ✓. Bits 3 and 2 match (0,0 and 1,1); bit 1 is 1 vs 0, so A wins. "3rd bit" is correct counting from the left; in subscript notation (MSB = bit 3) that is **bit 1**, which is the convention the wiki uses ($A_1 = 1$, $B_1 = 0$).
**Status:** both correct; only the bit-numbering convention needed pointing out. Rocky confirmed "yes i feel comfortable" → understood, merged.

---

## Concept 2: Decoders (detecting one code) — ✅ merged into wiki

Merged: combination-lock picture and "a 0 turns into a 1 at the gate" reasoning in the "Decoding one code" paragraph, plus a labeling tip (bits $A_{n-1}$..$A_0$, outputs $Y_0$..$Y_{2^n-1}$) after Example 6.2, in `ch06-combinational-building-blocks.md`. The AND/NAND detection, 1-of-$2^n$ decoders and minterm outputs were already on the page. Rocky said "i understand" (he did not answer the 011 follow-up, so the labeling tip is the thing to watch in later questions).

---

## Concept 3: Encoders — 🟡 in progress

### Explanation given
- An **encoder** is a decoder run backwards. A decoder turns a code into "one line active"; an encoder turns "one line active" into a code. Think of a keypad: press key 6 (one line goes HIGH) and the encoder outputs the binary code for 6.
- **Decimal-to-BCD (10 lines in, 4 bits out):** exactly one input line is HIGH at a time. Each output bit is the **OR of every digit whose BCD code has a 1 in that bit's position**:
  - A3 (weight 8) = 8 + 9
  - A2 (weight 4) = 4 + 5 + 6 + 7
  - A1 (weight 2) = 2 + 3 + 6 + 7
  - A0 (weight 1) = 1 + 3 + 5 + 7 + 9
- Here "+" means OR of the input lines. Why OR: if *any* of those digits is pressed, that bit must be 1.
- Input 0 needs no gate: with nothing else active, all four outputs are already 0000.
- Example: line 6 HIGH → it appears in the A2 and A1 ORs only → A3A2A1A0 = 0110 ✓.

### Rocky's questions
*(none yet)*

### Check question
(a) Line 9 of a decimal-to-BCD encoder is HIGH (all others LOW). Which output expressions include line 9, and what is A3A2A1A0? (b) Why does the A0 expression have five terms but A3 only two?

**Rocky's answer:** *(pending)*

### Explanation given
- A **decoder** watches n input bits and signals when it sees one specific code. Think of it as a combination lock that only "opens" for one pattern.
- **Detecting one code:** an AND gate is 1 only when *all* its inputs are 1. So feed the AND the bits that should be 1 directly, and **invert the bits that should be 0** (so a 0 becomes a 1 at the gate). Example, detect 1001: X = A3 · A2' · A1' · A0.
- **Active-LOW output:** use a NAND instead of an AND. The output goes to 0 when the code is seen and sits at 1 otherwise.
- **Full decoder (n-to-2^n):** one such gate per possible code, all sharing the same inputs. Exactly one output is active at a time (1-of-2^n). Each output is one **minterm**. Example 2-to-4: Y0 = S1'S0', Y1 = S1'S0, Y2 = S1S0', Y3 = S1S0.

### Rocky's questions
*(none yet)*

### Check question
(a) Write the AND-gate expression that detects the code A3A2A1A0 = 0110 (active-HIGH). (b) A 3-to-8 decoder gets A2A1A0 = 110. Which output is active, and what is its expression?

**Rocky's answer:** (a) "A1'A2A3A4'" (b) "6th output is active"
**Feedback:**
- (a) Logic is right, naming is shifted. Rocky numbered the bits A1..A4 with A1 = LSB, so A1' A2 A3 A4' reads MSB-to-LSB as 0110 ✓. But the question labels the bits A3A2A1A0, so the answer in those labels is **A3' A2 A1 A0'**. Reminder: n bits are numbered 0 to n-1, so there is no A4 in a 4-bit code.
- (b) Y6 is the right output (110 = 6). Saying "6th" is ambiguous because outputs start at Y0: counting from 1, Y6 is the 7th output. Better to say "Y6". Still missing: its expression, **Y6 = A2 A1 A0'**.
**Status:** concept understood; only the labeling (bits numbered from 0, outputs named Y0..Y7) and the expression for (b) were off. One short follow-up before marking 🟢.
