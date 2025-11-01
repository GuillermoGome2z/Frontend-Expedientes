import { useMemo } from "react";
import { ApiError, mapHttpError } from "@/shared/fetcher";

/**
 * Hook para mapear errores de API a mensajes amigables
 * Útil para mostrar en toasts o dialogs
 */
export function useApiError(error: unknown | null) {
  const errorInfo = useMemo(() => {
    if (!error) {
      return null;
    }

    return mapHttpError(error);
  }, [error]);

  return errorInfo;
}

/**
 * Hook más específico que también extrae información de rate limiting
 */
export function useApiErrorWithRateLimit(error: unknown | null) {
  const errorInfo = useApiError(error);

  const rateLimitInfo = useMemo(() => {
    if (error instanceof ApiError && error.rateLimit) {
      return error.rateLimit;
    }
    return null;
  }, [error]);

  return {
    ...errorInfo,
    rateLimit: rateLimitInfo,
  };
}
