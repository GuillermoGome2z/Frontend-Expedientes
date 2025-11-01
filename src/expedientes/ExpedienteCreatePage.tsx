import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expedientesApi } from "./expedientes.api";
import { ExpedienteForm } from "./ExpedienteForm";
import { Page } from "@/shared/ui/Page";
import { useToast } from "@/components/ui/toast";

export function ExpedienteCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: expedientesApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      toast({
        title: "🎉 Expediente creado con éxito",
        description: "El expediente se ha creado correctamente.",
        variant: "success",
      });
      navigate(`/expedientes/${response.data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear expediente",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    },
  });

  return (
    <Page title="Crear Nuevo Expediente" description="Completa los datos del expediente">
      <ExpedienteForm
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </Page>
  );
}
