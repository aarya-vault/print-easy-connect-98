
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('printeasy_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('printeasy_token');
          localStorage.removeItem('printeasy_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async phoneLogin(phone: string) {
    const response = await this.api.post('/api/auth/phone-login', { phone });
    return response.data;
  }

  async emailLogin(email: string, password: string) {
    const response = await this.api.post('/api/auth/email-login', { email, password });
    return response.data;
  }

  async updateProfile(name: string) {
    const response = await this.api.patch('/api/auth/update-profile', { name });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/api/auth/profile');
    return response.data;
  }

  // Order methods
  async getShopOrders() {
    const response = await this.api.get('/api/orders/shop');
    return response.data;
  }

  async getCustomerOrders() {
    const response = await this.api.get('/api/orders/customer');
    return response.data;
  }

  async createOrder(orderData: {
    shopId: number;
    orderType: 'walk-in' | 'uploaded-files';
    description: string;
    instructions?: string;
    services?: string[];
    pages?: number;
    copies?: number;
    paperType?: string;
    binding?: string;
    color?: boolean;
  }) {
    const response = await this.api.post('/api/orders', orderData);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const response = await this.api.patch(`/api/orders/${orderId}/status`, { status });
    return response.data;
  }

  async toggleOrderUrgency(orderId: string) {
    const response = await this.api.patch(`/api/orders/${orderId}/urgency`);
    return response.data;
  }

  // File methods
  async uploadFiles(orderId: string, files: File[], onProgress?: (progress: number) => void) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await this.api.post(`/api/files/upload/${orderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async getOrderFiles(orderId: string) {
    const response = await this.api.get(`/api/files/order/${orderId}`);
    return response.data;
  }

  async downloadFile(fileId: string) {
    const response = await this.api.get(`/api/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response;
  }

  async deleteFile(fileId: string) {
    const response = await this.api.delete(`/api/files/${fileId}`);
    return response.data;
  }

  // Chat methods
  async getOrderMessages(orderId: string) {
    const response = await this.api.get(`/api/chat/order/${orderId}`);
    return response.data;
  }

  async sendMessage(orderId: string, message: string, recipientId: number) {
    const response = await this.api.post('/api/chat/send', {
      orderId,
      message,
      recipientId
    });
    return response.data;
  }

  async getUnreadMessageCount() {
    const response = await this.api.get('/api/chat/unread-count');
    return response.data;
  }

  // Shop methods
  async getShops() {
    const response = await this.api.get('/api/shops');
    return response.data;
  }

  async getShop(identifier: string) {
    const response = await this.api.get(`/api/shops/${identifier}`);
    return response.data;
  }

  async updateShop(shopId: number, shopData: {
    name?: string;
    address?: string;
    phone?: string;
    opening_time?: string;
    closing_time?: string;
  }) {
    const response = await this.api.put(`/api/shops/${shopId}`, shopData);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
