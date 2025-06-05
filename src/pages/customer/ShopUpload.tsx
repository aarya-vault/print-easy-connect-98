
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Star, 
  MapPin, 
  Phone,
  X,
  CheckCircle,
  Image,
  File
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const ShopUpload: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sample shop data based on slug
  const shopData = {
    id: 'shop1',
    name: 'Quick Print Solutions',
    address: 'Shop 12, MG Road, Bangalore',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalReviews: 245,
    services: ['Color Printing', 'Black & White', 'Binding', 'Scanning']
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };
      setUploadedFiles(prev => [...prev, newFile]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-neutral-600" />;
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0) {
      alert('Please fill in your details and upload at least one file.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to success page or order tracking
      navigate('/customer/order/success', { 
        state: { 
          orderId: 'PE' + Math.random().toString().substr(2, 6),
          shopName: shopData.name 
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 font-poppins">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-neutral-900">Upload Files to </span>
            <span className="bg-gradient-golden bg-clip-text text-transparent">{shopData.name}</span>
          </h1>
          <p className="text-neutral-600">Upload your files and provide printing instructions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-neutral-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shop Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">{shopData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-golden-500 fill-current" />
                    <span className="font-semibold text-neutral-900">{shopData.rating}</span>
                    <span className="text-sm text-neutral-500">({shopData.totalReviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{shopData.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">{shopData.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-2">Available Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {shopData.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${shopData.phone}`)}
                  className="w-full border-neutral-300 hover:bg-neutral-50 font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Shop
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name *</label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-neutral-200 focus:border-golden-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number *</label>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="border-neutral-200 focus:border-golden-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-golden-500 bg-golden-50' 
                      : 'border-neutral-300 hover:border-golden-400 hover:bg-golden-50/30'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="w-16 h-16 bg-gradient-golden-soft rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-golden-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Drop files here or click to browse</h3>
                  <p className="text-neutral-600 mb-4">Support for PDF, DOC, DOCX, JPG, PNG files</p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-golden-300 text-golden-700 hover:bg-golden-50"
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-neutral-900 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium text-neutral-900">{file.name}</p>
                              <p className="text-sm text-neutral-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:bg-red-50"
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

            {/* Instructions */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Printing Instructions (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Add any specific instructions for printing, binding, paper type, etc."
                  className="border-neutral-200 focus:border-golden-500 min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-900">Ready to submit your order?</h4>
                    <p className="text-sm text-neutral-600">The shop will review and contact you shortly</p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0 || isSubmitting}
                    className="bg-gradient-golden hover:shadow-golden text-white font-semibold px-8"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Submit Order
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopUpload;
