
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Share, Copy, QrCode } from 'lucide-react';
import apiService from '@/services/api';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [qrData, setQrData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.generateShopQRCode();
      setQrData(response.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData?.dataUrl) return;
    
    const link = document.createElement('a');
    link.download = `${qrData.shopName}-qr-code.png`;
    link.href = qrData.dataUrl;
    link.click();
    toast.success('QR code downloaded successfully');
  };

  const copyToClipboard = async () => {
    if (!qrData?.url) return;
    
    try {
      await navigator.clipboard.writeText(qrData.url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const shareQRCode = async () => {
    if (!qrData?.url) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${qrData.shopName} - PrintEasy`,
          text: 'Place your print order easily!',
          url: qrData.url
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Shop QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Generating QR code...</p>
              </div>
            </div>
          ) : qrData ? (
            <>
              {/* QR Code Display */}
              <div className="flex justify-center">
                <div className="p-4 bg-white border-2 border-neutral-200 rounded-lg">
                  <img 
                    src={qrData.dataUrl} 
                    alt="Shop QR Code" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Shop Info */}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">{qrData.shopName}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Customers can scan this QR code to place orders at your shop
                </p>
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-600 break-all">{qrData.url}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={downloadQRCode}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={shareQRCode}>
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy URL
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">Failed to generate QR code</p>
              <Button onClick={generateQRCode} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
