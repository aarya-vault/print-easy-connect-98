
// Re-export all types from api.ts as the single source of truth
export * from './api';

// Legacy exports for backward compatibility - only export types that don't conflict
export * from './chat';

// Export only specific types from shop.ts to avoid conflicts with api.ts
export type { ShopCardData, ShopSelectOption } from './shop';

// Note: VisitedShop is now only exported from './api', not from './shop'
// Note: order.ts is now minimal and just re-exports from api.ts
