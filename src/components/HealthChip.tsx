import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { fetcher } from "@/shared/fetcher";
import { Badge } from "@/components/ui/badge";

interface HealthResponse {
  status: string;
  timestamp: string;
  database?: {
    connected: boolean;
  };
}

/**
 * Componente que muestra el estado de salud del backend
 * Verde: API y BD funcionando
 * Rojo: API caída o BD desconectada
 */
export function HealthChip() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      try {
        const response = await fetcher.get<HealthResponse>("/health");
        return response;
      } catch (err) {
        throw err;
      }
    },
    refetchInterval: 30000, // Refresca cada 30 segundos
    retry: false,
  });

  const isHealthy = 
    !error && 
    !isLoading && 
    data?.status === "ok" && 
    (data.database?.connected !== false);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-2">
        <Activity size={14} className="animate-pulse" />
        Verificando...
      </Badge>
    );
  }

  if (isHealthy) {
    return (
      <Badge variant="success" className="gap-2">
        <Activity size={14} />
        Backend Operativo
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-2">
      <Activity size={14} />
      Backend Inaccesible
    </Badge>
  );
}
