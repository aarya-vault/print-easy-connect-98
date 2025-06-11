
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, User, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(name.trim());
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getBackRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'shop_owner':
        return '/shop/dashboard';
      default:
        return '/customer/dashboard';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'shop_owner':
        return 'Shop Owner';
      case 'admin':
        return 'Administrator';
      default:
        return 'Customer';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(getBackRoute())}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-golden-600" />
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
                <div className="w-12 h-12 bg-golden-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-golden-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user?.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {getRoleLabel(user?.role || '')}
                    </Badge>
                    <Badge variant={user?.is_active ? 'default' : 'destructive'}>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={user?.phone || 'Not provided'}
                    disabled
                    className="bg-neutral-50"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    value={user?.email || 'Not provided'}
                    disabled
                    className="bg-neutral-50"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !name.trim() || name === user?.name}
                  className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </form>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Role:</strong> {getRoleLabel(user?.role || '')}</p>
                  <p><strong>Account Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
