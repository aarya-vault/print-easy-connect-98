
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
  Users
} from 'lucide-react';
import { VisitedShop } from '@/types/shop';
import VisitedShopsSection from '@/components/customer/VisitedShopsSection';
import OrderDetailsModal from '@/components/order/OrderDetailsModal';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

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
  filesCount?: number;
}

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Sample visited shops data with realistic demo data
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
      lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      visitCount: 8,
      averageCompletionTime: '15-20 mins',
      pricing: {
        blackWhite: 2,
        color: 8,
        binding: 25,
        scanning: 5
      },
      orderHistory: [
        { orderId: 'PE123456', date: new Date(), amount: 250, status: 'completed' },
        { orderId: 'PE123455', date: new Date(), amount: 150, status: 'completed' }
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
      lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      visitCount: 3,
      averageCompletionTime: '10-15 mins',
      pricing: {
        blackWhite: 1.5,
        color: 6,
        binding: 20,
        scanning: 3
      },
      orderHistory: [
        { orderId: 'PE123454', date: new Date(), amount: 75, status: 'completed' }
      ]
    },
    {
      id: 'shop3',
      name: 'Digital Express Printing',
      address: 'Forum Mall, Level 1, Koramangala',
      phone: '+91 76543 21098',
      email: 'orders@digitalexpress.com',
      rating: 4.9,
      totalReviews: 312,
      services: ['Premium Printing', 'Photo Printing', 'Business Cards', 'Posters'],
      equipment: ['Digital Press', 'Photo Printer', 'Large Format Printer'],
      operatingHours: {
        monday: { open: '10:00', close: '22:00', isOpen: true },
        tuesday: { open: '10:00', close: '22:00', isOpen: true },
        wednesday: { open: '10:00', close: '22:00', isOpen: true },
        thursday: { open: '10:00', close: '22:00', isOpen: true },
        friday: { open: '10:00', close: '22:00', isOpen: true },
        saturday: { open: '10:00', close: '22:00', isOpen: true },
        sunday: { open: '11:00', close: '21:00', isOpen: true }
      },
      images: [],
      verified: true,
      lastVisited: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      visitCount: 5,
      averageCompletionTime: '20-30 mins',
      pricing: {
        blackWhite: 3,
        color: 12,
        binding: 35,
        scanning: 8
      },
      orderHistory: [
        { orderId: 'PE123453', date: new Date(), amount: 320, status: 'completed' },
        { orderId: 'PE123452', date: new Date(), amount: 180, status: 'completed' }
      ]
    }
  ]);

  // Sample orders data with no completion time or billing
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
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'PE123454',
      type: 'digital',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'completed',
      shopName: 'Digital Express Printing',
      shopPhone: '+91 76543 21098',
      shopAddress: 'Forum Mall, Level 1, Koramangala',
      shopRating: 4.9,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      filesCount: 1
    },
    {
      id: 'PE123453',
      type: 'digital',
      description: 'Marketing brochures - 100 copies, glossy paper, full color',
      status: 'completed',
      shopName: 'Digital Express Printing',
      shopPhone: '+91 76543 21098',
      shopAddress: 'Forum Mall, Level 1, Koramangala',
      shopRating: 4.9,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      filesCount: 2
    },
    {
      id: 'PE123452',
      type: 'digital',
      description: 'Thesis printing - 120 pages, double-sided, hardbound',
      status: 'completed',
      shopName: 'Quick Print Solutions',
      shopPhone: '+91 98765 43210',
      shopAddress: 'Shop 12, MG Road, Bangalore',
      shopRating: 4.8,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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

  // Create detailed order for modal
  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    return {
      ...order,
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
          status: 'Ready for Pickup',
          timestamp: new Date(order.createdAt.getTime() + 45 * 60 * 1000),
          description: 'Your order is ready for pickup from the shop.'
        }] : []),
        ...(order.status === 'completed' ? [{
          status: 'Completed',
          timestamp: new Date(order.createdAt.getTime() + 60 * 60 * 1000),
          description: 'Order has been completed successfully.'
        }] : [])
      ],
      files: order.type === 'digital' ? [
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
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-glass border-b border-golden-200/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-neutral-900">Print</span>
                <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
              </h1>
              <p className="text-neutral-600 font-medium">Welcome back, {user?.name || 'Customer'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/customer/order/new')}
                className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Order
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoading}
                className="border-neutral-300 hover:bg-neutral-50 font-medium"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-neutral-900">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-golden rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 font-medium mb-1">Processing</p>
                  <p className="text-3xl font-bold text-neutral-900">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 font-medium mb-1">Ready</p>
                  <p className="text-3xl font-bold text-neutral-900">
                    {orders.filter(o => o.status === 'ready').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 font-medium mb-1">Shops Visited</p>
                  <p className="text-3xl font-bold text-neutral-900">{visitedShops.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-golden-soft rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-golden-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Shops Previously Visited Section */}
        <div className="mb-10">
          <VisitedShopsSection 
            visitedShops={visitedShops}
            title="Print Shops Previously Visited"
            showRequestButton={false}
          />
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search orders, shops, or order IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 focus:ring-golden-100"
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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Recent Orders</h2>
          
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-gradient-golden-soft rounded-full mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-golden-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">No orders found</h3>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'You haven\'t placed any orders yet'
                  }
                </p>
                <Button
                  onClick={() => navigate('/customer/order/new')}
                  className="bg-gradient-golden hover:shadow-golden text-white font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Place Your First Order
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-semibold text-neutral-900 text-lg">#{order.id}</h3>
                        <Badge className={`border font-medium ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                        <span className="text-sm text-neutral-500 font-medium">{formatTimeAgo(order.createdAt)}</span>
                      </div>
                      
                      <p className="text-neutral-700 mb-4 font-medium leading-relaxed">{order.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <MapPin className="w-4 h-4" />
                          <span className="font-medium">{order.shopName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Star className="w-4 h-4 text-golden-500 fill-current" />
                          <span className="font-medium">{order.shopRating}</span>
                        </div>
                        {order.filesCount && (
                          <div className="flex items-center gap-2 text-neutral-600">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">{order.filesCount} files</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${order.shopPhone}`)}
                        className="border-neutral-300 hover:bg-neutral-50 font-medium"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatOpen(true)}
                        className="border-neutral-300 hover:bg-neutral-50 font-medium"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-6"
                      >
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

      {/* Order Details Modal */}
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
