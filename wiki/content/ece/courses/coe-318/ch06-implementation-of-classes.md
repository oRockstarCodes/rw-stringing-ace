---
title: "6. Implementation of Classes"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 6 · week 6 · Reference ch. 6

This chapter covers more of what Java lets you do with classes and arrays. **Typecasting** moves an object reference up and down a class hierarchy. **`ArrayList`** is an array that grows and shrinks. **Command-line arguments** and **variable-length parameter lists** change how a method gets its data. The big topic is **`static`**: members that belong to the *class* rather than to each object. It ends with **`final`**, which stops a value from changing.

## Notes

### The `Object` class

`Object` is defined in `java.lang`. **Every class is (implicitly) derived from it**, so `Car`, `Account` and `Scanner` all sit below `Object` in the class hierarchy.

### Typecasting objects

A reference can be cast to another reference type **in the same hierarchy**: to a subclass or a superclass.

|Direction|Name|Cast operator needed?|
|---|---|---|
|Subclass toward the root (`Dog` → `Animal` → `Object`)|**Upcast**|No (implicit)|
|Root toward the subclasses (`Object` → `Animal` → `Dog`)|**Downcast**|**Yes**, `(Dog) a`|

Any object reference can be assigned to an `Object` variable, because `Object` is a superclass of every class.

```java
class Animal {
    public void speak() { System.out.println("Animal"); }
}
class Dog extends Animal {
    public void speak() { System.out.println("Dog"); }
    public void fetch() { System.out.println("Fetching..."); }
}

Dog d = new Dog();
Animal a = d;               // upcasting (implicit)
Object o = d;               // upcasting (implicit)

Animal a2 = (Animal) o;     // downcasting (explicit)
a2.speak();                 // OK

Dog d2 = (Dog) a;           // downcasting (explicit)
d2.speak();                 // OK
d2.fetch();                 // OK
```

There is only **one** `Dog` object here. `d`, `a`, `o`, `a2` and `d2` are five references to it, and the **reference's type** decides which methods you're allowed to call on it.

![[coe-318-typecast-one-object.svg]]
*Figure 6.1: One Dog object reached through three references. Casting only changes the reference, never the object, and the reference's type limits which methods you can call.*

> [!warning] `a.fetch()` doesn't compile: `a` is an `Animal` reference, and `Animal` has no `fetch()`. Cast first: `((Dog) a).fetch()`. A downcast to a type the object *isn't* compiles but throws a `ClassCastException` at runtime.

> [!note] Which `speak()` actually runs (`Animal`'s or `Dog`'s) is covered in [[ch10-polymorphism\|Ch 10]]. The classes here use `extends`, which is [[ch09-inheritance\|Ch 9]].

### Enhanced `for` loop

If you don't need the index, the enhanced `for` loop goes through every element for you:

```java
int[] arrayOfInts = { 32, 87, 3, 12, 8 };

for (int i = 0; i < arrayOfInts.length; i++)      // traditional
    System.out.print(arrayOfInts[i] + " ");

for (int element : arrayOfInts)                    // enhanced: no index
    System.out.print(element + " ");
```

Read `:` as "in": for each `element` in `arrayOfInts`. It works on arrays and on `ArrayList`s.

### `ArrayList`

An array's length is fixed when it's created. If you expect 1000 students but only 30 have registered, `new double[1000]` wastes memory, and you can't make it bigger later.

`ArrayList` (in `java.util`) fixes this. Like an array it stores values you reach by a numeric index, but it **grows and shrinks as needed**.

|Method|Does|
|---|---|
|`add(obj)`|Adds to the end|
|`add(index, obj)`|Inserts at `index`, shifting later elements up|
|`get(index)`|Returns the element at `index`|
|`remove(index)`|Removes the element at `index`, shifting later elements down|
|`indexOf(obj)`|Returns the index of the first match (`-1` if none)|
|`size()`|Returns the number of elements (an array uses `.length`)|

```java
import java.util.ArrayList;

class Beatles {
    public static void main(String[] args) {
        ArrayList<String> band = new ArrayList<String>();

        band.add("Paul");
        band.add("Pete");
        band.add("John");
        band.add("George");

        int location = band.indexOf("John");   // 2
        band.remove(location);
        band.add(location, "Ringo");

        System.out.println("Size of the band: " + band.size());
    }
}
```

![[coe-318-arraylist-insert.svg]]
*Figure 6.2: The Beatles list after each step. remove(2) shifts George down to close the gap, and add(2, "Ringo") shifts him back up to make room.*

**Mixed types.** A plain `ArrayList` stores `Object`s, so it takes anything (primitives get wrapped automatically):

```java
ArrayList misc = new ArrayList();
misc.add("This is a string");   // String
misc.add(1);                    // Integer
misc.add('c');                  // Character
misc.add(42.5);                 // Double

for (Object obj : misc)
    System.out.println(obj);    // This is a string / 1 / c / 42.5
```

**One type only.** Put the type in angle brackets to force the list to accept just that class:

```java
ArrayList<Car> myList = new ArrayList<Car>();
```

Now `myList.add("hello")` is a compile error, and `get()` hands back a `Car` with no cast.

### Command-line arguments

The `String[] args` in `public static void main(String[] args)` is an array of strings holding whatever the user typed after the program name. NetBeans can be set up to pass arguments (Project Properties → Run → Arguments).

```java
public class HelloWorld {
    public static void main(String[] args) {
        for (int i = 0; i < args.length; i++)
            System.out.println(args[i]);
    }
}
```

Run with arguments `hi there` and it prints `hi` then `there`. With no arguments, `args.length` is `0`.

### Variable-length parameter lists

Say you want `average(42, 69, 37)` and also `average(35, 43, 93, 23, 40)`. Without help you'd need a separate method for every count. Write the parameter as `type... name` and Java packs the arguments into an **array**:

```java
public static double average(double... numbers) {
    double total = 0.0;
    for (double d : numbers)
        total += d;
    return total / numbers.length;
}

average(10, 20, 30);        // 20.0
average(5, 15);             // 10.0
average(4.5, 3.5, 2.0, 6.0) // 4.0
```

Inside the method, `numbers` is just a `double[]`.

**Rules**

- The type can be any primitive or object type.
- The method can also take **other** parameters.
- There can be **only one** variable-length parameter per method.
- It must come **last** in the parameter list.

```java
public void test(int count, String name, double... nums) { }   // OK
```

### `static` variables and methods

So far every variable has been an **instance variable**: each object gets its own copy. `miniVan.speed` and `sedan.speed` are separate.

A member declared **`static`** belongs to the **class**. There is **one** copy, shared by every object, and you can use it **without creating any object**. These are also called **class variables** and **class methods**.

```java
public class Car {
    String licensePlate;
    double speed;
    static String navigator;      // shared by all Car objects
    ...
}

Car miniVan = new Car("ABC", 50, 100);
Car sedan   = new Car("DEF", 60, 200);

Car.navigator = "Google Maps";    // no object needed
System.out.println(miniVan.navigator);   // Google Maps
System.out.println(sedan.navigator);     // Google Maps
```

|Kind|Copies|Reached through|
|---|---|---|
|Instance variable|One **per object**|An object: `miniVan.speed`|
|`static` variable|**One total**|The class: `Car.navigator`|

![[coe-318-static-vs-instance.svg]]
*Figure 6.3: Each Car object has its own licensePlate, speed and maxSpeed, but both objects see the single navigator that lives in the Car class.*

> [!tip] Reach `static` members through the **class name** (`Car.navigator`). Writing `miniVan.navigator` works, but it makes it look like the variable belongs to that one object.

**Why `main` is always static.** Java needs an entry point **before any object exists**. If `main` were an instance method, you'd need an object to call it, and nothing could create that object yet.

### Static vs non-static: what can reach what

Only `static` members can be used directly with no object, because they exist with the **class**, not with each instance.

```java
public class Foo {
    static int i = 5;            // class variable (shared)
    int j;                       // instance variable (one per object)

    public Foo(int k) { j = k; }

    public void f() { i++; }     // instance method

    public static void main(String[] args) {
        System.out.println("Foo.i: " + Foo.i);   // OK: static variable
        Foo.f();                                  // ERROR: f() isn't static

        Foo h = new Foo(3);
        h.f();                                    // OK: called on an object
    }
}
```

The common compile error is **"non-static variable cannot be referenced from a static context"**. A `static` method can be called with no object at all, so any instance variable it touched **might not exist**.

A static method *can* use instance members if you give it an object:

```java
public class Foo {
    int a;
    static int b;

    static void m() {
        b = 10;            // OK: b is static
        a = 10;            // ERROR: non-static variable a, static context
        Foo f = new Foo();
        f.a = 10;          // OK: going through an object
        f.b = 10;          // OK: same as b = 10, there's only one b
    }
}
```

### When to use `static`

|Use|When|Example|
|---|---|---|
|`static` **variable**|It shouldn't be set per object, but shared ("global") across all of them|A count of how many objects exist|
|`static` **method**|It depends only on its arguments, not on any object's instance variables|`Math.random()`, `Math.abs(x)`|

`Math` is a "utility" class: all its methods are static, so you never write `new Math()`.

**Keeping a count of objects.** This version doesn't work:

```java
public class Duck {
    private int size;
    private int duckCount = 0;       // instance variable: every Duck has its own
    public Duck() { duckCount++; }   // always goes 0 -> 1 on a brand new copy
    ...
}
```

Each new `Duck` starts with its own `duckCount = 0`, adds 1, and ends up at `1`. Nobody ever sees a running total. Making it `static` fixes it, because all the ducks now share one counter:

```java
public class Duck {
    private int size;
    private static int duckCount = 0;   // one shared counter
    public Duck() { duckCount++; }
    ...
}
```

![[coe-318-duck-counter.svg]]
*Figure 6.4: After three new Duck() calls. As an instance variable, each duck has its own counter stuck at 1. As a static variable, the class has one counter that reaches 3.*

### The `final` keyword

A `final` variable **can't be changed once it's initialized**. Use it for constants.

```java
public class Car {
    final double maxSpeed = 120;
    ...
}

Car miniVan = new Car("ABC", 50);
miniVan.maxSpeed = 200;       // compile error
```

A `final` variable must be initialized **right away** or **in the constructor**. If a class has several constructors, **every** one has to initialize it. If one doesn't, that's a compile error.

```java
public class Car {
    final double maxSpeed;                   // no value yet
    public Car(String plateNumber, double speedVal) {
        ...
        maxSpeed = 120;                      // must be set here, or it won't compile
    }
}
```

**`final` parameters.** A `final` parameter can't be reassigned inside the method (a safety check):

```java
public void setLicensePlate(final String plateNum) {
    plateNum = "XYZ";          // compile error
    licensePlate = plateNum;
}
```

**`static final`.** Use both when there should be **one constant for the whole class**, no matter how many objects exist. It must be initialized when it's declared.

```java
class Math {
    public static final double PI = 3.141592653589793;
}
```

### `final` on a reference

`final` freezes the **variable**. For an object variable, that means it can't be pointed at a different object, but the object's own fields can still change.

```java
final Car miniVan = new Car("ABC", 50);
miniVan.speed = 80;                 // OK: changing the object's field
miniVan = new Car("DEF", 60);       // ERROR: can't reassign a final reference
```

![[coe-318-final-reference.svg]]
*Figure 6.5: A final reference a can't be pointed at another Box, but the Box it points to can still have its value changed. This is Example 4's lines B and C.*

### Order of modifiers

The order doesn't matter to Java: `private static final double c`, `static final private double c` and `final static private double c` are all the same. The recommended order is:

```java
private static final double c
```

## Key syntax

**Typecasting**

```java
Animal a = new Dog();       // upcast: no cast operator
Dog d = (Dog) a;            // downcast: explicit cast
```

**Enhanced `for`**

```java
for (Type item : collectionOrArray) { ... }
```

**`ArrayList`**

```java
ArrayList<Type> list = new ArrayList<Type>();
list.add(x);  list.add(i, x);  list.get(i);
list.remove(i);  list.indexOf(x);  list.size();
```

**Variable-length parameter**

```java
public static double average(double... numbers) { ... }   // last parameter only
```

**Class constant**

```java
private static final double SPEED_LIMIT = 120;
```

|Keyword|Meaning|
|---|---|
|`static`|One copy, belongs to the class, usable with no object|
|`final`|Can't be changed after initialization|
|`static final`|One shared constant for the class|

## Examples

### Example 1: `Foo` and the static counter

> Lecture 6, static variables and methods

`f()` is now `static`. What does this print?

```java
public class Foo {
    static int i = 5;
    int j;
    public Foo(int k) { j = k; }

    public static void f() { i++; }   // OK: static method changes a static variable

    public static void main(String[] args) {
        System.out.println("Foo.i: " + Foo.i);
        Foo.f();
        System.out.println("Foo.i: " + Foo.i);
        Foo g = new Foo(2);
        Foo h = new Foo(3);
        h.f();
        System.out.println("g.i: " + g.i);
    }
}
```

1. `Foo.i` starts at 5, so the first line is `Foo.i: 5`.
2. `Foo.f()` bumps the one shared `i` to 6, so the second line is `Foo.i: 6`.
3. `h.f()` is a static method called through an object, which is allowed. It makes `i` 7.
4. `g.i` is the same `i`, since there's only one, so the last line is `g.i: 7`.

Prints `Foo.i: 5`, `Foo.i: 6`, `g.i: 7`.

> [!note] If `f()` were **not** static, `Foo.f();` wouldn't compile. An instance method needs an object. Calling it as `h.f();` would still be fine.

### Example 2: Which `Lottery` lines don't compile?

> Lecture 6, in-class activity

```java
 1  public class Lottery {
 2      private static int numTickets;
 3      final double ID;
 4      private int price;
 5      public Lottery() {
 6          numTickets++;
 7          price = 40;
 8          ID = numTickets + 2;
 9      }
10      public Lottery(int price) {
11          numTickets++;
12          this.price = 40;
13      }
14      public static void reset(int numTickets) {
15          ID = 0;
16          Lottery.numTickets = numTickets;
17      }
18  }
19
20  class LotteryTest {
21      public static void main(String[] args) {
22          Lottery l = new Lottery();
23          Lottery.numTickets = 0;
24          l.reset(0);
25          System.out.println(l.numTickets);
26      }
27  }
```

(The slide numbers its lines 1–21 with the closing braces tacked onto the last statement of each method. They're written out here so each statement gets its own line.)

Go through the class one member at a time:

1. **Second constructor (lines 10–13):** `ID` is `final`, and **every** constructor has to set it. This one never does. **Error.**
2. **Line 8:** `ID = numTickets + 2;` assigns an `int` into a `double`, which is fine. The first constructor sets `ID`, so it compiles.
3. **Line 12:** `this.price = 40;` is fine, it just ignores the parameter.
4. **Line 15:** `ID = 0;` is inside a **static** method, so it can't touch the instance variable `ID`. It is also a `final` variable being reassigned. **Error.**
5. **Line 16:** `Lottery.numTickets = numTickets;` is fine. The parameter shadows the static field, and `Lottery.` names the field.
6. **Line 23:** `numTickets` is `private`, and `LotteryTest` is a **different class**. **Error.**
7. **Line 24:** `l.reset(0);` is a static method called through an object. It compiles.
8. **Line 25:** `l.numTickets` is `private` again. **Error.**

**Compile errors:** the second constructor (lines 10–13), line 15, line 23 and line 25. Everything else compiles.

### Example 3: Fill in the `Badge` blanks

> Lecture 6, in-class activity

Replace the placeholders (no spaces or semicolons inside one) so the program prints the expected output.

```java
public class Badge {
    [1] int totalBadges;
    [2] int ID;
    private String currentOwner;
    public Badge(String currentOwner) {
        [3] = currentOwner;
        totalBadges++;
        ID = [4];
    }
    public static void main(String[] args) {
        Badge b[] = new Badge[5];
        b[[5]] = new Badge("Bob");
        b[[6]] = new Badge("Singh");
        b[[7]] = new Badge("Tom");
        b[[8]] = new Badge("Chen");
        b[[9]] = new Badge("Odin");
        for (int i = 0; i < 5; i++) {
            System.out.println("Badge " + [10] + " Info:******");
            System.out.println("current owner:" + b[i].currentOwner);
            System.out.println("Total Badges:" + b[i].totalBadges);
            System.out.println("ID:" + b[i].ID);
        }
    }
}
```

Expected output, one block per `i`:

|Badge|Owner|Total Badges|ID|
|---|---|---|---|
|1|Bob|5|4|
|2|Chen|5|7|
|3|Tom|5|6|
|4|Singh|5|5|
|5|Odin|5|8|

1. **Blank 1:** the total is **5** for every badge, so it's one shared counter: `static`.
2. **Blank 2:** `ID` is assigned once in the constructor and never again: `final`.
3. **Blank 3:** the parameter shadows the field, so the field needs `this.`: `this.currentOwner`.
4. **Blank 4:** the objects are created in the order Bob, Singh, Tom, Chen, Odin. After `totalBadges++` the counter is 1, 2, 3, 4, 5 for them, and their IDs are 4, 5, 6, 7, 8. So `ID = totalBadges+3`.
5. **Blanks 5–9:** the output lists Bob, Chen, Tom, Singh, Odin, which is the array order `b[0]` to `b[4]`. The *creation* order is Bob, Singh, Tom, Chen, Odin, so Bob is `0`, Singh is `3`, Tom is `2`, Chen is `1`, Odin is `4`.
6. **Blank 10:** `i` starts at 0 but the badges are numbered from 1: `i+1`.

|Blank|1|2|3|4|5|6|7|8|9|10|
|---|---|---|---|---|---|---|---|---|---|---|
|Answer|`static`|`final`|`this.currentOwner`|`totalBadges+3`|`0`|`3`|`2`|`1`|`4`|`i+1`|

> [!tip] Both `static` and `final` work with `private` here only because `main` is inside `Badge`. If it were in another class, `b[i].currentOwner` wouldn't compile.

### Example 4: Which lines compile with `final`?

> Lecture 6, in-class activity

```java
class Box {
    int value;
    Box(int value) { this.value = value; }
}

class Test {
    public static void main(String[] args) {
        final int x = 10;
        final Box a = new Box(10);
        Box b = new Box(20);

        x = 15;          // A
        a.value = 30;    // B
        a = b;           // C
        b = a;           // D
        b.value = 40;    // E
    }
}
```

|Line|Compiles?|Why|
|---|---|---|
|A: `x = 15;`|**No**|`x` is a `final` int, so its value can't change|
|B: `a.value = 30;`|Yes|`final` stops `a` from pointing elsewhere, not the object's field from changing|
|C: `a = b;`|**No**|`a` is `final`, so it can't be reassigned to another object|
|D: `b = a;`|Yes|`b` isn't `final`, so it can point at `a`'s object|
|E: `b.value = 40;`|Yes|`value` isn't `final`|

### Example 5: Variable-length average

> Lecture 6, `MathUtils` and `VarargsTest`

What does this print?

```java
public class MathUtils {
    public static double average(double... numbers) {
        double total = 0.0;
        for (double d : numbers)
            total += d;
        return total / numbers.length;
    }

    public static void main(String[] args) {
        System.out.println(average(10, 20, 30));
        System.out.println(average(5, 15));
        System.out.println(average(4.5, 3.5, 2.0, 6.0));
    }
}
```

1. `(10 + 20 + 30) / 3` = 60 / 3 = `20.0`
2. `(5 + 15) / 2` = 20 / 2 = `10.0`
3. `(4.5 + 3.5 + 2.0 + 6.0) / 4` = 16 / 4 = `4.0`

Prints `20.0`, `10.0`, `4.0`. One method handles all three because `numbers` is a `double[]` of whatever length was passed.

### Example 6: Insert into an `ArrayList`

> Lecture 6, `Beatles` code

Trace the list from the `Beatles` program in the Notes:

|Step|Code|List|
|---|---|---|
|1|four `add(...)` calls|`[Paul, Pete, John, George]`|
|2|`indexOf("John")`|`location = 2`|
|3|`remove(location)`|`[Paul, Pete, George]`|
|4|`add(location, "Ringo")`|`[Paul, Pete, Ringo, George]`|

The `add(index, obj)` in step 4 pushes `George` one place to the right to make room. It prints `Size of the band: 4`, because one name was removed and one added.

## Common mistakes

- Calling an instance method or using an instance variable from a `static` method (**"non-static variable cannot be referenced from a static context"**)
- Making a per-object variable `static` by accident, so every object shares one value
- Making a counter an instance variable (`private int duckCount`), so each object starts again at 0
- Writing `a.fetch()` on an `Animal` reference and expecting it to compile, when you need a downcast first
- Downcasting to a type the object isn't (`ClassCastException`)
- Using `.length` on an `ArrayList` (it's `size()`) or `size()` on an array (it's `.length`)
- Forgetting `import java.util.ArrayList;`
- Putting a primitive in the angle brackets: `ArrayList<int>` is an error, use `ArrayList<Integer>`
- Putting the `...` parameter anywhere but **last**, or having two of them
- Leaving a `final` field uninitialized, or forgetting to set it in **every** constructor
- Thinking a `final` object reference makes the object's fields unchangeable
- Reassigning a `final` variable or parameter
