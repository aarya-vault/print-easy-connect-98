
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  UserCheck, 
  Building,
  Users,
  Star,
  Clock,
  CheckCircle,
  Zap,
  ArrowRight,
  Phone,
  MessageSquare,
  TrendingUp,
  FileText,
  MapPin
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock dashboard data for preview
  const mockStats = {
    todayOrders: 24,
    urgentOrders: 5,
    pendingOrders: 12,
    totalOrders: 156
  };

  const mockOrder = {
    id: 'UF001',
    customerName: 'Rajesh Kumar',
    customerPhone: '9876543210',
    orderType: 'uploaded-files',
    status: 'processing',
    isUrgent: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: 'Business presentation slides - 50 pages, color printing'
  };

  const getStarted = () => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'shop_owner':
          navigate('/shop/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-golden-200/50 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span>
              </h1>
              <Badge className="bg-golden-100 text-golden-800 border-golden-300 text-xs">
                24/7 Service
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={getStarted}
                  className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-md"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-md"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Your One-Stop
            <br />
            <span className="bg-gradient-to-r from-golden-500 to-golden-600 bg-clip-text text-transparent">
              Print Solution
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Connect with local print shops, upload files instantly, and get your documents printed with ease. 
            Available 24/7 for all your printing needs.
          </p>
          <Button 
            size="lg" 
            onClick={getStarted}
            className="h-14 px-8 text-lg bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-xl"
          >
            Start Printing Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Service Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-blue-200 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Upload & Print</h3>
                <p className="text-neutral-600 mb-6">
                  Upload your documents online and get them printed at your nearest shop with custom options.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>PDF, DOC, DOCX, Images</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom print settings</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time order tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <UserCheck className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Walk-in Service</h3>
                <p className="text-neutral-600 mb-6">
                  Pre-book your walk-in appointment and get priority service at your chosen print shop.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Priority queue booking</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>In-person consultation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Immediate assistance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Previews */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Powerful Dashboards for Everyone
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Dashboard Preview */}
            <Card className="border-2 border-blue-200 shadow-xl bg-white">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Customer Dashboard</h3>
                    <p className="text-sm text-neutral-600">Track your orders</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Mock order card */}
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">#{mockOrder.id}</h4>
                        <Badge className="text-xs bg-blue-100 text-blue-700">Files</Badge>
                        <Badge className="text-xs bg-orange-100 text-orange-700">Processing</Badge>
                      </div>
                      <span className="text-xs text-neutral-500">2h ago</span>
                    </div>
                    <p className="text-xs text-neutral-700 mb-2">{mockOrder.description}</p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                        <Phone className="w-3 h-3 mr-1" />Call
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                        <MessageSquare className="w-3 h-3 mr-1" />Chat
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-50 rounded text-center">
                      <p className="text-xs text-green-600 font-medium">Ready</p>
                      <p className="text-lg font-bold text-green-800">2</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-center">
                      <p className="text-xs text-orange-600 font-medium">Processing</p>
                      <p className="text-lg font-bold text-orange-800">1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Dashboard Preview */}
            <Card className="border-2 border-golden-200 shadow-xl bg-white">
              <div className="bg-gradient-to-r from-golden-50 to-golden-100/50 p-4 border-b border-golden-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-golden-500 rounded-xl flex items-center justify-center shadow-md">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Shop Dashboard</h3>
                    <p className="text-sm text-neutral-600">Manage all orders</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Mock stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Today</p>
                      <p className="text-lg font-bold text-blue-800">{mockStats.todayOrders}</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded text-center">
                      <p className="text-xs text-red-600 font-medium">Urgent</p>
                      <p className="text-lg font-bold text-red-800">{mockStats.urgentOrders}</p>
                    </div>
                  </div>
                  
                  {/* Mock order */}
                  <div className="p-3 bg-red-50/50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{mockOrder.customerName}</h4>
                      <Badge className="text-xs bg-red-100 text-red-700">
                        <Zap className="w-2 h-2 mr-1" />URGENT
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-700 mb-2">Business presentation - 50 pages</p>
                    <div className="flex gap-1">
                      <Button size="sm" className="text-xs h-6 px-2 bg-golden-500 hover:bg-golden-600 text-white">
                        Mark Ready
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Dashboard Preview */}
            <Card className="border-2 border-purple-200 shadow-xl bg-white">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 border-b border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Admin Dashboard</h3>
                    <p className="text-sm text-neutral-600">Platform overview</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-50 rounded text-center">
                      <p className="text-xs text-green-600 font-medium">Revenue</p>
                      <p className="text-sm font-bold text-green-800">₹5.2L</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Orders</p>
                      <p className="text-sm font-bold text-blue-800">1,234</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-golden-100 rounded flex items-center justify-center">
                          <Building className="w-3 h-3 text-golden-600" />
                        </div>
                        <span className="text-xs font-medium">Quick Print</span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">₹1.2L</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <Building className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium">Campus Copy</span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">₹89k</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Why Choose PrintEasy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">24/7 Availability</h3>
              <p className="text-neutral-600">Place orders anytime, anywhere. Our partner shops are ready to serve you round the clock.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Lightning Fast</h3>
              <p className="text-neutral-600">Quick turnaround times with real-time order tracking and instant notifications.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Nearby Shops</h3>
              <p className="text-neutral-600">Find and connect with trusted print shops in your area with verified reviews.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-neutral-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Print<span className="text-golden-500">Easy</span>
            </h2>
            <p className="text-neutral-400 mb-4">Your trusted printing partner, available 24/7</p>
            <p className="text-sm text-neutral-500">© 2024 PrintEasy. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
