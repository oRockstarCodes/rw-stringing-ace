---
concept: Rule Applied Outside Its Domain
last_compiled: 2026-10-18
topics_connected: [java-oop-foundations, number-systems-and-binary-arithmetic, operational-amplifiers, second-order-circuits, cmos-and-implementation-technology]
status: active
---

# Rule Applied Outside Its Domain

## Pattern
The most common mistake across all four courses is not forgetting a rule but using a correct rule where its preconditions don't hold. Each rule is valid only in a specific setting, and the failure is not checking which setting you are in.

## Instances
- **2026 Fall** in [[../topics/operational-amplifiers]]: assuming `v_+ = v_-` when there is no negative feedback (comparators).
- **2026 Fall** in [[../topics/second-order-circuits]]: using the series `α = R/2L` on a parallel circuit, or computing α with the sources still on.
- **2026 Fall** in [[../topics/number-systems-and-binary-arithmetic]]: reading a bit pattern before choosing unsigned / sign-magnitude / 1's / 2's complement; calling every carry-out an overflow.
- **2026 Fall** in [[../topics/java-oop-foundations]]: `==` on Strings (identity, not contents); expecting pass-by-value to let a method reassign the caller's object.
- **2026 Fall** in [[../topics/cmos-and-implementation-technology]]: putting PMOS in the pull-down network, or assuming NMOS "makes 0 V".

## What This Means
Before applying a formula, name its domain: feedback type, series vs parallel, representation, identity vs equality, NMOS vs PMOS. When the domain is unclear, fall back to the first-principles derivation (KCL/KVL, truth table, memory diagram) instead of pattern-matching a rule. A one-line "this rule holds when…" note beside each formula would catch most of the errors listed in these notes.

## Sources
- [[../topics/operational-amplifiers]]
- [[../topics/second-order-circuits]]
- [[../topics/number-systems-and-binary-arithmetic]]
- [[../topics/java-oop-foundations]]
- [[../topics/cmos-and-implementation-technology]]
