
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
    // Remove any non-numeric characters
    const numeric = value.replace(/\D/g, '');
    // Limit to 10 digits
    return numeric.slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-printeasy-gray-light to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-printeasy-black mb-4">
            Print<span className="text-printeasy-yellow">Easy</span>
          </h1>
          <p className="text-xl text-printeasy-gray-dark max-w-2xl mx-auto">
            The simplest way to get any print job done. Upload files or describe physical items - 
            we make printing effortless.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          {!showBusinessLogin ? (
            /* Customer Login */
            <Card className="border-2 border-printeasy-yellow/20 shadow-lg rounded-printeasy">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-printeasy-black">Get Started</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Enter your phone number to begin your printing journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-printeasy-gray-light border border-r-0 border-gray-300 rounded-l-printeasy text-printeasy-gray-dark">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                        className="rounded-l-none rounded-r-printeasy border-l-0 focus:ring-printeasy-yellow focus:border-printeasy-yellow"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-printeasy-yellow hover:bg-printeasy-yellow-dark text-printeasy-black font-semibold rounded-printeasy h-12"
                    disabled={isLoading || phone.length !== 10}
                  >
                    {isLoading ? 'Getting Started...' : 'Get Started'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowBusinessLogin(true)}
                    className="text-printeasy-gray-dark hover:text-printeasy-black text-sm underline"
                  >
                    Shop Owner or Admin? Click here
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Business Login */
            <Card className="border-2 border-printeasy-black/20 shadow-lg rounded-printeasy">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-printeasy-black">Business Login</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Shop owners and admins, please login with your credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBusinessLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-printeasy focus:ring-printeasy-yellow focus:border-printeasy-yellow"
                    disabled={isLoading}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-printeasy focus:ring-printeasy-yellow focus:border-printeasy-yellow"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-printeasy-black hover:bg-printeasy-gray-dark text-white font-semibold rounded-printeasy h-12"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowBusinessLogin(false)}
                    className="text-printeasy-gray-dark hover:text-printeasy-black text-sm underline"
                  >
                    ← Back to customer login
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-printeasy-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-printeasy-black mb-2">Instant Access</h3>
            <p className="text-printeasy-gray-dark text-sm">
              No passwords, no OTPs. Just enter your phone number and start printing.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-printeasy-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold text-printeasy-black mb-2">Any Print Job</h3>
            <p className="text-printeasy-gray-dark text-sm">
              Upload digital files or describe physical items. We handle everything.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-printeasy-yellow rounded-printeasy mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-printeasy-black mb-2">Real-time Updates</h3>
            <p className="text-printeasy-gray-dark text-sm">
              Track your order status and chat directly with your print shop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
