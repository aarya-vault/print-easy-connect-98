
// Shop-specific types that extend the core API types
import { Shop as BaseShop } from './api';

// Re-export the base shop type as VisitedShop for backward compatibility
export type VisitedShop = BaseShop;

export interface OrderType {
  type: 'digital' | 'walkin';
  count: number;
  urgentCount: number;
}
