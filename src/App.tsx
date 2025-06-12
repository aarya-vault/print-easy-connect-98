
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Auth Pages
import Login from '@/pages/auth/Login';

// Customer Pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import NewOrder from '@/pages/customer/NewOrder';
import UploadOrder from '@/pages/customer/UploadOrder';
import WalkinOrder from '@/pages/customer/WalkinOrder';
import CustomerOrders from '@/pages/customer/Orders';
import CustomerShops from '@/pages/customer/Shops';
import CustomerOrderByShop from '@/pages/customer/OrderByShop';

// Shop Owner Pages
import ShopDashboard from '@/pages/shop/Dashboard';
import ShopSettings from '@/pages/shop/Settings';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AddShop from '@/pages/admin/AddShop';

// Shared Pages
import Profile from '@/pages/Profile';

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
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/customer/order/:shopSlug" element={<CustomerOrderByShop />} />
              
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
                path="/customer/new-order" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <NewOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/upload" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <UploadOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/walkin" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <WalkinOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/orders" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customer/shops" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerShops />
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
              <Route 
                path="/shop/settings" 
                element={
                  <ProtectedRoute allowedRoles={['shop_owner']}>
                    <ShopSettings />
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

              {/* Shared Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['customer', 'shop_owner', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
