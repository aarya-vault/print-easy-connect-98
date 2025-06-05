
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  Bell, 
  Package, 
  X, 
  Zap, 
  Phone, 
  Eye,
  Printer,
  FileText,
  Upload,
  UserCheck
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

interface MinimalistOrderCardProps {
  order: ShopOrder;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onViewDetails: (orderId: string) => void;
  onPrintFile?: (file: OrderFile) => void;
}

const MinimalistOrderCard: React.FC<MinimalistOrderCardProps> = ({
  order,
  onToggleUrgency,
  onUpdateStatus,
  onViewDetails,
  onPrintFile
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
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
    <div className={`bg-white rounded-xl border-2 p-3 transition-all duration-200 hover:shadow-md ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
      {/* Header with customer name and urgency */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-gray-900 truncate">{order.customerName}</h3>
          {order.isUrgent && (
            <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-1.5 py-0.5">
              <Zap className="w-3 h-3 mr-1" />
              URGENT
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500 font-mono">{order.id}</div>
      </div>

      {/* Status and type badges */}
      <div className="flex items-center gap-2 mb-2">
        <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </Badge>
        <Badge className={`text-xs px-2 py-0.5 ${
          order.orderType === 'uploaded-files' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
        }`}>
          {order.orderType === 'uploaded-files' ? (
            <><Upload className="w-3 h-3 mr-1" />Files</>
          ) : (
            <><UserCheck className="w-3 h-3 mr-1" />Walk-in</>
          )}
        </Badge>
        <span className="text-xs text-gray-500 ml-auto">{formatTimeAgo(order.createdAt)}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-2 line-clamp-1">{order.description}</p>

      {/* File info for uploaded files */}
      {order.orderType === 'uploaded-files' && order.files && order.files.length > 0 && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-blue-700 truncate flex-1">{order.files[0].name}</span>
          {onPrintFile && (
            <Button 
              size="sm"
              variant="outline"
              onClick={() => onPrintFile(order.files![0])}
              className="h-6 px-2 text-xs border-blue-200 hover:bg-blue-100"
            >
              <Printer className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Order details */}
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
        {order.pages && <span>{order.pages} pages</span>}
        {order.copies && <span>{order.copies} copies</span>}
        <span className="truncate">{order.customerPhone}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(order.id)}
          className="flex-1 text-xs h-7"
        >
          <Eye className="w-3 h-3 mr-1" />
          Details
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open(`tel:${order.customerPhone}`)}
          className="h-7 px-2"
        >
          <Phone className="w-3 h-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleUrgency(order.id)}
          className={`h-7 px-2 ${order.isUrgent ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
        >
          <Zap className="w-3 h-3" />
        </Button>

        {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
            className="text-xs h-7 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white border-0"
          >
            {statusAction}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MinimalistOrderCard;
