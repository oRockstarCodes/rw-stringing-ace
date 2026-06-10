import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  const handleNavClick = (href: string, isHash?: boolean) => {
    setIsMenuOpen(false);
    if (isHash && location.pathname === "/") {
      const id = href.split("#")[1];
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItemClass = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors relative py-1",
      active ? "text-accent" : "text-foreground/80 hover:text-accent",
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent",
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="font-display text-xl md:text-2xl font-bold text-gradient-gold hover:opacity-90 transition-opacity"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.isHash ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href, true)}
                  className={navItemClass(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(navItemClass(isActive(link.href)), "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:transition-all", isActive(link.href) ? "after:w-full" : "after:w-0 hover:after:w-full")}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link to="/contact">
              <Button className="btn-gold rounded-full px-6 h-10 text-sm">Book Now</Button>
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-accent transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            className="lg:hidden py-4 border-t border-border animate-fade-up"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href, link.isHash)}
                  className={cn(
                    "py-3 px-3 rounded-lg transition-colors",
                    isActive(link.href) ? "text-accent bg-accent/10" : "text-foreground/80 hover:text-accent hover:bg-accent/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" className="mt-2">
                <Button className="btn-gold w-full rounded-full">Book Now</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
