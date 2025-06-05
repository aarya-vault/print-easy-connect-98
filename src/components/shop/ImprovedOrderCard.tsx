
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  MessageSquare,
  Eye,
  Zap,
  CheckCircle,
  Clock,
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

interface ImprovedOrderCardProps {
  order: ShopOrder;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onViewDetails: (orderId: string) => void;
  onOpenChat: (orderId: string) => void;
  onCall: (phone: string) => void;
}

const ImprovedOrderCard: React.FC<ImprovedOrderCardProps> = ({
  order,
  onToggleUrgency,
  onUpdateStatus,
  onViewDetails,
  onOpenChat,
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
      case 'new': return <Bell className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
    <Card className={`border-2 shadow-md hover:shadow-lg transition-all duration-200 ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-white'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        {/* Header with customer name and urgency */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-gray-900">{order.customerName}</h3>
            {order.isUrgent && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="text-xs text-gray-500 font-mono">{order.id}</div>
        </div>

        {/* Order type and status */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`text-xs px-2 py-1 ${
            order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'
          }`}>
            {order.orderType === 'uploaded-files' ? (
              <><Upload className="w-3 h-3 mr-1" />Files</>
            ) : (
              <><UserCheck className="w-3 h-3 mr-1" />Walk-in</>
            )}
          </Badge>
          
          <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
          
          <span className="text-xs text-gray-500 ml-auto">{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{order.description}</p>

        {/* Action buttons with clear labels */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCall(order.customerPhone)}
            className="text-xs h-8 justify-start"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChat(order.id)}
            className="text-xs h-8 justify-start"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
            className="text-xs h-8 justify-start"
          >
            <Eye className="w-3 h-3 mr-1" />
            Details
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleUrgency(order.id)}
            className={`text-xs h-8 justify-start ${order.isUrgent ? 'bg-red-50 text-red-700 border-red-200' : ''}`}
          >
            <Zap className="w-3 h-3 mr-1" />
            {order.isUrgent ? 'Urgent' : 'Normal'}
          </Button>
        </div>

        {/* Primary action button */}
        {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
            className="w-full mt-2 text-xs h-8 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white border-0"
          >
            {statusAction}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedOrderCard;
