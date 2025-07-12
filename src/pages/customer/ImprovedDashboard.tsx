
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
  FileText, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Phone,
  MapPin,
  Star,
  Eye,
  Upload,
  UserCheck,
  Users,
  Building
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

const ImprovedCustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shopSearchTerm, setShopSearchTerm] = useState('');

  // Enhanced visited shops data
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

  // Enhanced orders data
  const [recentOrders] = useState<Order[]>([
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
    },
    {
      id: 'WI123453',
      orderType: 'walk-in',
      description: 'Certificate lamination - 5 documents',
      status: 'completed',
      shopName: 'Print Hub Express',
      shopPhone: '+91 55555 66666',
      shopAddress: 'HSR Layout, Sector 7',
      shopRating: 4.6,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'UF123452',
      orderType: 'uploaded-files',
      description: 'Project report - 80 pages, color charts',
      status: 'completed',
      shopName: 'Quick Print Solutions',
      shopPhone: '+91 98765 43210',
      shopAddress: 'Shop 12, MG Road, Bangalore',
      shopRating: 4.8,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      filesCount: 2
    }
  ]);

  // Filter functions
  const filteredShops = visitedShops.filter(shop =>
    shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.services.some(service => service.toLowerCase().includes(shopSearchTerm.toLowerCase()))
  );

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesStatus && matchesOrderType;
  });

  // Separate orders by type
  const uploadedFilesOrders = filteredOrders.filter(order => order.orderType === 'uploaded-files');
  const walkInOrders = filteredOrders.filter(order => order.orderType === 'walk-in');

  // Utility functions
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

  // Create detailed order for modal
  const getOrderDetails = (orderId: string) => {
    const order = recentOrders.find(o => o.id === orderId);
    if (!order) return null;

    return {
      ...order,
      type: order.orderType === 'uploaded-files' ? 'digital' as const : 'physical' as const,
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
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 font-poppins">
      {/* Header - Unified Theme */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-cream-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span>
              </h1>
              <p className="text-sm text-neutral-600">Welcome back, {user?.name || 'Customer'}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate('/customer/order/new')}
                className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoading}
                className="border-neutral-300 hover:bg-neutral-50 shadow-sm"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-neutral-200 shadow-md bg-white hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-golden-500 to-golden-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-900">{recentOrders.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-neutral-200 shadow-md bg-white hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Processing</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {recentOrders.filter(o => o.status === 'processing').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-neutral-200 shadow-md bg-white hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Ready</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {recentOrders.filter(o => o.status === 'ready').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-neutral-200 shadow-md bg-white hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-neutral-600 font-medium mb-1">Shops Visited</p>
                <p className="text-2xl font-bold text-neutral-900">{visitedShops.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Universal Search */}
        <Card className="border-2 border-neutral-200 shadow-md bg-white mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search orders by name, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-400 rounded-xl bg-white shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Box - Recent Orders (Uploaded Files) */}
          <Card className="border-2 border-blue-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Uploaded Files Orders</h2>
                    <p className="text-sm text-neutral-600">{uploadedFilesOrders.length} orders</p>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              {uploadedFilesOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No uploaded files orders</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadedFilesOrders.map((order) => (
                    <Card key={order.id} className="border-2 border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-neutral-900">#{order.id}</h3>
                              <Badge className={`text-xs ${getOrderTypeColor(order.orderType)}`}>
                                {getOrderTypeIcon(order.orderType)}
                                <span className="ml-1">Files</span>
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </div>
                            <span className="text-xs text-neutral-500">{formatTimeAgo(order.createdAt)}</span>
                          </div>
                          
                          <p className="text-sm text-neutral-700">{order.description}</p>
                          
                          <div className="flex items-center gap-3 text-xs text-neutral-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{order.shopName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-golden-500 fill-current" />
                              <span>{order.shopRating}</span>
                            </div>
                            {order.filesCount && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>{order.filesCount} files</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${order.shopPhone}`)}
                              className="text-xs"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setChatOpen(true)}
                              className="text-xs"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewDetails(order.id)}
                              className="text-xs flex-1 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Box - Walk-in Orders */}
          <Card className="border-2 border-purple-200 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Walk-in Orders</h2>
                    <p className="text-sm text-neutral-600">{walkInOrders.length} orders</p>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-4">
              {walkInOrders.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No walk-in orders</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {walkInOrders.map((order) => (
                    <Card key={order.id} className="border-2 border-neutral-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-neutral-900">#{order.id}</h3>
                              <Badge className={`text-xs ${getOrderTypeColor(order.orderType)}`}>
                                {getOrderTypeIcon(order.orderType)}
                                <span className="ml-1">Walk-in</span>
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </div>
                            <span className="text-xs text-neutral-500">{formatTimeAgo(order.createdAt)}</span>
                          </div>
                          
                          <p className="text-sm text-neutral-700">{order.description}</p>
                          
                          <div className="flex items-center gap-3 text-xs text-neutral-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{order.shopName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-golden-500 fill-current" />
                              <span>{order.shopRating}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${order.shopPhone}`)}
                              className="text-xs"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setChatOpen(true)}
                              className="text-xs"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewDetails(order.id)}
                              className="text-xs flex-1 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Print Shops Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Your Print Shops</h2>
              <p className="text-neutral-600 mt-1 text-sm">Select from shops you've visited before</p>
            </div>
          </div>

          {/* Shop Search */}
          {visitedShops.length > 4 && (
            <Card className="border-2 border-neutral-200 shadow-md bg-white mb-4">
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

          <VisitedShopsSection 
            visitedShops={filteredShops}
            title=""
            showRequestButton={false}
          />
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

export default ImprovedCustomerDashboard;
