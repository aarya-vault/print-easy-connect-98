import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Store, 
  Package, 
  Clock, 
  CheckCircle, 
  Phone, 
  MessageCircle, 
  AlertTriangle,
  Settings,
  QrCode,
  Download,
  Eye,
  User,
  LogOut
} from 'lucide-react';

import UniversalHeader from '@/components/layout/UniversalHeader';
import OrderSection from '@/components/shop/OrderSection';
import OrderDetailsModal from '@/components/shop/OrderDetailsModal';
import OrderChatModal from '@/components/shop/OrderChatModal';
import QRCodeModal from '@/components/shop/QRCodeModal';
import OrderFilters from '@/components/shop/OrderFilters';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Order, Shop } from '@/types/api';

interface OrderCounts {
  total: number;
  pending: number;
  in_progress: number;
  ready: number;
  completed: number;
  urgent: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showOrderChat, setShowOrderChat] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    orderType: 'all',
    urgent: false
  });

  // Fetch shop data
  const { data: shopData, isLoading: shopLoading, error: shopError } = useQuery({
    queryKey: ['my-shop'],
    queryFn: () => apiService.getMyShop(),
    retry: 1
  });

  const shop = shopData?.shop;

  // Fetch orders with filters
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['shop-orders', activeFilters],
    queryFn: () => apiService.getShopOrders(),
    enabled: !!shop
  });

  const orders: Order[] = ordersData?.orders || [];

  // Calculate order counts
  const orderCounts: OrderCounts = React.useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      urgent: orders.filter(o => o.is_urgent).length
    };
  }, [orders]);

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      refetchOrders();
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update order status');
    }
  };

  // Handle urgency toggle
  const handleUrgencyToggle = async (orderId: string) => {
    try {
      await apiService.toggleOrderUrgency(orderId);
      toast.success('Order urgency updated');
      refetchOrders();
    } catch (error) {
      console.error('Urgency toggle failed:', error);
      toast.error('Failed to update urgency');
    }
  };

  // Handle calling customer
  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Handle order selection
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Handle opening chat
  const handleOpenChat = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderChat(true);
  };

  // Handle file download
  const handleFileDownload = async (fileId: string, filename: string) => {
    try {
      const blob = await apiService.downloadFile(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
    }
  };

  if (shopError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100">
        <UniversalHeader title="Shop Dashboard" />
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Shop Not Found
              </h2>
              <p className="text-neutral-600 mb-6">
                No shop is associated with your account. Please contact support.
              </p>
              <Button onClick={() => navigate('/login')} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100">
        <UniversalHeader title="Shop Dashboard" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading shop dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders based on active filters
  const filteredOrders = orders.filter(order => {
    if (activeFilters.status !== 'all' && order.status !== activeFilters.status) {
      return false;
    }
    if (activeFilters.orderType !== 'all' && order.order_type !== activeFilters.orderType) {
      return false;
    }
    if (activeFilters.urgent && !order.is_urgent) {
      return false;
    }
    return true;
  });

  // Group orders by status and type
  const groupedOrders = {
    digitalNew: filteredOrders.filter(o => o.order_type === 'digital' && ['pending', 'in_progress'].includes(o.status)),
    digitalReady: filteredOrders.filter(o => o.order_type === 'digital' && ['ready', 'completed'].includes(o.status)),
    walkinNew: filteredOrders.filter(o => o.order_type === 'walkin' && ['pending', 'in_progress'].includes(o.status)),
    walkinReady: filteredOrders.filter(o => o.order_type === 'walkin' && ['ready', 'completed'].includes(o.status))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100">
      <UniversalHeader 
        title="Shop Dashboard"
        user={user}
        onLogout={logout}
        userMenuItems={[
          { 
            label: 'Profile', 
            icon: User, 
            onClick: () => navigate('/profile') 
          },
          { 
            label: 'Settings', 
            icon: Settings, 
            onClick: () => navigate('/shop/settings') 
          }
        ]}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Shop Header */}
        <div className="mb-8">
          <Card className="shadow-lg border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Store className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-2xl font-bold">{shop?.name}</CardTitle>
                    <p className="text-blue-100">{shop?.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowQRCode(true)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{orderCounts.total}</div>
                  <div className="text-sm text-neutral-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{orderCounts.pending}</div>
                  <div className="text-sm text-neutral-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{orderCounts.in_progress}</div>
                  <div className="text-sm text-neutral-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{orderCounts.ready}</div>
                  <div className="text-sm text-neutral-600">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{orderCounts.urgent}</div>
                  <div className="text-sm text-neutral-600">Urgent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <OrderFilters
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            orderCounts={orderCounts}
          />
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <OrderSection
            title="Digital - New & Confirmed"
            orders={groupedOrders.digitalNew}
            onOrderSelect={handleOrderSelect}
            onStatusUpdate={handleStatusUpdate}
            onUrgencyToggle={handleUrgencyToggle}
            onCallCustomer={handleCallCustomer}
            onOpenChat={handleOpenChat}
            isLoading={ordersLoading}
          />

          <OrderSection
            title="Digital - Started & Ready"
            orders={groupedOrders.digitalReady}
            onOrderSelect={handleOrderSelect}
            onStatusUpdate={handleStatusUpdate}
            onUrgencyToggle={handleUrgencyToggle}
            onCallCustomer={handleCallCustomer}
            onOpenChat={handleOpenChat}
            isLoading={ordersLoading}
          />

          <OrderSection
            title="Walk-in - New & Confirmed"
            orders={groupedOrders.walkinNew}
            onOrderSelect={handleOrderSelect}
            onStatusUpdate={handleStatusUpdate}
            onUrgencyToggle={handleUrgencyToggle}
            onCallCustomer={handleCallCustomer}
            onOpenChat={handleOpenChat}
            isLoading={ordersLoading}
          />

          <OrderSection
            title="Walk-in - Started & Ready"
            orders={groupedOrders.walkinReady}
            onOrderSelect={handleOrderSelect}
            onStatusUpdate={handleStatusUpdate}
            onUrgencyToggle={handleUrgencyToggle}
            onCallCustomer={handleCallCustomer}
            onOpenChat={handleOpenChat}
            isLoading={ordersLoading}
          />
        </div>
      </div>

      {/* Modals - Updated to use Order type consistently */}
      {selectedOrder && (
        <>
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={showOrderDetails}
            onClose={() => {
              setShowOrderDetails(false);
              setSelectedOrder(null);
            }}
            onStatusUpdate={handleStatusUpdate}
            onUrgencyToggle={handleUrgencyToggle}
            onCallCustomer={handleCallCustomer}
            onOpenChat={() => {
              setShowOrderDetails(false);
              setShowOrderChat(true);
            }}
            onFileAction={(action, fileId, filename) => {
              if (action === 'download') {
                handleFileDownload(fileId, filename || selectedOrder.files?.find(f => f.id === fileId)?.filename || 'file');
              }
            }}
          />

          <OrderChatModal
            order={selectedOrder}
            isOpen={showOrderChat}
            onClose={() => {
              setShowOrderChat(false);
              setSelectedOrder(null);
            }}
          />
        </>
      )}

      {shop && (
        <QRCodeModal
          shop={shop}
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
