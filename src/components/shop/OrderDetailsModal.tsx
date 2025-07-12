
import React from 'react';
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
  X
} from 'lucide-react';

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
  customerEmail?: string;
  orderType: 'walk-in' | 'uploaded-files';
  description: string;
  status: 'received' | 'started' | 'completed';
  isUrgent: boolean;
  createdAt: Date;
  files?: OrderFile[];
}

interface OrderDetailsModalProps {
  order: ShopOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'started': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Bell className="w-4 h-4" />;
      case 'started': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-left">
            <span className="text-lg sm:text-xl">Order #{order.id}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`text-xs sm:text-sm ${getStatusColor(order.status)} border-2`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </Badge>
              {order.isUrgent && (
                <Badge className="bg-red-100 text-red-800 border-red-300 text-xs sm:text-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  URGENT
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Customer Information */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h3 className="font-semibold text-base sm:text-lg">Customer Information</h3>
                <Button
                  size="sm"
                  onClick={() => window.open(`tel:${order.customerPhone}`)}
                  className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 truncate">{order.customerName}</p>
                    <p className="text-sm text-neutral-600">Customer Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">{order.customerPhone}</p>
                    <p className="text-sm text-neutral-600">Phone Number</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900 text-sm sm:text-base">{order.createdAt.toLocaleString()}</p>
                    <p className="text-sm text-neutral-600">Order Created</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-4">Order Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs sm:text-sm ${
                    order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-purple-100 text-purple-700 border-purple-300'
                  }`}>
                    {order.orderType === 'uploaded-files' ? (
                      <><Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />UPLOADED FILES</>
                    ) : (
                      <><UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />WALK-IN</>
                    )}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-neutral-900 mb-2">Description</p>
                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">{order.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files Section - Only show for uploaded files */}
          {order.orderType === 'uploaded-files' && order.files && order.files.length > 0 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-base sm:text-lg mb-4">Files ({order.files.length})</h3>
                <div className="space-y-3">
                  {order.files.map((file) => (
                    <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-neutral-50 rounded-lg border border-neutral-200 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 text-sm sm:text-base truncate">{file.name}</p>
                          <p className="text-xs sm:text-sm text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="ml-1 sm:hidden">View</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="ml-1 sm:hidden">Download</span>
                        </Button>
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
  );
};

export default OrderDetailsModal;
