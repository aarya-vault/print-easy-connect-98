
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Store, MapPin, Phone, Clock, Star, Search } from 'lucide-react';
import apiService from '@/services/api';
import { Shop } from '@/types/api';

const CustomerShops: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: shopsData, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => apiService.getShops(),
  });

  const { data: visitedShopsData } = useQuery({
    queryKey: ['visited-shops'],
    queryFn: () => apiService.getVisitedShops(),
  });

  const allShops: Shop[] = shopsData?.shops || [];
  const visitedShops: Shop[] = visitedShopsData?.shops || [];

  const filteredShops = allShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderFromShop = (shop: Shop) => {
    navigate(`/customer/new-order?shop=${shop.id}`);
  };

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
            <h1 className="text-3xl font-bold text-neutral-900">Browse Print Shops</h1>
            <p className="text-neutral-600">Find and order from local print shops</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search shops by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Visited Shops */}
        {visitedShops.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recently Visited</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visitedShops.slice(0, 6).map((shop) => (
                <Card 
                  key={shop.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-golden-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{shop.name}</h3>
                      <Badge className="bg-green-100 text-green-800">Open</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-600 mb-4">
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
                    <Button 
                      onClick={() => handleOrderFromShop(shop)}
                      className="w-full bg-golden-500 hover:bg-golden-600"
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Shops */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Print Shops</h2>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-600">Loading shops...</p>
            </div>
          ) : filteredShops.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <Card 
                  key={shop.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-golden-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-xl">{shop.name}</h3>
                      <Badge className="bg-green-100 text-green-800">Open</Badge>
                    </div>
                    <div className="space-y-3 text-sm text-neutral-600 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{shop.shop_timings}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-golden-500 fill-current flex-shrink-0" />
                        <span>{shop.rating || 4.5} Rating</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleOrderFromShop(shop)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerShops;
