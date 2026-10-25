---
title: "4. Using Classes and Objects"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 4 · week 4 · Reference ch. 4, 10

A single object isn't very useful. Real programs are made of many objects that hold references to each other and pass information back and forth. This chapter is about the questions that come up as soon as objects start interacting:

- **What does it mean for two things to be "equal"?** Same value, or the same object? (`==` vs `equals`)
- **When you hand an object to a method, can the method change it?** (parameter passing)
- **How do objects find each other?** (linking, through reference fields)
- **How do you go from a written problem to a set of classes?** (design)

It starts with Java's built-in `String` class, which is the first object most programs use and a good illustration of all of these.

> [!tip] Nearly every surprise in this chapter is the reference idea from [[ch03-variables|Ch 3]] again: an object variable holds an address, not the object. When something behaves strangely, draw the boxes and arrows.

## Notes

### The `String` class

`String` is a class, so a `String` variable is a **reference** to a String object, not the text itself. Strings get one special privilege, though: you can create them from a **literal** (text in quotes) without writing `new`.

```java
String a = "ABC 41";              // literal: stored in the String pool
String b = "ABC 41";              // same literal → reuses the SAME object
String c = new String("ABC 41");  // new → always a brand-new object
```

**Why the pool exists.** Programs use the same bits of text over and over. Instead of making a new object for every `"ABC 41"` in the code, Java keeps one shared copy in a **String pool** and points every identical literal at it. That saves memory, and it's only safe because of the next point.

**Strings are immutable.** Once created, a String's characters can never change. Methods like `concat`, `replace` and `toUpperCase` don't modify the original. They build and **return a new String**:

```java
name.toUpperCase();          // does nothing useful: result thrown away
name = name.toUpperCase();   // keeps it
```

Immutability is what makes sharing safe. If `a` and `b` point at the same pooled `"ABC 41"` and `a` could change its letters, `b`'s text would change too, out of nowhere. Because no String can ever change, any number of variables can share one with no risk. The price is that "changing" a string really means making a new one and moving your variable to it, which is why you must keep the result.

**Common methods** (indices start at 0, as with arrays):

|Method|Returns|Example on `"ABC 41"`|
|---|---|---|
|`length()`|Number of characters|`6`|
|`charAt(i)`|Character at index `i`|`charAt(2)` → `'C'`|
|`concat(s)`|This string + `s`|`concat("564")` → `"ABC 41564"`|
|`replace(old, new)`|Every `old` char replaced|`replace('4', '0')` → `"ABC 01"`|
|`substring(i)`|From `i` to the end|`substring(1)` → `"BC 41"`|
|`substring(i, j)`|From `i` up to **but not including** `j`|`substring(1, 2)` → `"B"`|
|`toUpperCase()` / `toLowerCase()`|Case-changed copy|`"abc"` → `"ABC"`|
|`equals(s)`|`true` if same characters|—|
|`equalsIgnoreCase(s)`|Same, ignoring case|—|
|`compareTo(s)`|`< 0`, `0`, or `> 0` (alphabetical order)|—|

`substring(i, j)` excludes `j` on purpose. That way the length of the result is just `j - i`, and `substring(0, k)` plus `substring(k)` glue back together into the original with no overlap.

> [!note] `length()` has parentheses for Strings because it's a **method** (the String works it out). For arrays it's `length` with no parentheses because it's a **field**, a stored value. They do the same job but come from different kinds of thing.

Asking for an index past the end, like `substring(1, 8)` on a 6-character string, throws a `StringIndexOutOfBoundsException`.

### Comparing values

What "equal" means depends on what you're comparing:

|Type|How to compare|Why|
|---|---|---|
|`int`, `long`, `char`|`==`|Whole numbers are stored exactly|
|`float`, `double`|`Math.abs(a - b) < TOLERANCE`|Decimals are only stored approximately, so `0.1 + 0.2 == 0.3` is `false`|
|`char`|`==`, `<`, `>`|Compares Unicode numbers: `'0' < 'L'` is `true`|
|`String` / objects|`.equals()`|`==` compares addresses, not contents|

**Why decimals need a tolerance.** As [[ch02-classes-and-objects|Ch 2]] explained, 0.1 has no exact binary form, so it's stored as the closest value that fits. Add two of those approximations and the tiny errors add up: `0.1 + 0.2` comes out as `0.30000000000000004`. It's not equal to the stored 0.3, even though mathematically it should be. So instead of asking "are these exactly equal?", ask "are they close enough that the difference is just rounding error?":

```java
final double TOLERANCE = 0.00000001;
if (Math.abs(a - b) < TOLERANCE) { /* treat as equal */ }
```

### `==` vs `equals()`

For references, `==` compares what's actually in the two variables, which is two **addresses**. So it asks **"are these the same object?"**, not "do these hold the same data?".

```java
String name1 = new String("Lewis");
String name2 = new String("Lewis");
name1 == name2        // false: two separate objects
name1.equals(name2)   // true: same characters
```

Think of two printed copies of the same book. They have identical contents (`equals` is true), but they're two different physical books (`==` is false). `equals` is a method the class provides to compare **contents**, and `String`'s version compares the characters one by one.

> [!warning] Two identical literals (`"Lewis" == "Lewis"`) often come out `true`, but only because the String pool made them the same object. Strings built while the program runs (from input, or by joining) won't be pooled. Code that relies on `==` for Strings works in testing and then fails on real input. **Always use `.equals()` for Strings.**

### Comparing your own objects

For a class you wrote, Java has no idea what "same contents" should mean. Should two cars be equal if their plates match? If their speeds match too? So by default `equals()` falls back to the only thing it can check, the address, and acts just like `==`:

```java
Car miniVan = new Car("ABC", 50, 100);
Car sedan = new Car("ABC", 50, 100);
sedan == miniVan          // false: different objects
sedan.equals(miniVan)     // STILL false: default equals is ==
```

To compare contents, compare the fields that matter (later you'll write your own `equals` method that does this):

```java
sedan.licensePlate.equals(miniVan.licensePlate)
    && sedan.speed == miniVan.speed
    && sedan.maxSpeed == miniVan.maxSpeed     // true
```

> [!tip] *You* decide what makes two objects equal, based on what the class represents. For cars, matching licence plates might be enough, since a plate identifies one real car, even if the speeds differ at the moment.

### Parameter passing

When you call a method, Java **copies whatever is in each argument variable** into the matching parameter. Always. That one rule (called **pass by value**) explains everything; what changes is *what* is in the variable:

|Argument type|What's in the variable, and so what gets copied|Can the method change the caller's data?|
|---|---|---|
|Primitive (`int`, `double`, …)|The value itself|**No**: the method gets its own copy of the number|
|Object / array|The **reference** (address)|**Yes**: both copies of the address lead to the same object|

```java
void changeMe(double d) { d = 345.0; }     // changes only the local copy

double d = 2.0;
changeMe(d);
System.out.println(d);                     // 2.0
```

The method's `d` is a separate box that started with a copy of 2.0. Changing it does nothing to the caller's box.

```java
void changeParameters(Car c) { c.speed = 30; }   // follows the reference

Car miniVan = new Car("ABC", 50, 100);
changeParameters(miniVan);
System.out.println(miniVan.speed);               // 30.0
```

Here the copied value is an address. `c` and `miniVan` are two boxes holding the same address, like two copies of a house key. Whoever uses their key and rearranges the furniture changes the one house both keys open.

> [!warning] Reassigning the parameter itself (`c = new Car(...)`) inside the method **doesn't** affect the caller. That just puts a different address into the method's own box, like swapping your copy of the key for one to a different house. The caller's key, and their house, are untouched. The caller only sees changes made *through* the reference (`c.speed = ...`).

![[coe-318-parameter-passing.svg]]
*Figure 4.1: A primitive argument is copied by value. A reference argument copies the address, so both variables reach the same object.*

### Linking objects

A field can hold a reference to **another object**, and that **links** the two. This is how objects find each other: an object doesn't search for the others it needs, it keeps their addresses. A reference can also be `null`, meaning "linked to nothing".

```java
class Employee {
    String name;
    Employee supervisor;    // a reference to another Employee

    Employee(String name, Employee supervisor) {
        this.name = name;
        this.supervisor = supervisor;
    }
}

Employee ceo = new Employee("Stacey", null);   // no supervisor
Employee emp = new Employee("Gavin", ceo);     // linked to Stacey

if (emp.supervisor == null)
    System.out.println(emp.name + " is the CEO!");
else
    System.out.println("The supervisor of " + emp.name + " is " + emp.supervisor.name);
// The supervisor of Gavin is Stacey
```

`emp.supervisor.name` follows two links: from `emp` to Stacey's object, then to her `name`. Each dot means "go to the object this refers to". Note that `supervisor` has type `Employee`, the same class it's in. A class can refer to its own kind, which is how chains and hierarchies (an org chart, a family tree) get built. The `null` check matters: the chain has to end somewhere, and following a `null` link crashes the program.

![[coe-318-linked-employees.svg]]
*Figure 4.2: Two Employee objects linked through the supervisor field. Stacey's own supervisor is null.*

### Designing from a description

Turning a paragraph of requirements into classes is the design phase from [[ch01-software-development-and-oop|Ch 1]]. A reliable starting point is to read the description for its grammar:

1. **Nouns become classes** (Book, Member, Library). They're the things the problem is about.
2. **Their properties become fields** (title, author, ISBN). That's what each thing needs to remember.
3. **"Has many" becomes an array or list field** (a Member *has* borrowed books). That's a link to several objects at once.
4. **Verbs become methods** (borrow, add, register). That's what the things do, and each method goes in the class whose data it mainly changes.
5. Write a **tester class** that plays out the scenario in the description, to check the design can actually do what's asked.

This works because OOP is built to mirror the problem ([[ch01-software-development-and-oop|Ch 1]]). If the description is about members borrowing books from a library, the code should have members, books and a library, doing borrowing.

## Key syntax

**Comparisons**

```java
s1.equals(s2)                       // String contents
Math.abs(a - b) < TOLERANCE         // floating-point
obj1 == obj2                        // same object?
```

**Substring range**

$$
\texttt{s.substring(i, j)} \text{ has length } j - i
$$

- $i$: first index included
- $j$: first index **excluded**

## Examples

### Example 1: String methods

> Lecture 4, String slides

Given `String licensePlate = new String("ABC 41");`, what is each value?

```java
char a = licensePlate.charAt(2);
String extendedPlate = licensePlate.concat("564");
int b = licensePlate.length();
String newPlate = extendedPlate.replace('4', '0');
String sub1 = licensePlate.substring(1);
String sub2 = licensePlate.substring(1, 2);
String sub3 = licensePlate.substring(1, 8);
```

Indices: `A`=0, `B`=1, `C`=2, space=3, `4`=4, `1`=5.

1. `a` = `'C'`
2. `extendedPlate` = `"ABC 41564"` (`licensePlate` itself is unchanged)
3. `b` = `6` (the space counts)
4. `newPlate` = `"ABC 01560"`: **every** `'4'` in `"ABC 41564"` is replaced
5. `sub1` = `"BC 41"`
6. `sub2` = `"B"` (index 1 only; length $2 - 1 = 1$)
7. `sub3` throws `StringIndexOutOfBoundsException`: index 8 is past the end of a 6-character string

### Example 2: Pass by value vs reference

> Lecture 4, parameter passing

What does this print?

```java
public static void main(String[] args) {
    int n = 5;
    Car car = new Car("XYZ", 50, 100);
    update(n, car);
    System.out.println(n + " " + car.speed);
}
static void update(int n, Car c) {
    n = 99;
    c.speed = 80;
    c = new Car("NEW", 0, 0);
    c.speed = 10;
}
```

1. `n = 99` only changes the method's own copy, so the caller's `n` stays `5`.
2. `c.speed = 80` follows the reference to the caller's car, so its speed is now `80`.
3. `c = new Car(...)` points the **local** `c` at a new object. The caller's `car` isn't touched.
4. `c.speed = 10` changes the new object, which becomes garbage once the method returns.

![[coe-318-ex-pass-by-reference.svg]]
*Figure 4.3: Memory just before update returns. Only the first car was changed through the caller's reference, and the NEW car is lost afterwards.*

Prints `5 80.0`.

### Example 3: Tracing an array of linked objects

> Lecture 4, challenging quiz (Act 1)

```java
class Coord {
    int x, y;
    public Coord(int x, int y) { this.x = x; this.y = y; }
}

Coord[] original, alias;
original = new Coord[6];
int i = 0;
while (i < original.length) {
    original[i] = new Coord(i, original.length - i);
    i++;
}
i = 0;
while (i < original.length) {
    original[i] = original[i + 1];
    i += 2;
}
alias = original;
alias[3].y = alias[0].x;
System.out.println(original[0].x + "," + original[0].y);
System.out.println(alias[3].x + "," + alias[3].y);
```

1. **First loop** creates six objects, $(i,\ 6 - i)$:

   |Index|0|1|2|3|4|5|
   |---|---|---|---|---|---|---|
   |Object|(0,6)|(1,5)|(2,4)|(3,3)|(4,2)|(5,1)|

2. **Second loop** runs for $i = 0, 2, 4$, copying each odd slot's reference into the even slot before it:

   |Index|0|1|2|3|4|5|
   |---|---|---|---|---|---|---|
   |Object|(1,5)|(1,5)|(3,3)|(3,3)|(5,1)|(5,1)|

   Slots 0/1, 2/3 and 4/5 now share objects, and the original (0,6), (2,4), (4,2) objects are garbage.
3. `alias = original` → same array, two names
4. `alias[3].y = alias[0].x` → the (3,3) object's `y` becomes `1`, so it's now (3,1). `original[2]` sees the change too.

![[coe-318-ex-coord-array.svg]]
*Figure 4.4: Final state. Slots 0/1, 2/3 and 4/5 share objects, the shared (3,3) object became (3,1), and the three original objects are unreachable garbage.*

```
1,5
3,1
```

### Example 4: Design an `Airport` class from its output

> Lecture 4, design question

Write the `Airport` class so this `main` gives the output below.

```java
Airport quizairport = new Airport(5);          // 5 gates
for (int i = 0; i < 5; i++)
    quizairport.addPassengers(i, (20 * i + 3)); // (gate index, passengers)
quizairport.printPassengers();
```

```
Number of passengers at Gate 1 is 3
Number of passengers at Gate 2 is 23
...
Number of passengers at Gate 5 is 83
```

1. **Fields:** one passenger count per gate, so an `int` array sized by the constructor
2. **`addPassengers(gate, n)`:** store `n` at index `gate`
3. **`printPassengers()`:** loop over the array. Gates are indexed from 0 but printed from 1, so print `i + 1`.

```java
public class Airport {
    private int[] passengers;

    public Airport(int numGates) {
        passengers = new int[numGates];
    }

    public void addPassengers(int gate, int count) {
        passengers[gate] = passengers[gate] + count;
    }

    public void printPassengers() {
        for (int i = 0; i < passengers.length; i++)
            System.out.println("Number of passengers at Gate " + (i + 1)
                               + " is " + passengers[i]);
    }
}
```

### Example 5: Library system design

> Lecture 4, design case study

A Book has a title, author and ISBN. A Member has a name and can borrow multiple books. A Library manages its books and members. John borrows *Anne of Green Gables*.

1. **Classes from the nouns:** `Book`, `Member`, `Library`
2. **Fields:** Book has `title`, `author`, `isbn`. Member has `name` plus an array of borrowed `Book`s. Library has arrays of `Book`s and `Member`s.
3. **Methods from the verbs:** `Member.borrow(Book)`, `Library.addBook(Book)`, `Library.addMember(Member)`

```java
public class Book {
    private String title, author, isbn;
    public Book(String title, String author, String isbn) {
        this.title = title; this.author = author; this.isbn = isbn;
    }
    public String getTitle() { return title; }
}

public class Member {
    private String name;
    private Book[] borrowed = new Book[10];
    private int count = 0;

    public Member(String name) { this.name = name; }

    public void borrow(Book b) {
        borrowed[count] = b;   // stores a REFERENCE: no copy of the book is made
        count++;
    }
    public String getName() { return name; }
}

public class Library {
    private Book[] books = new Book[100];
    private Member[] members = new Member[100];
    private int numBooks = 0, numMembers = 0;

    public void addBook(Book b) { books[numBooks++] = b; }
    public void addMember(Member m) { members[numMembers++] = m; }
}

public class LibraryTest {
    public static void main(String[] args) {
        Library lib = new Library();
        Book anne = new Book("Anne of Green Gables", "L. M. Montgomery", "978-0");
        Member john = new Member("John");
        lib.addBook(anne);
        lib.addMember(john);
        john.borrow(anne);
    }
}
```

> [!note] After `john.borrow(anne)`, the library's array and John's array both refer to the **same** `Book` object. That's what linking means. There's only ever one copy of the book.

## Common mistakes

- Comparing Strings with `==` instead of `.equals()`
- Calling `s.toUpperCase();` and expecting `s` to change (Strings are immutable)
- Forgetting that `substring(i, j)` includes `i` but **excludes** `j`
- Comparing `double`s with `==`
- Expecting a method to change a primitive argument, or expecting `param = new X()` to change the caller's variable
- Following a link (`emp.supervisor.name`) when the link is `null`, which gives a `NullPointerException`
- Writing `"... " + emp.name " is ..."` with a missing `+` between pieces, which won't compile
