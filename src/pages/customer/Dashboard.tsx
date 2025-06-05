
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-states';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Phone,
  MapPin,
  Star
} from 'lucide-react';

interface Order {
  id: string;
  type: 'digital' | 'physical';
  description: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  shopRating: number;
  createdAt: Date;
  estimatedCompletion?: Date;
  totalAmount?: number;
  filesCount?: number;
}

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Sample orders data (in real app, this would come from API)
  const [orders] = useState<Order[]>([
    {
      id: 'PE123456',
      type: 'digital',
      description: 'Business presentation slides - 50 pages, color printing, spiral binding',
      status: 'processing',
      shopName: 'Quick Print Solutions',
      shopPhone: '+91 98765 43210',
      shopAddress: 'Shop 12, MG Road, Bangalore',
      shopRating: 4.8,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 1 * 60 * 60 * 1000),
      totalAmount: 250,
      filesCount: 3
    },
    {
      id: 'PE123455',
      type: 'physical',
      description: 'College textbook scanning - 200 pages',
      status: 'ready',
      shopName: 'Campus Copy Center',
      shopPhone: '+91 87654 32109',
      shopAddress: 'Near College Gate, Whitefield',
      shopRating: 4.5,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      totalAmount: 150
    },
    {
      id: 'PE123454',
      type: 'digital',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'completed',
      shopName: 'Print Express',
      shopPhone: '+91 76543 21098',
      shopAddress: 'City Center Mall, Level 2',
      shopRating: 4.9,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      totalAmount: 75,
      filesCount: 1
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light text-neutral-900">
                <span className="text-neutral-900">Print</span>
                <span className="text-yellow-500 font-medium">Easy</span>
              </h1>
              <p className="text-neutral-600 mt-1">Welcome back!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/customer/order/new')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoading}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Orders</p>
                  <p className="text-2xl font-medium text-neutral-900">{orders.length}</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Processing</p>
                  <p className="text-2xl font-medium text-neutral-900">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Ready</p>
                  <p className="text-2xl font-medium text-neutral-900">
                    {orders.filter(o => o.status === 'ready').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">This Month</p>
                  <p className="text-2xl font-medium text-neutral-900">₹475</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-medium">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border border-neutral-200 shadow-soft bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search orders, shops, or order IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-neutral-900">Your Orders</h2>
          
          {filteredOrders.length === 0 ? (
            <Card className="border border-neutral-200 shadow-soft bg-white">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders found</h3>
                <p className="text-neutral-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'You haven\'t placed any orders yet'
                  }
                </p>
                <Button
                  onClick={() => navigate('/customer/order/new')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Place Your First Order
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-medium text-neutral-900">#{order.id}</h3>
                        <Badge className={`border ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                        <span className="text-sm text-neutral-500">{formatTimeAgo(order.createdAt)}</span>
                      </div>
                      
                      <p className="text-neutral-700 mb-3 line-clamp-2">{order.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{order.shopName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{order.shopRating}</span>
                        </div>
                        {order.filesCount && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{order.filesCount} files</span>
                          </div>
                        )}
                        {order.totalAmount && (
                          <div className="font-medium text-neutral-900">
                            ₹{order.totalAmount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${order.shopPhone}`)}
                        className="border-neutral-300 hover:bg-neutral-50"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-300 hover:bg-neutral-50"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Estimated Completion */}
                  {order.estimatedCompletion && order.status === 'processing' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Clock className="w-4 h-4" />
                        <span>
                          Estimated completion: {order.estimatedCompletion.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button for Scalability */}
        {filteredOrders.length > 0 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-neutral-300 hover:bg-neutral-50"
            >
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
