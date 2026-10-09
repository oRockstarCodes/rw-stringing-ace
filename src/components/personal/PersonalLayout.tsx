import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";
import { me, personalNav, type NavItem } from "@/data/personal";
import { cn } from "@/lib/utils";

interface PersonalLayoutProps {
  title?: string;
  children: ReactNode;
}

const NavLink = ({ item, active, className }: { item: NavItem; active: boolean; className?: string }) => {
  const cls = cn(
    "text-sm font-medium transition-colors",
    active ? "text-accent" : "text-foreground/75 hover:text-accent",
    className,
  );
  return item.external ? (
    <a href={item.href} className={cls}>
      {item.label}
    </a>
  ) : (
    <Link to={item.href} className={cls}>
      {item.label}
    </Link>
  );
};

const PersonalLayout = ({ title, children }: PersonalLayoutProps) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = title ? `${title} · ${me.name}` : me.name;
  }, [title]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold tracking-tight hover:text-accent transition-colors">
            {me.handle}
            <span className="text-accent">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {personalNav.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 hover:text-accent transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden container pb-4 flex flex-col" aria-label="Mobile navigation">
            {personalNav.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} className="py-3 text-base" />
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {me.name} · {me.location}
          </p>
          <div className="flex gap-5">
            {me.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PersonalLayout;
