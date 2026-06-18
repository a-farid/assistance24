"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axiosClient";
import { useAuthStore } from "@/lib/auth/authStore";
import log from "@/utils/logger";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
    user: any; // Adjust this type based on your actual user data structure
  };
  message?: string;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
}

// ✅ 1. Replicating login()
export function useLoginMutation() {
  const {setUser} = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data as LoginResponse;
    },
    onSuccess: (data: LoginResponse) => {
      if (data?.success && data?.data?.user) {
        // Direct atomic update to persistent Zustand memory
        setUser(data.data.user);
        // Clear old caches from prior logged-in user profiles
        queryClient.clear();
      }
    },
  });
}
export function useLogoutMutation() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      console.log('useLogoutMutation-response', response);
      return response.data as LogoutResponse;
    },
    // 💡 Architectural Fix: Use onSettled to guarantee state erasure BEFORE component lifecycle updates
    onSettled: () => {
      log.info("AuthMutation", "Flushing local client caches and state registers...");
      
      // 1. Wipe Zustand memory completely (Flips isAuthenticated to false synchronously)
      clearAuth(); 
      
      // 2. Clear all cached TanStack queries
      queryClient.clear(); 
    },
  });
}