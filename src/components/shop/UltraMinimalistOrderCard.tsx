
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Eye,
  Zap,
  CheckCircle,
  Clock,
  Bell,
  Package,
  X
} from 'lucide-react';

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'walk-in' | 'uploaded-files';
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  isUrgent: boolean;
  createdAt: Date;
}

interface UltraMinimalistOrderCardProps {
  order: ShopOrder;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onViewDetails: (orderId: string) => void;
  onCall: (phone: string) => void;
}

const UltraMinimalistOrderCard: React.FC<UltraMinimalistOrderCardProps> = ({
  order,
  onToggleUrgency,
  onUpdateStatus,
  onViewDetails,
  onCall
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
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
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
    <div className={`bg-white rounded-lg border-2 p-3 transition-all duration-200 hover:shadow-sm ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''} w-full max-w-[220px]`}>
      {/* Header with customer name and urgency */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{order.customerName}</h3>
        {order.isUrgent && (
          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
        )}
      </div>

      {/* Order ID and Time */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-mono text-gray-600">{order.id}</div>
        <div className="text-xs text-gray-500">{formatTimeAgo(order.createdAt)}</div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </Badge>
      </div>

      {/* Action buttons - 2x2 grid */}
      <div className="grid grid-cols-2 gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCall(order.customerPhone)}
          className="text-xs h-7 p-1"
        >
          <Phone className="w-3 h-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(order.id)}
          className="text-xs h-7 p-1"
        >
          <Eye className="w-3 h-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onToggleUrgency(order.id)}
          className={`text-xs h-7 p-1 ${order.isUrgent ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
        >
          <Zap className="w-3 h-3" />
        </Button>

        {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
            className="text-xs h-7 p-1 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white border-0"
          >
            ✓
          </Button>
        )}
      </div>
    </div>
  );
};

export default UltraMinimalistOrderCard;
