
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { Upload, Store, FileText, User, Phone } from 'lucide-react';
import apiService from '@/services/api';

const ShopUploadPage: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<'uploaded-files' | 'walk-in'>('uploaded-files');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    description: ''
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        if (!shopSlug) {
          toast.error('Invalid shop URL');
          navigate('/');
          return;
        }

        console.log('🔍 Fetching shop data for slug:', shopSlug);
        const response = await apiService.getShopBySlug(shopSlug);
        setShop(response.shop);
        console.log('✅ Shop data loaded:', response.shop);
      } catch (error: any) {
        console.error('❌ Failed to load shop:', error);
        toast.error('Shop not found');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [shopSlug, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    console.log('📁 Files selected:', uploadedFiles.length);
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

    if (orderType === 'uploaded-files' && files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please describe your printing requirements');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📝 Creating order:', { orderType, shopId: shop.id });

      // Create order
      const orderData = {
        shopId: shop.id,
        orderType,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        description: formData.description
      };

      const orderResponse = await apiService.createOrder(orderData);
      const orderId = orderResponse.order.id;

      console.log('✅ Order created:', orderId);

      // Upload files if it's an upload order
      if (orderType === 'uploaded-files' && files.length > 0) {
        console.log('📤 Uploading files...');
        await apiService.uploadFiles(files, orderId);
        console.log('✅ Files uploaded successfully');
      }

      toast.success('Order placed successfully!');
      
      // Reset form
      setFormData({ customerName: '', customerPhone: '', description: '' });
      setFiles([]);
      
      // Show success message with order ID
      toast.success(`Order #${orderId} created! You will be notified when ready.`);

    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <Store className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Shop Not Found</h2>
            <p className="text-neutral-600 mb-4">The shop you're looking for doesn't exist or is no longer available.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Shop Header */}
        <Card className="mb-6 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Store className="w-8 h-8 text-golden-600" />
              <CardTitle className="text-2xl font-bold">{shop.name}</CardTitle>
            </div>
            <p className="text-neutral-600">{shop.address}</p>
            <p className="text-sm text-neutral-500">{shop.phone} • {shop.email}</p>
          </CardHeader>
        </Card>

        {/* Order Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Place Your Order</CardTitle>
            <p className="text-neutral-600">Choose your service type and provide details</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Type Selection */}
              <Tabs value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="uploaded-files" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </TabsTrigger>
                  <TabsTrigger value="walk-in" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Walk-in Order
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="uploaded-files" className="space-y-4">
                  <div>
                    <Label>Upload Your Files *</Label>
                    <FileUpload
                      onFilesChange={handleFileUpload}
                      maxFiles={10}
                      accept="*"
                      className="mt-2"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Upload documents you want to print. All file types accepted, no size limits.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="walk-in" className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Walk-in Order</h4>
                    <p className="text-sm text-blue-700">
                      You'll bring your documents to the shop. Please describe what you need printed so the shop can prepare.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          handleInputChange({
                            target: { name: 'customerPhone', value }
                          } as any);
                        }
                      }}
                      placeholder="10-digit phone number"
                      className="pl-10"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formData.customerPhone.length}/10 digits
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Printing Requirements *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what you need: number of copies, paper type, binding, etc."
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </div>
                ) : (
                  `Place ${orderType === 'uploaded-files' ? 'Upload' : 'Walk-in'} Order`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-500">
            Need help? Contact {shop.name} at {shop.phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopUploadPage;
