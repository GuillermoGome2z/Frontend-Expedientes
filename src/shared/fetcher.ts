import axios, { AxiosError, type AxiosResponse } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/auth/auth.store";
import { API_URL } from "./env";

/**
 * Estructura normalizada de respuestas exitosas del backend
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * Estructura normalizada de respuestas de error del backend
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

/**
 * Información de rate limiting extraída de headers
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

/**
 * Error tipado personalizado para errores de API
 */
export class ApiError extends Error {
  name = "ApiError";
  status: number;
  details?: any;
  rateLimit?: RateLimitInfo;

  constructor(
    message: string,
    status: number,
    details?: any,
    rateLimit?: RateLimitInfo
  ) {
    super(message);
    this.status = status;
    this.details = details;
    this.rateLimit = rateLimit;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/**
 * Extrae información de rate limiting de los headers de respuesta
 */
function extractRateLimitInfo(headers: any): RateLimitInfo | undefined {
  const limit = headers["ratelimit-limit"];
  const remaining = headers["ratelimit-remaining"];
  const reset = headers["ratelimit-reset"];

  if (limit && remaining && reset) {
    return {
      limit: Number(limit),
      remaining: Number(remaining),
      reset: Number(reset),
    };
  }

  return undefined;
}

/**
 * Muestra un toast usando el event bus personalizado
 */
function showToast(title: string, description: string, variant: "default" | "destructive" | "success" = "default") {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("show-toast", {
      detail: { title, description, variant },
    });
    window.dispatchEvent(event);
  }
}

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

// Response interceptor - Handle normalized responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Si la respuesta tiene el formato normalizado { success: true, data }
    if (response.data?.success === true) {
      // Retornamos solo el data, el fetcher helper ya no necesita extraerlo
      response.data = response.data.data;
    }
    // Si no tiene el formato normalizado, dejamos los datos tal cual
    // Esto permite que el backend funcione sin implementar el formato normalizado aún
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status || 500;
    const rateLimitInfo = error.response?.headers
      ? extractRateLimitInfo(error.response.headers)
      : undefined;

    // Extraer mensaje de error
    let errorMessage = "Error inesperado";
    let errorDetails = undefined;

    if (error.response?.data) {
      if (error.response.data.success === false) {
        // Formato normalizado de error
        errorMessage = error.response.data.error || errorMessage;
        errorDetails = error.response.data.details;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Manejo específico por código de estado
    switch (status) {
      case 401: {
        // Token expired or invalid - logout y redirigir
        const { logout } = useAuthStore.getState();
        logout();
        showToast(
          "Sesión expirada",
          "Tu sesión expiró. Por favor, inicia sesión de nuevo.",
          "destructive"
        );
        // Redirigir a login (pequeño delay para que el toast se muestre)
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
        break;
      }

      case 403: {
        // Forbidden - No deslogueamos, solo mostramos el error
        showToast(
          "Acceso denegado",
          "No tienes permisos para realizar esta acción.",
          "destructive"
        );
        break;
      }

      case 429: {
        // Rate limit exceeded
        let retryMessage = "Límite temporal alcanzado.";
        
        if (rateLimitInfo) {
          const resetDate = new Date(rateLimitInfo.reset * 1000);
          const secondsUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
          
          if (secondsUntilReset > 0) {
            retryMessage += ` Intenta de nuevo en ${secondsUntilReset} segundos.`;
          }
          
          retryMessage += ` (${rateLimitInfo.remaining}/${rateLimitInfo.limit} restantes)`;
        }

        // Revisar si hay header Retry-After
        const retryAfter = error.response?.headers["retry-after"];
        if (retryAfter) {
          retryMessage += ` Reintenta después de ${retryAfter}s.`;
        }

        showToast("Límite de solicitudes alcanzado", retryMessage, "destructive");
        break;
      }

      case 404: {
        // No es necesario toast automático, lo manejaremos en la UI
        break;
      }

      case 500:
      case 502:
      case 503: {
        showToast(
          "Error del servidor",
          "Ocurrió un error inesperado. Por favor, intenta más tarde.",
          "destructive"
        );
        break;
      }
    }

    // Lanzar error tipado personalizado
    const apiError = new ApiError(errorMessage, status, errorDetails, rateLimitInfo);
    return Promise.reject(apiError);
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

/**
 * Mapea un error de API a mensajes amigables para mostrar en la UI
 */
export function mapHttpError(error: unknown): { title: string; description: string } {
  if (error instanceof ApiError) {
    // Ya tenemos un error tipado
    switch (error.status) {
      case 400:
        return {
          title: "Datos inválidos",
          description: error.message || "Por favor, verifica los datos ingresados.",
        };
      case 401:
        return {
          title: "No autenticado",
          description: "Debes iniciar sesión para continuar.",
        };
      case 403:
        return {
          title: "Acceso denegado",
          description: error.message || "No tienes permisos para realizar esta acción.",
        };
      case 404:
        return {
          title: "No encontrado",
          description: error.message || "El recurso solicitado no existe.",
        };
      case 429:
        return {
          title: "Límite de solicitudes alcanzado",
          description: error.message || "Has excedido el límite de solicitudes. Intenta más tarde.",
        };
      case 500:
      case 502:
      case 503:
        return {
          title: "Error del servidor",
          description: "Ocurrió un error inesperado. Por favor, intenta más tarde.",
        };
      default:
        return {
          title: "Error",
          description: error.message || "Ocurrió un error inesperado.",
        };
    }
  }

  // Error desconocido
  if (error instanceof Error) {
    return {
      title: "Error",
      description: error.message || "Ocurrió un error inesperado.",
    };
  }

  return {
    title: "Error",
    description: "Ocurrió un error inesperado.",
  };
}
