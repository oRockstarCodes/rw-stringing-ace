import { useEffect, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { siteConfig } from "@/data/site";

interface LayoutProps {
  /** The page's name, shown in the browser tab before the business name. */
  title: string;
  children: ReactNode;
}

// Layout for the RW Stringing section (/stringing/*).
const Layout = ({ title, children }: LayoutProps) => {
  useEffect(() => {
    document.title = `${title} · ${siteConfig.name}`;
  }, [title]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      {siteConfig.breakNotice && (
        <p
          role="status"
          className="sticky bottom-0 z-40 border-t border-accent/30 bg-background/95 px-4 py-2.5 text-center text-sm text-foreground/90"
        >
          {siteConfig.breakNotice}
        </p>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
