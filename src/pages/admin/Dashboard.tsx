
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Store, 
  FileText, 
  TrendingUp, 
  Search,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';

interface ShopApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
  documents: number;
  businessType: string;
}

interface PlatformStats {
  totalCustomers: number;
  totalShops: number;
  totalOrders: number;
  monthlyRevenue: number;
  avgOrderValue: number;
  customerSatisfaction: number;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<ShopApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sample data (in real app, this would come from API)
  const [stats] = useState<PlatformStats>({
    totalCustomers: 15420,
    totalShops: 342,
    totalOrders: 8750,
    monthlyRevenue: 125000,
    avgOrderValue: 85,
    customerSatisfaction: 4.7
  });

  const [applications, setApplications] = useState<ShopApplication[]>([
    {
      id: 'APP001',
      businessName: 'Digital Print Hub',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@digitalprintub.com',
      phone: '+91 98765 43210',
      address: 'Shop 15, MG Road Complex',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Modern printing facility with latest equipment offering high-quality prints, scanning, and binding services.',
      status: 'pending',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      documents: 4,
      businessType: 'Print Shop'
    },
    {
      id: 'APP002',
      businessName: 'Quick Copy Center',
      ownerName: 'Priya Sharma',
      email: 'priya@quickcopy.com',
      phone: '+91 87654 32109',
      address: 'Near Metro Station, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      description: 'Family-owned copy center serving the community for 10+ years with reliable service.',
      status: 'pending',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      documents: 3,
      businessType: 'Xerox Center'
    }
  ]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveApplication = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    setSelectedApplication(null);
  };

  const handleRejectApplication = (id: string) => {
    if (!rejectionReason.trim()) return;
    
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
    setRejectionReason('');
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-light text-neutral-900">
                <span className="text-neutral-900">Print</span>
                <span className="text-yellow-500 font-medium">Easy</span>
                <span className="text-neutral-600 font-light ml-2">Admin</span>
              </h1>
              <p className="text-neutral-600 mt-1">Platform Management</p>
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
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Customers</p>
                  <p className="text-2xl font-medium text-neutral-900">{stats.totalCustomers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Active Shops</p>
                  <p className="text-2xl font-medium text-neutral-900">{stats.totalShops}</p>
                </div>
                <Store className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Orders</p>
                  <p className="text-2xl font-medium text-neutral-900">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <FileText className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Monthly Revenue</p>
                  <p className="text-2xl font-medium text-neutral-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Avg Order Value</p>
                  <p className="text-2xl font-medium text-neutral-900">₹{stats.avgOrderValue}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Satisfaction</p>
                  <p className="text-2xl font-medium text-neutral-900">{stats.customerSatisfaction}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shop Applications Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-neutral-900">Shop Applications</h2>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {applications.filter(app => app.status === 'pending').length} Pending Review
            </Badge>
          </div>

          {/* Search and Filters */}
          <Card className="border border-neutral-200 shadow-soft bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Search by business name, owner, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-neutral-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:border-yellow-500 focus:ring-yellow-500"
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
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="border border-neutral-200 shadow-soft bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-medium text-neutral-900">{application.businessName}</h3>
                        <Badge className={`border ${getStatusColor(application.status)}`}>
                          <span className="capitalize">{application.status}</span>
                        </Badge>
                        <span className="text-sm text-neutral-500">{formatTimeAgo(application.appliedAt)}</span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Users className="w-4 h-4" />
                            <span>{application.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Mail className="w-4 h-4" />
                            <span>{application.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Phone className="w-4 h-4" />
                            <span>{application.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span>{application.city}, {application.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Store className="w-4 h-4" />
                            <span>{application.businessType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <FileText className="w-4 h-4" />
                            <span>{application.documents} documents uploaded</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-neutral-700 text-sm line-clamp-2">{application.description}</p>
                    </div>

                    {/* Actions */}
                    {application.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-neutral-300 hover:bg-neutral-50"
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveApplication(application.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border border-neutral-200 shadow-strong bg-white max-h-[80vh] overflow-y-auto">
              <CardHeader className="border-b border-neutral-200">
                <CardTitle className="text-xl font-medium text-neutral-900">
                  Review Application: {selectedApplication.businessName}
                </CardTitle>
                <CardDescription>
                  Submitted {formatTimeAgo(selectedApplication.appliedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">Business Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedApplication.businessName}</p>
                        <p><strong>Type:</strong> {selectedApplication.businessType}</p>
                        <p><strong>Owner:</strong> {selectedApplication.ownerName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">Contact Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Email:</strong> {selectedApplication.email}</p>
                        <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">Location</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Address:</strong> {selectedApplication.address}</p>
                        <p><strong>City:</strong> {selectedApplication.city}</p>
                        <p><strong>State:</strong> {selectedApplication.state}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">Documents</h4>
                      <p className="text-sm text-neutral-600">
                        {selectedApplication.documents} documents uploaded for verification
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                  <p className="text-sm text-neutral-700">{selectedApplication.description}</p>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Rejection Reason (if rejecting)
                      </label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide reason for rejection..."
                        className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedApplication(null)}
                        className="border-neutral-300 hover:bg-neutral-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRejectApplication(selectedApplication.id)}
                        disabled={!rejectionReason.trim()}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApproveApplication(selectedApplication.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
