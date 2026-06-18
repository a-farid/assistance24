import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/auth/authStore";

// 1. Instantiate the Singleton Global Network Gateway
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://api.dev.local/api",
  withCredentials: true, // Absolute requirement: forces browser cookies to travel cross-origin
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Flag to track the global token regeneration lifecycle state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// 2. Egress Interceptor: Catching and Remedating 401 Authentication Dropping
api.interceptors.response.use(
  (response) => response, // Pass successful responses straight through unhindered
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Validate if the error signature represents an expired authorization state
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we are already executing a refresh cycle, queue this request until it finishes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Network Gateway Interceptor: 401 Detected. Initiating token rotation sequence...");
        
        // Execute the isolated background token re-verification call
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Update your persistent Zustand store with the fresh session metrics
        const { setUser, updateLastTokenRefresh } = useAuthStore.getState();
        if (response.data.user) {
          setUser(response.data.user);
          updateLastTokenRefresh();
        }

        processQueue(null, "success");
        isRefreshing = false;

        // Re-execute the original stalled request with the new active session parameters
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Network Gateway Interceptor: Token rotation failed. Terminating session context.");
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear local auth state if the refresh token itself has expired
        useAuthStore.getState().clearAuth();
        
        // Force route redirect to landing/login context
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);