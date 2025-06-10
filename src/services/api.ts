
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
      console.log(`🌐 API Request: ${endpoint}`, { method: config.method || 'GET' });
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          success: false,
          error: 'Network error',
          message: `HTTP ${response.status} - ${response.statusText}`
        }));
        
        console.error(`❌ API Error: ${endpoint}`, errorData);
        
        const error = new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data.success);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : error,
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
    
    if (response.user) {
      response.user = this.normalizeUserData(response.user);
    }
    
    return response;
  }

  // Shop methods
  async getShops() {
    const response = await this.makeRequest('/shops');
    
    if (response.shops) {
      response.shops = response.shops.map((shop: any) => this.normalizeShopData(shop));
    }
    
    return response;
  }

  // NEW: Get visited shops for reorder logic
  async getVisitedShops() {
    const response = await this.makeRequest('/shops/visited');
    
    if (response.shops) {
      response.shops = response.shops.map((shop: any) => this.normalizeShopData(shop));
    }
    
    return response;
  }

  async getShop(shopId: string) {
    const response = await this.makeRequest(`/shops/${shopId}`);
    
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
    
    if (data.order) {
      data.order = this.normalizeOrderData(data.order);
    }
    
    return data;
  }

  async getCustomerOrders() {
    const response = await this.makeRequest('/orders/customer');
    
    if (response.orders) {
      response.orders = response.orders.map((order: any) => this.normalizeOrderData(order));
    }
    
    return response;
  }

  async getShopOrders() {
    const response = await this.makeRequest('/orders/shop');
    
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

  // Chat methods - FIXED: Adding missing methods
  async getOrderMessages(orderId: string) {
    const response = await this.makeRequest(`/chat/order/${orderId}`);
    
    if (response.messages) {
      response.messages = response.messages.map((message: any) => this.normalizeMessageData(message));
    }
    
    return response.messages || [];
  }

  async sendMessage(orderId: string, message: string, recipientId: number) {
    const response = await this.makeRequest('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ orderId, message, recipientId }),
    });
    
    if (response.message) {
      response.message = this.normalizeMessageData(response.message);
    }
    
    return response;
  }

  async getUnreadMessageCount() {
    const response = await this.makeRequest('/chat/unread-count');
    return response.unreadCount || 0;
  }

  async markMessageAsRead(messageId: string) {
    return this.makeRequest(`/chat/${messageId}/read`, {
      method: 'PATCH',
    });
  }

  // Admin methods
  async getAdminStats() {
    return this.makeRequest('/admin/stats');
  }

  async getAdminUsers(page = 1, limit = 50, search = '', role = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      role
    });
    
    return this.makeRequest(`/admin/users?${params}`);
  }

  async getAdminShops() {
    return this.makeRequest('/admin/shops');
  }

  async createShop(shopData: any) {
    return this.makeRequest('/admin/shops', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.makeRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async deleteUser(userId: string) {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
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

  private normalizeMessageData(message: any) {
    return {
      id: message.id,
      order_id: message.order_id,
      sender_id: message.sender_id,
      message: message.message,
      created_at: message.created_at,
      is_read: message.is_read,
      sender_name: message.sender?.name || 'Unknown'
    };
  }
}

export default new ApiService();
