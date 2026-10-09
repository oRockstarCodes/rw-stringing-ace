import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { navLinks, siteConfig } from "@/data/site";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    siteConfig.social.instagram
      ? { href: siteConfig.social.instagram, label: "Instagram", icon: Instagram }
      : null,
    siteConfig.social.facebook
      ? { href: siteConfig.social.facebook, label: "Facebook", icon: Facebook }
      : null,
  ].filter(Boolean) as { href: string; label: string; icon: typeof Instagram }[];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="font-display text-xl font-bold text-gradient-gold">
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <a
                    href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                    className="hover:text-accent transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>
                  {siteConfig.location.line1}
                  <br />
                  {siteConfig.location.line2}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Hours</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <p>{siteConfig.hours}</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex mt-6 text-sm font-semibold text-accent hover:text-yellow-300 transition-colors"
            >
              Book a stringing appointment →
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="hidden sm:block">Precision stringing for players who care about every detail.</p>
            <Link
              to="/crm/login"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
