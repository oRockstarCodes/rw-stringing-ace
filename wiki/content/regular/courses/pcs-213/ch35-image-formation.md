---
title: "Ch 35: Image Formation"
tags:
  - pcs213
---
## Overview

How mirrors, curved refracting surfaces and thin lenses form images, the sign conventions that go with each, lens combinations and aberrations, the eye and corrective lenses, and angular magnification.

## Notes

**Try it:** pick a mirror or a lens, then drag the object (or use the sliders) to move it and change the focal length. The three principal rays find the image, and the readout gives $q$ and $M$ and says what kind of image it is. Point at a ray's button to see what that ray does.

<div class="melon-optics">Interactive ray diagram for mirrors and lenses (open this page on the site to use it).</div>

### Real and virtual images

- **Virtual images** form where diverging reflected or refracted rays *appear* to come from: trace them back and the image sits at the point where those paths converge.
- **Real images** form where reflected or refracted rays actually converge.

### Flat mirrors

**Flat mirrors** make upright, virtual images. The image is as far behind the mirror as the object is in front of it.

![[pcs-213-flat-mirror-virtual-image.png]]
*Figure 35.1: A flat mirror: the reflected rays diverge, and traced back they meet at the virtual image $I$, a distance $q = p$ behind the mirror.*

### Spherical mirrors

**Concave mirrors** curve inward, so the radius of curvature is positive (it's measured in front of the mirror).

**Spherical aberration** is the blurred image you get when rays meet at several points along the mirror's principal axis.

![[pcs-213-concave-mirror-aberration.png]]
*Figure 35.2: Spherical aberration: rays far from the axis cross it at a different point than rays near it.*

**Convex mirrors** curve outward, so the radius of curvature is negative (it's measured behind the mirror). Convex mirrors **always** form virtual, upright, smaller images.

![[pcs-213-convex-mirror.png]]
*Figure 35.3: A convex mirror forms a virtual, upright, reduced image behind the mirror.*

**Magnification** for a reflecting surface, where $h'$ and $h$ are the image and object heights and $q$ and $p$ are the image and object distances:

$$
M = \frac{h'}{h} = -\frac{q}{p}
$$

The **mirror equation** relates the radius of curvature (or the focal length) to the image and object distances:

$$
\frac{1}{p} + \frac{1}{q} = \frac{2}{R} = \frac{1}{f}
$$

The focal point is the image point only when the object is infinitely far away. You can see why from the mirror equation: $p \to \infty$ leaves $q = f$.

For a concave mirror ($f > 0$): when the object is closer than the focal length ($p < f$) the image is virtual, and when it's farther ($p > f$) the image is real.

Signs matter! The sign of a distance, magnification or radius tells you something a question might be asking for.

**Sign conventions for mirrors**

| Quantity | Symbol | Negative | Positive |
| :---: | :---: | :---: | :---: |
| Image distance | $q$ | Virtual image (behind mirror) | Real image (in front of mirror) |
| Object distance | $p$ | Behind mirror | In front of mirror |
| Magnification | $M$ | Inverted image | Upright image |
| Image height | $h'$ | Inverted image | Upright image |
| Radius of curvature | $R$ | Convex | Concave |
| Focal length | $f$ | Convex | Concave |

### Refraction at a curved surface

Refraction at a curved surface works the same way as at a flat one, the surface is just curved. Using the small-angle approximation for the angles between each ray and the line from the point of refraction to the centre of curvature:

![[pcs-213-refraction-curved-surface.png]]
*Figure 35.4: Refraction at a spherical surface between media $n_1$ and $n_2$.*

After some geometry, we get the **refracting surface equation**:

$$
\frac{n_1}{p} + \frac{n_2}{q} = \frac{n_2 - n_1}{R}
$$

The magnification of an image formed by a refracting surface is

$$
M = -\frac{n_1 q}{n_2 p}
$$

Again, signs matter. They're almost the same as for mirrors, except that real images now form on the far side of the surface:

**Sign conventions for refracting surfaces**

| Quantity | Symbol | Negative | Positive |
| :---: | :---: | :---: | :---: |
| Image distance | $q$ | Virtual image (in front of surface) | Real image (behind surface) |
| Object distance | $p$ | Behind surface | In front of surface |
| Image height | $h'$ | Inverted image | Upright image |
| Radius of curvature | $R$ | Centre of curvature in front of surface | Centre of curvature behind surface |

The object distance where the image switches between real and virtual comes from letting $q \to \infty$:

$$
p = \frac{n_1}{n_2 - n_1} R
$$

**Flat refracting surfaces** always form a virtual image. You can see this by letting $R \to \infty$ in the refracting surface equation: $q = -\frac{n_2}{n_1}p$, which is negative.

### Thin lenses

**Thin lenses** are thin! The thin lens equation has the same form as the [[#Spherical mirrors|mirror equation]], $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$. The **lensmaker's equation** relates a thin lens's focal length to the curvature of its two sides, where $R_1$ is the first surface and $R_2$ the second:

$$
\frac{1}{f} = (n - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right)
$$

And again, signs matter:

**Sign conventions for thin lenses**

| Quantity | Symbol | Negative | Positive |
| :---: | :---: | :---: | :---: |
| Image distance | $q$ | In front of lens (virtual) | Past lens (real) |
| Object distance | $p$ | Past lens | In front of lens |
| Image height | $h'$ | Inverted image | Upright image |
| Radius of curvature | $R$ | Centre of curvature in front of lens | Centre of curvature past lens |
| Focal length | $f$ | Diverging (concave) | Converging (convex) |

### Combinations of lenses

When rays pass through several refracting or reflecting elements, the **total magnification** is the product of the individual magnifications:

$$
M = M_1 M_2
$$

For thin lenses in contact, the **total focal length** is the reciprocal of the sum of the reciprocals:

$$
\frac{1}{f} = \frac{1}{f_1} + \frac{1}{f_2}
$$

### Aberrations

Besides [[#Spherical mirrors|spherical aberration]], there's **chromatic aberration**: refracted rays split into rays of different wavelengths that come to a focus at different points (see [[ch34-nature-of-light-and-ray-optics#Dispersion|dispersion]]).

### The eye

The eye forms an image by focusing light on the **retina**, which holds light-sensitive **rods** and colour-sensitive **cones**.

- **Near point:** the closest distance the eye can focus from, 25 cm on average. An object at the near point has a positive distance in front of the eye.
- **Far point:** the farthest distance the eye can focus from, effectively infinity.

**Farsighted** eyes focus images past the retina, as if the object were closer than it is. A **converging lens** fixes this: it forms a virtual image (negative image distance) farther away, at the eye's near point, so the eye can focus it on the retina.

**Nearsighted** eyes focus images in front of the retina, as if the object were farther than it is. A **diverging lens** fixes this: it forms a virtual image (again a negative image distance) closer in, within the eye's far point.

### Angular magnification and power

**Angular magnification** is the ratio of the angle the image subtends at the eye to the angle the object subtends without the lens:

![[pcs-213-angular-magnification.png]]
*Figure 35.5: The angles $\theta_0$ (object at the near point, no lens) and $\theta$ (with the lens) used for angular magnification.*

$$
m = \frac{\theta}{\theta_0}
$$

The **optical power** of a lens is the reciprocal of its focal length. Its unit is the **diopter** (1/m):

$$
P = \frac{1}{f}
$$

## Key formulas

$$
\frac{1}{p} + \frac{1}{q} = \frac{2}{R} = \frac{1}{f} \qquad M = \frac{h'}{h} = -\frac{q}{p}
$$

$$
\frac{n_1}{p} + \frac{n_2}{q} = \frac{n_2 - n_1}{R} \qquad M = -\frac{n_1 q}{n_2 p}
$$

$$
\frac{1}{f} = (n - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right) \qquad M = M_1 M_2 \qquad \frac{1}{f} = \frac{1}{f_1} + \frac{1}{f_2} \qquad m = \frac{\theta}{\theta_0} \qquad P = \frac{1}{f}
$$

## Practice questions

1. A patient has a near point of 45.0 cm and a far point of 85.0 cm. Neglect the eye–lens distance.
   1. What lens power is needed to correct the near point?
   2. What lens power is needed to correct the far point?
2. The "wingspan" of the International Space Station (the overall width of its solar panels) is 108.6 m. With the station orbiting at an altitude of 407 km, find the width of the image formed by a telescope objective of focal length 4.00 m.
3. Two lenses made of glasses with indices of refraction $n_1$ and $n_2$ are cemented together to form an optical doublet (doublets are often used to correct chromatic aberration). The first lens has index $n_1$, one flat side, and one concave side with radius of curvature of magnitude $R$. The second lens has index $n_2$ and two convex sides, both with radius of curvature of magnitude $R$. Show that the doublet acts like a single thin lens with focal length given by
   $$
   \frac{1}{f} = \frac{2n_2 - n_1 - 1}{R}
   $$
