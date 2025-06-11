
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/types/api';

interface Message {
  id: string;
  text: string;
  sender: 'shop' | 'customer';
  timestamp: Date;
}

interface OrderChatModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderChatModal: React.FC<OrderChatModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I wanted to check on the status of my order.',
      sender: 'customer',
      timestamp: new Date(Date.now() - 30 * 60000)
    },
    {
      id: '2',
      text: 'Hi! Your order is currently being processed. We will have it ready within 2 hours.',
      sender: 'shop',
      timestamp: new Date(Date.now() - 25 * 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'shop',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleCall = () => {
    window.open(`tel:${order.customer_phone}`);
    toast.success(`Calling ${order.customer_name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-lg font-semibold truncate">{order.customer_name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">Order #{order.id.slice(0, 8)}</Badge>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleCall}
              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-96 sm:h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'shop' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                    message.sender === 'shop'
                      ? 'bg-golden-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'shop' ? 'text-golden-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-sm"
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                className="bg-golden-500 hover:bg-golden-600 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderChatModal;
export type { OrderChatModalProps };
