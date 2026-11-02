---
title: "1. Electrostatics Review"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **22.4, 24.1, 24.2, 24.4, 25.1, 25.2** · week 1

Every device in this course works by pushing charge around with electric fields. Before we get to diodes and transistors, I want the electrostatics to feel easy, because everything later is built on it.

Four ideas cover almost the whole chapter:

1. A charge $q$ in an electric field $\vec{E}$ feels a force $\vec{F} = q\vec{E}$.
2. Potential $V$ is **energy per unit charge**, so a charge's potential energy is $U = qV$.
3. Potential **drops** as you move along the field and **rises** as you move against it. The field is how steep that drop is: $E = -dV/dx$.
4. If the electric force is the only thing acting, then $\Delta K + \Delta U = 0$. Almost every problem here is just this equation.

> [!note] Why start here
> A chip is a huge number of diodes, transistors, resistors and capacitors built on one piece of semiconductor. A diode is a region with a built-in electric field. A MOSFET is a capacitor whose field switches a channel on and off. If you can read a field and a potential, you can read a device.

## Notes

### Electric fields and forces

A charged object changes the space around it. We call that change an **electric field** $\vec{E}$. Any other charge placed in the field feels a force:

$$
\vec{F} = q\vec{E} \tag{1.1}
$$

- If $q > 0$, the force points the **same way** as $\vec{E}$.
- If $q < 0$, the force points the **opposite way**.
- $\vec{E}$ points **away** from positive charge and **toward** negative charge.
- The field in (1.1) comes from *other* charges, never from the charge $q$ that feels the force.
- Fields from several sources **add as vectors**.

**A large charged plate.** If you're close to a big flat plate (the distance is much smaller than the plate's size), the field is the same everywhere. A diode's depletion region looks like this, so we'll use it a lot. It's easiest to describe the plate by its charge per area, $\sigma = Q/A$:

$$
E = \frac{\sigma}{2\varepsilon_0} \quad \text{(one plate)} \tag{1.2}
$$

Put a $+Q$ plate and a $-Q$ plate facing each other. Their fields add in the gap and cancel outside:

$$
E = \frac{\sigma}{\varepsilon_0} = \frac{Q}{\varepsilon_0 A} \quad \text{(between the plates)}, \qquad E = 0 \quad \text{(outside)} \tag{1.3}
$$

Between the plates the field points from $+$ to $-$ and is the same size everywhere in the gap.

![[pcs-224-charged-plates.svg]]
*Figure 1.1: The field of one large plate points away from it on both sides. Two opposite plates add inside the gap and cancel outside.*

> [!tip] Why the fields add in the gap: the $+$ plate pushes a positive test charge away, and the $-$ plate pulls it in. Both push the same way, so they add. Outside the plates they push opposite ways and cancel.

### Potential energy and potential

The electric force is **conservative**. That means the work it does is stored as **potential energy** $U$, exactly like lifting a ball stores gravitational energy.

**Potential** $V$ is potential energy *per unit charge*. Think of it as the "height" of a spot in the field. It belongs to the spot, not to the charge you put there:

$$
\Delta U = q\,\Delta V \tag{1.4}
$$

If the electric force is the only force doing work, energy is conserved:

$$
\Delta K + \Delta U = 0 \tag{1.5}
$$

$K$ is kinetic energy. If $U$ goes up, $K$ goes down by the same amount, just like a ball slowing as it climbs.

**Uniform field.** Move a distance $\Delta y$ along a uniform field $E$, and the potential changes by

$$
\Delta V = V_B - V_A = -E\,\Delta y \tag{1.6}
$$

Here $\Delta y$ is **positive when you move in the direction of $\vec{E}$**. In words:

- Move **along** $\vec{E}$ and $V$ **drops**. Field lines point "downhill".
- Move **against** $\vec{E}$ and $V$ **rises**. Moving toward a positive charge raises the potential.
- Move **sideways** to $\vec{E}$ and $V$ doesn't change.

![[pcs-224-uniform-field-potential.svg]]
*Figure 1.2: Between two large, oppositely charged plates the field is uniform, and the potential falls in a straight line from the $+$ plate to the $-$ plate.*

**Getting the field from the potential.** Equation (1.6) is a special case of a more general rule:

$$
E = -\frac{dV}{dx} \tag{1.7}
$$

The field is the **steepness** of the potential. Picture a hill: a steep slope means a strong field, a gentle slope means a weak one. (In 3D the derivative becomes a gradient, $\vec{E} = -\nabla V$, but in this course the field is almost always one-dimensional.)

**The electron-volt.** A joule is enormous compared to the energy of one electron, so we use a smaller unit:

$$
1\ \text{eV} = 1.602\times10^{-19}\ \text{J} \tag{1.8}
$$

One electron-volt is the energy a charge $e$ gains or loses when it moves through **1 V**. Since $\Delta U = q\Delta V$, a charge of $\pm e$ moving through $\Delta V$ volts changes its energy by exactly $\Delta V$ eV. No conversion needed.

> [!tip] I do all the energy bookkeeping in eV. A $+e$ charge that climbs a $6$ V rise gains $6$ eV of potential energy and loses $6$ eV of kinetic energy. An electron ($-e$) does the opposite: it speeds up when it moves to *higher* potential.

### Units

Every quantity in physics has a unit, and the units have to make sense. My rules:

- Both sides of an equation must have the same units.
- You can only add or subtract quantities with the same units.
- Every final answer needs a unit.
- Units multiply and cancel like ordinary algebra ($\text{s}\times\text{s} = \text{s}^2$). Checking the units of a formula you derived is the fastest way to catch a mistake.

These are the SI units we'll use all term:

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

Temperature is always in kelvin: $T(\text{K}) = T(^\circ\text{C}) + 273$. You'll also see metric prefixes constantly: $\text{n}=10^{-9}$, $\mu=10^{-6}$, $\text{m}=10^{-3}$, $\text{k}=10^{3}$. Device concentrations are usually in **cm⁻³**, so you'll be switching between m and cm a lot.

> [!warning] Semiconductor problems mix unit systems: lengths in cm, concentrations in cm⁻³, mobility in cm²/(V·s), but $B$ in tesla, which is built from **metres**. Pick one system for the whole problem and convert the odd one out first.

**How I solve every problem:**

1. Write an equation for what you want, and don't plug in numbers until the last step.
2. When you do, write the unit next to every number.
3. Check that the answer has the right units.
4. Ask whether the answer makes sense.

Those four steps catch both algebra mistakes and unit mistakes.

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

Try each one on paper before reading the solution.

### Example 1: Electron crossing a gap

Two large parallel plates are $8.0$ mm apart with a potential difference of $300$ V. An electron is released from rest at the negative plate. Find (a) the field between the plates, (b) the electron's kinetic energy at the positive plate, and (c) its speed there.

**(a) Field.** Uniform field, Eq. (1.6) in magnitude:

$$
E = \frac{\Delta V}{d} = \frac{300\ \text{V}}{8.0\times10^{-3}\ \text{m}} = 3.75\times10^4\ \text{V/m} = 375\ \text{V/cm}
$$

**(b) Energy.** An electron that moves through $300$ V changes its energy by $300$ eV. It starts from rest, so by Eq. (1.5) all of the potential energy it loses becomes kinetic:

$$
K = 300\ \text{eV} = 300(1.602\times10^{-19}) = 4.81\times10^{-17}\ \text{J}
$$

**(c) Speed.**

$$
v = \sqrt{\frac{2K}{m}} = \sqrt{\frac{2(4.81\times10^{-17})}{9.11\times10^{-31}}} = 1.03\times10^{7}\ \text{m/s}
$$

That's about 3% of the speed of light, so the non-relativistic $K = \frac{1}{2}mv^2$ is still a fine approximation.

### Example 2: Potential difference from a field

A uniform field of $E = 800$ V/cm points to the right. Point B is $0.35$ cm to the right of point A. (a) Find $V_B - V_A$. (b) Find $V_B - V_A$ if instead B is $0.35$ cm to the **left** of A.

**(a)** B is **along** the field from A, so potential falls. By Eq. (1.6):

$$
V_B - V_A = -E\,\Delta y = -(800\ \text{V/cm})(0.35\ \text{cm}) = -280\ \text{V}
$$

**(b)** Now the displacement is **against** the field, $\Delta y = -0.35$ cm:

$$
V_B - V_A = -(800)(-0.35) = +280\ \text{V}
$$

> [!note] The same distance gives equal and opposite answers. The sign just tells you whether you went with the field (downhill) or against it (uphill).

### Example 3: How far before it turns around?

A proton ($+e$) with $10$ eV of kinetic energy moves **against** a uniform field of $3.0$ V/cm. (a) What's its kinetic energy after $2.0$ cm? (b) How far does it travel before turning around?

**(a)** Moving against the field raises the potential:

$$
\Delta V = +E\,d = (3.0)(2.0) = +6.0\ \text{V} \quad\Rightarrow\quad \Delta U = q\Delta V = +6.0\ \text{eV}
$$

By Eq. (1.5), $\Delta K = -6.0$ eV, so $K = 10 - 6.0 = 4.0$ eV.

**(b)** It turns around when $K = 0$, which is when it's climbed $10$ eV, and that needs a $10$ V rise:

$$
d = \frac{10\ \text{V}}{3.0\ \text{V/cm}} = 3.3\ \text{cm}
$$

### Example 4: Reading a potential energy

A positive charge $q = +e$ has $U_A = 5$ eV and $U_B = 6$ eV near a large charged plate. (a) What is $V_B - V_A$? (b) Which point has the larger speed? (c) Which way does the field point, A to B or B to A?

**(a)** $\Delta U = q\Delta V$ with $q = +e$ means $\Delta V$ in volts equals $\Delta U$ in eV:

$$
V_B - V_A = \frac{6 - 5\ \text{eV}}{+e} = +1\ \text{V}
$$

**(b)** The charge has more potential energy at B, so by Eq. (1.5) it has less kinetic energy there, which means **A** is faster.

**(c)** $V$ is higher at B. Potential falls along $\vec{E}$, so $\vec{E}$ points **from B toward A**.

> [!tip] For a **negative** charge the sign flips. $\Delta V = \Delta U / (-e)$, so the same $U_A = 5$ eV, $U_B = 6$ eV would mean $V_B - V_A = -1$ V.

### Example 5: Units check

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
- Converting eV to joules and back when you don't have to, since $e \times (\text{volts})$ is already in eV
- Plugging in numbers early and losing the units, so a $\text{cm}$ vs $\text{m}$ slip goes unnoticed
- Mixing cm and m in one expression (especially with the tesla, which contains m²)
