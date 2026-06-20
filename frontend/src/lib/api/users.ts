"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axiosClient";
import { I_ApiResponseAll, I_ApiResponseOne } from "@/utils/interface/global";
import { IUser } from "@/utils/interface/user_interfaces";
import { useAuthStore } from "../auth/authStore";
import log from "@/utils/logger";

interface UpdateUserPayload {
  id: string;
  userData: Record<string, any>;
}

export function useGetUsers({ page, limit }: {page: number; limit: number}) {
  return useQuery<I_ApiResponseAll<IUser[]>>({
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
  return useQuery<I_ApiResponseOne<IUser>>({
    // Secure Identity Cache Key containing the specific resource identifier string
    queryKey: ["users", "detail", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Safeguard rule: prevents execution if the path variable is undefined
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<I_ApiResponseOne<IUser>, Error, string>({
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

  return useMutation<I_ApiResponseOne<IUser>, Error, Partial<IUser>>({
    mutationFn: async (userData: Partial<IUser>) => {
      const response = await api.put("/users/me", userData);
      return response.data;
    },
    onSuccess: (responseData) => {
      // 1. Core State Sync: Write the updated backend payload straight to Zustand memory
      if (responseData?.item) {
        setUser(responseData.item);
      }

      // 2. Cache Invalidation: Mark existing cached queries as dirty
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (responseData?.item?.id) {
        queryClient.invalidateQueries({ queryKey: ["users", "detail", responseData.item.id] });
      }
    },
  });
}


export function useUpdateUser() {
  const queryClient = useQueryClient();

  // 💡 4. Bind the mutation payload strictly to our UpdateUserPayload interface structure
  return useMutation<I_ApiResponseOne<IUser>, Error, UpdateUserPayload>({
    mutationFn: async ({ id, userData }: UpdateUserPayload) => {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    },
    onSuccess: (responseData, variables) => {
      // ✅ Fixed the data access bug: variables now maps cleanly to our explicit interface properties
      const updatedId = responseData.item?.id || variables.id;
      log.info("MutationEngine", `User record [${updatedId}] mutated successfully. Invaliding caches...`);

      // Invalidate the broader 'users' cache space to safely wipe out stale entries across all views
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      log.error("MutationEngine", "User record modification failure context:", error);
    }
  });
}