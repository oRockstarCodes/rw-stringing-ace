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
    <section id="services" className="py-20 bg-gradient-to-b from-zinc-900 via-zinc-850 to-zinc-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_70%)]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
              Our Services
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            What We Offer
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Professional stringing services tailored to enhance your game and extend your equipment's life
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-500 ${
                service.comingSoon 
                  ? 'bg-zinc-800/70 border-2 border-dashed border-zinc-700 opacity-85 hover:opacity-100 hover:border-yellow-400/40' 
                  : 'bg-gradient-to-br from-black to-zinc-700 border-2 border-zinc-700 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-400/15 hover:scale-105'
              }`}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <div className={`mb-4 inline-flex p-4 rounded-xl transition-all duration-300 ${
                  service.comingSoon 
                    ? 'bg-zinc-750/50 group-hover:bg-zinc-700' 
                    : 'bg-gradient-to-br from-yellow-400/15 to-yellow-500/10 border border-yellow-400/30 shadow-lg shadow-yellow-400/10'
                }`}>
                  <service.icon className={`w-8 h-8 transition-all duration-300 ${
                    service.comingSoon 
                      ? 'text-zinc-500' 
                      : 'text-yellow-400'
                  }`} />
                </div>
                <CardTitle className="text-xl flex items-center gap-2 mb-2">
                  <span className={service.comingSoon ? 'text-zinc-300' : 'text-zinc-50'}>
                    {service.title}
                  </span>
                  {service.comingSoon && (
                    <span className="text-xs font-normal text-yellow-400 bg-yellow-400/15 px-3 py-1 rounded-full border border-yellow-400/40">
                      Coming Soon
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className={`text-sm leading-relaxed ${
                  service.comingSoon ? 'text-zinc-400' : 'text-zinc-300'
                }`}>
                  {service.description}
                </CardDescription>
              </CardContent>

              {/* Bottom accent line */}
              {!service.comingSoon && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Additional info section */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-zinc-800 via-zinc-750 to-zinc-800 border-2 border-zinc-700 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent to-yellow-400"></div>
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <div className="w-12 h-1 bg-gradient-to-l from-transparent to-yellow-400"></div>
            </div>
            <p className="text-zinc-200 text-lg">
              All services performed by certified technicians using professional equipment
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Services marked as <span className="text-yellow-400 font-semibold">"Coming Soon"</span> will be available in the near future
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;