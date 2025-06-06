
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderCreationFlow from "@/components/order/OrderCreationFlow";
import ShopOnboarding from "@/components/shop/ShopOnboarding";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/customer/Dashboard";
import ShopDashboard from "./pages/shop/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-golden-50 via-white to-golden-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-golden rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl font-bold text-white">PE</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-500 mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  const roleRedirects = {
    customer: '/customer/dashboard',
    shop_owner: '/shop/dashboard',
    admin: '/admin/dashboard'
  };
  
  return <Navigate to={roleRedirects[user.role]} replace />;
};

// Add global CSS custom property for font family
const App = () => {
  // Apply font family globally
  useEffect(() => {
    document.documentElement.style.setProperty('--font-sans', '"Poppins", sans-serif');
    document.body.style.fontFamily = 'Poppins, sans-serif';
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<RoleBasedRedirect />} />
              
              {/* Public Routes */}
              <Route path="/shop/apply" element={<ShopOnboarding />} />
              
              {/* Customer Routes */}
              <Route 
                path="/customer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/order/new" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <OrderCreationFlow />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shop Owner Routes */}
              <Route 
                path="/shop/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['shop_owner']}>
                    <ShopDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
