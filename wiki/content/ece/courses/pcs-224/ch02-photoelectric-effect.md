---
title: "2. The Photoelectric Effect"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **39.2** + lecture notes · week 2

When light shines on a metal, electrons can come out of its surface. You'd think classical waves could explain that easily, but the experiment disagrees with the classical prediction in several separate ways. Einstein's explanation was that light comes in discrete packets of energy called **photons**. It's one of the first pieces of quantum physics, and the idea behind everything in the next few chapters (energy levels, bands, band gaps).

The chapter in four lines:

1. An electron needs a minimum energy, the **work function** $\phi$, to leave the surface.
2. A photon carries energy $E = hf = hc/\lambda$, set by its **frequency**, not its brightness.
3. The electron that escapes with the most energy has $K_{\max} = hf - \phi$.
4. Brightness (intensity) only changes **how many** electrons come out, not how energetic they are.

> [!note] Lab 1 (Photoelectric Effect) is this experiment: measure the stopping potential at several frequencies and get $h$ from the slope of Figure 2.1.

## Notes

### The experiment

Light shines on a metal plate (the **emitter**, E) inside a vacuum tube. Electrons that escape are collected at a second plate (the **collector**, C), and an ammeter measures the current. An adjustable voltage between the plates lets you push the electrons along or slow them down.

> [!tip] There's a PhET simulation of exactly this experiment (*Photoelectric Effect*, phet.colorado.edu). Ten minutes with it makes every graph below pretty obvious.

**What you control and measure:**

- The **frequency** (colour) and **intensity** (brightness) of the light
- The voltage between the plates
- The resulting photocurrent

**Work function.** Electrons in a metal are bound to it. The minimum energy needed to pull one out through the surface is the **work function** $\phi$. It's a property of the material, but it also depends on the surface condition, since contamination and crystal orientation change the measured value.

**Not every electron comes out with the same energy.** $\phi$ is the *minimum* escape energy, paid by electrons that start at the top of the occupied energy range. Electrons that start deeper in the material have to spend extra energy getting to the surface, so they come out slower. The emitted electrons therefore have a **range** of kinetic energies, and the largest one belongs to the electrons that only needed $\phi$.

### Stopping potential

How do you measure the kinetic energy of the fastest photoelectrons? Put a **retarding** voltage between the plates that pushes electrons back toward the emitter, and increase it until the photocurrent just reaches zero. The magnitude of that voltage is the **stopping potential** $|V_s|$.

At that point even the fastest electron can't climb the potential hill, so all of its kinetic energy has been converted into potential energy:

$$
K_{\max} = e|V_s| \tag{2.1}
$$

So a stopping potential of $2.0$ V means $K_{\max} = 2.0$ eV. It's Eq. (1.5) from [[ch01-electrostatics-review|Chapter 1]] in action.

### What the experiment shows

There are four results, and none of them fit the wave picture of light.

| Observation | Classical wave prediction | What's measured |
| --- | --- | --- |
| Raise the **intensity** at fixed frequency | Energy per electron grows, so $K_{\max}$ and $\lvert V_s\rvert$ should grow | Saturation current rises. $\lvert V_s\rvert$ is **unchanged** |
| Change the **frequency** | Shouldn't matter much (only total energy matters) | $K_{\max}$ rises **linearly** with $f$ |
| Go below a certain frequency | Bright enough light should still work eventually | **No emission** below a threshold frequency $f_0$, at any intensity |
| Very dim light | Electron should need time to collect enough energy | Emission is **instant**, no measurable delay |

In terms of the current–voltage curve:

- At a high enough **positive** collector voltage the current saturates, because basically every emitted electron is collected. The saturation value scales with intensity.
- As the voltage becomes **negative** (retarding), the current falls and hits zero at $-|V_s|$.
- At a fixed frequency, the stopping potential is the same for bright and dim light. Only the saturation current is different.

### Einstein's photon picture (1905)

Einstein proposed that light's energy comes in discrete packets called **photons**, each carrying

$$
E = hf = \frac{hc}{\lambda} \tag{2.2}
$$

where $h = 6.626\times10^{-34}$ J·s is Planck's constant. This form is really handy for the course:

$$
E\ (\text{eV}) = \frac{1240}{\lambda\ (\text{nm})} \tag{2.3}
$$

One photon gives all of its energy to one electron. Part of that energy pays the work function and the rest becomes kinetic energy:

$$
hf = \phi + K_{\max} \quad\Rightarrow\quad K_{\max} = hf - \phi = e|V_s| \tag{2.4}
$$

That explains every observation in the table:

- **Intensity** is the number of photons per second. More photons means more electrons and so more current, but each photon still has the same energy, so $K_{\max}$ doesn't change.
- **Frequency** sets the energy per photon, so $K_{\max}$ rises linearly with $f$ with slope $h$.
- **Threshold.** If $hf < \phi$, no single photon can free an electron, no matter how many arrive. The threshold frequency and wavelength are
  $$
  f_0 = \frac{\phi}{h}, \qquad \lambda_0 = \frac{hc}{\phi} \tag{2.5}
  $$
- **No delay.** The energy arrives all in one lump, so there's nothing to build up.

![[pcs-224-photoelectric-k-vs-f.svg]]
*Figure 2.1: $K_{\max}$ against frequency is a straight line with slope $h$. It crosses zero at $f_0 = \phi/h$ and would hit $-\phi$ at $f = 0$.*

**Reading the graph.** Plot $K_{\max}$ (or $e|V_s|$) against $f$:

- The **slope** is Planck's constant $h$ (or $h/e$ if you plot $|V_s|$ itself).
- The **$f$-intercept** is the threshold frequency $f_0$.
- The **vertical intercept** (extended back to $f = 0$) is $-\phi$.

> [!warning] Don't mix up the two roles of "energy". Intensity changes **photons per second** and frequency changes **energy per photon**. Doubling the brightness never increases $K_{\max}$, and a faint beam above threshold still ejects electrons instantly.

### Technology connection: EUV lithography

The same relation sets how small a chip feature can be. Advanced chip fabrication uses extreme-ultraviolet light at $\lambda = 13.5$ nm, so each photon carries

$$
E = \frac{1240}{13.5} \approx 92\ \text{eV}
$$

compared with only 2–3 eV for visible photons. The photon energy comes from the wavelength, not the brightness.

## Key formulas

**Photon energy**

$$
E = hf = \frac{hc}{\lambda}, \qquad E\ (\text{eV}) = \frac{1240}{\lambda\ (\text{nm})} \tag{2.2, 2.3}
$$

- $h = 6.626\times10^{-34}$ J·s $= 4.136\times10^{-15}$ eV·s
- $hc \approx 1240$ eV·nm

**Stopping potential**

$$
K_{\max} = e|V_s| \tag{2.1}
$$

**Einstein's photoelectric equation**

$$
hf = \phi + K_{\max}, \qquad K_{\max} = hf - \phi = e|V_s| \tag{2.4}
$$

- $\phi$: work function (eV), the minimum energy to escape
- $K_{\max}$: kinetic energy of the fastest emitted electrons

**Threshold**

$$
f_0 = \frac{\phi}{h}, \qquad \lambda_0 = \frac{hc}{\phi} = \frac{1240\ \text{eV·nm}}{\phi} \tag{2.5}
$$

- Emission only occurs for $f \ge f_0$ ($\lambda \le \lambda_0$)

**Photon rate from power**

$$
\frac{N}{t} = \frac{P}{hf} = \frac{P}{E_{\text{photon}}} \tag{2.6}
$$

## Examples

### Example 1: Cutoff and stopping potential

> Like lecture Example 1

A metal has a work function of $\phi = 3.10$ eV. (a) Find the cutoff wavelength and frequency. (b) What is the stopping potential for $250$ nm light?

**(a)** From Eq. (2.5):

$$
\lambda_0 = \frac{1240}{3.10} = 400\ \text{nm}, \qquad f_0 = \frac{\phi}{h} = \frac{3.10(1.602\times10^{-19})}{6.626\times10^{-34}} = 7.50\times10^{14}\ \text{Hz}
$$

(Check: $c/\lambda_0 = 3.00\times10^{8}/400\times10^{-9} = 7.50\times10^{14}$ Hz ✓.)

**(b)** Photon energy at $250$ nm:

$$
E = \frac{1240}{250} = 4.96\ \text{eV}
$$

This is above $\phi$, so electrons come out. By Eq. (2.4):

$$
K_{\max} = 4.96 - 3.10 = 1.86\ \text{eV} \quad\Rightarrow\quad |V_s| = \frac{K_{\max}}{e} = 1.86\ \text{V}
$$

### Example 2: Photons per second

> Like lecture Example 2 (sodium-vapor lamp)

A green laser pointer emits $5.0$ W at $\lambda = 532$ nm. How many photons does it emit per second, and per minute?

1. **Energy of one photon**:
   $$E = \frac{1240}{532} = 2.33\ \text{eV} = 2.33(1.602\times10^{-19}) = 3.73\times10^{-19}\ \text{J}$$
2. **Photons per second**, Eq. (2.6):
   $$\frac{N}{t} = \frac{5.0\ \text{J/s}}{3.73\times10^{-19}\ \text{J}} = 1.34\times10^{19}\ \text{s}^{-1}$$
3. **Per minute**: $60\times1.34\times10^{19} = 8.0\times10^{20}$

> [!note] Even a "small" optical power is an enormous number of photons. That's why light looks continuous in daily life, and the quantum nature only shows up when you look at single electrons.

### Example 3: Finding $\phi$ and $h$ from data

An experiment gives a stopping potential of $1.00$ V at $\lambda = 400$ nm and $2.03$ V at $\lambda = 300$ nm. Find (a) the work function, (b) the cutoff wavelength, and (c) Planck's constant.

**(a)** Photon energy at $400$ nm is $1240/400 = 3.10$ eV, so by Eq. (2.4):

$$
\phi = hf - e|V_s| = 3.10 - 1.00 = 2.10\ \text{eV}
$$

Check with the second point: $1240/300 = 4.13$ eV, and $4.13 - 2.10 = 2.03$ eV ✓.

**(b)**

$$
\lambda_0 = \frac{1240}{2.10} = 590\ \text{nm}
$$

**(c)** $h$ is the slope of $K_{\max}$ against $f$. The two frequencies are $f_1 = c/400\,\text{nm} = 7.50\times10^{14}$ Hz and $f_2 = c/300\,\text{nm} = 1.00\times10^{15}$ Hz:

$$
h = \frac{\Delta K}{\Delta f} = \frac{(2.03 - 1.00)(1.602\times10^{-19})}{(1.000 - 0.750)\times10^{15}} = 6.6\times10^{-34}\ \text{J·s}
$$

### Example 4: Quick concept checks

> Like the lecture's Quick Checks

Light with $\lambda = 400$ nm hits a metal with $\phi = 2.0$ eV.

- **What's $K_{\max}$?** $1240/400 - 2.0 = 3.1 - 2.0 = 1.1$ eV.
- **What if the intensity doubles?** The number of photons per second doubles, so the **saturation current doubles**. $K_{\max}$ and $|V_s|$ stay at $1.1$ eV and $1.1$ V.
- **What if the light is switched to $0.8f_0$ and made extremely bright?** $hf = 0.8\phi < \phi$ for every photon, so **no** electrons are emitted.
- **What if a photon has energy exactly $\phi$?** The electron barely escapes: $K_{\max} = 0$.

## Common mistakes

- Believing brighter light gives faster electrons. Intensity changes the **current** and frequency changes $K_{\max}$
- Using $K = hf$ and forgetting to subtract $\phi$
- Mixing eV and J in Eq. (2.4). Use $1240/\lambda$ in eV with $\phi$ in eV, or convert **everything** to joules
- Using nm in $E = hc/\lambda$ with SI values of $h$ and $c$ without converting to metres
- Reading $|V_s|$ as the energy in joules. $e|V_s|$ is $K_{\max}$, and the number of volts equals the number of eV
- Thinking the work function is the kinetic energy of every emitted electron. It's only the *minimum* escape cost, so the electrons have a spread of energies
- Expecting a plot of $|V_s|$ against $f$ to have slope $h$. The slope is $h/e$
