
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, Loader2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { Shop } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

const UploadOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get('shop');
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shop) {
      toast.error('Shop not found');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      toast.error('Customer name and phone are required');
      return;
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('shopId', shop.id);
      uploadFormData.append('orderType', 'digital');
      uploadFormData.append('customerName', formData.customerName.trim());
      uploadFormData.append('customerPhone', formData.customerPhone.trim());
      uploadFormData.append('notes', formData.notes.trim());
      uploadFormData.append('isUrgent', formData.isUrgent.toString());

      selectedFiles.forEach((file) => {
        uploadFormData.append('files', file);
      });

      const response = await apiService.createOrder(uploadFormData);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        navigate('/customer/dashboard');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      const errorMessage = error?.error || error?.message || 'Failed to place order';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-neutral-900">Upload Files</h1>
            <p className="text-neutral-600">Upload your documents to {shop.name}</p>
          </div>
        </div>

        {/* Shop Info */}
        <Card className="mb-6 border-2 border-blue-200">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="notes">Printing Instructions</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    placeholder="Specify paper size, color, binding, copies, etc."
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
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-neutral-500 mb-4">Supports PDF, DOC, DOCX, JPG, PNG</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline">
                      Select Files
                    </Button>
                  </Label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files ({selectedFiles.length})</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-neutral-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit */}
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
              disabled={isLoading || selectedFiles.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadOrder;
