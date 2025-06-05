
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-printeasy-gray-light">
      {/* Header */}
      <div className="bg-white border-b border-printeasy-yellow/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-printeasy-black">
            Print<span className="text-printeasy-yellow">Easy</span> Admin
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
            Admin Dashboard
          </h2>
          <p className="text-printeasy-gray-dark mb-8">
            Manage the PrintEasy platform and shop network.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-printeasy">
              <CardHeader>
                <CardTitle className="text-printeasy-black">Shop Applications</CardTitle>
                <CardDescription>
                  Review and approve new shop registrations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-printeasy-gray-dark">
                  <p>No pending applications</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-printeasy">
              <CardHeader>
                <CardTitle className="text-printeasy-black">Platform Analytics</CardTitle>
                <CardDescription>
                  Overview of platform performance and usage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-printeasy-gray-dark">
                  <p>Analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
