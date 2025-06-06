
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
  Upload,
  UserCheck,
  ArrowRight
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed';
  isUrgent: boolean;
  description: string;
  createdAt: Date;
}

interface CompactOrderCardProps {
  order: Order;
  onCall: (phone: string) => void;
  onChat: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'started': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getNextStatus = () => {
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
    <Card className={`hover:shadow-md transition-all duration-200 ${
      order.isUrgent ? 'border-red-300 bg-red-50/50' : 
      order.orderType === 'uploaded-files' ? 'border-blue-200' : 'border-purple-200'
    } ${order.status === 'completed' ? 'opacity-75' : ''}`}>
      <CardContent className="p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">{order.customerName}</h3>
              {order.isUrgent && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-mono">#{order.id}</span>
              <span>•</span>
              <span>{formatTimeAgo(order.createdAt)}</span>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(order.id)}
            className="ml-2 h-8 w-8 p-0 flex-shrink-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3">
          <Badge className={`text-xs ${
            order.orderType === 'uploaded-files' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'
          }`}>
            {order.orderType === 'uploaded-files' ? (
              <><Upload className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />Files</>
            ) : (
              <><UserCheck className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />Walk-in</>
            )}
          </Badge>
          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
          {order.description}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Top row - Quick actions */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCall(order.customerPhone)}
              className="h-8 text-xs px-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Phone className="w-3 h-3" />
              <span className="ml-1 hidden sm:inline">Call</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChat(order.id)}
              className="h-8 text-xs px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="ml-1 hidden sm:inline">Chat</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleUrgency(order.id)}
              className={`h-8 text-xs px-2 ${order.isUrgent ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
            >
              <Zap className="w-3 h-3" />
              <span className="ml-1 hidden sm:inline">{order.isUrgent ? 'Urgent' : 'Normal'}</span>
            </Button>
          </div>

          {/* Status action button */}
          {nextStatus && statusAction && order.status !== 'completed' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(order.id, nextStatus as Order['status'])}
              className="w-full h-8 text-xs bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-medium"
            >
              {statusAction}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactOrderCard;
