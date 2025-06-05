
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
  Upload,
  UserCheck,
  Zap
} from 'lucide-react';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: 'walk-in' | 'uploaded-files';
  description: string;
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  isUrgent: boolean;
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
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Shop QR Code and Upload URL
  const shopSlug = 'quick-print-solutions';
  const uploadUrl = `https://app.printeasy.com/upload/${shopSlug}`;

  // Enhanced demo orders with clear bifurcation
  const [orders, setOrders] = useState<ShopOrder[]>([
    // UPLOADED FILES ORDERS
    {
      id: 'UF123456',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rajesh.kumar@email.com',
      orderType: 'uploaded-files',
      description: 'Business presentation slides - 50 pages, color printing, spiral binding',
      status: 'processing',
      isUrgent: true,
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
      id: 'UF123457',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerEmail: 'priya.sharma@email.com',
      orderType: 'uploaded-files',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'new',
      isUrgent: true,
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
      id: 'UF123460',
      customerName: 'Arjun Singh',
      customerPhone: '+91 54321 09876',
      customerEmail: 'arjun.singh@email.com',
      orderType: 'uploaded-files',
      description: 'Thesis printing - 120 pages, double-sided, hardbound',
      status: 'completed',
      isUrgent: false,
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
    },
    // WALK-IN ORDERS
    {
      id: 'WI123458',
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      customerEmail: 'amit.patel@email.com',
      orderType: 'walk-in',
      description: 'College textbook scanning - 200 pages',
      status: 'confirmed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      services: ['Scanning'],
      pages: 200,
      instructions: 'Please scan in high resolution PDF format.'
    },
    {
      id: 'WI123459',
      customerName: 'Sneha Reddy',
      customerPhone: '+91 65432 10987',
      customerEmail: 'sneha.reddy@email.com',
      orderType: 'walk-in',
      description: 'Wedding invitation cards - 100 copies, premium cardstock',
      status: 'ready',
      isUrgent: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      instructions: 'Please use premium cardstock. Color should be vibrant.',
      services: ['Color Printing', 'Premium Paper'],
      pages: 1,
      copies: 100,
      paperType: 'Premium Cardstock',
      color: true
    },
    {
      id: 'WI123461',
      customerName: 'Vikram Joshi',
      customerPhone: '+91 43210 98765',
      customerEmail: 'vikram.joshi@email.com',
      orderType: 'walk-in',
      description: 'Office documents photocopying - 50 pages',
      status: 'processing',
      isUrgent: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      services: ['Photocopying'],
      pages: 50,
      copies: 5,
      instructions: 'Urgent - needed for meeting in 2 hours'
    }
  ]);

  // Filter and separate orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
    const matchesUrgent = !urgentOnly || order.isUrgent;
    return matchesSearch && matchesStatus && matchesOrderType && matchesUrgent;
  });

  // Separate orders by type
  const uploadedFilesOrders = filteredOrders.filter(order => order.orderType === 'uploaded-files');
  const walkInOrders = filteredOrders.filter(order => order.orderType === 'walk-in');

  // Sort orders - urgent first, then by creation date
  const sortOrders = (ordersList: ShopOrder[]) => {
    return ordersList.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const sortedUploadedFiles = sortOrders(uploadedFilesOrders);
  const sortedWalkIns = sortOrders(walkInOrders);

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

  const toggleOrderUrgency = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, isUrgent: !order.isUrgent } : order
    ));
  };

  const handlePrintFile = (file: { name: string; url: string; type: string }) => {
    // Create a printable version of the file
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print: ${file.name}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .print-header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
              .file-info { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>File: ${file.name}</h1>
              <p>Type: ${file.type}</p>
              <p>Print Time: ${new Date().toLocaleString()}</p>
            </div>
            <div class="file-info">
              <p><strong>File Name:</strong> ${file.name}</p>
              <p><strong>File Type:</strong> ${file.type}</p>
              <p><strong>Print Instructions:</strong> Please load appropriate paper and select correct print settings.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
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

  // Analytics data (no revenue)
  const todayOrders = orders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  }).length;

  const pendingOrders = orders.filter(order => 
    order.status === 'new' || order.status === 'confirmed' || order.status === 'processing'
  ).length;

  const urgentOrders = orders.filter(order => order.isUrgent).length;
  const completedToday = orders.filter(order => 
    order.status === 'completed' && order.createdAt.toDateString() === new Date().toDateString()
  ).length;

  const uploadedFilesCount = orders.filter(order => order.orderType === 'uploaded-files').length;
  const walkInCount = orders.filter(order => order.orderType === 'walk-in').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 font-poppins">
      {/* Header - Desktop Optimized */}
      <div className="bg-white/90 backdrop-blur-lg shadow-glass border-b border-golden-200/30">
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-neutral-900">Print</span>
                <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
                <span className="text-neutral-900 ml-2">Shop Dashboard</span>
              </h1>
              <p className="text-neutral-600 font-medium text-lg">Manage your printing orders efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={logout}
                className="border-neutral-300 hover:bg-neutral-50 font-medium px-6 py-3 text-lg"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-8">
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-lg h-14">
            <TabsTrigger value="orders" className="font-medium text-lg">Order Queue</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium text-lg">Analytics</TabsTrigger>
            <TabsTrigger value="services" className="font-medium text-lg">Services</TabsTrigger>
            <TabsTrigger value="profile" className="font-medium text-lg">Profile & QR</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8">
            {/* Enhanced Stats with Order Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
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
                      <Zap className="w-6 h-6 text-red-600" />
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

              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Uploaded Files</p>
                      <p className="text-3xl font-bold text-neutral-900">{uploadedFilesCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Walk-ins</p>
                      <p className="text-3xl font-bold text-neutral-900">{walkInCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Filters */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
                    <Input
                      placeholder="Search orders, customers, order IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 h-14 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium text-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Filter className="w-6 h-6 text-neutral-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2 border-neutral-200 rounded-xl px-4 py-4 font-medium focus:border-golden-500 text-lg min-w-[140px]"
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
                      value={orderTypeFilter}
                      onChange={(e) => setOrderTypeFilter(e.target.value)}
                      className="border-2 border-neutral-200 rounded-xl px-4 py-4 font-medium focus:border-golden-500 text-lg min-w-[160px]"
                    >
                      <option value="all">All Types</option>
                      <option value="uploaded-files">Uploaded Files</option>
                      <option value="walk-in">Walk-in Orders</option>
                    </select>
                    <Button
                      variant={urgentOnly ? "default" : "outline"}
                      onClick={() => setUrgentOnly(!urgentOnly)}
                      className={`px-6 py-4 text-lg ${urgentOnly ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Urgent Only
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BIFURCATED ORDER SECTIONS */}
            <div className="space-y-8">
              {/* UPLOADED FILES SECTION */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">Uploaded Files Orders</h2>
                      <p className="text-neutral-600">Orders with customer-uploaded files - {sortedUploadedFiles.length} orders</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-lg px-4 py-2">
                    {sortedUploadedFiles.filter(o => o.isUrgent).length} Urgent
                  </Badge>
                </div>

                <div className="space-y-4">
                  {sortedUploadedFiles.length === 0 ? (
                    <Card className="border-0 shadow-glass bg-blue-50/30 backdrop-blur-lg">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">No uploaded file orders</h3>
                        <p className="text-neutral-600">File upload orders will appear here when customers submit them.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    sortedUploadedFiles.map((order) => (
                      <Card 
                        key={order.id} 
                        className={`border-2 shadow-medium bg-white/95 backdrop-blur-lg hover:shadow-premium transition-all duration-300 ${
                          order.isUrgent ? 'border-red-300 bg-red-50/30' : 'border-blue-200 bg-blue-50/10'
                        } ${order.status === 'cancelled' ? 'opacity-75' : ''}`}
                      >
                        <CardContent className="p-8">
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-6 flex-wrap">
                                <h3 className="font-bold text-neutral-900 text-xl">#{order.id}</h3>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-sm px-3 py-1">
                                  <Upload className="w-4 h-4 mr-2" />
                                  UPLOADED FILES
                                </Badge>
                                <Badge className={`border-2 font-medium text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status === 'ready' ? 'Ready' : order.status}</span>
                                  </div>
                                </Badge>
                                {order.isUrgent && (
                                  <Badge className="bg-red-100 text-red-800 border-red-300 font-medium text-sm px-3 py-1">
                                    <Zap className="w-4 h-4 mr-1" />
                                    URGENT
                                  </Badge>
                                )}
                                <span className="text-sm text-neutral-500 font-medium">{formatTimeAgo(order.createdAt)}</span>
                              </div>
                              
                              <div className="mb-6">
                                <h4 className="font-semibold text-neutral-900 mb-2 text-lg">{order.customerName}</h4>
                                <p className="text-neutral-700 font-medium leading-relaxed text-lg">{order.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
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
                                  <span className="text-neutral-500 font-medium">Files:</span>
                                  <p className="font-semibold text-neutral-900">{order.files?.length || 0}</p>
                                </div>
                              </div>

                              {order.instructions && (
                                <div className="mb-6 p-4 bg-golden-50 border border-golden-200 rounded-xl">
                                  <h5 className="font-semibold text-golden-800 mb-2">Instructions:</h5>
                                  <p className="text-golden-700">{order.instructions}</p>
                                </div>
                              )}

                              {/* FILES WITH DIRECT PRINT BUTTONS */}
                              {order.files && order.files.length > 0 && (
                                <div className="mb-6">
                                  <h5 className="font-semibold text-neutral-900 mb-4 text-lg">Files ({order.files.length}):</h5>
                                  <div className="space-y-3">
                                    {order.files.map((file) => (
                                      <div key={file.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                        <div className="flex items-center gap-4">
                                          <FileText className="w-6 h-6 text-neutral-600" />
                                          <div>
                                            <p className="font-medium text-neutral-900 text-lg">{file.name}</p>
                                            <p className="text-sm text-neutral-500">{formatFileSize(file.size)}</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="px-4 py-2"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="px-4 py-2"
                                          >
                                            <Download className="w-4 h-4" />
                                          </Button>
                                          <Button 
                                            size="sm"
                                            onClick={() => handlePrintFile(file)}
                                            className="bg-gradient-golden hover:shadow-golden text-white px-4 py-2"
                                          >
                                            <Printer className="w-4 h-4 mr-2" />
                                            Print
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

                            {/* Actions - Desktop Optimized */}
                            <div className="flex flex-col gap-4 min-w-[280px]">
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`tel:${order.customerPhone}`)}
                                  className="flex-1 px-4 py-3"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setChatOpen(true)}
                                  className="flex-1 px-4 py-3"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Chat
                                </Button>
                              </div>
                              
                              {/* Urgency Toggle */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleOrderUrgency(order.id)}
                                className={`${order.isUrgent ? 'bg-red-100 text-red-700 border-red-300' : 'border-neutral-300'} px-4 py-3`}
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                {order.isUrgent ? 'Remove Urgent' : 'Mark Urgent'}
                              </Button>
                              
                              {/* Status Controls */}
                              <div className="space-y-2">
                                {order.status === 'new' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                    >
                                      Confirm Order
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      className="w-full border-red-300 text-red-700 hover:bg-red-50 py-3"
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
                                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                                    >
                                      Start Processing
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'new')}
                                      className="w-full border-neutral-300 py-3"
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
                                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                                    >
                                      Mark Ready
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                      className="w-full border-neutral-300 py-3"
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
                                      className="w-full bg-gradient-golden hover:shadow-golden text-white py-3"
                                    >
                                      Complete Order
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'processing')}
                                      className="w-full border-neutral-300 py-3"
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
                                    className="w-full border-green-300 text-green-700 hover:bg-green-50 py-3"
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
              </div>

              {/* WALK-IN ORDERS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900">Walk-in Orders</h2>
                      <p className="text-neutral-600">Physical orders from customers at the shop - {sortedWalkIns.length} orders</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-lg px-4 py-2">
                    {sortedWalkIns.filter(o => o.isUrgent).length} Urgent
                  </Badge>
                </div>

                <div className="space-y-4">
                  {sortedWalkIns.length === 0 ? (
                    <Card className="border-0 shadow-glass bg-purple-50/30 backdrop-blur-lg">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <UserCheck className="w-10 h-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">No walk-in orders</h3>
                        <p className="text-neutral-600">Walk-in orders from customers visiting the shop will appear here.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    sortedWalkIns.map((order) => (
                      <Card 
                        key={order.id} 
                        className={`border-2 shadow-medium bg-white/95 backdrop-blur-lg hover:shadow-premium transition-all duration-300 ${
                          order.isUrgent ? 'border-red-300 bg-red-50/30' : 'border-purple-200 bg-purple-50/10'
                        } ${order.status === 'cancelled' ? 'opacity-75' : ''}`}
                      >
                        <CardContent className="p-8">
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-6 flex-wrap">
                                <h3 className="font-bold text-neutral-900 text-xl">#{order.id}</h3>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-sm px-3 py-1">
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  WALK-IN
                                </Badge>
                                <Badge className={`border-2 font-medium text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status === 'ready' ? 'Ready' : order.status}</span>
                                  </div>
                                </Badge>
                                {order.isUrgent && (
                                  <Badge className="bg-red-100 text-red-800 border-red-300 font-medium text-sm px-3 py-1">
                                    <Zap className="w-4 h-4 mr-1" />
                                    URGENT
                                  </Badge>
                                )}
                                <span className="text-sm text-neutral-500 font-medium">{formatTimeAgo(order.createdAt)}</span>
                              </div>
                              
                              <div className="mb-6">
                                <h4 className="font-semibold text-neutral-900 mb-2 text-lg">{order.customerName}</h4>
                                <p className="text-neutral-700 font-medium leading-relaxed text-lg">{order.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
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
                                  <p className="font-semibold text-neutral-900">Physical Service</p>
                                </div>
                              </div>

                              {order.instructions && (
                                <div className="mb-6 p-4 bg-golden-50 border border-golden-200 rounded-xl">
                                  <h5 className="font-semibold text-golden-800 mb-2">Instructions:</h5>
                                  <p className="text-golden-700">{order.instructions}</p>
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

                            {/* Actions - Same as uploaded files */}
                            <div className="flex flex-col gap-4 min-w-[280px]">
                              <div className="flex gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`tel:${order.customerPhone}`)}
                                  className="flex-1 px-4 py-3"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setChatOpen(true)}
                                  className="flex-1 px-4 py-3"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Chat
                                </Button>
                              </div>
                              
                              {/* Urgency Toggle */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleOrderUrgency(order.id)}
                                className={`${order.isUrgent ? 'bg-red-100 text-red-700 border-red-300' : 'border-neutral-300'} px-4 py-3`}
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                {order.isUrgent ? 'Remove Urgent' : 'Mark Urgent'}
                              </Button>
                              
                              {/* Same status controls as uploaded files */}
                              <div className="space-y-2">
                                {order.status === 'new' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                    >
                                      Confirm Order
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      className="w-full border-red-300 text-red-700 hover:bg-red-50 py-3"
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
                                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                                    >
                                      Start Processing
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'new')}
                                      className="w-full border-neutral-300 py-3"
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
                                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                                    >
                                      Mark Ready
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                      className="w-full border-neutral-300 py-3"
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
                                      className="w-full bg-gradient-golden hover:shadow-golden text-white py-3"
                                    >
                                      Complete Order
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateOrderStatus(order.id, 'processing')}
                                      className="w-full border-neutral-300 py-3"
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
                                    className="w-full border-green-300 text-green-700 hover:bg-green-50 py-3"
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
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab - No Revenue */}
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

          {/* Services Tab - No Pricing */}
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

          {/* Profile & QR Tab - Enhanced */}
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
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Upload Slug</label>
                      <Input defaultValue={shopSlug} readOnly className="border-neutral-200 bg-neutral-50 font-mono" />
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

              {/* Enhanced QR Code Section */}
              <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-neutral-900 flex items-center gap-2">
                    <QrCode className="w-6 h-6" />
                    Shop Upload QR Code
                  </CardTitle>
                  <CardDescription>Share this QR code for customers to upload files directly to your shop</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="w-56 h-56 bg-white border-4 border-neutral-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <QrCode className="w-40 h-40 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-4 font-medium">
                      Customers can scan this QR code to upload files directly to your shop queue
                    </p>
                    <div className="bg-neutral-100 rounded-xl p-4 mb-4">
                      <p className="text-xs text-neutral-500 font-mono break-all">
                        {uploadUrl}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
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
                    <Button 
                      className="w-full bg-gradient-golden hover:shadow-golden text-white"
                      onClick={() => window.open(uploadUrl, '_blank')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Test Upload Page
                    </Button>
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
