---
title: "Ch 37: Diffraction Patterns & Polarization"
tags:
  - pcs213
---
## Overview

What a diffraction pattern looks like, the bright spot in a circular shadow, and single-slit (Fraunhofer) diffraction: where the dark fringes are and how the intensity falls off.

## Notes

### Diffraction patterns

A **diffraction pattern** has an intense band in the middle, the **central maximum**, with narrower, dimmer bands on either side, the **secondary maxima** (or side maxima). The dark bands between them are the **minima**.

With a circular object between a point light source and a screen, there's a bright spot in the middle of the object's shadow, made by light diffracting around the edge and interfering constructively at the centre.

![[pcs-213-poisson-spot.png]]
*Figure 37.1: Light diffracts around the edge of a circular object and interferes at the centre of its shadow, making a bright spot (Poisson's bright spot).*

### Single-slit diffraction

Diffraction from a single narrow slit forms a **Fraunhofer diffraction pattern**. In this model the slit is made of many sources whose waves are in phase as they leave it.

For a slit of width $a$, observation angle $\theta$, and a nonzero integer $m$, the condition for **destructive interference** (dark fringes) is

$$
\sin\theta_{\text{dark}} = m\frac{\lambda}{a} \qquad m = \pm 1, \pm 2, \pm 3, \dots
$$

The **intensity of a single-slit diffraction pattern** is given below. The derivation is long and isn't needed: it's on the formula sheet <3

$$
I = I_{\max}\left[\frac{\sin(\pi a \sin\theta / \lambda)}{\pi a \sin\theta / \lambda}\right]^2
$$

## Key formulas

$$
\sin\theta_{\text{dark}} = m\frac{\lambda}{a} \qquad I = I_{\max}\left[\frac{\sin(\pi a \sin\theta / \lambda)}{\pi a \sin\theta / \lambda}\right]^2
$$

## Practice questions

1. In a single-slit diffraction pattern, assume each side maximum is halfway between the adjacent minima. Find the ratio of the intensity of
   1. the first-order side maximum to the intensity of the central maximum.
   2. the second-order side maximum to the intensity of the central maximum.
