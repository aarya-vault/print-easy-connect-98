
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MobileHeader from '@/components/layout/MobileHeader';
import { 
  Users,
  Building,
  Package,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  lastActive: Date;
}

interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalOrders: number;
  createdAt: Date;
}

const MobileAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'shops' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data
  const [stats] = useState({
    totalUsers: 1247,
    totalShops: 89,
    totalOrders: 5670,
    monthlyRevenue: 125000,
    pendingApprovals: 7,
    activeShops: 82,
    newUsersToday: 23,
    ordersToday: 145
  });

  const [users] = useState<User[]>([
    {
      id: 'user1',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      role: 'customer',
      isVerified: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'user2',
      name: 'Print Shop Owner',
      email: 'shop@example.com',
      role: 'shop_owner',
      isVerified: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'user3',
      name: 'Priya Sharma',
      phone: '8765432109',
      role: 'customer',
      isVerified: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);

  const [shops] = useState<Shop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      ownerName: 'Amit Patel',
      phone: '9876543210',
      email: 'amit@quickprint.com',
      address: 'MG Road, Bangalore',
      status: 'approved',
      rating: 4.8,
      totalOrders: 245,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'shop2',
      name: 'Digital Express',
      ownerName: 'Sneha Reddy',
      phone: '8765432109',
      email: 'sneha@digitalexpress.com',
      address: 'Koramangala, Bangalore',
      status: 'pending',
      rating: 0,
      totalOrders: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'shop3',
      name: 'Campus Copy Center',
      ownerName: 'Ravi Singh',
      phone: '7654321098',
      email: 'ravi@campuscopy.com',
      address: 'Whitefield, Bangalore',
      status: 'approved',
      rating: 4.5,
      totalOrders: 189,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  const handleApproveShop = (shopId: string) => {
    toast.success(`Shop ${shopId} approved successfully!`);
  };

  const handleRejectShop = (shopId: string) => {
    toast.error(`Shop ${shopId} rejected.`);
  };

  const handleVerifyUser = (userId: string) => {
    toast.success(`User ${userId} verified successfully!`);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'shop_owner': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingShops = shops.filter(shop => shop.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="Admin Dashboard" 
        showMenu={true}
      />
      
      {/* Admin Info Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">PrintEasy Admin Panel</h2>
            <p className="text-white/80 text-sm">Platform management and oversight</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="secondary"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards - Mobile Horizontal Scroll */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Card className="min-w-[130px] flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-3 text-center">
              <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-900">{stats.totalUsers}</div>
              <div className="text-xs text-blue-700">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[130px] flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 text-center">
              <Building className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-900">{stats.activeShops}</div>
              <div className="text-xs text-green-700">Active Shops</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[130px] flex-shrink-0 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-3 text-center">
              <Package className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-yellow-900">{stats.totalOrders}</div>
              <div className="text-xs text-yellow-700">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="min-w-[130px] flex-shrink-0 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-900">₹{stats.monthlyRevenue / 1000}K</div>
              <div className="text-xs text-purple-700">Monthly Rev</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {pendingShops.length > 0 && (
        <div className="px-4 pb-4">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">
                  {pendingShops.length} shop{pendingShops.length > 1 ? 's' : ''} pending approval
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-4 pb-4">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'shops', label: 'Shops', badge: stats.pendingApprovals },
            { key: 'orders', label: 'Orders' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <Badge className={`absolute -top-1 -right-1 px-1 min-w-[18px] h-4 text-xs ${
                  activeTab === tab.key ? 'bg-white text-primary' : 'bg-red-500 text-white'
                }`}>
                  {tab.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Today's Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New Users</span>
                  <span className="font-medium">{stats.newUsersToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Orders Placed</span>
                  <span className="font-medium">{stats.ordersToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shop Applications</span>
                  <span className="font-medium">{pendingShops.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium">Quick Print Solutions</span> completed 3 orders
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium">Digital Express</span> applied for approval
                  </div>
                  <span className="text-xs text-muted-foreground">4h ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium">23 new customers</span> registered today
                  </div>
                  <span className="text-xs text-muted-foreground">6h ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{user.name}</h3>
                            {!user.isVerified && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Unverified
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.phone && <div>📱 {user.phone}</div>}
                            {user.email && <div>✉️ {user.email}</div>}
                          </div>
                        </div>
                        <Badge className={`text-xs px-2 py-1 ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Joined {formatTimeAgo(user.createdAt)}</span>
                        <span>Active {formatTimeAgo(user.lastActive)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyUser(user.id)}
                            className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className={shop.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : ''}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{shop.name}</h3>
                            {shop.status === 'pending' && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Owner: {shop.ownerName}</p>
                          <p className="text-sm text-muted-foreground truncate">{shop.address}</p>
                        </div>
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(shop.status)}`}>
                          {shop.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{shop.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{shop.email}</span>
                        </div>
                      </div>

                      {shop.status === 'approved' && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Rating: {shop.rating}/5</span>
                          <span>{shop.totalOrders} orders</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {shop.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveShop(shop.id)}
                              className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejectShop(shop.id)}
                              className="text-xs bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">Order Management</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive order tracking and analytics coming soon.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAdminDashboard;
