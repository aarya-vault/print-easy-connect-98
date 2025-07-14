
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileHeader from '@/components/layout/MobileHeader';
import { 
  Package,
  Clock,
  PlayCircle,
  CheckCircle,
  Phone,
  MessageSquare,
  Eye,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  RefreshCw,
  Filter,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed' | 'cancelled';
  description: string;
  isUrgent: boolean;
  createdAt: Date;
  estimatedCost?: number;
  files?: { name: string; type: string }[];
  services: string[];
}

const MobileShopDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'progress' | 'ready' | 'completed'>('new');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const [stats] = useState({
    totalOrders: 127,
    newOrders: 8,
    inProgress: 5,
    readyOrders: 3,
    todayRevenue: 2450,
    rating: 4.8,
    totalReviews: 245
  });

  const [orders] = useState<ShopOrder[]>([
    {
      id: 'UF001',
      customerName: 'Rajesh Kumar',
      customerPhone: '9876543210',
      orderType: 'uploaded-files',
      status: 'received',
      description: 'Print 10 copies of resume with spiral binding',
      isUrgent: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      estimatedCost: 150,
      files: [{ name: 'resume.pdf', type: 'PDF' }],
      services: ['Color Printing', 'Spiral Binding']
    },
    {
      id: 'WI002',
      customerName: 'Priya Sharma',
      customerPhone: '8765432109',
      orderType: 'walk-in',
      status: 'started',
      description: 'Lamination of certificates and photocopying',
      isUrgent: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedCost: 85,
      services: ['Lamination', 'Photocopying']
    },
    {
      id: 'UF003',
      customerName: 'Amit Patel',
      customerPhone: '7654321098',
      orderType: 'uploaded-files',
      status: 'completed',
      description: 'Color printing of presentation slides',
      isUrgent: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      estimatedCost: 200,
      files: [{ name: 'presentation.pptx', type: 'PPTX' }],
      services: ['Color Printing']
    },
    {
      id: 'WI004',
      customerName: 'Sneha Reddy',
      customerPhone: '6543210987',
      orderType: 'walk-in',
      status: 'received',
      description: 'Book binding and cover design',
      isUrgent: true,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      estimatedCost: 300,
      services: ['Book Binding', 'Cover Design']
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Orders refreshed!');
  };

  const handleStatusUpdate = (orderId: string, newStatus: ShopOrder['status']) => {
    // In real app, this would update the backend
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const handleToggleUrgency = (orderId: string) => {
    // In real app, this would update the backend
    toast.success(`Order ${orderId} urgency toggled`);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleChat = (orderId: string) => {
    toast.info(`Opening chat for order ${orderId}`);
  };

  const getStatusColor = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return <Clock className="w-4 h-4" />;
      case 'started': return <PlayCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: ShopOrder['status']): ShopOrder['status'] | null => {
    switch (currentStatus) {
      case 'received': return 'started';
      case 'started': return 'completed';
      default: return null;
    }
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'new':
        return orders.filter(order => order.status === 'received');
      case 'progress':
        return orders.filter(order => order.status === 'started');
      case 'ready':
        return orders.filter(order => order.status === 'completed');
      case 'completed':
        return orders.filter(order => order.status === 'completed');
      default:
        return orders;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const filteredOrders = getFilteredOrders();
  const urgentOrders = filteredOrders.filter(order => order.isUrgent);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="Shop Dashboard" 
        showMenu={true}
      />
      
      {/* Shop Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Quick Print Solutions</h2>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span>{stats.rating}</span>
                <span>({stats.totalReviews})</span>
              </div>
              <Badge className="bg-white/20 text-white text-xs">
                Open
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards - Mobile Horizontal Scroll */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Card className="min-w-[120px] flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 text-center">
              <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-900">{stats.newOrders}</div>
              <div className="text-xs text-blue-700">New Orders</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[120px] flex-shrink-0 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-3 text-center">
              <PlayCircle className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-yellow-900">{stats.inProgress}</div>
              <div className="text-xs text-yellow-700">In Progress</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[120px] flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 text-center">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-900">{stats.readyOrders}</div>
              <div className="text-xs text-green-700">Ready</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[120px] flex-shrink-0 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-900">₹{stats.todayRevenue}</div>
              <div className="text-xs text-purple-700">Today</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pb-4">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          {[
            { key: 'new', label: 'New', count: stats.newOrders },
            { key: 'progress', label: 'Progress', count: stats.inProgress },
            { key: 'ready', label: 'Ready', count: stats.readyOrders },
            { key: 'completed', label: 'Done', count: 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className={`absolute -top-1 -right-1 px-1 min-w-[18px] h-4 text-xs ${
                  activeTab === tab.key ? 'bg-white text-primary' : 'bg-primary text-white'
                }`}>
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Urgent Orders Alert */}
      {urgentOrders.length > 0 && (
        <div className="px-4 pb-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">
                  {urgentOrders.length} urgent order{urgentOrders.length > 1 ? 's' : ''} need attention!
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders List */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders ({filteredOrders.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            
            return (
              <Card key={order.id} className={`${order.isUrgent ? 'border-red-200 bg-red-50/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium text-sm">{order.id}</span>
                          {order.isUrgent && (
                            <Badge className="bg-red-100 text-red-800 px-1 py-0 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {order.orderType === 'uploaded-files' ? 'Upload' : 'Walk-in'}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{order.customerName}</h3>
                        <p className="text-sm text-muted-foreground truncate">{order.description}</p>
                      </div>
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>

                    {/* Services */}
                    <div className="flex flex-wrap gap-1">
                      {order.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    {/* Files (if uploaded-files order) */}
                    {order.files && order.files.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Files: {order.files.map(file => file.name).join(', ')}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTimeAgo(order.createdAt)}</span>
                      {order.estimatedCost && (
                        <span className="font-medium">₹{order.estimatedCost}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(order.customerPhone)}
                        className="text-xs"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleChat(order.id)}
                        className="text-xs"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {/* View details */}}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, nextStatus)}
                          className="text-xs bg-primary hover:bg-primary/90"
                        >
                          {nextStatus === 'started' ? 'Start' : 'Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No orders found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'new' && 'New orders will appear here when customers place them.'}
                  {activeTab === 'progress' && 'Orders you\'ve started working on will appear here.'}
                  {activeTab === 'ready' && 'Completed orders ready for pickup will appear here.'}
                  {activeTab === 'completed' && 'Your order history will appear here.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileShopDashboard;
