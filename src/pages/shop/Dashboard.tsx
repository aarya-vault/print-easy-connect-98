
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Phone,
  Download,
  Eye,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  BarChart3,
  Package,
  MapPin,
  Mail,
  Printer,
  Scissors,
  Scan,
  Copy,
  Image,
  Palette,
  QrCode,
  AlertTriangle,
  X,
  RotateCcw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  type: 'digital' | 'physical';
  description: string;
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  createdAt: Date;
  files?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  instructions?: string;
  services: string[];
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  color?: boolean;
}

const ShopDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Shop QR Code and Upload URL
  const shopSlug = 'quick-print-solutions';
  const uploadUrl = `https://app.printeasy.com/upload/${shopSlug}`;

  // Demo orders data for shop owner
  const [orders, setOrders] = useState<ShopOrder[]>([
    {
      id: 'PE123456',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rajesh.kumar@email.com',
      type: 'digital',
      description: 'Business presentation slides - 50 pages, color printing, spiral binding',
      status: 'processing',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      files: [
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
      ],
      instructions: 'Please use high-quality color printing. Spiral binding should be done on the left side.',
      services: ['Color Printing', 'Spiral Binding'],
      pages: 50,
      copies: 1,
      paperType: 'A4 Premium',
      binding: 'Spiral',
      color: true
    },
    {
      id: 'PE123457',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerEmail: 'priya.sharma@email.com',
      type: 'digital',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'new',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      files: [
        {
          id: '3',
          name: 'resume_final.pdf',
          type: 'application/pdf',
          size: 156000,
          url: '#'
        }
      ],
      instructions: 'Need this urgently for interview tomorrow morning. Premium paper required.',
      services: ['Black & White Printing'],
      pages: 2,
      copies: 10,
      paperType: 'A4 Premium',
      color: false
    },
    {
      id: 'PE123458',
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      customerEmail: 'amit.patel@email.com',
      type: 'physical',
      description: 'College textbook scanning - 200 pages',
      status: 'confirmed',
      priority: 'normal',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      services: ['Scanning'],
      pages: 200,
      instructions: 'Please scan in high resolution PDF format.'
    },
    {
      id: 'PE123459',
      customerName: 'Sneha Reddy',
      customerPhone: '+91 65432 10987',
      customerEmail: 'sneha.reddy@email.com',
      type: 'digital',
      description: 'Wedding invitation cards - 100 copies, premium cardstock',
      status: 'ready',
      priority: 'normal',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      files: [
        {
          id: '4',
          name: 'wedding_invitation.pdf',
          type: 'application/pdf',
          size: 890000,
          url: '#'
        }
      ],
      instructions: 'Please use premium cardstock. Color should be vibrant.',
      services: ['Color Printing', 'Premium Paper'],
      pages: 1,
      copies: 100,
      paperType: 'Premium Cardstock',
      color: true
    },
    {
      id: 'PE123460',
      customerName: 'Arjun Singh',
      customerPhone: '+91 54321 09876',
      customerEmail: 'arjun.singh@email.com',
      type: 'digital',
      description: 'Thesis printing - 120 pages, double-sided, hardbound',
      status: 'completed',
      priority: 'normal',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      files: [
        {
          id: '5',
          name: 'thesis_final.pdf',
          type: 'application/pdf',
          size: 4200000,
          url: '#'
        }
      ],
      instructions: 'Double-sided printing. Hardbound with black cover.',
      services: ['Black & White Printing', 'Hardbound Binding'],
      pages: 120,
      copies: 3,
      paperType: 'A4 Standard',
      binding: 'Hardbound',
      color: false
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort orders - urgent first, then by creation date
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
    if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-golden-100 text-golden-800 border-golden-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-50 text-red-800 border-red-300' : 'bg-neutral-50 text-neutral-600 border-neutral-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Bell className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateOrderPriority = (orderId: string, newPriority: 'normal' | 'urgent') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, priority: newPriority } : order
    ));
  };

  const handlePrintOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Create a print-friendly version of the order
      const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Order Details - ${order.id}</h1>
          <h2>Customer: ${order.customerName}</h2>
          <p>Phone: ${order.customerPhone}</p>
          <p>Description: ${order.description}</p>
          <p>Status: ${order.status}</p>
          <p>Priority: ${order.priority}</p>
          ${order.instructions ? `<p>Instructions: ${order.instructions}</p>` : ''}
          <p>Services: ${order.services.join(', ')}</p>
          ${order.pages ? `<p>Pages: ${order.pages}</p>` : ''}
          ${order.copies ? `<p>Copies: ${order.copies}</p>` : ''}
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Analytics data (removed revenue)
  const todayOrders = orders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  }).length;

  const pendingOrders = orders.filter(order => 
    order.status === 'new' || order.status === 'confirmed' || order.status === 'processing'
  ).length;

  const urgentOrders = orders.filter(order => order.priority === 'urgent').length;
  const completedToday = orders.filter(order => 
    order.status === 'completed' && order.createdAt.toDateString() === new Date().toDateString()
  ).length;

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
                <span className="text-neutral-900 ml-2">Shop</span>
              </h1>
              <p className="text-neutral-600 font-medium">Manage your printing orders efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={logout}
                className="border-neutral-300 hover:bg-neutral-50 font-medium"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-lg">
            <TabsTrigger value="orders" className="font-medium">Order Queue</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">Analytics</TabsTrigger>
            <TabsTrigger value="services" className="font-medium">Services</TabsTrigger>
            <TabsTrigger value="profile" className="font-medium">Profile & QR</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Today's Orders</p>
                      <p className="text-3xl font-bold text-neutral-900">{todayOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-golden rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Pending</p>
                      <p className="text-3xl font-bold text-neutral-900">{pendingOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Urgent</p>
                      <p className="text-3xl font-bold text-neutral-900">{urgentOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Completed Today</p>
                      <p className="text-3xl font-bold text-neutral-900">{completedToday}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input
                      placeholder="Search orders, customers..."
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
                      className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500"
                    >
                      <option value="all">All Status</option>
                      <option value="new">New</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="urgent">Urgent</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Stack */}
            <div className="space-y-4">
              {sortedOrders.length === 0 ? (
                <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                  <CardContent className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-golden-soft rounded-full mx-auto mb-6 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-golden-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">No orders found</h3>
                    <p className="text-neutral-600">Orders will appear here when customers place them.</p>
                  </CardContent>
                </Card>
              ) : (
                sortedOrders.map((order, index) => (
                  <Card 
                    key={order.id} 
                    className={`border-2 shadow-medium bg-white/95 backdrop-blur-lg hover:shadow-premium transition-all duration-300 ${
                      order.priority === 'urgent' ? 'border-red-200 bg-red-50/20' : 'border-neutral-200'
                    } ${order.status === 'cancelled' ? 'opacity-75' : ''}`}
                    style={{ zIndex: sortedOrders.length - index }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <h3 className="font-bold text-neutral-900 text-lg">#{order.id}</h3>
                            <Badge className={`border-2 font-medium ${getStatusColor(order.status)}`}>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </Badge>
                            <Badge className={`border-2 font-medium ${getPriorityColor(order.priority)}`}>
                              {order.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              <span className="uppercase">{order.priority}</span>
                            </Badge>
                            <span className="text-sm text-neutral-500 font-medium">{formatTimeAgo(order.createdAt)}</span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-semibold text-neutral-900 mb-1">{order.customerName}</h4>
                            <p className="text-neutral-700 font-medium leading-relaxed">{order.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-neutral-500 font-medium">Contact:</span>
                              <p className="font-semibold text-neutral-900">{order.customerPhone}</p>
                            </div>
                            {order.pages && (
                              <div>
                                <span className="text-neutral-500 font-medium">Pages:</span>
                                <p className="font-semibold text-neutral-900">{order.pages}</p>
                              </div>
                            )}
                            {order.copies && (
                              <div>
                                <span className="text-neutral-500 font-medium">Copies:</span>
                                <p className="font-semibold text-neutral-900">{order.copies}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-neutral-500 font-medium">Type:</span>
                              <p className="font-semibold text-neutral-900 capitalize">{order.type}</p>
                            </div>
                          </div>

                          {order.instructions && (
                            <div className="mb-4 p-3 bg-golden-50 border border-golden-200 rounded-xl">
                              <h5 className="font-semibold text-golden-800 mb-1">Instructions:</h5>
                              <p className="text-golden-700 text-sm">{order.instructions}</p>
                            </div>
                          )}

                          {order.files && order.files.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-semibold text-neutral-900 mb-2">Files ({order.files.length}):</h5>
                              <div className="space-y-2">
                                {order.files.map((file) => (
                                  <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-5 h-5 text-neutral-600" />
                                      <div>
                                        <p className="font-medium text-neutral-900">{file.name}</p>
                                        <p className="text-sm text-neutral-500">{formatFileSize(file.size)}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {order.services.map((service) => (
                              <Badge key={service} variant="outline" className="border-neutral-300 text-neutral-700">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 min-w-[220px]">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${order.customerPhone}`)}
                              className="flex-1"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setChatOpen(true)}
                              className="flex-1"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintOrder(order.id)}
                              className="flex-1 bg-gradient-golden hover:shadow-golden text-white border-golden-300"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Priority Controls */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderPriority(order.id, order.priority === 'urgent' ? 'normal' : 'urgent')}
                              className={`flex-1 ${order.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-300' : 'border-neutral-300'}`}
                            >
                              {order.priority === 'urgent' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                              {order.priority === 'urgent' ? 'Normal' : 'Urgent'}
                            </Button>
                          </div>
                          
                          {/* Status Controls */}
                          <div className="space-y-2">
                            {order.status === 'new' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Confirm Order
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                >
                                  Cancel Order
                                </Button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                  Start Processing
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateOrderStatus(order.id, 'new')}
                                  className="w-full border-neutral-300"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Back to New
                                </Button>
                              </>
                            )}
                            {order.status === 'processing' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'ready')}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Mark Ready
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="w-full border-neutral-300"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Back to Confirmed
                                </Button>
                              </>
                            )}
                            {order.status === 'ready' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="w-full bg-gradient-golden hover:shadow-golden text-white"
                                >
                                  Complete Order
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  className="w-full border-neutral-300"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Back to Processing
                                </Button>
                              </>
                            )}
                            {order.status === 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, 'new')}
                                className="w-full border-green-300 text-green-700 hover:bg-green-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Restore Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-neutral-900">{orders.length}</p>
                      <p className="text-sm text-green-600 font-medium">+12% from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-golden rounded-2xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Customers</p>
                      <p className="text-3xl font-bold text-neutral-900">47</p>
                      <p className="text-sm text-green-600 font-medium">+5 new this week</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Avg. Rating</p>
                      <p className="text-3xl font-bold text-neutral-900">4.8</p>
                      <p className="text-sm text-green-600 font-medium">+0.2 from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-golden-100 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-golden-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Completion Rate</p>
                      <p className="text-3xl font-bold text-neutral-900">96%</p>
                      <p className="text-sm text-green-600 font-medium">+3% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Available Services</CardTitle>
                <CardDescription>Manage your printing services and equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-golden rounded-lg flex items-center justify-center">
                        <Printer className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">Color Printing</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">High-quality color printing for all document types</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-neutral-600 rounded-lg flex items-center justify-center">
                        <Copy className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">B&W Printing</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Fast and economical black & white printing</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Scan className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">Scanning</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">High-resolution document scanning</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">Binding</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Spiral, hardbound, and wire binding</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Image className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">Photo Printing</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Professional photo printing services</p>
                  </div>
                  
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-neutral-900">Design Services</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Custom design and layout services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile & QR Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shop Information */}
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-neutral-900">Shop Information</CardTitle>
                  <CardDescription>Manage your shop details and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Shop Name</label>
                      <Input defaultValue="Quick Print Solutions" className="border-neutral-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                      <Input defaultValue="+91 98765 43210" className="border-neutral-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                      <Input defaultValue="shop@printeasy.com" className="border-neutral-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Owner Name</label>
                      <Input defaultValue={user?.name || user?.email || 'Shop Owner'} className="border-neutral-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                      <Input defaultValue="Shop 12, MG Road, Bangalore, Karnataka 560001" className="border-neutral-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Opening Time</label>
                        <Input defaultValue="09:00" type="time" className="border-neutral-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Closing Time</label>
                        <Input defaultValue="18:00" type="time" className="border-neutral-200" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-8">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Section */}
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-neutral-900 flex items-center gap-2">
                    <QrCode className="w-6 h-6" />
                    Shop Upload QR Code
                  </CardTitle>
                  <CardDescription>Share this QR code for customers to upload files directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white border-2 border-neutral-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">Scan to upload files to this shop</p>
                    <p className="text-xs text-neutral-500 font-mono bg-neutral-100 px-3 py-2 rounded-lg break-all">
                      {uploadUrl}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Shop Slug</label>
                      <Input 
                        value={shopSlug} 
                        readOnly 
                        className="border-neutral-200 bg-neutral-50 font-mono text-sm" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigator.clipboard?.writeText(uploadUrl)}
                      >
                        Copy URL
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.print()}
                      >
                        Print QR
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat System */}
      <EnhancedChatSystem 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        userRole="shop_owner"
      />
    </div>
  );
};

export default ShopDashboard;
