
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  orderId?: string;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications based on user role
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Order Status Update',
        message: 'Your order #ORD001 has been completed and is ready for pickup.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000),
        orderId: 'ORD001'
      },
      {
        id: '2',
        title: 'New Order Received',
        message: 'You have received a new printing order from Rajesh Kumar.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        id: '3',
        title: 'Order Processing',
        message: 'Your order #ORD002 is currently being processed.',
        type: 'info',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000),
        orderId: 'ORD002'
      }
    ];

    setNotifications(mockNotifications);
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(getBackRoute())}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="text-sm"
            >
              Mark All as Read
            </Button>
          )}
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-golden-600" />
              <div>
                <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="mt-1">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-600 mb-2">No notifications</h3>
                <p className="text-neutral-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-neutral-50 ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-neutral-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-neutral-900">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-neutral-700 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-neutral-500">
                            {notification.createdAt.toLocaleString()}
                          </p>
                          {notification.orderId && (
                            <Badge variant="outline" className="text-xs">
                              {notification.orderId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
