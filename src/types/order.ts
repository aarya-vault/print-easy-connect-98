
// Order-specific types that extend the core API types
import { Order as BaseOrder, OrderFile as BaseOrderFile } from './api';

// Legacy support - use API types directly
export type ShopOrder = BaseOrder;
export type OrderFile = BaseOrderFile;

// Transformation helpers if needed (deprecated - use API types directly)
export interface ApiShopOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  order_type: 'digital' | 'walkin';
  description: string; // maps to notes in new schema
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent: boolean;
  created_at: string;
  files?: OrderFile[];
}
