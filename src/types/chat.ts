
export interface Message {
  id: string; // Changed from number to string to match UUID
  order_id: string;
  sender_id: string; // Changed from number to string to match UUID
  recipient_id: string; // Changed from number to string to match UUID
  message: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
}
