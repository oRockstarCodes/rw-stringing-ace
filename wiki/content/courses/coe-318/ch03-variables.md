---
title: "3. Variables"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 3 · weeks 2–4 · Reference ch. 3

This chapter looks at what Java is **really doing** with variables while a program runs. It covers overloading and constructors, the `this` keyword, the different kinds of variables, casting, where things live in memory (**stack** vs **heap**), what happens when you copy a reference, and arrays.

## Notes

### Method overloading

**Overloading** is when several methods have the same name but different **signatures**, meaning a different number of parameters or different parameter types.

```java
public void accelerate() {              // no parameters
    speed = speed + 10;
}
public void accelerate(double amount) { // one double
    speed = speed + amount;
}
```

Java decides which one to run based on the arguments. `accelerate()` adds 10 and `accelerate(25)` adds 25. (C doesn't allow this.)

> [!warning] Changing **only the return type** doesn't count as overloading. `int f(int x)` and `double f(int x)` won't compile together, because a call to `f(3)` can't tell which one you mean.

### Mutable vs immutable classes

- **Mutable:** the object's state can change after it's created (it has setters). `Car` is mutable, which makes sense since speed and fuel change all the time.
- **Immutable:** the state is set **once**, in the constructor, and never changes after that. There are no setters and the fields are `private`.

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

Immutability protects data that shouldn't change after it's created (a licence plate or a voter registration, say) from buggy or malicious code.

> [!tip] To tell if a class is immutable, check two things: every field is `private`, and **no method changes a field** after construction.

### Constructors

A **constructor** sets up a new object. The rules are:

- It has the same name as the class
- It has **no return type**, not even `void`
- It runs automatically when you use `new`

**The default constructor.** If you write **no** constructor, Java gives you a no-argument one that does nothing. **The moment you write any constructor, that free one goes away.**

```java
public class Car {
    public Car(String plate, double speed, double max) { ... }
}

Car a = new Car("ABC", 50, 100);   // OK
Car b = new Car();                 // compile error: no Car() exists anymore
```

**Constructors can be overloaded** like methods. Add `public Car() { }` and both calls work.

### The `this` keyword

`this` is a reference to **the current object**, the one the method or constructor was called on. Writing `speed` inside a method is really just shorthand for `this.speed`.

You mostly need it when a parameter has the same name as a field:

```java
public Car(String licensePlate, double speed, double maxSpeed) {
    this.licensePlate = licensePlate;   // field = parameter
    this.speed = speed;
    this.maxSpeed = maxSpeed;
}
```

Without `this.`, `speed = speed;` just assigns the parameter to itself and the field never changes.

### Kinds of variables

**By data type:**

|Kind|Holds|Examples|
|---|---|---|
|**Primitive**|The value itself|`int a`, `double d`, `char c`|
|**Reference**|The *address* of an object|`Car miniVan`, `String name`, `int[] scores`|

**By where they're declared:**

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

### Classes are data types

Once you've defined a class, it's a type just like any other. You can use it for variables (`Car sedan;`), return types (`public Car giveMeACar()`), and parameters:

```java
public boolean isSameSpeed(Car a, Car b) {
    return a.getSpeed() == b.getSpeed();
}
```

### Type conversion and casting

**Widening** (small → large type) happens automatically and is safe:

$$
\texttt{byte} \to \texttt{short} \to \texttt{int} \to \texttt{long} \to \texttt{float} \to \texttt{double}
$$

**Narrowing** (large → small) can lose information, so Java makes you ask for it with a **cast**, which is the target type in parentheses.

```java
int total = 40, count = 30;
float result1 = total / count;          // int division FIRST → 1, then widened → 1.0
float result2 = (float) total / count;  // total becomes 40.0f first → 1.3333334
int back = (int) result2;               // narrowing: drops the fraction → 1
```

> [!warning] The cast has to happen **before** the division. `(float)(total / count)` is still `1.0`, since the integer division already dropped the fraction.

### Initialization

|Variable|Default value if you don't set one|
|---|---|
|**Local** variable|**None.** Using it before you assign it is a compile error.|
|Instance variable (number)|`0` / `0.0`|
|Instance variable (`char`)|`'\0'`|
|Instance variable (`boolean`)|`false`|
|Instance variable (reference)|`null`|

`null` is a keyword meaning "refers to no object."

### Memory: stack and heap

|Region|What lives there|Lifetime|
|---|---|---|
|**Stack**|Local variables and parameters (including reference variables themselves)|Pushed when a method is called, freed automatically when it returns|
|**Heap**|Every object created with `new` (and its instance variables)|Until nothing refers to it, then garbage collected|

For `Car car1 = new Car("ABC", 20, 100);` inside `main`:

- `car1` is on the **stack**. It holds only an address (4–8 bytes).
- The `Car` object with `"ABC"`, `20`, `100` is on the **heap**.

### References and garbage collection

Assigning one reference to another **copies the address, not the object**:

```java
Car miniVan = new Car("ABC", 50, 100);
Car sedan = new Car();
sedan = miniVan;     // sedan now points at the SAME object as miniVan
```

After the last line, both variables refer to the `"ABC"` car. The no-argument `Car` that `sedan` used to point at has **no references left**, so it's **eligible for garbage collection**. Java keeps track of how many references point at each heap object, and once that hits zero the garbage collector can free the memory. You never do it yourself.

### Arrays

An **array** holds a fixed number of values of **one type** (primitive or object), indexed from `0` to `N - 1`.

```java
int[] scores = new int[10];                     // 10 ints, all 0
int[] units = {147, 323, 89, 933, 540};         // initializer list
char[] grades = {'A', 'B', 'C', 'D', 'F'};

scores[0] = 79;                                 // access by index
System.out.println(units.length);               // 5 (length is a field, no parentheses)
```

- An index outside `0 … length - 1` throws an `ArrayIndexOutOfBoundsException` at run time
- An array is an **object**, so the variable is a **reference**. `alias = scores;` makes both names point at the same array.

> [!warning] C-style `int scores[10];` does **not** compile in Java. The size goes with `new`: `int[] scores = new int[10];`

**Arrays of objects** hold **references**, and those start out as `null`. Making the array doesn't make any objects:

```java
Books[] myBooks = new Books[2];   // two null references, zero Books
myBooks[0] = new Books();         // now one actual Books object
myBooks[0].title = "The Grapes of Java";
```

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
