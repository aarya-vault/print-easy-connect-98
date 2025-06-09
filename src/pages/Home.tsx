
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, Store, FileText } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                Print<span className="text-yellow-500">Easy</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-black text-black hover:bg-black hover:text-white"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Print Your Documents
            <br />
            <span className="text-yellow-500">Anywhere, Anytime</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Connect with local print shops, upload your files, and get your documents printed quickly and efficiently.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-black mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">1. Login with Phone</h4>
                <p className="text-neutral-600">
                  Simply enter your phone number to get started. No passwords needed for customers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">2. Choose Shop</h4>
                <p className="text-neutral-600">
                  Browse and select from verified local print shops near you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-xl font-semibold text-black mb-4">3. Upload & Print</h4>
                <p className="text-neutral-600">
                  Upload your files and describe your requirements. Track your order in real-time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-black mb-12">
            Why Choose PrintEasy?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-black mb-2">No File Restrictions</h4>
              <p className="text-neutral-600">Upload any file type, any size. We handle it all.</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-black mb-2">Real-time Tracking</h4>
              <p className="text-neutral-600">Know exactly when your order is ready for pickup.</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-black mb-2">Local Shops</h4>
              <p className="text-neutral-600">Support local businesses in your community.</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-black mb-2">Simple Process</h4>
              <p className="text-neutral-600">Easy to use for everyone, no technical skills needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Printing?
          </h3>
          <p className="text-xl text-neutral-300 mb-8">
            Join thousands of satisfied customers who trust PrintEasy for their printing needs.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg"
          >
            Start Printing Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl font-bold text-black">
                Print<span className="text-yellow-500">Easy</span>
              </h1>
              <p className="text-neutral-600 text-sm">Making printing simple and accessible.</p>
            </div>
            <div className="text-neutral-600 text-sm">
              © 2024 PrintEasy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
