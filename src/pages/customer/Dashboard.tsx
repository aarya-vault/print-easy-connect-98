
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewOrder = () => {
    navigate('/customer/order/new');
  };

  return (
    <div className="min-h-screen bg-gradient-white-gray">
      {/* Enhanced Header with Gradient */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-yellow-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-black-white bg-clip-text text-transparent">Print</span>
                <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Easy</span>
              </h1>
              <div className="w-16 h-1 bg-gradient-yellow-white rounded-full mt-1"></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-printeasy-gray-medium">Welcome back</div>
                <div className="font-semibold text-printeasy-black">{user?.phone}</div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-2 border-printeasy-gray-medium hover:bg-gradient-gray-white rounded-printeasy transition-all duration-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-printeasy-black mb-4">
              Your Printing <span className="bg-gradient-yellow-light bg-clip-text text-transparent">Command Center</span>
            </h2>
            <p className="text-xl text-printeasy-gray-dark max-w-2xl mx-auto">
              Manage orders, track progress, and experience printing like never before.
            </p>
            <div className="w-32 h-1 bg-gradient-yellow-white mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Digital Files Card */}
            <Card className="border-0 shadow-2xl bg-gradient-white-yellow rounded-printeasy overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group" onClick={handleNewOrder}>
              <div className="h-2 bg-gradient-yellow-light"></div>
              <CardHeader className="bg-white relative">
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-gradient-radial-yellow rounded-printeasy shadow-lg flex items-center justify-center group-hover:animate-pulse-glow">
                    <div className="w-6 h-8 bg-white rounded-sm shadow-inner relative">
                      <div className="absolute top-1 left-1 right-1 h-0.5 bg-printeasy-gray-light rounded"></div>
                      <div className="absolute top-2.5 left-1 right-1 h-0.5 bg-printeasy-gray-light rounded"></div>
                      <div className="absolute bottom-1 left-1 w-2 h-2 bg-gradient-yellow-light rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-printeasy-black text-xl mb-2">Digital File Upload</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Upload documents, photos, presentations, or any digital files for professional printing.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Button 
                  className="w-full bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black font-semibold rounded-printeasy h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Upload & Print Files
                </Button>
              </CardContent>
            </Card>

            {/* Physical Items Card */}
            <Card className="border-0 shadow-2xl bg-gradient-white-black rounded-printeasy overflow-hidden hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group" onClick={handleNewOrder}>
              <div className="h-2 bg-gradient-black-gray"></div>
              <CardHeader className="bg-white relative">
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-gradient-radial-white border-2 border-printeasy-black rounded-printeasy shadow-lg flex items-center justify-center group-hover:shadow-xl">
                    <div className="w-6 h-6 border-2 border-printeasy-black rounded-sm relative">
                      <div className="absolute inset-1 border border-printeasy-gray-medium rounded-sm"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-yellow-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-printeasy-black text-xl mb-2">Physical Item Description</CardTitle>
                <CardDescription className="text-printeasy-gray-dark">
                  Describe books, documents, or photos you want copied, scanned, or digitized.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Button 
                  className="w-full bg-gradient-black-gray hover:bg-printeasy-black text-white font-semibold rounded-printeasy h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Describe & Order
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History Section */}
          <Card className="border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden">
            <div className="h-2 bg-gradient-yellow-white"></div>
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-printeasy-black text-2xl">Order History</CardTitle>
                  <CardDescription className="text-printeasy-gray-dark mt-2">
                    Track your printing journey and reorder with ease.
                  </CardDescription>
                </div>
                <div className="w-16 h-16 bg-gradient-radial-yellow rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-2xl font-bold text-printeasy-black">0</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-white-gray rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <div className="w-12 h-12 bg-gradient-radial-white rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-printeasy-gray-medium rounded-full"></div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-yellow-white rounded-full shadow-lg animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-printeasy-black mb-4">Ready to Start Printing?</h3>
                <p className="text-printeasy-gray-dark text-lg mb-8 max-w-md mx-auto">
                  Your first order will appear here with real-time status updates and progress tracking.
                </p>
                <Button
                  onClick={handleNewOrder}
                  className="bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black font-semibold rounded-printeasy px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:animate-pulse-glow"
                >
                  Create Your First Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicators */}
          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-yellow-white rounded-full animate-pulse"></div>
              <span className="text-sm text-printeasy-gray-dark">System Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-radial-white border border-printeasy-gray-medium rounded-full"></div>
              <span className="text-sm text-printeasy-gray-dark">All Shops Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
