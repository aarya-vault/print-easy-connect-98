
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Zap } from 'lucide-react';

interface OrderCounts {
  total: number;
  pending: number;
  in_progress: number;
  ready: number;
  completed: number;
  urgent: number;
}

interface ActiveFilters {
  status: string;
  orderType: string;
  urgent: boolean;
}

interface OrderFiltersProps {
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  orderCounts: OrderCounts;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  activeFilters,
  onFiltersChange,
  orderCounts
}) => {
  return (
    <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={activeFilters.status}
              onChange={(e) => onFiltersChange({...activeFilters, status: e.target.value})}
              className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={activeFilters.orderType}
              onChange={(e) => onFiltersChange({...activeFilters, orderType: e.target.value})}
              className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="digital">Digital Files</option>
              <option value="walkin">Walk-in Orders</option>
            </select>
            <Button
              variant={activeFilters.urgent ? "default" : "outline"}
              onClick={() => onFiltersChange({...activeFilters, urgent: !activeFilters.urgent})}
              className={`px-4 py-3 ${activeFilters.urgent ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Urgent Only
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFilters;
export type { OrderFiltersProps };
