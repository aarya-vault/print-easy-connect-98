
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, MessageSquare, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'customer' | 'shop';
  message: string;
  createdAt: Date;
  isRead: boolean;
}

interface QuickReply {
  id: string;
  messageText: string;
  category: string;
}

interface OrderChatProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderChat: React.FC<OrderChatProps> = ({
  orderId,
  customerName,
  customerPhone,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [quickReplies] = useState<QuickReply[]>([
    { id: '1', messageText: 'Order confirmed! Will be ready in 30 minutes.', category: 'confirmation' },
    { id: '2', messageText: 'Your order is ready for pickup!', category: 'status_update' },
    { id: '3', messageText: 'There might be a slight delay due to high volume.', category: 'status_update' },
    { id: '4', messageText: 'Please check the quality before leaving. Thank you!', category: 'completion' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Demo messages
      setMessages([
        {
          id: '1',
          senderId: customerPhone,
          senderType: 'customer',
          message: 'Hi, when will my order be ready?',
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'shop',
          senderType: 'shop',
          message: 'Hello! Your order is currently being processed. It should be ready in about 20 minutes.',
          createdAt: new Date(Date.now() - 5 * 60 * 1000),
          isRead: true
        }
      ]);
    }
  }, [orderId, customerPhone, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'shop',
      senderType: 'shop',
      message: newMessage,
      createdAt: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleQuickReply = (replyText: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'shop',
      senderType: 'shop',
      message: replyText,
      createdAt: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col border-2 border-neutral-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-golden-500 to-golden-600 text-white p-4 rounded-t-2xl border-b border-golden-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">{customerName}</h3>
                <p className="text-sm opacity-90">Order #{orderId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${customerPhone}`)}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'shop' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  message.senderType === 'shop'
                    ? 'bg-golden-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.senderType === 'shop' ? 'text-golden-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-600 mb-2 font-medium">Quick Replies:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {quickReplies.map((reply) => (
              <Button
                key={reply.id}
                size="sm"
                variant="outline"
                onClick={() => handleQuickReply(reply.messageText)}
                className="text-xs h-auto py-1 px-2 border-golden-200 text-golden-700 hover:bg-golden-50 shadow-sm"
              >
                {reply.messageText.length > 25 
                  ? reply.messageText.substring(0, 25) + '...' 
                  : reply.messageText}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={handleKeyPress}
              className="flex-1 border-2 border-neutral-200 focus:border-golden-400 rounded-lg shadow-sm"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-golden-500 hover:bg-golden-600 text-white shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderChat;
