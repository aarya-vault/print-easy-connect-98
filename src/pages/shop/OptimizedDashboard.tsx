import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  Phone,
  Eye,
  Clock,
  PlayCircle,
  CheckCircle2,
  FileText,
  Users,
  AlertCircle,
  Star,
  RefreshCw,
  QrCode,
  Settings,
  TrendingUp,
  Calendar,
  Package
} from 'lucide-react';
import { ShopOrder } from '@/types/order';

const OptimizedDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ShopOrder['status']>('all');
  const [selectedOrderType, setSelectedOrderType] = useState<'all' | 'uploaded-files' | 'walk-in'>('all');

  // Mock orders data using the correct ShopOrder type from types/order.ts
  const mockOrders: ShopOrder[] = [
    {
      id: 'ORD001',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 9876543210',
      orderType: 'uploaded-files',
      status: 'received',
      isUrgent: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Business presentation slides - 50 pages, color printing with binding',
      files: ['presentation.pdf'],
      services: ['Color Printing', 'Spiral Binding'],
      totalAmount: 250
    },
    {
      id: 'ORD002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 9876543211',
      orderType: 'walk-in',
      status: 'started',
      isUrgent: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      description: 'Resume printing - 5 copies on premium paper',
      services: ['Premium Paper', 'Black & White'],
      totalAmount: 75
    },
    {
      id: 'ORD003',
      customerName: 'Amit Patel',
      customerPhone: '+91 9876543212',
      orderType: 'uploaded-files',
      status: 'completed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Company brochures - 100 copies with lamination',
      files: ['brochure.pdf'],
      services: ['Color Printing', 'Lamination'],
      totalAmount: 500
    }
  ];

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesType = selectedOrderType === 'all' || order.orderType === selectedOrderType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [mockOrders, searchTerm, filterStatus, selectedOrderType]);

  // Group orders by status
  const ordersByStatus = useMemo(() => {
    return {
      received: filteredOrders.filter(order => order.status === 'received'),
      started: filteredOrders.filter(order => order.status === 'started'),
      completed: filteredOrders.filter(order => order.status === 'completed')
    };
  }, [filteredOrders]);

  const handleUpdateStatus = (orderId: string, newStatus: ShopOrder['status']) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // Implementation for status update
  };

  const handleViewDetails = (orderId: string) => {
    console.log(`Viewing details for order: ${orderId}`);
    // Implementation for viewing order details
  };

  const getStatusColor = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return <Clock className="w-3 h-3" />;
      case 'started': return <PlayCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  // Dashboard stats
  const stats = {
    totalOrders: mockOrders.length,
    pendingOrders: ordersByStatus.received.length + ordersByStatus.started.length,
    completedToday: ordersByStatus.completed.length,
    urgentOrders: mockOrders.filter(order => order.isUrgent).length
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Shop Dashboard</h1>
            <p className="text-neutral-600">Manage your printing orders efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Orders</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Pending</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Completed Today</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.completedToday}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Urgent Orders</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.urgentOrders}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders by customer name, order ID, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-neutral-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="received">Received</option>
                  <option value="started">Started</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={selectedOrderType}
                  onChange={(e) => setSelectedOrderType(e.target.value as any)}
                  className="px-3 py-2 border border-neutral-300 rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="uploaded-files">Upload Orders</option>
                  <option value="walk-in">Walk-in Orders</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Received Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-blue-500" />
                Received ({ordersByStatus.received.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordersByStatus.received.map((order) => (
                <Card key={order.id} className={`border-2 transition-all duration-200 hover:shadow-md ${
                  order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-neutral-200 bg-white'
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate">{order.customerName}</h3>
                            {order.isUrgent && (
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 truncate">ID: {order.id}</p>
                        </div>
                        <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2">{order.description}</p>

                      {order.services && order.services.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {order.services.slice(0, 2).map((service, index) => (
                            <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                          {order.services.length > 2 && (
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              +{order.services.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(order.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${order.customerPhone}`)}
                          className="h-8 px-3"
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'started')}
                          className="h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {ordersByStatus.received.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>No new orders</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Started Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PlayCircle className="w-5 h-5 text-yellow-500" />
                In Progress ({ordersByStatus.started.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordersByStatus.started.map((order) => (
                <Card key={order.id} className={`border-2 transition-all duration-200 hover:shadow-md ${
                  order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-neutral-200 bg-white'
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm truncate">{order.customerName}</h3>
                            {order.isUrgent && (
                              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 truncate">ID: {order.id}</p>
                        </div>
                        <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2">{order.description}</p>

                      {order.services && order.services.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {order.services.slice(0, 2).map((service, index) => (
                            <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                          {order.services.length > 2 && (
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              +{order.services.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(order.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${order.customerPhone}`)}
                          className="h-8 px-3"
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {ordersByStatus.started.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <PlayCircle className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>No orders in progress</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Completed ({ordersByStatus.completed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordersByStatus.completed.map((order) => (
                <Card key={order.id} className="border-2 border-neutral-200 bg-white transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm truncate">{order.customerName}</h3>
                          <p className="text-xs text-neutral-600 truncate">ID: {order.id}</p>
                        </div>
                        <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2">{order.description}</p>

                      {order.services && order.services.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {order.services.slice(0, 2).map((service, index) => (
                            <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                          {order.services.length > 2 && (
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              +{order.services.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(order.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${order.customerPhone}`)}
                          className="h-8 px-3"
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {ordersByStatus.completed.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>No completed orders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimizedDashboard;
