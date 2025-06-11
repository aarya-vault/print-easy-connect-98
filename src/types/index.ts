
// Re-export all types from api.ts as the single source of truth
export * from './api';

// Legacy exports for backward compatibility - only export types that don't conflict
export * from './chat';
export * from './shop';

// Remove the duplicate VisitedShop export since it's already exported from './api'
// Note: order.ts is now minimal and just re-exports from api.ts
