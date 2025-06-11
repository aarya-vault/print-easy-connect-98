
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Phone, Star, Clock, Upload, UserCheck } from 'lucide-react';
import apiService from '@/services/api';
import { Shop } from '@/types/api';
import { toast } from 'sonner';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopParam = searchParams.get('shop');
  
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [visitedShops, setVisitedShops] = useState<Shop[]>([]);

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => apiService.getShops(),
  });

  const { data: visitedShopsData } = useQuery({
    queryKey: ['visited-shops'],
    queryFn: () => apiService.getVisitedShops(),
  });

  useEffect(() => {
    if (shopsData?.shops) {
      setShops(shopsData.shops);
      setVisitedShops(shopsData.shops);
    }
    if (visitedShopsData?.shops) {
      setVisitedShops(visitedShopsData.shops);
    }
  }, [shopsData, visitedShopsData]);

  useEffect(() => {
    if (shopParam && shops.length > 0) {
      const shop = shops.find(s => s.id === shopParam);
      if (shop) {
        setSelectedShop(shop);
      }
    }
  }, [shopParam, shops]);

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  const handleOrderTypeSelect = (orderType: 'digital' | 'walkin') => {
    if (!selectedShop) {
      toast.error('Please select a shop first');
      return;
    }

    if (orderType === 'digital') {
      navigate(`/customer/upload?shop=${selectedShop.id}`);
    } else {
      navigate(`/customer/walkin?shop=${selectedShop.id}`);
    }
  };

  if (shopsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Create New Order</h1>
          <p className="text-neutral-600 mt-2">Select a print shop and choose your order type</p>
        </div>

        {!selectedShop ? (
          <div className="space-y-8">
            {/* Visited Shops */}
            {visitedShops.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recently Visited Shops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visitedShops.slice(0, 6).map((shop) => (
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
                            <Phone className="w-4 h-4" />
                            <span>{shop.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-golden-500 fill-current" />
                            <span>{shop.rating || 4.5} ({shop.totalReviews || 0} reviews)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Shops */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Available Shops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <Phone className="w-4 h-4" />
                          <span>{shop.phone}</span>
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
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected Shop */}
            <Card className="border-2 border-golden-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{selectedShop.name}</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedShop(null)}
                  >
                    Change Shop
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedShop.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedShop.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedShop.shop_timings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-golden-500 fill-current" />
                    <span>{selectedShop.rating || 4.5} Rating</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Type Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Choose Order Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300 group">
                  <CardContent 
                    className="p-8 text-center"
                    onClick={() => handleOrderTypeSelect('digital')}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
                    <p className="text-neutral-600 mb-4">
                      Upload your digital documents for printing. Perfect for PDFs, images, and other files.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Choose This Option
                    </Button>
                  </CardContent>
                </Card>

                {selectedShop.allows_offline_orders && (
                  <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-300 group">
                    <CardContent 
                      className="p-8 text-center"
                      onClick={() => handleOrderTypeSelect('walkin')}
                    >
                      <UserCheck className="w-16 h-16 mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-semibold mb-2">Walk-in Order</h3>
                      <p className="text-neutral-600 mb-4">
                        Bring physical documents to the shop. Great for scanning, photocopying, or handling originals.
                      </p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Choose This Option
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrder;
