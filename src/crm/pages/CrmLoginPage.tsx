import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/crm/AuthProvider";
import { toast } from "sonner";

export default function CrmLoginPage() {
  const { signIn, user, loading, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/crm";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      toast.error("Sign in failed", { description: error });
      return;
    }
    toast.success("Welcome back");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gold opacity-40" aria-hidden />
      <Card className="w-full max-w-md relative z-10 border-border bg-card/90 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-2xl text-gradient-gold">RW CRM</CardTitle>
          <CardDescription>Sign in to manage orders, customers, and inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          {!configured && (
            <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              Supabase is not configured. Copy <code className="text-xs">.env.example</code> to{" "}
              <code className="text-xs">.env</code> and add your project URL and anon key.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!configured || submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!configured || submitting}
              />
            </div>
            <Button type="submit" className="w-full btn-gold" disabled={!configured || submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent">
              ← Back to website
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
