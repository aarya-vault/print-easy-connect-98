
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response.data; // Return data directly
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

const apiService = {
  // Authentication
  phoneLogin: (phone: string): Promise<any> => api.post('/auth/phone-login', { phone }),
  emailLogin: (email: string, password: string): Promise<any> => api.post('/auth/email-login', { email, password }),
  getCurrentUser: (): Promise<any> => api.get('/auth/me'),
  updateProfile: (name: string): Promise<any> => api.patch('/auth/update-profile', { name }),
  logout: (): Promise<any> => api.post('/auth/logout'),

  // Orders
  createOrder: (orderData: any): Promise<any> => api.post('/orders', orderData),
  getCustomerOrders: (): Promise<any> => api.get('/orders/customer'),
  getShopOrders: (filters?: any): Promise<any> => api.get('/orders/shop', { params: filters }),
  updateOrderStatus: (orderId: string, status: string): Promise<any> => api.patch(`/orders/${orderId}/status`, { status }),
  toggleOrderUrgency: (orderId: string): Promise<any> => api.patch(`/orders/${orderId}/urgency`),
  getOrderById: (orderId: string): Promise<any> => api.get(`/orders/${orderId}`),

  // Shops
  getShops: (params?: any): Promise<any> => api.get('/shops', { params }),
  getShopBySlug: (slug: string): Promise<any> => api.get(`/shops/slug/${slug}`),
  getVisitedShops: (): Promise<any> => api.get('/shops/visited'),

  // Files
  uploadFiles: (files: File[], orderId: string): Promise<any> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('orderId', orderId);
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },

  // Chat
  sendMessage: (orderId: string, message: string, recipientId: number): Promise<any> => 
    api.post('/chat/send', { orderId, message, recipientId }),
  getOrderMessages: (orderId: string): Promise<any> => api.get(`/chat/${orderId}`),

  // Admin
  getAdminStats: (): Promise<any> => api.get('/admin/stats'),
  getAllUsers: (params?: any): Promise<any> => api.get('/admin/users', { params }),
  getAdminUsers: (params?: any): Promise<any> => api.get('/admin/users', { params }),
  getAllShops: (): Promise<any> => api.get('/admin/shops'),
  getAdminShops: (): Promise<any> => api.get('/admin/shops'),
  createShop: (shopData: any): Promise<any> => api.post('/admin/shops', shopData),
  updateUserStatus: (userId: number, isActive: boolean): Promise<any> => 
    api.patch(`/admin/users/${userId}/status`, { isActive }),
  deleteUser: (userId: number): Promise<any> => api.delete(`/admin/users/${userId}`),

  // Real-time analytics endpoints
  getOrderAnalytics: (): Promise<any> => api.get('/admin/analytics/orders'),
  getShopAnalytics: (): Promise<any> => api.get('/admin/analytics/shops'),
  getUserAnalytics: (): Promise<any> => api.get('/admin/analytics/users'),
  getRealtimeMetrics: (): Promise<any> => api.get('/admin/analytics/realtime'),
  
  // Admin Analytics - consolidated method
  getAdminAnalytics: (): Promise<any> => api.get('/admin/analytics/realtime'),

  // Admin Shop Management - consolidated method
  updateShopSettings: (shopId: number, shopData: any): Promise<any> => api.put(`/admin/shops/${shopId}`, shopData),

  // Shop Management - consolidated methods
  getShopSettings: (): Promise<any> => api.get('/shops/settings'),
  generateShopQRCode: (): Promise<any> => api.post('/shops/qr-code'),
};

export default apiService;
