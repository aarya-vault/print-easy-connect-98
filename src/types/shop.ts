
// Shop-specific types that extend the core API types
import { Shop as BaseShop } from './api';

export interface VisitedShop extends BaseShop {
  lastVisited: Date;
  visitCount: number;
  orderHistory: {
    orderId: string;
    date: Date;
    status: string;
    orderType: 'digital' | 'walkin';
  }[];
}

export interface OrderType {
  type: 'digital' | 'walkin';
  count: number;
  urgentCount: number;
}
