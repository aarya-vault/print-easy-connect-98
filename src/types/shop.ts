
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
  pricing: {
    blackWhite: number;
    color: number;
    binding: number;
    scanning: number;
  };
}

export interface VisitedShop extends Shop {
  lastVisited: Date;
  visitCount: number;
  orderHistory: {
    orderId: string;
    date: Date;
    amount: number;
    status: string;
  }[];
}
