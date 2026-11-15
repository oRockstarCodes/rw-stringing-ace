# COE 328 Ch 7: Introduction to Sequential Circuits — tutoring notes

Working notes from relearning sessions. Each concept records Rocky's questions, the explanations given, and a status.
When a concept is marked **understood**, its notes get compared against `wiki/content/ece/courses/coe-328/ch07-intro-to-sequential-circuits.md` and anything missing (alternate explanations, extra intuition) gets added there.

Status key: 🟡 in progress · 🟢 understood (not yet merged into wiki) · ✅ merged into wiki

## Post-midterm roadmap (weeks 8–13)

Ch 7: 1 Why memory? · 2 S-R latch · 3 Gated S-R and D latches · 4 D flip-flop and master-slave · 5 J-K and T · 6 Async preset/clear · 7 Registers and shift registers
Ch 7b (counters): ripple · synchronous · parallel load, BCD, Johnson
Ch 8: state diagram/table/assignment · deriving flip-flop logic · Mealy vs Moore · counter as state machine
Ch 9: asynchronous sequential circuits (no wiki page yet)

---

## Concept 1: Why memory? Combinational vs sequential, feedback, bistable — 🟡 in progress

### Explanation given
- **Combinational** circuit: output depends only on the inputs *right now*. Change the inputs back and you get the same output back. No memory.
- **Sequential** circuit: output depends on the inputs *and* on what happened before. It needs to **store** something, called the **state**.
- How do you store a bit with just gates? **Feedback**: wire a gate's output back into an input. Two inverters in a loop is the simplest case: A drives B, B drives A. If A is 1, B is 0, which keeps A at 1. If A is 0, B is 1, which keeps A at 0. Both are stable, and the loop sits in either one forever. That is **bistable** (two stable states = one bit of memory).
- The catch: a plain inverter loop has no inputs, so you can never change what it stores. Replace the inverters with gates that have a spare input (NOR, NAND) and you get a way to *force* the loop into 0 or 1. That is the S-R latch (next concept).

### Rocky's questions
*(none yet)*

### Check question
Which of these is combinational and which is sequential, and why? (a) a 2-input AND gate, (b) a circuit whose output is 1 if the input has *ever* been 1 since power-on.

**Rocky's answer:** *(pending)*
