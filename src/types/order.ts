
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
