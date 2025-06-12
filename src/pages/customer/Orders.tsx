
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, Search, Eye, MessageCircle, Phone, Filter } from 'lucide-react';
import apiService from '@/services/api';
import { Order } from '@/types/api';

const CustomerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => apiService.getCustomerOrders(),
  });

  const orders: Order[] = ordersData?.orders || [];

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.shop?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/customer/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>
            <p className="text-neutral-600">Track and manage all your print orders</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search orders by shop name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
              </h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? 'Start by placing your first print order' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {orders.length === 0 && (
                <Button 
                  onClick={() => navigate('/customer/new-order')} 
                  className="bg-golden-500 hover:bg-golden-600"
                >
                  Place First Order
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                        {order.shop?.name}
                      </h3>
                      <p className="text-neutral-600 mb-2">{order.notes}</p>
                      <p className="text-sm text-neutral-500">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      {order.shop?.phone && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`tel:${order.shop?.phone}`, '_self')}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {order.files && order.files.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-neutral-600 mb-2">
                        Uploaded Files ({order.files.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.files.map((file) => (
                          <Badge key={file.id} variant="outline" className="text-xs">
                            {file.original_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
