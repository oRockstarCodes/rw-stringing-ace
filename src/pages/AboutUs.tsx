import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Award, Target, Users, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "We use only premium strings and maintain our equipment to the highest standards, ensuring consistent, professional results.",
  },
  {
    icon: Target,
    title: "Precision",
    description:
      "Every racket is strung with calibrated tension meters and careful attention to detail, guaranteeing accuracy within ±0.5 lbs.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Your satisfaction is our priority. We take time to understand your preferences and provide personalized recommendations.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "We stay current with the latest stringing techniques and string technologies to offer you the best possible service.",
  },
];

const AboutUs = () => {
  return (
    <Layout>
      <PageHero
        badge="About Us"
        title="Built by Players, for Players"
        description="RW Stringing Service was founded on a simple belief: every player deserves tournament-quality stringing, whether you're competing or playing for fun."
      />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2">
                <div className="aspect-square max-w-xs mx-auto rounded-2xl bg-gradient-to-br from-card to-background border border-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-mesh-gold opacity-50" />
                  <div className="relative w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                    <span className="font-display text-4xl font-bold text-gradient-gold">RW</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <h2 className="text-3xl font-bold text-gradient-gold mb-1">Rocky Wang</h2>
                <p className="text-accent font-medium mb-6">Head Stringer & Founder</p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  With over 10 years of experience, Rocky has strung thousands of rackets and specializes
                  in precision tension control and hybrid string setups. As a former competitive badminton
                  player, he understands how string choice and tension directly impact your game.
                </p>
                <ul className="space-y-3">
                  {[
                    "Certified professional stringer with 10+ years of experience",
                    "Specialized in precision tension control and hybrid configurations",
                    "Former competitive player with deep understanding of game mechanics",
                    "Passionate about helping players of all levels perform their best",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-surface-elevated border-y border-border">
        <div className="container">
          <SectionHeading
            badge="Our Values"
            title="What We Stand For"
            description="The principles that guide every racket we string."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="card-premium p-6">
                <div className="mb-4 inline-flex p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Let us help you take your game to the next level with professional stringing you can trust.
          </p>
          <Link to="/contact">
            <Button size="lg" className="btn-gold px-8 h-12">
              Book Your Stringing Service <ArrowRight className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUs;
