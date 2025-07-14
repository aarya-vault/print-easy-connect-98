
import React, { useState } from 'react';
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
  Clock,
  Package,
  Upload,
  UserCheck,
  Eye,
  CheckCircle,
  Phone
} from 'lucide-react';

interface Order {
  id: string;
  shopName: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'new' | 'processing' | 'ready' | 'completed';
  description: string;
  createdAt: Date;
  isUrgent: boolean;
}

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  estimatedTime: string;
  isOpen: boolean;
  lastVisited?: Date;
}

const SimplifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified mock data without pricing/revenue
  const [stats] = useState({
    totalOrders: 15,
    activeOrders: 3,
    completedOrders: 12
  });

  const [recentOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      shopName: 'Quick Print Solutions',
      orderType: 'uploaded-files',
      status: 'processing',
      description: 'Print 5 copies of resume with binding',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isUrgent: true
    },
    {
      id: 'ORD002',
      shopName: 'Campus Copy Center',
      orderType: 'walk-in',
      status: 'completed',
      description: 'Lamination and photocopying',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isUrgent: false
    },
    {
      id: 'ORD003',
      shopName: 'Digital Express Printing',
      orderType: 'uploaded-files',
      status: 'new',
      description: 'Color printing of presentation slides',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isUrgent: false
    }
  ]);

  const [nearbyShops] = useState<Shop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '9876543210',
      distance: '0.5 km',
      estimatedTime: '15-20 mins',
      isOpen: true,
      lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'shop2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '8765432109',
      distance: '1.2 km',
      estimatedTime: '10-15 mins',
      isOpen: true,
      lastVisited: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'processing': return 'status-progress';
      case 'ready': return 'status-ready';
      case 'completed': return 'status-completed';
      default: return 'status-new';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'new': return <Clock className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'ready': return <CheckCircle className="w-3 h-3" />;
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
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title={`Hello, ${user?.name || 'Customer'}!`} showMenu={true} />
      
      {/* Welcome Section */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-1">Ready to Print?</h2>
          <p className="text-primary-foreground/80 text-sm">Find nearby shops and place orders instantly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.activeOrders}</div>
              <div className="text-sm text-muted-foreground">Active Orders</div>
            </CardContent>
          </Card>
          
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.completedOrders}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/customer/order/new')}
            className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Files
          </Button>
          <Button
            onClick={() => navigate('/customer/order/new')}
            className="h-14 bg-foreground hover:bg-foreground/90 text-background font-semibold"
            size="lg"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Walk-in Order
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="card-black">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                      {order.isUrgent && (
                        <Badge className="bg-primary/20 text-foreground px-2 py-1 text-xs">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/customer/order/${order.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Find Shops */}
          <Card className="card-black">
            <CardHeader>
              <CardTitle className="text-lg">Find Shops</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredShops.map((shop) => (
                <div key={shop.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{shop.name}</h3>
                        <Badge className={shop.isOpen ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'}>
                          {shop.isOpen ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{shop.address}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>{shop.distance} • {shop.estimatedTime}</span>
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
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
