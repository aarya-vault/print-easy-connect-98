
// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'shop_owner' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Shop Types
export interface Shop {
  id: string;
  owner_user_id: string;
  name: string;
  address: string;
  contact_number: string;
  email: string;
  is_active: boolean;
  allow_offline_access: boolean;
  shop_timings: string;
  slug: string;
  qr_code_url?: string;
  owner?: User;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: string;
  customer_id: string;
  shop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'digital' | 'walkin';
  notes: string;
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent?: boolean;
  files?: OrderFile[];
  customer?: User;
  shop?: Shop;
  created_at: string;
  updated_at: string;
}

// File Types
export interface OrderFile {
  id: string;
  order_id: string;
  file_name: string;
  original_name?: string;
  mime_type: string;
  file_url: string;
  backend_file_path: string;
  restrict_download: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalShops: number;
  activeShops: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
}

// Analytics Types
export interface AnalyticsData {
  stats: AdminStats;
  orderTrends: Array<{
    date: string;
    count: number;
    digital: number;
    walkin: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  shopPerformance: Array<{
    shop_name: string;
    total_orders: number;
    avg_completion_time: number;
  }>;
  realtimeMetrics: {
    activeUsers: number;
    ordersToday: number;
    urgentOrders: number;
    pendingOrders: number;
    avgProcessingTime: number;
    completionRate: number;
  };
}

// Request Types
export interface LoginRequest {
  phone?: string;
  email?: string;
  password?: string;
}

export interface CreateOrderRequest {
  shopId: string;
  orderType: 'digital' | 'walkin';
  notes: string;
  fileIds?: string[];
}

export interface CreateShopRequest {
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  contactNumber: string;
  address: string;
  preferredSlug?: string;
  allowOfflineAccess: boolean;
  shopTimings: string;
}

export interface UpdateShopRequest {
  name?: string;
  address?: string;
  contact_number?: string;
  is_active?: boolean;
  allow_offline_access?: boolean;
  shop_timings?: string;
  slug?: string;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// QR Code Types
export interface QRCodeData {
  qrCodeUrl: string;
  shopUrl: string;
  message: string;
}
