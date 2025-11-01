import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "./auth.store";

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Guard para rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    // Guardar la ubicación desde donde intentó acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
