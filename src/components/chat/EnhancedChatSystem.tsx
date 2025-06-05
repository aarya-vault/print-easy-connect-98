
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  Phone, 
  Clock,
  CheckCircle,
  User,
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'shop' | 'system';
  timestamp: Date;
  orderId?: string;
}

interface EnhancedChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  userRole?: 'customer' | 'shop_owner';
}

const EnhancedChatSystem: React.FC<EnhancedChatSystemProps> = ({
  isOpen,
  onClose,
  orderId,
  userRole = 'customer'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: userRole === 'customer' ? 'shop' : 'customer',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: userRole === 'customer' ? 'customer' : 'shop',
      timestamp: new Date(),
      orderId
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: userRole === 'customer' ? 
          'Thank you for your message. We\'ll get back to you shortly!' :
          'Thanks for the update. Let me check on that for you.',
        sender: userRole === 'customer' ? 'shop' : 'customer',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick replies based on user role (removed pricing-related ones)
  const customerQuickReplies = [
    'Is my order ready?',
    'Can I add more copies?',
    'What time can I pick up?',
    'Can you call me when ready?',
    'Do you have premium paper?',
    'Is color printing available?'
  ];

  const shopQuickReplies = [
    'Your order is ready for pickup',
    'We need 30 more minutes',
    'Order is in progress',
    'Please confirm pickup time',
    'We have your order ready',
    'Call us if you need changes'
  ];

  const quickReplies = userRole === 'customer' ? customerQuickReplies : shopQuickReplies;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'customer': return <User className="w-4 h-4" />;
      case 'shop': return <MessageCircle className="w-4 h-4" />;
      case 'system': return <Bot className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'customer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shop': return 'bg-golden-100 text-golden-800 border-golden-200';
      case 'system': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
      <Card className="border-0 shadow-premium bg-white/95 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-golden rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-neutral-900">
                  {userRole === 'customer' ? 'Chat with Shop' : 'Customer Chat'}
                </CardTitle>
                {orderId && (
                  <p className="text-sm text-neutral-600">Order #{orderId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    (userRole === 'customer' && message.sender === 'customer') ||
                    (userRole === 'shop_owner' && message.sender === 'shop')
                      ? 'justify-end' 
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      (userRole === 'customer' && message.sender === 'customer') ||
                      (userRole === 'shop_owner' && message.sender === 'shop')
                        ? 'bg-gradient-golden text-white' 
                        : 'bg-neutral-100 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-xs ${getSenderColor(message.sender)}`}>
                        <div className="flex items-center gap-1">
                          {getSenderIcon(message.sender)}
                          <span className="capitalize">{message.sender}</span>
                        </div>
                      </Badge>
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage(reply)}
                    className="text-xs border-neutral-300 hover:bg-golden-50 hover:border-golden-300"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
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
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-golden hover:shadow-golden text-white px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EnhancedChatSystem;
