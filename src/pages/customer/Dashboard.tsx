
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Store, 
  Clock,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import apiService from '@/services/api';
import { Order } from '@/types/api';
import UniversalHeader from '@/components/layout/UniversalHeader';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiService.getCustomerOrders(),
  });

  const orders: Order[] = ordersData?.orders || [];
  const recentOrders = orders.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ready': return <Package className="w-4 h-4 text-blue-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <UniversalHeader title="Welcome to your dashboard" showHomeButton={false} />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">New Order</h3>
              <p className="text-neutral-600 mb-4">Create a new print order</p>
              <Button 
                onClick={() => navigate('/customer/new-order')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Order
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">My Orders</h3>
              <p className="text-neutral-600 mb-4">View order history</p>
              <Button 
                onClick={() => navigate('/customer/orders')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                View Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300">
            <CardContent className="p-6 text-center">
              <Store className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Browse Shops</h3>
              <p className="text-neutral-600 mb-4">Find nearby print shops</p>
              <Button 
                onClick={() => navigate('/customer/shops')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Browse Shops
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/customer/orders')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-600">Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first print order</p>
                <Button onClick={() => navigate('/customer/new-order')}>
                  Create Order
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/customer/orders`)}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h4 className="font-semibold">{order.shop?.name}</h4>
                        <p className="text-sm text-gray-600 truncate max-w-96">
                          {order.notes}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.is_urgent && (
                        <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                      )}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
