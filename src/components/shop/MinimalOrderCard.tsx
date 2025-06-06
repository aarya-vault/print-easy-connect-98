
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock,
  CheckCircle,
  Bell,
  Package,
  X,
  Upload,
  UserCheck
} from 'lucide-react';

interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'walk-in' | 'uploaded-files';
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'completed' | 'cancelled';
  isUrgent: boolean;
  createdAt: Date;
  description: string;
}

interface MinimalOrderCardProps {
  order: ShopOrder;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onViewDetails: (orderId: string) => void;
}

const MinimalOrderCard: React.FC<MinimalOrderCardProps> = ({
  order,
  onUpdateStatus,
  onViewDetails
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
      case 'new': return 'Accept';
      case 'confirmed': return 'Start';
      case 'processing': return 'Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border shadow-sm hover:shadow-md transition-all duration-200 ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs px-2 py-1 ${
              order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'
            }`}>
              {order.orderType === 'uploaded-files' ? (
                <><Upload className="w-2 h-2 mr-1" />Files</>
              ) : (
                <><UserCheck className="w-2 h-2 mr-1" />Walk-in</>
              )}
            </Badge>
            {order.isUrgent && (
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <span className="text-xs text-gray-500">{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* Customer Name */}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
          {order.customerName}
        </h3>

        {/* Status */}
        <Badge className={`text-xs mb-2 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </Badge>

        {/* Action Buttons */}
        <div className="space-y-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
            className="w-full text-xs h-7"
          >
            View Details
          </Button>

          {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
              className="w-full text-xs h-7 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white border-0"
            >
              {statusAction}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalOrderCard;
