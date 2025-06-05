import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useLocation } from 'react-router-dom';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  Plus, 
  MessageCircle, 
  CheckCircle,
  MapPin,
  Star,
  Clock,
  Store,
  AlertCircle
} from 'lucide-react';
import { VisitedShop } from '@/types/shop';

type OrderType = 'digital' | 'physical' | null;

interface FileWithId {
  id: string;
  file: File;
  preview?: string;
}

const OrderCreationFlow: React.FC = () => {
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [orderDescription, setOrderDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileWithId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showAddFiles, setShowAddFiles] = useState(false);
  const [selectedShop, setSelectedShop] = useState<VisitedShop | null>(null);
  const [visitedShops, setVisitedShops] = useState<VisitedShop[]>([]);
  const [showNoVisitedShopsWarning, setShowNoVisitedShopsWarning] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Parse shop ID from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shopId = queryParams.get('shopId');
    
    // Fetch visited shops (in real app, this would be an API call)
    const mockVisitedShops: VisitedShop[] = [
      {
        id: 'shop1',
        name: 'Quick Print Solutions',
        address: 'Shop 12, MG Road, Bangalore',
        phone: '+91 98765 43210',
        email: 'contact@quickprint.com',
        rating: 4.8,
        totalReviews: 245,
        services: ['Color Printing', 'Black & White', 'Binding', 'Scanning'],
        equipment: ['Laser Printer', 'Scanner', 'Binding Machine'],
        operatingHours: {
          monday: { open: '9:00', close: '18:00', isOpen: true },
          tuesday: { open: '9:00', close: '18:00', isOpen: true },
          wednesday: { open: '9:00', close: '18:00', isOpen: true },
          thursday: { open: '9:00', close: '18:00', isOpen: true },
          friday: { open: '9:00', close: '18:00', isOpen: true },
          saturday: { open: '10:00', close: '16:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: false }
        },
        images: [],
        verified: true,
        lastVisited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        visitCount: 8,
        averageCompletionTime: '15-20 mins',
        orderHistory: [
          { orderId: 'PE123456', date: new Date(), amount: 250, status: 'completed' },
          { orderId: 'PE123455', date: new Date(), amount: 150, status: 'completed' }
        ]
      },
      {
        id: 'shop2',
        name: 'Campus Copy Center',
        address: 'Near College Gate, Whitefield',
        phone: '+91 87654 32109',
        email: 'info@campuscopy.com',
        rating: 4.5,
        totalReviews: 189,
        services: ['Photocopying', 'Scanning', 'Lamination'],
        equipment: ['Xerox Machine', 'High-speed Scanner'],
        operatingHours: {
          monday: { open: '8:00', close: '20:00', isOpen: true },
          tuesday: { open: '8:00', close: '20:00', isOpen: true },
          wednesday: { open: '8:00', close: '20:00', isOpen: true },
          thursday: { open: '8:00', close: '20:00', isOpen: true },
          friday: { open: '8:00', close: '20:00', isOpen: true },
          saturday: { open: '9:00', close: '18:00', isOpen: true },
          sunday: { open: '10:00', close: '16:00', isOpen: true }
        },
        images: [],
        verified: true,
        lastVisited: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        visitCount: 3,
        averageCompletionTime: '10-15 mins',
        orderHistory: [
          { orderId: 'PE123454', date: new Date(), amount: 75, status: 'completed' }
        ]
      }
    ];

    setVisitedShops(mockVisitedShops);

    if (shopId) {
      const shop = mockVisitedShops.find(s => s.id === shopId);
      if (shop) {
        setSelectedShop(shop);
      }
    }
  }, [location.search]);

  const generateFileId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileWithId[] = files.map(file => ({
      id: generateFileId(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const addMoreFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event);
    setShowAddFiles(false);
  };

  const handleSubmitOrder = async () => {
    if (!selectedShop) {
      setShowNoVisitedShopsWarning(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      const newOrderId = `PE${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);
      setOrderSubmitted(true);
      setIsSubmitting(false);
    }, 3000);
  };

  const handleShopSelect = (shop: VisitedShop) => {
    setSelectedShop(shop);
    setShowNoVisitedShopsWarning(false);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (orderSubmitted && orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-glass border-b border-neutral-200">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold">
              <span className="text-neutral-900">Print</span>
              <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-semibold text-neutral-900 mb-4">
                Order Confirmed!
              </h2>
              <p className="text-xl text-neutral-600 font-medium">
                Your order #{orderId} has been submitted successfully
              </p>
            </div>

            {/* Order Details Card */}
            <Card className="border-0 shadow-premium bg-white/80 backdrop-blur-lg mb-8">
              <CardHeader className="border-b border-neutral-100">
                <CardTitle className="text-xl font-medium text-neutral-900">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Status Steps */}
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-neutral-900 font-medium">Order Received</span>
                    <span className="text-xs text-neutral-500 ml-auto">Just now</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-gradient-golden rounded-full animate-pulse-golden"></div>
                    <span className="font-medium text-neutral-700">Shop Processing</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-neutral-300 rounded-full"></div>
                    <span className="text-neutral-400">Ready for Pickup</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-neutral-300 rounded-full"></div>
                    <span className="text-neutral-400">Completed</span>
                  </div>
                </div>

                {/* Shop Information */}
                <div className="bg-neutral-50 p-4 rounded-xl space-y-3">
                  <h3 className="font-medium text-neutral-900">Shop Information</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-golden-soft rounded-full flex items-center justify-center">
                      <Store className="w-5 h-5 text-golden-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{selectedShop?.name}</h4>
                      <div className="flex items-center text-sm text-neutral-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{selectedShop?.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 mt-2 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-golden-500 mr-1 fill-current" />
                      <span className="font-medium">{selectedShop?.rating}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Avg. time: {selectedShop?.averageCompletionTime}</span>
                    </div>
                  </div>
                </div>

                {/* File Management */}
                {orderType === 'digital' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-neutral-900">Files ({uploadedFiles.length})</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddFiles(true)}
                        className="border-golden-300 text-golden-700 hover:bg-golden-50 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Files
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {uploadedFiles.map((fileItem) => (
                        <div key={fileItem.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-neutral-200">
                          {getFileIcon(fileItem.file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatFileSize(fileItem.file.size)}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-600 hover:text-neutral-900"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add Files Modal */}
                    {showAddFiles && (
                      <div className="border-2 border-dashed border-golden-300 rounded-xl p-6 text-center bg-golden-50">
                        <Upload className="w-10 h-10 text-golden-600 mx-auto mb-4" />
                        <h4 className="font-medium text-neutral-900 mb-2">Add More Files</h4>
                        <p className="text-sm text-neutral-600 mb-6">
                          Upload additional files to this order
                        </p>
                        <input
                          type="file"
                          multiple
                          onChange={addMoreFiles}
                          className="hidden"
                          id="add-files"
                          accept="*/*"
                        />
                        <div className="space-y-3">
                          <label htmlFor="add-files">
                            <Button type="button" className="bg-gradient-golden hover:shadow-golden text-white font-semibold">
                              Choose Files
                            </Button>
                          </label>
                          <br />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowAddFiles(false)}
                            className="border-neutral-300 hover:bg-neutral-50 font-medium"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-6 border-t border-neutral-100">
                  <Button
                    onClick={() => setChatOpen(true)}
                    className="w-full bg-gradient-golden hover:shadow-golden text-white font-semibold"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat with Print Shop
                  </Button>
                  <Button
                    onClick={() => navigate('/customer/dashboard')}
                    variant="outline"
                    className="w-full border-neutral-300 hover:bg-neutral-50 font-medium"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EnhancedChatSystem 
          orderId={orderId}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins flex items-center justify-center">
        <Card className="border-0 shadow-premium bg-white/80 backdrop-blur-xl p-10 max-w-md mx-auto">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-golden-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900">Processing Your Order</h3>
            <p className="text-neutral-600 font-medium">Sending your order to {selectedShop?.name}...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (visitedShops.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
        <div className="bg-white/80 backdrop-blur-lg shadow-glass border-b border-neutral-200">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold">
              <span className="text-neutral-900">Print</span>
              <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-8 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">No Visited Shops</h2>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              You need to visit a print shop in person before placing orders through PrintEasy. This ensures quality service and proper verification.
            </p>
            <Button
              onClick={() => navigate('/customer/dashboard')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg shadow-glass border-b border-neutral-200">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold">
              <span className="text-neutral-900">Print</span>
              <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-neutral-900 mb-6">
                What would you like to print?
              </h2>
              <p className="text-xl text-neutral-600 font-medium">
                Choose your preferred method to get started
              </p>
            </div>

            {/* Shop Selection Section */}
            <div className="mb-16">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6 text-center">
                Select a shop you've visited
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {visitedShops.map((shop) => (
                  <Card 
                    key={shop.id} 
                    className={`border-2 transition-all duration-300 cursor-pointer ${
                      selectedShop?.id === shop.id 
                        ? 'border-golden-500 shadow-premium bg-golden-50/30' 
                        : 'border-neutral-200 shadow-glass bg-white/60 hover:border-golden-300'
                    }`}
                    onClick={() => handleShopSelect(shop)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-900 text-lg mb-2">{shop.name}</h4>
                          <div className="flex items-center text-sm text-neutral-600 mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{shop.address}</span>
                          </div>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-golden-500 mr-1 fill-current" />
                              <span className="font-medium">{shop.rating}</span>
                            </div>
                            <div className="flex items-center text-neutral-600">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{shop.averageCompletionTime}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {shop.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {shop.services.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{shop.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedShop?.id === shop.id && (
                          <div className="w-6 h-6 bg-gradient-golden rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {showNoVisitedShopsWarning && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-red-700 font-medium">
                    Please select a shop before continuing
                  </p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card 
                className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300 cursor-pointer group"
                onClick={() => setOrderType('digital')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-golden rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-neutral-900 mb-4">
                    Digital File Upload
                  </CardTitle>
                  <CardDescription className="text-neutral-600 leading-relaxed text-base font-medium">
                    Upload documents, photos, presentations from your device for immediate printing
                  </CardDescription>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300 cursor-pointer group"
                onClick={() => setOrderType('physical')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-neutral-100 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-10 h-10 text-neutral-600" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-neutral-900 mb-4">
                    Physical Item Description
                  </CardTitle>
                  <CardDescription className="text-neutral-600 leading-relaxed text-base font-medium">
                    Describe books, documents, or photos you want copied, scanned, or processed
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-glass border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            <span className="text-neutral-900">Print</span>
            <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
          </h1>
          <Button 
            variant="outline"
            onClick={() => setOrderType(null)}
            className="border-neutral-300 hover:bg-neutral-50 font-medium"
          >
            ← Change Type
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-neutral-900 mb-4">
              {orderType === 'digital' ? 'Upload Your Files' : 'Describe Your Item'}
            </h2>
            <p className="text-neutral-600 font-medium">
              {orderType === 'digital' 
                ? 'Upload files and specify your exact printing requirements'
                : 'Provide detailed description of the physical item you want processed'
              }
            </p>
          </div>

          <Card className="border-0 shadow-premium bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-neutral-900">
                  {orderType === 'digital' ? 'File Upload & Instructions' : 'Item Description & Requirements'}
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-golden-soft text-golden-700 font-medium">
                    {selectedShop?.name}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOrderType(null)}
                    className="h-8 w-8 p-0 text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {orderType === 'digital' && (
                <div>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-10 text-center hover:border-golden-500 transition-colors">
                    <Upload className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="*/*"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <h3 className="text-xl font-medium text-neutral-900 mb-3">
                        Upload Your Files
                      </h3>
                      <p className="text-neutral-600 mb-6 font-medium">
                        Drag & drop files here or click to browse
                      </p>
                      <Button type="button" className="bg-gradient-golden hover:shadow-golden text-white font-semibold">
                        Choose Files
                      </Button>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <h4 className="font-semibold text-neutral-900">Uploaded Files:</h4>
                      <div className="space-y-3">
                        {uploadedFiles.map((fileItem) => (
                          <div key={fileItem.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200 shadow-soft">
                            <div className="flex items-center space-x-4">
                              {getFileIcon(fileItem.file.type)}
                              <div>
                                <span className="font-medium text-neutral-900">{fileItem.file.name}</span>
                                <p className="text-sm text-neutral-500">
                                  {formatFileSize(fileItem.file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFile(fileItem.id)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                  {orderType === 'digital' ? 'Print Instructions' : 'Item Description'}
                </label>
                <Textarea
                  placeholder={orderType === 'digital' 
                    ? "Describe exactly how you want these files printed:\n\n• Paper size (A4, A3, etc.)\n• Color or black & white\n• Single or double-sided\n• Binding requirements\n• Quantity needed\n• Any special instructions"
                    : "Describe the physical item in detail:\n\n• Type of item (book, documents, photos)\n• Number of pages/items\n• Condition and quality\n• Desired output format\n• Special requirements"
                  }
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="min-h-40 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium text-neutral-800"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={!orderDescription.trim() || (orderType === 'digital' && uploadedFiles.length === 0) || !selectedShop}
                className="w-full bg-gradient-golden hover:shadow-golden text-white font-semibold h-14 text-lg rounded-xl shadow-soft hover:shadow-premium transition-all duration-300"
              >
                Submit Order to {selectedShop?.name}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderCreationFlow;
