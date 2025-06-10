
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Phone, MapPin, Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import apiService from '@/services/api';
import { toast } from 'sonner';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await apiService.getOrderById(orderId!);
      setOrder(response.order);
    } catch (error) {
      toast.error('Order not found');
      navigate('/customer/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Order not found</p>
          <Button onClick={() => navigate('/customer/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Success Message */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-neutral-600 mb-4">
              Your order has been received and will be processed shortly.
            </p>
            <Badge className="bg-green-100 text-green-800">
              Order #{order.id}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-700">Order Type</p>
                <Badge variant="outline" className="capitalize">
                  {order.order_type.replace('-', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Status</p>
                <Badge className="bg-blue-100 text-blue-800 capitalize">
                  {order.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-1">Description</p>
              <p className="text-neutral-600">{order.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-700 mb-1">Customer Details</p>
              <div className="space-y-1">
                <p className="text-neutral-600">{order.customer_name}</p>
                <p className="text-neutral-600">{order.customer_phone}</p>
              </div>
            </div>

            {order.files && order.files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">Uploaded Files</p>
                <div className="space-y-2">
                  {order.files.map((file: any, index: number) => (
                    <div key={index} className="bg-neutral-50 p-2 rounded text-sm">
                      {file.original_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shop Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{order.shop.name}</h3>
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>{order.shop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="w-4 h-4" />
                <span>{order.shop.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-golden-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-neutral-600">The shop will review your order and confirm the details.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-neutral-300 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-neutral-600">Your order will be processed and prepared.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-neutral-300 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Ready for Pickup</p>
                  <p className="text-sm text-neutral-600">You'll be notified when your order is ready.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Shop
          </Button>
          <Button 
            onClick={() => navigate('/customer/dashboard')} 
            className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700"
          >
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
