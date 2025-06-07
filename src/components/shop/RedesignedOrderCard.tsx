
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  MessageCircle, 
  Eye, 
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { ShopOrder } from '@/types/order';

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
  const getStatusColor = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received': return <Clock className="w-3 h-3" />;
      case 'started': return <PlayCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getNextStatus = (currentStatus: ShopOrder['status']): ShopOrder['status'] | null => {
    switch (currentStatus) {
      case 'received': return 'started';
      case 'started': return 'completed';
      case 'completed': return null;
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const timeAgo = new Date(Date.now() - order.createdAt.getTime()).getMinutes();

  return (
    <Card className={`border-2 transition-all duration-200 hover:shadow-lg ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-neutral-200 bg-white'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with urgent indicator */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{order.customerName}</h3>
                {order.isUrgent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleUrgency(order.id)}
                    className="h-6 px-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Zap className="w-3 h-3" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-neutral-600">{order.id} • {timeAgo}m ago</p>
            </div>
            <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>

          {/* Order details */}
          <div>
            <p className="text-xs text-neutral-600 line-clamp-2 mb-2">{order.description}</p>
            
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
          </div>

          {/* Services */}
          {order.services && order.services.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {order.services.slice(0, 2).map((service, index) => (
                <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                  {service}
                </span>
              ))}
              {order.services.length > 2 && (
                <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                  +{order.services.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCall(order.customerPhone)}
              className="h-8 text-xs"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChat(order.id)}
              className="h-8 text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="h-8 text-xs col-span-1"
            >
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
                className="h-8 text-xs bg-blue-500 hover:bg-blue-600 text-white"
              >
                {nextStatus === 'started' ? 'Start' : 'Complete'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RedesignedOrderCard;
