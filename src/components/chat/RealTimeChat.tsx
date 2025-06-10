
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RealTimeChatProps {
  orderId: string;
  recipientId: string;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({ orderId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [orderId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await apiService.getOrderMessages(orderId);
      // Handle both direct array and nested object responses
      const messagesData = response?.messages || response || [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await apiService.sendMessage(orderId, newMessage, Number(recipientId));
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center space-x-2">
              {msg.sender_id !== user?.id && (
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${msg.sender_id}.png`} alt={`Avatar of ${msg.sender_id}`} />
                  <AvatarFallback>{msg.sender_id}</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-2 max-w-xs break-words ${msg.sender_id === user?.id ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChat;
