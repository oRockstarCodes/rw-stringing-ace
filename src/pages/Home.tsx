import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Cpu, Zap } from "lucide-react";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { branches, me, ventures } from "@/data/personal";

const icons = { BookOpen, Cpu, Zap } as const;

const BranchCard = ({ branch }: { branch: (typeof branches)[number] }) => {
  const Icon = icons[branch.icon];
  const body = (
    <>
      <div className="flex items-start justify-between">
        <div className="rounded-lg border border-accent/25 bg-accent/10 p-2.5 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{branch.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{branch.description}</p>
    </>
  );
  const cls = "group card-premium block p-6";
  return "external" in branch && branch.external ? (
    <a href={branch.href} className={cls}>{body}</a>
  ) : (
    <Link to={branch.href} className={cls}>{body}</Link>
  );
};

const Home = () => (
  <PersonalLayout>
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gold opacity-60" />
      <div className="container relative pt-20 pb-16 md:pt-32 md:pb-24">
        <p className="animate-fade-up text-sm font-medium text-accent">Hi, I'm</p>
        <h1 className="animate-fade-up-delay-1 mt-2 text-5xl md:text-7xl font-bold leading-[1.05]">{me.name}</h1>
        <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg md:text-xl text-foreground/85">{me.tagline}</p>
        <p className="animate-fade-up-delay-3 mt-3 max-w-xl text-muted-foreground leading-relaxed">{me.intro}</p>
      </div>
    </section>

    <section className="container pb-20">
      <div className="grid gap-5 md:grid-cols-3">
        {branches.map((b) => (
          <BranchCard key={b.href} branch={b} />
        ))}
      </div>
    </section>

    <section className="border-t border-border bg-surface-elevated">
      <div className="container py-16 md:py-20 grid gap-10 md:grid-cols-[1fr_2fr]">
        <div>
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
            if (!v.href) return <li key={v.name}>{inner}</li>;
            return (
              <li key={v.name}>
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
  </PersonalLayout>
);

export default Home;
