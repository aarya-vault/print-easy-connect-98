
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  Phone, 
  Minimize2,
  Maximize2,
  User,
  Bot
} from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  order_id: string;
  sender_id: number;
  recipient_id: number;
  message: string;
  sender_name: string;
  is_read: boolean;
  created_at: string;
}

interface RealTimeChatProps {
  orderId: string;
  recipientId: number;
  recipientName: string;
  recipientPhone?: string;
  isOpen: boolean;
  onClose: () => void;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({
  orderId,
  recipientId,
  recipientName,
  recipientPhone,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { socket, isConnected, sendMessage } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && orderId) {
      loadMessages();
    }
  }, [isOpen, orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', handleNewMessage);
      socket.on('message_sent', handleMessageSent);
      
      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('message_sent', handleMessageSent);
      };
    }
  }, [socket]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getOrderMessages(orderId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (data: any) => {
    if (data.order_id === orderId) {
      setMessages(prev => [...prev, data.message]);
    }
  };

  const handleMessageSent = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      // Send via API
      await apiService.sendMessage(orderId, newMessage, recipientId);
      
      // Send via WebSocket for real-time delivery
      if (isConnected) {
        sendMessage(orderId, newMessage, recipientId);
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isMyMessage = (message: Message) => {
    return user && message.sender_id === parseInt(user.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
      <Card className="border-0 shadow-premium bg-white">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-golden rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-neutral-900">{recipientName}</CardTitle>
                <p className="text-sm text-neutral-600">Order #{orderId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-neutral-500">
                    {isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {recipientPhone && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`tel:${recipientPhone}`)}
                  className="h-8 w-8 p-0"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin w-6 h-6 border-2 border-golden-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isMyMessage(message)
                            ? 'bg-gradient-golden text-white' 
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            <div className="flex items-center gap-1">
                              {isMyMessage(message) ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                              <span>{isMyMessage(message) ? 'You' : message.sender_name}</span>
                            </div>
                          </Badge>
                          <span className="text-xs opacity-75">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border-neutral-200 focus:border-golden-500"
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-gradient-golden hover:shadow-golden text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-2">
                  Connection lost. Messages will be sent when reconnected.
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RealTimeChat;
