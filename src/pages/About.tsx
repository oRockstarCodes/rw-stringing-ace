import { Link } from "react-router-dom";
import PersonalLayout from "@/components/personal/PersonalLayout";
import { me } from "@/data/personal";

const About = () => (
  <PersonalLayout title="About">
    <section className="container py-16 md:py-24 max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold">About</h1>

      <div className="mt-10 space-y-5 text-lg leading-relaxed text-foreground/85">
        <p>
          I'm {me.name.split(" ")[0]}, a Computer Engineering student at Toronto Metropolitan University, based in
          Toronto.
        </p>
        <p>
          Outside class I run{" "}
          <Link to="/stringing" className="text-accent hover:underline">RW Stringing</Link>, Mist Window Cleaning,
          and Alpha Prep Tutoring, and I'm VP Finance for Engineers for a Sustainable World at TMU.
        </p>
        <p>
          I keep my course notes public in the{" "}
          <a href="/wiki/" className="text-accent hover:underline">wiki</a>. Writing things up is how I make sure I
          actually understand them.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 text-sm">
        {me.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 hover:border-accent/50 hover:text-accent transition-colors">
            {l.label}
          </a>
        ))}
      </div>
    </section>
  </PersonalLayout>
);

export default About;
