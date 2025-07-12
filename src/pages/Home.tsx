
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
  MapPin,
  Play,
  Shield,
  Printer,
  FileImage,
  Palette,
  BookOpen,
  Award,
  Globe,
  Sparkles
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getStarted = () => {
    if (user) {
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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-golden-500 to-golden-600 rounded-xl flex items-center justify-center shadow-lg">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span>
              </h1>
              <Badge className="bg-golden-100 text-golden-800 border-golden-300 text-xs animate-pulse">
                Live 24/7
              </Badge>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-neutral-600 hover:text-golden-600 transition-colors">Features</a>
              <a href="#services" className="text-neutral-600 hover:text-golden-600 transition-colors">Services</a>
              <a href="#about" className="text-neutral-600 hover:text-golden-600 transition-colors">About</a>
              <a href="#contact" className="text-neutral-600 hover:text-golden-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={getStarted}
                  className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="hover:bg-golden-50">
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-golden-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGNUQ5MDUiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 text-sm animate-bounce">
                  <Sparkles className="w-4 h-4 mr-2" />
                  India's Fastest Growing Print Network
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 leading-tight">
                  Print Anything,
                  <br />
                  <span className="bg-gradient-to-r from-golden-500 via-golden-600 to-orange-500 bg-clip-text text-transparent">
                    Anywhere
                  </span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed max-w-lg">
                  Connect with 500+ verified print shops across India. Upload documents, track orders in real-time, and get professional printing done in minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={getStarted}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start Printing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-neutral-300 hover:border-golden-500 hover:bg-golden-50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900">500+</div>
                  <div className="text-sm text-neutral-600">Print Shops</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900">50K+</div>
                  <div className="text-sm text-neutral-600">Orders Printed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-neutral-900">4.9⭐</div>
                  <div className="text-sm text-neutral-600">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:scale-110 animate-scale-in">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-neutral-200/50">
                <div className="space-y-6">
                  {/* Mock Order Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">Business Presentation</div>
                          <div className="text-sm text-neutral-600">50 pages • Color Print</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 animate-pulse">Ready</Badge>
                    </div>
                    <div className="text-sm text-neutral-600 mb-4">Quick Print Shop, Connaught Place</div>
                    <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-golden-50 rounded-xl p-4 text-center border border-golden-200/50">
                      <div className="text-2xl font-bold text-golden-700">15min</div>
                      <div className="text-sm text-golden-600">Avg Processing</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200/50">
                      <div className="text-2xl font-bold text-green-700">₹3/page</div>
                      <div className="text-sm text-green-600">Starting Price</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <Printer className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-golden-400 to-golden-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 mb-4">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Two Ways to Print
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the printing method that works best for you - digital upload or walk-in service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Upload Service */}
            <Card className="group border-2 border-blue-200 hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-neutral-900">Upload & Print</h3>
                    <p className="text-neutral-600">
                      Upload your documents online and get them printed at your nearest shop with custom options.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'PDF, DOC, DOCX, Images supported',
                      'Custom print settings & paper types',
                      'Real-time order tracking',
                      'Secure file handling'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-neutral-700">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate('/customer/order/new')}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white group-hover:shadow-lg transition-all duration-300"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Walk-in Service */}
            <Card className="group border-2 border-purple-200 hover:border-purple-400 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <UserCheck className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-golden-500 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-neutral-900">Walk-in Service</h3>
                    <p className="text-neutral-600">
                      Pre-book your walk-in appointment and get priority service at your chosen print shop.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Priority queue booking',
                      'In-person consultation',
                      'Immediate assistance',
                      'Special paper & binding options'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-neutral-700">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-purple-600" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate('/customer/order/new')}
                    className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white group-hover:shadow-lg transition-all duration-300"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-neutral-50 to-golden-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-golden-100 text-golden-700 border-golden-300 mb-4">Platform Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose PrintEasy?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Advanced features designed to make your printing experience seamless and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: '24/7 Availability',
                description: 'Place orders anytime, anywhere. Our partner shops are ready to serve you round the clock.',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Average 15-minute processing with real-time tracking and instant notifications.',
                color: 'from-golden-500 to-golden-600',
                bgColor: 'bg-golden-50',
                borderColor: 'border-golden-200'
              },
              {
                icon: MapPin,
                title: 'Nearby Shops',
                description: 'Find and connect with 500+ trusted print shops in your area with verified reviews.',
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your documents are encrypted and securely handled with automatic deletion after printing.',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200'
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'All partner shops are verified and maintain high-quality printing standards.',
                color: 'from-red-500 to-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200'
              },
              {
                icon: Globe,
                title: 'Pan India Network',
                description: 'Access our services across major cities in India with expanding coverage.',
                color: 'from-indigo-500 to-indigo-600',
                bgColor: 'bg-indigo-50',
                borderColor: 'border-indigo-200'
              }
            ].map((feature, index) => (
              <Card key={index} className={`group border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-neutral-900">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section - Only Customer and Shop Dashboard */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-300 mb-4">Platform Overview</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Powerful Dashboards
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Tailored experiences for customers and shop owners
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Dashboard */}
            <Card className="border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Customer Dashboard</h3>
                    <p className="text-blue-100">Track orders & manage printing</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-700">3</div>
                    <div className="text-xs text-green-600">Ready</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                    <div className="text-2xl font-bold text-orange-700">2</div>
                    <div className="text-xs text-orange-600">Processing</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="text-xs bg-blue-100 text-blue-700">Files</Badge>
                      <span className="text-xs text-neutral-500">2h ago</span>
                    </div>
                    <div className="text-sm font-medium">Resume - 2 pages</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Dashboard */}
            <Card className="border-2 border-golden-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-golden-500 to-golden-600 p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Shop Dashboard</h3>
                    <p className="text-golden-100">Manage orders & customers</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">24</div>
                    <div className="text-xs text-blue-600">Today</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                    <div className="text-2xl font-bold text-red-700">5</div>
                    <div className="text-xs text-red-600">Urgent</div>
                  </div>
                </div>
                <div className="bg-red-50/50 rounded-lg p-3 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Rajesh Kumar</span>
                    <Badge className="text-xs bg-red-100 text-red-700">URGENT</Badge>
                  </div>
                  <div className="text-xs text-neutral-600">Business cards - 100 qty</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-golden-500 via-golden-600 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to Start Printing?
            </h2>
            <p className="text-xl md:text-2xl text-golden-100 leading-relaxed">
              Join 50,000+ satisfied customers who trust PrintEasy for all their printing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={getStarted}
                className="h-16 px-12 text-xl bg-white text-golden-600 hover:bg-neutral-100 font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <Printer className="w-6 h-6 mr-3" />
                Start Printing Now
              </Button>
              <div className="flex items-center gap-4 text-golden-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 bg-white/20 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold">50,000+ Users</div>
                  <div className="text-sm">Already printing with us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-golden-500 to-golden-600 rounded-xl flex items-center justify-center">
                  <Printer className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">
                  Print<span className="text-golden-500">Easy</span>
                </h3>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                India's fastest-growing digital printing platform connecting customers with verified print shops nationwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-golden-500 transition-colors">Document Printing</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Business Cards</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Bulk Printing</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Binding Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-golden-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Partner with Us</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-golden-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-golden-500 transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p className="text-neutral-400">
              © 2024 PrintEasy. All rights reserved. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
