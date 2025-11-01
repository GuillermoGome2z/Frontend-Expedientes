import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expediente } from "./expedientes.types";

const expedienteSchema = z.object({
  codigo: z.string().min(3, "El código debe tener al menos 3 caracteres").max(30, "Máximo 30 caracteres"),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100, "Máximo 100 caracteres"),
  descripcion: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(1000, "Máximo 1000 caracteres"),
});

type ExpedienteFormData = z.infer<typeof expedienteSchema>;

interface ExpedienteFormProps {
  defaultValues?: Partial<Expediente>;
  onSubmit: (data: ExpedienteFormData) => void;
  isLoading?: boolean;
}

export function ExpedienteForm({ defaultValues, onSubmit, isLoading }: ExpedienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpedienteFormData>({
    resolver: zodResolver(expedienteSchema),
    defaultValues: defaultValues || {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? "Editar Expediente" : "Nuevo Expediente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              placeholder="EXP-2024-001"
              {...register("codigo")}
            />
            {errors.codigo && (
              <p className="text-sm text-destructive">{errors.codigo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Título del expediente"
              {...register("titulo")}
            />
            {errors.titulo && (
              <p className="text-sm text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <textarea
              id="descripcion"
              placeholder="Describe el expediente en detalle..."
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="text-sm text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : defaultValues ? "Guardar Cambios" : "Crear Expediente"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
