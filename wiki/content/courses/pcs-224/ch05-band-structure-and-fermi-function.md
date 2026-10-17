---
title: "5. Band Structure & the Fermi Function"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **41.7, 42.4–42.6** · Neamen **3.1.1, 3.2.1, 3.2.5, 3.5** · week 5

[[ch03-intro-to-semiconductors|Chapter 3]] described semiconductors with bonds, and [[ch04-hall-effect-bohr-model-doping|Chapter 4]] showed that electrons in atoms have discrete energies. This chapter puts the two together. When atoms form a crystal, the discrete levels spread into **energy bands** separated by **gaps**, and whether a material is a metal, a semiconductor or an insulator depends on how those bands are filled.

After that we need a way to count *how many* electrons occupy a given energy at temperature $T$. That's the **Fermi function**, and the **Fermi level** $E_F$ is the one number that controls it.

The key ideas:

1. Two electrons can't share a quantum state (**Pauli exclusion**), so electrons fill energy states from the bottom up.
2. A **band** is a huge number of closely spaced allowed levels, and a **gap** is a range with no allowed levels.
3. Only a **partly filled** band can carry current. A metal has one, while an insulator or semiconductor has a **full valence band** and an **empty conduction band** at 0 K.
4. A semiconductor's small gap (~1 eV) lets thermal energy promote some electrons, which creates **electrons and holes**.
5. The probability that an energy $E$ is occupied is $f(E) = \dfrac{1}{1 + e^{(E-E_F)/k_BT}}$.

## Notes

### Quantum rules for many-electron systems

Classical physics describes everyday objects. For electrons we need **quantum mechanics**, whose central feature is **wave–particle duality**.

- **Light** behaves like particles (photons) in absorption, emission and scattering, with $E = hf$ and momentum $p = h/\lambda$ (from the photoelectric effect, [[ch02-photoelectric-effect|Chapter 2]]).
- **Particles** such as electrons have definite mass and charge, but they aren't confined to a single point. A **wave function** describes the *probability* of finding the particle at a given place.

In an isolated atom, the state of an electron is labelled by a set of quantum numbers $(n, l, m)$ plus a spin value $(\pm\tfrac{1}{2})$. Two rules govern a system with many electrons:

1. **Pauli exclusion principle.** No two electrons can occupy the same quantum state at the same time.
2. **Lowest energy first.** At $T = 0$ K (the ground state) electrons fill the lowest available states.

Together these mean the electrons stack up from the bottom. Each state holds at most one electron (per spin), and the next electron has to go higher.

### From atomic levels to energy bands

Bring two identical atoms together and each level splits into two slightly different levels, because the wave functions overlap and Pauli exclusion doesn't let both electrons have the same energy. Bring $N$ atoms together and every level splits into $N$ closely spaced levels. In a real crystal $N \sim 10^{22}$ cm⁻³, so the levels are so close together that they form an essentially continuous **energy band**.

- **Energy band:** a range of energies where electron states exist.
- **Energy gap** (forbidden band): a range of energies with **no** allowed states, so electrons can't be found there.
- **Valence band:** the highest band that's completely filled with electrons at 0 K.
- **Conduction band:** the next allowed band above it, which is empty or partly filled.

The notation from here on is that $E_v$ is the top of the valence band, $E_c$ is the bottom of the conduction band, and the **band gap** is $E_g = E_c - E_v$.

### Metals, insulators and semiconductors

Why does the filling matter? To carry a current, an electron in a field has to **gain kinetic energy**, so it needs a nearby empty state to move into. A completely **filled** band has no empty states, so it carries no net current even though it's full of electrons.

![[pcs-224-band-types.svg]]
*Figure 5.1: Band filling at $T = 0$ K. The metal has a partly filled band, so electrons near $E_F$ can move. Semiconductors and insulators have a full valence band and an empty conduction band, differing only in the size of the gap.*

| Material | Band picture at 0 K | Gap | Behaviour |
| --- | --- | --- | --- |
| Metal | Partly filled conduction band (or overlapping bands) | none | Good conductor at all $T$ |
| Semiconductor | Full valence band, empty conduction band | ~1 eV | Insulator at 0 K, conducts as $T$ rises or with doping |
| Insulator | Full valence band, empty conduction band | ~10 eV | Poor conductor even at room temperature |

Typical band gaps:

| Material | $E_g$ (eV) |
| --- | --- |
| Tin (grey) | 0.08 |
| Tellurium | 0.35 |
| Lead sulphide | 0.37 |
| Germanium | 0.67 |
| Silicon | 1.12 |
| Gallium arsenide | 1.43 |
| Selenium | 1.8 |

**Why temperature matters.** In a semiconductor, the gap (≈1 eV) is small enough that at room temperature a few electrons near the top of the valence band get thermally promoted across it. In an insulator (≈10 eV) basically none do. That's why a semiconductor conducts **better as it gets hotter**, unlike a metal.

### Electrons and holes in the band picture

When an electron is excited from the valence band into the conduction band, **two** carriers appear:

- The electron in the conduction band is free to move through the crystal under a field (against $\vec{E}$). These are the **n-carriers**.
- It leaves an empty state, a **hole**, in the valence band. Neighbouring valence electrons can move into it, which moves the hole the opposite way, i.e. **along** $\vec{E}$. These are the **p-carriers**. The Hall effect confirms that holes behave as positive charge carriers ([[ch04-hall-effect-bohr-model-doping|Chapter 4]]).

So thermal excitation creates electron–hole pairs, and in a pure semiconductor there are exactly as many holes in the valence band as electrons in the conduction band.

**Doping** adds levels *inside* the gap, close to the band edges (donors near $E_c$, acceptors near $E_v$), like in Figure 4.3. At room temperature they ionize and supply carriers of one type.

### The Fermi function

At $T = 0$ the occupation is simple, since all states below some energy are full and all states above are empty. That boundary is the **Fermi energy** $E_F$.

At $T > 0$ some electrons gain thermal energy and move up, so the sharp edge **smears out**. Tracking every electron is impossible, but there are so many of them that statistics works. The result, the **Fermi–Dirac distribution**, gives the **probability that a state at energy $E$ is occupied**:

$$
f(E) = \frac{1}{1 + e^{(E - E_F)/k_BT}} \tag{5.1}
$$

![[pcs-224-fermi-function.svg]]
*Figure 5.2: The Fermi function at three temperatures. At $T = 0$ it is a step. As $T$ rises, the step smooths out over a width of a few $k_BT$, but it always passes through $\frac{1}{2}$ at $E = E_F$.*

**Properties you should know:**

- $T \to 0$: $f = 1$ for $E < E_F$ and $f = 0$ for $E > E_F$ (a step).
- $E = E_F$: $f = \dfrac{1}{2}$ at **every** temperature. This is the precise definition of the Fermi level.
- $E - E_F \gg k_BT$: $f \approx e^{-(E-E_F)/k_BT}$, a small number (the "tail").
- $E_F - E \gg k_BT$: $f \approx 1$.
- Higher $T$ means more smearing, with more probability above $E_F$ and less below it.

**Two things set the number of electrons at an energy.** One is the probability $f(E)$ that a state is occupied, and the other is the **number of states** available there. $E_F$ only has to do with the first one. It's best thought of as the energy where the occupation probability is $\frac{1}{2}$ *if* there were states everywhere.

> [!warning] **$E_F$ can lie in the gap.** In an intrinsic semiconductor there are **no** states at $E_F$, so there are no electrons *at* $E_F$ even though $f(E_F) = \frac{1}{2}$. In a metal, $E_F$ lies inside a band, and in a semiconductor or insulator it lies in the gap.

**Where is $E_F$ for an intrinsic semiconductor?** Near the middle of the gap:

$$
E_c - E_F \approx E_F - E_v \approx \frac{E_g}{2} \tag{5.2}
$$

(Chapter 6 shows the small correction.)

### Probability of holes

A hole is just an **unoccupied** state, so the probability that a state at energy $E$ holds a hole is

$$
f_h(E) = 1 - f(E) = \frac{1}{1 + e^{(E_F - E)/k_BT}} \tag{5.3}
$$

This mirrors Eq. (5.1) with $E - E_F$ replaced by $E_F - E$. Holes are only likely **below** $E_F$ by a tail, just like electrons are only likely above $E_F$ by a tail.

**The semiconductor at room temperature.**

- **Conduction band** (above $E_F$): $f$ is tiny, but those few electrons are *free* and carry current.
- **Valence band** (below $E_F$): $f$ is almost 1, so it's almost full. We don't follow the huge number of electrons, we follow the few **holes**. It's like following the motion of air bubbles in water instead of tracking how the water fills in behind each bubble.

## Key formulas

**Fermi–Dirac function**

$$
f(E) = \frac{1}{1 + e^{(E - E_F)/k_BT}}, \qquad f(E_F) = \frac{1}{2} \tag{5.1}
$$

- $f(E)$: probability a state at $E$ is occupied
- $E_F$: Fermi energy (eV); $k_BT = 0.02586$ eV at 300 K

**Hole probability**

$$
f_h(E) = 1 - f(E) = \frac{1}{1 + e^{(E_F - E)/k_BT}} \tag{5.3}
$$

**Tails of the distribution** (when $|E - E_F| \gg k_BT$)

$$
f \approx e^{-(E-E_F)/k_BT}\ (E > E_F), \qquad f_h \approx e^{-(E_F-E)/k_BT}\ (E < E_F)
$$

**Intrinsic Fermi level and band edges**

$$
E_g = E_c - E_v, \qquad E_c - E_F \approx E_F - E_v \approx \frac{E_g}{2} \tag{5.2}
$$

**Number of electrons at an energy level**

$$
n(E) = g(E)\,f(E) \tag{5.4}
$$

- $g(E)$: number of available states (per cm³) at that energy

**Photon needed to cross the gap**

$$
\lambda_{\max}\ (\text{nm}) = \frac{1240}{E_g\ (\text{eV})}
$$

## Examples

### Example 1: Probability at the band edge

> Like the clicker with $E_g = 1.107$ eV and $E_F$ at mid-gap

A silicon crystal at $300$ K has $E_g = 1.12$ eV with $E_F$ at mid-gap. Find (a) the probability that a state at the bottom of the conduction band is occupied, and (b) the number of electrons per cm³ at that level if there are $1\times10^{19}$ states/cm³ there.

**(a)** $E_c - E_F = E_g/2 = 0.56$ eV, and $k_BT = 0.02586$ eV:

$$
f(E_c) = \frac{1}{1 + e^{0.56/0.02586}} = \frac{1}{1 + e^{21.66}} \approx e^{-21.66} = 3.9\times10^{-10}
$$

**(b)**

$$
n = g\,f = (1\times10^{19})(3.9\times10^{-10}) = 3.9\times10^{9}\ \text{cm}^{-3}
$$

> [!note] That's already close to the order of magnitude of silicon's intrinsic carrier density ($\sim10^{10}$ cm⁻³). The Fermi function really is what produces $n_i$ (see Chapter 6).

### Example 2: A wider gap

> Like the diamond clicker

Repeat Example 1 for diamond, $E_g = 6.0$ eV, again with $E_F$ at mid-gap and $g = 1\times10^{19}$ cm⁻³.

$$
f(E_c) \approx e^{-3.0/0.02586} = e^{-116} = 4\times10^{-51}, \qquad n = (10^{19})(4\times10^{-51}) \approx 4\times10^{-32}\ \text{cm}^{-3}
$$

There are effectively **zero** electrons in the conduction band, so diamond is an excellent insulator at room temperature.

### Example 3: Where is the hole probability 10%?

> Like the clicker "$f_h = 10\%$ at $27\ ^\circ\text{C}$"

At $300$ K, at what energy is the probability of finding a hole equal to $10\%$?

A hole probability of $0.10$ means $f = 0.90$:

$$
0.90 = \frac{1}{1 + e^{(E-E_F)/k_BT}} \ \Rightarrow\ e^{(E-E_F)/k_BT} = \frac{1}{0.90} - 1 = 0.111
$$

$$
E - E_F = k_BT\ln(0.111) = (0.02586)(-2.197) = -0.0568\ \text{eV}
$$

So $f_h = 10\%$ at **0.057 eV below $E_F$**. (By symmetry, $f = 10\%$ at $0.057$ eV above $E_F$.)

### Example 4: Effect of temperature

A state lies $0.40$ eV above $E_F$. Compare its occupation probability at $300$ K and $400$ K.

$$
f(300\ \text{K}) \approx e^{-0.40/0.02586} = 1.9\times10^{-7}
$$

$$
f(400\ \text{K}) \approx e^{-0.40/0.03447} = 9.1\times10^{-6}
$$

A $100$ K rise increases the probability by about $48\times$. The Fermi function depends **exponentially** on $T$, so the occupancy at the band edge, and with it the carrier density, is very sensitive to temperature.

### Example 5: Light and the gap

> Like the "Ge, 0.67 eV, maximum wavelength" clicker

What's the longest wavelength of light that can excite an electron across the gap in (a) Ge ($0.67$ eV), (b) Si ($1.12$ eV), (c) GaAs ($1.43$ eV)?

A photon must have $E \ge E_g$, so $\lambda \le 1240/E_g$:

| Material | $E_g$ (eV) | $\lambda_{\max}$ (nm) | Region |
| --- | --- | --- | --- |
| Ge | 0.67 | 1850 | infrared |
| Si | 1.12 | 1107 | near-infrared |
| GaAs | 1.43 | 867 | near-infrared |

Photons with a longer $\lambda$ than this pass through without exciting electrons. The same idea comes back with the LED and photodiode in [[ch08-junction-capacitance-and-optoelectronics|Chapter 8]].

## Common mistakes

- Saying there's a 50% chance of an electron *at* $E_F$ and concluding there are electrons there. In the gap there are no states to occupy
- Believing $E_F$ is the energy of the highest electron at **any** $T$. That's only true at $T = 0$. In general it's where $f = \frac{1}{2}$
- Forgetting the $k_BT$ in the exponent, or using $T$ in °C
- Taking the hole probability as $f(E)$ when it's $1 - f(E)$, with the sign of the exponent flipped
- Mixing up which band holds which carrier. Electrons are counted in the **conduction** band and holes in the **valence** band
- Using $1240/\lambda$ with $\lambda$ in metres. It needs **nm**
- Forgetting that a full band carries no current, because there are no empty states to move into
