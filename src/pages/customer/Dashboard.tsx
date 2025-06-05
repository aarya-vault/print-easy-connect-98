
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
    <div className="min-h-screen bg-printeasy-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-printeasy-yellow/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-printeasy-black">
            Print<span className="text-printeasy-yellow">Easy</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-printeasy-gray-dark">
              Welcome, {user?.phone}
            </span>
            <Button
              onClick={logout}
              variant="outline"
              className="border-printeasy-gray-medium hover:bg-printeasy-gray-light rounded-printeasy"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-printeasy-black mb-2">
              Your Print Dashboard
            </h2>
            <p className="text-printeasy-gray-dark">
              Manage your print orders and track their progress in real-time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-printeasy-yellow/30 hover:border-printeasy-yellow/50 transition-colors cursor-pointer rounded-printeasy">
              <CardHeader>
                <CardTitle className="text-printeasy-black flex items-center gap-2">
                  <span className="text-2xl">📁</span>
                  Upload Digital Files
                </CardTitle>
                <CardDescription>
                  Upload documents, photos, or any digital files for printing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleNewOrder}
                  className="w-full bg-printeasy-yellow hover:bg-printeasy-yellow-dark text-printeasy-black font-semibold rounded-printeasy"
                >
                  Start Digital Order
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-printeasy-black/30 hover:border-printeasy-black/50 transition-colors cursor-pointer rounded-printeasy">
              <CardHeader>
                <CardTitle className="text-printeasy-black flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Describe Physical Item
                </CardTitle>
                <CardDescription>
                  Describe a book, document, or photos you want to copy or scan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleNewOrder}
                  className="w-full bg-printeasy-black hover:bg-printeasy-gray-dark text-white font-semibold rounded-printeasy"
                >
                  Start Physical Order
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <Card className="rounded-printeasy">
            <CardHeader>
              <CardTitle className="text-printeasy-black">Recent Orders</CardTitle>
              <CardDescription>
                Your printing history and current orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-printeasy-gray-dark">
                <p className="text-lg mb-4">No orders yet!</p>
                <p className="text-sm">
                  When you place your first order, it will appear here with real-time status updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
