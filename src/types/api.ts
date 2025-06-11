
// Core API Type Definitions - Single Source of Truth
// This file must match the exact JSON structure returned by the backend

// User Types
export interface User {
  id: string; // UUID
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
  id: string; // UUID
  owner_id: string; // UUID
  name: string;
  slug: string;
  address: string;
  phone: string; // Renamed from contact_number
  email: string;
  is_active: boolean;
  allows_offline_orders: boolean; // Renamed from allow_offline_access
  shop_timings: string;
  qr_code_url?: string;
  owner?: User;
  created_at: string;
  updated_at: string;
}

// Order Types - Matching backend exactly
export interface Order {
  id: string; // UUID
  customer_id: string; // UUID
  shop_id: string; // UUID
  customer_name: string;
  customer_phone: string;
  order_type: 'digital' | 'walkin'; // NOT 'uploaded-files'
  notes: string; // Unified field for description/instructions
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent: boolean;
  files?: OrderFile[];
  customer?: User;
  shop?: Shop;
  created_at: string;
  updated_at: string;
}

// File Types
export interface OrderFile {
  id: string; // UUID
  order_id: string; // UUID
  filename: string; // Backend field name
  original_name: string; // Backend field name
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics Types - Matching backend exactly
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

// Analytics Types - Matching backend structure
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

// Request Types - Matching backend expectations exactly
export interface CreateOrderRequest {
  shopId: string;
  orderType: 'digital' | 'walkin';
  notes: string;
  customerName?: string;
  customerPhone?: string;
  fileIds?: string[];
}

export interface CreateShopRequest {
  shopName: string; // Maps to name
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  contactNumber: string; // Maps to phone
  address: string;
  preferredSlug?: string; // Maps to slug
  allowOfflineAccess: boolean; // Maps to allows_offline_orders
  shopTimings: string; // Maps to shop_timings
}

export interface UpdateShopRequest {
  name?: string;
  address?: string;
  phone?: string; // Renamed from contact_number
  is_active?: boolean;
  allows_offline_orders?: boolean; // Renamed from allow_offline_access
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

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface ProfileUpdateResponse {
  success: boolean;
  user: User;
}

// Chat API Response Types
export interface ChatMessagesResponse {
  messages: ChatMessage[];
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
}
