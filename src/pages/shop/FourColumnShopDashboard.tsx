
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import UniversalHeader from '@/components/layout/UniversalHeader';
import { 
  Upload, 
  UserCheck, 
  Search, 
  Phone,
  MessageSquare,
  Eye,
  Zap,
  Clock,
  Package,
  CheckCircle,
  Users,
  FileText,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed';
  isUrgent: boolean;
  description: string;
  createdAt: Date;
}

const FourColumnShopDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  // Mock data with simplified statuses
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'UF001',
        customerName: 'Rajesh Kumar',
        customerPhone: '9876543210',
        orderType: 'uploaded-files',
        status: 'started',
        isUrgent: true,
        description: 'Business presentation slides - 50 pages, color printing, spiral binding. Need high quality output for important client meeting.',
        createdAt: new Date(Date.now() - 120 * 60000)
      },
      {
        id: 'UF002',
        customerName: 'Priya Sharma',
        customerPhone: '8765432109',
        orderType: 'uploaded-files',
        status: 'received',
        isUrgent: true,
        description: 'Resume printing - 10 copies, premium paper',
        createdAt: new Date(Date.now() - 90 * 60000)
      },
      {
        id: 'WI001',
        customerName: 'Amit Patel',
        customerPhone: '7654321098',
        orderType: 'walk-in',
        status: 'received',
        isUrgent: false,
        description: 'College textbook scanning - 200 pages. Student needs digital copy for online classes.',
        createdAt: new Date(Date.now() - 60 * 60000)
      },
      {
        id: 'WI002',
        customerName: 'Sneha Reddy',
        customerPhone: '6543210987',
        orderType: 'walk-in',
        status: 'started',
        isUrgent: false,
        description: 'Wedding invitation cards - 100 copies, premium cardstock with gold foil finishing',
        createdAt: new Date(Date.now() - 30 * 60000)
      }
    ];
    setOrders(mockOrders);
  }, []);

  const uploadOrders = orders.filter(order => order.orderType === 'uploaded-files');
  const walkInOrders = orders.filter(order => order.orderType === 'walk-in');

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const filteredOrders = (orderList: Order[]) => 
    orderList.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Oldest first

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
    toast.success(`Calling ${phone}`);
  };

  const handleChat = (orderId: string) => {
    toast.info(`Opening chat for order ${orderId}`);
    // Open chat modal/page
  };

  const handleViewDetails = (orderId: string) => {
    toast.info(`Viewing details for order ${orderId}`);
    // Open order details modal
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleToggleUrgency = (orderId: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, isUrgent: !order.isUrgent } : order
      )
    );
    const order = orders.find(o => o.id === orderId);
    toast.success(`Order ${orderId} ${order?.isUrgent ? 'unmarked' : 'marked'} as urgent`);
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    urgentOrders: orders.filter(o => o.isUrgent && o.status !== 'completed').length,
  };

  const handleRefresh = () => {
    toast.success('Dashboard refreshed');
    // Refetch data logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UniversalHeader 
        title="Shop Dashboard" 
        subtitle="Manage your orders efficiently"
        onRefresh={handleRefresh}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Orders</p>
                    <p className="text-xl font-bold">{stats.activeOrders}</p>
                  </div>
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Urgent Orders</p>
                    <p className="text-xl font-bold">{stats.urgentOrders}</p>
                  </div>
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="orders">Orders ({activeOrders.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
              <TabsTrigger value="qr-upload">Shop QR & Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload/Online Orders Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Upload/Online Orders</h2>
                    <Badge variant="secondary">{filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))).length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* All Upload Orders */}
                    <div className="xl:col-span-2 space-y-3">
                      {filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))).map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onCall={handleCall}
                          onChat={handleChat}
                          onViewDetails={handleViewDetails}
                          onUpdateStatus={handleUpdateStatus}
                          onToggleUrgency={handleToggleUrgency}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Walk-in Orders Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Walk-in Orders</h2>
                    <Badge variant="secondary">{filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))).length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* All Walk-in Orders */}
                    <div className="xl:col-span-2 space-y-3">
                      {filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))).map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onCall={handleCall}
                          onChat={handleChat}
                          onViewDetails={handleViewDetails}
                          onUpdateStatus={handleUpdateStatus}
                          onToggleUrgency={handleToggleUrgency}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders(completedOrders).map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCall={handleCall}
                    onChat={handleChat}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                    onToggleUrgency={handleToggleUrgency}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qr-upload">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="w-5 h-5" />
                      <span>Shop QR Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-400" />
                    </div>
                    <Button className="w-full">Download QR Code</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ExternalLink className="w-5 h-5" />
                      <span>Upload Page</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">Direct link to your shop's upload page</p>
                    <div className="bg-gray-50 p-3 rounded border text-sm font-mono">
                      https://printeasy.com/shop/quick-print-solutions/upload
                    </div>
                    <Button className="w-full" variant="outline">Copy Link</Button>
                    <Button className="w-full">Open Upload Page</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Order Card Component with fixed height and working icons
const OrderCard: React.FC<{
  order: Order;
  onCall: (phone: string) => void;
  onChat: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onToggleUrgency: (orderId: string) => void;
}> = ({ order, onCall, onChat, onViewDetails, onUpdateStatus, onToggleUrgency }) => {
  
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
      case 'received': return <Package className="w-3 h-3" />;
      case 'started': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getNextStatus = () => {
    switch (order.status) {
      case 'received': return 'started';
      case 'started': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = () => {
    switch (order.status) {
      case 'received': return 'Start';
      case 'started': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border-l-4 h-40 ${
      order.isUrgent ? 'border-l-red-500 bg-red-50/30' : 
      order.orderType === 'uploaded-files' ? 'border-l-blue-500' : 'border-l-purple-500'
    } hover:shadow-md transition-shadow`}>
      <CardContent className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm text-gray-900 truncate">{order.customerName}</h3>
              {order.isUrgent && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-600">#{order.id}</p>
          </div>
          <span className="text-xs text-gray-500">{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* Status Badge */}
        <div className="mb-2">
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
        </div>

        {/* Description - Fixed height with ellipsis */}
        <div className="flex-1 mb-3">
          <p className="text-xs text-gray-700 line-clamp-2 overflow-hidden">{order.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCall(order.customerPhone)}
              className="flex-1 h-7 text-xs"
            >
              <Phone className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChat(order.id)}
              className="flex-1 h-7 text-xs"
            >
              <MessageSquare className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="flex-1 h-7 text-xs"
            >
              <Eye className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleUrgency(order.id)}
              className={`flex-1 h-7 text-xs ${order.isUrgent ? 'bg-red-50 border-red-200' : ''}`}
            >
              <Zap className="w-3 h-3" />
            </Button>
          </div>

          {/* Status Action Button */}
          {nextStatus && statusAction && order.status !== 'completed' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus as Order['status'])}
              className="w-full h-7 text-xs bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
            >
              {statusAction}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FourColumnShopDashboard;
