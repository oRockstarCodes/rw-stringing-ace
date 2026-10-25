---
title: "2. Classes and Objects"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 2 · week 2 · Reference ch. 1–2

Every program, however big, is built from three abilities:

1. **Remembering things**: variables, and the types that say what kind of thing each one holds.
2. **Calculating with them**: operators like `+`, `/` and `==`.
3. **Choosing what to do next**: `if` and `switch` pick between options, and loops repeat things.

Most of this chapter is about how Java does each of those, and the surprises that come from the way computers store numbers (why `7 / 2` is 3, why `"1" + 2 + 3` is `"123"`). The last part puts them together into classes, the blueprints from [[ch01-software-development-and-oop|Ch 1]], and looks at what's really going on when you create an object.

> [!tip] Trace code the way the computer would. Don't guess what a program does from how it looks. Go one statement at a time and write down every variable's value as it changes. Every surprise in this chapter shows up the moment you trace it.

## Notes

### Primitive data types

Memory is just a long row of bits. To store a number, Java has to decide **how many bits** to use and **how to read them**, and that's what a type is. A **primitive type** is one of Java's built-in, simplest kinds of value:

|Type|Size|Range / meaning|Typical use|
|---|---|---|---|
|`byte`|1 byte, signed|−128 to 127|Raw data|
|`short`|2 bytes, signed|−32 768 to 32 767|Small integers|
|`int`|4 bytes, signed|about ±2.1 billion|Default whole number|
|`long`|8 bytes, signed|about ±9.2 × 10¹⁸|Very large whole numbers|
|`float`|4 bytes|~7 significant digits|Decimals (needs `f`: `3.5f`)|
|`double`|8 bytes|~15 significant digits|Default decimal|
|`char`|2 bytes, unsigned|0 to 65 535 (Unicode)|A single character `'A'`|
|`boolean`|—|`true` / `false`|Conditions|

**Where the ranges come from.** With $n$ bits there are $2^n$ possible patterns. A `byte` has 8 bits, so 256 patterns. "Signed" means half of them are used for negatives, which gives −128 to 127 (zero takes one of the non-negative slots, which is why the top is 127 and not 128). Each step up the table doubles the bits, so the range grows enormously. Go past the end of the range and the value **wraps around**: adding 1 to the biggest `int` gives the most negative one, with no error.

**Why decimals are approximate.** `float` and `double` store numbers in a binary version of scientific notation, with a fixed number of significant digits. Many simple decimals, like 0.1, can't be written exactly in binary (just as $\frac{1}{3}$ can't be written exactly in decimal), so they're stored as the nearest value that fits. That's why decimals are compared with a tolerance rather than `==` ([[ch04-using-classes-and-objects|Ch 4]]).

**Why `char` is a number.** A character is stored as its Unicode code number: `'A'` is 65. That's why you can do arithmetic on characters (`'A' + 1` is 66) and compare them with `<`.

### Arithmetic operators

`+`, `-`, `*`, `/`, and `%` (the remainder after division: `8 % 3` is `2`, because $8 = 2 \times 3 + 2$).

> [!warning] **Integer division drops the fraction.** When both operands are integers, the result is an integer too, and an integer can't hold a fraction. So `7 / 2` is `3`, not `3.5`. The fraction is cut off, not rounded, so `-7 / 2` is `-3`. Make one operand a `double` (`7.0 / 2`) and the whole calculation is done in decimals, giving `3.5`.

The rule behind this is that **the result's type comes from the operands' types**, not from what you'd like the answer to be. `double d = 7 / 2;` still gives `3.0`. The division happens first, in integers, and only the finished `3` gets converted to a double.

`%` is handy for anything that repeats in cycles. `n % 2 == 0` means `n` is even, and `n % 10` is the last digit of `n`.

### The overloaded `+`

`+` does two different jobs depending on its operands:

- Both operands numbers → **addition**: `2 + 3` is `5`
- Either operand a `String` → **concatenation** (joining): `"Hello" + 2` is `"Hello2"`

When there are several `+`s, Java does them **one at a time, left to right**, and each step decides its own meaning from the two values in front of it. Once a String appears, every result after that is a String, so every later `+` is concatenation too:

|Expression|Steps|Result|
|---|---|---|
|`"1" + 2 + 3`|`"1" + 2` is `"12"`, then `"12" + 3` is `"123"`|`"123"`|
|`1 + 2 + "3"`|`1 + 2` is `3` (both numbers), then `3 + "3"` is `"33"`|`"33"`|
|`"1" + (2 + 3)`|parentheses first: `5`, then `"1" + 5` is `"15"`|`"15"`|

### Comparison operators

|Operator|Meaning|
|---|---|
|`==`|equal to|
|`!=`|not equal to|
|`>` / `<`|greater / less than|
|`>=` / `<=`|greater / less than or equal to|

Each one asks a yes/no question and gives back a `boolean`, `true` or `false`. That `boolean` is what `if` statements and loops use to decide what to do.

> [!warning] `=` **assigns** and `==` **compares**. `x = 3` is an instruction ("make x be 3"). `x == 3` is a question ("is x 3?").

### Compound assignment and increment

Updating a variable based on its own value is so common that there are shortcuts:

|Operator|Example|Means|
|---|---|---|
|`+=`|`x += y`|`x = x + y`|
|`-=`|`x -= y`|`x = x - y`|
|`*=`|`x *= y`|`x = x * y`|
|`/=`|`x /= y`|`x = x / y`|
|`%=`|`x %= y`|`x = x % y`|

`++` and `--` add or subtract 1. They do **two** things at once: they change the variable, and, as an expression, they also produce a value. Prefix and postfix differ only in **which value they produce**:

- `++i` adds 1 first, then produces the **new** value.
- `i++` produces the **old** value, then adds 1.

```java
int i = 5;
int a = ++i;   // i becomes 6, a = 6
int b = i++;   // b = 6, then i becomes 7
```

On a line by itself (`i++;`), the produced value is thrown away, so the two forms do exactly the same thing. The difference only shows up when the `++` sits inside a bigger expression.

### Conditionals

An `if` chain checks its conditions **from the top down** and runs the **first** branch whose condition is true, then skips the rest:

```java
if (x == 3) {
    System.out.println("x must be 3");
} else if (x == 2) {
    System.out.println("x must be 2");
} else {
    System.out.println("Wrong value");
}
```

Because it stops at the first match, the order matters. If you check `grade >= 50` before `grade >= 80`, an 85 matches the first test and never reaches the second. Put the most specific conditions first. The `else` at the end catches everything nothing else matched, and code after the whole chain runs no matter which branch ran.

**Conditional (ternary) operator.** A one-line `if/else` that **produces a value**, so it can go anywhere a value can:

```java
String result = grade >= 50 ? "passed" : "failed";
//              condition   ? if true  : if false
```

### Switch

`switch` compares one value against a list of constants and **jumps** to the matching `case`:

```java
switch (x) {
    case 3:
        System.out.println("x must be 3");
        break;
    case 2:
        System.out.println("x must be 2");
        break;
    default:
        System.out.println("Wrong value");
        break;
}
```

The key idea is that **case labels are just entry points**, like bookmarks. `switch` jumps to the matching label and then keeps running statements downward. It doesn't stop at the next label, because a label isn't a wall. Only `break` makes it leave. So **without `break`, it falls through** into the next case's statements even though that case didn't match.

Fall-through is occasionally useful on purpose, to give several values the same code:

```java
case 'a': case 'e': case 'i': case 'o': case 'u':
    System.out.println("vowel");
    break;
```

`default` is where it jumps if no case matches. It's optional and usually goes last.

### Loops

All three loops repeat a body while a condition is true. What differs is **where the check happens**:

|Loop|Checks condition|Runs at least once?|Use when|
|---|---|---|---|
|`while`|Before each pass|No|You don't know how many repeats in advance|
|`for`|Before each pass|No|Counting a known number of times|
|`do-while`|After each pass|**Yes**|The body has to run once before you can check (e.g. show a menu, then ask whether to repeat)|

```java
while (x < 4) { ...; x = x + 1; }

for (x = 1; x < 4; x++) { ... }    // init; condition; update

do { ... } while (x != 1);         // note the semicolon
```

A `for` loop is a `while` loop with its three parts collected on one line: the setup runs once, the condition is checked before each pass, and the update runs after each pass. Putting them together makes it hard to forget the update.

**Counting passes.** `for (x = 1; x < 4; x++)` runs for $x = 1, 2, 3$: three times. In general, `x = a; x < b` runs $b - a$ times, and `x <= b` runs one more. Off-by-one mistakes almost always come from `<` vs `<=`.

> [!warning] **Infinite loops** happen when nothing in the body ever makes the condition false, like forgetting `x = x + 1` in a `while`. Something inside the loop has to move it toward the exit.

### Classes and objects

A **class** describes a kind of object. It holds only **variable declarations** (what each object knows) and **methods** (what each object can do). Loose statements can't sit in a class outside of a method, because a statement is an action, and actions happen when a method runs.

```java
class ClassName {
    type var1;            // fields (instance variables)
    type var2;

    type method1(parameters) {
        // statements
    }
}
```

An **object** is one **instance** of a class, made with `new`. Its variables are called **instance variables** because every instance gets its own copy.

![[coe-318-class-vs-objects.svg]]
*Figure 2.1: A class is the template. Each object made with new gets its own copy of the fields, and a reference variable holds the address of its object.*

#### Variables hold addresses, not objects

This is the most important idea in the chapter, and most later confusion traces back to it. A primitive variable like `int x` holds the number itself. A variable of a **class** type holds the object's **address**: where in memory the object lives. That's called a **reference**. The object itself lives elsewhere.

So **creating an object takes two separate steps** (usually written on one line):

1. **Declare a reference variable:** `Car miniVan;` makes a variable that *can* hold the address of a `Car`. It holds `null` for now, meaning "doesn't refer to anything yet". No car exists.
2. **Create the object and store its address:** `miniVan = new Car();` sets aside memory for a new `Car`, runs its constructor, and puts that memory's address into `miniVan`.

```java
Car miniVan = new Car();   // both steps at once
```

![[coe-318-declare-then-new.svg]]
*Figure 2.2: Declaring a reference variable only makes the variable (null). new makes the object, and the assignment stores its address.*

Think of the reference as a remote control and the object as the TV. Declaring the variable gives you a remote that isn't paired with anything. `new` builds a TV and pairs the remote with it. Using a `null` reference is like pressing buttons on an unpaired remote, and it causes a `NullPointerException`.

**Accessing an object** uses the dot operator, which means "follow the reference to the object, then use this part of it":

```java
miniVan.speed = 100;       // object.variable (works, but bad practice)
miniVan.setSpeed(50);      // object.method()  (preferred)
```

> [!note] Why prefer `setSpeed(50)` over `speed = 100`? Because a method can check the value first (no negative speeds) and the class can change how it stores speed later without breaking the code that uses it. Reaching straight into the variable bypasses both. [[ch05-writing-classes|Ch 5]] shows how `private` lets a class forbid direct access completely.

### Where does `main` go?

The program starts at `main`, so `main` is where the first objects get created. There are two options:

1. Put `main` inside the class itself. It works, but it mixes the code that *uses* the class in with the class.
2. **Better:** make a separate **tester class** (`CarTest.java`) that only has `main`, in the same project.

```java
public class CarTest {
    public static void main(String[] args) {
        Car miniVan = new Car();
        Car sedan = new Car();
        miniVan.setSpeed(100);
        sedan.setSpeed(110);
        System.out.println(miniVan.getSpeed());   // 100.0
        System.out.println(sedan.getSpeed());     // 110.0
    }
}
```

The separate tester keeps `Car` clean and reusable: any program can use it, and `Car` doesn't carry test code around. It also tests the class the way real code will use it, from the outside, through its methods.

Each object has its **own** copy of the instance variables, so changing the sedan's speed doesn't affect the minivan's. Two `new`s made two separate cars.

### Methods

```java
ReturnType methodName(parameter-list) {
    // body
}
```

- **ReturnType:** any primitive or object type, or `void` if it doesn't hand back anything
- **methodName:** no spaces, first word lowercase, later words capitalized
- **parameter-list:** `type name` pairs separated by commas. When the method is called, the values passed in are copied into these.

A method runs **on a particular object**. When you call `miniVan.setSpeed(50)`, the `speed` inside `setSpeed` means the minivan's speed, and the same method called on `sedan` changes the sedan's. Objects get work done by calling each other's methods. In OOP terms they "send each other messages", the way real things interact: a driver doesn't reach into the engine, they press the pedal and let the car handle it.

## Key syntax

**Loops**

```java
for (int i = 0; i < n; i++) { }      // runs n times (i = 0 … n-1)
while (condition) { }
do { } while (condition);            // runs at least once
```

**Loop iteration counts** for `for (x = a; x < b; x++)`:

$$
\text{iterations} = b - a \qquad (\text{use } b - a + 1 \text{ for } x \le b)
$$

- $a$: starting value of the counter
- $b$: the bound in the condition

Nested loops multiply. An outer loop with $m$ passes around an inner loop with $n$ passes runs the inner body $m \times n$ times.

**Ternary**

```java
result = condition ? valueIfTrue : valueIfFalse;
```

## Examples

### Example 1: Loop counts

> Lecture 2, in-class questions

How many times does each loop run (or what's `x` at the end)?

|Code|Answer|Why|
|---|---|---|
|`int x=0; for (int i=0;i<5;i++) x = x+i;`|`x = 10`|$0+1+2+3+4$|
|`int x=10; while (x>0) { print; x=x-1; }`|10 times|$x = 10, 9, \ldots, 1$|
|`for (x=1; x<40; x++)`|39 times|$40 - 1$|
|`int x=3; while (x<40) { print; x=x+1; }`|37 times|$40 - 3$|
|`int x=3; while (x<40) { print; }`|**Infinite**|`x` never changes|
|`int x=50; do { print; } while (x<40);`|**1 time**|do-while runs once before checking|
|`for (x=1;x<40;x++) for (y=1;y<40;y++) print;`|1521 times|$39 \times 39$|

### Example 2: The `+` operator

> Lecture 2

What does each line print?

```java
System.out.println("1" + 2 + 3);
System.out.println(1 + 2 + "3");
System.out.println("1" + (2 + 3));
```

1. It starts with a String, so everything is concatenation: `123`
2. `1 + 2` are both numbers, so that's `3` first, and then `3 + "3"` is `33`
3. The parentheses go first: `2 + 3 = 5`, then `"1" + 5` is `15`

### Example 3: Switch without `break`

> Like the Lecture 2 switch question

What prints if `x = 2`?

```java
switch (x) {
    case 1: System.out.println("one");
    case 2: System.out.println("two");
    case 3: System.out.println("three");
            break;
    default: System.out.println("other");
}
```

1. It jumps to `case 2:` and prints `two`
2. There's no `break`, so it falls through into case 3 and prints `three`
3. `break` ends the switch, so `other` never prints

Output: `two`, then `three`.

### Example 4: Extending the `Car` class

> Lecture 2, step-by-step exercise

Add to `Car`: (1) a `fuel` variable, (2) a getter and setter for it, (3) `refuel(amount)` that adds fuel, (4) `drive(speed)` that uses 0.5 fuel per unit of speed. Then trace the test.

```java
public class Car {
    String licensePlate;
    double speed;
    double maxSpeed;
    double fuel;                           // (1)

    public double getFuel() { return fuel; }          // (2)
    public void setFuel(double val) { fuel = val; }

    public void refuel(double amount) {    // (3)
        fuel = fuel + amount;
    }
    public void drive(double speed) {      // (4)
        fuel = fuel - speed * 0.5;
    }
    // ...setLicensePlate, setSpeed, getSpeed as before
}
```

```java
Car miniVan = new Car();
miniVan.setFuel(0);
miniVan.refuel(20);
System.out.println(miniVan.getFuel());
miniVan.refuel(20);
System.out.println(miniVan.getFuel());
miniVan.drive(20);
System.out.println(miniVan.getFuel());
```

|Statement|`fuel`|Prints|
|---|---|---|
|`setFuel(0)`|0.0||
|`refuel(20)`|20.0|`20.0`|
|`refuel(20)`|40.0|`40.0`|
|`drive(20)`|$40 - 20(0.5) = 30.0$|`30.0`|

> [!note] Inside `drive`, the parameter `speed` **hides** the instance variable `speed`, so `speed * 0.5` uses the argument (20) and not the car's stored speed. There's more on this in [[ch05-writing-classes|Ch 5]].

## Common mistakes

- Expecting `7 / 2` to be `3.5` (integer division gives `3`)
- Using `=` instead of `==` in a condition
- Forgetting `break` in a `switch` case and getting fall-through
- Forgetting to update the loop variable, which gives an **infinite loop**
- Off-by-one loop counts. `i < n` runs $n$ times from 0, but `i <= n` runs $n + 1$
- Thinking a `do-while` skips the body when the condition starts out false (it always runs once)
- Writing statements straight in a class body instead of inside a method
