---
title: "5. Writing Classes"
tags:
  - coe318
---
## Overview

> [!info] Readings Lectures 4–5 · week 5 · Reference ch. 5

A good class is all about **controlling how other code interacts with it**. Packages organize where classes live, **encapsulation** (`private` plus getters and setters) controls who can touch an object's data, **scope** controls where a variable can be seen, and `Scanner` lets the program take input from the user. The chapter also covers tracing chains of objects and passing arrays to methods.

## Notes

### Packages

A **package** groups related classes together, kind of like a folder. It keeps the code organized, makes classes easier to find, and avoids name clashes (two classes can have the same name if they're in different packages).

|Kind|Examples|
|---|---|
|**Built-in**|`java.lang` (String, Math; imported automatically), `java.util` (Scanner, ArrayList)|
|**User-defined**|`coe318` for your labs|

Each package is a **directory**: classes in package `mypack` must be in a folder called `mypack`.

```java
package coe318;            // first line of the file (NetBeans adds it)
public class Lab3 { int labNum = 3; }
```

To use a class from **another** package, `import` it:

```java
import coe318.Lab3;        // one class (preferred)
import coe318.*;           // every class in the package
```

### Encapsulation

**Encapsulation** means keeping an object's variables hidden inside the class, so other code can only get to them through **methods**. That way `main` or another object can't "reach in" and set nonsense values, like a negative speed or a changed licence plate.

### Visibility modifiers

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

> [!note] If `main` is inside the **same class**, the access modifiers don't restrict it at all. `private` only blocks *other* classes.

### Rule of thumb

|Member|Visibility|Name|
|---|---|---|
|Instance variables|**`private`**|—|
|Methods other classes should call|`public`|**Service methods**|
|Helper methods used only inside the class|`private`|**Support methods**|

### Getters and setters

With private fields, the class gives you:

- **Accessor (getter):** returns a field's value, like `getSpeed()`
- **Mutator (setter):** changes a field, like `setSpeed(double)`

Only write getters and setters for the fields that should be exposed. Everything else just gets set once through the **constructor**:

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

> [!tip] A setter lets you **validate** the value: `if (speedVal >= 0 && speedVal <= maxSpeed) speed = speedVal;`. A public field can't protect itself like that.

### Scope

|Variable|Scope|Visible…|
|---|---|---|
|Instance variable|**Class scope**|Anywhere in the class, from its `{` to its `}`. Effectively "global" within the class.|
|Local variable / parameter|**Block scope**|Only inside the `{ }` block where it's declared|

**Shadowing:** if a local variable or parameter has the **same name** as an instance variable, the local one **hides** the field inside that method. Use `this.name` to get to the field.

```java
public Point(double x, double y) {
    this.x = x;    // field = parameter
    this.y = y;
}
```

### Arrays as parameters

|Passing|Behaves like|Method can change caller's array?|
|---|---|---|
|The whole array, `f(xyz)`|An object (reference copied)|**Yes**|
|One element, `f(xyz[3])`|A primitive (value copied)|**No**|

### 2D arrays

A 2D array is an **array of arrays** (rows of columns):

```java
int[][] A = { {  1,  0, 12, -1 },
              {  7, -3,  2,  5 },
              { -5, -2,  2,  9 } };
int[][] B = new int[3][4];      // 3 rows, 4 columns, all 0

A.length        // 3: number of rows
A[0].length     // 4: columns in row 0
A[1][2]         // 2: row 1, column 2
```

Go through it with nested loops, rows on the outside and columns on the inside:

```java
for (int row = 0; row < A.length; row++)
    for (int col = 0; col < A[row].length; col++)
        System.out.println(A[row][col]);
```

### User input with `Scanner`

`Scanner` (in `java.util`) reads input from the console or a file:

```java
import java.util.Scanner;

Scanner scan = new Scanner(System.in);                     // console
Scanner fileScan = new Scanner(new FileReader("myfile"));  // file
```

|Method|Reads|
|---|---|
|`nextLine()`|The whole rest of the line, spaces included|
|`next()`|One **token** (up to the next whitespace)|
|`nextInt()` / `nextDouble()`|One token, converted to a number|
|`hasNextInt()` / `hasNextDouble()`|`true` if the next token *is* that type (doesn't consume it)|

The program **waits** at each `next...()` call until the user types something.

> [!warning] `nextInt()` throws an `InputMismatchException` if the user types something that isn't an int. Check with `hasNextInt()` first.

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
