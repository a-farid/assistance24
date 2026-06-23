import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

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
  failedQueue.forEach((promiss) => {
    if (token) {
      promiss.resolve(token);
    } else {
      promiss.reject(error);
    }
  });
  failedQueue = [];
};


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isAuthRoute = requestUrl.includes("/auth/logout") || requestUrl.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.warn("NetworkEngine", "Access token expired. Initiating silent refresh...");

      try {
        const refreshResponse = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const updatedUser = refreshResponse.data?.item;

        if (updatedUser) {
          useAuthStore.getState().setUser(updatedUser);
        }
        useAuthStore.getState().updateLastTokenRefresh();

        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && requestUrl.includes("/auth/logout")) {
      console.error("NetworkEngine", "Intercepted unauthorized logout. Hard flushing client session states...");
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);