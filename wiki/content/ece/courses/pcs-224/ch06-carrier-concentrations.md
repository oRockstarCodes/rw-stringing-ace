---
title: "6. Carrier Concentrations & Fermi Level"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **4.1.1–4.1.4, 4.3.1–4.3.2, 4.5, 4.6** · week 6

[[ch05-band-structure-and-fermi-function|Chapter 5]] gave the probability that a state is occupied. This chapter turns that into **numbers**: how many electrons are in the conduction band, how many holes are in the valence band, and where the Fermi level sits for a given doping and temperature.

The chain of logic:

1. **Number of electrons** = (available states near $E_c$) × (probability they're occupied) $\Rightarrow$ $n_0 = N_c\,e^{-(E_c-E_F)/k_BT}$.
2. **Number of holes** is the mirror image: $p_0 = N_v\,e^{-(E_F-E_v)/k_BT}$.
3. Multiply them and $E_F$ cancels, which leaves the **fundamental equation** $n_0p_0 = n_i^2$ from [[ch03-intro-to-semiconductors|Chapter 3]], now with $n_i$ written in terms of $E_g$, $N_c$, $N_v$ and $T$.
4. Invert the formulas to find **where $E_F$ sits**, given the carrier concentration set by the doping.

## Notes

### Statistical mechanics of carrier concentrations

**Electrons in the conduction band.** The conduction band has a huge number of states, but only the ones with energies slightly above $E_c$ are likely to be occupied, because $f(E)$ falls off exponentially. Adding up (integrating) state density × probability over the band gives a surprisingly simple result when the Fermi level is at least a few $k_BT$ below $E_c$:

$$
n_0 = N_c\,f(E_c) \approx N_c\,\exp\!\left(-\frac{E_c - E_F}{k_BT}\right) \tag{6.1}
$$

It's as if all the conduction-band states were squeezed onto the single level $E_c$, with an effective number of states $N_c$ (per cm³) called the **effective density of states** in the conduction band:

$$
N_c = 2\left(\frac{2\pi m_n^*k_BT}{h^2}\right)^{3/2} \tag{6.2}
$$

- $m_n^*$ is the **effective mass** of the electron. It packages the interaction of the electron with the lattice into a single modified mass that's different from the free-electron mass.
- $N_c$ is usually **given** for the material. For silicon at 300 K it's about $2.8\times10^{19}$ cm⁻³ (Neamen's Appendix B).
- It scales as $N_c \propto T^{3/2}$:
  $$N_c(T) = N_c(300\,\text{K})\left(\frac{T}{300}\right)^{3/2} \tag{6.3}$$

**Holes in the valence band.** A hole is a state *without* an electron, with probability $1 - f(E)$ (Eq. 5.3). The same calculation gives

$$
p_0 = N_v\,\exp\!\left(-\frac{E_F - E_v}{k_BT}\right) \tag{6.4}
$$

$$
N_v = 2\left(\frac{2\pi m_p^*k_BT}{h^2}\right)^{3/2} \tag{6.5}
$$

For silicon at 300 K, $N_v \approx 1.04\times10^{19}$ cm⁻³ (the textbook's order of magnitude is $10^{19}$ cm⁻³).

> [!tip] Both formulas say the same thing in the same shape, concentration = $N$ × $e^{-(\text{distance from } E_F \text{ to the band edge})/k_BT}$. The closer $E_F$ is to a band edge, the more carriers of that type there are. Memorise one and the other follows by symmetry.

**The product, and $n_i$.** Multiply Eqs. (6.1) and (6.4). The $E_F$ cancels and what's left only depends on the gap:

$$
n_0\,p_0 = N_cN_v\,\exp\!\left(-\frac{E_g}{k_BT}\right) \tag{6.6}
$$

This is valid for **any** equilibrium semiconductor, doped or not. For an intrinsic sample $n_0 = p_0 = n_i$, so Eq. (6.6) gives $n_i^2$ and

$$
n_i = \sqrt{N_cN_v}\;\exp\!\left(-\frac{E_g}{2k_BT}\right) \tag{6.7}
$$

and therefore $n_0p_0 = n_i^2$ again, now derived from the Fermi function instead of from generation and recombination.

**Temperature dependence.** Two competing factors set how $n_i$ grows with $T$, the slow power law ($\propto T^{3/2}$, from $\sqrt{N_cN_v}$) and the exponential $e^{-E_g/2k_BT}$, which wins out. A larger gap means a smaller $n_i$ at the same temperature.

> [!note] Using Eq. (6.7) with $N_c = 2.8\times10^{19}$, $N_v = 1.04\times10^{19}$ and $E_g = 1.12$ eV gives $n_i \approx 6.7\times10^{9}$ cm⁻³ at 300 K. That's a bit below the commonly quoted $1.5\times10^{10}$ cm⁻³, because $n_i$ is exponentially sensitive to $E_g$ and to the rounded $N_c$, $N_v$. Use whichever value the problem gives.

### Position of the Fermi level

$n_0$ and $p_0$ are set by $E_F$, so you can read the Fermi level back out once you know the concentration (from the doping) and $N_c$ or $N_v$. Taking logarithms of Eqs. (6.1) and (6.4):

$$
E_c - E_F = k_BT\,\ln\!\frac{N_c}{n_0}, \qquad E_F - E_v = k_BT\,\ln\!\frac{N_v}{p_0} \tag{6.8}
$$

**Intrinsic material.** Set $n_0 = p_0$ in Eqs. (6.1) and (6.4) and solve for the Fermi level, called the **intrinsic Fermi level** $E_i$:

$$
E_i = \frac{E_c + E_v}{2} + \frac{k_BT}{2}\ln\!\frac{N_v}{N_c} = E_{\text{mid}} + \frac{3}{4}k_BT\ln\frac{m_p^*}{m_n^*} \tag{6.9}
$$

It's **very close to mid-gap**. The correction is on the order of a few ×10 meV, so $E_i \approx E_{\text{mid}}$ is a good approximation (for silicon, with $N_v/N_c = 1.04/2.8$, it works out to $-0.013$ eV).

**Relative to $E_i$.** Dividing Eq. (6.1) by $n_i$, and doing the same for holes, gives a form that's often more convenient:

$$
n_0 = n_i\,\exp\!\left(\frac{E_F - E_i}{k_BT}\right), \qquad p_0 = n_i\,\exp\!\left(\frac{E_i - E_F}{k_BT}\right) \tag{6.10}
$$

so

$$
E_F - E_i = k_BT\,\ln\frac{n_0}{n_i} = -k_BT\,\ln\frac{p_0}{n_i} \tag{6.11}
$$

**Doped material.**

- **n-type:** $n_0 \approx N_D \gg n_i$, so $E_F$ is **above** $E_i$, closer to $E_c$.
- **p-type:** $p_0 \approx N_A \gg n_i$, so $E_F$ is **below** $E_i$, closer to $E_v$.

![[pcs-224-fermi-level-positions.svg]]
*Figure 6.1: The Fermi level moves toward $E_c$ in n-type material, sits near mid-gap ($E_i$) in intrinsic material, and moves toward $E_v$ in p-type material.*

**What moves $E_F$.**

- **More doping** (larger $N_D$ or $N_A$) pushes $E_F$ **farther** from mid-gap, toward the band edge of the majority carrier. The lower the doping, the closer $E_F$ is to the centre and the more intrinsic the sample behaves.
- **Higher temperature** creates more thermally generated electrons and holes, which eventually outnumber the ones from the dopants. So $E_F$ moves **back toward mid-gap** and the material becomes more intrinsic.
- $n_0$ and $p_0$ depend **exponentially** on $E_F$, so a shift of $\Delta E_F$ changes the carrier density by $e^{\Delta E_F/k_BT}$. A shift of only $0.26$ eV multiplies the concentration by about $2.3\times10^4$ at room temperature.

### The Fermi level is constant in equilibrium

In thermal equilibrium, a single $E_F$ applies to the whole system. If two materials with different Fermi levels touch, electrons flow from the higher-$E_F$ side to the lower-$E_F$ side until the levels line up. That charge transfer sets up an electric potential difference between the two sides, and that **built-in potential** is the heart of the p-n junction in [[ch07-pn-junction|Chapter 7]].

## Key formulas

**Carrier concentrations**

$$
n_0 = N_c\,e^{-(E_c-E_F)/k_BT}, \qquad p_0 = N_v\,e^{-(E_F-E_v)/k_BT} \tag{6.1, 6.4}
$$

- $N_c$, $N_v$: effective densities of states (cm⁻³), $\propto T^{3/2}$
- $E_c$, $E_v$: band edges; $k_BT = 0.02586$ eV at 300 K

**Effective density of states**

$$
N_c = 2\left(\frac{2\pi m_n^*k_BT}{h^2}\right)^{3/2}, \qquad N_c(T) = N_c(300\,\text{K})\left(\frac{T}{300}\right)^{3/2} \tag{6.2, 6.3}
$$

**Product and intrinsic concentration**

$$
n_0p_0 = N_cN_v\,e^{-E_g/k_BT} = n_i^2, \qquad n_i = \sqrt{N_cN_v}\,e^{-E_g/2k_BT} \tag{6.6, 6.7}
$$

**Fermi level position**

$$
E_c - E_F = k_BT\ln\frac{N_c}{n_0}, \qquad E_F - E_v = k_BT\ln\frac{N_v}{p_0} \tag{6.8}
$$

$$
E_i = \frac{E_c+E_v}{2} + \frac{k_BT}{2}\ln\frac{N_v}{N_c}, \qquad E_F - E_i = k_BT\ln\frac{n_0}{n_i} = -k_BT\ln\frac{p_0}{n_i} \tag{6.9, 6.11}
$$

- n-type: $E_F > E_i$. p-type: $E_F < E_i$

## Examples

### Example 1: Electron concentration from $E_F$

> Like the "$E_F$ is 0.28 eV below $E_c$" clicker

At $300$ K a semiconductor has its Fermi level $0.25$ eV below the conduction band, with $N_c = 2.8\times10^{19}$ cm⁻³. Find $n_0$.

$$
n_0 = N_c\,e^{-(E_c-E_F)/k_BT} = (2.8\times10^{19})\,e^{-0.25/0.02586} = (2.8\times10^{19})(6.31\times10^{-5}) = 1.8\times10^{15}\ \text{cm}^{-3}
$$

### Example 2: Hole concentration from $E_F$

> Like the "$E_F$ is 0.28 eV above $E_v$" clicker

At $300$ K, $E_F$ is $0.28$ eV above $E_v$ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $p_0$.

$$
p_0 = N_v\,e^{-(E_F-E_v)/k_BT} = (1.04\times10^{19})\,e^{-0.28/0.02586} = (1.04\times10^{19})(1.98\times10^{-5}) = 2.1\times10^{14}\ \text{cm}^{-3}
$$

### Example 3: Intrinsic concentration

> Like the "$E_g = 1.12$ eV, $N_c$, $N_v$" clicker

For silicon at $300$ K, $E_g = 1.12$ eV, $N_c = 2.8\times10^{19}$ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $n_i$.

$$
n_i = \sqrt{N_cN_v}\,e^{-E_g/2k_BT} = \sqrt{(2.8\times10^{19})(1.04\times10^{19})}\;e^{-1.12/(2\times0.02586)}
$$

$$
= (1.71\times10^{19})\,e^{-21.66} = (1.71\times10^{19})(3.9\times10^{-10}) = 6.7\times10^{9}\ \text{cm}^{-3}
$$

(The textbook value, $1.5\times10^{10}$ cm⁻³, is within a factor of 2. See the note in the Notes section.)

### Example 4: How much do $N_c$ and $n_i$ change with temperature?

> Like the "$27\ ^\circ\text{C}$ to $37\ ^\circ\text{C}$" clicker

Silicon warms from $300$ K to $310$ K. By what factor do (a) $N_c$ and (b) $n_i$ change?

**(a)** From Eq. (6.3):

$$
\frac{N_c(310)}{N_c(300)} = \left(\frac{310}{300}\right)^{3/2} = 1.050 \quad\text{(a 5% increase)}
$$

**(b)** $n_i \propto T^{3/2}\,e^{-E_g/2k_BT}$:

$$
\frac{n_i(310)}{n_i(300)} = 1.050\times\exp\!\left[\frac{E_g}{2k_B}\left(\frac{1}{300}-\frac{1}{310}\right)\right] = 1.050\times\exp(0.7) \approx 2.1
$$

Just 10 K of warming roughly **doubles** the intrinsic carrier concentration, because the exponential wins out over the slow $T^{3/2}$ factor.

### Example 5: Where is $E_F$ in doped silicon?

> Like the "$N_d = 5\times10^{14}$ cm⁻³" clicker

Silicon at $300$ K is doped with $N_D = 1.0\times10^{16}$ cm⁻³. Find the position of $E_F$ (a) relative to $E_c$ and (b) relative to the intrinsic level. Use $N_c = 2.8\times10^{19}$ cm⁻³ and $n_i = 1.5\times10^{10}$ cm⁻³.

The material is n-type with $n_0 \approx N_D = 1.0\times10^{16}$ cm⁻³.

**(a)** Eq. (6.8):

$$
E_c - E_F = k_BT\ln\frac{N_c}{n_0} = (0.02586)\ln\frac{2.8\times10^{19}}{1.0\times10^{16}} = (0.02586)(7.94) = 0.205\ \text{eV}
$$

**(b)** Eq. (6.11):

$$
E_F - E_i = k_BT\ln\frac{n_0}{n_i} = (0.02586)\ln\frac{1.0\times10^{16}}{1.5\times10^{10}} = (0.02586)(13.4) = 0.347\ \text{eV}
$$

The two answers are consistent: $E_i$ is about $0.55$ eV below $E_c$ (roughly mid-gap), and $0.205 + 0.347 = 0.55$ eV ✓.

> [!note] The two routes (via $N_c$ or via $n_i$) agree to within a few 0.01 eV, because the tabulated $n_i$ and the $n_i$ calculated from $N_c$, $N_v$, $E_g$ differ slightly. Use whichever quantity the problem gives you.

### Example 6: p-type silicon

Silicon at $300$ K has $N_A = 2.0\times10^{16}$ cm⁻³ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $E_F - E_v$ and the resulting electron concentration.

$$
p_0 \approx N_A \ \Rightarrow\ E_F - E_v = k_BT\ln\frac{N_v}{p_0} = (0.02586)\ln\frac{1.04\times10^{19}}{2.0\times10^{16}} = (0.02586)(6.25) = 0.162\ \text{eV}
$$

$E_F$ is $0.16$ eV above $E_v$, which is well below mid-gap, as expected for p-type. The minority electrons:

$$
n_0 = \frac{n_i^2}{p_0} = \frac{(1.5\times10^{10})^2}{2.0\times10^{16}} = 1.1\times10^{4}\ \text{cm}^{-3}
$$

### Example 7: Sensitivity to $E_F$

> Like "If $E_F$ moves down by 0.26 eV, hole concentration increases by ... times"

In p-type silicon at $300$ K, $E_F$ moves $0.26$ eV **closer to** $E_v$ (down). By what factor do the hole concentration and the conductivity change?

$$
\frac{p_0'}{p_0} = e^{\Delta E/k_BT} = e^{0.26/0.02586} = e^{10.06} \approx 2.3\times10^{4}
$$

For p-type, $\sigma \approx q\mu_pp_0$, and the mobility barely changes compared with an exponential, so **the conductivity goes up by about the same factor, $\approx 2.3\times10^4$**.

## Common mistakes

- Measuring the exponent from the wrong band edge. $n_0$ uses $E_c - E_F$ and $p_0$ uses $E_F - E_v$
- Using $k_BT$ in joules with energies in eV (or the reverse). Keep everything in eV
- Using $T$ in °C, or forgetting that $N_c$ and $N_v$ change as $T^{3/2}$ when the temperature isn't 300 K
- Assuming $E_F$ is exactly at mid-gap in intrinsic material. It's only *near* mid-gap, and the exact $E_i$ depends on $N_c/N_v$
- Placing $E_F$ **below** $E_i$ for n-type or above it for p-type
- Using Eq. (6.1) when $E_F$ is within a few $k_BT$ of (or inside) the band. It needs $E_c - E_F \gg k_BT$
- Thinking higher temperature moves $E_F$ **away** from mid-gap. It moves toward it, because the sample gets more intrinsic
- Expecting $n_0$ to depend linearly on the Fermi level shift. It's exponential, so small shifts in $E_F$ make huge changes in $n_0$
