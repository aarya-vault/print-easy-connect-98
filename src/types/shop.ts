
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  totalReviews: number;
  services: string[];
  equipment: string[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  images: string[];
  verified: boolean;
  lastVisited?: Date;
  visitCount?: number;
  averageCompletionTime: string;
  uploadSlug: string; // Unique slug for QR code uploads
  isActive: boolean; // For admin control
}

export interface VisitedShop extends Shop {
  lastVisited: Date;
  visitCount: number;
  orderHistory: {
    orderId: string;
    date: Date;
    status: string;
    orderType: 'walk-in' | 'uploaded-files';
  }[];
}

export interface OrderType {
  type: 'walk-in' | 'uploaded-files';
  count: number;
  urgentCount: number;
}
