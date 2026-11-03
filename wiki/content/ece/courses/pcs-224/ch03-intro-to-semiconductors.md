---
title: "3. Introduction to Semiconductors"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **3.2.1, 3.2.4, 4.3.2, 6.1.1** (ignore the band model), **5.1.1, 5.1.3** · Serway & Jewett **26.1, 26.2** · week 3

A semiconductor is a material whose ability to carry current you can **tune**, using temperature, light, and most of all by adding tiny amounts of impurity atoms (doping). That tunability is why semiconductors run the world's electronics.

In this chapter I treat semiconductors the "classical" way, as atoms joined by bonds. The quantum band picture comes in [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|Chapter 5]]. Two questions drive everything:

1. **How many carriers are there?** The free electrons and holes in pure and doped material are tied together by one equation, $n_0p_0 = n_i^2$.
2. **How much current do they carry?** Carriers drift in an [[ch01-electrostatics-review#Electric fields and forces|electric field]], and the **mobility** $\mu$ tells us how fast. That gives $J = \sigma E$, which is Ohm's law.

## Notes

### Intrinsic semiconductors: electrons and holes

**The bond picture.** Each silicon atom has 4 valence electrons and shares them with its 4 neighbours, forming **four covalent bonds**. At $T = 0$ K every electron is locked in a bond. Nothing is free to move, so a semiconductor is an **insulator at absolute zero**.

Breaking a bond takes $E_g = 1.12$ eV in silicon. That energy is the **[[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|band gap]]**, which becomes an energy-band picture in Chapter 5.

**Heat supplies the energy.** Temperature measures the random jiggling of the atoms. A typical particle carries an extra energy of about $\tfrac{3}{2}k_BT$. The number to remember is

$$
k_BT = 0.02586\ \text{eV} \quad \text{at } T = 300\ \text{K} \tag{3.1}
$$

where $k_B = 8.617\times10^{-5}$ eV/K is **Boltzmann's constant** (it converts a temperature into an energy), $T$ is the absolute temperature in [[ch01-electrostatics-review#Units|kelvin]], and $T(\text{K}) = T(^\circ\text{C}) + 273$. That's tiny next to $1.12$ eV. But there are so many bonds that a small fraction of them still break at room temperature.

Every broken bond creates two carriers (Figure 3.1, left):

- A **free electron** that can move through the crystal. Its concentration is $n_0$ (per cm³).
- A **hole**, the empty spot the electron left behind. Its concentration is $p_0$ (per cm³).

**A hole acts like a positive charge that can move.** A neighbouring bond's electron can hop into the empty spot, which moves the hole the other way. If you picture a row of seats with one empty, the empty seat moves backward as people shuffle forward. Tracking all the electrons would be a nightmare, so we track the hole as if it were one positive particle drifting **in the direction of the electric field**.

In a pure (**intrinsic**) semiconductor, each broken bond gives one electron and one hole:

$$
n_0 = p_0 = n_i \tag{3.2}
$$

$n_i$ is the **intrinsic carrier concentration**. It depends only on the material and the temperature. A weaker bond (smaller $E_g$) means a bigger $n_i$.

> [!tip] Pure water is a good comparison. It has equal amounts of H⁺ and OH⁻ ions. Add acid and H⁺ goes up. Add base and OH⁻ goes up. Doping does the same thing to a semiconductor.

| Material | $E_g$ (eV) | $n_i$ (cm⁻³) at 300 K | $\mu_n$ (cm²/V·s) | $\mu_p$ (cm²/V·s) |
| --- | --- | --- | --- | --- |
| Si | 1.12 | $1.5\times10^{10}$ | 1350 | 480 |
| Ge | 0.67 | $2.4\times10^{13}$ | 3900 | 1900 |
| GaAs | 1.43 | $1.8\times10^{6}$ | 8500 | 400 |

> [!note] These are the usual textbook (Neamen) values at 300 K. On an exam, use whatever numbers the question gives you. In every row, electrons are more mobile than holes.

### Doping: extrinsic semiconductors

Adding small, controlled amounts of impurity atoms is **doping**, and a doped semiconductor is called **extrinsic**.

![[pcs-224-bond-picture.svg]]
*Figure 3.1: Silicon bonds, two shared electrons per bond. Left: heat breaks a bond and makes an electron–hole pair. Middle: phosphorus has a 5th electron that isn't needed for bonding, so it breaks free and leaves a fixed P⁺ ion. Right: boron is one electron short, so it takes an electron from a neighbouring bond, becoming a fixed B⁻ ion, and the hole it leaves behind moves on.*

**n-type.** Swap a few silicon atoms for a **Group V** atom such as phosphorus, which has 5 valence electrons. Four of them fill the bonds. The fifth has nowhere to go and is easily freed. Each of these atoms is a **donor**, with concentration $N_D$. If $N_D \gg n_i$, nearly every donor supplies one free electron:

$$
n_0 \approx N_D \tag{3.3}
$$

**p-type.** Swap a few silicon atoms for a **Group III** atom such as boron, which has only 3 valence electrons. One bond is left short, and a neighbouring electron can fill it, leaving a hole behind. Each of these atoms is an **acceptor**, with concentration $N_A$. If $N_A \gg n_i$:

$$
p_0 \approx N_A \tag{3.4}
$$

In n-type material, electrons are the **majority** carriers and holes are the **minority** carriers. In p-type it's the other way around.

> [!note] Doped material is still electrically neutral. Each donor that gave up an electron is now a fixed positive ion, which cancels the electron's charge. [[ch04-hall-effect-bohr-model-doping#Doping in the Bohr picture|Chapter 4]] explains why that fifth electron is so loosely held.

### The fundamental semiconductor equation

Even in doped material, the electron and hole concentrations are locked together:

$$
n_0\,p_0 = n_i^2 \tag{3.5}
$$

**Why this is true.** In thermal equilibrium, electron–hole pairs are being made and destroyed all the time, and the two rates are equal.

- **Generation.** Heat breaks bonds at a rate $G$ (pairs per cm³ per second) that depends on temperature and material only, **not** on doping. It's the same in n-type, p-type and intrinsic samples of one material.
- **Recombination.** A free electron falls into a hole and both vanish. The rate $R$ (pairs lost per cm³ per second) is proportional to the number of electrons *times* the number of holes: $R = r\,n_0p_0$, where $r$ is a constant that depends on the material and temperature.
- **Equilibrium.** $R = G$. For the intrinsic sample, $G = r\,n_i^2$. For any other sample of the same material, $G = r\,n_0p_0$. Setting them equal gives Eq. (3.5).

So $n_i$ belongs to the host material at that temperature, and doping can't change it. Add donors and $n_0$ goes up, so $p_0$ must go *down* to keep the product fixed.

**My recipe:** find the **majority** carrier first, then get the minority from Eq. (3.5).

| Material | Majority | Minority |
| --- | --- | --- |
| n-type | $n_0 = N_D$ | $p_0 = n_i^2/n_0 \ll n_0$ |
| p-type | $p_0 = N_A$ | $n_0 = n_i^2/p_0 \ll p_0$ |
| intrinsic | $n_0 = p_0 = n_i$ | |

### Compensation and neutrality

A crystal can hold **both** donors and acceptors. This is called **compensation**. The donors' electrons fall into the acceptors' empty spots, so the two partly cancel, and the **larger** doping decides the type:

$$
N_D > N_A:\ n_0 \approx N_D - N_A, \qquad N_A > N_D:\ p_0 \approx N_A - N_D \tag{3.6}
$$

(This works when the difference is much bigger than $n_i$.) Then get the minority carrier from Eq. (3.5).

Underneath is a general rule, **electroneutrality**: a semiconductor is neutral overall, so positive and negative charge balance:

$$
N_D + p_0 = N_A + n_0 \tag{3.7}
$$

If neutrality were broken, huge fields and currents would appear and push it right back, so it holds even with current flowing. The one exception is the **boundary between two different materials**, which is where [[ch07-pn-junction#How a junction forms|junctions]] get their built-in field.

### Drift current and mobility

**Current is moving charge.** A positive charge going one way is equivalent to a negative charge going the other way. In an electric field:

- Electrons drift **against** $\vec{E}$.
- Holes drift **along** $\vec{E}$.
- Both currents point along $\vec{E}$, so they **add**.

**Heat alone doesn't make a current.** Above 0 K, carriers zip around randomly in every direction. With no field those motions average to zero, so there's no net current.

**Mobility.** With a field, a carrier speeds up but keeps bumping into the lattice, which acts like friction. The two balance out at a steady **drift velocity** proportional to the field, a bit like a raindrop reaching terminal speed:

$$
v_{dp} = \mu_p E, \qquad v_{dn} = -\mu_n E \tag{3.8}
$$

The constant $\mu$ is the **mobility**, in cm²/(V·s). It depends on the material, the temperature and the doping. More dopants means a messier crystal and more collisions, so $\mu$ falls as doping rises. Electrons have a bigger mobility than holes in the same material.

**Current density.** Let $I$ be the current (A), $A$ the cross-section it flows through (cm²), and $J = I/A$ the **current density** (A/cm²). In Eq. (3.8), $v_{dn}$ and $v_{dp}$ are the electron and hole drift velocities, $E$ the electric field, and $\mu_n$, $\mu_p$ the electron and hole mobilities. If charges $q$ with concentration $n$ (here a generic carrier concentration) move at drift speed $v_d$, everything within a distance $v_dt$ of a surface crosses it in time $t$. That gives $I = nqv_dA$, so

$$
J = n\,q\,v_d \tag{3.9}
$$

Apply this to holes ($q = +e$, $v_d = +\mu_pE$) and electrons ($q = -e$, $v_d = -\mu_nE$). Both come out positive, so

$$
J = J_p + J_n = e\,(\mu_p p_0 + \mu_n n_0)\,E = \sigma E \tag{3.10}
$$

$$
\sigma = e\,(\mu_n n_0 + \mu_p p_0), \qquad \rho = \frac{1}{\sigma} \tag{3.11}
$$

where $e = 1.602\times10^{-19}$ C is the [[ch01-electrostatics-review#Potential energy and potential|elementary charge]] (the magnitude of an electron's charge).

Equation (3.10) is **Ohm's law** at the microscopic level. $\sigma$ is the **conductivity** (S/cm) and $\rho$ is the **resistivity** (Ω·cm).

**Ohm's law for a bar.** Take a bar with length $L$ and cross-section $A$, with current flowing along the length. Then $V = EL$ and $I = JA$, so

$$
R = \frac{V}{I} = \frac{\rho L}{A} \tag{3.12}
$$

$A$ is the area **perpendicular** to the current, and $L$ is the distance **along** the current. Send the current through a different pair of faces and both change.

> [!tip] In strongly doped material I only use one carrier. In n-type, $n_0 \gg p_0$, so $\sigma \approx e\mu_n n_0$ and I drop the holes. In p-type, $\sigma \approx e\mu_p p_0$. I only keep both terms for nearly intrinsic or compensated samples, or when a problem asks how much current each carrier type carries.

## Key formulas

**Thermal energy**

$$
k_BT = 0.02586\ \text{eV at 300 K}, \qquad T(\text{K}) = T(^\circ\text{C}) + 273 \tag{3.1}
$$

**Carrier concentrations**

$$
n_0\,p_0 = n_i^2 \tag{3.5}
$$

$$
n\text{-type: } n_0 \approx N_D,\ p_0 = \frac{n_i^2}{n_0}; \qquad p\text{-type: } p_0 \approx N_A,\ n_0 = \frac{n_i^2}{p_0} \tag{3.3, 3.4}
$$

- $n_0$, $p_0$: electron and hole concentrations (cm⁻³)
- $N_D$, $N_A$: donor and acceptor concentrations (cm⁻³)
- $n_i$: intrinsic concentration, depends only on material and $T$

**Compensation and neutrality**

$$
N_D + p_0 = N_A + n_0, \qquad n_0 \approx N_D - N_A\ \text{(if } N_D > N_A\text{)} \tag{3.6, 3.7}
$$

**Drift**

$$
v_{dp} = \mu_pE, \quad v_{dn} = -\mu_nE, \qquad J = nqv_d \tag{3.8, 3.9}
$$

**Conductivity and Ohm's law**

$$
J = \sigma E, \qquad \sigma = e(\mu_nn_0 + \mu_pp_0), \qquad \rho = \frac{1}{\sigma}, \qquad R = \frac{\rho L}{A} \tag{3.10 – 3.12}
$$

- $\mu_n$, $\mu_p$: mobilities (cm²/V·s)
- $\sigma$: conductivity (S/cm); $\rho$: resistivity (Ω·cm)
- $e = 1.602\times10^{-19}$ C

## Examples

### Example 1: Doped silicon concentrations

A silicon crystal has one atom in every $10^8$ replaced with a Group V atom. Silicon has $5.0\times10^{22}$ atoms/cm³ and $n_i = 1.5\times10^{10}$ cm⁻³ at 300 K. Find $n_0$ and $p_0$.

The material is n-type. Donor concentration:

$$
N_D = \frac{5.0\times10^{22}}{10^{8}} = 5.0\times10^{14}\ \text{cm}^{-3} \gg n_i
$$

So by Eq. (3.3), $n_0 \approx N_D = 5.0\times10^{14}$ cm⁻³. Then Eq. (3.5):

$$
p_0 = \frac{n_i^2}{n_0} = \frac{(1.5\times10^{10})^2}{5.0\times10^{14}} = 4.5\times10^{5}\ \text{cm}^{-3}
$$

That's nine orders of magnitude fewer holes than electrons, so $p_0 \ll n_0$.

### Example 2: Compensated material

A silicon sample has $N_D = 1.0\times10^{16}$ cm⁻³ and $N_A = 3.0\times10^{16}$ cm⁻³ at 300 K. What type is it, and what are $n_0$ and $p_0$?

$N_A > N_D$, so the sample is **p-type**. By Eq. (3.6):

$$
p_0 \approx N_A - N_D = 3.0\times10^{16} - 1.0\times10^{16} = 2.0\times10^{16}\ \text{cm}^{-3}
$$

$$
n_0 = \frac{n_i^2}{p_0} = \frac{(1.5\times10^{10})^2}{2.0\times10^{16}} = 1.1\times10^{4}\ \text{cm}^{-3}
$$

> [!warning] The majority concentration is the **difference** $N_A - N_D$, not $N_A$. Using $N_A$ alone overestimates $p_0$ by 50% here.

### Example 3: Drift current density

An n-type silicon bar has $N_D = 1.0\times10^{16}$ cm⁻³ at 300 K. Find the drift current density in a field of $E = 20$ V/cm. Use $\mu_n = 1350$ cm²/V·s.

Strongly n-type, so $\sigma \approx e\mu_nn_0$ with $n_0 = N_D$:

$$
J = \sigma E = e\,\mu_n N_D\,E = (1.602\times10^{-19})(1350)(1.0\times10^{16})(20) = 43.3\ \text{A/cm}^2
$$

(Units: C · cm²/(V·s) · cm⁻³ · V/cm = C/(s·cm²) = A/cm² ✓.)

### Example 4: Resistance of a bar, two directions

A p-type silicon bar has $N_A = 1.0\times10^{16}$ cm⁻³. It is $4.0$ mm long, $1.0$ mm wide and $0.50$ mm thick. Find its resistance if the current goes (a) along the length, (b) through the thickness. Use $\mu_p = 480$ cm²/V·s.

**Resistivity.** Strongly p-type, so $\sigma \approx e\mu_pp_0$:

$$
\rho = \frac{1}{e\,\mu_p N_A} = \frac{1}{(1.602\times10^{-19})(480)(1.0\times10^{16})} = 1.30\ \Omega\cdot\text{cm}
$$

**(a) Along the length.** $L = 0.40$ cm, and the cross-section is width × thickness: $A = (0.10)(0.050) = 0.0050$ cm².

$$
R = \frac{\rho L}{A} = \frac{(1.30)(0.40)}{0.0050} = 104\ \Omega
$$

**(b) Through the thickness.** Now $L = 0.050$ cm, and the cross-section is length × width: $A = (0.40)(0.10) = 0.040$ cm².

$$
R = \frac{(1.30)(0.050)}{0.040} = 1.6\ \Omega
$$

> [!note] It's the same bar and the same material but two very different resistances, since a short, wide path is much easier than a long, thin one. Always get $L$ and $A$ from the current's direction.

### Example 5: Which carrier carries the current?

A p-type germanium rod is $6.00$ mm long, $1.00$ mm wide and $0.500$ mm thick, and has a resistance of $120\ \Omega$ along its length. Find (a) the impurity concentration and (b) the fraction of the conductivity due to electrons. Use $\mu_p = 1900$, $\mu_n = 3900$ cm²/V·s and $n_i = 2.4\times10^{13}$ cm⁻³.

**(a)** $L = 0.600$ cm, $A = (0.100)(0.0500) = 0.00500$ cm²:

$$
\rho = \frac{RA}{L} = \frac{(120)(0.00500)}{0.600} = 1.00\ \Omega\cdot\text{cm} \quad\Rightarrow\quad \sigma = 1.00\ \text{S/cm}
$$

For p-type, $\sigma \approx e\mu_pp_0$:

$$
p_0 = \frac{\sigma}{e\,\mu_p} = \frac{1.00}{(1.602\times10^{-19})(1900)} = 3.3\times10^{15}\ \text{cm}^{-3}
$$

This is far above $n_i$, so $N_A \approx p_0 = 3.3\times10^{15}$ cm⁻³.

**(b)** Electron concentration, then its share of $\sigma$:

$$
n_0 = \frac{n_i^2}{p_0} = \frac{(2.4\times10^{13})^2}{3.3\times10^{15}} = 1.7\times10^{11}\ \text{cm}^{-3}
$$

$$
\frac{\sigma_n}{\sigma} = \frac{\mu_n n_0}{\mu_n n_0 + \mu_p p_0} = \frac{(3900)(1.7\times10^{11})}{(3900)(1.7\times10^{11}) + (1900)(3.3\times10^{15})} = \frac{6.6\times10^{14}}{6.3\times10^{18}} \approx 1\times10^{-4}
$$

Electrons carry about $0.01\%$ of the current, which is why in a strongly doped sample you only consider the majority carrier.

### Example 6: Concept checks

**Is the carrier concentration equal to the number of valence electrons?** No. Silicon has about $5\times10^{22}$ atoms/cm³ (and four valence electrons each), but only about $10^{10}$ cm⁻³ of them are free at room temperature. Nearly all valence electrons are locked in bonds.

**A metal has only one carrier type and a semiconductor has two. Do the electron and hole currents oppose each other?** No. Electrons drift against $\vec{E}$ and holes drift along it, but both currents point along $\vec{E}$, so they **add**. Metals conduct better because they have far more free carriers ($\sim10^{22}$ cm⁻³), not because of any cancellation.

**Does the dominant positive charge in n-type material (the donor ions) carry current?** No. Donor ions are fixed in the lattice. They balance the mobile electrons' charge but they can't move, so they don't contribute to the current.

**Which carrier contributes more to $\sigma$?** Compare $\mu n$ for electrons against $\mu p$ for holes. If $n = p$ but $\mu_n = 3\mu_p$, electrons carry **three times** as much current. If $n = 2p$ and $\mu_n = 3\mu_p$, then $J_n/J_p = (3)(2) = 6$. Charge sign doesn't matter, since both terms add.

**Which direction gives the biggest current in a bar?** For a fixed applied voltage, $I = V/R$ and $R = \rho L/A$, so the largest current flows along the **shortest** path through the **largest** cross-section. If the bar has length $L$, width $W$ and height $H$ with $L > W > H$, that is the direction through the height $H$ (the shortest path, through the largest face of area $L \times W$).

## Common mistakes

- Using $n_0p_0 = n_i^2$ with $n_i$ from the wrong material or temperature
- Setting $n_0 = N_D$ in a **compensated** sample instead of $N_D - N_A$
- Forgetting that the minority carrier isn't zero. It's $n_i^2/n_0$, which is tiny but matters for devices
- Taking holes to drift against the field. Holes go **with** $\vec{E}$ and electrons go **against** it, and both currents point along $\vec{E}$ and add
- Mixing cm and m in $R = \rho L/A$ (ρ in Ω·cm needs lengths in cm and area in cm²)
- Using the same $A$ and $L$ for current along a different direction of the bar
- Assuming a doped sample is charged. It stays electrically neutral, since the fixed ions balance the mobile carriers
- Using $\mu$ from the intrinsic table at very high doping (mobility drops as impurity concentration rises)
