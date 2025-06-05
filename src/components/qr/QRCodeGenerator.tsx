
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QRCodeGeneratorProps {
  orderId: string;
  orderDetails: {
    customerPhone: string;
    orderType: string;
    description: string;
    shopId?: string;
  };
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ orderId, orderDetails }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = async () => {
    setIsGenerating(true);
    // Simulate QR generation
    setTimeout(() => {
      setIsGenerating(false);
      setQrGenerated(true);
    }, 2000);
  };

  const downloadQR = () => {
    // QR download logic would go here
    console.log('Downloading QR code for order:', orderId);
  };

  const shareQR = () => {
    // QR sharing logic would go here
    console.log('Sharing QR code for order:', orderId);
  };

  return (
    <Card className="border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden">
      <div className="h-2 bg-gradient-yellow-white"></div>
      <CardHeader className="bg-white">
        <CardTitle className="text-printeasy-black flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-radial-yellow rounded-printeasy flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-printeasy-black rounded-sm"></div>
          </div>
          <span>Order QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white space-y-6">
        {!qrGenerated ? (
          <div className="text-center">
            <div className="w-48 h-48 bg-gradient-white-gray border-2 border-dashed border-printeasy-gray-medium rounded-printeasy mx-auto mb-6 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-printeasy-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-printeasy-gray-medium">Generating QR Code...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-radial-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
                    <div className="text-2xl">📱</div>
                  </div>
                  <p className="text-printeasy-gray-medium">Click to generate</p>
                </div>
              )}
            </div>
            <Button
              onClick={generateQR}
              disabled={isGenerating}
              className="bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black font-semibold rounded-printeasy px-8 py-3"
            >
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-48 h-48 bg-white border-4 border-printeasy-black rounded-printeasy mx-auto mb-6 flex items-center justify-center shadow-2xl">
              {/* QR Code Placeholder - in real implementation, use actual QR library */}
              <div className="w-40 h-40 bg-gradient-to-br from-printeasy-black to-printeasy-gray-dark grid grid-cols-8 gap-0.5 p-2 rounded">
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square ${
                      Math.random() > 0.5 ? 'bg-white' : 'bg-printeasy-black'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-printeasy-black">Order #{orderId}</h3>
              <p className="text-sm text-printeasy-gray-medium">
                Scan this code at the print shop to identify your order
              </p>
              
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="border-2 border-printeasy-yellow hover:bg-gradient-yellow-white rounded-printeasy"
                >
                  Download
                </Button>
                <Button
                  onClick={shareQR}
                  className="bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black rounded-printeasy"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="border-t border-printeasy-gray-light pt-6">
          <h4 className="font-medium text-printeasy-black mb-3">Order Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-printeasy-gray-medium">Customer:</span>
              <span className="text-printeasy-black">{orderDetails.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-printeasy-gray-medium">Type:</span>
              <span className="text-printeasy-black capitalize">{orderDetails.orderType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-printeasy-gray-medium">Status:</span>
              <span className="px-2 py-1 bg-gradient-yellow-subtle text-printeasy-black rounded-full text-xs">
                Processing
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
