import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "./auth.store";
import type { Rol } from "./auth.types";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";

interface RequireRoleProps {
  children: ReactNode;
  allowed: Rol[];
}

/**
 * Guard para rutas que requieren un rol específico
 * Redirige a /dashboard si el usuario no tiene el rol requerido
 */
export function RequireRole({ children, allowed }: RequireRoleProps) {
  const { user, hasRole } = useAuthStore();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (user && !hasRole(...allowed) && !hasShownToast) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página.",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [user, allowed, hasRole, toast, hasShownToast]);

  if (!user || !hasRole(...allowed)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
