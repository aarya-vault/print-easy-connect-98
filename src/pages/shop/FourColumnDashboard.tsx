
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MobileHeader from '@/components/layout/MobileHeader';
import { 
  Clock, 
  Package, 
  CheckCircle, 
  Phone,
  Eye,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'new' | 'processing' | 'ready' | 'completed';
  description: string;
  createdAt: Date;
  isUrgent: boolean;
}

const FourColumnDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified mock data without pricing
  const [orders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerName: 'John Doe',
      customerPhone: '9876543210',
      orderType: 'uploaded-files',
      status: 'new',
      description: 'Print 5 copies of resume',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isUrgent: true
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      customerPhone: '8765432109',
      orderType: 'walk-in',
      status: 'processing',
      description: 'Lamination and binding',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isUrgent: false
    },
    {
      id: 'ORD003',
      customerName: 'Mike Johnson',
      customerPhone: '7654321098',
      orderType: 'uploaded-files',
      status: 'ready',
      description: 'Color printing presentation',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isUrgent: false
    },
    {
      id: 'ORD004',
      customerName: 'Sarah Wilson',
      customerPhone: '6543210987',
      orderType: 'walk-in',
      status: 'completed',
      description: 'Document photocopying',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isUrgent: false
    }
  ]);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // Add status update logic here
  };

  const handleToggleUrgency = (orderId: string) => {
    console.log(`Toggling urgency for order ${orderId}`);
    // Add urgency toggle logic here
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => 
      order.status === status && 
      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-medium">{order.id}</span>
              {order.isUrgent && (
                <Badge className="bg-primary/20 text-foreground px-2 py-1 text-xs">
                  Urgent
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm">{order.customerName}</h3>
            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleToggleUrgency(order.id)}>
                {order.isUrgent ? 'Remove Urgent' : 'Mark Urgent'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{order.description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="capitalize">{order.orderType.replace('-', ' ')}</span>
          <span>{formatTimeAgo(order.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          {order.status === 'new' && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(order.id, 'processing')}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Start Processing
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(order.id, 'ready')}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Mark Ready
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(order.id, 'completed')}
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background"
            >
              Complete Order
            </Button>
          )}
          {order.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled
            >
              Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ColumnHeader: React.FC<{ 
    title: string; 
    count: number; 
    icon: React.ReactNode; 
    color: string 
  }> = ({ title, count, icon, color }) => (
    <div className={`p-4 rounded-t-lg ${color} border-b`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold">{title}</h2>
        </div>
        <Badge variant="secondary" className="bg-background/20">
          {count}
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Shop Dashboard" showMenu={true} />
      
      {/* Header Controls */}
      <div className="p-4 border-b bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p className="text-muted-foreground">Manage your printing orders efficiently</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Layout */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop 4-Column Layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {/* New Orders Column */}
            <div className="bg-card rounded-lg border">
              <ColumnHeader
                title="New Orders"
                count={getOrdersByStatus('new').length}
                icon={<Clock className="w-5 h-5" />}
                color="bg-primary/10"
              />
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {getOrdersByStatus('new').map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {getOrdersByStatus('new').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No new orders</p>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Column */}
            <div className="bg-card rounded-lg border">
              <ColumnHeader
                title="Processing"
                count={getOrdersByStatus('processing').length}
                icon={<Package className="w-5 h-5" />}
                color="bg-primary/20"
              />
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {getOrdersByStatus('processing').map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {getOrdersByStatus('processing').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders in processing</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ready Column */}
            <div className="bg-card rounded-lg border">
              <ColumnHeader
                title="Ready"
                count={getOrdersByStatus('ready').length}
                icon={<CheckCircle className="w-5 h-5" />}
                color="bg-primary/30"
              />
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {getOrdersByStatus('ready').map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {getOrdersByStatus('ready').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders ready</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-card rounded-lg border">
              <ColumnHeader
                title="Completed"
                count={getOrdersByStatus('completed').length}
                icon={<CheckCircle className="w-5 h-5" />}
                color="bg-muted"
              />
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {getOrdersByStatus('completed').map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {getOrdersByStatus('completed').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No completed orders</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Accordion Layout */}
          <div className="lg:hidden space-y-4">
            {[
              { status: 'new' as const, title: 'New Orders', icon: Clock, color: 'bg-primary/10' },
              { status: 'processing' as const, title: 'Processing', icon: Package, color: 'bg-primary/20' },
              { status: 'ready' as const, title: 'Ready', icon: CheckCircle, color: 'bg-primary/30' },
              { status: 'completed' as const, title: 'Completed', icon: CheckCircle, color: 'bg-muted' }
            ].map(({ status, title, icon: Icon, color }) => (
              <Card key={status}>
                <CardHeader className={`${color} rounded-t-lg`}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {title}
                    </div>
                    <Badge variant="secondary">
                      {getOrdersByStatus(status).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {getOrdersByStatus(status).map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {getOrdersByStatus(status).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No {title.toLowerCase()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourColumnDashboard;
