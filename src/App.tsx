
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NameCollectionPopup from '@/components/auth/NameCollectionPopup';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import BusinessLogin from '@/pages/BusinessLogin';
import AdminLogin from '@/pages/AdminLogin';

// Customer pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import NewOrderFlow from '@/pages/customer/NewOrderFlow';
import EnhancedOrderFlow from '@/pages/customer/EnhancedOrderFlow';
import SimplifiedUpload from '@/pages/customer/SimplifiedUpload';
import WalkInOrder from '@/pages/customer/WalkInOrder';
import OrderSuccess from '@/pages/customer/OrderSuccess';

// Shop pages
import ShopDashboard from '@/pages/shop/Dashboard';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showNamePopup, setShowNamePopup] = React.useState(false);

  React.useEffect(() => {
    if (user && user.needsNameUpdate) {
      setShowNamePopup(true);
    } else {
      setShowNamePopup(false);
    }
  }, [user]);

  return (
    <>
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business-login" element={<BusinessLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Customer routes */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/order/new" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <EnhancedOrderFlow />
            </ProtectedRoute>
          } />
          <Route path="/customer/order/enhanced" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <EnhancedOrderFlow />
            </ProtectedRoute>
          } />
          <Route path="/customer/shop/:shopSlug/order" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <EnhancedOrderFlow />
            </ProtectedRoute>
          } />
          <Route path="/customer/shop/:shopSlug/upload" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <SimplifiedUpload />
            </ProtectedRoute>
          } />
          <Route path="/customer/shop/:shopId/walkin" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <WalkInOrder />
            </ProtectedRoute>
          } />
          <Route path="/customer/order/success/:orderId" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderSuccess />
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
        
        {/* Bottom Navigation for Mobile */}
        <BottomNavigation />
        
        <Toaster position="top-right" richColors />
      </div>

      {/* Name Collection Popup */}
      <NameCollectionPopup
        isOpen={showNamePopup}
        onClose={() => setShowNamePopup(false)}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
