import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            >
              RW Stringing
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('services')}
              className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium"
            >
              Contact
            </button>
            <Button
              variant="hero"
              size="default"
              className="rounded-full px-6"
              onClick={() => scrollToSection('contact')}
            >
              Book Now
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('services')}
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium text-left py-2"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium text-left py-2"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium text-left py-2"
              >
                Contact
              </button>
              <Button
                variant="hero"
                className="w-full rounded-full"
                onClick={() => scrollToSection('contact')}
              >
                Book Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;