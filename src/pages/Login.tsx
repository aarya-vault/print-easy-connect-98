
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Phone, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, emailLogin, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const roleRedirects = {
        customer: '/customer/dashboard',
        shop_owner: '/shop/dashboard', 
        admin: '/admin/dashboard'
      };
      navigate(roleRedirects[user.role]);
    }
  }, [user, navigate]);

  // Format phone number to 10 digits
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    let cleaned = value.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2); // Remove country code
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1); // Remove leading zero
    }
    
    // Limit to 10 digits
    return cleaned.substring(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanPhone = formatPhoneNumber(phoneNumber);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(cleanPhone);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.error || error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      await emailLogin(email, password);
      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Email login error:', error);
      toast.error(error?.error || error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-golden-50 via-white to-golden-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-gradient-to-r from-golden-500 to-golden-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">PE</span>
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900">
            Welcome to Print<span className="text-golden-600">Easy</span>
          </CardTitle>
          <p className="text-neutral-600">Sign in to your account</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="phone" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-golden-100">
              <TabsTrigger value="phone" className="data-[state=active]:bg-golden-500 data-[state=active]:text-white">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-golden-500 data-[state=active]:text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-500">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      required
                      maxLength={10}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter exactly 10 digits (without country code)
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold py-2.5"
                  disabled={isLoading || phoneNumber.length !== 10}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In with Phone'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold py-2.5"
                  disabled={isLoading || !email.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In with Email'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-neutral-600">
            <p>
              Don't have an account? Sign in with your phone number to create one automatically.
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Test Credentials:</p>
              <p className="text-xs text-blue-700">Shop Owner: owner@test.com / password123</p>
              <p className="text-xs text-blue-700">Admin: admin@test.com / password123</p>
              <p className="text-xs text-blue-700">Customer: Any 10-digit phone number</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
