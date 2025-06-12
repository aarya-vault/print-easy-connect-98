
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, UserCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { Shop } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

const WalkinOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get('shop');
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    notes: '',
    isUrgent: false
  });

  const { data: shopData, isLoading: shopLoading } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => apiService.getShopBySlug(shopId || ''),
    enabled: !!shopId,
  });

  const shop: Shop = shopData?.shop;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerPhone: user.phone || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shop) {
      toast.error('Shop not found');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast.error('Customer name and phone are required');
      return;
    }

    if (!formData.notes.trim()) {
      toast.error('Please describe what you need to print');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        shopId: shop.id,
        orderType: 'walkin' as const,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        notes: formData.notes.trim()
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        toast.success('Walk-in order booked successfully!');
        navigate('/customer/dashboard');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      const errorMessage = error?.error || error?.message || 'Failed to book walk-in order';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Shop Not Found</h2>
              <p className="text-neutral-600 mb-6">The requested shop could not be found.</p>
              <Button onClick={() => navigate('/customer/new-order')}>
                Browse Shops
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!shop.allows_offline_orders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Walk-in Orders Not Available</h2>
              <p className="text-neutral-600 mb-6">This shop doesn't accept walk-in orders. Please use the file upload option instead.</p>
              <Button onClick={() => navigate(`/customer/upload?shop=${shopId}`)}>
                Upload Files Instead
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/customer/new-order')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Walk-in Order</h1>
            <p className="text-neutral-600">Book a visit to {shop.name}</p>
          </div>
        </div>

        {/* Shop Info */}
        <Card className="mb-6 border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{shop.name}</h3>
                <p className="text-neutral-600">{shop.address}</p>
                <p className="text-sm text-neutral-500">{shop.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600">Shop Timings</p>
                <p className="text-sm font-medium">{shop.shop_timings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Walk-in Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="notes">What do you need to print? *</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  required
                  placeholder="Describe what documents you'll bring, how many copies, paper size, color/black & white, binding requirements, etc."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mark as Urgent</Label>
                  <p className="text-sm text-neutral-600">Priority processing for urgent orders</p>
                </div>
                <Switch
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUrgent: checked }))}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your walk-in order will be confirmed by the shop</li>
                  <li>• Visit the shop with your physical documents</li>
                  <li>• Complete your printing requirements on-site</li>
                  <li>• Pay directly at the shop after service completion</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/customer/new-order')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking Order...
                    </>
                  ) : (
                    'Book Walk-in Order'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalkinOrder;
