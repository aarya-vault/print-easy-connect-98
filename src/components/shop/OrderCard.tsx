
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  Bell, 
  Upload, 
  UserCheck, 
  Phone, 
  Eye,
  FileText,
  Zap
} from 'lucide-react';
import { Order, OrderFile } from '@/types/api';

interface OrderCardProps {
  order: Order;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onViewDetails: (orderId: string) => void;
  onPrintFile?: (file: OrderFile) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onToggleUrgency,
  onUpdateStatus,
  onViewDetails,
  onPrintFile
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-golden-100 text-golden-800 border-golden-300';
      case 'started': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Bell className="w-3 h-3" />;
      case 'started': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNextStatus = (): Order['status'] | null => {
    switch (order.status) {
      case 'received': return 'started';
      case 'started': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = () => {
    switch (order.status) {
      case 'received': return 'Start';
      case 'started': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
      order.is_urgent ? 'border-red-300 bg-red-50/30' : 
      order.order_type === 'uploaded-files' ? 'border-blue-200 bg-blue-50/10' : 'border-purple-200 bg-purple-50/10'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">#{order.id}</p>
                {order.is_urgent && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {order.order_type === 'uploaded-files' ? (
                  <><Upload className="w-3 h-3 mr-1" />Files</>
                ) : (
                  <><UserCheck className="w-3 h-3 mr-1" />Walk-in</>
                )}
              </Badge>
            </div>
            <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>

          {/* Customer Info */}
          <div>
            <p className="font-medium text-sm">{order.customer_name}</p>
            <p className="text-xs text-neutral-600">{order.customer_phone}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-700 line-clamp-2">
            {order.description}
          </p>

          {/* Order specs */}
          <div className="flex flex-wrap gap-1 text-xs">
            {order.pages && (
              <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                {order.pages} pages
              </span>
            )}
            {order.copies && order.copies > 1 && (
              <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                {order.copies} copies
              </span>
            )}
            {order.color && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Color</span>
            )}
          </div>

          {/* Files preview for uploaded-files orders */}
          {order.order_type === 'uploaded-files' && order.files && order.files.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <FileText className="w-3 h-3" />
                <span>{order.files[0].original_name || order.files[0].name}</span>
                {order.files.length > 1 && (
                  <span className="text-neutral-500">+{order.files.length - 1} more</span>
                )}
              </div>
            </div>
          )}

          {/* Time */}
          <p className="text-xs text-neutral-500">
            {formatTimeAgo(order.created_at)}
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${order.customer_phone}`)}
                className="flex-1 text-xs h-7"
              >
                <Phone className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(order.id)}
                className="flex-1 text-xs h-7"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleUrgency(order.id)}
                className={`flex-1 text-xs h-7 ${order.is_urgent ? 'bg-red-100 text-red-700 border-red-300' : ''}`}
              >
                <Zap className="w-3 h-3" />
              </Button>
            </div>

            {nextStatus && statusAction && order.status !== 'completed' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
                className="w-full text-xs h-7 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
              >
                {statusAction}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
