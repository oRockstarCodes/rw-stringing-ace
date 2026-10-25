---
title: "1. Software Development Cycle & OOP"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 1 · week 2 · no textbook chapter (Head First Java ch. 1–2 covers the same ground)

Small programs can be written however you like. Big ones can't. Once a program has thousands of lines and several people working on it, the hard part stops being "how do I make the computer do this?" and becomes "how do we keep this from turning into a mess nobody understands?" This chapter is about the two big answers to that question:

1. **A process** (the software development lifecycle), so that a team builds the right thing and catches mistakes while they're still cheap to fix.
2. **A way of organizing code** (object-oriented programming), so that a huge program is made of small, self-contained pieces that can be understood, tested and reused one at a time.

Along the way it covers the first pieces of Java you need to write one of those self-contained pieces: a class.

## Notes

### Why code has to be translated

A CPU only understands its own **machine code**: very simple instructions like "add these two registers" or "jump to this address", written as numbers. Nobody wants to write a program that way, so we write in **high-level languages** (Java, C, C++, Python) that read closer to English and maths. Then a program called a **compiler** translates the high-level code into instructions a machine can run.

That translation step is also where a lot of mistakes get caught. Before it translates anything, the compiler checks that your code follows the language's rules (every variable declared, types that match, no missing semicolons). A **compile error** is the compiler refusing to translate something that doesn't make sense, which is far better than a program that runs and does the wrong thing.

### The software development lifecycle

Building software is more than writing code. The **software development lifecycle (SDLC)** is the sequence of steps a team goes through:

|Phase|The question it answers|
|---|---|
|Requirements / analysis|What must the software do, and for whom?|
|Design|How will it be structured? Which pieces (classes), and how do they talk to each other?|
|Implementation|Write the code.|
|Testing|Does it actually do what the requirements said?|
|Deployment|Release it to users.|
|Maintenance|Fix bugs and add features after release.|

**Why bother with the early phases?** Because **a change costs more the later you make it**, roughly exponentially. During design, changing your mind is an edit to a diagram. During implementation, it means rewriting code that other code already depends on. After deployment, it means rewriting, retesting, re-releasing, and maybe fixing damage the bug already did. Every phase builds on the ones before it, so a mistake made early gets baked into everything after it. Time spent on requirements and design is time saved later.

Teams arrange these phases in different ways, called **SDLC models**:

- **Waterfall** goes through each phase once, in order. It's simple, but you only find out the requirements were wrong at the very end.
- **Iterative**, **agile** and **spiral** models loop through the phases many times in small cycles, so users see working pieces early and mistakes surface sooner.
- **V model** pairs each design phase with a matching testing phase. **RAD** (rapid application development) builds quick prototypes and refines them.

They're all trying to balance planning (which prevents expensive mistakes) against feedback (which finds the mistakes planning missed).

### Ethics and software failures

Software now runs medical devices, aircraft, hiring and policing, so a bug or a biased design choice isn't just an inconvenience. It can hurt people. Some real cases:

- **Medical:** a 2015 infusion pump that could skip doses or fail to delay an infusion, depending on the timing of the input
- **Aviation:** a 2016 F-35 sensor glitch that misread targets when planes flew in formation, and the 2020 Boeing 737 Max warning light coming on when it shouldn't
- **Bias:** face recognition trained on non-diverse data that mislabelled people (2021), and a hiring tool that learned to discriminate against women (2018)

Notice that none of these were caused by one programmer being careless at one moment. The pump's bug only appeared with certain input timing, which **testing** should have explored. The biased tools learned from biased data, which is a **requirements and design** decision about what data to use. That's why ethics belongs in every phase of the SDLC, not just at the end. "The technology did it" isn't an excuse, because people chose how to build the technology.

### Two ways to organize a program

**Structured (procedural) programming** writes a program as a sequence of steps: get the input, process it, print the output. Data lives in variables, and functions operate on it. For a small program this is the easiest thing to follow, since you just read top to bottom.

The trouble comes with size. In a big procedural program, any function can change any piece of data. When something has the wrong value, the culprit could be anywhere, and changing how one piece of data is stored can break code all over the program.

**Object-oriented programming (OOP)** organizes the program around **things** instead of steps. You decide what objects the problem involves (a window, a text box, a button, a spell-checker) and give each one:

- its own **data** (its **state**): a text box knows its contents and cursor position
- its own **behaviours** (its **methods**): a text box knows how to insert a character or clear itself

Then you connect the objects, and they get things done by asking each other to do things.

**Why that helps with big programs:**

- **Each object guards its own data.** Only the text box's own methods change its contents, so if the contents are wrong, there's only one place to look.
- **Objects are reusable.** A well-built button works in any program that needs a button.
- **The code mirrors the problem.** If the problem involves cars and parking lots, the code has a `Car` and a `ParkingLot`, which makes it easier to reason about.

The cost is more planning up front, because you have to decide what the objects are and what each one is responsible for. That's the design phase of the SDLC. Many modern languages (JavaScript, Python) are **multi-paradigm** and let you mix both styles.

### Objects and classes

A **class** is a **blueprint**. It describes what data every object of that kind will have and what it will be able to do, but it isn't a thing itself. An **object** is one actual thing built from that blueprint.

Think of a blueprint for a house. The blueprint says "three bedrooms and a front door", but you can't live in it. Build two houses from it and you get two real houses, each with its own furniture and its own colour of front door. Painting one door doesn't paint the other.

In code, one `Car` class can make a `miniVan` and a `sedan`. Both have a speed and a licence plate, because the class says every car has those, but each has **its own** speed and **its own** plate. Speeding up the minivan doesn't touch the sedan.

### Why Java

- **Platform independent.** Most compilers translate straight to one kind of CPU's machine code, so a program compiled for Windows won't run on a Mac. Java compiles instead to **bytecode** (`.class` files), the machine code of an imaginary computer called the **Java Virtual Machine (JVM)**. Every operating system has its own JVM that runs bytecode on the real hardware, so the same `.class` file runs anywhere: "write once, run anywhere".
- **Safe.** Java has no pointers that let you reach into arbitrary memory, and programs run inside the JVM, which checks what they do.
- **Garbage collected.** When an object isn't being used anymore, the JVM frees its memory for you, which removes a whole category of bugs (forgetting to free memory, or using it after freeing it).
- **Object-oriented** from the ground up, and **multi-threaded** (it can do several things at once).

**How a Java program runs:**

1. You write source code in `HelloWorld.java`.
2. `javac` (the Java compiler) checks it and translates it to bytecode, `HelloWorld.class`.
3. The JVM on whatever machine you're on runs the bytecode.

The course uses **NetBeans** as the IDE (it's free from netbeans.apache.org). Its autocomplete is a good way to discover what methods an object has while you're learning.

### How Java code is structured

Java code nests in three levels, and each level holds the one below it:

|Level|Contains|Example|
|---|---|---|
|**Source file** (`.java`)|One public class, and the file must be named after it|`HelloWorld.java`|
|**Class**|Variables and methods, between `{` and `}`|`public class HelloWorld { ... }`|
|**Method**|Statements, between `{` and `}`|`public static void main(String[] args) { ... }`|

Every statement lives inside a method, and every method lives inside a class. There's no code floating around on its own, which is the language enforcing the object-oriented idea that everything belongs to some class.

The program has to start somewhere, and that's always the method called `main`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

`main` is marked `static` because when the program starts, no objects exist yet. `static` means "this belongs to the class itself, not to any particular object", so the JVM can call it without creating anything first. (More on `static` in Ch 6.)

### Variables

A **variable** is a named box in memory that holds a value. **Declaring** it tells Java two things: its **name**, and its **type**, which is what kind of value can go in the box.

```java
int age;            // declaration: type, then name
float weight;
String name;

age = 20;           // assignment: variable = value;
weight = 145;
name = "Dustin";
```

**Why Java insists on types.** The type tells the compiler how much memory the box needs (an `int` and a `double` take different amounts) and which operations make sense on it. It also lets the compiler catch mistakes before the program runs: putting `"hello"` in an `int` is a compile error instead of a mysterious crash later.

### Comments and output

```java
// single-line comment
/* multi-line
   comment */

System.out.print("No newline after this");
System.out.println("Newline after this");
```

Comments are for people. The compiler ignores them. `print` leaves the cursor where it is, so the next output continues on the same line, while `println` ("print line") moves to a new line afterwards.

### Methods

A **method** is a named piece of code that does one job. Giving a job a name means you can do it again just by calling the name, instead of copying the code, and you can fix it in one place.

```java
float sum(float a, float b, float c) {   // return type, name, parameters
    float total = a + b + c;
    return total;
}

float result = sum(23.0f, 24.0f, 25.0f);  // calling it
```

- **Parameters** (`a`, `b`, `c`) are the method's inputs. When you call it, the values you pass in get copied into them.
- The **return type** (`float`) is the kind of value it hands back. `return` sends that value back to wherever the method was called. A method that doesn't hand anything back has return type `void`.

### A first class: `Car`

Here's everything above put together into one class, with its data and its behaviours:

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

What's happening:

- The three `private` variables are **instance variables**. Every `Car` object gets its own copy of all three, which is how `c` and `d` can have different speeds.
- `new Car(...)` does two things. It sets aside memory for a brand-new object, then runs the **constructor** to fill in that object's starting values. Without the constructor, a new car would have no plate and no speed.
- The `.` operator means "on this particular object". `c.getSpeed()` asks car `c` for its speed, and `d.getSpeed()` asks car `d`. It's the same method, but it reads a different object's data, so the answers differ.
- `private` means only `Car`'s own methods can touch those variables, and `public` means any code can call those methods. That's the "each object guards its own data" idea from OOP, written into the language ([[ch05-writing-classes|Ch 5]] covers it properly).

### Good practice and naming

Code is read far more often than it's written, by other people and by you three weeks later. So:

- Start with a program that works, change one thing, and see what happens. If it breaks, work out *why* before fixing it. That's how you learn what each piece does.
- Indent everything between `{` and `}`. Then the structure (what's inside what) is visible at a glance, and a missing brace stands out.
- Use meaningful names, like `averageGrade` instead of `dfiefjek`. A good name explains the code so a comment doesn't have to.

**CamelCase convention.** Java programmers all follow the same naming rules, so you can tell what something is just from how it's written:

|Kind|Rule|Examples|
|---|---|---|
|Class|Starts with a **capital**, each word capitalized|`HelloWorld`, `PersonalProfile`|
|Variable / method|Starts **lowercase**, each later word capitalized|`firstName`, `getName()`|

So in `Car car = new Car();`, the capital `Car` is the class (the blueprint) and the lowercase `car` is a variable holding one object.

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
