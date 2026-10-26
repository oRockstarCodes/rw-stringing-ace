import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Cpu, Zap } from "lucide-react";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { branches, me, ventures } from "@/data/personal";
import { canHover, gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

const icons = { BookOpen, Cpu, Zap } as const;

// The name is split into characters so each one can rise out of a mask. The real text is
// kept on the heading as an aria-label for screen readers.
const SplitName = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i, words) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
        {[...word].map((ch, j) => (
          <span key={j} data-hero="char" className="inline-block">{ch}</span>
        ))}
        {i < words.length - 1 ? " " : ""}
      </span>
    ))}
  </>
);

// Hero entrance: eyebrow, then the name rising character by character, then the text,
// with the gold glow drifting slowly behind it.
const useHeroMotion = (scope: React.RefObject<HTMLElement>) =>
  useLayoutEffect(() => {
    if (reducedMotion() || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero=char]", { yPercent: 115, duration: 0.85, stagger: 0.04 })
        .from("[data-hero=line]", { y: 18, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.45");
      gsap.to("[data-hero=glow]", {
        scale: 1.12,
        x: 24,
        y: -12,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, scope);
    return () => ctx.revert();
  }, [scope]);

// Cards lean toward the pointer, a gold spotlight follows it, and the icon pops.
const useCardHover = (ref: React.RefObject<HTMLElement>) =>
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !canHover()) return;
    const icon = el.querySelector("[data-card-icon]");
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 8);
      rx((0.5 - py) * 8);
      el.style.setProperty("--mx", px * 100 + "%");
      el.style.setProperty("--my", py * 100 + "%");
    };
    const enter = () => icon && gsap.to(icon, { scale: 1.1, rotate: -6, duration: 0.35, ease: "back.out(2)" });
    const leave = () => {
      rx(0);
      ry(0);
      if (icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.35, ease: "power2.out" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf([el, icon]);
    };
  }, [ref]);

// Anything marked data-reveal fades up as it scrolls into view, in small staggered batches.
// data-reveal-delay holds a reveal back, e.g. so the cards wait for the hero.
const useScrollReveal = (scope: React.RefObject<HTMLElement>) =>
  useLayoutEffect(() => {
    if (reducedMotion() || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-reveal]", { opacity: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            delay: parseFloat((els[0] as HTMLElement).dataset.revealDelay ?? "0"),
            clearProps: "opacity,transform",
          }),
      });
    }, scope);
    return () => ctx.revert();
  }, [scope]);

const BranchCard = ({ branch }: { branch: (typeof branches)[number] }) => {
  const Icon = icons[branch.icon];
  const ref = useRef<HTMLAnchorElement>(null);
  useCardHover(ref);
  const body = (
    <>
      <div className="flex items-start justify-between">
        <div data-card-icon className="rounded-lg border border-accent/25 bg-accent/10 p-2.5 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{branch.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{branch.description}</p>
    </>
  );
  const cls = "group card-premium card-tilt block p-6";
  return "external" in branch && branch.external ? (
    <a ref={ref} href={branch.href} data-reveal data-reveal-delay="0.5" className={cls}>{body}</a>
  ) : (
    <Link ref={ref} to={branch.href} data-reveal data-reveal-delay="0.5" className={cls}>{body}</Link>
  );
};

// three.js is a large chunk, so it loads after the page paints; the headline is readable meanwhile.
const HeroHead = lazy(() => import("@/components/personal/HeroHead"));

const firstName = me.name.split(" ")[0];

const Home = () => {
  const page = useRef<HTMLDivElement>(null);
  const prefersReduced = reducedMotion();
  useHeroMotion(page);
  useScrollReveal(page);
  return (
    <PersonalLayout>
      <div ref={page}>
        {/* The headline sits behind a 3D head that overlaps it, like a poster. */}
        <section className="relative overflow-hidden min-h-[calc(100svh-4rem)] flex flex-col">
          {/* Its own layer, so the endless drift is moved by the compositor instead of repainted. */}
          <div data-hero="glow" className="absolute inset-0 bg-mesh-gold opacity-60 will-change-transform" />
          <div className="container relative pt-8 md:pt-10">
            <h1
              aria-label={`Hi, I'm ${firstName}`}
              className="font-display font-extrabold uppercase leading-[0.9] tracking-tight text-center text-[21vw] sm:text-[clamp(3rem,12.4vw,12.5rem)] text-[#c9d0d7]"
            >
              <SplitName text={`Hi, I'm ${firstName}`} />
            </h1>
          </div>
          <Suspense fallback={null}>
            <HeroHead animate={!prefersReduced} />
          </Suspense>
          <div className="container relative z-20 mt-auto pb-8 md:pb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div data-hero="line" className="max-w-xs">
              <p className="text-xs md:text-sm font-medium uppercase tracking-[0.08em] text-foreground">{me.tagline}</p>
              <p className="mt-3 hidden md:block text-sm text-muted-foreground leading-relaxed">{me.intro}</p>
            </div>
            <a data-hero="line" href="/melon-files/" className="btn-gold self-start sm:self-auto px-7 py-3 text-sm uppercase tracking-wide">
              Open Melon Files
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="container pb-20">
          <div className="grid gap-5 md:grid-cols-2">
            {branches.map((b) => (
              <BranchCard key={b.href} branch={b} />
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface-elevated">
          <div className="container py-16 md:py-20 grid gap-10 md:grid-cols-[1fr_2fr]">
            <div data-reveal>
              <h2 className="text-2xl font-bold">Also running</h2>
              <p className="mt-2 text-sm text-muted-foreground">Small businesses I operate alongside school.</p>
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {ventures.map((v) => {
                const inner = (
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                    {v.href && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />}
                  </div>
                );
                if (!v.href) return <li key={v.name} data-reveal>{inner}</li>;
                return (
                  <li key={v.name} data-reveal>
                    {v.href.startsWith("/") ? (
                      <Link to={v.href} className="group block hover:text-accent transition-colors">{inner}</Link>
                    ) : (
                      <a href={v.href} target="_blank" rel="noreferrer" className="group block hover:text-accent transition-colors">{inner}</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </PersonalLayout>
  );
};

export default Home;
