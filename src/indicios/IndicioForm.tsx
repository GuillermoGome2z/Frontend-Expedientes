import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { indiciosApi } from "./indicios.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

const indicioSchema = z.object({
  descripcion: z.string().min(3, "Mínimo 3 caracteres").max(500, "Máximo 500 caracteres"),
  peso: z.number().min(0, "El peso debe ser positivo").optional().or(z.literal(0)),
  color: z.string().max(50, "Máximo 50 caracteres").optional(),
  tamano: z.string().max(50, "Máximo 50 caracteres").optional(),
});

type IndicioFormData = z.infer<typeof indicioSchema>;

interface IndicioFormProps {
  expedienteId: number;
  defaultValues?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function IndicioForm({ expedienteId, defaultValues, onSuccess, onCancel }: IndicioFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IndicioFormData>({
    resolver: zodResolver(indicioSchema),
    defaultValues: defaultValues ? {
      descripcion: defaultValues.descripcion,
      peso: defaultValues.peso || 0,
      color: defaultValues.color || "",
      tamano: defaultValues.tamano || "",
    } : {
      descripcion: "",
      peso: 0,
      color: "",
      tamano: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: IndicioFormData) => indiciosApi.create(expedienteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicios", expedienteId] });
      toast({
        title: "🧪 Indicio agregado al expediente",
        variant: "success",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear indicio",
        description: error.response?.data?.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: IndicioFormData) => indiciosApi.update(defaultValues.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicios", expedienteId] });
      toast({
        title: "✏️ Indicio actualizado",
        variant: "success",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar indicio",
        description: error.response?.data?.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IndicioFormData) => {
    if (defaultValues) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción *</Label>
        <Input
          id="descripcion"
          placeholder="Descripción del indicio"
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p className="text-sm text-destructive">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            step="0.01"
            placeholder="0.0"
            {...register("peso", { valueAsNumber: true })}
          />
          {errors.peso && (
            <p className="text-sm text-destructive">{errors.peso.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="Rojo, azul..."
            {...register("color")}
          />
          {errors.color && (
            <p className="text-sm text-destructive">{errors.color.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tamano">Tamaño</Label>
          <Input
            id="tamano"
            placeholder="Pequeño, mediano..."
            {...register("tamano")}
          />
          {errors.tamano && (
            <p className="text-sm text-destructive">{errors.tamano.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : defaultValues ? "Actualizar" : "Agregar Indicio"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
