
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { CreateShopRequest } from '@/types/api';

const AddShop: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    allowOfflineAccess: true,
    shopTimings: 'Mon-Sat: 9:00 AM - 7:00 PM'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const shopData: CreateShopRequest = {
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPassword: formData.ownerPassword,
        contactNumber: formData.phone,
        address: formData.address,
        allowOfflineAccess: formData.allowOfflineAccess,
        shopTimings: formData.shopTimings,
        description: formData.description
      };

      const response = await apiService.createShop(shopData);
      
      if (response.success) {
        toast.success('Shop created successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create shop');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Add New Shop</h1>
            <p className="text-neutral-600">Create a new print shop and owner account</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    value={formData.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Shop Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shopTimings">Shop Timings</Label>
                  <Input
                    id="shopTimings"
                    value={formData.shopTimings}
                    onChange={(e) => handleInputChange('shopTimings', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of services offered..."
                />
              </div>

              {/* Owner Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Shop Owner Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ownerEmail">Owner Email *</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownerPassword">Owner Password *</Label>
                    <Input
                      id="ownerPassword"
                      type="password"
                      value={formData.ownerPassword}
                      onChange={(e) => handleInputChange('ownerPassword', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Shop Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Walk-in Orders</Label>
                    <p className="text-sm text-neutral-600">Enable customers to place walk-in orders</p>
                  </div>
                  <Switch
                    checked={formData.allowOfflineAccess}
                    onCheckedChange={(checked) => handleInputChange('allowOfflineAccess', checked)}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-golden-500 hover:bg-golden-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Shop...
                    </>
                  ) : (
                    'Create Shop'
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

export default AddShop;
