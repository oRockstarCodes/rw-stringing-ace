import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Clock, Award } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Expert Stringing",
    description: "Professional stringing service with precision tension control for optimal performance.",
  },
  {
    icon: Target,
    title: "Custom Tension",
    description: "Tailored tension settings based on your playing style and preferences.",
  },
  {
    icon: Clock,
    title: "Quick Turnaround",
    description: "Fast and reliable service to get you back on the court as soon as possible.",
  },
  {
    icon: Award,
    title: "Quality Strings",
    description: "Wide selection of premium strings from leading brands for every player level.",
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
              className="border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-card-foreground">{service.title}</CardTitle>
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
