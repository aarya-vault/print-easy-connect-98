
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
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

const apiService = {
  // Authentication
  phoneLogin: (phone: string) => api.post('/auth/phone-login', { phone }),
  emailLogin: (email: string, password: string) => api.post('/auth/email-login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (name: string) => api.patch('/auth/update-profile', { name }),
  logout: () => api.post('/auth/logout'),

  // Orders
  createOrder: (orderData: any) => api.post('/orders', orderData),
  getCustomerOrders: () => api.get('/orders/customer'),
  getShopOrders: (filters?: any) => api.get('/orders/shop', { params: filters }),
  updateOrderStatus: (orderId: string, status: string) => api.patch(`/orders/${orderId}/status`, { status }),
  toggleOrderUrgency: (orderId: string) => api.patch(`/orders/${orderId}/urgency`),
  getOrderById: (orderId: string) => api.get(`/orders/${orderId}`),

  // Shops
  getShops: (params?: any) => api.get('/shops', { params }),
  getShopBySlug: (slug: string) => api.get(`/shops/slug/${slug}`),
  getVisitedShops: () => api.get('/shops/visited'),

  // Files
  uploadFiles: (files: File[], orderId: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('orderId', orderId);
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 1 minute for large files
    });
  },

  // Chat
  sendMessage: (orderId: string, message: string, recipientId: number) => 
    api.post('/chat/send', { orderId, message, recipientId }),
  getOrderMessages: (orderId: string) => api.get(`/chat/${orderId}`),

  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  getAllShops: () => api.get('/admin/shops'),
  createShop: (shopData: any) => api.post('/admin/shops', shopData),
  updateUserStatus: (userId: number, isActive: boolean) => 
    api.patch(`/admin/users/${userId}/status`, { isActive }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
};

export default apiService;
