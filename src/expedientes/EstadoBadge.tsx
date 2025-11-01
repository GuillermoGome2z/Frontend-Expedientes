import { Badge } from "@/components/ui/badge";
import type { Expediente } from "./expedientes.types";

interface EstadoBadgeProps {
  estado: Expediente["estado"];
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  // Normalizar estado a mayúscula inicial
  const normalizeEstado = (estado: string | null | undefined): string => {
    if (!estado) return "Sin estado";
    // Convertir primera letra a mayúscula
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  const estadoNormalizado = normalizeEstado(estado as string);

  const variants: Record<string, { variant: "warning" | "success" | "destructive" | "outline", label: string }> = {
    Abierto: { variant: "warning" as const, label: "⏳ Abierto" },
    Aprobado: { variant: "success" as const, label: "✅ Aprobado" },
    Rechazado: { variant: "destructive" as const, label: "❌ Rechazado" },
  };

  // Manejar caso cuando estado es undefined o inválido
  const config = variants[estadoNormalizado] || { variant: "outline" as const, label: `📋 ${estadoNormalizado}` };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
