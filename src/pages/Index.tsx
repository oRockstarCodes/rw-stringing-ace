import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import ServiceIcon from "@/components/ServiceIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, processSteps, services, siteConfig, testimonials } from "@/data/site";
import { ArrowRight, CheckCircle2, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-badminton.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Badminton player on court"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
          <div className="absolute inset-0 bg-mesh-gold opacity-40" />
          <div className="absolute inset-0 court-pattern opacity-20" />
        </div>

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block mb-5 animate-fade-up text-accent text-xs font-semibold tracking-[0.2em] uppercase border border-accent/30 px-4 py-1.5 rounded-full bg-accent/10">
              {siteConfig.tagline}
            </span>
            <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-gold leading-[1.1]">
              String Your Racket Like a Pro
            </h1>
            <p className="animate-fade-up-delay-2 text-lg md:text-xl mb-8 text-muted-foreground leading-relaxed">
              Calibrated tension, premium strings, and expert advice — so every shot feels exactly how you want it.
            </p>
            <div className="animate-fade-up-delay-3 flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" className="btn-gold text-base px-8 h-12">
                  Book Now <ArrowRight className="ml-1" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12 border-border bg-background/50 hover:bg-secondary hover:border-accent/40"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              >
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="container py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="stat-value">{stat.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gold opacity-30" aria-hidden />
        <div className="container relative z-10">
          <SectionHeading
            badge="Our Services"
            title="Everything Your Racket Needs"
            description="From precision stringing to frame care — professional service tailored to your game."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.title}
                className={`card-premium group h-full ${
                  service.comingSoon ? "opacity-80 border-dashed" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div
                    className={`mb-3 inline-flex p-3 rounded-xl ${
                      service.comingSoon
                        ? "bg-muted"
                        : "bg-accent/10 border border-accent/20"
                    }`}
                  >
                    <ServiceIcon
                      name={service.icon}
                      className={`w-7 h-7 ${service.comingSoon ? "text-muted-foreground" : "text-accent"}`}
                    />
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                    {service.title}
                    {service.comingSoon && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/30">
                        Soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing" className="text-accent hover:text-yellow-300 font-medium inline-flex items-center gap-1 transition-colors">
              View full pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 bg-surface-elevated border-y border-border">
        <div className="container">
          <SectionHeading
            badge="How It Works"
            title="Simple, Professional, Reliable"
            description="Four easy steps from drop-off to court-ready."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" aria-hidden />
                )}
                <div className="card-premium p-6 h-full">
                  <span className="text-4xl font-display font-bold text-accent/30">{step.step}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Local Players"
            description="See why players keep coming back for consistent, quality stringing."
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.author} className="card-premium p-6">
                <Quote className="w-8 h-8 text-accent/40 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-surface-elevated border-y border-border">
        <div className="container max-w-3xl">
          <SectionHeading
            badge="FAQ"
            title="Common Questions"
            description="Everything you need to know before your next restring."
          />

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="card-premium px-5 border-none"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-accent py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gold" aria-hidden />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center card-premium p-10 md:p-14 border-accent/20">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              Ready to Restring?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Drop off your racket or send us a message — we&apos;ll have you court-ready in no time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="btn-gold px-8 h-12">
                  Get in Touch <ArrowRight className="ml-1" />
                </Button>
              </Link>
              <Link to="/strings">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 border-border hover:border-accent/40"
                >
                  Browse String Guide
                </Button>
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Free tension consultation", "Phoenix team discounts", "24hr turnaround"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
