---
title: "1. Software Development Cycle & OOP"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 1 · week 2 · no textbook chapter (Head First Java ch. 1–2 covers the same ground)

Software gets built in a cycle that goes **requirements → design → implementation → testing → deployment → maintenance**, then back around. This course is mostly about the implementation step, using **object-oriented programming (OOP)** in Java. Instead of one long program that runs top to bottom, you make **objects** that each keep their own data and know what they can do, and then connect them.

## Notes

### Programming languages and compiling

Java, C, C++ and Python are **high-level languages**. The CPU can't run them as written, so the code has to be **compiled** (translated) into low-level machine code first.

### Software Development Lifecycle (SDLC)

The SDLC is just the list of steps a team goes through to build software:

|Phase|What happens|
|---|---|
|Requirements / analysis|Figure out what the software must do, and for whom|
|Design|Decide the structure: which classes, how they interact|
|Implementation|Write the code|
|Testing|Check the code actually meets the requirements|
|Deployment|Release it to users|
|Maintenance|Fix bugs and add features after release|

There are a few **SDLC models** that arrange these phases differently: **waterfall** (each phase once, in order), **iterative**, **agile**, **V model**, **RAD**, and **spiral**.

> [!warning] A design change costs way more the later it happens, roughly **exponentially**. Something that's a quick edit during design can turn into rewriting and retesting everything once the software is already deployed. That's why the design phase matters.

### Ethics and software failures

More and more, software runs things people's lives depend on and makes decisions about people, so bugs and bias actually hurt someone. Examples from the lecture:

- **Medical:** a 2015 infusion pump that could skip doses or fail to delay an infusion depending on the timing of the input
- **Aviation:** a 2016 F-35 sensor glitch that misread targets when planes flew in formation, and the 2020 Boeing 737 Max warning light coming on when it shouldn't
- **Bias:** face recognition trained on non-diverse data that mislabelled people (2021), and a hiring tool that discriminated against women (2018)

> [!note] Ethics isn't only something big companies have to worry about. It shows up in the small choices every developer makes (privacy, access, fairness), and "the technology did it" doesn't work as an excuse.

### Language paradigms

|Paradigm|Idea|Strength|Weakness|
|---|---|---|---|
|**Structured**|Steps run top to bottom: get input → process → output|Easy to follow in a small program|Gets messy on big projects with lots of developers|
|**Object-oriented**|Define the objects first (a window, a text box, a button, a text processor), then link them together|Objects can be reused in bigger projects|Takes more planning up front|

A lot of modern languages (JavaScript, for example) are **multi-paradigm**, so you can use either style.

### Objects and classes

- An **object** is a "thing" with a **state** (its data) and **behaviours** (what it can do).
- A **class** is the **template** for an object. It says which variables the object has and which methods it can run.

One class can make many objects. A single `Car` class can give you a `miniVan` and a `sedan`, and each has its own speed and licence plate.

### Why Java

- **Simple** and **object-oriented**
- **Platform independent:** the source compiles to **bytecode** (`.class` files), and the **Java Virtual Machine (JVM)** runs that on any OS
- **Safe:** no pointers, and programs run inside the JVM
- **Multi-threaded**
- **Garbage collected:** you don't free memory yourself

**How Java works:**

1. Write source code in `HelloWorld.java`
2. `javac` compiles it to bytecode, `HelloWorld.class`
3. The JVM on whatever machine you're on runs the bytecode

The course uses **NetBeans** as the IDE (it's free from netbeans.apache.org). Use the autocomplete while you're learning, it helps a lot.

### Java code structure

Java code nests in three levels:

|Level|Contains|Example|
|---|---|---|
|**Source file** (`.java`)|One public class|`HelloWorld.java`|
|**Class**|Variables and methods, between `{` and `}`|`public class HelloWorld { ... }`|
|**Method**|Statements, between `{` and `}`|`public static void main(String[] args) { ... }`|

The program always starts running at `main`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

### Variables: declaration and assignment

A **variable** holds a value. **Declaring** it sets its type (what it can hold) and its name, and **assigning** puts a value in it.

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

`print` keeps the cursor on the same line, while `println` moves to the next line after printing.

### Methods

A **method** is a chunk of code that runs as one job. It has a **return type**, a **name**, and **parameters**:

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

- `private` and `public` are **access modifiers** (more on them in [[ch05-writing-classes|Ch 5]])
- `new Car(...)` creates the object and runs the **constructor**
- The `.` operator gets you into one specific object. `c.getSpeed()` and `d.getSpeed()` give different values because each object has its own `speed`

### Good practice and naming

- Start with a program that works, change it, break it, work out what broke, then fix it
- Indent everything between `{` and `}`, and use blank lines so it's easy to read
- Give things meaningful names, like `averageGrade` instead of `dfiefjek`

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

`print` doesn't add a newline, so the first two end up on one line. The first `println` carries on from there and then ends the line:

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

1. `+` next to a String joins text, so `age` gets turned into `"5"`. The literal has no space before `years`, so it prints `My dog is 5years old.`
2. `weight` is a `float`, so `10` is stored as `10.0` and prints that way: `My dog weighs 10.0 pounds.`

> [!tip] Whatever spaces are inside the string literals are exactly what get printed. Java won't add any for you.

### Example 3: Spot the bugs

> Lecture 1, method slide

```java
float sum(float numberOne, float numberTwo, float numberThree) {
    float returnVal = numberOne + numberTwo + NumberThree;
    return returnVal;
}
float result = sum(23.0, 24.0, 25.0);
```

1. **`NumberThree` ≠ `numberThree`.** Java is case-sensitive, so `NumberThree` is an undefined variable and you get a compile error.
2. **`23.0` is a `double` literal.** Passing a `double` where a `float` is expected is a narrowing conversion, so it won't compile. Write `23.0f` instead, or change the parameters to `double`.

## Common mistakes

- Forgetting that Java is **case-sensitive**. `Main`, `Class` and `Public` aren't keywords, and `numberThree` ≠ `NumberThree`
- Naming the file anything other than the **public class name** + `.java`
- Leaving off the **semicolon** at the end of a statement
- Braces `{ }` that don't match up (indenting properly makes these easy to catch)
- Expecting `print` to add a newline, or `+` to put spaces between joined strings
