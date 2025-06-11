
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import apiService from '@/services/api';
import { ChatMessage } from '@/types/api';

interface SimpleChatProps {
  orderId: string;
}

const SimpleChat: React.FC<SimpleChatProps> = ({ orderId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const { data: messagesData, refetch } = useQuery({
    queryKey: ['order-messages', orderId],
    queryFn: () => apiService.getOrderMessages(orderId),
  });

  const messages: ChatMessage[] = messagesData?.messages || [];

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
      <CardContent className="p-4 space-y-4">
        <div className="max-h-40 overflow-y-auto space-y-1">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm p-2 bg-gray-100 rounded">
              <strong>{msg.sender_name}:</strong> {msg.message}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            size="sm"
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

export default SimpleChat;
