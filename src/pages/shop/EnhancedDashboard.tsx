
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  UserCheck, 
  RefreshCw,
  Search,
  Clock,
  CheckCircle
} from 'lucide-react';
import MinimalOrderCard from '@/components/shop/MinimalOrderCard';
import DashboardStats from '@/components/shop/DashboardStats';
import OrderDetailsModal from '@/components/shop/OrderDetailsModal';

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

const EnhancedDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  // Enhanced demo orders
  const [orders, setOrders] = useState<ShopOrder[]>([
    {
      id: 'UF001',
      customerName: 'Rajesh Kumar',
      customerPhone: '9876543210',
      customerEmail: 'rajesh.kumar@email.com',
      orderType: 'uploaded-files',
      description: 'Business presentation slides - 50 pages, color printing, spiral binding',
      status: 'processing',
      isUrgent: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      files: [{ id: '1', name: 'presentation_slides.pdf', type: 'application/pdf', size: 2560000, url: '#' }],
      services: ['Color Printing', 'Spiral Binding'],
      pages: 50,
      copies: 1,
      color: true
    },
    {
      id: 'UF002',
      customerName: 'Priya Sharma',
      customerPhone: '8765432109',
      customerEmail: 'priya.sharma@email.com',
      orderType: 'uploaded-files',
      description: 'Resume printing - 10 copies, premium paper',
      status: 'new',
      isUrgent: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      files: [{ id: '2', name: 'resume_final.pdf', type: 'application/pdf', size: 156000, url: '#' }],
      services: ['Black & White Printing'],
      pages: 2,
      copies: 10,
      color: false
    },
    {
      id: 'UF003',
      customerName: 'Arjun Singh',
      customerPhone: '5432109876',
      customerEmail: 'arjun.singh@email.com',
      orderType: 'uploaded-files',
      description: 'Thesis printing - 120 pages, double-sided, hardbound',
      status: 'completed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      files: [{ id: '3', name: 'thesis_final.pdf', type: 'application/pdf', size: 4200000, url: '#' }],
      services: ['Black & White Printing', 'Hardbound Binding'],
      pages: 120,
      copies: 3,
      color: false
    },
    {
      id: 'WI001',
      customerName: 'Amit Patel',
      customerPhone: '7654321098',
      customerEmail: 'amit.patel@email.com',
      orderType: 'walk-in',
      description: 'College textbook scanning - 200 pages',
      status: 'confirmed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      services: ['Scanning'],
      pages: 200
    },
    {
      id: 'WI002',
      customerName: 'Sneha Reddy',
      customerPhone: '6543210987',
      customerEmail: 'sneha.reddy@email.com',
      orderType: 'walk-in',
      description: 'Wedding invitation cards - 100 copies, premium cardstock',
      status: 'processing',
      isUrgent: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      services: ['Color Printing', 'Premium Paper'],
      pages: 1,
      copies: 100,
      color: true
    },
    {
      id: 'WI003',
      customerName: 'Vikram Joshi',
      customerPhone: '4321098765',
      customerEmail: 'vikram.joshi@email.com',
      orderType: 'walk-in',
      description: 'Office documents photocopying - 50 pages',
      status: 'cancelled',
      isUrgent: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      services: ['Photocopying'],
      pages: 50,
      copies: 5
    }
  ]);

  // Filter orders based on search query and active tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesTab = activeTab === 'active' 
      ? ['new', 'confirmed', 'processing', 'ready'].includes(order.status)
      : ['completed', 'cancelled'].includes(order.status);

    return matchesSearch && matchesTab;
  });

  // Separate orders by type and sort
  const sortOrdersByUrgencyAndTime = (ordersList: ShopOrder[]) => {
    return ordersList.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const uploadedFilesOrders = sortOrdersByUrgencyAndTime(
    filteredOrders.filter(order => order.orderType === 'uploaded-files')
  );
  const walkInOrders = sortOrdersByUrgencyAndTime(
    filteredOrders.filter(order => order.orderType === 'walk-in')
  );

  const updateOrderStatus = useCallback((orderId: string, newStatus: ShopOrder['status']) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setLastUpdated(new Date());
  }, []);

  const handleViewDetails = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order || null);
  }, [orders]);

  // Calculate stats for active orders only
  const activeOrders = orders.filter(order => 
    ['new', 'confirmed', 'processing', 'ready'].includes(order.status)
  );
  
  const todayOrders = activeOrders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  }).length;

  const urgentOrders = activeOrders.filter(order => order.isUrgent).length;
  const pendingOrders = activeOrders.filter(order => 
    ['new', 'confirmed', 'processing'].includes(order.status)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-cream-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Print<span className="text-golden-600">Easy</span> Dashboard
                </h1>
                <p className="text-sm text-neutral-600">24/7 Shop Management</p>
              </div>
              <div className="text-xs text-neutral-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastUpdated(new Date())}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={logout}
                className="text-sm font-medium"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Quick Stats */}
        <DashboardStats 
          todayOrders={todayOrders}
          urgentOrders={urgentOrders}
          pendingOrders={pendingOrders}
          totalOrders={activeOrders.length}
        />

        {/* Search */}
        <Card className="border-2 border-neutral-200 shadow-md bg-white mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search orders by customer name, order ID, or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-400 rounded-xl bg-white shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed & Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {/* 4-Column Layout for Active Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Side - Uploaded Files (2 columns) */}
              <Card className="border-2 border-blue-200 shadow-lg bg-white">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900">Uploaded Files</h2>
                        <p className="text-sm text-neutral-600">{uploadedFilesOrders.length} orders</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 shadow-sm">
                      {uploadedFilesOrders.filter(o => o.isUrgent).length} Urgent
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  {uploadedFilesOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Upload className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                      <p className="text-neutral-500">No uploaded file orders</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                      {uploadedFilesOrders.map((order) => (
                        <MinimalOrderCard
                          key={order.id}
                          order={order}
                          onUpdateStatus={updateOrderStatus}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Right Side - Walk-in Orders (2 columns) */}
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
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300 shadow-sm">
                      {walkInOrders.filter(o => o.isUrgent).length} Urgent
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  {walkInOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCheck className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                      <p className="text-neutral-500">No walk-in orders</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                      {walkInOrders.map((order) => (
                        <MinimalOrderCard
                          key={order.id}
                          order={order}
                          onUpdateStatus={updateOrderStatus}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            {/* Completed/Cancelled Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrders.map((order) => (
                <MinimalOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-neutral-500">No completed or cancelled orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default EnhancedDashboard;
