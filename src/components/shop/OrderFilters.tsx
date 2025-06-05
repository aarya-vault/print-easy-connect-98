
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Zap } from 'lucide-react';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  orderTypeFilter: string;
  onOrderTypeFilterChange: (value: string) => void;
  urgentOnly: boolean;
  onUrgentOnlyChange: (value: boolean) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  orderTypeFilter,
  onOrderTypeFilterChange,
  urgentOnly,
  onUrgentOnlyChange
}) => {
  return (
    <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search orders, customers, order IDs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={orderTypeFilter}
              onChange={(e) => onOrderTypeFilterChange(e.target.value)}
              className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="uploaded-files">Uploaded Files</option>
              <option value="walk-in">Walk-in Orders</option>
            </select>
            <Button
              variant={urgentOnly ? "default" : "outline"}
              onClick={() => onUrgentOnlyChange(!urgentOnly)}
              className={`px-4 py-3 ${urgentOnly ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
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
