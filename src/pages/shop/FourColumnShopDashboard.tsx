import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import UniversalHeader from '@/components/layout/UniversalHeader';
import CompactOrderCard from '@/components/shop/CompactOrderCard';
import OrderDetailsModal from '@/components/shop/OrderDetailsModal';
import OrderChatModal from '@/components/shop/OrderChatModal';
import QRCodeModal from '@/components/shop/QRCodeModal';
import { 
  Upload, 
  UserCheck, 
  Search, 
  Clock,
  Package,
  CheckCircle,
  Users,
  FileText,
  QrCode,
  ExternalLink,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { ShopOrder } from '@/types/order';

const FourColumnShopDashboard: React.FC = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [chatOrderId, setChatOrderId] = useState('');
  const [chatCustomerName, setChatCustomerName] = useState('');
  const [chatCustomerPhone, setChatCustomerPhone] = useState('');

  // Mock data with simplified statuses
  useEffect(() => {
    const mockOrders: ShopOrder[] = [
      {
        id: 'UF001',
        customerName: 'Rajesh Kumar',
        customerPhone: '9876543210',
        customerEmail: 'rajesh@email.com',
        orderType: 'uploaded-files',
        status: 'started',
        isUrgent: true,
        description: 'Business presentation slides - 50 pages, color printing, spiral binding. Need high quality output for important client meeting.',
        createdAt: new Date(Date.now() - 120 * 60000),
        files: [{ id: '1', name: 'presentation.pdf', type: 'application/pdf', size: 2048000, url: '#' }],
        services: ['Color Printing', 'Spiral Binding'],
        pages: 50,
        copies: 1,
        color: true
      },
      {
        id: 'UF002',
        customerName: 'Priya Sharma',
        customerPhone: '8765432109',
        customerEmail: 'priya@email.com',
        orderType: 'uploaded-files',
        status: 'received',
        isUrgent: true,
        description: 'Resume printing - 10 copies, premium paper',
        createdAt: new Date(Date.now() - 90 * 60000),
        files: [{ id: '2', name: 'resume.pdf', type: 'application/pdf', size: 1024000, url: '#' }],
        services: ['Black & White Printing'],
        pages: 2,
        copies: 10,
        color: false
      },
      {
        id: 'UF003',
        customerName: 'Arun Mehta',
        customerPhone: '9123456789',
        customerEmail: 'arun@email.com',
        orderType: 'uploaded-files',
        status: 'completed',
        isUrgent: false,
        description: 'Legal documents - 25 pages, black & white, double-sided',
        createdAt: new Date(Date.now() - 240 * 60000),
        files: [{ id: '3', name: 'legal-docs.pdf', type: 'application/pdf', size: 3072000, url: '#' }],
        services: ['Black & White Printing'],
        pages: 25,
        copies: 1,
        color: false
      },
      {
        id: 'UF004',
        customerName: 'Kavya Patel',
        customerPhone: '8912345678',
        customerEmail: 'kavya@email.com',
        orderType: 'uploaded-files',
        status: 'received',
        isUrgent: false,
        description: 'College assignments - 15 pages, color diagrams',
        createdAt: new Date(Date.now() - 30 * 60000),
        files: [{ id: '4', name: 'assignment.docx', type: 'application/docx', size: 1536000, url: '#' }],
        services: ['Color Printing'],
        pages: 15,
        copies: 1,
        color: true
      },
      {
        id: 'WI001',
        customerName: 'Amit Patel',
        customerPhone: '7654321098',
        customerEmail: 'amit@email.com',
        orderType: 'walk-in',
        status: 'received',
        isUrgent: false,
        description: 'College textbook scanning - 200 pages. Student needs digital copy for online classes.',
        createdAt: new Date(Date.now() - 60 * 60000),
        services: ['Scanning'],
        pages: 200
      },
      {
        id: 'WI002',
        customerName: 'Sneha Reddy',
        customerPhone: '6543210987',
        customerEmail: 'sneha@email.com',
        orderType: 'walk-in',
        status: 'started',
        isUrgent: false,
        description: 'Wedding invitation cards - 100 copies, premium cardstock with gold foil finishing',
        createdAt: new Date(Date.now() - 30 * 60000),
        services: ['Color Printing', 'Premium Paper'],
        pages: 1,
        copies: 100,
        color: true
      },
      {
        id: 'WI003',
        customerName: 'Ravi Singh',
        customerPhone: '5432109876',
        customerEmail: 'ravi@email.com',
        orderType: 'walk-in',
        status: 'completed',
        isUrgent: true,
        description: 'ID photos - passport size, 10 copies',
        createdAt: new Date(Date.now() - 180 * 60000),
        services: ['Photo Printing'],
        pages: 1,
        copies: 10
      },
      {
        id: 'WI004',
        customerName: 'Meera Joshi',
        customerPhone: '4321098765',
        customerEmail: 'meera@email.com',
        orderType: 'walk-in',
        status: 'received',
        isUrgent: true,
        description: 'Business cards - 500 copies, premium finish',
        createdAt: new Date(Date.now() - 45 * 60000),
        services: ['Color Printing', 'Premium Paper'],
        pages: 1,
        copies: 500,
        color: true
      }
    ];
    setOrders(mockOrders);
  }, []);

  // Filter orders by type and status
  const uploadOrders = orders.filter(order => order.orderType === 'uploaded-files');
  const walkInOrders = orders.filter(order => order.orderType === 'walk-in');
  
  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const filteredOrders = (orderList: ShopOrder[]) => 
    orderList.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Oldest first

  // Split orders into columns for true 4-column layout
  const getColumnOrders = (orderList: ShopOrder[], totalColumns: number, columnIndex: number) => {
    const ordersPerColumn = Math.ceil(orderList.length / totalColumns);
    const startIndex = columnIndex * ordersPerColumn;
    const endIndex = Math.min(startIndex + ordersPerColumn, orderList.length);
    return orderList.slice(startIndex, endIndex);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
    toast.success(`Calling ${phone}`);
  };

  const handleChat = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setChatOrderId(orderId);
      setChatCustomerName(order.customerName);
      setChatCustomerPhone(order.customerPhone);
      setIsChatModalOpen(true);
    }
  };

  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsDetailsModalOpen(true);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: ShopOrder['status']) => {
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
    const order = orders.find(o => o.id === orderId);
    toast.success(`Order ${orderId} ${order?.isUrgent ? 'unmarked' : 'marked'} as urgent`);
  };

  const stats = {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    urgentOrders: orders.filter(o => o.isUrgent && o.status !== 'completed').length,
  };

  const handleRefresh = () => {
    toast.success('Dashboard refreshed');
    // Refetch data logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UniversalHeader 
        title="Shop Dashboard" 
        subtitle="Manage your orders efficiently"
        onRefresh={handleRefresh}
      />
      
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Mobile Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg font-semibold text-gray-900 sm:hidden">Order Management</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Active Orders</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.activeOrders}</p>
                  </div>
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Urgent Orders</p>
                    <p className="text-lg sm:text-xl font-bold">{stats.urgentOrders}</p>
                  </div>
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">
                Orders ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm py-2">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="qr-upload" className="text-xs sm:text-sm py-2">
                QR & Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              {/* TRUE 4-COLUMN LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Column 1: Upload Orders - Received & Started (Part 1) */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Upload Orders (1)</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getColumnOrders(filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))), 2, 0).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {getColumnOrders(filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))), 2, 0).map(order => (
                      <CompactOrderCard
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

                {/* Column 2: Upload Orders - Received & Started (Part 2) */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Upload Orders (2)</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getColumnOrders(filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))), 2, 1).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {getColumnOrders(filteredOrders(uploadOrders.filter(o => activeOrders.includes(o))), 2, 1).map(order => (
                      <CompactOrderCard
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

                {/* Column 3: Walk-in Orders - Received & Started (Part 1) */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Walk-in Orders (1)</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getColumnOrders(filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))), 2, 0).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {getColumnOrders(filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))), 2, 0).map(order => (
                      <CompactOrderCard
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

                {/* Column 4: Walk-in Orders - Received & Started (Part 2) */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Walk-in Orders (2)</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getColumnOrders(filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))), 2, 1).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {getColumnOrders(filteredOrders(walkInOrders.filter(o => activeOrders.includes(o))), 2, 1).map(order => (
                      <CompactOrderCard
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
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredOrders(completedOrders).map(order => (
                  <CompactOrderCard
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

            <TabsContent value="qr-upload">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                      <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Shop QR Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <div className="bg-gray-100 h-32 sm:h-48 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
                    </div>
                    <Button 
                      onClick={() => setIsQRModalOpen(true)}
                      className="w-full bg-golden-500 hover:bg-golden-600 text-white"
                    >
                      View & Download QR Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Upload Page</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <p className="text-sm text-gray-600">Direct link to your shop's upload page</p>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded border text-xs sm:text-sm font-mono break-all">
                      https://printeasy.com/shop/quick-print-solutions/upload
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigator.clipboard.writeText('https://printeasy.com/shop/quick-print-solutions/upload');
                          toast.success('Upload link copied to clipboard');
                        }}
                      >
                        Copy Link
                      </Button>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => window.open('/customer/order/quick-print-solutions', '_blank')}
                      >
                        Open Upload Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <OrderChatModal
        orderId={chatOrderId}
        customerName={chatCustomerName}
        customerPhone={chatCustomerPhone}
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shopName="Quick Print Solutions"
      />
    </div>
  );
};

export default FourColumnShopDashboard;
