import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/RobustDashboard";
import NewRequest from "./pages/NewRequest";
import UploadDocuments from "./pages/UploadDocuments";
import TrackRequests from "./pages/TrackRequests";
import AdminDashboard from "./pages/AdminDashboard";
import HODDashboard from "./pages/HODDashboard";
import TestOTP from "./pages/TestOTP";
import ApiTest from "./pages/ApiTest";
import NewLogin from "./pages/NewLogin";
import UploadGhanaCard from "./pages/UploadGhanaCard";
import PaymentCallback from "./pages/PaymentCallback";
import PaystackCallback from "./pages/PaystackCallback";
import EnhancedNewRequest from "./pages/EnhancedNewRequest";
import UpdatedLogin from "./pages/UpdatedLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<UpdatedLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/upload-documents" element={<UploadDocuments />} />
          <Route path="/track-requests" element={<TrackRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test-otp" element={<TestOTP />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/new-login" element={<NewLogin />} />
          <Route path="/upload-ghana-card" element={<UploadGhanaCard />} />
          <Route path="/payment/callback" element={<PaystackCallback />} />
          <Route path="/enhanced-request" element={<EnhancedNewRequest />} />
          <Route path="/updated-login" element={<UpdatedLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
