/**
 * Auth Hook for Components
 * Provides easy access to authentication state and methods
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from './authStore';
import { authService } from './authService';

export const useAuth = () => {
  const authState = useAuthStore();

  // Initialize auth check on mount
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      authService.checkAuth();
    }
  }, [authState.isAuthenticated, authState.isLoading]);

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    
    // Methods
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    register: authService.register.bind(authService),
    checkAuth: authService.checkAuth.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    canAccess: authService.canAccess.bind(authService),
  };
};
