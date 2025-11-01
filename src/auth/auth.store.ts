import { create } from "zustand";
import type { AuthState, User } from "./auth.types";

const AUTH_STORAGE_KEY = "expedientes_auth";

interface AuthStore extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

// Load from localStorage
const loadAuthState = (): AuthState => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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
    saveAuthState(newState);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set(newState);
  },

  isAuthenticated: () => {
    const { token } = get();
    return token !== null && token !== "";
  },

  hasRole: (role: string) => {
    const { user } = get();
    return user?.rol === role;
  },
}));
