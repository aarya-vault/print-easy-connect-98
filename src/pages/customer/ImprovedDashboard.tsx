
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { toast } from 'sonner';
import { Plus, Package, Clock, CheckCircle, MapPin, Phone, Star } from 'lucide-react';
import CustomerHeader from '@/components/layout/CustomerHeader';

interface Order {
  id: string;
  shop: {
    id: number;
    name: string;
    address: string;
    phone: string;
    rating: number;
  };
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
}

const ImprovedCustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visitedShops, setVisitedShops] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersResponse, shopsResponse] = await Promise.all([
        apiService.getCustomerOrders(),
        apiService.getVisitedShops()
      ]);
      
      setOrders(ordersResponse.orders || []);
      setVisitedShops(shopsResponse.shops || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'started': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Package className="w-4 h-4" />;
      case 'started': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
        <CustomerHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <CustomerHeader />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p className="text-neutral-600">Manage your print orders and discover local print shops.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/new-order')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-golden-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-golden-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Place New Order</h3>
                  <p className="text-neutral-600 text-sm">Upload files or book walk-in service</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/customer/shops')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find Print Shops</h3>
                  <p className="text-neutral-600 text-sm">Discover nearby printing services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Active Orders ({activeOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active orders</p>
                <Button onClick={() => navigate('/customer/new-order')} className="mt-4">
                  Place Your First Order
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                          {order.is_urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-neutral-600 mb-2">{order.description}</p>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.shop.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {order.shop.phone}
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {order.order_type.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{order.shop.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Shops */}
        {visitedShops.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visitedShops.slice(0, 6).map((shop) => (
                  <div key={shop.id} className="border rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                       onClick={() => navigate(`/customer/shop/${shop.slug || shop.id}`)}>
                    <h3 className="font-semibold mb-2">{shop.name}</h3>
                    <p className="text-sm text-neutral-600 mb-2">{shop.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{shop.rating}</span>
                      </div>
                      <Button size="sm" variant="outline">Order Again</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order History */}
        {completedOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Order History ({completedOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-neutral-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        <p className="text-neutral-600 mb-2">{order.description}</p>
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.shop.name}
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {order.order_type.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {completedOrders.length > 5 && (
                  <Button variant="outline" className="w-full">
                    View All History ({completedOrders.length - 5} more)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImprovedCustomerDashboard;
