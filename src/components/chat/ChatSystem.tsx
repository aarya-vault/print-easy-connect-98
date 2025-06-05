
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'shop' | 'system';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatSystemProps {
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ orderId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Your order has been received and is being processed.',
      sender: 'system',
      timestamp: new Date(Date.now() - 10000),
      status: 'delivered'
    },
    {
      id: '2',
      text: 'Hi! I have a few questions about your print requirements.',
      sender: 'shop',
      timestamp: new Date(Date.now() - 5000),
      status: 'delivered'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      text: newMessage,
      sender: 'customer',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate shop response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. We\'ll get back to you shortly.',
          sender: 'shop',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[600px] border-0 shadow-2xl bg-gradient-white-gray rounded-printeasy overflow-hidden">
        <div className="h-2 bg-gradient-yellow-white"></div>
        <CardHeader className="bg-white border-b border-printeasy-gray-light">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-printeasy-black">Live Chat</CardTitle>
              <p className="text-sm text-printeasy-gray-medium">
                {orderId ? `Order #${orderId}` : 'Customer Support'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-yellow-white rounded-full animate-pulse"></div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="rounded-printeasy"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[480px] p-0 bg-white">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-printeasy shadow-sm ${
                  message.sender === 'customer'
                    ? 'bg-gradient-yellow-white text-printeasy-black'
                    : message.sender === 'shop'
                    ? 'bg-gradient-white-gray text-printeasy-black border border-printeasy-gray-light'
                    : 'bg-gradient-gray-white text-printeasy-gray-dark text-center italic'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'customer' && (
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          message.status === 'sent' ? 'bg-printeasy-gray-medium' :
                          message.status === 'delivered' ? 'bg-gradient-yellow-light' :
                          'bg-gradient-yellow-white'
                        }`}></div>
                        {message.status !== 'sent' && (
                          <div className={`w-2 h-2 rounded-full ${
                            message.status === 'read' ? 'bg-gradient-yellow-white' : 'bg-printeasy-gray-light'
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
                <div className="bg-gradient-white-gray border border-printeasy-gray-light px-4 py-3 rounded-printeasy">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-printeasy-gray-medium rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-printeasy-gray-medium rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-printeasy-gray-medium rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-printeasy-gray-light p-4 bg-gradient-white-gray">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-printeasy border-printeasy-gray-light focus:border-printeasy-yellow"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-yellow-white hover:bg-gradient-yellow-light text-printeasy-black rounded-printeasy px-6"
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSystem;
