
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Phone, Mail, Lock, User, Building, Shield, ArrowLeft, Printer } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithEmail } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Login successful!');
      navigate('/shop/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-golden-600 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Print<span className="text-primary">Easy</span>
              </h1>
            </div>
            
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-md mx-auto">
          {/* Welcome Text */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-2 md:mb-4">
              Welcome Back!
            </h1>
            <p className="text-neutral-600">Please sign in to continue to your account.</p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold text-neutral-900">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="customer" className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Customer</span>
                    <span className="sm:hidden">Customer</span>
                  </TabsTrigger>
                  <TabsTrigger value="business" className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4" />
                    <span className="hidden sm:inline">Business</span>
                    <span className="sm:hidden">Business</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customer" className="space-y-4">
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="Enter exactly 10 digits"
                          className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 text-center text-lg font-medium"
                          maxLength={10}
                          required
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 text-center">
                        {phoneNumber.length}/10 digits
                      </p>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading || phoneNumber.length !== 10}
                      className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        'Continue with Phone'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="business" className="space-y-4">
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
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold shadow-lg text-base"
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

                  {/* Demo Credentials - Mobile Optimized */}
                  <div className="mt-6 p-4 bg-golden-50 rounded-lg border border-golden-200">
                    <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Demo Credentials
                    </h4>
                    <div className="space-y-2 text-sm text-neutral-700">
                      <div>
                        <strong>Shop Owner:</strong>
                        <div className="text-xs mt-1 text-neutral-600">
                          Email: shop@example.com<br />
                          Password: password
                        </div>
                      </div>
                      <div>
                        <strong>Admin:</strong>
                        <div className="text-xs mt-1 text-neutral-600">
                          Email: admin@printeasy.com<br />
                          Password: admin123
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-neutral-600 hover:text-neutral-900"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
