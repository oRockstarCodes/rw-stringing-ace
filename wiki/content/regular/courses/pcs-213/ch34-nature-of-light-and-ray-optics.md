---
title: "Ch 34: The Nature of Light & Ray Optics"
tags:
  - pcs213
---
## Overview

Light as rays: reflection, refraction and Snell's law, Huygens' principle, dispersion, and total internal reflection.

## Notes

### Light and rays

The **speed of light** is $2.99792458 \times 10^{8}$ m/s, or $3 \times 10^{8}$ m/s for calculations.

**Ray optics** assumes light travels in straight lines, changing direction only at the boundary between two media, or where the optical properties aren't uniform in space or time.

**Diffraction** happens when rays reach an opening whose size is on the order of the wavelength (see [[ch37-diffraction-and-polarization|Ch 37]]).

### Reflection

- **Specular reflection:** reflection of light from a smooth surface.
- **Diffuse reflection:** reflection of light from a rough surface.

The **law of reflection** says the angle of reflection equals the angle of incidence:

$$
\theta_{\text{reflection}} = \theta_{\text{incidence}} \quad\Rightarrow\quad \theta_1' = \theta_1
$$

### Refraction

**Refraction** happens when light travels into a new medium. The angle and speed of the refracted ray depend on the properties of the two media and the incident angle:

$$
\frac{\sin\theta_2}{\sin\theta_1} = \frac{v_2}{v_1}
$$

The **index of refraction** $n$ is the ratio

$$
n = \frac{c}{v}
$$

The frequency of light doesn't change between media; the wavelength does (energy is conserved). From that and $v = f\lambda$ we get **Snell's law of refraction**:

$$
n_1 \sin\theta_1 = n_2 \sin\theta_2
$$

For a ray travelling through a prism, $\phi$ is the apex angle between the two prism faces and $\delta$ is the angle of deviation between the incident path and the final refracted path.

![[pcs-213-prism-deviation.png]]
*Figure 34.1: A ray through a prism: apex angle $\phi$ and angle of deviation $\delta$.*

### Huygens' principle

**Huygens' principle** treats every point on a wave front as a point source of spherical secondary waves (wavelets). Since $d = vt$, the distance between the old and new wave fronts in air is

$$
d = c\,\Delta t
$$

![[pcs-213-huygens-wavefront.png]]
*Figure 34.2: Each point on a wave front sends out a wavelet; the new wave front is the surface touching them all.*

Huygens' principle can be used to derive the law of reflection.

### Dispersion

**Dispersion** is the way the index of refraction varies with wavelength. Because of it, light can split into several rays when it refracts. That's how we get rainbows!

When white light enters a prism, some wavelengths see an index $n_A$ and refract at angle $\theta_A$, while others see $n_B$ and refract at $\theta_B$.

### Total internal reflection

**Total internal reflection (TIR)** happens when the second material has a lower index of refraction than the first and the ray is reflected back inside. The **critical angle** $\theta_c$ is the angle of incidence for which the angle of refraction is 90°; any larger angle gives TIR:

$$
n_1 \sin\theta_c = n_2 \sin 90° = n_2 \quad\Rightarrow\quad \sin\theta_c = \frac{n_2}{n_1} \qquad (n_1 > n_2)
$$

**Optical fibres** work by TIR, bouncing a ray along inside the fibre. They're used to carry information.

## Key formulas

$$
\theta_1' = \theta_1 \qquad n = \frac{c}{v} \qquad n_1 \sin\theta_1 = n_2 \sin\theta_2 \qquad \sin\theta_c = \frac{n_2}{n_1}
$$

## Practice questions

1. Yusuf Taki installs a 10 m tall flag pole 4 m from the south edge of an outdoor pool. The pool is 3 m deep.
   1. How far along the bottom of the pool is the shadow of the tip of the flag pole when the sun is 65° above the horizon, to the south?
   2. Is there a time of year when there's no shadow on the bottom of the pool? The highest the sun reaches in the south is 68.5°.
2. A beam of light reflects and refracts at the boundary between air and glass. If the index of refraction of the glass is $n_g$, what angle of incidence $\theta_1$ makes the reflected and refracted rays perpendicular to each other?
3. In an optics lab, two identical lasers and two identical photodetectors are used. Each detector is the same fixed distance from its laser. Light from the first laser travels only through air before reaching its detector. Light from the second laser first travels through a 6.27 m long column of diamond ($n = 2.419$), then through air to its detector. The lasers each emit a pulse at the same time. What is the difference in the arrival times of the two pulses (in ns)?
4. A glass optical fibre ($n = 1.520$) carries a light ray a long distance. The fibre is submerged in ethyl alcohol ($n = 1.361$). What is the critical angle (in degrees) for the ray to stay inside the fibre?
