
import { Order, OrderFile } from '@/types/api';

// Legacy transformation functions - use sparingly, prefer direct API types
export function convertApiOrderToShop(order: Order): Order {
  // No conversion needed anymore - direct API types
  return order;
}

export function convertShopOrderToApi(order: Order): Order {
  // No conversion needed anymore - direct API types
  return order;
}
