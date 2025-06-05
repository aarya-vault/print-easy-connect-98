
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import ChatSystem from '@/components/chat/ChatSystem';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';
import { LoadingState } from '@/components/ui/loading-states';

type OrderType = 'digital' | 'physical' | null;

const OrderCreationFlow: React.FC = () => {
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [orderDescription, setOrderDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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

  if (orderSubmitted && orderId) {
    return (
      <div className="min-h-screen bg-gradient-white-gray">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-4 border-gradient-yellow-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
              <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-yellow-white rounded-full mt-1"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-radial-yellow rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse-glow">
                <div className="text-3xl">✓</div>
              </div>
              <h2 className="text-4xl font-bold text-printeasy-black mb-4">
                Order <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Confirmed!</span>
              </h2>
              <p className="text-xl text-printeasy-gray-dark">
                Your order #{orderId} has been submitted successfully
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code */}
              <QRCodeGenerator 
                orderId={orderId}
                orderDetails={{
                  customerPhone: '+91 XXXXXXXXXX',
                  orderType: orderType || 'digital',
                  description: orderDescription
                }}
              />

              {/* Order Status */}
              <Card className="border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden">
                <div className="h-2 bg-gradient-yellow-white"></div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-printeasy-black">Order Status</CardTitle>
                </CardHeader>
                <CardContent className="bg-white space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-yellow-white rounded-full"></div>
                      <span className="text-printeasy-black font-medium">Order Received</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-white-gray border-2 border-printeasy-yellow rounded-full animate-pulse"></div>
                      <span className="text-printeasy-gray-medium">Processing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-white-gray border-2 border-printeasy-gray-medium rounded-full"></div>
                      <span className="text-printeasy-gray-medium">Printing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-white-gray border-2 border-printeasy-gray-medium rounded-full"></div>
                      <span className="text-printeasy-gray-medium">Ready for Pickup</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setChatOpen(true)}
                      className="w-full bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black rounded-printeasy"
                    >
                      Chat with Print Shop
                    </Button>
                    <Button
                      onClick={() => navigate('/customer/dashboard')}
                      variant="outline"
                      className="w-full border-2 border-printeasy-gray-medium hover:bg-gradient-gray-white rounded-printeasy"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <ChatSystem 
          orderId={orderId}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-white-gray flex items-center justify-center">
        <Card className="border-0 shadow-2xl bg-gradient-white-yellow rounded-printeasy p-8 max-w-md mx-auto">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 border-4 border-printeasy-yellow border-t-transparent rounded-full mx-auto animate-spin"></div>
            <h3 className="text-2xl font-bold text-printeasy-black">Processing Your Order</h3>
            <p className="text-printeasy-gray-dark">We're matching you with the perfect print shop...</p>
            <LoadingState variant="dots" size="lg" />
          </div>
        </Card>
      </div>
    );
  }

  if (!orderType) {
    return (
      <div className="min-h-screen bg-gradient-yellow-white">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-4 border-gradient-yellow-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
              <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-yellow-white rounded-full mt-1"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-printeasy-black mb-4">
                What would you like to <span className="bg-gradient-yellow-light bg-clip-text text-transparent">print?</span>
              </h2>
              <p className="text-xl text-printeasy-gray-dark">
                Choose your preferred method to get started
              </p>
              <div className="w-24 h-1 bg-gradient-black-white mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card 
                className="border-0 shadow-2xl bg-gradient-yellow-white rounded-printeasy overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => setOrderType('digital')}
              >
                <div className="h-2 bg-gradient-yellow-light"></div>
                <CardHeader className="text-center bg-white relative">
                  <div className="w-20 h-20 bg-gradient-radial-yellow rounded-printeasy mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:animate-pulse-glow">
                    <div className="w-10 h-12 bg-white rounded-sm shadow-inner relative">
                      <div className="absolute top-1 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                      <div className="absolute top-3 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                      <div className="absolute bottom-1 left-1 w-3 h-3 bg-gradient-yellow-light rounded-sm"></div>
                    </div>
                  </div>
                  <CardTitle className="text-printeasy-black text-xl">Digital File Upload</CardTitle>
                  <CardDescription className="text-printeasy-gray-dark">
                    Upload documents, photos, presentations from your device for immediate printing
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-0 shadow-2xl bg-gradient-white-black rounded-printeasy overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => setOrderType('physical')}
              >
                <div className="h-2 bg-gradient-black-gray"></div>
                <CardHeader className="text-center bg-white relative">
                  <div className="w-20 h-20 bg-gradient-radial-white border-4 border-printeasy-black rounded-printeasy mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl">
                    <div className="w-8 h-8 border-2 border-printeasy-black rounded-sm relative">
                      <div className="absolute inset-1 border border-printeasy-gray-medium rounded-sm"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-yellow-white rounded-full shadow-lg"></div>
                    </div>
                  </div>
                  <CardTitle className="text-printeasy-black text-xl">Physical Item Description</CardTitle>
                  <CardDescription className="text-printeasy-gray-dark">
                    Describe books, documents, or photos you want copied, scanned, or processed
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-white-gray">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-yellow-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
              <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
            </h1>
            <div className="w-16 h-1 bg-gradient-yellow-white rounded-full mt-1"></div>
          </div>
          <Button 
            variant="outline"
            onClick={() => setOrderType(null)}
            className="border-2 border-printeasy-gray-medium hover:bg-gradient-gray-white rounded-printeasy"
          >
            ← Change Type
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-printeasy-black mb-4">
              {orderType === 'digital' ? 'Upload Your Files' : 'Describe Your Item'}
            </h2>
            <p className="text-lg text-printeasy-gray-dark">
              {orderType === 'digital' 
                ? 'Upload files and specify your exact printing requirements'
                : 'Provide detailed description of the physical item you want processed'
              }
            </p>
            <div className="w-24 h-1 bg-gradient-yellow-white mx-auto mt-4 rounded-full"></div>
          </div>

          <Card className="border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden mb-6">
            <div className="h-2 bg-gradient-yellow-white"></div>
            <CardHeader className="bg-white">
              <CardTitle className="text-printeasy-black text-xl">
                {orderType === 'digital' ? 'File Upload & Instructions' : 'Item Description & Requirements'}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white space-y-8">
              {orderType === 'digital' && (
                <div>
                  <div className="border-4 border-dashed border-printeasy-yellow/50 bg-gradient-yellow-subtle rounded-printeasy p-12 text-center hover:border-printeasy-yellow transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="*/*"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-radial-yellow rounded-printeasy mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <div className="w-8 h-10 bg-white rounded-sm shadow-inner relative">
                          <div className="absolute top-1 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                          <div className="absolute top-3 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                          <div className="absolute bottom-1 left-1 w-2 h-2 bg-gradient-yellow-light rounded-sm"></div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-printeasy-black mb-3">
                        Upload Your Files
                      </h3>
                      <p className="text-printeasy-gray-dark">
                        Drag & drop files here or click to browse
                      </p>
                      <p className="text-sm text-printeasy-gray-medium mt-2">
                        Any file type • Any size • Secure upload
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-printeasy-black">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-white-gray rounded-printeasy border border-printeasy-gray-light">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-yellow-white rounded flex items-center justify-center">
                              <div className="w-4 h-5 bg-printeasy-black rounded-sm"></div>
                            </div>
                            <span className="text-printeasy-black font-medium">{file.name}</span>
                            <span className="text-sm text-printeasy-gray-medium">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-printeasy-black font-semibold mb-3 text-lg">
                  {orderType === 'digital' ? 'Print Instructions' : 'Item Description'}
                </label>
                <Textarea
                  placeholder={orderType === 'digital' 
                    ? "Describe exactly how you want these files printed:\n\n• Paper size (A4, A3, etc.)\n• Color or black & white\n• Single or double-sided\n• Binding requirements\n• Quantity needed\n• Any special instructions"
                    : "Describe the physical item in detail:\n\n• Type of item (book, documents, photos)\n• Number of pages/items\n• Condition and quality\n• Desired output format\n• Special requirements"
                  }
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="min-h-40 rounded-printeasy border-2 border-printeasy-gray-light focus:border-printeasy-yellow focus:ring-printeasy-yellow text-lg"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={!orderDescription.trim() || (orderType === 'digital' && uploadedFiles.length === 0)}
                className="w-full bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black font-bold rounded-printeasy h-14 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:animate-pulse-glow"
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
