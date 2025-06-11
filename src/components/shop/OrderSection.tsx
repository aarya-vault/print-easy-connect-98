
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OrderCard from './OrderCard';
import { Order, OrderFile } from '@/types/api';

interface OrderSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  orders: Order[];
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  sectionColor: string;
  onToggleUrgency: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onViewDetails: (orderId: string) => void;
  onPrintFile?: (file: OrderFile) => void;
}

const OrderSection: React.FC<OrderSectionProps> = ({
  title,
  description,
  icon,
  orders,
  emptyMessage,
  emptyIcon,
  sectionColor,
  onToggleUrgency,
  onUpdateStatus,
  onViewDetails,
  onPrintFile
}) => {
  const urgentCount = orders.filter(order => order.is_urgent).length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${sectionColor} rounded-2xl flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
            <p className="text-neutral-600">{description} - {orders.length} orders</p>
          </div>
        </div>
        <Badge className={`${sectionColor.replace('bg-', 'bg-').replace('100', '100')} text-lg px-4 py-2 border`}>
          {urgentCount} Urgent
        </Badge>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Card className={`border-0 shadow-glass ${sectionColor.replace('100', '50/30')} backdrop-blur-lg`}>
          <CardContent className="p-12 text-center">
            <div className={`w-20 h-20 ${sectionColor} rounded-full mx-auto mb-6 flex items-center justify-center`}>
              {emptyIcon}
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">No orders found</h3>
            <p className="text-neutral-600">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onToggleUrgency={onToggleUrgency}
              onUpdateStatus={onUpdateStatus}
              onViewDetails={onViewDetails}
              onPrintFile={onPrintFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderSection;
