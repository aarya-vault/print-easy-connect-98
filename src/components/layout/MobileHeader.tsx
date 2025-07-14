
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  Bell,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  showBack = false, 
  showMenu = true,
  onBack 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleProfileNav = () => {
    switch (user?.role) {
      case 'customer':
        navigate('/customer/dashboard');
        break;
      case 'shop_owner':
        navigate('/shop/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2 hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2"
                  onClick={() => {/* TODO: Implement notifications */}}
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-4 text-xs">
                    3
                  </Badge>
                </Button>
                
                {showMenu && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background border-l shadow-xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Menu Content */}
            <div className="p-4 space-y-4">
              {user && (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.name || user.phone || user.email}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {user.role?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={handleProfileNav}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {/* TODO: Implement notifications */}}
                    >
                      <Bell className="w-4 h-4 mr-3" />
                      Notifications
                      <Badge className="ml-auto px-2 py-1 text-xs">3</Badge>
                    </Button>

                    <div className="border-t pt-2 mt-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
