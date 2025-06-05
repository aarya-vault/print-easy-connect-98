
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Upload, Clock, MessageCircle, Star, Users, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBusinessLogin, setShowBusinessLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loginWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
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
      }
    }
  }, [user, navigate]);

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(phone);
      toast({
        title: "Welcome to PrintEasy!",
        description: "You're now logged in.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast({
        title: "Welcome back!",
        description: "You're now logged in.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneInput = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    return numeric.slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 font-poppins">
      {/* Hero Section with Advanced Design */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-golden-50/30 via-transparent to-golden-100/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-golden-soft opacity-20 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-golden-soft opacity-15 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-7xl font-bold mb-8 tracking-tight">
              <span className="text-neutral-900">Print</span>
              <span className="bg-gradient-golden bg-clip-text text-transparent font-extrabold">Easy</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-golden mx-auto mb-10 rounded-full"></div>
            <p className="text-2xl text-neutral-700 max-w-3xl mx-auto leading-relaxed font-light">
              Transform your printing experience with our premium platform. 
              <span className="font-medium text-neutral-900"> Elegant, Fast, Professional.</span>
            </p>
          </div>

          {/* Main Login Section */}
          <div className="max-w-md mx-auto mb-24">
            {!showBusinessLogin ? (
              /* Customer Login */
              <Card className="border-0 shadow-premium bg-white/80 backdrop-blur-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-semibold text-neutral-900 mb-3">
                    Get Started
                  </CardTitle>
                  <CardDescription className="text-neutral-600 font-medium text-lg">
                    Enter your phone number to begin printing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handlePhoneLogin} className="space-y-8">
                    <div className="relative">
                      <div className="flex border-2 border-neutral-200 rounded-2xl overflow-hidden focus-within:border-golden-500 focus-within:ring-4 focus-within:ring-golden-100 transition-all duration-300">
                        <div className="flex items-center px-6 bg-gradient-golden-soft text-golden-800 font-semibold border-r-2 border-neutral-200">
                          <Phone className="w-5 h-5 mr-3" />
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                          className="border-0 bg-white/90 focus:ring-0 focus:outline-none text-xl font-medium h-16 rounded-none"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-golden hover:shadow-golden text-white font-semibold h-16 text-xl rounded-2xl transition-all duration-300 shadow-golden hover:scale-[1.02]"
                      disabled={isLoading || phone.length !== 10}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Connecting...</span>
                        </div>
                      ) : (
                        'Start Printing'
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setShowBusinessLogin(true)}
                      className="text-neutral-500 hover:text-golden-700 text-sm font-medium underline underline-offset-4 transition-colors"
                    >
                      Business Portal Access
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Business Login */
              <Card className="border-0 shadow-premium bg-white/80 backdrop-blur-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-semibold text-neutral-900 mb-3">
                    Business Portal
                  </CardTitle>
                  <CardDescription className="text-neutral-600 font-medium text-lg">
                    Shop owners and administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handleBusinessLogin} className="space-y-8">
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
                      <Input
                        type="email"
                        placeholder="Business email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-16 h-16 border-2 border-neutral-200 focus:border-golden-500 focus:ring-4 focus:ring-golden-100 rounded-2xl text-xl font-medium"
                        disabled={isLoading}
                      />
                    </div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-16 border-2 border-neutral-200 focus:border-golden-500 focus:ring-4 focus:ring-golden-100 rounded-2xl text-xl font-medium"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold h-16 text-xl rounded-2xl transition-all duration-300 shadow-strong hover:scale-[1.02]"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                        </div>
                      ) : (
                        'Access Portal'
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setShowBusinessLogin(false)}
                      className="text-neutral-500 hover:text-golden-700 text-sm font-medium underline underline-offset-4 transition-colors"
                    >
                      ← Customer Login
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-500 group hover:scale-[1.02]">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-8 bg-gradient-golden rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-4 text-xl">
                  Instant Upload
                </h3>
                <p className="text-neutral-600 leading-relaxed font-medium">
                  No complex registrations. Just your phone number and you're printing in seconds.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-500 group hover:scale-[1.02]">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-8 bg-gradient-golden rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-4 text-xl">
                  Real-time Tracking
                </h3>
                <p className="text-neutral-600 leading-relaxed font-medium">
                  Track every step in real-time. Know exactly when your prints will be ready.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-500 group hover:scale-[1.02]">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 mx-auto mb-8 bg-gradient-golden rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-4 text-xl">
                  Direct Communication
                </h3>
                <p className="text-neutral-600 leading-relaxed font-medium">
                  Chat directly with your print shop for perfect results every time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-6 bg-white/80 backdrop-blur-lg px-8 py-4 rounded-full shadow-glass">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-golden rounded-full animate-pulse-golden"></div>
                <span className="text-neutral-700 font-medium">
                  Trusted by thousands across India
                </span>
              </div>
              <div className="flex items-center space-x-2 text-golden-700">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-golden-600 mr-2" />
                <span className="text-4xl font-bold text-neutral-900">50K+</span>
              </div>
              <p className="text-neutral-600 font-medium">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-golden-600 mr-2" />
                <span className="text-4xl font-bold text-neutral-900">500+</span>
              </div>
              <p className="text-neutral-600 font-medium">Partner Shops</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-golden-600 mr-2" />
                <span className="text-4xl font-bold text-neutral-900">1M+</span>
              </div>
              <p className="text-neutral-600 font-medium">Orders Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
