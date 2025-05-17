
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LlmProvider } from "@/contexts/LlmContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import UploadResume from "./pages/UploadResume";
import ProcessingResume from "./pages/ProcessingResume";
import ResumeSummary from "./pages/ResumeSummary";
import JobFitment from "./pages/JobFitment";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Import CSS
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LlmProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                {/* Resume-related routes are now accessible without authentication */}
                <Route path="/upload" element={<UploadResume />} />
                <Route path="/processing" element={<ProcessingResume />} />
                <Route path="/resume-summary" element={<ResumeSummary />} />
                <Route path="/job-fitment" element={<JobFitment />} />
                {/* Dashboard still requires authentication */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </LlmProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
