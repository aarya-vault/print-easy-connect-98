
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

const RealTimeAnalytics: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch real-time analytics data from backend
  const { data: analyticsData, refetch, isLoading } = useQuery({
    queryKey: ['admin-realtime-analytics'],
    queryFn: async () => {
      const response = await apiService.getAdminAnalytics();
      return response.analytics;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

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
    urgentOrders: 0,
    pendingOrders: 0,
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
          title="Urgent Orders"
          value={metrics.urgentOrders}
          icon={<Clock className="w-6 h-6 text-red-600" />}
          color="bg-red-100"
        />
        <MetricCard
          title="Pending Orders"
          value={metrics.pendingOrders}
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
              Top Shop Performance
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
    </div>
  );
};

export default RealTimeAnalytics;
