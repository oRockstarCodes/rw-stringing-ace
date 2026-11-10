---
title: "6. Carrier Concentrations & Fermi Level"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **4.1.1–4.1.4, 4.3.1–4.3.2, 4.5, 4.6** · week 6

[[ch05-band-structure-and-fermi-function#The Fermi function|Chapter 5]] told us the *probability* that a state is occupied. This chapter turns that into **numbers**: how many electrons are in the [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|conduction band]], how many holes are in the valence band, and where the Fermi level sits for a given doping and temperature.

The logic goes like this:

1. **Electrons** = (states available near $E_c$) × (chance they're filled), which gives $n_0 = N_c\,e^{-(E_c-E_F)/k_BT}$.
2. **Holes** are the mirror image: $p_0 = N_v\,e^{-(E_F-E_v)/k_BT}$.
3. Multiply them and $E_F$ drops out. What's left is the equation $n_0p_0 = n_i^2$ from [[ch03-intro-to-semiconductors#The fundamental semiconductor equation|Chapter 3]], now with $n_i$ written in terms of $E_g$, $N_c$, $N_v$ and $T$.
4. Turn the formulas around to find **where $E_F$ sits** for a given doping.

## Notes

### Counting carriers

**Electrons in the conduction band.** Think of the energy levels as seats in a theatre. To count the people in the seats at a given energy, you need two things:

1. **How many seats exist there**, $g(E)$. This is the [[ch05-band-structure-and-fermi-function#The Fermi function|density of states]]. There are no seats in the gap, and the number of seats grows as you go higher into a band.
2. **How likely each seat is to be taken**, $f(E)$. This is the Fermi function from [[ch05-band-structure-and-fermi-function#The Fermi function|Chapter 5]]. It's close to 1 far below $E_F$ and close to 0 far above it.

Multiply them: $g(E)\,f(E)$ is the number of electrons at that energy. Figure 6.1 draws all four steps on one shared energy axis, so you can read straight across at any height. Look at the conduction band. More seats higher up (column 2) are cancelled by a probability that drops very fast (column 3), so the electrons pile up in a thin sliver just above $E_c$ (column 4). The holes in the valence band work the same way, using $g(E)\,[1 - f(E)]$, the chance that a seat is *empty*.

<div class="melon-semi" data-view="carriers">Interactive carrier-counting diagram (open this page on the site to use it).</div>
*Figure 6.1: Bands, states, Fermi function and carriers on one energy axis (silicon). Move $E_F$ toward $E_c$ and the electron sliver grows while the hole sliver shrinks. Raise $T$ and both grow. The bars at the bottom show $n_0$ and $p_0$ on a log scale, and their product never changes with $E_F$.*

If you add this up over the whole conduction band, you get a surprisingly simple answer, as long as $E_F$ is at least a few $k_BT$ below $E_c$:

$$
n_0 = N_c\,f(E_c) \approx N_c\,\exp\!\left(-\frac{E_c - E_F}{k_BT}\right) \tag{6.1}
$$

where $n_0$ is the equilibrium electron concentration (cm⁻³), $E_c$ is the bottom of the conduction band, $E_F$ is the Fermi level, and $f(E_c)$ is the Fermi function evaluated at $E_c$. Every energy is in eV.

It's as if the entire band were squeezed onto the single level $E_c$, with an effective number of states $N_c$ (per cm³). That's the **effective density of states**:

$$
N_c = 2\left(\frac{2\pi m_n^*k_BT}{h^2}\right)^{3/2} \tag{6.2}
$$

- $m_n^*$ is the electron's **effective mass**. It bundles up the electron's interaction with the lattice into one modified mass, different from the free-electron mass. ($m_p^*$, used below, is the same idea for holes.)
- $h$ is [[ch02-photoelectric-effect#Einstein's photon picture (1905)|Planck's constant]] and $k_BT$ is the thermal energy ([[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|Chapter 3]]). The factor $2$ counts the two spin states.
- Usually $N_c$ is **given**. For silicon at 300 K it's about $2.8\times10^{19}$ cm⁻³ (Neamen, Appendix B).
- It grows with temperature as $T^{3/2}$:

$$
N_c(T) = N_c(300\,\text{K})\left(\frac{T}{300}\right)^{3/2} \tag{6.3}
$$

#### Example 6.1: Computing $N_c$ from the effective mass

Silicon has $m_n^* = 1.08\,m_0$ (with $m_0 = 9.11\times10^{-31}$ kg). Find $N_c$ at $300$ K, where $k_BT = 0.02586$ eV $= 4.14\times10^{-21}$ J.

$$
N_c = 2\left(\frac{2\pi m_n^*k_BT}{h^2}\right)^{3/2} = 2\left(\frac{2\pi\,(9.84\times10^{-31})(4.14\times10^{-21})}{(6.626\times10^{-34})^2}\right)^{3/2} = 2\,(5.83\times10^{16})^{3/2}\ \text{m}^{-3}
$$

$$
N_c = 2.8\times10^{25}\ \text{m}^{-3} = 2.8\times10^{19}\ \text{cm}^{-3}
$$

This matches the tabulated value, so the "given" $N_c$ in later problems is just this formula already worked out for you.

#### Example 6.2: Electron concentration from $E_F$

At $300$ K a semiconductor has its Fermi level $0.25$ eV below the conduction band, with $N_c = 2.8\times10^{19}$ cm⁻³. Find $n_0$.

$$
n_0 = N_c\,e^{-(E_c-E_F)/k_BT} = (2.8\times10^{19})\,e^{-0.25/0.02586} = (2.8\times10^{19})(6.31\times10^{-5}) = 1.8\times10^{15}\ \text{cm}^{-3}
$$

**Holes in the valence band.** A hole is a state *without* an electron, with probability $1 - f(E)$ ([[ch05-band-structure-and-fermi-function#Probability of holes|Eq. 5.3]]). The same calculation gives

$$
p_0 = N_v\,\exp\!\left(-\frac{E_F - E_v}{k_BT}\right) \tag{6.4}
$$

where $p_0$ is the equilibrium hole concentration (cm⁻³), $E_v$ is the top of the valence band, and $N_v$ is the effective density of states of the valence band:

$$
N_v = 2\left(\frac{2\pi m_p^*k_BT}{h^2}\right)^{3/2} \tag{6.5}
$$

For silicon at 300 K, $N_v \approx 1.04\times10^{19}$ cm⁻³ (order of magnitude $10^{19}$ cm⁻³).

#### Example 6.3: Hole concentration from $E_F$

At $300$ K, $E_F$ is $0.28$ eV above $E_v$ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $p_0$.

$$
p_0 = N_v\,e^{-(E_F-E_v)/k_BT} = (1.04\times10^{19})\,e^{-0.28/0.02586} = (1.04\times10^{19})(1.98\times10^{-5}) = 2.1\times10^{14}\ \text{cm}^{-3}
$$

> [!tip] The two formulas have the same shape: concentration = $N$ × $e^{-(\text{distance from } E_F \text{ to that band edge})/k_BT}$. The closer $E_F$ is to a band edge, the more carriers of that type. Learn one and the other follows by symmetry.

**The product, and $n_i$.** Multiply Eqs. (6.1) and (6.4). The $E_F$ cancels, and what's left depends only on the gap:

$$
n_0\,p_0 = N_cN_v\,\exp\!\left(-\frac{E_g}{k_BT}\right) \tag{6.6}
$$

Here $E_g = E_c - E_v$ is the [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|band gap]] (the $E_F$ terms cancel because $(E_c - E_F) + (E_F - E_v) = E_g$). This holds for **any** equilibrium semiconductor, doped or not. For an intrinsic one, $n_0 = p_0 = n_i$, so $n_i^2$ equals the right side and

$$
n_i = \sqrt{N_cN_v}\;\exp\!\left(-\frac{E_g}{2k_BT}\right) \tag{6.7}
$$

So $n_0p_0 = n_i^2$ shows up again, this time derived from the Fermi function and not from [[ch03-intro-to-semiconductors#The fundamental semiconductor equation|generation and recombination]].

#### Example 6.4: Intrinsic concentration

For silicon at $300$ K, $E_g = 1.12$ eV, $N_c = 2.8\times10^{19}$ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $n_i$.

$$
n_i = \sqrt{N_cN_v}\,e^{-E_g/2k_BT} = \sqrt{(2.8\times10^{19})(1.04\times10^{19})}\;e^{-1.12/(2\times0.02586)}
$$

$$
= (1.71\times10^{19})\,e^{-21.66} = (1.71\times10^{19})(3.9\times10^{-10}) = 6.7\times10^{9}\ \text{cm}^{-3}
$$

(The textbook value, $1.5\times10^{10}$ cm⁻³, is within a factor of 2. See the note in the Notes section.)

**How $n_i$ depends on temperature.** Two factors compete: a slow power law ($\propto T^{3/2}$ from $\sqrt{N_cN_v}$) and the exponential $e^{-E_g/2k_BT}$. The exponential wins by far. A bigger gap means a much smaller $n_i$ at the same temperature.

> [!note] Using Eq. (6.7) with $N_c = 2.8\times10^{19}$, $N_v = 1.04\times10^{19}$ and $E_g = 1.12$ eV gives $n_i \approx 6.7\times10^{9}$ cm⁻³ at 300 K. That's a bit below the usual $1.5\times10^{10}$ cm⁻³, because $n_i$ is exponentially sensitive to $E_g$ and to the rounded values of $N_c$ and $N_v$. Use whichever number the problem gives you.

#### Example 6.5: How much do $N_c$ and $n_i$ change with temperature?

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

### Where is the Fermi level?

$n_0$ and $p_0$ are set by $E_F$, so we can run the formulas backward: given the concentration (from the doping) and $N_c$ or $N_v$, find $E_F$. Take logarithms of Eqs. (6.1) and (6.4):

$$
E_c - E_F = k_BT\,\ln\!\frac{N_c}{n_0}, \qquad E_F - E_v = k_BT\,\ln\!\frac{N_v}{p_0} \tag{6.8}
$$

**Intrinsic material.** Set $n_0 = p_0$ and solve for the Fermi level. This special value is the **intrinsic Fermi level** $E_i$:

$$
E_i = \frac{E_c + E_v}{2} + \frac{k_BT}{2}\ln\!\frac{N_v}{N_c} = E_{\text{mid}} + \frac{3}{4}k_BT\ln\frac{m_p^*}{m_n^*} \tag{6.9}
$$

Here $E_{\text{mid}} = (E_c + E_v)/2$ is the exact middle of the gap, and $m_n^*$, $m_p^*$ are the electron and hole effective masses (from Eqs. 6.2 and 6.5, since $N_v/N_c = (m_p^*/m_n^*)^{3/2}$). $E_i$ is **very close to the middle of the gap**. The correction is a few tens of meV (for silicon, with $N_v/N_c = 1.04/2.8$, it's $-0.013$ eV), so $E_i \approx E_{\text{mid}}$ is a fine approximation.

#### Example 6.6: How far is $E_i$ from mid-gap?

Silicon has $m_n^* = 1.08\,m_0$ and $m_p^* = 0.56\,m_0$. At $300$ K, by how much does $E_i$ differ from $E_{\text{mid}}$, and how far is $E_i$ below $E_c$ if $E_g = 1.12$ eV?

$$
E_i - E_{\text{mid}} = \frac{3}{4}k_BT\ln\frac{m_p^*}{m_n^*} = (0.75)(0.02586)\ln\frac{0.56}{1.08} = (0.01940)(-0.657) = -0.013\ \text{eV}
$$

$E_i$ sits $13$ meV **below** mid-gap, because the lighter hole mass gives a smaller $N_v$. Measured from the conduction band:

$$
E_c - E_i = \frac{E_g}{2} + 0.013 = 0.56 + 0.013 = 0.573\ \text{eV}
$$

A shift of 13 meV is about half of $k_BT$, so treating $E_i$ as mid-gap is a fine approximation.

**Measured from $E_i$.** Divide Eq. (6.1) by $n_i$ (and do the same for holes) to get a form that's often easier to use:

$$
n_0 = n_i\,\exp\!\left(\frac{E_F - E_i}{k_BT}\right), \qquad p_0 = n_i\,\exp\!\left(\frac{E_i - E_F}{k_BT}\right) \tag{6.10}
$$

so

$$
E_F - E_i = k_BT\,\ln\frac{n_0}{n_i} = -k_BT\,\ln\frac{p_0}{n_i} \tag{6.11}
$$

**Doped material.**

- **[[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|n-type]]:** $n_0 \approx N_D \gg n_i$, so $E_F$ is **above** $E_i$, closer to $E_c$.
- **p-type:** $p_0 \approx N_A \gg n_i$, so $E_F$ is **below** $E_i$, closer to $E_v$.

![[pcs-224-fermi-level-positions.svg]]
*Figure 6.2: $E_F$ moves toward $E_c$ in n-type material, sits near mid-gap ($E_i$) in intrinsic material, and moves toward $E_v$ in p-type material.*

#### Example 6.7: Where is $E_F$ in doped silicon?

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

#### Example 6.8: p-type silicon

Silicon at $300$ K has $N_A = 2.0\times10^{16}$ cm⁻³ and $N_v = 1.04\times10^{19}$ cm⁻³. Find $E_F - E_v$ and the resulting electron concentration.

$$
p_0 \approx N_A \ \Rightarrow\ E_F - E_v = k_BT\ln\frac{N_v}{p_0} = (0.02586)\ln\frac{1.04\times10^{19}}{2.0\times10^{16}} = (0.02586)(6.25) = 0.162\ \text{eV}
$$

$E_F$ is $0.16$ eV above $E_v$, which is well below mid-gap, as expected for p-type. The minority electrons:

$$
n_0 = \frac{n_i^2}{p_0} = \frac{(1.5\times10^{10})^2}{2.0\times10^{16}} = 1.1\times10^{4}\ \text{cm}^{-3}
$$

**What moves $E_F$:**

- **More doping** (bigger $N_D$ or $N_A$) pushes $E_F$ **farther** from mid-gap, toward the band edge of the majority carrier. Lighter doping keeps $E_F$ nearer the middle, and the sample acts more intrinsic.
- **Higher temperature** creates more thermally made electrons and holes, which eventually outnumber the ones from dopants. $E_F$ slides **back toward mid-gap** and the material turns more intrinsic.
- $n_0$ and $p_0$ depend **exponentially** on $E_F$. Shifting $E_F$ by an amount $\Delta E_F$ (in eV, toward the band edge) multiplies the concentration by $e^{\Delta E_F/k_BT}$, and a shift of just $0.26$ eV multiplies it by about $2.3\times10^4$ at room temperature.

#### Example 6.9: Sensitivity to $E_F$

In p-type silicon at $300$ K, $E_F$ moves $0.26$ eV **closer to** $E_v$ (down). By what factor do the hole concentration and the conductivity change?

$$
\frac{p_0'}{p_0} = e^{\Delta E/k_BT} = e^{0.26/0.02586} = e^{10.06} \approx 2.3\times10^{4}
$$

For p-type, $\sigma \approx q\mu_pp_0$ ([[ch03-intro-to-semiconductors#Drift current and mobility|Chapter 3]], with $q = e$ the [[ch01-electrostatics-review#Potential energy and potential|elementary charge]] and $\mu_p$ the hole mobility), and the mobility barely changes compared with an exponential, so **the conductivity goes up by about the same factor, $\approx 2.3\times10^4$**.

### The Fermi level is flat in equilibrium

In thermal equilibrium, one $E_F$ applies to the whole system. If two materials with different Fermi levels touch, electrons flow from the side with the higher $E_F$ to the lower one until the levels line up. That charge transfer creates a potential difference between the two sides, the **built-in potential**, which is the heart of the p-n junction in [[ch07-pn-junction#Fermi levels and the built-in potential|Chapter 7]].

#### Example 6.10: Fermi-level mismatch before contact

A silicon n-type sample with $N_D = 10^{17}$ cm⁻³ and a p-type sample with $N_A = 10^{17}$ cm⁻³ are about to be joined at $300$ K ($n_i = 1.5\times10^{10}$ cm⁻³). How far apart are their Fermi levels, and what does that tell you about the junction?

Use $E_F - E_i = k_BT\ln(n_0/n_i)$ on the n-side and $E_i - E_F = k_BT\ln(p_0/n_i)$ on the p-side. The gap between the two Fermi levels is the sum:

$$
\Delta E_F = k_BT\left[\ln\frac{N_D}{n_i} + \ln\frac{N_A}{n_i}\right] = k_BT\ln\frac{N_DN_A}{n_i^2} = (0.02586)\ln\frac{10^{34}}{2.25\times10^{20}} = (0.02586)(31.4) = 0.81\ \text{eV}
$$

Once joined, equilibrium forces one flat $E_F$, so the bands on the two sides must shift relative to each other by this same $0.81$ eV. That shift is the built-in potential, $V_{bi}\approx0.81$ V, derived properly in Chapter 7.

## Key formulas

**Carrier concentrations**

$$
n_0 = N_c\,e^{-(E_c-E_F)/k_BT}, \qquad p_0 = N_v\,e^{-(E_F-E_v)/k_BT} \tag{6.1, 6.4}
$$

- $N_c$, $N_v$: effective densities of states (cm⁻³), $\propto T^{3/2}$
- $E_c$, $E_v$: band edges; $E_F$: Fermi level; $k_BT = 0.02586$ eV at 300 K
- $n_0$, $p_0$: equilibrium electron and hole concentrations (cm⁻³); $E_g = E_c - E_v$: band gap; $E_i$: intrinsic Fermi level; $m_n^*$, $m_p^*$: effective masses; $h$: Planck's constant

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

## Common mistakes

- Measuring the exponent from the wrong band edge. $n_0$ uses $E_c - E_F$ and $p_0$ uses $E_F - E_v$
- Using $k_BT$ in joules with energies in eV (or the reverse). Keep everything in eV
- Using $T$ in °C, or forgetting that $N_c$ and $N_v$ change as $T^{3/2}$ when the temperature isn't 300 K
- Assuming $E_F$ is exactly at mid-gap in intrinsic material. It's only *near* mid-gap, and the exact $E_i$ depends on $N_c/N_v$
- Placing $E_F$ **below** $E_i$ for n-type or above it for p-type
- Using Eq. (6.1) when $E_F$ is within a few $k_BT$ of (or inside) the band. It needs $E_c - E_F \gg k_BT$
- Thinking higher temperature moves $E_F$ **away** from mid-gap. It moves toward it, because the sample gets more intrinsic
- Expecting $n_0$ to depend linearly on the Fermi level shift. It's exponential, so small shifts in $E_F$ make huge changes in $n_0$
