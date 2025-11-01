import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { indiciosApi } from "./indicios.api";
import { IndicioForm } from "./IndicioForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useToast } from "@/components/ui/toast";

interface IndiciosListProps {
  expedienteId: number;
  canEdit: boolean;
}

export function IndiciosList({ expedienteId, canEdit }: IndiciosListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingIndicio, setEditingIndicio] = useState<any>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["indicios", expedienteId, page],
    queryFn: () => indiciosApi.list(expedienteId, { pagina: page, pageSize: 10 }),
  });

  const toggleActivoMutation = useMutation({
    mutationFn: indiciosApi.toggleActivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicios", expedienteId] });
      toast({
        title: "🔁 Estado del indicio actualizado",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar indicio",
        description: error.response?.data?.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (indicio: any) => {
    setEditingIndicio(indicio);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndicio(null);
  };

  const columns = [
    {
      key: "descripcion",
      label: "Descripción",
    },
    {
      key: "peso",
      label: "Peso (kg)",
      render: (indicio: any) => indicio.peso ? `${indicio.peso} kg` : "-",
    },
    {
      key: "color",
      label: "Color",
      render: (indicio: any) => indicio.color || "-",
    },
    {
      key: "tamano",
      label: "Tamaño",
      render: (indicio: any) => indicio.tamano || "-",
    },
    {
      key: "activo",
      label: "Estado",
      render: (indicio: any) => (
        <Badge variant={indicio.activo ? "success" : "outline"}>
          {indicio.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    ...(canEdit
      ? [
          {
            key: "actions",
            label: "Acciones",
            render: (indicio: any) => (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(indicio)}>
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActivoMutation.mutate(indicio.id)}
                  disabled={toggleActivoMutation.isPending}
                >
                  {indicio.activo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Indicios</CardTitle>
          {canEdit && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} />
              Agregar Indicio
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <IndicioForm
            expedienteId={expedienteId}
            defaultValues={editingIndicio}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        ) : data && data.data.length === 0 ? (
          <EmptyState
            icon="🧪"
            title="Aún no hay indicios registrados en este expediente"
            description={canEdit ? "Agrega el primer indicio para comenzar." : undefined}
            action={
              canEdit ? (
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={16} />
                  Agregar Indicio
                </Button>
              ) : undefined
            }
          />
        ) : (
          <DataTable
            data={data?.data || []}
            columns={columns}
            isLoading={isLoading}
            pagination={
              data
                ? {
                    currentPage: data.pagina,
                    pageSize: data.pageSize,
                    total: data.total,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
