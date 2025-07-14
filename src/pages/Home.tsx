
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Printer, 
  ArrowRight,
  Phone,
  Upload,
  UserCheck,
  Clock,
  Shield,
  Star,
  MapPin,
  CheckCircle,
  Sparkles,
  Building,
  Users,
  FileText,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast.error('Please enter exactly 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      await login(phoneNumber);
      toast.success('Welcome to PrintEasy!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const navigateToRole = (role: string) => {
    if (role === 'business') {
      navigate('/login?tab=business');
    } else if (role === 'admin') {
      navigate('/login?tab=admin');
    }
    setIsMobileMenuOpen(false);
  };

  const handleUserDashboard = () => {
    switch (user?.role) {
      case 'customer':
        navigate('/customer/dashboard');
        break;
      case 'shop_owner':
        navigate('/shop/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-golden-50/30 to-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-golden-600 rounded-lg flex items-center justify-center shadow-sm">
                <Printer className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  Print<span className="text-primary">Easy</span>
                </h1>
                <Badge variant="secondary" className="text-xs animate-pulse hidden sm:inline-flex">
                  Live 24/7
                </Badge>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={handleUserDashboard}
                  className="bg-gradient-to-r from-primary to-golden-600 hover:from-golden-600 hover:to-primary"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigateToRole('business')}
                    className="hover:bg-golden-50"
                  >
                    Shop Owner?
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigateToRole('admin')}
                    className="hover:bg-golden-50 text-xs"
                  >
                    Admin
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background border-l shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {user ? (
                <Button 
                  onClick={handleUserDashboard}
                  className="w-full bg-gradient-to-r from-primary to-golden-600"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigateToRole('business')}
                    className="w-full"
                  >
                    Shop Owner Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigateToRole('admin')}
                    className="w-full"
                  >
                    Admin Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-6 pb-12 md:pt-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGNUQ5MDUiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1.5 md:px-4 md:py-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                India's Fastest Growing Print Network
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Print Anything,
                <br />
                <span className="bg-gradient-to-r from-primary via-golden-600 to-golden-700 bg-clip-text text-transparent">
                  Anywhere
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Connect with 500+ verified print shops across India. Enter your mobile number to start printing instantly.
              </p>
            </div>

            {/* Customer Login Form - Mobile Optimized */}
            {!user && (
              <Card className="max-w-sm mx-auto shadow-xl border-2 border-primary/20">
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-4 md:space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Start Printing Now</h3>
                      <p className="text-sm text-muted-foreground">Enter your mobile number to get started</p>
                    </div>
                    
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="Enter 10 digit number"
                            className="pl-10 h-12 text-center text-base md:text-lg font-medium"
                            maxLength={10}
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          {phoneNumber.length}/10 digits
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isLoading || phoneNumber.length !== 10}
                        className="w-full h-12 bg-gradient-to-r from-primary to-golden-600 hover:from-golden-600 hover:to-primary text-base md:text-lg font-semibold"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Starting...
                          </div>
                        ) : (
                          <>
                            Start Printing
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats - Mobile Horizontal Scroll */}
            <div className="flex justify-center items-center gap-6 md:gap-8 pt-6 md:pt-8 overflow-x-auto">
              <div className="text-center flex-shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Print Shops</div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Orders Printed</div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-foreground">4.9⭐</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Stacked */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Two Ways to Print
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Choose the printing method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Upload Service */}
            <Card className="group border-2 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-4 md:space-y-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-golden-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">Upload & Print</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      Upload your documents online and get them printed with custom options.
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {[
                      'PDF, DOC, Images supported',
                      'Custom print settings',
                      'Real-time tracking',
                      'Secure file handling'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Walk-in Service */}
            <Card className="group border-2 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-4 md:space-y-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-golden-600 to-golden-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">Walk-in Service</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      Pre-book appointments and get priority service at print shops.
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    {[
                      'Priority queue booking',
                      'In-person consultation',
                      'Immediate assistance',
                      'Special binding options'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-golden-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-golden-600 hover:bg-golden-700 text-white"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Why Choose PrintEasy?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Clock,
                title: '24/7 Availability',
                description: 'Place orders anytime, anywhere with our partner network.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your documents are encrypted and safely handled.',
              },
              {
                icon: MapPin,
                title: 'Nearby Shops',
                description: 'Find trusted print shops in your area instantly.',
              },
              {
                icon: Star,
                title: 'Quality Assured',
                description: 'Professional printing with satisfaction guarantee.',
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl mx-auto flex items-center justify-center">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Mobile Stacked */}
      <footer className="border-t bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Printer className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <span className="font-bold text-foreground">PrintEasy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making printing accessible, fast, and reliable across India.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">For Customers</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>Upload & Print</li>
                <li>Walk-in Service</li>
                <li>Track Orders</li>
                <li>Find Shops</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">For Businesses</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>Join Network</li>
                <li>Shop Dashboard</li>
                <li>Manage Orders</li>
                <li>Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Support</h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms & Privacy</li>
                <li>About Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
            <p>&copy; 2024 PrintEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
