import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import StringDetails from "./pages/StringDetails";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/strings" element={<StringDetails />} />

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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
