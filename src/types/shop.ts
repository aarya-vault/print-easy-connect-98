
// Shop-specific UI types that don't conflict with API types
export interface ShopCardData {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  averageCompletionTime: string;
  services: string[];
  operatingHours: {
    [key: string]: {
      isOpen: boolean;
      open: string;
      close: string;
    };
  };
  lastVisited?: Date;
  visitCount?: number;
  orderHistory?: Array<{
    orderId: string;
    date: Date;
    status: string;
    orderType: 'digital' | 'walkin';
  }>;
}

export interface ShopSelectOption {
  value: string;
  label: string;
  shop: ShopCardData;
}

// Note: VisitedShop is now only exported from api.ts to avoid conflicts
