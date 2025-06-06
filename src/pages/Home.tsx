
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Building, 
  Smartphone, 
  Shield, 
  Zap, 
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // Redirect based on user role
      const roleRedirects = {
        customer: '/customer/dashboard',
        shop_owner: '/shop/dashboard',
        admin: '/admin/dashboard'
      };
      navigate(roleRedirects[user.role]);
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Experience",
      description: "Upload documents and place orders directly from your phone with our intuitive interface."
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time order tracking and immediate shop notifications for fastest turnaround."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your documents are protected with enterprise-grade security and privacy measures."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Place orders anytime, anywhere. Our platform works round the clock for your convenience."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: Users },
    { number: "500+", label: "Partner Shops", icon: Building },
    { number: "50,000+", label: "Orders Completed", icon: CheckCircle },
    { number: "99.9%", label: "Uptime", icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Student",
      content: "PrintEasy saved me so much time during exam season. I could upload and order my study materials from anywhere!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Shop Owner",
      content: "My business has grown 300% since joining PrintEasy. The platform brings customers directly to my shop.",
      rating: 5,
      avatar: "RK"
    },
    {
      name: "Anita Desai",
      role: "Corporate Manager",
      content: "Professional quality prints with amazing convenience. PrintEasy handles all our office printing needs perfectly.",
      rating: 5,
      avatar: "AD"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-golden rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">PE</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">PrintEasy</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-600">Welcome, {user.name || 'User'}</span>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gradient-golden hover:shadow-golden text-white"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-golden hover:shadow-golden text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-golden-100 text-golden-800 border-golden-200">
                  <Award className="w-4 h-4 mr-1" />
                  India's #1 Digital Printing Platform
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-neutral-900">Professional</span>{' '}
                  <span className="bg-gradient-golden bg-clip-text text-transparent">Printing</span>{' '}
                  <span className="text-neutral-900">Made Simple</span>
                </h1>
                
                <p className="text-xl text-neutral-600 leading-relaxed">
                  Upload documents from your phone, connect with local print shops, and get professional 
                  quality prints delivered fast. Join thousands of satisfied customers across India.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-golden hover:shadow-golden text-white text-lg px-8 py-6"
                >
                  Start Printing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  onClick={() => navigate('/shop/apply')}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-lg px-8 py-6"
                >
                  Join as Shop Owner
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 ${color} rounded-full border-2 border-white`} />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">10,000+ happy customers</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-golden-500 fill-current" />
                  ))}
                  <span className="text-sm text-neutral-600 ml-1">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="shadow-2xl border-0 overflow-hidden">
                  <div className="bg-gradient-golden p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">PE</span>
                      </div>
                      <span className="text-white font-semibold">Customer Dashboard</span>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">24</div>
                          <div className="text-sm text-blue-600">Total Orders</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">3</div>
                          <div className="text-sm text-green-600">In Progress</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm font-medium">Assignment Prints</span>
                          <Badge className="bg-green-100 text-green-700">Ready</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <span className="text-sm font-medium">Resume Copies</span>
                          <Badge className="bg-blue-100 text-blue-700">Printing</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-golden-200 rounded-full opacity-60 animate-pulse" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-40 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-golden-soft rounded-full mx-auto flex items-center justify-center">
                    <Icon className="w-8 h-8 text-golden-600" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900">{stat.number}</div>
                  <div className="text-neutral-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose PrintEasy?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Experience the future of printing with our innovative platform designed for modern India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-glass bg-white/80 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-golden-soft rounded-full mx-auto flex items-center justify-center">
                      <Icon className="w-8 h-8 text-golden-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Loved by Customers & Shop Owners
            </h2>
            <p className="text-xl text-neutral-600">
              Join thousands who trust PrintEasy for their printing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-glass bg-white/90 backdrop-blur-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-golden-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-golden rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-golden text-white overflow-hidden relative">
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Printing Experience?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied customers and start printing smarter today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-white text-golden-600 hover:bg-neutral-50 text-lg px-8 py-6"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/shop/apply')}
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  <Building className="w-5 h-5 mr-2" />
                  Become a Partner
                </Button>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-golden rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">PE</span>
                </div>
                <span className="text-xl font-bold">PrintEasy</span>
              </div>
              <p className="text-neutral-400">
                Making professional printing accessible to everyone in India.
              </p>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm text-neutral-400">Available across India</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Partners</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Join as Shop</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner Benefits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 PrintEasy. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
