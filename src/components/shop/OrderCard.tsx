
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  Bell, 
  Package, 
  X, 
  Zap, 
  Upload, 
  UserCheck, 
  Phone, 
  MessageCircle, 
  Eye,
  Printer,
  FileText
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

interface OrderCardProps {
  order: ShopOrder;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
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
      case 'new': return <Bell className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'processing': return <Clock className="w-3 h-3" />;
      case 'ready': return <Package className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNextStatus = () => {
    switch (order.status) {
      case 'new': return 'confirmed';
      case 'confirmed': return 'processing';
      case 'processing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getStatusAction = () => {
    switch (order.status) {
      case 'new': return 'Confirm';
      case 'confirmed': return 'Start';
      case 'processing': return 'Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
      order.isUrgent ? 'border-red-300 bg-red-50/30' : 
      order.orderType === 'uploaded-files' ? 'border-blue-200 bg-blue-50/10' : 'border-purple-200 bg-purple-50/10'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Customer info and order details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-neutral-900 truncate">{order.customerName}</h3>
              {order.isUrgent && (
                <Badge className="bg-red-100 text-red-800 border-red-300 text-xs px-2 py-0.5">
                  <Zap className="w-3 h-3 mr-1" />
                  URGENT
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-2 text-sm">
              <span className="font-medium text-neutral-600">#{order.id}</span>
              <Badge className={`text-xs px-2 py-0.5 ${
                order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-purple-100 text-purple-700 border-purple-300'
              }`}>
                {order.orderType === 'uploaded-files' ? (
                  <><Upload className="w-3 h-3 mr-1" />FILES</>
                ) : (
                  <><UserCheck className="w-3 h-3 mr-1" />WALK-IN</>
                )}
              </Badge>
              <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
              <span className="text-neutral-500 text-xs">{formatTimeAgo(order.createdAt)}</span>
            </div>

            <p className="text-sm text-neutral-700 mb-3 line-clamp-2">{order.description}</p>

            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <span>{order.customerPhone}</span>
              {order.pages && <span>{order.pages} pages</span>}
              {order.copies && <span>{order.copies} copies</span>}
              {order.files && <span>{order.files.length} files</span>}
            </div>

            {/* Files preview for uploaded-files orders */}
            {order.orderType === 'uploaded-files' && order.files && order.files.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                  <FileText className="w-3 h-3" />
                  <span>{order.files[0].name}</span>
                  {order.files.length > 1 && (
                    <span className="text-neutral-500">+{order.files.length - 1} more</span>
                  )}
                </div>
                {onPrintFile && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => onPrintFile(order.files![0])}
                    className="h-6 px-2 text-xs"
                  >
                    <Printer className="w-3 h-3 mr-1" />
                    Print
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="text-xs h-7"
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </Button>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${order.customerPhone}`)}
                className="flex-1 text-xs h-7 px-2"
              >
                <Phone className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleUrgency(order.id)}
                className={`flex-1 text-xs h-7 px-2 ${order.isUrgent ? 'bg-red-100 text-red-700 border-red-300' : ''}`}
              >
                <Zap className="w-3 h-3" />
              </Button>
            </div>

            {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
                className="text-xs h-7 bg-gradient-golden hover:shadow-golden text-white"
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
