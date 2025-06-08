
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
  Smartphone
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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-golden-500/10 to-orange-600/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-500/10 to-teal-600/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Enhanced Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <Printer className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-golden-500 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Print<span className="text-golden-600">Easy</span>
                </h1>
                <p className="text-sm text-slate-600 font-medium">Professional Printing Network</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-xs animate-pulse shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                Live 24/7
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-slate-700 hover:text-blue-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-slate-700 hover:text-blue-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-slate-700 hover:text-blue-600 transition-colors duration-300 hover:scale-105 transform"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-slate-700 hover:text-blue-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Reviews
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={getStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')} 
                    className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 border border-blue-200 animate-bounce">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-semibold text-sm">India's Most Trusted Print Network</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black leading-tight">
                  <span className="block bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent animate-scale-in">
                    Print
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-scale-in">
                    Anything,
                  </span>
                  <span className="block bg-gradient-to-r from-golden-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-scale-in">
                    Instantly
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
                  Connect with <span className="font-bold text-blue-600">500+ verified print shops</span> across India. 
                  Upload documents, track orders in real-time, and get professional printing done in minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Button 
                  size="lg" 
                  onClick={getStarted}
                  className="group h-16 px-10 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-110 hover:-translate-y-2 rounded-2xl"
                >
                  <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Start Printing Now
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group h-16 px-10 text-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 rounded-2xl"
                >
                  <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </Button>
              </div>

              {/* Animated Stats */}
              <div className="flex items-center gap-12 pt-8">
                <div className="text-center group">
                  <div className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm text-slate-600 font-medium">Print Shops</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform duration-300">50K+</div>
                  <div className="text-sm text-slate-600 font-medium">Happy Customers</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-slate-900 group-hover:scale-110 transition-transform duration-300">4.9⭐</div>
                  <div className="text-sm text-slate-600 font-medium">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Revolutionary 3D Hero Visual */}
            <div className="relative lg:scale-110 animate-scale-in">
              <div className="relative">
                {/* Main Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50 hover:shadow-purple-500/20 transition-all duration-700 hover:scale-105 hover:-translate-y-4">
                  <div className="space-y-6">
                    {/* Live Order Simulation */}
                    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">Business Presentation</div>
                              <div className="text-sm text-slate-600">50 pages • Color Print • Binding</div>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse shadow-lg">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready for Pickup
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 mb-4 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Quick Print Shop, Connaught Place
                        </div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>

                    {/* Real-time Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-golden-50 to-orange-50 rounded-xl p-4 text-center border border-golden-200/50 hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-black text-golden-700">12min</div>
                        <div className="text-sm text-golden-600 font-medium">Avg Processing</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200/50 hover:scale-105 transition-transform duration-300">
                        <div className="text-2xl font-black text-green-700">₹2/page</div>
                        <div className="text-sm text-green-600 font-medium">Starting Price</div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce hover:rotate-12 transition-transform duration-500">
                    <Printer className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-golden-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl animate-pulse hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 -left-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-ping">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => scrollToSection('services')}
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
          >
            <div className="w-8 h-12 border-2 border-slate-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce"></div>
            </div>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-white to-slate-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300 mb-6 px-6 py-2 text-sm font-semibold animate-pulse">
              Our Services
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Two Ways to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Print Smart
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Choose the printing method that works best for you - seamless digital upload or convenient walk-in service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Upload Service - Enhanced */}
            <Card className="group border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 hover:-translate-y-6 hover:scale-105 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-10 relative z-10">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <Upload className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-golden-500 to-orange-600 rounded-full flex items-center justify-center animate-bounce">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300">Upload & Print</h3>
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
                      <div key={index} className="flex items-center gap-4 text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={getStarted}
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-2xl"
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Files Now
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Walk-in Service - Enhanced */}
            <Card className="group border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 hover:-translate-y-6 hover:scale-105 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-10 relative z-10">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 rounded-3xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <UserCheck className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-golden-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-bounce">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-purple-600 transition-colors duration-300">Walk-in Service</h3>
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
                      <div key={index} className="flex items-center gap-4 text-slate-700 group-hover:text-purple-600 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={getStarted}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-2xl"
                  >
                    <UserCheck className="w-5 h-5 mr-3" />
                    Book Appointment
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-golden-500/20 to-orange-500/20 text-golden-300 border-golden-500/30 mb-6 px-6 py-2 text-sm font-semibold">
              Platform Features
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Why Choose
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
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
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Average 12-minute processing with real-time tracking, instant notifications, and express delivery options.',
                color: 'from-golden-500 to-orange-600',
                bgColor: 'bg-golden-500/10',
                borderColor: 'border-golden-500/30'
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
                color: 'from-purple-500 to-violet-600',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/30'
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'All partner shops are verified professionals maintaining the highest printing standards and quality control.',
                color: 'from-red-500 to-rose-600',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/30'
              },
              {
                icon: Globe,
                title: 'Pan India Coverage',
                description: 'Access our premium services across 50+ major cities in India with rapidly expanding coverage nationwide.',
                color: 'from-indigo-500 to-blue-600',
                bgColor: 'bg-indigo-500/10',
                borderColor: 'border-indigo-500/30'
              }
            ].map((feature, index) => (
              <Card key={index} className={`group border ${feature.borderColor} ${feature.bgColor} hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:scale-105 bg-slate-800/50 backdrop-blur-lg`}>
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`}>
                    <feature.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 mb-6 px-6 py-2 text-sm font-semibold">
              How It Works
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
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
                color: 'from-blue-500 to-cyan-600'
              },
              {
                step: '02', 
                icon: Upload,
                title: 'Upload & Customize',
                description: 'Upload your files or book walk-in service. Specify your requirements - paper type, binding, copies, and more.',
                color: 'from-purple-500 to-violet-600'
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Track & Collect',
                description: 'Get real-time updates on your order progress. Receive notification when ready for pickup or delivery.',
                color: 'from-green-500 to-emerald-600'
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl mx-auto flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700`}>
                      <step.icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
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
      <section id="testimonials" className="py-24 bg-gradient-to-br from-golden-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-golden-100 to-orange-100 text-golden-800 border-golden-300 mb-6 px-6 py-2 text-sm font-semibold">
              Customer Reviews
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              What Our
              <span className="block bg-gradient-to-r from-golden-600 via-orange-600 to-golden-800 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 bg-white">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-golden-500 text-golden-500" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic leading-relaxed">"{testimonial.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
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
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-slate-900/20"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-8xl font-black leading-tight">
              Ready to Start
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
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
                className="group h-20 px-16 text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-black shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-110 hover:-translate-y-2 rounded-2xl"
              >
                <Printer className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-300" />
                Start Printing Now
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <div className="flex items-center gap-6 text-slate-300">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full border-2 border-white/20 backdrop-blur-sm"></div>
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
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
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Document Printing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Business Cards</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Bulk Printing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Binding Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Partner with Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Refund Policy</a></li>
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
