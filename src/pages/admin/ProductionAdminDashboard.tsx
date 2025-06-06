
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Bell, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  Settings,
  Activity,
  FileText,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  shopId?: string;
  isActive: boolean;
  createdAt: string;
}

interface Shop {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  ownerName: string;
  ownerId?: string;
  isActive: boolean;
  allowsOfflineOrders: boolean;
  totalOrders: number;
  rating: number;
  createdAt: string;
}

const ProductionAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [shopSearchTerm, setShopSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        email: 'rajesh@example.com',
        role: 'customer',
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Shop Owner',
        phone: '9876543211',
        email: 'shop@example.com',
        role: 'shop_owner',
        shopId: '1',
        isActive: true,
        createdAt: '2024-01-10'
      }
    ];

    const mockShops: Shop[] = [
      {
        id: '1',
        name: 'Quick Print Solutions',
        slug: 'quick-print-solutions',
        address: 'Shop 12, MG Road, Bangalore',
        phone: '9876543210',
        email: 'shop@printeasy.com',
        ownerName: 'Shop Owner',
        ownerId: '2',
        isActive: true,
        allowsOfflineOrders: true,
        totalOrders: 125,
        rating: 4.5,
        createdAt: '2024-01-10'
      }
    ];

    setUsers(mockUsers);
    setShops(mockShops);
  }, []);

  const handleUserUpdate = async (user: User) => {
    try {
      // API call would go here
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      toast.success('User updated successfully');
      setIsUserModalOpen(false);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleShopUpdate = async (shop: Shop) => {
    try {
      // API call would go here
      setShops(prev => prev.map(s => s.id === shop.id ? shop : s));
      toast.success('Shop updated successfully');
      setIsShopModalOpen(false);
    } catch (error) {
      toast.error('Failed to update shop');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.phone.includes(userSearchTerm) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.phone.includes(shopSearchTerm) ||
    shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalShops: shops.length,
    activeShops: shops.filter(s => s.isActive).length,
    totalOrders: shops.reduce((sum, shop) => sum + shop.totalOrders, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, shops, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shops</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalShops}</p>
                </div>
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shops</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeShops}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="shops">Shop Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <Button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
                <Input
                  placeholder="Search users by name, phone, or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                            {user.email && (
                              <>
                                <Mail className="w-4 h-4 ml-2" />
                                <span>{user.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'shop_owner' ? 'default' : 'secondary'}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Shop Management</CardTitle>
                  <Button onClick={() => { setSelectedShop(null); setIsShopModalOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shop
                  </Button>
                </div>
                <Input
                  placeholder="Search shops by name, phone, or address..."
                  value={shopSearchTerm}
                  onChange={(e) => setShopSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredShops.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{shop.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{shop.phone}</span>
                            <span>•</span>
                            <span>{shop.totalOrders} orders</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge variant={shop.isActive ? 'default' : 'secondary'}>
                            {shop.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant={shop.allowsOfflineOrders ? 'default' : 'outline'}>
                            {shop.allowsOfflineOrders ? 'Offline Orders' : 'Online Only'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedShop(shop); setIsShopModalOpen(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Customer Accounts</span>
                      <span className="font-semibold">{users.filter(u => u.role === 'customer').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shop Owners</span>
                      <span className="font-semibold">{users.filter(u => u.role === 'shop_owner').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shops with Offline Module</span>
                      <span className="font-semibold">{shops.filter(s => s.allowsOfflineOrders).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Shop Rating</span>
                      <span className="font-semibold">{(shops.reduce((sum, s) => sum + s.rating, 0) / shops.length).toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">New shop registration pending approval</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm">5 new orders in the last hour</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">3 new customer registrations today</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Modal */}
        <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
            </DialogHeader>
            <UserForm 
              user={selectedUser} 
              onSave={handleUserUpdate}
              onCancel={() => setIsUserModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Shop Modal */}
        <Dialog open={isShopModalOpen} onOpenChange={setIsShopModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedShop ? 'Edit Shop' : 'Add Shop'}</DialogTitle>
            </DialogHeader>
            <ShopForm 
              shop={selectedShop} 
              onSave={handleShopUpdate}
              onCancel={() => setIsShopModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// User Form Component
const UserForm: React.FC<{
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>(
    user || { name: '', phone: '', email: '', role: 'customer', isActive: true }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as User);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

// Shop Form Component
const ShopForm: React.FC<{
  shop: Shop | null;
  onSave: (shop: Shop) => void;
  onCancel: () => void;
}> = ({ shop, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Shop>>(
    shop || { 
      name: '', 
      address: '', 
      phone: '', 
      email: '', 
      ownerName: '', 
      isActive: true, 
      allowsOfflineOrders: true 
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Shop);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Shop Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            value={formData.ownerName || ''}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="allowsOfflineOrders"
            checked={formData.allowsOfflineOrders}
            onCheckedChange={(checked) => setFormData({ ...formData, allowsOfflineOrders: checked })}
          />
          <Label htmlFor="allowsOfflineOrders">Allow Offline Orders</Label>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
      </div>
    </form>
  );
};

export default ProductionAdminDashboard;
