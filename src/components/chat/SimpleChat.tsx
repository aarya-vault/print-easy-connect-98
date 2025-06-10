
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

interface SimpleChatProps {
  orderId: string;
  recipientId: number;
  recipientName: string;
}

const SimpleChat: React.FC<SimpleChatProps> = ({ orderId, recipientId, recipientName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [orderId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getOrderMessages(orderId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await apiService.sendMessage(orderId, newMessage.trim(), recipientId);
      setNewMessage('');
      fetchMessages(); // Refresh messages
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4" />
          Chat with {recipientName}
          <Badge variant="secondary" className="text-xs">
            Order #{orderId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="max-h-64 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="w-4 h-4 border-2 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-neutral-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-4 text-neutral-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-2 ${
                    isOwn 
                      ? 'bg-golden-500 text-white' 
                      : 'bg-neutral-100 text-neutral-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-golden-100' : 'text-neutral-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Message Form */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-9 text-sm"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSending || !newMessage.trim()}
            className="h-9 px-3"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleChat;
