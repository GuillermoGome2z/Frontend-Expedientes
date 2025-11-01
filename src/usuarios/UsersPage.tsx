import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Key, Power, PowerOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usuariosApi } from "./usuarios.api";
import type { UsuariosFilters, CreateUsuarioDTO } from "./usuarios.types";
import type { Rol } from "@/auth/auth.types";
import { Page } from "@/shared/ui/Page";
import { DataTable } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ErrorState } from "@/shared/ui/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

// Schemas de validación Zod
const createUsuarioSchema = z.object({
  username: z.string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos"),
  password: z.string()
    .min(6, "Mínimo 6 caracteres")
    .max(100, "Máximo 100 caracteres"),
  rol: z.enum(["tecnico", "coordinador"]),
});

const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "Mínimo 6 caracteres")
    .max(100, "Máximo 100 caracteres"),
});

type CreateUsuarioForm = z.infer<typeof createUsuarioSchema>;
type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filters, setFilters] = useState<UsuariosFilters>({
    page: 1,
    pageSize: 10,
    q: "",
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Query para listar usuarios
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["usuarios", filters],
    queryFn: () => usuariosApi.list(filters),
    placeholderData: (previousData) => previousData,
  });

  // Formulario de creación
  const createForm = useForm<CreateUsuarioForm>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: {
      username: "",
      password: "",
      rol: "tecnico",
    },
  });

  // Formulario de cambio de contraseña
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  // Mutación para crear usuario
  const createMutation = useMutation({
    mutationFn: (data: CreateUsuarioDTO) => usuariosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({
        title: "👤 Usuario creado",
        description: "El usuario se ha creado correctamente.",
        variant: "success",
      });
      setShowCreateDialog(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear usuario",
        description: error.message || "No se pudo crear el usuario.",
        variant: "destructive",
      });
    },
  });

  // Mutación para cambiar contraseña
  const passwordMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { newPassword: string } }) =>
      usuariosApi.changePassword(id, data),
    onSuccess: () => {
      toast({
        title: "🔑 Contraseña actualizada",
        description: "La contraseña se ha cambiado correctamente.",
        variant: "success",
      });
      setShowPasswordDialog(false);
      setSelectedUserId(null);
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error al cambiar contraseña",
        description: error.message || "No se pudo cambiar la contraseña.",
        variant: "destructive",
      });
    },
  });

  // Mutación para activar/desactivar
  const toggleActivoMutation = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      usuariosApi.toggleActivo(id, activo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast({
        title: variables.activo ? "✅ Usuario activado" : "⛔ Usuario desactivado",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al cambiar estado",
        description: error.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, q, page: 1 }));
  };

  const handleRolFilter = (rol: string) => {
    setFilters((prev) => ({
      ...prev,
      rol: rol ? (rol as Rol) : undefined,
      page: 1,
    }));
  };

  const handleOpenPasswordDialog = (userId: number) => {
    setSelectedUserId(userId);
    setShowPasswordDialog(true);
  };

  const handleCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const handlePasswordSubmit = passwordForm.handleSubmit((data) => {
    if (selectedUserId) {
      passwordMutation.mutate({ id: selectedUserId, data });
    }
  });

  // Columnas de la tabla
  const columns = [
    {
      key: "username",
      label: "Usuario",
    },
    {
      key: "rol",
      label: "Rol",
      render: (usuario: any) => (
        <Badge variant={usuario.rol === "coordinador" ? "default" : "secondary"}>
          {usuario.rol === "coordinador" ? "Coordinador" : "Técnico"}
        </Badge>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (usuario: any) => (
        <Badge variant={usuario.activo ? "success" : "destructive"}>
          {usuario.activo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha de Creación",
      render: (usuario: any) => {
        if (!usuario.createdAt) return "-";
        const date = new Date(usuario.createdAt);
        return isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString("es-ES", { dateStyle: "medium" });
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render: (usuario: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenPasswordDialog(usuario.id)}
            disabled={passwordMutation.isPending}
          >
            <Key size={14} />
            Cambiar Contraseña
          </Button>
          <Button
            size="sm"
            variant={usuario.activo ? "destructive" : "default"}
            onClick={() => toggleActivoMutation.mutate({ id: usuario.id, activo: !usuario.activo })}
            disabled={toggleActivoMutation.isPending}
          >
            {usuario.activo ? (
              <>
                <PowerOff size={14} />
                Desactivar
              </>
            ) : (
              <>
                <Power size={14} />
                Activar
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Page title="Gestión de Usuarios">
        <ErrorState onRetry={() => refetch()} />
      </Page>
    );
  }

  return (
    <Page
      title="Gestión de Usuarios"
      toolbar={
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus size={16} />
          Crear Usuario
        </Button>
      }
    >
      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por usuario..."
              value={filters.q}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={filters.rol || ""}
              onChange={(e) => handleRolFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Todos los roles</option>
              <option value="tecnico">Técnico</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse">Cargando usuarios...</div>
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="No hay usuarios"
          description="Crea el primer usuario del sistema."
          action={
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus size={16} />
              Crear Usuario
            </Button>
          }
        />
      ) : (
        <DataTable
          data={data?.data || []}
          columns={columns}
          pagination={{
            currentPage: filters.page || 1,
            pageSize: filters.pageSize || 10,
            total: data?.total || 0,
            onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      )}

      {/* Modal Crear Usuario */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Crear Nuevo Usuario</CardTitle>
              <CardDescription>
                Ingresa los datos del nuevo usuario técnico o coordinador.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    {...createForm.register("username")}
                    placeholder="usuario123"
                  />
                  {createForm.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...createForm.register("password")}
                    placeholder="••••••"
                  />
                  {createForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rol">Rol *</Label>
                  <select
                    id="rol"
                    {...createForm.register("rol")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="coordinador">Coordinador</option>
                  </select>
                  {createForm.formState.errors.rol && (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.rol.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creando..." : "Crear Usuario"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      createForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>
                Ingresa la nueva contraseña para el usuario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    placeholder="••••••"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending ? "Actualizando..." : "Cambiar Contraseña"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordDialog(false);
                      setSelectedUserId(null);
                      passwordForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Page>
  );
}
