import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, ArrowLeft, Store, MapPin, Phone, Mail, QrCode } from 'lucide-react';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Shop } from '@/types/api';

const UploadPage: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    customerName: user?.name || '',
    customerPhone: user?.phone || ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopSlug) {
        toast.error('Invalid shop URL');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);

        console.log('🔍 Fetching shop data for slug:', shopSlug);
        const response = await apiService.getShopBySlug(shopSlug);
        // Extract shop data properly from response
        const shopData = response?.shop || response;
        setShop(shopData);
        console.log('✅ Shop data loaded:', shopData);
      } catch (error: any) {
        console.error('❌ Failed to load shop:', error);
        toast.error('Shop not found');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadShopData();
  }, [shopSlug, navigate]);

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
    
    if (!formData.notes.trim()) {
      toast.error('Please describe your printing requirements');
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!shop) {
      toast.error('Shop information not available');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📤 Submitting order...');

      const orderFormData = new FormData();
      orderFormData.append('shopId', shop.id);
      orderFormData.append('orderType', 'digital');
      orderFormData.append('notes', formData.notes);
      orderFormData.append('customerName', formData.customerName);
      orderFormData.append('customerPhone', formData.customerPhone);

      Array.from(selectedFiles).forEach(file => {
        orderFormData.append('files', file);
      });

      const orderResponse = await apiService.createOrder(orderFormData);
      const orderData = orderResponse?.data;
      const orderId = orderData?.id;

      console.log('✅ Order created:', orderId);

      toast.success('Order placed successfully!');
      
      // Navigate to order success page or customer dashboard
      if (user) {
        navigate('/customer/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading shop information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100 p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Shop Not Found</h1>
          <p className="text-neutral-600 mb-6">The shop you're looking for doesn't exist or is no longer available.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shop Information Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Store className="w-6 h-6" />
                  Shop Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{shop.name}</h2>
                  {shop.description && (
                    <p className="text-sm text-neutral-600 mt-2">{shop.description}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-500 mt-1" />
                    <p className="text-sm text-neutral-700">{shop.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <p className="text-sm text-neutral-700">{shop.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-neutral-500" />
                    <p className="text-sm text-neutral-700">{shop.email}</p>
                  </div>
                </div>

                {shop.allows_offline_orders && (
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-3">
                      This shop also accepts walk-in orders. You can visit them directly!
                    </p>
                    <Link 
                      to={`/shop/${shopSlug}/walk-in`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <QrCode className="w-4 h-4" />
                      Book a walk-in order
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
                  <Upload className="w-8 h-8" />
                  Upload Files for Printing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="files" className="text-neutral-900 font-medium">Select Files *</Label>
                    <Input
                      id="files"
                      name="files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="h-12 border-2 border-neutral-200 focus:border-blue-500"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      required
                    />
                    <p className="text-sm text-neutral-500 mt-2">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="notes" className="text-neutral-900 font-medium">
                      Printing Requirements *
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Describe your printing needs (e.g., 10 copies, double-sided, color printing, binding, paper size)"
                      required
                      rows={4}
                      className="border-2 border-neutral-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="text-neutral-900 font-medium">Your Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="h-12 border-2 border-neutral-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone" className="text-neutral-900 font-medium">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="Your phone number"
                        required
                        className="h-12 border-2 border-neutral-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading Files...
                      </div>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Place Order
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
