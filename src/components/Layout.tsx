import { useEffect, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { siteConfig } from "@/data/site";

interface LayoutProps {
  children: ReactNode;
}

// Layout for the RW Stringing section (/stringing/*).
const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    document.title = `${siteConfig.name} | ${siteConfig.tagline}`;
  }, []);

  return (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <ScrollToTop />
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
  );
};

export default Layout;
