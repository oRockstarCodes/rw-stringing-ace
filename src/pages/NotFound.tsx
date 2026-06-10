import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex items-center justify-center min-h-[70vh] py-20">
        <div className="container max-w-lg text-center">
          <p className="text-8xl font-display font-bold text-accent/20 mb-4">404</p>
          <h1 className="text-3xl font-bold text-gradient-gold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page <code className="text-accent/80 bg-muted px-1.5 py-0.5 rounded text-sm">{location.pathname}</code> doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="btn-gold">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="border-border">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
