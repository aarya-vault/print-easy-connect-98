
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Phone, MapPin, Clock, ArrowRight, Home } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Get order data from localStorage
  const [order, setOrder] = React.useState<any>(null);

  useEffect(() => {
    console.log('OrderSuccess - orderId:', orderId);
    const orders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
    console.log('OrderSuccess - orders from localStorage:', orders);
    
    const foundOrder = orders.find((o: any) => o.id === orderId);
    console.log('OrderSuccess - found order:', foundOrder);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      console.log('OrderSuccess - no order found, redirecting to dashboard');
      navigate('/customer/dashboard');
    }
  }, [orderId, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Order Created Successfully!
          </h1>
          <p className="text-lg text-neutral-600">
            Your {order.orderType.replace('-', ' ')} order has been placed and the shop has been notified.
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="border-2 border-green-200 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Order Summary</h2>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Order Placed
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Order ID</label>
                    <p className="text-lg font-bold text-neutral-900">#{order.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Customer Name</label>
                    <p className="text-neutral-900">{order.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Phone Number</label>
                    <p className="text-neutral-900">{order.customerPhone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Shop Name</label>
                    <p className="text-neutral-900">{order.shopName || 'Quick Print Solutions'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Order Type</label>
                    <p className="text-neutral-900 capitalize">{order.orderType.replace('-', ' ')} Order</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Created At</label>
                    <p className="text-neutral-900">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-600">Description</label>
                <p className="text-neutral-900 bg-neutral-50 p-3 rounded-lg mt-1">
                  {order.description}
                </p>
              </div>

              {order.specialInstructions && (
                <div>
                  <label className="text-sm font-medium text-neutral-600">Special Instructions</label>
                  <p className="text-neutral-900 bg-neutral-50 p-3 rounded-lg mt-1">
                    {order.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-2 border-blue-200 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-neutral-700">
                  {order.orderType === 'walk-in' 
                    ? `Visit the shop with your documents and mention Order ID: #${order.id}`
                    : `Your files are being processed. Check your dashboard for updates.`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-neutral-700">
                  The shop will contact you if they need any clarification
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-neutral-700">
                  Track your order status from your dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/customer/order/new')}
            className="h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold"
          >
            Place Another Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/customer/dashboard')}
            className="h-12 border-2 border-neutral-300 hover:bg-neutral-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
