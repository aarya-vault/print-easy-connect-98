
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  UserCheck, 
  Clock, 
  Star, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Printer,
  FileText,
  MessageSquare
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-golden-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-neutral-900">Print</span>
              <span className="bg-gradient-to-r from-golden-500 to-golden-600 bg-clip-text text-transparent">Easy</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your one-stop solution for all printing needs. Connect with verified print shops, 
              upload files securely, track orders in real-time, and get your documents printed 
              with ease across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Start Printing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/shop/apply">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-golden-500 text-golden-700 hover:bg-golden-50 font-semibold px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Register Your Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <Printer className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-bounce delay-75">
          <div className="w-12 h-12 bg-golden-100 rounded-full flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-golden-600" />
          </div>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-150">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-purple-600" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">How PrintEasy Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Simple, fast, and reliable printing in just three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">1. Upload Files</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Select your preferred print shop and securely upload your documents. 
                  Support for PDF, Word, PowerPoint, and image files.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 border-golden-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">2. Track Progress</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Monitor your order status in real-time. Get instant notifications 
                  when your documents are ready for pickup.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">3. Collect & Pay</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Pick up your perfectly printed documents and pay at the shop. 
                  Rate your experience to help others find the best services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why Choose PrintEasy?</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Experience the future of printing with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Secure & Verified</h3>
                </div>
                <p className="text-neutral-600">
                  All print shops are verified and your documents are encrypted during transfer. 
                  Your privacy and data security are our top priorities.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Lightning Fast</h3>
                </div>
                <p className="text-neutral-600">
                  Quick file uploads, instant order confirmations, and real-time status updates. 
                  Get your documents printed faster than ever before.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-golden-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-golden-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Quality Assured</h3>
                </div>
                <p className="text-neutral-600">
                  PrintEasy Stars rating system ensures you always choose the best print shops 
                  with verified customer reviews and quality standards.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Wide Network</h3>
                </div>
                <p className="text-neutral-600">
                  Access hundreds of verified print shops across major cities in India. 
                  Find convenient locations near you with our smart location finder.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">24/7 Support</h3>
                </div>
                <p className="text-neutral-600">
                  Direct chat with shop owners, real-time order updates, and dedicated 
                  customer support to assist you whenever you need help.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Easy Communication</h3>
                </div>
                <p className="text-neutral-600">
                  Seamless communication with print shops through integrated calling and 
                  messaging features. Get updates and clarifications instantly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-golden-500 to-golden-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Printing?
            </h2>
            <p className="text-xl text-golden-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust PrintEasy for all their printing needs. 
              Start your printing journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-golden-700 border-2 border-white hover:bg-golden-50 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/shop/apply">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-golden-700 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Join as Shop Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                Print<span className="text-golden-500">Easy</span>
              </h3>
              <p className="text-neutral-300 mb-4 max-w-md">
                Revolutionizing the printing industry with technology, security, and convenience. 
                Your trusted partner for all printing needs across India.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-golden-500 fill-current" />
                  <span className="text-sm font-medium">4.8/5 Customer Rating</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/customer/dashboard" className="text-neutral-300 hover:text-golden-500 transition-colors">Customer Dashboard</Link></li>
                <li><Link to="/shop/apply" className="text-neutral-300 hover:text-golden-500 transition-colors">Shop Registration</Link></li>
                <li><Link to="/admin/dashboard" className="text-neutral-300 hover:text-golden-500 transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><span className="text-neutral-300">24/7 Customer Support</span></li>
                <li><span className="text-neutral-300">help@printeasy.in</span></li>
                <li><span className="text-neutral-300">+91 1800-PRINT-24</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
            <p className="text-neutral-400">
              © 2024 PrintEasy. All rights reserved. | Making printing accessible for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
