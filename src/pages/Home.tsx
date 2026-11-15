import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { courses, me, ventures } from "@/data/personal";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion";

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
        .from("[data-hero=eyebrow]", { y: 14, opacity: 0, duration: 0.5 })
        .from("[data-hero=char]", { yPercent: 115, duration: 0.85, stagger: 0.03 }, "-=0.25")
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

const Home = () => {
  const page = useRef<HTMLDivElement>(null);
  useHeroMotion(page);
  useScrollReveal(page);
  return (
    <PersonalLayout>
      <div ref={page}>
        <section className="relative overflow-hidden">
          {/* Its own layer, so the endless drift is moved by the compositor instead of repainted. */}
          <div data-hero="glow" className="absolute inset-0 bg-mesh-gold opacity-60 will-change-transform" />
          <div className="container relative pt-20 pb-16 md:pt-32 md:pb-24">
            <p data-hero="eyebrow" className="text-sm font-medium text-accent">Hi, I'm</p>
            <h1 aria-label={me.name} className="mt-2 text-5xl md:text-7xl font-bold leading-[1.05]">
              <SplitName text={me.name} />
            </h1>
            <p data-hero="line" className="mt-6 max-w-xl text-lg md:text-xl text-foreground/85">{me.tagline}</p>
            <p data-hero="line" className="mt-3 max-w-xl text-muted-foreground leading-relaxed">{me.intro}</p>
          </div>
        </section>

        {/* The wiki is the main thing here, so its courses are listed right under the hero. */}
        <section className="container pb-20">
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
