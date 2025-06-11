
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import apiService from '@/services/api';
import { AnalyticsData } from '@/types/api';

const RealTimeAnalytics: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['admin-analytics'],
    queryFn: apiService.getAdminAnalytics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Analytics Error</h3>
          <p className="text-red-600">Failed to load analytics data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const analytics = analyticsData;
  if (!analytics) return null;

  const MetricCard: React.FC<{ 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Real-time Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Active Users"
            value={analytics.realtimeMetrics?.activeUsers || 0}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
            subtitle="Currently online"
          />
          <MetricCard
            title="Orders Today"
            value={analytics.realtimeMetrics?.ordersToday || 0}
            icon={<ShoppingBag className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
            subtitle="24h volume"
          />
          <MetricCard
            title="Urgent Orders"
            value={analytics.realtimeMetrics?.urgentOrders || 0}
            icon={<AlertCircle className="w-6 h-6 text-red-600" />}
            color="bg-red-100"
            subtitle="Needs attention"
          />
        </div>
      </div>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Order Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.ordersByStatus?.map((status) => (
              <div key={status.status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                <Badge variant="outline" className="text-xs capitalize">
                  {status.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shop Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Top Performing Shops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.shopPerformance?.slice(0, 5).map((shop, index) => (
              <div key={shop.shop_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{shop.shop_name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{shop.total_orders} orders</div>
                  <div className="text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {shop.avg_completion_time}min avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Trends (Last 7 days) */}
      <Card>
        <CardHeader>
          <CardTitle>Order Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.orderTrends?.map((trend) => (
              <div key={trend.date} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm font-medium">{trend.date}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">Digital: {trend.digital}</span>
                  <span className="text-purple-600">Walk-in: {trend.walkin}</span>
                  <span className="font-semibold">Total: {trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
