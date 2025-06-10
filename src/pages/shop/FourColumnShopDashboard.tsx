
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Phone, 
  Eye, 
  Zap, 
  CheckCircle, 
  Clock, 
  Bell, 
  Package,
  QrCode,
  Settings,
  Upload,
  UserCheck,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '@/components/shop/OrderDetailsModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ShopOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
  files?: Array<{
    id: string;
    original_name: string;
    file_size: number;
    mime_type: string;
  }>;
}

const FourColumnShopDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Fetch shop orders
  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['shop-orders'],
    queryFn: () => apiService.getShopOrders(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const orders = ordersData?.orders || [];

  // Organize orders by status and type
  const organizeOrders = () => {
    const uploadOrders = orders.filter((order: ShopOrder) => order.order_type === 'uploaded-files');
    const walkInOrders = orders.filter((order: ShopOrder) => order.order_type === 'walk-in');

    return {
      uploadNew: uploadOrders.filter((order: ShopOrder) => ['received', 'started'].includes(order.status)),
      uploadCompleted: uploadOrders.filter((order: ShopOrder) => order.status === 'completed'),
      walkInNew: walkInOrders.filter((order: ShopOrder) => ['received', 'started'].includes(order.status)),
      walkInCompleted: walkInOrders.filter((order: ShopOrder) => order.status === 'completed')
    };
  };

  const { uploadNew, uploadCompleted, walkInNew, walkInCompleted } = organizeOrders();

  const handleRefresh = () => {
    refetch();
    toast.success('Dashboard refreshed');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOrderClick = (order: ShopOrder) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleToggleUrgency = async (orderId: string) => {
    try {
      await apiService.toggleOrderUrgency(orderId);
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      toast.success('Order urgency toggled');
    } catch (error) {
      console.error('Error toggling urgency:', error);
      toast.error('Failed to toggle urgency');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'started': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Bell className="w-3 h-3" />;
      case 'started': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'received': return 'started';
      case 'started': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = (currentStatus: string) => {
    switch (currentStatus) {
      case 'received': return 'Start';
      case 'started': return 'Complete';
      default: return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const OrderCard: React.FC<{ order: ShopOrder }> = ({ order }) => {
    const nextStatus = getNextStatus(order.status);
    const statusAction = getStatusAction(order.status);

    return (
      <Card className={`border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
        order.is_urgent ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
      } mb-3`}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-sm text-gray-900 truncate">{order.customer?.name || 'Unknown'}</h3>
                {order.is_urgent && (
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="font-mono text-gray-600">{order.id}</span>
                <Badge className={`text-xs px-2 py-0.5 ${
                  order.order_type === 'uploaded-files' 
                    ? 'bg-blue-100 text-blue-700 border-blue-200' 
                    : 'bg-purple-100 text-purple-700 border-purple-200'
                }`}>
                  {order.order_type === 'uploaded-files' ? (
                    <><Upload className="w-2 h-2 mr-1" />FILES</>
                  ) : (
                    <><UserCheck className="w-2 h-2 mr-1" />WALK-IN</>
                  )}
                </Badge>
                <span className="text-gray-500">{formatTimeAgo(order.created_at)}</span>
              </div>

              <Badge className={`text-xs px-2 py-0.5 mb-2 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>

              <p className="text-xs text-gray-700 mb-2 line-clamp-2">{order.description}</p>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>{order.customer?.phone}</span>
                {order.files && <span>{order.files.length} files</span>}
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-[80px]">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOrderClick(order)}
                className="text-xs h-6 px-2"
              >
                <Eye className="w-3 h-3" />
              </Button>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${order.customer?.phone}`)}
                  className="flex-1 text-xs h-6 px-1"
                >
                  <Phone className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleUrgency(order.id)}
                  className={`flex-1 text-xs h-6 px-1 ${order.is_urgent ? 'bg-red-100 text-red-700 border-red-200' : ''}`}
                >
                  <Zap className="w-3 h-3" />
                </Button>
              </div>

              {nextStatus && statusAction && order.status !== 'completed' && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, nextStatus)}
                  className="text-xs h-6 px-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                >
                  ✓
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shop Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowQRCode(true)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/shop/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Four Column Layout */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Upload Orders - New & Processing */}
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Orders
                <Badge variant="secondary">{uploadNew.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              {uploadNew.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active upload orders</p>
                </div>
              ) : (
                uploadNew.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Upload Orders - Completed */}
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Upload Completed
                <Badge variant="secondary">{uploadCompleted.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              {uploadCompleted.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No completed upload orders</p>
                </div>
              ) : (
                uploadCompleted.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Walk-in Orders - New & Processing */}
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                Walk-in Orders
                <Badge variant="secondary">{walkInNew.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              {walkInNew.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active walk-in orders</p>
                </div>
              ) : (
                walkInNew.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Walk-in Orders - Completed */}
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                Walk-in Completed
                <Badge variant="secondary">{walkInCompleted.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto h-full">
              {walkInCompleted.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No completed walk-in orders</p>
                </div>
              ) : (
                walkInCompleted.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isOrderDetailsOpen}
          onClose={() => {
            setIsOrderDetailsOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shop QR Code</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <QrCode className="w-24 h-24 mx-auto mb-4" />
            <p className="text-gray-600">QR Code functionality will be implemented soon</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FourColumnShopDashboard;
