import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/components/SmoothScroll";
import { features } from "@/data/site";

// Routes are code-split so each page (and the whole CRM) loads on demand.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StringingIndex = lazy(() => import("./pages/stringing/Index"));
const AboutUs = lazy(() => import("./pages/stringing/AboutUs"));
const PricingPage = lazy(() => import("./pages/stringing/PricingPage"));
const ContactPage = lazy(() => import("./pages/stringing/ContactPage"));
const StringDetails = lazy(() => import("./pages/stringing/StringDetails"));
const AuthProvider = lazy(() =>
  import("@/crm/AuthProvider").then((m) => ({ default: m.AuthProvider })),
);
const RequireAuth = lazy(() =>
  import("@/crm/RequireAuth").then((m) => ({ default: m.RequireAuth })),
);
const CrmLayout = lazy(() => import("@/crm/CrmLayout"));
const CrmLoginPage = lazy(() => import("@/crm/pages/CrmLoginPage"));
const CrmDashboardPage = lazy(() => import("@/crm/pages/CrmDashboardPage"));
const CrmCustomersPage = lazy(() => import("@/crm/pages/CrmCustomersPage"));
const CrmCustomerDetailPage = lazy(() => import("@/crm/pages/CrmCustomerDetailPage"));
const CrmOrdersPage = lazy(() => import("@/crm/pages/CrmOrdersPage"));
const CrmInventoryPage = lazy(() => import("@/crm/pages/CrmInventoryPage"));
const CrmInquiriesPage = lazy(() => import("@/crm/pages/CrmInquiriesPage"));
const CrmStaffPage = lazy(() => import("@/crm/pages/CrmStaffPage"));

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
        <SmoothScroll />
        <Suspense fallback={null}>
        <MaybeAuth>
          <Routes>
            {/* Personal site */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
