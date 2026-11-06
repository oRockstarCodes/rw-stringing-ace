---
title: "2. The Photoelectric Effect"
tags:
  - pcs224
---
## Overview

> [!info] Readings Serway & Jewett **39.2** + lecture notes · week 2

Shine light on a metal and electrons can pop out of its surface. That sounds like something a wave should explain easily, but the experiment disagrees with the wave picture in several ways at once. Einstein's fix was to say light comes in small packets of energy called **photons**. This is the first piece of quantum physics we need, and it leads straight into [[ch04-hall-effect-bohr-model-doping#Why are energies discrete? The Bohr model|energy levels]] and [[ch05-band-structure-and-fermi-function#From atomic levels to energy bands|band gaps]].

The whole chapter in four lines:

1. An electron needs a minimum energy to escape the metal. That's the **work function** $\phi$.
2. A photon carries energy $E = hf = hc/\lambda$. It depends on the light's **frequency**, not its brightness.
3. The fastest escaping electron has $K_{\max} = hf - \phi$.
4. Brightness only changes **how many** electrons come out, not how energetic they are.

> [!note] Lab 1 is this experiment. You measure the stopping potential at several frequencies and get $h$ from the slope of Figure 2.2. [[#What Lab 1 looked like|Our actual numbers]] are further down, and Lab 4 gets $h/e$ as a slope a second way, from LEDs ([[ch05-band-structure-and-fermi-function#Example 5: Light and the gap|Chapter 5]]).

## Notes

### The experiment

Light hits a metal plate (the **emitter**, E) inside a vacuum tube. Any electrons that escape are collected by a second plate (the **collector**, C), and an ammeter measures the current. An adjustable voltage between the plates lets us help the electrons along or push them back.

![[pcs-224-photoelectric-apparatus.svg]]
*Figure 2.1: The photoelectric experiment. Light knocks electrons out of the emitter, the collector catches them, and the voltage can be set to oppose them.*

We control the **frequency** (colour) and **intensity** (brightness) of the light and the voltage, and we measure the photocurrent.

> [!tip] There's a free simulation of exactly this (PhET, *Photoelectric Effect*, at phet.colorado.edu). Ten minutes with it makes every graph in this chapter obvious.

**Work function.** Electrons are held inside a metal. The least energy needed to pull one out through the surface is the **work function** $\phi$. It's a property of the material, though a dirty surface or a different crystal face changes it a little.

**Not every electron leaves with the same energy.** $\phi$ is the *minimum* cost, paid by electrons sitting near the top of the occupied energy range. An electron that starts deeper has to spend extra energy getting to the surface, so it leaves slower. That means the emitted electrons have a **spread** of kinetic energies, and the biggest one belongs to the electrons that only had to pay $\phi$.

### Stopping potential

How do we measure the energy of the fastest electrons? Put a voltage across the tube that pushes electrons *back* toward the emitter. Turn it up until the current just drops to zero. The size of that voltage is the **stopping potential** $|V_s|$.

At that point even the fastest electron can't climb the hill. All its kinetic energy has turned into potential energy:

$$
K_{\max} = e|V_s| \tag{2.1}
$$

where $K_{\max}$ is the kinetic energy of the fastest electrons and $e = 1.602\times10^{-19}$ C is the [[ch01-electrostatics-review#Potential energy and potential|elementary charge]]. So a stopping potential of $2.0$ V means $K_{\max} = 2.0$ eV. This is just energy conservation from [[ch01-electrostatics-review#Potential energy and potential|Chapter 1]].

### What the experiment shows

There are four results, and the wave picture gets every one of them wrong.

| What we change | What a wave should do | What actually happens |
| --- | --- | --- |
| Raise the **intensity** at one frequency | More energy per electron, so $K_{\max}$ and $\lvert V_s\rvert$ should grow | The current goes up. $\lvert V_s\rvert$ **doesn't change** |
| Change the **frequency** | Shouldn't matter much, only total energy should | $K_{\max}$ rises **in a straight line** with $f$ |
| Go below a certain frequency | Bright enough light should eventually work | **Nothing comes out** below a threshold $f_0$, however bright |
| Make the light very dim | Electrons should need time to collect enough energy | Emission is **instant** |

On the current–voltage curve:

- With the collector at a high positive voltage, the current levels off at a **saturation** value, because basically every emitted electron is being collected. Brighter light gives a higher plateau.
- As the voltage turns negative (pushing electrons back), the current falls and reaches zero at $-|V_s|$.
- At one frequency, bright and dim light have the **same** stopping potential. Only the plateau height differs.

### Einstein's photon picture (1905)

Einstein said light's energy comes in packets, and each photon carries

$$
E = hf = \frac{hc}{\lambda} \tag{2.2}
$$

where $E$ is the energy of one photon (not an electric field, even though the symbol is the same), $f$ is the light's frequency (Hz), $\lambda$ is its wavelength (m), $c = 3.00\times10^{8}$ m/s is the speed of light, and $h = 6.626\times10^{-34}$ J·s is Planck's constant. The two forms agree because $c = f\lambda$. Here's a shortcut I use constantly:

$$
E\ (\text{eV}) = \frac{1240}{\lambda\ (\text{nm})} \tag{2.3}
$$

**One photon gives all its energy to one electron.** Part of that energy pays the work function and the rest becomes kinetic energy:

$$
hf = \phi + K_{\max} \quad\Rightarrow\quad K_{\max} = hf - \phi = e|V_s| \tag{2.4}
$$

Here $\phi$ is the work function and $K_{\max}$ the kinetic energy of the fastest electron, both in the same units (eV or J). That explains all four results:

- **Intensity** is the number of photons per second. More photons means more electrons and more current, but each photon is just as energetic, so $K_{\max}$ stays put.
- **Frequency** sets the energy of each photon, so $K_{\max}$ rises in a straight line with $f$, and the slope is $h$.
- **Threshold.** If $hf < \phi$, no single photon can free an electron, and a million of them can't team up. The threshold frequency and wavelength are
  $$
  f_0 = \frac{\phi}{h}, \qquad \lambda_0 = \frac{hc}{\phi} \tag{2.5}
  $$
- **No delay.** The energy arrives all at once in one photon, so there's nothing to wait for.

![[pcs-224-photoelectric-k-vs-f.svg]]
*Figure 2.2: $K_{\max}$ against frequency is a straight line with slope $h$. It crosses zero at $f_0 = \phi/h$ and would hit $-\phi$ at $f = 0$.*

**Reading the graph** of $K_{\max}$ (or $e|V_s|$) against $f$:

- The **slope** is Planck's constant $h$ (or $h/e$ if you plot $|V_s|$ itself).
- The **$f$-intercept** is the threshold frequency $f_0$.
- The **vertical intercept** (extend the line back to $f = 0$) is $-\phi$.

> [!warning] Keep these two apart: intensity changes **photons per second**, and frequency changes **energy per photon**. Doubling the brightness never raises $K_{\max}$, and a faint beam above threshold still ejects electrons instantly.

### What Lab 1 looked like

Lab 1 split a mercury lamp into five spectral lines and shone each one on a photocell, reading the stopping voltage off a multimeter. Every colour shows up **twice**, once as a bright first-order line and once as a dim second-order line. That's the intensity test from the table above, done on the bench.

| Line | $\lambda$ (nm) | $f$ ($10^{14}$ Hz) | $\lvert V_s\rvert$, bright 1st order (V) | $\lvert V_s\rvert$, dim 2nd order (V) |
| --- | --- | --- | --- | --- |
| Yellow | 578.0 | 5.19 | 0.68 | 0.61 |
| Green | 546.1 | 5.49 | 0.79 | 0.71 |
| Blue | 435.8 | 6.88 | 1.41 | 1.37 |
| Blue/violet | 404.7 | 7.41 | 1.60 | 1.54 |
| Dark violet | 365.5 | 8.20 | 1.82 | 1.72 |

Each voltage is good to $\pm0.05$ V. Three things came out of it.

**1. Intensity didn't matter.** The bright and dim line of one colour gave stopping voltages within $0.04$ to $0.10$ V of each other, which is about the size of the reading uncertainty. The dim line was always a little lower, and we put that down to dim lines taking longer to settle. The brightness changed a lot and $|V_s|$ barely moved, which is exactly what the photon picture predicts and the wave picture can't.

**2. Frequency gave a straight line.** Rearranging Eq. (2.4) for the plotted quantity gives

$$
|V_s| = \frac{h}{e}\,f - \frac{\phi}{e}
$$

so the slope is $h/e$ and the vertical intercept is $-\phi/e$. Fitting each set of five points:

| | Slope (V·s) | Intercept (V) | $h = \text{slope}\times e$ (J·s) | $\phi$ (eV) |
| --- | --- | --- | --- | --- |
| 1st order | $3.92\times10^{-15}$ | $-1.34$ | $6.28\times10^{-34}$ | $1.34$ |
| 2nd order | $3.89\times10^{-15}$ | $-1.39$ | $6.23\times10^{-34}$ | $1.39$ |

Averaging the two, with half the difference as the uncertainty, gives $h = (6.26 \pm 0.03)\times10^{-34}$ J·s and $\phi = 1.37 \pm 0.03$ eV. The accepted $h = 6.626\times10^{-34}$ J·s is about $5.6\%$ higher and sits outside that range, so some systematic error was left over. Our suspects were stray light reaching the detector and lines sitting slightly off-centre on the slit. Notice the slope really is $h/e$ ($3.9\times10^{-15}$ V·s), not $h$.

> [!tip] The intercept is a longer reach than the slope. Every data point sits at $f > 5\times10^{14}$ Hz, and $-\phi/e$ is where the line hits $f = 0$. A small slope error moves that intercept a lot, so trust $h$ more than $\phi$.

**3. The threshold was extrapolated, not observed.** With $\phi = 1.37$ eV and our fitted $h$, Eq. (2.5) gives $f_0 = \phi/h = 3.51\times10^{14}$ Hz and $\lambda_0 = 854$ nm, which is infrared. Every mercury line we used is above that frequency, so we never saw the "nothing comes out" case. We only know where it would be from where the fitted line crosses zero.

> [!warning] The $1240/\lambda$ shortcut uses the **accepted** $h$, but the lab number above used our **fitted** $h$. Using the shortcut on the same $\phi$ gives $1240/1.37 = 905$ nm instead of $854$ nm. That $6\%$ gap is just the $5.6\%$ error in $h$ showing up a second time. In a lab report, stay with one value of $h$ all the way through.

### Technology connection: EUV lithography

The same relation decides how small a chip feature can be. Advanced chips are printed with extreme-ultraviolet light at $\lambda = 13.5$ nm, so each photon carries

$$
E = \frac{1240}{13.5} \approx 92\ \text{eV}
$$

Visible photons only carry 2–3 eV. The photon's energy comes from its wavelength, not the brightness of the lamp.

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
f_0 = \frac{\phi}{h}, \qquad \lambda_0 = \frac{hc}{\phi} = \frac{1240\ \text{eV}\cdot\text{nm}}{\phi} \tag{2.5}
$$

- Emission only occurs for $f \ge f_0$ ($\lambda \le \lambda_0$)

**Photon rate from power**

$$
\frac{N}{t} = \frac{P}{hf} = \frac{P}{E_{\text{photon}}} \tag{2.6}
$$

- $N/t$: number of photons per second; $P$: the beam's power (W = J/s); $E_{\text{photon}} = hf$: energy of one photon, in joules here (power is in J/s, so convert from eV)

## Examples

### Example 1: Cutoff and stopping potential

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
h = \frac{\Delta K}{\Delta f} = \frac{(2.03 - 1.00)(1.602\times10^{-19})}{(1.000 - 0.750)\times10^{15}} = 6.6\times10^{-34}\ \text{J}\cdot\text{s}
$$

### Example 4: Quick concept checks

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
- Expecting a plot of $|V_s|$ against $f$ to have slope $h$. The slope is $h/e$ (Lab 1: $3.9\times10^{-15}$ V·s, and multiplying by $e$ gives $h$)
- Mixing a fitted $h$ with the $1240/\lambda$ shortcut. The shortcut has the accepted $h$ built in, so the two answers differ by the error in your $h$
