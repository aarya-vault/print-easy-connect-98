
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Lock, User, Building, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Customer login (phone)
  const [phone, setPhone] = useState('');
  
  // Business login (email/password)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      await login(phone);
      toast.success('Welcome back!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      
      // Navigate based on role (will be determined in AuthContext)
      // Default to shop dashboard, will redirect if admin
      navigate('/shop/dashboard');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-golden rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">PE</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome to PrintEasy</h1>
          <p className="text-neutral-600">Sign in to access your dashboard</p>
        </div>

        <Card className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-neutral-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customer" className="w-full">
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

              {/* Customer Login */}
              <TabsContent value="customer" className="space-y-4">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    <Phone className="w-3 h-3 mr-1" />
                    Quick Phone Login
                  </Badge>
                </div>
                
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="pl-10 border-neutral-200 focus:border-golden-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-golden hover:shadow-golden text-white font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-neutral-600">
                  New customer? You'll be automatically registered!
                </div>
              </TabsContent>

              {/* Business Login */}
              <TabsContent value="business" className="space-y-4">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Shop Owner & Admin Access
                  </Badge>
                </div>

                <form onSubmit={handleBusinessLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 border-neutral-200 focus:border-golden-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 border-neutral-200 focus:border-golden-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-golden hover:shadow-golden text-white font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-neutral-600 space-y-2">
                  <p>Demo Credentials:</p>
                  <div className="text-xs bg-neutral-50 p-2 rounded border">
                    <p><strong>Shop Owner:</strong> shop@example.com / password</p>
                    <p><strong>Admin:</strong> admin@printeasy.com / admin123</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-neutral-600 hover:text-neutral-900"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
