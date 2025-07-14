
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Plus, 
  User,
  Package,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const getCustomerTabs = () => [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/customer/dashboard',
      badge: null
    },
    {
      id: 'search',
      label: 'Shops',
      icon: Search,
      path: '/customer/shops',
      badge: null
    },
    {
      id: 'order',
      label: 'Order',
      icon: Plus,
      path: '/customer/order/new',
      badge: null
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      path: '/customer/orders',
      badge: 2 // Active orders
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/customer/profile',
      badge: null
    }
  ];

  const getShopTabs = () => [
    {
      id: 'dashboard',
      label: 'Orders',
      icon: Package,
      path: '/shop/dashboard',
      badge: 5 // New orders
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/shop/analytics',
      badge: null
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      path: '/shop/customers',
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/shop/settings',
      badge: null
    }
  ];

  const getAdminTabs = () => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin/dashboard',
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users',
      badge: null
    },
    {
      id: 'shops',
      label: 'Shops',
      icon: Package,
      path: '/admin/shops',
      badge: 3 // Pending approvals
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      badge: null
    }
  ];

  const getTabs = () => {
    switch (user.role) {
      case 'customer':
        return getCustomerTabs();
      case 'shop_owner':
        return getShopTabs();
      case 'admin':
        return getAdminTabs();
      default:
        return [];
    }
  };

  const tabs = getTabs();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1 relative ${
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge && tab.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1 min-w-[16px] h-4 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
