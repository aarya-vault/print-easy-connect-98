
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Store,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  BarChart3,
  PieChart,
  Activity,
  MapPin
} from 'lucide-react';

interface ShopApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  documents: string[];
  services: string[];
  equipment: string[];
  appliedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'shops' | 'applications'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const [applications] = useState<ShopApplication[]>([
    {
      id: 'APP001',
      businessName: 'Digital Print Hub',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@digitalprintshub.com',
      phone: '+91 98765 43210',
      address: 'Shop 15, Commercial Complex, MG Road, Bangalore',
      gstNumber: '29ABCDE1234F1Z5',
      documents: ['gst_certificate.pdf', 'business_license.pdf', 'id_proof.pdf'],
      services: ['Color Printing', 'Black & White', 'Binding', 'Lamination'],
      equipment: ['HP LaserJet Pro', 'Canon Scanner', 'Binding Machine'],
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: 'APP002',
      businessName: 'Quick Copy Center',
      ownerName: 'Priya Sharma',
      email: 'priya@quickcopy.com',
      phone: '+91 87654 32109',
      address: 'Near Metro Station, Whitefield, Bangalore',
      gstNumber: '29FGHIJ5678K2L9',
      documents: ['gst_certificate.pdf', 'shop_license.pdf'],
      services: ['Photocopying', 'Scanning', 'Document Printing'],
      equipment: ['Xerox WorkCentre', 'High-speed Scanner'],
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]);

  const platformStats = {
    totalRevenue: 2450000,
    totalOrders: 15847,
    activeShops: 156,
    totalCustomers: 8920,
    monthlyGrowth: 23.5,
    orderGrowth: 18.2,
    shopGrowth: 12.8,
    customerGrowth: 28.4
  };

  const recentActivity = [
    { type: 'order', message: 'New order placed at Quick Print Solutions', time: '2 mins ago' },
    { type: 'shop', message: 'Digital Copy Center approved', time: '15 mins ago' },
    { type: 'customer', message: '12 new customer registrations', time: '1 hour ago' },
    { type: 'order', message: 'Order PE123456 completed', time: '2 hours ago' },
    { type: 'shop', message: 'Print Express application submitted', time: '3 hours ago' }
  ];

  const topShops = [
    { name: 'Quick Print Solutions', orders: 234, revenue: 156780, rating: 4.8 },
    { name: 'Digital Copy Center', orders: 189, revenue: 98450, rating: 4.6 },
    { name: 'Campus Print Hub', orders: 156, revenue: 87920, rating: 4.7 },
    { name: 'Express Printing', orders: 134, revenue: 76540, rating: 4.5 }
  ];

  const handleApproveShop = (id: string) => {
    console.log('Approving shop:', id);
  };

  const handleRejectShop = (id: string) => {
    console.log('Rejecting shop:', id);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-glass border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-neutral-900">Print</span>
                <span className="bg-gradient-golden bg-clip-text text-transparent">Easy</span>
                <span className="text-neutral-700 font-medium text-xl ml-3">Admin</span>
              </h1>
              <p className="text-neutral-600 font-medium">Platform Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/shop/apply')}
                variant="outline"
                className="border-golden-300 text-golden-700 hover:bg-golden-50 font-medium"
              >
                <Store className="w-4 h-4 mr-2" />
                Add Shop
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-neutral-300 hover:bg-neutral-50 font-medium"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <div className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'analytics', label: 'Analytics', icon: PieChart },
                { id: 'shops', label: 'Shops', icon: Store },
                { id: 'applications', label: 'Applications', icon: UserCheck, count: applications.filter(a => a.status === 'pending').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-golden-500 text-golden-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <Badge className="ml-2 bg-golden-100 text-golden-800 border-golden-200">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-neutral-900">₹{(platformStats.totalRevenue / 100000).toFixed(1)}L</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{platformStats.monthlyGrowth}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-golden rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-neutral-900">{platformStats.totalOrders.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{platformStats.orderGrowth}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Active Shops</p>
                      <p className="text-3xl font-bold text-neutral-900">{platformStats.activeShops}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{platformStats.shopGrowth}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 font-medium mb-1">Customers</p>
                      <p className="text-3xl font-bold text-neutral-900">{platformStats.totalCustomers.toLocaleString()}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{platformStats.customerGrowth}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Top Performing Shops */}
              <Card className="lg:col-span-2 border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Top Performing Shops</CardTitle>
                  <CardDescription>Based on orders and revenue this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topShops.map((shop, index) => (
                      <div key={shop.name} className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-neutral-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-golden rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-900">{shop.name}</h4>
                            <p className="text-sm text-neutral-600">{shop.orders} orders • ₹{shop.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-golden-500 rounded-full mr-1"></div>
                            <span className="text-sm font-medium">{shop.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Recent Activity</CardTitle>
                  <CardDescription>Real-time platform updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'order' ? 'bg-blue-500' :
                          activity.type === 'shop' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">{activity.message}</p>
                          <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Filter className="w-5 h-5 text-neutral-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2 border-neutral-200 rounded-xl px-4 py-3 font-medium focus:border-golden-500 focus:ring-golden-100"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.length === 0 ? (
                <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                  <CardContent className="p-12 text-center">
                    <Store className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No applications found</h3>
                    <p className="text-neutral-600">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'There are no shop applications at the moment'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((application) => (
                  <Card key={application.id} className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg font-semibold text-neutral-900">{application.businessName}</CardTitle>
                            <Badge className={
                              application.status === 'pending' ? 'bg-golden-100 text-golden-800 border-golden-200' :
                              application.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }>
                              {application.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {application.status === 'approved' && <UserCheck className="w-3 h-3 mr-1" />}
                              {application.status === 'rejected' && <UserX className="w-3 h-3 mr-1" />}
                              <span className="capitalize">{application.status}</span>
                            </Badge>
                          </div>
                          <CardDescription>
                            Applied on {application.appliedAt.toLocaleDateString()} • ID: {application.id}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-3">
                          {application.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-50 font-medium"
                                onClick={() => handleApproveShop(application.id)}
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-300 text-red-700 hover:bg-red-50 font-medium"
                                onClick={() => handleRejectShop(application.id)}
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-neutral-600 mb-2">Business Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Owner:</span>
                                <span className="font-medium text-neutral-900">{application.ownerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Email:</span>
                                <span className="font-medium text-neutral-900">{application.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Phone:</span>
                                <span className="font-medium text-neutral-900">{application.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Address:</span>
                                <span className="font-medium text-neutral-900 text-right">{application.address}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-600">GST Number:</span>
                                <span className="font-medium text-neutral-900">{application.gstNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-neutral-600 mb-2">Services & Equipment</h4>
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {application.services.map((service) => (
                                  <Badge key={service} variant="secondary" className="text-xs font-medium">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {application.equipment.map((equipment) => (
                                <Badge key={equipment} variant="outline" className="text-xs border-neutral-300 text-neutral-700 font-medium">
                                  {equipment}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-neutral-600 mb-2">Documents</h4>
                            <div className="flex flex-wrap gap-3">
                              {application.documents.map((document) => (
                                <div key={document} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg bg-white text-sm w-full">
                                  <span className="font-medium text-neutral-900">{document}</span>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-600">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-600">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes and Actions */}
                      {application.status === 'pending' && (
                        <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                          <h4 className="text-sm font-medium text-neutral-900 mb-2">Review Notes</h4>
                          <textarea
                            className="w-full border-2 border-neutral-200 rounded-lg p-3 focus:border-golden-500 focus:ring-golden-100 text-sm"
                            rows={3}
                            placeholder="Add notes about this application..."
                          ></textarea>
                          <div className="flex justify-end mt-4 space-x-3">
                            <Button
                              variant="outline" 
                              className="border-neutral-300 hover:bg-neutral-50 font-medium"
                            >
                              Request More Info
                            </Button>
                            <Button
                              className="bg-gradient-golden text-white font-semibold"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Review
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Revenue Analytics</CardTitle>
                  <CardDescription>Revenue trends for the last 12 months</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-gradient-to-b from-golden-100/40 to-white/10 rounded-xl border border-neutral-200 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-golden-400 mx-auto mb-4" />
                      <p className="text-neutral-600 font-medium">
                        Interactive revenue charts would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Distribution */}
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Order Distribution</CardTitle>
                  <CardDescription>Breakdown by type and status</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-gradient-to-b from-blue-100/30 to-white/10 rounded-xl border border-neutral-200 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-neutral-600 font-medium">
                        Interactive order distribution charts would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Regional Performance */}
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Regional Performance</CardTitle>
                  <CardDescription>Shop distribution and performance by region</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-gradient-to-b from-green-100/30 to-white/10 rounded-xl border border-neutral-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-neutral-600 font-medium">
                        Interactive regional maps would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Analytics */}
              <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-neutral-900">Customer Analytics</CardTitle>
                  <CardDescription>User growth and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 bg-gradient-to-b from-purple-100/30 to-white/10 rounded-xl border border-neutral-200 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-neutral-600 font-medium">
                        Interactive customer analytics would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
