import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "./auth.store";
import { useToast } from "@/components/ui/toast";
import { useEffect, useState } from "react";

interface RequireRoleProps {
  children: ReactNode;
  allowed: string[];
}

export function RequireRole({ children, allowed }: RequireRoleProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (user && !allowed.includes(user.rol) && !hasShownToast) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página.",
        variant: "destructive",
      });
      setHasShownToast(true);
    }
  }, [user, allowed, toast, hasShownToast]);

  if (!user || !allowed.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
