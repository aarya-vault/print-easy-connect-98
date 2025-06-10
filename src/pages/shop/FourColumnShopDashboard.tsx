
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Phone, 
  AlertTriangle,
  Search,
  Filter,
  QrCode,
  Settings,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import apiService from '@/services/api';
import UniversalHeader from '@/components/layout/UniversalHeader';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
  customer?: any;
  files?: any[];
}

const OrderCard: React.FC<{ order: Order; onStatusUpdate: (orderId: string, status: string) => void; onToggleUrgency: (orderId: string) => void }> = ({ 
  order, 
  onStatusUpdate, 
  onToggleUrgency 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const callCustomer = () => {
    window.open(`tel:${order.customer_phone}`);
  };

  return (
    <Card className={`h-fit ${order.is_urgent ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">#{order.id}</p>
                {order.is_urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {order.order_type.replace('-', ' ')}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleUrgency(order.id)}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {order.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={callCustomer}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Customer Info */}
          <div>
            <p className="font-medium text-sm">{order.customer_name}</p>
            <p className="text-xs text-neutral-600">{order.customer_phone}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-700 line-clamp-2">
            {order.description}
          </p>

          {/* Files Count */}
          {order.files && order.files.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {order.files.length} file{order.files.length > 1 ? 's' : ''}
            </Badge>
          )}

          {/* Time */}
          <p className="text-xs text-neutral-500">
            {formatDate(order.created_at)}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            {order.status === 'received' && (
              <Button 
                size="sm" 
                className="w-full text-xs" 
                onClick={() => onStatusUpdate(order.id, 'started')}
              >
                Start Order
              </Button>
            )}
            {order.status === 'started' && (
              <Button 
                size="sm" 
                className="w-full text-xs bg-green-600 hover:bg-green-700" 
                onClick={() => onStatusUpdate(order.id, 'completed')}
              >
                Mark Complete
              </Button>
            )}
            {order.status === 'completed' && (
              <Badge className="w-full justify-center bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FourColumnShopDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getShopOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
      toast.success(`Order ${newStatus} successfully`);
      
      if (newStatus === 'completed') {
        // Move completed orders out of active columns after a short delay
        setTimeout(() => {
          fetchOrders();
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleToggleUrgency = async (orderId: string) => {
    try {
      await apiService.toggleOrderUrgency(orderId);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, is_urgent: !order.is_urgent } : order
      ));
      toast.success('Order urgency updated');
    } catch (error) {
      toast.error('Failed to update urgency');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders by type and status for columns
  const uploadedNew = filteredOrders.filter(o => o.order_type === 'uploaded-files' && ['received'].includes(o.status));
  const uploadedInProgress = filteredOrders.filter(o => o.order_type === 'uploaded-files' && ['started'].includes(o.status));
  const walkinNew = filteredOrders.filter(o => o.order_type === 'walk-in' && ['received'].includes(o.status));
  const walkinInProgress = filteredOrders.filter(o => o.order_type === 'walk-in' && ['started'].includes(o.status));

  const handleRefresh = () => {
    fetchOrders();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <UniversalHeader 
          title="Shop Dashboard" 
          subtitle="Manage your print orders efficiently"
          onRefresh={handleRefresh}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <UniversalHeader 
        title="Shop Dashboard" 
        subtitle="Manage your print orders efficiently"
        onRefresh={handleRefresh}
      />
      
      <div className="p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowQRModal(true)}>
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Column 1: Upload Orders - New */}
          <div>
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Upload Orders - New
                  <Badge variant="secondary">{uploadedNew.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              {uploadedNew.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onToggleUrgency={handleToggleUrgency}
                />
              ))}
              {uploadedNew.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new upload orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Upload Orders - In Progress */}
          <div>
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Upload Orders - In Progress
                  <Badge variant="secondary">{uploadedInProgress.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              {uploadedInProgress.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onToggleUrgency={handleToggleUrgency}
                />
              ))}
              {uploadedInProgress.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No orders in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Walk-in Orders - New */}
          <div>
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-green-600" />
                  Walk-in Orders - New
                  <Badge variant="secondary">{walkinNew.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              {walkinNew.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onToggleUrgency={handleToggleUrgency}
                />
              ))}
              {walkinNew.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new walk-in orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Walk-in Orders - In Progress */}
          <div>
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Walk-in Orders - In Progress
                  <Badge variant="secondary">{walkinInProgress.length}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              {walkinInProgress.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  onToggleUrgency={handleToggleUrgency}
                />
              ))}
              {walkinInProgress.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No orders in progress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourColumnShopDashboard;
