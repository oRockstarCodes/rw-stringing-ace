---
title: "3. Variables"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 3 · weeks 2–4 · Reference ch. 3

[[ch02-classes-and-objects|Ch 2]] showed how to write a class and make objects from it. This chapter opens the hood and looks at what Java is **actually doing** while the program runs: how it decides which method or constructor to call, where each variable lives in memory and for how long, and what really happens when you copy a variable that refers to an object.

Almost everything here comes back to one distinction: a **primitive** variable holds a value, but a **reference** variable holds the *address* of an object. Once that clicks, aliasing, garbage collection, `null`, and why arrays behave the way they do all follow from it.

## Notes

### Method overloading

**Overloading** means giving several methods the same name, as long as their **signatures** differ: a different number of parameters, or different parameter types.

```java
public void accelerate() {              // no parameters
    speed = speed + 10;
}
public void accelerate(double amount) { // one double
    speed = speed + amount;
}
```

**How Java picks one.** When it sees a call, the compiler looks at the arguments and finds the version whose parameter list matches them. `accelerate()` has no arguments, so it matches the first; `accelerate(25)` has one number, so it matches the second. The choice is made **at compile time** from the argument types alone. (C doesn't allow overloading at all, so there you'd need two different names.)

**Why it's useful.** The caller thinks in terms of the *action* ("accelerate"), not the details. One name with sensible variations is easier to remember than `accelerateByDefault` and `accelerateByAmount`. `System.out.println` is overloaded the same way, with one version for `int`, one for `String`, one for `double`, and so on.

> [!warning] Changing **only the return type** doesn't count. `int f(int x)` and `double f(int x)` won't compile together. The return type isn't part of the call `f(3)`, so the compiler would have no way to tell which one you mean.

### Mutable vs immutable classes

- **Mutable:** the object's state can change after it's created. `Car` is mutable, which makes sense, since a car's speed and fuel change constantly.
- **Immutable:** the state is set **once**, in the constructor, and can never change after that. No setters, and every field `private`.

```java
public class Person {           // immutable
    private String name;
    private boolean isMale;

    public Person(String n, boolean x) {   // the only way to set the fields
        name = n;
        isMale = x;
    }
    public String getName() { return name; }
    public boolean isMale() { return isMale; }
}
```

**Why make something immutable?** Because then you never have to wonder whether it changed. Once a `Person` is created, any code anywhere can hold a reference to it and rely on the name staying put. With a mutable object, some other piece of code holding the same reference could change it under you (see aliasing, below). Immutability protects data that genuinely shouldn't change, like a licence plate or a voter registration, from both bugs and deliberate tampering. Java's own `String` is immutable for exactly this reason ([[ch04-using-classes-and-objects|Ch 4]]).

> [!tip] To check whether a class is immutable, ask two things: is every field `private` (so nobody outside can change it directly), and is there **no method that changes a field** after construction (so nobody inside does either)?

### Constructors

A **constructor** sets up a brand-new object so it starts life in a valid state. Without one, a new `Car` would have no licence plate and a speed of zero, whether that makes sense or not.

- It has the same name as the class.
- It has **no return type**, not even `void`. It doesn't hand back a value; `new` is what hands back the reference.
- It runs automatically, exactly once per object, when you use `new`.

**The default constructor.** If you write **no** constructor at all, Java quietly supplies a no-argument one that does nothing, so `new Car()` still works. **The moment you write any constructor, that free one disappears.**

```java
public class Car {
    public Car(String plate, double speed, double max) { ... }
}

Car a = new Car("ABC", 50, 100);   // OK
Car b = new Car();                 // compile error: no Car() exists anymore
```

Why would Java take it away? Because writing a constructor that requires a plate is you saying "a car without a plate shouldn't exist". If Java still supplied an empty `Car()`, anyone could sidestep your rule. If you do want both, write the no-argument one yourself: constructors can be **overloaded** exactly like methods.

### The `this` keyword

Inside a method, `this` means **the object the method was called on**. When you call `miniVan.setSpeed(50)`, `this` is the minivan; for `sedan.setSpeed(50)`, it's the sedan. That's how one method in the class can work on whichever object called it. Writing `speed` inside a method is really shorthand for `this.speed`.

You usually only need to write it out when a parameter has the same name as a field:

```java
public Car(String licensePlate, double speed, double maxSpeed) {
    this.licensePlate = licensePlate;   // field = parameter
    this.speed = speed;
    this.maxSpeed = maxSpeed;
}
```

Inside this constructor, the plain name `speed` means the **parameter**, because the nearest declaration wins (this is called **shadowing**, covered more in [[ch05-writing-classes|Ch 5]]). So `speed = speed;` would just copy the parameter onto itself and leave the field unchanged. `this.speed` says "the field belonging to this object", which is unambiguous.

### Kinds of variables

Variables can be sorted two ways, and both matter.

**By what they hold:**

|Kind|Holds|Examples|
|---|---|---|
|**Primitive**|The value itself|`int a`, `double d`, `char c`|
|**Reference**|The *address* of an object|`Car miniVan`, `String name`, `int[] scores`|

**By where they're declared**, which decides how long they live and who can see them:

```java
public class C {
    private int i;          // instance variable: belongs to the object
    public void f(int j) {  // j: parameter
        int k;              // k: local variable
        k = 2 * j;
        i = i + k;
    }
    public void g() {
        int k;              // a different local k, unrelated to f's
    }
}
```

- An **instance variable** (`i`) belongs to an object. It lives as long as the object does, and every method of the class can use it. That's how an object remembers things *between* method calls.
- A **parameter** (`j`) or **local variable** (`k`) belongs to one run of one method. It's created when the method starts and destroyed when it returns. The `k` in `f` and the `k` in `g` are completely separate variables that happen to share a name, and neither remembers anything from one call to the next.

### Classes are data types

Once you've written a class, it's a **type** just like `int` or `String`. You can use it anywhere a type goes: for variables (`Car sedan;`), return types (`public Car giveMeACar()`), and parameters:

```java
public boolean isSameSpeed(Car a, Car b) {
    return a.getSpeed() == b.getSpeed();
}
```

This is what lets objects work together. A `ParkingLot` can have a method that takes a `Car`, and a `Driver` can hold a reference to the `Car` they drive.

### Type conversion and casting

Converting between number types is safe in one direction and risky in the other.

**Widening** (small → large) can't lose information, because the bigger type can hold every value the smaller one can. So Java does it automatically:

$$
\texttt{byte} \to \texttt{short} \to \texttt{int} \to \texttt{long} \to \texttt{float} \to \texttt{double}
$$

**Narrowing** (large → small) can lose information. A `double` like 3.7 has no exact `int` equivalent, and a big `long` may not fit in an `int` at all. So Java refuses to do it silently. You have to ask explicitly with a **cast**, the target type in parentheses, which is you saying "I know, do it anyway".

```java
int total = 40, count = 30;
float result1 = total / count;          // int division FIRST → 1, then widened → 1.0
float result2 = (float) total / count;  // total becomes 40.0f first → 1.3333334
int back = (int) result2;               // narrowing: drops the fraction → 1
```

What makes `result1` wrong is the **order of events**. Java evaluates the right side completely before thinking about the variable on the left. `total / count` is two `int`s, so it's integer division, giving 1. Only then is that 1 widened to fit into the `float`. By then the fraction is long gone.

> [!warning] The cast has to happen **before** the division. `(float) total / count` converts `total` first, so the division is done in decimals. `(float)(total / count)` does the integer division first and converts the finished 1, which gives `1.0`.

### Initialization

|Variable|Default value if you don't set one|
|---|---|
|**Local** variable|**None.** Using it before you assign it is a compile error.|
|Instance variable (number)|`0` / `0.0`|
|Instance variable (`char`)|`'\0'`|
|Instance variable (`boolean`)|`false`|
|Instance variable (reference)|`null`|

`null` is a keyword meaning "refers to no object".

**Why the difference?** When `new` makes an object, Java clears its memory to zeros first, and all-zero bits read as 0, `false` or `null`. So instance variables always start with *something*. Local variables get no such cleanup (they're made and thrown away constantly, and clearing each one would cost time). Rather than let you read whatever garbage was left there, the compiler checks that every local is assigned before it's used, and refuses to compile if it can't prove it.

### Memory: stack and heap

A running Java program keeps its data in two regions, organized very differently because they serve different purposes:

|Region|What lives there|Lifetime|
|---|---|---|
|**Stack**|Local variables and parameters (including reference variables themselves)|Pushed when a method is called, freed automatically when it returns|
|**Heap**|Every object created with `new` (and its instance variables)|Until nothing refers to it, then garbage collected|

**The stack** works like a stack of plates. Each method call puts a new plate (a **frame**) on top, holding that call's parameters and local variables. When the method returns, its plate comes off and everything on it disappears. That's why locals don't survive between calls. It's fast and automatic, but things on it can only live as long as the method that made them.

**The heap** is for things that need to outlive the method that made them. An object created inside a method might be returned, stored in a field or passed around for the rest of the program, so it can't sit on a plate that's about to be removed. Objects go on the heap, and they stay there as long as something still refers to them.

For `Car car1 = new Car("ABC", 20, 100);` inside `main`:

- `car1` is on the **stack**. It holds only an address (4–8 bytes).
- The `Car` object with `"ABC"`, `20`, `100` is on the **heap**.

![[coe-318-stack-and-heap.svg]]
*Figure 3.1: The reference variable car1 lives on the stack, and the object it points to lives on the heap.*

### References, aliasing and garbage collection

Since a reference variable holds an address, assigning one to another **copies the address, not the object**:

```java
Car miniVan = new Car("ABC", 50, 100);
Car sedan = new Car();
sedan = miniVan;     // sedan now points at the SAME object as miniVan
```

After the last line, `miniVan` and `sedan` are two names for **one** car. This is called **aliasing**. Call `sedan.setSpeed(0)` and `miniVan.getSpeed()` is 0 too, because there's only one speed involved. If you want an independent copy, you have to make a new object and copy the values into it.

**What happens to the other car?** The no-argument `Car` that `sedan` used to point at now has **no references left**. No variable anywhere holds its address, so no code can ever reach it again. It's **eligible for garbage collection**. Every so often the JVM's garbage collector works out which heap objects can still be reached from the program's variables and frees the memory of everything that can't. You never free memory yourself, and you can't accidentally use an object after it's been freed, because by definition nothing can reach it.

![[coe-318-reference-assignment.svg]]
*Figure 3.2: sedan = miniVan copies the address, not the object. The old default Car has no references left, so it is garbage.*

### Arrays

An **array** holds a fixed number of values of **one type** (primitive or object), side by side, numbered from `0` to `N - 1`.

```java
int[] scores = new int[10];                     // 10 ints, all 0
int[] units = {147, 323, 89, 933, 540};         // initializer list
char[] grades = {'A', 'B', 'C', 'D', 'F'};

scores[0] = 79;                                 // access by index
System.out.println(units.length);               // 5 (length is a field, no parentheses)
```

**Why indices start at 0.** The index is really an **offset**: how many elements past the start to go. The first element is 0 steps from the start. So the last one, in an array of $N$, is at $N - 1$.

- An index outside `0 … length - 1` throws an `ArrayIndexOutOfBoundsException` when the program runs. Java checks every access, which turns a silent memory-corruption bug (common in C) into a clear error.
- An array is an **object**, created with `new` and living on the heap, so the array variable is a **reference**. Everything about aliasing applies: `alias = scores;` makes two names for one array.

> [!warning] C-style `int scores[10];` does **not** compile in Java. In Java the declaration only makes the reference; the size belongs to the object, so it goes with `new`: `int[] scores = new int[10];`

**Arrays of objects hold references**, and like any reference they start out as `null`. Making the array makes a row of empty slots, not the objects to fill them:

```java
Books[] myBooks = new Books[2];   // two null references, zero Books
myBooks[0] = new Books();         // now one actual Books object
myBooks[0].title = "The Grapes of Java";
```

Using `myBooks[1].title` at this point would throw a `NullPointerException`, because slot 1 still doesn't refer to any book. Picture an array of objects as a row of remote controls, none paired with a TV until you `new` one for each.

## Key syntax

**Constructor and `this`**

```java
public ClassName(Type field) {   // no return type
    this.field = field;          // this.field = instance variable
}
```

**Cast**

```java
double avg = (double) sum / n;   // cast one operand BEFORE dividing
```

**Arrays**

```java
Type[] a = new Type[N];          // indices 0 … N-1
a.length                         // number of elements
for (int i = 0; i < a.length; i++) { a[i] ... }
```

## Examples

### Example 1: Which constructor runs?

> Lecture 3, "Find output"

```java
public class Cube {
    int length, breadth, height;

    public int getVolume() { return length * breadth * height; }

    Cube() { length = 10; breadth = 10; height = 10; }
    Cube(int l, int b, int h) { length = l; breadth = b; height = h; }

    public static void main(String[] args) {
        Cube cubeObj1 = new Cube();
        Cube cubeObj2 = new Cube(10, 20, 30);
        System.out.println("Volume of Cube1 is: " + cubeObj1.getVolume());
        System.out.println("Volume of Cube2 is: " + cubeObj2.getVolume());
    }
}
```

1. `new Cube()` has no arguments, so the no-arg constructor runs: $10 \times 10 \times 10 = 1000$
2. `new Cube(10, 20, 30)` matches the constructor with three ints: $10 \times 20 \times 30 = 6000$

```
Volume of Cube1 is: 1000
Volume of Cube2 is: 6000
```

### Example 2: Will it compile?

> Lecture 3, constructor questions

```java
public class DefaultConstructorOnly { int size = 5; }

public class OneConstructor {
    OneConstructor(String message) { System.out.println(message); }
}

public class TwoConstructors {
    TwoConstructors(String message) { System.out.println(message); }
    TwoConstructors() { System.out.println("No argument Constructor"); }
}
```

|Statement|Compiles?|Why|
|---|---|---|
|`new DefaultConstructorOnly()`|Yes|No constructor was written, so Java supplies `DefaultConstructorOnly()`|
|`new TwoConstructors()`|Yes|A no-arg constructor is written out|
|`new OneConstructor()`|**No**|Writing `OneConstructor(String)` got rid of the default one|
|`new Car("ABC", 50)` (Car has 0-arg and 3-arg)|**No**|No constructor takes `(String, double)`|

### Example 3: Casting and the GPA

> Lecture 3, Student exercise

Complete the constructor so it computes `GPA = totalGradePoints / totalHours`, write `getGPA()`, and create a student `"Sanders, Bruce"` with 35 hours and 92 grade points.

```java
class Student {
    private String name;
    private int totalHours;
    private int totalGradePoints;
    private double GPA;

    public Student(String name, int totalHours, int totalGradePoints) {
        this.name = name;
        this.totalHours = totalHours;
        this.totalGradePoints = totalGradePoints;
        GPA = (double) totalGradePoints / totalHours;   // cast!
    }

    public double getGPA() { return GPA; }

    public static void main(String[] args) {
        Student bSanders = new Student("Sanders, Bruce", 35, 92);
        System.out.println(bSanders.getGPA());
    }
}
```

1. `this.name = name` and so on: the parameters have the same names as the fields, so `this.` is needed
2. Without the cast, `92 / 35` is integer division = `2`, stored as `2.0`
3. With the cast: $92 / 35 = 2.628571\ldots$, so it prints `2.6285714285714286`

### Example 4: Two names for one array

> Lecture 3, arrays in memory

```java
int[] integerArray = new int[5];
for (int i = 0; i < integerArray.length; i++)
    integerArray[i] = 5;
int[] alias = integerArray;
alias[3] = 10;
System.out.println(integerArray[3]);   // (a)
integerArray = new int[3];
System.out.println(integerArray[3]);   // (b)
System.out.println(alias[3]);          // (c)
```

1. **(a)** `alias` and `integerArray` point at the same array, so changing `alias[3]` also changes `integerArray[3]`. It prints `10`.
2. `integerArray` now points at a **new** 3-element array, while `alias` still points at the old one.
3. **(b)** The new array only has indices 0–2, so this throws an **`ArrayIndexOutOfBoundsException`** and the program stops.
4. **(c)** never runs. Without (b) it would print `10`, since the old array still exists as long as `alias` refers to it.

![[coe-318-array-alias.svg]]
*Figure 3.3: Two names for one array, then integerArray is reassigned to a new array while alias still points at the old one.*

### Example 5: Heap quiz

> Lecture 3, "Find output"

```java
class HeapQuiz { int id = 0; }

HeapQuiz[] hq = new HeapQuiz[5];
int x = 0;
while (x < 3) {
    hq[x] = new HeapQuiz();
    hq[x].id = x;
    x = x + 1;
}
hq[3] = hq[1];
hq[4] = hq[1];
hq[3] = hq[2];
for (int j = 0; j < 5; j++)
    System.out.println("hq[" + j + "]:" + hq[j].id);
```

1. The loop creates **three** objects. Call them A (`id 0`), B (`id 1`) and C (`id 2`), sitting in `hq[0..2]`
2. `hq[3] = hq[1]` → `hq[3]` points at B
3. `hq[4] = hq[1]` → `hq[4]` points at B
4. `hq[3] = hq[2]` → `hq[3]` now points at C instead

![[coe-318-heapquiz.svg]]
*Figure 3.4: Final state of the heap quiz. Only three HeapQuiz objects exist, and the array slots just point at them.*

|Index|0|1|2|3|4|
|---|---|---|---|---|---|
|Object|A|B|C|C|B|
|`id`|0|1|2|2|1|

```
hq[0]:0
hq[1]:1
hq[2]:2
hq[3]:2
hq[4]:1
```

> [!note] Only three objects ever exist. `hq[3]` and `hq[4]` are just extra references to ones that are already there, and nothing gets garbage collected.

## Common mistakes

- "Overloading" by changing only the return type
- Adding a constructor with parameters and then calling `new X()` without writing a no-arg one
- Writing `speed = speed;` in a constructor and forgetting `this.`, so the field never gets set
- Casting too late. `(double)(a / b)` still does integer division
- Using a local variable before assigning it (compile error, there's no default value)
- Thinking `b = a;` copies an object. It copies the **reference**, so both now share one object
- Making an array of objects and forgetting to `new` each element, then getting a `NullPointerException`
- Indexing `a[a.length]`, when the last valid index is `a.length - 1`
