import { create } from "zustand";
import type { AuthState, User, Rol } from "./auth.types";

const AUTH_STORAGE_KEY = "expedientes_auth";

/**
 * Store de autenticación con Zustand
 * Maneja el estado de autenticación y persistencia en localStorage
 */
interface AuthStore extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: Rol[]) => boolean;
}

// Load from localStorage
const loadAuthState = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validar que tenga la estructura correcta
      if (parsed && typeof parsed === "object" && "token" in parsed && "user" in parsed) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading auth state:", error);
  }
  return { token: null, user: null };
};

// Save to localStorage
const saveAuthState = (state: AuthState) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving auth state:", error);
  }
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...loadAuthState(),

  login: (token: string, user: User) => {
    const newState = { token, user };
    saveAuthState(newState);
    set(newState);
  },

  logout: () => {
    const newState = { token: null, user: null };
    // Limpiar localStorage
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set(newState);
    
    // Navegar a login (si estamos en el browser)
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  isAuthenticated: () => {
    const { token, user } = get();
    return token !== null && token !== "" && user !== null;
  },

  hasRole: (...roles: Rol[]) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.rol);
  },
}));
