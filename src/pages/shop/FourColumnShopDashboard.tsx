import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Plus, Clock, CheckCircle, AlertCircle, Phone, Store, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { toast } from 'sonner';
import QRCodeModal from '@/components/shop/QRCodeModal';

// Interfaces
interface Order {
  id: string;
  order_type: 'uploaded-files' | 'walk-in';
  status: 'new' | 'confirmed' | 'started' | 'ready' | 'completed';
  description: string;
  customer_name: string;
  customer_phone: string;
  is_urgent: boolean;
  created_at: string;
  file_count?: number;
}

interface ShopData {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  offline_module_enabled: boolean;
  slug: string;
}

const statusColors = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
  started: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  ready: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-gray-50 text-gray-700 border-gray-200'
};

const FourColumnShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [shop, setShop] = useState<ShopData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiService.getShopOrders();
      console.log('📊 Shop orders response:', response);
      
      setOrders(response.orders || []);
      setShop(response.shop);
      
      console.log('🏪 Shop data:', response.shop);
      console.log('📦 Orders:', response.orders?.length || 0);
    } catch (error: any) {
      console.error('❌ Failed to load shop data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredOrders = (orderType: 'uploaded-files' | 'walk-in', statuses: string[]) => {
    return orders.filter(order => 
      order.order_type === orderType && 
      statuses.includes(order.status)
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      await loadDashboardData();
      toast.success('Order status updated');
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUrgencyToggle = async (orderId: string) => {
    try {
      await apiService.toggleOrderUrgency(orderId);
      await loadDashboardData();
      toast.success('Order urgency updated');
    } catch (error: any) {
      console.error('Failed to toggle urgency:', error);
      toast.error('Failed to update urgency');
    }
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getNextStatus = (currentStatus: string): string => {
    const statusFlow = {
      'new': 'confirmed',
      'confirmed': 'started',
      'started': 'ready',
      'ready': 'completed'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || currentStatus;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const uploadOrdersNewConfirmed = getFilteredOrders('uploaded-files', ['new', 'confirmed']);
  const uploadOrdersStartedReady = getFilteredOrders('uploaded-files', ['started', 'ready']);
  const walkInOrdersNewConfirmed = getFilteredOrders('walk-in', ['new', 'confirmed']);
  const walkInOrdersStartedReady = getFilteredOrders('walk-in', ['started', 'ready']);

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className={`mb-3 border-l-4 ${order.is_urgent ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">#{order.id}</span>
              <Badge className={`text-xs px-2 py-1 ${statusColors[order.status]}`}>
                {order.status}
              </Badge>
              {order.is_urgent && (
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Urgent
                </Badge>
              )}
            </div>
            <h4 className="font-medium text-neutral-900 mb-1">{order.customer_name}</h4>
            <p className="text-xs text-neutral-600 mb-2 line-clamp-2">{order.description}</p>
            <p className="text-xs text-neutral-500">{formatTimestamp(order.created_at)}</p>
            {order.file_count && (
              <p className="text-xs text-blue-600 mt-1">{order.file_count} files</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCallCustomer(order.customer_phone)}
            className="flex-1 text-xs h-8"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
            disabled={order.status === 'completed'}
            className="flex-1 text-xs h-8 bg-golden-500 hover:bg-golden-600"
          >
            {order.status === 'ready' ? 'Complete' : 'Next'}
          </Button>
          <Button
            size="sm"
            variant={order.is_urgent ? "destructive" : "outline"}
            onClick={() => handleUrgencyToggle(order.id)}
            className="text-xs h-8 px-2"
          >
            <AlertCircle className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{shop?.name || 'Shop Dashboard'}</h1>
              <p className="text-neutral-600">Manage your orders efficiently</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowQRModal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
              <Button className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">New Orders</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(o => o.status === 'new').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {orders.filter(o => ['confirmed', 'started'].includes(o.status)).length}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Ready</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter(o => o.status === 'ready').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Urgent</p>
                    <p className="text-2xl font-bold text-red-600">
                      {orders.filter(o => o.is_urgent).length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Four Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Column 1: Upload Orders - New & Confirmed */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Orders - New ({uploadOrdersNewConfirmed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {uploadOrdersNewConfirmed.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No new upload orders</p>
              ) : (
                uploadOrdersNewConfirmed.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Column 2: Upload Orders - Started & Ready */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Upload Orders - Progress ({uploadOrdersStartedReady.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {uploadOrdersStartedReady.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No orders in progress</p>
              ) : (
                uploadOrdersStartedReady.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Column 3: Walk-in Orders - New & Confirmed */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Walk-in Orders - New ({walkInOrdersNewConfirmed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {walkInOrdersNewConfirmed.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No new walk-in orders</p>
              ) : (
                walkInOrdersNewConfirmed.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Column 4: Walk-in Orders - Started & Ready */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Walk-in Orders - Progress ({walkInOrdersStartedReady.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {walkInOrdersStartedReady.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No orders in progress</p>
              ) : (
                walkInOrdersStartedReady.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Code Modal */}
        {showQRModal && shop && (
          <QRCodeModal
            shopSlug={shop.slug}
            shopName={shop.name}
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            offlineModuleEnabled={shop.offline_module_enabled}
          />
        )}
      </div>
    </div>
  );
};

export default FourColumnShopDashboard;
