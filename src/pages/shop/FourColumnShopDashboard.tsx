
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import UniversalHeader from '@/components/layout/UniversalHeader';
import QRCodeModal from '@/components/shop/QRCodeModal';
import apiService from '@/services/api';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  FileText,
  QrCode,
  Search,
  Filter
} from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  description: string;
  order_type: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
  files?: Array<{ id: number; original_name: string; file_size: number }>;
}

const FourColumnShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopSlug, setShopSlug] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log('📋 Fetching shop orders...');
      const response = await apiService.getShopOrders();
      setOrders(response.orders || []);
      
      // Get shop information for QR code
      if (response.shop) {
        setShopName(response.shop.name);
        setShopSlug(response.shop.slug);
      }
      
      console.log('✅ Orders loaded:', response.orders?.length || 0);
    } catch (error: any) {
      console.error('❌ Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating order ${orderId} status to ${newStatus}`);
      await apiService.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any }
            : order
        )
      );
      
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch (error: any) {
      console.error('❌ Failed to update status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUrgencyToggle = async (orderId: string) => {
    try {
      console.log(`⚡ Toggling urgency for order ${orderId}`);
      await apiService.toggleOrderUrgency(orderId);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, is_urgent: !order.is_urgent }
            : order
        )
      );
      
      toast.success('Order urgency updated');
    } catch (error: any) {
      console.error('❌ Failed to toggle urgency:', error);
      toast.error('Failed to update urgency');
    }
  };

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`tel:+91${cleanPhone}`, '_self');
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Categorize orders for columns
  const uploadNewOrders = filteredOrders.filter(
    order => order.order_type === 'uploaded-files' && ['received', 'started'].includes(order.status)
  );
  
  const uploadProgressOrders = filteredOrders.filter(
    order => order.order_type === 'uploaded-files' && order.status === 'completed'
  );
  
  const walkinNewOrders = filteredOrders.filter(
    order => order.order_type === 'walk-in' && ['received', 'started'].includes(order.status)
  );
  
  const walkinProgressOrders = filteredOrders.filter(
    order => order.order_type === 'walk-in' && order.status === 'completed'
  );

  const OrderCard = ({ order }: { order: Order }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'received': return 'bg-blue-100 text-blue-800';
        case 'started': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'received': return <Package className="w-4 h-4" />;
        case 'started': return <Clock className="w-4 h-4" />;
        case 'completed': return <CheckCircle className="w-4 h-4" />;
        default: return <Package className="w-4 h-4" />;
      }
    };

    return (
      <Card className={`mb-3 ${order.is_urgent ? 'border-red-500 border-2' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-sm">{order.customer_name}</h4>
            {order.is_urgent && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-gray-600 mb-2">#{order.id}</p>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {order.description}
          </p>
          
          {order.files && order.files.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Files: {order.files.length}</p>
              <div className="text-xs text-gray-600">
                {order.files.slice(0, 2).map(file => (
                  <div key={file.id} className="truncate">📄 {file.original_name}</div>
                ))}
                {order.files.length > 2 && (
                  <div className="text-gray-500">+{order.files.length - 2} more...</div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleCall(order.customer_phone)}
              className="flex-1 text-xs"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
            
            {order.status !== 'completed' && (
              <Button
                size="sm"
                onClick={() => {
                  const nextStatus = order.status === 'received' ? 'started' : 'completed';
                  handleStatusUpdate(order.id, nextStatus);
                }}
                className="flex-1 text-xs"
              >
                {order.status === 'received' ? 'Start' : 'Complete'}
              </Button>
            )}
            
            <Button
              size="sm"
              variant={order.is_urgent ? 'destructive' : 'outline'}
              onClick={() => handleUrgencyToggle(order.id)}
              className="text-xs"
            >
              <AlertTriangle className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div>
        <UniversalHeader 
          title="Shop Dashboard" 
          subtitle="Loading your orders..." 
        />
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UniversalHeader 
        title="Shop Dashboard" 
        subtitle={`Welcome back, ${user?.name || 'Shop Owner'}`}
        onRefresh={fetchOrders}
      />
      
      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders, customers, or order IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="started">Started</option>
              <option value="completed">Completed</option>
            </select>
            
            <Button
              onClick={() => setShowQRModal(true)}
              className="bg-golden-500 hover:bg-golden-600"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Four Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Upload Orders - New & Confirmed */}
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Upload Orders - Active ({uploadNewOrders.length})
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {uploadNewOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {uploadNewOrders.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No active upload orders</p>
              )}
            </div>
          </div>

          {/* Upload Orders - Started & Ready */}
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Upload Orders - Completed ({uploadProgressOrders.length})
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {uploadProgressOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {uploadProgressOrders.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No completed upload orders</p>
              )}
            </div>
          </div>

          {/* Walk-in Orders - New & Confirmed */}
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Walk-in Orders - Active ({walkinNewOrders.length})
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {walkinNewOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {walkinNewOrders.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No active walk-in orders</p>
              )}
            </div>
          </div>

          {/* Walk-in Orders - Started & Ready */}
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Walk-in Orders - Completed ({walkinProgressOrders.length})
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {walkinProgressOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {walkinProgressOrders.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No completed walk-in orders</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        shopName={shopName}
        shopSlug={shopSlug}
      />
    </div>
  );
};

export default FourColumnShopDashboard;
