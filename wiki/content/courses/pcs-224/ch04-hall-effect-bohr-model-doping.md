---
title: "4. Hall Effect, Bohr Model & Doping"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **5.4, 4.2** · Serway & Jewett **41.1–41.3** · week 4

Three connected topics, each answering a question left open by [[ch03-intro-to-semiconductors|Chapter 3]]:

1. **The Hall effect** answers "how do we actually *measure* the sign, concentration and mobility of the carriers?" A magnetic field pushes carriers sideways and a small voltage appears across the sample. It's one of the most common characterisation tools in the semiconductor industry, and it's Lab 2.
2. **The Bohr model** answers "why are energy levels discrete?" It's the first successful quantum model of an atom, and the idea of **allowed energies** that you'll build bands from in Chapter 5.
3. **Doping, in energy terms** answers "why does a dopant atom give up its extra carrier so easily at room temperature?" The donor electron is only loosely bound, so it takes about $0.045$ eV to free it.

## Notes

### Magnetic force on a moving charge

A charge $q$ moving with velocity $\vec{v}$ in a magnetic field $\vec{B}$ feels the force

$$
\vec{F}_m = q\,\vec{v}\times\vec{B}, \qquad F_m = |q|\,v\,B\sin\theta \tag{4.1}
$$

where $\theta$ is the angle between $\vec{v}$ and $\vec{B}$. The force is perpendicular to both, so it bends the path without changing the speed.

- Field lines of $\vec{B}$ are closed loops (unlike $\vec{E}$ lines, which run from $+$ to $-$).
- The **right-hand rule** gives the direction for a **positive** charge: fingers along $\vec{v}$, curl toward $\vec{B}$, thumb along $\vec{F}_m$. **Flip it** for a negative charge.
- $[B] = \text{T} = \text{V·s/m}^2$ (from Chapter 1).

**The trick that makes the Hall effect easy.** For carriers of any sign, the current is $I = nqv_dA$, so $q\vec{v}$ points along the conventional current $\vec{I}$ for both electrons and holes. So

$$
\vec{F}_m \parallel \vec{I}\times\vec{B} \tag{4.2}
$$

**regardless of the sign of the carrier.** Positive and negative carriers are *both* deflected to the same side. What differs is the **sign of the charge that piles up** there.

### The Hall effect

In 1879 Edwin Hall found that a current-carrying conductor in a magnetic field develops a voltage $V_H$ in the direction perpendicular to both the current and the field.

**Geometry** (Figure 4.1). A flat strip of length $L$, width $W$ and thickness $d$ carries a current $I$ along its length. A field $B$ is applied perpendicular to the flat face (along the thickness).

![[pcs-224-hall-geometry.svg]]
*Figure 4.1: Hall geometry. The current runs along $L$, $B$ is along $d$, and $V_H$ is measured across the width $W$.*

**What happens.**

1. By Eq. (4.2), the magnetic force pushes carriers toward one **edge** of the strip.
2. Charge accumulates on that edge, and the opposite edge is left with the opposite charge.
3. That separated charge builds up a transverse electric field, the **Hall field** $E_H$, which pushes the carriers back.
4. Within a very short time the electric force balances the magnetic force, the sideways drift stops, and the carriers flow straight again.

At balance:

$$
qE_H = q\,v_d\,B \quad\Rightarrow\quad E_H = v_d\,B \tag{4.3}
$$

The voltage across the width is

$$
V_H = E_H\,W = v_d\,B\,W \tag{4.4}
$$

Now replace the drift speed, which you can't measure, with things you can. The current is $I = n\,q\,v_d\,(Wd)$, so $v_d = \dfrac{I}{nqWd}$, and:

$$
V_H = \frac{I\,B}{q\,n\,d} \tag{4.5}
$$

Note that $W$ has cancelled: only the **thickness along $B$** matters.

**Carrier sign from the polarity.** Which edge is positive tells you the sign of the carriers.

- **p-type:** holes pile up on the deflected edge, so that edge is at a higher potential. $V_H > 0$ in the standard setup.
- **n-type:** electrons pile up on the deflected edge, so that edge is at a lower potential. $V_H < 0$ in the standard setup.

To work out any specific case:

1. Find the direction of $\vec{I}\times\vec{B}$. That's the edge carriers are deflected to.
2. Ask whether that edge came out at higher or lower potential on the voltmeter.
3. Higher means positive carriers (p-type). Lower means negative carriers (n-type).

> [!tip] Electric field points from positive to negative charge, and the voltmeter reading tells you the polarity of the pile-up. A negative $V_H$ with $I$ to the right and $B$ into the page means the top edge is negative, so the carriers are electrons.

### Measuring concentration, mobility and resistivity

A single Hall sample gives three numbers.

**Carrier concentration** from Eq. (4.5):

$$
n\ (\text{or } p) = \frac{I\,B}{q\,d\,|V_H|} \tag{4.6}
$$

> [!warning] Units. $B$ in tesla contains **metres**, so if you write $d$ in cm, convert $B$ to cm too (or just convert $d$ to metres and get $n$ in m⁻³, then divide by $10^6$ for cm⁻³).

**Mobility.** Mobility is defined by $v_d = \mu E$, where $E$ is the field that **drives the current** along the bar, $E_x = V/L$ from the power supply. It is *not* the Hall field. The drift speed itself comes from Eq. (4.4):

$$
v_d = \frac{V_H}{B\,W}, \qquad \mu = \frac{v_d}{E_x} = \frac{V_H/(BW)}{V/L} \tag{4.7}
$$

**Resistivity.** From the supply voltage and the current, $R = V/I$, and $\rho = RA/L$ with $A = Wd$.

All three are linked by $\sigma = q\,n\,\mu$ (or $q\,p\,\mu$), which is a good check on your numbers.

> [!note] There are **two** electric fields and **two** voltages in a Hall problem: the field/voltage that drives the current along $L$, and the Hall field/voltage across $W$. Use the first for mobility and resistance, and the second for the carrier sign and concentration.

### Why discrete energies? The Bohr model

By the end of the 19th century, electricity and magnetism were understood, but two puzzles remained:

**Puzzle 1: line spectra.** A hot solid (a light bulb) or the sun emits a **continuous** spectrum. A hot gas, such as a neon light, emits only certain **discrete wavelengths**. Classical physics couldn't explain this. For hydrogen, Balmer found that the visible lines fit

$$
\frac{1}{\lambda} = R_H\left(\frac{1}{2^2} - \frac{1}{n^2}\right), \qquad n = 3, 4, 5, \dots \tag{4.8}
$$

with $R_H = 1.097\times10^{7}$ m⁻¹.

**Puzzle 2: stability.** A planetary model has the electron orbiting the nucleus. But an accelerating charge radiates electromagnetic waves and loses energy. A classical electron would spiral into the nucleus in about $10^{-11}$ s. Atoms don't collapse.

**Bohr's model (1913)** solved both with a bold postulate: only **certain orbits are stable**, and an electron in one of them does **not** radiate.

$$
r_n = n^2 a_0, \qquad a_0 = 5.29\times10^{-11}\ \text{m} \tag{4.9}
$$

$$
E_n = -\frac{13.6\ \text{eV}}{n^2}, \qquad n = 1, 2, 3, \dots \tag{4.10}
$$

- $n$ is the **principal quantum number**. $n = 1$ is the **ground state**, $n > 1$ are **excited states**.
- Energies are **negative** because the electron is bound. $E = 0$ is a free electron at rest. The ground state sits $13.6$ eV below it.

![[pcs-224-bohr-levels.svg]]
*Figure 4.2: Hydrogen energy levels. A photon is emitted or absorbed when the electron jumps between levels. The ionization limit is $E = 0$.*

**Transitions.** The atom radiates or absorbs only when the electron jumps between allowed levels, and the photon carries exactly the energy difference:

$$
hf = |E_i - E_f| = 13.6\left|\frac{1}{n_f^2} - \frac{1}{n_i^2}\right|\ \text{eV} \tag{4.11}
$$

- **Emission:** electron drops from a higher level to a lower one, and a photon leaves.
- **Absorption:** a photon with **exactly** the right energy $E_{\text{upper}} - E_{\text{lower}}$ lifts the electron up. A photon with the wrong energy isn't absorbed (although a photon with more than the ionization energy removes the electron entirely).
- **Ionization** from level $n$ needs $E = 0 - E_n = 13.6/n^2$ eV. Ionizing an already-excited atom takes **less** energy than ionizing from the ground state.

Eq. (4.11) reproduces the observed spectral lines exactly, which is why this model was convincing.

> [!warning] Bohr's formulas are exact only for **single-electron** atoms like hydrogen. Multi-electron atoms and real solids need the full quantum treatment (Chapter 5), but the central message survives: **electron energies are quantized**.

### Doping in the Bohr picture

Why does a Group V dopant release its extra electron so easily? The fifth electron of a phosphorus atom sits **outside** the four bonds. It feels the P⁺ ion, so it orbits it like an electron around a proton: a hydrogen atom embedded in the silicon crystal. Two things make its binding far weaker than $13.6$ eV:

1. The crystal has a **larger permittivity** than vacuum, which screens the Coulomb attraction.
2. The electron's **effective mass** in the crystal is smaller than in vacuum.

Both effects reduce the binding energy and enlarge the orbit, so the fifth electron looks much farther from its nucleus than in an isolated P atom. For phosphorus in silicon, the **ionization energy** is only

$$
E_c - E_d \approx 0.045\ \text{eV} \tag{4.12}
$$

![[pcs-224-doping-levels.svg]]
*Figure 4.3: Dopant levels in the band gap. The donor level $E_d$ sits just below $E_c$ and the acceptor level $E_a$ just above $E_v$. Both are about $0.045$ eV from the nearest band edge in silicon.*

**n-type (donors).** The donor electron sits in a level $E_d$, just below the bottom of the conduction band $E_c$. At $T = 0$ K it stays bound. At room temperature, $k_BT = 0.026$ eV is comparable to $0.045$ eV, so nearly **all** donors are ionized. That adds free electrons without adding holes, so n-type material has many more electrons than holes.

**p-type (acceptors).** A Group III atom such as boron has a bond missing an electron, giving an empty level $E_a$ just above the top of the valence band $E_v$ (again about $0.045$ eV for B in Si). At room temperature, valence-band electrons easily hop into it. That adds holes without adding electrons.

> [!note] "Just below $E_c$" and "just above $E_v$" are the important points. A dopant level in the *middle* of the gap would not ionize at room temperature and would be useless for doping. The band language ($E_c$, $E_v$, $E_F$) is built properly in [[ch05-band-structure-and-fermi-function|Chapter 5]].

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
- $V$: supply voltage across $L$; $E_x = V/L$
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

> Like Neamen Example 4.8 / slide "1 × 10¹⁶ boron atoms"

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

> Like Neamen Example 5.8 (the $-6.25$ mV sample)

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
\mu = \frac{v_d}{E_x} = \frac{200}{5000} = 0.040\ \text{m}^2/\text{V·s} = 400\ \text{cm}^2/\text{V·s}
$$

**(c) Resistivity.**

$$
R = \frac{V}{I} = \frac{10}{2.0\times10^{-3}} = 5000\ \Omega, \qquad \rho = \frac{RA}{L} = \frac{(5000)(2.0\times10^{-4})(2.0\times10^{-5})}{2.0\times10^{-3}} = 0.010\ \Omega\cdot\text{m} = 1.0\ \Omega\cdot\text{cm}
$$

**Check:** $\sigma = qn\mu = (1.602\times10^{-19})(1.56\times10^{16})(400) = 1.0\ \text{S/cm}$ ✓.

### Example 3: Sign of the carriers

> Like the Hall-voltage-sign clicker

A strip carries current to the right with $B$ into the page. The **top** edge is measured at a **lower** potential than the bottom edge. What are the carriers?

- Direction of deflection: $\vec{I}\times\vec{B} = \hat{x}\times(-\hat{z}) = +\hat{y}$, **toward the top**, for both carrier signs.
- The top edge is at the lower potential, so it holds **negative** charge.
- Negative charge piling up means the carriers are **electrons**: the material is **n-type**.

### Example 4: Photon from a Bohr transition

> Like the emission/absorption clicker questions

A hydrogen electron drops from $n = 4$ to $n = 2$. Find the photon's energy and wavelength. Then find the energy needed to ionize hydrogen from $n = 2$.

**Emission.**

$$
E = 13.6\left(\frac{1}{2^2} - \frac{1}{4^2}\right) = 13.6\left(0.250 - 0.0625\right) = 2.55\ \text{eV}
$$

$$
\lambda = \frac{1240}{2.55} = 486\ \text{nm}
$$

This is a blue-green visible line (the second Balmer line).

**Ionization from $n = 2$.** The energy needed is $0 - E_2 = 13.6/4 = 3.4$ eV, corresponding to $\lambda = 1240/3.4 = 365$ nm. Compare with $13.6$ eV (91.2 nm) from the ground state.

### Example 5: Excitation and capture

> Like the "$n = 1$ to $n = 3$" and "free electron into the ground state" clicker questions

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

## Common mistakes

- Using the Hall field instead of the supply field $E_x = V/L$ when calculating mobility
- Mixing cm and m when $B$ is in tesla. Convert $d$ to metres for Eq. (4.6) or convert $B$ to cm-based units
- Getting the Hall voltage sign from $\vec{F} = q\vec{E}$ reasoning without checking $\vec{I}\times\vec{B}$ first. The deflection direction is the same for electrons and holes, but the **polarity** of the pile-up is not
- Using $d$ as the width: $V_H = IB/(qnd)$ uses the **thickness along $B$**, not $W$
- Using positive energies in the Bohr model. $E_n$ is negative, so the photon energy is a **difference** of levels
- Thinking any photon with enough energy is absorbed in a bound transition. A photon must match the gap $E_{\text{upper}} - E_{\text{lower}}$ exactly (only above the ionization energy does a continuum of energies work)
- Applying the $13.6/n^2$ formula to atoms with more than one electron
- Picturing donor levels at mid-gap. They are just below $E_c$, which is why they ionize easily
