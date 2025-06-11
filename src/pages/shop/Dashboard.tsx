
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
  RefreshCw,
  Upload,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/services/api';
import UniversalHeader from '@/components/layout/UniversalHeader';
import QRCodeModal from '@/components/qr/QRCodeModal';
import { Order, Shop } from '@/types/api';

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

  const getNextStatus = () => {
    switch (order.status) {
      case 'pending': return 'in_progress';
      case 'in_progress': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = () => {
    switch (order.status) {
      case 'pending': return 'Start Work';
      case 'in_progress': return 'Mark Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border transition-all hover:shadow-md ${
      order.is_urgent ? 'border-red-300 bg-red-50/20' : 'border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">#{order.id.slice(0, 8)}</p>
                {order.is_urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {order.order_type === 'digital' ? (
                  <><Upload className="w-3 h-3 mr-1" />Digital</>
                ) : (
                  <><UserCheck className="w-3 h-3 mr-1" />Walk-in</>
                )}
              </Badge>
            </div>
            <Badge className={`text-xs px-2 py-1 ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              order.status === 'ready' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Customer Info */}
          <div>
            <p className="font-medium text-sm">{order.customer_name}</p>
            <p className="text-xs text-gray-600">{order.customer_phone}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {order.notes}
          </p>

          {/* Files info for digital orders */}
          {order.order_type === 'digital' && order.files && order.files.length > 0 && (
            <div className="text-xs text-gray-600">
              <Package className="w-3 h-3 inline mr-1" />
              {order.files.length} file(s) attached
            </div>
          )}

          {/* Time */}
          <p className="text-xs text-gray-500">
            {formatDate(order.created_at)}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={callCustomer}
                className="flex-1 text-xs h-7"
              >
                <Phone className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(order)}
                className="flex-1 text-xs h-7"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleUrgency(order.id)}
                className={`flex-1 text-xs h-7 ${order.is_urgent ? 'bg-red-100' : ''}`}
              >
                <AlertTriangle className="w-3 h-3" />
              </Button>
            </div>

            {nextStatus && statusAction && (
              <Button
                size="sm"
                onClick={() => onStatusUpdate(order.id, nextStatus)}
                className="w-full text-xs h-7 bg-golden-500 hover:bg-golden-600"
              >
                {statusAction}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const queryClient = useQueryClient();

  // Fetch active orders
  const { data: ordersResponse, isLoading, refetch } = useQuery({
    queryKey: ['shop-orders'],
    queryFn: apiService.getShopOrders,
    refetchInterval: 30000,
  });

  // Fetch order history
  const { data: historyResponse } = useQuery({
    queryKey: ['shop-order-history'],
    queryFn: apiService.getShopOrderHistory,
    enabled: activeTab === 'history',
  });

  // Fetch shop info
  const { data: shopResponse } = useQuery({
    queryKey: ['my-shop'],
    queryFn: apiService.getMyShop,
  });

  const orders: Order[] = ordersResponse?.orders || [];
  const historyOrders: Order[] = historyResponse?.orders || [];
  const shop: Shop | null = shopResponse?.shop || null;

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      apiService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  // Urgency toggle mutation
  const urgencyMutation = useMutation({
    mutationFn: (orderId: string) => apiService.toggleOrderUrgency(orderId),
    onSuccess: () => {
      toast.success('Order urgency updated');
      queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
    },
    onError: () => {
      toast.error('Failed to update order urgency');
    },
  });

  const handleStatusUpdate = (orderId: string, status: string) => {
    statusMutation.mutate({ orderId, status });
  };

  const handleToggleUrgency = (orderId: string) => {
    urgencyMutation.mutate(orderId);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Orders refreshed');
  };

  // Filter and categorize orders
  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const digitalNewOrders = filteredOrders.filter(order => 
    order.order_type === 'digital' && order.status === 'pending'
  );
  const digitalInProgressOrders = filteredOrders.filter(order => 
    order.order_type === 'digital' && (order.status === 'in_progress' || order.status === 'ready')
  );
  const walkinNewOrders = filteredOrders.filter(order => 
    order.order_type === 'walkin' && order.status === 'pending'
  );
  const walkinInProgressOrders = filteredOrders.filter(order => 
    order.order_type === 'walkin' && (order.status === 'in_progress' || order.status === 'ready')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shop Dashboard</h1>
            <p className="text-gray-600">
              {shop?.name || 'Your Shop'} - Manage your orders efficiently
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQRModal(true)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                  <MoreVertical className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Shop Settings</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem>Analytics</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Active Orders ({filteredOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 4-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Digital New Orders */}
              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      Digital New
                      <Badge variant="secondary">{digitalNewOrders.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-3">
                  {digitalNewOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      onToggleUrgency={handleToggleUrgency}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>

              {/* Digital In Progress */}
              <div className="space-y-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Digital Progress
                      <Badge variant="secondary">{digitalInProgressOrders.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-3">
                  {digitalInProgressOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      onToggleUrgency={handleToggleUrgency}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>

              {/* Walk-in New Orders */}
              <div className="space-y-4">
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-purple-600" />
                      Walk-in New
                      <Badge variant="secondary">{walkinNewOrders.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-3">
                  {walkinNewOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      onToggleUrgency={handleToggleUrgency}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>

              {/* Walk-in In Progress */}
              <div className="space-y-4">
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Walk-in Progress
                      <Badge variant="secondary">{walkinInProgressOrders.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-3">
                  {walkinInProgressOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      onToggleUrgency={handleToggleUrgency}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historyOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No completed orders yet</p>
                  ) : (
                    historyOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.id.slice(0, 8)} - {order.customer_name}</p>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-1">{order.status}</Badge>
                          <p className="text-xs text-gray-500">
                            {new Date(order.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          shopId={shop?.id}
        />

        {/* Order Details Modal */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Order ID</h4>
                    <p className="text-gray-600">#{selectedOrder.id}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <Badge>{selectedOrder.status}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">Customer</h4>
                    <p className="text-gray-600">{selectedOrder.customer_name}</p>
                    <p className="text-gray-600">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Order Type</h4>
                    <p className="text-gray-600 capitalize">{selectedOrder.order_type}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{selectedOrder.notes}</p>
                </div>
                {selectedOrder.files && selectedOrder.files.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Files</h4>
                    <div className="space-y-2">
                      {selectedOrder.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.file_name}</span>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
