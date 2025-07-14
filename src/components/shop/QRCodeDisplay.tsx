import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Download, Share2, Eye, Store } from 'lucide-react';

interface QRCodeDisplayProps {
  shopId: string;
  shopName: string;
  shopAddress: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ shopId, shopName, shopAddress }) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const generateQRData = () => {
    return {
      shopId,
      shopName,
      shopAddress,
      url: `${window.location.origin}/customer/shop/${shopId}/order`
    };
  };

  const downloadQR = () => {
    // In a real implementation, this would generate and download the QR code
    console.log('Downloading QR code for shop:', shopId);
  };

  const shareQR = () => {
    // In a real implementation, this would open sharing options
    if (navigator.share) {
      navigator.share({
        title: `${shopName} - PrintEasy`,
        text: 'Scan to place orders at this print shop',
        url: `${window.location.origin}/customer/shop/${shopId}/order`
      });
    }
  };

  return (
    <>
      <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <QrCode className="w-5 h-5 text-primary" />
            My Shop QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-primary/20">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Share this QR code with customers to let them place orders directly
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    {shopName} QR Code
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center py-6">
                  <div className="w-48 h-48 bg-white border-4 border-foreground rounded-lg mx-auto mb-6 flex items-center justify-center shadow-lg">
                    {/* QR Code Placeholder - in real implementation, use actual QR library */}
                    <div className="w-40 h-40 bg-gradient-to-br from-foreground to-muted-foreground grid grid-cols-8 gap-0.5 p-2 rounded">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div
                          key={i}
                          className={`aspect-square ${
                            Math.random() > 0.5 ? 'bg-background' : 'bg-foreground'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">{shopName}</h3>
                    <p className="text-sm text-muted-foreground">{shopAddress}</p>
                    <p className="text-xs text-muted-foreground">
                      Customers can scan this to place orders at your shop
                    </p>
                    
                    <div className="flex gap-2 justify-center pt-4">
                      <Button onClick={downloadQR} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button onClick={shareQR} size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={shareQR} size="sm" className="flex-1">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default QRCodeDisplay;