
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Redirect from root to login page */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    
    {/* Protected Routes */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/marks" element={<Marks />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/students" element={<EmptyStudentsPage />} />
    </Route>
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// Placeholder for Students page - to be implemented
const EmptyStudentsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">Students</h2>
      <p className="text-muted-foreground">
        Manage your students and their information
      </p>
    </div>

    <div className="flex h-[50vh] items-center justify-center rounded-md border border-dashed">
      <div className="text-center">
        <h3 className="text-lg font-medium">Students Management</h3>
        <p className="text-sm text-muted-foreground">
          This feature is coming soon.
        </p>
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
