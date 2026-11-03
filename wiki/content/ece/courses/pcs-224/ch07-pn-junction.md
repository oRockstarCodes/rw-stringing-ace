---
title: "7. The p-n Junction"
tags:
  - pcs224
---
## Overview

> [!info] Readings Neamen **7.1, 7.2.1–7.2.3, 7.3.1, 8.5.1** · Serway & Jewett **42.7** · week 7

Everything so far was about a *single* piece of semiconductor. This chapter joins a p-type piece and an n-type piece, and that one contact is the **p-n junction**, the building block of the diode, the LED, the solar cell and the transistor.

The chapter comes down to five ideas:

1. Holes and electrons **diffuse** across the boundary and **recombine**, which leaves a thin **depletion region** of exposed (fixed) donor and acceptor ions.
2. Those exposed ions create an [[ch01-electrostatics-review#Electric fields and forces|electric field]] and a potential step, the **built-in potential** $V_{bi}$, which stops the diffusion.
3. $V_{bi}$ is set by the doping: $eV_{bi} = k_BT\ln\dfrac{N_aN_d}{n_i^2}$. It is the amount the two [[ch05-band-structure-and-fermi-function#The Fermi function|Fermi levels]] had to shift to line up.
4. An applied voltage $V_D$ changes the barrier to $V_{total} = V_{bi} - V_D$. **Reverse** bias widens the depletion region and **forward** bias narrows it.
5. The depletion width follows from Poisson's equation: $w \propto \sqrt{V_{total}}$, and the lighter-doped side takes most of the width.

> [!note] Capacitance of the junction ([[ch08-junction-capacitance-and-optoelectronics|Chapter 8]]) is **not** on the midterm. Everything in this chapter is.

## Notes

### How a junction forms

Put [[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|p-type]] material (lots of holes, few electrons) against n-type material (lots of electrons, few holes). Think of two gases separated by a porous wall with a different concentration on each side. When the wall is removed, particles **diffuse** from high concentration to low concentration, no electric force needed.

1. **Diffusion.** Holes diffuse from the p side into the n side. Electrons diffuse from the n side into the p side.
2. **Recombination.** A diffusing electron meets a hole on the other side and they annihilate, since the electron falls back into the empty bond and the energy leaves as heat or a photon. One electron and one hole disappear.
3. **Exposed ions.** The dopant atoms don't move, because they're locked in the crystal. Near the boundary, the mobile carriers that used to cancel them are gone, so the fixed ions are *uncovered*:
   - On the n side, each electron that left uncovers a **positive donor ion** (charge $+eN_d$).
   - On the p side, each hole that left uncovers a **negative acceptor ion** (charge $-eN_a$).

A note on symbols: $N_a$ and $N_d$ are the same acceptor and donor concentrations that [[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|Chapter 3]] wrote as $N_A$ and $N_D$ (lower case is just the usual convention for junctions). $e = 1.602\times10^{-19}$ C is the [[ch01-electrostatics-review#Potential energy and potential|elementary charge]], so $eN_d$ is the charge per cm³ of the exposed donor ions. $x$ is position measured across the junction, with $x = 0$ at the boundary, and $x_n$ and $x_p$ are how far the depletion region reaches into the n and p sides.

That region is the **depletion region** (also called the **space charge region** or **charge depletion region**). It has almost no free carriers, only fixed ions, which is the whole reason it's called "depleted". Its total width is $w = x_n + x_p$.

> [!tip] The pure-water analogy from [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|Chapter 3]] doesn't apply here. The region is not a neutral mixture, it's a layer of *uncovered* charge. A good picture is two walls of fixed ions facing each other across a gap that carriers have been swept out of.

**The diffusion doesn't go on forever.** The uncovered charge builds an electric field that pushes carriers *back* the way they came, opposing the diffusion. The depletion region grows until the field-driven flow exactly cancels the diffusion flow, and then the junction is in equilibrium with no net current.

**Neutrality of the whole sample.** The sample as a whole is still electrically neutral. Every electron that left an n-side donor ended up recombined on the p side, so the positive charge uncovered on the n side equals the negative charge uncovered on the p side. For a cross-sectional area $A$:

$$
eN_d\,x_n\,A = eN_a\,x_p\,A \quad\Rightarrow\quad N_d\,x_n = N_a\,x_p \tag{7.1}
$$

This tells you something useful right away: **the more heavily doped side has the thinner depletion layer**. If $N_a > N_d$, then $x_p < x_n$, and the depletion region reaches mostly into the lightly doped n side. The same total charge needs fewer layers where the charge density is higher.

> [!note] Neutrality fails at the interface between two different materials, which is exactly where a junction forms. That's why a field can exist there without violating the rule from [[ch03-intro-to-semiconductors#Compensation and neutrality|Chapter 3]].

### Electric field and potential in the junction

**Direction of the field.** The n side of the depletion region is positively charged and the p side is negatively charged. The field points from positive to negative, so across the junction it points **from the n side to the p side**. A hole at the junction is pushed back toward p and an electron is pushed back toward n, which is the field opposing the diffusion.

**Model: the depletion approximation.** To get numbers we use a simple model. The depletion region has **sharp edges** at $-x_p$ and $+x_n$, with a uniform charge density inside, and the neutral regions outside have no field. Then:

| Region | Charge density $\rho$ |
| --- | --- |
| $x < -x_p$ (neutral p) | $0$ |
| $-x_p < x < 0$ | $-eN_a$ |
| $0 < x < x_n$ | $+eN_d$ |
| $x > x_n$ (neutral n) | $0$ |

**Poisson's equation** connects charge, field and potential, and it's the only new tool this chapter needs:

$$
\frac{dE}{dx} = \frac{\rho}{\varepsilon_s}, \qquad \frac{d^2\varphi}{dx^2} = -\frac{\rho}{\varepsilon_s} \tag{7.2}
$$

where $E(x)$ is the electric field at position $x$, $\varphi(x)$ is the electrostatic potential (V), and $\rho$ is the **charge density** (C/cm³). This $\rho$ is not the resistivity from [[ch03-intro-to-semiconductors#Drift current and mobility|Chapter 3]]; the chapter uses it only for charge density. $\varepsilon_s = \varepsilon_r\varepsilon_0$ is the [[ch01-electrostatics-review#Electric fields and forces|permittivity]] of the semiconductor. For silicon $\varepsilon_r = 11.7$, and the number most convenient for our units is

$$
\varepsilon_0 = 8.85\times10^{-14}\ \text{F/cm} = 5.52\times10^{5}\ \frac{e}{\text{V}\cdot\text{cm}}
$$

(The second form has the electron charge folded in, so the $e$ in the formulas below cancels.) The relative permittivity $\varepsilon_r$ is how much the material reduces the field compared with vacuum, because its atoms polarize.

**Field.** Integrate $\rho/\varepsilon_s$ once, starting from $E = 0$ at each edge of the depletion region:

$$
E(x) = -\frac{eN_a}{\varepsilon_s}(x + x_p), \quad -x_p \le x \le 0 \tag{7.3a}
$$

$$
E(x) = -\frac{eN_d}{\varepsilon_s}(x_n - x), \quad 0 \le x \le x_n \tag{7.3b}
$$

The minus sign means the field points in the $-x$ direction, from n to p. The field is zero at both edges and is **largest in magnitude at the junction** $x = 0$, where the two expressions agree:

$$
|E_{\max}| = \frac{eN_a x_p}{\varepsilon_s} = \frac{eN_d x_n}{\varepsilon_s} \tag{7.4}
$$

(They agree because of Eq. 7.1.) The graph of $E(x)$ is a **triangle**, as in Figure 7.1.

**Potential.** Because $E = -d\varphi/dx$, the potential is the (negative) area under the field graph. Taking $\varphi = 0$ at the far p edge $x = -x_p$ and integrating up to the n edge:

$$
\varphi(x) = \frac{eN_a}{2\varepsilon_s}(x + x_p)^2, \quad -x_p \le x \le 0 \tag{7.5a}
$$

$$
\varphi(x) = \frac{eN_d}{\varepsilon_s}\left(x_nx - \frac{x^2}{2}\right) + \frac{eN_a}{2\varepsilon_s}x_p^2, \quad 0 \le x \le x_n \tag{7.5b}
$$

The potential climbs smoothly from the p side to the n side, and the total rise is

$$
V_{total} = \varphi(x_n) = \frac{e}{2\varepsilon_s}\left(N_dx_n^2 + N_ax_p^2\right) \tag{7.6}
$$

This is the same as the area of the field triangle: $V_{total} = \tfrac{1}{2}\,w\,|E_{\max}|$ (Eq. 7.12).

<div class="melon-semi" data-view="pn">Interactive p-n junction diagram (open this page on the site to use it).</div>
*Figure 7.1: A p-n junction (shown with $N_a > N_d$). Left, the three profiles: the charge density is two blocks of equal area, the field is a triangle peaked at the junction, and the potential rises from the p side to the n side by $V_{total}$. The more heavily doped p side is thinner. Right, the band diagram (electron energy increases upward): unbiased there is one flat $E_F$, forward bias lowers the barrier and splits the Fermi levels by $eV_D$, and reverse bias raises the barrier and splits them the other way. Drag the bias and the doping to see all of it change.*

> [!tip] Reading the plots is a 3-step habit. Charge density is the slope of $E$. Field is minus the slope of $\varphi$. So a *flat* $\rho$ gives a *straight-line* $E$ and a *parabolic* $\varphi$. A steep $E$ line means high doping.

### Fermi levels and the built-in potential

[[ch06-carrier-concentrations#The Fermi level is flat in equilibrium|Chapter 6]] showed that in equilibrium a single Fermi level $E_F$ applies to the whole system. Before the p and n pieces touch, they have *different* Fermi levels: $E_F$ sits near $E_v$ in the p-type piece and near $E_c$ in the n-type piece. Once they touch, electrons flow from the higher-$E_F$ side (n) to the lower-$E_F$ side (p) until the levels line up. That's the same diffusion described above.

A useful analogy is two water tanks at different heights joined by a pipe. Water flows until both surfaces are at the same level, and $E_F$ plays the role of the water level.

The [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|energy bands]] themselves can't stay put while $E_F$ moves, so they **bend**. In the depletion region the bands shift vertically so that $E_F$ is flat all the way across. The amount of the shift is the original difference between the two Fermi levels:

$$
eV_{bi} = E_{Fn} - E_{Fp} \quad \text{(before contact)} \tag{7.7}
$$

Here $E_{Fn}$ and $E_{Fp}$ are the Fermi levels of the n-type and p-type pieces, and $V_{bi}$ is the **built-in potential**, the potential step across the junction in volts (multiplying by $e$ turns it into an energy).

**Why does uphill point to the left?** In [[ch01-electrostatics-review#Potential energy and potential|Chapter 1]] the potential rose toward the positive side. Here the band diagram looks like it climbs toward the p side. The band diagram shows the **energy of an electron**, $U = -e\varphi$, and electrons have negative charge. So high potential on the n side is *low* electron energy on the n side. Electrons "roll uphill" in potential, because that lowers their energy.

The band diagram is the right-hand side of Figure 7.1 above.

**Formula for $V_{bi}$.** We want the Fermi level difference in terms of the doping. From [[ch06-carrier-concentrations#Where is the Fermi level?|Chapter 6]] (strong doping):

Here $E_i$ is the [[ch06-carrier-concentrations#Where is the Fermi level?|intrinsic Fermi level]] (about mid-gap) and $n_i$ the [[ch03-intro-to-semiconductors#Intrinsic semiconductors: electrons and holes|intrinsic concentration]], both from Chapters 3 and 6.

- On the n side, $n_0 = N_d$, so $E_{Fn} - E_i = k_BT\ln\dfrac{N_d}{n_i}$.
- On the p side, $p_0 = N_a$, so $E_i - E_{Fp} = k_BT\ln\dfrac{N_a}{n_i}$.

Add the two. The intrinsic level $E_i$ cancels, leaving $E_{Fn} - E_{Fp}$:

$$
eV_{bi} = k_BT\ln\frac{N_aN_d}{n_i^2}, \qquad V_{bi} = \frac{k_BT}{e}\ln\frac{N_aN_d}{n_i^2} \tag{7.8}
$$

- $N_a$ and $N_d$ here mean the **net** doping on each side: $N_a - N_d$ on the p side and $N_d - N_a$ on the n side.
- $k_BT/e$ is in volts, so with $k_BT = 0.02586$ eV you get $V_{bi}$ in volts directly.
- Higher doping on either side raises $V_{bi}$, but only logarithmically. Silicon junctions land between about 0.6 V and 0.9 V.
- $V_{bi}$ depends on temperature through both $k_BT$ and $n_i(T)$. It does **not** simply double if $T$ doubles, because $n_i$ also changes (and rises sharply).
- $V_{bi}$ can never exceed $E_g/e$. At extreme doping it approaches the gap (about 1.1 V for Si).

> [!warning] $V_{bi}$ is *not* a battery. You cannot put a voltmeter across a diode and read it. It is the internal potential step that the contact between two Fermi levels leaves behind, and every other contact in the circuit (metal to semiconductor) has its own potential step that cancels it. A diode at zero bias has zero net voltage and zero current.

### Applying a voltage: forward and reverse bias

The **bias** $V_D$ is the voltage applied across the diode, defined as the potential of the **p side minus the n side**.

| Bias | Connection | $V_D$ |
| --- | --- | --- |
| Forward | p side to the positive terminal | $V_D > 0$ |
| Reverse | n side to the positive terminal | $V_D < 0$, written $V_R = -V_D$ |
| Zero | short-circuited or unconnected | $V_D = 0$ |

Almost all of the applied voltage drops across the depletion region, because that's the high-resistance part (it has no free carriers). So the voltage that the depletion region sees, $V_{total}$ (the total potential step across it, in volts), is

$$
V_{total} = V_{bi} - V_D \quad (= V_{bi} + V_R \text{ in reverse bias}) \tag{7.9a}
$$

In the energy diagram, the Fermi levels on the two sides are no longer equal (the junction isn't in equilibrium any more). They're separated by exactly the applied energy:

$$
E_{Fn} - E_{Fp} = eV_D \tag{7.9b}
$$

**Reverse bias** ($V_D < 0$, Figure 7.1, band diagram with the bias set negative):

- $V_{total}$ is **larger** than $V_{bi}$, so the barrier is higher.
- More ions get uncovered, so the depletion region **widens**.
- [[ch03-intro-to-semiconductors#Doping: extrinsic semiconductors|Majority carriers]] (holes on p, electrons on n) are blocked by the taller barrier.
- Minority carriers (electrons on the p side, holes on the n side) are *swept* down the barrier. This current is **small**, because it's limited by the tiny number of minority carriers, and it hardly depends on the voltage.

**Forward bias** ($V_D > 0$, Figure 7.1, band diagram with the bias set positive):

- $V_{total}$ is **smaller** than $V_{bi}$, so the barrier is lower.
- Fewer ions stay uncovered, so the depletion region **narrows**.
- Majority carriers can cross the lowered barrier (electrons n→p, holes p→n), which gives a **large** current.

So the junction conducts easily in one direction and hardly at all in the other. That's what a diode is.

**The diode equation** (details in Neamen 8.5.1) summarises this:

$$
I_D = I_S\left(e^{V_D/V_t} - 1\right), \qquad V_t = \frac{k_BT}{e} \tag{7.10}
$$

- $I_D$ is the diode current (A) and $V_D$ the applied bias (V).
- $V_t = k_BT/e = 0.02586$ V at 300 K is the *thermal voltage*.
- $I_S$ is the reverse saturation current. For Si junctions it's typically $10^{-14}$ to $10^{-12}$ A. It depends on temperature but not on $V_D$.
- $I_D$ is positive when the current flows from p to n.
- Forward ($V_D \gg V_t$): $I_D \approx I_Se^{V_D/V_t}$, an exponential rise.
- Reverse ($V_D < 0$, $|V_D| \gg V_t$): $I_D \approx -I_S$, tiny and flat.

### Width of the space charge region

Now put the pieces together to find $x_n$, $x_p$ and $w$ for a given $V_{total}$.

**Step 1: charge balance.** From Eq. (7.1), $x_p = \dfrac{N_d}{N_a}x_n$.

**Step 2: potential.** Substitute that into Eq. (7.6):

$$
V_{total} = \frac{e}{2\varepsilon_s}\left(N_dx_n^2 + N_a\frac{N_d^2}{N_a^2}x_n^2\right) = \frac{eN_d(N_a+N_d)}{2\varepsilon_sN_a}\,x_n^2
$$

**Step 3: solve for $x_n$** (and then $x_p$ from step 1):

$$
x_n = \left[\frac{2\varepsilon_sV_{total}}{e}\cdot\frac{N_a}{N_d}\cdot\frac{1}{N_a+N_d}\right]^{1/2} \tag{7.11a}
$$

$$
x_p = \left[\frac{2\varepsilon_sV_{total}}{e}\cdot\frac{N_d}{N_a}\cdot\frac{1}{N_a+N_d}\right]^{1/2} \tag{7.11b}
$$

$$
w = x_n + x_p = \left[\frac{2\varepsilon_sV_{total}}{e}\cdot\frac{N_a+N_d}{N_aN_d}\right]^{1/2} \tag{7.11c}
$$

with $V_{total} = V_{bi} - V_D$.

**What the formulas tell you:**

- Every width scales as $\sqrt{V_{total}}$. Quadrupling $V_{total}$ only doubles $w$.
- $x_n/x_p = N_a/N_d$ is fixed by the doping, so **when $x_n$ grows by some factor, $x_p$ grows by the same factor**.
- If one side is much more heavily doped (say $N_a \gg N_d$), then $w \approx x_n$ and the depletion region lies almost entirely in the lightly doped side. This is called a **one-sided junction**, and $w \approx \sqrt{2\varepsilon_sV_{total}/(eN_d)}$.
- Reverse bias grows $w$. Forward bias shrinks it.

**A triangle shortcut.** Since $V_{total}$ is the area of the field triangle (base $w$, height $|E_{\max}|$):

$$
V_{total} = \frac{1}{2}\,w\,|E_{\max}| \quad\Rightarrow\quad |E_{\max}| = \frac{2V_{total}}{w} \tag{7.12}
$$

so once you have $w$, the peak field is a one-line calculation. It also gives a quick check on any answer: $|E_{\max}| = eN_dx_n/\varepsilon_s$ must give the same number.

**Units.** Use cm everywhere: $\varepsilon_s$ in F/cm (or $\varepsilon_r\times5.52\times10^5$ in $e$/(V·cm) so the $e$ cancels), concentrations in cm⁻³, and the width comes out in cm. Convert to µm at the end ($1\ \mu\text{m} = 10^{-4}$ cm).

## Key formulas

**Charge balance**

$$
N_dx_n = N_ax_p \tag{7.1}
$$

**Poisson's equation and the field**

$$
\frac{dE}{dx} = \frac{\rho}{\varepsilon_s}, \qquad |E_{\max}| = \frac{eN_dx_n}{\varepsilon_s} = \frac{eN_ax_p}{\varepsilon_s} \tag{7.2, 7.4}
$$

- $\varepsilon_s = \varepsilon_r\varepsilon_0$; for Si $\varepsilon_r = 11.7$, $\varepsilon_0 = 8.85\times10^{-14}$ F/cm
- $\rho$: charge density (C/cm³), not resistivity; $E_{\max}$: peak field at $x = 0$; $x_n$, $x_p$: depletion depth on the n and p sides; $w = x_n + x_p$; $e = 1.602\times10^{-19}$ C
- The field points from n to p

**Built-in potential**

$$
V_{bi} = \frac{k_BT}{e}\ln\frac{N_aN_d}{n_i^2} \tag{7.8}
$$

- $N_a$, $N_d$: **net** doping on the p and n sides

**Bias**

$$
V_{total} = V_{bi} - V_D = V_{bi} + V_R, \qquad E_{Fn} - E_{Fp} = eV_D \tag{7.9}
$$

- $V_D > 0$ forward (barrier down, $w$ shrinks) · $V_D < 0$ reverse (barrier up, $w$ grows)

**Depletion widths**

$$
x_n = \left[\frac{2\varepsilon_sV_{total}}{e}\frac{N_a}{N_d}\frac{1}{N_a+N_d}\right]^{1/2}, \quad x_p = \frac{N_d}{N_a}x_n, \quad w = \left[\frac{2\varepsilon_sV_{total}}{e}\frac{N_a+N_d}{N_aN_d}\right]^{1/2} \tag{7.11}
$$

$$
V_{total} = \tfrac{1}{2}\,w\,|E_{\max}| \tag{7.12}
$$

**Diode equation**

$$
I_D = I_S\left(e^{V_D/V_t} - 1\right), \qquad V_t = \frac{k_BT}{e} = 0.02586\ \text{V} \tag{7.10}
$$

## Examples

### Example 1: Built-in potential

A silicon p-n junction at $300$ K has $N_d = 6\times10^{16}$ cm⁻³ and $N_a = 1\times10^{16}$ cm⁻³ on the n side, and $N_a = 2\times10^{17}$ cm⁻³ on the p side. Find $V_{bi}$. Use $n_i = 1.5\times10^{10}$ cm⁻³.

The n side has both kinds of doping, so use the **net** donor concentration:

$$
N_d^{\text{net}} = 6\times10^{16} - 1\times10^{16} = 5\times10^{16}\ \text{cm}^{-3}
$$

The p side is $N_a = 2\times10^{17}$ cm⁻³ (only acceptors). By Eq. (7.8):

$$
V_{bi} = (0.02586)\ln\frac{(2\times10^{17})(5\times10^{16})}{(1.5\times10^{10})^2} = (0.02586)\ln(4.44\times10^{13}) = (0.02586)(31.4) = 0.81\ \text{V}
$$

This agrees with $0.814$ V; the tiny difference is rounding in $k_BT$ and $n_i$.

> [!warning] Using the *total* $N_d = 6\times10^{16}$ instead of the net $5\times10^{16}$ gives $0.82$ V. The difference is small here only because of the logarithm, but net doping is what the formula needs.

### Example 2: Does $V_{bi}$ double if $T$ doubles?

For a given device, the temperature doubles. What happens to the potential barrier?

It **changes, but doesn't exactly double, because $n_i$ depends on temperature too**. In $V_{bi} = \dfrac{k_BT}{e}\ln\dfrac{N_aN_d}{n_i^2}$, the prefactor does double, but $n_i$ grows rapidly with $T$ ([[ch06-carrier-concentrations#Counting carriers|Chapter 6]]), which shrinks the logarithm. The doping $N_a$ and $N_d$ are fixed by the crystal and don't change with $T$.

### Example 3: The total barrier under bias

A diode has $V_{bi} = 0.65$ V. Find the total barrier (a) with a $0.2$ V reverse bias, (b) when the p side is connected to the positive terminal of a $0.2$ V source.

**(a)** Reverse: $V_D = -0.2$ V, so by Eq. (7.9)

$$
V_{total} = V_{bi} - V_D = 0.65 - (-0.2) = 0.85\ \text{V}
$$

**(b)** The p side is on the positive terminal, so this is **forward** bias, $V_D = +0.2$ V:

$$
V_{total} = 0.65 - 0.2 = 0.45\ \text{V}
$$

**Fermi levels in each case.** In forward bias $E_{Fn}$ is $0.2$ eV *above* $E_{Fp}$, so the p-side Fermi level is the **lower** one. (In reverse bias it's the opposite.) The Fermi levels are aligned only at zero bias.

### Example 4: Depletion widths under reverse bias

A silicon p-n junction at $300$ K has $N_a = 2\times10^{16}$ cm⁻³ and $N_d = 5\times10^{15}$ cm⁻³. Find $x_n$, $x_p$, $w$ and $E_{\max}$ at a reverse bias of $2.1$ V.

**Step 1: $V_{bi}$.**

$$
V_{bi} = (0.02586)\ln\frac{(2\times10^{16})(5\times10^{15})}{(1.5\times10^{10})^2} = (0.02586)(26.8) = 0.694\ \text{V}
$$

**Step 2: $V_{total}$.** Reverse bias adds:

$$
V_{total} = V_{bi} + V_R = 0.694 + 2.1 = 2.79\ \text{V}
$$

**Step 3: $x_n$.** With $\varepsilon_s = 11.7\times8.85\times10^{-14} = 1.04\times10^{-12}$ F/cm, the combination $2\varepsilon_sV_{total}/e$ is

$$
\frac{2\varepsilon_sV_{total}}{e} = \frac{2(1.04\times10^{-12})(2.79)}{1.602\times10^{-19}} = 3.61\times10^{7}\ \text{cm}^{-1}
$$

so, by Eq. (7.11a),

$$
x_n = \left[(3.61\times10^{7})\cdot\frac{2\times10^{16}}{5\times10^{15}}\cdot\frac{1}{2.5\times10^{16}}\right]^{1/2} = \left[5.77\times10^{-9}\right]^{1/2} = 7.6\times10^{-5}\ \text{cm} = 0.76\ \mu\text{m}
$$

**Step 4: the rest.**

$$
x_p = \frac{N_d}{N_a}x_n = \frac{5\times10^{15}}{2\times10^{16}}(0.76) = 0.19\ \mu\text{m}, \qquad w = 0.76 + 0.19 = 0.95\ \mu\text{m}
$$

The lightly doped n side takes 80% of the width.

**Step 5: the field, with a check.**

$$
|E_{\max}| = \frac{eN_dx_n}{\varepsilon_s} = \frac{(1.602\times10^{-19})(5\times10^{15})(7.6\times10^{-5})}{1.04\times10^{-12}} = 5.9\times10^{4}\ \text{V/cm}
$$

Check with the triangle: $\tfrac{1}{2}w|E_{\max}| = \tfrac{1}{2}(0.95\times10^{-4})(5.9\times10^{4}) = 2.8$ V $= V_{total}$ ✓.

### Example 5: Scaling with bias

A silicon junction has $x_n = 0.12\ \mu$m with no bias and $V_{bi} = 0.5$ V. Find $x_n$ with a $1.5$ V reverse bias, and say what happens to $x_p$ if $x_n$ rises by 50%.

Since $x_n \propto \sqrt{V_{total}}$ and the doping doesn't change, take a ratio:

$$
V_{total}: 0.5\ \text{V} \to 0.5 + 1.5 = 2.0\ \text{V} \qquad \Rightarrow \qquad \frac{x_n'}{x_n} = \sqrt{\frac{2.0}{0.5}} = 2
$$

$$
x_n' = 2(0.12) = 0.24\ \mu\text{m}
$$

For the second part, $x_p = (N_d/N_a)\,x_n$ with a *fixed* ratio, so if $x_n$ increases by 50%, **$x_p$ also increases by exactly 50%**.

> [!tip] Without the doping values you can still compare widths by taking ratios. Both $x_n$ and $x_p$ scale with the same $\sqrt{V_{total}}$ factor, so everything except $V_{total}$ drops out.

### Example 6: Which way does the field point?

A silicon p-n junction at $300$ K has $N_a$ on the p side and $N_d$ on the n side. In the depletion region, which way does the electric field point?

The n side of the depletion region has exposed $+$ donor ions and the p side has exposed $-$ acceptor ions. A field points from positive charge to negative charge, so it points **from the n side to the p side**. That is the direction that pushes electrons back toward n and holes back toward p, opposing diffusion.

### Example 7: Forward and reverse diode current

An ideal silicon diode has $I_S = 1.0\times10^{-13}$ A at $300$ K. Find the current at (a) $V_D = +0.60$ V and (b) $V_D = -2.0$ V.

**(a)** Forward:

$$
I_D = I_S\left(e^{0.60/0.02586} - 1\right) = (10^{-13})(e^{23.2}) = (10^{-13})(1.2\times10^{10}) = 1.2\ \text{mA}
$$

**(b)** Reverse, with $|V_D| \gg V_t$ so the exponential vanishes:

$$
I_D \approx -I_S = -1.0\times10^{-13}\ \text{A}
$$

The forward current is about $10^{10}$ times bigger than the reverse current, and a change of only $0.06$ V in forward bias multiplies the current by $e^{0.06/0.02586} \approx 10$.

## Common mistakes

- Using the **total** doping instead of the **net** doping on a side with both $N_a$ and $N_d$ in $V_{bi}$ and the width formulas
- Mixing up the definition of $V_D$. It's the p side *minus* the n side, so forward bias is positive. Reverse bias adds to the barrier: $V_{total} = V_{bi} + V_R$
- Treating $V_{bi}$ as a voltage you can measure with a meter or as a source that could drive current
- Saying the depletion region is wider on the *more* heavily doped side. It's the opposite: $N_dx_n = N_ax_p$ puts most of the width on the **lighter** side
- Forgetting the $\sqrt{}$: doubling $V_{total}$ doesn't double $w$, it multiplies it by $\sqrt{2}$
- Reading the band diagram as electric potential. It shows electron energy, so "uphill" runs in the opposite direction to the potential
- Mixing cm and µm in the width formula. Work in cm and convert at the end
- Using the wrong $x$: $E_{\max} = eN_dx_n/\varepsilon_s$ pairs $N_d$ with $x_n$ (and $N_a$ with $x_p$), never $N_d$ with $x_p$
- Thinking the field is zero inside the depletion region because there are no free carriers. The *fixed* charge is exactly what makes the field
- Believing a doubled temperature doubles $V_{bi}$ (it doesn't, because $n_i$ also changes)
