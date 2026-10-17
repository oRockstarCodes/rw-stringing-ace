---
title: "3. Introduction to Semiconductors"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **3.2.1, 3.2.4, 4.3.2, 6.1.1** (ignore the band model), **5.1.1, 5.1.3** · Serway & Jewett **26.1, 26.2** · week 3

A semiconductor is a material whose ability to carry current can be **tuned**: by temperature, by light, and above all by adding tiny amounts of impurity atoms (doping). That tunability is the whole reason semiconductors run the world's electronics.

This chapter treats semiconductors with **classical** physics, in the bond picture, before the quantum band picture arrives in [[ch05-band-structure-and-fermi-function|Chapter 5]]. Two questions drive it:

1. **How many carriers are there?** Free electrons and holes, in pure and doped material, governed by one equation, $n_0 p_0 = n_i^2$.
2. **How much current do they carry?** Drift in an electric field, set by the **mobility** $\mu$, which gives $J = \sigma E$ (Ohm's law).

## Notes

### Intrinsic semiconductors: electrons and holes

**The bond picture.** In a silicon crystal, each Si atom (4 valence electrons) forms **four covalent bonds** with its four neighbours. At $T = 0$ K every bond is intact and every valence electron is locked in a bond. There are no free carriers, so a semiconductor is an **insulator at 0 K**.

Breaking one bond takes $E_g = 1.12$ eV in silicon (the **band gap**, which becomes a picture of energy bands in Chapter 5).

**Temperature supplies that energy.** Temperature measures the random thermal motion of particles, and the average extra thermal energy per particle is of the order of $\frac{3}{2}k_BT$. The number to remember is

$$
k_BT = 0.02586\ \text{eV} \quad \text{at } T = 300\ \text{K} \tag{3.1}
$$

with $k_B = 8.617\times10^{-5}$ eV/K $= 1.381\times10^{-23}$ J/K, and $T(\text{K}) = T(^\circ\text{C}) + 273$. That's tiny compared with $1.12$ eV, but with a very large number of bonds, a small fraction still break.

When a bond breaks, two carriers appear:

- A **free electron**, which can move through the crystal (concentration $n_0$, in cm⁻³).
- A **hole**, the empty bond it left behind (concentration $p_0$, in cm⁻³).

**A hole is a mobile positive charge.** A neighbouring bond's electron can hop into the empty bond, which moves the hole the other way. Many electrons shifting a little looks, collectively, like one positive charge drifting **in the direction of the electric field**. It's far easier to describe that motion with one positive carrier than to track every electron.

In a pure (**intrinsic**) semiconductor, every broken bond makes one electron and one hole, so

$$
n_0 = p_0 = n_i \tag{3.2}
$$

where $n_i$ is the **intrinsic carrier concentration**. It depends only on the material and on temperature: a material with a weaker bond (smaller $E_g$) has a larger $n_i$.

> [!tip] Pure-water analogy. Pure water has equal numbers of H⁺ and OH⁻ ions. Adding acid gives many more H⁺ than OH⁻. Adding base does the opposite. Doping is the semiconductor's acid and base.

| Material | $E_g$ (eV) | $n_i$ (cm⁻³) at 300 K | $\mu_n$ (cm²/V·s) | $\mu_p$ (cm²/V·s) |
| --- | --- | --- | --- | --- |
| Si | 1.12 | $1.5\times10^{10}$ | 1350 | 480 |
| Ge | 0.67 | $2.4\times10^{13}$ | 3900 | 1900 |
| GaAs | 1.43 | $1.8\times10^{6}$ | 8500 | 400 |

> [!note] These are the usual textbook (Neamen) values at 300 K. Real exams give the numbers they want you to use, so use those first. Electrons are more mobile than holes in every material here.

### Doping: extrinsic semiconductors

Adding small, controlled amounts of impurity atoms is **doping**. A doped semiconductor is **extrinsic**.

**n-type.** Replace a few Si atoms with a **Group V** atom such as phosphorus (5 valence electrons). Four electrons fill the bonds, and the fifth is left over and is easily freed. Each such impurity is a **donor**, with concentration $N_D$. If $N_D \gg n_i$, essentially every donor provides one free electron:

$$
n_0 \approx N_D \tag{3.3}
$$

**p-type.** Replace a few Si atoms with a **Group III** atom such as boron (3 valence electrons). One bond is missing an electron, and a neighbouring bond's electron can fill it, leaving a hole behind. Each such impurity is an **acceptor**, with concentration $N_A$. If $N_A \gg n_i$:

$$
p_0 \approx N_A \tag{3.4}
$$

In an n-type material electrons are the **majority** carriers and holes are the **minority** carriers (and the reverse in p-type).

> [!note] Doping adds mobile carriers of one sign without making the crystal charged: each donor atom is a *fixed* positive ion that exactly balances the electron it gave up. The details, and why the donor electron is so loosely bound, are in [[ch04-hall-effect-bohr-model-doping|Chapter 4]].

### The fundamental semiconductor equation

Even in doped material, the electron and hole concentrations are tied together:

$$
n_0\,p_0 = n_i^2 \tag{3.5}
$$

**Why it's true.** In thermal equilibrium, electron–hole pairs are constantly being created and destroyed, and the two rates are equal.

- **Generation.** Thermal energy breaks bonds at a rate $G$ that depends only on the temperature and host material, **not** on the doping. It's the same for n-type, p-type, and intrinsic samples of the same material.
- **Recombination.** A free electron falls into a hole and both disappear. This rate is proportional to the number of electrons *times* the number of holes: $R = r\,n_0 p_0$.
- **Equilibrium.** $R = G$. For the intrinsic sample, $G = r\,n_i p_i = r\,n_i^2$. For any other sample of the same material, $G = r\,n_0 p_0$. Setting the two equal gives Eq. (3.5).

So $n_i$ is a property of the *host* material and temperature, and doping can't change it. Adding donors raises $n_0$ and **lowers $p_0$** in exactly the amount that keeps $n_0p_0$ fixed.

**Recipe.** Always find the **majority** concentration first, then use Eq. (3.5) for the minority:

| Material | Majority | Minority |
| --- | --- | --- |
| n-type | $n_0 = N_D$ | $p_0 = n_i^2/n_0 \ll n_0$ |
| p-type | $p_0 = N_A$ | $n_0 = n_i^2/p_0 \ll p_0$ |
| intrinsic | $n_0 = p_0 = n_i$ | |

### Compensated material and electroneutrality

A crystal can contain **both** donors and acceptors. This is called **compensation**. The donors' electrons fall into the acceptors' empty states, so the two partly cancel, and the **larger** doping decides the type:

$$
N_D > N_A:\ n_0 \approx N_D - N_A, \qquad N_A > N_D:\ p_0 \approx N_A - N_D \tag{3.6}
$$

(valid when the difference is much larger than $n_i$). Then find the minority carrier from Eq. (3.5).

This is a special case of the **electroneutrality** condition. A semiconductor is, on average, electrically neutral, so the positive and negative charges balance:

$$
N_D + p_0 = N_A + n_0 \tag{3.7}
$$

Breaking neutrality would produce huge fields and currents that push the material straight back, so it holds in equilibrium and with current flowing. The exception is the **interface between two different materials**, which is exactly where junctions get their built-in field.

### Drift current and mobility

**Current is moving charge.** Current is the rate at which charge crosses a surface. A flow of positive charges one way is equivalent to a flow of negative charges the other way, so in an electric field:

- Electrons drift **against** $\vec{E}$.
- Holes drift **along** $\vec{E}$.
- Both contribute current in the **same** direction (along $\vec{E}$), so they **add**.

**Thermal motion alone carries no current.** At any $T > 0$, carriers move randomly at high speed in every direction, but without a field these motions average to zero, so there's no net current.

**Mobility.** With a field, a carrier is accelerated by the electric force but keeps colliding with the lattice ions, which acts like friction. The balance gives a steady **drift velocity** proportional to the field, like the terminal speed of a raindrop:

$$
v_{dp} = \mu_p E, \qquad v_{dn} = -\mu_n E \tag{3.8}
$$

The constant $\mu$ is the **mobility**, in cm²/(V·s). It depends on the host material, the temperature, and the impurity concentration: more dopants means more irregularity in the crystal and more collisions, so $\mu$ falls as doping rises. Electrons have a larger mobility than holes in the same material.

**Current density.** Let $J = I/A$ (A/cm²). Charges $q$ with concentration $n$ moving at speed $v_d$ cross an area $A$ in time $t$ if they're within a length $v_dt$, so $I = nqv_dA$ and

$$
J = n\,q\,v_d \tag{3.9}
$$

Apply this to holes ($q = +e$, $v_d = +\mu_pE$) and electrons ($q = -e$, $v_d = -\mu_nE$). Both give a positive contribution, so

$$
J = J_p + J_n = e\,(\mu_p p_0 + \mu_n n_0)\,E = \sigma E \tag{3.10}
$$

$$
\sigma = e\,(\mu_n n_0 + \mu_p p_0), \qquad \rho = \frac{1}{\sigma} \tag{3.11}
$$

Eq. (3.10) is **Ohm's law** in its microscopic form. $\sigma$ is the **conductivity** (S/cm), and $\rho$ is the **resistivity** (Ω·cm).

**Ohm's law for a bar.** For a bar of length $L$ and cross-sectional area $A$ with current along its length, $V = EL$ and $I = JA$, so

$$
R = \frac{V}{I} = \frac{\rho L}{A} \tag{3.12}
$$

Here $A$ is the area **perpendicular** to the current and $L$ is the length **along** the current. Pass the current through a different pair of faces and both of them change.

> [!tip] Strongly doped material: use one carrier. In n-type material $n_0 \gg p_0$, so $\sigma \approx e\mu_n n_0$ and you can ignore the holes. In p-type, $\sigma \approx e\mu_p p_0$. Keep both terms only for nearly intrinsic or compensated samples, or when the problem asks for the share of the current each carries.

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

> Like the "one atom in $10^8$" clicker questions

A silicon crystal has one atom in every $10^8$ replaced with a Group V atom. Silicon has $5.0\times10^{22}$ atoms/cm³ and $n_i = 1.5\times10^{10}$ cm⁻³ at 300 K. Find $n_0$ and $p_0$.

The material is n-type. Donor concentration:

$$
N_D = \frac{5.0\times10^{22}}{10^{8}} = 5.0\times10^{14}\ \text{cm}^{-3} \gg n_i
$$

So by Eq. (3.3), $n_0 \approx N_D = 5.0\times10^{14}$ cm⁻³. Then Eq. (3.5):

$$
p_0 = \frac{n_i^2}{n_0} = \frac{(1.5\times10^{10})^2}{5.0\times10^{14}} = 4.5\times10^{5}\ \text{cm}^{-3}
$$

That's nine orders of magnitude fewer holes than electrons: $p_0 \ll n_0$.

### Example 2: Compensated material

> Like the compensated GaAs clicker question

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

> Like the $N_d = 2\times10^{15}$, $E = 35$ V/cm clicker

An n-type silicon bar has $N_d = 1.0\times10^{16}$ cm⁻³ at 300 K. Find the drift current density in a field of $E = 20$ V/cm. Use $\mu_n = 1350$ cm²/V·s.

Strongly n-type, so $\sigma \approx e\mu_nn_0$ with $n_0 = N_d$:

$$
J = \sigma E = e\,\mu_n N_d\,E = (1.602\times10^{-19})(1350)(1.0\times10^{16})(20) = 43.3\ \text{A/cm}^2
$$

(Units: C · cm²/(V·s) · cm⁻³ · V/cm = C/(s·cm²) = A/cm² ✓.)

### Example 4: Resistance of a bar, two directions

> Like the 6 mm × 1 mm × 0.5 mm bar clicker

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

> [!note] Same bar, same material, two very different resistances: a short, wide path is much easier than a long, thin one. Always identify $L$ and $A$ from the current's direction.

### Example 5: Which carrier carries the current?

> Like Example 1 on the slides (Ge rod, 120 Ω)

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

Electrons carry about $0.01\%$ of the current. This is why in a strongly doped sample you only consider the majority carrier.

## Common mistakes

- Using $n_0p_0 = n_i^2$ with $n_i$ from the wrong material or temperature
- Setting $n_0 = N_D$ in a **compensated** sample instead of $N_D - N_A$
- Forgetting that the minority carrier is not zero: it's $n_i^2/n_0$, tiny but important for devices
- Taking holes to drift against the field. Holes go **with** $\vec{E}$, electrons **against**, and both currents point along $\vec{E}$ and add
- Mixing cm and m in $R = \rho L/A$ (ρ in Ω·cm needs lengths in cm and area in cm²)
- Using the same $A$ and $L$ for current along a different direction of the bar
- Assuming a doped sample is charged. It stays electrically neutral, since the fixed ions balance the mobile carriers
- Using $\mu$ from the intrinsic table at very high doping (mobility drops as impurity concentration rises)
