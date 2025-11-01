import { Badge } from "@/components/ui/badge";
import type { Expediente } from "./expedientes.types";

interface EstadoBadgeProps {
  estado: Expediente["estado"];
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const variants = {
    Abierto: { variant: "warning" as const, label: "⏳ Abierto" },
    Aprobado: { variant: "success" as const, label: "✅ Aprobado" },
    Rechazado: { variant: "destructive" as const, label: "❌ Rechazado" },
  };

  const config = variants[estado];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
