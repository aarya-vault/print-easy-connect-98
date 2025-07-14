
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MobileHeader from '@/components/layout/MobileHeader';
import { 
  Search, 
  Plus, 
  MapPin, 
  Star, 
  Clock,
  Package,
  TrendingUp,
  Zap,
  Phone,
  ArrowRight,
  Filter,
  RefreshCw,
  Upload,
  UserCheck,
  Eye,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  shopName: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed' | 'cancelled';
  description: string;
  createdAt: Date;
  estimatedCost?: number;
  isUrgent: boolean;
}

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  distance: string;
  estimatedTime: string;
  isOpen: boolean;
  services: string[];
  lastVisited?: Date;
}

const MobileOptimizedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'shops'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data
  const [stats] = useState({
    totalOrders: 15,
    activeOrders: 3,
    completedOrders: 12,
    totalSpent: 1250.50
  });

  const [recentOrders] = useState<Order[]>([
    {
      id: 'UF001',
      shopName: 'Quick Print Solutions',
      orderType: 'uploaded-files',
      status: 'started',
      description: 'Print 5 copies of resume with binding',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedCost: 150,
      isUrgent: true
    },
    {
      id: 'WI002',
      shopName: 'Campus Copy Center',
      orderType: 'walk-in',
      status: 'completed',
      description: 'Lamination and photocopying',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      estimatedCost: 85,
      isUrgent: false
    },
    {
      id: 'UF003',
      shopName: 'Digital Express Printing',
      orderType: 'uploaded-files',
      status: 'received',
      description: 'Color printing of presentation slides',
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      estimatedCost: 200,
      isUrgent: false
    }
  ]);

  const [nearbyShops] = useState<Shop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '9876543210',
      rating: 4.8,
      totalReviews: 245,
      distance: '0.5 km',
      estimatedTime: '15-20 mins',
      isOpen: true,
      services: ['Color Printing', 'Binding', 'Scanning'],
      lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'shop2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '8765432109',
      rating: 4.5,
      totalReviews: 189,
      distance: '1.2 km',
      estimatedTime: '10-15 mins',
      isOpen: true,
      services: ['Photocopying', 'Lamination'],
      lastVisited: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'shop3',
      name: 'Digital Express Printing',
      address: 'Forum Mall, Koramangala',
      phone: '7654321098',
      rating: 4.9,
      totalReviews: 312,
      distance: '2.1 km',
      estimatedTime: '20-25 mins',
      isOpen: true,
      services: ['Color Printing', 'Photo Printing', 'Large Format']
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'received': return <Clock className="w-3 h-3" />;
      case 'started': return <Package className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredShops = nearbyShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title={`Hello, ${user?.name || 'Customer'}!`} showMenu={true} />
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-golden-600 text-primary-foreground p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">Ready to Print?</h2>
            <p className="text-primary-foreground/80 text-sm">Find nearby shops and place orders instantly</p>
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
        <div className="flex gap-4 overflow-x-auto pb-2">
          <Card className="min-w-[140px] flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.totalOrders}</div>
              <div className="text-xs text-blue-700">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[140px] flex-shrink-0 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{stats.activeOrders}</div>
              <div className="text-xs text-yellow-700">Active Orders</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[140px] flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.completedOrders}</div>
              <div className="text-xs text-green-700">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[140px] flex-shrink-0 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">₹{stats.totalSpent}</div>
              <div className="text-xs text-purple-700">Total Spent</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate('/customer/order/new')}
            className="h-14 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Files
          </Button>
          <Button
            onClick={() => navigate('/customer/order/new')}
            className="h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Walk-in Order
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pb-4">
        <div className="flex bg-muted rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'orders', label: 'My Orders' },
            { key: 'shops', label: 'Find Shops' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium">{order.id}</span>
                        {order.isUrgent && (
                          <Badge className="bg-red-100 text-red-800 px-1 py-0 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{order.shopName}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recently Visited Shops */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recently Visited</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('shops')}
                  >
                    Find More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyShops.filter(shop => shop.lastVisited).slice(0, 2).map((shop) => (
                  <div key={shop.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{shop.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{shop.rating}</span>
                        <span>•</span>
                        <span>{shop.distance}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/customer/shop/${shop.id}/order`)}
                    >
                      Order
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Orders</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            
            {recentOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-medium">{order.id}</span>
                        {order.isUrgent && (
                          <Badge className="bg-red-100 text-red-800 px-2 py-1 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium">{order.shopName}</h3>
                      <p className="text-sm text-muted-foreground">{order.description}</p>
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatTimeAgo(order.createdAt)}</span>
                    {order.estimatedCost && (
                      <span className="font-medium">₹{order.estimatedCost}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/customer/order/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${nearbyShops.find(s => s.name === order.shopName)?.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search shops by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-3">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{shop.name}</h3>
                          <Badge className={shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {shop.isOpen ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{shop.rating}</span>
                          <span>({shop.totalReviews} reviews)</span>
                          <span>•</span>
                          <span>{shop.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{shop.address}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {shop.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {shop.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{shop.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => navigate(`/customer/shop/${shop.id}/order`)}
                        disabled={!shop.isOpen}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Place Order
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`tel:${shop.phone}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedDashboard;
