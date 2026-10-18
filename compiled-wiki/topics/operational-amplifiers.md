---
topic: Operational Amplifiers
last_compiled: 2026-10-18
source_count: 2
status: active
---

# Operational Amplifiers

## Summary [coverage: medium -- 2 sources]

ELE 302 (Electric Networks, Fall 2026) starts with op amps (Ch 5, weeks 1–2, Quiz 1 on Sep 22). The note covers the open-loop model, negative vs positive feedback, the ideal and real op-amp models, and the standard amplifier configurations (inverting, non-inverting, follower, summing, difference, cascaded), with 12 worked examples. Op amps are on the midterm (Oct 27).

## Key Ideas [coverage: medium -- 2 sources]

- Output `v_o = A(v_+ − v_-)`, where A is the open-loop gain.
- **Negative feedback** (output returned to the inverting input) makes the amp linear and, for an ideal op amp, forces `v_+ = v_-` with zero input currents. **Positive feedback** or no feedback (comparators) does not.
- Learn to spot the feedback type from the circuit before applying the ideal rules.
- **Real model:** finite gain, finite input resistance and non-zero output resistance; matters for "non-ideal" examples.
- **Saturation:** the output cannot exceed the supply rails.

## Formulas & Rules [coverage: medium -- 1 source]

- Inverting: `v_o = −(R_f/R_1) v_i`
- Non-inverting: `v_o = (1 + R_f/R_1) v_i`
- Voltage follower: `v_o = v_i`
- Summing (inverting) and difference amplifiers are built from the same KCL at the inverting node; the difference amp needs matched resistor ratios.

## Problem-Solving Patterns [coverage: medium -- 1 source]

- Write **KCL at the inverting input**, not at the output; use `v_+ = v_-` and `i = 0` into the inputs.
- Cascaded stages: solve stage by stage (ideal output resistance isolates them).
- T-network feedback examples: solve for the middle node first.
- Finding an unknown input in a summing amp: solve the summing equation for it.
- Check the answer against the rails.

## Common Mistakes [coverage: medium -- 1 source]

- KCL at the output instead of the inverting input.
- Assuming `v_+ = v_-` without negative feedback.
- Dropping the minus sign on inverting and summing amps.
- Forgetting saturation (gain of 100 on 1 V with ±15 V rails gives 15 V).
- Mixing R_1 and R_f in the non-inverting gain.

## Cross-Course Connections [coverage: low -- 1 source]

The ideal op amp is a textbook case of an abstraction with a validity domain, see [[abstraction-layers-and-their-limits]] and [[rule-applied-outside-its-domain]]. Op amps appear again in ELE 302 filters (Expt 4) and frequency response (Ch 14).

## Gaps [coverage: high -- 2 sources]

Ch 14 (frequency response), 15–16 (Laplace), 13 (coupled circuits), 12 (three-phase) and 17 (Fourier) are empty stubs, so active filters and Bode plots are not covered.

## Sources [coverage: high -- 2 sources]

- [[../../wiki/content/courses/ele-302/index]]
- [[../../wiki/content/courses/ele-302/ch05-operational-amplifiers]]
