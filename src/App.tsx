
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';

// Customer Pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import NewOrder from '@/pages/customer/NewOrder';

// Shop Pages
import ShopDashboard from '@/pages/shop/Dashboard';
import ShopUploadPage from '@/pages/shop/UploadPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AddShop from '@/pages/admin/AddShop';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-neutral-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Shop Upload Pages - Public but shop-specific */}
                <Route path="/shop/:shopSlug/upload" element={<ShopUploadPage />} />
                <Route path="/shop/:shopSlug" element={<ShopUploadPage />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
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
                      <NewOrder />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shop Routes */}
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
                <Route 
                  path="/admin/add-shop" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AddShop />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
