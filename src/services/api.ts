// Bil Flow API Service
// Replaces Supabase with custom API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface User {
  id: number;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  is_admin?: boolean;
  created_at?: string;
}

interface Admin {
  id: number;
  username: string;
  name: string;
  is_super_admin: boolean;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  category_id: number;
  user_id: number;
  images?: string[];
  location: string;
  condition?: string;
  year?: number;
  brand?: string;
  model?: string;
  specifications?: Record<string, unknown>;
  is_active?: boolean;
  is_featured?: boolean;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  description?: string;
  icon?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface DashboardStats {
  total_listings: number;
  active_listings: number;
  total_users: number;
  total_views: number;
}

interface ViewStat {
  date: string;
  views: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      console.log('🔵 API Request:', url, config);
      const response = await fetch(url, config);
      console.log('🟢 API Response Status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 API Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'خطا در درخواست');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ API Request Error:', {
          message: error.message,
          name: error.name,
          url: url,
          stack: error.stack
        });
      } else {
        console.error('❌ API Request Unknown Error:', error);
      }
      throw error;
    }
  }

  // Authentication methods
  async sendOTP(phone: string): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, otp: string, name?: string): Promise<ApiResponse<{
    user: User;
    token: string;
  }>> {
    const response = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, name }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async adminLogin(username: string, password: string): Promise<ApiResponse<{
    admin: Admin;
    token: string;
  }>> {
    const response = await this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/profile');
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    avatar?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Listings methods
  async getListings(params: {
    type?: 'rent' | 'sale';
    category?: number;
    page?: number;
    limit?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
  } = {}): Promise<ApiResponse<{
    listings: Listing[];
    pagination: Pagination;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/listings?${searchParams.toString()}`);
  }

  async getListing(id: string | number): Promise<ApiResponse<{ listing: Listing }>> {
    return this.request(`/listings/${id}`);
  }

  async createListing(data: {
    title: string;
    description: string;
    price: number;
    type: 'rent' | 'sale';
    category_id: number;
    images?: string[];
    location: string;
    condition?: string;
    year?: number;
    brand?: string;
    model?: string;
    specifications?: Record<string, unknown>;
  }): Promise<ApiResponse<{ listing: Listing }>> {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id: string | number, data: Partial<Listing>): Promise<ApiResponse<{ listing: Listing }>> {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string | number): Promise<ApiResponse> {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    return this.request('/listings/categories/all');
  }

  // Favorites methods
  async getFavorites(): Promise<ApiResponse<{ favorites: Listing[] }>> {
    return this.request('/favorites');
  }

  async addToFavorites(listingId: number): Promise<ApiResponse> {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    });
  }

  async removeFromFavorites(listingId: number): Promise<ApiResponse> {
    return this.request(`/favorites/${listingId}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(listingId: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
    return this.request('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId }),
    });
  }

  // Admin methods
  async getAdminDashboard(): Promise<ApiResponse<{
    stats: DashboardStats;
    recent_listings: Listing[];
    top_categories: Category[];
    daily_stats: ViewStat[];
  }>> {
    return this.request('/admin/dashboard');
  }

  async getAdminListings(params: {
    page?: number;
    limit?: number;
    type?: 'rent' | 'sale';
    status?: 'active' | 'inactive';
    search?: string;
  } = {}): Promise<ApiResponse<{
    listings: Listing[];
    pagination: Pagination;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/admin/listings?${searchParams.toString()}`);
  }

  async getAdminListing(id: string | number): Promise<ApiResponse<{
    listing: Listing;
    view_stats: ViewStat[];
  }>> {
    return this.request(`/admin/listings/${id}`);
  }

  async updateListingStatus(
    id: string | number,
    data: { is_active?: boolean; is_featured?: boolean }
  ): Promise<ApiResponse<{ listing: Listing }>> {
    return this.request(`/admin/listings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminListing(id: string | number): Promise<ApiResponse> {
    return this.request(`/admin/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminUsers(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{
    users: User[];
    pagination: Pagination;
  }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/admin/users?${searchParams.toString()}`);
  }

  // Locations
  async getProvinces(): Promise<ApiResponse<{ provinces: { id: number; name: string }[] }>> {
    return this.request('/locations/provinces');
  }

  async getCities(provinceId: number): Promise<ApiResponse<{ cities: { id: number; name: string; province_id: number }[] }>> {
    return this.request(`/locations/cities/${provinceId}`);
  }

  // Logout
  logout() {
    this.setToken(null);
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
