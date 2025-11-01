import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/auth/auth.store";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const { logout } = useAuthStore.getState();
      logout();
      
      // Show toast if available
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-toast", {
          detail: {
            title: "Sesión expirada",
            description: "Tu sesión expiró. Por favor, inicia sesión de nuevo.",
            variant: "destructive",
          },
        });
        window.dispatchEvent(event);
      }
      
      // Redirect to login
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Forbidden - No permissions
      if (typeof window !== "undefined") {
        const event = new CustomEvent("show-toast", {
          detail: {
            title: "Acceso denegado",
            description: "No tienes permisos para realizar esta acción.",
            variant: "destructive",
          },
        });
        window.dispatchEvent(event);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
export const fetcher = {
  get: <T>(url: string, params?: any) => 
    api.get<T>(url, { params }).then((res) => res.data),
  
  post: <T>(url: string, data?: any) => 
    api.post<T>(url, data).then((res) => res.data),
  
  put: <T>(url: string, data?: any) => 
    api.put<T>(url, data).then((res) => res.data),
  
  patch: <T>(url: string, data?: any) => 
    api.patch<T>(url, data).then((res) => res.data),
  
  delete: <T>(url: string) => 
    api.delete<T>(url).then((res) => res.data),
};
