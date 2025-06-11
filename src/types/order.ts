
// Order-specific types that extend the core API types
import { Order as BaseOrder, OrderFile as BaseOrderFile } from './api';

// Legacy support - use API types directly
export type ShopOrder = BaseOrder;
export type OrderFile = BaseOrderFile;

// Transformation helpers if needed
export interface ApiShopOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  order_type: 'digital' | 'walkin';
  description: string;
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent: boolean;
  created_at: string;
  files?: OrderFile[];
}
