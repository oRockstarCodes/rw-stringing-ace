---
topic: Number Systems and Binary Arithmetic
last_compiled: 2026-10-18
source_count: 3
status: active
---

# Number Systems and Binary Arithmetic

## Summary [coverage: medium -- 3 sources]

COE 328 (Digital Systems, Fall 2026) opens with digital waveforms and number systems (Ch 1), then returns to arithmetic circuits and signed representations (Ch 5). Together they cover binary/octal/hex/BCD conversion, 1's and 2's complement, half/full/ripple-carry adders, the adder/subtractor unit, and overflow detection. Ch 6 (building blocks) and later are not written yet.

## Key Ideas [coverage: medium -- 3 sources]

- **Logic levels and waveforms:** a digital signal is HIGH or LOW; frequency `f = 1/T`, duty cycle = `t_W / T × 100%`. A "square wave" is only a 50% duty cycle.
- **Scope reading:** value = divisions × (V/div or time/div).
- **Positional binary:** `V = Σ b_i 2^i`; n bits give `2^n` combinations, max value `2^n − 1`.
- **Hex/octal** group bits in 4s/3s from the binary point; **BCD** encodes each decimal digit separately and is not the same as binary.
- **Complements:** `K1 = (2^n − 1) − P` (flip bits), `K2 = 2^n − P = K1 + 1`.
- **Signed numbers:** sign-magnitude, 1's complement, 2's complement; always settle the representation before reading a bit pattern.
- **Adders:** half adder (no carry-in, bit 0 only), full adder, ripple-carry chain (carry delay grows with width).
- **Adder/subtractor:** subtraction is addition of the inverted operand with carry-in 1.

## Formulas & Rules [coverage: medium -- 3 sources]

- `f = 1/T`, `T = 1/f`; duty cycle `= t_W/T × 100%`
- `V = Σ b_i 2^i`; largest n-bit number `2^n − 1`
- Half adder: `s = x ⊕ y`, `c = xy`
- Full adder: `s_i = x_i ⊕ y_i ⊕ c_i`, `c_{i+1} = x_i y_i + x_i c_i + y_i c_i`
- `X − Y = X + Ȳ + 1`
- 8-bit 2's complement range: −128 to +127 (not symmetric)
- Signed overflow: check `c_n ⊕ c_{n−1}` (or operand/result signs), not just the carry-out.

## Problem-Solving Patterns [coverage: medium -- 2 sources]

- Decimal → binary by repeated division; the **first remainder is the LSB**.
- Binary → hex: group from the right, pad on the left.
- 2's complement shortcut: copy from the LSB up to and including the first 1, then invert the rest.
- Add signed numbers in 2's complement and discard the carry out of the sign bit (in 1's complement it is added back).
- Trace a ripple-carry addition column by column, writing each `c_i`.

## Common Mistakes [coverage: high -- 3 sources]

- Reading remainders top to bottom; grouping hex from the left; confusing BCD with binary.
- Forgetting the +1 of 2's complement (it is the carry-in in hardware).
- Using a half adder where a carry-in exists; calling every carry-out an overflow.
- Reading a bit pattern before deciding unsigned vs signed representation.
- Using total scope divisions instead of divisions per cycle when finding T.

## Cross-Course Connections [coverage: low -- 1 source]

Complement arithmetic is a form of duality, see [[duality-and-complement-thinking]]. The adder's XOR/AND structure uses the gates from [[boolean-algebra-and-logic-minimization]].

## Gaps [coverage: high -- 3 sources]

Ch 6 onward (combinational building blocks, sequential circuits, asynchronous circuits) have not been written; no note covers multipliers, comparators or BCD adders in detail.

## Sources [coverage: high -- 3 sources]

- [[../../wiki/content/courses/coe-328/index]]
- [[../../wiki/content/courses/coe-328/ch01-number-systems-and-digital-waveforms]]
- [[../../wiki/content/courses/coe-328/ch05-number-representation-and-arithmetic]]
