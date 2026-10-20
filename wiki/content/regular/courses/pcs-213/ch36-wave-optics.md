---
title: "Ch 36: Wave Optics"
tags:
  - pcs213
---
## Overview

Light as a wave: Young's double-slit experiment, where the bright and dark fringes land, the intensity pattern, Lloyd's mirror and the 180° phase flip on reflection, and interference in thin films.

## Notes

### Young's double-slit experiment

In the **double-slit experiment**, a wave front hits two slits and diffracts. Each slit becomes a source of spherical waves, and the two sets of waves interfere, making a pattern of bright bands (constructive interference) and dark bands (destructive interference).

To see the interference, the two sources must keep a constant phase relative to each other and emit the same wavelength.

**Constructive interference** happens at observation angles $\theta$ where the following holds, with $d$ the distance between the slits, $m$ an integer (positive or negative) giving the order of the maximum, and $\lambda$ the wavelength:

$$
d \sin\theta = m\lambda
$$

**Destructive interference** happens where

$$
d \sin\theta = \left(m + \tfrac{1}{2}\right)\lambda
$$

### Fringe positions on the screen

The **observation angle** comes from $L$, the distance from the slits to the screen, and $y$, the distance from the central axis on the screen. Using the small-angle approximation ($\tan\theta \approx \sin\theta$), the fringe positions can be written in terms of these alone:

![[pcs-213-double-slit-geometry.png]]
*Figure 36.1: Double-slit geometry: slit spacing $d$, screen distance $L$, and a point a height $y$ up the screen at angle $\theta$.*

$$
y_{\text{bright}} = L\frac{m\lambda}{d} \qquad y_{\text{dark}} = L\frac{\left(m + \tfrac{1}{2}\right)\lambda}{d} \qquad \text{(small angles)}
$$

### Intensity

The **intensity** of light on the screen is

$$
I = I_{\max}\cos^2\!\left(\frac{\pi d \sin\theta}{\lambda}\right) \approx I_{\max}\cos^2\!\left(\frac{\pi d y}{\lambda L}\right) \quad \text{(small angles)}
$$

As the number of slits $N$ increases, the primary maxima get more intense and narrower. There are always $N - 2$ secondary maxima between two primary maxima.

![[pcs-213-multi-slit-intensity.png]]
*Figure 36.2: The intensity pattern for $N = 3$ slits: one secondary maximum between each pair of primary maxima.*

### Lloyd's mirror

The double-slit experiment can also be done with one source and a mirror, an arrangement called **Lloyd's mirror**. Light reaches the screen both directly and by reflecting off the mirror, so the reflected light acts like a second source below the mirror.

![[pcs-213-lloyds-mirror.png]]
*Figure 36.3: Lloyd's mirror: the direct ray and the reflected ray interfere at points such as $P$ and $P'$ on the screen.*

Reflection off the mirror shifts the phase by 180°. In general, **an EM wave's phase changes by 180° when it reflects off a medium with a higher index of refraction than the one it's travelling in.**

So at $P'$ there's a dark spot where Young's double-slit experiment would give a bright one.

### Interference in thin films

**Thin-film interference** gives the rainbows in soap bubbles and oil spills. Take a film of thickness $t$ and index $n$, light of free-space wavelength $\lambda$, and the wavelength inside the film $\lambda_n = \lambda / n$:

![[pcs-213-thin-film-interference.png]]
*Figure 36.4: Ray 1 reflects off the top of the film; ray 2 reflects off the bottom and travels an extra $2t$ through the film.*

Ray 1 changes phase by 180° because it reflects off a medium with a higher index ($n > 1$). Ray 2 reflects off the bottom of the film, back into a lower-index medium (air), so it doesn't change phase.

For a film with air on both sides (one phase flip), the condition for **constructive interference** is, for $m = 0, 1, 2, \dots$:

$$
2t = \left(m + \tfrac{1}{2}\right)\lambda_n \quad\Rightarrow\quad 2tn = \left(m + \tfrac{1}{2}\right)\lambda
$$

and the condition for **destructive interference** is

$$
2tn = m\lambda
$$

If both reflections flip (or neither does), the two conditions swap.

## Key formulas

$$
d \sin\theta_{\text{bright}} = m\lambda \qquad d \sin\theta_{\text{dark}} = \left(m + \tfrac{1}{2}\right)\lambda
$$

$$
y_{\text{bright}} = L\frac{m\lambda}{d} \qquad y_{\text{dark}} = L\frac{\left(m + \tfrac{1}{2}\right)\lambda}{d} \qquad I = I_{\max}\cos^2\!\left(\frac{\pi d \sin\theta}{\lambda}\right)
$$

$$
\text{thin film (one flip):}\quad 2tn = \left(m + \tfrac{1}{2}\right)\lambda \ \text{(bright)} \qquad 2tn = m\lambda \ \text{(dark)}
$$

## Practice questions

1. In a Young's double-slit experiment using light of wavelength $\lambda$, a thin piece of Plexiglas with index of refraction $n$ covers one of the slits. If the centre point on the screen is a dark spot instead of a bright spot, what is the minimum thickness of the Plexiglas?
2. Radio transmitter A, operating at 60.0 MHz, is 10.0 m from a similar transmitter B that is 180° out of phase with A. How far must an observer move from A toward B, along the line joining them, to reach the nearest point where the two beams are in phase?
