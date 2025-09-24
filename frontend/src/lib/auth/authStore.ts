/**
 * Enhanced Authentication Store with Persistence
 * Provides secure token management with automatic refresh and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'worker' | 'client';
  first_name: string;
  last_name: string;
  disabled: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastTokenRefresh: number | null;
  sessionId: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateLastTokenRefresh: () => void;
  setSessionId: (sessionId: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
}

// Token refresh interval (5 minutes before expiry)
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      lastTokenRefresh: null,
      sessionId: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      updateLastTokenRefresh: () => set({ lastTokenRefresh: Date.now() }),
      
      setSessionId: (sessionId) => set({ sessionId }),
      
      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          sessionId: null,
          lastTokenRefresh: null 
        }),
      
      clearAuth: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          sessionId: null,
          lastTokenRefresh: null 
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        lastTokenRefresh: state.lastTokenRefresh,
      }),
    }
  )
);

// Helper functions
export const shouldRefreshToken = (): boolean => {
  const { lastTokenRefresh } = useAuthStore.getState();
  if (!lastTokenRefresh) return true;
  
  const timeSinceRefresh = Date.now() - lastTokenRefresh;
  const accessTokenExpiry = 15 * 60 * 1000; // 15 minutes (from your backend config)
  
  return timeSinceRefresh >= (accessTokenExpiry - TOKEN_REFRESH_BUFFER);
};

export const getAuthHeaders = () => {
  const { isAuthenticated, sessionId } = useAuthStore.getState();
  
  if (!isAuthenticated || !sessionId) return {};
  
  return {
    'X-Session-ID': sessionId,
    'Content-Type': 'application/json',
  };
};
