
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, Send, MessageSquare, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'shop' | 'system';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface EnhancedChatSystemProps {
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
  shopInfo?: {
    name: string;
    phone: string;
    isOnline: boolean;
    avgResponseTime: string;
  };
}

const predefinedMessages = [
  "Your order is being processed and will be ready soon.",
  "We have received your order and started printing.",
  "Your prints are ready for pickup!",
  "Could you please clarify the paper size requirement?",
  "Do you need binding for these documents?",
  "Your order is completed. Thank you for choosing us!",
  "We're experiencing high volume. Estimated delay: 30 minutes.",
  "All documents printed successfully. Total: ₹",
];

const EnhancedChatSystem: React.FC<EnhancedChatSystemProps> = ({ 
  orderId, 
  isOpen, 
  onClose,
  shopInfo = {
    name: "Quick Print Shop",
    phone: "+91 98765 43210",
    isOnline: true,
    avgResponseTime: "2-3 minutes"
  }
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Your order has been received and assigned to our shop.',
      sender: 'system',
      timestamp: new Date(Date.now() - 10000),
      status: 'delivered'
    },
    {
      id: '2',
      text: 'Hi! We have received your order. We\'ll start processing it shortly.',
      sender: 'shop',
      timestamp: new Date(Date.now() - 5000),
      status: 'delivered'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  const [shopNotified, setShopNotified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (messageText?: string) => {
    const text = messageText || newMessage;
    if (!text.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'customer',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowPredefined(false);

    // Notify shop owner
    if (!shopNotified) {
      setShopNotified(true);
      // Add system message about notification
      setTimeout(() => {
        const notificationMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Shop owner has been notified of your message. Average response time: ${shopInfo.avgResponseTime}. For urgent matters, you can call directly.`,
          sender: 'system',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, notificationMessage]);
      }, 1000);
    }

    // Simulate shop response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Thank you for your message. We\'ll look into this and get back to you.',
          sender: 'shop',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 500);
  };

  const sendPredefinedMessage = (message: string) => {
    sendMessage(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[700px] border border-neutral-200 shadow-strong bg-white flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-neutral-200 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                </div>
                {shopInfo.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-neutral-900">
                  {shopInfo.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={shopInfo.isOnline ? "default" : "secondary"} className="text-xs">
                    {shopInfo.isOnline ? "Online" : "Offline"}
                  </Badge>
                  {orderId && (
                    <span className="text-xs text-neutral-500">Order #{orderId}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${shopInfo.phone}`)}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {shopInfo.isOnline && (
            <div className="flex items-center space-x-2 mt-3 text-xs text-neutral-600">
              <Clock className="w-3 h-3" />
              <span>Usually responds in {shopInfo.avgResponseTime}</span>
            </div>
          )}
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'customer'
                  ? 'bg-yellow-500 text-white'
                  : message.sender === 'shop'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'bg-blue-50 text-blue-800 text-center text-sm mx-auto'
              }`}>
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === 'customer' && message.status && (
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        message.status === 'sent' ? 'bg-white/60' :
                        message.status === 'delivered' ? 'bg-white/80' :
                        'bg-white'
                      }`}></div>
                      {message.status !== 'sent' && (
                        <div className={`w-2 h-2 rounded-full ${
                          message.status === 'read' ? 'bg-white' : 'bg-white/60'
                        }`}></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Responses */}
        {showPredefined && (
          <div className="border-t border-neutral-200 p-4 bg-neutral-50 max-h-40 overflow-y-auto">
            <div className="grid gap-2">
              {predefinedMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendPredefinedMessage(msg)}
                  className="text-left text-xs justify-start h-auto py-2 border-neutral-300 hover:bg-white"
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-neutral-200 p-4 bg-white">
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPredefined(!showPredefined)}
              className="border-neutral-300 hover:bg-neutral-50 text-xs"
            >
              Quick Replies
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!newMessage.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedChatSystem;
