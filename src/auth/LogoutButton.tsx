import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "./auth.store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate("/login");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut size={16} />
      Cerrar Sesión
    </Button>
  );
}
