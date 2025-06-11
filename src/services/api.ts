
import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  Shop, 
  Order, 
  OrderFile, 
  ApiResponse, 
  PaginatedResponse, 
  AdminStats, 
  AnalyticsData, 
  ChatMessage,
  QRCodeData,
  CreateOrderRequest,
  CreateShopRequest,
  UpdateShopRequest
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling and data extraction
apiClient.interceptors.response.use(
  (response) => response.data, // Return only data, not full response
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    throw error.response?.data || error;
  }
);

// Authentication API responses
interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface CurrentUserResponse {
  user: User;
}

interface ProfileUpdateResponse {
  success: boolean;
  user: User;
}

// Chat API responses
interface ChatMessagesResponse {
  messages: ChatMessage[];
}

interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
}

// Shop API responses
interface ShopsResponse {
  shops: Shop[];
}

interface MyShopResponse {
  shop: Shop;
}

interface OrdersResponse {
  orders: Order[];
}

// File API responses
interface FilesResponse {
  files: OrderFile[];
}

interface FileUploadResponse {
  success: boolean;
  files: OrderFile[];
}

// Admin API responses
interface AdminStatsResponse {
  stats: AdminStats;
}

const apiService = {
  // Authentication
  phoneLogin: async (phone: string): Promise<AuthResponse> => 
    apiClient.post('/auth/phone-login', { phone }),
    
  emailLogin: async (email: string, password: string): Promise<AuthResponse> => 
    apiClient.post('/auth/email-login', { email, password }),
    
  getCurrentUser: async (): Promise<CurrentUserResponse> => 
    apiClient.get('/auth/me'),
    
  updateProfile: async (name: string): Promise<ProfileUpdateResponse> => 
    apiClient.patch('/auth/profile', { name }),

  // Shop Operations
  getShops: async (): Promise<ShopsResponse> => 
    apiClient.get('/shops'),
    
  getShopBySlug: async (slug: string): Promise<{ shop: Shop }> => 
    apiClient.get(`/shops/slug/${slug}`),
    
  getMyShop: async (): Promise<MyShopResponse> => 
    apiClient.get('/shops/my-shop'),
    
  getShopOrders: async (): Promise<OrdersResponse> => 
    apiClient.get('/orders/shop'),
    
  getShopOrderHistory: async (): Promise<OrdersResponse> => 
    apiClient.get('/orders/shop/history'),
    
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => 
    apiClient.patch(`/orders/${orderId}/status`, { status }),
    
  toggleOrderUrgency: async (orderId: string): Promise<ApiResponse<Order>> => 
    apiClient.patch(`/orders/${orderId}/urgency`),
    
  generateShopQRCode: async (shopId: string): Promise<QRCodeData> => 
    apiClient.post(`/shops/${shopId}/generate-qr`),

  // Customer Operations
  getCustomerOrders: async (): Promise<OrdersResponse> => 
    apiClient.get('/orders/customer'),
    
  getCustomerOrderHistory: async (): Promise<OrdersResponse> => 
    apiClient.get('/orders/customer/history'),
    
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> => 
    apiClient.post('/orders', orderData),
    
  getVisitedShops: async (): Promise<ShopsResponse> => 
    apiClient.get('/shops/visited'),
    
  getOrderById: async (orderId: string): Promise<{ order: Order }> => 
    apiClient.get(`/orders/${orderId}`),

  // File Operations
  uploadFiles: async (orderId: string, files: FormData): Promise<FileUploadResponse> => 
    apiClient.post(`/files/upload/${orderId}`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  getOrderFiles: async (orderId: string): Promise<FilesResponse> => 
    apiClient.get(`/files/order/${orderId}`),
    
  downloadFile: async (fileId: string): Promise<Blob> => 
    apiClient.get(`/files/download/${fileId}`, { responseType: 'blob' }),

  // Admin Operations
  getAdminStats: async (): Promise<AdminStatsResponse> => 
    apiClient.get('/admin/stats'),
    
  getAdminAnalytics: async (): Promise<AnalyticsData> => 
    apiClient.get('/admin/analytics/dashboard'),
    
  getAllUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[] }> => 
    apiClient.get('/admin/users', { params }),
    
  getAllShops: async (): Promise<{ shops: Shop[] }> => 
    apiClient.get('/admin/shops'),
    
  updateShopSettings: async (shopId: number, settings: UpdateShopRequest): Promise<ApiResponse<Shop>> => 
    apiClient.patch(`/admin/shops/${shopId}`, settings),
    
  createShop: async (shopData: CreateShopRequest): Promise<ApiResponse<{ shop: Shop; owner: User }>> => 
    apiClient.post('/admin/shops', shopData),
    
  createUser: async (userData: any): Promise<ApiResponse<User>> => 
    apiClient.post('/admin/users', userData),
    
  updateUser: async (userId: number, userData: any): Promise<ApiResponse<User>> => 
    apiClient.patch(`/admin/users/${userId}`, userData),
    
  deleteUser: async (userId: number): Promise<ApiResponse<void>> => 
    apiClient.delete(`/admin/users/${userId}`),

  // Order Chat
  getOrderMessages: async (orderId: string): Promise<ChatMessagesResponse> => 
    apiClient.get(`/orders/${orderId}/messages`),
    
  sendOrderMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => 
    apiClient.post(`/orders/${orderId}/messages`, { message }),
    
  sendMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => 
    apiClient.post(`/orders/${orderId}/messages`, { message }),
};

export default apiService;
