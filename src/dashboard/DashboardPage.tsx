import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, XCircle, Clock, Plus, Download } from "lucide-react";
import { useAuthStore } from "@/auth/auth.store";
import { expedientesApi } from "@/expedientes/expedientes.api";
import { Page } from "@/shared/ui/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { user } = useAuthStore();

  const { data: expedientes, isLoading } = useQuery({
    queryKey: ["expedientes", "dashboard"],
    queryFn: () => expedientesApi.list({ pageSize: 100 }),
  });

  const totalExpedientes = expedientes?.total || 0;
  const abiertos = expedientes?.data.filter((e) => e.estado === "Abierto").length || 0;
  const aprobados = expedientes?.data.filter((e) => e.estado === "Aprobado").length || 0;
  const rechazados = expedientes?.data.filter((e) => e.estado === "Rechazado").length || 0;
  const misExpedientes = user?.rol === "tecnico"
    ? expedientes?.data.filter((e) => e.tecnicoId === user.id).length || 0
    : 0;

  const stats = [
    {
      title: "Total de Expedientes",
      value: totalExpedientes,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Abiertos",
      value: abiertos,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Aprobados",
      value: aprobados,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Rechazados",
      value: rechazados,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  if (user?.rol === "tecnico") {
    stats.push({
      title: "Mis Expedientes",
      value: misExpedientes,
      icon: FileText,
      color: "text-purple-500",
    });
  }

  return (
    <Page
      title={`Hola, ${user?.username} 👋`}
      description="Bienvenido al Sistema de Gestión de Expedientes"
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to="/expedientes/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo Expediente
            </Button>
          </Link>
          <Link to="/expedientes">
            <Button variant="outline">
              <FileText size={16} />
              Ver Todos los Expedientes
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => expedientesApi.exportExcel()}
          >
            <Download size={16} />
            Exportar a Excel
          </Button>
        </CardContent>
      </Card>

      {/* Últimos Expedientes */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Expedientes Modificados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : expedientes && expedientes.data.length > 0 ? (
            <div className="space-y-3">
              {expedientes.data.slice(0, 5).map((exp) => (
                <Link
                  key={exp.id}
                  to={`/expedientes/${exp.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{exp.codigo} - {exp.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.tecnico?.username} · {new Date(exp.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        exp.estado === "Aprobado"
                          ? "bg-green-500/20 text-green-700"
                          : exp.estado === "Rechazado"
                          ? "bg-red-500/20 text-red-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {exp.estado}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay expedientes todavía
            </p>
          )}
        </CardContent>
      </Card>
    </Page>
  );
}
