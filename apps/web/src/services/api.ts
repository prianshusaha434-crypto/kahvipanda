const API_BASE = '/api/v1';

export class ApiClient {
  private static getHeaders() {
    const token = localStorage.getItem('kahvi_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  static async getProducts(params?: Record<string, any>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          query.append(k, String(v));
        }
      });
    }
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  static async getProductBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  }

  static async getBestsellers() {
    const res = await fetch(`${API_BASE}/products/bestsellers`);
    if (!res.ok) throw new Error('Failed to fetch bestsellers');
    return res.json();
  }

  static async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }

  static async searchProducts(q: string) {
    const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  }

  static async calculateCart(items: any[], couponCode?: string) {
    const res = await fetch(`${API_BASE}/cart/calculate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ items, couponCode })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Cart calculation failed');
    }
    return res.json();
  }

  static async createOrder(payload: any) {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed');
    }
    return res.json();
  }

  static async verifyPayment(payload: any) {
    const res = await fetch(`${API_BASE}/checkout/verify-payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  }

  static async getOrder(identifier: string) {
    const res = await fetch(`${API_BASE}/orders/${identifier}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  }

  static async submitEnquiry(data: any) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit enquiry');
    }
    return res.json();
  }

  static async subscribeNewsletter(email: string) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Subscription failed');
    }
    return res.json();
  }

  static async chatWithPanda(sessionId: string, message: string, language: string = 'auto') {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sessionId, message, language })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Panda AI chat failed');
    }
    return res.json();
  }

  static async getBlogs() {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  }

  static async getBlogBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    if (!res.ok) throw new Error('Blog not found');
    return res.json();
  }

  // Auth & Admin APIs
  static async login(creds: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  }

  static async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }

  static async getAdminOrders() {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }

  static async updateOrderStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
  }

  static async getAdminEnquiries() {
    const res = await fetch(`${API_BASE}/admin/enquiries`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  }
}
