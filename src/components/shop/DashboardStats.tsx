
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap, Package, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  todayOrders: number;
  urgentOrders: number;
  pendingOrders: number;
  totalOrders: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  todayOrders,
  urgentOrders,
  pendingOrders,
  totalOrders
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Today's Orders</p>
            <p className="text-2xl font-bold text-gray-900">{todayOrders}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Urgent Orders</p>
            <p className="text-2xl font-bold text-red-600">{urgentOrders}</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
