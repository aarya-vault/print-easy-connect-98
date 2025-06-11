
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600">Your recent orders will appear here.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600">Quick action buttons will be available here.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nearby Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600">Discover print shops near you.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
