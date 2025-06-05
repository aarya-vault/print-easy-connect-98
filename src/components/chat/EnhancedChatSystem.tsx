
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, Send, MessageSquare, X, Users } from 'lucide-react';

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
  userRole?: 'customer' | 'shop_owner';
}

// Role-based quick replies
const customerQuickReplies = [
  "When will my order be ready?",
  "Can I modify my order?",
  "What's the total cost?",
  "I need urgent printing",
  "Can you add more copies?",
  "Is my order being processed?",
  "When can I pick up?",
  "Any additional charges?",
];

const shopOwnerQuickReplies = [
  "Order received, processing started",
  "Ready for pickup in 15 minutes",
  "Estimated completion in 30 minutes", 
  "Additional clarification needed",
  "Order completed successfully",
  "Minor delay expected - 10 minutes",
  "Please confirm paper size requirement",
  "Your order is now ready",
  "Processing completed, awaiting pickup",
  "Quality check in progress",
];

const EnhancedChatSystem: React.FC<EnhancedChatSystemProps> = ({ 
  orderId, 
  isOpen, 
  onClose,
  userRole = 'customer',
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
      sender: userRole === 'customer' ? 'shop' : 'customer',
      timestamp: new Date(Date.now() - 5000),
      status: 'delivered'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [shopNotified, setShopNotified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = userRole === 'customer' ? customerQuickReplies : shopOwnerQuickReplies;

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
      sender: userRole,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowQuickReplies(false);

    // Auto-notify system for customers
    if (userRole === 'customer' && !shopNotified) {
      setShopNotified(true);
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

    // Simulate response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 2).toString(),
          text: userRole === 'customer' 
            ? 'Thank you for your message. We\'ll look into this and get back to you.'
            : 'Thanks for the update! I appreciate the communication.',
          sender: userRole === 'customer' ? 'shop' : 'customer',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[700px] border-0 shadow-premium bg-white flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-neutral-200 bg-gradient-golden-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-golden rounded-full flex items-center justify-center">
                  {userRole === 'customer' ? (
                    <MessageSquare className="w-6 h-6 text-white" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                {shopInfo.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-neutral-900">
                  {userRole === 'customer' ? shopInfo.name : 'Customer'}
                </CardTitle>
                <div className="flex items-center space-x-3 mt-1">
                  <Badge variant={shopInfo.isOnline ? "default" : "secondary"} className="text-xs font-medium">
                    {shopInfo.isOnline ? "Online" : "Offline"}
                  </Badge>
                  {orderId && (
                    <span className="text-xs text-neutral-600 font-medium">Order #{orderId}</span>
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
          
          {shopInfo.isOnline && userRole === 'customer' && (
            <div className="flex items-center space-x-2 mt-3 text-xs text-neutral-700">
              <Clock className="w-3 h-3" />
              <span className="font-medium">Usually responds in {shopInfo.avgResponseTime}</span>
            </div>
          )}
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-neutral-50/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === userRole ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl shadow-soft ${
                message.sender === userRole
                  ? 'bg-gradient-golden text-white'
                  : message.sender === 'shop' || message.sender === 'customer'
                  ? 'bg-white border border-neutral-200 text-neutral-900'
                  : 'bg-blue-50 border border-blue-200 text-blue-800 text-center text-sm mx-auto'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs font-medium ${
                    message.sender === userRole ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === userRole && message.status && (
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
              <div className="bg-white border border-neutral-200 px-5 py-4 rounded-2xl shadow-soft">
                <div className="flex space-x-2">
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
        {showQuickReplies && (
          <div className="border-t border-neutral-200 p-4 bg-gradient-golden-soft/30 max-h-48 overflow-y-auto">
            <div className="grid gap-2">
              <h4 className="font-semibold text-neutral-900 mb-2 text-sm">Quick Replies:</h4>
              {quickReplies.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(msg)}
                  className="text-left text-xs justify-start h-auto py-3 border-neutral-300 hover:bg-white hover:border-golden-300 transition-all font-medium"
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-neutral-200 p-4 bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="border-golden-300 text-golden-700 hover:bg-golden-50 text-xs font-medium"
            >
              Quick Replies
            </Button>
            {userRole === 'customer' && (
              <div className="text-xs text-neutral-600 font-medium">
                💡 Use quick replies for faster communication
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-2 border-neutral-200 focus:border-golden-500 focus:ring-golden-100 rounded-xl font-medium"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!newMessage.trim()}
              className="bg-gradient-golden hover:shadow-golden text-white px-6 rounded-xl font-semibold"
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
