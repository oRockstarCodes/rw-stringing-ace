import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/crm/AuthProvider";

export function RequireAuth() {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return <Navigate to="/crm/login" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/crm/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
