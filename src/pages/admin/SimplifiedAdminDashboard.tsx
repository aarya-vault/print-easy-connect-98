
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MobileHeader from '@/components/layout/MobileHeader';
import { 
  Users, 
  Store, 
  Package, 
  Search,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import AddShopForm from '@/components/admin/AddShopForm';
import EditUserModal from '@/components/admin/EditUserModal';
import EditShopModal from '@/components/admin/EditShopModal';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'shop_owner';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Shop {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const SimplifiedAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'shops' | 'add-shop'>('overview');
  const [showAddShopForm, setShowAddShopForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  // Simplified mock data without revenue
  const [stats] = useState({
    totalUsers: 245,
    totalShops: 18,
    totalOrders: 1024,
    pendingShops: 3
  });


  const [shops, setShops] = useState<Shop[]>([
    {
      id: 'shp1',
      name: 'Quick Print Solutions',
      ownerName: 'Mike Johnson',
      email: 'mike@quickprint.com',
      phone: '9876543210',
      address: 'MG Road, Bangalore',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'shp2',
      name: 'Campus Copy Center',
      ownerName: 'Sarah Wilson',
      email: 'sarah@campuscopy.com',
      phone: '8765432109',
      address: 'Whitefield, Bangalore',
      status: 'approved',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'usr1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      role: 'customer',
      status: 'active',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'usr2',
      name: 'Jane Smith',
      email: 'jane@printshop.com',
      phone: '8765432109',
      role: 'shop_owner',
      status: 'active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const handleApproveShop = (shopId: string) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopId ? { ...shop, status: 'approved' as const } : shop
    ));
    toast.success('Shop approved successfully!');
  };

  const handleRejectShop = (shopId: string) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopId ? { ...shop, status: 'rejected' as const } : shop
    ));
    toast.success('Shop rejected');
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User removed successfully');
  };

  const handleRemoveShop = (shopId: string) => {
    setShops(prev => prev.filter(shop => shop.id !== shopId));
    toast.success('Shop removed successfully');
  };

  const handleAddShop = (shopData: Omit<Shop, 'id' | 'createdAt'>) => {
    const newShop: Shop = {
      ...shopData,
      id: `shp_${Date.now()}`,
      createdAt: new Date(),
      status: 'approved'
    };
    setShops(prev => [...prev, newShop]);
    setShowAddShopForm(false);
    toast.success('Shop added successfully!');
  };

  const handleUpdateUser = (userData: User) => {
    setUsers(prev => prev.map(user => 
      user.id === userData.id ? userData : user
    ));
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleUpdateShop = (shopData: Shop) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopData.id ? shopData : shop
    ));
    setEditingShop(null);
    toast.success('Shop updated successfully');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Admin Dashboard" showMenu={true} />
      
      {/* Welcome Section */}
      <div className="bg-primary text-primary-foreground p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-1">System Overview</h2>
          <p className="text-primary-foreground/80 text-sm">Manage users, shops, and monitor platform activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.totalShops}</div>
              <div className="text-xs text-muted-foreground">Active Shops</div>
            </CardContent>
          </Card>
          
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.totalOrders}</div>
              <div className="text-xs text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          
          <Card className="card-yellow">
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.pendingShops}</div>
              <div className="text-xs text-muted-foreground">Pending Approvals</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'shops', label: 'Shops' },
            { key: 'add-shop', label: 'Add Shop' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {(activeTab === 'users' || activeTab === 'shops') && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card className="card-black">
              <CardHeader>
                <CardTitle className="text-lg">Recent Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {users.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs px-2 py-1 ${
                          user.role === 'shop_owner' ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending Shop Approvals */}
            <Card className="card-black">
              <CardHeader>
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {shops.filter(shop => shop.status === 'pending').map(shop => (
                  <div key={shop.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{shop.name}</h3>
                        <p className="text-sm text-muted-foreground">{shop.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{shop.address}</p>
                      </div>
                      <Badge className="bg-primary/20 text-foreground">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleApproveShop(shop.id)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectShop(shop.id)}
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {shops.filter(shop => shop.status === 'pending').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Store className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No pending approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <Card key={user.id} className="card-black">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {user.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>{user.email}</span>
                              </div>
                            )}
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs px-2 py-1 ${
                              user.role === 'shop_owner' ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                            <Badge className={`text-xs px-2 py-1 ${
                              user.status === 'active' ? 'bg-primary/20 text-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'shops' && (
          <div className="space-y-4">
            {filteredShops.map(shop => (
              <Card key={shop.id} className="card-black">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{shop.name}</h3>
                        <Badge className={`text-xs px-2 py-1 ${
                          shop.status === 'approved' ? 'bg-primary/20 text-foreground' :
                          shop.status === 'pending' ? 'bg-primary/10 text-foreground' :
                          'status-completed'
                        }`}>
                          {shop.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Owner: {shop.ownerName}</p>
                      <p className="text-sm text-muted-foreground mb-1">{shop.address}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{shop.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{shop.phone}</span>
                        </div>
                        <span>{formatTimeAgo(shop.createdAt)}</span>
                      </div>
                    </div>
                     <div className="flex gap-2">
                      {shop.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveShop(shop.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectShop(shop.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingShop(shop)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveShop(shop.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'add-shop' && (
          <AddShopForm
            onAddShop={handleAddShop}
            onCancel={() => setActiveTab('shops')}
          />
        )}
      </div>

      {/* Edit Modals */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}

      {editingShop && (
        <EditShopModal
          shop={editingShop}
          isOpen={!!editingShop}
          onClose={() => setEditingShop(null)}
          onSave={handleUpdateShop}
        />
      )}
    </div>
  );
};

export default SimplifiedAdminDashboard;
