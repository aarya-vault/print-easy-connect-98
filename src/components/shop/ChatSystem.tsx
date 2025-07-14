import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Phone, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'shop';
  timestamp: Date;
  orderId?: string;
}

interface ChatConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const ChatSystem: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'chat1',
      customerName: 'John Doe',
      customerPhone: '9876543210',
      orderId: 'ORD001',
      lastMessage: 'Is my order ready for pickup?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      messages: [
        {
          id: 'msg1',
          text: 'Hello, I placed an order for resume printing',
          sender: 'customer',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          orderId: 'ORD001'
        },
        {
          id: 'msg2',
          text: 'Yes, we received your order. It will be ready in 15 minutes.',
          sender: 'shop',
          timestamp: new Date(Date.now() - 25 * 60 * 1000)
        },
        {
          id: 'msg3',
          text: 'Is my order ready for pickup?',
          sender: 'customer',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          orderId: 'ORD001'
        }
      ]
    },
    {
      id: 'chat2',
      customerName: 'Jane Smith',
      customerPhone: '8765432109',
      orderId: 'ORD002',
      lastMessage: 'Thank you for the quick service!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      messages: [
        {
          id: 'msg4',
          text: 'Can you help with binding?',
          sender: 'customer',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          orderId: 'ORD002'
        },
        {
          id: 'msg5',
          text: 'Yes, we provide binding services. Your order is ready.',
          sender: 'shop',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
        },
        {
          id: 'msg6',
          text: 'Thank you for the quick service!',
          sender: 'customer',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          orderId: 'ORD002'
        }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      sender: 'shop',
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat.id 
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date()
          }
        : conv
    ));

    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date()
    } : null);

    setNewMessage('');
  };

  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const openChat = (conversation: ChatConversation) => {
    setSelectedChat(conversation);
    setIsChatOpen(true);
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  return (
    <>
      <Card className="border border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Customer Chat
            </div>
            {totalUnreadMessages > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {totalUnreadMessages}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {conversations.slice(0, 2).map(conversation => (
            <div 
              key={conversation.id}
              className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() => openChat(conversation)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{conversation.customerName}</h4>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-primary/20 text-foreground text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Order #{conversation.orderId}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(conversation.lastMessageTime)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {conversation.lastMessage}
              </p>
            </div>
          ))}
          
          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                View All Chats ({conversations.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[600px]">
              <DialogHeader>
                <DialogTitle>Customer Conversations</DialogTitle>
              </DialogHeader>
              
              <div className="flex h-full gap-4">
                {/* Conversations List */}
                <div className="w-1/3 border-r pr-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {conversations.map(conversation => (
                        <div
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedChat?.id === conversation.id 
                              ? 'bg-primary/10 border border-primary/20' 
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                          onClick={() => setSelectedChat(conversation)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{conversation.customerName}</h4>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-primary/20 text-foreground text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {conversation.customerPhone}
                              </p>
                              <p className="text-xs text-muted-foreground">Order #{conversation.orderId}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 flex flex-col">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="border-b pb-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">{selectedChat.customerName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order #{selectedChat.orderId} • {selectedChat.customerPhone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 mb-4">
                        <div className="space-y-3">
                          {selectedChat.messages.map(message => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'shop' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  message.sender === 'shop'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 opacity-70" />
                                  <span className="text-xs opacity-70">
                                    {formatTimeAgo(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Select a conversation to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
};

export default ChatSystem;