
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
    const response = await this.makeRequest('/auth/phone-login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    
    // Normalize user data from backend
    if (response.user) {
      response.user = this.normalizeUserData(response.user);
    }
    
    return response;
  }

  async emailLogin(email: string, password: string) {
    const response = await this.makeRequest('/auth/email-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Normalize user data from backend
    if (response.user) {
      response.user = this.normalizeUserData(response.user);
    }
    
    return response;
  }

  async updateProfile(name: string) {
    return this.makeRequest('/auth/update-profile', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
  }

  async getCurrentUser() {
    const response = await this.makeRequest('/auth/me');
    
    // Normalize user data from backend
    if (response.user) {
      response.user = this.normalizeUserData(response.user);
    }
    
    return response;
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Shop methods
  async getShops() {
    const response = await this.makeRequest('/shops');
    
    // Normalize shops data
    if (response.shops) {
      response.shops = response.shops.map((shop: any) => this.normalizeShopData(shop));
    }
    
    return response;
  }

  async getShop(shopId: string) {
    const response = await this.makeRequest(`/shops/${shopId}`);
    
    // Normalize shop data
    if (response.shop) {
      response.shop = this.normalizeShopData(response.shop);
    }
    
    return response;
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

    const data = await response.json();
    
    // Normalize order data
    if (data.order) {
      data.order = this.normalizeOrderData(data.order);
    }
    
    return data;
  }

  async getCustomerOrders() {
    const response = await this.makeRequest('/orders/customer');
    
    // Normalize orders data
    if (response.orders) {
      response.orders = response.orders.map((order: any) => this.normalizeOrderData(order));
    }
    
    return response;
  }

  async getShopOrders() {
    const response = await this.makeRequest('/orders/shop');
    
    // Normalize orders data
    if (response.orders) {
      response.orders = response.orders.map((order: any) => this.normalizeOrderData(order));
    }
    
    return response;
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

  // Data normalization helpers
  private normalizeUserData(user: any) {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      shop_id: user.shop_id,
      shop_name: user.shop_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  private normalizeShopData(shop: any) {
    return {
      id: shop.id,
      name: shop.name,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
      description: shop.description,
      ownerId: shop.owner_id,
      rating: shop.rating,
      isActive: shop.is_active,
      allowsOfflineOrders: shop.allows_offline_orders,
      createdAt: shop.created_at,
      updatedAt: shop.updated_at
    };
  }

  private normalizeOrderData(order: any) {
    return {
      id: order.id,
      customerId: order.customer_id,
      shopId: order.shop_id,
      orderType: order.order_type,
      status: order.status,
      description: order.description,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      totalPages: order.total_pages,
      urgent: order.urgent,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      shop: order.shop ? this.normalizeShopData(order.shop) : null,
      customer: order.customer ? this.normalizeUserData(order.customer) : null,
      files: order.files || []
    };
  }
}

export default new ApiService();
