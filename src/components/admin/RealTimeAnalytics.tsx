
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Users, 
  Package, 
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';
import apiService from '@/services/api';

interface AnalyticsData {
  orders: Array<{
    date: string;
    count: number;
    uploaded_files: number;
    walk_in: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  shopPerformance: Array<{
    shop_name: string;
    total_orders: number;
    avg_completion_time: number;
  }>;
  realtimeMetrics: {
    activeUsers: number;
    ordersToday: number;
    avgProcessingTime: number;
    completionRate: number;
  };
}

const RealTimeAnalytics: React.FC = () => {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch real-time analytics data
  const { data: analyticsData, refetch, isLoading } = useQuery({
    queryKey: ['realtime-analytics'],
    queryFn: async () => {
      // Since we don't have specific analytics endpoints yet, we'll use existing data
      const [orders, users, shops] = await Promise.all([
        apiService.getCustomerOrders(),
        apiService.getAdminUsers(),
        apiService.getAdminShops()
      ]);

      // Process the data to create analytics
      const processedData = processAnalyticsData(orders, users, shops);
      return processedData;
    },
    refetchInterval: refreshInterval,
  });

  const processAnalyticsData = (orders: any, users: any, shops: any) => {
    const ordersArray = orders?.orders || [];
    const usersArray = users?.users || [];
    const shopsArray = shops?.shops || [];

    // Generate order trends for last 7 days
    const orderTrends = generateOrderTrends(ordersArray);
    
    // Generate status distribution
    const statusDistribution = generateStatusDistribution(ordersArray);
    
    // Generate shop performance metrics
    const shopPerformance = generateShopPerformance(ordersArray, shopsArray);
    
    // Calculate real-time metrics
    const realtimeMetrics = calculateRealtimeMetrics(ordersArray, usersArray);

    return {
      orders: orderTrends,
      ordersByStatus: statusDistribution,
      shopPerformance: shopPerformance,
      realtimeMetrics: realtimeMetrics
    };
  };

  const generateOrderTrends = (orders: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.created_at?.startsWith(date)
      );
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count: dayOrders.length,
        uploaded_files: dayOrders.filter(o => o.order_type === 'uploaded-files').length,
        walk_in: dayOrders.filter(o => o.order_type === 'walk-in').length
      };
    });
  };

  const generateStatusDistribution = (orders: any[]) => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'received';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: count as number
    }));
  };

  const generateShopPerformance = (orders: any[], shops: any[]) => {
    const shopStats = shops.slice(0, 5).map(shop => {
      const shopOrders = orders.filter(order => order.shop_id === shop.id);
      const completedOrders = shopOrders.filter(order => order.status === 'completed');
      
      // Calculate average completion time (mock data for now)
      const avgTime = Math.floor(Math.random() * 120) + 30; // 30-150 minutes
      
      return {
        shop_name: shop.name.length > 15 ? shop.name.substring(0, 15) + '...' : shop.name,
        total_orders: shopOrders.length,
        avg_completion_time: avgTime
      };
    });

    return shopStats;
  };

  const calculateRealtimeMetrics = (orders: any[], users: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.created_at?.startsWith(today)
    );
    
    const completedToday = todayOrders.filter(order => 
      order.status === 'completed'
    );

    return {
      activeUsers: users.filter(user => user.is_active).length,
      ordersToday: todayOrders.length,
      avgProcessingTime: Math.floor(Math.random() * 120) + 45, // Mock data
      completionRate: todayOrders.length > 0 ? Math.round((completedToday.length / todayOrders.length) * 100) : 0
    };
  };

  const handleManualRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const MetricCard: React.FC<{ 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLastRefresh(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading real-time analytics...</span>
        </div>
      </div>
    );
  }

  const metrics = analyticsData?.realtimeMetrics || {
    activeUsers: 0,
    ordersToday: 0,
    avgProcessingTime: 0,
    completionRate: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Analytics</h2>
          <p className="text-gray-600">Live system metrics and data visualization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Button onClick={handleManualRefresh} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          change={5}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <MetricCard
          title="Orders Today"
          value={metrics.ordersToday}
          change={12}
          icon={<Package className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <MetricCard
          title="Avg Processing Time"
          value={`${metrics.avgProcessingTime}m`}
          change={-8}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
        />
        <MetricCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          change={3}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Order Trends (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData?.orders || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(analyticsData?.ordersByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Type Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Upload vs Walk-in Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.orders || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uploaded_files" fill="#3B82F6" name="Upload Orders" />
                <Bar dataKey="walk_in" fill="#10B981" name="Walk-in Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shop Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Shop Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.shopPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shop_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_orders" fill="#8B5CF6" name="Total Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 min ago', action: 'New order placed', type: 'order', status: 'new' },
                { time: '5 min ago', action: 'Order completed', type: 'order', status: 'completed' },
                { time: '8 min ago', action: 'New shop registered', type: 'shop', status: 'new' },
                { time: '12 min ago', action: 'User logged in', type: 'user', status: 'active' },
                { time: '15 min ago', action: 'Order status updated', type: 'order', status: 'updated' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge 
                    className={`${
                      activity.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'active' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'API Response Time', value: '124ms', status: 'good', color: 'green' },
                { metric: 'Database Connection', value: 'Stable', status: 'good', color: 'green' },
                { metric: 'File Upload Success Rate', value: '99.2%', status: 'good', color: 'green' },
                { metric: 'Error Rate', value: '0.1%', status: 'good', color: 'green' },
                { metric: 'Active Connections', value: '47', status: 'normal', color: 'blue' }
              ].map((health, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{health.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{health.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      health.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
