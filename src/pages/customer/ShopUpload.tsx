
import React, { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
  Eye,
  Download,
  Printer,
  Palette,
  Copy,
  BookOpen,
  Clock,
  IndianRupee,
  ArrowLeft,
  Zap,
  Shield,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  pages?: number;
  preview?: string;
}

interface PrintOptions {
  copies: number;
  paperSize: string;
  paperType: string;
  color: string;
  binding: string;
  orientation: string;
  urgentDelivery: boolean;
}

const ShopUpload: React.FC = () => {
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
  const [currentStep, setCurrentStep] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    copies: 1,
    paperSize: 'A4',
    paperType: 'Regular',
    color: 'Black & White',
    binding: 'None',
    orientation: 'Portrait',
    urgentDelivery: false
  });

  // Sample shop data based on slug
  const shopData = {
    id: 'shop1',
    name: 'Quick Print Solutions',
    address: 'Shop 12, MG Road, Bangalore',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalReviews: 245,
    services: ['Color Printing', 'Black & White', 'Binding', 'Scanning'],
    specialties: ['Same Day Delivery', '24/7 Service', 'Bulk Discounts'],
    workingHours: '24/7',
    deliveryTime: '30 mins'
  };

  const paperSizes = ['A4', 'A3', 'Letter', 'Legal', 'A5'];
  const paperTypes = ['Regular (70gsm)', 'Premium (80gsm)', 'Photo Paper', 'Card Stock'];
  const colorOptions = ['Black & White', 'Color'];
  const bindingOptions = ['None', 'Spiral Binding', 'Ring Binding', 'Stapled'];

  const calculateCost = useCallback(() => {
    let baseCost = 0;
    const totalPages = uploadedFiles.reduce((sum, file) => sum + (file.pages || 1), 0);
    
    // Base pricing
    if (printOptions.color === 'Black & White') {
      baseCost = totalPages * 2; // ₹2 per page
    } else {
      baseCost = totalPages * 5; // ₹5 per page
    }
    
    // Paper type multiplier
    const paperMultiplier = {
      'Regular (70gsm)': 1,
      'Premium (80gsm)': 1.2,
      'Photo Paper': 2,
      'Card Stock': 1.5
    };
    baseCost *= paperMultiplier[printOptions.paperType as keyof typeof paperMultiplier] || 1;
    
    // Copies
    baseCost *= printOptions.copies;
    
    // Binding cost
    const bindingCost = {
      'None': 0,
      'Spiral Binding': 25,
      'Ring Binding': 35,
      'Stapled': 10
    };
    baseCost += bindingCost[printOptions.binding as keyof typeof bindingCost] || 0;
    
    // Urgent delivery surcharge
    if (printOptions.urgentDelivery) {
      baseCost *= 1.25; // 25% extra for urgent delivery
    }
    
    return Math.round(baseCost);
  }, [uploadedFiles, printOptions]);

  // Update cost when relevant state changes
  useEffect(() => {
    setTotalCost(calculateCost());
  }, [calculateCost]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Generate a preview for images and PDFs
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      // Create object URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      // Simulate page count extraction (in real app, we'd actually extract from PDFs)
      const estimatedPages = isPdf ? Math.max(1, Math.floor(file.size / 40000)) : 1;
      
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        preview: isImage ? fileUrl : undefined,
        pages: estimatedPages
      };
      
      setUploadedFiles(prev => [...prev, newFile]);

      // Show success toast
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
    toast('File removed', {
      description: 'The file has been removed from your order'
    });
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

  const handleUpdateCopies = (value: number) => {
    if (value < 1) value = 1;
    if (value > 100) value = 100;
    setPrintOptions({...printOptions, copies: value});
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0) {
      toast.error('Please fill in your details and upload at least one file.');
      return;
    }

    setIsSubmitting(true);
    
    // Show progress toasts
    toast('Processing your order...', {
      description: 'This will take just a moment'
    });
    
    // Simulate API call with progress
    setTimeout(() => {
      toast('Uploading files...', {
        description: `${uploadedFiles.length} files are being transferred`
      });
      
      // Final success after another second
      setTimeout(() => {
        setIsSubmitting(false);
        
        toast.success('Order submitted successfully!', {
          description: 'You will receive updates on your order status'
        });
        
        // Navigate to success page or order tracking
        navigate('/customer/order/success', { 
          state: { 
            orderId: 'PE' + Math.random().toString().substr(2, 6),
            shopName: shopData.name 
          }
        });
      }, 1500);
    }, 1500);
  };

  const renderStep1 = () => (
    <>
      <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-neutral-900">Step 1: Upload Your Files</CardTitle>
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
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-neutral-500">{formatFileSize(file.size)}</span>
                          {file.pages && (
                            <span className="text-sm text-neutral-500">
                              {file.pages} {file.pages === 1 ? 'page' : 'pages'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.preview && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={uploadedFiles.length === 0}
              className="bg-gradient-golden hover:shadow-golden text-white"
            >
              Continue to Printing Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  const renderStep2 = () => (
    <>
      <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-neutral-900">Step 2: Printing Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Copy className="inline-block w-4 h-4 mr-2" />
                  Number of Copies
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateCopies(printOptions.copies - 1)}
                    className="rounded-r-none"
                    disabled={printOptions.copies <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={printOptions.copies}
                    onChange={(e) => handleUpdateCopies(parseInt(e.target.value) || 1)}
                    min={1}
                    max={100}
                    className="rounded-none text-center w-20 border-x-0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateCopies(printOptions.copies + 1)}
                    className="rounded-l-none"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Paper Size
                </label>
                <Select
                  value={printOptions.paperSize}
                  onValueChange={(value) => setPrintOptions({...printOptions, paperSize: value})}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    {paperSizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Paper Type
                </label>
                <Select
                  value={printOptions.paperType}
                  onValueChange={(value) => setPrintOptions({...printOptions, paperType: value})}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue placeholder="Select paper type" />
                  </SelectTrigger>
                  <SelectContent>
                    {paperTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Palette className="inline-block w-4 h-4 mr-2" />
                  Color Options
                </label>
                <Tabs 
                  defaultValue={printOptions.color}
                  onValueChange={(value) => setPrintOptions({...printOptions, color: value})}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Black & White">Black & White</TabsTrigger>
                    <TabsTrigger value="Color">Color</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <BookOpen className="inline-block w-4 h-4 mr-2" />
                  Binding
                </label>
                <Select
                  value={printOptions.binding}
                  onValueChange={(value) => setPrintOptions({...printOptions, binding: value})}
                >
                  <SelectTrigger className="border-neutral-200">
                    <SelectValue placeholder="Select binding option" />
                  </SelectTrigger>
                  <SelectContent>
                    {bindingOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="urgent" 
                  checked={printOptions.urgentDelivery}
                  onCheckedChange={(checked) => 
                    setPrintOptions({...printOptions, urgentDelivery: checked === true})
                  }
                />
                <div className="grid gap-1">
                  <label
                    htmlFor="urgent"
                    className="text-sm font-medium leading-none flex items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Zap className="w-4 h-4 text-golden-600" />
                    Urgent Delivery
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Extra 25% charge for priority processing and quick delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="border-neutral-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Files
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-gradient-golden hover:shadow-golden text-white"
            >
              Continue to Customer Info
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Cost Summary Card */}
      <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-neutral-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Cost Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Files:</span>
              <span className="text-neutral-900">{uploadedFiles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Pages:</span>
              <span className="text-neutral-900">
                {uploadedFiles.reduce((sum, file) => sum + (file.pages || 1), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Copies:</span>
              <span className="text-neutral-900">{printOptions.copies}</span>
            </div>
            {printOptions.binding !== 'None' && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Binding:</span>
                <span className="text-neutral-900">{printOptions.binding}</span>
              </div>
            )}
            {printOptions.urgentDelivery && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Urgent Delivery:</span>
                <span className="text-golden-600">+25%</span>
              </div>
            )}
            <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-neutral-900">Total Estimate:</span>
              <span className="font-bold text-golden-600 text-lg">₹{totalCost}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              * Final price may vary based on actual page count and shop assessment
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  const renderStep3 = () => (
    <>
      <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-neutral-900">Step 3: Your Contact Details</CardTitle>
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
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email (For Order Updates)</label>
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
              placeholder="Add any specific instructions for printing, binding, paper type, etc."
              className="border-neutral-200 focus:border-golden-500 min-h-[100px]"
            />
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
              className="border-neutral-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Options
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!customerName.trim() || !customerPhone.trim() || uploadedFiles.length === 0 || isSubmitting}
              className="bg-gradient-golden hover:shadow-golden text-white font-semibold"
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
      
      {/* Order Summary Card */}
      <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-neutral-900">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="text-sm font-medium text-neutral-900">Files ({uploadedFiles.length})</div>
            <div className="text-sm text-neutral-600 truncate max-w-full">
              {uploadedFiles.map(f => f.name).join(', ')}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-neutral-900">Print Options</div>
            <div className="text-sm text-neutral-600">
              {printOptions.copies} {printOptions.copies > 1 ? 'copies' : 'copy'}, {printOptions.paperSize}, {printOptions.color}
              {printOptions.binding !== 'None' && `, ${printOptions.binding}`}
              {printOptions.urgentDelivery && ', Urgent Delivery'}
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-2 flex items-center justify-between">
            <span className="font-medium">Total Price:</span>
            <span className="font-bold text-golden-600 text-lg">₹{totalCost}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <div className="container mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className="flex flex-col items-center"
                onClick={() => {
                  // Allow moving backward freely, but restrict forward navigation based on files
                  if (step < currentStep || (step === 2 && uploadedFiles.length > 0) || (step === 3 && uploadedFiles.length > 0)) {
                    setCurrentStep(step);
                  }
                }}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${currentStep === step 
                    ? 'bg-gradient-golden text-white font-bold' 
                    : currentStep > step 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  } ${(step < currentStep || (step === 2 && uploadedFiles.length > 0) || (step === 3 && uploadedFiles.length > 0)) ? 'cursor-pointer hover:shadow-md' : ''}`}
                >
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <div 
                  className={`text-sm ${
                    currentStep === step 
                      ? 'font-medium text-neutral-900' 
                      : currentStep > step 
                        ? 'text-green-700' 
                        : 'text-neutral-500'
                  }`}
                >
                  {step === 1 ? 'Files' : step === 2 ? 'Options' : 'Details'}
                </div>
              </div>
            ))}
            
            {/* Connecting lines */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2/3 flex justify-between z-[-1]">
              <div className={`h-0.5 w-full ${currentStep > 1 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
              <div className={`h-0.5 w-full ${currentStep > 2 ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
            </div>
          </div>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-neutral-900">Upload Files to </span>
            <span className="bg-gradient-golden bg-clip-text text-transparent">{shopData.name}</span>
          </h1>
          <p className="text-neutral-600">
            {currentStep === 1 
              ? 'Upload your documents and files for printing'
              : currentStep === 2
                ? 'Choose your printing and finishing options'
                : 'Add your contact information to complete your order'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg sticky top-8">
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
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Working Hours: {shopData.workingHours}</span>
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
                
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-2">Shop Specialties:</h4>
                  <div className="space-y-2">
                    {shopData.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index === 0 ? (
                          <Zap className="w-4 h-4 text-golden-600" />
                        ) : index === 1 ? (
                          <Clock className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Award className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="text-sm text-neutral-700">{specialty}</span>
                      </div>
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

          {/* Upload Form Steps */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopUpload;
