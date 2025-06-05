
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  UserCheck, 
  RefreshCw,
  Search
} from 'lucide-react';
import ImprovedOrderCard from '@/components/shop/ImprovedOrderCard';
import DashboardStats from '@/components/shop/DashboardStats';
import UniversalSearch from '@/components/shop/UniversalSearch';
import OrderDetailsModal from '@/components/shop/OrderDetailsModal';
import OrderChat from '@/components/shop/OrderChat';

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

const ModernDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced demo orders
  const [orders, setOrders] = useState<ShopOrder[]>([
    {
      id: 'UF001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
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
      customerPhone: '+91 87654 32109',
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
      customerPhone: '+91 54321 09876',
      customerEmail: 'arjun.singh@email.com',
      orderType: 'uploaded-files',
      description: 'Thesis printing - 120 pages, double-sided, hardbound',
      status: 'ready',
      isUrgent: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      files: [{ id: '3', name: 'thesis_final.pdf', type: 'application/pdf', size: 4200000, url: '#' }],
      services: ['Black & White Printing', 'Hardbound Binding'],
      pages: 120,
      copies: 3,
      color: false
    },
    {
      id: 'UF004',
      customerName: 'Meera Patel',
      customerPhone: '+91 12345 67890',
      customerEmail: 'meera.patel@email.com',
      orderType: 'uploaded-files',
      description: 'Project report - 80 pages, color charts',
      status: 'confirmed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      files: [{ id: '4', name: 'project_report.pdf', type: 'application/pdf', size: 3200000, url: '#' }],
      services: ['Color Printing', 'Spiral Binding'],
      pages: 80,
      copies: 1,
      color: true
    },
    {
      id: 'UF005',
      customerName: 'Vikram Reddy',
      customerPhone: '+91 11111 22222',
      customerEmail: 'vikram.reddy@email.com',
      orderType: 'uploaded-files',
      description: 'Legal documents - 25 pages, official letterhead',
      status: 'new',
      isUrgent: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      files: [{ id: '5', name: 'legal_docs.pdf', type: 'application/pdf', size: 890000, url: '#' }],
      services: ['Black & White Printing'],
      pages: 25,
      copies: 5,
      color: false
    },
    {
      id: 'UF006',
      customerName: 'Anita Desai',
      customerPhone: '+91 33333 44444',
      customerEmail: 'anita.desai@email.com',
      orderType: 'uploaded-files',
      description: 'Wedding invitations - 200 copies, premium cardstock',
      status: 'processing',
      isUrgent: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      files: [{ id: '6', name: 'wedding_invite.pdf', type: 'application/pdf', size: 1200000, url: '#' }],
      services: ['Color Printing', 'Premium Paper'],
      pages: 2,
      copies: 200,
      color: true
    },
    // WALK-IN ORDERS
    {
      id: 'WI001',
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
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
      customerPhone: '+91 65432 10987',
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
      customerPhone: '+91 43210 98765',
      customerEmail: 'vikram.joshi@email.com',
      orderType: 'walk-in',
      description: 'Office documents photocopying - 50 pages',
      status: 'new',
      isUrgent: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      services: ['Photocopying'],
      pages: 50,
      copies: 5
    },
    {
      id: 'WI004',
      customerName: 'Kavya Nair',
      customerPhone: '+91 98765 12345',
      customerEmail: 'kavya.nair@email.com',
      orderType: 'walk-in',
      description: 'Medical reports photocopying - 20 pages',
      status: 'ready',
      isUrgent: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      services: ['Photocopying'],
      pages: 20,
      copies: 2
    },
    {
      id: 'WI005',
      customerName: 'Rohit Gupta',
      customerPhone: '+91 55555 66666',
      customerEmail: 'rohit.gupta@email.com',
      orderType: 'walk-in',
      description: 'ID card lamination - 5 cards',
      status: 'confirmed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      services: ['Lamination'],
      pages: 5,
      copies: 1
    },
    {
      id: 'WI006',
      customerName: 'Deepika Singh',
      customerPhone: '+91 77777 88888',
      customerEmail: 'deepika.singh@email.com',
      orderType: 'walk-in',
      description: 'Certificate binding - 10 certificates',
      status: 'new',
      isUrgent: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      services: ['Binding'],
      pages: 10,
      copies: 1
    }
  ]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.customerPhone.includes(query)
    );
  });

  // Separate orders by type and sort by urgency and time
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

  const toggleOrderUrgency = useCallback((orderId: string) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, isUrgent: !order.isUrgent } : order
    ));
    setLastUpdated(new Date());
  }, []);

  const handleViewDetails = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order || null);
  }, [orders]);

  const handleOpenChat = useCallback((orderId: string) => {
    setChatOrderId(orderId);
  }, []);

  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone}`);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Calculate stats
  const todayOrders = orders.filter(order => {
    const today = new Date();
    return order.createdAt.toDateString() === today.toDateString();
  }).length;

  const urgentOrders = orders.filter(order => order.isUrgent).length;
  const pendingOrders = orders.filter(order => 
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
          totalOrders={orders.length}
        />

        {/* Universal Search */}
        <UniversalSearch onSearch={handleSearch} />

        {/* Main Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Box - Uploaded Files */}
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
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadedFilesOrders.map((order) => (
                    <ImprovedOrderCard
                      key={order.id}
                      order={order}
                      onToggleUrgency={toggleOrderUrgency}
                      onUpdateStatus={updateOrderStatus}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                      onCall={handleCall}
                    />
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
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {walkInOrders.map((order) => (
                    <ImprovedOrderCard
                      key={order.id}
                      order={order}
                      onToggleUrgency={toggleOrderUrgency}
                      onUpdateStatus={updateOrderStatus}
                      onViewDetails={handleViewDetails}
                      onOpenChat={handleOpenChat}
                      onCall={handleCall}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Order Chat Modal */}
      {chatOrderId && (
        <OrderChat
          orderId={chatOrderId}
          customerName={orders.find(o => o.id === chatOrderId)?.customerName || ''}
          customerPhone={orders.find(o => o.id === chatOrderId)?.customerPhone || ''}
          isOpen={!!chatOrderId}
          onClose={() => setChatOrderId(null)}
        />
      )}
    </div>
  );
};

export default ModernDashboard;
