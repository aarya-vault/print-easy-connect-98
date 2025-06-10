
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          success: false,
          error: 'Network error',
          message: `HTTP ${response.status} - ${response.statusText}`
        }));
        
        const error = new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Auth methods
  async phoneLogin(phone: string) {
    return this.makeRequest('/auth/phone-login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async emailLogin(email: string, password: string) {
    return this.makeRequest('/auth/email-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async updateProfile(name: string) {
    return this.makeRequest('/auth/update-profile', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async getCurrentUser() {
    return this.makeRequest('/auth/me');
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Shop methods
  async getShops() {
    return this.makeRequest('/shops');
  }

  async getShop(shopId: string) {
    return this.makeRequest(`/shops/${shopId}`);
  }

  // Order methods
  async createOrder(orderData: FormData) {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: orderData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Network error',
        message: `HTTP ${response.status} - ${response.statusText}`
      }));
      const error = new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      (error as any).response = { data: errorData, status: response.status };
      throw error;
    }

    return await response.json();
  }

  async getCustomerOrders() {
    return this.makeRequest('/orders/customer');
  }

  async getShopOrders() {
    return this.makeRequest('/orders/shop');
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.makeRequest(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async toggleOrderUrgency(orderId: string) {
    return this.makeRequest(`/orders/${orderId}/urgency`, {
      method: 'PATCH',
    });
  }

  // File methods
  async uploadFiles(orderId: string, files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/files/upload/${orderId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Upload failed',
        message: `HTTP ${response.status} - ${response.statusText}`
      }));
      const error = new Error(errorData.message || errorData.error || 'Upload failed');
      (error as any).response = { data: errorData, status: response.status };
      throw error;
    }

    return await response.json();
  }

  async getOrderFiles(orderId: string) {
    return this.makeRequest(`/files/order/${orderId}`);
  }

  async downloadFile(fileId: string) {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/files/download/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  }

  async deleteFile(fileId: string) {
    return this.makeRequest(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Chat methods
  async getOrderMessages(orderId: string) {
    const response = await this.makeRequest(`/chat/order/${orderId}`);
    return response.messages || [];
  }

  async sendMessage(orderId: string, message: string, recipientId: number) {
    return this.makeRequest('/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        message,
        recipientId
      }),
    });
  }

  async getUnreadMessageCount() {
    const response = await this.makeRequest('/chat/unread-count');
    return response.unreadCount || 0;
  }
}

export default new ApiService();
