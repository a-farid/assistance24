"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axiosClient";
import { useAuthStore } from "@/lib/store/authStore";
import log from "@/utils/logger";
import { I_ApiResponseOne } from "@/utils/interface/standard_interface";
import { IUser } from "@/utils/interface/user_interfaces";

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

// ✅ 1. Replicating login()
export function useLoginMutation() {
  const {setUser} = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<I_ApiResponseOne<IUser>, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data: I_ApiResponseOne<IUser>) => {
      if (data?.success && data?.item) {
        // Direct atomic update to persistent Zustand memory
        setUser(data.item);
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
      // 💡 Architectural Fix: If the token is missing, bypass the backend call entirely to avoid a 401 loop
      const hasToken = document.cookie.includes("access_token");
      if (!hasToken) {
        log.info("AuthMutation", "No active token found in storage. Proceeding with local cache purge...");
        return { message: "Locally logged out." };
      }

      const response = await api.post("/auth/logout");
      return response.data;
    },
    onMutate: () => {
      // 💡 Architectural Fix: Optimistically wipe local state immediately so the UI doesn't hang
      log.info("AuthMutation", "Executing optimistic local session teardown...");
      clearAuth();
      queryClient.clear();
    },
    onSettled: () => {
      // Ensure the user is pushed to the login screen regardless of network success or failure
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
}