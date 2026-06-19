"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axiosClient";
import { GetAllDataResponse } from "@/utils/interface/global";
import { IUser } from "@/utils/interface/user_interfaces";
import { useAuthStore } from "../auth/authStore";
import log from "@/utils/logger";

interface PaginationParams {
  page: number;
  limit: number;
}
// Wrapper interface matching your backend's structural JSON response layout
interface UserResponse {
  data: IUser;
  message?: string;
}

interface UpdateUserPayload {
  id: string;
  userData: Record<string, any>;
}

export function useGetUsers({ page, limit }: PaginationParams) {
  return useQuery<GetAllDataResponse<IUser[]>>({
    // 💡 Reactive Cache Key: Changing page or limit automatically triggers a network re-fetch
    queryKey: ["users", { page, limit }],
    queryFn: async () => {
      // Axios maps 'params' directly to '?page=X&limit=Y' query strings cleanly
      const response = await api.get("/users/all", {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

export function useGetUserById(userId: string) {
  return useQuery<UserResponse>({
    // Secure Identity Cache Key containing the specific resource identifier string
    queryKey: ["users", "detail", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Safeguard rule: prevents execution if the path variable is undefined
  });
}

// ✅ 2. Replacing useToggleUserStatusMutation()
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Injects the parameter directly into the action path segment
      const response = await api.put(`/users/${userId}/toggle_status`); 
      return response.data;
    },
    // The Caching Sync Trigger Callback
    onSuccess: (data, userId) => {
      // Re-fetch the specific user detail cache tree to reflect the status change instantly on-screen
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    },
  });
}

export function useEditConnectedUser() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser); // Extract the atomic state setter

  return useMutation({
    mutationFn: async (userData: Partial<IUser>) => {
      const response = await api.put("/users/me", userData);
      return response.data;
    },
    onSuccess: (responseData) => {
      // 1. Core State Sync: Write the updated backend payload straight to Zustand memory
      if (responseData?.data) {
        setUser(responseData.data);
      }

      // 2. Cache Invalidation: Mark existing cached queries as dirty
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (responseData?.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["users", "detail", responseData.data.id] });
      }
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: UpdateUserPayload) => {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    },
    onSuccess: (responseData, variables) => {
      log.info("MutationEngine", `User record [${variables.id}] mutated successfully. Invaliding caches...`);

      // 💡 1. Invalidate the master overview list query cache line
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });

      // 💡 2. Invalidate the specific single resource detail cache line
      queryClient.invalidateQueries({ queryKey: ["users", "detail", variables.id] });
    },
    onError: (error: any) => {
      log.error("MutationEngine", "User record modification failure context:", error);
    }
  });
}

