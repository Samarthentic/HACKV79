
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Only show toast once when authentication fails
  useEffect(() => {
    if (!loading && !user) {
      // Don't show toast during initial loading or if we're already on auth pages
      if (location.pathname !== '/signin' && location.pathname !== '/signup') {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
      }
    }
  }, [loading, user, location.pathname, toast]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-talentsleuth"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    // Use state to remember where the user was trying to go
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
