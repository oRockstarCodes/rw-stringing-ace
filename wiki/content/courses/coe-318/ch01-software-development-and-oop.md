---
title: "1. Software Development Cycle & OOP"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 1 · week 2 · no textbook chapter (Head First Java ch. 1–2 covers the same ground)

Software is built in a repeating cycle of **requirements → design → implementation → testing → deployment → maintenance**. This course focuses on the implementation part using **object-oriented programming (OOP)** in Java: instead of writing one long top-to-bottom program, you define **objects** that each hold their own data and behaviour, then link them together.

## Notes

### Programming languages and compiling

A **programming language** is a high-level language (Java, C, C++, Python) whose instructions control what a computer does. The CPU can't run it directly, so it has to be **compiled** (translated) into low-level machine code first.

### Software Development Lifecycle (SDLC)

The SDLC is the series of activities used to build software:

|Phase|What happens|
|---|---|
|Requirements / analysis|Figure out what the software must do, and for whom|
|Design|Decide the structure: which classes, how they interact|
|Implementation|Write the code|
|Testing|Check the code actually meets the requirements|
|Deployment|Release it to users|
|Maintenance|Fix bugs and add features after release|

Different **SDLC models** arrange these phases differently: **waterfall** (each phase once, in order), **iterative**, **agile**, **V model**, **RAD**, and **spiral**.

> [!warning] The cost of a design change grows roughly **exponentially** the later it happens in a project. A change that's a quick edit during design can mean rewriting and retesting everything after deployment. This is why the design phase matters.

### Ethics and software failures

Software increasingly runs things people's lives depend on and makes decisions about people, so bugs and biases have real consequences. The lecture's examples:

- **Medical:** an infusion pump (2015) that could fail to delay an infusion or miss doses depending on input timing
- **Aviation:** an F-35 sensor glitch (2016) misreading targets in formation; the Boeing 737 Max (2020) warning light turning on when it shouldn't
- **Bias:** face recognition trained on non-diverse data mislabelling people (2021); a hiring tool that discriminated against women (2018)

> [!note] Ethics isn't only a concern for big companies. It's built into the small decisions every developer makes (privacy, access, fairness), and "the technology did it" is not an excuse.

### Language paradigms

|Paradigm|Idea|Strength|Weakness|
|---|---|---|---|
|**Structured**|Steps run top to bottom: get input → process → output|Easy to follow for small programs|Hard to manage large projects with many developers|
|**Object-oriented**|Define objects first (a window, a text box, a button, a text processor), then link them|Objects can be reused across larger projects|More up-front design|

Many modern languages (e.g. JavaScript) are **multi-paradigm** and support both.

### Objects and classes

- An **object** is a "thing" with a **state** (its data) and **behaviours** (what it can do).
- A **class** is the **template** that defines what kind of object it is: which variables it has and which methods it can run.

One class, many objects: a single `Car` class can produce a `miniVan` and a `sedan`, each with its own speed and licence plate.

### Why Java

- **Simple** and **object-oriented**
- **Platform independent:** source code compiles to **bytecode** (`.class` files), which runs on the **Java Virtual Machine (JVM)** on any OS
- **Safe:** no pointers, and programs live inside the JVM
- **Multi-threaded**
- **Garbage collected:** you never free memory by hand

**How Java works:**

1. Write source code in `HelloWorld.java`
2. `javac` compiles it to bytecode, `HelloWorld.class`
3. The JVM on the target machine runs the bytecode

We use **NetBeans** as the IDE (free from netbeans.apache.org). Its autocomplete is worth leaning on while learning.

### Java code structure

Code is nested in three levels:

|Level|Contains|Example|
|---|---|---|
|**Source file** (`.java`)|One public class|`HelloWorld.java`|
|**Class**|Variables and methods, between `{` and `}`|`public class HelloWorld { ... }`|
|**Method**|Statements, between `{` and `}`|`public static void main(String[] args) { ... }`|

Execution always starts at `main`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

### Variables: declaration and assignment

A **variable** is a container for a value. **Declaring** it gives its type (what it can hold) and name; **assigning** puts a value in.

```java
int age;            // declaration: type then name
float weight;
String name;

age = 20;           // assignment: variable = value;
weight = 145;
name = "Dustin";
```

### Comments and console output

```java
// single-line comment
/* multi-line
   comment */

System.out.print("No newline after this");
System.out.println("Newline after this");
```

`print` leaves the cursor on the same line; `println` moves to the next line afterward.

### Methods

A **method** is a unit of work that always runs together. It has a **return type**, a **name**, and **parameters**:

```java
float sum(float a, float b, float c) {   // return type, name, parameters
    float total = a + b + c;
    return total;
}

float result = sum(23.0f, 24.0f, 25.0f);  // calling it
```

### A first class: `Car`

```java
public class Car {
    private String licensePlate;   // instance variables (the state)
    private double speed;
    private double maxSpeed;

    // constructor: same name as the class, runs when an object is created
    public Car(String plateNumber, double speedVal, double maxVal) {
        licensePlate = plateNumber;
        speed = speedVal;
        maxSpeed = maxVal;
    }

    public void setLicensePlate(String plateNumber) {   // methods (the behaviour)
        licensePlate = plateNumber;
    }
    public void setSpeed(double speedVal) {
        speed = speedVal;
    }
    public double getSpeed() {
        return speed;
    }

    public static void main(String[] args) {
        Car c = new Car("C142", 30, 130);   // new + constructor creates an object
        System.out.println(c.getSpeed());   // . accesses its methods → 30.0
        Car d = new Car("D234", 40, 140);
        System.out.println(d.getSpeed());   // → 40.0
    }
}
```

- `private` / `public` are **access modifiers** (covered in [[ch05-writing-classes|Ch 5]])
- `new Car(...)` creates an object and runs the **constructor**
- The `.` operator reaches into a specific object: `c.getSpeed()` and `d.getSpeed()` return different values because each object has its own `speed`

### Good practice and naming

- Start from a working program, change it, break it, figure out what broke, then fix it
- Indent everything between `{` and `}`; use blank lines for readability
- Use meaningful names: `averageGrade`, not `dfiefjek`

**CamelCase convention:**

|Kind|Rule|Examples|
|---|---|---|
|Class|Starts with a **capital**, each word capitalized|`HelloWorld`, `PersonalProfile`|
|Variable / method|Starts **lowercase**, each later word capitalized|`firstName`, `getName()`|

## Key syntax

**Program skeleton**

```java
public class ClassName {                      // file must be ClassName.java
    public static void main(String[] args) {  // execution starts here
        // statements;
    }
}
```

**Method**

```java
returnType methodName(type param1, type param2) {
    // statements
    return value;   // omit if returnType is void
}
```

- `returnType`: the type of value sent back, or `void` for none
- `methodName`: lowercase camelCase
- `param1, param2`: inputs, each with its own type

**Creating and using an object**

```java
ClassName obj = new ClassName(args);   // runs the matching constructor
obj.method();                           // call a method on that object
```

## Examples

### Example 1: `print` vs `println`

> Lecture 1, console output

What does this print?

```java
System.out.print("Welcome to COE318!");
System.out.print("Hope it will be fun!");
System.out.println("Welcome to COE318!");
System.out.println("Hope it will be fun!");
```

`print` doesn't add a newline, so the first two run together on one line. The third `println` continues on that same line and then ends it:

```
Welcome to COE318!Hope it will be fun!Welcome to COE318!
Hope it will be fun!
```

### Example 2: String concatenation in output

> Lecture 1, StatementExample.java

```java
int age;
float weight;
age = 5;
System.out.println("My dog is " + age + "years old.");
weight = 10;
System.out.println("My dog weighs " + weight + " pounds.");
```

1. `+` with a String joins text, so `age` is converted to `"5"`. There's no space before `years` in the literal, so the output is `My dog is 5years old.`
2. `weight` is a `float`, so `10` is stored as `10.0` and printed that way: `My dog weighs 10.0 pounds.`

> [!tip] Spaces inside string literals are exactly what gets printed. Java never adds one for you.

### Example 3: Spot the bugs

> Lecture 1, method slide

```java
float sum(float numberOne, float numberTwo, float numberThree) {
    float returnVal = numberOne + numberTwo + NumberThree;
    return returnVal;
}
float result = sum(23.0, 24.0, 25.0);
```

1. **`NumberThree` ≠ `numberThree`.** Java is case-sensitive, so this is an undefined variable: compile error.
2. **`23.0` is a `double` literal.** Passing a `double` where a `float` is expected is a narrowing conversion, so it won't compile. Use `23.0f` (or make the parameters `double`).

## Common mistakes

- Forgetting Java is **case-sensitive**: `Main`, `Class`, `Public` are not keywords, and `numberThree` ≠ `NumberThree`
- Naming the file something other than the **public class name** + `.java`
- Missing a **semicolon** at the end of a statement
- Unmatched **braces** `{ }` (indentation makes these easy to spot)
- Expecting `print` to add a newline, or `+` to add spaces between joined strings
