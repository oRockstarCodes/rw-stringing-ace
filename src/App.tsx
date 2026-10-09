import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import StringingIndex from "./pages/stringing/Index";
import AboutUs from "./pages/stringing/AboutUs";
import PricingPage from "./pages/stringing/PricingPage";
import ContactPage from "./pages/stringing/ContactPage";
import StringDetails from "./pages/stringing/StringDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Personal site */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />

          {/* RW Stringing */}
          <Route path="/stringing" element={<StringingIndex />} />
          <Route path="/stringing/about" element={<AboutUs />} />
          <Route path="/stringing/pricing" element={<PricingPage />} />
          <Route path="/stringing/contact" element={<ContactPage />} />
          <Route path="/stringing/strings" element={<StringDetails />} />

          {/* /wiki/* is a separate static build (Quartz) served directly by Cloudflare Pages */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
