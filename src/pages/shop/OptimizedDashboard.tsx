
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import UniversalHeader from '@/components/layout/UniversalHeader';
import MinimalOrderCard from '@/components/shop/MinimalOrderCard';
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
import { ShopOrder, ApiShopOrder } from '@/types/order';
import { convertShopOrderToApi } from '@/utils/orderUtils';

const OptimizedDashboard: React.FC = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<ApiShopOrder | null>(null);
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
        description: 'Business presentation slides - 50 pages, color printing, spiral binding',
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
        id: 'WI001',
        customerName: 'Amit Patel',
        customerPhone: '7654321098',
        customerEmail: 'amit@email.com',
        orderType: 'walk-in',
        status: 'received',
        isUrgent: false,
        description: 'College textbook scanning - 200 pages',
        createdAt: new Date(Date.now() - 60 * 60000),
        services: ['Scanning'],
        pages: 200
      }
    ];
    setOrders(mockOrders);
  }, []);

  // Filter and search logic
  const filteredOrders = (orderList: ShopOrder[]) => 
    orderList.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    );

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

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const stats = {
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    urgentOrders: orders.filter(o => o.isUrgent && o.status !== 'completed').length,
  };

  const handleRefresh = () => {
    toast.success('Dashboard refreshed');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <UniversalHeader 
        title="Shop Dashboard" 
        subtitle="Manage your orders efficiently"
        onRefresh={handleRefresh}
      />
      
      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Mobile Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg font-semibold text-neutral-900 sm:hidden">Order Management</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
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
                    <p className="text-xs sm:text-sm text-neutral-600">Total Orders</p>
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
                    <p className="text-xs sm:text-sm text-neutral-600">Active Orders</p>
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
                    <p className="text-xs sm:text-sm text-neutral-600">Urgent Orders</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredOrders(activeOrders).map(order => (
                  <MinimalOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredOrders(completedOrders).map(order => (
                  <MinimalOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetails={handleViewDetails}
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
                    <div className="bg-neutral-100 h-32 sm:h-48 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 sm:w-24 sm:h-24 text-neutral-400" />
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
                    <p className="text-sm text-neutral-600">Direct link to your shop's upload page</p>
                    <div className="bg-neutral-50 p-2 sm:p-3 rounded border text-xs sm:text-sm font-mono break-all">
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

export default OptimizedDashboard;
