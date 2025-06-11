
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Send, MessageCircle } from 'lucide-react';
import apiService from '@/services/api';
import { ChatMessage } from '@/types/api';

interface RealTimeChatProps {
  orderId: string;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({ orderId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const { data: messagesData, refetch } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: ['order-messages', orderId],
    queryFn: () => apiService.getOrderMessages(orderId),
    refetchInterval: 5000,
  });

  const messages = messagesData?.messages || [];

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await apiService.sendMessage(orderId, message);
      setMessage('');
      refetch();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Order Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white p-2 rounded shadow-sm">
                <div className="text-sm font-medium">{msg.sender_name}</div>
                <div className="text-gray-700">{msg.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeChat;
