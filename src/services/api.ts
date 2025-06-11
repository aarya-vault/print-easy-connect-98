
import axios from 'axios';

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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
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
  // Authentication
  phoneLogin: (phone: string) => apiClient.post('/auth/phone-login', { phone }),
  emailLogin: (email: string, password: string) => apiClient.post('/auth/email-login', { email, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (name: string) => apiClient.patch('/auth/profile', { name }),

  // Shop Operations
  getShops: () => apiClient.get('/shops'),
  getShopBySlug: (slug: string) => apiClient.get(`/shops/${slug}`),
  getShopOrders: () => apiClient.get('/orders/shop'),
  updateOrderStatus: (orderId: string, status: string) => apiClient.patch(`/orders/${orderId}/status`, { status }),
  toggleOrderUrgency: (orderId: string) => apiClient.patch(`/orders/${orderId}/urgency`),
  generateShopQRCode: () => apiClient.get('/shops/qr-code'),

  // Customer Operations
  getCustomerOrders: () => apiClient.get('/orders/customer'),
  createOrder: (orderData: any) => apiClient.post('/orders', orderData),
  getCustomerOrderHistory: () => apiClient.get('/orders/customer/history'),

  // File Operations
  uploadFiles: (files: FormData) => apiClient.post('/files/upload', files, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadFile: (fileId: string) => apiClient.get(`/files/${fileId}/download`, { responseType: 'blob' }),

  // Admin Operations
  getAdminStats: () => apiClient.get('/admin/stats'),
  getAllUsers: (params?: { search?: string }) => apiClient.get('/admin/users', { params }),
  getAllShops: () => apiClient.get('/admin/shops'),
  updateShopSettings: (shopId: number, settings: any) => apiClient.patch(`/admin/shops/${shopId}`, settings),
  createShop: (shopData: any) => apiClient.post('/admin/shops', shopData),

  // Order Chat
  getOrderMessages: (orderId: string) => apiClient.get(`/orders/${orderId}/messages`),
  sendOrderMessage: (orderId: string, message: string) => apiClient.post(`/orders/${orderId}/messages`, { message }),
};

export default apiService;
