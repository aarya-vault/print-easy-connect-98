
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Upload, 
  UserCheck, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  allowsOfflineOrders: boolean;
  isActive: boolean;
}

const EnhancedOrderFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { shopSlug } = useParams();
  
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [orderType, setOrderType] = useState<'uploaded-files' | 'walk-in' | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [orderDetails, setOrderDetails] = useState({
    description: '',
    specialInstructions: '',
    isUrgent: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);

  // Mock shops data
  useEffect(() => {
    const mockShops: Shop[] = [
      {
        id: '1',
        name: 'Quick Print Solutions',
        address: 'Shop 12, MG Road, Bangalore, Karnataka 560001',
        phone: '+91 98765 43210',
        email: 'shop@printeasy.com',
        rating: 4.5,
        allowsOfflineOrders: true,
        isActive: true
      },
      {
        id: '2',
        name: 'Digital Print Hub',
        address: 'Plot 45, Electronic City, Bangalore, Karnataka 560100',
        phone: '+91 98765 43211',
        email: 'digital@printeasy.com',
        rating: 4.2,
        allowsOfflineOrders: false,
        isActive: true
      }
    ];
    setShops(mockShops);

    // Auto-select shop if coming from QR scan
    if (shopSlug) {
      const shop = mockShops.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === shopSlug);
      if (shop) {
        setSelectedShop(shop);
        setStep(2);
      }
    }
  }, [shopSlug]);

  // Auto-fetch customer details if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerDetails({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    setStep(2);
  };

  const handleOrderTypeSelect = (type: 'uploaded-files' | 'walk-in') => {
    setOrderType(type);
    setStep(3);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!customerDetails.name || !customerDetails.phone) {
        toast.error('Name and phone are required');
        return;
      }

      if (orderType === 'uploaded-files' && files.length === 0) {
        toast.error('Please select files to upload');
        return;
      }

      if (!orderDetails.description.trim()) {
        toast.error('Please provide order description');
        return;
      }

      // Create order
      const orderData = {
        shopId: selectedShop?.id,
        orderType,
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        description: orderDetails.description,
        specialInstructions: orderDetails.specialInstructions,
        isUrgent: orderDetails.isUrgent,
        files: files
      };

      console.log('Creating order:', orderData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate order ID
      const orderId = orderType === 'uploaded-files' ? 
        `UF${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}` :
        `WI${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      toast.success('Order created successfully!');
      navigate(`/customer/order/success/${orderId}`);

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-golden-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {step > 1 ? <Check className="w-4 h-4" /> : '1'}
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-golden-500' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-golden-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {step > 2 ? <Check className="w-4 h-4" /> : '2'}
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-golden-500' : 'bg-gray-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 3 ? 'bg-golden-500 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          3
        </div>
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {renderStepIndicator()}
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Select a Print Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shops.filter(shop => shop.isActive).map((shop) => (
                  <Card 
                    key={shop.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-golden-300"
                    onClick={() => handleShopSelect(shop)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg text-gray-900">{shop.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{shop.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{shop.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{shop.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant="default">Upload Orders</Badge>
                          {shop.allowsOfflineOrders && (
                            <Badge variant="secondary">Walk-in Orders</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {renderStepIndicator()}
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Choose Order Type</CardTitle>
              <p className="text-center text-gray-600">
                Selected shop: <span className="font-semibold">{selectedShop?.name}</span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Files Option */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleOrderTypeSelect('uploaded-files')}
                >
                  <CardContent className="p-6 text-center">
                    <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Files</h3>
                    <p className="text-gray-600 mb-4">
                      Upload your documents for printing, binding, or other services
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">Digital Files</Badge>
                  </CardContent>
                </Card>

                {/* Walk-in Option */}
                {selectedShop?.allowsOfflineOrders ? (
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
                    onClick={() => handleOrderTypeSelect('walk-in')}
                  >
                    <CardContent className="p-6 text-center">
                      <UserCheck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Walk-in Order</h3>
                      <p className="text-gray-600 mb-4">
                        Create an order for physical documents or in-person services
                      </p>
                      <Badge className="bg-purple-100 text-purple-800">In-Person</Badge>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-gray-200 opacity-50">
                    <CardContent className="p-6 text-center">
                      <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-500 mb-2">Walk-in Order</h3>
                      <p className="text-gray-500 mb-4">
                        This shop only accepts uploaded file orders
                      </p>
                      <Badge variant="secondary">Not Available</Badge>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {renderStepIndicator()}
        
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <p className="text-gray-600">
              {orderType === 'uploaded-files' ? 'Upload Files Order' : 'Walk-in Order'} at {selectedShop?.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Details - Pre-filled and mostly read-only */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className={user?.name ? 'bg-gray-50' : ''}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className={user?.phone ? 'bg-gray-50' : ''}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    className={user?.email ? 'bg-gray-50' : ''}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* File Upload for uploaded-files orders */}
            {orderType === 'uploaded-files' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop files here or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Selected Files:</h4>
                      <div className="space-y-1">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{file.name}</span>
                            <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Description</h3>
              <div>
                <Label htmlFor="description">Describe your printing requirements *</Label>
                <Textarea
                  id="description"
                  value={orderDetails.description}
                  onChange={(e) => setOrderDetails({...orderDetails, description: e.target.value})}
                  placeholder="e.g., Print 10 copies of resume, color printing, double-sided..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={orderDetails.specialInstructions}
                  onChange={(e) => setOrderDetails({...orderDetails, specialInstructions: e.target.value})}
                  placeholder="Any special requirements or instructions..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Order Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Options</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={orderDetails.isUrgent}
                  onChange={(e) => setOrderDetails({...orderDetails, isUrgent: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="urgent" className="text-sm">
                  Mark as urgent (may incur additional charges)
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
              >
                Create Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOrderFlow;
