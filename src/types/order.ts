
export interface OrderFile {
  id: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  file_path: string;
}

export interface ApiShopOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
  files?: OrderFile[];
}

export interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'uploaded-files' | 'walk-in';
  status: 'received' | 'started' | 'completed';
  isUrgent: boolean;
  description: string;
  createdAt: Date;
  files?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  instructions?: string;
  services: string[];
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  color?: boolean;
}
