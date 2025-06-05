
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
    const numeric = value.replace(/\D/g, '');
    return numeric.slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-yellow-white">
      {/* Floating Elements for Visual Interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-white-gray rounded-full opacity-30 animate-pulse-glow"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-yellow-light rounded-printeasy opacity-40 animate-gradient-shift"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-radial-white rounded-full opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Enhanced Typography */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
            <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-yellow-white mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-printeasy-gray-dark max-w-2xl mx-auto leading-relaxed">
            The most elegant printing platform. Upload files instantly or describe physical items - 
            we transform complexity into simplicity.
          </p>
        </div>

        {/* Main Login Card */}
        <div className="max-w-md mx-auto mb-16">
          {!showBusinessLogin ? (
            /* Customer Login */
            <Card className="border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden">
              <div className="h-2 bg-gradient-yellow-white"></div>
              <CardHeader className="text-center bg-white">
                <CardTitle className="text-2xl text-printeasy-black mb-2">Begin Your Journey</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Enter your phone number to access instant printing
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handlePhoneLogin} className="space-y-6">
                  <div className="relative">
                    <div className="flex overflow-hidden rounded-printeasy shadow-lg">
                      <div className="flex items-center px-4 bg-gradient-gray-white text-printeasy-gray-dark font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                        className="border-0 rounded-none bg-white focus:ring-0 focus:outline-none text-lg"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black font-semibold rounded-printeasy h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:animate-pulse-glow"
                    disabled={isLoading || phone.length !== 10}
                  >
                    {isLoading ? 'Connecting...' : 'Start Printing'}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowBusinessLogin(true)}
                    className="text-printeasy-gray-dark hover:text-printeasy-black text-sm underline transition-colors"
                  >
                    Business Portal Access
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Business Login */
            <Card className="border-0 shadow-2xl bg-gradient-white-black rounded-printeasy overflow-hidden">
              <div className="h-2 bg-gradient-black-gray"></div>
              <CardHeader className="text-center bg-white">
                <CardTitle className="text-2xl text-printeasy-black mb-2">Business Portal</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Shop owners and administrators, access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleBusinessLogin} className="space-y-6">
                  <Input
                    type="email"
                    placeholder="Business email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-printeasy border-2 border-printeasy-gray-light focus:border-printeasy-black transition-colors text-lg h-12"
                    disabled={isLoading}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-printeasy border-2 border-printeasy-gray-light focus:border-printeasy-black transition-colors text-lg h-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-black-gray hover:bg-printeasy-black text-white font-semibold rounded-printeasy h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading || !email || !password}
                  >
                    {isLoading ? 'Authenticating...' : 'Access Portal'}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowBusinessLogin(false)}
                    className="text-printeasy-gray-dark hover:text-printeasy-black text-sm underline transition-colors"
                  >
                    ← Customer Login
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Instant Access Feature */}
          <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="h-1 bg-gradient-yellow-white"></div>
            <CardContent className="p-8 text-center bg-white">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-radial-yellow rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <div className="w-8 h-12 bg-white rounded-sm shadow-inner relative">
                    <div className="absolute top-1 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                    <div className="absolute top-3 left-1 right-1 h-1 bg-printeasy-gray-light rounded"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-printeasy-black mb-3 text-lg">Instant Access</h3>
              <p className="text-printeasy-gray-dark text-sm leading-relaxed">
                No complex registrations. Just your phone number and you're printing in seconds.
              </p>
            </CardContent>
          </Card>
          
          {/* Universal Printing Feature */}
          <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="h-1 bg-gradient-yellow-white"></div>
            <CardContent className="p-8 text-center bg-white">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-radial-yellow rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <div className="w-10 h-12 bg-white rounded-sm shadow-inner"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-yellow-light rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-printeasy-black mb-3 text-lg">Universal Printing</h3>
              <p className="text-printeasy-gray-dark text-sm leading-relaxed">
                Any file type, any description. Our intelligent system handles everything seamlessly.
              </p>
            </CardContent>
          </Card>
          
          {/* Real-time Updates Feature */}
          <Card className="border-0 bg-gradient-white-gray rounded-printeasy shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
            <div className="h-1 bg-gradient-yellow-white"></div>
            <CardContent className="p-8 text-center bg-white">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-radial-yellow rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <div className="w-3 h-10 bg-white rounded-full shadow-inner"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-yellow-light rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-printeasy-black mb-3 text-lg">Live Updates</h3>
              <p className="text-printeasy-gray-dark text-sm leading-relaxed">
                Track every step in real-time. Chat directly with your print shop for perfect results.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicator */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-white-gray px-6 py-3 rounded-full shadow-lg">
            <div className="w-3 h-3 bg-gradient-yellow-white rounded-full animate-pulse"></div>
            <span className="text-printeasy-gray-dark text-sm font-medium">Trusted by thousands of customers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
