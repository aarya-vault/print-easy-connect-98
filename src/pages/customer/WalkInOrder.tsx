
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UserCheck, ArrowLeft } from 'lucide-react';

const WalkInOrder: React.FC = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    specialInstructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock shop data
  const shop = {
    id: shopId,
    name: 'Quick Print Solutions',
    address: 'Shop 12, MG Road, Bangalore'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!formData.customerPhone.trim() || formData.customerPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = `WI${Date.now().toString().slice(-6)}`;
      
      // Store order data
      const orderData = {
        id: orderId,
        shopId: shopId,
        shopName: shop.name,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        specialInstructions: formData.specialInstructions,
        orderType: 'walk-in',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('customer_orders', JSON.stringify(existingOrders));
      
      toast.success('Walk-in order created successfully!');
      navigate(`/customer/order/success/${orderId}`);
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="border-neutral-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Create Walk-in Order</h1>
              <p className="text-neutral-600">at {shop.name}</p>
            </div>
          </div>

          {/* Order Form */}
          <Card className="border-2 border-purple-200 shadow-lg bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-neutral-900">
                    Walk-in Order Details
                  </CardTitle>
                  <p className="text-sm text-neutral-600">
                    Fill in your details to create the order
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-12 border-2 border-neutral-200 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setFormData({ ...formData, customerPhone: value });
                      }
                    }}
                    placeholder="Enter 10-digit phone number"
                    className="h-12 border-2 border-neutral-200 focus:border-purple-500"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.customerPhone.length}/10 digits
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="Any special requirements or instructions for your order..."
                    className="min-h-[100px] border-2 border-neutral-200 focus:border-purple-500"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.customerName.trim() || formData.customerPhone.length !== 10}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Order...
                    </div>
                  ) : (
                    'Create Walk-in Order'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalkInOrder;
