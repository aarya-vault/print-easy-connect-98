
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, ArrowLeft, Home, LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User as UserType } from '@/types/api';

interface UserMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface UniversalHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  showHomeButton?: boolean;
  user?: UserType;
  onLogout?: () => void;
  userMenuItems?: UserMenuItem[];
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  title,
  showBackButton = false,
  backTo,
  showHomeButton = false,
  user: propUser,
  onLogout: propOnLogout,
  userMenuItems = []
}) => {
  const { user: contextUser, logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  // Use prop values or fallback to context
  const user = propUser || contextUser;
  const logout = propOnLogout || contextLogout;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    const roleRedirects = {
      customer: '/customer/dashboard',
      shop_owner: '/shop/dashboard',
      admin: '/admin/dashboard'
    };
    navigate(roleRedirects[user?.role || 'customer']);
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'shop_owner': return 'Shop Owner';
      case 'customer': return 'Customer';
      default: return role;
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            {showHomeButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleHome}
                className="p-2"
              >
                <Home className="w-4 h-4" />
              </Button>
            )}

            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Print<span className="text-golden-600">Easy</span>
              </h1>
              {title && <p className="text-sm text-neutral-600">{title}</p>}
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-medium text-neutral-900">{user.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {getRoleBadge(user.role)}
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-10 h-10 rounded-full p-0">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {userMenuItems.map((item, index) => (
                    <DropdownMenuItem key={index} onClick={item.onClick} className="cursor-pointer">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  {userMenuItems.length > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleHome} className="cursor-pointer">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
