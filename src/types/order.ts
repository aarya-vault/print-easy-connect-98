
// Order-specific types that extend the core API types
import { Order as BaseOrder, OrderFile as BaseOrderFile } from './api';

// Legacy support - use API types directly
export type ShopOrder = BaseOrder;
export type OrderFile = BaseOrderFile;

// Legacy interface for backward compatibility - UPDATED to match backend contract
export interface ApiShopOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  order_type: 'digital' | 'walkin'; // Updated to match backend
  description: string; // maps to notes in new schema
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent: boolean;
  created_at: string;
  files?: OrderFile[];
}
