
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
  UserCheck,
  ArrowRight
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

interface RedesignedOrderCardProps {
  order: ShopOrder;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onViewDetails: (orderId: string) => void;
  onOpenChat: (orderId: string) => void;
  onCall: (phone: string) => void;
}

const RedesignedOrderCard: React.FC<RedesignedOrderCardProps> = ({
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
      case 'new': return 'Confirm Order';
      case 'confirmed': return 'Start Processing';
      case 'processing': return 'Mark Ready';
      case 'ready': return 'Complete';
      default: return null;
    }
  };

  const nextStatus = getNextStatus();
  const statusAction = getStatusAction();

  return (
    <Card className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
      order.isUrgent ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'
    } ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
      <CardContent className="p-5">
        {/* Header with customer name and view details */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-gray-900">{order.customerName}</h3>
            {order.isUrgent && (
              <Badge className="bg-red-100 text-red-700 border-red-300 px-2 py-1">
                <Zap className="w-3 h-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Order info badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className="text-xs font-medium text-gray-600 bg-gray-100 border-gray-200">
            #{order.id}
          </Badge>
          <Badge className={`text-xs ${
            order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'
          }`}>
            {order.orderType === 'uploaded-files' ? (
              <><Upload className="w-3 h-3 mr-1" />Files</>
            ) : (
              <><UserCheck className="w-3 h-3 mr-1" />Walk-in</>
            )}
          </Badge>
          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
          <span className="text-xs text-gray-500 ml-auto">{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">{order.description}</p>

        {/* Contact info */}
        <div className="text-xs text-gray-600 mb-4 font-medium">
          📞 {order.customerPhone}
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Call and Chat buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCall(order.customerPhone)}
              className="h-9 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChat(order.id)}
              className="h-9 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleUrgency(order.id)}
              className={`h-9 ${order.isUrgent ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
            >
              <Zap className="w-4 h-4 mr-1" />
              {order.isUrgent ? 'Urgent' : 'Normal'}
            </Button>
          </div>

          {/* Status action button */}
          {nextStatus && statusAction && order.status !== 'completed' && order.status !== 'cancelled' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus as ShopOrder['status'])}
              className="w-full h-10 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-medium shadow-md"
            >
              {statusAction}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RedesignedOrderCard;
