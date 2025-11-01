import { fetcher } from "@/shared/fetcher";
import type { AuthResponse, LoginCredentials } from "./auth.types";

export const authApi = {
  login: (credentials: LoginCredentials) => 
    fetcher.post<AuthResponse>("/auth/login", credentials),
};
