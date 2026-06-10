import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

const PageHero = ({ badge, title, description, className, children }: PageHeroProps) => (
  <section
    className={cn(
      "relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-surface-elevated",
      className,
    )}
  >
    <div className="absolute inset-0 bg-mesh-gold opacity-60" aria-hidden />
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" aria-hidden />
    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" aria-hidden />

    <div className="container relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {badge && (
          <span className="inline-block mb-5 text-accent text-xs font-semibold tracking-[0.2em] uppercase border border-accent/30 px-4 py-1.5 rounded-full bg-accent/10">
            {badge}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-gradient-gold leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  </section>
);

export default PageHero;
