
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Phone, 
  Eye, 
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ShopOrder } from '@/types/order';

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

  return (
    <Card className={`border-2 transition-all duration-200 hover:shadow-md ${
      order.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-neutral-200 bg-white'
    }`}>
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{order.customerName}</h3>
                {order.isUrgent && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-neutral-600 truncate">ID: {order.id}</p>
            </div>
            <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-600 line-clamp-2">{order.description}</p>

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

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="flex-1 h-8 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`tel:${order.customerPhone}`)}
              className="h-8 px-3"
            >
              <Phone className="w-3 h-3" />
            </Button>
            {nextStatus && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
                className="h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white"
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

export default MinimalOrderCard;
