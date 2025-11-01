import { fetcher } from "@/shared/fetcher";
import type {
  Usuario,
  UsuariosListResponse,
  UsuariosFilters,
  CreateUsuarioDTO,
  ChangePasswordDTO,
} from "./usuarios.types";

/**
 * Construye los parámetros de query para el backend
 * Mapea page→pagina y pageSize→tamanoPagina
 */
function buildQueryParams(filters?: UsuariosFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (!filters) return params;

  // Mapear aliases de paginación
  if (filters.page !== undefined) params.pagina = String(filters.page);
  if (filters.pageSize !== undefined) params.tamanoPagina = String(filters.pageSize);

  // Otros filtros
  if (filters.q) params.q = filters.q;
  if (filters.rol) params.rol = filters.rol;
  if (filters.activo !== undefined) params.activo = String(filters.activo);

  return params;
}

/**
 * API client para gestión de usuarios
 * Solo accesible por coordinadores
 */
export const usuariosApi = {
  /**
   * Lista usuarios con paginación y filtros
   */
  list: (filters?: UsuariosFilters) => {
    const params = buildQueryParams(filters);
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/usuarios?${queryString}` : "/usuarios";
    return fetcher.get<UsuariosListResponse>(url);
  },

  /**
   * Obtiene un usuario por ID
   */
  getById: (id: number) => {
    return fetcher.get<Usuario>(`/usuarios/${id}`);
  },

  /**
   * Crea un nuevo usuario (técnico o coordinador)
   */
  create: (data: CreateUsuarioDTO) => {
    // Validaciones previas
    if (!data.username?.trim()) {
      throw new Error("El nombre de usuario es obligatorio");
    }
    if (data.username.length < 3 || data.username.length > 30) {
      throw new Error("El username debe tener entre 3 y 30 caracteres");
    }
    if (!data.password?.trim()) {
      throw new Error("La contraseña es obligatoria");
    }
    if (data.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
    if (!data.rol || !["tecnico", "coordinador"].includes(data.rol)) {
      throw new Error("El rol debe ser 'tecnico' o 'coordinador'");
    }

    console.log("👤 Creando usuario:", { username: data.username, rol: data.rol });
    return fetcher.post<Usuario>("/usuarios", data);
  },

  /**
   * Cambia la contraseña de un usuario
   * El coordinador puede cambiar la contraseña de cualquier usuario
   */
  changePassword: (id: number, data: ChangePasswordDTO) => {
    // Validación previa
    if (!data.newPassword?.trim()) {
      throw new Error("La nueva contraseña es obligatoria");
    }
    if (data.newPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // El backend puede esperar diferentes formatos:
    // Opción 1: { newPassword: "..." }
    // Opción 2: { password: "..." }
    // Opción 3: { contrasena: "..." }
    const payload = {
      newPassword: data.newPassword,
      password: data.newPassword, // Alias por si el backend usa este nombre
    };

    console.log("🔑 Cambiando contraseña del usuario:", id);
    console.log("📦 Payload completo:", JSON.stringify(payload, null, 2));
    console.log("🌐 URL:", `/usuarios/${id}/password`);
    return fetcher.patch<Usuario>(`/usuarios/${id}/password`, payload);
  },

  /**
   * Activa o desactiva un usuario
   * Un usuario desactivado no puede iniciar sesión
   */
  toggleActivo: (id: number, activo: boolean) => {
    const payload = { activo };
    console.log(`🔄 ${activo ? "Activando" : "Desactivando"} usuario:`, id, "Payload:", payload);
    return fetcher.patch<Usuario>(`/usuarios/${id}/activo`, payload);
  },

  /**
   * Elimina un usuario (soft delete recomendado en backend)
   */
  delete: (id: number) => {
    console.log("🗑️ Eliminando usuario:", id);
    return fetcher.delete(`/usuarios/${id}`);
  },
};
