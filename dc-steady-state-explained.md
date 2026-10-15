# Why $i_C = 0$ and $v_L = 0$ in DC steady state

Detailed explanation of the "DC steady state" section of the ELE 302 *Capacitors and Inductors* concept page.

## 1. The two defining laws

$$
i_C = C\,\frac{dv_C}{dt}, \qquad v_L = L\,\frac{di_L}{dt}
$$

Read these literally. They say:

- The **current** through a capacitor is proportional to how fast its **voltage** is changing.
- The **voltage** across an inductor is proportional to how fast its **current** is changing.

Neither element cares about the *size* of its voltage or current, only the *rate of change*. That is the whole story; everything below follows from it.

## 2. What "DC steady state" means

A circuit is in DC steady state when:

1. All sources are constant (DC), and
2. The circuit has been connected long enough that every transient has died out.

After that point every voltage and current in the circuit is a constant number, so every derivative is zero:

$$
\frac{dv_C}{dt} = 0, \qquad \frac{di_L}{dt} = 0
$$

Why do transients die out? In an RC or RL circuit the response has the form $e^{-t/\tau}$ (with $\tau = RC$ or $L/R$). After roughly $5\tau$ the exponential is under 1% of its starting value, and as $t \to \infty$ it is exactly zero. What's left is the constant final value.

## 3. Plug zero into the laws

**Capacitor**

$$
i_C = C \cdot 0 = 0
$$

Zero current for any voltage across it is the definition of an **open circuit**. So in DC steady state, replace every capacitor with an open circuit.

**Inductor**

$$
v_L = L \cdot 0 = 0
$$

Zero voltage for any current through it is the definition of a **short circuit**. So in DC steady state, replace every inductor with a wire.

## 4. The physical picture

### Capacitor: current is charge moving onto the plates

A capacitor stores charge $q = Cv_C$ on two plates separated by an insulator. No charge crosses the gap. The "current through" a capacitor is really charge piling onto one plate and leaving the other:

$$
i_C = \frac{dq}{dt} = C\frac{dv_C}{dt}
$$

- While the voltage is rising, charge is still arriving, so there is current.
- Once the voltage reaches its final value, no more charge needs to be added, so the current stops.

The capacitor is now a charged, idle component: it holds voltage $v_C$ but passes nothing.

### Inductor: voltage is the "pushback" against a change in current

An inductor stores energy in the magnetic field produced by its current. When the current tries to change, the field changes, and by Faraday's law that induces a voltage opposing the change:

$$
v_L = L\frac{di_L}{dt}
$$

- While the current is ramping up or down, there is a voltage across the coil.
- Once the current is steady, the field is steady, nothing is induced, and the voltage drops to zero.

An ideal inductor is then just a piece of wire (zero resistance) carrying a constant current $i_L$.

### Side by side

| | Capacitor | Inductor |
|---|---|---|
| Stores energy as | Electric field, $\tfrac12 Cv_C^2$ | Magnetic field, $\tfrac12 Li_L^2$ |
| Variable that holds its value | $v_C$ | $i_L$ |
| Variable that goes to zero in DC | $i_C$ | $v_L$ |
| Behaves like | Open circuit | Short circuit |
| Needs a change to "do" anything | Changing voltage | Changing current |

## 5. Important distinction: what is *not* zero

In steady state the capacitor still has a voltage and the inductor still has a current. Those are the quantities that were **continuous** across the switching instant (they can't jump), and they settle to whatever the surrounding resistive circuit forces.

- $i_C = 0$ does **not** mean $v_C = 0$. A charged capacitor in DC steady state can hold, say, 5 V.
- $v_L = 0$ does **not** mean $i_L = 0$. An inductor in DC steady state can carry, say, 2 A.

## 6. Worked example: RC and RL

### RC charging

12 V source, $R = 1\,\text{k}\Omega$, $C = 10\,\mu\text{F}$, series. Switch closes at $t = 0$ with $C$ uncharged.

- At $t = 0^+$: $v_C = 0$, so the capacitor acts like a **short**. $i = 12/1000 = 12\,\text{mA}$. Here $i_C$ is large and non-zero.
- As $t \to \infty$: $i_C = 0$ (open circuit), so no drop across $R$, so $v_C = 12\,\text{V}$.

The current went from 12 mA to 0 while the voltage went from 0 to 12 V.

### RL energising

12 V source, $R = 100\,\Omega$, $L = 50\,\text{mH}$, series. Switch closes at $t = 0$ with no initial current.

- At $t = 0^+$: $i_L = 0$, so the inductor acts like an **open**. The full 12 V appears across $L$, so $v_L = 12\,\text{V}$.
- As $t \to \infty$: $v_L = 0$ (short), so $i_L = 12/100 = 120\,\text{mA}$.

The voltage across the inductor went from 12 V to 0 while the current went from 0 to 120 mA.

## 7. How to use this in problems (Ch 8 recipe)

**Initial values (just before switching, $t = 0^-$):**
Circuit was in DC steady state, so C = open, L = short. Solve for $v_C(0^-)$ and $i_L(0^-)$.

**Continuity at $t = 0$:**
$v_C(0^+) = v_C(0^-)$ and $i_L(0^+) = i_L(0^-)$.

**Final values ($t \to \infty$):**
After switching, wait for steady state again. C = open, L = short. Solve the resistive circuit for $v_C(\infty)$ and $i_L(\infty)$.

## 8. Two common mistakes

1. **Applying the open/short rule at $t = 0^+$.** The open/short substitution is valid only once everything has stopped changing. Right after a switch, the capacitor's voltage and inductor's current are held by continuity, not by the DC rule.
2. **Applying it with AC sources.** With a sinusoidal source nothing is constant, so $\frac{dv}{dt} \neq 0$. The capacitor and inductor then have finite, frequency-dependent impedance, $\frac{1}{j\omega C}$ and $j\omega L$.

## 9. One-line summary

> The laws $i_C = C\,dv_C/dt$ and $v_L = L\,di_L/dt$ respond only to *change*. In DC steady state nothing changes, so $i_C = 0$ (open) and $v_L = 0$ (short), while $v_C$ and $i_L$ stay frozen at whatever value they reached.
