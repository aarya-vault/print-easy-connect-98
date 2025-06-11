
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

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    try {
      const result = await login(phoneNumber);
      toast.success('Login successful!');
      
      // Navigate based on user role after login
      // The useEffect above will handle the actual redirect
    } catch (error: any) {
      toast.error(error?.message || 'Login failed');
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
      
      // Navigation will be handled by useEffect above
    } catch (error: any) {
      toast.error(error?.message || 'Login failed');
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
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold py-2.5"
                  disabled={isLoading || !phoneNumber.trim()}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
