
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
import { User, LogOut, LucideIcon } from 'lucide-react';
import { User as UserType } from '@/types/api';

interface UserMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface UniversalHeaderProps {
  title: string;
  user?: UserType;
  onLogout?: () => void;
  userMenuItems?: UserMenuItem[];
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  title,
  user,
  onLogout,
  userMenuItems = []
}) => {
  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-neutral-900">{user.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {user.role === 'shop_owner' ? 'Shop Owner' : 
                   user.role === 'admin' ? 'Administrator' : 'Customer'}
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
                    <DropdownMenuItem 
                      key={index}
                      onClick={item.onClick}
                      className="cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                  {userMenuItems.length > 0 && <DropdownMenuSeparator />}
                  {onLogout && (
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  )}
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
export type { UniversalHeaderProps };
