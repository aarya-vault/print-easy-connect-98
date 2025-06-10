
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
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

const apiService = {
  // Authentication
  phoneLogin: (phone: string): Promise<any> => api.post('/auth/phone-login', { phone }).then(res => res.data),
  emailLogin: (email: string, password: string): Promise<any> => api.post('/auth/email-login', { email, password }).then(res => res.data),
  getCurrentUser: (): Promise<any> => api.get('/auth/me').then(res => res.data),
  updateProfile: (name: string): Promise<any> => api.patch('/auth/update-profile', { name }).then(res => res.data),
  logout: (): Promise<any> => api.post('/auth/logout').then(res => res.data),

  // Orders
  createOrder: (orderData: any): Promise<any> => api.post('/orders', orderData).then(res => res.data),
  getCustomerOrders: (): Promise<any> => api.get('/orders/customer').then(res => res.data),
  getShopOrders: (filters?: any): Promise<any> => api.get('/orders/shop', { params: filters }).then(res => res.data),
  updateOrderStatus: (orderId: string, status: string): Promise<any> => api.patch(`/orders/${orderId}/status`, { status }).then(res => res.data),
  toggleOrderUrgency: (orderId: string): Promise<any> => api.patch(`/orders/${orderId}/urgency`).then(res => res.data),
  getOrderById: (orderId: string): Promise<any> => api.get(`/orders/${orderId}`).then(res => res.data),

  // Shops
  getShops: (params?: any): Promise<any> => api.get('/shops', { params }).then(res => res.data),
  getShopBySlug: (slug: string): Promise<any> => api.get(`/shops/slug/${slug}`).then(res => res.data),
  getVisitedShops: (): Promise<any> => api.get('/shops/visited').then(res => res.data),

  // Files
  uploadFiles: (files: File[], orderId: string): Promise<any> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('orderId', orderId);
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }).then(res => res.data);
  },

  // Chat
  sendMessage: (orderId: string, message: string, recipientId: number): Promise<any> => 
    api.post('/chat/send', { orderId, message, recipientId }).then(res => res.data),
  getOrderMessages: (orderId: string): Promise<any> => api.get(`/chat/${orderId}`).then(res => res.data),

  // Admin
  getAdminStats: (): Promise<any> => api.get('/admin/stats').then(res => res.data),
  getAllUsers: (params?: any): Promise<any> => api.get('/admin/users', { params }).then(res => res.data),
  getAdminUsers: (params?: any): Promise<any> => api.get('/admin/users', { params }).then(res => res.data),
  getAllShops: (): Promise<any> => api.get('/admin/shops').then(res => res.data),
  getAdminShops: (): Promise<any> => api.get('/admin/shops').then(res => res.data),
  createShop: (shopData: any): Promise<any> => api.post('/admin/shops', shopData).then(res => res.data),
  updateUserStatus: (userId: number, isActive: boolean): Promise<any> => 
    api.patch(`/admin/users/${userId}/status`, { isActive }).then(res => res.data),
  deleteUser: (userId: number): Promise<any> => api.delete(`/admin/users/${userId}`).then(res => res.data),
  getAdminAnalytics: (): Promise<any> => api.get('/admin/analytics/realtime').then(res => res.data),
  updateShopSettings: (shopId: number, shopData: any): Promise<any> => api.put(`/admin/shops/${shopId}`, shopData).then(res => res.data),

  // Shop Management
  getShopSettings: (): Promise<any> => api.get('/shops/settings').then(res => res.data),
  generateShopQRCode: (): Promise<any> => api.post('/shops/qr-code').then(res => res.data),
};

export default apiService;
