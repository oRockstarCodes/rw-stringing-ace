---
topic: Java OOP Foundations
last_compiled: 2026-10-18
source_count: 6
status: active
---

# Java OOP Foundations

## Summary [coverage: medium -- 6 sources]

COE 318 (Software Systems, Fall 2026) teaches the software development cycle and then spends most of its time on object-oriented programming in Java. Chapters 1–5 are written up: the SDLC and OOP ideas (Ch 1), syntax, control flow and basic classes (Ch 2), variables, constructors, memory and arrays (Ch 3), `String`, comparison, parameter passing and linked objects (Ch 4), and encapsulation, scope, 2D arrays and `Scanner` (Ch 5). Chapters 6–11 (implementation of classes, OO design, JUnit, inheritance, polymorphism, exceptions) are still empty stubs. Sources are all Fall 2026, so nothing here is aging.

## Key Ideas [coverage: high -- 6 sources]

- **SDLC:** requirements → design → implementation → testing → deployment → maintenance, then around again. Models: waterfall, iterative, agile, V, RAD, spiral. A design change costs roughly exponentially more the later it happens, which is why design matters.
- **High-level languages are compiled** into machine code; Java source goes in a file named after the public class + `.java`.
- **Objects bundle data and behavior.** A class is the blueprint; objects are instances. Programs are objects that reference each other.
- **Overloading** means same method name with different parameter lists (return type alone doesn't count).
- **Mutable vs immutable classes**; `String` is immutable, so its methods return new Strings.
- **Constructors** have no return type; `this` distinguishes a field from a shadowing parameter.
- **Variable kinds** (local, parameter, instance) have different scope and defaults; locals have no default value.
- **Memory:** locals and references live on the stack, objects on the heap; unreachable objects are garbage collected.
- **References vs values:** `b = a` copies the reference, so both names point to one object. Java passes arguments by value (the value of a reference is the address).
- **Encapsulation:** private fields, public getters/setters only when needed.
- **Linking objects:** a field holding a reference to another object (e.g. `emp.supervisor.name`).

## Formulas & Rules [coverage: medium -- 4 sources]

```java
public ClassName(Type field) { this.field = field; }   // constructor, no return type
double avg = (double) sum / n;                          // cast BEFORE dividing
Type[] a = new Type[N];                                 // indices 0 … N-1, a.length
s1.equals(s2)                                           // String contents
Math.abs(a - b) < TOLERANCE                             // floating-point comparison
Scanner scan = new Scanner(System.in);                  // scan.nextInt(), hasNextInt() …
```

- `s.substring(i, j)` has length `j - i` (`j` excluded).
- 2D arrays: elements = `A.length × A[0].length` (rows × columns).
- Loop `i < n` from 0 runs n times; `i <= n` runs n + 1.

## Problem-Solving Patterns [coverage: medium -- 5 sources]

- **Tracing memory:** draw stack/heap boxes and arrows; decide which constructor runs from the argument types.
- **"Will it compile?"** questions: check initialization before use, missing semicolons/braces, identifier rules.
- **Design from a description:** read the required output (e.g. an `Airport` or library system), list the nouns as classes and their links as fields.
- **Arrays of objects:** `new` the array, then `new` each element.
- **Input validation:** loop on `hasNextInt()` before `nextInt()`.
- A tester class with `main` exercises a data class (e.g. `Triangle`).

## Common Mistakes [coverage: high -- 5 sources]

- Case-sensitivity slips, wrong file name, missing `;`, unmatched braces; expecting `print` to add a newline.
- `7 / 2` is `3`; `=` vs `==`; missing `break` in `switch`; infinite or off-by-one loops; `do-while` always runs once.
- "Overloading" by return type only; calling `new X()` after defining only a parameterized constructor; `speed = speed;` without `this.`.
- Casting too late (`(double)(a / b)`); using an unassigned local; `b = a` does not copy an object; forgetting `new` per array element; `a[a.length]`.
- `==` instead of `.equals()` on Strings; expecting `toUpperCase()` to mutate; `double ==`; `NullPointerException` when following a null link.
- Public instance variables; passing an array **element** or reassigning an array parameter and expecting the caller to change; mixing `A.length` and `A[0].length`; missing `import java.util.Scanner`.

## Cross-Course Connections [coverage: low -- 1 source]

The "reference vs value" confusion mirrors representation questions in digital design: a bit pattern means nothing until you know the representation ([[number-systems-and-binary-arithmetic]]), and an object means nothing until you know what a name points to. See [[rule-applied-outside-its-domain]].

## Gaps [coverage: high -- 6 sources]

Ch 6–11 (Implementation of Classes, OO Design, Testing with JUnit, Inheritance, Polymorphism, Exceptions) are empty stubs, and the course index "Key takeaways" is unfilled. The midterm (week 7) covers weeks 1–6, so Ch 6 will matter soon.

## Sources [coverage: high -- 6 sources]

- [[../../wiki/content/courses/coe-318/index]]
- [[../../wiki/content/courses/coe-318/ch01-software-development-and-oop]]
- [[../../wiki/content/courses/coe-318/ch02-classes-and-objects]]
- [[../../wiki/content/courses/coe-318/ch03-variables]]
- [[../../wiki/content/courses/coe-318/ch04-using-classes-and-objects]]
- [[../../wiki/content/courses/coe-318/ch05-writing-classes]]
