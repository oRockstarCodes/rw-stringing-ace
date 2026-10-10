import type { ReactNode } from "react";
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
import { AuthProvider } from "@/crm/AuthProvider";
import { RequireAuth } from "@/crm/RequireAuth";
import CrmLayout from "@/crm/CrmLayout";
import CrmLoginPage from "@/crm/pages/CrmLoginPage";
import CrmDashboardPage from "@/crm/pages/CrmDashboardPage";
import CrmCustomersPage from "@/crm/pages/CrmCustomersPage";
import CrmCustomerDetailPage from "@/crm/pages/CrmCustomerDetailPage";
import CrmOrdersPage from "@/crm/pages/CrmOrdersPage";
import CrmInventoryPage from "@/crm/pages/CrmInventoryPage";
import CrmInquiriesPage from "@/crm/pages/CrmInquiriesPage";
import CrmStaffPage from "@/crm/pages/CrmStaffPage";
import { features } from "@/data/site";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// Only load the CRM's Supabase auth when the CRM is on.
const MaybeAuth = ({ children }: { children: ReactNode }) =>
  features.crm ? <AuthProvider>{children}</AuthProvider> : <>{children}</>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MaybeAuth>
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

            {/* /melon-files/* (Melon Files wiki) is a separate static build (Quartz) served directly by Cloudflare Pages */}

            {/* RW Stringing staff CRM (off unless features.crm is true) */}
            {features.crm && (
              <>
                <Route path="/crm/login" element={<CrmLoginPage />} />
                <Route path="/crm" element={<RequireAuth />}>
                  <Route element={<CrmLayout />}>
                    <Route index element={<CrmDashboardPage />} />
                    <Route path="customers" element={<CrmCustomersPage />} />
                    <Route path="customers/:id" element={<CrmCustomerDetailPage />} />
                    <Route path="orders" element={<CrmOrdersPage />} />
                    <Route path="inventory" element={<CrmInventoryPage />} />
                    <Route path="inquiries" element={<CrmInquiriesPage />} />
                    <Route path="staff" element={<CrmStaffPage />} />
                  </Route>
                </Route>
              </>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </MaybeAuth>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
