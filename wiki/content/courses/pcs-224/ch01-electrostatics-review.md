---
title: "1. Electrostatics Review"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **22.4, 24.1, 24.2, 24.4, 25.1, 25.2** · week 1

Every semiconductor device in this course, from the p-n junction to the MOSFET, works by **moving charge through electric fields and potential differences**. This chapter is a quick refresher of the electrostatics you'll need, plus the habits (units, dimensional analysis, problem-solving order) that the rest of the course leans on.

The whole chapter comes down to four ideas:

1. A charge $q$ in a field $\vec{E}$ feels a force $\vec{F} = q\vec{E}$.
2. Potential $V$ is **energy per unit charge**, so a charge's potential energy is $U = qV$.
3. Potential **falls along the field** and rises against it, and $E$ is the (negative) slope of $V$.
4. With only the electric force acting, $\Delta K + \Delta U = 0$. Almost every problem here is this one equation.

> [!note] Why a course on semiconductors starts here
> An integrated circuit is just a very large number of transistors, diodes, resistors and capacitors made out of one piece of semiconductor. A diode is a region where there's a built-in electric field. A MOSFET is a capacitor whose electric field switches a channel on and off. If you can read a field and a potential, you can read a device.

## Notes

### Electric fields and forces

Charged objects distort the space around them. We say they create an **electric field** $\vec{E}$. Any other charge that sits in that field feels a force.

$$
\vec{F} = q\vec{E} \tag{1.1}
$$

- If $q > 0$, $\vec{F}$ points the **same way** as $\vec{E}$.
- If $q < 0$, $\vec{F}$ points the **opposite way**.
- $\vec{E}$ points **away** from positive charge and **toward** negative charge.
- In Eq. (1.1), $\vec{E}$ is made by *other* (source) charges, never by the test charge $q$ itself.
- Fields from several sources **add as vectors**.

**Field of a large charged plate.** Far from its edges (the distance to the plate $d$ is much smaller than its size), a flat sheet of charge makes a **uniform** field. In a diode, the depletion region is exactly this kind of geometry. It's easier to describe the sheet with its charge per area, $\sigma = Q/A$:

$$
E = \frac{\sigma}{2\varepsilon_0} \quad \text{(one sheet)} \tag{1.2}
$$

Two large plates carrying $+Q$ and $-Q$ add inside the gap and cancel outside:

$$
E = \frac{\sigma}{\varepsilon_0} = \frac{Q}{\varepsilon_0 A} \quad \text{(between the plates)}, \qquad E = 0 \quad \text{(outside)} \tag{1.3}
$$

Between the plates the field points from the $+$ plate to the $-$ plate and has the same value everywhere in the gap.

> [!tip] A quick check on direction: at a point between the plates, the $+$ plate pushes a positive test charge away from itself and the $-$ plate pulls it in, so both contributions point the same way. That's why they add in the gap instead of cancelling.

### Electric potential energy and electric potential

The electric force is **conservative**, so work done by it is stored as **electric potential energy** $U$, just like gravity. The **potential** $V$ is the potential energy *per unit charge*. It belongs to the point in space, not to any particular charge you put there:

$$
\Delta U = q\,\Delta V \tag{1.4}
$$

Energy conservation for a charge that only feels the electric force:

$$
\Delta K + \Delta U = 0 \tag{1.5}
$$

Here $\Delta K$ is the change in kinetic energy. If $U$ goes up, $K$ goes down by the same amount.

**Uniform field.** For a charge that moves a distance $\Delta y$ along a uniform field $E$, the potential changes by

$$
\Delta V = V_B - V_A = -E\,\Delta y \tag{1.6}
$$

where $\Delta y$ is **positive when you move in the direction of $\vec{E}$**. So:

- Moving **along** $\vec{E}$: $V$ **decreases**. Field lines point "downhill".
- Moving **against** $\vec{E}$: $V$ **increases**. Moving toward a positive charge raises the potential.
- Moving **perpendicular** to $\vec{E}$: $V$ doesn't change.

![[pcs-224-uniform-field-potential.svg]]
*Figure 1.1: Between two large oppositely charged plates the field is uniform and the potential falls linearly from the $+$ plate to the $-$ plate.*

**Field from potential.** Eq. (1.6) is a special case of the general relation between the two:

$$
E = -\frac{dV}{dx} \tag{1.7}
$$

$E$ measures how **steep** the potential is: a strong field is a steep slope on the potential "map", and a weak field is a gentle slope. $V$ is a number but $E$ is a vector, which is why in 3D the derivative becomes a gradient, $\vec{E} = -\nabla V$. In this course the field is almost always one-dimensional, so Eq. (1.7) is enough.

**The electron-volt.** The joule is huge compared to the energy of one electron, so we use

$$
1\ \text{eV} = 1.602\times10^{-19}\ \text{J} \tag{1.8}
$$

One electron-volt is the energy a charge $e$ gains or loses moving through a potential difference of **1 V**. Because $\Delta U = q\Delta V$, a charge $\pm e$ moving through $\Delta V$ volts changes its energy by exactly $\Delta V$ electron-volts. No conversion needed.

> [!tip] Energy accounting in eV is the fastest way through every problem in this chapter. A $+e$ charge that climbs a $+6$ V potential rise gains $+6$ eV of potential energy and loses $6$ eV of kinetic energy. An electron ($-e$) does the opposite: it gains $K$ when it moves to *higher* potential.

### Working with units

Physics deals with real quantities, not pure numbers, so every quantity has a unit and the units have to make sense. These are the rules the course expects you to follow:

- The dimensions on both sides of an equation must match.
- You can only add or subtract quantities with the same dimensions.
- Every final answer needs units.
- Units follow ordinary algebra ($\text{s}\times\text{s} = \text{s}^2$), so checking the units of a formula you derived catches algebra mistakes.

The SI units you'll use all term:

| Quantity | Symbol | Unit |
| --- | --- | --- |
| Force | $F$ | N = kg·m/s² |
| Energy | $U$, $K$ | J = N·m = kg·m²/s² |
| Charge | $q$ | C |
| Electric field | $E$ | N/C = V/m |
| Potential | $V$ | V = J/C |
| Current | $I$ | A = C/s |
| Magnetic field | $B$ | T = V·s/m² |
| Capacitance | $C$ | F = C/V |

The only temperature unit in this course is the kelvin, $T(\text{K}) = T(^\circ\text{C}) + 273$. Metric prefixes ($\text{n}=10^{-9}$, $\mu=10^{-6}$, $\text{m}=10^{-3}$, $\text{k}=10^{3}$) show up constantly. Carriers per **cm³** are the usual unit for concentration in devices, so you'll be converting between m and cm a lot.

> [!warning] Semiconductor problems mix SI and "device" units: lengths in cm, concentrations in cm⁻³, mobility in cm²/(V·s), but $B$ in tesla (which is built from **metres**). Pick one system for the whole calculation and convert the odd one out first.

**Problem-solving order** that the course asks for:

1. Get an equation for the quantity you want. Don't plug in numbers until the last step.
2. When you do, write the units next to every number.
3. Check that the units of your answer are right.
4. Ask whether the answer is reasonable.

These four steps catch both algebra and unit-conversion errors.

## Key formulas

**Force on a charge**

$$
\vec{F} = q\vec{E} \tag{1.1}
$$

- $q$: charge (C); $\vec{E}$: field (V/m or N/C)

**Field of large plates**

$$
E = \frac{\sigma}{2\varepsilon_0} \ \text{(one sheet)}, \qquad E = \frac{\sigma}{\varepsilon_0} = \frac{Q}{\varepsilon_0 A} \ \text{(between two)} \tag{1.2, 1.3}
$$

- $\sigma = Q/A$: charge per unit area (C/m²)
- $\varepsilon_0 = 8.85\times10^{-12}$ F/m: permittivity of free space

**Potential energy and energy conservation**

$$
\Delta U = q\,\Delta V, \qquad \Delta K + \Delta U = 0 \tag{1.4, 1.5}
$$

**Uniform field and the slope relation**

$$
\Delta V = -E\,\Delta y, \qquad E = -\frac{dV}{dx} \tag{1.6, 1.7}
$$

- $\Delta y$: displacement **along** $\vec{E}$ (positive in the direction of the field)

**The electron-volt**

$$
1\ \text{eV} = 1.602\times10^{-19}\ \text{J} \tag{1.8}
$$

## Examples

These follow the style of the lecture's clicker questions, with different numbers.

### Example 1: Electron crossing a gap

> Like the plate/KE clicker questions

Two large parallel plates are $8.0$ mm apart with a potential difference of $300$ V. An electron is released from rest at the negative plate. Find (a) the field between the plates, (b) the electron's kinetic energy at the positive plate, and (c) its speed there.

**(a) Field.** Uniform field, Eq. (1.6) in magnitude:

$$
E = \frac{\Delta V}{d} = \frac{300\ \text{V}}{8.0\times10^{-3}\ \text{m}} = 3.75\times10^4\ \text{V/m} = 375\ \text{V/cm}
$$

**(b) Energy.** An electron that moves through $300$ V changes its energy by $300$ eV. It starts from rest, so by Eq. (1.5) all of the lost potential energy becomes kinetic:

$$
K = 300\ \text{eV} = 300(1.602\times10^{-19}) = 4.81\times10^{-17}\ \text{J}
$$

**(c) Speed.**

$$
v = \sqrt{\frac{2K}{m}} = \sqrt{\frac{2(4.81\times10^{-17})}{9.11\times10^{-31}}} = 1.03\times10^{7}\ \text{m/s}
$$

That's about 3% of the speed of light, so the non-relativistic $K = \frac{1}{2}mv^2$ is still a fine approximation.

### Example 2: Potential difference from a field

> Like the "$E = 1000$ V/cm, A to B" questions

A uniform field of $E = 800$ V/cm points to the right. Point B is $0.35$ cm to the right of point A. (a) Find $V_B - V_A$. (b) Find $V_B - V_A$ if instead B is $0.35$ cm to the **left** of A.

**(a)** B is **along** the field from A, so potential falls. By Eq. (1.6):

$$
V_B - V_A = -E\,\Delta y = -(800\ \text{V/cm})(0.35\ \text{cm}) = -280\ \text{V}
$$

**(b)** Now the displacement is **against** the field, $\Delta y = -0.35$ cm:

$$
V_B - V_A = -(800)(-0.35) = +280\ \text{V}
$$

> [!note] The same distance gives equal and opposite answers. The sign only encodes whether you walked with the field (downhill) or against it (uphill).

### Example 3: How far before it turns around?

> Like the "KE 12 eV / 4 eV, how far?" clicker questions

A proton ($+e$) with $10$ eV of kinetic energy moves **against** a uniform field of $3.0$ V/cm. (a) What's its kinetic energy after $2.0$ cm? (b) How far does it travel before turning around?

**(a)** Moving against the field raises the potential:

$$
\Delta V = +E\,d = (3.0)(2.0) = +6.0\ \text{V} \quad\Rightarrow\quad \Delta U = q\Delta V = +6.0\ \text{eV}
$$

By Eq. (1.5), $\Delta K = -6.0$ eV, so $K = 10 - 6.0 = 4.0$ eV.

**(b)** It turns around when $K = 0$, i.e. when it has climbed $10$ eV, which needs a $10$ V rise:

$$
d = \frac{10\ \text{V}}{3.0\ \text{V/cm}} = 3.3\ \text{cm}
$$

### Example 4: Reading a potential energy

> Like the "$U$ = 5 eV at A, 6 eV at B" clicker questions

A positive charge $q = +e$ has $U_A = 5$ eV and $U_B = 6$ eV near a large charged plate. (a) What is $V_B - V_A$? (b) Which point has the larger speed? (c) Which way does the field point, A to B or B to A?

**(a)** $\Delta U = q\Delta V$ with $q = +e$ means $\Delta V$ in volts equals $\Delta U$ in eV:

$$
V_B - V_A = \frac{6 - 5\ \text{eV}}{+e} = +1\ \text{V}
$$

**(b)** The charge has more potential energy at B, so by Eq. (1.5) it has less kinetic energy there. **A** is faster.

**(c)** $V$ is higher at B. Potential falls along $\vec{E}$, so $\vec{E}$ points **from B toward A**.

> [!tip] For a **negative** charge the sign flips: $\Delta V = \Delta U / (-e)$, so the same $U_A = 5$ eV, $U_B = 6$ eV would mean $V_B - V_A = -1$ V.

### Example 5: Units check

> Like the "magnetic field in T" exercise

Show that the tesla can be written as V·s/m².

The magnetic force is $F = qvB$, so $B = \dfrac{F}{qv}$. In units:

$$
[B] = \frac{\text{N}}{\text{C}\cdot\text{m/s}} = \frac{\text{N}\cdot\text{s}}{\text{C}\cdot\text{m}}
$$

Use $\text{N} = \text{J/m}$ and $\text{J/C} = \text{V}$:

$$
[B] = \frac{(\text{J/m})\,\text{s}}{\text{C}\cdot\text{m}} = \frac{\text{J}}{\text{C}}\cdot\frac{\text{s}}{\text{m}^2} = \frac{\text{V}\cdot\text{s}}{\text{m}^2}\ \checkmark
$$

You'll use this form of the tesla in the Hall effect, where the voltage is $V_H = v_d B W$ and the units have to come out in volts.

## Common mistakes

- Mixing up the sign of $\Delta y$ in Eq. (1.6). Positive means *along* $\vec{E}$, and then $V$ **drops**
- Forgetting that a negative charge flips both the force direction and the sign of $\Delta U$ for a given $\Delta V$
- Using $E = \sigma/\varepsilon_0$ for a *single* sheet (it's $\sigma/2\varepsilon_0$), or $\sigma/2\varepsilon_0$ between two plates
- Converting eV to joules and back when you don't have to: $e \times (\text{volts})$ is already in eV
- Plugging in numbers early and losing the units, so a $\text{cm}$ vs $\text{m}$ slip goes unnoticed
- Mixing cm and m in one expression (especially with the tesla, which contains m²)
