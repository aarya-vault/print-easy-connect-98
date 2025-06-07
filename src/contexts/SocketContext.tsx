
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (orderId: string, message: string, recipientId: number) => void;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Listen for new messages
      newSocket.on('new_message', (data) => {
        toast.info(`New message from ${data.senderName}`, {
          description: data.message.message.substring(0, 50) + '...'
        });
      });

      // Listen for order updates
      newSocket.on('order_updated', (order) => {
        toast.success('Order updated', {
          description: `Order ${order.id} status changed to ${order.status}`
        });
      });

      // Listen for new orders (shop owners)
      newSocket.on('new_order', (order) => {
        if (user.role === 'shop_owner') {
          toast.info('New order received!', {
            description: `Order ${order.id} from ${order.customer_name}`
          });
        }
      });

      // Listen for notifications
      newSocket.on('notification', (notification) => {
        toast.info(notification.title, {
          description: notification.message
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const sendMessage = (orderId: string, message: string, recipientId: number) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        orderId,
        message,
        recipientId
      });
    }
  };

  const joinOrderRoom = (orderId: string) => {
    if (socket && isConnected) {
      socket.emit('join_order', { orderId });
    }
  };

  const leaveOrderRoom = (orderId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_order', { orderId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        joinOrderRoom,
        leaveOrderRoom
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
