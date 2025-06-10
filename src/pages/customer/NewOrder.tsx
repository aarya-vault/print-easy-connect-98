
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, Phone } from 'lucide-react';
import apiService from '@/services/api';
import { toast } from 'sonner';
import CustomerHeader from '@/components/layout/CustomerHeader';

interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  is_active: boolean;
  allows_offline_orders: boolean;
  slug: string;
}

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [visitedShops, setVisitedShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [shopsResponse, visitedResponse] = await Promise.all([
        apiService.getShops({ limit: 20 }),
        apiService.getVisitedShops()
      ]);
      
      setShops(shopsResponse.shops || []);
      setVisitedShops(visitedResponse.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectShop = (shop: Shop) => {
    navigate(`/customer/order/${shop.slug || shop.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
        <CustomerHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading shops...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <CustomerHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Place New Order</h1>
          <p className="text-neutral-600">Choose a print shop to get started</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
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
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Recent Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visitedShops.slice(0, 6).map((shop) => (
                  <div
                    key={shop.id}
                    className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => selectShop(shop)}
                  >
                    <h3 className="font-semibold mb-2">{shop.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{shop.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{shop.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={shop.is_active ? 'default' : 'secondary'}>
                            {shop.is_active ? 'Open' : 'Closed'}
                          </Badge>
                          {shop.allows_offline_orders && (
                            <Badge variant="outline" className="text-xs">Walk-in</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Shops */}
        <Card>
          <CardHeader>
            <CardTitle>All Print Shops</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredShops.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No shops found</p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => selectShop(shop)}
                  >
                    <h3 className="font-semibold mb-2">{shop.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <Phone className="w-4 h-4" />
                        <span>{shop.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{shop.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={shop.is_active ? 'default' : 'secondary'}>
                            {shop.is_active ? 'Open' : 'Closed'}
                          </Badge>
                          {shop.allows_offline_orders && (
                            <Badge variant="outline" className="text-xs">Walk-in</Badge>
                          )}
                        </div>
                      </div>
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

export default NewOrder;
