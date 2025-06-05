
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Upload, Clock, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white opacity-60"></div>
        
        <div className="relative container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light mb-6 tracking-tight">
              <span className="text-neutral-900">Print</span>
              <span className="text-yellow-500 font-medium">Easy</span>
            </h1>
            <div className="w-16 h-0.5 bg-yellow-500 mx-auto mb-8"></div>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
              The most elegant printing platform. Upload files instantly or describe physical items - 
              we transform complexity into simplicity.
            </p>
          </div>

          {/* Main Login Section */}
          <div className="max-w-md mx-auto mb-20">
            {!showBusinessLogin ? (
              /* Customer Login */
              <Card className="border border-neutral-200 shadow-soft bg-white">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-light text-neutral-900 mb-2">
                    Get Started
                  </CardTitle>
                  <CardDescription className="text-neutral-600 font-light">
                    Enter your phone number to begin printing
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handlePhoneLogin} className="space-y-6">
                    <div className="relative">
                      <div className="flex border border-neutral-200 rounded-xl overflow-hidden focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 transition-all">
                        <div className="flex items-center px-4 bg-neutral-50 text-neutral-600 font-medium border-r border-neutral-200">
                          <Phone className="w-4 h-4 mr-2" />
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                          className="border-0 bg-white focus:ring-0 focus:outline-none text-lg font-light h-14"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium h-14 text-lg rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
                      disabled={isLoading || phone.length !== 10}
                    >
                      {isLoading ? 'Connecting...' : 'Start Printing'}
                    </Button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowBusinessLogin(true)}
                      className="text-neutral-500 hover:text-neutral-700 text-sm underline underline-offset-4 transition-colors font-light"
                    >
                      Business Portal Access
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Business Login */
              <Card className="border border-neutral-200 shadow-soft bg-white">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-light text-neutral-900 mb-2">
                    Business Portal
                  </CardTitle>
                  <CardDescription className="text-neutral-600 font-light">
                    Shop owners and administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handleBusinessLogin} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <Input
                        type="email"
                        placeholder="Business email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 border-neutral-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-xl text-lg font-light"
                        disabled={isLoading}
                      />
                    </div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 border-neutral-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-xl text-lg font-light"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium h-14 text-lg rounded-xl transition-all duration-200 shadow-soft hover:shadow-medium"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? 'Authenticating...' : 'Access Portal'}
                    </Button>
                  </form>
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowBusinessLogin(false)}
                      className="text-neutral-500 hover:text-neutral-700 text-sm underline underline-offset-4 transition-colors font-light"
                    >
                      ← Customer Login
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <Upload className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-3 text-lg">
                  Instant Upload
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  No complex registrations. Just your phone number and you're printing in seconds.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-3 text-lg">
                  Real-time Tracking
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  Track every step in real-time. Know exactly when your prints will be ready.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-neutral-200 shadow-soft bg-white hover:shadow-medium transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-yellow-50 rounded-2xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                  <MessageCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-3 text-lg">
                  Direct Communication
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-light">
                  Chat directly with your print shop for perfect results every time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="text-center mt-20">
            <div className="inline-flex items-center space-x-3 bg-neutral-50 px-6 py-3 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse-soft"></div>
              <span className="text-neutral-600 text-sm font-light">
                Trusted by thousands of customers across India
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
