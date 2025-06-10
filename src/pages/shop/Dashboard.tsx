
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  MoreVertical,
  Eye,
  History,
  RefreshCw
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
import QRCodeModal from '@/components/qr/QRCodeModal';

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

const OrderCard: React.FC<{ 
  order: Order; 
  onStatusUpdate: (orderId: string, status: string) => void; 
  onToggleUrgency: (orderId: string) => void;
  onViewDetails: (order: Order) => void;
}> = ({ order, onStatusUpdate, onToggleUrgency, onViewDetails }) => {
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
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => onToggleUrgency(order.id)}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {order.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={callCustomer}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails(order)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
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

const OrderDetailsModal: React.FC<{ 
  order: Order | null; 
  open: boolean; 
  onClose: () => void 
}> = ({ order, open, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm">Customer Information</h4>
              <p className="text-sm">Name: {order.customer_name}</p>
              <p className="text-sm">Phone: {order.customer_phone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Order Information</h4>
              <p className="text-sm">Type: {order.order_type}</p>
              <p className="text-sm">Status: {order.status}</p>
              <p className="text-sm">Urgent: {order.is_urgent ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Description</h4>
            <p className="text-sm bg-gray-50 p-3 rounded">{order.description}</p>
          </div>
          {order.files && order.files.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Files ({order.files.length})</h4>
              <div className="space-y-2">
                {order.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.original_name || `File ${index + 1}`}</span>
                    <Button size="sm" variant="outline">Download</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShopDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getShopOrders();
      const allOrders = response.orders || [];
      
      // Separate active and completed orders
      const active = allOrders.filter((order: Order) => order.status !== 'completed');
      const completed = allOrders.filter((order: Order) => order.status === 'completed');
      
      setOrders(active);
      setCompletedOrders(completed);
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
      
      if (newStatus === 'completed') {
        // Move order from active to completed
        const orderToMove = orders.find(order => order.id === orderId);
        if (orderToMove) {
          const updatedOrder = { ...orderToMove, status: newStatus as any };
          setOrders(prev => prev.filter(order => order.id !== orderId));
          setCompletedOrders(prev => [updatedOrder, ...prev]);
        }
      } else {
        // Update order status in active orders
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
      }
      
      toast.success(`Order ${newStatus} successfully`);
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedOrders = completedOrders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders by type and status for columns
  const uploadedNew = filteredOrders.filter(o => o.order_type === 'uploaded-files' && o.status === 'received');
  const uploadedInProgress = filteredOrders.filter(o => o.order_type === 'uploaded-files' && o.status === 'started');
  const walkinNew = filteredOrders.filter(o => o.order_type === 'walk-in' && o.status === 'received');
  const walkinInProgress = filteredOrders.filter(o => o.order_type === 'walk-in' && o.status === 'started');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <UniversalHeader 
          title="Shop Dashboard" 
          subtitle="Manage your print orders efficiently"
          onRefresh={fetchOrders}
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
        onRefresh={fetchOrders}
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

        {/* Tabs for active orders and history */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {/* 4-Column Layout for Active Orders */}
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
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
                      onViewDetails={handleViewDetails}
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
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Completed Orders ({filteredCompletedOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCompletedOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">#{order.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {order.order_type.replace('-', ' ')}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
                          </div>
                          <p className="text-sm font-medium">{order.customer_name}</p>
                          <p className="text-xs text-gray-600">{order.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredCompletedOrders.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No completed orders</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        open={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};

export default ShopDashboard;
