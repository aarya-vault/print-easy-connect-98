
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Users, 
  FileText, 
  TrendingUp,
  Search,
  MapPin,
  Phone,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  X
} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  totalOrders: number;
  revenue: number;
  joinedDate: Date;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'shop_owner';
  totalOrders: number;
  lastActive: Date;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const [shops] = useState<Shop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '9876543210',
      email: 'contact@quickprint.com',
      rating: 4.8,
      totalReviews: 245,
      isActive: true,
      totalOrders: 1250,
      revenue: 125000,
      joinedDate: new Date('2023-01-15')
    },
    {
      id: 'shop2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '8765432109',
      email: 'info@campuscopy.com',
      rating: 4.5,
      totalReviews: 189,
      isActive: true,
      totalOrders: 890,
      revenue: 67000,
      joinedDate: new Date('2023-03-20')
    },
    {
      id: 'shop3',
      name: 'Digital Express Printing',
      address: 'Forum Mall, Level 1, Koramangala',
      phone: '7654321098',
      email: 'hello@digitalexpress.com',
      rating: 4.9,
      totalReviews: 312,
      isActive: true,
      totalOrders: 1890,
      revenue: 289000,
      joinedDate: new Date('2022-11-10')
    },
    {
      id: 'shop4',
      name: 'Print Hub Express',
      address: 'HSR Layout, Sector 7',
      phone: '5555566666',
      email: 'support@printhub.com',
      rating: 4.6,
      totalReviews: 156,
      isActive: false,
      totalOrders: 567,
      revenue: 45000,
      joinedDate: new Date('2023-06-05')
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: 'user1',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@email.com',
      role: 'customer',
      totalOrders: 15,
      lastActive: new Date('2024-01-15')
    },
    {
      id: 'user2',
      name: 'Print Shop Owner',
      phone: '8765432109',
      email: 'shop@example.com',
      role: 'shop_owner',
      totalOrders: 0,
      lastActive: new Date('2024-01-14')
    },
    {
      id: 'user3',
      name: 'Priya Sharma',
      phone: '7654321098',
      email: 'priya@email.com',
      role: 'customer',
      totalOrders: 8,
      lastActive: new Date('2024-01-13')
    }
  ]);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.phone.includes(searchTerm)
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalRevenue = shops.reduce((sum, shop) => sum + shop.revenue, 0);
  const totalOrders = shops.reduce((sum, shop) => sum + shop.totalOrders, 0);
  const activeShops = shops.filter(shop => shop.isActive).length;
  const totalCustomers = users.filter(user => user.role === 'customer').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-cream-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span> Admin
              </h1>
              <p className="text-sm text-neutral-600">Welcome back, {user?.name}!</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-sm font-medium"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="shops" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Shops
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-2 border-neutral-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-neutral-900">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-neutral-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-neutral-900">{totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-neutral-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium">Active Shops</p>
                      <p className="text-2xl font-bold text-neutral-900">{activeShops}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-neutral-200 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium">Total Customers</p>
                      <p className="text-2xl font-bold text-neutral-900">{totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-golden-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-golden-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Shops */}
            <Card className="border-2 border-neutral-200 shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Top Performing Shops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shops
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((shop, index) => (
                      <div key={shop.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-golden-100 rounded-full flex items-center justify-center font-bold text-golden-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{shop.name}</h3>
                            <p className="text-sm text-neutral-600">{shop.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900">₹{shop.revenue.toLocaleString()}</p>
                          <p className="text-sm text-neutral-600">{shop.totalOrders} orders</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops">
            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-neutral-200 focus:border-golden-500"
                />
              </div>
              <Button className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Shop
              </Button>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredShops.map((shop) => (
                <Card key={shop.id} className="border-2 border-neutral-200 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-golden-600 rounded-xl flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900">{shop.name}</h3>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-golden-500 fill-current" />
                            <span className="font-semibold text-neutral-900">{shop.rating}</span>
                            <span className="text-sm text-neutral-500">({shop.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${shop.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {shop.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        {shop.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{shop.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Orders</p>
                        <p className="font-bold text-neutral-900">{shop.totalOrders}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Revenue</p>
                        <p className="font-bold text-neutral-900">₹{shop.revenue.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Joined</p>
                        <p className="font-bold text-neutral-900">{shop.joinedDate.getFullYear()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-neutral-200 focus:border-golden-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <Card className="border-2 border-neutral-200 shadow-lg bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-neutral-900">User</th>
                        <th className="text-left p-4 font-semibold text-neutral-900">Contact</th>
                        <th className="text-left p-4 font-semibold text-neutral-900">Role</th>
                        <th className="text-left p-4 font-semibold text-neutral-900">Orders</th>
                        <th className="text-left p-4 font-semibold text-neutral-900">Last Active</th>
                        <th className="text-left p-4 font-semibold text-neutral-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-neutral-900">{user.name}</p>
                              <p className="text-sm text-neutral-600">ID: {user.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="text-sm text-neutral-900">{user.phone}</p>
                              {user.email && <p className="text-sm text-neutral-600">{user.email}</p>}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={user.role === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                              {user.role === 'customer' ? 'Customer' : 'Shop Owner'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-neutral-900">{user.totalOrders}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-neutral-600">
                              {user.lastActive.toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
