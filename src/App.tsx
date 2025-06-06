
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';

// Customer pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import NewOrderFlow from '@/pages/customer/NewOrderFlow';
import SimplifiedUpload from '@/pages/customer/SimplifiedUpload';

// Shop pages
import ShopDashboard from '@/pages/shop/Dashboard';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Customer routes */}
            <Route path="/customer/dashboard" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/order/new" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <NewOrderFlow />
              </ProtectedRoute>
            } />
            <Route path="/customer/shop/:shopSlug/upload" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <SimplifiedUpload />
              </ProtectedRoute>
            } />

            {/* Shop routes */}
            <Route path="/shop/dashboard" element={
              <ProtectedRoute allowedRoles={['shop_owner']}>
                <ShopDashboard />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
