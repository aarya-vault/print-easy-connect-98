
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Users, 
  Store, 
  TrendingUp, 
  FileText,
  Edit,
  Trash2,
  UserPlus,
  Plus,
  Search,
  Bell,
  User as UserIcon
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
  createdAt: Date;
}

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  ownerName: string;
  rating: number;
  totalOrders: number;
  isActive: boolean;
  allowsOfflineOrders: boolean;
  createdAt: Date;
}

const ProductionAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isShopDialogOpen, setIsShopDialogOpen] = useState(false);

  // Mock data based on seeded data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        phone: '9876543210',
        role: 'customer',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        name: 'Quick Print Owner',
        phone: '9876543211',
        email: 'shop@printeasy.com',
        role: 'shop_owner',
        shopId: '1',
        isActive: true,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        id: '3',
        name: 'PrintEasy Admin',
        email: 'admin@printeasy.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date(Date.now() - 259200000)
      },
      {
        id: '4',
        name: 'Priya Sharma',
        phone: '9876543211',
        role: 'customer',
        isActive: true,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        id: '5',
        name: 'Amit Singh',
        phone: '9876543212',
        role: 'customer',
        isActive: true,
        createdAt: new Date(Date.now() - 172800000)
      }
    ];

    const mockShops: Shop[] = [
      {
        id: '1',
        name: 'Quick Print Solutions',
        address: 'Shop 12, MG Road, Bangalore, Karnataka 560001',
        phone: '+91 98765 43210',
        email: 'shop@quickprint.com',
        ownerName: 'Quick Print Owner',
        rating: 4.5,
        totalOrders: 156,
        isActive: true,
        allowsOfflineOrders: true,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        id: '2',
        name: 'Digital Print Hub',
        address: 'Plot 45, Electronic City, Bangalore, Karnataka 560100',
        phone: '+91 98765 43211',
        email: 'info@digitalprinthub.com',
        ownerName: 'Not Assigned',
        rating: 4.2,
        totalOrders: 89,
        isActive: true,
        allowsOfflineOrders: false,
        createdAt: new Date(Date.now() - 259200000)
      }
    ];

    setUsers(mockUsers);
    setShops(mockShops);
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleEditShop = (shop: Shop) => {
    setSelectedShop(shop);
    setIsShopDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(prev => 
        prev.map(user => user.id === selectedUser.id ? selectedUser : user)
      );
      toast.success('User updated successfully');
      setIsUserDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSaveShop = () => {
    if (selectedShop) {
      setShops(prev => 
        prev.map(shop => shop.id === selectedShop.id ? selectedShop : shop)
      );
      toast.success('Shop updated successfully');
      setIsShopDialogOpen(false);
      setSelectedShop(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleDeleteShop = (shopId: string) => {
    setShops(prev => prev.filter(shop => shop.id !== shopId));
    toast.success('Shop deleted successfully');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalShops: shops.length,
    activeShops: shops.filter(s => s.isActive).length,
    totalOrders: shops.reduce((sum, shop) => sum + shop.totalOrders, 0)
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="text-neutral-600">Manage users, shops and system settings</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/notifications')}
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Shops</p>
                  <p className="text-2xl font-bold">{stats.totalShops}</p>
                </div>
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Shops</p>
                  <p className="text-2xl font-bold">{stats.activeShops}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users or shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="shops">Shop Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Users ({filteredUsers.length})</h2>
              <Button className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <p className="text-gray-600">
                              {user.phone && `${user.phone}`} 
                              {user.email && `${user.phone ? ' • ' : ''}${user.email}`}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'shop_owner' ? 'secondary' : 'outline'}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shops" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Shops ({filteredShops.length})</h2>
              <Button 
                className="flex items-center space-x-2"
                onClick={() => navigate('/admin/add-shop')}
              >
                <Plus className="w-4 h-4" />
                <span>Add Shop</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredShops.map((shop) => (
                <Card key={shop.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-semibold text-lg">{shop.name}</h3>
                            <p className="text-gray-600">{shop.address}</p>
                            <p className="text-sm text-gray-500">Owner: {shop.ownerName} • {shop.phone}</p>
                            <p className="text-sm text-gray-500">Orders: {shop.totalOrders} • Rating: {shop.rating}/5</p>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Badge variant={shop.isActive ? 'default' : 'destructive'}>
                              {shop.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant={shop.allowsOfflineOrders ? 'secondary' : 'outline'}>
                              {shop.allowsOfflineOrders ? 'Offline Module' : 'Upload Only'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditShop(shop)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteShop(shop.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* User Edit Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userName">Name</Label>
                  <Input
                    id="userName"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="userPhone">Phone</Label>
                  <Input
                    id="userPhone"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedUser.isActive}
                    onCheckedChange={(checked) => setSelectedUser({...selectedUser, isActive: checked})}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveUser} className="flex-1">Save</Button>
                  <Button variant="outline" onClick={() => setIsUserDialogOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Shop Edit Dialog */}
        <Dialog open={isShopDialogOpen} onOpenChange={setIsShopDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Shop</DialogTitle>
            </DialogHeader>
            {selectedShop && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={selectedShop.name}
                    onChange={(e) => setSelectedShop({...selectedShop, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="shopAddress">Address</Label>
                  <Input
                    id="shopAddress"
                    value={selectedShop.address}
                    onChange={(e) => setSelectedShop({...selectedShop, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="shopPhone">Phone</Label>
                  <Input
                    id="shopPhone"
                    value={selectedShop.phone}
                    onChange={(e) => setSelectedShop({...selectedShop, phone: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedShop.isActive}
                    onCheckedChange={(checked) => setSelectedShop({...selectedShop, isActive: checked})}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedShop.allowsOfflineOrders}
                    onCheckedChange={(checked) => setSelectedShop({...selectedShop, allowsOfflineOrders: checked})}
                  />
                  <Label>Allow Offline Orders</Label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveShop} className="flex-1">Save</Button>
                  <Button variant="outline" onClick={() => setIsShopDialogOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductionAdminDashboard;
