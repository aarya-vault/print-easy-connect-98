import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, FileText, Store } from 'lucide-react';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState<'uploaded-files' | 'walk-in'>('uploaded-files');
  const [formData, setFormData] = useState({
    shopId: '',
    description: '',
    customerName: user?.name || '',
    customerPhone: user?.phone || ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Get visited shops for reorder logic
  const { data: visitedShopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ['visited-shops'],
    queryFn: apiService.getVisitedShops,
  });

  // Fallback to all shops if no visited shops
  const { data: allShopsData } = useQuery({
    queryKey: ['all-shops'],
    queryFn: apiService.getShops,
    enabled: !visitedShopsData?.shops?.length
  });

  const shops = visitedShopsData?.shops?.length > 0 ? visitedShopsData.shops : allShopsData?.shops || [];
  const showingVisitedShops = visitedShopsData?.shops?.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shopId) {
      toast.error('Please select a shop');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please describe your printing requirements');
      return;
    }

    if (orderType === 'uploaded-files' && (!selectedFiles || selectedFiles.length === 0)) {
      toast.error('Please select files to upload');
      return;
    }

    setIsLoading(true);
    try {
      const orderFormData = new FormData();
      orderFormData.append('shopId', formData.shopId);
      orderFormData.append('orderType', orderType);
      orderFormData.append('description', formData.description);
      orderFormData.append('customerName', formData.customerName);
      orderFormData.append('customerPhone', formData.customerPhone);

      if (selectedFiles) {
        Array.from(selectedFiles).forEach(file => {
          orderFormData.append('files', file);
        });
      }

      await apiService.createOrder(orderFormData);
      toast.success('Order placed successfully!');
      navigate('/customer/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-neutral-100 p-6">
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

        <Card className="shadow-xl border-yellow-200">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
              <FileText className="w-8 h-8" />
              Place New Order
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-neutral-900">Order Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={orderType === 'uploaded-files' ? 'default' : 'outline'}
                    onClick={() => setOrderType('uploaded-files')}
                    className={`h-16 ${orderType === 'uploaded-files' 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'border-yellow-300 text-neutral-700 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload Files</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === 'walk-in' ? 'default' : 'outline'}
                    onClick={() => setOrderType('walk-in')}
                    className={`h-16 ${orderType === 'walk-in' 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'border-yellow-300 text-neutral-700 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Store className="w-5 h-5" />
                      <span>Walk-in Order</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Shop Selection */}
              <div>
                <Label htmlFor="shopId" className="text-neutral-900 font-medium">
                  Select Shop *
                  {showingVisitedShops && (
                    <span className="text-sm text-yellow-600 ml-2">
                      (Showing shops you've ordered from before)
                    </span>
                  )}
                </Label>
                <Select value={formData.shopId} onValueChange={(value) => setFormData(prev => ({ ...prev, shopId: value }))}>
                  <SelectTrigger className="h-12 border-2 border-neutral-200 focus:border-yellow-500">
                    <SelectValue placeholder={shopsLoading ? "Loading shops..." : "Choose a print shop"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-200 z-50">
                    {shops.map((shop: any) => (
                      <SelectItem key={shop.id} value={shop.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{shop.name}</span>
                          <span className="text-sm text-neutral-500">{shop.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {shops.length === 0 && !shopsLoading && (
                      <SelectItem value="none" disabled>
                        No shops available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload (only for uploaded-files) */}
              {orderType === 'uploaded-files' && (
                <div>
                  <Label htmlFor="files" className="text-neutral-900 font-medium">Upload Files *</Label>
                  <Input
                    id="files"
                    name="files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="h-12 border-2 border-neutral-200 focus:border-yellow-500"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-sm text-neutral-500 mt-2">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-neutral-900 font-medium">
                  Printing Requirements *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={orderType === 'uploaded-files' 
                    ? "Describe your printing needs (e.g., 10 copies, double-sided, color printing, binding)"
                    : "Describe what you need to print when you visit the shop"
                  }
                  required
                  rows={4}
                  className="border-2 border-neutral-200 focus:border-yellow-500"
                />
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName" className="text-neutral-900 font-medium">Your Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="h-12 border-2 border-neutral-200 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone" className="text-neutral-900 font-medium">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="h-12 border-2 border-neutral-200 focus:border-yellow-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Placing Order...
                  </div>
                ) : (
                  `Place ${orderType === 'uploaded-files' ? 'Upload' : 'Walk-in'} Order`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOrder;
