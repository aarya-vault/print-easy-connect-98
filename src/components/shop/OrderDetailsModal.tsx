
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Eye, 
  Printer, 
  FileText, 
  Phone, 
  Mail, 
  Calendar,
  Upload,
  UserCheck,
  Zap,
  Bell,
  CheckCircle,
  Clock,
  Package,
  X,
  MessageSquare
} from 'lucide-react';
import OrderChat from './OrderChat';

interface OrderFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: 'walk-in' | 'uploaded-files';
  description: string;
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  isUrgent: boolean;
  createdAt: Date;
  files?: OrderFile[];
  instructions?: string;
  services: string[];
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  color?: boolean;
}

interface OrderDetailsModalProps {
  order: ShopOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPrintFile?: (file: OrderFile) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onPrintFile
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-golden-100 text-golden-800 border-golden-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Bell className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Order Details - #{order.id}</span>
              <Badge className={`${getStatusColor(order.status)} border-2`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </Badge>
              {order.isUrgent && (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  <Zap className="w-4 h-4 mr-1" />
                  URGENT
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Customer Information</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(`tel:${order.customerPhone}`)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsChatOpen(true)}
                      className="bg-golden-500 hover:bg-golden-600 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{order.customerName}</p>
                      <p className="text-sm text-neutral-600">Customer Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{order.customerPhone}</p>
                      <p className="text-sm text-neutral-600">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{order.customerEmail}</p>
                      <p className="text-sm text-neutral-600">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{order.createdAt.toLocaleString()}</p>
                      <p className="text-sm text-neutral-600">Order Created</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Order Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={`${
                      order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-purple-100 text-purple-700 border-purple-300'
                    }`}>
                      {order.orderType === 'uploaded-files' ? (
                        <><Upload className="w-4 h-4 mr-2" />UPLOADED FILES</>
                      ) : (
                        <><UserCheck className="w-4 h-4 mr-2" />WALK-IN</>
                      )}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 mb-2">Description</p>
                    <p className="text-neutral-700">{order.description}</p>
                  </div>
                  {order.instructions && (
                    <div className="p-4 bg-golden-50 border border-golden-200 rounded-lg">
                      <p className="font-medium text-golden-800 mb-2">Special Instructions</p>
                      <p className="text-golden-700">{order.instructions}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.pages && (
                      <div>
                        <p className="text-sm text-neutral-600">Pages</p>
                        <p className="font-medium text-neutral-900">{order.pages}</p>
                      </div>
                    )}
                    {order.copies && (
                      <div>
                        <p className="text-sm text-neutral-600">Copies</p>
                        <p className="font-medium text-neutral-900">{order.copies}</p>
                      </div>
                    )}
                    {order.paperType && (
                      <div>
                        <p className="text-sm text-neutral-600">Paper Type</p>
                        <p className="font-medium text-neutral-900">{order.paperType}</p>
                      </div>
                    )}
                    {order.binding && (
                      <div>
                        <p className="text-sm text-neutral-600">Binding</p>
                        <p className="font-medium text-neutral-900">{order.binding}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.services.map((service) => (
                      <Badge key={service} variant="outline" className="border-neutral-300 text-neutral-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files Section - Only show for uploaded files */}
            {order.orderType === 'uploaded-files' && order.files && order.files.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Files ({order.files.length})</h3>
                  <div className="space-y-3">
                    {order.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-neutral-600" />
                          <div>
                            <p className="font-medium text-neutral-900">{file.name}</p>
                            <p className="text-sm text-neutral-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          {onPrintFile && (
                            <Button 
                              size="sm"
                              onClick={() => onPrintFile(file)}
                              className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Print
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Chat Modal */}
      <OrderChat
        orderId={order.id}
        customerName={order.customerName}
        customerPhone={order.customerPhone}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default OrderDetailsModal;
