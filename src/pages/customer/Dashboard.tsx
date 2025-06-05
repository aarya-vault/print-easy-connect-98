import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Star,
  Calendar,
  Users,
  Eye,
  Upload,
  UserCheck
} from 'lucide-react';
import { VisitedShop } from '@/types/shop';
import VisitedShopsSection from '@/components/customer/VisitedShopsSection';
import OrderDetailsModal from '@/components/order/OrderDetailsModal';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

interface Order {
  id: string;
  orderType: 'walk-in' | 'uploaded-files';
  description: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  shopRating: number;
  createdAt: Date;
  filesCount?: number;
}

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shopSearchTerm, setShopSearchTerm] = useState('');

  // Sample visited shops data with no pricing and added upload slugs
  const [visitedShops] = useState<VisitedShop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '+91 98765 43210',
      email: 'contact@quickprint.com',
      rating: 4.8,
      totalReviews: 245,
      services: ['Color Printing', 'Black & White', 'Binding', 'Scanning'],
      equipment: ['Laser Printer', 'Scanner', 'Binding Machine'],
      operatingHours: {
        monday: { open: '9:00', close: '18:00', isOpen: true },
        tuesday: { open: '9:00', close: '18:00', isOpen: true },
        wednesday: { open: '9:00', close: '18:00', isOpen: true },
        thursday: { open: '9:00', close: '18:00', isOpen: true },
        friday: { open: '9:00', close: '18:00', isOpen: true },
        saturday: { open: '10:00', close: '16:00', isOpen: true },
        sunday: { open: '10:00', close: '16:00', isOpen: false }
      },
      images: [],
      verified: true,
      uploadSlug: 'quick-print-solutions',
      isActive: true,
      lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      visitCount: 8,
      averageCompletionTime: '15-20 mins',
      orderHistory: [
        { orderId: 'PE123456', date: new Date(), status: 'completed', orderType: 'uploaded-files' },
        { orderId: 'PE123455', date: new Date(), status: 'completed', orderType: 'walk-in' }
      ]
    },
    {
      id: 'shop2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '+91 87654 32109',
      email: 'info@campuscopy.com',
      rating: 4.5,
      totalReviews: 189,
      services: ['Photocopying', 'Scanning', 'Lamination'],
      equipment: ['Xerox Machine', 'High-speed Scanner'],
      operatingHours: {
        monday: { open: '8:00', close: '20:00', isOpen: true },
        tuesday: { open: '8:00', close: '20:00', isOpen: true },
        wednesday: { open: '8:00', close: '20:00', isOpen: true },
        thursday: { open: '8:00', close: '20:00', isOpen: true },
        friday: { open: '8:00', close: '20:00', isOpen: true },
        saturday: { open: '9:00', close: '18:00', isOpen: true },
        sunday: { open: '10:00', close: '16:00', isOpen: true }
      },
      images: [],
      verified: true,
      uploadSlug: 'campus-copy-center',
      isActive: true,
      lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      visitCount: 3,
      averageCompletionTime: '10-15 mins',
      orderHistory: [
        { orderId: 'PE123454', date: new Date(), status: 'completed', orderType: 'walk-in' }
      ]
    }
  ]);

  // Sample orders data with order types and no pricing
  const [orders] = useState<Order[]>([
    {
      id: 'UF123456',
      orderType: 'uploaded-files',
      description: 'Business presentation slides - 50 pages, color printing, spiral binding',
      status: 'processing',
      shopName: 'Quick Print Solutions',
      shopPhone: '+91 98765 43210',
      shopAddress: 'Shop 12, MG Road, Bangalore',
      shopRating: 4.8,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      filesCount: 3
    },
    {
      id: 'WI123455',
      orderType: 'walk-in',
      description: 'College textbook scanning - 200 pages',
      status: 'ready',
      shopName: 'Campus Copy Center',
      shopPhone: '+91 87654 32109',
      shopAddress: 'Near College Gate, Whitefield',
      shopRating: 4.5,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'UF123454',
      orderType: 'uploaded-files',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'completed',
      shopName: 'Digital Express Printing',
      shopPhone: '+91 76543 21098',
      shopAddress: 'Forum Mall, Level 1, Koramangala',
      shopRating: 4.9,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      filesCount: 1
    }
  ]);

  // Filter shops based on search term
  const filteredShops = visitedShops.filter(shop =>
    shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.services.some(service => service.toLowerCase().includes(shopSearchTerm.toLowerCase()))
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesStatus && matchesOrderType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-golden-100 text-golden-800 border-golden-200';
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

  const getOrderTypeIcon = (orderType: string) => {
    return orderType === 'uploaded-files' ? <Upload className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />;
  };

  const getOrderTypeColor = (orderType: string) => {
    return orderType === 'uploaded-files' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
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

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  // Create detailed order for modal (removed pricing) - Fixed to include type property
  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    return {
      ...order,
      type: order.orderType, // Add the required type property
      timeline: [
        {
          status: 'Order Placed',
          timestamp: order.createdAt,
          description: 'Your order has been successfully placed and assigned to the shop.'
        },
        {
          status: 'Shop Confirmed',
          timestamp: new Date(order.createdAt.getTime() + 5 * 60 * 1000),
          description: 'The shop has confirmed your order and started processing.'
        },
        ...(order.status === 'processing' || order.status === 'ready' || order.status === 'completed' ? [{
          status: 'Processing Started',
          timestamp: new Date(order.createdAt.getTime() + 15 * 60 * 1000),
          description: 'Your order is being processed by the shop.'
        }] : []),
        ...(order.status === 'ready' || order.status === 'completed' ? [{
          status: 'Ready',
          timestamp: new Date(order.createdAt.getTime() + 45 * 60 * 1000),
          description: 'Your order is ready.'
        }] : []),
        ...(order.status === 'completed' ? [{
          status: 'Completed',
          timestamp: new Date(order.createdAt.getTime() + 60 * 60 * 1000),
          description: 'Order has been completed successfully.'
        }] : [])
      ],
      files: order.orderType === 'uploaded-files' ? [
        {
          id: '1',
          name: 'presentation_slides.pdf',
          type: 'application/pdf',
          size: 2560000,
          url: '#'
        },
        {
          id: '2',
          name: 'cover_page.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 45000,
          url: '#'
        }
      ] : undefined
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 font-poppins">
      {/* Header - Mobile Optimized */}
      <div className="bg-white/90 backdrop-blur-lg shadow-glass border-b border-golden-200/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                <span className="text-neutral-900">Print</span>
                <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
              </h1>
              <p className="text-neutral-600 font-medium text-sm">Welcome back, {user?.name || 'Customer'}!</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/customer/order/new')}
                className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-4 py-2 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Order
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoading}
                className="border-neutral-300 hover:bg-neutral-50 font-medium text-sm px-3 py-2"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats - Mobile Optimized (no revenue) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-golden rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900">{orders.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Processing</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Ready</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-golden-soft rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-5 h-5 text-golden-700" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Shops Visited</p>
                <p className="text-2xl font-bold text-neutral-900">{visitedShops.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Print Shops Section - Mobile Optimized */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Print Shops</h2>
              <p className="text-neutral-600 mt-1 text-sm">Select from shops you've visited before</p>
            </div>
          </div>

          {/* Shop Search */}
          {visitedShops.length > 4 && (
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg mb-4">
              <CardContent className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Search shops..."
                    value={shopSearchTerm}
                    onChange={(e) => setShopSearchTerm(e.target.value)}
                    className="pl-10 h-10 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-lg font-medium text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {filteredShops.length === 0 && shopSearchTerm ? (
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-golden-soft rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-golden-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No shops found</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto">
                  Try adjusting your search terms or browse all shops below.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setShopSearchTerm('')}
                  className="mt-3 text-sm"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <VisitedShopsSection 
              visitedShops={filteredShops}
              title=""
              showRequestButton={false}
            />
          )}
        </div>

        {/* Enhanced Search and Filters for Orders - Mobile Optimized */}
        <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg mb-6">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-lg font-medium text-sm"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 border-2 border-neutral-200 rounded-lg px-3 py-2 font-medium focus:border-golden-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="flex-1 border-2 border-neutral-200 rounded-lg px-3 py-2 font-medium focus:border-golden-500 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="uploaded-files">Uploaded Files</option>
                  <option value="walk-in">Walk-in</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List - Mobile Optimized with Order Type Badges */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent Orders</h2>
          
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-golden-soft rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-golden-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders found</h3>
                <p className="text-neutral-600 mb-6 text-sm max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' || orderTypeFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'You haven\'t placed any orders yet'
                  }
                </p>
                <Button
                  onClick={() => navigate('/customer/order/new')}
                  className="bg-gradient-golden hover:shadow-golden text-white font-semibold text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Place Your First Order
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 text-sm">#{order.id}</h3>
                        <Badge className={`border font-medium text-xs ${getOrderTypeColor(order.orderType)}`}>
                          <div className="flex items-center gap-1">
                            {getOrderTypeIcon(order.orderType)}
                            <span className="capitalize">{order.orderType === 'uploaded-files' ? 'Files' : 'Walk-in'}</span>
                          </div>
                        </Badge>
                        <Badge className={`border font-medium text-xs ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status === 'ready' ? 'Ready' : order.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <span className="text-xs text-neutral-500 font-medium">{formatTimeAgo(order.createdAt)}</span>
                    </div>
                    
                    <p className="text-neutral-700 font-medium leading-relaxed text-sm">{order.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-neutral-600">
                        <MapPin className="w-3 h-3" />
                        <span className="font-medium">{order.shopName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600">
                        <Star className="w-3 h-3 text-golden-500 fill-current" />
                        <span className="font-medium">{order.shopRating}</span>
                      </div>
                      {order.filesCount && (
                        <div className="flex items-center gap-1 text-neutral-600">
                          <FileText className="w-3 h-3" />
                          <span className="font-medium">{order.filesCount} files</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${order.shopPhone}`)}
                        className="border-neutral-300 hover:bg-neutral-50 font-medium text-xs px-3 py-2"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatOpen(true)}
                        className="border-neutral-300 hover:bg-neutral-50 font-medium text-xs px-3 py-2"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-4 py-2 text-xs flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal (pricing removed) */}
      {selectedOrderId && (
        <OrderDetailsModal
          order={getOrderDetails(selectedOrderId)!}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onOpenChat={() => {
            setSelectedOrderId(null);
            setChatOpen(true);
          }}
        />
      )}

      {/* Chat System */}
      <EnhancedChatSystem 
        orderId={selectedOrderId || undefined}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};

export default CustomerDashboard;
