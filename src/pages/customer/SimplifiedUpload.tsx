
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Star, 
  MapPin, 
  Phone,
  X,
  CheckCircle,
  Image,
  File,
  ArrowLeft,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const SimplifiedUpload: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sample shop data
  const shopData = {
    name: 'Quick Print Solutions',
    address: 'Shop 12, MG Road, Bangalore',
    phone: '9876543210',
    rating: 4.8,
    totalReviews: 245
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      toast.success('File added successfully!');
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
    toast('File removed');
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
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-neutral-600" />;
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0) {
      toast.error('Please fill in your details and upload at least one file.');
      return;
    }

    setIsSubmitting(true);
    
    toast('Processing your order...');
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Order submitted successfully!');
      navigate('/customer/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/order/new')}
            className="mb-4 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop Selection
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-neutral-900">Upload Files to </span>
            <span className="bg-gradient-to-r from-golden-500 to-golden-600 bg-clip-text text-transparent">{shopData.name}</span>
          </h1>
          <p className="text-neutral-600">Upload your documents and provide your contact details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-neutral-900 flex items-center gap-2">
                  <Building className="w-5 h-5" />
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
            {/* File Upload */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Upload Your Files</CardTitle>
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
                  <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
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

            {/* Contact Details */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-neutral-900">Your Contact Details</CardTitle>
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
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email (Optional)</label>
                  <Input
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="border-neutral-200 focus:border-golden-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Add any specific instructions for printing, binding, etc."
                    className="border-neutral-200 focus:border-golden-500 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0 || isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Order...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Submit Order
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedUpload;
