
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
  shopSlug?: string;
  offlineModuleEnabled?: boolean;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  shopName,
  shopSlug,
  offlineModuleEnabled = false
}) => {
  // Generate proper URLs
  const baseUrl = window.location.origin;
  const shopSlugForUrl = shopSlug || shopName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const uploadUrl = `${baseUrl}/shop/${shopSlugForUrl}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uploadUrl)}`;
  
  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${shopSlugForUrl}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('QR Code downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(uploadUrl);
      toast.success('Upload link copied to clipboard');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy link');
    }
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
              
              {/* Real QR Code */}
              <div className="bg-white p-4 rounded-lg border-2 border-neutral-200 inline-block mb-4">
                <img 
                  src={qrCodeUrl}
                  alt={`QR Code for ${shopName}`}
                  className="w-48 h-48 sm:w-64 sm:h-64"
                  onError={(e) => {
                    // Fallback if QR service fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-48 h-48 sm:w-64 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div class="text-center">
                            <div class="text-6xl mb-2">📱</div>
                            <p class="text-sm text-gray-600">QR Code Preview</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Customers can scan this QR code to access your upload page directly
                {offlineModuleEnabled && (
                  <span className="block mt-1 text-xs text-blue-600">
                    (Walk-in orders enabled)
                  </span>
                )}
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
              
              <p className="text-xs text-gray-500 mt-3">
                Share this link with customers or print the QR code for easy access
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
