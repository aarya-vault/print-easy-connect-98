
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Phone, Clock, Upload, UserCheck } from 'lucide-react';
import apiService from '@/services/api';
import { Shop } from '@/types/api';
import { toast } from 'sonner';

const CustomerOrderByShop: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();

  const { data: shopData, isLoading, error } = useQuery({
    queryKey: ['shop-by-slug', shopSlug],
    queryFn: () => apiService.getShopBySlug(shopSlug || ''),
    enabled: !!shopSlug,
  });

  const shop: Shop = shopData?.shop;

  const handleOrderTypeSelect = (orderType: 'digital' | 'walkin') => {
    if (!shop) {
      toast.error('Shop information not available');
      return;
    }

    if (orderType === 'digital') {
      navigate(`/customer/upload?shop=${shop.slug}`);
    } else {
      navigate(`/customer/walkin?shop=${shop.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-golden-500" />
          <p className="text-neutral-600">Loading shop information...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Shop Not Found</h2>
              <p className="text-neutral-600 mb-6">The requested shop could not be found or may be inactive.</p>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Print<span className="text-golden-600">Easy</span>
          </h1>
          <p className="text-neutral-600">Quick and Easy Print Ordering</p>
        </div>

        {/* Shop Information */}
        <Card className="mb-8 border-2 border-golden-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-golden-500 to-golden-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">{shop.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-golden-600" />
                  <span className="text-neutral-700">{shop.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-golden-600" />
                  <span className="text-neutral-700">{shop.phone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-golden-600" />
                  <span className="text-neutral-700">{shop.shop_timings}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800">
                    Currently Open
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Type Selection */}
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">How would you like to place your order?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Digital Upload Option */}
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400 group">
              <CardContent 
                className="p-8 text-center"
                onClick={() => handleOrderTypeSelect('digital')}
              >
                <Upload className="w-20 h-20 mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Upload Files</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Upload your digital documents (PDF, Word, Images) for printing. 
                  Perfect for documents you already have ready on your device.
                </p>
                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <p>✓ Supports PDF, DOC, JPG, PNG</p>
                  <p>✓ Specify printing preferences</p>
                  <p>✓ Track order status online</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Upload & Order
                </Button>
              </CardContent>
            </Card>

            {/* Walk-in Option */}
            <Card className={`cursor-pointer hover:shadow-xl transition-all duration-300 border-2 group ${
              shop.allows_offline_orders 
                ? 'hover:border-purple-400' 
                : 'opacity-60 cursor-not-allowed'
            }`}>
              <CardContent 
                className="p-8 text-center"
                onClick={() => shop.allows_offline_orders && handleOrderTypeSelect('walkin')}
              >
                <UserCheck className={`w-20 h-20 mx-auto mb-6 transition-transform duration-300 ${
                  shop.allows_offline_orders 
                    ? 'text-purple-600 group-hover:scale-110' 
                    : 'text-gray-400'
                }`} />
                <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Walk-in Order</h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Book a visit to bring physical documents to the shop. 
                  Great for scanning, photocopying, or handling original documents.
                </p>
                <div className="space-y-2 text-sm text-neutral-500 mb-6">
                  <p>✓ Bring physical documents</p>
                  <p>✓ Professional assistance available</p>
                  <p>✓ Handle originals safely</p>
                </div>
                {shop.allows_offline_orders ? (
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-3">
                    Book Visit
                  </Button>
                ) : (
                  <Button disabled className="w-full text-lg py-3">
                    Not Available
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-neutral-500">
          <p>Need help? Call the shop directly at {shop.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderByShop;
