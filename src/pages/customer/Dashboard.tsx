
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Clock, 
  CheckCircle, 
  Store,
  Eye,
  MessageCircle,
  Phone,
  User,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import UniversalHeader from '@/components/layout/UniversalHeader';
import { Order, Shop } from '@/types/api';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiService.getCustomerOrders(),
  });

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['visited-shops'],
    queryFn: () => apiService.getVisitedShops(),
  });

  const orders: Order[] = ordersData?.orders || [];
  const visitedShops: Shop[] = shopsData?.shops || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTypeLabel = (type: string) => {
    return type === 'digital' ? 'Digital Upload' : 'Walk-in Order';
  };

  const handleNewOrder = () => {
    navigate('/customer/new-order');
  };

  const handleViewShop = (shopId: string) => {
    navigate(`/customer/shop/${shopId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <UniversalHeader 
        title="Customer Dashboard"
        user={user}
        onLogout={logout}
        userMenuItems={[
          { 
            label: 'Profile', 
            icon: User, 
            onClick: () => navigate('/profile') 
          }
        ]}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="shadow-lg border-golden-200">
            <CardHeader className="bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Welcome, {user?.name}!
                  </CardTitle>
                  <p className="text-golden-100">Manage your print orders and discover shops</p>
                </div>
                <Button
                  onClick={handleNewOrder}
                  className="bg-white text-golden-600 hover:bg-golden-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">
                    {orders.length}
                  </div>
                  <div className="text-sm text-neutral-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-neutral-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'ready').length}
                  </div>
                  <div className="text-sm text-neutral-600">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {visitedShops.length}
                  </div>
                  <div className="text-sm text-neutral-600">Visited Shops</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start by placing your first print order</p>
                    <Button onClick={handleNewOrder} className="bg-golden-500 hover:bg-golden-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Place First Order
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {getOrderTypeLabel(order.order_type)}
                            </Badge>
                            {order.is_urgent && (
                              <Badge className="bg-red-100 text-red-800">
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{order.shop?.name}</p>
                          <p className="text-sm text-gray-600 mb-1">{order.notes}</p>
                          <p className="text-xs text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Visited Shops */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Visited Shops
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shopsLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">Loading shops...</p>
                  </div>
                ) : visitedShops.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No shops visited yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visitedShops.slice(0, 5).map((shop) => (
                      <div key={shop.id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{shop.name}</p>
                            <p className="text-xs text-gray-600 truncate">{shop.address}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewShop(shop.id)}
                          >
                            <Store className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleNewOrder}
                  className="w-full bg-golden-500 hover:bg-golden-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Place New Order
                </Button>
                <Button 
                  onClick={() => navigate('/shops')}
                  variant="outline" 
                  className="w-full"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Browse Shops
                </Button>
                <Button 
                  onClick={() => navigate('/orders')}
                  variant="outline" 
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
