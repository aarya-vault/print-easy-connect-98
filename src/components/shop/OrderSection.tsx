
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OrderCard from './OrderCard';
import { Order } from '@/types/api';

interface OrderSectionProps {
  title: string;
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
  onUrgencyToggle: (orderId: string) => Promise<void>;
  onCallCustomer: (phone: string) => void;
  onOpenChat: (order: Order) => void;
  isLoading: boolean;
}

const OrderSection: React.FC<OrderSectionProps> = ({
  title,
  orders,
  onOrderSelect,
  onStatusUpdate,
  onUrgencyToggle,
  onCallCustomer,
  onOpenChat,
  isLoading
}) => {
  const urgentCount = orders.filter(order => order.is_urgent).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary">Loading...</Badge>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Badge variant="secondary">{orders.length} orders</Badge>
          {urgentCount > 0 && (
            <Badge variant="destructive">{urgentCount} urgent</Badge>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-neutral-600">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onToggleUrgency={() => onUrgencyToggle(order.id)}
              onUpdateStatus={(status) => onStatusUpdate(order.id, status)}
              onViewDetails={() => onOrderSelect(order)}
              onCallCustomer={() => onCallCustomer(order.customer_phone)}
              onOpenChat={() => onOpenChat(order)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderSection;
export type { OrderSectionProps };
