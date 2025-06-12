
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
    // For successful responses, return the response object directly
    // This allows access to both response.data and response itself
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Return the error response data or the error itself
    throw error.response?.data || error;
  }
);

const apiService = {
  // Authentication
  phoneLogin: async (phone: string): Promise<AuthResponse> => {
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '');
    const response = await apiClient.post('/auth/phone-login', { phone: cleanPhone });
    return response.data;
  },
    
  emailLogin: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/email-login', { email, password });
    return response.data;
  },
    
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
    
  updateProfile: async (name: string): Promise<ProfileUpdateResponse> => {
    const response = await apiClient.patch('/auth/profile', { name });
    return response.data;
  },

  // Shop Operations
  getShops: async (): Promise<{ shops: Shop[] }> => {
    const response = await apiClient.get('/shops');
    return response.data;
  },
    
  getShopBySlug: async (slug: string): Promise<{ shop: Shop }> => {
    const response = await apiClient.get(`/shops/slug/${slug}`);
    return response.data;
  },
    
  getMyShop: async (): Promise<{ shop: Shop }> => {
    const response = await apiClient.get('/shops/my-shop');
    return response.data;
  },
    
  getShopOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await apiClient.get('/orders/shop');
    return { orders: response.data?.orders || response.data || [] };
  },
    
  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
    
  toggleOrderUrgency: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch(`/orders/${orderId}/urgency`);
    return response.data;
  },
    
  generateShopQRCode: async (shopId: string): Promise<QRCodeData> => {
    const response = await apiClient.post(`/shops/${shopId}/generate-qr`);
    return response.data;
  },

  // Customer Operations
  getCustomerOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await apiClient.get('/orders/customer');
    return { orders: response.data?.orders || response.data || [] };
  },
    
  createOrder: async (orderData: CreateOrderRequest | FormData): Promise<ApiResponse<Order>> => {
    let response;
    if (orderData instanceof FormData) {
      response = await apiClient.post('/orders', orderData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await apiClient.post('/orders', orderData);
    }
    return response.data;
  },
    
  getVisitedShops: async (): Promise<{ shops: Shop[] }> => {
    const response = await apiClient.get('/shops/visited');
    return response.data;
  },
    
  getOrderById: async (orderId: string): Promise<{ order: Order }> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // File Operations
  uploadFiles: async (orderId: string, files: FormData): Promise<{ success: boolean; files: OrderFile[] }> => {
    const response = await apiClient.post(`/files/upload/${orderId}`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
    
  getOrderFiles: async (orderId: string): Promise<{ files: OrderFile[] }> => {
    const response = await apiClient.get(`/files/order/${orderId}`);
    return response.data;
  },
    
  downloadFile: async (fileId: string): Promise<Blob> => {
    const response = await apiClient.get(`/files/download/${fileId}`, { responseType: 'blob' });
    return response.data;
  },

  // Admin Operations
  getAdminStats: async (): Promise<{ stats: AdminStats }> => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
    
  getAdminAnalytics: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/admin/analytics/dashboard');
    return response.data;
  },
    
  getAllUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[] }> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },
    
  getAllShops: async (): Promise<{ shops: Shop[] }> => {
    const response = await apiClient.get('/admin/shops');
    return response.data;
  },
    
  updateShopSettings: async (shopId: string, settings: UpdateShopRequest): Promise<ApiResponse<Shop>> => {
    const response = await apiClient.patch(`/admin/shops/${shopId}`, settings);
    return response.data;
  },
    
  createShop: async (shopData: CreateShopRequest): Promise<ApiResponse<{ shop: Shop; owner: User }>> => {
    const response = await apiClient.post('/admin/shops', shopData);
    return response.data;
  },
    
  createUser: async (userData: any): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },
    
  updateUser: async (userId: string, userData: any): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch(`/admin/users/${userId}`, userData);
    return response.data;
  },
    
  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Order Chat
  getOrderMessages: async (orderId: string): Promise<ChatMessagesResponse> => {
    const response = await apiClient.get(`/orders/${orderId}/messages`);
    return response.data;
  },
    
  sendOrderMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post(`/orders/${orderId}/messages`, { message });
    return response.data;
  },
    
  sendMessage: async (orderId: string, message: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post(`/orders/${orderId}/messages`, { message });
    return response.data;
  },
};

export default apiService;
