
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Users, FileText, Phone, MapPin, Star } from 'lucide-react';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useDropzone } from 'react-dropzone';

const NewOrderFlow: React.FC = () => {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<'uploaded-files' | 'walk-in' | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shopSlug) {
      fetchShop();
    }
  }, [shopSlug]);

  useEffect(() => {
    setCustomerName(user?.name || '');
    setCustomerPhone(user?.phone || '');
  }, [user]);

  const fetchShop = async () => {
    try {
      const response = await apiService.getShopBySlug(shopSlug!);
      setShop(response.shop);
    } catch (error) {
      toast.error('Shop not found');
      navigate('/customer/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    disabled: orderType !== 'uploaded-files'
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderType) {
      toast.error('Please select an order type');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    if (orderType === 'uploaded-files' && files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for order with files
      const formData = new FormData();
      formData.append('shopId', shop.id.toString());
      formData.append('orderType', orderType);
      formData.append('description', description);
      formData.append('customerName', customerName);
      formData.append('customerPhone', customerPhone);

      // Add files for uploaded-files orders
      if (orderType === 'uploaded-files') {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      
      toast.success('Order placed successfully!');
      navigate(`/customer/order-success/${result.order.id}`);
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading shop information...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Shop not found</p>
          <Button onClick={() => navigate('/customer/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
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

        {/* Shop Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-golden-100 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-golden-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{shop.name}</h2>
                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {shop.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {shop.phone}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{shop.rating}</span>
                  </div>
                  <Badge variant={shop.is_active ? 'default' : 'secondary'}>
                    {shop.is_active ? 'Open' : 'Closed'}
                  </Badge>
                  {shop.allows_offline_orders && (
                    <Badge variant="outline">Walk-in Available</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Type Selection */}
        {!orderType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Choose Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="border-2 border-dashed border-neutral-200 rounded-lg p-6 hover:border-golden-500 hover:bg-golden-50 cursor-pointer transition-colors"
                  onClick={() => setOrderType('uploaded-files')}
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-golden-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Upload Files</h3>
                    <p className="text-sm text-neutral-600">Upload your digital files for printing</p>
                  </div>
                </div>

                {shop.allows_offline_orders && (
                  <div 
                    className="border-2 border-dashed border-neutral-200 rounded-lg p-6 hover:border-golden-500 hover:bg-golden-50 cursor-pointer transition-colors"
                    onClick={() => setOrderType('walk-in')}
                  >
                    <div className="text-center">
                      <Users className="w-12 h-12 text-golden-600 mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Walk-in Service</h3>
                      <p className="text-sm text-neutral-600">Book a visit to the shop with your documents</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Form */}
        {orderType && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {orderType === 'uploaded-files' ? <Upload className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                  {orderType === 'uploaded-files' ? 'Upload Files Order' : 'Walk-in Service Order'}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setOrderType(null)}>
                  Change Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload for uploaded-files orders */}
                {orderType === 'uploaded-files' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Upload Files *
                    </label>
                    <div 
                      {...getRootProps()} 
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-golden-500 bg-golden-50' : 'border-neutral-300 hover:border-golden-500'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">
                        {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Supports PDF, DOC, DOCX, JPG, PNG files
                      </p>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-neutral-50 p-2 rounded">
                              <span className="text-sm">{file.name}</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {orderType === 'uploaded-files' ? 'Printing Instructions *' : 'Service Description *'}
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      orderType === 'uploaded-files' 
                        ? "Describe your printing requirements (paper size, binding, copies, etc.)"
                        : "Describe the service you need (documents to print, binding requirements, etc.)"
                    }
                    className="min-h-[100px]"
                    required
                  />
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Name *
                    </label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !description.trim() || (orderType === 'uploaded-files' && files.length === 0)}
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
        )}
      </div>
    </div>
  );
};

export default NewOrderFlow;
