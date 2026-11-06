---
title: "4. Hall Effect, Bohr Model & Doping"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **5.4, 4.2** · Serway & Jewett **41.1–41.3** · week 4

This chapter answers three questions left open by [[ch03-intro-to-semiconductors|Chapter 3]]:

1. **The Hall effect:** how do we actually *measure* the sign, concentration and [[ch03-intro-to-semiconductors#Drift current and mobility|mobility]] of the carriers? A magnetic field pushes the carriers sideways, and a small voltage appears across the sample. It's one of the most-used measurement techniques in the semiconductor industry, and it's Lab 2 ([[#What Lab 2 looked like|our data is below]]).
2. **The Bohr model:** why are atomic energies *discrete*? This is the first successful quantum model of an atom, and it introduces the idea of **allowed levels** that [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|Chapter 5]] turns into bands.
3. **Doping in energy terms:** why does a dopant atom give up its extra carrier so easily at room temperature? Because the [[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|donor]] electron is only loosely held. It takes just about $0.045$ eV to free it.

## Notes

### Magnetic force on a moving charge

A charge $q$ moving with velocity $\vec{v}$ in a magnetic field $\vec{B}$ feels a force

$$
\vec{F}_m = q\,\vec{v}\times\vec{B}, \qquad F_m = |q|\,v\,B\sin\theta \tag{4.1}
$$

Here $q$ is the charge (C, signed), $\vec{v}$ is its velocity, $\vec{B}$ is the magnetic field (T), and $\theta$ is the angle between $\vec{v}$ and $\vec{B}$. The force is at right angles to both, so it bends the path without changing the speed.

- Magnetic field lines are closed loops. (Electric field lines run from $+$ to $-$.)
- The **right-hand rule** gives the force on a **positive** charge. Point your fingers along $\vec{v}$, curl them toward $\vec{B}$, and your thumb points along $\vec{F}_m$. For a negative charge, flip the answer.
- The unit is $[B] = \text{T} = \text{V}\cdot\text{s/m}^2$ (derived in [[ch01-electrostatics-review#Example 5: Units check|Chapter 1]]).

**The trick that makes the Hall effect easy.** The current is $I = nqv_dA$ (from [[ch03-intro-to-semiconductors#Drift current and mobility|Chapter 3]]: $n$ is the carrier concentration, $q$ the carrier charge, $v_d$ the drift velocity and $A$ the cross-sectional area the current flows through), so $q\vec{v}$ points along the conventional current $\vec{I}$ no matter whether the carriers are electrons or holes. That means

$$
\vec{F}_m \parallel \vec{I}\times\vec{B} \tag{4.2}
$$

for **both signs**. Positive and negative carriers get pushed to the *same* side. The only difference is the **sign of the charge that builds up** there.

### The Hall effect

In 1879, Edwin Hall found that a current-carrying conductor in a magnetic field develops a voltage $V_H$ across it, perpendicular to both the current and the field.

**Setup.** Take a flat strip of length $L$, width $W$ and thickness $d$. Current $I$ flows along $L$. The field $B$ points through the thickness (perpendicular to the flat face), as in Figure 4.1.

![[pcs-224-hall-geometry.svg]]
*Figure 4.1: Hall geometry. The current runs along $L$, $B$ is along $d$, and $V_H$ is measured across the width $W$.*

**What happens, step by step:**

1. By Eq. (4.2), the magnetic force pushes the carriers toward one **edge** of the strip.
2. Charge piles up on that edge, and the opposite edge is left with the opposite charge.
3. That separated charge makes a sideways electric field, the **Hall field** $E_H$, which pushes the carriers back.
4. Very quickly the electric push balances the magnetic push, the sideways drift stops, and the carriers go straight again.

At balance the electric force $qE_H$ equals the magnetic force $q\,v_d\,B$ (the carriers move at the drift speed $v_d$, perpendicular to $B$, so $\sin\theta = 1$):

$$
qE_H = q\,v_d\,B \quad\Rightarrow\quad E_H = v_d\,B \tag{4.3}
$$

The voltage across the width is

$$
V_H = E_H\,W = v_d\,B\,W \tag{4.4}
$$

We can't measure the drift speed directly, so swap it for things we can. The current is $I = n\,q\,v_d\,(Wd)$, so $v_d = \dfrac{I}{nqWd}$, and

$$
V_H = \frac{I\,B}{q\,n\,d} \tag{4.5}
$$

Here $q$ means the magnitude of the carrier charge, $e$. Notice the width $W$ cancelled. Only the **thickness along $B$** matters.

**Finding the carrier sign.** Which edge ends up positive tells you who the carriers are.

<div class="melon-semi" data-view="hall">Interactive Hall effect diagram (open this page on the site to use it).</div>
*Figure 4.2: In both samples the force points the same way, so both carrier types pile up on the same edge. In p-type that edge is positive, and in n-type it's negative. Switch between the two and flip B to see it.*

- **p-type:** holes pile up on the deflected edge, so it's at a higher potential and $V_H > 0$ in the standard setup.
- **n-type:** electrons pile up there, so it's at a lower potential and $V_H < 0$.

For any specific problem:

1. Work out the direction of $\vec{I}\times\vec{B}$. That's the edge the carriers get pushed to.
2. See whether the voltmeter says that edge is at a higher or a lower potential.
3. Higher means positive carriers (p-type). Lower means negative carriers (n-type).

> [!tip] Here's a quick case. $I$ to the right and $B$ into the page push carriers to the top edge. If the voltmeter reads the top edge as *negative*, the carriers are electrons.

### Measuring concentration, mobility and resistivity

One Hall sample gives you three numbers.

**Carrier concentration**, from Eq. (4.5):

$$
n\ (\text{or } p) = \frac{I\,B}{q\,d\,|V_H|} \tag{4.6}
$$

> [!warning] Watch the units. Tesla contains **metres**. If you write $d$ in cm, you'd have to convert $B$ too. I just convert $d$ to metres, get $n$ in m⁻³, and divide by $10^6$ to get cm⁻³.

**Mobility.** Mobility is defined by $v_d = \mu E$, where $E$ is the field that **drives the current** along the bar, $E_x = V/L$ from the power supply. It is *not* the Hall field. The drift speed comes from Eq. (4.4):

$$
v_d = \frac{V_H}{B\,W}, \qquad \mu = \frac{v_d}{E_x} = \frac{V_H/(BW)}{V/L} \tag{4.7}
$$

**Resistivity.** From the supply voltage and current, $R = V/I$ and $\rho = RA/L$ with $A = Wd$.

These are tied together by $\sigma = q\,n\,\mu$ (or $q\,p\,\mu$), which makes a good check on your numbers.

> [!note] A Hall problem has **two** electric fields and **two** voltages. One drives the current along $L$, and one is the Hall field across $W$. Use the first for mobility and resistance, and the second for the carrier sign and concentration. Mixing them up is the most common mistake.

### What Lab 2 looked like

Lab 2 ran this whole section on a real sample: a **germanium wafer** with $L = 10.0$ mm, $W = 5.0$ mm and thickness $d = 1.0$ mm, sitting between two permanent magnets. The field was measured with a Gauss meter at five spots on the magnet face. The readings ran from $0.215$ T to $0.226$ T, so we used their average, $B = 0.2198$ T, and the spread across the face is the biggest field uncertainty (about $\pm2.5\%$).

We stepped the supply current down from $50$ mA to $1.4$ mA and recorded two voltages at each step. The two voltages came from two different pairs of terminals on the board: the Hall voltage $V_H$ across the width (terminals near the centre), and the longitudinal voltage $V_L$ along the length (the supply ports). That's the "two fields, two voltages" warning above, as physical wires.

| $I$ (mA) | $V_H$ (mV) | $V_L$ (V) |
| --- | --- | --- |
| 50.0 | $-122.7$ | 4.83 |
| 30.0 | $-74.2$ | 2.87 |
| 10.0 | $-24.5$ | 0.94 |
| 1.4 | $-3.6$ | 0.12 |

(The full run had eleven currents. $V_H$ is good to $\pm0.05$ mV, $V_L$ to $\pm0.005$ V.)

**Sign.** $V_H$ was negative at every current. The deflection direction from $\vec{I}\times\vec{B}$ put the carriers at the front edge, where the multimeter's $+$ lead was attached, so that edge held negative charge. The carriers are **electrons**, which makes the wafer **n-type**. That's the three-step recipe from earlier, run on real polarity.

**Concentration.** Eq. (4.5) says $V_H = \dfrac{B}{q\,n\,d}\,I$, so $V_H$ against $I$ is a straight line through the origin with slope $\dfrac{B}{qnd}$. The fit gave a slope of $-2.46$ mV/mA (which is $-2.46\ \Omega$) and an intercept of only $-0.1$ mV, close to zero as the equation says. Solving for $n$:

$$
n = \frac{B}{q\,d\,|\text{slope}|} = \frac{0.2198}{(1.602\times10^{-19})(1.0\times10^{-3})(2.46)} = 5.6\times10^{20}\ \text{m}^{-3} = 5.6\times10^{14}\ \text{cm}^{-3}
$$

That's about $23\times$ the intrinsic concentration of germanium ($n_i = 2.4\times10^{13}$ cm⁻³, the value used in [[ch03-intro-to-semiconductors#Example 5: Which carrier carries the current?|Chapter 3's germanium example]]), which is what a lightly n-doped sample should look like. Using the thickness $d$ is the point: the width $W$ never appears in this formula. A single point from Eq. (4.6) agrees ($5.59\times10^{20}$ m⁻³ at $50$ mA), but the fit uses all eleven points and averages out the noise.

**Mobility.** Eq. (4.7) says $\mu = \dfrac{V_H/(BW)}{V_L/L}$, so $V_H$ against $V_L$ is also a straight line, with slope $\dfrac{\mu W B}{L}$. We measured $-25.4$ mV/V, so

$$
\mu = \frac{|\text{slope}|\,L}{W\,B} = \frac{(0.0254)(10.0\times10^{-3})}{(5.0\times10^{-3})(0.2198)} = 0.231\ \frac{\text{m}^2}{\text{V}\cdot\text{s}} = 2311\ \frac{\text{cm}^2}{\text{V}\cdot\text{s}}
$$

At $50$ mA this is $v_d = V_H/(BW) = 112$ m/s in a driving field of $E_x = V_L/L = 483$ V/m, and $112/483 = 0.231$ ✓.

**How good was it?** The mobility came out $41\%$ below the accepted $\mu_n = 3900$ cm²/V·s for germanium, even though the statistical error in the fitted slope was only about $0.3\%$. A gap that size is systematic, not noise. The likely causes:

- **Contact and lead resistance.** $V_L$ was read across the whole wafer, contacts included, so it overstates the field $E_x$ actually driving the carriers. A too-big $E_x$ in $\mu = v_d/E_x$ makes $\mu$ too small.
- **Heating.** At $50$ mA and $4.83$ V the wafer dissipates about $0.24$ W. A warmer lattice scatters carriers more, and [[ch03-intro-to-semiconductors#Drift current and mobility|mobility drops with temperature]].
- **A non-uniform field.** The $\pm2.5\%$ spread in $B$ feeds into both $n$ and $\mu$.

> [!note] The resistivity from this data is $R = V_L/I = 96.6\ \Omega$, so $\rho = RWd/L = 4.8\ \Omega\cdot\text{cm}$ and $\sigma = 0.207$ S/cm. That matches $q\,n\,\mu = 0.207$ S/cm exactly. Don't take that as a verdict on the data, though. Because $n$ comes from $V_H/I$ and $\mu$ from $V_H/V_L$, the product $qn\mu$ is algebraically $I L/(W d V_L) = 1/\rho$ whatever $V_H$ is. So the check catches arithmetic and unit slips (it caught none here) but says nothing about a bad $V_L$.

### Why are energies discrete? The Bohr model

By the end of the 1800s, electricity and magnetism were well understood, but two puzzles remained.

**Puzzle 1: line spectra.** A hot solid (a light bulb) or the sun gives off a **continuous** rainbow. A hot gas, like a neon sign, gives off only certain **discrete colours**. Classical physics couldn't explain that. For hydrogen, Balmer found that the visible lines fit

$$
\frac{1}{\lambda} = R_H\left(\frac{1}{2^2} - \frac{1}{n^2}\right), \qquad n = 3, 4, 5, \dots \tag{4.8}
$$

where $\lambda$ is the wavelength of the line, $R_H = 1.097\times10^{7}$ m⁻¹ is the **Rydberg constant** for hydrogen, and $n$ is a whole number labelling which line (the same $n$ as the quantum number below, *not* the carrier concentration from [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|Chapter 3]]).

**Puzzle 2: stability.** If an electron orbits the nucleus, it's constantly accelerating, and an accelerating charge radiates energy. A classical electron would spiral into the nucleus in about $10^{-11}$ s. Atoms obviously don't collapse.

**Bohr's idea (1913).** Only **certain orbits are allowed**, and an electron in one of them does **not** radiate. Each allowed orbit has one specific energy, called an **allowed level**. We say the energies are **discrete** (also called **quantized**): the electron can have the energy of one level or another, but never a value in between.

$$
r_n = n^2 a_0, \qquad a_0 = 5.29\times10^{-11}\ \text{m} \tag{4.9}
$$

$$
E_n = -\frac{13.6\ \text{eV}}{n^2}, \qquad n = 1, 2, 3, \dots \tag{4.10}
$$

- $n$ is the **principal quantum number**. $n = 1$ is the **ground state** and $n > 1$ are **excited states**. In this section $n$ always means this whole number, never a carrier concentration.
- $r_n$ is the radius of the $n$th orbit, and $a_0$ is the **Bohr radius**, the radius of the ground-state orbit. $E_n$ is the energy of the $n$th level (the $13.6$ eV is hydrogen's ionization energy).
- The energies are **negative** because the electron is bound. $E = 0$ means a free electron at rest, and the ground state sits $13.6$ eV below that.

![[pcs-224-bohr-levels.svg]]
*Figure 4.3: Hydrogen energy levels. A photon is emitted or absorbed when the electron jumps between levels. The ionization limit is $E = 0$.*

**Jumps between levels.** The atom only emits or absorbs light when the electron jumps, and the photon carries exactly the energy difference:

$$
hf = |E_i - E_f| = 13.6\left|\frac{1}{n_f^2} - \frac{1}{n_i^2}\right|\ \text{eV} \tag{4.11}
$$

- $hf$ is the photon energy ($h$ Planck's constant, $f$ the light's frequency, [[ch02-photoelectric-effect#Einstein's photon picture (1905)|Chapter 2]]). $E_i$ and $E_f$ are the energies of the initial and final levels, and $n_i$, $n_f$ are their quantum numbers (here $n_i$ means "initial $n$", **not** the [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|intrinsic carrier concentration]]).
- **Emission:** the electron drops to a lower level and a photon leaves.
- **Absorption:** the reverse of emission. The electron takes in a photon and jumps **up** to a higher level. The electron can only sit in an allowed level, with nothing in between, so it can't take "a bit of energy" and move partway. The photon has to carry **exactly** the gap between two levels, $E_{\text{upper}} - E_{\text{lower}}$. Any other photon passes through. (A photon with *more* than the ionization energy removes the electron completely.)
  - *Example:* for hydrogen going from $n = 1$ to $n = 2$, the photon must carry $13.6\left(1 - \tfrac{1}{4}\right) = 10.2$ eV. A $10.2$ eV photon is absorbed. An $8$ eV photon passes through, because no level sits $8$ eV above $n = 1$. An $11$ eV photon also passes through, because it doesn't match any gap either.
  - *Above the ionization energy:* once the photon carries at least $13.6$ eV (from the ground state), the electron is pulled free. A free electron has no allowed-energy restriction, so any extra energy just becomes its kinetic energy. Past that threshold, any photon works, not only exact matches.
- **Ionization** means removing the electron completely, so the atom is left as a positive ion. In energy terms, the electron is lifted from its level up to $E = 0$ (a free electron at rest). The energy that costs is $0 - E_n$, so ionization from level $n$ costs $13.6/n^2$ eV. An atom that is already excited is easier to ionize than one in the ground state, because it starts closer to $E = 0$. The donor electron in the next section is the same idea with a much smaller energy: ionizing it means lifting it from $E_d$ up to $E_c$.

Equation (4.11) reproduces the observed spectral lines exactly, which is why Bohr's model convinced everyone.

> [!warning] Bohr's formulas are exact only for **one-electron** atoms like hydrogen. Many-electron atoms and real crystals need full quantum mechanics ([[ch05-band-structure-and-fermi-function#Quantum rules for many electrons|Chapter 5]]). The big lesson survives, though: **electron energies are discrete** (quantized), with only certain allowed levels.

### Doping in the Bohr picture

Why does a Group V dopant let go of its extra electron so easily? Phosphorus's fifth electron sits **outside** the four bonds and orbits the P⁺ ion, like an electron around a proton. It's basically a hydrogen atom sitting inside the silicon crystal. Two things make it far more loosely bound than the $13.6$ eV of real hydrogen:

1. The crystal has a **larger [[ch01-electrostatics-review#Electric fields and forces|permittivity]]** than vacuum, which weakens the Coulomb attraction.
2. The electron's **effective mass** in the crystal is smaller than its mass in vacuum.

Both effects shrink the binding energy and enlarge the orbit. (In the hydrogen formula the binding energy scales with the electron's mass and with $1/\varepsilon^2$, where $\varepsilon = \varepsilon_r\varepsilon_0$ is the material's permittivity. Silicon has $\varepsilon_r = 11.7$ and an effective mass well below the free-electron mass, so the $13.6$ eV drops by a factor of a few hundred.) For phosphorus in silicon, the **ionization energy** is only

$$
E_c - E_d \approx 0.045\ \text{eV} \tag{4.12}
$$

Here $E_c$ is the energy of the bottom of the [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|conduction band]] (the lowest energy a free electron can have in the crystal) and $E_d$ is the energy of the donor electron's level.

![[pcs-224-doping-levels.svg]]
*Figure 4.4: Dopant levels in the band gap. The donor level $E_d$ sits just below $E_c$ and the acceptor level $E_a$ just above $E_v$. Both are about $0.045$ eV from the nearest band edge in silicon.*

**n-type (donors).** The donor electron sits at a level $E_d$ just below the bottom of the conduction band $E_c$. At $0$ K it stays put. At room temperature $k_BT = 0.026$ eV is about the same size as $0.045$ eV, so nearly **all** donors give up their electron. That adds free electrons without adding holes.

**p-type (acceptors).** A Group III atom like boron leaves a bond short, which gives an empty level $E_a$ just above the top of the valence band $E_v$ (again about $0.045$ eV for B in Si). At room temperature, valence electrons hop into it easily. That adds holes without adding electrons.

> [!note] The key words are "just below $E_c$" and "just above $E_v$". A dopant level in the *middle* of the gap would never ionize at room temperature and would be useless. [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|Chapter 5]] builds up the band language ($E_c$, $E_v$, $E_F$) properly.

## Key formulas

**Magnetic force**

$$
F_m = |q|\,v\,B\sin\theta, \qquad \vec{F}_m \parallel \vec{I}\times\vec{B} \tag{4.1, 4.2}
$$

**Hall effect**

$$
E_H = v_dB, \qquad V_H = E_HW = v_dBW = \frac{I\,B}{q\,n\,d} \tag{4.3 – 4.5}
$$

$$
n\ (\text{or } p) = \frac{I\,B}{q\,d\,|V_H|}, \qquad \mu = \frac{v_d}{E_x} = \frac{V_H/(BW)}{V/L} \tag{4.6, 4.7}
$$

- $I$: current along the bar; $B$: field along the thickness
- $d$: thickness (along $B$); $W$: width (across which $V_H$ is measured); $L$: length
- $V$: supply voltage across $L$; $E_x = V/L$ is the field that drives the current; $\mu$: mobility; $v_d$: drift speed
- $q$: magnitude of the carrier charge ($e = 1.602\times10^{-19}$ C); $n$ (or $p$): carrier concentration; $\theta$: angle between $\vec{v}$ and $\vec{B}$
- Standard setup: $V_H > 0$ for p-type, $V_H < 0$ for n-type

**Bohr model**

$$
r_n = n^2a_0, \quad a_0 = 5.29\times10^{-11}\ \text{m}, \qquad E_n = -\frac{13.6\ \text{eV}}{n^2} \tag{4.9, 4.10}
$$

$$
hf = |E_i - E_f| = 13.6\left|\frac{1}{n_f^2} - \frac{1}{n_i^2}\right|\ \text{eV}, \qquad \lambda\ (\text{nm}) = \frac{1240}{E\ (\text{eV})} \tag{4.11}
$$

**Dopant ionization energy (P or B in Si)**

$$
E_c - E_d \approx E_a - E_v \approx 0.045\ \text{eV} \tag{4.12}
$$

## Examples

### Example 1: Hall voltage and Hall field

A p-type silicon Hall sample has $p = 5.0\times10^{15}$ cm⁻³. It is $d = 0.20$ mm thick and $W = 2.0$ mm wide, and carries $I = 2.0$ mA in a field $B = 0.10$ T. Find (a) $V_H$ and (b) the Hall field.

**(a)** Convert to SI: $p = 5.0\times10^{15}\ \text{cm}^{-3} = 5.0\times10^{21}\ \text{m}^{-3}$ and $d = 2.0\times10^{-4}$ m. By Eq. (4.5):

$$
V_H = \frac{IB}{q\,p\,d} = \frac{(2.0\times10^{-3})(0.10)}{(1.602\times10^{-19})(5.0\times10^{21})(2.0\times10^{-4})} = 1.25\times10^{-3}\ \text{V} = 1.25\ \text{mV}
$$

It's positive because the carriers are holes.

**(b)** Hall field across the width:

$$
E_H = \frac{V_H}{W} = \frac{1.25\times10^{-3}}{2.0\times10^{-3}} = 0.62\ \text{V/m} = 0.0062\ \text{V/cm}
$$

### Example 2: Everything from one measurement

A semiconductor bar has $L = 2.0$ mm, $W = 0.20$ mm and $d = 0.020$ mm. With $I = 2.0$ mA, a supply voltage $V = 10$ V along the bar and $B = 0.10$ T, the Hall voltage is $V_H = -4.0$ mV. Find (a) the type and concentration of carriers, (b) the mobility, and (c) the resistivity.

**(a) Type and concentration.** $V_H < 0$, so the carriers are **electrons** (n-type). Eq. (4.6), with $d = 2.0\times10^{-5}$ m:

$$
n = \frac{IB}{q\,d\,|V_H|} = \frac{(2.0\times10^{-3})(0.10)}{(1.602\times10^{-19})(2.0\times10^{-5})(4.0\times10^{-3})} = 1.56\times10^{22}\ \text{m}^{-3} = 1.6\times10^{16}\ \text{cm}^{-3}
$$

**(b) Mobility.** The drift speed from Eq. (4.4), and the driving field from the supply:

$$
v_d = \frac{|V_H|}{BW} = \frac{4.0\times10^{-3}}{(0.10)(2.0\times10^{-4})} = 200\ \text{m/s}, \qquad E_x = \frac{V}{L} = \frac{10}{2.0\times10^{-3}} = 5000\ \text{V/m}
$$

$$
\mu = \frac{v_d}{E_x} = \frac{200}{5000} = 0.040\ \text{m}^2/\text{V}\cdot\text{s} = 400\ \text{cm}^2/\text{V}\cdot\text{s}
$$

**(c) Resistivity.**

$$
R = \frac{V}{I} = \frac{10}{2.0\times10^{-3}} = 5000\ \Omega, \qquad \rho = \frac{RA}{L} = \frac{(5000)(2.0\times10^{-4})(2.0\times10^{-5})}{2.0\times10^{-3}} = 0.010\ \Omega\cdot\text{m} = 1.0\ \Omega\cdot\text{cm}
$$

**Check:** $\sigma = qn\mu = (1.602\times10^{-19})(1.56\times10^{16})(400) = 1.0\ \text{S/cm}$ ✓.

### Example 3: Sign of the carriers

A strip carries current to the right with $B$ into the page. The **top** edge is measured at a **lower** potential than the bottom edge. What are the carriers?

- Direction of deflection: $\vec{I}\times\vec{B} = \hat{x}\times(-\hat{z}) = +\hat{y}$, **toward the top**, for both carrier signs.
- The top edge is at the lower potential, so it holds **negative** charge.
- Negative charge piling up means the carriers are **electrons**: the material is **n-type**.

### Example 4: Photon from a Bohr transition

A hydrogen electron drops from $n = 4$ to $n = 2$. Find the photon's energy and wavelength. Then find the energy needed to ionize hydrogen from $n = 2$.

**Emission.**

$$
E = 13.6\left(\frac{1}{2^2} - \frac{1}{4^2}\right) = 13.6\left(0.250 - 0.0625\right) = 2.55\ \text{eV}
$$

$$
\lambda = \frac{1240}{2.55} = 486\ \text{nm}
$$

That's a blue-green visible line (the second Balmer line).

**Ionization from $n = 2$.** The energy needed is $0 - E_2 = 13.6/4 = 3.4$ eV, corresponding to $\lambda = 1240/3.4 = 365$ nm. Compare with $13.6$ eV (91.2 nm) from the ground state.

### Example 5: Excitation and capture

(a) What photon energy lifts hydrogen from $n = 1$ to $n = 3$? (b) What is the wavelength of the photon emitted when a free electron at rest is captured into $n = 1$?

**(a)**

$$
E = 13.6\left(\frac{1}{1^2} - \frac{1}{3^2}\right) = 13.6\left(1 - 0.111\right) = 12.1\ \text{eV} \quad(\lambda = 103\ \text{nm})
$$

**(b)** The free electron ($E = 0$) drops to $E_1 = -13.6$ eV, so the photon carries $13.6$ eV:

$$
\lambda = \frac{1240}{13.6} = 91.2\ \text{nm}
$$

This is also the **shortest** wavelength hydrogen can emit and the **longest** wavelength that can ionize it from the ground state.

### Example 6: Quick checks on the Hall voltage

**(a) Twice the carrier density.** Two samples have the same geometry, current, field and carrier charge, but sample B has twice the carrier density. By Eq. (4.5), $V_H \propto 1/n$, so B has **half** the Hall voltage. Fewer carriers need to move faster to carry the same current, so the magnetic force and the Hall field are bigger, and a denser sample gives a *smaller* signal.

**(b) Twice the width.** The width $W$ doubles while $I$, $B$, $n$ and $d$ stay the same. $V_H = v_dBW$ looks like it should double, but the drift speed falls because the same current is spread over a larger cross-section ($v_d = I/(nqWd)$). The $W$ cancels, so $V_H$ is **unchanged**.

**(c) Hall voltage from the Hall field.** The field driving the current is $10$ V/cm and the Hall field is $3$ V/cm. The sample has $L = 5$ cm, $W = 2$ cm and $d = 1$ cm, with $I$ along $L$ and $B$ along $d$. The Hall voltage is measured across the width, so it uses the **Hall** field:

$$
V_H = E_HW = (3\ \text{V/cm})(2\ \text{cm}) = 6\ \text{V}
$$

(The $10$ V/cm field goes with $L$: $V = 10\times5 = 50$ V across the length, which is the supply voltage, not the Hall voltage.)

**(d) Why does the sideways drift stop?** Because the Hall electric force balances the magnetic force (Eq. 4.3). The carriers don't run out of kinetic energy, the current doesn't stop, and the magnetic field doesn't weaken.

## Common mistakes

- Using the Hall field instead of the supply field $E_x = V/L$ when calculating mobility
- Mixing cm and m when $B$ is in tesla. Convert $d$ to metres for Eq. (4.6) or convert $B$ to cm-based units
- Getting the Hall voltage sign from $\vec{F} = q\vec{E}$ reasoning without checking $\vec{I}\times\vec{B}$ first. The deflection direction is the same for electrons and holes, but the **polarity** of the pile-up isn't
- Using $d$ as the width, when $V_H = IB/(qnd)$ uses the **thickness along $B$**, not $W$
- Reading $V_L$ across the whole sample, contacts and leads included, and treating it as the field in the bar. It overstates $E_x$ and understates $\mu$ (Lab 2 came out $41\%$ low)
- Trusting $\sigma = qn\mu$ as an independent check. With $n$ and $\mu$ both from the Hall data it holds automatically, so it only catches arithmetic mistakes
- Using positive energies in the Bohr model. $E_n$ is negative, so the photon energy is a **difference** of levels
- Thinking any photon with enough energy gets absorbed in a bound transition. A photon has to match the gap $E_{\text{upper}} - E_{\text{lower}}$ exactly (only above the ionization energy does a continuum of energies work)
- Applying the $13.6/n^2$ formula to atoms with more than one electron
- Picturing donor levels at mid-gap. They're just below $E_c$, which is why they ionize easily
