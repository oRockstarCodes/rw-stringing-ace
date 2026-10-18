import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// One place that registers GSAP's plugins, so pages import { gsap, ScrollTrigger } from here.
gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger };
