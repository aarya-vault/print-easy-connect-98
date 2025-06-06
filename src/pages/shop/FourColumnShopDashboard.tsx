
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  UserCheck, 
  Search, 
  Filter,
  Bell,
  Phone,
  MessageSquare,
  Eye,
  Zap,
  CheckCircle,
  Clock,
  Package,
  ArrowRight,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  isUrgent: boolean;
  description: string;
  createdAt: Date;
  totalAmount?: number;
}

const FourColumnShopDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  // Mock data
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'UF001',
        customerName: 'Rajesh Kumar',
        customerPhone: '9876543210',
        orderType: 'uploaded-files',
        status: 'processing',
        isUrgent: true,
        description: 'Business presentation slides - 50 pages, color printing, spiral binding',
        createdAt: new Date(Date.now() - 30 * 60000),
        totalAmount: 250
      },
      {
        id: 'UF002',
        customerName: 'Priya Sharma',
        customerPhone: '8765432109',
        orderType: 'uploaded-files',
        status: 'new',
        isUrgent: true,
        description: 'Resume printing - 10 copies, premium paper',
        createdAt: new Date(Date.now() - 15 * 60000),
        totalAmount: 80
      },
      {
        id: 'WI001',
        customerName: 'Amit Patel',
        customerPhone: '7654321098',
        orderType: 'walk-in',
        status: 'confirmed',
        isUrgent: false,
        description: 'College textbook scanning - 200 pages',
        createdAt: new Date(Date.now() - 45 * 60000),
        totalAmount: 400
      },
      {
        id: 'WI002',
        customerName: 'Sneha Reddy',
        customerPhone: '6543210987',
        orderType: 'walk-in',
        status: 'processing',
        isUrgent: false,
        description: 'Wedding invitation cards - 100 copies, premium cardstock',
        createdAt: new Date(Date.now() - 60 * 60000),
        totalAmount: 800
      }
    ];
    setOrders(mockOrders);
  }, []);

  const uploadOrders = orders.filter(order => order.orderType === 'uploaded-files');
  const walkInOrders = orders.filter(order => order.orderType === 'walk-in');

  const activeOrders = orders.filter(order => 
    ['new', 'confirmed', 'processing', 'ready'].includes(order.status)
  );
  const completedOrders = orders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );

  const filteredOrders = (orderList: Order[]) => 
    orderList.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    );

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleChat = (orderId: string) => {
    toast.info(`Opening chat for order ${orderId}`);
  };

  const handleViewDetails = (orderId: string) => {
    toast.info(`Viewing details for order ${orderId}`);
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
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    urgentOrders: orders.filter(o => o.isUrgent && ['new', 'confirmed', 'processing'].includes(o.status)).length,
    revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Dashboard</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Manage your orders efficiently</p>
            <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-xl font-bold">₹{stats.revenue}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload/Online Orders Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Upload/Online Orders</h2>
                  <Badge variant="secondary">{filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))).length}</Badge>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Column 1 - New & Confirmed */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">New & Confirmed</h3>
                    {filteredOrders(uploadOrders.filter(o => ['new', 'confirmed'].includes(o.status))).map(order => (
                      <OptimizedOrderCard
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
                  
                  {/* Column 2 - Processing & Ready */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Processing & Ready</h3>
                    {filteredOrders(uploadOrders.filter(o => ['processing', 'ready'].includes(o.status))).map(order => (
                      <OptimizedOrderCard
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
                  {/* Column 3 - New & Confirmed */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">New & Confirmed</h3>
                    {filteredOrders(walkInOrders.filter(o => ['new', 'confirmed'].includes(o.status))).map(order => (
                      <OptimizedOrderCard
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
                  
                  {/* Column 4 - Processing & Ready */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Processing & Ready</h3>
                    {filteredOrders(walkInOrders.filter(o => ['processing', 'ready'].includes(o.status))).map(order => (
                      <OptimizedOrderCard
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
                <OptimizedOrderCard
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
        </Tabs>
      </div>
    </div>
  );
};

// Optimized Order Card Component
const OptimizedOrderCard: React.FC<{
  order: Order;
  onCall: (phone: string) => void;
  onChat: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onToggleUrgency: (orderId: string) => void;
}> = ({ order, onCall, onChat, onViewDetails, onUpdateStatus, onToggleUrgency }) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Bell className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'processing': return <Clock className="w-3 h-3" />;
      case 'ready': return <Package className="w-3 h-3" />;
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
      case 'new': return 'confirmed';
      case 'confirmed': return 'processing';
      case 'processing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = () => {
    switch (order.status) {
      case 'new': return 'Confirm';
      case 'confirmed': return 'Start';
      case 'processing': return 'Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border-l-4 ${
      order.isUrgent ? 'border-l-red-500 bg-red-50/30' : 
      order.orderType === 'uploaded-files' ? 'border-l-blue-500' : 'border-l-purple-500'
    } hover:shadow-md transition-shadow`}>
      <CardContent className="p-3">
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
        <div className="flex items-center justify-between mb-2">
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
          {order.totalAmount && (
            <span className="text-xs font-medium text-gray-700">₹{order.totalAmount}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-700 mb-3 line-clamp-2">{order.description}</p>

        {/* Action Buttons */}
        <div className="flex space-x-1 mb-2">
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
        {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, nextStatus as Order['status'])}
            className="w-full h-7 text-xs bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
          >
            {statusAction}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FourColumnShopDashboard;
