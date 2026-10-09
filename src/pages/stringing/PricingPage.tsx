import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stringDatabase } from "@/data/strings";
import { ArrowRight, Star, Info } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  return (
    <Layout>
      <PageHero
        badge="Pricing"
        title="Transparent Pricing"
        description="Professional stringing with competitive rates. Phoenix Badminton Academy team members receive exclusive discounts."
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="card-premium p-5 flex gap-3">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium mb-1">All prices include professional stringing labor</p>
                <p>
                  Prices shown are per racket, string included.{" "}
                  <span className="text-red-400 font-medium">Red prices</span> are exclusive to Phoenix Team members.
                  Not sure which string? Check our{" "}
                  <Link to="/stringing/strings" className="text-accent hover:underline">String Guide</Link>.
                </p>
              </div>
            </div>
          </div>

          <SectionHeading
            title="String Pricing"
            description="Premium quality strings for peak performance on court."
          />

          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-red-400 font-medium">Phoenix Team</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-foreground/60" />
              <span className="font-medium">Regular</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="card-premium overflow-hidden border-border">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <span className="w-1 h-6 bg-accent rounded-full" />
                  String Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3.5 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          String
                        </th>
                        <th className="text-right py-3.5 px-5 text-xs font-semibold uppercase tracking-wider text-red-400">
                          Phoenix
                        </th>
                        <th className="text-right py-3.5 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Regular
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stringDatabase.map((string) => (
                        <tr
                          key={`${string.brand}-${string.model}`}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                        >
                          <td className="py-3.5 px-5 font-medium group-hover:text-accent transition-colors">
                            {string.category === "own" ? (
                              <span className="text-accent">Own String (labor only)</span>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>
                                  <span className="text-muted-foreground font-normal">{string.brand}</span>{" "}
                                  {string.model}
                                </span>
                                {string.popular && (
                                  <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                    <Star className="w-3 h-3 fill-current" />
                                    Popular
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right text-red-400 font-bold">
                            {string.teamPrice}
                          </td>
                          <td className="py-3.5 px-5 text-right text-muted-foreground">
                            {string.regularPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">
              Need help choosing? We&apos;ll recommend the perfect string for your play style.
            </p>
            <Link to="/stringing/contact">
              <Button size="lg" className="btn-gold px-8 h-12">
                Book a Stringing <ArrowRight className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
