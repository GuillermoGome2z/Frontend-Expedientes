export interface User {
  id: number;
  username: string;
  rol: "tecnico" | "coordinador";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
