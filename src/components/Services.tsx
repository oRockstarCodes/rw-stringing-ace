import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Award, Wrench, Grip, Palette, Settings, Sparkles } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Expert Stringing",
    description: "Professional stringing service with precision tension control for optimal performance.",
    comingSoon: false,
  },
  {
    icon: Award,
    title: "Quality Strings",
    description: "Wide selection of premium strings from leading brands for every player level.",
    comingSoon: false,
  },
  {
    icon: Wrench,
    title: "Grommet Replacement",
    description: "Expert grommet replacement to protect your frame and extend racket life.",
    comingSoon: false,
  },
  {
    icon: Sparkles,
    title: "Custom Hybrid Stringing",
    description: "Personalized hybrid string patterns combining different strings for mains and crosses.",
    comingSoon: false,
  },
  {
    icon: Grip,
    title: "Custom Grip Setup",
    description: "Tailored grip installations and customizations for optimal comfort and control.",
    comingSoon: false,
  },
  {
    icon: Palette,
    title: "Decals & Paint Retouch",
    description: "Restore your racket's appearance with professional cosmetic services.",
    comingSoon: true,
  },
  {
    icon: Settings,
    title: "Frame Repair",
    description: "Expert frame repair services to give your racket a second life.",
    comingSoon: true,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional stringing services tailored to enhance your game
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`border-border transition-all duration-300 ${
                service.comingSoon 
                  ? 'border-dashed opacity-75 hover:opacity-100' 
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              <CardHeader>
                <div className={`mb-4 inline-flex p-3 rounded-lg ${
                  service.comingSoon ? 'bg-muted/50' : 'bg-accent/10'
                }`}>
                  <service.icon className={`w-8 h-8 ${
                    service.comingSoon ? 'text-muted-foreground' : 'text-accent'
                  }`} />
                </div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  {service.title}
                  {service.comingSoon && (
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      Soon
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;