
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Phone, Mail, Lock, User, Building, Shield, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithEmail } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');

  // Get redirect path from location state
  const from = location.state?.from?.pathname || null;

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast.error('Please enter exactly 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      await login(phoneNumber);
      toast.success('Login successful!');
      navigate(from || '/customer/dashboard', { replace: true });
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Login successful!');
      
      // Navigate based on user role or redirect path
      if (from) {
        navigate(from, { replace: true });
      } else if (email.includes('admin')) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/shop/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Email login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const fillDemoCredentials = (type: 'shop' | 'admin') => {
    if (type === 'shop') {
      setEmail('shop@printeasy.com');
      setPassword('password123');
    } else {
      setEmail('admin@printeasy.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Print<span className="text-golden-600">Easy</span>
          </h1>
          <p className="text-neutral-600">Welcome back! Please sign in to continue.</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-neutral-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Business
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter exactly 10 digits"
                        className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100"
                        maxLength={10}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {phoneNumber.length}/10 digits
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || phoneNumber.length !== 10}
                    className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Continue with Phone'
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Quick Test Login
                  </h4>
                  <div className="space-y-1 text-sm text-neutral-700">
                    <p><strong>Test Customer:</strong> 9876543210</p>
                    <p className="text-xs text-neutral-500">No password required - auto registration enabled</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="business">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-golden-50 rounded-lg border border-golden-200">
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Demo Credentials
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p><strong>Shop Owner:</strong> shop@printeasy.com</p>
                        <p className="text-neutral-600">password123</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fillDemoCredentials('shop')}
                        disabled={isLoading}
                      >
                        Fill
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p><strong>Admin:</strong> admin@printeasy.com</p>
                        <p className="text-neutral-600">admin123</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fillDemoCredentials('admin')}
                        disabled={isLoading}
                      >
                        Fill
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-neutral-600 hover:text-neutral-900"
            disabled={isLoading}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
