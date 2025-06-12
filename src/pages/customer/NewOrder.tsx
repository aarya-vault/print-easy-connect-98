
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, UserCheck, Store, MapPin, Clock } from 'lucide-react';
import apiService from '@/services/api';
import { Shop } from '@/types/api';
import CustomerHeader from '@/components/layout/CustomerHeader';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedShopId = searchParams.get('shop');

  const { data: shopsData, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => apiService.getShops(),
  });

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  React.useEffect(() => {
    if (preselectedShopId && shopsData?.shops) {
      const shop = shopsData.shops.find(s => s.id === preselectedShopId);
      if (shop) setSelectedShop(shop);
    }
  }, [preselectedShopId, shopsData]);

  const shops: Shop[] = shopsData?.shops || [];

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleUploadOrder = () => {
    if (selectedShop) {
      navigate(`/customer/upload?shop=${selectedShop.id}`);
    }
  };

  const handleWalkinOrder = () => {
    if (selectedShop) {
      navigate(`/customer/walkin?shop=${selectedShop.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
        <CustomerHeader />
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <CustomerHeader />
      
      <div className="max-w-4xl mx-auto p-6">
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
            <h1 className="text-3xl font-bold text-neutral-900">Create New Order</h1>
            <p className="text-neutral-600">Choose a shop and order type</p>
          </div>
        </div>

        {/* Step 1: Shop Selection */}
        {!selectedShop && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Step 1: Select a Print Shop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shops.map((shop) => (
                  <Card 
                    key={shop.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-golden-300"
                    onClick={() => handleShopSelect(shop)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        <Badge className="bg-green-100 text-green-800">Open</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{shop.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{shop.shop_timings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Order Type Selection */}
        {selectedShop && (
          <>
            {/* Selected Shop Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedShop.name}</h3>
                    <p className="text-sm text-neutral-600">{selectedShop.address}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedShop(null)}
                  >
                    Change Shop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Type Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Step 2: Choose Order Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Upload Files Option */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
                      <p className="text-neutral-600 mb-4">
                        Upload your documents and get them printed with specifications
                      </p>
                      <Button 
                        onClick={handleUploadOrder}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Upload Documents
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Walk-in Order Option */}
                  {selectedShop.allows_offline_orders && (
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300">
                      <CardContent className="p-6 text-center">
                        <UserCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Walk-in Order</h3>
                        <p className="text-neutral-600 mb-4">
                          Visit the shop with your documents for immediate service
                        </p>
                        <Button 
                          onClick={handleWalkinOrder}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Book Walk-in
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {!selectedShop.allows_offline_orders && (
                    <Card className="border-2 border-gray-200 opacity-50">
                      <CardContent className="p-6 text-center">
                        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-500">Walk-in Order</h3>
                        <p className="text-gray-500 mb-4">
                          Walk-in orders not available at this shop
                        </p>
                        <Button disabled className="w-full">
                          Not Available
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NewOrder;
