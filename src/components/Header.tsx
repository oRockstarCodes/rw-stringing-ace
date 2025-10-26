import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToServices = () => {
    if (!isHomePage) {
      window.location.href = '/#services';
      return;
    }
    const element = document.getElementById('services');
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-yellow-400/20 shadow-lg shadow-yellow-400/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-400 transition-all duration-300"
            >
              RW Stringing
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <button
                onClick={scrollToServices}
                className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                Services
              </button>
            ) : (
              <Link
                to="/#services"
                className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
              >
                Services
              </Link>
            )}
            <Link
              to="/pricing"
              className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
            <Link to="/contact">
              <Button
                variant="hero"
                size="default"
                className="rounded-full px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-400/30"
              >
                Book Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-100 hover:text-yellow-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-yellow-400/20 bg-zinc-900/50 backdrop-blur-sm rounded-b-lg">
            <div className="flex flex-col gap-4">
              {isHomePage ? (
                <button
                  onClick={scrollToServices}
                  className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium text-left py-2 px-2 hover:bg-yellow-400/10 rounded-md"
                >
                  Services
                </button>
              ) : (
                <Link
                  to="/#services"
                  className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium text-left py-2 px-2 hover:bg-yellow-400/10 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              )}
              <Link
                to="/pricing"
                className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium text-left py-2 px-2 hover:bg-yellow-400/10 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium text-left py-2 px-2 hover:bg-yellow-400/10 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-zinc-100 hover:text-yellow-400 transition-colors font-medium text-left py-2 px-2 hover:bg-yellow-400/10 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link to="/contact" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="hero"
                  className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-400/30"
                >
                  Book Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;