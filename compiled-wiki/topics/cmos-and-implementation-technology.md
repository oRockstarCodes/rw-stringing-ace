---
topic: CMOS and Implementation Technology
last_compiled: 2026-10-18
source_count: 6
status: active
---

# CMOS and Implementation Technology

## Summary [coverage: medium -- 6 sources]

COE 328 Ch 3 covers how logic is physically built: transistors as switches, NMOS and CMOS gates, designing complex CMOS gates, speed (propagation delay, fan-out), transmission gates, 7400-series chips and programmable logic (PLA, CPLD, FPGA, LUTs). Four concept notes (MOSFET, propagation delay, transmission gate, lookup table) add intuition. PCS 224 (Solid State Physics) later explains the MOSFET at the device-physics level, but those notes are not written yet.

## Key Ideas [coverage: medium -- 6 sources]

- **MOSFET as a switch:** the insulated gate controls a channel between source and drain. **NMOS is ON with a 1; PMOS is ON with a 0.** The gate does not conduct current to the output.
- **CMOS gate = pull-down network (NMOS, conducts when f̄ = 1) + pull-up network (PMOS, realizes f)**, with PUN and PDN dual (series ↔ parallel).
- CMOS NAND uses 4 transistors; AND needs NAND + inverter (6).
- **Propagation delay** is the time for the output to reach its final voltage, not time to "decide". It grows with **fan-out** (load = n · C); fan-in is the gate's own input count.
- **Transmission gate:** parallel NMOS + PMOS with opposite controls passes both 0 and 1 at full strength; OFF means floating (high impedance), not 0.
- **LUT:** stored bits plus a multiplexer tree; a k-input LUT has `2^k` cells. FPGAs are built from LUTs.
- **CPLDs retain configuration without power; FPGAs lose it.**

## Formulas & Rules [coverage: medium -- 2 sources]

- Duality: PDN series ↔ PUN parallel; PDN parallel ↔ PUN series
- PDN conducts ⇔ f̄ = 1 (uncomplemented inputs); PUN realizes f with complemented inputs
- Load capacitance `C_n = n·C`
- LUT storage cells `= 2^k` (5 inputs → 32, 6 inputs → 64)

## Problem-Solving Patterns [coverage: medium -- 2 sources]

- Design a CMOS gate: write f̄ in terms of AND/OR of true inputs, build the PDN, take the dual for the PUN.
- Read an NMOS or CMOS circuit by listing transistor ON/OFF states for each input combination.
- Count transistors (e.g. XOR) and PLA product terms.
- Program a LUT by writing the truth table into its cells.

## Common Mistakes [coverage: high -- 6 sources]

- Swapping NMOS/PMOS behavior; PMOS in the pull-down or NMOS in the pull-up.
- Building the PDN for f instead of f̄; forgetting duality.
- Thinking a CMOS AND is simpler than NAND; thinking a gate "decides slowly"; confusing fan-out with fan-in.
- Thinking a transmission gate's OFF state outputs 0, or driving both its transistors with the same signal.
- Thinking a LUT contains separate gates; forgetting LUT size doubles per input.
- Mixing up which PLDs are volatile.

## Cross-Course Connections [coverage: low -- 1 source]

The physics of the MOSFET, CMOS, threshold voltage and MOS C–V is the end of the PCS 224 schedule (weeks 9–12) and will deepen this topic. Gate-level function is in [[boolean-algebra-and-logic-minimization]]. See [[abstraction-layers-and-their-limits]] and [[duality-and-complement-thinking]].

## Gaps [coverage: high -- 6 sources]

PCS 224 has an index only, with no chapter notes, so device physics (bands, carriers, p-n junction, MOS structure) is uncovered. COE 328 has no notes yet on sequential elements built from these gates.

## Sources [coverage: high -- 6 sources]

- [[../../wiki/content/courses/coe-328/ch03-implementation-technology]]
- [[../../wiki/content/courses/coe-328/concepts/mosfet]]
- [[../../wiki/content/courses/coe-328/concepts/propagation-delay]]
- [[../../wiki/content/courses/coe-328/concepts/transmission-gate]]
- [[../../wiki/content/courses/coe-328/concepts/lookup-table]]
- [[../../wiki/content/courses/pcs-224/index]]
