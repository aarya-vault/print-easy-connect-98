
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';
import { LoadingState } from '@/components/ui/loading-states';
import { Upload, FileText, Image, X, Plus, MessageCircle, CheckCircle } from 'lucide-react';

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
  const navigate = useNavigate();

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
    setIsSubmitting(true);
    
    // Simulate order submission
    setTimeout(() => {
      const newOrderId = `PE${Date.now().toString().slice(-6)}`;
      setOrderId(newOrderId);
      setOrderSubmitted(true);
      setIsSubmitting(false);
    }, 3000);
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
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-2xl font-light text-neutral-900">
              <span className="text-neutral-900">Print</span>
              <span className="text-yellow-500 font-medium">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-light text-neutral-900 mb-4">
                Order Confirmed!
              </h2>
              <p className="text-lg text-neutral-600">
                Your order #{orderId} has been submitted successfully
              </p>
            </div>

            {/* Order Details Card */}
            <Card className="border border-neutral-200 shadow-soft bg-white mb-8">
              <CardHeader className="border-b border-neutral-100">
                <CardTitle className="text-xl font-medium text-neutral-900">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Status Steps */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-neutral-900 font-medium">Order Received</span>
                    <span className="text-xs text-neutral-500 ml-auto">Just now</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse-soft"></div>
                    <span className="text-neutral-600">Matching with Print Shop</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
                    <span className="text-neutral-400">Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
                    <span className="text-neutral-400">Ready for Pickup</span>
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
                        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Files
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {uploadedFiles.map((fileItem) => (
                        <div key={fileItem.id} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                          {getFileIcon(fileItem.file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {formatFileSize(fileItem.file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Files Modal */}
                    {showAddFiles && (
                      <div className="border-2 border-dashed border-yellow-300 rounded-xl p-6 text-center bg-yellow-50">
                        <Upload className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                        <h4 className="font-medium text-neutral-900 mb-2">Add More Files</h4>
                        <p className="text-sm text-neutral-600 mb-4">
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
                        <div className="space-y-2">
                          <label htmlFor="add-files">
                            <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                              Choose Files
                            </Button>
                          </label>
                          <br />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowAddFiles(false)}
                            className="border-neutral-300 hover:bg-neutral-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <Button
                    onClick={() => setChatOpen(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Print Shop
                  </Button>
                  <Button
                    onClick={() => navigate('/customer/dashboard')}
                    variant="outline"
                    className="w-full border-neutral-300 hover:bg-neutral-50"
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="border border-neutral-200 shadow-soft bg-white p-8 max-w-md mx-auto">
          <div className="text-center space-y-6">
            <LoadingState variant="spinner" size="lg" />
            <h3 className="text-xl font-medium text-neutral-900">Processing Your Order</h3>
            <p className="text-neutral-600">We're matching you with the perfect print shop...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!orderType) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="container mx-auto px-6 py-6">
            <h1 className="text-2xl font-light text-neutral-900">
              <span className="text-neutral-900">Print</span>
              <span className="text-yellow-500 font-medium">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-neutral-900 mb-4">
                What would you like to print?
              </h2>
              <p className="text-lg text-neutral-600">
                Choose your preferred method to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card 
                className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-all duration-300 cursor-pointer group"
                onClick={() => setOrderType('digital')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Upload className="w-8 h-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl font-medium text-neutral-900 mb-3">
                    Digital File Upload
                  </CardTitle>
                  <CardDescription className="text-neutral-600 leading-relaxed">
                    Upload documents, photos, presentations from your device for immediate printing
                  </CardDescription>
                </CardContent>
              </Card>

              <Card 
                className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-all duration-300 cursor-pointer group"
                onClick={() => setOrderType('physical')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                    <FileText className="w-8 h-8 text-neutral-600" />
                  </div>
                  <CardTitle className="text-xl font-medium text-neutral-900 mb-3">
                    Physical Item Description
                  </CardTitle>
                  <CardDescription className="text-neutral-600 leading-relaxed">
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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-light text-neutral-900">
            <span className="text-neutral-900">Print</span>
            <span className="text-yellow-500 font-medium">Easy</span>
          </h1>
          <Button 
            variant="outline"
            onClick={() => setOrderType(null)}
            className="border-neutral-300 hover:bg-neutral-50"
          >
            ← Change Type
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-light text-neutral-900 mb-4">
              {orderType === 'digital' ? 'Upload Your Files' : 'Describe Your Item'}
            </h2>
            <p className="text-neutral-600">
              {orderType === 'digital' 
                ? 'Upload files and specify your exact printing requirements'
                : 'Provide detailed description of the physical item you want processed'
              }
            </p>
          </div>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-neutral-900">
                {orderType === 'digital' ? 'File Upload & Instructions' : 'Item Description & Requirements'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {orderType === 'digital' && (
                <div>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-yellow-500 transition-colors">
                    <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="*/*"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">
                        Upload Your Files
                      </h3>
                      <p className="text-neutral-600 mb-4">
                        Drag & drop files here or click to browse
                      </p>
                      <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        Choose Files
                      </Button>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-neutral-900">Uploaded Files:</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((fileItem) => (
                          <div key={fileItem.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                            <div className="flex items-center space-x-3">
                              {getFileIcon(fileItem.file.type)}
                              <div>
                                <span className="text-neutral-900 font-medium">{fileItem.file.name}</span>
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
                <label className="block text-neutral-900 font-medium mb-3 text-lg">
                  {orderType === 'digital' ? 'Print Instructions' : 'Item Description'}
                </label>
                <Textarea
                  placeholder={orderType === 'digital' 
                    ? "Describe exactly how you want these files printed:\n\n• Paper size (A4, A3, etc.)\n• Color or black & white\n• Single or double-sided\n• Binding requirements\n• Quantity needed\n• Any special instructions"
                    : "Describe the physical item in detail:\n\n• Type of item (book, documents, photos)\n• Number of pages/items\n• Condition and quality\n• Desired output format\n• Special requirements"
                  }
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="min-h-32 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={!orderDescription.trim() || (orderType === 'digital' && uploadedFiles.length === 0)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium h-12 text-lg shadow-soft hover:shadow-medium transition-all duration-200"
              >
                Submit Order & Get Matched with Print Shop
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderCreationFlow;
