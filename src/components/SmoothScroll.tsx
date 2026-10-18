import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";
import "lenis/dist/lenis.css";

// Lenis smooth scrolling, driven by GSAP's ticker so scroll-based GSAP
// animations stay in sync. Disabled for reduced-motion users and the CRM.
const SmoothScroll = () => {
  const { pathname } = useLocation();
  const enabled =
    !pathname.startsWith("/crm") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);

  return null;
};

export default SmoothScroll;
