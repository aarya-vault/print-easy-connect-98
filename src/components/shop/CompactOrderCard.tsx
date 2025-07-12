
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Eye, 
  Clock,
  Upload,
  UserCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { ShopOrder } from '@/types/order';

interface CompactOrderCardProps {
  order: ShopOrder;
  onCall: (phone: string) => void;
  onChat: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: ShopOrder['status']) => void;
  onToggleUrgency: (orderId: string) => void;
}

const CompactOrderCard: React.FC<CompactOrderCardProps> = ({
  order,
  onCall,
  onChat,
  onViewDetails,
  onUpdateStatus,
  onToggleUrgency
}) => {
  const getStatusColor = (status: ShopOrder['status']) => {
    switch (status) {
      case 'received':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'started':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNextStatus = (currentStatus: ShopOrder['status']): ShopOrder['status'] => {
    switch (currentStatus) {
      case 'received':
        return 'started';
      case 'started':
        return 'completed';
      default:
        return currentStatus;
    }
  };

  const canAdvanceStatus = order.status !== 'completed';

  const timeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md border ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
    }`}>
      <CardContent className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {order.orderType === 'uploaded-files' ? (
                <Upload className="w-3 h-3 text-blue-600 flex-shrink-0" />
              ) : (
                <UserCheck className="w-3 h-3 text-purple-600 flex-shrink-0" />
              )}
              <span className="text-xs font-mono text-gray-500 truncate">{order.id}</span>
            </div>
            <h3 className="font-semibold text-sm text-gray-900 leading-tight truncate">
              {order.customerName}
            </h3>
            <p className="text-xs text-gray-600 truncate">{order.customerPhone}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
            {order.isUrgent && (
              <Badge className="text-xs px-2 py-0.5 bg-red-100 text-red-800 border-red-300">
                <Zap className="w-3 h-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
        </div>

        {/* Description - Truncated */}
        <div className="space-y-1">
          <p className="text-xs text-gray-700 line-clamp-2 leading-tight">
            {order.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{timeAgo(order.createdAt)}</span>
            {order.pages && (
              <span>{order.pages} page{order.pages > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCall(order.customerPhone)}
            className="flex-1 h-7 text-xs"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChat(order.id)}
            className="flex-1 h-7 text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
            className="h-7 px-2"
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>

        {/* Status Advancement */}
        {canAdvanceStatus && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
            className="w-full h-7 text-xs bg-blue-500 hover:bg-blue-600 text-white"
          >
            Mark as {getNextStatus(order.status)}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        )}

        {/* Urgency Toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onToggleUrgency(order.id)}
          className={`w-full h-6 text-xs ${
            order.isUrgent 
              ? 'text-red-600 hover:bg-red-50' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {order.isUrgent ? 'Remove Urgency' : 'Mark Urgent'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompactOrderCard;
