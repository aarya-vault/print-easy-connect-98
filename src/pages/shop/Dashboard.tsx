
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ShopDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-printeasy-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-printeasy-yellow/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-printeasy-black">
            Print<span className="text-printeasy-yellow">Easy</span> Shop
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-printeasy-gray-dark">
              {user?.name || user?.email}
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
          <h2 className="text-3xl font-bold text-printeasy-black mb-2">
            Shop Owner Dashboard
          </h2>
          <p className="text-printeasy-gray-dark mb-8">
            Manage your print orders and queue efficiently.
          </p>

          <Card className="rounded-printeasy">
            <CardHeader>
              <CardTitle className="text-printeasy-black">Order Queue</CardTitle>
              <CardDescription>
                All PrintEasy orders assigned to your shop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-printeasy-gray-dark">
                <p className="text-lg mb-4">No orders in queue</p>
                <p className="text-sm">
                  When customers place orders, they will appear here for processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
