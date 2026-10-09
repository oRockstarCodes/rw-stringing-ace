import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stringDatabase, type StringProduct } from "@/data/strings";
import { Target, Zap, Shield, Activity, Star, Search, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CharacteristicBar = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-accent" />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-medium text-sm">{value > 0 ? `${value}%` : "N/A"}</span>
    </div>
    {value > 0 && (
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    )}
  </div>
);

const StringCard = ({ string }: { string: StringProduct }) => {
  const label =
    string.category === "own" ? "Own String (labor only)" : `${string.brand} ${string.model}`;
  const bookHref = `/contact?string=${encodeURIComponent(label)}`;

  return (
    <Card className="card-premium relative h-full flex flex-col">
      {string.popular && (
        <div className="absolute -top-2.5 right-4 z-10">
          <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </span>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl mb-1">
              {string.category === "own" ? (
                <span className="text-accent">Own String</span>
              ) : (
                <>
                  <span className="text-muted-foreground font-normal text-base">{string.brand}</span>
                  <br />
                  {string.model}
                </>
              )}
            </CardTitle>
            {string.category !== "own" && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{string.gauge}</Badge>
                <Badge variant="secondary" className="text-xs">{string.type}</Badge>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Member</div>
            <div className="text-lg font-bold text-red-400">{string.teamPrice}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Regular</div>
            <div className="font-semibold">{string.regularPrice}</div>
          </div>
        </div>
        <CardDescription className="text-sm leading-relaxed mt-2">
          {string.description}
        </CardDescription>
      </CardHeader>
      {string.category !== "own" && (
        <CardContent className="space-y-5 pt-0 flex-1 flex flex-col">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-accent uppercase tracking-wider">Performance</h4>
            <CharacteristicBar label="Durability" value={string.characteristics.durability} icon={Shield} color="bg-blue-500" />
            <CharacteristicBar label="Repulsion" value={string.characteristics.repulsion} icon={Zap} color="bg-accent" />
            <CharacteristicBar label="Control" value={string.characteristics.control} icon={Target} color="bg-green-500" />
            <CharacteristicBar label="Sound & Feel" value={string.characteristics.sound} icon={Activity} color="bg-purple-500" />
          </div>

          <div>
            <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Best For</h4>
            <div className="flex flex-wrap gap-1.5">
              {string.bestFor.map((audience) => (
                <Badge key={audience} variant="outline" className="text-xs border-accent/30 text-accent/90">
                  {audience}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Play Style</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{string.playStyle}</p>
          </div>

          <div className="mt-auto pt-4">
            <Button asChild className="btn-gold w-full">
              <Link to={bookHref}>
                Book with this string <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      )}
      {string.category === "own" && (
        <CardContent className="pt-0 mt-auto">
          <Button asChild className="btn-gold w-full">
            <Link to={bookHref}>
              Book labor-only stringing <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default function StringDetails() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredStrings = useMemo(() => {
    let results = activeTab === "all" ? stringDatabase : stringDatabase.filter((s) => s.category === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (s) =>
          s.brand.toLowerCase().includes(q) ||
          s.model.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q),
      );
    }
    return results;
  }, [activeTab, search]);

  return (
    <Layout>
      <PageHero
        badge="String Guide"
        title="Find Your Perfect String"
        description="Detailed specs and performance characteristics for every string we carry."
      />

      <section className="pb-20 md:pb-28">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card border border-border">
                {[
                  { value: "all", label: "All" },
                  { value: "yonex", label: "Yonex" },
                  { value: "gxs", label: "GXS" },
                  { value: "own", label: "Own String" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search strings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <Tabs value={activeTab}>
            <TabsContent value={activeTab} className="mt-0">
              {filteredStrings.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No strings match your search. Try a different term.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto">
                  {filteredStrings.map((string) => (
                    <StringCard key={`${string.brand}-${string.model}`} string={string} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
