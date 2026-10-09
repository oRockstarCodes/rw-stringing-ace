import { ArrowUpRight } from "lucide-react";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { projects } from "@/data/personal";
import { cn } from "@/lib/utils";

const Projects = () => (
  <PersonalLayout title="Projects">
    <section className="container py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold">Projects</h1>
      <p className="mt-4 text-muted-foreground max-w-xl">
        Things I'm building or have built, at school, on teams, and on my own.
      </p>

      <div className="mt-12 space-y-5">
        {projects.map((p) => (
          <article key={p.title} className="card-premium p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium border",
                  p.status === "In progress"
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border bg-secondary text-muted-foreground",
                )}
              >
                {p.status}
              </span>
              <span className="text-muted-foreground">{p.period}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">
              {p.href ? (
                <a href={p.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
                  {p.title} <ArrowUpRight className="h-5 w-5" />
                </a>
              ) : (
                p.title
              )}
            </h2>
            {p.role && <p className="mt-1 text-sm text-foreground/70">{p.role}</p>}
            <p className="mt-4 text-muted-foreground leading-relaxed">{p.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs text-foreground/75">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  </PersonalLayout>
);

export default Projects;
