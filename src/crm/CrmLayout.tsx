import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Inbox,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/crm/AuthProvider";
import { ROLE_LABELS } from "@/crm/utils";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/crm", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/crm/customers", label: "Customers", icon: Users },
  { to: "/crm/orders", label: "Orders", icon: ClipboardList },
  { to: "/crm/inventory", label: "Inventory", icon: Package },
  { to: "/crm/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/crm/staff", label: "Staff", icon: UserCog, adminOnly: true },
];

export default function CrmLayout() {
  const { profile, role, signOut, isAdminUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/crm/login");
  };

  const links = navItems.filter((item) => !item.adminOnly || isAdminUser);

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-card/40">
        <div className="p-5 border-b border-border">
          <Link to="/crm" className="font-display text-lg font-bold text-gradient-gold">
            RW CRM
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Stringing operations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Nav />
        </div>
        <div className="p-4 border-t border-border space-y-3">
          <div>
            <p className="text-sm font-medium truncate">{profile?.full_name || "Staff"}</p>
            <p className="text-xs text-muted-foreground">{role ? ROLE_LABELS[role] : ""}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
          <Link to="/stringing" className="block text-xs text-muted-foreground hover:text-accent">
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-border px-4 py-3 bg-card/40">
          <Link to="/crm" className="font-display font-bold text-gradient-gold">
            RW CRM
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {open && (
          <div className="lg:hidden border-b border-border bg-card/80">
            <Nav onNavigate={() => setOpen(false)} />
            <div className="px-4 pb-4 space-y-2">
              <p className="text-sm">{profile?.full_name}</p>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
