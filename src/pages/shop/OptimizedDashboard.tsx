
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  UserCheck, 
  RefreshCw
} from 'lucide-react';
import UltraMinimalistOrderCard from '@/components/shop/UltraMinimalistOrderCard';
import DashboardStats from '@/components/shop/DashboardStats';
import UniversalSearch from '@/components/shop/UniversalSearch';
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

const OptimizedDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Demo orders with real-world scenarios
  const [orders, setOrders] = useState<ShopOrder[]>([
    // UPLOADED FILES ORDERS
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

  // Separate and limit orders by type (show only 4 per box in 2x2 grid)
  const sortOrdersByUrgencyAndTime = (ordersList: ShopOrder[]) => {
    return ordersList
      .sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, 4); // Show only 4 orders in 2x2 grid
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
      {/* Optimized Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-cream-200/50 sticky top-0 z-10">
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

        {/* Main Box Layout - 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Box - Uploaded Files */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Uploaded Files</h2>
                    <p className="text-sm text-neutral-600">Showing {uploadedFilesOrders.length} of {filteredOrders.filter(o => o.orderType === 'uploaded-files').length}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {uploadedFilesOrders.filter(o => o.isUrgent).length} Urgent
                </Badge>
              </div>
            </div>
            
            {/* 2x2 Grid Layout */}
            <div className="p-4">
              {uploadedFilesOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-blue-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No uploaded file orders</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {uploadedFilesOrders.map((order) => (
                    <UltraMinimalistOrderCard
                      key={order.id}
                      order={order}
                      onToggleUrgency={toggleOrderUrgency}
                      onUpdateStatus={updateOrderStatus}
                      onViewDetails={handleViewDetails}
                      onCall={handleCall}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Box - Walk-in Orders */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Walk-in Orders</h2>
                    <p className="text-sm text-neutral-600">Showing {walkInOrders.length} of {filteredOrders.filter(o => o.orderType === 'walk-in').length}</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                  {walkInOrders.filter(o => o.isUrgent).length} Urgent
                </Badge>
              </div>
            </div>
            
            {/* 2x2 Grid Layout */}
            <div className="p-4">
              {walkInOrders.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                  <p className="text-neutral-500">No walk-in orders</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {walkInOrders.map((order) => (
                    <UltraMinimalistOrderCard
                      key={order.id}
                      order={order}
                      onToggleUrgency={toggleOrderUrgency}
                      onUpdateStatus={updateOrderStatus}
                      onViewDetails={handleViewDetails}
                      onCall={handleCall}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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

export default OptimizedDashboard;
