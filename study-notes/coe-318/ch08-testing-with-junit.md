# COE 318 · Ch 8 — Testing with JUnit (study notes)

Syllabus: `wiki/content/ece/courses/coe-318/ch08-testing-with-junit.md` (page is still an empty template, so the lessons follow Rocky's Lab 7 `VehicleTest.java`).

## Concepts

| # | Concept | Status |
|---|---|---|
| 1 | What JUnit does when you press Test (the runner loop) | 🟡 in progress |
| 2 | Asserts: how a test decides pass/fail (`assertEquals`, delta for doubles) | ⬜ not started |
| 3 | `@Before` / `@After` / `@BeforeClass` / `@AfterClass` | ⬜ not started |
| 4 | Writing a good test: arrange, act, assert + picking expected values | ⬜ not started |
| 5 | Testing void methods and inheritance (Car/Truck) | ⬜ not started |

---

## Concept 1 — What JUnit does when you press Test

**Rocky asked (2026-11-22):** "So how does JUnit tests work"
(Context: just after his Lab 7 `VehicleTest` was filled in and all 11 tests passed.)

**Explanation given:**
- A test is just a normal Java method that runs your code and checks the answer. JUnit is the program that finds and runs those methods for you, so you don't need a `main`.
- The `@Test` tag is how JUnit finds them.
- For each `@Test` method, JUnit:
  1. makes a brand-new `VehicleTest` object
  2. runs `@Before setUp()` (builds the fresh `Vehicle`)
  3. runs the test method
  4. runs `@After tearDown()`
  5. records pass / fail
- A test **fails** if an assert doesn't match (`AssertionError`) or `fail()` is called; it shows as an **error** if some other exception is thrown (e.g. the NullPointerException from the old `instance = null`). If it gets to the end without either → **pass**.
- Each test is independent: a fresh object every time, and the order isn't guaranteed (his run showed `printVehicleType` first, not `getPlateNumber`).
- Link to his output: the `.` dots in `JUnitCore` output = one per test started; `OK (11 tests)` = none failed.

**Check question:** If `testGetYear` changed `year` somehow, would `testToString` see the changed value? Why / why not?

**Rocky's answer:** _(pending)_
