
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
  Zap,
  Upload,
  UserCheck
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
  const timeAgo = Math.floor((Date.now() - order.createdAt.getTime()) / (1000 * 60));

  return (
    <Card className={`border transition-all duration-200 hover:shadow-md ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
    }`}>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-2">
                {order.orderType === 'uploaded-files' ? (
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                ) : (
                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                )}
                <h3 className="font-semibold text-xs sm:text-sm truncate">{order.customerName}</h3>
                {order.isUrgent && (
                  <button
                    onClick={() => onToggleUrgency(order.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{order.id}</span>
                <span>•</span>
                <span>{timeAgo}m ago</span>
              </div>
            </div>
            <Badge className={`text-xs px-1 sm:px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="hidden sm:inline">{order.status}</span>
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2">{order.description}</p>

          {/* Order details */}
          <div className="flex flex-wrap gap-1 text-xs">
            {order.pages && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {order.pages}p
              </span>
            )}
            {order.copies && order.copies > 1 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {order.copies}x
              </span>
            )}
            {order.color && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Color</span>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCall(order.customerPhone)}
              className="h-7 sm:h-8 text-xs px-2"
            >
              <Phone className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Call</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChat(order.id)}
              className="h-7 sm:h-8 text-xs px-2"
            >
              <MessageCircle className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="h-7 sm:h-8 text-xs px-2"
            >
              <Eye className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">View</span>
            </Button>
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
                className="h-7 sm:h-8 text-xs px-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <span className="sm:hidden">
                  {nextStatus === 'started' ? 'Start' : 'Done'}
                </span>
                <span className="hidden sm:inline">
                  {nextStatus === 'started' ? 'Start' : 'Complete'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactOrderCard;
