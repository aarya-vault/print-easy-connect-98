import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Printer, 
  Phone, 
  ArrowRight, 
  Upload, 
  FileText, 
  Camera,
  MapPin,
  Clock,
  Store
} from 'lucide-react';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call login with just the phone number string
      await login(phoneNumber);

      toast.success('Welcome to PrintEasy!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      title: 'Document Printing',
      description: 'High-quality printing for all document types',
      icon: FileText,
      features: ['Black & White', 'Color Printing', 'Multiple Formats']
    },
    {
      title: 'File Upload',
      description: 'Upload files directly from your device',
      icon: Upload,
      features: ['PDF Support', 'Image Files', 'Document Files']
    },
    {
      title: 'Photo Printing',
      description: 'Professional photo printing services',
      icon: Camera,
      features: ['High Resolution', 'Various Sizes', 'Quick Processing']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PrintEasy</span>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              Shop Owner Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Print Anywhere, Anytime
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8">
                Connect with nearby print shops instantly. Upload files, place orders, and get your printing done effortlessly.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  <span className="font-semibold">50+ Partner Shops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">15 Min Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Bangalore Wide</span>
                </div>
              </div>
            </div>

            {/* Phone Login Form */}
            <div className="bg-background/10 backdrop-blur-lg rounded-2xl p-8 border border-primary-foreground/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Get Started Now</h2>
                <p className="text-primary-foreground/80">Enter your phone number to begin</p>
              </div>

              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 h-14 text-lg bg-background/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !phoneNumber.trim()}
                  className="w-full h-14 text-lg bg-background text-foreground hover:bg-background/90 font-semibold"
                >
                  {isLoading ? (
                    'Connecting...'
                  ) : (
                    <>
                      Start Printing
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Shop Owner? Login Here
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get your printing done
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Phone Number',
                description: 'Quick registration with just your phone number'
              },
              {
                step: '2',
                title: 'Find & Choose Shop',
                description: 'Browse nearby print shops and select the best one'
              },
              {
                step: '3',
                title: 'Place Order',
                description: 'Upload files or walk-in, track your order status'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Printing?
          </h2>
          <p className="text-xl text-background/80 mb-8">
            Join thousands of satisfied customers who trust PrintEasy for their printing needs.
          </p>
          <Button
            size="lg"
            onClick={() => {
              const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
              phoneInput?.focus();
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Printer className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">PrintEasy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PrintEasy. Making printing simple and accessible.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
