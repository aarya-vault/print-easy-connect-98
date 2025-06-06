
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  RefreshCw, 
  Bell, 
  User, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface UniversalHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({ 
  title, 
  subtitle, 
  onRefresh 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    toast.info('Opening notifications...');
    // Add notification modal/page logic here
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  // Mobile menu content
  const MobileMenuContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex items-center space-x-3 pb-4 border-b">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate">{user?.name || user?.phone}</p>
          <p className="text-sm text-gray-500">Shop Owner</p>
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={handleRefresh}
        className="w-full justify-start"
      >
        <RefreshCw className="w-4 h-4 mr-3" />
        Refresh Dashboard
      </Button>

      <Button
        variant="outline"
        onClick={handleNotificationClick}
        className="w-full justify-start relative"
      >
        <Bell className="w-4 h-4 mr-3" />
        Notifications
        <Badge className="absolute right-2 px-1 min-w-[20px] h-5 text-xs">
          3
        </Badge>
      </Button>

      <Button
        variant="outline"
        onClick={handleProfileClick}
        className="w-full justify-start"
      >
        <User className="w-4 h-4 mr-3" />
        Profile Settings
      </Button>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4 mr-3" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 text-sm mt-1 truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Refresh</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="outline" 
            size="sm" 
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 max-w-48">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate hidden lg:inline">{user?.name || user?.phone}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <MobileMenuContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default UniversalHeader;
