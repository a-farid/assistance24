/**
 * Enhanced Authentication Service
 * Handles all authentication operations with improved security and performance
 */

import { useAuthStore, shouldRefreshToken } from './authStore';
import { toast } from 'react-hot-toast';

interface AuthResponse {
  success: boolean;
  data: {
    user: any;
    access_token: string;
    session_id: string;
  };
  message?: string;
}

interface RefreshResponse {
  success: boolean;
  data: {
    user: any;
    access_token: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<RefreshResponse> | null = null;
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  }

  /**
   * Login user with credentials
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { setUser, setAuthenticated, setSessionId, updateLastTokenRefresh } = useAuthStore.getState();
        
        setUser(data.data.user);
        setAuthenticated(true);
        setSessionId(data.data.session_id);
        updateLastTokenRefresh();
        
        toast.success(data.message || 'Login successful');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  /**
   * Logout user and clear all auth state
   */
  async logout(): Promise<void> {
    try {
      await this.fetchWithAuth('/auth/logout', {
        method: 'POST',
      });

      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      
      // Clear any pending refresh promises
      this.refreshPromise = null;
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear auth state even if logout request fails
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
    }
  }

  /**
   * Refresh access token with singleton pattern to prevent multiple calls
   */
  async refreshToken(): Promise<RefreshResponse> {
    // If a refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      this.refreshPromise = null;
      return result;
    } catch (error) {
      this.refreshPromise = null;
      throw error;
    }
  }

  private async _performTokenRefresh(): Promise<RefreshResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/refresh', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        const { setUser, updateLastTokenRefresh } = useAuthStore.getState();
        
        setUser(data.data.user);
        updateLastTokenRefresh();
        
        return data;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Clear auth state on refresh failure
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      
      throw error;
    }
  }

  /**
   * Check authentication status and refresh token if needed
   */
  async checkAuth(): Promise<boolean> {
    const { isAuthenticated, setLoading } = useAuthStore.getState();
    
    setLoading(true);

    try {
      // If user is not authenticated, try to refresh token
      if (!isAuthenticated || shouldRefreshToken()) {
        await this.refreshToken();
        return true;
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Register new user
   */
  async register(userData: any): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/registre', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const { setUser, setAuthenticated, setSessionId, updateLastTokenRefresh } = useAuthStore.getState();
        
        setUser(data.data.user);
        setAuthenticated(true);
        setSessionId(data.data.session_id);
        updateLastTokenRefresh();
        
        toast.success(data.message || 'Registration successful');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  /**
   * Check if current user has required role
   */
  hasRole(requiredRole: string | string[]): boolean {
    const { user } = useAuthStore.getState();
    if (!user) return false;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  }

  /**
   * Check if user can access specific resource
   */
  canAccess(path: string): boolean {
    const { user, isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) return false;

    // Define role-based access rules
    const accessRules = {
      '/admin': ['admin'],
      '/worker': ['worker', 'admin'],
      '/client': ['client', 'admin'],
      '/contracts': ['admin', 'worker', 'client'],
    };

    for (const [routePath, allowedRoles] of Object.entries(accessRules)) {
      if (path.startsWith(routePath)) {
        return allowedRoles.includes(user.role);
      }
    }

    return true; // Allow access to general routes
  }
}

export const authService = AuthService.getInstance();
