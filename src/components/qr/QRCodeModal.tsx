
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Download, Share2, QrCode, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { QRCodeData } from '@/types/api';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, shopId }) => {
  const { data: qrData, isLoading, error } = useQuery<QRCodeData>({
    queryKey: ['qr-code', shopId],
    queryFn: () => shopId ? apiService.generateShopQRCode(shopId) : Promise.reject('No shop ID'),
    enabled: isOpen && !!shopId,
  });

  const handleDownload = () => {
    if (qrData?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrData.qrCodeUrl;
      link.download = 'shop-qr-code.png';
      link.click();
      toast.success('QR code downloaded');
    }
  };

  const handleShare = async () => {
    if (qrData?.shopUrl) {
      try {
        await navigator.share({
          title: 'Shop QR Code',
          text: 'Scan to place an order at our shop',
          url: qrData.shopUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(qrData.shopUrl);
        toast.success('Shop URL copied to clipboard');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Shop QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <Card>
              <CardContent className="p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-golden-600" />
                <p className="text-gray-600">Generating QR code...</p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 mb-4">Failed to generate QR code</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {qrData && (
            <>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrData.qrCodeUrl} 
                      alt="Shop QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Customers can scan this code to place orders directly at your shop
                  </p>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  onClick={handleDownload} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Direct Link:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border break-all">
                  {qrData.shopUrl}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
