---
title: "4. Using Classes and Objects"
tags:
  - coe318
---
## Overview

> [!info] Readings Lecture 4 · week 4 · Reference ch. 4, 10

Real programs have many objects that hold references to each other and pass information around. This chapter covers the built-in `String` class, how to compare values and objects correctly (`==` vs `equals`), how Java passes arguments to methods, and how to **link** objects together and design a small system from a written description.

## Notes

### The `String` class

`String` is a built-in class, so a `String` variable is a **reference**. Strings get one special shortcut: you can create them from a **literal** without `new`.

```java
String a = "ABC 41";              // literal: stored in the String pool
String b = "ABC 41";              // same literal → reuses the SAME object
String c = new String("ABC 41");  // new → always a brand-new object
```

**Strings are immutable.** Methods like `concat`, `replace`, `toUpperCase` never change the original; they **return a new String**. Keep the result or it's lost:

```java
name.toUpperCase();          // does nothing useful: result thrown away
name = name.toUpperCase();   // keeps it
```

**Common methods** (indices start at 0):

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

> [!note] `length()` has parentheses for Strings (it's a method). For arrays it's `length` with no parentheses (it's a field).

An index past the end, like `substring(1, 8)` on a 6-character string, throws `StringIndexOutOfBoundsException`.

### Comparing values

|Type|How to compare|Why|
|---|---|---|
|`int`, `long`, `char`|`==`|Exact values|
|`float`, `double`|`Math.abs(a - b) < TOLERANCE`|Decimals are stored approximately, so `0.1 + 0.2 == 0.3` is `false`|
|`char`|`==`, `<`, `>`|Compares Unicode values: `'0' < 'L'` is `true`|
|`String` / objects|`.equals()`|`==` compares references, not contents|

```java
final double TOLERANCE = 0.00000001;
if (Math.abs(a - b) < TOLERANCE) { /* treat as equal */ }
```

### `==` vs `equals()`

For references, `==` asks **"are these the same object?"** (same address), not "do they hold the same data?"

```java
String name1 = new String("Lewis");
String name2 = new String("Lewis");
name1 == name2        // false: two separate objects
name1.equals(name2)   // true: same characters
```

> [!warning] Two identical literals (`"Lewis" == "Lewis"`) often *happen* to be `true` because of the String pool. Don't rely on it. **Always use `.equals()` for Strings.**

### Comparing your own objects

For a class you wrote, `equals()` doesn't know what "equal" means yet, so by default it behaves just like `==`:

```java
Car miniVan = new Car("ABC", 50, 100);
Car sedan = new Car("ABC", 50, 100);
sedan == miniVan          // false: different objects
sedan.equals(miniVan)     // STILL false: default equals is ==
```

To compare contents, compare the fields yourself (or later, write your own `equals` method):

```java
sedan.licensePlate.equals(miniVan.licensePlate)
    && sedan.speed == miniVan.speed
    && sedan.maxSpeed == miniVan.maxSpeed     // true
```

> [!tip] Design lesson: *you* decide what makes two objects equal. Two cars might be "equal" just because their licence plates match.

### Parameter passing

Java always passes **a copy of what's in the variable**. What that copy means depends on the type:

|Argument type|What's copied|Can the method change the caller's data?|
|---|---|---|
|Primitive (`int`, `double`, …)|The value|**No**|
|Object / array|The **reference** (address)|**Yes**, by changing the object it points to|

```java
void changeMe(double d) { d = 345.0; }     // changes only the local copy

double d = 2.0;
changeMe(d);
System.out.println(d);                     // 2.0
```

```java
void changeParameters(Car c) { c.speed = 30; }   // follows the reference

Car miniVan = new Car("ABC", 50, 100);
changeParameters(miniVan);
System.out.println(miniVan.speed);               // 30.0
```

> [!warning] Reassigning the parameter itself (`c = new Car(...)`) inside the method **doesn't** affect the caller. It only redirects the local copy of the reference. Only changes *through* the reference (`c.speed = ...`) are visible outside.

### Linking objects

A field can hold a reference to **another object**, which **links** them. Any reference can also be `null`, meaning "linked to nothing".

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

`emp.supervisor.name` follows two links: from `emp` to Stacey's object, then to her `name`.

### Designing from a description

To turn a written problem into classes:

1. **Nouns become classes** (Book, Member, Library)
2. **Properties become fields** (title, author, ISBN)
3. **"Has many" becomes an array or list field** (a Member *has* borrowed books)
4. **Verbs become methods** (borrow, add, register)
5. Write a **tester class** that acts out the scenario

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

1. `n = 99` changes the method's own copy only. Caller's `n` stays `5`.
2. `c.speed = 80` follows the reference to the caller's car. Its speed is now `80`.
3. `c = new Car(...)` points the **local** `c` at a new object. The caller's `car` is untouched.
4. `c.speed = 10` changes the new object, which is garbage once the method returns.

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

   Slots 0/1, 2/3 and 4/5 now share objects. The original (0,6), (2,4), (4,2) objects are garbage.
3. `alias = original` → same array, two names
4. `alias[3].y = alias[0].x` → the (3,3) object's `y` becomes `1`, so it's now (3,1). `original[2]` sees this too.

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

1. **Fields:** one passenger count per gate → an `int` array, sized by the constructor
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

1. **Classes from nouns:** `Book`, `Member`, `Library`
2. **Fields:** Book → `title`, `author`, `isbn`. Member → `name`, plus an array of borrowed `Book`s. Library → arrays of `Book`s and `Member`s.
3. **Methods from verbs:** `Member.borrow(Book)`, `Library.addBook(Book)`, `Library.addMember(Member)`

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

> [!note] After `john.borrow(anne)`, the library's array and John's array both refer to the **same** `Book` object. That's what linking means: there's only ever one copy of the book.

## Common mistakes

- Comparing Strings with `==` instead of `.equals()`
- Calling `s.toUpperCase();` and expecting `s` to change (Strings are immutable)
- `substring(i, j)` includes `i` but **excludes** `j`
- Comparing `double`s with `==`
- Expecting a method to change a primitive argument, or expecting `param = new X()` to change the caller's variable
- Following a link (`emp.supervisor.name`) when the link is `null`, causing a `NullPointerException`
- Writing `"... " + emp.name " is ..."`: a missing `+` between pieces won't compile
