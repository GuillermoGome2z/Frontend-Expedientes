import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, XCircle, Edit } from "lucide-react";
import { expedientesApi } from "./expedientes.api";
import { EstadoBadge } from "./EstadoBadge";
import { IndiciosList } from "@/indicios/IndiciosList";
import { useAuthStore } from "@/auth/auth.store";
import { Page } from "@/shared/ui/Page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { ErrorState } from "@/shared/ui/ErrorState";

export function ExpedienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [justificacion, setJustificacion] = useState("");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<"Aprobado" | "Rechazado" | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["expediente", id],
    queryFn: async () => {
      const result = await expedientesApi.getById(Number(id));
      console.log("Expediente recibido:", result);
      return result;
    },
    enabled: !!id,
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ estado, justificacion }: { estado: "Aprobado" | "Rechazado"; justificacion?: string }) =>
      expedientesApi.updateEstado(Number(id), { estado, justificacion }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expediente", id] });
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      const message = variables.estado === "Aprobado"
        ? "🟢 Expediente aprobado. ¡Buen trabajo!"
        : "🟠 Expediente rechazado. Se registró tu justificación.";
      toast({
        title: "Estado actualizado",
        description: message,
        variant: "success",
      });
      setShowApprovalDialog(false);
      setPendingEstado(null);
      setJustificacion("");
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar estado",
        description: error.message || "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    },
  });

  const handleEstadoChange = (estado: "Aprobado" | "Rechazado") => {
    setPendingEstado(estado);
    setShowApprovalDialog(true);
  };

  const confirmEstadoChange = () => {
    if (pendingEstado) {
      updateEstadoMutation.mutate({
        estado: pendingEstado,
        justificacion: justificacion || undefined,
      });
    }
  };

  // El backend puede devolver { data: expediente } o directamente el expediente
  const expediente = (data as any)?.data || data;
  
  // Permisos:
  // - Coordinadores: pueden editar y aprobar/rechazar expedientes abiertos
  // - Técnicos: solo pueden editar sus propios expedientes mientras estén abiertos
  const isCoordinador = user?.rol === "coordinador";
  const isTecnicoAsignado = user?.rol === "tecnico" && expediente?.tecnicoId === user.id;
  const isExpedienteAbierto = expediente?.estado?.toLowerCase() === "abierto";
  
  const canEdit = (isCoordinador || isTecnicoAsignado) && isExpedienteAbierto;
  const canChangeStatus = isCoordinador && isExpedienteAbierto;

  if (error) {
    return (
      <Page title="Expediente">
        <ErrorState onRetry={() => refetch()} />
      </Page>
    );
  }

  if (isLoading || !expediente) {
    return (
      <Page title="Cargando...">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      toolbar={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/expedientes")}>
            <ArrowLeft size={16} />
            Volver
          </Button>
          {canEdit && (
            <Link to={`/expedientes/${id}/editar`}>
              <Button>
                <Edit size={16} />
                Editar
              </Button>
            </Link>
          )}
        </div>
      }
    >
      {/* Detalles del Expediente */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{expediente.codigo}</CardTitle>
              <CardDescription className="text-lg mt-1">{expediente.titulo}</CardDescription>
            </div>
            <EstadoBadge estado={expediente.estado} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-muted-foreground">Descripción</Label>
            <p className="mt-2">{expediente.descripcion}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Técnico Asignado</Label>
              <p className="mt-2">{expediente.tecnico?.username || "No asignado"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Fecha de Creación</Label>
              <p className="mt-2">
                {(() => {
                  const date = new Date(expediente.createdAt);
                  return isNaN(date.getTime()) 
                    ? "Fecha no disponible" 
                    : date.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
                })()}
              </p>
            </div>
          </div>

          {expediente.justificacionEstado && (
            <div>
              <Label className="text-muted-foreground">Justificación del Estado</Label>
              <p className="mt-2 p-4 bg-muted rounded-lg">{expediente.justificacionEstado}</p>
            </div>
          )}

          {/* Botones de Aprobación/Rechazo */}
          {canChangeStatus && (
            <div className="flex gap-4 pt-4 border-t">
              <Button
                variant="default"
                onClick={() => handleEstadoChange("Aprobado")}
                disabled={updateEstadoMutation.isPending}
              >
                <CheckCircle size={16} />
                Aprobar Expediente
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleEstadoChange("Rechazado")}
                disabled={updateEstadoMutation.isPending}
              >
                <XCircle size={16} />
                Rechazar Expediente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmación */}
      {showApprovalDialog && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle>
                {pendingEstado === "Aprobado" ? "Aprobar Expediente" : "Rechazar Expediente"}
              </CardTitle>
              <CardDescription>
                {pendingEstado === "Rechazado" && "Por favor, proporciona una justificación para el rechazo."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingEstado === "Rechazado" && (
                <div className="space-y-2">
                  <Label htmlFor="justificacion">Justificación *</Label>
                  <textarea
                    id="justificacion"
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Explica el motivo del rechazo..."
                  />
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  onClick={confirmEstadoChange}
                  disabled={updateEstadoMutation.isPending || (pendingEstado === "Rechazado" && !justificacion)}
                >
                  {updateEstadoMutation.isPending ? "Procesando..." : "Confirmar"}
                </Button>
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sección de Indicios */}
      <IndiciosList expedienteId={Number(id)} canEdit={canEdit} />
    </Page>
  );
}
