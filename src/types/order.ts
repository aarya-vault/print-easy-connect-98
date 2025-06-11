
// Order-specific types that extend the core API types
import { Order as BaseOrder, OrderFile as BaseOrderFile } from './api';

// Use API types directly - no more legacy interfaces
export type ShopOrder = BaseOrder;
export type OrderFile = BaseOrderFile;

// Removed ApiShopOrder completely - use Order from api.ts instead
// All order-related components should now use Order from './api'
