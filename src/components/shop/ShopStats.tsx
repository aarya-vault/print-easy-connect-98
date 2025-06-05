
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, Zap, Upload, UserCheck } from 'lucide-react';

interface ShopStatsProps {
  todayOrders: number;
  pendingOrders: number;
  urgentOrders: number;
  completedToday: number;
  uploadedFilesCount: number;
  walkInCount: number;
}

const ShopStats: React.FC<ShopStatsProps> = ({
  todayOrders,
  pendingOrders,
  urgentOrders,
  completedToday,
  uploadedFilesCount,
  walkInCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Today's Orders</p>
              <p className="text-2xl font-bold text-neutral-900">{todayOrders}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-golden rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Pending</p>
              <p className="text-2xl font-bold text-neutral-900">{pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Urgent</p>
              <p className="text-2xl font-bold text-neutral-900">{urgentOrders}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Completed Today</p>
              <p className="text-2xl font-bold text-neutral-900">{completedToday}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Uploaded Files</p>
              <p className="text-2xl font-bold text-neutral-900">{uploadedFilesCount}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 font-medium mb-1">Walk-ins</p>
              <p className="text-2xl font-bold text-neutral-900">{walkInCount}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopStats;
