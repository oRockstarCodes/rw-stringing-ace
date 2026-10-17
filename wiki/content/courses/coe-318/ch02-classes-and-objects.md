---
title: "2. Classes and Objects"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 2 · week 2 · Reference ch. 1–2

Programming really comes down to three things: **storing information** (variables and types), **doing something with it** (operators), and **deciding which operations run and how many times** (if, switch, loops). Classes then bundle related data and behaviour together, so you can make lots of separate objects from one template.

> [!tip] Trace the code the way the computer would. Don't guess what a program does from how it looks. Go through it one statement at a time and write down every variable's value as it changes.

## Notes

### Primitive data types

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

### Arithmetic operators

`+`, `-`, `*`, `/`, and `%` (remainder: `8 % 3` is `2`).

> [!warning] **Integer division drops the fraction.** If both operands are integers, `/` gives an integer, so `7 / 2` is `3`, not `3.5`. It cuts off the decimal instead of rounding. Make one operand a `double` (`7.0 / 2`) if you want `3.5`.

`%` is useful for checking divisibility. `n % 2 == 0` means `n` is even.

### The overloaded `+`

- Both operands numbers → **addition**: `2 + 3` is `5`
- Either operand a `String` → **concatenation**: `"Hello" + 2` is `"Hello2"`

With several operands, `+` goes **left to right** and switches to concatenation as soon as it hits a String. Parentheses let you force the order:

|Expression|Steps|Result|
|---|---|---|
|`"1" + 2 + 3`|`"12"` then `"123"`|`"123"`|
|`1 + 2 + "3"`|`3` then `"33"`|`"33"`|
|`"1" + (2 + 3)`|`5` first, then `"15"`|`"15"`|

### Comparison operators

|Operator|Meaning|
|---|---|
|`==`|equal to|
|`!=`|not equal to|
|`>` / `<`|greater / less than|
|`>=` / `<=`|greater / less than or equal to|

> [!warning] `=` **assigns** and `==` **compares**. `x = 3` changes `x`, while `x == 3` asks a yes/no question and gives back a `boolean`.

### Compound assignment and increment

|Operator|Example|Means|
|---|---|---|
|`+=`|`x += y`|`x = x + y`|
|`-=`|`x -= y`|`x = x - y`|
|`*=`|`x *= y`|`x = x * y`|
|`/=`|`x /= y`|`x = x / y`|
|`%=`|`x %= y`|`x = x % y`|

**Prefix vs postfix** only matters when the increment is inside a bigger expression:

- `++i`: add 1 to `i` first, **then** use the new value
- `i++`: use the current value, **then** add 1 to `i`

```java
int i = 5;
int a = ++i;   // i becomes 6, a = 6
int b = i++;   // b = 6, then i becomes 7
```

`--i` and `i--` work the same way.

### Conditionals

```java
if (x == 3) {
    System.out.println("x must be 3");
} else if (x == 2) {
    System.out.println("x must be 2");
} else {
    System.out.println("Wrong value");
}
```

Only the **first** true branch runs. Anything after the whole `if` chain runs no matter what.

**Conditional (ternary) operator**: a one-line `if/else` that gives back a value:

```java
String result = grade >= 50 ? "passed" : "failed";
//              condition   ? if true  : if false
```

### Switch

`switch` evaluates an expression and jumps to the `case` that matches it:

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

- `default` runs if no case matches (it's optional and usually goes last)
- `break` ends the switch. **Without `break`, it falls through** into the next case's statements, even though that case didn't match.

### Loops

|Loop|Checks condition|Runs at least once?|Use when|
|---|---|---|---|
|`while`|Before each pass|No|Unknown number of repeats|
|`for`|Before each pass|No|Counting a known number of times|
|`do-while`|After each pass|**Yes**|Body must run once (e.g. a menu)|

```java
while (x < 4) { ...; x = x + 1; }

for (x = 1; x < 4; x++) { ... }    // init; condition; update

do { ... } while (x != 1);         // note the semicolon
```

> [!warning] **Infinite loops** happen when nothing in the body ever makes the condition false, like forgetting `x = x + 1` in a `while`.

### Classes and objects

A **class** is a template, and it can only contain **variable declarations** and **methods**. You can't put loose statements in a class outside of a method.

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

**Creating an object takes two steps** (usually written on one line):

1. **Declare a reference variable:** `Car miniVan;` holds `null` for now (it doesn't refer to anything yet)
2. **Create the object and store a reference to it:** `miniVan = new Car();` sets aside memory for a new `Car` and points `miniVan` at it

```java
Car miniVan = new Car();   // both steps at once
```

![[coe-318-declare-then-new.svg]]
*Figure 2.2: Declaring a reference variable only makes the variable (null). new makes the object, and the assignment stores its address.*

**Accessing an object** uses the dot operator:

```java
miniVan.speed = 100;       // object.variable (works, but bad practice)
miniVan.setSpeed(50);      // object.method()  (preferred)
```

> [!note] Good practice is to not touch instance variables directly. Give each one you want to expose a **getter** (`getSpeed()`) and a **setter** (`setSpeed()`). In [[ch05-writing-classes|Ch 5]] you can actually enforce this with `private`.

### Where does `main` go?

The program starts at `main`, so something has to create the objects. There are two options:

1. Put `main` inside the class itself. It works, but it mixes test code in with the class
2. **Better:** make a separate **tester class** (`CarTest.java`) that only has `main`, in the same project

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

Each object has its **own** copy of the instance variables, so changing the sedan's speed doesn't affect the minivan's.

### Methods

```java
ReturnType methodName(parameter-list) {
    // body
}
```

- **ReturnType:** any primitive or object type, or `void` if it doesn't return anything
- **methodName:** no spaces, first word lowercase, capitalize the rest
- **parameter-list:** `type name` pairs separated by commas

Methods work on the object's data and can call other methods, either in the same class or in other classes. Objects talk to each other by calling each other's methods, and that's how OOP models real things.

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
