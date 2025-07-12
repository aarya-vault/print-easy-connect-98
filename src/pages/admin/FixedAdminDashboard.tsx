
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  Star,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalReviews: number;
  status: 'active' | 'inactive';
  owner: string;
  services: string[];
}

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  status: 'active' | 'inactive';
  createdAt: string;
}

const FixedAdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  // Mock data
  const [shops, setShops] = useState<Shop[]>([
    {
      id: 'shop_1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '9876543210',
      email: 'shop1@example.com',
      rating: 4.8,
      totalReviews: 245,
      status: 'active',
      owner: 'Print Shop Owner',
      services: ['Color Printing', 'Black & White', 'Binding', 'Scanning']
    },
    {
      id: 'shop_2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '8765432109',
      email: 'campus@example.com',
      rating: 4.5,
      totalReviews: 189,
      status: 'active',
      owner: 'Campus Owner',
      services: ['Photocopying', 'Scanning', 'Lamination']
    },
    {
      id: 'shop_3',
      name: 'Digital Express',
      address: 'Forum Mall, Koramangala',
      phone: '7654321098',
      email: 'digital@example.com',
      rating: 4.9,
      totalReviews: 312,
      status: 'inactive',
      owner: 'Digital Owner',
      services: ['Color Printing', 'Photo Printing', 'Large Format']
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: 'user_1',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@email.com',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 'user_2',
      name: 'Print Shop Owner',
      phone: '8765432109',
      email: 'shop@example.com',
      role: 'shop_owner',
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: 'user_3',
      name: 'Priya Sharma',
      phone: '7654321098',
      email: 'priya@email.com',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-20'
    }
  ]);

  const handleEditShop = (shop: Shop) => {
    setEditingShop(shop);
    setIsEditModalOpen(true);
  };

  const handleSaveShop = () => {
    if (editingShop) {
      setShops(prevShops => 
        prevShops.map(shop => 
          shop.id === editingShop.id ? editingShop : shop
        )
      );
      setIsEditModalOpen(false);
      setEditingShop(null);
      toast.success('Shop updated successfully!');
    }
  };

  const handleToggleShopStatus = (shopId: string) => {
    setShops(prevShops => 
      prevShops.map(shop => 
        shop.id === shopId 
          ? { ...shop, status: shop.status === 'active' ? 'inactive' : 'active' }
          : shop
      )
    );
    toast.success('Shop status updated!');
  };

  const stats = {
    totalShops: shops.length,
    activeShops: shops.filter(s => s.status === 'active').length,
    totalUsers: users.length,
    totalOrders: 156
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span> Admin
              </h1>
              <p className="text-neutral-600">System Administration Dashboard</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="border-neutral-300 hover:bg-neutral-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Shops</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalShops}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Active Shops</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.activeShops}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="shops" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="shops" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Shops Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shops">
            <Card className="border-2 border-neutral-200 shadow-lg bg-white">
              <CardHeader className="border-b border-neutral-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-neutral-900">
                    Shops Management
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Shop
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <Card key={shop.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-bold text-neutral-900">{shop.name}</h3>
                              <Badge className={shop.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {shop.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <MapPin className="w-4 h-4" />
                                  {shop.address}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <Phone className="w-4 h-4" />
                                  {shop.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <Mail className="w-4 h-4" />
                                  {shop.email}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <Star className="w-4 h-4 text-golden-500" />
                                  {shop.rating} ({shop.totalReviews} reviews)
                                </div>
                                <div className="text-sm text-neutral-600">
                                  Owner: {shop.owner}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {shop.services.slice(0, 3).map((service, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {shop.services.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{shop.services.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditShop(shop)}
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedShop(shop)}
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleShopStatus(shop.id)}
                              className={shop.status === 'active' 
                                ? 'border-red-300 text-red-700 hover:bg-red-50' 
                                : 'border-green-300 text-green-700 hover:bg-green-50'
                              }
                            >
                              {shop.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-2 border-neutral-200 shadow-lg bg-white">
              <CardHeader className="border-b border-neutral-100">
                <CardTitle className="text-xl font-bold text-neutral-900">
                  Users Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="border border-neutral-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-golden-500 to-golden-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-neutral-600">
                                <span>{user.phone}</span>
                                {user.email && <span>{user.email}</span>}
                                <span>Joined: {user.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'shop_owner' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }
                            >
                              {user.role.replace('_', ' ')}
                            </Badge>
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Shop Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shop Details</DialogTitle>
          </DialogHeader>
          {editingShop && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Shop Name
                  </label>
                  <Input
                    value={editingShop.name}
                    onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={editingShop.phone}
                    onChange={(e) => setEditingShop({ ...editingShop, phone: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <Input
                  value={editingShop.email}
                  onChange={(e) => setEditingShop({ ...editingShop, email: e.target.value })}
                  className="h-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address
                </label>
                <Textarea
                  value={editingShop.address}
                  onChange={(e) => setEditingShop({ ...editingShop, address: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveShop}
                  className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixedAdminDashboard;
