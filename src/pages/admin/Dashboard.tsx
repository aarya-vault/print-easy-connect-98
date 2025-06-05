
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const mockShopApplications = [
    { id: 1, name: "Digital Print Hub", location: "Mumbai Central", status: "pending", submittedDate: "2024-01-15" },
    { id: 2, name: "Quick Copy Center", location: "Bangalore Tech Park", status: "reviewing", submittedDate: "2024-01-14" },
    { id: 3, name: "Express Printing", location: "Delhi Connaught Place", status: "pending", submittedDate: "2024-01-13" }
  ];

  const mockStats = {
    totalShops: 156,
    activeOrders: 89,
    monthlyRevenue: "₹4,85,000",
    customerSatisfaction: 94
  };

  return (
    <div className="min-h-screen bg-gradient-white-gray">
      {/* Enhanced Admin Header */}
      <div className="bg-white shadow-xl border-b-4 border-gradient-black-gray">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
                <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
                <span className="text-printeasy-gray-dark ml-2">Admin</span>
              </h1>
              <div className="w-20 h-1 bg-gradient-black-gray rounded-full mt-1"></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-printeasy-gray-medium">Administrator</div>
                <div className="font-semibold text-printeasy-black">{user?.name || user?.email}</div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-2 border-printeasy-black hover:bg-gradient-black-gray hover:text-white rounded-printeasy transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-printeasy-gray-light">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'shops', label: 'Shop Management' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'settings', label: 'Platform Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-printeasy-yellow text-printeasy-black'
                    : 'border-transparent text-printeasy-gray-medium hover:text-printeasy-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 bg-gradient-yellow-white rounded-printeasy shadow-xl overflow-hidden">
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-printeasy-gray-medium">Active Shops</p>
                        <p className="text-3xl font-bold text-printeasy-black">{mockStats.totalShops}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-radial-yellow rounded-printeasy flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-sm shadow-inner"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-white-black rounded-printeasy shadow-xl overflow-hidden">
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-printeasy-gray-medium">Live Orders</p>
                        <p className="text-3xl font-bold text-printeasy-black">{mockStats.activeOrders}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-radial-white border-2 border-printeasy-black rounded-printeasy flex items-center justify-center">
                        <div className="w-3 h-3 bg-gradient-yellow-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-yellow-light rounded-printeasy shadow-xl overflow-hidden">
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-printeasy-gray-medium">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-printeasy-black">{mockStats.monthlyRevenue}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-yellow-white rounded-printeasy flex items-center justify-center">
                        <div className="text-printeasy-black font-bold">₹</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-gray-white rounded-printeasy shadow-xl overflow-hidden">
                  <CardContent className="p-6 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-printeasy-gray-medium">Satisfaction</p>
                        <p className="text-3xl font-bold text-printeasy-black">{mockStats.customerSatisfaction}%</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-radial-yellow rounded-printeasy flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gradient-yellow-light rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-yellow-white"></div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-printeasy-black text-xl">Platform Activity</CardTitle>
                  <CardDescription>Real-time overview of platform operations</CardDescription>
                </CardHeader>
                <CardContent className="bg-white space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-printeasy-black">Order Volume</h4>
                      <Progress value={75} className="h-2" />
                      <p className="text-sm text-printeasy-gray-medium">75% of daily target achieved</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-printeasy-black">Shop Performance</h4>
                      <Progress value={88} className="h-2" />
                      <p className="text-sm text-printeasy-gray-medium">88% average completion rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shops' && (
            <div className="space-y-8">
              {/* Shop Applications */}
              <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-yellow-white"></div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-printeasy-black text-xl">Shop Applications</CardTitle>
                  <CardDescription>Review and approve new shop registrations</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    {mockShopApplications.map((shop) => (
                      <div key={shop.id} className="border border-printeasy-gray-light rounded-printeasy p-4 hover:bg-gradient-white-gray transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-printeasy-black">{shop.name}</h4>
                            <p className="text-sm text-printeasy-gray-medium">{shop.location}</p>
                            <p className="text-xs text-printeasy-gray-medium mt-1">Applied: {shop.submittedDate}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              shop.status === 'pending' ? 'bg-gradient-yellow-subtle text-printeasy-black' :
                              shop.status === 'reviewing' ? 'bg-gradient-gray-white text-printeasy-gray-dark' :
                              'bg-gradient-white-gray text-printeasy-black'
                            }`}>
                              {shop.status}
                            </span>
                            <Button size="sm" className="bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black">
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-black-gray"></div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-printeasy-black text-xl">Platform Analytics</CardTitle>
                  <CardDescription>Comprehensive platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-radial-yellow rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="text-2xl font-bold text-printeasy-black">📊</div>
                    </div>
                    <h3 className="text-xl font-bold text-printeasy-black mb-4">Advanced Analytics Coming Soon</h3>
                    <p className="text-printeasy-gray-medium">
                      Comprehensive charts and insights will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-black-gray"></div>
                <CardHeader className="bg-white">
                  <CardTitle className="text-printeasy-black text-xl">Platform Configuration</CardTitle>
                  <CardDescription>Manage global platform settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-radial-white border-2 border-printeasy-black rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="text-2xl font-bold text-printeasy-black">⚙️</div>
                    </div>
                    <h3 className="text-xl font-bold text-printeasy-black mb-4">Configuration Panel</h3>
                    <p className="text-printeasy-gray-medium">
                      Platform settings and configuration options will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
