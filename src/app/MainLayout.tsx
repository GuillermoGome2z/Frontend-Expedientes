import { Outlet, Link } from "react-router-dom";
import { FileText, LayoutDashboard, Users } from "lucide-react";
import { useAuthStore } from "@/auth/auth.store";
import { LogoutButton } from "@/auth/LogoutButton";
import { Button } from "@/components/ui/button";

export function MainLayout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🗂️</span>
              <span>Expedientes</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
              </Link>
              <Link to="/expedientes">
                <Button variant="ghost" size="sm">
                  <FileText size={16} />
                  Expedientes
                </Button>
              </Link>
              {user?.rol === "coordinador" && (
                <Link to="/usuarios">
                  <Button variant="ghost" size="sm">
                    <Users size={16} />
                    Usuarios
                  </Button>
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Hola, <span className="font-medium text-foreground">{user?.username}</span> 👋
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          Sistema de Gestión de Expedientes © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
