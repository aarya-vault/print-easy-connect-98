
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

type OrderType = 'digital' | 'physical' | null;

const OrderCreationFlow: React.FC = () => {
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [orderDescription, setOrderDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitOrder = () => {
    // Order submission logic will be implemented later
    console.log('Order submitted:', { orderType, orderDescription, uploadedFiles });
    navigate('/customer/dashboard');
  };

  if (!orderType) {
    return (
      <div className="min-h-screen bg-printeasy-gray-light">
        {/* Header */}
        <div className="bg-white border-b border-printeasy-yellow/20">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-printeasy-black">
              Print<span className="text-printeasy-yellow">Easy</span>
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-printeasy-black mb-2">
                What would you like to print?
              </h2>
              <p className="text-printeasy-gray-dark">
                Choose how you'd like to submit your print job
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="border-2 border-printeasy-yellow/30 hover:border-printeasy-yellow cursor-pointer transition-all rounded-printeasy"
                onClick={() => setOrderType('digital')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-printeasy-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-10 bg-printeasy-black rounded-sm"></div>
                  </div>
                  <CardTitle className="text-printeasy-black">Upload Digital Files</CardTitle>
                  <CardDescription>
                    Upload documents, photos, or any digital files from your device
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-printeasy-black/30 hover:border-printeasy-black cursor-pointer transition-all rounded-printeasy"
                onClick={() => setOrderType('physical')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-printeasy-black rounded-printeasy mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white rounded-sm"></div>
                  </div>
                  <CardTitle className="text-printeasy-black">Describe Physical Item</CardTitle>
                  <CardDescription>
                    Describe a book, document, or photos you want to copy or scan
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
    <div className="min-h-screen bg-printeasy-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-printeasy-yellow/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-printeasy-black">
            Print<span className="text-printeasy-yellow">Easy</span>
          </h1>
          <Button 
            variant="outline"
            onClick={() => setOrderType(null)}
            className="rounded-printeasy"
          >
            ← Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-printeasy-black mb-2">
              {orderType === 'digital' ? 'Upload Your Files' : 'Describe Your Item'}
            </h2>
            <p className="text-printeasy-gray-dark">
              {orderType === 'digital' 
                ? 'Upload your files and describe exactly how you want them printed'
                : 'Tell us about the physical item you want to copy or scan'
              }
            </p>
          </div>

          <Card className="rounded-printeasy mb-6">
            <CardHeader>
              <CardTitle className="text-printeasy-black">
                {orderType === 'digital' ? 'File Upload' : 'Item Description'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderType === 'digital' && (
                <div>
                  <div className="border-2 border-dashed border-printeasy-yellow/50 rounded-printeasy p-8 text-center hover:border-printeasy-yellow transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="*/*"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-12 h-12 bg-printeasy-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-printeasy-black rounded-sm"></div>
                      </div>
                      <p className="text-printeasy-black font-medium mb-2">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-printeasy-gray-dark text-sm">
                        Any file type, any size - we handle it all
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-printeasy-black">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-printeasy-gray-light rounded-printeasy">
                          <span className="text-printeasy-black text-sm">{file.name}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
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
                <label className="block text-printeasy-black font-medium mb-2">
                  Print Instructions
                </label>
                <Textarea
                  placeholder={orderType === 'digital' 
                    ? "Describe exactly how you want these files printed. For example: 'Print all PDFs double-sided in black and white. Print the 3 photos on glossy paper. Bind the documents with spiral binding.'"
                    : "Describe the physical item you want copied or scanned. For example: 'Copy this entire 200-page textbook, double-sided. Bind with spiral binding.' or 'Scan these 50 old family photos to digital files.'"
                  }
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="min-h-32 rounded-printeasy focus:ring-printeasy-yellow focus:border-printeasy-yellow"
                />
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={!orderDescription.trim() || (orderType === 'digital' && uploadedFiles.length === 0)}
                className="w-full bg-printeasy-yellow hover:bg-printeasy-yellow-dark text-printeasy-black font-semibold rounded-printeasy h-12"
              >
                Submit Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderCreationFlow;
