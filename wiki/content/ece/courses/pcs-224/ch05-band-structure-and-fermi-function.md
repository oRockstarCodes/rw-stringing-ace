---
title: "5. Band Structure & the Fermi Function"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **41.7, 42.4–42.6** · Neamen **3.1.1, 3.2.1, 3.2.5, 3.5** · week 5

[[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|Chapter 3]] used bonds to describe semiconductors, and [[ch04-hall-effect-bohr-model-doping#Why are energies discrete? The Bohr model|Chapter 4]] showed that electrons in atoms have discrete energies. This chapter combines the two. When atoms pack into a crystal, the allowed levels spread out into **energy bands** with **gaps** between them. Whether a material is a metal, a semiconductor or an insulator depends on how those bands are filled.

Then we need a way to count *how many* electrons sit at a given energy at temperature $T$. That's the **Fermi function**, and one number, the **Fermi level** $E_F$, controls it.

The key ideas:

1. Two electrons can't share a quantum state (**Pauli exclusion**), so electrons fill energy states from the bottom up.
2. A **band** is a huge number of closely spaced allowed levels, and a **gap** is a range of energies with no allowed levels.
3. Only a **partly filled** band can carry current. A metal has one. An insulator or semiconductor has a **full valence band** and an **empty conduction band** at 0 K.
4. A semiconductor's gap is small (about 1 eV), so heat can lift some electrons across, which creates **[[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|electrons and holes]]**.
5. The chance that a state at energy $E$ is occupied is $f(E) = \dfrac{1}{1 + e^{(E-E_F)/k_BT}}$.

## Notes

### Quantum rules for many electrons

Classical physics works for everyday objects. For electrons we need **quantum mechanics**, and its central idea is **wave–particle duality**.

- **Light** acts like particles (photons) when it's absorbed, emitted or scattered, with energy $E = hf$ and momentum $p = h/\lambda$ ([[ch02-photoelectric-effect#Einstein's photon picture (1905)|Chapter 2]]). (Here $p$ is momentum, not the [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|hole concentration]] $p_0$. $h$ is Planck's constant, $f$ the frequency and $\lambda$ the wavelength.)
- **Particles** like electrons have a definite mass and charge, but they aren't pinned to one point. A **wave function** gives the *probability* of finding the particle in a given place.

In an isolated atom, each electron state is labelled by quantum numbers $(n, l, m)$ plus a spin ($\pm\tfrac{1}{2}$). Here $n$ is the principal quantum number from [[ch04-hall-effect-bohr-model-doping#Why are energies discrete? The Bohr model|Chapter 4]] (it sets the energy), $l$ describes the shape of the orbit (its angular momentum), and $m$ describes its orientation. You don't need to calculate with them. The point is just that each *combination* is one distinct state. With many electrons, two rules decide who goes where:

1. **Pauli exclusion principle.** No two electrons can be in the same quantum state.
2. **Lowest energy first.** At $T = 0$ K (the ground state), electrons fill the lowest available states.

Together these mean electrons stack up from the bottom like water filling a glass. Each state holds at most one electron (per spin), so the next electron has to go higher.

### From atomic levels to energy bands

An isolated atom has sharp allowed levels, each at one exact energy. A crystal is a huge number of atoms packed close together, and that changes things. Follow one level as the atoms approach (Figure 5.1):

1. **One atom, or atoms far apart.** The level sits at one energy. Atoms that are far apart don't affect each other, so $N$ separate atoms just give $N$ copies of the same level.
2. **Two atoms close together.** Their wave functions now overlap, and Pauli exclusion says two electrons can't be in the same quantum state. So the two copies of the level can't stay at the same energy. They get pushed slightly apart, one a little lower and one a little higher.
3. **$N$ atoms.** Each atomic level splits into $N$ levels, all slightly different in energy.
4. **A real crystal.** $N \sim 10^{22}$ atoms per cm³, so there are $\sim 10^{22}$ levels packed into a window a few eV wide. The spacing is so tiny that the levels are effectively continuous. We call that stretch of energies an **energy band**.

A band is *not* one level that got wider. It's an enormous number of separate levels that sit too close together to tell apart. Each atomic level (the 1s, the 2s, and so on) turns into its own band, and the space *between* two bands is the **gap**. No levels land there.

![[pcs-224-band-formation.svg]]
*Figure 5.1: Follow the lines from left to right as the atoms are brought closer together. Each atomic level fans out into $N$ levels (eight are drawn here, but in a crystal there are $\sim 10^{22}$). At the spacing found in the crystal (dashed line) they form a band, and the space between the two bands is the forbidden gap.*

- **Energy band:** a range of energies where electron states exist.
- **Energy gap** (forbidden band): a range of energies with **no** allowed states. Electrons can't be found there.
- **Valence band:** the highest band that's completely full at 0 K.
- **Conduction band:** the next band up, which is empty or partly filled.

From here on, $E_v$ is the top of the valence band, $E_c$ is the bottom of the conduction band, and the **band gap** is $E_g = E_c - E_v$.

### Metals, insulators and semiconductors

Why does filling matter? To carry current, an electron in a field has to **gain energy**, so it needs a nearby empty state to move into. A band that's completely **full** has no empty states, so it carries no net current, even though it's packed with electrons. Think of a parking garage that's totally full: no car can move.

![[pcs-224-band-types.svg]]
*Figure 5.2: Band filling at $T = 0$ K. The metal has a partly filled band, so electrons near $E_F$ can move. Semiconductors and insulators have a full valence band and an empty conduction band, and only the size of the gap differs.*

| Material | Bands at 0 K | Gap | Behaviour |
| --- | --- | --- | --- |
| Metal | Partly filled band (or overlapping bands) | none | Conducts at every temperature |
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

**Why temperature matters.** In a semiconductor the gap (about 1 eV) is small enough that at room temperature a few electrons at the top of the valence band get kicked across. In an insulator (about 10 eV) essentially none do. That's why a semiconductor conducts **better when it's hotter**, the opposite of a metal.

### Electrons and holes in the band picture

When an electron jumps from the valence band to the conduction band, **two** carriers appear:

- The electron in the conduction band is free to move under a field (against $\vec{E}$). These are the **n-carriers**.
- It leaves an empty state, a **hole**, in the valence band. Neighbouring valence electrons can move into it, so the hole moves the opposite way, **along** $\vec{E}$. These are the **p-carriers**. The Hall effect confirmed that holes act like positive charges ([[ch04-hall-effect-bohr-model-doping#The Hall effect|Chapter 4]]).

So heat makes electron–hole pairs, and in a pure semiconductor the number of holes in the valence band equals the number of electrons in the conduction band.

**[[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|Doping]]** adds levels *inside* the gap, close to the band edges (donors near $E_c$, acceptors near $E_v$), like in [[ch04-hall-effect-bohr-model-doping#Doping in the Bohr picture|Figure 4.4]]. At room temperature they ionize and supply carriers of one type.

### The Fermi function

At $T = 0$ the picture is simple: every state below some energy is full and every state above it is empty. That boundary is the **Fermi energy** $E_F$.

At $T > 0$, some electrons gain thermal energy and move up, so the sharp edge **smears out**. We can't track every electron, but there are so many that statistics works. The **Fermi–Dirac distribution** gives the **probability that a state at energy $E$ is occupied**:

$$
f(E) = \frac{1}{1 + e^{(E - E_F)/k_BT}} \tag{5.1}
$$

where $E$ is the energy of the state you're asking about, $E_F$ is the Fermi energy, $T$ is the temperature in kelvin, and $k_BT$ is the thermal energy from [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|Chapter 3]]. The combination $(E - E_F)/k_BT$ is just "how many thermal-energy units above the Fermi level this state is".

<div class="melon-semi" data-view="fermi">Interactive Fermi function diagram (open this page on the site to use it).</div>
*Figure 5.3: The Fermi function. At $T = 0$ it's a step. Warming smooths the step over a few $k_BT$, but the curve always passes through $\frac{1}{2}$ at $E = E_F$.*

**Things to know about it:**

- $T \to 0$: $f = 1$ for $E < E_F$ and $f = 0$ for $E > E_F$ (a step).
- $E = E_F$: $f = \dfrac{1}{2}$ at **every** temperature. This is the exact definition of the Fermi level.
- $E - E_F \gg k_BT$: $f \approx e^{-(E-E_F)/k_BT}$, a small number (the "tail").
- $E_F - E \gg k_BT$: $f \approx 1$.
- Higher $T$ means more smearing: more probability above $E_F$, less below.

**Two things set how many electrons are at an energy.** One is the probability $f(E)$ that a state is occupied. The other is **how many states** exist at that energy, called the **density of states** $g(E)$ (states per cm³ per unit energy). Multiplying the two gives the number of electrons at that energy, $n(E) = g(E)\,f(E)$ (Eq. 5.4; the examples below just use $g$ as the count of states at a level). $E_F$ only deals with the first. I think of it as the energy where the occupation probability would be $\frac{1}{2}$ *if* there were states everywhere.

> [!warning] **$E_F$ can sit in the gap.** In an intrinsic semiconductor there are **no** states at $E_F$, so there are no electrons *at* $E_F$ even though $f(E_F) = \frac{1}{2}$. In a metal, $E_F$ is inside a band. In a semiconductor or insulator, it's in the gap.

**Where is $E_F$ in an intrinsic semiconductor?** Near the middle of the gap:

$$
E_c - E_F \approx E_F - E_v \approx \frac{E_g}{2} \tag{5.2}
$$

### Probability of holes

A hole is just an **empty** state, so the probability that a state at energy $E$ holds a hole is

$$
f_h(E) = 1 - f(E) = \frac{1}{1 + e^{(E_F - E)/k_BT}} \tag{5.3}
$$

It looks like Eq. (5.1) with $E - E_F$ swapped for $E_F - E$. Holes are only likely to be found a little **below** $E_F$ (a tail), just as electrons are only likely to be found a little above it.

**A semiconductor at room temperature:**

- **Conduction band** (above $E_F$): $f$ is tiny, but those few electrons are *free* and carry current.
- **Valence band** (below $E_F$): $f$ is almost 1, so the band is almost full. Instead of tracking the huge number of electrons, we track the few **holes**. It's like watching the bubbles in a glass of water instead of the water filling in around each one.

## Key formulas

**Fermi–Dirac function**

$$
f(E) = \frac{1}{1 + e^{(E - E_F)/k_BT}}, \qquad f(E_F) = \frac{1}{2} \tag{5.1}
$$

- $f(E)$: probability a state at $E$ is occupied
- $E$: energy of the state (eV); $E_F$: Fermi energy (eV); $k_BT = 0.02586$ eV at 300 K
- $f_h(E)$ (below): probability that the state is *empty*, i.e. holds a hole

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

- $g(E)$: number of available states (per cm³) at that energy; $f(E)$: occupation probability (Eq. 5.1); $n(E)$: electrons per cm³ at that energy

**Photon needed to cross the gap**

$$
\lambda_{\max}\ (\text{nm}) = \frac{1240}{E_g\ (\text{eV})}
$$

- $\lambda_{\max}$: the longest wavelength whose photons still have energy $\ge E_g$ (from $E = hc/\lambda$, [[ch02-photoelectric-effect#Einstein's photon picture (1905)|Chapter 2]])
- $E_g = E_c - E_v$: band gap; $E_c$: bottom of the conduction band; $E_v$: top of the valence band

## Examples

### Example 1: Probability at the band edge

A silicon crystal at $300$ K has $E_g = 1.12$ eV with $E_F$ at mid-gap. Find (a) the probability that a state at the bottom of the conduction band is occupied, and (b) the number of electrons per cm³ at that level if there are $1\times10^{19}$ states/cm³ there.

**(a)** $E_c - E_F = E_g/2 = 0.56$ eV, and $k_BT = 0.02586$ eV:

$$
f(E_c) = \frac{1}{1 + e^{0.56/0.02586}} = \frac{1}{1 + e^{21.66}} \approx e^{-21.66} = 3.9\times10^{-10}
$$

**(b)**

$$
n = g\,f = (1\times10^{19})(3.9\times10^{-10}) = 3.9\times10^{9}\ \text{cm}^{-3}
$$

> [!note] That's already close to the order of magnitude of silicon's [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|intrinsic carrier density]] ($\sim10^{10}$ cm⁻³). The Fermi function really is what produces $n_i$ (see [[ch06-carrier-concentrations#Counting carriers|Chapter 6]]).

### Example 2: A wider gap

Repeat Example 1 for diamond, $E_g = 6.0$ eV, again with $E_F$ at mid-gap and $g = 1\times10^{19}$ cm⁻³.

$$
f(E_c) \approx e^{-3.0/0.02586} = e^{-116} = 4\times10^{-51}, \qquad n = (10^{19})(4\times10^{-51}) \approx 4\times10^{-32}\ \text{cm}^{-3}
$$

There are effectively **zero** electrons in the conduction band, so diamond is an excellent insulator at room temperature.

### Example 3: Where is the hole probability 10%?

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

What's the longest wavelength of light that can excite an electron across the gap in (a) Ge ($0.67$ eV), (b) Si ($1.12$ eV), (c) GaAs ($1.43$ eV)?

A photon must have $E \ge E_g$, so $\lambda \le 1240/E_g$:

| Material | $E_g$ (eV) | $\lambda_{\max}$ (nm) | Region |
| --- | --- | --- | --- |
| Ge | 0.67 | 1850 | infrared |
| Si | 1.12 | 1107 | near-infrared |
| GaAs | 1.43 | 867 | near-infrared |

Photons with a longer $\lambda$ than this pass through without exciting electrons. The same idea comes back with the LED and photodiode in [[ch08-junction-capacitance-and-optoelectronics|Chapter 8]].

> [!example] Lab 4 runs this table backwards. An LED doesn't absorb a photon to lift an electron across the gap. It emits one when an electron drops back across it. The photon carries about $E_g$, so $E_g = hf = hc/\lambda$. Under forward bias, the current only becomes noticeable once each electron has been given roughly that much energy by the supply, so
>
> $$
> eV_t \approx E_g = \frac{hc}{\lambda} \quad\Rightarrow\quad V_t = \frac{h}{e}\,f
> $$
>
> where $V_t$ is the **turn-on voltage**. This is the stopping-potential line from [[ch02-photoelectric-effect#What Lab 1 looked like|Lab 1]] again, with the same slope $h/e$.
>
> We swept the voltage across seven LEDs with an Arduino and read the voltage where the current reached about $1$ mA on a log axis (steps of $0.025$ V, so $V_t$ is good to $\pm0.025$ V):
>
> | LED | $\lambda$ (nm) | $1240/\lambda$ (eV) | Measured $V_t$ (V) | Difference (V) |
> | --- | --- | --- | --- | --- |
> | UV | 395 | 3.14 | 2.94 | 0.20 |
> | Blue | 461 | 2.69 | 2.60 | 0.09 |
> | Green | 580 | 2.14 | 1.90 | 0.24 |
> | Yellow | 591 | 2.10 | 1.91 | 0.19 |
> | Red | 658 | 1.88 | 1.79 | 0.09 |
> | IR | 940 | 1.32 | 1.04 | 0.28 |
> | White | 450 | 2.76 | 2.91 | $-0.15$ |
>
> - **Shorter wavelength, bigger gap, higher turn-on voltage.** $V_t$ climbs from $1.04$ V for the IR LED to $2.94$ V for the UV one. It's a straight line against $f$.
> - **The fitted slope gives $h$.** All seven points give $4.59\times10^{-15}$ V·s, so $h = 7.35\times10^{-34}$ J·s, which is $10.9\%$ high. The expected slope is $h/e = 4.136\times10^{-15}$ V·s.
> - **The white LED is the odd one out.** It isn't a single-gap device. It's a blue or UV chip coated in yellow phosphor, so its turn-on is set by the chip, at $2.91$ V, not by the listed $450$ nm. Dropping it gives a slope of $4.32\times10^{-15}$ V·s and $h = 6.92\times10^{-34}$ J·s, only $4.4\%$ high. We report both, because the white LED was excluded for a physical reason and not because it improved the fit.
> - **Every other LED turns on $0.1$ to $0.3$ V *below* $hc/(e\lambda)$.** That's why both fitted lines have a negative intercept ($-0.385$ V with all seven, $-0.283$ V without white) when the equation predicts a line through the origin. Current rises exponentially with voltage, so $1$ mA is already flowing slightly below $E_g/e$. The relation $eV_t = E_g$ is only approximate when $V_t$ is read at a fixed current. [[ch07-pn-junction#Lab 3: checking the diode equation|Chapter 7]] shows where that exponential comes from.
>
> LEDs are built from direct-gap III–V compounds like GaAs alloys. In Si and Ge, recombination also needs a lattice vibration, so most of the energy ends up as heat and very few photons come out.

### Example 6: Warming from 27 °C to 37 °C

A silicon crystal has $E_g = 1.107$ eV with $E_F$ at mid-gap. How much does the probability of finding an electron at the bottom of the conduction band increase when the temperature goes from $300$ K to $310$ K?

At the band edge $E_c - E_F = E_g/2$, which is many $k_BT$, so $f \approx e^{-E_g/(2k_BT)}$. The ratio of the two probabilities is

$$
\frac{f(310)}{f(300)} = \exp\!\left[\frac{E_g}{2k_B}\left(\frac{1}{300} - \frac{1}{310}\right)\right] = \exp\!\left[\frac{0.5535}{8.617\times10^{-5}}\,(1.075\times10^{-4})\right] = e^{0.69} \approx 2.0
$$

That's an increase of about **99%**, so a $10$ K rise **doubles** the probability. The Fermi function is exponentially sensitive to temperature, and this is the reason $n_i$ roughly doubles per 10 K in [[ch06-carrier-concentrations#Counting carriers|Chapter 6]].

**What else changes?** The number of available states near the band edge, $N_c$ (the effective density of states, defined in [[ch06-carrier-concentrations#Counting carriers|Chapter 6]]), is proportional to $T^{3/2}$ and also grows, but only by about 5%, so the exponential is what dominates.

## Common mistakes

- Saying there's a 50% chance of an electron *at* $E_F$ and concluding there are electrons there. In the gap there are no states to occupy
- Believing $E_F$ is the energy of the highest electron at **any** $T$. That's only true at $T = 0$. In general it's where $f = \frac{1}{2}$
- Forgetting the $k_BT$ in the exponent, or using $T$ in °C
- Taking the hole probability as $f(E)$ when it's $1 - f(E)$, with the sign of the exponent flipped
- Mixing up which band holds which carrier. Electrons are counted in the **conduction** band and holes in the **valence** band
- Using $1240/\lambda$ with $\lambda$ in metres. It needs **nm**
- Forgetting that a full band carries no current, because there are no empty states to move into
