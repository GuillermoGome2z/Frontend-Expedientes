/**
 * Roles disponibles en el sistema
 */
export type Rol = "tecnico" | "coordinador";

/**
 * Usuario autenticado
 */
export interface User {
  id: number;
  username: string;
  rol: Rol;
}

/**
 * Respuesta del endpoint de login
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Credenciales para login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Estado de autenticación en el store
 */
export interface AuthState {
  token: string | null;
  user: User | null;
}
