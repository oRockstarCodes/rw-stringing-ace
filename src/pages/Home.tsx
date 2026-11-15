import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Github, Instagram, Linkedin, Youtube } from "lucide-react";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { courses, me, ventures } from "@/data/personal";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

// The name is split into characters so each one can rise out of a mask. The real text is
// kept on the heading as an aria-label for screen readers.
const SplitName = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i, words) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] lg:block">
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

// three.js is a large chunk, so it loads after the page paints; the headline is readable meanwhile.
const HeroHead = lazy(() => import("@/components/personal/HeroHead"));

// Icons for the hero's social column, keyed by the labels in me.links.
const linkIcons = { GitHub: Github, LinkedIn: Linkedin, YouTube: Youtube, Instagram } as const;

// The bust's canvas and its halo share this box: the lower part of the hero on narrow screens,
// the whole hero from lg up.
const bustBox = "absolute inset-x-0 bottom-0 h-[60%] lg:h-full";

const Home = () => {
  const page = useRef<HTMLDivElement>(null);
  const prefersReduced = reducedMotion();
  useHeroMotion(page);
  useScrollReveal(page);
  return (
    <PersonalLayout>
      <div ref={page}>
        {/* A 3D bust stands in the middle with a halo behind it; the name sits to its left and
            the role to its right. On narrow screens the text stacks above the bust. */}
        <section className="relative overflow-hidden min-h-[calc(100svh-4rem)]">
          {/* Its own layer, so the endless drift is moved by the compositor instead of repainted. */}
          <div data-hero="glow" className="absolute inset-0 bg-mesh-gold opacity-60 will-change-transform" />
          <div
            aria-hidden="true"
            className={`${bustBox} bg-[radial-gradient(circle_at_50%_38%,hsl(var(--accent)/0.24),transparent_50%)] lg:bg-[radial-gradient(circle_at_50%_46%,hsl(var(--accent)/0.24),transparent_44%)]`}
          />
          <Suspense fallback={null}>
            <HeroHead animate={!prefersReduced} className={bustBox} />
          </Suspense>
          <div className="container relative z-20 flex flex-col items-center pt-8 text-center lg:absolute lg:inset-0 lg:grid lg:grid-cols-[1fr_minmax(0,22rem)_1fr] lg:content-center lg:items-start lg:gap-y-8 lg:pt-0 lg:text-left">
            <div className="lg:col-start-1 lg:row-start-1">
              <p data-hero="line" className="font-display text-lg font-medium text-foreground/90 lg:text-2xl">
                Hello! I'm
              </p>
              <h1
                aria-label={me.name}
                className="mt-1 font-display font-extrabold uppercase leading-[0.92] tracking-tight text-[#c9d0d7] text-[13vw] sm:text-7xl lg:text-[clamp(3.25rem,5.6vw,5.75rem)]"
              >
                <SplitName text={me.name} />
              </h1>
            </div>
            <div data-hero="line" className="mt-4 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center lg:pl-6">
              <p className="text-sm text-foreground/90 sm:text-base lg:text-lg">{me.role.lead}</p>
              <p className="mt-1 font-display font-extrabold uppercase leading-none tracking-tight text-2xl sm:text-3xl lg:text-[clamp(1.6rem,2.9vw,3rem)]">
                <span className="lg:block">{me.role.title[0]}</span>{" "}
                <span className="text-accent lg:block">{me.role.title[1]}</span>
              </p>
              <p className="mt-4 hidden max-w-xs text-sm leading-relaxed text-muted-foreground lg:block">{me.intro}</p>
            </div>
            <a
              data-hero="line"
              href="/melon-files/"
              className="btn-gold mt-6 px-7 py-3 text-sm uppercase tracking-wide lg:col-start-1 lg:row-start-2 lg:mt-0 lg:justify-self-start"
            >
              Open Melon Files
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="container pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden lg:block">
            <ul data-hero="line" className="pointer-events-auto flex w-fit flex-col gap-4">
              {me.links.map((l) => {
                const Icon = linkIcons[l.label as keyof typeof linkIcons] ?? ArrowUpRight;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={l.label}
                      className="block text-foreground/70 transition-colors hover:text-accent"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* The wiki is the main thing here, so its courses are listed right under the hero. */}
        <section className="container pb-20">
          <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-muted-foreground lg:hidden">
            {me.intro}
          </p>
          <div data-reveal data-reveal-delay="0.5" className="card-premium p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg border border-accent/25 bg-accent/10 p-2.5 text-accent">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Melon Files</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    My course wiki: linked notes from every course I take, with concepts, formulas, worked
                    examples and interactive diagrams.
                  </p>
                </div>
              </div>
              <a
                href="/melon-files/"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                All notes <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    className="group flex h-full items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-4 py-3 transition-colors hover:border-accent/50"
                  >
                    <span>
                      <span className="block text-xs font-semibold tracking-wide text-accent">{c.code}</span>
                      <span className="block text-sm font-medium">{c.name}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
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
