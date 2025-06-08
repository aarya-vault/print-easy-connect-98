
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
  Sparkles,
  Star,
  ChevronDown,
  Search,
  Camera,
  Smartphone,
  Menu,
  X
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      {/* Enhanced Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-golden-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-golden-500 via-golden-600 to-golden-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Printer className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-golden-400 to-golden-500 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-golden-800 via-golden-600 to-golden-800 bg-clip-text text-transparent">
                  Print<span className="text-golden-700">Easy</span>
                </h1>
                <p className="text-sm text-golden-700 font-medium">Professional Printing Network</p>
              </div>
              <Badge className="bg-gradient-to-r from-golden-500 to-golden-600 text-white border-0 text-xs shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                Live 24/7
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-golden-800 hover:text-golden-600 transition-colors duration-300"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-golden-800 hover:text-golden-600 transition-colors duration-300"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-golden-800 hover:text-golden-600 transition-colors duration-300"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-golden-800 hover:text-golden-600 transition-colors duration-300"
              >
                Reviews
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-golden-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={getStarted}
                  className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')} 
                    className="hover:bg-golden-50 hover:text-golden-600 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-golden-200">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-left text-golden-800 hover:text-golden-600 transition-colors duration-300 py-2"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="text-left text-golden-800 hover:text-golden-600 transition-colors duration-300 py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-left text-golden-800 hover:text-golden-600 transition-colors duration-300 py-2"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-left text-golden-800 hover:text-golden-600 transition-colors duration-300 py-2"
                >
                  Reviews
                </button>
                <div className="pt-4 border-t border-golden-200">
                  {user ? (
                    <Button 
                      onClick={getStarted}
                      className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/login')} 
                        className="w-full hover:bg-golden-50 hover:text-golden-600"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => navigate('/login')}
                        className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-golden-100 to-golden-200 rounded-full px-6 py-3 border border-golden-300">
                  <Sparkles className="w-5 h-5 text-golden-600" />
                  <span className="text-golden-800 font-semibold text-sm">India's Most Trusted Print Network</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  <span className="block bg-gradient-to-r from-slate-900 via-golden-800 to-slate-900 bg-clip-text text-transparent">
                    Print
                  </span>
                  <span className="block bg-gradient-to-r from-golden-600 via-golden-500 to-golden-700 bg-clip-text text-transparent">
                    Anything,
                  </span>
                  <span className="block bg-gradient-to-r from-golden-700 via-golden-600 to-golden-800 bg-clip-text text-transparent">
                    Instantly
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
                  Connect with <span className="font-bold text-golden-600">500+ verified print shops</span> across India. 
                  Upload documents, track orders in real-time, and get professional printing done in minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Button 
                  size="lg" 
                  onClick={getStarted}
                  className="h-16 px-10 text-lg bg-gradient-to-r from-golden-500 via-golden-600 to-golden-700 hover:from-golden-600 hover:via-golden-700 hover:to-golden-800 text-white font-bold shadow-2xl hover:shadow-golden/25 transition-all duration-300 rounded-2xl"
                >
                  <Zap className="w-6 h-6 mr-3" />
                  Start Printing Now
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-16 px-10 text-lg border-2 border-golden-300 hover:border-golden-500 hover:bg-golden-50 transition-all duration-300 rounded-2xl"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-12 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900">500+</div>
                  <div className="text-sm text-slate-600 font-medium">Print Shops</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600 font-medium">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900">4.9⭐</div>
                  <div className="text-sm text-slate-600 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:scale-110">
              <div className="relative">
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-golden-200/50">
                  <div className="space-y-6">
                    {/* Live Order Simulation */}
                    <div className="bg-gradient-to-r from-golden-50 via-golden-100 to-golden-50 rounded-2xl p-6 border border-golden-200/50 relative overflow-hidden">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-golden-500 to-golden-600 rounded-xl flex items-center justify-center shadow-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">Business Presentation</div>
                              <div className="text-sm text-slate-600">50 pages • Color Print • Binding</div>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready for Pickup
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Quick Print Shop, Connaught Place
                        </div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>

                    {/* Real-time Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-golden-50 to-golden-100 rounded-xl p-4 text-center border border-golden-200/50">
                        <div className="text-2xl font-black text-golden-700">12min</div>
                        <div className="text-sm text-golden-600 font-medium">Avg Processing</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200/50">
                        <div className="text-2xl font-black text-green-700">₹2/page</div>
                        <div className="text-sm text-green-600 font-medium">Starting Price</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-golden-500 to-golden-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Printer className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-golden-600 to-golden-700 rounded-xl flex items-center justify-center shadow-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 -left-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => scrollToSection('services')}
            className="flex flex-col items-center gap-2 text-golden-600 hover:text-golden-700 transition-colors duration-300"
          >
            <div className="w-8 h-12 border-2 border-golden-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-golden-400 rounded-full mt-2"></div>
            </div>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-white to-golden-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-golden-100 to-golden-200 text-golden-800 border-golden-300 mb-6 px-6 py-2 text-sm font-semibold">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Two Ways to
              <span className="block bg-gradient-to-r from-golden-600 via-golden-500 to-golden-700 bg-clip-text text-transparent">
                Print Smart
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Choose the printing method that works best for you - seamless digital upload or convenient walk-in service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Upload Service */}
            <Card className="border-0 shadow-2xl hover:shadow-golden/25 transition-all duration-500 bg-gradient-to-br from-golden-50 via-white to-golden-100 relative overflow-hidden">
              <CardContent className="p-10 relative z-10">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-golden-500 via-golden-600 to-golden-700 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                      <Upload className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-slate-900">Upload & Print</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Upload your documents online and get them printed at your nearest shop with custom options and real-time tracking.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: FileText, text: 'All file formats supported (PDF, DOC, Images)' },
                      { icon: Palette, text: 'Custom print settings & premium paper types' },
                      { icon: Clock, text: 'Real-time order tracking with notifications' },
                      { icon: Shield, text: 'Secure file handling with auto-deletion' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 text-slate-700">
                        <div className="w-8 h-8 bg-gradient-to-r from-golden-100 to-golden-200 rounded-full flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-golden-600" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={getStarted}
                    className="w-full h-14 text-lg bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Files Now
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Walk-in Service */}
            <Card className="border-0 shadow-2xl hover:shadow-golden/25 transition-all duration-500 bg-gradient-to-br from-golden-100 via-white to-golden-50 relative overflow-hidden">
              <CardContent className="p-10 relative z-10">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-golden-600 via-golden-700 to-golden-800 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                      <UserCheck className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-golden-400 to-golden-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-slate-900">Walk-in Service</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Pre-book your walk-in appointment and get priority service with expert consultation at your chosen print shop.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Clock, text: 'Priority queue booking & fast-track service' },
                      { icon: Users, text: 'Expert in-person consultation & guidance' },
                      { icon: Zap, text: 'Immediate assistance & quality check' },
                      { icon: BookOpen, text: 'Premium paper & advanced binding options' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 text-slate-700">
                        <div className="w-8 h-8 bg-gradient-to-r from-golden-200 to-golden-300 rounded-full flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-golden-700" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={getStarted}
                    className="w-full h-14 text-lg bg-gradient-to-r from-golden-600 to-golden-700 hover:from-golden-700 hover:to-golden-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                  >
                    <UserCheck className="w-5 h-5 mr-3" />
                    Book Appointment
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-golden-500/20 to-golden-600/20 text-golden-300 border-golden-500/30 mb-6 px-6 py-2 text-sm font-semibold">
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Why Choose
              <span className="block bg-gradient-to-r from-golden-400 via-golden-300 to-golden-500 bg-clip-text text-transparent">
                PrintEasy?
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Advanced features designed to make your printing experience seamless, secure, and lightning-fast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: '24/7 Availability',
                description: 'Place orders anytime, anywhere. Our partner shops are ready to serve you round the clock with instant notifications.',
                color: 'from-golden-500 to-golden-600',
                bgColor: 'bg-golden-500/10',
                borderColor: 'border-golden-500/30'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Average 12-minute processing with real-time tracking, instant notifications, and express delivery options.',
                color: 'from-golden-600 to-golden-700',
                bgColor: 'bg-golden-600/10',
                borderColor: 'border-golden-600/30'
              },
              {
                icon: MapPin,
                title: 'Nearby Network',
                description: 'Find and connect with 500+ trusted, verified print shops in your area with authentic customer reviews.',
                color: 'from-green-500 to-emerald-600',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Military-grade encryption for your documents with automatic secure deletion after printing completion.',
                color: 'from-golden-700 to-golden-800',
                bgColor: 'bg-golden-700/10',
                borderColor: 'border-golden-700/30'
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'All partner shops are verified professionals maintaining the highest printing standards and quality control.',
                color: 'from-golden-500 to-golden-600',
                bgColor: 'bg-golden-500/10',
                borderColor: 'border-golden-500/30'
              },
              {
                icon: Globe,
                title: 'Pan India Coverage',
                description: 'Access our premium services across 50+ major cities in India with rapidly expanding coverage nationwide.',
                color: 'from-golden-600 to-golden-700',
                bgColor: 'bg-golden-600/10',
                borderColor: 'border-golden-600/30'
              }
            ].map((feature, index) => (
              <Card key={index} className={`border ${feature.borderColor} ${feature.bgColor} hover:shadow-2xl transition-all duration-500 bg-slate-800/50 backdrop-blur-lg`}>
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto flex items-center justify-center shadow-2xl`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-white to-golden-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 mb-6 px-6 py-2 text-sm font-semibold">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Simple as
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent">
                1-2-3
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Get your documents printed professionally in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: Search,
                title: 'Find & Choose',
                description: 'Browse nearby verified print shops, compare ratings, services, and pricing. Select your perfect match.',
                color: 'from-golden-500 to-golden-600'
              },
              {
                step: '02', 
                icon: Upload,
                title: 'Upload & Customize',
                description: 'Upload your files or book walk-in service. Specify your requirements - paper type, binding, copies, and more.',
                color: 'from-golden-600 to-golden-700'
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Track & Collect',
                description: 'Get real-time updates on your order progress. Receive notification when ready for pickup or delivery.',
                color: 'from-green-500 to-emerald-600'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl mx-auto flex items-center justify-center shadow-2xl`}>
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-golden-50 to-golden-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-golden-200 to-golden-300 text-golden-800 border-golden-400 mb-6 px-6 py-2 text-sm font-semibold">
              Customer Reviews
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              What Our
              <span className="block bg-gradient-to-r from-golden-600 via-golden-500 to-golden-700 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden">
            <div className="overflow-x-auto snap-x snap-mandatory">
              <div className="flex gap-6 pb-4">
                {[
                  {
                    name: 'Rajesh Kumar',
                    role: 'Business Owner',
                    review: 'PrintEasy has revolutionized how I handle my business printing needs. The quality is exceptional and delivery is always on time.',
                    rating: 5,
                    avatar: '👨‍💼'
                  },
                  {
                    name: 'Priya Sharma', 
                    role: 'Student',
                    review: 'As a student, I love how easy it is to print my assignments. The prices are reasonable and the service is super fast.',
                    rating: 5,
                    avatar: '👩‍🎓'
                  },
                  {
                    name: 'Amit Patel',
                    role: 'Freelancer',
                    review: 'The real-time tracking and chat feature make it so convenient. I can monitor my print jobs while focusing on my work.',
                    rating: 5,
                    avatar: '👨‍💻'
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="min-w-[280px] snap-start border-0 shadow-xl bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-golden-500 text-golden-500" />
                        ))}
                      </div>
                      <p className="text-slate-600 italic leading-relaxed text-sm">"{testimonial.review}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{testimonial.name}</div>
                          <div className="text-xs text-slate-600">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Business Owner',
                review: 'PrintEasy has revolutionized how I handle my business printing needs. The quality is exceptional and delivery is always on time.',
                rating: 5,
                avatar: '👨‍💼'
              },
              {
                name: 'Priya Sharma', 
                role: 'Student',
                review: 'As a student, I love how easy it is to print my assignments. The prices are reasonable and the service is super fast.',
                rating: 5,
                avatar: '👩‍🎓'
              },
              {
                name: 'Amit Patel',
                role: 'Freelancer',
                review: 'The real-time tracking and chat feature make it so convenient. I can monitor my print jobs while focusing on my work.',
                rating: 5,
                avatar: '👨‍💻'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-golden-500 text-golden-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{testimonial.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-golden-900 to-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-7xl font-black leading-tight">
              Ready to Start
              <span className="block bg-gradient-to-r from-golden-400 via-golden-300 to-golden-500 bg-clip-text text-transparent">
                Printing?
              </span>
            </h2>
            <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Join 50,000+ satisfied customers who trust PrintEasy for all their professional printing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button 
                size="lg"
                onClick={getStarted}
                className="h-20 px-16 text-2xl bg-gradient-to-r from-golden-500 via-golden-600 to-golden-700 hover:from-golden-600 hover:via-golden-700 hover:to-golden-800 text-white font-black shadow-2xl hover:shadow-golden/25 transition-all duration-300 rounded-2xl"
              >
                <Printer className="w-8 h-8 mr-4" />
                Start Printing Now
                <ArrowRight className="w-8 h-8 ml-4" />
              </Button>
              <div className="flex items-center gap-6 text-slate-300">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gradient-to-br from-golden-500/30 to-golden-600/30 rounded-full border-2 border-white/20 backdrop-blur-sm"></div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-bold text-xl">50,000+ Users</div>
                  <div className="text-slate-400">Already printing with us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-golden-500 to-golden-600 rounded-2xl flex items-center justify-center">
                  <Printer className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold">
                  Print<span className="text-golden-500">Easy</span>
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                India's most trusted digital printing platform connecting customers with verified print shops nationwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Document Printing</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Business Cards</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Bulk Printing</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Binding Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Partner with Us</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-golden-400 transition-colors duration-300">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 PrintEasy. All rights reserved. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
