
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Store, 
  Package, 
  Activity,
  RefreshCw,
  Search,
  Plus,
  Eye,
  Settings,
  Edit,
  Trash2,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RealTimeAnalytics from '@/components/admin/RealTimeAnalytics';

interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  allows_offline_orders: boolean;
  shop_timings: string;
  owner: {
    name: string;
    email: string;
  };
  created_at: string;
}

const ProductionAdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'shops'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dashboard stats
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: apiService.getAdminStats,
    refetchInterval: 30000,
  });

  // Fetch users
  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: () => apiService.getAdminUsers({ search: searchTerm }),
    enabled: activeTab === 'users',
  });

  // Fetch shops
  const { data: shopsData, refetch: refetchShops } = useQuery({
    queryKey: ['admin-shops'],
    queryFn: apiService.getAdminShops,
    enabled: activeTab === 'shops',
  });

  const stats = statsData?.stats || {};
  const users = usersData?.users || [];
  const shops = shopsData?.shops || [];

  const handleRefresh = () => {
    refetchStats();
    if (activeTab === 'users') refetchUsers();
    if (activeTab === 'shops') refetchShops();
    toast.success('Data refreshed');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleOfflineAccess = async (shopId: number, currentValue: boolean) => {
    try {
      await apiService.updateShopSettings(shopId, {
        allows_offline_orders: !currentValue
      });
      refetchShops();
      toast.success(`Offline access ${!currentValue ? 'enabled' : 'disabled'} for shop`);
    } catch (error) {
      toast.error('Failed to update offline access');
    }
  };

  const handleToggleShopStatus = async (shopId: number, currentValue: boolean) => {
    try {
      await apiService.updateShopSettings(shopId, {
        is_active: !currentValue
      });
      refetchShops();
      toast.success(`Shop ${!currentValue ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update shop status');
    }
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ 
    title, value, icon, color 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${color} mr-4`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      {/* Header */}
      <div className="bg-white border-b border-golden-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Print<span className="text-golden-600">Easy</span> Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, shops, and monitor system analytics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={<Activity className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <StatCard
            title="Total Shops"
            value={stats.totalShops}
            icon={<Store className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Package className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'analytics', label: 'Real-Time Analytics', icon: Activity },
                { id: 'users', label: 'Users Management', icon: Users },
                { id: 'shops', label: 'Shops Management', icon: Store }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-golden-500 text-golden-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'analytics' && (
              <RealTimeAnalytics />
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Users Management</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user: any) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email || user.phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={`${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'shop_owner' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shops' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Shops Management</h2>
                  <Button onClick={() => navigate('/admin/add-shop')} className="bg-golden-500 hover:bg-golden-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Shop
                  </Button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offline Orders</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timings</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {shops.map((shop: Shop) => (
                          <tr key={shop.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{shop.address}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shop.owner?.name}</div>
                                <div className="text-sm text-gray-500">{shop.owner?.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={shop.is_active}
                                  onCheckedChange={() => handleToggleShopStatus(shop.id, shop.is_active)}
                                />
                                <span className="text-sm text-gray-600">
                                  {shop.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={shop.allows_offline_orders}
                                  onCheckedChange={() => handleToggleOfflineAccess(shop.id, shop.allows_offline_orders)}
                                />
                                <span className="text-sm text-gray-600">
                                  {shop.allows_offline_orders ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {shop.shop_timings || 'Not set'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionAdminDashboard;
