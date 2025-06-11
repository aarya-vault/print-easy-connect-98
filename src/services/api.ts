
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

const apiService = {
  // Authentication
  phoneLogin: (phone: string) => apiClient.post('/auth/phone-login', { phone }),
  emailLogin: (email: string, password: string) => apiClient.post('/auth/email-login', { email, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (name: string) => apiClient.patch('/auth/profile', { name }),

  // Shop Operations
  getShops: () => apiClient.get('/shops'),
  getShopBySlug: (slug: string) => apiClient.get(`/shops/slug/${slug}`),
  getMyShop: () => apiClient.get('/shops/my-shop'),
  getShopOrders: () => apiClient.get('/orders/shop'),
  getShopOrderHistory: () => apiClient.get('/orders/shop/history'),
  updateOrderStatus: (orderId: string, status: string) => apiClient.patch(`/orders/${orderId}/status`, { status }),
  toggleOrderUrgency: (orderId: string) => apiClient.patch(`/orders/${orderId}/urgency`),
  generateShopQRCode: (shopId: string) => apiClient.post(`/shops/${shopId}/generate-qr`),

  // Customer Operations
  getCustomerOrders: () => apiClient.get('/orders/customer'),
  getCustomerOrderHistory: () => apiClient.get('/orders/customer/history'),
  createOrder: (orderData: any) => apiClient.post('/orders', orderData),
  getVisitedShops: () => apiClient.get('/shops/visited'),
  getOrderById: (orderId: string) => apiClient.get(`/orders/${orderId}`),

  // File Operations
  uploadFiles: (orderId: string, files: FormData) => apiClient.post(`/files/upload/${orderId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getOrderFiles: (orderId: string) => apiClient.get(`/files/order/${orderId}`),
  downloadFile: (fileId: string) => apiClient.get(`/files/download/${fileId}`, { responseType: 'blob' }),

  // Admin Operations
  getAdminStats: () => apiClient.get('/admin/stats'),
  getAdminAnalytics: () => apiClient.get('/admin/analytics/dashboard'),
  getAllUsers: (params?: { search?: string; role?: string; page?: number; limit?: number }) => 
    apiClient.get('/admin/users', { params }),
  getAllShops: () => apiClient.get('/admin/shops'),
  updateShopSettings: (shopId: number, settings: any) => apiClient.patch(`/admin/shops/${shopId}`, settings),
  createShop: (shopData: any) => apiClient.post('/admin/shops', shopData),
  createUser: (userData: any) => apiClient.post('/admin/users', userData),
  updateUser: (userId: number, userData: any) => apiClient.patch(`/admin/users/${userId}`, userData),
  deleteUser: (userId: number) => apiClient.delete(`/admin/users/${userId}`),

  // Order Chat
  getOrderMessages: (orderId: string) => apiClient.get(`/orders/${orderId}/messages`),
  sendOrderMessage: (orderId: string, message: string) => apiClient.post(`/orders/${orderId}/messages`, { message }),
  sendMessage: (orderId: string, message: string) => apiClient.post(`/orders/${orderId}/messages`, { message }),
};

export default apiService;
