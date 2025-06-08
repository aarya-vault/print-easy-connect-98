
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UniversalHeader from '@/components/layout/UniversalHeader';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import CustomerDashboard from '@/pages/customer/Dashboard';
import ShopDashboard from '@/pages/shop/Dashboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import NotFound from '@/pages/NotFound';

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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Customer Routes */}
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <div>
                        <UniversalHeader title="Customer Dashboard" subtitle="Manage your orders" />
                        <main className="pt-16">
                          <CustomerDashboard />
                        </main>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shop Routes */}
                <Route 
                  path="/shop/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['shop_owner']}>
                      <div>
                        <UniversalHeader title="Shop Dashboard" subtitle="Manage your print orders" />
                        <main className="pt-16">
                          <ShopDashboard />
                        </main>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <div>
                        <UniversalHeader title="Admin Dashboard" subtitle="Platform management" />
                        <main className="pt-16">
                          <AdminDashboard />
                        </main>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
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
