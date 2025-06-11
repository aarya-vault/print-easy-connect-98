
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
  UpdateShopRequest,
  AuthResponse,
  CurrentUserResponse,
  ProfileUpdateResponse,
  ChatMessagesResponse,
  SendMessageResponse
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
  (response: AxiosResponse) => {
    // Always return the data payload, not the full response
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    throw error.response?.data || error;
  }
);

const apiService = {
  // Authentication - Returns typed data directly
  phoneLogin: async (phone: string): Promise<AuthResponse> => {
    return apiClient.post('/auth/phone-login', { phone });
  },
    
  emailLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return apiClient.post('/auth/email-login', { email, password });
  },
    
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    return apiClient.get('/auth/me');
  },
    
  updateProfile: async (name: string): Promise<ProfileUpdateResponse> => {
    return apiClient.patch('/auth/profile', { name });
  },

  // Shop Operations - Returns typed data directly
  getShops: async (): Promise<{ shops: Shop[] }> => {
    return apiClient.get('/shops');
  },
    
  getShopBySlug: async (slug: string): Promise<{ shop: Shop }> => {
    return apiClient.get(`/shops/slug/${slug}`);
  },
    
  getMyShop: async (): Promise<{ shop: Shop }> => {
    return apiClient.get('/shops/my-shop');
  },
    
  getShopOrders: async (): Promise<{ orders: Order[] }> => {
    return apiClient.get('/orders/shop');
  },
    
  getShopOrderHistory: async (): Promise<{ orders: Order[] }> => {
    return apiClient.get('/orders/shop/history');
  },
    
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch(`/orders/${orderId}/status`, { status });
  },
    
  toggleOrderUrgency: async (orderId: string): Promise<ApiResponse<Order>> => {
    return apiClient.patch(`/orders/${orderId}/urgency`);
  },
    
  generateShopQRCode: async (shopId: string): Promise<QRCodeData> => {
    return apiClient.post(`/shops/${shopId}/generate-qr`);
  },

  // Customer Operations - Returns typed data directly
  getCustomerOrders: async (): Promise<{ orders: Order[] }> => {
    return apiClient.get('/orders/customer');
  },
    
  getCustomerOrderHistory: async (): Promise<{ orders: Order[] }> => {
    return apiClient.get('/orders/customer/history');
  },
    
  createOrder: async (orderData: CreateOrderRequest | FormData): Promise<ApiResponse<Order>> => {
    if (orderData instanceof FormData) {
      return apiClient.post('/orders', orderData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiClient.post('/orders', orderData);
  },
    
  getVisitedShops: async (): Promise<{ shops: Shop[] }> => {
    return apiClient.get('/shops/visited');
  },
    
  getOrderById: async (orderId: string): Promise<{ order: Order }> => {
    return apiClient.get(`/orders/${orderId}`);
  },

  // File Operations - Returns typed data directly
  uploadFiles: async (orderId: string, files: FormData): Promise<{ success: boolean; files: OrderFile[] }> => {
    return apiClient.post(`/files/upload/${orderId}`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
    
  getOrderFiles: async (orderId: string): Promise<{ files: OrderFile[] }> => {
    return apiClient.get(`/files/order/${orderId}`);
  },
    
  downloadFile: async (fileId: string): Promise<Blob> => {
    return apiClient.get(`/files/download/${fileId}`, { responseType: 'blob' });
  },

  // Admin Operations - Returns typed data directly
  getAdminStats: async (): Promise<{ stats: AdminStats }> => {
    return apiClient.get('/admin/stats');
  },
    
  getAdminAnalytics: async (): Promise<AnalyticsData> => {
    return apiClient.get('/admin/analytics/dashboard');
  },
    
  getAllUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[] }> => {
    return apiClient.get('/admin/users', { params });
  },
    
  getAllShops: async (): Promise<{ shops: Shop[] }> => {
    return apiClient.get('/admin/shops');
  },
    
  updateShopSettings: async (shopId: string, settings: UpdateShopRequest): Promise<ApiResponse<Shop>> => {
    return apiClient.patch(`/admin/shops/${shopId}`, settings);
  },
    
  createShop: async (shopData: CreateShopRequest): Promise<ApiResponse<{ shop: Shop; owner: User }>> => {
    return apiClient.post('/admin/shops', shopData);
  },
    
  createUser: async (userData: any): Promise<ApiResponse<User>> => {
    return apiClient.post('/admin/users', userData);
  },
    
  updateUser: async (userId: string, userData: any): Promise<ApiResponse<User>> => {
    return apiClient.patch(`/admin/users/${userId}`, userData);
  },
    
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  // Order Chat - Returns typed data directly
  getOrderMessages: async (orderId: string): Promise<ChatMessagesResponse> => {
    return apiClient.get(`/orders/${orderId}/messages`);
  },
    
  sendOrderMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => {
    return apiClient.post(`/orders/${orderId}/messages`, { message });
  },
    
  sendMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => {
    return apiClient.post(`/orders/${orderId}/messages`, { message });
  },
};

export default apiService;
