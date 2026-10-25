---
title: "5. Writing Classes"
tags:
  - coe318
---
## Overview

> [!info] Readings Lectures 4–5 · week 5 · Reference ch. 5

So far any code could reach into any object and change anything. That's fine for a ten-line program and a disaster for a big one: if a car's speed is somehow negative, every line in the program is a suspect. This chapter is about **control**: deciding who's allowed to see and change what.

- **Packages** control where classes live and which names they can see.
- **Encapsulation** (`private` fields plus methods) controls who can touch an object's data, so the object can protect itself from nonsense values.
- **Scope** controls where a variable's name means something, and for how long it exists.

It also covers passing arrays to methods, 2D arrays, and reading input with `Scanner`, all of which come down to the same theme of what code can reach.

## Notes

### Packages

A **package** is a named group of related classes, like a folder. It solves two problems that appear as programs grow:

- **Organization.** Thousands of classes in one pile would be impossible to navigate. `java.util` holds utilities, `java.io` holds input/output, and your labs go in `coe318`.
- **Name clashes.** Two programmers can both write a class called `Point`. If they're in different packages, their full names (`graphics.Point` and `geometry.Point`) are different, so there's no conflict. The package name works like a surname.

|Kind|Examples|
|---|---|
|**Built-in**|`java.lang` (String, Math; imported automatically), `java.util` (Scanner, ArrayList)|
|**User-defined**|`coe318` for your labs|

A package is literally a **directory**: classes in package `mypack` must be in a folder called `mypack`. That's how the compiler finds them.

```java
package coe318;            // first line of the file (NetBeans adds it)
public class Lab3 { int labNum = 3; }
```

To use a class from **another** package by its short name, `import` it. Importing doesn't copy any code. It just tells the compiler which `Lab3` you mean when you write `Lab3`:

```java
import coe318.Lab3;        // one class (preferred: it's clear where each name comes from)
import coe318.*;           // every class in the package
```

`java.lang` is imported automatically, because almost every program needs `String` and `Math`.

### Encapsulation

**Encapsulation** means hiding an object's variables inside the class, so other code can only reach them through the class's **methods**. The object becomes a sealed box with a few buttons on the outside.

**Why this matters so much:**

1. **The object can protect its own rules.** A car's speed should never be negative or above its maximum. If any code can write `car.speed = -50`, that rule can be broken from anywhere in the program. If the only way to change speed is `setSpeed`, then `setSpeed` can check the value, and the rule holds everywhere, guaranteed by one method.
2. **Bugs have one address.** If the speed is wrong, only the methods of `Car` could have set it. You look in one class instead of the whole program.
3. **The inside can change without breaking the outside.** Suppose you later store speed in m/s instead of km/h. If other code only ever calls `getSpeed()`, you update that method to convert, and nothing else in the program needs to change. If other code read `speed` directly, every one of those lines would now be wrong.

It's the same reason a car has a pedal instead of exposing the fuel injectors: the driver gets a simple, safe interface, and the engineers stay free to change the engine.

### Visibility modifiers

**Access modifiers** are how Java enforces encapsulation. They're checked by the compiler, so a violation doesn't even compile.

|Modifier|Accessible from|
|---|---|
|`public`|Anywhere|
|`private`|Only inside the **same class**|
|*(none)*: default / package|Any class in the **same package**|
|`protected`|Same package, plus subclasses (see [[ch09-inheritance\|Ch 9]])|

```java
class Modifiers {
    public int pubData;
    private int privData;
    private void privMethod() { }
    public void pubMethod() {
        privMethod();          // OK: same class
    }
}

Modifiers mod = new Modifiers();   // in another class:
mod.pubData = 1;       // OK
mod.pubMethod();       // OK
mod.privData = 1;      // compile error
mod.privMethod();      // compile error
```

> [!note] The restriction is **per class**, not per object. If `main` is inside the same class, it can use the private members of any object of that class. `private` means "only code written inside this class", because that's the code the class's author controls.

### Rule of thumb

|Member|Visibility|Name|
|---|---|---|
|Instance variables|**`private`**|—|
|Methods other classes should call|`public`|**Service methods**|
|Helper methods used only inside the class|`private`|**Support methods**|

The `public` methods are the class's **interface**, its promise to the rest of the program. Keep it small. Everything private is an implementation detail you can change freely later, and everything public is something other code may depend on forever.

### Getters and setters

With private fields, the class decides exactly what to expose:

- **Accessor (getter):** returns a field's value, like `getSpeed()`
- **Mutator (setter):** changes a field, like `setSpeed(double)`

The point isn't to write a getter and setter for every field automatically, because that would just be a public field with extra steps. Expose only what other code genuinely needs. A licence plate that should never change gets set once, by the **constructor**, and has no setter at all:

```java
public class Car {
    private String licensePlate;   // set once, never exposed for change
    private double speed;          // has getter and setter
    private double maxSpeed;       // set once

    public Car(String plateNumber, double speedVal, double maxVal) {
        licensePlate = plateNumber;
        speed = speedVal;
        maxSpeed = maxVal;
    }
    public void setSpeed(double speedVal) { speed = speedVal; }
    public double getSpeed() { return speed; }
}
```

> [!tip] This is where encapsulation pays off. A setter can **validate**: `if (speedVal >= 0 && speedVal <= maxSpeed) speed = speedVal;`. A public field can't protect itself like that.

### Scope

A variable's **scope** is the part of the code where its name means something. It matches where the variable is declared and how long it lives:

|Variable|Scope|Visible…|
|---|---|---|
|Instance variable|**Class scope**|Anywhere in the class, from its `{` to its `}`. It belongs to the object, so every method can use it.|
|Local variable / parameter|**Block scope**|Only inside the `{ }` block where it's declared|

**Why block scope?** A local variable only exists while its block is running; it lives on the stack and disappears when the block ends ([[ch03-variables|Ch 3]]). Letting code outside the block use the name would mean referring to something that doesn't exist anymore, so the compiler forbids it. A bonus is that small scopes keep names from colliding: a loop counter `i` in one method has nothing to do with an `i` in another.

**Shadowing.** When a local variable or parameter has the **same name** as an instance variable, the name refers to the **nearest** declaration, the local one. The field is still there, just hidden ("in its shadow") inside that method. `this.name` reaches past the shadow to the field:

```java
public Point(double x, double y) {
    this.x = x;    // field = parameter
    this.y = y;
}
```

Shadowing in constructors and setters is normal, because the parameter's job is to carry a value for the field of the same name. Shadowing by accident (a local you forgot shares a field's name) is a classic bug: the method changes the local and the field silently stays the same.

### Arrays as parameters

Passing an array follows the same rule as any argument ([[ch04-using-classes-and-objects|Ch 4]]): Java copies what's in the variable. What's in the variable differs:

|Passing|What gets copied|Method can change caller's data?|
|---|---|---|
|The whole array, `f(xyz)`|The **reference** to the array|**Yes**: the method reaches the same array|
|One element, `f(xyz[3])`|The element's **value** (if it's a primitive)|**No**: the method gets its own copy of that number|

So a method like `void zeroOut(int[] a) { a[0] = 0; }` really does change the caller's array, since there's only one array and both variables point at it. `void zero(int n) { n = 0; }` called as `zero(xyz[3])` changes nothing, because `n` is just a copy of the number that was in slot 3.

### 2D arrays

Java doesn't really have a grid type. A 2D array is an **array of arrays**: an outer array whose elements are references to inner arrays, one per row.

```java
int[][] A = { {  1,  0, 12, -1 },
              {  7, -3,  2,  5 },
              { -5, -2,  2,  9 } };
int[][] B = new int[3][4];      // 3 rows, 4 columns, all 0

A.length        // 3: number of rows (length of the outer array)
A[0].length     // 4: columns in row 0 (length of that inner array)
A[1][2]         // 2: row 1, then element 2 of that row
```

Reading `A[1][2]` from left to right explains it: `A[1]` is the second row (itself an array), and `[2]` picks element 2 from it. That's also why `A.length` gives rows and `A[0].length` gives columns. Since each row is its own array, rows could even have different lengths, which is why careful code uses `A[row].length` rather than assuming every row is the same.

Go through it with nested loops, rows on the outside and columns on the inside:

```java
for (int row = 0; row < A.length; row++)
    for (int col = 0; col < A[row].length; col++)
        System.out.println(A[row][col]);
```

The inner loop runs completely for each pass of the outer loop, so this visits row 0 left to right, then row 1, and so on, the same order you'd read a page.

### User input with `Scanner`

`Scanner` (in `java.util`) reads text from the keyboard or a file and turns it into the values you ask for:

```java
import java.util.Scanner;

Scanner scan = new Scanner(System.in);                     // console
Scanner fileScan = new Scanner(new FileReader("myfile"));  // file
```

**How it reads.** Everything the user types, including the Enter key (a newline character), goes into a buffer. Scanner works through that buffer from the front. Most methods read one **token**, a chunk of text up to the next whitespace (space, tab or newline):

|Method|Reads|
|---|---|
|`nextLine()`|The whole rest of the current line, spaces included, and consumes the newline|
|`next()`|One **token** (up to the next whitespace)|
|`nextInt()` / `nextDouble()`|One token, converted to a number|
|`hasNextInt()` / `hasNextDouble()`|`true` if the next token *is* that type. It only looks, without consuming anything|

If the buffer is empty, the program **waits** at the `next...()` call until the user types something and presses Enter.

> [!warning] **The `nextInt()` then `nextLine()` trap.** If the user types `42` and presses Enter, the buffer holds `42\n`. `nextInt()` takes the `42` but leaves the `\n` behind. A `nextLine()` right after it finds that leftover newline, returns an empty string immediately, and seems to "skip" the input. Fix it by calling an extra `scan.nextLine();` after `nextInt()` to clear the rest of the line.

> [!warning] `nextInt()` throws an `InputMismatchException` if the next token isn't an int (the user typed `abc`). Because `hasNextInt()` only peeks, it lets you check first and handle bad input yourself:
> ```java
> while (!scan.hasNextInt()) {
>     System.out.println("Please enter a whole number.");
>     scan.next();               // throw away the bad token
> }
> int n = scan.nextInt();
> ```

## Key syntax

**Encapsulated class template**

```java
public class Name {
    private Type field;                          // private data

    public Name(Type field) { this.field = field; }

    public Type getField() { return field; }     // getter
    public void setField(Type field) {           // setter (only if needed)
        this.field = field;
    }
}
```

**Reading input**

```java
Scanner scan = new Scanner(System.in);
String word = scan.next();
int n = scan.nextInt();
double d = scan.nextDouble();
String line = scan.nextLine();
```

**2D array size**

$$
\text{elements} = \texttt{rows} \times \texttt{cols} = \texttt{A.length} \times \texttt{A[0].length}
$$

## Examples

### Example 1: Default vs private access

> Lecture 4–5, visibility slides

`CarTest` is a different class from `Car`, in the same package. Which lines compile?

```java
// Version 1                          // Version 2
public class Car {                    public class Car {
    String licensePlate;                  private String licensePlate;
    double speed;                         public double speed;
    ...                                   ...
}                                     }

// in CarTest.main:
Car miniVan = new Car("ABC", 50, 100);
miniVan.licensePlate = "GHI";
miniVan.speed = 100;
```

|Line|Version 1 (default)|Version 2|
|---|---|---|
|`miniVan.licensePlate = "GHI";`|OK (same package)|**Error** (`private`)|
|`miniVan.speed = 100;`|OK|OK (`public`)|

> [!note] The slide has `miniVan.speed = "100";` (a String into a `double`). That's a type error no matter what the access is.

### Example 2: Shadowing and `this`

> Lecture 4–5, Point code sample

What prints for each object?

```java
public class Point {
    private double x, y;

    public Point() { x = 1; y = 1; }

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
        this.x++;
        System.out.println("this.x = " + this.x);
        System.out.println("x = " + x);
    }

    public Point(double x, double y, boolean dummy) {
        x++;
        System.out.println("x = " + x);
    }
}

Point p1 = new Point();
Point p2 = new Point(2, 3);
Point p3 = new Point(2, 3, false);
```

1. **`p1`:** there are no parameters, so `x` and `y` mean the fields. It sets them to `1.0` and prints nothing.
2. **`p2`:** field `x` = 2, then `this.x++` makes the **field** 3, while the parameter `x` is still 2.
   ```
   this.x = 3.0
   x = 2.0
   ```
3. **`p3`:** there's no `this.`, so `x++` bumps the **parameter** to 3. The fields never get set and stay `0.0`.
   ```
   x = 3.0
   ```

### Example 3: Recursive object chain

> Lecture 4–5, "Find output" (Act 2)

```java
public class A {
    private A next;
    private int v;

    public A(A n, int i) { v = i; next = n; }

    public int getT() {
        int t = v;
        if (next != null)
            t = t + next.getT();
        return t;
    }
}

A a = new A(null, 3);
A b = new A(a, 1);
A c = new A(b, 2);
System.out.println(a.getT());
System.out.println(b.getT());
System.out.println(c.getT());
```

The links make a chain $c \to b \to a \to \texttt{null}$. `getT()` adds this object's `v` to everything further down the chain:

1. `a.getT()` = 3 (no `next`)
2. `b.getT()` = $1 + 3 = 4$
3. `c.getT()` = $2 + 4 = 6$

![[coe-318-ex-object-chain.svg]]
*Figure 5.1: The chain c, b, a, null. Each getT() adds its own v to the total of the objects after it.*

Prints `3`, `4`, `6`.

### Example 4: Fill in the blanks for the chain

> Lecture 4–5, in-class activity

Using the same class `A`, fill in the blanks so the output is `5`, `8`, `6`.

```java
A a = new A(____, ____);
A ___ = new A(____, 1);
A ___ = new A(____, 2);
System.out.println(a.getT());   // 5
System.out.println(b.getT());   // 8
System.out.println(c.getT());   // 6
```

1. `a` is declared first, so it can't link to anything yet and `next = null`. For `a.getT() = 5`, `v = 5`.
2. The second object has `v = 1`. It can link to `null` or `a`, and linking to `a` gives $1 + 5 = 6$, which matches `c`. So the second variable is **`c`**.
3. The third has `v = 2`. Linking to `c` gives $2 + 6 = 8$, which matches `b`.

```java
A a = new A(null, 5);
A c = new A(a, 1);
A b = new A(c, 2);
```

> [!tip] The variables don't have to be declared in alphabetical order. Work backwards from the totals.

### Example 5: Arrays and elements as arguments

> Lecture 4–5, arrays as parameters

What does each `aProc` print?

```java
void aProc() {                     void aProc() {
    int[] xyz = new int[12];           int[] xyz = new int[12];
    theProc(xyz);                      theProc(xyz[3]);
    System.out.println(xyz[3]);        System.out.println(xyz[3]);
}                                  }
void theProc(int[] mno) {          void theProc(int mno) {
    mno[3] = 15;                       mno = 15;
}                                  }
```

1. **Left:** the whole array gets passed, so `mno` refers to the same array. It prints `15`.
2. **Right:** `xyz[3]` is an `int`, so only its value (0) is copied. It prints `0`.

### Example 6: Fill in `fiddle`

> Lecture 4–5, in-class activity

Fill in the blanks so the program prints the four lines `10,5` · `15,19,12` · `20,21` · `19,15`.

```java
public static void main(String[] args) {
    int[] test = new int[2];
    test[0] = 10;
    test[1] = 5;
    System.out.println(test[0] + "," + test[1]);
    fiddle(test, test[1]);
    System.out.println(test[0] + "," + test[1]);
}
static void fiddle(int[] test, int element) {
    ___ = 15;
    ___ = 19;
    ___ = 12;
    System.out.println(___ + "," + ___ + "," + element);
    test = new int[2];
    test[0] = ___;
    test[1] = ___;
    System.out.println(test[0] + "," + test[1]);
}
```

1. **Line 1** (`10,5`) is printed by `main` before the call.
2. **The last line is `main`'s second print,** so after `fiddle` the original array has to hold `19, 15`. Those changes happen **before** `test = new int[2]`, while `test` still points at the original.
3. **Line 2** ends with `element`, so `element = 12`, and the other two values are `15, 19`. That's `test[1]` and then `test[0]`.
4. **After `test = new int[2]`,** `test` refers to a new local array. Setting it to `20, 21` gives line 3 without touching `main`'s array.

```java
static void fiddle(int[] test, int element) {
    test[1] = 15;
    test[0] = 19;
    element = 12;
    System.out.println(test[1] + "," + test[0] + "," + element);   // 15,19,12
    test = new int[2];
    test[0] = 20;
    test[1] = 21;
    System.out.println(test[0] + "," + test[1]);                   // 20,21
}
```

![[coe-318-ex-fiddle.svg]]
*Figure 5.2: Memory at the end of fiddle. Changes to the original array stay, but test = new int[2] only moved fiddle's own reference.*

### Example 7: Filling a 2D table

> Lecture 4–5, 2D array practice

```java
int[][] table = new int[5][10];
for (int row = 0; row < table.length; row++)
    for (int col = 0; col < table[row].length; col++)
        table[row][col] = row * 10 + col;
```

1. `table.length` = 5 rows, `table[row].length` = 10 columns, so $5 \times 10 = 50$ elements
2. Each element is `row * 10 + col`, so row 0 has 0–9, row 1 has 10–19, and so on up to row 4 with 40–49
3. Printing with the same nested loops lists `0` through `49`, one per line

### Example 8: Scanner with validation

> Lecture 5, Age program

Read a first name and a birth year, then print the age. It shouldn't crash if the year isn't a number.

```java
import java.util.Scanner;

class Age {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        System.out.println("Enter your first name & year of birth");
        String firstName = scan.next();          // one token
        if (scan.hasNextInt()) {                  // check before reading
            int yob = scan.nextInt();
            System.out.println("Hello " + firstName + ", you are "
                               + (2026 - yob) + " years old!");
        } else {
            System.out.println("Input error!");
        }
    }
}
```

Input `Rocky 2006` prints `Hello Rocky, you are 20 years old!`, and input `Rocky abc` prints `Input error!` instead of throwing an exception.

> [!note] `(2026 - yob)` needs the parentheses. Without them, `"... are " + 2026 - yob` tries to subtract from a String and won't compile.

### Example 9: `Triangle` with a tester class

> Lecture 5, Triangle exercise

Write `Triangle` with three private sides, getters, one mutator that sets all three, and `getPerimeter()`. Then write a tester that reads the sides from the user.

```java
class Triangle {
    private double side1, side2, side3;

    public double getSide1() { return side1; }
    public double getSide2() { return side2; }
    public double getSide3() { return side3; }

    public void setSides(double side1, double side2, double side3) {
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
    }

    public double getPerimeter() {
        return side1 + side2 + side3;
    }
}
```

```java
import java.util.Scanner;

class TriangleTest {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        System.out.println("Your Side1, Side2 and Side3:");
        double s1 = scan.nextDouble();
        double s2 = scan.nextDouble();
        double s3 = scan.nextDouble();

        Triangle tri = new Triangle();
        tri.setSides(s1, s2, s3);
        System.out.println("Sides: " + tri.getSide1() + ", "
                           + tri.getSide2() + ", " + tri.getSide3());
        System.out.println("Perimeter: " + tri.getPerimeter());
    }
}
```

Input `3 4 5` prints the sides and `Perimeter: 12.0`.

> [!note] The slides call the getters `GetSide1()`. That works, but by convention methods start lowercase, so `getSide1()`.

## Common mistakes

- Making instance variables `public` (that breaks encapsulation)
- Forgetting `this.` when a parameter shadows a field, so the field never changes
- Expecting a method that changes one array **element** passed by value to affect the caller
- Expecting `test = new int[2]` inside a method to replace the caller's array
- Mixing up `A.length` (rows) and `A[0].length` (columns)
- Forgetting `import java.util.Scanner;`
- Calling `nextInt()` without checking `hasNextInt()` and crashing on bad input
- Writing `message.Equals("quit")` when Java is case-sensitive and it's `equals`
- Naming a class `2DArray`, since identifiers can't start with a digit
