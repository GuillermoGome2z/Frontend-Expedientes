import type { Rol } from "@/auth/auth.types";

/**
 * Usuario del sistema (técnico o coordinador)
 */
export interface Usuario {
  id: number;
  username: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Respuesta paginada de usuarios
 */
export interface UsuariosListResponse {
  data: Usuario[];
  total: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

/**
 * Filtros para listar usuarios
 */
export interface UsuariosFilters {
  page?: number;
  pageSize?: number;
  q?: string; // Búsqueda por username
  rol?: Rol;
  activo?: boolean;
}

/**
 * DTO para crear un usuario
 */
export interface CreateUsuarioDTO {
  username: string;
  password: string;
  rol: Rol;
}

/**
 * DTO para cambiar contraseña
 */
export interface ChangePasswordDTO {
  newPassword: string;
}

/**
 * DTO para activar/desactivar usuario
 */
export interface ToggleActivoDTO {
  activo: boolean;
}
