import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-badminton.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-800/90 to-zinc-900/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_70%)]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <div className="inline-block mb-6">
            <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase border border-yellow-400/40 px-4 py-2 rounded-full bg-yellow-400/10">
              Professional Service
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Professional Badminton Stringing Service
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-zinc-300">
            Expert stringing with precision and care. Get your racket restrung by professionals who understand the game.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact">
              <Button 
                size="lg"
                className="text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-400/30"
              >
                Book Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-yellow-400/50"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Our Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;