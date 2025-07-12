
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  shopName
}) => {
  const uploadUrl = `https://printeasy.com/shop/${shopName.toLowerCase().replace(/\s+/g, '-')}/upload`;
  
  const handleDownloadQR = () => {
    // Simulate QR download
    toast.success('QR Code downloaded successfully');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uploadUrl);
    toast.success('Upload link copied to clipboard');
  };

  const handleOpenUploadPage = () => {
    window.open(uploadUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">Shop QR Code & Upload</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* QR Code Section */}
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <h3 className="font-semibold text-base sm:text-lg mb-4">QR Code for {shopName}</h3>
              
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 h-48 sm:h-64 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 sm:w-32 sm:h-32 text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Customers can scan this QR code to access your upload page directly
              </p>
              
              <Button 
                onClick={handleDownloadQR}
                className="w-full bg-golden-500 hover:bg-golden-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Upload Page Link */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-4">Direct Upload Link</h3>
              
              <div className="bg-gray-50 p-3 rounded border text-xs sm:text-sm font-mono break-all mb-4">
                {uploadUrl}
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleCopyLink}
                  variant="outline" 
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button 
                  onClick={handleOpenUploadPage}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Upload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
