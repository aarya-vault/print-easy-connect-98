
// User Types
export interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  role: 'customer' | 'shop_owner' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Shop Types
export interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  owner_id: number;
  is_active: boolean;
  allows_offline_orders: boolean;
  shop_timings: string;
  slug: string;
  owner: User;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: string;
  customer_id: number;
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  instructions?: string;
  pages?: number;
  copies?: number;
  paper_type?: string;
  binding?: string;
  color?: boolean;
  files?: OrderFile[];
  created_at: string;
  updated_at: string;
}

// File Types
export interface OrderFile {
  id: string;
  order_id: string;
  name: string;
  original_name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
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

// API Request Types
export interface LoginRequest {
  phone?: string;
  email?: string;
  password?: string;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface CreateOrderRequest {
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  instructions?: string;
  pages?: number;
  copies?: number;
  paper_type?: string;
  binding?: string;
  color?: boolean;
  files?: File[];
}

export interface UpdateOrderStatusRequest {
  status: 'received' | 'started' | 'completed';
}

export interface CreateShopRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  owner_id: number;
  shop_timings?: string;
  allows_offline_orders?: boolean;
}

export interface UpdateShopRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  shop_timings?: string;
  is_active?: boolean;
  allows_offline_orders?: boolean;
}

// Query Parameters
export interface GetUsersParams {
  search?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface GetOrdersParams {
  status?: string;
  order_type?: string;
  is_urgent?: boolean;
  page?: number;
  limit?: number;
}

// WebSocket Message Types
export interface SocketMessage {
  type: 'order_update' | 'new_order' | 'status_change' | 'chat_message';
  data: any;
  timestamp: string;
}

export interface OrderUpdateMessage {
  order_id: string;
  status: string;
  updated_by: number;
}

export interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: number;
  sender_name: string;
  message: string;
  created_at: string;
}
