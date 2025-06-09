
export interface Message {
  id: number;
  order_id: string;
  sender_id: number;
  recipient_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
}
