
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  Eye, 
  Phone, 
  MessageCircle, 
  Clock, 
  User, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types/api';

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
  onUrgencyToggle: (orderId: string) => Promise<void>;
  onCallCustomer: (phone: string) => void;
  onOpenChat: () => void;
  onFileAction: (action: 'download' | 'preview', fileId: string, filename?: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onUrgencyToggle,
  onCallCustomer,
  onOpenChat,
  onFileAction
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(order.id, newStatus);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUrgencyToggle = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onUrgencyToggle(order.id);
      toast.success('Order urgency updated');
    } catch (error) {
      toast.error('Failed to update urgency');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in_progress': return Package;
      case 'ready': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className="w-6 h-6" />
              <div>
                <span className="text-xl font-bold">Order #{order.id.slice(0, 8)}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant={order.order_type === 'digital' ? 'default' : 'secondary'}>
                    {order.order_type === 'digital' ? 'Digital Files' : 'Walk-in Order'}
                  </Badge>
                  {order.is_urgent && (
                    <Badge variant="destructive">URGENT</Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Name:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Phone:</span>
                <span className="font-mono">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {order.notes && (
                <div>
                  <span className="font-medium">Notes/Instructions:</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}
              
              {order.pages && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pages:</span>
                  <span>{order.pages}</span>
                </div>
              )}
              
              {order.copies && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Copies:</span>
                  <span>{order.copies}</span>
                </div>
              )}
              
              {order.color !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Color:</span>
                  <span>{order.color ? 'Yes' : 'No'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Files Section - Only for digital orders */}
          {order.order_type === 'digital' && order.files && order.files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Uploaded Files</h3>
              <div className="space-y-2">
                {order.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{file.original_name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFileAction('preview', file.id, file.original_name)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFileAction('download', file.id, file.original_name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onCallCustomer(order.customer_phone)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              
              <Button
                onClick={onOpenChat}
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Open Chat
              </Button>
              
              <Button
                onClick={handleUrgencyToggle}
                variant={order.is_urgent ? "destructive" : "outline"}
                disabled={isUpdating}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {order.is_urgent ? 'Remove Urgent' : 'Mark Urgent'}
              </Button>
            </div>

            {/* Status Update Buttons */}
            <div className="space-y-2">
              <h4 className="font-medium">Update Status:</h4>
              <div className="flex flex-wrap gap-2">
                {['pending', 'in_progress', 'ready', 'completed'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={order.status === status ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isUpdating || order.status === status}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
export type { OrderDetailsModalProps };
